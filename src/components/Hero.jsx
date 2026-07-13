import React from "react";
import { buildWhatsappContactLink } from "../utils/whatsapp.js";

export default function Hero({ productCount }) {
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora-1" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]" />

      <div
        className="pointer-events-none absolute -left-10 top-24 h-40 w-40 rounded-full bg-accent-pink/20 blur-3xl animate-float"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 top-40 h-56 w-56 rounded-full bg-accent-cyan/20 blur-3xl animate-float"
        style={{ animationDelay: "1.5s" }}
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 pb-20 pt-16 text-center sm:px-6 sm:pb-28 sm:pt-24">
        <span className="fade-in-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/70">
          🇰🇷 🇯🇵 🇨🇳 🇹🇭 🇹🇼 Direto da Ásia para você
        </span>

        <h1
          className="fade-in-up max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl"
          style={{ animationDelay: "0.05s" }}
        >
          O universo asiático que você ama,{" "}
          <span className="text-gradient">direto no seu carrinho</span>
        </h1>

        <p
          className="fade-in-up max-w-xl text-base text-white/70 sm:text-lg"
          style={{ animationDelay: "0.1s" }}
        >
          Lamens, snacks, doces, bebidas e itens exclusivos de K-pop, doramas e
          animes — importados, selecionados e prontos para chegar até você.
          Mais de {productCount} produtos esperando por você.
        </p>

        <div
          className="fade-in-up flex flex-col gap-3 sm:flex-row"
          style={{ animationDelay: "0.15s" }}
        >
          <a href="#produtos" className="btn-primary">
            Ver Catálogo
          </a>
          <a
            href={buildWhatsappContactLink("Olá! Vim pelo catálogo online e gostaria de mais informações.")}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            Chamar no WhatsApp
          </a>
        </div>

        <div
          className="fade-in-up mt-6 grid w-full max-w-2xl grid-cols-3 gap-3 sm:gap-6"
          style={{ animationDelay: "0.2s" }}
        >
          {[
            { label: "Produtos", value: `${productCount}+` },
            { label: "Países de origem", value: "5+" },
            { label: "Pedido", value: "Via WhatsApp" },
          ].map((stat) => (
            <div key={stat.label} className="card-surface rounded-2xl px-3 py-4">
              <div className="font-display text-xl font-bold sm:text-2xl">{stat.value}</div>
              <div className="mt-1 text-[11px] text-white/55 sm:text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
