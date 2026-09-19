# Painel administrativo da Lavish

O dono entra em **lavish-imports.vercel.app/admin**, edita o catálogo e o site
muda na hora — sem redeploy, sem mexer em código.

## O que ele consegue fazer

- Cadastrar, editar, ocultar e apagar produto
- Trocar a foto de cada produto (upload direto)
- Preço, país, bandeira, selo, categoria e ordem
- Filtrar a lista por categoria e buscar por nome ou país
- Editar os textos do topo do site, o WhatsApp, o endereço, os horários e o Instagram

## Instalação (uma vez só)

### 1. O projeto no Supabase

Use o projeto Supabase que o cliente já tem — não precisa criar outro.

As tabelas deste painel usam o prefixo `lavish_` (`lavish_products`,
`lavish_categories`, `lavish_settings`) e o bucket se chama `lavish-produtos`,
justamente para conviverem com o que já existe no projeto sem colidir.

### 2. Criar as tabelas

No projeto, abra **SQL Editor**, cole o conteúdo de `supabase/schema.sql` e rode.
Isso cria as tabelas, as regras de acesso e o bucket das fotos.

### 3. Criar o usuário do dono

Em **Authentication → Users → Add user**, crie com e-mail e senha.
Marque *Auto Confirm User*. Essa é a senha que ele usa no `/admin`.

> Só quem tem usuário criado aqui consegue editar. Não existe cadastro aberto.

### 4. Carregar o catálogo atual

Em **Project Settings → API**, copie a URL do projeto e as duas chaves.
Depois, na pasta do repositório:

```bash
npm install
SUPABASE_URL=https://xxxx.supabase.co \
SUPABASE_SERVICE_KEY=<service_role key> \
node scripts/seed-supabase.mjs
```

Isso envia as 125 fotos e cria os produtos, as categorias e os textos.
Pode rodar de novo sem medo: atualiza em vez de duplicar.

> A `service_role` key ignora todas as regras de segurança. Use só no seu
> terminal, nunca no site e nunca num commit.

### 5. Ligar o site ao banco

Na Vercel, em **Settings → Environment Variables**, adicione:

| Nome | Valor |
|---|---|
| `VITE_SUPABASE_URL` | a URL do projeto |
| `VITE_SUPABASE_ANON_KEY` | a chave **anon** (a pública, não a service_role) |

Depois **Redeploy**. Pronto.

## Como o site se comporta

- **Sem as variáveis:** o site funciona igual a hoje, lendo `src/data/products.json`.
  O `/admin` avisa que falta configurar. Nada quebra.
- **Com as variáveis:** o catálogo vem do Supabase. Se o banco não responder,
  o site cai de volta no arquivo local em vez de ficar vazio.

Ou seja: o `products.json` no repositório continua sendo a rede de segurança.
Vale atualizá-lo de tempos em tempos a partir do banco.

## Segurança

- Visitante só lê. Escrita exige usuário logado (RLS no Postgres).
- A chave `anon` é pública por natureza — pode ficar no front-end. Quem protege
  o banco são as políticas de RLS, não a chave.
- Produto apagado não volta. O painel avisa e sugere "Ocultar" no lugar.
