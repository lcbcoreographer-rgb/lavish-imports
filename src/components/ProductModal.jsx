import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";

export default function ProductModal({ product, onClose }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="fade-in-up max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-ink-900 sm:rounded-3xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img src={product.image} alt={product.name} className="h-72 w-full object-cover sm:h-80" />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white backdrop-blur-sm"
            aria-label="Fechar"
          >
            ✕
          </button>
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1.5 text-sm backdrop-blur-sm">
            {product.countryFlag} {product.country}
          </span>
        </div>

        <div className="flex flex-col gap-4 p-5 sm:p-7">
          <span className="text-xs font-semibold uppercase tracking-wide text-accent-cyan">
            {product.category}
          </span>
          <h3 className="font-display text-xl font-bold leading-snug sm:text-2xl">
            {product.name}
          </h3>
          <p className="text-sm text-white/60">
            Produto importado, selecionado pela Lavish Imports. Disponibilidade
            sujeita a estoque — confirme direto pelo WhatsApp após adicionar à
            sacola.
          </p>

          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <span
              className={`font-display text-xl font-bold ${
                typeof product.price !== "number" ? "text-white/50 text-sm" : ""
              }`}
            >
              {product.priceLabel}
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-8 w-8 place-items-center rounded-full bg-white/10 font-bold"
              >
                −
              </button>
              <span className="w-5 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="grid h-8 w-8 place-items-center rounded-full bg-white/10 font-bold"
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
      </div>
    </div>
  );
}
