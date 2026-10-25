import React, { useState } from 'react';
import { BrandConfig } from '../types';

interface ReclamacionesModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: BrandConfig;
}

type TipoReclamo = 'reclamo' | 'queja';

interface FormData {
  nombreCompleto: string;
  tipoDocumento: 'DNI' | 'RUC' | 'CE';
  numeroDocumento: string;
  telefono: string;
  email: string;
  tipoReclamo: TipoReclamo;
  descripcionBien: string;
  descripcionProblema: string;
  montoReclamado: string;
  pedidoSolicitado: string;
}

const EMPTY_FORM: FormData = {
  nombreCompleto: '',
  tipoDocumento: 'DNI',
  numeroDocumento: '',
  telefono: '',
  email: '',
  tipoReclamo: 'reclamo',
  descripcionBien: '',
  descripcionProblema: '',
  montoReclamado: '',
  pedidoSolicitado: '',
};

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export const ReclamacionesModal: React.FC<ReclamacionesModalProps> = ({
  isOpen,
  onClose,
  brand,
}) => {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [codigoReclamo, setCodigoReclamo] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/cms/reclamaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proveedor: {
            ruc: brand.ruc || '00000000000',
            razonSocial: brand.companyName,
          },
          consumidor: {
            nombreCompleto: form.nombreCompleto,
            tipoDocumento: form.tipoDocumento,
            numeroDocumento: form.numeroDocumento,
            telefono: form.telefono,
            email: form.email,
          },
          reclamo: {
            tipo: form.tipoReclamo,
            descripcionBien: form.descripcionBien,
            descripcionProblema: form.descripcionProblema,
            montoReclamado: form.montoReclamado ? parseFloat(form.montoReclamado) : null,
            pedidoSolicitado: form.pedidoSolicitado,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'No se pudo registrar el reclamo.');
      }
      setCodigoReclamo(json.codigo || '');
      setSubmitState('success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al enviar el reclamo.';
      setErrorMsg(msg);
      setSubmitState('error');
    }
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setSubmitState('idle');
    setCodigoReclamo('');
    setErrorMsg('');
    onClose();
  };

  const inputCls =
    'w-full px-3 py-2.5 rounded-lg bg-[#1e0f0a] border border-[#5c3d2e] text-surface-bright font-body-sm text-body-sm placeholder:text-primary-fixed-dim focus:outline-none focus:border-secondary-fixed focus:ring-1 focus:ring-secondary-fixed/30 transition-colors';
  const labelCls = 'block font-label-sm text-label-sm text-on-tertiary-container uppercase tracking-wider mb-1';

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Libro de Reclamaciones"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-primary-container border border-[#5c3d2e] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-primary-container border-b border-[#3a2620] px-6 py-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* INDECOPI-style book icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#b91c1c] flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-white text-[20px]">menu_book</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-surface-bright leading-tight">
                Libro de Reclamaciones
              </h2>
              <p className="font-label-sm text-label-sm text-on-tertiary-container mt-0.5">
                {brand.companyName} · {brand.ruc ? `RUC ${brand.ruc}` : 'EBYZOM E.I.R.L.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 rounded-full w-8 h-8 flex items-center justify-center text-primary-fixed-dim hover:text-surface-bright hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Legal notice */}
        <div className="mx-6 mt-4 px-4 py-3 rounded-xl bg-[#b91c1c]/15 border border-[#b91c1c]/30 flex gap-3">
          <span className="material-symbols-outlined text-[#f87171] text-[18px] flex-shrink-0 mt-0.5">info</span>
          <p className="font-body-sm text-body-sm text-primary-fixed-dim leading-relaxed">
            De acuerdo a la{' '}
            <span className="text-surface-bright font-medium">Ley N° 29571</span> (Código de
            Protección y Defensa del Consumidor), tienes derecho a registrar tu reclamo o queja.
            Tienes un plazo máximo de{' '}
            <span className="text-surface-bright font-medium">30 días calendario</span> para
            recibirla respuesta del proveedor.
          </p>
        </div>

        {submitState === 'success' ? (
          /* Success screen */
          <div className="px-6 py-10 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-900/40 border border-emerald-500/40 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-400 text-[36px]">check_circle</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-surface-bright">
              Reclamo Registrado
            </h3>
            {codigoReclamo && (
              <div className="px-5 py-3 rounded-xl bg-[#1e0f0a] border border-secondary-fixed/30">
                <p className="font-label-sm text-label-sm text-on-tertiary-container uppercase tracking-wider">
                  Código de referencia
                </p>
                <p className="font-headline-sm text-headline-sm text-secondary-fixed mt-1">
                  {codigoReclamo}
                </p>
              </div>
            )}
            <p className="font-body-sm text-body-sm text-primary-fixed-dim max-w-md leading-relaxed">
              Hemos registrado tu {form.tipoReclamo}. Una constancia de recepción será enviada al
              correo <span className="text-surface-bright">{form.email}</span> en breve.
              Recibirás nuestra respuesta en un plazo máximo de{' '}
              <span className="text-surface-bright font-medium">30 días calendario</span>.
            </p>
            <button
              onClick={handleClose}
              className="mt-2 px-8 py-2.5 rounded-full bg-secondary text-on-secondary font-label-md text-label-md uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5" noValidate>
            {/* Tipo de reclamo */}
            <div>
              <p className={labelCls}>Tipo de solicitud *</p>
              <div className="flex gap-3">
                {(['reclamo', 'queja'] as TipoReclamo[]).map((tipo) => (
                  <label
                    key={tipo}
                    className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-colors"
                    style={{
                      borderColor:
                        form.tipoReclamo === tipo ? 'var(--color-secondary-fixed)' : '#5c3d2e',
                      background:
                        form.tipoReclamo === tipo ? 'rgba(var(--color-secondary-fixed-rgb,180,143,80),0.12)' : 'transparent',
                    }}
                  >
                    <input
                      type="radio"
                      name="tipoReclamo"
                      value={tipo}
                      checked={form.tipoReclamo === tipo}
                      onChange={handleChange}
                      className="accent-[#b4905f]"
                    />
                    <div>
                      <p className="font-label-md text-label-md text-surface-bright capitalize">
                        {tipo}
                      </p>
                      <p className="font-body-sm text-body-sm text-primary-fixed-dim text-[11px]">
                        {tipo === 'reclamo'
                          ? 'Disconformidad con el producto o servicio'
                          : 'Malestar sin disconformidad económica'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Datos del consumidor */}
            <div>
              <p className="font-label-md text-label-md text-on-tertiary-container uppercase tracking-wider mb-3 pb-1.5 border-b border-[#3a2620]">
                Datos del Consumidor
              </p>
              <div className="flex flex-col gap-3">
                <div>
                  <label className={labelCls} htmlFor="nombreCompleto">
                    Nombre completo *
                  </label>
                  <input
                    id="nombreCompleto"
                    name="nombreCompleto"
                    type="text"
                    className={inputCls}
                    placeholder="Ingresa tu nombre completo"
                    value={form.nombreCompleto}
                    onChange={handleChange}
                    required
                    maxLength={120}
                  />
                </div>
                <div className="flex gap-3">
                  <div className="w-32 flex-shrink-0">
                    <label className={labelCls} htmlFor="tipoDocumento">
                      Tipo Doc.
                    </label>
                    <select
                      id="tipoDocumento"
                      name="tipoDocumento"
                      className={inputCls}
                      value={form.tipoDocumento}
                      onChange={handleChange}
                    >
                      <option value="DNI">DNI</option>
                      <option value="RUC">RUC</option>
                      <option value="CE">C.E.</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className={labelCls} htmlFor="numeroDocumento">
                      Número de documento *
                    </label>
                    <input
                      id="numeroDocumento"
                      name="numeroDocumento"
                      type="text"
                      className={inputCls}
                      placeholder="Ej.: 12345678"
                      value={form.numeroDocumento}
                      onChange={handleChange}
                      required
                      maxLength={20}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls} htmlFor="telefono">
                      Teléfono / Celular *
                    </label>
                    <input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      className={inputCls}
                      placeholder="Ej.: 987654321"
                      value={form.telefono}
                      onChange={handleChange}
                      required
                      maxLength={20}
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="email">
                      Correo electrónico *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={inputCls}
                      placeholder="tucorreo@ejemplo.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      maxLength={120}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Datos del reclamo */}
            <div>
              <p className="font-label-md text-label-md text-on-tertiary-container uppercase tracking-wider mb-3 pb-1.5 border-b border-[#3a2620]">
                Detalle del {form.tipoReclamo === 'reclamo' ? 'Reclamo' : 'la Queja'}
              </p>
              <div className="flex flex-col gap-3">
                <div>
                  <label className={labelCls} htmlFor="descripcionBien">
                    Producto o servicio involucrado *
                  </label>
                  <input
                    id="descripcionBien"
                    name="descripcionBien"
                    type="text"
                    className={inputCls}
                    placeholder="Ej.: Caja de chocolates artesanales 12 unidades"
                    value={form.descripcionBien}
                    onChange={handleChange}
                    required
                    maxLength={200}
                  />
                </div>
                <div>
                  <label className={labelCls} htmlFor="descripcionProblema">
                    Descripción del problema *
                  </label>
                  <textarea
                    id="descripcionProblema"
                    name="descripcionProblema"
                    className={`${inputCls} resize-y min-h-[90px]`}
                    placeholder="Describe detalladamente el motivo de tu reclamo o queja..."
                    value={form.descripcionProblema}
                    onChange={handleChange}
                    required
                    maxLength={800}
                  />
                  <p className="text-right font-label-sm text-label-sm text-primary-fixed-dim mt-1 text-[11px]">
                    {form.descripcionProblema.length}/800
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls} htmlFor="montoReclamado">
                      Monto reclamado (S/) — opcional
                    </label>
                    <input
                      id="montoReclamado"
                      name="montoReclamado"
                      type="number"
                      min="0"
                      step="0.01"
                      className={inputCls}
                      placeholder="0.00"
                      value={form.montoReclamado}
                      onChange={handleChange}
                      maxLength={10}
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="pedidoSolicitado">
                      Acción solicitada *
                    </label>
                    <input
                      id="pedidoSolicitado"
                      name="pedidoSolicitado"
                      type="text"
                      className={inputCls}
                      placeholder="Ej.: Reembolso, reposición, disculpas..."
                      value={form.pedidoSolicitado}
                      onChange={handleChange}
                      required
                      maxLength={300}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Error message */}
            {submitState === 'error' && errorMsg && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-900/20 border border-red-500/30">
                <span className="material-symbols-outlined text-red-400 text-[18px] flex-shrink-0 mt-0.5">
                  error
                </span>
                <p className="font-body-sm text-body-sm text-red-300">{errorMsg}</p>
              </div>
            )}

            {/* Disclaimer */}
            <p className="font-label-sm text-label-sm text-primary-fixed-dim text-[11px] leading-relaxed">
              Al enviar este formulario, declaras que la información proporcionada es verídica.
              La constancia de recepción será enviada al correo indicado. El proveedor tiene un
              plazo máximo de <strong className="text-surface-bright">30 días calendario</strong> para dar respuesta.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1 pb-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 rounded-full border border-[#5c3d2e] text-primary-fixed-dim hover:text-surface-bright hover:border-secondary-fixed transition-colors font-label-md text-label-md uppercase tracking-wider cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitState === 'loading'}
                className="flex-1 px-6 py-3 rounded-full bg-[#b91c1c] hover:bg-[#991b1b] disabled:opacity-60 disabled:cursor-not-allowed text-white font-label-md text-label-md uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {submitState === 'loading' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    Registrar {form.tipoReclamo === 'reclamo' ? 'Reclamo' : 'Queja'}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
