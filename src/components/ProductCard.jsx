import React from "react";
import { useCart } from "../context/CartContext.jsx";
import CountryFlag from "./CountryFlag.jsx";

export default function ProductCard({ product, onOpenDetails }) {
  const { addItem, lastAdded } = useCart();
  const justAdded = lastAdded === product.id;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-paper-100 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-accent-pink/40 hover:shadow-glow">
      <button
        onClick={() => onOpenDetails(product)}
        className="relative aspect-square w-full overflow-hidden bg-paper-200"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-2 top-2 rounded-full bg-white/85 px-2 py-1 text-xs text-ink-900 backdrop-blur-sm">
          <CountryFlag country={product.country} />
        </span>
        {product.tag && (
          <span className="absolute right-2 top-2 rounded-full bg-gold-gradient px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ink-900 shadow">
            {product.tag}
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <span className="text-[11px] font-medium uppercase tracking-wide text-accent-magenta">
          {product.category}
        </span>
        <button
          onClick={() => onOpenDetails(product)}
          className="text-left font-display text-sm font-semibold leading-snug text-ink-900 line-clamp-2 hover:text-accent-pink"
        >
          {product.name}
        </button>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span
            className={`font-display text-base font-bold ${
              typeof product.price === "number" ? "text-ink-900" : "text-ink-500 text-xs"
            }`}
          >
            {product.priceLabel}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onOpenDetails(product)}
            className="flex-1 rounded-full border border-black/10 px-3 py-2 text-xs font-semibold text-ink-700 transition-colors hover:border-accent-pink/50"
          >
            Ver Detalhes
          </button>
          <button
            onClick={() => addItem(product, 1)}
            className={`flex-1 rounded-full bg-brand-gradient px-3 py-2 text-xs font-semibold text-white shadow transition-transform ${
              justAdded ? "scale-95" : "hover:scale-[1.03]"
            }`}
          >
            {justAdded ? "Adicionado ✓" : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
}
