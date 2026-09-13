import React, { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Faixa tipográfica no vocabulário de prateleira asiática: as mesmas
 * palavras que aparecem na embalagem, em português, japonês e coreano.
 * Duas tiras correndo em sentidos opostos, levemente inclinadas.
 * É o único bloco de rosa saturado da página, e é de propósito.
 */
const PALAVRAS = [
  "IMPORTADOS",
  "輸入菓子",
  "DIRETO DA ÁSIA",
  "수입 과자",
  "DOCES E SNACKS",
  "お菓子",
  "PEDIDO NO WHATSAPP",
  "라면",
];

function Tira({ direction, className = "" }) {
  const trilho = useRef(null);

  useEffect(() => {
    const el = trilho.current;
    if (!el) return undefined;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const metade = el.scrollWidth / 2;
        gsap.set(el, { x: direction > 0 ? 0 : -metade });
        const tween = gsap.to(el, {
          x: direction > 0 ? -metade : 0,
          duration: metade / 60,
          ease: "none",
          repeat: -1,
        });
        return () => tween.kill();
      });
      return () => mm.revert();
    }, el);
    return () => ctx.revert();
  }, [direction]);

  const fila = [...PALAVRAS, ...PALAVRAS];

  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={trilho} className="flex w-max items-center gap-6 sm:gap-10">
        {fila.map((palavra, i) => (
          <span key={i} className="flex shrink-0 items-center gap-6 sm:gap-10">
            <span className="font-display text-xl font-extrabold uppercase tracking-tight sm:text-3xl">
              {palavra}
            </span>
            <span aria-hidden="true" className="text-base opacity-60 sm:text-xl">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function MarqueeBand() {
  return (
    <div className="relative isolate my-2 overflow-hidden py-6 sm:py-10" aria-hidden="true">
      <div className="-rotate-[2.5deg] bg-brand-gradient py-3 text-white shadow-glow sm:py-4">
        <Tira direction={1} />
      </div>
      <div className="mt-2 rotate-[2deg] border-y border-accent-pink/30 bg-paper-100 py-3 text-accent-magenta sm:mt-3 sm:py-4">
        <Tira direction={-1} />
      </div>
    </div>
  );
}
