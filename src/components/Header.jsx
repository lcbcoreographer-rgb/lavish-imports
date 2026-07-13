import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { buildWhatsappContactLink } from "../utils/whatsapp.js";

const NAV_LINKS = [
  { label: "Início", href: "#inicio" },
  { label: "Produtos", href: "#produtos" },
  { label: "Categorias", href: "#categorias" },
  { label: "Novidades", href: "#novidades" },
  { label: "Contato", href: "#contato" },
];

export default function Header() {
  const { totalItems, openCart, lastAdded } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (lastAdded) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 500);
      return () => clearTimeout(t);
    }
  }, [lastAdded]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-black/5 bg-white/90 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#inicio" className="flex items-center gap-2 shrink-0">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-gradient font-display text-lg font-extrabold text-white shadow-glow">
            L
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
            Lavish <span className="text-gradient">Imports</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-700 transition-colors hover:text-accent-pink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={buildWhatsappContactLink(
              "Olá! Vim pelo catálogo online e gostaria de mais informações."
            )}
            target="_blank"
            rel="noreferrer"
            className="btn-whatsapp hidden sm:inline-flex"
          >
            <WhatsappIcon className="h-4 w-4" />
            WhatsApp
          </a>

          <button
            onClick={openCart}
            className={`relative grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white text-ink-900 transition-transform ${
              bump ? "scale-110" : ""
            }`}
            aria-label="Abrir sacola"
          >
            <BagIcon className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-accent-pink text-[11px] font-bold text-white shadow">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>

          <button
            className="grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white text-ink-900 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Abrir menu"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-black/5 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-paper-100 hover:text-accent-pink"
              >
                {link.label}
              </a>
            ))}
            <a
              href={buildWhatsappContactLink(
                "Olá! Vim pelo catálogo online e gostaria de mais informações."
              )}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp mt-2"
            >
              <WhatsappIcon className="h-4 w-4" />
              Chamar no WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

export function BagIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6 8h12l-1 12H7L6 8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9 8V6a3 3 0 0 1 6 0v2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MenuIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WhatsappIcon({ className }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className}>
      <path d="M16.02 3C9.4 3 4 8.37 4 15c0 2.27.63 4.4 1.72 6.22L4 29l7.94-1.65A11.9 11.9 0 0 0 16.02 27C22.65 27 28 21.63 28 15S22.65 3 16.02 3Zm0 21.7c-1.9 0-3.68-.5-5.22-1.4l-.37-.22-4.7.98.99-4.58-.24-.38A9.6 9.6 0 0 1 6.3 15c0-5.36 4.37-9.7 9.72-9.7 5.36 0 9.7 4.34 9.7 9.7s-4.34 9.7-9.7 9.7Zm5.35-7.28c-.29-.15-1.72-.85-1.99-.95-.27-.1-.46-.15-.65.15-.2.29-.75.94-.92 1.14-.17.2-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.65-1.58-.9-2.16-.24-.57-.48-.5-.65-.5h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.44s1.05 2.83 1.2 3.03c.15.2 2.06 3.15 5 4.41.7.3 1.24.48 1.67.61.7.22 1.34.19 1.84.12.56-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.2-.55-.34Z" />
    </svg>
  );
}
