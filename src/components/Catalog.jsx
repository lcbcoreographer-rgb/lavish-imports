import React, { useEffect, useMemo, useState } from "react";
import Filters from "./Filters.jsx";
import ProductCard from "./ProductCard.jsx";
import { Reveal, RevealGroup, RevealItem } from "./Reveal.jsx";

const PAGE_SIZE = 24;

export default function Catalog({ products, onOpenDetails, initialCategory, resetSignal }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory ?? null);
  const [country, setCountry] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    if (initialCategory !== undefined) {
      setCategory(initialCategory);
      setVisibleCount(PAGE_SIZE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q);
      const matchesCategory = !category || p.category === category;
      const matchesCountry = !country || p.country === country;
      return matchesSearch && matchesCategory && matchesCountry;
    });
  }, [products, search, category, country]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, category, country]);

  const hasActiveFilters = Boolean(search.trim() || category || country);
  const visible = hasActiveFilters ? filtered : filtered.slice(0, visibleCount);

  return (
    <section id="produtos" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <Reveal className="mb-8 flex flex-col items-center text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-pink">
          Catálogo completo
        </span>
        <h2 className="section-title mt-2">Todos os produtos</h2>
        <p className="mt-2 max-w-md text-sm text-ink-500">
          Use a busca ou os filtros para encontrar exatamente o que você quer.
        </p>
      </Reveal>

      <div className="mb-8">
        <Filters
          products={products}
          search={search}
          onSearch={setSearch}
          category={category}
          onCategory={setCategory}
          country={country}
          onCountry={setCountry}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card-surface rounded-2xl px-6 py-16 text-center text-ink-500">
          Nenhum produto encontrado para essa busca/filtro.
        </div>
      ) : (
        <>
          <p className="mb-4 text-xs text-ink-500">
            {filtered.length} produto{filtered.length !== 1 ? "s" : ""} encontrado
            {filtered.length !== 1 ? "s" : ""}
          </p>
          <RevealGroup className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((product) => (
              <RevealItem key={product.id}>
                <ProductCard product={product} onOpenDetails={onOpenDetails} />
              </RevealItem>
            ))}
          </RevealGroup>

          {!hasActiveFilters && visibleCount < filtered.length && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                className="btn-secondary"
              >
                Carregar mais produtos
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
