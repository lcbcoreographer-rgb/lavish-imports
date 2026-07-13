# Redesign: tema claro + rosa, ícones flutuantes, hero com imagem, animações (framer-motion)

## Contexto

O catálogo Lavish Imports (React + Vite + Tailwind) hoje usa um tema escuro
(`ink-950` como fundo, gradientes rosa/roxo/ciano). O pedido é transformar o
visual em um tema **claro** com **rosa** como cor de destaque principal,
adicionar **ícones flutuantes temáticos** (mochi, hashi, bubble tea, doces,
etc.), reconstruir o **Hero** com a imagem de produtos asiáticos enviada pelo
usuário ao lado do texto de destaque, melhorar **animações** em todo o site
e garantir que o catálogo funcione **fluido em mobile**.

## Decisões (via brainstorming com o usuário)

- **Fundo**: branco/rosa-pastel, com gradientes suaves entre seções.
- **Cor de destaque**: rosa (mantendo `#ff3d81` como base, com tons pastel
  `pink-50`/`pink-100` para superfícies). Dourado mantido como acento
  secundário (avaliações, badges de novidade). Ciano/violeta removidos do
  tema visual (não combinam com fundo claro + rosa).
- **Ícones flutuantes**: emojis temáticos do catálogo (🍜🧋🍡🥢🍬🎀🍘✨🎏),
  aparecem no **Hero, CategoryGrid, PopCultureSection e FinalCTA** — não no
  site inteiro, para não poluir a área de navegação/compra do catálogo.
- **Hero**: layout dividido desktop — texto à esquerda, imagem à direita
  (a imagem fornecida pelo usuário, salva em
  `public/assets/hero-asian.jpg`). Mobile empilha: badge → título → imagem →
  texto → CTAs → stats.
- **Cards de produto**: fundo rosa-pastel (não branco puro), para manter o
  tema colorido nos grids de produto.
- **Vibe**: fofo/pop — cantos bem arredondados, ícones fofos, microanimações
  divertidas (combina com público K-pop/anime/dorama).
- **Biblioteca de animação**: adicionar `framer-motion` (única dependência
  nova) para scroll-reveal, stagger em grids, transições de modal/carrinho e
  microinterações. Alternativa CSS-puro foi considerada e descartada — o
  usuário aprovou explicitamente o uso de framer-motion pelo resultado
  visual superior.

## Escopo

Redesign visual + de animação de **todo o site**, mantendo toda a lógica de
negócio existente intacta (carrinho, filtros, busca, WhatsApp, dados de
produtos). Nenhuma mudança de dados, rotas ou comportamento funcional além
do visual/animações — é uma tarefa de UI, não de features novas.

Fora de escopo: alterar `products.json`, lógica do `CartContext`, links do
WhatsApp, ou adicionar novas seções/funcionalidades de negócio.

## Design visual

### Paleta (`tailwind.config.js`)

Substituir a paleta `ink` (escura) por uma paleta clara, mantendo o nome
`ink` para os tons de texto (agora invertidos: `ink-950` vira o tom de texto
mais escuro, não mais o fundo):

- `paper` (novo): tons de fundo claro — `paper-50 #fff7fa`, `paper-100
  #ffeef4`, `paper-200 #ffe0ec` (superfícies rosa-pastel), `white`.
- `ink`: tons de texto sobre fundo claro — `ink-900 #2b1f27` (texto
  principal), `ink-700`, `ink-500`, `ink-300` (texto secundário/legendas).
- `accent`: `pink #ff3d81` (principal), `pink-soft #ff8fb8`, `magenta
  #d6478f` (hover/contraste), `gold #ffc857` (secundário, avaliações/tags).
- Remover `accent.cyan` e `accent.violet` do uso visual (podem ficar
  definidos mas não serão usados nos componentes).
- `brand-gradient`: rosa → magenta pastel (substituindo o gradiente
  rosa/roxo/violeta atual).
- `aurora-1`: gradiente de fundo do Hero em tons pastel rosa/branco (não mais
  escuro).
- `boxShadow.glow`: sombra rosa suave para fundo claro (opacidade menor que
  a atual, pensada para não pesar sobre branco).

### Tipografia

Mantém Sora (display) + Inter (body) — sem mudança.

### `index.css`

- `body` passa a usar `bg-paper-50 text-ink-900` em vez de `bg-ink-950
  text-white`.
- Scrollbar: trilho e thumb em tons claros/rosa.
- `.card-surface`: fundo `bg-white/80` (ou `bg-paper-100` para cards de
  produto), borda `border-black/5`, sombra leve.
- `.btn-secondary`: borda/texto adaptados para tema claro (borda rosa
  suave, texto `ink-900`, hover com fundo `pink-50`).
- Manter `.btn-primary`, `.btn-whatsapp`, `.text-gradient`, `.section-title`
  como classes utilitárias, com cores atualizadas para o novo tema.
- Manter as keyframes existentes (`fadeInUp`, `floatSlow`, `pulseGlow`) —
  serão reaproveitadas pelos ícones flutuantes; framer-motion assume o
  scroll-reveal.

### Componente `FloatingIcons`

Novo arquivo `src/components/FloatingIcons.jsx`:

- Recebe uma lista de emojis e um "density"/quantidade, gera posições
  pseudo-aleatórias (fixas por render, via seed simples — não recalcula a
  cada re-render) dentro do container relativo do pai.
- Cada ícone é um `<span aria-hidden>` absolutamente posicionado, com
  animação CSS de flutuação (`floatSlow` variando delay/duração) e leve
  rotação.
- `pointer-events-none`, `select-none`, tamanho responsivo (menor em
  mobile via classes Tailwind).
- Respeita `prefers-reduced-motion: reduce` (desliga a animação via CSS
  media query, ícones ficam estáticos).
- Usado dentro de: `Hero`, `CategoryGrid`, `PopCultureSection`, `FinalCTA` —
  cada um passando seu próprio subconjunto de emojis temáticos e
  quantidade (Hero mais denso, seções menores mais sutil).

### Hero

- Grid de 2 colunas no desktop (`lg:grid-cols-2`), 1 coluna mobile
  (imagem aparece após o badge/título, antes do parágrafo — ordem via
  `order-*` no Tailwind).
- Coluna texto: badge de países, `h1` com `text-gradient` no trecho de
  destaque, parágrafo, CTAs (`btn-primary` + `btn-secondary`), stats
  (mantém os 3 cards, adaptados ao tema claro).
- Coluna imagem: `public/assets/hero-asian.jpg` dentro de um wrapper com
  `rounded-[2rem]` (ou similar grande), `shadow-glow` rosa, leve moldura
  gradiente, animação de entrada (fade+slide via framer-motion) e um float
  contínuo sutil (translateY) — mesma técnica dos ícones flutuantes.
  `FloatingIcons` sobreposto ao redor da imagem para dar profundidade.
- Fundo da seção: gradiente pastel rosa/branco (`aurora-1` atualizado) em
  vez do aurora escuro atual.

### Cards de produto (`ProductCard`)

- Fundo `bg-paper-100`/rosa-pastel em vez de `card-surface` escuro.
- Badges (país/tag) com fundo translúcido claro (`bg-white/70`) e texto
  `ink-900` para contraste sobre a foto.
- Botão "Adicionar" mantém `brand-gradient`; botão "Ver Detalhes" vira
  outline rosa sobre fundo claro.
- Hover: leve elevação (`-translate-y-1`) + sombra rosa mais forte, mantido
  via CSS (não precisa de framer-motion para isso).

### Demais componentes (ajuste de tema, sem mudança estrutural)

`Header` (fundo branco/blur ao rolar, nav com underline rosa ativo),
`CategoryGrid`, `Filters` (chips rosa quando ativos), `Catalog` (empty
state, contador), `Benefits`, `Testimonials`, `InstagramGallery`, `FAQ`
(accordion com ícone rosa), `PopCultureSection` (fundo pastel + ícones
flutuantes), `FinalCTA` (gradiente rosa mantido, ícones flutuantes claros
por cima), `Footer` (fundo `paper-100`, texto `ink-700`), `CartDrawer`,
`ProductModal` (fundo branco, textos escuros) — todos recebem apenas troca
de classes de cor/tema, mantendo a mesma estrutura e lógica React atual.

### Animações (framer-motion)

- Scroll-reveal genérico: `motion.div` com `initial={{opacity:0,y:24}}`,
  `whileInView={{opacity:1,y:0}}`, `viewport={{once:true, margin:"-80px"}}`
  aplicado ao wrapper de cada seção (via um pequeno componente helper
  `Reveal` ou hook reutilizável para evitar repetição).
- Grids (categorias, produtos, cultura pop, benefícios, depoimentos):
  `staggerChildren` no container.
- `ProductModal` e `CartDrawer`: `AnimatePresence` para entrada/saída
  suave (fade + slide), substituindo o corte abrupto atual
  (`if (!isOpen) return null`).
- Botões mantêm microinteração via `whileTap`/`whileHover` do
  framer-motion (substitui os `hover:scale-*` Tailwind onde fizer sentido,
  mas pode conviver com Tailwind para casos simples).
- Respeita `prefers-reduced-motion` (framer-motion tem suporte nativo via
  `useReducedMotion`).

### Mobile

- Hero: ordem empilhada conforme acima, imagem com altura máxima
  controlada (`max-h-[320px]` ou similar) para não dominar a viewport.
- Grids de produto: mantém 2 colunas em mobile, mas revisar gaps/paddings
  para melhor toque (touch targets ≥ 40px).
- Filtros: scroll horizontal com `snap` para chips de categoria/país em
  telas pequenas (hoje já usa `flex-wrap`, avaliar troca para
  scroll-x + snap se ficar mais fluido).
- `CartDrawer`/`ProductModal`: já usam full-width/bottom-sheet em mobile —
  mantém, apenas retema.
- Testar breakpoints principais: 360px, 390px, 768px, 1024px, 1440px.

## Arquivos afetados

- `package.json` (+ `framer-motion`)
- `tailwind.config.js` (paleta/gradientes/sombras)
- `src/index.css` (base, `.card-surface`, botões, scrollbar)
- `src/components/FloatingIcons.jsx` (novo)
- `src/components/Hero.jsx` (reescrita — layout + imagem)
- `src/components/Header.jsx`, `CategoryGrid.jsx`, `Filters.jsx`,
  `Catalog.jsx`, `ProductCard.jsx`, `PopCultureSection.jsx`,
  `Benefits.jsx`, `Testimonials.jsx`, `InstagramGallery.jsx`, `FAQ.jsx`,
  `FinalCTA.jsx`, `Footer.jsx`, `CartDrawer.jsx`, `ProductModal.jsx`
  (retema + animações)
- `public/assets/hero-asian.jpg` (nova imagem, copiada da raiz do projeto)

## Testes / verificação

Sem testes automatizados no projeto atualmente. Verificação será manual:
`npm run dev`, revisar visualmente Hero/Catálogo/mobile (via resize do
navegador) e confirmar que carrinho, filtros, busca, modal e links do
WhatsApp continuam funcionando após o retema.
