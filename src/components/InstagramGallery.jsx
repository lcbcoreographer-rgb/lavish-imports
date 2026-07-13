import React from "react";

export default function InstagramGallery({ products }) {
  const sample = products.slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mb-10 flex flex-col items-center text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-pink">
          @lavishimports
        </span>
        <h2 className="section-title mt-2">Siga no Instagram</h2>
        <span className="mt-3 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/50">
          Grid preparado com fotos do catálogo — substitua pelos posts reais do Instagram
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {sample.map((p) => (
          <div key={p.id} className="aspect-square overflow-hidden rounded-xl">
            <img
              src={p.image}
              alt={p.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        {/* TODO: substituir "#" pelo link real do Instagram da Lavish Imports */}
        <a href="#" target="_blank" rel="noreferrer" className="btn-secondary">
          <InstagramIcon className="h-4 w-4" />
          Seguir no Instagram
        </a>
      </div>
    </section>
  );
}

function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}
