import React from "react";
import { buildWhatsappContactLink } from "../utils/whatsapp.js";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/5 bg-paper-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient font-display text-base font-extrabold text-white">
                L
              </span>
              <span className="font-display text-lg font-bold text-ink-900">
                Lavish <span className="text-gradient">Imports</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-ink-500">
              Produtos importados asiáticos selecionados com curadoria e amor
              pela cultura pop.
            </p>
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
            <h4 className="font-display text-sm font-bold text-ink-900">Contato</h4>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ink-500">
              <li>
                <a
                  href={buildWhatsappContactLink(
                    "Olá! Vim pelo catálogo online e gostaria de mais informações."
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent-pink"
                >
                  WhatsApp: (41) 98749-0574
                </a>
              </li>
              {/* TODO: substituir "#" pelo link real do Instagram */}
              <li><a href="#" className="hover:text-accent-pink">Instagram: @lavishimports</a></li>
              <li className="text-ink-300">Endereço: a definir</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold text-ink-900">Atendimento</h4>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ink-500">
              <li>Segunda a Sábado</li>
              <li>09h às 19h</li>
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
