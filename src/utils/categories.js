export const CATEGORIES = [
  { key: "Lamens", label: "Lamens", icon: "🍜" },
  { key: "Doces e Chocolates", label: "Doces e Chocolates", icon: "🍬" },
  { key: "Bebidas Importadas", label: "Bebidas Importadas", icon: "🥤" },
  { key: "Snacks e Salgadinhos", label: "Snacks e Salgadinhos", icon: "🍘" },
  { key: "Kits e Presentes", label: "Kits e Presentes", icon: "🎁" },
  { key: "Cultura Pop", label: "Cultura Pop (K-pop/Dorama/Anime)", icon: "✨" },
];

// Nomes antigos que ainda podem aparecer em dados legados.
const CATEGORY_ALIASES = {
  "Lamens e Miojos": "Lamens",
  Miojos: "Lamens",
  "Doces Asiáticos": "Doces e Chocolates",
  Doces: "Doces e Chocolates",
};

export function normalizeCategory(category) {
  if (!category) return "";
  return CATEGORY_ALIASES[category] ?? category;
}

export function countByCategory(products) {
  const counts = {};
  products.forEach((p) => {
    const key = normalizeCategory(p.category);
    if (!key) return;
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}
