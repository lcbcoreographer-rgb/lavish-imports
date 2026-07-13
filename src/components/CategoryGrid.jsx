import React from "react";
import { CATEGORIES, countByCategory } from "../utils/categories.js";

export default function CategoryGrid({ products, onSelectCategory }) {
  const counts = countByCategory(products);
  const visible = CATEGORIES.filter((c) => counts[c.key]);

  return (
    <section id="categorias" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mb-10 flex flex-col items-center text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-cyan">
          Explore por categoria
        </span>
        <h2 className="section-title mt-2">Encontre o que você procura</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {visible.map((cat) => (
          <button
            key={cat.key}
            onClick={() => onSelectCategory(cat.key)}
            className="card-surface group flex flex-col items-center gap-3 rounded-2xl px-4 py-6 text-center transition-all duration-200 hover:-translate-y-1 hover:border-accent-pink/50 hover:shadow-glow"
          >
            <span className="text-3xl transition-transform duration-200 group-hover:scale-110">
              {cat.icon}
            </span>
            <span className="font-display text-sm font-semibold leading-tight">
              {cat.label}
            </span>
            <span className="text-xs text-white/50">{counts[cat.key]} produtos</span>
          </button>
        ))}
      </div>
    </section>
  );
}
