import React from "react";

const LABELS = {
  "Coreia do Sul": "Bandeira da Coreia do Sul",
  Japão: "Bandeira do Japão",
  China: "Bandeira da China",
  Tailândia: "Bandeira da Tailândia",
  Taiwan: "Bandeira de Taiwan",
  "Outras Importações": "Outras importações",
  Indefinido: "Outras importações",
};

export default function CountryFlag({ country, className = "" }) {
  const normalized = country === "Indefinido" ? "Outras Importações" : country;
  const label = LABELS[normalized] || "País de origem";

  return (
    <span
      className={`inline-flex h-4 w-6 shrink-0 overflow-hidden rounded-[3px] border border-black/10 bg-white shadow-sm ${className}`}
      role="img"
      aria-label={label}
      title={label}
    >
      {renderFlag(normalized)}
    </span>
  );
}

function renderFlag(country) {
  switch (country) {
    case "Coreia do Sul":
      return (
        <svg viewBox="0 0 36 24" className="h-full w-full" aria-hidden="true">
          <rect width="36" height="24" fill="#fff" />
          <path d="M18 6a6 6 0 0 1 0 12 3 3 0 0 1 0-6 3 3 0 0 0 0-6Z" fill="#c60c30" />
          <path d="M18 18a6 6 0 0 1 0-12 3 3 0 0 1 0 6 3 3 0 0 0 0 6Z" fill="#003478" />
          <g stroke="#111" strokeWidth="1.2">
            <path d="M7 4l4 3M6 6l4 3M5 8l4 3M25 15l4 3M26 13l4 3M27 11l4 3" />
            <path d="M28 4l-4 3M30 6l-4 3M31 8l-4 3M8 15l-4 3M10 13l-4 3M11 11l-4 3" />
          </g>
        </svg>
      );
    case "Japão":
      return (
        <svg viewBox="0 0 36 24" className="h-full w-full" aria-hidden="true">
          <rect width="36" height="24" fill="#fff" />
          <circle cx="18" cy="12" r="6" fill="#bc002d" />
        </svg>
      );
    case "China":
      return (
        <svg viewBox="0 0 36 24" className="h-full w-full" aria-hidden="true">
          <rect width="36" height="24" fill="#de2910" />
          <polygon points="7,4 8.2,7.3 11.7,7.3 8.9,9.4 10,12.7 7,10.6 4,12.7 5.1,9.4 2.3,7.3 5.8,7.3" fill="#ffde00" />
          <circle cx="15" cy="5" r="1.1" fill="#ffde00" />
          <circle cx="18" cy="8" r="1.1" fill="#ffde00" />
          <circle cx="18" cy="12" r="1.1" fill="#ffde00" />
          <circle cx="15" cy="15" r="1.1" fill="#ffde00" />
        </svg>
      );
    case "Tailândia":
      return (
        <svg viewBox="0 0 36 24" className="h-full w-full" aria-hidden="true">
          <rect width="36" height="24" fill="#a51931" />
          <rect y="4" width="36" height="4" fill="#fff" />
          <rect y="8" width="36" height="8" fill="#2d2a4a" />
          <rect y="16" width="36" height="4" fill="#fff" />
        </svg>
      );
    case "Taiwan":
      return (
        <svg viewBox="0 0 36 24" className="h-full w-full" aria-hidden="true">
          <rect width="36" height="24" fill="#fe0000" />
          <rect width="18" height="12" fill="#000095" />
          <g fill="#fff" transform="translate(9 6)">
            {Array.from({ length: 12 }).map((_, i) => (
              <rect key={i} x="-0.35" y="-5.1" width="0.7" height="3" rx="0.25" transform={`rotate(${i * 30})`} />
            ))}
            <circle r="2.6" />
            <circle r="1.35" fill="#000095" />
          </g>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 36 24" className="h-full w-full" aria-hidden="true">
          <rect width="36" height="24" fill="#f8fafc" />
          <circle cx="18" cy="12" r="7" fill="none" stroke="#0f766e" strokeWidth="1.7" />
          <path d="M11 12h14M18 5c2 2.2 3 4.5 3 7s-1 4.8-3 7M18 5c-2 2.2-3 4.5-3 7s1 4.8 3 7" fill="none" stroke="#0f766e" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
  }
}
