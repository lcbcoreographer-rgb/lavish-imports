import React from "react";
import { CATEGORIES, countByCategory } from "../utils/categories.js";
import { Reveal, RevealGroup, RevealItem } from "./Reveal.jsx";

// A grade acompanha quantas categorias existem de fato, para nao sobrar
// coluna vazia nem cartao orfao numa segunda linha.
const GRADE_POR_QUANTIDADE = {
  1: "sm:grid-cols-1 lg:grid-cols-1",
  2: "sm:grid-cols-2 lg:grid-cols-2",
  3: "sm:grid-cols-3 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-3 lg:grid-cols-5",
  6: "sm:grid-cols-3 lg:grid-cols-6",
};

export default function CategoryGrid({ products, onSelectCategory }) {
  const counts = countByCategory(products);
  const visible = CATEGORIES.filter((c) => counts[c.key]);

  return (
    <section
      id="categorias"
      className="relative mx-auto max-w-7xl overflow-hidden px-4 pb-6 pt-16 sm:px-6 sm:pb-8 sm:pt-24"
    >
      <Reveal className="relative mb-10 flex flex-col items-center text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-magenta">
          Explore por categoria
        </span>
        <h2 className="section-title mt-2">Encontre o que você procura</h2>
      </Reveal>

      <RevealGroup
        className={`relative grid grid-cols-2 gap-4 ${
          GRADE_POR_QUANTIDADE[visible.length] ?? "sm:grid-cols-3 lg:grid-cols-4"
        }`}
      >
        {visible.map((cat) => (
          <RevealItem key={cat.key}>
            <button
              onClick={() => onSelectCategory(cat.key)}
              className="group flex w-full flex-col items-center gap-2.5 rounded-3xl border border-black/[0.06] bg-white px-4 py-7 text-center transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-accent-pink/40 hover:shadow-glow"
            >
              <span className="text-[2.25rem] transition-transform duration-300 ease-out group-hover:scale-110">
                {cat.icon}
              </span>
              <span className="font-display text-sm font-semibold leading-tight text-ink-900">
                {cat.label}
              </span>
              <span className="text-xs text-ink-500">{counts[cat.key]} produtos</span>
            </button>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
