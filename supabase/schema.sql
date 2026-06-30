-- ============================================================
-- Sawdesi Supabase Schema — v2 (Auth System Overhaul)
-- Run this in the Supabase SQL editor to set up your database.
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ─── PROFILES (replaces old public.users, phone-first) ─────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text not null,
  full_name text,
  email text,
  email_verified boolean not null default false,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Service role full access to profiles"
  on public.profiles for all
  using (auth.role() = 'service_role');

-- ─── ADMINS (separate admin whitelist) ──────────────────────
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null default 'admin' check (role in ('admin', 'super_admin')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

-- Admins can read the admins table (needed for sidebar/UI)
create policy "Authenticated admins can read admins table"
  on public.admins for select
  using (
    exists (
      select 1 from public.admins a
      where a.email = auth.jwt()->> 'email'
        and a.active = true
    )
  );

-- Super admins can insert new admins
create policy "Super admins can insert admins"
  on public.admins for insert
  with check (
    exists (
      select 1 from public.admins a
      where a.email = auth.jwt()->> 'email'
        and a.role = 'super_admin'
        and a.active = true
    )
  );

-- Super admins can update admins
create policy "Super admins can update admins"
  on public.admins for update
  using (
    exists (
      select 1 from public.admins a
      where a.email = auth.jwt()->> 'email'
        and a.role = 'super_admin'
        and a.active = true
    )
  );

-- Super admins can delete admins
create policy "Super admins can delete admins"
  on public.admins for delete
  using (
    exists (
      select 1 from public.admins a
      where a.email = auth.jwt()->> 'email'
        and a.role = 'super_admin'
        and a.active = true
    )
  );

-- Service role bypass for middleware checks
create policy "Service role full access to admins"
  on public.admins for all
  using (auth.role() = 'service_role');

-- ─── ADDRESSES ──────────────────────────────────────────────
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  house_number text not null,
  street text not null,
  landmark text,
  city text not null,
  state text not null,
  country text not null default 'India',
  pincode text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.addresses enable row level security;

create policy "Users can read own addresses"
  on public.addresses for select
  using (auth.uid() = user_id);

create policy "Users can insert own addresses"
  on public.addresses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own addresses"
  on public.addresses for update
  using (auth.uid() = user_id);

create policy "Users can delete own addresses"
  on public.addresses for delete
  using (auth.uid() = user_id);

-- ─── PRODUCTS ───────────────────────────────────────────────
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text not null default '',
  description text not null default '',
  ingredients text[] not null default '{}',
  how_to_use text not null default '',
  price numeric(10,2) not null,
  original_price numeric(10,2),
  discount integer,
  category text not null,
  tags text[] not null default '{}',
  images text[] not null default '{}',
  rating numeric(3,1) not null default 0,
  review_count integer not null default 0,
  stock_quantity integer not null default 0,
  low_stock_threshold integer not null default 10,
  featured boolean not null default false,
  weight text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.products enable row level security;
create policy "Products are publicly readable" on public.products for select using (true);
create policy "Admins can manage products" on public.products for all using (
  exists (select 1 from public.admins where email = auth.jwt()->> 'email' and active = true)
);

-- ─── CARTS ──────────────────────────────────────────────────
create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.carts enable row level security;

create policy "Users can read own cart"
  on public.carts for select using (auth.uid() = user_id);
create policy "Users can insert own cart"
  on public.carts for insert with check (auth.uid() = user_id);
create policy "Users can update own cart"
  on public.carts for update using (auth.uid() = user_id);
create policy "Users can delete own cart"
  on public.carts for delete using (auth.uid() = user_id);

-- ─── CART ITEMS ─────────────────────────────────────────────
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique(cart_id, product_id)
);
alter table public.cart_items enable row level security;

create policy "Users can read own cart items"
  on public.cart_items for select
  using (exists (select 1 from public.carts where id = cart_id and user_id = auth.uid()));
create policy "Users can insert own cart items"
  on public.cart_items for insert
  with check (exists (select 1 from public.carts where id = cart_id and user_id = auth.uid()));
create policy "Users can update own cart items"
  on public.cart_items for update
  using (exists (select 1 from public.carts where id = cart_id and user_id = auth.uid()));
create policy "Users can delete own cart items"
  on public.cart_items for delete
  using (exists (select 1 from public.carts where id = cart_id and user_id = auth.uid()));

-- ─── ORDERS ─────────────────────────────────────────────────
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  shipping_address jsonb not null,
  subtotal numeric(10,2) not null,
  shipping_fee numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),
  payment_id text,
  coupon_code text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.orders enable row level security;
create policy "Users can read own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users can insert own orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Admins full access to orders" on public.orders for all using (
  exists (select 1 from public.admins where email = auth.jwt()->> 'email' and active = true)
);

-- ─── ORDER ITEMS ────────────────────────────────────────────
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null,
  price numeric(10,2) not null,
  image text
);
alter table public.order_items enable row level security;

create policy "Users can read own order items"
  on public.order_items for select
  using (exists (select 1 from public.orders where id = order_id and user_id = auth.uid()));
create policy "Users can insert own order items"
  on public.order_items for insert
  with check (exists (select 1 from public.orders where id = order_id and user_id = auth.uid()));
create policy "Admins full access to order items"
  on public.order_items for all
  using (exists (select 1 from public.admins where email = auth.jwt()->> 'email' and active = true));

-- ─── REVIEWS ────────────────────────────────────────────────
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  user_name text not null,
  rating integer not null check (rating between 1 and 5),
  title text not null default '',
  body text not null,
  verified boolean not null default false,
  helpful integer not null default 0,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);
alter table public.reviews enable row level security;
create policy "Approved reviews are public" on public.reviews for select using (status = 'approved' or auth.uid() = user_id);
create policy "Logged in users can insert reviews" on public.reviews for insert with check (auth.uid() is not null);
create policy "Admins full access to reviews" on public.reviews for all using (
  exists (select 1 from public.admins where email = auth.jwt()->> 'email' and active = true)
);

-- ─── TESTIMONIALS ───────────────────────────────────────────
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null default '',
  rating integer not null default 5 check (rating between 1 and 5),
  review text not null,
  product text not null default '',
  initials text not null default '',
  media_url text,
  media_type text check (media_type in ('image','video')),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.testimonials enable row level security;
create policy "Active testimonials are public" on public.testimonials for select using (active = true);
create policy "Admins full access to testimonials" on public.testimonials for all using (
  exists (select 1 from public.admins where email = auth.jwt()->> 'email' and active = true)
);

-- ─── COUPONS ────────────────────────────────────────────────
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  type text not null check (type in ('percentage','fixed')),
  value numeric(10,2) not null,
  min_order_value numeric(10,2),
  max_discount numeric(10,2),
  usage_limit integer,
  used_count integer not null default 0,
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.coupons enable row level security;
create policy "Active coupons are readable by authenticated users" on public.coupons for select using (active = true and auth.uid() is not null);
create policy "Admins full access to coupons" on public.coupons for all using (
  exists (select 1 from public.admins where email = auth.jwt()->> 'email' and active = true)
);

-- ─── BLOG POSTS ─────────────────────────────────────────────
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  author text not null,
  author_avatar text,
  category text not null default '',
  tags text[] not null default '{}',
  cover_image text,
  read_time integer not null default 5,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.blog_posts enable row level security;
create policy "Published posts are public" on public.blog_posts for select using (published = true);
create policy "Admins full access to blog posts" on public.blog_posts for all using (
  exists (select 1 from public.admins where email = auth.jwt()->> 'email' and active = true)
);

-- ─── TRIGGER: updated_at ────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

create trigger orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

create trigger blog_posts_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger carts_updated_at before update on public.carts
  for each row execute function public.set_updated_at();

-- ─── TRIGGER: auto-create profile on phone signup ───────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, phone, full_name, email)
  values (
    new.id,
    coalesce(new.phone, ''),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.email, '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── FUNCTION: ensure only one default address per user ─────
create or replace function public.ensure_single_default_address()
returns trigger language plpgsql as $$
begin
  if new.is_default = true then
    update public.addresses
    set is_default = false
    where user_id = new.user_id
      and id != new.id
      and is_default = true;
  end if;
  return new;
end;
$$;

create trigger addresses_single_default
  after insert or update on public.addresses
  for each row execute function public.ensure_single_default_address();
