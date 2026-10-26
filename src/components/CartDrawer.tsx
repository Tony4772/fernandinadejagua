import React from 'react';
import { BrandConfig, StoreScheduleConfig } from '../types';
import { evaluateStoreSchedule } from '../lib/schedule';
import { CartItem, cartCount, cartTotal, formatSoles, MAX_ITEM_QUANTITY } from '../lib/cart';

interface CartDrawerProps {
  schedule?: StoreScheduleConfig;
  isOpen: boolean;
  items: CartItem[];
  brand: BrandConfig;
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
  onKeepShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  brand,
  schedule,
  onClose,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  onKeepShopping,
}) => {
  if (!isOpen) return null;

  const scheduleStatus = evaluateStoreSchedule(schedule);
  const total = cartTotal(items);
  const count = cartCount(items);
  const whatsappMessage = encodeURIComponent(
    `Hola, quisiera coordinar este pedido:\n${items
      .map((item) => `• ${item.quantity} × ${item.name} — ${formatSoles(item.priceValue * item.quantity)}`)
      .join('\n')}\nTotal: ${formatSoles(total)}`,
  );
  const whatsappUrl = `${brand.whatsappUrl}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={onClose}
        className="absolute inset-0 bg-primary-container/60 backdrop-blur-sm cursor-default"
      />

      <aside className="relative h-full w-full max-w-md bg-surface-container-lowest shadow-2xl flex flex-col border-l border-surface-container-high animate-in slide-in-from-right duration-200">
        <header className="flex items-center justify-between px-space-md py-space-sm border-b border-surface-container-high bg-primary-container text-surface-bright">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-secondary-fixed text-[20px]">shopping_cart</span>
            <h2 className="font-headline-sm text-headline-sm">Tu carrito</h2>
            {count > 0 && (
              <span className="ml-1 text-[11px] font-label-md uppercase tracking-wider bg-secondary text-on-secondary px-2 py-0.5 rounded-full">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Cerrar carrito"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-space-sm px-space-lg text-center">
            <span className="material-symbols-outlined text-[48px] text-outline-variant">shopping_basket</span>
            <p className="font-title-md text-title-md text-on-primary-fixed">Tu carrito está vacío</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Explora la colección y agrega tus chocolates favoritos para pagar en línea.
            </p>
            <button
              onClick={onKeepShopping}
              className="mt-space-sm px-space-md py-space-xs rounded-lg bg-secondary text-on-secondary font-label-md text-label-md uppercase tracking-wider hover:bg-on-tertiary-container transition-colors cursor-pointer"
              type="button"
            >
              Ver catálogo
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-space-md py-space-sm flex flex-col gap-space-sm">
              {items.map((item) => (
                <article
                  key={item.productId}
                  className="flex gap-space-sm p-space-xs rounded-xl border border-surface-container-high/60 bg-surface-container-lowest"
                >
                  <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-surface-container">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="font-title-md text-[15px] leading-tight text-on-primary-fixed truncate">
                        {item.name}
                      </h3>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {formatSoles(item.priceValue)} c/u
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-space-xs">
                      <div className="inline-flex items-center rounded-lg border border-surface-container-high overflow-hidden">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                          aria-label={`Quitar una unidad de ${item.name}`}
                        >
                          <span className="material-symbols-outlined text-[16px]">remove</span>
                        </button>
                        <span className="w-8 text-center font-label-md text-label-md">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= MAX_ITEM_QUANTITY}
                          className="w-7 h-7 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          aria-label={`Agregar una unidad de ${item.name}`}
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-space-xs">
                        <span className="font-title-md text-title-md text-secondary font-bold">
                          {formatSoles(item.priceValue * item.quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemove(item.productId)}
                          className="w-7 h-7 flex items-center justify-center rounded text-on-surface-variant hover:text-error hover:bg-error-container/40 transition-colors cursor-pointer"
                          aria-label={`Quitar ${item.name}`}
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              <div className="flex items-start gap-space-xs p-space-sm mt-space-xs rounded-lg bg-surface-container text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5 shrink-0">
                  info
                </span>
                <p className="font-body-sm text-body-sm">
                  El delivery se coordina por WhatsApp después del pago. Recojo disponible en {brand.address},{' '}
                  {brand.district}.
                </p>
              </div>
            </div>

            <footer className="border-t border-surface-container-high px-space-md py-space-sm flex flex-col gap-space-sm bg-surface-container-low">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
                  Total
                </span>
                <span className="font-headline-sm text-headline-sm text-on-primary-fixed font-bold">
                  {formatSoles(total)}
                </span>
              </div>

              {!scheduleStatus.canOrder && (
                <div className="p-3 rounded-xl bg-[#34150f] border border-rose-500/40 text-rose-100 flex flex-col gap-1.5 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300 uppercase tracking-wide">
                    <span className="material-symbols-outlined text-[18px]">lock_clock</span>
                    <span>Atelier cerrado temporalmente</span>
                  </div>
                  <p className="text-xs leading-relaxed text-rose-200">
                    {scheduleStatus.message}
                  </p>
                  <p className="text-[11px] text-secondary-fixed">
                    Los pedidos en línea están pausados fuera de horario. Puedes coordinar tu encargo por WhatsApp.
                  </p>
                </div>
              )}

              {scheduleStatus.canOrder ? (
                <button
                  type="button"
                  onClick={onCheckout}
                  className="w-full inline-flex items-center justify-center gap-space-xs px-space-lg py-space-sm rounded-lg bg-secondary text-on-secondary hover:bg-on-tertiary-container hover:text-on-primary font-label-md text-label-md uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">credit_card</span>
                  <span>Pagar con Culqi</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full inline-flex items-center justify-center gap-space-xs px-space-lg py-space-sm rounded-lg bg-surface-container-highest text-on-surface-variant/60 font-label-md text-label-md uppercase tracking-wider cursor-not-allowed border border-surface-container-high"
                >
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  <span>Pedidos cerrados por horario</span>
                </button>
              )}

              <div className="flex gap-space-xs">
                <div className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-surface-container border border-surface-container-high text-[11px] font-label-md uppercase tracking-wider text-on-surface-variant">
                  <span className="material-symbols-outlined text-[14px]">credit_card</span>
                  Tarjeta
                </div>
                <div className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-[#742384]/10 border border-[#742384]/20 text-[11px] font-label-md uppercase tracking-wider text-[#742384]">
                  <span className="material-symbols-outlined text-[14px]">phone_iphone</span>
                  Yape
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-space-xs px-space-lg py-space-xs rounded-lg border border-surface-container-high text-on-surface-variant hover:text-on-primary-fixed font-label-md text-label-md uppercase tracking-wider transition-colors text-center"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Coordinar por WhatsApp</span>
              </a>

              <p className="text-[11px] text-center text-on-surface-variant leading-tight">
                Pago seguro con Culqi · <strong>Tarjeta y Yape (hasta S/ 2,000)</strong> · Solo soles · No guardamos datos sensibles
              </p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
};
