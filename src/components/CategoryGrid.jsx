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
      className="relative mx-auto max-w-7xl px-4 pb-6 pt-16 sm:px-6 sm:pb-8 sm:pt-24"
    >
      <Reveal className="relative mb-10 flex flex-col items-center text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-magenta">
          Explore por categoria
        </span>
        <h2 className="section-title mt-2">Encontre o que você procura</h2>
      </Reveal>

      <RevealGroup
        className={`relative grid grid-cols-2 gap-3 sm:gap-4 ${
          GRADE_POR_QUANTIDADE[visible.length] ?? "sm:grid-cols-3 lg:grid-cols-4"
        }`}
      >
        {visible.map((cat) => (
          <RevealItem key={cat.key}>
            <button
              onClick={() => onSelectCategory(cat.key)}
              className="group relative flex aspect-[5/4] w-full flex-col overflow-hidden rounded-3xl border border-accent-pink/15 bg-paper-100 text-left transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-accent-pink/45 hover:shadow-glow"
            >
              {/* selo de contagem, como etiqueta de prateleira */}
              <span className="absolute right-3 top-3 z-10 rounded-full bg-white/95 px-2.5 py-1 font-display text-[11px] font-bold text-ink-900 shadow-sm">
                {counts[cat.key]}
              </span>

              <span
                aria-hidden="true"
                className="flex flex-1 items-center justify-center text-[3.25rem] transition-transform duration-300 ease-out group-hover:scale-110 sm:text-6xl"
              >
                {cat.icon}
              </span>

              {/* faixa de identificação, no vocabulário de etiqueta de loja */}
              <span className="relative z-10 block bg-brand-gradient px-3.5 py-3 font-display text-[0.8rem] font-bold leading-tight text-white sm:text-sm">
                {cat.label}
              </span>
            </button>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
