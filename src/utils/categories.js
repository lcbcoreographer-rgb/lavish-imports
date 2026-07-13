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
  { key: "Taiwan", label: "Taiwan", flag: "TW" },
  { key: "Outras Importações", label: "Outras Importações", flag: "🌎" },
];

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
