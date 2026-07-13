const KEYWORDS = [
  "pokemon", "pokémon", "naruto", "spongebob", "minions", "seventeen",
  "bts", "anime", "dorama", "hello kitty", "sanrio", "doraemon",
  "one piece", "demon slayer", "miffy", "line friends", "bt21",
  "k-pop", "kpop", "pikachu", "stitch", "snoopy", "disney",
  "sailor moon", "totoro", "kuromi", "melody", "chiikawa",
];

export function isPopCulture(product) {
  const name = product.name.toLowerCase();
  return KEYWORDS.some((kw) => name.includes(kw));
}

export function getPopCultureProducts(products) {
  return products.filter(isPopCulture);
}
