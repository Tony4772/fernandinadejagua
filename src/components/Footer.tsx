import React from 'react';
import { BrandConfig, PageRoute } from '../types';

interface FooterProps {
  onRouteChange: (route: PageRoute) => void;
  onOpenPrivacy: () => void;
  onOpenAdmin: () => void;
  onOpenReclamaciones: () => void;
  brand: BrandConfig;
}

export const Footer: React.FC<FooterProps> = ({
  onRouteChange,
  onOpenPrivacy,
  onOpenAdmin,
  onOpenReclamaciones,
  brand,
}) => {
  const handleNav = (route: PageRoute) => {
    onRouteChange(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-primary-container text-surface-container-low border-t border-[#3a2620]">
      <div className="max-w-[1320px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-space-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter-desktop items-start pb-space-lg">
          {/* Brand & Manifesto */}
          <div className="md:col-span-5 flex flex-col gap-space-xs">
            <span className="font-headline-sm text-headline-sm text-surface-bright">
              {brand.name}
            </span>
            <span className="font-label-sm text-label-sm text-on-tertiary-container uppercase tracking-widest">
              Atelier de Chocolates
            </span>
            <p className="font-body-sm text-body-sm text-primary-fixed-dim mt-space-xs max-w-sm leading-relaxed">
              Elaboración esmerada y expresión genuina del cacao en San Miguel, Lima, Perú.
              Experiencias sensitivas y notas de cata con devoción al detalle.
            </p>
          </div>

          {/* Atelier & Contact */}
          <div className="md:col-span-4 flex flex-col gap-space-xs">
            <span className="font-label-md text-label-md uppercase text-on-tertiary-container tracking-wider">
              Atelier y Contacto
            </span>
            <div className="flex flex-col gap-space-xs mt-space-xs font-body-sm text-body-sm text-primary-fixed-dim">
              <span className="text-surface-bright font-medium">{brand.companyName}</span>
              <span>{brand.address}</span>
              <span>{brand.district}</span>
              <div className="flex items-center gap-space-xs pt-space-xs">
                <span className="material-symbols-outlined text-on-tertiary-container text-[16px]">
                  phone
                </span>
                <a
                  className="text-surface-bright hover:text-secondary-fixed transition-colors"
                  href={brand.whatsappUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  WhatsApp: {brand.whatsappNumber}
                </a>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 flex flex-col gap-space-xs">
            <span className="font-label-md text-label-md uppercase text-on-tertiary-container tracking-wider">
              Navegación
            </span>
            <div className="flex flex-col gap-space-xs mt-space-xs font-body-sm text-body-sm">
              <button
                onClick={() => handleNav('inicio')}
                className="text-left text-primary-fixed-dim hover:text-surface-bright transition-colors cursor-pointer"
              >
                Inicio
              </button>
              <button
                onClick={() => handleNav('productos')}
                className="text-left text-primary-fixed-dim hover:text-surface-bright transition-colors cursor-pointer"
              >
                Nuestras Colecciones
              </button>
              <button
                onClick={() => handleNav('visitanos')}
                className="text-left text-primary-fixed-dim hover:text-surface-bright transition-colors cursor-pointer"
              >
                Visítanos en San Miguel
              </button>
              <button
                onClick={onOpenPrivacy}
                className="text-left text-primary-fixed-dim hover:text-surface-bright transition-colors cursor-pointer"
              >
                Política de Privacidad
              </button>
              <button
                onClick={onOpenReclamaciones}
                className="text-left text-primary-fixed-dim hover:text-surface-bright transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px] text-[#f87171]">menu_book</span>
                <span>Libro de Reclamaciones</span>
              </button>
              <button
                onClick={onOpenAdmin}
                className="text-left text-secondary-fixed hover:text-surface-bright transition-colors cursor-pointer font-medium flex items-center gap-1.5 mt-1"
              >
                <span className="material-symbols-outlined text-[14px]">lock</span>
                <span>Administración CMS</span>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-[#38221b] py-space-md flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
          <div className="flex items-start gap-space-xs">
            <span className="material-symbols-outlined text-secondary-fixed text-[22px]" aria-hidden="true">
              lock
            </span>
            <div>
              <p className="font-label-md text-label-md text-surface-bright">Pago seguro procesado por Culqi</p>
              <p className="font-body-sm text-body-sm text-primary-fixed-dim mt-1">
                Ingresa los datos de pago en el checkout de Culqi. Aceptamos tarjetas de crédito y débito y Yape.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div aria-label="Medios de pago aceptados" className="flex flex-wrap gap-2">
              <span className="rounded-md bg-white px-2.5 py-1.5 font-label-sm text-label-sm font-bold tracking-wide text-[#1a1f71]">VISA</span>
              <span className="rounded-md bg-white px-2.5 py-1.5 font-label-sm text-label-sm font-bold text-[#222222]">Mastercard</span>
              <span className="rounded-md bg-white px-2.5 py-1.5 font-label-sm text-label-sm font-bold text-[#2e77bc]">AMEX</span>
              <span className="rounded-md bg-white px-2.5 py-1.5 font-label-sm text-label-sm font-bold text-[#0079be]">Diners Club</span>
              <span className="rounded-md bg-white px-2.5 py-1.5 font-label-sm text-label-sm font-bold text-[#6500c8]">Yape</span>
            </div>
            {/* Libro de Reclamaciones Badge */}
            <button
              onClick={onOpenReclamaciones}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#241713] border border-[#5c3d2e] hover:border-secondary-fixed transition-colors text-left group cursor-pointer"
              title="Libro de Reclamaciones Virtual - Ley N° 29571"
            >
              <div className="w-6 h-6 rounded bg-[#b91c1c] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-white text-[14px]">menu_book</span>
              </div>
              <div className="leading-tight">
                <span className="font-label-sm text-[11px] font-bold text-surface-bright group-hover:text-secondary-fixed block">
                  Libro de Reclamaciones
                </span>
                <span className="font-body-sm text-[10px] text-primary-fixed-dim block">
                  Ley N° 29571
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-space-md border-t border-[#38221b] flex flex-col sm:flex-row items-center justify-between gap-space-sm font-label-sm text-label-sm text-on-primary-container">
          <p>© {brand.companyName} {brand.name}. Todos los derechos reservados.</p>
          <div className="flex items-center gap-space-md">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-surface-bright transition-colors cursor-pointer"
            >
              Política de Privacidad
            </button>
            <span>·</span>
            <button
              onClick={onOpenReclamaciones}
              className="hover:text-surface-bright transition-colors cursor-pointer text-[#f87171]"
            >
              Libro de Reclamaciones
            </button>
            <span>·</span>
            <span>San Miguel, Lima</span>
            <span>·</span>
            <button
              onClick={onOpenAdmin}
              className="hover:text-surface-bright transition-colors cursor-pointer text-secondary"
            >
              CMS
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
