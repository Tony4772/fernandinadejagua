/**
 * Backend de pagos de Fernandina de Jagua (Culqi API v2).
 *
 * Se exporta como factory para poder probarlo sin Firestore real ni credenciales.
 */
import { randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import express from 'express';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';

const CULQI_API = 'https://api.culqi.com/v2';
const CURRENCY = 'PEN';
const MIN_AMOUNT = 100; // S/ 1.00
const MAX_AMOUNT = 700000; // S/ 7,000.00
const YAPE_MAX_AMOUNT = 200000; // S/ 2,000.00 — límite Yape impuesto por Culqi
const MAX_ITEMS = 20;
const MAX_QTY_PER_ITEM = 20;
const ORDER_TTL_MS = 30 * 60 * 1000; // 30 minutos para pagar

const catalog = JSON.parse(readFileSync(new URL('./catalog.json', import.meta.url), 'utf8'));
export const PRODUCTS = new Map(catalog.products.map((product) => [product.id, product]));

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ||
  [
    'https://fernandina-de-jagua-web.web.app',
    'https://fernandina-de-jagua-web.firebaseapp.com',
    'http://localhost:3000',
    'http://localhost:5173',
  ].join(','))
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const cleanText = (value, maxLength) =>
  typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, maxLength) : '';

function validateCustomer(raw) {
  const customer = raw && typeof raw === 'object' ? raw : {};
  const name = cleanText(customer.name, 120);
  const email = cleanText(customer.email, 120).toLowerCase();
  const phone = cleanText(customer.phone, 20).replace(/[^\d+]/g, '');
  const address = cleanText(customer.address, 200);
  const district = cleanText(customer.district, 80);
  const notes = cleanText(customer.notes, 300);

  if (name.length < 3) throw new HttpError(400, 'Ingresa tu nombre completo.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    throw new HttpError(400, 'Ingresa un correo electrónico válido.');
  }
  if (phone.replace(/\D/g, '').length < 6) {
    throw new HttpError(400, 'Ingresa un teléfono de contacto válido.');
  }

  return { name, email, phone, address, district, notes };
}

/** Recalcula el pedido con los precios del servidor. */
export function buildOrderItems(rawItems, products = PRODUCTS) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new HttpError(400, 'El carrito está vacío.');
  }
  if (rawItems.length > MAX_ITEMS) {
    throw new HttpError(400, 'El pedido tiene demasiados productos distintos.');
  }

  const merged = new Map();
  for (const raw of rawItems) {
    const id = cleanText(raw?.id, 80);
    const quantity = Number(raw?.quantity);
    if (!id || !products.has(id)) {
      throw new HttpError(400, 'Uno de los productos del carrito ya no está disponible.');
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY_PER_ITEM) {
      throw new HttpError(400, `La cantidad por producto debe estar entre 1 y ${MAX_QTY_PER_ITEM}.`);
    }
    merged.set(id, Math.min((merged.get(id) ?? 0) + quantity, MAX_QTY_PER_ITEM));
  }

  const items = [...merged.entries()].map(([id, quantity]) => {
    const product = products.get(id);
    return {
      productId: product.id,
      name: product.name,
      quantity,
      unitAmount: product.amountInCents,
      subtotal: product.amountInCents * quantity,
    };
  });

  const amount = items.reduce((total, item) => total + item.subtotal, 0);
  if (amount < MIN_AMOUNT) throw new HttpError(400, 'El monto mínimo de compra es S/ 1.00.');
  if (amount > MAX_AMOUNT) {
    throw new HttpError(400, 'El monto supera el máximo permitido en línea. Escríbenos por WhatsApp.');
  }

  return { items, amount };
}

function newOrderNumber(date = new Date()) {
  const stamp = [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCDate()).padStart(2, '0'),
  ].join('');
  return `FJ-${stamp}-${randomBytes(3).toString('hex').toUpperCase()}`;
}

function keyMode(secretKey) {
  if (secretKey.startsWith('sk_live_')) return 'live';
  if (secretKey.startsWith('sk_test_')) return 'test';
  return 'desconocido';
}

async function culqiRequest(path, { method = 'GET', body, secretKey } = {}) {
  const response = await fetch(`${CULQI_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(20000),
  });

  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { raw: text };
  }

  return { ok: response.ok, status: response.status, payload };
}

function culqiErrorMessage(payload, { isYape = false } = {}) {
  if (!payload) return 'No pudimos procesar el pago.';
  const base =
    payload.user_message ||
    payload.merchant_message ||
    payload.message ||
    (isYape
      ? 'No pudimos procesar el pago con Yape. Verifica el código y vuelve a intentar.'
      : 'No pudimos procesar el pago. Revisa los datos de tu tarjeta.');
  return base;
}

function brandFromPayment(payload) {
  // Para Yape el source puede venir como { type: 'yape' } sin brand.
  if (payload?.source?.type === 'yape') return 'YAPE';
  return payload?.source?.brand ?? payload?.source?.iin?.card_brand ?? null;
}

export function isYapeToken(token) {
  return typeof token === 'string' && token.startsWith('ype_');
}

export function isValidPaymentToken(token) {
  return /^(tkn|ype)_(live|test)_[A-Za-z0-9]+$/.test(token);
}

export function getPaymentMethod(token) {
  if (isYapeToken(token)) return 'yape';
  return 'card';
}

export function createApp({ db, getSecret, getProducts = async () => PRODUCTS }) {
  const secret = (name) => {
    try {
      return getSecret(name) ?? '';
    } catch {
      return '';
    }
  };

  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '32kb' }));

  // La web llama a este backend por el rewrite de Hosting (/api/payments/**),
  // así que la petición es same-origin y CORS no interviene. Este middleware
  // solo cubre pruebas directas contra la URL de la función.
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      res.set('Access-Control-Allow-Origin', origin);
      res.set('Vary', 'Origin');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    }
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });

  // Límite simple en memoria por instancia (protección básica contra abuso).
  // Cada endpoint tiene su propio bucket para que los límites no se acumulen entre sí.
  const rateLimit = ({ max, windowMs }) => {
    const buckets = new Map();
    return (req, res, next) => {
      const ip = req.ip || req.headers['x-forwarded-for'] || 'desconocida';
      const now = Date.now();
      const recent = (buckets.get(ip) ?? []).filter((timestamp) => now - timestamp < windowMs);
      if (recent.length >= max) {
        res.status(429).json({
          error: 'rate_limited',
          message: 'Demasiados intentos. Espera un momento y vuelve a intentar.',
        });
        return;
      }
      recent.push(now);
      buckets.set(ip, recent);
      if (buckets.size > 5000) buckets.clear();
      next();
    };
  };

  const router = express.Router();

  router.get('/health', async (req, res, next) => {
    try {
      const secretKey = secret('CULQI_SECRET_KEY');
      const products = await getProducts();
      res.json({
        ok: true,
        service: 'fernandina-payments',
        currency: CURRENCY,
        mode: secretKey ? keyMode(secretKey) : 'sin_configurar',
        products: products.size,
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * Crea el pedido (estado `pending`) y devuelve el monto calculado en el
   * servidor, que es el que se pasa al checkout de Culqi.
   */
  router.post('/orders', rateLimit({ max: 15, windowMs: 10 * 60 * 1000 }), async (req, res, next) => {
    try {
      const customer = validateCustomer(req.body?.customer);

      // Verificación de horario comercial en zona horaria Lima
      try {
        const siteDoc = await db.collection('cms').doc('site').get();
        if (siteDoc.exists) {
          const schedule = siteDoc.data()?.schedule;
          if (schedule && schedule.enabled && schedule.blockOrdersWhenClosed) {
            const peruFormatter = new Intl.DateTimeFormat('en-US', {
              timeZone: 'America/Lima',
              hour12: false,
              weekday: 'short',
              hour: '2-digit',
              minute: '2-digit',
            });
            const parts = peruFormatter.formatToParts(new Date());
            const map = {};
            for (const p of parts) map[p.type] = p.value;
            const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
            const dayOfWeek = weekdayMap[map.weekday] ?? new Date().getDay();
            const timeString = `${map.hour.padStart(2, '0')}:${map.minute.padStart(2, '0')}`;
            const todayConfig = (schedule.days || []).find((d) => d.day === dayOfWeek);

            const isClosed =
              !todayConfig ||
              !todayConfig.enabled ||
              timeString < todayConfig.openTime ||
              timeString >= todayConfig.closeTime;

            if (isClosed) {
              throw new HttpError(
                400,
                schedule.closedNotice ||
                  'El atelier se encuentra cerrado en este momento. Los pedidos en línea están pausados temporalmente.'
              );
            }
          }
        }
      } catch (err) {
        if (err instanceof HttpError) throw err;
      }

      const products = await getProducts();
      const { items, amount } = buildOrderItems(req.body?.items, products);

      const reference = db.collection('orders').doc();
      const orderNumber = newOrderNumber();
      const now = Timestamp.now();
      const expiresAt = Timestamp.fromMillis(Date.now() + ORDER_TTL_MS);

      await reference.set({
        orderNumber,
        status: 'pending',
        source: 'web',
        currency: CURRENCY,
        amount,
        items,
        customer,
        charge: null,
        createdAt: now,
        updatedAt: now,
        expiresAt,
      });

      logger.info('Pedido creado', { orderId: reference.id, orderNumber, amount });

      res.status(201).json({
        orderId: reference.id,
        orderNumber,
        amount,
        currency: CURRENCY,
        expiresAt: expiresAt.toDate().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  });

  /** Cobra el pedido con el token generado por Culqi Checkout en el navegador. */
  router.post(
    '/orders/:orderId/pay',
    rateLimit({ max: 12, windowMs: 10 * 60 * 1000 }),
    async (req, res, next) => {
      const orderId = req.params.orderId;
      const token = cleanText(req.body?.token, 80);

      try {
        if (!isValidPaymentToken(token)) {
          throw new HttpError(400, 'El token de pago no es válido. Intenta nuevamente.');
        }

        // Yape tiene tope de S/ 2,000 por operación (regla Culqi/Yape)
        const paymentMethod = getPaymentMethod(token);

        const secretKey = secret('CULQI_SECRET_KEY');
        if (!secretKey) {
          throw new HttpError(503, 'Los pagos en línea no están configurados todavía.');
        }

        const orderRef = db.collection('orders').doc(orderId);

        // Reserva atómica: solo un intento puede cobrar el pedido.
        const order = await db.runTransaction(async (tx) => {
          const snapshot = await tx.get(orderRef);
          if (!snapshot.exists) throw new HttpError(404, 'El pedido no existe.');

          const data = snapshot.data();
          if (data.status === 'paid') {
            throw new HttpError(409, 'Este pedido ya fue pagado.', { orderNumber: data.orderNumber });
          }
          if (data.status !== 'pending') {
            throw new HttpError(409, 'Este pedido ya no se puede pagar. Crea uno nuevo.');
          }
          if (data.expiresAt?.toMillis && data.expiresAt.toMillis() < Date.now()) {
            throw new HttpError(409, 'El pedido expiró. Vuelve a intentarlo.');
          }

          tx.update(orderRef, {
            status: 'processing',
            updatedAt: Timestamp.now(),
            attempts: FieldValue.increment(1),
          });

          return data;
        });

        // Validación de límite Yape: debe hacerse tras conocer el monto del pedido
        if (paymentMethod === 'yape' && order.amount > YAPE_MAX_AMOUNT) {
          await orderRef.update({
            status: 'failed',
            updatedAt: Timestamp.now(),
            lastError: 'Monto excede límite Yape (S/ 2,000).',
          });
          throw new HttpError(
            400,
            'Yape permite un máximo de S/ 2,000 por operación. Reduce el carrito o paga con tarjeta.',
          );
        }

        const [firstName, ...rest] = order.customer.name.split(' ');
        const isYape = paymentMethod === 'yape';
        const chargeBody = {
          amount: order.amount,
          currency_code: order.currency ?? CURRENCY,
          email: order.customer.email,
          source_id: token,
          description: `Pedido ${order.orderNumber} - Fernandina de Jagua`,
          capture: true,
          antifraud_details: {
            first_name: firstName,
            last_name: rest.join(' ') || firstName,
            phone_number: order.customer.phone,
            address: order.customer.address || undefined,
            address_city: order.customer.district || 'Lima',
            country_code: 'PE',
          },
          metadata: {
            order_id: orderId,
            order_number: order.orderNumber,
            payment_method: paymentMethod,
          },
        };

        let charge;
        try {
          charge = await culqiRequest('/charges', { method: 'POST', body: chargeBody, secretKey });
        } catch (error) {
          await orderRef.update({
            status: 'pending',
            updatedAt: Timestamp.now(),
            lastError: 'No se pudo contactar a Culqi.',
          });
          logger.error('Error de red al crear el cargo', { orderId, error: error.message });
          throw new HttpError(502, 'No pudimos contactar a la pasarela de pagos. Intenta nuevamente.');
        }

        const payload = charge.payload ?? {};
        const approved =
          charge.ok &&
          (payload.outcome?.type === 'venta_exitosa' ||
            payload.status === 'paid' ||
            payload.paid === true);

        if (!approved) {
          const message = culqiErrorMessage(payload, { isYape });
          await orderRef.update({
            status: 'failed',
            updatedAt: Timestamp.now(),
            charge: {
              id: payload.id ?? null,
              approved: false,
              code: payload.outcome?.code ?? payload.code ?? null,
              declineCode: payload.decline_code ?? null,
              message,
              brand: brandFromPayment(payload),
              paymentMethod,
            },
          });
          logger.warn('Cargo rechazado', {
            orderId,
            paymentMethod,
            status: charge.status,
            code: payload.outcome?.code ?? payload.code ?? null,
            declineCode: payload.decline_code ?? null,
          });

          res.status(402).json({
            status: 'failed',
            orderNumber: order.orderNumber,
            message,
          });
          return;
        }

        await orderRef.update({
          status: 'paid',
          paidAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          charge: {
            id: payload.id,
            approved: true,
            amount: payload.amount,
            currency: payload.currency_code,
            brand: brandFromPayment(payload),
            paymentMethod,
            referenceCode: payload.reference_code ?? null,
            authorizationCode: payload.authorization_code ?? null,
            message: payload.outcome?.merchant_message ?? null,
          },
        });

        logger.info('Pago aprobado', {
          orderId,
          orderNumber: order.orderNumber,
          chargeId: payload.id,
          paymentMethod,
        });

        res.json({
          status: 'paid',
          orderNumber: order.orderNumber,
          amount: order.amount,
          currency: order.currency ?? CURRENCY,
          chargeId: payload.id,
          email: order.customer.email,
          message: 'Pago aprobado.',
        });
      } catch (error) {
        next(error);
      }
    },
  );

  /**
   * Webhook de Culqi (CulqiPanel → Eventos → Webhooks).
   * Eventos: charge.creation.succeeded y order.status.changed.
   *
   * Culqi no firma sus webhooks; si activas "Autenticación" en el panel llegan
   * credenciales Basic Auth que validamos aquí. Además siempre se re-consulta
   * el recurso en la API antes de marcar un pedido como pagado.
   */
  router.post('/webhooks/culqi', async (req, res) => {
    const expectedUser = secret('CULQI_WEBHOOK_USER');
    const expectedPass = secret('CULQI_WEBHOOK_PASS');

    if (expectedUser || expectedPass) {
      const header = req.headers.authorization ?? '';
      const [scheme, encoded] = header.split(' ');
      if (scheme !== 'Basic' || !encoded) {
        res.status(401).json({ error: 'unauthorized' });
        return;
      }
      const [user, ...passParts] = Buffer.from(encoded, 'base64').toString('utf8').split(':');
      if (user !== expectedUser || passParts.join(':') !== expectedPass) {
        logger.warn('Webhook con credenciales inválidas');
        res.status(401).json({ error: 'unauthorized' });
        return;
      }
    }

    const event = req.body ?? {};
    const eventType = typeof event.type === 'string' ? event.type : '';
    let data = event.data;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch {
        data = null;
      }
    }

    const resourceId = typeof data?.id === 'string' ? data.id : '';
    if (!eventType || !resourceId) {
      res.status(200).json({ received: true, ignored: 'evento sin datos utilizables' });
      return;
    }

    const secretKey = secret('CULQI_SECRET_KEY');
    if (!secretKey) {
      res.status(503).json({ error: 'payments_not_configured' });
      return;
    }

    try {
      if (eventType.startsWith('charge.')) {
        const { ok, payload } = await culqiRequest(`/charges/${resourceId}`, { secretKey });
        if (!ok) {
          // 503 para que Culqi reintente; el cuerpo del webhook no es la verdad.
          res.status(503).json({ error: 'culqi_unavailable' });
          return;
        }

        const orderId = payload?.metadata?.order_id;
        if (!orderId) {
          res.status(200).json({ received: true, ignored: 'cargo sin order_id' });
          return;
        }

        const orderRef = db.collection('orders').doc(orderId);
        const snapshot = await orderRef.get();
        if (!snapshot.exists) {
          res.status(200).json({ received: true, ignored: 'pedido desconocido' });
          return;
        }

        const order = snapshot.data();
        if (Number(payload.amount) !== Number(order.amount)) {
          logger.error('Monto del cargo no coincide con el pedido', {
            orderId,
            chargeAmount: payload.amount,
            orderAmount: order.amount,
          });
          res.status(200).json({ received: true, mismatch: true });
          return;
        }

        const alreadyPaid = order.status === 'paid';
        const approved =
          alreadyPaid ||
          eventType === 'charge.creation.succeeded' ||
          payload.outcome?.type === 'venta_exitosa' ||
          payload.status === 'paid';

        await orderRef.set(
          {
            status: approved ? 'paid' : 'failed',
            updatedAt: Timestamp.now(),
            ...(approved && !alreadyPaid ? { paidAt: Timestamp.now() } : {}),
            charge: {
              id: payload.id,
              approved,
              amount: payload.amount,
              currency: payload.currency_code,
              brand: brandFromPayment(payload),
              message: payload.outcome?.merchant_message ?? null,
            },
          },
          { merge: true },
        );

        res.status(200).json({ received: true });
        return;
      }

      if (eventType === 'order.status.changed') {
        const { ok, payload } = await culqiRequest(`/orders/${resourceId}`, { secretKey });
        if (!ok) {
          res.status(503).json({ error: 'culqi_unavailable' });
          return;
        }
        const orderId = payload?.metadata?.order_id;
        if (!orderId) {
          res.status(200).json({ received: true, ignored: 'orden sin order_id' });
          return;
        }
        await db
          .collection('orders')
          .doc(orderId)
          .set(
            {
              status: payload?.state === 'paid' ? 'paid' : payload?.state ?? 'pending',
              updatedAt: Timestamp.now(),
              culqiOrder: { id: payload.id, state: payload.state },
            },
            { merge: true },
          );
        res.status(200).json({ received: true });
        return;
      }

      res.status(200).json({ received: true, ignored: eventType });
    } catch (error) {
      logger.error('Error procesando webhook de Culqi', {
        error: error.message,
        eventType,
        resourceId,
      });
      res.status(500).json({ error: 'webhook_error' });
    }
  });

  /** Consulta acotada del estado de un pedido (requiere el email del pedido). */
  router.get('/orders/:orderId/status', async (req, res, next) => {
    try {
      const email = cleanText(req.query.email, 120).toLowerCase();
      if (!email) throw new HttpError(400, 'Falta el correo del pedido.');

      const snapshot = await db.collection('orders').doc(req.params.orderId).get();
      if (!snapshot.exists) throw new HttpError(404, 'El pedido no existe.');

      const order = snapshot.data();
      if (order.customer?.email !== email) throw new HttpError(404, 'El pedido no existe.');

      res.json({
        orderNumber: order.orderNumber,
        status: order.status,
        amount: order.amount,
        currency: order.currency,
      });
    } catch (error) {
      next(error);
    }
  });

  // Hosting reescribe /api/payments/** hacia esta función conservando la ruta,
  // por eso el router se monta en ambos prefijos.
  app.use('/api/payments', router);
  app.use('/', router);

  app.use((req, res) => {
    res.status(404).json({ error: 'not_found', message: 'Ruta no encontrada.' });
  });

  app.use((error, req, res, next) => {
    if (res.headersSent) {
      next(error);
      return;
    }
    const status = error instanceof HttpError ? error.status : 500;
    if (status >= 500) {
      logger.error('Error no controlado en payments', { message: error.message, stack: error.stack });
    }
    res.status(status).json({
      error: status === 500 ? 'internal_error' : 'request_error',
      message:
        status === 500
          ? 'Ocurrió un error procesando el pago. Intenta nuevamente o escríbenos por WhatsApp.'
          : error.message,
      ...(error.details ? { details: error.details } : {}),
    });
  });

  return app;
}
