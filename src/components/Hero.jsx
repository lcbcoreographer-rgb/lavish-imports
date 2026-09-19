import React from "react";
import { motion } from "framer-motion";
import { buildWhatsappContactLink } from "../utils/whatsapp.js";
import ProductTicker from "./ProductTicker.jsx";
import { TEXTOS_PADRAO } from "../lib/catalog.js";

const sobe = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero({ products, textos = TEXTOS_PADRAO }) {
  const vitrine = products.slice(0, 18);

  return (
    <section id="inicio" className="relative overflow-hidden border-b border-accent-pink/10 bg-paper-50">
      {/* Um brilho só, atrás do título. O rosa entra como tinta, não como fundo. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[860px] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,143,184,0.30) 0%, rgba(255,61,129,0.10) 45%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-7 px-4 pb-12 pt-16 text-center sm:px-6 sm:pb-16 sm:pt-24">
        <motion.span
          custom={0}
          initial="hidden"
          animate="show"
          variants={sobe}
          className="inline-flex items-center gap-2 rounded-full border border-accent-pink/25 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-magenta"
        >
          {textos.hero_selo}
        </motion.span>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="show"
          variants={sobe}
          className="text-balance font-display text-[2.6rem] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink-900 sm:text-7xl"
        >
          {textos.hero_titulo}
          <span className="block text-gradient">{textos.hero_titulo_destaque}</span>
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="show"
          variants={sobe}
          className="max-w-lg text-pretty text-base leading-relaxed text-ink-700 sm:text-lg"
        >
          {textos.hero_subtitulo}
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="show"
          variants={sobe}
          className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
        >
          <a href="#produtos" className="btn-primary">
            Ver catálogo
          </a>
          <a
            href={buildWhatsappContactLink(
              "Olá! Vim pelo catálogo online e gostaria de mais informações."
            )}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            Chamar no WhatsApp
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        className="relative pb-14 sm:pb-20"
      >
        <ProductTicker products={vitrine} />
      </motion.div>
    </section>
  );
}
