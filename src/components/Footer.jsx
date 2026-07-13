import React from "react";
import { buildWhatsappContactLink } from "../utils/whatsapp.js";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-ink-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient font-display text-base font-extrabold">
                L
              </span>
              <span className="font-display text-lg font-bold">
                Lavish <span className="text-gradient">Imports</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-white/55">
              Produtos importados asiáticos selecionados com curadoria e amor
              pela cultura pop.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold text-white/85">Navegação</h4>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-white/55">
              <li><a href="#inicio" className="hover:text-white">Início</a></li>
              <li><a href="#produtos" className="hover:text-white">Produtos</a></li>
              <li><a href="#categorias" className="hover:text-white">Categorias</a></li>
              <li><a href="#novidades" className="hover:text-white">Novidades</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold text-white/85">Contato</h4>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-white/55">
              <li>
                <a
                  href={buildWhatsappContactLink("Olá! Vim pelo catálogo online e gostaria de mais informações.")}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  WhatsApp: (41) 98749-0574
                </a>
              </li>
              {/* TODO: substituir "#" pelo link real do Instagram */}
              <li><a href="#" className="hover:text-white">Instagram: @lavishimports</a></li>
              <li className="text-white/40">Endereço: a definir</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold text-white/85">Atendimento</h4>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-white/55">
              <li>Segunda a Sábado</li>
              <li>09h às 19h</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          © {year} Lavish Imports. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
