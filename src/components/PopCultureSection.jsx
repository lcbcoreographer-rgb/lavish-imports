import React from "react";
import { useCart } from "../context/CartContext.jsx";

export default function PopCultureSection({ products, onOpenDetails }) {
  const { addItem } = useCart();

  if (products.length === 0) return null;

  return (
    <section id="novidades" className="relative overflow-hidden py-16 sm:py-24">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,61,129,0.12),rgba(124,58,237,0.12)_50%,rgba(34,211,238,0.12))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,61,129,0.15),transparent_45%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-pink/40 bg-accent-pink/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-pink">
            ✨ Doramas · K-pop · Animes
          </span>
          <h2 className="section-title mt-3">Edição especial cultura pop</h2>
          <p className="mt-2 max-w-lg text-sm text-white/60">
            Produtos licenciados e colaborações exclusivas com seus personagens,
            grupos e séries favoritas.
          </p>
        </div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative w-56 shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-card sm:w-64"
            >
              <button
                onClick={() => onOpenDetails(product)}
                className="relative block aspect-square w-full overflow-hidden"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute left-2 top-2 rounded-full bg-brand-gradient px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
                  Exclusivo
                </span>
              </button>
              <div className="flex flex-col gap-2 p-3.5">
                <p className="line-clamp-2 font-display text-sm font-semibold leading-snug">
                  {product.name}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-bold">
                    {product.priceLabel}
                  </span>
                  <button
                    onClick={() => addItem(product, 1)}
                    className="rounded-full bg-brand-gradient px-3 py-1.5 text-[11px] font-semibold text-white shadow"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
