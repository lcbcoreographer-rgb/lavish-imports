import React, { useEffect, useMemo, useState } from "react";
import { MotionConfig } from "framer-motion";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import ScrollProgress from "./components/ScrollProgress.jsx";
import MarqueeBand from "./components/MarqueeBand.jsx";
import CategoryGrid from "./components/CategoryGrid.jsx";
import Catalog from "./components/Catalog.jsx";
import PopCultureSection from "./components/PopCultureSection.jsx";
import Benefits from "./components/Benefits.jsx";
import Testimonials from "./components/Testimonials.jsx";
import InstagramGallery from "./components/InstagramGallery.jsx";
import FAQ from "./components/FAQ.jsx";
import FinalCTA from "./components/FinalCTA.jsx";
import Footer from "./components/Footer.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import ProductModal from "./components/ProductModal.jsx";
import produtosLocais from "./data/products.json";
import { getPopCultureProducts } from "./utils/popCulture.js";
import { carregarProdutos, carregarTextos, TEXTOS_PADRAO } from "./lib/catalog.js";
import { definirNumeroWhatsapp } from "./utils/whatsapp.js";

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [resetSignal, setResetSignal] = useState(0);

  // O catálogo do arquivo aparece de cara; se o Supabase responder, entra no lugar.
  // Assim a loja nunca fica em branco esperando rede.
  const [products, setProducts] = useState(produtosLocais);
  const [textos, setTextos] = useState(TEXTOS_PADRAO);

  useEffect(() => {
    let ativo = true;
    carregarProdutos().then(({ produtos }) => {
      if (ativo) setProducts(produtos);
    });
    carregarTextos().then((t) => {
      if (!ativo) return;
      definirNumeroWhatsapp(t.whatsapp_numero);
      setTextos(t);
    });
    return () => {
      ativo = false;
    };
  }, []);

  const popCultureProducts = useMemo(() => getPopCultureProducts(products), [products]);

  function handleSelectCategory(categoryKey) {
    setCategoryFilter(categoryKey);
    setResetSignal((v) => v + 1);
    const el = document.getElementById("produtos");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen">
        <ScrollProgress />
        <Header />
        <Hero products={products} textos={textos} />
        <CategoryGrid products={products} onSelectCategory={handleSelectCategory} />
        <MarqueeBand />
        <Catalog
          products={products}
          onOpenDetails={setSelectedProduct}
          initialCategory={categoryFilter}
          resetSignal={resetSignal}
        />
        <PopCultureSection products={popCultureProducts} onOpenDetails={setSelectedProduct} />
        <Benefits />
        {/* Depoimentos ocultos: os três textos do template são inventados (Ana Clara,
            Rafael M., Yasmin T.) e sem a etiqueta de "exemplo" passariam por avaliação
            real de cliente. Para reativar, troque por depoimentos verdadeiros em
            src/components/Testimonials.jsx e descomente a linha abaixo. */}
        {/* <Testimonials /> */}
        <InstagramGallery products={products} />
        <FAQ />
        <FinalCTA />
        <Footer textos={textos} />

        <CartDrawer />
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      </div>
    </MotionConfig>
  );
}
