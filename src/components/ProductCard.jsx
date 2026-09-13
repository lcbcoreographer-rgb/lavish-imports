import React from "react";
import { useCart } from "../context/CartContext.jsx";
import CountryFlag from "./CountryFlag.jsx";
import { normalizeCategory } from "../utils/categories.js";

export default function ProductCard({ product, onOpenDetails }) {
  const { addItem, lastAdded } = useCart();
  const justAdded = lastAdded === product.id;
  const hasPrice = typeof product.price === "number";

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-black/[0.06] bg-white transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-accent-pink/35 hover:shadow-glow">
      <button
        onClick={() => onOpenDetails(product)}
        aria-label={`Ver detalhes de ${product.name}`}
        className="relative aspect-square w-full overflow-hidden bg-paper-100"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
        <span className="absolute left-2.5 top-2.5 inline-flex items-center rounded-md bg-white/90 p-1 shadow-sm backdrop-blur-sm">
          <CountryFlag country={product.country} />
        </span>
        {product.tag ? (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-gold-gradient px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ink-900 shadow">
            {product.tag}
          </span>
        ) : null}
      </button>

      <div className="flex flex-1 flex-col gap-1.5 px-3.5 pb-3.5 pt-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent-magenta">
          {normalizeCategory(product.category)}
        </span>

        <button
          onClick={() => onOpenDetails(product)}
          className="line-clamp-2 text-left font-display text-[0.9rem] font-semibold leading-snug text-ink-900 transition-colors hover:text-accent-pink"
        >
          {product.name}
        </button>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          {hasPrice ? (
            <span className="font-display text-lg font-bold leading-none tracking-tight text-ink-900">
              {product.priceLabel}
            </span>
          ) : (
            <span className="text-xs font-semibold leading-none text-ink-500">
              Preço a combinar
            </span>
          )}

          <button
            onClick={() => (hasPrice ? addItem(product, 1) : onOpenDetails(product))}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
              hasPrice
                ? justAdded
                  ? "scale-95 bg-ink-900 text-white"
                  : "bg-brand-gradient text-white shadow hover:scale-[1.04]"
                : "border border-black/10 text-ink-700 hover:border-accent-pink/50"
            }`}
          >
            {hasPrice ? (justAdded ? "Na sacola" : "Adicionar") : "Ver"}
          </button>
        </div>
      </div>
    </article>
  );
}
