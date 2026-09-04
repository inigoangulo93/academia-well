-- =====================================================================
-- Well Online · esquema de base de datos
--
-- Se pega entero en el editor SQL de Supabase. Es idempotente: se puede
-- volver a ejecutar sin romper nada.
--
-- AVISO IMPORTANTE
-- La clave "anon" de Supabase viaja en el navegador y es publica por
-- diseno. Lo unico que separa los datos de un alumno de los de otro es el
-- Row Level Security de este fichero. Si una tabla se queda sin RLS,
-- cualquiera con la clave publica puede leerla entera.
-- Regla: ninguna tabla nueva sin su politica.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Perfiles. Una fila por persona, colgando de auth.users.
-- ---------------------------------------------------------------------
create table if not exists public.perfiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  nombre        text,
  nivel         text,                    -- A1..B2+ del test de nivel
  nivel_fecha   date,
  nivel_puntos  int,
  nivel_sobre   int,
  es_profesora  boolean not null default false,
  creado        timestamptz not null default now(),
  actualizado   timestamptz not null default now()
);

comment on column public.perfiles.es_profesora is
  'Solo se pone a mano desde el panel de Supabase. Nadie puede darselo a si mismo.';

-- Al registrarse, se crea el perfil solo.
create or replace function public.crea_perfil()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfiles (id, nombre)
  values (new.id, nullif(new.raw_user_meta_data->>'nombre', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists al_crear_usuario on auth.users;
create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function public.crea_perfil();

-- ---------------------------------------------------------------------
-- 2. Quien es profesora. Funcion aparte para que las politicas no se
--    consulten a si mismas (RLS recursivo) al mirar perfiles.
-- ---------------------------------------------------------------------
create or replace function public.es_profesora()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select p.es_profesora from public.perfiles p where p.id = auth.uid()), false);
$$;

-- ---------------------------------------------------------------------
-- 3. Progreso por ejercicio
-- ---------------------------------------------------------------------
create table if not exists public.progreso (
  alumno      uuid not null references auth.users(id) on delete cascade,
  ejercicio   text not null,
  mejor       int  not null default 0,
  total       int  not null default 0,
  intentos    int  not null default 0,
  respuestas  jsonb,
  texto       text,                      -- para los writings
  palabras    int,
  fecha       date not null default current_date,
  actualizado timestamptz not null default now(),
  primary key (alumno, ejercicio)
);
create index if not exists progreso_alumno_idx on public.progreso (alumno);

-- ---------------------------------------------------------------------
-- 4. Dias con actividad (la racha)
-- ---------------------------------------------------------------------
create table if not exists public.dias_activos (
  alumno uuid not null references auth.users(id) on delete cascade,
  dia    date not null default current_date,
  primary key (alumno, dia)
);

-- ---------------------------------------------------------------------
-- 5. Insignias ganadas
-- ---------------------------------------------------------------------
create table if not exists public.insignias (
  alumno   uuid not null references auth.users(id) on delete cascade,
  insignia text not null,
  ganada   timestamptz not null default now(),
  primary key (alumno, insignia)
);

-- ---------------------------------------------------------------------
-- 6. Intentos de simulacro. Se guardan todos: la curva vale mas que la
--    ultima nota.
-- ---------------------------------------------------------------------
create table if not exists public.simulacros (
  id         bigint generated always as identity primary key,
  alumno     uuid not null references auth.users(id) on delete cascade,
  simulacro  text not null,
  fecha      date not null default current_date,
  aciertos   int  not null,
  sobre      int  not null,
  partes     jsonb,
  por_tiempo boolean not null default false,
  minutos    int,
  creado     timestamptz not null default now()
);
create index if not exists simulacros_alumno_idx on public.simulacros (alumno, simulacro, creado desc);

-- ---------------------------------------------------------------------
-- 7. Permisos por fila
-- ---------------------------------------------------------------------
alter table public.perfiles      enable row level security;
alter table public.progreso      enable row level security;
alter table public.dias_activos  enable row level security;
alter table public.insignias     enable row level security;
alter table public.simulacros    enable row level security;

-- perfiles: cada uno el suyo; la profesora los ve todos pero no los toca
drop policy if exists perfiles_lee   on public.perfiles;
drop policy if exists perfiles_crea  on public.perfiles;
drop policy if exists perfiles_edita on public.perfiles;

create policy perfiles_lee on public.perfiles
  for select using (id = auth.uid() or public.es_profesora());
create policy perfiles_crea on public.perfiles
  for insert with check (id = auth.uid());
create policy perfiles_edita on public.perfiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- El resto de tablas siguen todas el mismo patron.
do $$
declare t text;
begin
  foreach t in array array['progreso','dias_activos','insignias','simulacros'] loop
    execute format('drop policy if exists %I_lee on public.%I', t, t);
    execute format('drop policy if exists %I_crea on public.%I', t, t);
    execute format('drop policy if exists %I_edita on public.%I', t, t);
    execute format('drop policy if exists %I_borra on public.%I', t, t);

    execute format(
      'create policy %I_lee on public.%I for select using (alumno = auth.uid() or public.es_profesora())', t, t);
    execute format(
      'create policy %I_crea on public.%I for insert with check (alumno = auth.uid())', t, t);
    execute format(
      'create policy %I_edita on public.%I for update using (alumno = auth.uid()) with check (alumno = auth.uid())', t, t);
    execute format(
      'create policy %I_borra on public.%I for delete using (alumno = auth.uid())', t, t);
  end loop;
end $$;

-- Nadie puede convertirse en profesora por su cuenta.
--
-- Ojo con la condicion: desde el editor SQL de Supabase no hay usuario
-- identificado (auth.uid() es null), y ese es justo el camino por el que se
-- nombra a la profesora la primera vez. Si se bloquea tambien ese caso, no hay
-- forma de nombrar a nadie. Solo se bloquea a un usuario final identificado
-- que todavia no es profesora.
create or replace function public.protege_es_profesora()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.es_profesora is distinct from old.es_profesora
     and auth.uid() is not null
     and not public.es_profesora() then
    raise exception 'es_profesora solo se cambia desde el panel de Supabase';
  end if;
  new.actualizado := now();
  return new;
end;
$$;

drop trigger if exists al_editar_perfil on public.perfiles;
create trigger al_editar_perfil
  before update on public.perfiles
  for each row execute function public.protege_es_profesora();

-- ---------------------------------------------------------------------
-- 8. Quien puede llamar a las funciones
--
-- Supabase publica automaticamente como API cualquier funcion de este
-- esquema: /rest/v1/rpc/<nombre>. Las tres de aqui son "security definer",
-- o sea que corren con los permisos de quien las creo y no con los de quien
-- llama, asi que conviene mirar una por una quien deberia poder invocarlas.
--
-- crea_perfil y protege_es_profesora son funciones de disparador. Postgres
-- ya rechaza llamarlas a mano ("trigger functions can only be called as
-- triggers"), pero se les quita el permiso igualmente: no cuesta nada y
-- deja el panel de avisos limpio, que es lo que hace que el dia que salte
-- un aviso de verdad se vea.
--
-- Comprobado en PostgreSQL antes de escribirlo: con estos permisos
-- revocados, el perfil se sigue creando solo al registrarse y el alumno
-- sigue sin poder hacerse profesora.
revoke execute on function public.crea_perfil()          from public, anon, authenticated;
revoke execute on function public.protege_es_profesora() from public, anon, authenticated;

-- es_profesora() NO se toca, y esto es importante: se la llama dentro de las
-- politicas de arriba, y las politicas se evaluan con los permisos de quien
-- pregunta. Al revocarla, cualquier consulta a cualquier tabla revienta con
-- "permission denied for function es_profesora", tanto para un alumno
-- identificado como para un anonimo. Tambien comprobado.
--
-- Dejarla abierta es seguro: no acepta parametros y solo responde si TU eres
-- profesora, asi que no dice nada de nadie mas. Supabase seguira sacando dos
-- avisos por ella; son deliberados.

-- ---------------------------------------------------------------------
-- 9. Vista para el panel de la profesora
-- ---------------------------------------------------------------------
create or replace view public.resumen_alumnos
with (security_invoker = true) as
select
  p.id,
  p.nombre,
  p.nivel,
  p.creado,
  (select count(*) from public.progreso g where g.alumno = p.id)                    as ejercicios,
  (select coalesce(sum(g.mejor), 0) from public.progreso g where g.alumno = p.id)   as aciertos,
  (select max(g.fecha) from public.progreso g where g.alumno = p.id)                as ultimo_dia,
  (select count(*) from public.insignias i where i.alumno = p.id)                   as insignias,
  (select count(*) from public.simulacros s where s.alumno = p.id)                  as simulacros
from public.perfiles p
where not p.es_profesora;

comment on view public.resumen_alumnos is
  'security_invoker: la vista respeta el RLS de quien pregunta, asi que un alumno solo se ve a si mismo y la profesora los ve a todos.';
