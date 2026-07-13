import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../context/CartContext.jsx";
import CountryFlag from "./CountryFlag.jsx";

export default function ProductModal({ product, onClose }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <AnimatePresence
      onExitComplete={() => setQty(1)}
    >
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-black/5 bg-white sm:rounded-3xl"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img src={product.image} alt={product.name} className="h-72 w-full object-cover sm:h-80" />
              <button
                onClick={onClose}
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink-900 shadow backdrop-blur-sm"
                aria-label="Fechar"
              >
                ✕
              </button>
              <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-sm text-ink-900 shadow backdrop-blur-sm">
                <CountryFlag country={product.country} />
                {product.country}
              </span>
            </div>

            <div className="flex flex-col gap-4 p-5 sm:p-7">
              <span className="text-xs font-semibold uppercase tracking-wide text-accent-magenta">
                {product.category}
              </span>
              <h3 className="font-display text-xl font-bold leading-snug text-ink-900 sm:text-2xl">
                {product.name}
              </h3>
              <p className="text-sm text-ink-500">
                Produto importado, selecionado pela Lavish Imports. Disponibilidade
                sujeita a estoque — confirme direto pelo WhatsApp após adicionar à
                sacola.
              </p>

              <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-paper-50 px-4 py-3">
                <span
                  className={`font-display text-xl font-bold text-ink-900 ${
                    typeof product.price !== "number" ? "text-sm text-ink-500" : ""
                  }`}
                >
                  {product.priceLabel}
                </span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="grid h-8 w-8 place-items-center rounded-full bg-paper-100 font-bold text-ink-900"
                  >
                    −
                  </button>
                  <span className="w-5 text-center font-semibold text-ink-900">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="grid h-8 w-8 place-items-center rounded-full bg-paper-100 font-bold text-ink-900"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  addItem(product, qty);
                  onClose();
                }}
                className="btn-primary w-full"
              >
                Adicionar {qty > 1 ? `${qty} unidades` : "à Sacola"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
