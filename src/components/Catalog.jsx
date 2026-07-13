import React, { useEffect, useMemo, useState } from "react";
import Filters from "./Filters.jsx";
import ProductCard from "./ProductCard.jsx";
import { Reveal } from "./Reveal.jsx";

export default function Catalog({ products, onOpenDetails, initialCategory, resetSignal }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory ?? null);
  const [country, setCountry] = useState(null);

  useEffect(() => {
    if (initialCategory !== undefined) {
      setCategory(initialCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const name = p.name ?? "";
      const productCategory = p.category ?? "";
      const productCountry = p.country ?? "";
      const matchesSearch =
        !q ||
        name.toLowerCase().includes(q) ||
        productCategory.toLowerCase().includes(q) ||
        productCountry.toLowerCase().includes(q);
      const matchesCategory = !category || productCategory === category;
      const matchesCountry = !country || productCountry === country;
      return matchesSearch && matchesCategory && matchesCountry;
    });
  }, [products, search, category, country]);

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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onOpenDetails={onOpenDetails} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
