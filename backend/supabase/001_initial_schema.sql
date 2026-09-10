-- ALBA v0.3 — PostgreSQL/Supabase schema
create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null default '',
  content text not null default '',
  category_id uuid not null references public.categories(id) on update cascade,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.article_sources (
  article_id uuid not null references public.articles(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete cascade,
  primary key (article_id, source_id)
);

create index if not exists articles_status_idx on public.articles(status);
create index if not exists articles_category_idx on public.articles(category_id);
create index if not exists articles_published_idx on public.articles(published_at desc);

insert into public.categories(name,slug) values
 ('Actualidad','actualidad'),('Análisis','analisis'),('Economía','economia'),
 ('Tecnología','tecnologia'),('Ciencia','ciencia'),('Sociedad','sociedad')
on conflict (slug) do nothing;

alter table public.categories enable row level security;
alter table public.sources enable row level security;
alter table public.articles enable row level security;
alter table public.article_sources enable row level security;

-- Public read access is intentionally limited to published articles.
create policy "public can read published articles" on public.articles
for select using (status = 'published');

create policy "public can read categories" on public.categories
for select using (true);

create policy "public can read sources" on public.sources
for select using (true);

create policy "public can read article sources" on public.article_sources
for select using (exists (
  select 1 from public.articles a
  where a.id = article_id and a.status = 'published'
));

-- Administrative writes should be performed through the authenticated backend.
-- No public INSERT/UPDATE/DELETE policies are created here.