/**
 * Carrega o catálogo inicial no Supabase: envia as 125 fotos para o Storage,
 * cria os produtos, as categorias e os textos padrão do site.
 *
 * Rode uma vez, depois de criar as tabelas com supabase/schema.sql:
 *
 *   SUPABASE_URL=https://xxxx.supabase.co \
 *   SUPABASE_SERVICE_KEY=eyJ... \
 *   node scripts/seed-supabase.mjs
 *
 * A service_role key ignora o RLS — use só aqui, no seu terminal, nunca no site.
 * Rodar de novo é seguro: atualiza o que já existe em vez de duplicar.
 */
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { basename } from "node:path";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;

if (!url || !key) {
  console.error("Faltou SUPABASE_URL ou SUPABASE_SERVICE_KEY. Veja o comentário no topo do arquivo.");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const produtos = JSON.parse(await readFile("src/data/products.json", "utf8"));

console.log(`Carregando ${produtos.length} produtos...\n`);

// ---------- 1. Categorias ----------
const categorias = [
  { key: "Lamens", label: "Lamens", icon: "🍜" },
  { key: "Doces e Chocolates", label: "Doces e Chocolates", icon: "🍬" },
  { key: "Bebidas Importadas", label: "Bebidas Importadas", icon: "🥤" },
  { key: "Snacks e Salgadinhos", label: "Snacks e Salgadinhos", icon: "🍘" },
  { key: "Kits e Presentes", label: "Kits e Presentes", icon: "🎁" },
  { key: "Cultura Pop", label: "Cultura Pop (K-pop/Dorama/Anime)", icon: "✨" },
].map((c, i) => ({ ...c, sort_order: i }));

const erroCategorias = (await supabase.from("lavish_categories").upsert(categorias)).error;
if (erroCategorias) {
  console.error("Erro nas categorias:", erroCategorias.message);
  process.exit(1);
}
console.log(`✓ ${categorias.length} categorias`);

// ---------- 2. Fotos ----------
let enviadas = 0;
const urlPorSlug = {};

for (const produto of produtos) {
  const arquivo = basename(produto.image);
  const caminhoLocal = `public${produto.image}`;

  let conteudo;
  try {
    conteudo = await readFile(caminhoLocal);
  } catch {
    console.warn(`  ! foto não encontrada: ${caminhoLocal}`);
    continue;
  }

  const tipo = arquivo.endsWith(".webp")
    ? "image/webp"
    : arquivo.endsWith(".png")
      ? "image/png"
      : "image/jpeg";

  const { error } = await supabase.storage.from("lavish-produtos").upload(arquivo, conteudo, {
    contentType: tipo,
    cacheControl: "31536000",
    upsert: true,
  });

  if (error) {
    console.warn(`  ! ${arquivo}: ${error.message}`);
    continue;
  }

  urlPorSlug[produto.id] = supabase.storage.from("lavish-produtos").getPublicUrl(arquivo).data.publicUrl;
  enviadas++;
  if (enviadas % 25 === 0) console.log(`  ... ${enviadas} fotos`);
}
console.log(`✓ ${enviadas} fotos no Storage`);

// ---------- 3. Produtos ----------
const linhas = produtos.map((p, i) => ({
  slug: p.id,
  name: p.name,
  category: p.category,
  country: p.country || null,
  country_flag: p.countryFlag || null,
  price: typeof p.price === "number" ? p.price : null,
  tag: p.tag || null,
  image_url: urlPorSlug[p.id] || null,
  sort_order: i,
  active: true,
}));

const erroProdutos = (await supabase.from("lavish_products").upsert(linhas, { onConflict: "slug" })).error;
if (erroProdutos) {
  console.error("Erro nos produtos:", erroProdutos.message);
  process.exit(1);
}
console.log(`✓ ${linhas.length} produtos`);

// ---------- 4. Textos ----------
const textos = {
  hero_selo: "Ásia, Europa e EUA",
  hero_titulo: "Os importados mais desejados",
  hero_titulo_destaque: "em um só lugar",
  hero_subtitulo:
    "Doces, snacks, bebidas, lamens, K-pop e anime. Você monta a sacola aqui e fecha o pedido pelo WhatsApp.",
  whatsapp_numero: "5541992884208",
  whatsapp_exibicao: "(41) 9288-4208",
  loja_endereco: "Shopping Estação Mall",
  loja_horario_semana: "Segunda a sábado, 10h às 22h",
  loja_horario_domingo: "Domingo, 14h às 20h",
  instagram_usuario: "lavish.imports_",
};

const erroTextos = (
  await supabase
    .from("lavish_settings")
    .upsert(Object.entries(textos).map(([key, value]) => ({ key, value })))
).error;
if (erroTextos) {
  console.error("Erro nos textos:", erroTextos.message);
  process.exit(1);
}
console.log(`✓ ${Object.keys(textos).length} textos`);

console.log("\nPronto. Abra /admin no site para conferir.");
