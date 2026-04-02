-- ── EXTENSIONS ─────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── USERS ──────────────────────────────────────────────────────
create table public.users (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text not null,
  email        text unique not null,
  phone        text,
  role         text not null check (role in ('admin','business','agent')),
  avatar_url   text,
  created_at   timestamptz default now()
);

-- ── BUSINESSES ─────────────────────────────────────────────────
create table public.businesses (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references public.users(id) on delete cascade,
  business_name   text not null,
  owner_name      text,
  email           text,
  phone           text,
  logo_url        text,
  description     text,
  category        text,
  status          text default 'pending'
                  check (status in ('pending','active','suspended')),
  created_at      timestamptz default now()
);

-- ── AGENTS ─────────────────────────────────────────────────────
create table public.agents (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references public.users(id) on delete cascade,
  referral_code   text unique not null,
  bank_name       text,
  account_name    text,
  account_number  text,
  status          text default 'pending'
                  check (status in ('pending','active','suspended')),
  created_at      timestamptz default now()
);

-- ── PRODUCTS ───────────────────────────────────────────────────
create table public.products (
  id                uuid primary key default gen_random_uuid(),
  business_id       uuid references public.businesses(id) on delete cascade,
  title             text not null,
  description       text,
  price             numeric not null,
  commission_type   text default 'percent'
                    check (commission_type in ('percent','fixed')),
  commission_value  numeric not null,
  image_url         text,
  category          text,
  status            text default 'active'
                    check (status in ('active','inactive','pending')),
  created_at        timestamptz default now()
);

-- ── ORDERS ─────────────────────────────────────────────────────
create table public.orders (
  id                text primary key,
  product_id        uuid references public.products(id),
  business_id       uuid references public.businesses(id),
  agent_id          uuid references public.agents(id),
  customer_name     text not null,
  customer_phone    text not null,
  customer_address  text not null,
  quantity          int default 1,
  total_amount      numeric not null,
  commission_amount numeric default 0,
  order_status      text default 'pending'
                    check (order_status in
                    ('pending','confirmed','processing','delivered','cancelled')),
  payment_status    text default 'pending'
                    check (payment_status in ('pending','paid','refunded')),
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- ── COMMISSIONS ────────────────────────────────────────────────
create table public.commissions (
  id              uuid primary key default gen_random_uuid(),
  order_id        text references public.orders(id),
  agent_id        uuid references public.agents(id),
  amount          numeric not null,
  payout_status   text default 'pending'
                  check (payout_status in ('pending','approved','paid')),
  created_at      timestamptz default now(),
  paid_at         timestamptz
);

-- ── NOTIFICATIONS ──────────────────────────────────────────────
create table public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.users(id) on delete cascade,
  title       text not null,
  message     text not null,
  type        text check (type in ('order','commission','payout','system')),
  read        bool default false,
  created_at  timestamptz default now()
);

-- ── PAYOUTS ────────────────────────────────────────────────────
create table public.payouts (
  id              uuid primary key default gen_random_uuid(),
  agent_id        uuid references public.agents(id),
  amount          numeric not null,
  bank_name       text,
  account_number  text,
  account_name    text,
  reference       text unique,
  status          text default 'pending'
                  check (status in ('pending','processing','paid','failed')),
  created_at      timestamptz default now(),
  paid_at         timestamptz
);

-- ── REFERRAL CLICKS ────────────────────────────────────────────
create table public.referral_clicks (
  id            uuid primary key default gen_random_uuid(),
  agent_id      uuid references public.agents(id),
  product_id    uuid references public.products(id),
  clicked_at    timestamptz default now()
);

-- ── REVIEWS (V2) ───────────────────────────────────────────────
create table public.reviews (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid references public.products(id),
  order_id      text references public.orders(id),
  customer_name text,
  rating        int check (rating between 1 and 5),
  comment       text,
  created_at    timestamptz default now()
);

-- ── UPDATED_AT TRIGGER ─────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.handle_updated_at();

-- ── ROW LEVEL SECURITY ─────────────────────────────────────────
alter table public.users           enable row level security;
alter table public.businesses      enable row level security;
alter table public.agents          enable row level security;
alter table public.products        enable row level security;
alter table public.orders          enable row level security;
alter table public.commissions     enable row level security;
alter table public.notifications   enable row level security;
alter table public.payouts         enable row level security;
alter table public.referral_clicks enable row level security;

-- Admins: full access to everything
create policy "Admin full access"
  on public.orders for all
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- Agents: see only their own orders, commissions, notifications
create policy "Agent sees own orders"
  on public.orders for select
  using (
    agent_id in (
      select id from public.agents where user_id = auth.uid()
    )
  );

create policy "Agent sees own commissions"
  on public.commissions for select
  using (
    agent_id in (
      select id from public.agents where user_id = auth.uid()
    )
  );

create policy "User sees own notifications"
  on public.notifications for select
  using (user_id = auth.uid());

-- Businesses: see only their own products and orders
create policy "Business sees own products"
  on public.products for all
  using (
    business_id in (
      select id from public.businesses where user_id = auth.uid()
    )
  );

create policy "Business sees own orders"
  on public.orders for select
  using (
    business_id in (
      select id from public.businesses where user_id = auth.uid()
    )
  );

-- Public: anyone can read active products
create policy "Public can read active products"
  on public.products for select
  using (status = 'active');

-- Anyone can insert an order (customer checkout)
create policy "Anyone can place order"
  on public.orders for insert
  with check (true);

-- ── ENABLE REALTIME ────────────────────────────────────────────
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.commissions;
alter publication supabase_realtime add table public.notifications;

-- ── PG_CRON: AUTO-PROGRESS ORDERS ─────────────────────────────
-- Runs every 5 minutes in production
select cron.schedule(
  'auto-confirm-orders',
  '*/5 * * * *',
  $$
    update public.orders
    set order_status = 'confirmed', updated_at = now()
    where order_status = 'pending'
    and created_at < now() - interval '10 minutes';
  $$
);

select cron.schedule(
  'auto-process-orders',
  '*/5 * * * *',
  $$
    update public.orders
    set order_status = 'processing', updated_at = now()
    where order_status = 'confirmed'
    and updated_at < now() - interval '1 hour';
  $$
);

select cron.schedule(
  'auto-deliver-orders',
  '*/10 * * * *',
  $$
    update public.orders
    set order_status = 'delivered', updated_at = now()
    where order_status = 'processing'
    and updated_at < now() - interval '2 hours';
  $$
);
