-- ============================================================
-- Lavish Imports — banco do painel administrativo
-- As tabelas usam o prefixo lavish_ e o bucket se chama lavish-produtos,
-- para conviverem sem colisão com o que já existe neste projeto Supabase.
-- Rode este arquivo uma vez no SQL Editor do Supabase.
-- ============================================================

-- ---------- Produtos ----------
create table if not exists public.lavish_products (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  category     text not null,
  country      text,
  country_flag text,
  price        numeric(10,2),          -- nulo = "preço a combinar"
  tag          text,                   -- selo opcional: "Novidade", "Mais vendido"...
  image_url    text,
  sort_order   integer not null default 0,
  active       boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists lavish_products_category_idx on public.lavish_products (category);
create index if not exists lavish_products_active_idx   on public.lavish_products (active);

-- updated_at automático
create or replace function public.lavish_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists lavish_products_touch_updated_at on public.lavish_products;
create trigger lavish_products_touch_updated_at
  before update on public.lavish_products
  for each row execute function public.lavish_touch_updated_at();

-- ---------- Categorias ----------
-- Tabela própria para o dono poder renomear/reordenar sem mexer em código.
create table if not exists public.lavish_categories (
  key        text primary key,
  label      text not null,
  icon       text not null default '📦',
  sort_order integer not null default 0
);

-- ---------- Textos do site ----------
create table if not exists public.lavish_settings (
  key   text primary key,
  value text not null default ''
);

-- ---------- Segurança (RLS) ----------
-- Visitante: só lê. Dono logado: lê e escreve.
alter table public.lavish_products      enable row level security;
alter table public.lavish_categories    enable row level security;
alter table public.lavish_settings enable row level security;

drop policy if exists "produtos visiveis para todos" on public.lavish_products;
create policy "produtos visiveis para todos"
  on public.lavish_products for select
  using (active = true or auth.role() = 'authenticated');

drop policy if exists "produtos editaveis por logados" on public.lavish_products;
create policy "produtos editaveis por logados"
  on public.lavish_products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "categorias visiveis para todos" on public.lavish_categories;
create policy "categorias visiveis para todos"
  on public.lavish_categories for select using (true);

drop policy if exists "categorias editaveis por logados" on public.lavish_categories;
create policy "categorias editaveis por logados"
  on public.lavish_categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "textos visiveis para todos" on public.lavish_settings;
create policy "textos visiveis para todos"
  on public.lavish_settings for select using (true);

drop policy if exists "textos editaveis por logados" on public.lavish_settings;
create policy "textos editaveis por logados"
  on public.lavish_settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------- Storage das fotos ----------
insert into storage.buckets (id, name, public)
values ('lavish-produtos', 'lavish-produtos', true)
on conflict (id) do nothing;

drop policy if exists "lavish fotos visiveis para todos" on storage.objects;
create policy "lavish fotos visiveis para todos"
  on storage.objects for select
  using (bucket_id = 'lavish-produtos');

drop policy if exists "lavish fotos editaveis por logados" on storage.objects;
create policy "lavish fotos editaveis por logados"
  on storage.objects for all
  using (bucket_id = 'lavish-produtos' and auth.role() = 'authenticated')
  with check (bucket_id = 'lavish-produtos' and auth.role() = 'authenticated');
