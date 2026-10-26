import React, { useState } from 'react';
import { PageRoute, Product, SiteData } from '../types';
import { formatSoles, MAX_ITEM_QUANTITY } from '../lib/cart';
import { GooglePlayBadge } from '../components/GooglePlayBadge';

interface ProductDetailViewProps {
  product: Product;
  siteData: SiteData;
  onRouteChange: (route: PageRoute) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  siteData,
  onRouteChange,
  onSelectProduct,
  onAddToCart,
}) => {
  const { brand, products } = siteData;
  const [quantity, setQuantity] = useState(1);

  const whatsappOrderUrl = `${brand.whatsappUrl}?text=${encodeURIComponent(
    `Hola, quisiera pedir la ${product.name} (${product.price}).`
  )}`;

  // Related products from current dynamic catalog
  const related = products.filter((p) => p.id !== product.id).slice(0, 3);
  const displayImage = product.detailImage || product.image;

  return (
    <div className="flex flex-col w-full">
      {/* Breadcrumb Navigation */}
      <section className="w-full bg-surface-container-low/60 py-space-sm border-b border-surface-container-high/40">
        <div className="max-w-[1320px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-space-xs font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant flex-wrap"
          >
            <button
              onClick={() => {
                onRouteChange('inicio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-on-tertiary-container transition-colors cursor-pointer"
            >
              Inicio
            </button>
            <span className="text-on-tertiary-container/60">/</span>
            <button
              onClick={() => {
                onRouteChange('productos');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-on-tertiary-container transition-colors cursor-pointer"
            >
              Productos
            </button>
            <span className="text-on-tertiary-container/60">/</span>
            <span className="text-on-primary-fixed font-semibold">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Main Product Detail Showcase */}
      <section className="w-full py-space-xl">
        <div className="max-w-[1320px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
            {/* Left Column: High Resolution Still Life */}
            <div className="lg:col-span-7 flex flex-col gap-space-md">
              <div className="relative w-full aspect-[4/5] bg-surface-container-low rounded-xl overflow-hidden shadow-md group border border-surface-container-high/40">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  alt={product.name}
                  src={displayImage}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-space-md left-space-md bg-surface/90 backdrop-blur-sm px-space-sm py-space-xs rounded-lg shadow-sm">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-tertiary-container font-semibold">
                    {product.badge} · {product.categoryLabel}
                  </span>
                </div>
              </div>

              {/* Tactility Micro Note */}
              <div className="bg-surface-container-low p-space-md rounded-xl flex items-center justify-between border border-surface-container-high/40">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-on-tertiary-container text-[20px]">
                    temp_preferences_custom
                  </span>
                  <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface">
                    Conservación Óptima
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                  {product.conservation}
                </span>
              </div>
            </div>

            {/* Right Column: Product Editorial & Concierge Interaction */}
            <div className="lg:col-span-5 flex flex-col justify-start">
              {/* Category Overline */}
              <div className="flex items-center gap-space-xs mb-space-xs">
                <span className="w-6 h-[1px] bg-secondary"></span>
                <span className="font-label-md text-label-md uppercase tracking-[0.2em] text-secondary font-semibold">
                  {product.categoryLabel}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-headline-lg text-headline-lg text-on-primary-fixed mb-space-xs">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-space-xs mb-space-md">
                <span className="font-headline-md text-headline-md text-on-tertiary-container font-semibold">
                  {product.price}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  PEN · Precio por unidad
                </span>
              </div>

              {/* Sensory Narrative */}
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-space-lg leading-relaxed">
                {product.fullDesc}
              </p>

              {/* Artisan Composition Panel */}
              <div className="bg-surface-container rounded-xl p-space-md mb-space-lg shadow-sm flex flex-col gap-space-sm border border-surface-container-high/60">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    verified
                  </span>
                  <span className="font-label-md text-label-md uppercase tracking-widest text-on-primary-fixed font-semibold">
                    Composición y pureza
                  </span>
                </div>
                <div className="flex flex-col gap-space-xs font-body-sm text-body-sm text-on-surface pt-space-xs divide-y divide-surface-container-high/60">
                  <div className="flex justify-between items-start pb-2">
                    <span className="text-on-surface-variant font-medium">Ingredientes:</span>
                    <span className="text-right text-on-surface max-w-[240px]">
                      {product.ingredients}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-on-surface-variant font-medium">Peso neto:</span>
                    <span className="text-on-surface font-semibold">{product.netWeight}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-on-surface-variant font-medium">Perfil aromático:</span>
                    <span className="text-on-surface text-right">{product.aromaProfile}</span>
                  </div>
                </div>
              </div>

              {/* Direct Ordering Actions */}
              <div className="flex flex-col gap-space-sm mb-space-md">
                <div className="flex items-center gap-space-sm">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Cantidad
                  </span>
                  <div className="inline-flex items-center rounded-lg border border-surface-container-high overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                      className="w-9 h-9 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                      aria-label="Disminuir cantidad"
                    >
                      <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    <span className="w-10 text-center font-label-md text-label-md text-on-primary-fixed">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((current) => Math.min(MAX_ITEM_QUANTITY, current + 1))}
                      className="w-9 h-9 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                      aria-label="Aumentar cantidad"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>
                  <span className="ml-auto font-title-md text-title-md text-secondary font-bold">
                    {formatSoles(product.priceValue * quantity)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onAddToCart(product, quantity)}
                  className="w-full flex items-center justify-center gap-space-sm py-space-sm px-space-md rounded-lg bg-primary-container text-surface-bright hover:bg-[#33211b] transition-all duration-200 shadow-md font-label-md text-label-md uppercase tracking-widest text-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                  <span>Agregar al carrito y pagar en línea</span>
                </button>

                <a
                  className="w-full flex items-center justify-center gap-space-sm py-space-sm px-space-md rounded-lg bg-secondary text-on-secondary hover:bg-on-tertiary-container transition-all duration-200 shadow-md font-label-md text-label-md uppercase tracking-widest text-center cursor-pointer"
                  href={whatsappOrderUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>Pedir por WhatsApp</span>
                </a>

                <GooglePlayBadge className="w-full" />
              </div>

              {/* Transparency Footnote */}
              <div className="flex items-start gap-space-xs p-space-xs">
                <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-[2px]">
                  info
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant italic leading-snug">
                  Puedes pagar en línea con tarjeta o Yape (Culqi), o coordinar tu pedido de forma personalizada por WhatsApp o mediante nuestra aplicación para Android.
                </p>
              </div>

              {/* Atelier Assurance Tag */}
              <div className="mt-space-lg pt-space-md flex items-center justify-between gap-space-md text-on-surface-variant border-t border-surface-container-high/40">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-space-md">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        location_on
                      </span>
                      <span className="font-label-sm text-label-sm uppercase tracking-wider">
                        {brand.district.split(',')[0]}
                      </span>
                    </div>
                    <span className="text-on-surface-variant/40">·</span>
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-secondary text-[16px]">eco</span>
                      <span className="font-label-sm text-label-sm uppercase tracking-wider">
                        {product.origin}
                      </span>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-tertiary-container">
                    Elaboración esmerada en lote pequeño
                  </span>
                </div>
                <img
                  src="/logo.png"
                  alt="Sello de Origen Fernandina de Jagua"
                  className="w-14 sm:w-16 h-auto object-contain opacity-85 select-none shrink-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Taste Profile Micro-Chart Visualizer */}
      <section className="w-full py-space-lg bg-surface-container-low/40 border-y border-surface-container-high/40">
        <div className="max-w-[1320px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Metric 1 */}
            <div className="bg-surface p-space-md rounded-xl shadow-sm flex flex-col gap-space-xs border border-surface-container-high/50">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">
                  Intensidad
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                  {product.intensity} / 5.0
                </span>
              </div>
              <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mt-space-xs">
                <div
                  className="bg-primary-container h-full transition-all duration-700"
                  style={{ width: `${(product.intensity / 5.0) * 100}%` }}
                ></div>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">
                {product.intensityDesc}
              </span>
            </div>

            {/* Metric 2 */}
            <div className="bg-surface p-space-md rounded-xl shadow-sm flex flex-col gap-space-xs border border-surface-container-high/50">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">
                  Notas Frutales
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                  {product.fruitNotes} / 5.0
                </span>
              </div>
              <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mt-space-xs">
                <div
                  className="bg-secondary h-full transition-all duration-700"
                  style={{ width: `${(product.fruitNotes / 5.0) * 100}%` }}
                ></div>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">
                {product.fruitNotesDesc}
              </span>
            </div>

            {/* Metric 3 */}
            <div className="bg-surface p-space-md rounded-xl shadow-sm flex flex-col gap-space-xs border border-surface-container-high/50">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">
                  Persistencia en Boca
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                  {product.persistence} / 5.0
                </span>
              </div>
              <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mt-space-xs">
                <div
                  className="bg-on-tertiary-container h-full transition-all duration-700"
                  style={{ width: `${(product.persistence / 5.0) * 100}%` }}
                ></div>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">
                {product.persistenceDesc}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Related Creations Section */}
      {related.length > 0 && (
        <section className="w-full py-space-xl">
          <div className="max-w-[1320px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm">
              <div>
                <span className="font-label-md text-label-md uppercase tracking-[0.2em] text-secondary font-semibold block mb-space-xs">
                  Catálogo de Creador
                </span>
                <h2 className="font-headline-md text-headline-md text-on-primary-fixed">
                  Otras creaciones que podrían gustarte
                </h2>
              </div>
              <button
                onClick={() => {
                  onRouteChange('productos');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant hover:text-on-primary-fixed transition-colors flex items-center gap-space-xs cursor-pointer"
              >
                <span>Ver colección completa</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {/* 3-Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {related.map((rel) => (
                <div
                  key={rel.id}
                  className="group bg-surface-container-low rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col border border-surface-container-high/40"
                >
                  <div
                    onClick={() => {
                      onSelectProduct(rel);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="relative w-full aspect-[4/3] overflow-hidden bg-surface-container cursor-pointer"
                  >
                    <img
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      alt={rel.name}
                      src={rel.image}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-space-sm right-space-sm bg-surface/90 px-space-xs py-[2px] rounded font-label-sm text-label-sm uppercase tracking-wider text-on-surface">
                      {rel.badge}
                    </div>
                  </div>
                  <div className="p-space-md flex flex-col flex-1 justify-between gap-space-sm">
                    <div>
                      <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary block mb-space-xs">
                        {rel.categoryLabel}
                      </span>
                      <h3
                        onClick={() => {
                          onSelectProduct(rel);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="font-headline-sm text-headline-sm text-on-primary-fixed group-hover:text-secondary transition-colors cursor-pointer"
                      >
                        {rel.name}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs line-clamp-2">
                        {rel.shortDesc}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-space-xs border-t border-surface-container-high/40">
                      <span className="font-title-md text-title-md text-on-tertiary-container font-semibold">
                        {rel.price}
                      </span>
                      <a
                        className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary transition-colors flex items-center gap-space-xs cursor-pointer"
                        href={`${brand.whatsappUrl}?text=${encodeURIComponent(
                          `Hola, quisiera consultar sobre la ${rel.name}.`
                        )}`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span>Consultar</span>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
