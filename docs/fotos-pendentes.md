# Fotos pendentes de substituição

Atualizado em 11/09/2026.

O catálogo tem **125 produtos**, e **122 já aparecem sobre fundo branco**. Restam **3 pendentes**, listados no fim.

## O que mudou

As 27 fotos que ainda vinham do WhatsApp mostravam o produto no meio da prateleira da loja. 24 delas passaram por remoção de fundo (U²-Net, rodado localmente) e foram recompostas sobre branco, centralizadas em 1000×1000 com 6% de margem — o mesmo padrão das fotos de catálogo já existentes.

Essas 24 continuam marcadas com `"imageSource": "foto-real"` em `src/data/products.json`: o fundo está resolvido, mas a origem continua sendo foto de balcão, não foto oficial do fornecedor.

### Ressalva: mão visível em 7 das 24

O recorte preservou a mão de quem segurava o produto nestes itens:

- Bala de Gelatina 3D Peelable Gummies Lichia 75g
- Cloudiz Mini Biscuits Patrulha Canina Recheio de Cacau
- Biscoito ja! Biscuits Recheio de Chocolate 172g
- Marshmallow Bonjuks Chocolatey (Baunilha e Morango)
- Assorted Mini Fruit Bites Gelatina Sortida
- Bebida de Gelatina Cinnamoroll (Uva e Manga) — só uma faixa fina de dedo na borda
- Lámen Instantâneo Auto-Aquecível 225g — polegar na borda esquerda

O fundo está branco e o produto legível, então foram aprovadas. Ainda assim, foto oficial continua sendo melhor para todas elas.

## Os 3 pendentes

Não passaram na revisão e mantiveram a foto original, porque aparecem no meio de uma prateleira cheia e não há um objeto único para recortar:

| Produto | Categoria | Preço |
|---|---|---|
| Cotton Boom Gum 3 em 1 Algodão Doce 6,5g | Doces e Chocolates | R$ 7,50 |
| Pirulito Musical Music Pop 15g (Bob Esponja, Patrulha Canina, Garfield) | Doces e Chocolates | R$ 25,90 |
| Biscoito Macaron em Copo | Doces e Chocolates | R$ 26,00 |

## Como resolver

Vale para os 3 pendentes e também para as 24 tratadas, que ficariam melhores com imagem oficial:

1. **Melhor caminho:** pedir ao fornecedor (Luca) o banco de imagens oficial destes itens.
2. **Alternativa:** fotografar no balcão contra fundo branco liso — um produto por foto, de frente e bem iluminado. O tratamento (recorte, remoção de fundo e padronização 1000×1000) é automático a partir daí.

Busca de imagem já foi tentada e não resolve: foram consultadas 13 lojas de importados (entre elas Empório Daruma, H Mart, Woori Marketplace, Candy Funhouse e Germandeli), a base aberta Open Food Facts e a busca de imagens do Yandex. Para quase todos apareceu **alguma** imagem bonita — mas de produto errado. Optou-se por manter a foto real a anunciar o item errado.

---

Os 27 produtos de origem WhatsApp (os 3 pendentes e as 24 já tratadas) têm `"imageSource": "foto-real"` em `src/data/products.json`. Esse campo permite listá-los a qualquer momento:

```bash
python3 -c "import json;d=json.load(open('src/data/products.json'));print(chr(10).join(p['name'] for p in d if p['imageSource']=='foto-real'))"
```
