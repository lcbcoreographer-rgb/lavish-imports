import React from "react";

const BENEFITS = [
  { icon: "✅", title: "Produtos Originais", desc: "100% originais, importados direto dos países de origem." },
  { icon: "🎯", title: "Importação Selecionada", desc: "Curadoria criteriosa dos melhores lançamentos asiáticos." },
  { icon: "📦", title: "Estoque Atualizado", desc: "Reposição constante com novidades toda semana." },
  { icon: "⚡", title: "Atendimento Rápido", desc: "Resposta ágil e pedidos processados sem enrolação." },
  { icon: "💎", title: "Produtos Exclusivos", desc: "Itens de cultura pop difíceis de achar em qualquer lugar." },
  { icon: "💬", title: "Compra Fácil pelo WhatsApp", desc: "Monte sua sacola e finalize direto pelo WhatsApp." },
];

export default function Benefits() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mb-10 flex flex-col items-center text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-gold">
          Por que a Lavish Imports
        </span>
        <h2 className="section-title mt-2">Confiança em cada pedido</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((b) => (
          <div
            key={b.title}
            className="card-surface flex items-start gap-4 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:border-accent-gold/40"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/5 text-xl">
              {b.icon}
            </span>
            <div>
              <h3 className="font-display text-sm font-bold">{b.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-white/60">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
