# Redesign Claro + Rosa (Lavish Imports) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar o catálogo Lavish Imports de tema escuro para um tema claro com rosa como cor de destaque, adicionar ícones flutuantes temáticos, reconstruir o Hero com a imagem do usuário ao lado do texto, melhorar animações com framer-motion e garantir fluidez mobile — sem alterar nenhuma lógica de negócio (carrinho, filtros, busca, WhatsApp).

**Architecture:** Retema centralizado via `tailwind.config.js` (nova paleta `paper`/`ink`/`accent`) e `src/index.css` (classes utilitárias base). Dois componentes novos e reutilizáveis (`FloatingIcons`, `Reveal`/`RevealGroup`/`RevealItem`) são consumidos pelos componentes existentes, que são reescritos in-place trocando apenas classes visuais e adicionando wrappers `motion`/`Reveal` — a árvore de componentes, props e handlers React permanecem idênticos.

**Tech Stack:** React 18, Vite, Tailwind CSS, framer-motion (nova dependência).

## Global Constraints

- Nenhuma mudança em `src/data/products.json`, `src/context/CartContext.jsx`, `src/utils/whatsapp.js`, `src/utils/categories.js`, `src/utils/popCulture.js` — apenas consumo, sem alteração de lógica.
- Cor de destaque principal: rosa `#ff3d81` (mais `#d6478f` para contraste/hover). Dourado `#ffc857` como acento secundário. Ciano/violeta removidos do uso visual.
- Fundo claro: base `#fff7fa`/`#ffffff`, superfícies rosa-pastel `#ffeef4`/`#ffe0ec`.
- Ícones flutuantes temáticos aparecem apenas em: Hero, CategoryGrid, PopCultureSection, FinalCTA.
- Cards de produto usam fundo rosa-pastel (`paper-100`), não branco puro.
- Animações de scroll/stagger via `framer-motion`; deve respeitar `prefers-reduced-motion` (framer-motion trata isso nativamente; ícones flutuantes via CSS tratam via media query dedicada).
- Imagem do Hero fica em `public/assets/hero-asian.jpg`, referenciada como `/assets/hero-asian.jpg`.
- Sem suíte de testes automatizada no projeto — verificação é manual via `npm run dev` / `npm run build` + inspeção visual.

---

## Task 1: Adicionar dependência framer-motion

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: pacote `framer-motion` disponível para `import { motion, AnimatePresence } from "framer-motion"` em todas as tasks seguintes.

- [ ] **Step 1: Adicionar a dependência**

Em `package.json`, dentro de `"dependencies"`, adicionar (mantendo ordem alfabética):

```json
"dependencies": {
  "framer-motion": "^11.3.19",
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
},
```

- [ ] **Step 2: Instalar**

Run: `npm install`
Expected: `framer-motion` aparece em `node_modules` e em `package-lock.json`, comando termina sem erro.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add framer-motion for scroll/transition animations"
```

---

## Task 2: Nova paleta de cores clara + rosa no Tailwind

**Files:**
- Modify: `tailwind.config.js`

**Interfaces:**
- Produces: tokens Tailwind usados por todas as tasks seguintes — `paper-50/100/200`, `ink-900/700/500/300`, `accent-pink/pinkSoft/magenta/gold`, `bg-aurora-1`, `bg-brand-gradient`, `bg-gold-gradient`, `shadow-glow`, `shadow-card`.

- [ ] **Step 1: Substituir o conteúdo de `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          50: "#fff9fb",
          100: "#fff0f5",
          200: "#ffe2ec",
        },
        ink: {
          900: "#2b1f27",
          700: "#5c4653",
          500: "#8a7480",
          300: "#c9b8c1",
        },
        accent: {
          pink: "#ff3d81",
          pinkSoft: "#ff8fb8",
          magenta: "#d6478f",
          gold: "#ffc857",
        },
      },
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      backgroundImage: {
        "aurora-1":
          "radial-gradient(circle at 20% 10%, rgba(255,143,184,0.35), transparent 55%), radial-gradient(circle at 85% 0%, rgba(255,61,129,0.18), transparent 50%), radial-gradient(circle at 50% 100%, rgba(255,200,87,0.15), transparent 55%)",
        "brand-gradient": "linear-gradient(135deg, #ff3d81 0%, #d6478f 100%)",
        "gold-gradient": "linear-gradient(135deg, #ffe08a 0%, #ffc857 100%)",
      },
      boxShadow: {
        glow: "0 20px 60px -15px rgba(255,61,129,0.35)",
        card: "0 10px 30px -10px rgba(43,31,39,0.15)",
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: Verificar que o build não quebra**

Run: `npm run build`
Expected: build termina com sucesso (os componentes ainda referenciam classes antigas como `bg-ink-950` nesse ponto — isso é esperado e será corrigido nas próximas tasks; o build do Tailwind não falha por classes "órfãs", apenas deixa de aplicá-las).

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.js
git commit -m "feat: replace dark palette with light paper/pink theme tokens"
```

---

## Task 3: Retema `src/index.css`

**Files:**
- Modify: `src/index.css`

**Interfaces:**
- Consumes: tokens da Task 2 (`paper-*`, `ink-*`, `accent-*`, `brand-gradient`, `shadow-glow`, `shadow-card`).
- Produces: classes `.text-gradient`, `.card-surface`, `.btn-primary`, `.btn-secondary`, `.btn-whatsapp`, `.section-title`, `.floating-icon` usadas por todos os componentes.

- [ ] **Step 1: Substituir o conteúdo de `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

body {
  @apply bg-paper-50 text-ink-900 font-body antialiased;
}

h1, h2, h3, h4 {
  @apply font-display;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-track {
  background: #fff0f5;
}
::-webkit-scrollbar-thumb {
  background: #ff8fb8;
  border-radius: 999px;
}
::-webkit-scrollbar-thumb:hover {
  background: #ff3d81;
}

@layer components {
  .text-gradient {
    background-image: linear-gradient(135deg, #ff3d81 0%, #d6478f 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .card-surface {
    @apply bg-white/90 border border-black/5 backdrop-blur-sm shadow-card;
  }

  .btn-primary {
    @apply inline-flex items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 py-3 font-display font-semibold text-white shadow-glow transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98];
  }

  .btn-secondary {
    @apply inline-flex items-center justify-center gap-2 rounded-full border border-accent-pink/25 bg-white px-6 py-3 font-display font-semibold text-ink-900 transition-all duration-200 hover:border-accent-pink/60 hover:bg-paper-100;
  }

  .btn-whatsapp {
    @apply inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 font-display text-sm font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98];
  }

  .section-title {
    @apply text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-900;
  }
}

.fade-in-up {
  animation: fadeInUp 0.5s ease both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floatSlow {
  0%, 100% { transform: translateY(0px) rotate(var(--rotate, 0deg)); }
  50% { transform: translateY(-14px) rotate(var(--rotate, 0deg)); }
}
.animate-float {
  animation: floatSlow 6s ease-in-out infinite;
}

.floating-icon {
  animation: floatSlow var(--duration, 6s) ease-in-out infinite;
  animation-delay: var(--delay, 0s);
}

@media (prefers-reduced-motion: reduce) {
  .floating-icon,
  .animate-float {
    animation: none !important;
  }
}

@keyframes pulseGlow {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
.animate-pulse-glow {
  animation: pulseGlow 2.5s ease-in-out infinite;
}
```

- [ ] **Step 2: Verificar visualmente**

Run: `npm run dev`, abrir a URL local no navegador.
Expected: fundo da página já aparece claro/rosa-pastel (mesmo com os componentes ainda não retemados individualmente — o `body` já muda). Nenhum erro no console.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: retheme base styles and buttons for light/pink theme"
```

---

## Task 4: Componente `Reveal` / `RevealGroup` / `RevealItem` (scroll animations)

**Files:**
- Create: `src/components/Reveal.jsx`

**Interfaces:**
- Consumes: `motion` de `framer-motion` (Task 1).
- Produces: `export function Reveal({ children, className, delay })`, `export function RevealGroup({ children, className })`, `export function RevealItem({ children, className })` — usados pelas tasks 7 a 21 para animar entrada de seções e grids.

- [ ] **Step 1: Criar `src/components/Reveal.jsx`**

```jsx
import React from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className = "" }) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Verificar que importa sem erro**

Run: `npm run build`
Expected: build passa (o arquivo ainda não é consumido em nenhum lugar, mas deve compilar sem erros de sintaxe/JSX).

- [ ] **Step 3: Commit**

```bash
git add src/components/Reveal.jsx
git commit -m "feat: add Reveal/RevealGroup/RevealItem scroll-animation helpers"
```

---

## Task 5: Componente `FloatingIcons`

**Files:**
- Create: `src/components/FloatingIcons.jsx`

**Interfaces:**
- Produces: `export default function FloatingIcons({ icons, count, seed, className })` — usado nas Tasks 7 (Hero), 9 (CategoryGrid), 13 (PopCultureSection), 18 (FinalCTA).
  - `icons`: array de strings (emojis).
  - `count`: número de ícones a renderizar (default 8).
  - `seed`: número usado para gerar posições determinísticas (evita reflow aleatório a cada render).
  - `className`: classes extras para o container absoluto.

- [ ] **Step 1: Criar `src/components/FloatingIcons.jsx`**

```jsx
import React, { useMemo } from "react";

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function FloatingIcons({ icons, count = 8, seed = 1, className = "" }) {
  const items = useMemo(() => {
    const rand = seededRandom(seed);
    return Array.from({ length: count }, (_, i) => {
      const icon = icons[i % icons.length];
      return {
        icon,
        top: `${Math.round(rand() * 88)}%`,
        left: `${Math.round(rand() * 92)}%`,
        size: 18 + Math.round(rand() * 18),
        duration: 5 + rand() * 4,
        delay: rand() * 4,
        rotate: Math.round(rand() * 20 - 10),
      };
    });
  }, [icons, count, seed]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {items.map((item, i) => (
        <span
          key={i}
          className="floating-icon absolute select-none opacity-70"
          style={{
            top: item.top,
            left: item.left,
            fontSize: item.size,
            "--duration": `${item.duration}s`,
            "--delay": `${item.delay}s`,
            "--rotate": `${item.rotate}deg`,
          }}
        >
          {item.icon}
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verificar build**

Run: `npm run build`
Expected: build passa sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/components/FloatingIcons.jsx
git commit -m "feat: add themed FloatingIcons decorative component"
```

---

## Task 6: Copiar a imagem do Hero para `public/assets`

**Files:**
- Create: `public/assets/hero-asian.jpg` (copiado de `hero-asian-BpKuuzxb.jpg` na raiz do projeto)

**Interfaces:**
- Produces: asset estático servido em `/assets/hero-asian.jpg`, consumido pela Task 7 (Hero).

- [ ] **Step 1: Copiar o arquivo**

Run: `cp "hero-asian-BpKuuzxb.jpg" "public/assets/hero-asian.jpg"`
Expected: arquivo `public/assets/hero-asian.jpg` criado (verificar com `ls public/assets/hero-asian.jpg`).

- [ ] **Step 2: Commit**

```bash
git add public/assets/hero-asian.jpg
git commit -m "chore: add hero product collage image asset"
```

---

## Task 7: Reescrever `Hero.jsx`

**Files:**
- Modify: `src/components/Hero.jsx`

**Interfaces:**
- Consumes: `FloatingIcons` (Task 5), `motion` de `framer-motion` (Task 1), `buildWhatsappContactLink` (existente, sem mudança), asset `/assets/hero-asian.jpg` (Task 6).
- Produces: nenhuma mudança de props — continua `Hero({ productCount })`.

- [ ] **Step 1: Substituir o conteúdo de `src/components/Hero.jsx`**

```jsx
import React from "react";
import { motion } from "framer-motion";
import { buildWhatsappContactLink } from "../utils/whatsapp.js";
import FloatingIcons from "./FloatingIcons.jsx";

const HERO_ICONS = ["🍜", "🧋", "🍡", "🥢", "🍬", "🎀", "🍘", "✨"];

export default function Hero({ productCount }) {
  return (
    <section id="inicio" className="relative overflow-hidden bg-aurora-1">
      <FloatingIcons icons={HERO_ICONS} count={10} seed={7} />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-accent-pink/20 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-magenta shadow-sm backdrop-blur-sm"
          >
            🇰🇷 🇯🇵 🇨🇳 🇹🇭 🇹🇼 Direto da Ásia para você
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight text-ink-900 sm:text-6xl"
          >
            O universo asiático que você ama,{" "}
            <span className="text-gradient">direto no seu carrinho</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="max-w-md text-base text-ink-700 sm:text-lg"
          >
            Lamens, snacks, doces, bebidas e itens exclusivos de K-pop, doramas
            e animes — importados, selecionados e prontos para chegar até
            você. Mais de {productCount} produtos esperando por você.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <a href="#produtos" className="btn-primary">
              Ver Catálogo
            </a>
            <a
              href={buildWhatsappContactLink(
                "Olá! Vim pelo catálogo online e gostaria de mais informações."
              )}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              Chamar no WhatsApp
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="mt-4 grid w-full max-w-md grid-cols-3 gap-3 sm:gap-4"
          >
            {[
              { label: "Produtos", value: `${productCount}+` },
              { label: "Países de origem", value: "5+" },
              { label: "Pedido", value: "WhatsApp" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="card-surface rounded-2xl px-3 py-4 text-center lg:text-left"
              >
                <div className="font-display text-xl font-bold text-ink-900 sm:text-2xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-[11px] text-ink-500 sm:text-xs">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <span
            className="floating-icon absolute -left-4 -top-6 text-3xl sm:-left-6"
            style={{ "--duration": "5s" }}
            aria-hidden="true"
          >
            🧋
          </span>
          <span
            className="floating-icon absolute -right-2 -bottom-6 text-3xl sm:-right-4"
            style={{ "--duration": "6.5s", "--delay": "1s" }}
            aria-hidden="true"
          >
            🍡
          </span>
          <div className="overflow-hidden rounded-[2rem] border border-white shadow-glow">
            <img
              src="/assets/hero-asian.jpg"
              alt="Seleção de snacks, doces e bebidas importados da Ásia"
              className="h-full max-h-[420px] w-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verificar visualmente**

Run: `npm run dev`, abrir no navegador.
Expected: Hero mostra badge, título, parágrafo, CTAs e stats à esquerda (desktop) e a imagem `hero-asian.jpg` à direita com cantos arredondados e sombra rosa; dois emojis flutuantes ao redor da imagem; fundo em gradiente pastel claro; nenhum erro no console. Redimensionar para ~390px de largura e confirmar que a imagem aparece **abaixo** do título/badge e **acima** do parágrafo/CTAs (ordem empilhada do DOM).

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.jsx
git commit -m "feat: rebuild Hero with split layout, product image and motion"
```

---

## Task 8: Retema `Header.jsx`

**Files:**
- Modify: `src/components/Header.jsx`

**Interfaces:**
- Consumes: `useCart` (existente, sem mudança).
- Produces: nenhuma mudança de props/exports (`BagIcon`, `MenuIcon`, `WhatsappIcon` continuam exportados iguais).

- [ ] **Step 1: Substituir o conteúdo de `src/components/Header.jsx`**

```jsx
import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { buildWhatsappContactLink } from "../utils/whatsapp.js";

const NAV_LINKS = [
  { label: "Início", href: "#inicio" },
  { label: "Produtos", href: "#produtos" },
  { label: "Categorias", href: "#categorias" },
  { label: "Novidades", href: "#novidades" },
  { label: "Contato", href: "#contato" },
];

export default function Header() {
  const { totalItems, openCart, lastAdded } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (lastAdded) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 500);
      return () => clearTimeout(t);
    }
  }, [lastAdded]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-black/5 bg-white/90 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#inicio" className="flex items-center gap-2 shrink-0">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-gradient font-display text-lg font-extrabold text-white shadow-glow">
            L
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
            Lavish <span className="text-gradient">Imports</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-700 transition-colors hover:text-accent-pink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={buildWhatsappContactLink(
              "Olá! Vim pelo catálogo online e gostaria de mais informações."
            )}
            target="_blank"
            rel="noreferrer"
            className="btn-whatsapp hidden sm:inline-flex"
          >
            <WhatsappIcon className="h-4 w-4" />
            WhatsApp
          </a>

          <button
            onClick={openCart}
            className={`relative grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white text-ink-900 transition-transform ${
              bump ? "scale-110" : ""
            }`}
            aria-label="Abrir sacola"
          >
            <BagIcon className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-accent-pink text-[11px] font-bold text-white shadow">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>

          <button
            className="grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white text-ink-900 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Abrir menu"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-black/5 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-paper-100 hover:text-accent-pink"
              >
                {link.label}
              </a>
            ))}
            <a
              href={buildWhatsappContactLink(
                "Olá! Vim pelo catálogo online e gostaria de mais informações."
              )}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp mt-2"
            >
              <WhatsappIcon className="h-4 w-4" />
              Chamar no WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

export function BagIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6 8h12l-1 12H7L6 8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9 8V6a3 3 0 0 1 6 0v2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MenuIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WhatsappIcon({ className }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className}>
      <path d="M16.02 3C9.4 3 4 8.37 4 15c0 2.27.63 4.4 1.72 6.22L4 29l7.94-1.65A11.9 11.9 0 0 0 16.02 27C22.65 27 28 21.63 28 15S22.65 3 16.02 3Zm0 21.7c-1.9 0-3.68-.5-5.22-1.4l-.37-.22-4.7.98.99-4.58-.24-.38A9.6 9.6 0 0 1 6.3 15c0-5.36 4.37-9.7 9.72-9.7 5.36 0 9.7 4.34 9.7 9.7s-4.34 9.7-9.7 9.7Zm5.35-7.28c-.29-.15-1.72-.85-1.99-.95-.27-.1-.46-.15-.65.15-.2.29-.75.94-.92 1.14-.17.2-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.65-1.58-.9-2.16-.24-.57-.48-.5-.65-.5h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.44s1.05 2.83 1.2 3.03c.15.2 2.06 3.15 5 4.41.7.3 1.24.48 1.67.61.7.22 1.34.19 1.84.12.56-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.2-.55-.34Z" />
    </svg>
  );
}
```

- [ ] **Step 2: Verificar visualmente**

Run: `npm run dev`.
Expected: header transparente no topo, fica branco/blur com sombra leve ao rolar a página; ícones do carrinho e menu com contraste correto sobre fundo claro; abrir/fechar o menu mobile (redimensionar para <1024px) funciona e mostra fundo branco.

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.jsx
git commit -m "feat: retheme Header for light background"
```

---

## Task 9: Retema `CategoryGrid.jsx` (+ ícones flutuantes + stagger)

**Files:**
- Modify: `src/components/CategoryGrid.jsx`

**Interfaces:**
- Consumes: `CATEGORIES`, `countByCategory` (existentes), `FloatingIcons` (Task 5), `RevealGroup`/`RevealItem` (Task 4).

- [ ] **Step 1: Substituir o conteúdo de `src/components/CategoryGrid.jsx`**

```jsx
import React from "react";
import { CATEGORIES, countByCategory } from "../utils/categories.js";
import FloatingIcons from "./FloatingIcons.jsx";
import { Reveal, RevealGroup, RevealItem } from "./Reveal.jsx";

const CATEGORY_ICONS = ["✨", "🍬", "🎏", "🍘"];

export default function CategoryGrid({ products, onSelectCategory }) {
  const counts = countByCategory(products);
  const visible = CATEGORIES.filter((c) => counts[c.key]);

  return (
    <section id="categorias" className="relative mx-auto max-w-7xl overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
      <FloatingIcons icons={CATEGORY_ICONS} count={5} seed={21} className="opacity-60" />

      <Reveal className="relative mb-10 flex flex-col items-center text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-magenta">
          Explore por categoria
        </span>
        <h2 className="section-title mt-2">Encontre o que você procura</h2>
      </Reveal>

      <RevealGroup className="relative grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {visible.map((cat) => (
          <RevealItem key={cat.key}>
            <button
              onClick={() => onSelectCategory(cat.key)}
              className="card-surface group flex w-full flex-col items-center gap-3 rounded-2xl px-4 py-6 text-center transition-all duration-200 hover:-translate-y-1 hover:border-accent-pink/50 hover:shadow-glow"
            >
              <span className="text-3xl transition-transform duration-200 group-hover:scale-110">
                {cat.icon}
              </span>
              <span className="font-display text-sm font-semibold leading-tight text-ink-900">
                {cat.label}
              </span>
              <span className="text-xs text-ink-500">{counts[cat.key]} produtos</span>
            </button>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
```

- [ ] **Step 2: Verificar visualmente**

Run: `npm run dev`. Rolar até a seção "Categorias".
Expected: cards de categoria aparecem com fade-in em cascata ao entrarem na viewport; ícones flutuantes sutis atrás do grid; clicar num card ainda leva ao catálogo filtrado (comportamento inalterado).

- [ ] **Step 3: Commit**

```bash
git add src/components/CategoryGrid.jsx
git commit -m "feat: retheme CategoryGrid with floating icons and stagger reveal"
```

---

## Task 10: Retema `Filters.jsx`

**Files:**
- Modify: `src/components/Filters.jsx`

**Interfaces:**
- Consumes: `CATEGORIES`, `COUNTRIES`, `countByCategory`, `countByCountry` (existentes, sem mudança de assinatura).

- [ ] **Step 1: Substituir o conteúdo de `src/components/Filters.jsx`**

```jsx
import React from "react";
import { CATEGORIES, COUNTRIES, countByCategory, countByCountry } from "../utils/categories.js";

export default function Filters({
  products,
  search,
  onSearch,
  category,
  onCategory,
  country,
  onCountry,
}) {
  const catCounts = countByCategory(products);
  const countryCounts = countByCountry(products);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          type="text"
          placeholder="Buscar por nome, categoria ou país..."
          className="w-full rounded-full border border-black/10 bg-white py-3 pl-11 pr-4 text-sm text-ink-900 placeholder:text-ink-500 outline-none transition-colors focus:border-accent-pink/60"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={category === null}
          onClick={() => onCategory(null)}
          label="Todas as categorias"
        />
        {CATEGORIES.filter((c) => catCounts[c.key]).map((c) => (
          <FilterChip
            key={c.key}
            active={category === c.key}
            onClick={() => onCategory(c.key)}
            label={`${c.icon} ${c.label} (${catCounts[c.key]})`}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={country === null}
          onClick={() => onCountry(null)}
          label="Todos os países"
          variant="country"
        />
        {COUNTRIES.filter((c) => countryCounts[c.key]).map((c) => (
          <FilterChip
            key={c.key}
            active={country === c.key}
            onClick={() => onCountry(c.key)}
            label={`${c.flag} ${c.label} (${countryCounts[c.key]})`}
            variant="country"
          />
        ))}
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, label, variant }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-150 ${
        active
          ? variant === "country"
            ? "border-accent-gold bg-accent-gold/20 text-ink-900"
            : "border-accent-pink/60 bg-accent-pink/15 text-accent-magenta"
          : "border-black/10 bg-white text-ink-700 hover:border-accent-pink/30"
      }`}
    >
      {label}
    </button>
  );
}

function SearchIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
```

- [ ] **Step 2: Verificar visualmente**

Run: `npm run dev`, ir até a seção "Todos os produtos".
Expected: campo de busca com fundo branco e borda rosa no foco; chips de categoria ativos ficam rosa, chips de país ativos ficam dourados; busca e filtros continuam funcionando (digitar filtra a lista, clicar em chip filtra).

- [ ] **Step 3: Commit**

```bash
git add src/components/Filters.jsx
git commit -m "feat: retheme Filters search and chips for light theme"
```

---

## Task 11: Retema `ProductCard.jsx`

**Files:**
- Modify: `src/components/ProductCard.jsx`

**Interfaces:**
- Consumes: `useCart` (existente, sem mudança).

- [ ] **Step 1: Substituir o conteúdo de `src/components/ProductCard.jsx`**

```jsx
import React from "react";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ product, onOpenDetails }) {
  const { addItem, lastAdded } = useCart();
  const justAdded = lastAdded === product.id;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-paper-100 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-accent-pink/40 hover:shadow-glow">
      <button
        onClick={() => onOpenDetails(product)}
        className="relative aspect-square w-full overflow-hidden bg-paper-200"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-2 top-2 rounded-full bg-white/85 px-2 py-1 text-xs text-ink-900 backdrop-blur-sm">
          {product.countryFlag}
        </span>
        {product.tag && (
          <span className="absolute right-2 top-2 rounded-full bg-gold-gradient px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ink-900 shadow">
            {product.tag}
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <span className="text-[11px] font-medium uppercase tracking-wide text-accent-magenta">
          {product.category}
        </span>
        <button
          onClick={() => onOpenDetails(product)}
          className="text-left font-display text-sm font-semibold leading-snug text-ink-900 line-clamp-2 hover:text-accent-pink"
        >
          {product.name}
        </button>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span
            className={`font-display text-base font-bold ${
              typeof product.price === "number" ? "text-ink-900" : "text-ink-500 text-xs"
            }`}
          >
            {product.priceLabel}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onOpenDetails(product)}
            className="flex-1 rounded-full border border-black/10 px-3 py-2 text-xs font-semibold text-ink-700 transition-colors hover:border-accent-pink/50"
          >
            Ver Detalhes
          </button>
          <button
            onClick={() => addItem(product, 1)}
            className={`flex-1 rounded-full bg-brand-gradient px-3 py-2 text-xs font-semibold text-white shadow transition-transform ${
              justAdded ? "scale-95" : "hover:scale-[1.03]"
            }`}
          >
            {justAdded ? "Adicionado ✓" : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verificar visualmente**

Run: `npm run dev`, rolar até o catálogo.
Expected: cards com fundo rosa-pastel, elevação e sombra rosa no hover; clicar em "Adicionar" ainda atualiza o contador do carrinho no header e mostra "Adicionado ✓" brevemente.

- [ ] **Step 3: Commit**

```bash
git add src/components/ProductCard.jsx
git commit -m "feat: retheme ProductCard with pastel pink surface"
```

---

## Task 12: Retema `Catalog.jsx` (+ stagger no grid de produtos)

**Files:**
- Modify: `src/components/Catalog.jsx`

**Interfaces:**
- Consumes: `Filters` (Task 10), `ProductCard` (Task 11), `Reveal`/`RevealGroup`/`RevealItem` (Task 4).

- [ ] **Step 1: Substituir o conteúdo de `src/components/Catalog.jsx`**

```jsx
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

  const visible = filtered.slice(0, visibleCount);

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

          {visibleCount < filtered.length && (
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
```

- [ ] **Step 2: Verificar visualmente e funcionalmente**

Run: `npm run dev`.
Expected: grid de produtos anima em cascata ao rolar até a seção; busca, filtros de categoria/país e "Carregar mais produtos" continuam funcionando exatamente como antes (mesma lógica de `useMemo`/`useState`, só a apresentação mudou).

- [ ] **Step 3: Commit**

```bash
git add src/components/Catalog.jsx
git commit -m "feat: retheme Catalog and add staggered reveal to product grid"
```

---

## Task 13: Retema `PopCultureSection.jsx` (+ ícones flutuantes)

**Files:**
- Modify: `src/components/PopCultureSection.jsx`

**Interfaces:**
- Consumes: `useCart` (existente), `FloatingIcons` (Task 5), `Reveal` (Task 4).

- [ ] **Step 1: Substituir o conteúdo de `src/components/PopCultureSection.jsx`**

```jsx
import React from "react";
import { useCart } from "../context/CartContext.jsx";
import FloatingIcons from "./FloatingIcons.jsx";
import { Reveal } from "./Reveal.jsx";

const POP_ICONS = ["🎤", "🎬", "💫", "🎀"];

export default function PopCultureSection({ products, onOpenDetails }) {
  const { addItem } = useCart();

  if (products.length === 0) return null;

  return (
    <section id="novidades" className="relative overflow-hidden bg-paper-100 py-16 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,61,129,0.12),transparent_45%)]" />
      <FloatingIcons icons={POP_ICONS} count={6} seed={33} className="opacity-70" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-10 flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-pink/30 bg-accent-pink/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-magenta">
            ✨ Doramas · K-pop · Animes
          </span>
          <h2 className="section-title mt-3">Edição especial cultura pop</h2>
          <p className="mt-2 max-w-lg text-sm text-ink-500">
            Produtos licenciados e colaborações exclusivas com seus personagens,
            grupos e séries favoritas.
          </p>
        </Reveal>

        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative w-56 shrink-0 snap-start overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card sm:w-64"
            >
              <button
                onClick={() => onOpenDetails(product)}
                className="relative block aspect-square w-full overflow-hidden"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-magenta shadow">
                  Exclusivo
                </span>
              </button>
              <div className="flex flex-col gap-2 p-3.5">
                <p className="line-clamp-2 font-display text-sm font-semibold leading-snug text-ink-900">
                  {product.name}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-ink-900">
                    {product.priceLabel}
                  </span>
                  <button
                    onClick={() => addItem(product, 1)}
                    className="rounded-full bg-brand-gradient px-3 py-1.5 text-[11px] font-semibold text-white shadow"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verificar visualmente**

Run: `npm run dev`, rolar até "Edição especial cultura pop".
Expected: fundo rosa-pastel com ícones flutuantes de fundo; cards com fundo branco; scroll horizontal com snap continua funcionando; botão "Adicionar" ainda atualiza o carrinho.

- [ ] **Step 3: Commit**

```bash
git add src/components/PopCultureSection.jsx
git commit -m "feat: retheme PopCultureSection with pastel background and floating icons"
```

---

## Task 14: Retema `Benefits.jsx` (+ stagger)

**Files:**
- Modify: `src/components/Benefits.jsx`

**Interfaces:**
- Consumes: `Reveal`/`RevealGroup`/`RevealItem` (Task 4).

- [ ] **Step 1: Substituir o conteúdo de `src/components/Benefits.jsx`**

```jsx
import React from "react";
import { Reveal, RevealGroup, RevealItem } from "./Reveal.jsx";

const BENEFITS = [
  { icon: "✅", title: "Produtos Originais", desc: "100% originais, importados direto dos países de origem." },
  { icon: "🎯", title: "Importação Selecionada", desc: "Curadoria criteriosa dos melhores lançamentos asiáticos." },
  { icon: "📦", title: "Estoque Atualizado", desc: "Reposição constante com novidades toda semana." },
  { icon: "⚡", title: "Atendimento Rápido", desc: "Resposta ágil e pedidos processados sem enrolação." },
  { icon: "💎", title: "Produtos Exclusivos", desc: "Itens de cultura pop difíceis de achar em qualquer lugar." },
  { icon: "💬", title: "Compra Fácil pelo WhatsApp", desc: "Monte sua sacola e finalize direto pelo WhatsApp." },
];

export default function Benefits() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <Reveal className="mb-10 flex flex-col items-center text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-gold">
          Por que a Lavish Imports
        </span>
        <h2 className="section-title mt-2">Confiança em cada pedido</h2>
      </Reveal>

      <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((b) => (
          <RevealItem key={b.title}>
            <div className="card-surface flex h-full items-start gap-4 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:border-accent-gold/40">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-paper-100 text-xl">
                {b.icon}
              </span>
              <div>
                <h3 className="font-display text-sm font-bold text-ink-900">{b.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-ink-500">{b.desc}</p>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
```

- [ ] **Step 2: Verificar visualmente**

Run: `npm run dev`, rolar até "Confiança em cada pedido".
Expected: cards em fundo branco/claro com ícone em bolha rosa-pastel, animação em cascata ao entrar na viewport.

- [ ] **Step 3: Commit**

```bash
git add src/components/Benefits.jsx
git commit -m "feat: retheme Benefits with stagger reveal"
```

---

## Task 15: Retema `Testimonials.jsx` (+ stagger)

**Files:**
- Modify: `src/components/Testimonials.jsx`

**Interfaces:**
- Consumes: `Reveal`/`RevealGroup`/`RevealItem` (Task 4).

- [ ] **Step 1: Substituir o conteúdo de `src/components/Testimonials.jsx`**

```jsx
import React from "react";
import { Reveal, RevealGroup, RevealItem } from "./Reveal.jsx";

const TESTIMONIALS = [
  {
    name: "Ana Clara",
    text: "Chegou tudo certinho e muito bem embalado! Os lamens coreanos são exatamente como os do dorama 😍",
    rating: 5,
  },
  {
    name: "Rafael M.",
    text: "Melhor loja de importados que já comprei. Atendimento rápido pelo WhatsApp e produtos originais.",
    rating: 5,
  },
  {
    name: "Yasmin T.",
    text: "Achei os snacks japoneses que eu procurava há meses! Virei cliente fixa.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <Reveal className="mb-10 flex flex-col items-center text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-magenta">
          Depoimentos
        </span>
        <h2 className="section-title mt-2">O que dizem sobre a gente</h2>
        <span className="mt-3 rounded-full border border-black/10 bg-paper-100 px-3 py-1 text-[11px] text-ink-500">
          Exemplo ilustrativo — substitua por depoimentos reais de clientes
        </span>
      </Reveal>

      <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <RevealItem key={t.name}>
            <div className="card-surface h-full rounded-2xl p-5">
              <div className="mb-3 text-accent-gold">{"★".repeat(t.rating)}</div>
              <p className="text-sm leading-relaxed text-ink-700">"{t.text}"</p>
              <p className="mt-4 font-display text-sm font-semibold text-ink-900">{t.name}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
```

- [ ] **Step 2: Verificar visualmente**

Run: `npm run dev`, rolar até "O que dizem sobre a gente".
Expected: cards claros com estrelas douradas, animação em cascata.

- [ ] **Step 3: Commit**

```bash
git add src/components/Testimonials.jsx
git commit -m "feat: retheme Testimonials with stagger reveal"
```

---

## Task 16: Retema `InstagramGallery.jsx`

**Files:**
- Modify: `src/components/InstagramGallery.jsx`

**Interfaces:**
- Consumes: `Reveal` (Task 4).

- [ ] **Step 1: Substituir o conteúdo de `src/components/InstagramGallery.jsx`**

```jsx
import React from "react";
import { Reveal } from "./Reveal.jsx";

export default function InstagramGallery({ products }) {
  const sample = products.slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <Reveal className="mb-10 flex flex-col items-center text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-pink">
          @lavishimports
        </span>
        <h2 className="section-title mt-2">Siga no Instagram</h2>
        <span className="mt-3 rounded-full border border-black/10 bg-paper-100 px-3 py-1 text-[11px] text-ink-500">
          Grid preparado com fotos do catálogo — substitua pelos posts reais do Instagram
        </span>
      </Reveal>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {sample.map((p) => (
          <div key={p.id} className="aspect-square overflow-hidden rounded-xl">
            <img
              src={p.image}
              alt={p.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        {/* TODO: substituir "#" pelo link real do Instagram da Lavish Imports */}
        <a href="#" target="_blank" rel="noreferrer" className="btn-secondary">
          <InstagramIcon className="h-4 w-4" />
          Seguir no Instagram
        </a>
      </div>
    </section>
  );
}

function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}
```

- [ ] **Step 2: Verificar visualmente**

Run: `npm run dev`, rolar até "Siga no Instagram".
Expected: grid de fotos em fundo claro, sem regressão visual grave (essa seção muda pouco, é majoritariamente neutra).

- [ ] **Step 3: Commit**

```bash
git add src/components/InstagramGallery.jsx
git commit -m "feat: retheme InstagramGallery section labels for light theme"
```

---

## Task 17: Retema `FAQ.jsx`

**Files:**
- Modify: `src/components/FAQ.jsx`

**Interfaces:**
- Consumes: `Reveal` (Task 4). Mantém `useState` local para item aberto (sem mudança de lógica).

- [ ] **Step 1: Substituir o conteúdo de `src/components/FAQ.jsx`**

```jsx
import React, { useState } from "react";
import { Reveal } from "./Reveal.jsx";

const FAQS = [
  {
    q: "Como funciona a entrega?",
    a: "Após finalizar seu pedido pelo WhatsApp, combinamos com você a melhor forma de entrega (retirada, motoboy ou envio pelos Correios/transportadora), prazo e valor conforme sua localização.",
  },
  {
    q: "Os produtos são originais?",
    a: "Sim! Todos os produtos são importados originais, direto dos países de origem, sem falsificações.",
  },
  {
    q: "Como faço um pedido?",
    a: "Navegue pelo catálogo, adicione os produtos desejados à sua sacola e clique em \"Finalizar Pedido\". Você será redirecionado ao WhatsApp com a lista pronta para confirmarmos com você.",
  },
  {
    q: "Quais as formas de pagamento?",
    a: "Aceitamos Pix, cartão de crédito/débito e dinheiro (na retirada). Combine a forma de pagamento diretamente pelo WhatsApp.",
  },
  {
    q: "Com que frequência chegam novidades?",
    a: "Recebemos novos lançamentos e produtos exclusivos toda semana — fique de olho na seção de Novidades e no nosso Instagram.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <Reveal className="mb-10 flex flex-col items-center text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-magenta">
          Dúvidas frequentes
        </span>
        <h2 className="section-title mt-2">Perguntas & Respostas</h2>
      </Reveal>

      <div className="flex flex-col gap-3">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="card-surface overflow-hidden rounded-2xl">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-display text-sm font-semibold text-ink-900">{item.q}</span>
                <span
                  className={`shrink-0 text-xl text-accent-pink transition-transform duration-200 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-4 text-sm leading-relaxed text-ink-700">{item.a}</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verificar visualmente**

Run: `npm run dev`, rolar até "Perguntas & Respostas".
Expected: cards claros, clicar em uma pergunta abre/fecha a resposta como antes.

- [ ] **Step 3: Commit**

```bash
git add src/components/FAQ.jsx
git commit -m "feat: retheme FAQ accordion for light theme"
```

---

## Task 18: Retema `FinalCTA.jsx` (+ ícones flutuantes)

**Files:**
- Modify: `src/components/FinalCTA.jsx`

**Interfaces:**
- Consumes: `buildWhatsappContactLink` (existente), `FloatingIcons` (Task 5), `Reveal` (Task 4).

- [ ] **Step 1: Substituir o conteúdo de `src/components/FinalCTA.jsx`**

```jsx
import React from "react";
import { buildWhatsappContactLink } from "../utils/whatsapp.js";
import FloatingIcons from "./FloatingIcons.jsx";
import { Reveal } from "./Reveal.jsx";

const CTA_ICONS = ["🎁", "✨", "🧋", "🍬"];

export default function FinalCTA() {
  return (
    <section id="contato" className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 bg-brand-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.25),transparent_60%)]" />
      <FloatingIcons icons={CTA_ICONS} count={6} seed={44} className="opacity-80" />

      <Reveal className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center sm:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          Pronto para viajar pela Ásia sem sair de casa?
        </h2>
        <p className="max-w-xl text-white/90">
          Fale agora com a gente pelo WhatsApp e monte seu pedido com a ajuda
          da nossa equipe.
        </p>
        <a
          href={buildWhatsappContactLink(
            "Olá! Vim pelo catálogo online e gostaria de fazer um pedido."
          )}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-display text-base font-bold text-accent-magenta shadow-xl transition-transform hover:scale-105"
        >
          Chamar no WhatsApp agora
        </a>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 2: Verificar visualmente**

Run: `npm run dev`, rolar até o final da página.
Expected: seção com fundo em gradiente rosa cheio, ícones flutuantes claros por cima, botão branco com texto rosa.

- [ ] **Step 3: Commit**

```bash
git add src/components/FinalCTA.jsx
git commit -m "feat: retheme FinalCTA with floating icons and reveal"
```

---

## Task 19: Retema `Footer.jsx`

**Files:**
- Modify: `src/components/Footer.jsx`

**Interfaces:**
- Consumes: `buildWhatsappContactLink` (existente, sem mudança).

- [ ] **Step 1: Substituir o conteúdo de `src/components/Footer.jsx`**

```jsx
import React from "react";
import { buildWhatsappContactLink } from "../utils/whatsapp.js";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/5 bg-paper-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient font-display text-base font-extrabold text-white">
                L
              </span>
              <span className="font-display text-lg font-bold text-ink-900">
                Lavish <span className="text-gradient">Imports</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-ink-500">
              Produtos importados asiáticos selecionados com curadoria e amor
              pela cultura pop.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold text-ink-900">Navegação</h4>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ink-500">
              <li><a href="#inicio" className="hover:text-accent-pink">Início</a></li>
              <li><a href="#produtos" className="hover:text-accent-pink">Produtos</a></li>
              <li><a href="#categorias" className="hover:text-accent-pink">Categorias</a></li>
              <li><a href="#novidades" className="hover:text-accent-pink">Novidades</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold text-ink-900">Contato</h4>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ink-500">
              <li>
                <a
                  href={buildWhatsappContactLink(
                    "Olá! Vim pelo catálogo online e gostaria de mais informações."
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent-pink"
                >
                  WhatsApp: (41) 98749-0574
                </a>
              </li>
              {/* TODO: substituir "#" pelo link real do Instagram */}
              <li><a href="#" className="hover:text-accent-pink">Instagram: @lavishimports</a></li>
              <li className="text-ink-300">Endereço: a definir</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold text-ink-900">Atendimento</h4>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ink-500">
              <li>Segunda a Sábado</li>
              <li>09h às 19h</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-black/5 pt-6 text-center text-xs text-ink-300">
          © {year} Lavish Imports. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verificar visualmente**

Run: `npm run dev`, rolar até o rodapé.
Expected: rodapé em fundo rosa-pastel claro, links com hover rosa, nenhuma quebra de layout.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.jsx
git commit -m "feat: retheme Footer for light background"
```

---

## Task 20: Retema `CartDrawer.jsx` + transição com `AnimatePresence`

**Files:**
- Modify: `src/components/CartDrawer.jsx`

**Interfaces:**
- Consumes: `useCart` (existente, sem mudança de assinatura), `buildWhatsappLink` (existente), `motion`/`AnimatePresence` de `framer-motion`.
- Note: hoje o componente faz `if (!isOpen) return null;` fora de qualquer wrapper de animação — isso impede a transição de saída. A nova versão sempre renderiza o `AnimatePresence`, e o conteúdo condicional fica **dentro** dele.

- [ ] **Step 1: Substituir o conteúdo de `src/components/CartDrawer.jsx`**

```jsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../context/CartContext.jsx";
import { buildWhatsappLink } from "../utils/whatsapp.js";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
    hasUndefinedPriceItems,
  } = useCart();

  const whatsappLink = buildWhatsappLink(items, totalPrice, hasUndefinedPriceItems);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeCart}
        >
          <motion.div
            className="flex h-full w-full max-w-md flex-col border-l border-black/5 bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
              <h3 className="font-display text-lg font-bold text-ink-900">
                Sua Sacola {totalItems > 0 && <span className="text-ink-500">({totalItems})</span>}
              </h3>
              <button
                onClick={closeCart}
                className="grid h-9 w-9 place-items-center rounded-full bg-paper-100 text-ink-900 hover:bg-paper-200"
                aria-label="Fechar sacola"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-ink-500">
                  <span className="text-4xl">🛍️</span>
                  <p className="text-sm">Sua sacola está vazia.</p>
                  <button onClick={closeCart} className="btn-secondary mt-2">
                    Continuar comprando
                  </button>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 shrink-0 rounded-xl object-cover"
                      />
                      <div className="flex flex-1 flex-col gap-1">
                        <p className="line-clamp-2 text-sm font-medium leading-snug text-ink-900">
                          {item.name}
                        </p>
                        <span className="text-xs text-ink-500">
                          {typeof item.price === "number"
                            ? `R$ ${item.price.toFixed(2).replace(".", ",")}`
                            : "Preço a combinar"}
                        </span>
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="grid h-6 w-6 place-items-center rounded-full bg-paper-100 text-xs font-bold text-ink-900"
                          >
                            −
                          </button>
                          <span className="w-4 text-center text-xs font-semibold text-ink-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="grid h-6 w-6 place-items-center rounded-full bg-paper-100 text-xs font-bold text-ink-900"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto text-[11px] font-medium text-ink-500 hover:text-accent-pink"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-black/5 px-5 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-ink-500">
                    {hasUndefinedPriceItems ? "Total estimado" : "Total"}
                  </span>
                  <span className="font-display text-xl font-bold text-ink-900">
                    R$ {totalPrice.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                {hasUndefinedPriceItems && (
                  <p className="mb-3 text-[11px] text-ink-500">
                    Alguns itens têm preço a combinar diretamente no WhatsApp.
                  </p>
                )}
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp w-full py-3.5 text-sm"
                >
                  Finalizar Pedido no WhatsApp
                </a>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Verificar funcionalmente**

Run: `npm run dev`. Adicionar um produto ao carrinho, abrir a sacola pelo ícone do header.
Expected: drawer desliza suavemente da direita, overlay tem fade; alterar quantidade, remover item e finalizar pedido no WhatsApp continuam funcionando; fechar (clicar fora ou no ✕) anima a saída em vez de sumir abruptamente.

- [ ] **Step 3: Commit**

```bash
git add src/components/CartDrawer.jsx
git commit -m "feat: retheme CartDrawer and animate open/close with framer-motion"
```

---

## Task 21: Retema `ProductModal.jsx` + transição com `AnimatePresence`

**Files:**
- Modify: `src/components/ProductModal.jsx`

**Interfaces:**
- Consumes: `useCart` (existente, sem mudança de assinatura), `motion`/`AnimatePresence` de `framer-motion`.
- Note: mesma correção estrutural do Task 20 — `if (!product) return null` sai do topo do componente; o `AnimatePresence` sempre renderiza, e o conteúdo condicional (`product &&`) fica dentro dele.

- [ ] **Step 1: Substituir o conteúdo de `src/components/ProductModal.jsx`**

```jsx
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../context/CartContext.jsx";

export default function ProductModal({ product, onClose }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <AnimatePresence
      onExitComplete={() => setQty(1)}
    >
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-black/5 bg-white sm:rounded-3xl"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img src={product.image} alt={product.name} className="h-72 w-full object-cover sm:h-80" />
              <button
                onClick={onClose}
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink-900 shadow backdrop-blur-sm"
                aria-label="Fechar"
              >
                ✕
              </button>
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-sm text-ink-900 shadow backdrop-blur-sm">
                {product.countryFlag} {product.country}
              </span>
            </div>

            <div className="flex flex-col gap-4 p-5 sm:p-7">
              <span className="text-xs font-semibold uppercase tracking-wide text-accent-magenta">
                {product.category}
              </span>
              <h3 className="font-display text-xl font-bold leading-snug text-ink-900 sm:text-2xl">
                {product.name}
              </h3>
              <p className="text-sm text-ink-500">
                Produto importado, selecionado pela Lavish Imports. Disponibilidade
                sujeita a estoque — confirme direto pelo WhatsApp após adicionar à
                sacola.
              </p>

              <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-paper-50 px-4 py-3">
                <span
                  className={`font-display text-xl font-bold text-ink-900 ${
                    typeof product.price !== "number" ? "text-sm text-ink-500" : ""
                  }`}
                >
                  {product.priceLabel}
                </span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="grid h-8 w-8 place-items-center rounded-full bg-paper-100 font-bold text-ink-900"
                  >
                    −
                  </button>
                  <span className="w-5 text-center font-semibold text-ink-900">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="grid h-8 w-8 place-items-center rounded-full bg-paper-100 font-bold text-ink-900"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  addItem(product, qty);
                  onClose();
                }}
                className="btn-primary w-full"
              >
                Adicionar {qty > 1 ? `${qty} unidades` : "à Sacola"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Verificar funcionalmente**

Run: `npm run dev`. Clicar em "Ver Detalhes" de um produto.
Expected: modal abre com fade+slide suave, ajustar quantidade funciona, "Adicionar" fecha o modal e atualiza o carrinho; fechar clicando fora ou no ✕ anima a saída; reabrir outro produto reseta a quantidade para 1.

- [ ] **Step 3: Commit**

```bash
git add src/components/ProductModal.jsx
git commit -m "feat: retheme ProductModal and animate open/close with framer-motion"
```

---

## Task 22: Verificação final — build, funcionalidade e responsividade

**Files:**
- (nenhum arquivo novo — apenas verificação; eventuais pequenos ajustes de CSS/classe encontrados nesta task devem ser corrigidos nos arquivos já modificados nas tasks anteriores)

**Interfaces:**
- N/A (task de verificação).

- [ ] **Step 1: Build de produção**

Run: `npm run build`
Expected: build conclui sem erros nem warnings de módulos faltando.

- [ ] **Step 2: Smoke test funcional no dev server**

Run: `npm run dev`, abrir no navegador.
Checklist a confirmar manualmente:
- Hero mostra imagem + texto lado a lado no desktop (≥1024px) e empilhado no mobile (<640px).
- Clicar num card de `CategoryGrid` rola até o catálogo já filtrado pela categoria.
- Busca e filtros no `Catalog` funcionam e "Carregar mais produtos" aparece/funciona quando há mais de 24 resultados.
- Adicionar produto ao carrinho (via `ProductCard`, `PopCultureSection` e `ProductModal`) atualiza o contador no `Header` e a lista no `CartDrawer`.
- `CartDrawer`: alterar quantidade, remover item, e o link "Finalizar Pedido no WhatsApp" abre `wa.me` com a mensagem esperada.
- FAQ abre/fecha itens corretamente.
- Nenhum erro no console do navegador.

- [ ] **Step 3: Verificação de responsividade**

Usar as ferramentas de desenvolvedor do navegador (modo responsivo) nas larguras: 360px, 390px, 768px, 1024px, 1440px.
Expected: sem overflow horizontal em nenhuma largura; grids de produto/categoria mantêm 2 colunas em telas pequenas; `CartDrawer` e `ProductModal` ocupam a largura/altura adequada em mobile (bottom-sheet); textos não são cortados nem sobrepostos.

- [ ] **Step 4: Verificação de `prefers-reduced-motion`**

Nas ferramentas de desenvolvedor, emular `prefers-reduced-motion: reduce` (Chrome DevTools → Rendering → Emulate CSS media feature).
Expected: ícones flutuantes ficam estáticos (sem animação de flutuação); as transições do `framer-motion` (Hero, CartDrawer, ProductModal, Reveal) ficam reduzidas/instantâneas automaticamente (comportamento nativo do framer-motion).

- [ ] **Step 5: Commit final (se houve ajustes)**

Se a verificação acima não exigiu nenhuma mudança de código, não há o que commitar nesta task. Se pequenos ajustes de classe foram necessários:

```bash
git add -A
git commit -m "fix: address visual/responsiveness issues found in final QA pass"
```
