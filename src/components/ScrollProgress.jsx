import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Fio fino no topo marcando quanto da página já foi percorrida. */
export default function ScrollProgress() {
  const barra = useRef(null);

  useEffect(() => {
    const el = barra.current;
    if (!el) return undefined;
    const ctx = gsap.context(() => {
      gsap.set(el, { scaleX: 0, transformOrigin: "left center" });
      gsap.to(el, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]" aria-hidden="true">
      <div ref={barra} className="h-full w-full bg-brand-gradient" />
    </div>
  );
}
