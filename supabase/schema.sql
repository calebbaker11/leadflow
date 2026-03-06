-- LeadFlow Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- Extends auth.users with app-specific fields
-- ============================================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  stripe_customer_id text unique,
  subscription_status text default 'inactive'
    check (subscription_status in ('active', 'inactive', 'past_due', 'canceled', 'trialing')),
  brand_voice text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Migration: add brand_voice to existing databases
-- alter table public.profiles add column if not exists brand_voice text;

-- ============================================================
-- PROPOSALS TABLE
-- ============================================================
create table public.proposals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  client_name text not null,
  business_type text,
  template_type text default 'freelancer'
    check (template_type in ('freelancer', 'agency', 'contractor', 'consultant')),
  scope text,
  price text,
  timeline text,
  additional_notes text,
  generated_proposal_text text,
  share_token uuid default uuid_generate_v4() unique,
  is_shared boolean default false,
  status text default 'draft'
    check (status in ('draft', 'sent', 'accepted', 'declined')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  stripe_subscription_id text unique not null,
  stripe_price_id text,
  status text not null,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.proposals enable row level security;
alter table public.subscriptions enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Proposals policies
create policy "Users can view own proposals"
  on public.proposals for select
  using (auth.uid() = user_id);

create policy "Public can view shared proposals"
  on public.proposals for select
  using (is_shared = true);

create policy "Users can create proposals"
  on public.proposals for insert
  with check (auth.uid() = user_id);

create policy "Users can update own proposals"
  on public.proposals for update
  using (auth.uid() = user_id);

create policy "Users can delete own proposals"
  on public.proposals for delete
  using (auth.uid() = user_id);

-- Subscriptions policies
create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger proposals_updated_at
  before update on public.proposals
  for each row execute procedure public.handle_updated_at();

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- PROCESSED WEBHOOK EVENTS TABLE
-- Prevents duplicate webhook processing (idempotency)
-- ============================================================
create table public.processed_webhook_events (
  id text primary key,          -- Stripe event ID (e.g. evt_xxx)
  type text not null,           -- Stripe event type
  processed_at timestamptz not null default now()
);

-- Service role only; no RLS needed for direct admin writes
alter table public.processed_webhook_events enable row level security;

-- ============================================================
-- INDEXES
-- ============================================================
create index proposals_user_id_idx on public.proposals(user_id);
create index proposals_share_token_idx on public.proposals(share_token);
create index subscriptions_user_id_idx on public.subscriptions(user_id);
create index profiles_stripe_customer_id_idx on public.profiles(stripe_customer_id);
create index processed_events_processed_at_idx on public.processed_webhook_events(processed_at);
