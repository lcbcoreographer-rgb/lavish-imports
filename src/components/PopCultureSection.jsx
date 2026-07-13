import React from "react";
import { useCart } from "../context/CartContext.jsx";
import FloatingIcons from "./FloatingIcons.jsx";
import { Reveal } from "./Reveal.jsx";

const POP_ICONS = ["🎤", "🎬", "💫", "🎀"];

export default function PopCultureSection({ products, onOpenDetails }) {
  const { addItem } = useCart();

  if (products.length === 0) return null;

  return (
    <section id="novidades" className="relative overflow-hidden bg-paper-100 py-16 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,61,129,0.12),transparent_45%)]" />
      <FloatingIcons icons={POP_ICONS} count={6} seed={33} className="opacity-70" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-10 flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-pink/30 bg-accent-pink/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-magenta">
            ✨ Doramas · K-pop · Animes
          </span>
          <h2 className="section-title mt-3">Edição especial cultura pop</h2>
          <p className="mt-2 max-w-lg text-sm text-ink-500">
            Produtos licenciados e colaborações exclusivas com seus personagens,
            grupos e séries favoritas.
          </p>
        </Reveal>

        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative w-56 shrink-0 snap-start overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card sm:w-64"
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
                <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-magenta shadow">
                  Exclusivo
                </span>
              </button>
              <div className="flex flex-col gap-2 p-3.5">
                <p className="line-clamp-2 font-display text-sm font-semibold leading-snug text-ink-900">
                  {product.name}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-ink-900">
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
