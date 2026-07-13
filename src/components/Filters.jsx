import React from "react";
import { CATEGORIES, COUNTRIES, countByCategory, countByCountry } from "../utils/categories.js";

export default function Filters({
  products,
  search,
  onSearch,
  category,
  onCategory,
  country,
  onCountry,
}) {
  const catCounts = countByCategory(products);
  const countryCounts = countByCountry(products);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          type="text"
          placeholder="Buscar por nome, categoria ou país..."
          className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-accent-pink/50"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={category === null}
          onClick={() => onCategory(null)}
          label="Todas as categorias"
        />
        {CATEGORIES.filter((c) => catCounts[c.key]).map((c) => (
          <FilterChip
            key={c.key}
            active={category === c.key}
            onClick={() => onCategory(c.key)}
            label={`${c.icon} ${c.label} (${catCounts[c.key]})`}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={country === null}
          onClick={() => onCountry(null)}
          label="Todos os países"
          variant="country"
        />
        {COUNTRIES.filter((c) => countryCounts[c.key]).map((c) => (
          <FilterChip
            key={c.key}
            active={country === c.key}
            onClick={() => onCountry(c.key)}
            label={`${c.flag} ${c.label} (${countryCounts[c.key]})`}
            variant="country"
          />
        ))}
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, label, variant }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-150 ${
        active
          ? variant === "country"
            ? "border-accent-cyan/60 bg-accent-cyan/15 text-accent-cyan"
            : "border-accent-pink/60 bg-accent-pink/15 text-accent-pink"
          : "border-white/10 bg-white/5 text-white/65 hover:border-white/25"
      }`}
    >
      {label}
    </button>
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
