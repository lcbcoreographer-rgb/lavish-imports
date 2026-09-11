import React from "react";

export default function Filters({ search, onSearch, category, onCategory }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          type="text"
          placeholder="Buscar por nome, categoria ou país..."
          className="w-full rounded-full border border-black/10 bg-white py-3 pl-11 pr-4 text-sm text-ink-900 placeholder:text-ink-500 outline-none transition-colors focus:border-accent-pink/60"
        />
      </div>

      {category ? (
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onCategory(null)}
            className="inline-flex items-center gap-1.5 rounded-full border border-accent-pink/60 bg-accent-pink/15 px-3.5 py-1.5 text-xs font-medium text-accent-magenta transition-colors hover:bg-accent-pink/25"
            aria-label={`Remover filtro ${category}`}
          >
            <span>{category}</span>
            <CloseIcon className="h-3 w-3" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function SearchIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
