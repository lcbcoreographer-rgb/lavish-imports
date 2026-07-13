import React from "react";
import { buildWhatsappContactLink } from "../utils/whatsapp.js";
import FloatingIcons from "./FloatingIcons.jsx";
import { Reveal } from "./Reveal.jsx";

const CTA_ICONS = ["🎁", "✨", "🧋", "🍬"];

export default function FinalCTA() {
  return (
    <section id="contato" className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 bg-brand-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.25),transparent_60%)]" />
      <FloatingIcons icons={CTA_ICONS} count={6} seed={44} className="opacity-80" />

      <Reveal className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center sm:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          Pronto para viajar pela Ásia sem sair de casa?
        </h2>
        <p className="max-w-xl text-white/90">
          Fale agora com a gente pelo WhatsApp e monte seu pedido com a ajuda
          da nossa equipe.
        </p>
        <a
          href={buildWhatsappContactLink(
            "Olá! Vim pelo catálogo online e gostaria de fazer um pedido."
          )}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-display text-base font-bold text-accent-magenta shadow-xl transition-transform hover:scale-105"
        >
          Chamar no WhatsApp agora
        </a>
      </Reveal>
    </section>
  );
}
