import React, { useState } from "react";

const FAQS = [
  {
    q: "Como funciona a entrega?",
    a: "Após finalizar seu pedido pelo WhatsApp, combinamos com você a melhor forma de entrega (retirada, motoboy ou envio pelos Correios/transportadora), prazo e valor conforme sua localização.",
  },
  {
    q: "Os produtos são originais?",
    a: "Sim! Todos os produtos são importados originais, direto dos países de origem, sem falsificações.",
  },
  {
    q: "Como faço um pedido?",
    a: "Navegue pelo catálogo, adicione os produtos desejados à sua sacola e clique em \"Finalizar Pedido\". Você será redirecionado ao WhatsApp com a lista pronta para confirmarmos com você.",
  },
  {
    q: "Quais as formas de pagamento?",
    a: "Aceitamos Pix, cartão de crédito/débito e dinheiro (na retirada). Combine a forma de pagamento diretamente pelo WhatsApp.",
  },
  {
    q: "Com que frequência chegam novidades?",
    a: "Recebemos novos lançamentos e produtos exclusivos toda semana — fique de olho na seção de Novidades e no nosso Instagram.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mb-10 flex flex-col items-center text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-violet">
          Dúvidas frequentes
        </span>
        <h2 className="section-title mt-2">Perguntas & Respostas</h2>
      </div>

      <div className="flex flex-col gap-3">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="card-surface overflow-hidden rounded-2xl">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-display text-sm font-semibold">{item.q}</span>
                <span
                  className={`shrink-0 text-xl text-accent-pink transition-transform duration-200 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-4 text-sm leading-relaxed text-white/65">{item.a}</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
