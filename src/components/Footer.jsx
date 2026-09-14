import React from "react";
import { buildWhatsappContactLink } from "../utils/whatsapp.js";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/5 bg-paper-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <img
              src="/assets/lavish-logo.png"
              alt="Lavish Imports"
              className="h-8 w-auto"
            />
            <p className="mt-3 text-sm text-ink-500">
              Produtos importados asiáticos selecionados com curadoria e amor
              pela cultura pop.
            </p>
            <a
              href={buildWhatsappContactLink(
                "Olá! Vim pelo catálogo online e gostaria de mais informações."
              )}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-sm font-semibold text-ink-900 hover:text-accent-pink"
            >
              WhatsApp: (41) 9288-4208
            </a>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold text-ink-900">Navegação</h4>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ink-500">
              <li><a href="#inicio" className="hover:text-accent-pink">Início</a></li>
              <li><a href="#produtos" className="hover:text-accent-pink">Produtos</a></li>
              <li><a href="#categorias" className="hover:text-accent-pink">Categorias</a></li>
              <li><a href="#novidades" className="hover:text-accent-pink">Novidades</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold text-ink-900">Onde estamos</h4>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ink-500">
              <li>Shopping Estação Mall</li>
              <li>Segunda a sábado, 10h às 22h</li>
              <li>Domingo, 14h às 20h</li>
              <li>
                <a
                  href="https://instagram.com/lavish.imports_"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent-pink"
                >
                  @lavish.imports_
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-black/5 pt-6 text-center text-xs text-ink-300">
          © {year} Lavish Imports. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
