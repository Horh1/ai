-- LeadPilot AI — FULL DATABASE SETUP
-- Clean, repeatable setup for a fresh Supabase project.
-- WARNING: this script DROPS LeadPilot public tables/functions before recreating them.
-- It does NOT touch auth.users.

begin;

create extension if not exists pgcrypto;

-- =========================================================
-- CLEAN PREVIOUS LEADPILOT OBJECTS
-- =========================================================

drop function if exists public.create_leadpilot_workspace(text, text, text);
drop function if exists public.update_updated_at_column();
drop function if exists public.handle_new_user();
drop function if exists private.current_user_org_ids();
drop function if exists private.current_user_org_role(uuid);
drop function if exists private.is_org_member(uuid);
drop function if exists private.is_org_admin(uuid);
drop function if exists private.is_org_owner(uuid);

drop table if exists public.lead_events cascade;
drop table if exists public.ai_replies cascade;
drop table if exists public.lead_analyses cascade;
drop table if exists public.leads cascade;
drop table if exists public.organization_members cascade;
drop table if exists public.organizations cascade;
drop table if exists public.profiles cascade;

drop schema if exists private cascade;
create schema private;

-- =========================================================
-- ENUMS
-- =========================================================

drop type if exists public.organization_role cascade;
create type public.organization_role as enum ('owner', 'admin', 'manager');

drop type if exists public.lead_status cascade;
create type public.lead_status as enum (
  'new',
  'in_progress',
  'waiting',
  'won',
  'lost'
);

drop type if exists public.lead_priority cascade;
create type public.lead_priority as enum ('low', 'medium', 'high');

-- =========================================================
-- TABLES
-- =========================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 120),
  industry text,
  description text,
  ai_tone text not null default 'professional'
    check (ai_tone in ('professional', 'friendly', 'concise', 'expert')),
  default_language text not null default 'en'
    check (default_language in ('en', 'ru')),
  ai_context text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.organization_role not null default 'manager',
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  company text,
  source text not null default 'manual',
  message text not null,
  status public.lead_status not null default 'new',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lead_analyses (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  score integer not null check (score between 0 and 100),
  priority public.lead_priority not null,
  intent text,
  customer_type text,
  estimated_value numeric(12,2),
  summary text,
  signals jsonb not null default '[]'::jsonb,
  model text,
  created_at timestamptz not null default now()
);

create table public.ai_replies (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  content text not null,
  model text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- =========================================================
-- INDEXES
-- =========================================================

create index organization_members_user_idx
  on public.organization_members(user_id);

create index organization_members_org_idx
  on public.organization_members(organization_id);

create index leads_org_idx
  on public.leads(organization_id);

create index leads_org_status_idx
  on public.leads(organization_id, status);

create index leads_created_at_idx
  on public.leads(created_at desc);

create index lead_analyses_lead_idx
  on public.lead_analyses(lead_id, created_at desc);

create index ai_replies_lead_idx
  on public.ai_replies(lead_id, created_at desc);

create index lead_events_lead_idx
  on public.lead_events(lead_id, created_at desc);

-- =========================================================
-- UPDATED_AT TRIGGER
-- =========================================================

create function public.update_updated_at_column()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger organizations_updated_at
before update on public.organizations
for each row execute function public.update_updated_at_column();

create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();

create trigger leads_updated_at
before update on public.leads
for each row execute function public.update_updated_at_column();

-- =========================================================
-- AUTH -> PROFILE
-- =========================================================

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'avatar_url', '')), '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Backfill profiles for users that already exist.
insert into public.profiles (id, full_name, avatar_url)
select
  u.id,
  nullif(trim(coalesce(u.raw_user_meta_data ->> 'full_name', '')), ''),
  nullif(trim(coalesce(u.raw_user_meta_data ->> 'avatar_url', '')), '')
from auth.users u
on conflict (id) do nothing;

-- =========================================================
-- PRIVATE RLS HELPERS
-- =========================================================

create function private.is_org_member(target_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = target_org_id
      and om.user_id = (select auth.uid())
  );
$$;

create function private.current_user_org_role(target_org_id uuid)
returns public.organization_role
language sql
stable
security definer
set search_path = ''
as $$
  select om.role
  from public.organization_members om
  where om.organization_id = target_org_id
    and om.user_id = (select auth.uid())
  limit 1;
$$;

create function private.is_org_admin(target_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = target_org_id
      and om.user_id = (select auth.uid())
      and om.role in ('owner', 'admin')
  );
$$;

create function private.is_org_owner(target_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = target_org_id
      and om.user_id = (select auth.uid())
      and om.role = 'owner'
  );
$$;

revoke all on schema private from public;
grant usage on schema private to authenticated;

grant execute on function private.is_org_member(uuid) to authenticated;
grant execute on function private.current_user_org_role(uuid) to authenticated;
grant execute on function private.is_org_admin(uuid) to authenticated;
grant execute on function private.is_org_owner(uuid) to authenticated;

-- =========================================================
-- RLS
-- =========================================================

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.leads enable row level security;
alter table public.lead_analyses enable row level security;
alter table public.ai_replies enable row level security;
alter table public.lead_events enable row level security;

-- Profiles
create policy profiles_select_own
on public.profiles
for select to authenticated
using ((select auth.uid()) = id);

create policy profiles_insert_own
on public.profiles
for insert to authenticated
with check ((select auth.uid()) = id);

create policy profiles_update_own
on public.profiles
for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- Organizations
create policy organizations_select_member
on public.organizations
for select to authenticated
using ((select private.is_org_member(id)));

create policy organizations_update_admin
on public.organizations
for update to authenticated
using ((select private.is_org_admin(id)))
with check ((select private.is_org_admin(id)));

-- Organization members
create policy members_select_same_org
on public.organization_members
for select to authenticated
using ((select private.is_org_member(organization_id)));

create policy members_insert_admin
on public.organization_members
for insert to authenticated
with check (
  (select private.is_org_admin(organization_id))
  and role in ('admin', 'manager')
);

create policy members_update_admin
on public.organization_members
for update to authenticated
using ((select private.is_org_admin(organization_id)))
with check (
  (select private.is_org_admin(organization_id))
);

create policy members_delete_admin
on public.organization_members
for delete to authenticated
using (
  (select private.is_org_admin(organization_id))
  and role <> 'owner'
);

-- Leads
create policy leads_select_member
on public.leads
for select to authenticated
using ((select private.is_org_member(organization_id)));

create policy leads_insert_member
on public.leads
for insert to authenticated
with check (
  (select private.is_org_member(organization_id))
  and (created_by is null or created_by = (select auth.uid()))
);

create policy leads_update_member
on public.leads
for update to authenticated
using ((select private.is_org_member(organization_id)))
with check ((select private.is_org_member(organization_id)));

create policy leads_delete_admin
on public.leads
for delete to authenticated
using ((select private.is_org_admin(organization_id)));

-- Lead analyses
create policy lead_analyses_select_member
on public.lead_analyses
for select to authenticated
using (
  exists (
    select 1
    from public.leads l
    where l.id = lead_analyses.lead_id
      and (select private.is_org_member(l.organization_id))
  )
);

create policy lead_analyses_insert_member
on public.lead_analyses
for insert to authenticated
with check (
  exists (
    select 1
    from public.leads l
    where l.id = lead_analyses.lead_id
      and (select private.is_org_member(l.organization_id))
  )
);

create policy lead_analyses_delete_admin
on public.lead_analyses
for delete to authenticated
using (
  exists (
    select 1
    from public.leads l
    where l.id = lead_analyses.lead_id
      and (select private.is_org_admin(l.organization_id))
  )
);

-- AI replies
create policy ai_replies_select_member
on public.ai_replies
for select to authenticated
using (
  exists (
    select 1
    from public.leads l
    where l.id = ai_replies.lead_id
      and (select private.is_org_member(l.organization_id))
  )
);

create policy ai_replies_insert_member
on public.ai_replies
for insert to authenticated
with check (
  exists (
    select 1
    from public.leads l
    where l.id = ai_replies.lead_id
      and (select private.is_org_member(l.organization_id))
  )
);

create policy ai_replies_delete_admin
on public.ai_replies
for delete to authenticated
using (
  exists (
    select 1
    from public.leads l
    where l.id = ai_replies.lead_id
      and (select private.is_org_admin(l.organization_id))
  )
);

-- Lead events
create policy lead_events_select_member
on public.lead_events
for select to authenticated
using (
  exists (
    select 1
    from public.leads l
    where l.id = lead_events.lead_id
      and (select private.is_org_member(l.organization_id))
  )
);

create policy lead_events_insert_member
on public.lead_events
for insert to authenticated
with check (
  exists (
    select 1
    from public.leads l
    where l.id = lead_events.lead_id
      and (select private.is_org_member(l.organization_id))
  )
);

-- =========================================================
-- GRANTS
-- =========================================================

revoke all on public.profiles from anon;
revoke all on public.organizations from anon;
revoke all on public.organization_members from anon;
revoke all on public.leads from anon;
revoke all on public.lead_analyses from anon;
revoke all on public.ai_replies from anon;
revoke all on public.lead_events from anon;

grant select, insert, update on public.profiles to authenticated;

grant select, update on public.organizations to authenticated;

grant select, insert, update, delete
on public.organization_members to authenticated;

grant select, insert, update, delete
on public.leads to authenticated;

grant select, insert, delete
on public.lead_analyses to authenticated;

grant select, insert, delete
on public.ai_replies to authenticated;

grant select, insert
on public.lead_events to authenticated;

-- =========================================================
-- ATOMIC WORKSPACE CREATION
-- Exact signature expected by PATCH 03:
-- create_leadpilot_workspace(name, industry, description)
-- =========================================================

create function public.create_leadpilot_workspace(
  workspace_name text,
  workspace_industry text,
  workspace_description text
)
returns table (
  organization_id uuid,
  organization_name text,
  role public.organization_role
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_org_id uuid;
begin
  v_user_id := (select auth.uid());

  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if nullif(trim(workspace_name), '') is null then
    raise exception 'Workspace name is required';
  end if;

  -- Reuse an existing organization if the user already belongs to one.
  select om.organization_id
    into v_org_id
  from public.organization_members om
  where om.user_id = v_user_id
  order by om.created_at
  limit 1;

  if v_org_id is not null then
    return query
    select o.id, o.name, om.role
    from public.organizations o
    join public.organization_members om
      on om.organization_id = o.id
     and om.user_id = v_user_id
    where o.id = v_org_id;

    return;
  end if;

  insert into public.organizations (
    name,
    industry,
    description
  )
  values (
    trim(workspace_name),
    nullif(trim(workspace_industry), ''),
    nullif(trim(workspace_description), '')
  )
  returning id into v_org_id;

  insert into public.organization_members (
    organization_id,
    user_id,
    role
  )
  values (
    v_org_id,
    v_user_id,
    'owner'
  );

  return query
  select v_org_id, o.name, 'owner'::public.organization_role
  from public.organizations o
  where o.id = v_org_id;
end;
$$;

revoke execute on function public.create_leadpilot_workspace(text, text, text)
from public, anon;

grant execute on function public.create_leadpilot_workspace(text, text, text)
to authenticated;

-- =========================================================
-- OPTIONAL: workspace settings update helper
-- =========================================================

create function public.update_leadpilot_workspace(
  target_organization_id uuid,
  workspace_name text,
  workspace_industry text,
  workspace_description text,
  workspace_ai_tone text,
  workspace_default_language text,
  workspace_ai_context text
)
returns public.organizations
language plpgsql
security invoker
set search_path = ''
as $$
declare
  updated_row public.organizations;
begin
  if not (select private.is_org_admin(target_organization_id)) then
    raise exception 'Only workspace owner or admin can update workspace settings';
  end if;

  update public.organizations
  set
    name = trim(workspace_name),
    industry = nullif(trim(workspace_industry), ''),
    description = nullif(trim(workspace_description), ''),
    ai_tone = workspace_ai_tone,
    default_language = workspace_default_language,
    ai_context = nullif(trim(workspace_ai_context), '')
  where id = target_organization_id
  returning * into updated_row;

  return updated_row;
end;
$$;

revoke execute on function public.update_leadpilot_workspace(
  uuid, text, text, text, text, text, text
) from public, anon;

grant execute on function public.update_leadpilot_workspace(
  uuid, text, text, text, text, text, text
) to authenticated;

-- =========================================================
-- VERIFY / CACHE RELOAD
-- =========================================================

notify pgrst, 'reload schema';

commit;
