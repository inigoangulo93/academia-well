-- Imita lo justo de Supabase para poder probar el esquema y las politicas.
create schema if not exists auth;
create table if not exists auth.users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  raw_user_meta_data jsonb default '{}'::jsonb
);
-- Supabase manda siempre un JWT (para anon lleva role=anon y sin sub).
create or replace function auth.uid() returns uuid
language plpgsql stable as $$
declare c text := current_setting('request.jwt.claims', true);
begin
  if c is null or c = '' then return null; end if;
  return nullif(c::json->>'sub','')::uuid;
exception when others then return null;
end $$;
do $$ begin
  if not exists (select 1 from pg_roles where rolname='anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if;
end $$;
grant usage on schema public, auth to anon, authenticated;
alter default privileges in schema public grant all on tables to anon, authenticated;
