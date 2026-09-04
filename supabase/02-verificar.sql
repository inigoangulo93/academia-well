-- =====================================================================
-- Well Online · comprobación de que 01-esquema.sql se aplicó bien
--
-- Se pega entero en el editor SQL de Supabase después del esquema.
-- No cambia nada: solo mira. Devuelve una fila por comprobación con un
-- veredicto en texto, para no tener que interpretar nada.
--
-- Si alguna fila dice MAL, NO seguir adelante: hay datos de alumnos
-- detrás de estas políticas.
-- =====================================================================

with

-- 1. Las cinco tablas existen
tablas as (
  select count(*) n from pg_class
  where relnamespace = 'public'::regnamespace and relkind = 'r'
    and relname in ('perfiles','progreso','dias_activos','insignias','simulacros')
),

-- 2. Las cinco tienen Row Level Security encendido.
--    Esto es lo único que separa los datos de un alumno de los de otro.
sin_rls as (
  select coalesce(string_agg(relname, ', ' order by relname), '') lista
  from pg_class
  where relnamespace = 'public'::regnamespace and relkind = 'r'
    and relname in ('perfiles','progreso','dias_activos','insignias','simulacros')
    and not relrowsecurity
),

-- 3. Diecinueve políticas: 3 en perfiles y 4 en cada una de las otras cuatro
politicas as (
  select count(*) n from pg_policies
  where schemaname = 'public'
    and tablename in ('perfiles','progreso','dias_activos','insignias','simulacros')
),

-- 4. Las tres funciones auxiliares
funciones as (
  select count(*) n from pg_proc
  where pronamespace = 'public'::regnamespace
    and proname in ('crea_perfil','es_profesora','protege_es_profesora')
),

-- 5. El perfil se crea solo al registrarse
disparador_alta as (
  select count(*) n from pg_trigger
  where tgrelid = 'auth.users'::regclass and not tgisinternal and tgname = 'al_crear_usuario'
),

-- 6. Nadie puede nombrarse profesora a sí mismo
disparador_profesora as (
  select count(*) n from pg_trigger
  where tgrelid = 'public.perfiles'::regclass and not tgisinternal and tgname = 'al_editar_perfil'
),

-- 7. Las funciones de disparador no se pueden invocar por la API.
--    es_profesora() sí, y debe poder: las políticas la llaman por dentro.
rpc as (
  select count(*) n from pg_proc p
  where p.pronamespace = 'public'::regnamespace
    and p.proname in ('crea_perfil','protege_es_profesora')
    and (has_function_privilege('anon', p.oid, 'execute')
      or has_function_privilege('authenticated', p.oid, 'execute'))
),

-- 8. La vista respeta el RLS de quien pregunta. Sin security_invoker, un
--    alumno vería por la vista lo que las políticas le niegan por la tabla.
vista as (
  select coalesce(array_to_string(reloptions, ','), '') opts
  from pg_class where relname = 'resumen_alumnos' and relnamespace = 'public'::regnamespace
)

select * from (
  select 1 orden, 'Las cinco tablas existen' comprobacion,
         n::text || ' de 5' detalle, case when n = 5 then 'BIEN' else 'MAL' end veredicto from tablas
  union all
  select 2, 'Todas tienen Row Level Security',
         case when lista = '' then 'ninguna sin RLS' else 'SIN RLS: ' || lista end,
         case when lista = '' then 'BIEN' else 'MAL' end from sin_rls
  union all
  select 3, 'Las políticas por fila',
         n::text || ' de 19', case when n = 19 then 'BIEN' else 'MAL' end from politicas
  union all
  select 4, 'Las funciones auxiliares',
         n::text || ' de 3', case when n = 3 then 'BIEN' else 'MAL' end from funciones
  union all
  select 5, 'Se crea el perfil al registrarse',
         case when n = 1 then 'al_crear_usuario' else 'falta' end,
         case when n = 1 then 'BIEN' else 'MAL' end from disparador_alta
  union all
  select 6, 'Nadie se nombra profesora a sí mismo',
         case when n = 1 then 'al_editar_perfil' else 'falta' end,
         case when n = 1 then 'BIEN' else 'MAL' end from disparador_profesora
  union all
  select 7, 'Los disparadores no son invocables por API',
         case when n = 0 then 'ninguno expuesto' else n::text || ' expuesto(s)' end,
         case when n = 0 then 'BIEN' else 'MAL' end from rpc
  union all
  select 8, 'La vista de la profesora respeta el RLS',
         case when opts = '' then 'sin opciones' else opts end,
         case when opts like '%security_invoker=true%' then 'BIEN' else 'MAL' end from vista
) t order by orden;
