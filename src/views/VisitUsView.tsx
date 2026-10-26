import React from 'react';
import { SiteData } from '../types';
import { googleMapsEmbedUrl, googleMapsSearchUrl } from '../lib/maps';
import { GooglePlayBadge } from '../components/GooglePlayBadge';
import { evaluateStoreSchedule, formatTime12h } from '../lib/schedule';

interface VisitUsViewProps {
  siteData: SiteData;
}

export const VisitUsView: React.FC<VisitUsViewProps> = ({ siteData }) => {
  const { brand, visit, schedule } = siteData;
  const scheduleStatus = evaluateStoreSchedule(schedule);

  return (
    <div className="flex flex-col w-full">
      {/* Subtle ambient decorative glow (contained) */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-secondary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
      </div>

      {/* Header Section */}
      <section className="w-full max-w-[1320px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop pt-space-lg pb-space-md">
        <div className="flex flex-col items-center text-center">
          <img
            src="/logo.png"
            alt={brand.name}
            className="w-24 sm:w-28 md:w-32 h-auto object-contain mx-auto mb-space-sm drop-shadow-sm select-none"
          />
          <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-high mb-space-sm border border-surface-container-highest">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant font-medium">
              {visit.headerTag}
            </span>
          </div>

          <h1 className="font-headline-lg text-headline-lg md:text-display-xl text-on-surface tracking-tight max-w-3xl">
            {visit.headerTitle}
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-space-xs font-normal leading-relaxed">
            {visit.headerDesc}
          </p>

          {/* Antique filigree ornament separator */}
          <div className="flex items-center justify-center gap-space-md w-full max-w-md mt-space-md">
            <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-on-tertiary-container/40 to-on-tertiary-container/70"></span>
            <span className="font-label-sm text-label-sm tracking-widest text-on-tertiary-container uppercase font-semibold">
              • Cacao •
            </span>
            <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-on-tertiary-container/40 to-on-tertiary-container/70"></span>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="w-full max-w-[1320px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-space-md pb-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-stretch">
          {/* Column 1: Atelier Information */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            {/* Address Card */}
            <div className="bg-surface-container-low rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden border border-surface-container-high/60">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-fixed/15 rounded-full blur-2xl pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between pb-space-sm">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-tertiary-container">
                    Ubicación Central
                  </span>
                  <span
                    className="material-symbols-outlined text-secondary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    location_on
                  </span>
                </div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Dirección</h2>
                <p className="font-title-md text-title-md text-on-primary-fixed mt-space-xs font-semibold">
                  {brand.address}
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  {brand.district}
                </p>
                <div className="inline-flex items-center gap-space-xs mt-space-sm text-on-tertiary-container">
                  <span className="material-symbols-outlined text-[16px]">domain</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-medium">
                    {brand.companyName}
                  </span>
                </div>
              </div>
              <div className="pt-space-md mt-space-md bg-surface-container/60 -mx-space-lg -mb-space-lg p-space-md flex items-center justify-between border-t border-surface-container-high/60">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Distrito Costero
                </span>
                <span className="font-label-md text-label-md text-on-primary-fixed font-semibold">
                  {brand.zone}
                </span>
              </div>
            </div>

            {/* Schedule Card */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative border border-surface-container-high/60">
              <div>
                <div className="flex items-center justify-between pb-space-xs">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-tertiary-container">
                    Atención Presencial
                  </span>
                  <span className="material-symbols-outlined text-on-tertiary-container">
                    schedule
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  {visit.scheduleTitle || 'Horario de atención'}
                </h3>
              </div>

              {/* Live status badge */}
              <div className="mt-space-sm inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-surface-container border border-surface-container-high self-start">
                <span className={`w-2 h-2 rounded-full ${scheduleStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                <span className={scheduleStatus.isOpen ? 'text-emerald-700' : 'text-rose-700'}>
                  {scheduleStatus.badgeText}
                </span>
              </div>

              {/* Structured schedule container */}
              <div className="mt-space-md p-space-md rounded-lg bg-surface-container-low flex flex-col gap-2 border border-secondary/30">
                {schedule?.days?.length ? (
                  <div className="space-y-1.5 text-xs">
                    {schedule.days.map((d) => (
                      <div key={d.day} className="flex justify-between items-center py-0.5 border-b border-surface-container-high/40 last:border-none">
                        <span className="font-medium text-on-surface">{d.name}</span>
                        <span className={d.enabled ? 'text-on-surface-variant font-mono' : 'text-rose-600 font-medium'}>
                          {d.enabled ? `${formatTime12h(d.openTime)} – ${formatTime12h(d.closeTime)}` : 'Cerrado'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="font-label-md text-label-md uppercase tracking-wider text-on-tertiary-container mb-1 font-semibold text-center">
                    {visit.schedulePlaceholder}
                  </span>
                )}
                {visit.scheduleNotice && visit.scheduleNotice.trim().length > 0 ? (
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-center pt-1 border-t border-surface-container-high/40">
                    {visit.scheduleNotice}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Direct Contact Card (WhatsApp) */}
            <div className="bg-primary-container text-surface-container-low rounded-xl p-space-lg shadow-md flex flex-col justify-between relative overflow-hidden border border-[#3d2720]">
              <div className="absolute bottom-0 right-0 w-44 h-44 bg-secondary/15 rounded-full blur-2xl pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between pb-space-xs">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary-fixed">
                    Canal Directo
                  </span>
                  <span className="material-symbols-outlined text-secondary-fixed">chat</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-surface-bright">
                  Atención &amp; Coordinación
                </h3>
                <p className="font-body-md text-body-md text-primary-fixed-dim mt-space-xs leading-relaxed">
                  Consulte disponibilidad de colecciones, prepare su recogida personal o realice encargos directos con nuestro equipo.
                </p>
                <div className="mt-space-sm flex items-baseline gap-space-xs">
                  <span className="font-label-md text-label-md uppercase tracking-widest text-primary-fixed-dim">
                    WhatsApp:
                  </span>
                  <span className="font-title-md text-title-md text-secondary-fixed font-semibold tracking-wide">
                    {brand.whatsappNumber}
                  </span>
                </div>
              </div>
              <div className="pt-space-md mt-space-md">
                <a
                  className="group w-full inline-flex items-center justify-center gap-space-sm py-space-sm px-space-md rounded-lg bg-secondary text-on-secondary hover:bg-secondary-container hover:text-on-secondary-container transition-all duration-300 shadow-sm font-label-md text-label-md uppercase tracking-wider text-center cursor-pointer"
                  href={brand.whatsappUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">
                    send
                  </span>
                  <span>Escribir al {brand.whatsappNumber}</span>
                </a>
              </div>
            </div>

            {/* Android Application Download Block */}
            <div className="bg-surface-container-high rounded-xl p-space-lg shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md border border-surface-container-highest">
              <div className="flex items-center gap-space-md">
                <div className="w-12 h-12 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-[28px]">android</span>
                </div>
                <div className="flex flex-col">
                  <div className="inline-flex items-center gap-1">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-tertiary-container font-semibold">
                      Aplicación Móvil
                    </span>
                    <span className="w-1 h-1 rounded-full bg-secondary"></span>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                      Android
                    </span>
                  </div>
                  <span className="font-title-md text-title-md text-on-surface">
                    Catálogo &amp; Notas de Cata
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Consulte colecciones desde su dispositivo móvil.
                  </span>
                </div>
              </div>
              <GooglePlayBadge className="w-full sm:w-auto shrink-0" />
            </div>
          </div>

          {/* Column 2: Stylized Map & Geographic Ambience */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            {/* Interactive Stylized Map Card */}
            <div className="bg-surface-container-low rounded-xl p-space-sm md:p-space-md shadow-md flex flex-col h-full border border-surface-container-high/60">
              {/* Card Header & Navigation trigger */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm p-space-sm pb-space-md">
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-tertiary-container font-semibold">
                    Cartografía
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    Punto de Encuentro
                  </h3>
                </div>
                <a
                  className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-lg bg-surface-container-lowest text-on-surface hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-colors font-label-md text-label-md uppercase tracking-wider shadow-sm self-start sm:self-auto cursor-pointer"
                  href={googleMapsSearchUrl(brand.address, brand.district)}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span>Abrir en Google Maps</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </a>
              </div>

              {/* Map Graphic Wrapper */}
              <div className="relative w-full flex-1 min-h-[380px] lg:min-h-[460px] rounded-lg overflow-hidden shadow-inner">
                <iframe
                  title={`Mapa de ${brand.address}, ${brand.district}`}
                  src={googleMapsEmbedUrl(brand.address, brand.district)}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />

                {/* Floating Quick Action Badge at bottom of map */}
                <div className="absolute bottom-space-md left-space-md right-space-md sm:right-auto bg-surface-container-lowest/95 backdrop-blur-md p-space-sm rounded-lg shadow-lg max-w-sm border border-surface-container-high">
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-secondary text-[24px]">
                      explore
                    </span>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-tertiary-container font-semibold">
                        Destino Exacto
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface font-medium truncate">
                        {brand.address}
                      </span>
                    </div>
                    <a
                      className="ml-auto p-1.5 rounded bg-surface-container-high text-on-surface hover:text-secondary transition-colors"
                      href={googleMapsSearchUrl(brand.address, brand.district)}
                      rel="noopener noreferrer"
                      target="_blank"
                      title="Cómo llegar"
                    >
                      <span className="material-symbols-outlined text-[18px]">directions</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom map caption / note */}
              <div className="pt-space-md px-space-xs flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
                <span>Zona residencial y tranquila de San Miguel, de fácil acceso vehicular.</span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-tertiary-container font-semibold">
                  Coordenadas Lima Costa
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local Reference Guidelines Section */}
      <section className="w-full bg-surface-container-low py-space-xl border-t border-surface-container-high/60">
        <div className="max-w-[1320px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-tertiary-container font-semibold">
                Accesibilidad &amp; Llegada
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface mt-1">
                Referencias de llegada en San Miguel
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Guías breves para orientar su traslado hacia el {brand.address} desde las principales arterias del distrito.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Reference Item 1: Coastal Axis */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-surface-container-high/40">
              <div>
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-tertiary-container mb-space-md">
                  <span className="material-symbols-outlined text-[20px]">water</span>
                </div>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-tertiary-container">
                  {visit.ref1Title}
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1">
                  {visit.ref1Subtitle}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                  {visit.ref1Desc}
                </p>
              </div>
              <div className="mt-space-md pt-space-sm bg-surface-container-low/60 -mx-space-lg -mb-space-lg px-space-lg pb-space-md flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm border-t border-surface-container-high/40">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  navigation
                </span>
                <span>Aproximación sur / vía rápida</span>
              </div>
            </div>

            {/* Reference Item 2: Urban Arteries */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-surface-container-high/40">
              <div>
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-tertiary-container mb-space-md">
                  <span className="material-symbols-outlined text-[20px]">alt_route</span>
                </div>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-tertiary-container">
                  {visit.ref2Title}
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1">
                  {visit.ref2Subtitle}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                  {visit.ref2Desc}
                </p>
              </div>
              <div className="mt-space-md pt-space-sm bg-surface-container-low/60 -mx-space-lg -mb-space-lg px-space-lg pb-space-md flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm border-t border-surface-container-high/40">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  commute
                </span>
                <span>Acceso en vehículo particular o taxi</span>
              </div>
            </div>

            {/* Reference Item 3: Direct Arrival */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-surface-container-high/40">
              <div>
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-tertiary-container mb-space-md">
                  <span className="material-symbols-outlined text-[20px]">door_front</span>
                </div>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-tertiary-container">
                  {visit.ref3Title}
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1">
                  {visit.ref3Subtitle}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                  {visit.ref3Desc}
                </p>
              </div>
              <div className="mt-space-md pt-space-sm bg-surface-container-low/60 -mx-space-lg -mb-space-lg px-space-lg pb-space-md flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm border-t border-surface-container-high/40">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  check_circle
                </span>
                <span>Retiro de encargos confirmados</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Atmospheric Visual Anchor Section */}
      <section className="w-full max-w-[1320px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-space-xl">
        <div className="relative rounded-2xl overflow-hidden bg-primary-container text-surface-container-low p-space-lg md:p-space-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-space-xl border border-[#3e2922]">
          {/* Ambient Image Backdrop */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div
              className="bg-cover bg-center w-full h-full"
              style={{ backgroundImage: `url('${brand.ambientImageUrl}')` }}
            ></div>
          </div>

          <div className="relative z-10 flex flex-col max-w-xl">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary-fixed">
              Atención Personalizada
            </span>
            <h3 className="font-headline-md text-headline-md text-surface-bright mt-space-xs">
              {visit.ctaTitle}
            </h3>
            <p className="font-body-md text-body-md text-primary-fixed-dim mt-space-xs leading-relaxed">
              {visit.ctaDesc}
            </p>
          </div>

          <div className="relative z-10 shrink-0 flex flex-col sm:flex-row items-center gap-space-sm w-full md:w-auto">
            <a
              className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-lg py-space-sm rounded-lg bg-secondary text-on-secondary hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-all duration-200 font-label-md text-label-md uppercase tracking-wider shadow-sm text-center cursor-pointer"
              href={brand.whatsappUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>Contactar por WhatsApp</span>
            </a>
            <a
              className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-high/20 text-surface-bright hover:bg-surface-container-high/40 transition-colors font-label-md text-label-md uppercase tracking-wider text-center cursor-pointer"
              href={googleMapsSearchUrl(brand.address, brand.district)}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[16px]">pin_drop</span>
              <span>Ver mapa</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
