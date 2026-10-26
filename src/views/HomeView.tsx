import React from 'react';
import { PageRoute, Product, SiteData } from '../types';
import { googleMapsEmbedUrl } from '../lib/maps';
import { GooglePlayBadge } from '../components/GooglePlayBadge';

interface HomeViewProps {
  siteData: SiteData;
  onRouteChange: (route: PageRoute) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  siteData,
  onRouteChange,
  onSelectProduct,
}) => {
  const { brand, home, products } = siteData;

  // Find featured products matching IDs or take first 3
  const featured = home.featuredProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const displayFeatured = featured.length >= 3 ? featured.slice(0, 3) : products.slice(0, 3);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-[901px] flex items-center justify-center overflow-hidden bg-primary-container text-surface -mt-20 pt-24 pb-16">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out"
          style={{ backgroundImage: `url('${brand.heroBgUrl}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-primary-container/70 to-primary-container/30"></div>

        <div className="relative z-10 max-w-[1320px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop w-full flex flex-col items-center text-center">

          {/* Overline with golden hairlines */}
          <div className="flex items-center gap-space-sm mb-space-sm">
            <span className="h-[1px] w-8 md:w-16 bg-on-tertiary-container/60"></span>
            <span className="font-label-md text-label-md uppercase tracking-[0.25em] text-on-tertiary-container">
              {home.heroOverline}
            </span>
            <span className="h-[1px] w-8 md:w-16 bg-on-tertiary-container/60"></span>
          </div>

          <h1 className="font-display-xl text-display-xl text-surface-bright max-w-4xl tracking-tight leading-[1.08] mb-space-xs">
            {home.heroTitle || brand.name}
          </h1>

          <p className="font-headline-sm text-headline-sm italic text-secondary-fixed font-normal max-w-2xl mb-space-md">
            {home.heroSubtitle || brand.tagline}
          </p>

          <p className="font-body-md text-body-md text-primary-fixed-dim max-w-xl mb-space-lg font-light leading-relaxed">
            {home.heroDesc}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-space-md w-full sm:w-auto">
            <button
              onClick={() => {
                onRouteChange('productos');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-lg py-3 rounded-lg bg-secondary text-on-secondary hover:bg-on-tertiary-container transition-all duration-300 shadow-md font-label-md text-label-md uppercase tracking-wider cursor-pointer"
            >
              <span>Ver productos</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>

            <GooglePlayBadge className="w-full sm:w-auto" />
          </div>

          {/* Subtle Origin Bar */}
          <div className="mt-space-xl pt-space-md flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-primary-fixed-dim font-label-sm text-label-sm uppercase tracking-widest opacity-80">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span>
              {home.heroBadge1}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span>
              {home.heroBadge2}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span>
              {home.heroBadge3}
            </span>
          </div>
        </div>
      </section>

      {/* Section 2: Product Showcase (Tres en fila) */}
      <section className="w-full py-space-xl bg-surface">
        <div className="max-w-[1320px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-tertiary-container block mb-space-xs">
                {home.collectionOverline}
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-primary-fixed">
                {home.collectionTitle}
              </h2>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mt-space-xs md:mt-0">
              {home.collectionDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">
            {displayFeatured.map((prod) => (
              <article
                key={prod.id}
                onClick={() => onSelectProduct(prod)}
                className="group flex flex-col bg-surface-container-low rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-surface-container-high/40"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface-container">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    alt={prod.name}
                    src={prod.image}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-primary-container/85 backdrop-blur-sm rounded-lg text-surface-bright font-label-sm text-label-sm uppercase tracking-wider">
                    {prod.badge}
                  </div>
                </div>
                <div className="p-space-md flex flex-col flex-1 justify-between bg-surface-container-low">
                  <div>
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-tertiary-container">
                      {prod.subtitle}
                    </span>
                    <h3 className="font-headline-sm text-headline-sm text-on-primary-fixed mt-1 mb-2 group-hover:text-secondary transition-colors">
                      {prod.name}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                      {prod.shortDesc}
                    </p>
                  </div>
                  <div className="mt-space-md pt-space-xs flex items-center justify-between border-t border-surface-container-high/60">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                      Precio
                    </span>
                    <span className="font-title-md text-title-md font-semibold text-secondary">
                      {prod.price}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Cómo pedir (Modalidad Directa) */}
      <section className="w-full py-space-xl bg-surface-container-low" id="pedidos">
        <div className="max-w-[1320px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
          <div className="text-center max-w-2xl mx-auto mb-space-lg">
            <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-tertiary-container block mb-space-xs">
              {home.howToOrderOverline}
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-primary-fixed mb-space-xs">
              {home.howToOrderTitle}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {home.howToOrderDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter-desktop">
            {/* Opción principal: carrito web y pago Culqi */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-secondary/40">
              <div>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-space-md">
                  <span className="material-symbols-outlined text-[28px]">lock</span>
                </div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Opción principal</span>
                <h3 className="font-headline-sm text-headline-sm text-on-primary-fixed mt-1 mb-space-xs">Compra directamente desde la web</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
                  Añade tus chocolates al carrito, paga con tarjeta o Yape en el checkout seguro de Culqi y luego coordinamos el envío o recojo.
                </p>
              </div>
              <div className="pt-space-md">
                <button
                  onClick={() => {
                    onRouteChange('productos');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-space-xs px-space-md py-3 rounded-lg bg-secondary text-on-secondary hover:bg-on-tertiary-container transition-colors font-label-md text-label-md uppercase tracking-wider cursor-pointer shadow-sm"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                  <span>Ver productos y comprar</span>
                </button>
              </div>
            </div>

            {/* Alternativa: App Android */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-surface-container-high/50">
              <div>
                <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary mb-space-md">
                  <span className="material-symbols-outlined text-[28px]">smartphone</span>
                </div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-tertiary-container">
                  Alternativa
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-primary-fixed mt-1 mb-space-xs">
                  {home.option1Title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
                  {home.option1Desc}
                </p>
              </div>
              <div className="pt-space-md">
                <GooglePlayBadge />
              </div>
            </div>

            {/* Alternativa: WhatsApp */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-[#25D366]/30">
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#25D366]/10 flex items-center justify-center text-[#128C7E] mb-space-md">
                  <span className="material-symbols-outlined text-[28px]" aria-hidden="true">chat</span>
                </div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-[#128C7E]">
                  Alternativa · WhatsApp
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-primary-fixed mt-1 mb-space-xs">
                  {home.option2Title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
                  {home.option2Desc}
                </p>
              </div>
              <div className="pt-space-md">
                <a
                  className="inline-flex items-center gap-space-xs px-space-md py-3 rounded-lg bg-[#25D366] text-[#073B25] hover:bg-[#20bd5a] transition-colors font-label-md text-label-md uppercase tracking-wider cursor-pointer shadow-sm"
                  href={brand.whatsappUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">chat</span>
                  <span>Escribir por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Visítanos en San Miguel */}
      <section className="w-full py-space-xl bg-surface">
        <div className="max-w-[1320px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-center">
            {/* Columna de Información */}
            <div className="lg:col-span-5 flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-tertiary-container block mb-space-xs">
                {home.visitOverline}
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-primary-fixed mb-space-sm">
                {home.visitTitle}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
                {home.visitDesc}
              </p>

              <div className="bg-surface-container-low p-space-md rounded-xl mb-space-md flex items-start gap-space-sm border border-surface-container-high/60">
                <span className="material-symbols-outlined text-secondary text-[24px] mt-0.5">
                  location_on
                </span>
                <div className="flex flex-col">
                  <span className="font-title-md text-title-md text-on-primary-fixed">
                    Dirección
                  </span>
                  <p className="font-body-md text-body-md text-on-surface mt-0.5 font-medium">
                    {brand.address}
                  </p>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {brand.district}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-space-md">
                <button
                  onClick={() => {
                    onRouteChange('visitanos');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-space-xs px-space-md py-3 rounded-lg bg-primary-container text-surface-bright hover:bg-on-primary-fixed transition-colors font-label-md text-label-md uppercase tracking-wider cursor-pointer shadow-sm"
                >
                  <span>Ver detalles y mapa</span>
                  <span className="material-symbols-outlined text-[16px]">map</span>
                </button>
                <a
                  className="font-label-md text-label-md uppercase text-secondary hover:text-on-tertiary-container transition-colors tracking-wider"
                  href={`${brand.whatsappUrl}?text=Hola,%20quisiera%20avisar%20que%20voy%20a%20pasar%20por%20el%20Atelier.`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Avisar llegada
                </a>
              </div>
            </div>

            {/* Columna de Mapa Visual */}
            <div className="lg:col-span-7">
              <div
                onClick={() => {
                  onRouteChange('visitanos');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="relative w-full h-[380px] rounded-xl overflow-hidden shadow-sm bg-surface-container group cursor-pointer border border-surface-container-high"
              >
                <iframe
                  title={`Mapa de ${brand.address}, ${brand.district}`}
                  src={googleMapsEmbedUrl(brand.address, brand.district)}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <div className="absolute inset-0 bg-primary-container/10 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute bottom-4 left-4 right-4 bg-surface-container-lowest/90 backdrop-blur-md p-space-sm rounded-lg flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    <span className="font-body-sm text-body-sm font-medium text-on-surface">
                      {brand.address}, {brand.district.split(',')[0]}
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-tertiary-container font-semibold">
                    {brand.zone}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
