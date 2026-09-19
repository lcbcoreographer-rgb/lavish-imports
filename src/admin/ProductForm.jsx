import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { CATEGORIES } from "../utils/categories.js";

function gerarSlug(nome) {
  return nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const VAZIO = {
  slug: "",
  name: "",
  category: CATEGORIES[0].key,
  country: "",
  country_flag: "",
  price: "",
  tag: "",
  image_url: "",
  active: true,
  sort_order: 0,
};

export default function ProductForm({ produto, onSalvo, onCancelar }) {
  const [form, setForm] = useState(VAZIO);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const inputFoto = useRef(null);

  useEffect(() => {
    if (produto) {
      setForm({
        ...VAZIO,
        ...produto,
        price: produto.price === null || produto.price === undefined ? "" : String(produto.price),
        country: produto.country || "",
        country_flag: produto.country_flag || "",
        tag: produto.tag || "",
        image_url: produto.image_url || "",
      });
    } else {
      setForm(VAZIO);
    }
    setErro("");
  }, [produto]);

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function enviarFoto(arquivo) {
    if (!arquivo) return;
    if (!arquivo.type.startsWith("image/")) {
      setErro("Esse arquivo não é uma imagem.");
      return;
    }
    if (arquivo.size > 5 * 1024 * 1024) {
      setErro("A foto passa de 5 MB. Reduza antes de enviar.");
      return;
    }

    setEnviandoFoto(true);
    setErro("");
    const extensao = arquivo.name.split(".").pop().toLowerCase();
    const base = form.slug || gerarSlug(form.name) || "produto";
    const caminho = `${base}-${Date.now()}.${extensao}`;

    const { error } = await supabase.storage
      .from("lavish-produtos")
      .upload(caminho, arquivo, { cacheControl: "31536000", upsert: true });

    setEnviandoFoto(false);
    if (error) {
      setErro(`Não deu para enviar a foto: ${error.message}`);
      return;
    }

    const { data } = supabase.storage.from("lavish-produtos").getPublicUrl(caminho);
    set("image_url", data.publicUrl);
  }

  async function salvar(e) {
    e.preventDefault();
    setErro("");

    const nome = form.name.trim();
    if (!nome) {
      setErro("O produto precisa de um nome.");
      return;
    }

    const precoTexto = String(form.price).replace(",", ".").trim();
    if (precoTexto && Number.isNaN(Number(precoTexto))) {
      setErro("O preço precisa ser um número. Deixe em branco para 'a combinar'.");
      return;
    }

    const linha = {
      slug: form.slug || gerarSlug(nome),
      name: nome,
      category: form.category,
      country: form.country.trim() || null,
      country_flag: form.country_flag.trim() || null,
      price: precoTexto === "" ? null : Number(precoTexto),
      tag: form.tag.trim() || null,
      image_url: form.image_url.trim() || null,
      active: form.active,
      sort_order: Number(form.sort_order) || 0,
    };

    setSalvando(true);
    const resposta = produto
      ? await supabase.from("lavish_products").update(linha).eq("id", produto.id)
      : await supabase.from("lavish_products").insert(linha);
    setSalvando(false);

    if (resposta.error) {
      setErro(
        resposta.error.code === "23505"
          ? "Já existe um produto com esse identificador. Mude o nome."
          : resposta.error.message
      );
      return;
    }
    onSalvo();
  }

  return (
    <form onSubmit={salvar} className="rounded-2xl bg-white p-6 shadow-card">
      <h2 className="font-display text-xl font-bold text-ink-900">
        {produto ? "Editar produto" : "Novo produto"}
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2 text-sm font-semibold text-ink-900">
          Nome
          <input
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="mt-1 w-full rounded-xl border border-ink-300/50 px-3 py-2 text-sm font-normal outline-none focus:border-accent-pink"
          />
        </label>

        <label className="text-sm font-semibold text-ink-900">
          Categoria
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="mt-1 w-full rounded-xl border border-ink-300/50 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-accent-pink"
          >
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.icon} {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-semibold text-ink-900">
          Preço (em branco = a combinar)
          <input
            inputMode="decimal"
            placeholder="21,00"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            className="mt-1 w-full rounded-xl border border-ink-300/50 px-3 py-2 text-sm font-normal outline-none focus:border-accent-pink"
          />
        </label>

        <label className="text-sm font-semibold text-ink-900">
          País
          <input
            placeholder="Coreia do Sul"
            value={form.country}
            onChange={(e) => set("country", e.target.value)}
            className="mt-1 w-full rounded-xl border border-ink-300/50 px-3 py-2 text-sm font-normal outline-none focus:border-accent-pink"
          />
        </label>

        <label className="text-sm font-semibold text-ink-900">
          Selo (opcional)
          <input
            placeholder="Novidade"
            value={form.tag}
            onChange={(e) => set("tag", e.target.value)}
            className="mt-1 w-full rounded-xl border border-ink-300/50 px-3 py-2 text-sm font-normal outline-none focus:border-accent-pink"
          />
        </label>

        <label className="text-sm font-semibold text-ink-900">
          Ordem na lista
          <input
            type="number"
            value={form.sort_order}
            onChange={(e) => set("sort_order", e.target.value)}
            className="mt-1 w-full rounded-xl border border-ink-300/50 px-3 py-2 text-sm font-normal outline-none focus:border-accent-pink"
          />
        </label>
      </div>

      {/* ---------- Foto ---------- */}
      <div className="mt-6 rounded-xl border border-ink-300/30 p-4">
        <p className="text-sm font-semibold text-ink-900">Foto do produto</p>
        <div className="mt-3 flex items-center gap-4">
          <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-paper-100">
            {form.image_url ? (
              <img src={form.image_url} alt="" className="h-full w-full object-contain" />
            ) : (
              <span className="text-xs text-ink-500">sem foto</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              ref={inputFoto}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => enviarFoto(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => inputFoto.current?.click()}
              disabled={enviandoFoto}
              className="btn-secondary"
            >
              {enviandoFoto ? "Enviando..." : form.image_url ? "Trocar foto" : "Enviar foto"}
            </button>
            {form.image_url && (
              <button
                type="button"
                onClick={() => set("image_url", "")}
                className="text-left text-xs text-ink-500 underline"
              >
                remover foto
              </button>
            )}
            <p className="text-xs text-ink-500">Quadrada, fundo branco, até 5 MB.</p>
          </div>
        </div>
      </div>

      <label className="mt-5 flex items-center gap-2 text-sm font-semibold text-ink-900">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => set("active", e.target.checked)}
          className="h-4 w-4"
        />
        Mostrar no site
      </label>

      {erro && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

      <div className="mt-6 flex gap-3">
        <button type="submit" disabled={salvando} className="btn-primary">
          {salvando ? "Salvando..." : "Salvar"}
        </button>
        <button type="button" onClick={onCancelar} className="btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  );
}
