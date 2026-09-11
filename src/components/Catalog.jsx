import React, { useEffect, useMemo, useState } from "react";
import Filters from "./Filters.jsx";
import ProductCard from "./ProductCard.jsx";
import { Reveal } from "./Reveal.jsx";
import { normalizeCategory } from "../utils/categories.js";

const POR_PAGINA = 24;

export default function Catalog({ products, onOpenDetails, initialCategory, resetSignal }) {
  const [search, setSearch] = useState("");
  const [limite, setLimite] = useState(POR_PAGINA);
  const [category, setCategory] = useState(initialCategory ?? null);

  useEffect(() => {
    if (initialCategory !== undefined) {
      setCategory(initialCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal]);

  useEffect(() => {
    setLimite(POR_PAGINA);
  }, [search, category]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const name = p.name ?? "";
      const productCategory = normalizeCategory(p.category);
      const productCountry = p.country ?? "";
      const matchesSearch =
        !q ||
        name.toLowerCase().includes(q) ||
        productCategory.toLowerCase().includes(q) ||
        productCountry.toLowerCase().includes(q);
      const matchesCategory = !category || productCategory === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const visiveis = filtered.slice(0, limite);
  const restantes = filtered.length - visiveis.length;

  return (
    <section id="produtos" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <Reveal className="mb-8 flex flex-col items-center text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-pink">
          Catálogo completo
        </span>
        <h2 className="section-title mt-2">Todos os produtos</h2>
        <p className="mt-2 max-w-md text-sm text-ink-500">
          Use a busca para encontrar exatamente o que você quer.
        </p>
      </Reveal>

      <div className="mb-8">
        <Filters
          search={search}
          onSearch={setSearch}
          category={category}
          onCategory={setCategory}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card-surface rounded-2xl px-6 py-16 text-center text-ink-500">
          Nenhum produto encontrado para essa busca/filtro.
        </div>
      ) : (
        <>
          <p className="mb-4 text-xs text-ink-500">
            Mostrando {visiveis.length} de {filtered.length} produto
            {filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {visiveis.map((product) => (
              <ProductCard key={product.id} product={product} onOpenDetails={onOpenDetails} />
            ))}
          </div>

          {restantes > 0 ? (
            <div className="mt-10 flex justify-center">
              <button type="button" onClick={() => setLimite((n) => n + POR_PAGINA)} className="btn-secondary">
                Ver mais produtos
                <span className="text-ink-500">({restantes})</span>
              </button>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
