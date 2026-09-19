import React, { useCallback, useEffect, useMemo, useState } from "react";
import { supabase, supabaseConfigurado } from "../lib/supabase.js";
import { CATEGORIES, normalizeCategory } from "../utils/categories.js";
import Login from "./Login.jsx";
import ProductForm from "./ProductForm.jsx";
import SettingsForm from "./SettingsForm.jsx";

function FaltaConfigurar() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-bold text-ink-900">Painel não configurado</h1>
      <p className="mt-3 text-sm text-ink-700">
        Faltam as variáveis <code>VITE_SUPABASE_URL</code> e{" "}
        <code>VITE_SUPABASE_ANON_KEY</code>. O passo a passo está em{" "}
        <code>docs/painel-admin.md</code>.
      </p>
    </div>
  );
}

export default function AdminApp() {
  const [sessao, setSessao] = useState(undefined); // undefined = ainda verificando
  const [aba, setAba] = useState("produtos");
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [editando, setEditando] = useState(null); // objeto = editar, "novo" = criar

  useEffect(() => {
    if (!supabaseConfigurado) return;
    supabase.auth.getSession().then(({ data }) => setSessao(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_evento, s) => setSessao(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const carregar = useCallback(async () => {
    setCarregando(true);
    const { data, error } = await supabase
      .from("lavish_products")
      .select("*")
      .order("category", { ascending: true })
      .order("name", { ascending: true });
    setErro(error ? error.message : "");
    setProdutos(data || []);
    setCarregando(false);
  }, []);

  useEffect(() => {
    if (sessao) carregar();
  }, [sessao, carregar]);

  const contagem = useMemo(() => {
    const c = {};
    produtos.forEach((p) => {
      const k = normalizeCategory(p.category);
      c[k] = (c[k] || 0) + 1;
    });
    return c;
  }, [produtos]);

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return produtos.filter((p) => {
      if (categoria !== "todas" && normalizeCategory(p.category) !== categoria) return false;
      if (!termo) return true;
      return (
        p.name.toLowerCase().includes(termo) ||
        (p.country || "").toLowerCase().includes(termo)
      );
    });
  }, [produtos, busca, categoria]);

  async function alternarVisibilidade(produto) {
    const { error } = await supabase
      .from("lavish_products")
      .update({ active: !produto.active })
      .eq("id", produto.id);
    if (error) setErro(error.message);
    else carregar();
  }

  async function apagar(produto) {
    const certeza = window.confirm(
      `Apagar "${produto.name}" de vez?\n\nIsso não tem como desfazer. Se você só quer tirar do site por enquanto, use "Ocultar".`
    );
    if (!certeza) return;
    const { error } = await supabase.from("lavish_products").delete().eq("id", produto.id);
    if (error) setErro(error.message);
    else carregar();
  }

  if (!supabaseConfigurado) return <FaltaConfigurar />;
  if (sessao === undefined) return <div className="p-10 text-sm text-ink-500">Carregando...</div>;
  if (!sessao) return <Login />;

  return (
    <div className="min-h-screen bg-paper-100">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img src="/assets/lavish-logo.png" alt="Lavish Imports" className="h-7 w-auto" />
            <span className="text-sm font-semibold text-ink-900">Painel</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-ink-500 hover:text-accent-pink">
              Ver site
            </a>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-sm text-ink-500 hover:text-accent-pink"
            >
              Sair
            </button>
          </div>
        </div>

        <nav className="mx-auto flex max-w-6xl gap-1 px-4 sm:px-6">
          {[
            ["produtos", "Produtos"],
            ["textos", "Textos do site"],
          ].map(([chave, rotulo]) => (
            <button
              key={chave}
              onClick={() => setAba(chave)}
              className={`-mb-px border-b-2 px-3 py-2 text-sm font-semibold ${
                aba === chave
                  ? "border-accent-pink text-accent-pink"
                  : "border-transparent text-ink-500 hover:text-ink-900"
              }`}
            >
              {rotulo}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {aba === "textos" && <SettingsForm />}

        {aba === "produtos" && editando && (
          <ProductForm
            produto={editando === "novo" ? null : editando}
            onSalvo={() => {
              setEditando(null);
              carregar();
            }}
            onCancelar={() => setEditando(null)}
          />
        )}

        {aba === "produtos" && !editando && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="font-display text-2xl font-bold text-ink-900">Produtos</h1>
                <p className="text-sm text-ink-500">
                  {produtos.length} no total · {produtos.filter((p) => !p.active).length} ocultos
                </p>
              </div>
              <button onClick={() => setEditando("novo")} className="btn-primary">
                Novo produto
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                placeholder="Buscar por nome ou país..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full rounded-xl border border-ink-300/50 bg-white px-4 py-2 text-sm outline-none focus:border-accent-pink"
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setCategoria("todas")}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  categoria === "todas"
                    ? "border-accent-pink bg-accent-pink text-white"
                    : "border-ink-300/40 bg-white text-ink-700"
                }`}
              >
                Todas ({produtos.length})
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setCategoria(c.key)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    categoria === c.key
                      ? "border-accent-pink bg-accent-pink text-white"
                      : "border-ink-300/40 bg-white text-ink-700"
                  }`}
                >
                  {c.icon} {c.label} ({contagem[c.key] || 0})
                </button>
              ))}
            </div>

            {erro && (
              <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>
            )}

            {carregando ? (
              <p className="mt-8 text-sm text-ink-500">Carregando produtos...</p>
            ) : visiveis.length === 0 ? (
              <p className="mt-8 text-sm text-ink-500">Nenhum produto encontrado com esse filtro.</p>
            ) : (
              <ul className="mt-5 divide-y divide-black/5 overflow-hidden rounded-2xl bg-white shadow-card">
                {visiveis.map((p) => (
                  <li key={p.id} className="flex items-center gap-4 p-3 sm:p-4">
                    <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-paper-100">
                      {p.image_url ? (
                        <img src={p.image_url} alt="" className="h-full w-full object-contain" />
                      ) : (
                        <span className="text-[10px] text-ink-500">sem foto</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-900">
                        {p.name}
                        {!p.active && (
                          <span className="ml-2 rounded bg-ink-300/30 px-1.5 py-0.5 text-[10px] font-bold uppercase text-ink-700">
                            oculto
                          </span>
                        )}
                      </p>
                      <p className="truncate text-xs text-ink-500">
                        {normalizeCategory(p.category)} ·{" "}
                        {p.price === null
                          ? "preço a combinar"
                          : `R$ ${Number(p.price).toFixed(2).replace(".", ",")}`}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-3 text-xs font-semibold">
                      <button onClick={() => setEditando(p)} className="text-accent-pink hover:underline">
                        Editar
                      </button>
                      <button
                        onClick={() => alternarVisibilidade(p)}
                        className="text-ink-500 hover:underline"
                      >
                        {p.active ? "Ocultar" : "Mostrar"}
                      </button>
                      <button onClick={() => apagar(p)} className="text-ink-500 hover:underline">
                        Apagar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  );
}
