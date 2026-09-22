-- Initial schema for the composable newsletter/monetization template.
-- Run against a fresh Supabase project: `supabase db push` or paste
-- into the SQL editor.
--
-- Deviations from the original PRD schema, and why:
--   1. No `subscribers` table. Free newsletter capture lives entirely
--      in Resend (Contacts/Segments), not here — Tyler: not using
--      Supabase for that. This schema is reserved for what still
--      needs a real account: paid tier, API keys, purchases.
--   2. `products` is new. The PRD's `purchases.product_id` referenced
--      nothing. Added the minimal table it needs to actually be a
--      foreign key.
--   3. Everything else matches the PRD as given.

-- ---------------------------------------------------------------
-- profiles: full accounts only (paid tier, API keys, purchases)
-- ---------------------------------------------------------------
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  stripe_customer_id text unique,
  tier text default 'free' check (tier in ('free', 'pro')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table profiles enable row level security;

create policy "profiles: read own row"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles: update own row"
  on profiles for update
  using (auth.uid() = id);

-- ---------------------------------------------------------------
-- api_keys: developer portal, Module 3
-- ---------------------------------------------------------------
create table api_keys (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  hashed_key text unique not null,
  key_prefix text not null, -- first 8 chars shown in the dashboard, full key never re-displayed
  rate_limit_quota int default 60 not null, -- requests per minute
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table api_keys enable row level security;

create policy "api_keys: read own keys"
  on api_keys for select
  using (auth.uid() = user_id);

create policy "api_keys: create own keys"
  on api_keys for insert
  with check (auth.uid() = user_id);

create policy "api_keys: update own keys"
  on api_keys for update
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------
-- products: digital goods catalog (added, PRD didn't define this)
-- ---------------------------------------------------------------
create table products (
  id text primary key, -- slug, e.g. 'operator-field-guide'
  name text not null,
  price_cents int not null,
  blob_pathname text not null, -- pathname inside the Vercel Blob private store
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table products enable row level security;

create policy "products: public read"
  on products for select
  using (true);

-- ---------------------------------------------------------------
-- purchases: standalone digital asset purchases
-- ---------------------------------------------------------------
create table purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  product_id text references products(id) not null,
  purchase_date timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table purchases enable row level security;

create policy "purchases: read own purchases"
  on purchases for select
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------
-- auto-create a profile row when someone signs up via Supabase Auth
-- ---------------------------------------------------------------
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
