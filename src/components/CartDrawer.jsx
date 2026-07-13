import React from "react";
import { AnimatePresence, motion } from "framer-motion";
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

  const whatsappLink = buildWhatsappLink(items, totalPrice, hasUndefinedPriceItems);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeCart}
        >
          <motion.div
            className="flex h-full w-full max-w-md flex-col border-l border-black/5 bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
              <h3 className="font-display text-lg font-bold text-ink-900">
                Sua Sacola {totalItems > 0 && <span className="text-ink-500">({totalItems})</span>}
              </h3>
              <button
                onClick={closeCart}
                className="grid h-9 w-9 place-items-center rounded-full bg-paper-100 text-ink-900 hover:bg-paper-200"
                aria-label="Fechar sacola"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-ink-500">
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
                        <p className="line-clamp-2 text-sm font-medium leading-snug text-ink-900">
                          {item.name}
                        </p>
                        <span className="text-xs text-ink-500">
                          {typeof item.price === "number"
                            ? `R$ ${item.price.toFixed(2).replace(".", ",")}`
                            : "Preço a combinar"}
                        </span>
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="grid h-6 w-6 place-items-center rounded-full bg-paper-100 text-xs font-bold text-ink-900"
                          >
                            −
                          </button>
                          <span className="w-4 text-center text-xs font-semibold text-ink-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="grid h-6 w-6 place-items-center rounded-full bg-paper-100 text-xs font-bold text-ink-900"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto text-[11px] font-medium text-ink-500 hover:text-accent-pink"
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
              <div className="border-t border-black/5 px-5 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-ink-500">
                    {hasUndefinedPriceItems ? "Total estimado" : "Total"}
                  </span>
                  <span className="font-display text-xl font-bold text-ink-900">
                    R$ {totalPrice.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                {hasUndefinedPriceItems && (
                  <p className="mb-3 text-[11px] text-ink-500">
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
