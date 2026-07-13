import React from "react";
import { useCart } from "../context/CartContext.jsx";
import { buildWhatsappLink } from "../utils/whatsapp.js";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
    hasUndefinedPriceItems,
  } = useCart();

  if (!isOpen) return null;

  const whatsappLink = buildWhatsappLink(items, totalPrice, hasUndefinedPriceItems);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={closeCart}>
      <div
        className="flex h-full w-full max-w-md flex-col bg-ink-900 border-l border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h3 className="font-display text-lg font-bold">
            Sua Sacola {totalItems > 0 && <span className="text-white/50">({totalItems})</span>}
          </h3>
          <button
            onClick={closeCart}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/5 hover:bg-white/10"
            aria-label="Fechar sacola"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-white/50">
              <span className="text-4xl">🛍️</span>
              <p className="text-sm">Sua sacola está vazia.</p>
              <button onClick={closeCart} className="btn-secondary mt-2">
                Continuar comprando
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="line-clamp-2 text-sm font-medium leading-snug">{item.name}</p>
                    <span className="text-xs text-white/50">
                      {typeof item.price === "number"
                        ? `R$ ${item.price.toFixed(2).replace(".", ",")}`
                        : "Preço a combinar"}
                    </span>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-xs font-bold"
                      >
                        −
                      </button>
                      <span className="w-4 text-center text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-xs font-bold"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-[11px] font-medium text-white/40 hover:text-accent-pink"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-white/10 px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-white/60">
                {hasUndefinedPriceItems ? "Total estimado" : "Total"}
              </span>
              <span className="font-display text-xl font-bold">
                R$ {totalPrice.toFixed(2).replace(".", ",")}
              </span>
            </div>
            {hasUndefinedPriceItems && (
              <p className="mb-3 text-[11px] text-white/45">
                Alguns itens têm preço a combinar diretamente no WhatsApp.
              </p>
            )}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp w-full py-3.5 text-sm"
            >
              Finalizar Pedido no WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
