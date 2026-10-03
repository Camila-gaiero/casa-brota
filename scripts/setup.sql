-- =============================================================================
-- Casa Brota — Setup completo de Supabase
-- =============================================================================
-- Pegá este archivo entero en el SQL Editor de Supabase y dale "Run".
-- Es idempotente: podés volver a correrlo sin romper nada.
--
-- IMPORTANTE: creá el usuario administrador en Authentication > Users > Add user.
-- Este script NO crea usuarios.
-- =============================================================================

alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- products — productos de la tienda
-- -----------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric,
  materials text,
  category text check (category in ('Producto', 'Interiorismo')),
  reference_code text,
  status text not null default 'available' check (status in ('available', 'sold')),
  main_image_url text,
  gallery text[],
  is_active boolean not null default true,
  created_at timestamptz default now()
);

create unique index if not exists products_reference_code_idx on public.products (reference_code);
create index if not exists products_is_active_idx on public.products (is_active);

-- -----------------------------------------------------------------------------
-- projects — portafolio de proyectos de interiorismo
-- -----------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  location text,
  year int,
  cover_image text,
  gallery text[],
  is_active boolean not null default true,
  created_at timestamptz default now()
);

create index if not exists projects_is_active_idx on public.projects (is_active);

-- -----------------------------------------------------------------------------
-- site_content — textos e imágenes editables desde el panel /admin/contenido
-- -----------------------------------------------------------------------------
-- Un solo registro por clave. "value" guarda texto plano o la URL de una imagen.
create table if not exists public.site_content (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

-- -----------------------------------------------------------------------------
-- leads — consultas que llegan desde el formulario de contacto
-- -----------------------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  source text,
  query text,
  created_at timestamptz default now()
);

-- =============================================================================
-- Row Level Security
-- =============================================================================
-- Regla general: el público LEE (para que el sitio funcione sin sesión),
-- solo los administradores ESCRIBEN.
-- =============================================================================

alter table public.products enable row level security;
alter table public.projects enable row level security;
alter table public.site_content enable row level security;
alter table public.leads enable row level security;

-- products
drop policy if exists "Public read access" on public.products;
drop policy if exists "Admin full access" on public.products;
create policy "Public read access" on public.products for select using (true);
create policy "Admin insert access" on public.products for insert to authenticated with check (true);
create policy "Admin update access" on public.products for update to authenticated using (true) with check (true);
create policy "Admin delete access" on public.products for delete to authenticated using (true);

-- projects
drop policy if exists "Public read access" on public.projects;
drop policy if exists "Admin full access" on public.projects;
create policy "Public read access" on public.projects for select using (true);
create policy "Admin insert access" on public.projects for insert to authenticated with check (true);
create policy "Admin update access" on public.projects for update to authenticated using (true) with check (true);
create policy "Admin delete access" on public.projects for delete to authenticated using (true);

-- site_content
drop policy if exists "Public read access" on public.site_content;
drop policy if exists "Admin full access" on public.site_content;
create policy "Public read access" on public.site_content for select using (true);
create policy "Admin insert access" on public.site_content for insert to authenticated with check (true);
create policy "Admin update access" on public.site_content for update to authenticated using (true) with check (true);
create policy "Admin delete access" on public.site_content for delete to authenticated using (true);

-- leads
-- Cualquiera puede enviar una consulta (formulario público),
-- pero solo un administrador autenticado puede leerlas.
-- Nota: antes esta política exigía service_role, lo que hacía imposible
-- leer los leads desde el panel.
drop policy if exists "Allow public insert access" on public.leads;
drop policy if exists "Allow admin read access" on public.leads;
drop policy if exists "Public read access" on public.leads;
create policy "Allow public insert access" on public.leads for insert with check (true);
create policy "Allow admin read access" on public.leads for select to authenticated using (true);
create policy "Admin delete access" on public.leads for delete to authenticated using (true);

-- =============================================================================
-- Storage — bucket público para las imágenes
-- =============================================================================
-- El bucket se llama "products" (nombre histórico) pero guarda TODAS las
-- imágenes del sitio: productos, proyectos, portada y nosotros.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'products',
  'products',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Admin Upload Access" on storage.objects;
drop policy if exists "Admin Update Access" on storage.objects;
drop policy if exists "Admin Delete Access" on storage.objects;

create policy "Public Access" on storage.objects for select using (bucket_id = 'products');
create policy "Admin Upload Access" on storage.objects for insert to authenticated
  with check (bucket_id = 'products');
create policy "Admin Update Access" on storage.objects for update to authenticated
  using (bucket_id = 'products');
create policy "Admin Delete Access" on storage.objects for delete to authenticated
  using (bucket_id = 'products');

-- =============================================================================
-- Contenido inicial del sitio
-- =============================================================================
-- Solo se inserta si la clave no existe todavía, así que tus ediciones
-- desde el panel nunca se pisan al volver a correr este script.
-- Los textos son los que ya están hardcodeados en el sitio: por eso la web
-- se ve exactamente igual antes y después de este setup.
-- =============================================================================

insert into public.site_content (key, value) values
  -- Portada
  ('hero_image', null),
  ('hero_text', 'Diseño interior cálido, orgánico y funcional.'),
  ('hero_secondary_text', null),

  -- Nuestra Filosofía (home)
  ('philosophy_eyebrow', 'Nuestra Filosofía'),
  ('philosophy_title', 'Creamos espacios que respiran'),
  ('philosophy_text', 'En Casa Brota creemos que el hogar es un refugio. Utilizamos materiales naturales, texturas orgánicas y una paleta de colores tierra para diseñar ambientes que promueven la calma y el bienestar.'),

  -- Cierre (home)
  ('cta_title', '¿Listo para transformar tu espacio?'),
  ('cta_text', 'Contactanos para agendar una visita o asesoría personalizada. Hacemos realidad el hogar que soñás.'),
  ('cta_button_text', 'Hablemos'),

  -- Nosotros
  ('about_image', '/images/simple0402.jpg'),
  ('about_title', 'Diseño con alma y propósito'),
  ('about_p1', 'En Casa Brota, no solo diseñamos espacios; creamos refugios. Nacimos de la necesidad de reconectar con lo esencial, de volver a los materiales nobles y a las formas orgánicas que nos hacen sentir en casa.'),
  ('about_p2', 'Nuestro enfoque es integral y humano. Entendemos que cada persona habita su espacio de manera única, por eso nuestros proyectos son un diálogo constante entre la funcionalidad y la estética.'),
  ('about_p3', 'Creemos en el "slow design": espacios pensados para ser vividos con calma, que envejecen con dignidad y que cuentan la historia de quienes los habitan.'),

  -- Contacto
  ('contact_title', 'Hablemos'),
  ('contact_text', '¿Tenés un proyecto en mente? Escribinos y empecemos a darle forma.'),
  ('contact_location', 'Buenos Aires, Argentina'),
  ('contact_email', 'hola@casabrota.com'),
  ('contact_instagram', '@casabrota'),
  ('contact_instagram_url', 'https://instagram.com/casa.brota'),

  -- Tienda
  ('store_title', 'Nuestra Tienda'),
  ('store_text', 'Objetos seleccionados y diseñados para aportar calidez y carácter a tus espacios.'),

  -- Pie de página
  ('footer_tagline', 'Diseño interior que conecta con la naturaleza.'),
  ('footer_address', 'Buenos Aires, Argentina')
on conflict (key) do nothing;

-- =============================================================================
-- FIN
-- =============================================================================
-- Listo. Después de esto:
--   1. Authentication > Users > Add user  (creá tu usuario admin)
--   2. Authentication > URL Configuration: dejá "/admin/login" en Site URL
--      y agregá "/admin/**" a Redirect URLs para que el login funcione en deploy.
--   3. Corré `bun run dev` y entrá a /admin
--
-- Datos de prueba (opcional): descomentá y corré esto para cargar 2 productos
-- y 1 proyecto de ejemplo con fotos de Unsplash. Borralos después desde el panel.
-- =============================================================================
--
-- insert into public.products (name, description, price, category, materials, reference_code, is_active) values
--   ('Sillón Gervasoni', 'Sillón individual de madera maciza con almohadones de lino.', 150000, 'Interiorismo', 'Madera Petiribí, Lino 100% algodón', 'CB01', true),
--   ('Lámpara de Pie Nórdica', 'Lámpara de pie con base de madera y pantalla de tela.', 45000, 'Producto', 'Madera Paraíso, Tela de algodón', 'CB02', true);
--
-- insert into public.projects (name, description, location, year, is_active) values
--   ('Casa del Lago', 'Una residencia moderna integrada con el entorno natural.', 'Bariloche, Argentina', 2024, true);