import React from "react";
import { Reveal, RevealGroup, RevealItem } from "./Reveal.jsx";

const TESTIMONIALS = [
  {
    name: "Ana Clara",
    text: "Chegou tudo certinho e muito bem embalado! Os lamens coreanos são exatamente como os do dorama 😍",
    rating: 5,
  },
  {
    name: "Rafael M.",
    text: "Melhor loja de importados que já comprei. Atendimento rápido pelo WhatsApp e produtos originais.",
    rating: 5,
  },
  {
    name: "Yasmin T.",
    text: "Achei os snacks japoneses que eu procurava há meses! Virei cliente fixa.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <Reveal className="mb-10 flex flex-col items-center text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-magenta">
          Depoimentos
        </span>
        <h2 className="section-title mt-2">O que dizem sobre a gente</h2>
        <span className="mt-3 rounded-full border border-black/10 bg-paper-100 px-3 py-1 text-[11px] text-ink-500">
          Exemplo ilustrativo — substitua por depoimentos reais de clientes
        </span>
      </Reveal>

      <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <RevealItem key={t.name}>
            <div className="card-surface h-full rounded-2xl p-5">
              <div className="mb-3 text-accent-gold">{"★".repeat(t.rating)}</div>
              <p className="text-sm leading-relaxed text-ink-700">"{t.text}"</p>
              <p className="mt-4 font-display text-sm font-semibold text-ink-900">{t.name}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
