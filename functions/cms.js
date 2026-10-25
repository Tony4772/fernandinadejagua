import express from 'express';
import { getFirestore } from 'firebase-admin/firestore';

const router = express.Router();
router.use(express.json({ limit: '3mb' }));

const siteRef = () => getFirestore().collection('cms').doc('site');

function getAdminPassword(getSecret) {
  try {
    return String(getSecret('CMS_ADMIN_PASSWORD') || '').trim();
  } catch {
    return '';
  }
}

function isAuthorized(req, getSecret) {
  const configured = getAdminPassword(getSecret);
  const provided = String(req.header('x-cms-password') || '').trim();
  return Boolean(configured && provided && configured === provided);
}

const LEGACY_ORDER_COPY = {
  howToOrderOverline: ['Modalidad Directa', 'Compra en línea'],
  howToOrderTitle: ['Cómo Realizar tu Pedido', 'Elige, paga y coordina'],
  howToOrderDesc: [
    'Atención directa y personalizada para tus pedidos y reservas. Sin intermediarios ni procesos engorrosos.',
    'Compra directamente desde el catálogo de esta web, paga con tarjeta o Yape mediante Culqi y luego coordinamos contigo el envío o recojo.',
  ],
};

function normalizeLegacyOrderCopy(data) {
  if (!data || typeof data !== 'object') return data;
  const home = { ...(data.home || {}) };
  for (const [field, [oldText, newText]] of Object.entries(LEGACY_ORDER_COPY)) {
    if (home[field] === oldText) home[field] = newText;
  }
  return { ...data, home };
}

export function createCmsApp({ getSecret }) {
  router.get('/site', async (_req, res) => {
    res.set('Cache-Control', 'no-store, max-age=0');
    try {
      const snapshot = await siteRef().get();
      if (!snapshot.exists) {
        return res.status(404).json({ success: false, error: 'El CMS todavía no tiene datos compartidos.' });
      }
      return res.status(200).json({ success: true, data: normalizeLegacyOrderCopy(snapshot.data()) });
    } catch (error) {
      console.error('Error leyendo CMS:', error);
      return res.status(503).json({ success: false, error: 'No se pudo cargar el catálogo compartido.' });
    }
  });

  router.post('/auth', (req, res) => {
    const password = String(req.body?.password || '').trim();
    const configured = getAdminPassword(getSecret);
    if (!configured || password !== configured) {
      return res.status(401).json({ success: false, error: 'Contraseña administrativa incorrecta.' });
    }
    return res.status(200).json({ success: true });
  });

  router.put('/site', async (req, res) => {
    if (!isAuthorized(req, getSecret)) {
      return res.status(401).json({ success: false, error: 'No autorizado para modificar el CMS.' });
    }

    const data = req.body?.data;
    if (!data || !data.brand || !Array.isArray(data.products)) {
      return res.status(400).json({ success: false, error: 'La estructura del catálogo no es válida.' });
    }

    try {
      await siteRef().set({ ...data, updatedAt: new Date().toISOString() });
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error guardando CMS:', error);
      return res.status(503).json({ success: false, error: 'No se pudo guardar el catálogo compartido.' });
    }
  });

  router.post('/reclamaciones', async (req, res) => {
    try {
      const { consumidor, reclamo, proveedor } = req.body || {};
      if (!consumidor || !reclamo) {
        return res.status(400).json({ success: false, error: 'Faltan datos del reclamo.' });
      }

      const nombre = String(consumidor.nombreCompleto || '').trim();
      const numDoc = String(consumidor.numeroDocumento || '').trim();
      const tipoDoc = String(consumidor.tipoDocumento || 'DNI').trim();
      const email = String(consumidor.email || '').trim().toLowerCase();
      const telefono = String(consumidor.telefono || '').trim();

      const tipo = String(reclamo.tipo || 'reclamo').trim().toLowerCase();
      const descripcionBien = String(reclamo.descripcionBien || '').trim();
      const descripcionProblema = String(reclamo.descripcionProblema || '').trim();
      const pedidoSolicitado = String(reclamo.pedidoSolicitado || '').trim();
      const montoReclamado = reclamo.montoReclamado ? Number(reclamo.montoReclamado) : null;

      if (!nombre || nombre.length < 3) {
        return res.status(400).json({ success: false, error: 'Ingresa tu nombre completo.' });
      }
      if (!numDoc) {
        return res.status(400).json({ success: false, error: 'Ingresa tu número de documento.' });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        return res.status(400).json({ success: false, error: 'Ingresa un correo electrónico válido.' });
      }
      if (!telefono || telefono.length < 6) {
        return res.status(400).json({ success: false, error: 'Ingresa un número de contacto válido.' });
      }
      if (!descripcionBien) {
        return res.status(400).json({ success: false, error: 'Describe el producto o servicio contratado.' });
      }
      if (!descripcionProblema) {
        return res.status(400).json({ success: false, error: 'Describe el detalle del reclamo o queja.' });
      }
      if (!pedidoSolicitado) {
        return res.status(400).json({ success: false, error: 'Ingresa la acción o solución solicitada.' });
      }

      const prefix = tipo === 'queja' ? 'QUE' : 'REC';
      const now = new Date();
      const stamp = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0'),
      ].join('');
      const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
      const codigo = `${prefix}-${stamp}-${rand}`;

      const db = getFirestore();
      await db.collection('reclamaciones').doc(codigo).set({
        codigo,
        fecha: now.toISOString(),
        estado: 'pendiente',
        proveedor: {
          razonSocial: proveedor?.razonSocial || 'EBYZOM E.I.R.L.',
          ruc: proveedor?.ruc || '00000000000',
        },
        consumidor: {
          nombreCompleto: nombre,
          tipoDocumento: tipoDoc,
          numeroDocumento: numDoc,
          telefono,
          email,
        },
        reclamo: {
          tipo,
          descripcionBien,
          descripcionProblema,
          montoReclamado,
          pedidoSolicitado,
        },
      });

      return res.status(201).json({ success: true, codigo });
    } catch (error) {
      console.error('Error registrando reclamo:', error);
      return res.status(500).json({ success: false, error: 'Error interno registrando la reclamación.' });
    }
  });

  const app = express();
  app.use(express.json({ limit: '3mb' }));
  // Firebase Hosting conserva el prefijo del rewrite al invocar la función.
  app.use('/api/cms', router);
  // La ruta directa de la Cloud Function también queda disponible para diagnóstico.
  app.use('/', router);
  return app;
}
