-- migrations.sql: run in Supabase SQL editor

-- Profiles table
create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text,
  slug text not null,
  bio text,
  avatar_path text,
  settings jsonb default '{}'::jsonb,
  is_public boolean default true,
  is_suspended boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index profiles_slug_idx on profiles (lower(slug));

-- Links
create table links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  url text not null,
  icon text,
  open_in_new_tab boolean default true,
  position integer not null default 1000,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Clicks
create table link_clicks (
  id bigserial primary key,
  link_id uuid not null references links(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  clicked_at timestamptz default now(),
  user_agent text,
  device_type text,
  referrer_domain text,
  ip inet
);

-- Templates and purchases
create table templates (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  price_cents integer default 0,
  owner_user_id uuid references auth.users(id),
  assets jsonb,
  created_at timestamptz default now()
);

create table purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  template_id uuid references templates(id),
  stripe_payment_id text,
  amount_cents integer,
  created_at timestamptz default now()
);

create table tips (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id),
  stripe_payment_id text,
  amount_cents integer,
  donor_email text,
  created_at timestamptz default now()
);

-- NOTE: Add Row Level Security policies in Supabase dashboard to allow only owners to insert/update/delete their rows.
-- Example RLS policy (pseudocode):
-- ENABLE ROW LEVEL SECURITY ON profiles;
-- CREATE POLICY "Profiles: owner can manage" ON profiles USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

