import React from "react";
import { motion } from "framer-motion";
import { buildWhatsappContactLink } from "../utils/whatsapp.js";
import FloatingIcons from "./FloatingIcons.jsx";

const HERO_ICONS = ["🍜", "🧋", "🍡", "🥢", "🍬", "🎀", "🍘", "✨"];

export default function Hero({ productCount }) {
  return (
    <section id="inicio" className="relative overflow-hidden bg-aurora-1">
      <FloatingIcons icons={HERO_ICONS} count={10} seed={7} />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-accent-pink/20 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-magenta shadow-sm backdrop-blur-sm"
          >
            🌎 Importados da Ásia, Europa e muito mais
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight text-ink-900 sm:text-6xl"
          >
            Os importados mais desejados da{" "}
            <span className="text-gradient">Ásia, Europa e EUA</span> em um
            só lugar
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="max-w-md text-base text-ink-700 sm:text-lg"
          >
            Doces, snacks, bebidas, lamens, K-pop, anime e muito mais, tudo em
            um só lugar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <a href="#produtos" className="btn-primary">
              Ver Catálogo
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

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="mt-4 grid w-full max-w-lg grid-cols-3 gap-3 sm:gap-4"
          >
            {[
              { label: "Produtos", value: `${productCount}+` },
              { label: "Países de origem", value: "5+" },
              { label: "Pedido", value: "WhatsApp" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="card-surface rounded-2xl px-2 py-4 text-center sm:px-3 lg:text-left"
              >
                <div className="break-words font-display text-lg font-bold leading-tight text-ink-900 sm:text-2xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-[11px] text-ink-500 sm:text-xs">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <span
            className="floating-icon absolute -left-4 -top-6 text-3xl sm:-left-6"
            style={{ "--duration": "5s" }}
            aria-hidden="true"
          >
            🧋
          </span>
          <span
            className="floating-icon absolute -right-2 -bottom-6 text-3xl sm:-right-4"
            style={{ "--duration": "6.5s", "--delay": "1s" }}
            aria-hidden="true"
          >
            🍡
          </span>
          <div className="overflow-hidden rounded-[2rem] border border-white shadow-glow">
            <img
              src="/assets/hero-asian.jpg"
              alt="Seleção de snacks, doces e bebidas importados da Ásia"
              className="h-full max-h-[420px] w-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
