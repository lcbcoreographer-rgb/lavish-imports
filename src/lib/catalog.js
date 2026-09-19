import { supabase, supabaseConfigurado } from "./supabase.js";
import produtosLocais from "../data/products.json";

// Formato que os componentes do site já consomem.
export function paraFormatoDoSite(linha) {
  return {
    id: linha.slug,
    name: linha.name,
    category: linha.category,
    country: linha.country || "",
    countryFlag: linha.country_flag || "",
    price: linha.price === null || linha.price === undefined ? null : Number(linha.price),
    priceLabel:
      linha.price === null || linha.price === undefined
        ? "Preço a combinar"
        : `R$ ${Number(linha.price).toFixed(2).replace(".", ",")}`,
    tag: linha.tag || null,
    image: linha.image_url || "",
  };
}

/**
 * Carrega o catálogo. Tenta o Supabase; se não estiver configurado ou falhar,
 * devolve o products.json que já vem no bundle — o site nunca fica vazio.
 */
export async function carregarProdutos() {
  if (!supabaseConfigurado) return { produtos: produtosLocais, origem: "local" };

  const { data, error } = await supabase
    .from("lavish_products")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) console.warn("Catálogo: caindo para o arquivo local —", error.message);
    return { produtos: produtosLocais, origem: "local" };
  }

  return { produtos: data.map(paraFormatoDoSite), origem: "supabase" };
}

export const TEXTOS_PADRAO = {
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

export async function carregarTextos() {
  if (!supabaseConfigurado) return TEXTOS_PADRAO;

  const { data, error } = await supabase.from("lavish_settings").select("key, value");
  if (error || !data) return TEXTOS_PADRAO;

  const textos = { ...TEXTOS_PADRAO };
  data.forEach((linha) => {
    if (linha.value) textos[linha.key] = linha.value;
  });
  return textos;
}
