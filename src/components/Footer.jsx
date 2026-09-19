import React from "react";
import { buildWhatsappContactLink } from "../utils/whatsapp.js";
import { TEXTOS_PADRAO } from "../lib/catalog.js";

export default function Footer({ textos = TEXTOS_PADRAO }) {
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
              WhatsApp: {textos.whatsapp_exibicao}
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
              <li>{textos.loja_endereco}</li>
              <li>{textos.loja_horario_semana}</li>
              <li>{textos.loja_horario_domingo}</li>
              <li>
                <a
                  href={`https://instagram.com/${textos.instagram_usuario}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent-pink"
                >
                  @{textos.instagram_usuario}
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
