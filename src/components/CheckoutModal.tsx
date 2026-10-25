import React, { useEffect, useState } from 'react';
import { BrandConfig } from '../types';
import { CULQI_PUBLIC_KEY, isCulqiConfigured, isCulqiTestMode, YAPE_MAX_AMOUNT_CENTS } from '../config';
import { CartItem, cartTotal, formatSoles, toCents } from '../lib/cart';
import { createOrder, payOrder, PaymentApiError } from '../lib/api';
import { openCulqiCheckout, CulqiPaymentMethod, isYapeToken } from '../lib/culqi';

interface CheckoutModalProps {
  isOpen: boolean;
  items: CartItem[];
  brand: BrandConfig;
  onClose: () => void;
  onPaid: (orderNumber: string) => void;
}

type Step = 'form' | 'paying' | 'paid' | 'error';
type PaymentMethod = CulqiPaymentMethod;

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  notes: string;
}

const EMPTY_FORM: CustomerForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  district: '',
  notes: '',
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  items,
  brand,
  onClose,
  onPaid,
}) => {
  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState<CustomerForm>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('');
  const [paidInfo, setPaidInfo] = useState<{ orderNumber: string; amount: number; method?: PaymentMethod } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  const total = cartTotal(items);
  const totalCents = toCents(total);
  const isYapeExceedsLimit = totalCents > YAPE_MAX_AMOUNT_CENTS;
  const isYapeDisabled = isYapeExceedsLimit;

  useEffect(() => {
    if (!isOpen) {
      setStep('form');
      setError(null);
      setStatusText('');
      setPaidInfo(null);
      // Reset a tarjeta si Yape excede límite al abrir
      setPaymentMethod(isYapeExceedsLimit ? 'card' : 'card');
    }
  }, [isOpen, isYapeExceedsLimit]);

  // Si el total cambia y supera límite, forzar tarjeta
  useEffect(() => {
    if (isYapeExceedsLimit && paymentMethod === 'yape') {
      setPaymentMethod('card');
    }
  }, [isYapeExceedsLimit, paymentMethod]);

  if (!isOpen) return null;

  const update = (field: keyof CustomerForm) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const validate = (): string | null => {
    if (form.name.trim().length < 3) return 'Ingresa tu nombre completo.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) return 'Ingresa un correo electrónico válido.';
    if (form.phone.replace(/\D/g, '').length < 6) return 'Ingresa un teléfono de contacto válido.';
    if (items.length === 0) return 'Tu carrito está vacío.';
    if (paymentMethod === 'yape' && isYapeExceedsLimit) {
      return 'Yape permite máximo S/ 2,000 por operación. Reduce tu carrito o paga con tarjeta.';
    }
    return null;
  };

  const handlePay = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!isCulqiConfigured) {
      setError('El pago en línea aún no está configurado. Escríbenos por WhatsApp para completar tu pedido.');
      return;
    }

    setError(null);
    setStep('paying');
    setStatusText(
      paymentMethod === 'yape'
        ? 'Abriendo Yape… ingresa tu celular y código de aprobación'
        : 'Preparando tu pedido…',
    );

    const [firstName, ...rest] = form.name.trim().split(' ');
    const lastName = rest.join(' ');

    try {
      // El monto definitivo lo calcula el servidor con su catálogo.
      const order = await createOrder(items, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        district: form.district.trim(),
        notes: form.notes.trim(),
      });

      setStatusText(
        paymentMethod === 'yape'
          ? 'Completa el pago en la ventana de Yape (código de 6 dígitos)…'
          : 'Completa el pago en la ventana de Culqi…',
      );

      await openCulqiCheckout({
        publicKey: CULQI_PUBLIC_KEY,
        amountInCents: order.amount,
        title: 'Fernandina de Jagua',
        email: form.email.trim(),
        firstName,
        lastName: lastName || firstName,
        preferredMethod: paymentMethod,
        onToken: async (tokenId) => {
          const method: PaymentMethod = isYapeToken(tokenId) ? 'yape' : 'card';
          setStatusText(
            method === 'yape' ? 'Confirmando pago con Yape…' : 'Confirmando tu pago…',
          );
          try {
            const paid = await payOrder(order.orderId, tokenId);
            setPaidInfo({ orderNumber: paid.orderNumber, amount: paid.amount, method });
            setStep('paid');
            onPaid(paid.orderNumber);
          } catch (paymentError) {
            setError(
              paymentError instanceof PaymentApiError
                ? paymentError.message
                : 'No pudimos confirmar el pago. Escríbenos por WhatsApp antes de reintentar.',
            );
            setStep('error');
          }
        },
        onError: (message) => {
          setError(message);
          setStep('error');
        },
      });
    } catch (checkoutError) {
      setError(
        checkoutError instanceof PaymentApiError
          ? checkoutError.message
          : checkoutError instanceof Error
            ? checkoutError.message
            : 'No se pudo iniciar el pago. Intenta nuevamente.',
      );
      setStep('error');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] bg-primary-container/70 backdrop-blur-sm flex items-center justify-center p-margin overflow-y-auto"
      onClick={(event) => {
        if (event.target === event.currentTarget && step !== 'paying') onClose();
      }}
    >
      <div className="bg-surface-container-lowest max-w-lg w-full rounded-xl shadow-2xl overflow-hidden my-auto border border-surface-container-high max-h-[95vh] flex flex-col">
        <header className="bg-primary-container text-surface-bright px-space-md py-space-sm flex items-center justify-between border-b border-[#3b2721] shrink-0">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-secondary-fixed text-[20px]">
              {step === 'paid' ? 'check_circle' : 'lock'}
            </span>
            <h2 className="font-headline-sm text-headline-sm">
              {step === 'paid' ? 'Pago confirmado' : 'Pago en línea'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={step === 'paying'}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </header>

        <div className="overflow-y-auto">
          {step === 'paid' && paidInfo ? (
            <div className="p-space-lg flex flex-col items-center text-center gap-space-sm">
              <div className="w-14 h-14 rounded-full bg-secondary/15 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-[32px]">check_circle</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-primary-fixed">¡Gracias por tu compra!</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Tu pago de <strong>{formatSoles(paidInfo.amount / 100)}</strong> fue aprobado
                {paidInfo.method === 'yape' ? ' con Yape.' : '.'}
              </p>
              <div className="w-full mt-space-xs p-space-sm rounded-lg bg-surface-container text-left">
                <div className="flex items-center justify-between gap-space-sm">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Número de pedido
                  </span>
                  <span className="font-title-md text-title-md text-on-primary-fixed">{paidInfo.orderNumber}</span>
                </div>
                <div className="flex items-center justify-between gap-space-sm mt-1">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Enviado a
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface truncate">{form.email}</span>
                </div>
                {paidInfo.method && (
                  <div className="flex items-center justify-between gap-space-sm mt-1">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                      Método
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        {paidInfo.method === 'yape' ? 'phone_iphone' : 'credit_card'}
                      </span>
                      {paidInfo.method === 'yape' ? 'Yape' : 'Tarjeta'}
                    </span>
                  </div>
                )}
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Te contactaremos para coordinar la entrega. También puedes escribirnos con tu número de pedido.
              </p>
              <div className="w-full flex flex-col sm:flex-row gap-space-xs mt-space-xs">
                <a
                  className="flex-1 inline-flex items-center justify-center gap-space-xs px-space-md py-space-xs rounded-lg bg-secondary text-on-secondary hover:bg-on-tertiary-container font-label-md text-label-md uppercase tracking-wider transition-colors"
                  href={`${brand.whatsappUrl}?text=${encodeURIComponent(
                    `Hola, acabo de pagar el pedido ${paidInfo.orderNumber}. Quisiera coordinar la entrega.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  Coordinar entrega
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-space-md py-space-xs rounded-lg border border-surface-container-high font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-on-primary-fixed transition-colors cursor-pointer"
                >
                  Seguir comprando
                </button>
              </div>
            </div>
          ) : step === 'paying' ? (
            <div className="p-space-lg flex flex-col items-center text-center gap-space-sm">
              <span className="material-symbols-outlined text-secondary text-[40px] animate-pulse">
                {paymentMethod === 'yape' ? 'phone_iphone' : 'credit_card'}
              </span>
              <h3 className="font-title-md text-title-md text-on-primary-fixed">
                {paymentMethod === 'yape' ? 'Procesando pago con Yape' : 'Procesando tu pago'}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">{statusText}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {paymentMethod === 'yape'
                  ? 'Ingresa tu número y el código de aprobación de 6 dígitos desde la ventana de Culqi. El código vence en 2 min.'
                  : 'No cierres esta ventana. Si la ventana de Culqi se cerró, puedes volver e intentarlo de nuevo.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setStep('form');
                  setError(null);
                }}
                className="mt-space-xs px-space-md py-space-xs rounded-lg border border-surface-container-high font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-on-primary-fixed transition-colors cursor-pointer"
              >
                Volver
              </button>
            </div>
          ) : (
            <form onSubmit={handlePay} className="p-space-md flex flex-col gap-space-sm">
              <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Total a pagar
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-primary-fixed font-bold">
                    {formatSoles(total)}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    {items.reduce((sum, item) => sum + item.quantity, 0)} artículo(s)
                  </span>
                  {isCulqiTestMode && (
                    <span className="text-[11px] font-label-md uppercase tracking-wider text-error">
                      Modo de prueba
                    </span>
                  )}
                </div>
              </div>

              {error && (
                <div className="flex flex-col gap-space-xs p-space-sm rounded-lg bg-error-container/60 text-on-error-container">
                  <div className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-[18px] mt-0.5 shrink-0">error</span>
                    <p className="font-body-sm text-body-sm">{error}</p>
                  </div>
                  <a
                    href={`${brand.whatsappUrl}?text=${encodeURIComponent(
                      `Hola, quisiera completar este pedido:\n${items
                        .map((item) => `• ${item.quantity} × ${item.name}`)
                        .join('\n')}\nTotal: ${formatSoles(total)}`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-space-sm py-1.5 rounded-lg bg-secondary text-on-secondary font-label-md text-[12px] uppercase tracking-wider hover:bg-on-tertiary-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">chat</span>
                    Pedir este carrito por WhatsApp
                  </a>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs">
                <label className="flex flex-col gap-1 sm:col-span-2">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Nombre completo *
                  </span>
                  <input
                    required
                    value={form.name}
                    onChange={update('name')}
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container-high text-on-surface text-sm focus:outline-none focus:border-secondary"
                    autoComplete="name"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Correo *
                  </span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container-high text-on-surface text-sm focus:outline-none focus:border-secondary"
                    autoComplete="email"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Teléfono / WhatsApp *
                  </span>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={update('phone')}
                    placeholder="999 999 999"
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container-high text-on-surface text-sm focus:outline-none focus:border-secondary"
                    autoComplete="tel"
                  />
                </label>

                <label className="flex flex-col gap-1 sm:col-span-2">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Dirección de entrega (opcional)
                  </span>
                  <input
                    value={form.address}
                    onChange={update('address')}
                    placeholder="Av. / Calle, número, referencia"
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container-high text-on-surface text-sm focus:outline-none focus:border-secondary"
                    autoComplete="street-address"
                  />
                </label>

                <label className="flex flex-col gap-1 sm:col-span-2">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Distrito (opcional)
                  </span>
                  <input
                    value={form.district}
                    onChange={update('district')}
                    placeholder="San Miguel, Lima"
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container-high text-on-surface text-sm focus:outline-none focus:border-secondary"
                  />
                </label>

                <label className="flex flex-col gap-1 sm:col-span-2">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Notas del pedido (opcional)
                  </span>
                  <textarea
                    value={form.notes}
                    onChange={update('notes')}
                    rows={2}
                    placeholder="Mensaje para regalo, horario de entrega, etc."
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container-high text-on-surface text-sm focus:outline-none focus:border-secondary resize-none"
                  />
                </label>
              </div>

              {/* Selector de método de pago */}
              <div className="flex flex-col gap-2">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Método de pago *
                </span>
                <div className="grid grid-cols-2 gap-space-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-secondary bg-secondary/10 text-on-primary-fixed'
                        : 'border-surface-container-high bg-surface-container-low text-on-surface-variant hover:border-surface-container-high/80'
                    }`}
                    aria-pressed={paymentMethod === 'card'}
                  >
                    <span className="material-symbols-outlined text-[24px]">credit_card</span>
                    <span className="font-label-md text-label-md font-semibold">Tarjeta</span>
                    <span className="font-body-sm text-body-sm text-center leading-tight opacity-80">
                      Crédito / Débito
                    </span>
                    {paymentMethod === 'card' && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-secondary text-[14px]">check</span>
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => !isYapeDisabled && setPaymentMethod('yape')}
                    disabled={isYapeDisabled}
                    className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                      isYapeDisabled
                        ? 'border-surface-container-high bg-surface-container/50 text-on-surface-variant/50 cursor-not-allowed opacity-60'
                        : paymentMethod === 'yape'
                          ? 'border-[#742384] bg-[#742384]/10 text-[#742384]'
                          : 'border-surface-container-high bg-surface-container-low text-on-surface-variant hover:border-surface-container-high/80 cursor-pointer'
                    }`}
                    aria-pressed={paymentMethod === 'yape'}
                    title={isYapeDisabled ? 'Monto excede S/ 2,000 — usa tarjeta' : undefined}
                  >
                    <span className="material-symbols-outlined text-[24px]">phone_iphone</span>
                    <span className="font-label-md text-label-md font-semibold flex items-center gap-1">
                      Yape
                      <span className="text-[10px] bg-[#742384] text-white px-1 py-0.5 rounded font-bold">YAPE</span>
                    </span>
                    <span className="font-body-sm text-body-sm text-center leading-tight opacity-80">
                      Hasta S/ 2,000
                    </span>
                    {paymentMethod === 'yape' && !isYapeDisabled && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#742384] flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-[14px]">check</span>
                      </span>
                    )}
                  </button>
                </div>

                {isYapeDisabled && paymentMethod === 'card' && totalCents > 0 && (
                  <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container px-3 py-2 rounded-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    Yape disponible hasta S/ 2,000. Tu total es {formatSoles(total)} — usa tarjeta o reduce el carrito para Yape.
                  </p>
                )}

                {paymentMethod === 'yape' && !isYapeDisabled && (
                  <div className="p-3 rounded-xl bg-[#742384]/5 border border-[#742384]/20 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#742384] text-[18px]">phone_iphone</span>
                      <span className="font-label-md text-label-md font-semibold text-[#742384]">
                        Pagar con Yape
                      </span>
                      <span className="ml-auto text-[10px] font-bold bg-[#742384] text-white px-1.5 py-0.5 rounded">
                        RÁPIDO
                      </span>
                    </div>
                    <ol className="font-body-sm text-body-sm text-on-surface-variant list-decimal list-inside space-y-1 marker:text-[#742384]">
                      <li>Se abrirá la ventana segura de Culqi</li>
                      <li>Ingresa tu número Yape (9 dígitos)</li>
                      <li>
                        Abre tu app Yape → <strong>Menú ☰ → Código de aprobación</strong> → copia el código de 6
                        dígitos
                      </li>
                      <li>Pega el código y confirma</li>
                    </ol>
                    <p className="font-body-sm text-body-sm text-on-surface-variant flex items-start gap-1.5 bg-white/60 p-2 rounded-lg border border-[#742384]/10">
                      <span className="material-symbols-outlined text-[14px] mt-0.5 text-[#742384]">schedule</span>
                      El código vence en 2 min. Solo soles · Máx. S/ 2,000 por operación. No guardamos tu número Yape.
                    </p>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="p-3 rounded-xl bg-surface-container border border-surface-container-high flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[18px]">credit_card</span>
                      <span className="font-label-md text-label-md font-semibold text-on-primary-fixed">
                        Tarjeta crédito / débito
                      </span>
                      <span className="ml-auto flex items-center gap-1 text-[10px] font-bold">
                        <span className="bg-on-primary-fixed text-surface-bright px-1.5 py-0.5 rounded">VISA</span>
                        <span className="bg-[#EB001B] text-white px-1.5 py-0.5 rounded">MC</span>
                        <span className="bg-[#006FCF] text-white px-1.5 py-0.5 rounded">AMEX</span>
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Aceptamos Visa, Mastercard, Amex y Diners. Pago 100% seguro vía Culqi — no almacenamos datos de tu
                      tarjeta.
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={paymentMethod === 'yape' && isYapeDisabled}
                className={`w-full inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-lg font-label-md text-label-md uppercase tracking-wider transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  paymentMethod === 'yape'
                    ? 'bg-[#742384] text-white hover:bg-[#5a1c66]'
                    : 'bg-secondary text-on-secondary hover:bg-on-tertiary-container hover:text-on-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {paymentMethod === 'yape' ? 'phone_iphone' : 'credit_card'}
                </span>
                <span>
                  {paymentMethod === 'yape' ? 'Pagar' : 'Pagar'} {formatSoles(total)}{' '}
                  con {paymentMethod === 'yape' ? 'Yape' : 'Culqi'}
                </span>
              </button>

              <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
                Pago seguro con Culqi ·{' '}
                {paymentMethod === 'yape' ? 'Yape hasta S/ 2,000 · Código de aprobación de 6 dígitos' : 'Tarjeta y Yape'}
                {' · '}No almacenamos datos sensibles.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
