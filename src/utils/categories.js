export const CATEGORIES = [
  { key: "Lamens e Miojos", label: "Lamens e Miojos", icon: "🍜" },
  { key: "Doces Asiáticos", label: "Doces Asiáticos", icon: "🍬" },
  { key: "Bebidas Importadas", label: "Bebidas Importadas", icon: "🥤" },
  { key: "Snacks e Salgadinhos", label: "Snacks e Salgadinhos", icon: "🍘" },
  { key: "Kits e Presentes", label: "Kits e Presentes", icon: "🎁" },
  { key: "Cultura Pop", label: "Cultura Pop (K-pop/Dorama/Anime)", icon: "✨" },
];

export const COUNTRIES = [
  { key: "Coreia do Sul", label: "Coreia do Sul", flag: "🇰🇷" },
  { key: "Japão", label: "Japão", flag: "🇯🇵" },
  { key: "China", label: "China", flag: "🇨🇳" },
  { key: "Tailândia", label: "Tailândia", flag: "🇹🇭" },
  { key: "Taiwan", label: "Taiwan", flag: "🇹🇼" },
  { key: "Indonésia", label: "Indonésia", flag: "🇮🇩" },
  { key: "Estados Unidos", label: "Estados Unidos", flag: "🇺🇸" },
  { key: "Alemanha", label: "Alemanha", flag: "🇩🇪" },
  { key: "Turquia", label: "Turquia", flag: "🇹🇷" },
  { key: "Brasil", label: "Brasil", flag: "🇧🇷" },
  { key: "Outras Importações", label: "Outras Importações", flag: "🌎" },
];

// Origens com filtro próprio. Qualquer outro país cai em "Outras Importações".
export const NAMED_COUNTRIES = COUNTRIES
  .map((c) => c.key)
  .filter((k) => k !== "Outras Importações");

export const OTHER_COUNTRIES_KEY = "Outras Importações";

export function matchesCountryFilter(productCountry, selected) {
  if (!selected) return true;
  if (selected === OTHER_COUNTRIES_KEY) return !NAMED_COUNTRIES.includes(productCountry);
  return productCountry === selected;
}

export function countByCategory(products) {
  const counts = {};
  products.forEach((p) => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });
  return counts;
}

export function countByCountry(products) {
  const counts = {};
  products.forEach((p) => {
    counts[p.country] = (counts[p.country] || 0) + 1;
  });
  return counts;
}
