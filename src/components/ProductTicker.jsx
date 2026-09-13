import React, { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Esteira contínua com as fotos reais do catálogo.
 * Entrou no lugar da foto estática do hero: mostra produto de verdade,
 * e produto que muda. Respeita prefers-reduced-motion.
 */
export default function ProductTicker({ products, speed = 38, direction = 1 }) {
  const trilho = useRef(null);

  useEffect(() => {
    const el = trilho.current;
    if (!el) return undefined;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const metade = el.scrollWidth / 2;
        const tween = gsap.to(el, {
          x: direction > 0 ? -metade : 0,
          duration: metade / speed,
          ease: "none",
          repeat: -1,
        });
        gsap.set(el, { x: direction > 0 ? 0 : -metade });
        return () => tween.kill();
      });
      return () => mm.revert();
    }, el);

    return () => ctx.revert();
  }, [products, speed, direction]);

  if (!products.length) return null;
  const fila = [...products, ...products];

  return (
    <div className="relative overflow-hidden" aria-hidden="true">
      <div ref={trilho} className="flex w-max gap-3 sm:gap-4">
        {fila.map((p, i) => (
          <figure
            key={`${p.id}-${i}`}
            className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-black/5 bg-white sm:h-36 sm:w-36"
          >
            <img
              src={p.image}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </figure>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-paper-50 to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-paper-50 to-transparent sm:w-28" />
    </div>
  );
}
