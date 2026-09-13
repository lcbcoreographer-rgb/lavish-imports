import React, { useState } from "react";
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
import products from "./data/products.json";
import { getPopCultureProducts } from "./utils/popCulture.js";

const popCultureProducts = getPopCultureProducts(products);

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [resetSignal, setResetSignal] = useState(0);

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
        <Hero products={products} />
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
        <Footer />

        <CartDrawer />
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      </div>
    </MotionConfig>
  );
}
