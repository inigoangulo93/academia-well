\set ON_ERROR_STOP on
\pset pager off
-- ---- datos de prueba ----
delete from auth.users;
insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111','ana@ejemplo.com'),
  ('22222222-2222-2222-2222-222222222222','beñat@ejemplo.com'),
  ('33333333-3333-3333-3333-333333333333','elena@ejemplo.com');
update public.perfiles set nombre='Ana',   nivel='B2' where id='11111111-1111-1111-1111-111111111111';
update public.perfiles set nombre='Beñat', nivel='B1' where id='22222222-2222-2222-2222-222222222222';
update public.perfiles set nombre='Elena', es_profesora=true where id='33333333-3333-3333-3333-333333333333';
insert into public.progreso (alumno, ejercicio, mejor, total) values
  ('11111111-1111-1111-1111-111111111111','v1-caja',8,8),
  ('22222222-2222-2222-2222-222222222222','v1-caja',3,8) on conflict do nothing;

\echo '--- 1. sin sesion (clave publica, nadie identificado) ---'
set role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', false);
select 'perfiles visibles' etiqueta, count(*) from public.perfiles
union all select 'progreso visible', count(*) from public.progreso;
reset role;

\echo '--- 2. Ana identificada: solo debe verse a si misma ---'
set role authenticated;
select set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111"}', false);
select 'perfiles visibles' etiqueta, count(*) from public.perfiles
union all select 'progreso visible', count(*) from public.progreso
union all select 'progreso de Benat', count(*) from public.progreso where alumno='22222222-2222-2222-2222-222222222222';

\echo '--- 3. Ana intenta escribir en el progreso de Benat ---'
do $$
begin
  insert into public.progreso (alumno, ejercicio, mejor, total)
  values ('22222222-2222-2222-2222-222222222222','robado',99,99);
  raise warning 'FALLO: Ana ha podido escribir en la cuenta de Benat';
exception when others then
  raise notice 'BIEN: rechazado (%)', sqlerrm;
end $$;

\echo '--- 4. Ana intenta hacerse profesora ---'
do $$
begin
  update public.perfiles set es_profesora = true where id = auth.uid();
  raise warning 'FALLO: Ana se ha hecho profesora';
exception when others then
  raise notice 'BIEN: rechazado (%)', sqlerrm;
end $$;
select 'es_profesora tras el intento' etiqueta, es_profesora from public.perfiles where id = auth.uid();

\echo '--- 5. Elena (profesora): debe ver a todos ---'
select set_config('request.jwt.claims', '{"sub":"33333333-3333-3333-3333-333333333333"}', false);
select 'perfiles visibles' etiqueta, count(*) from public.perfiles
union all select 'progreso visible', count(*) from public.progreso
union all select 'filas en resumen_alumnos', count(*) from public.resumen_alumnos;

\echo '--- 6. Elena intenta modificar el progreso de Ana ---'
do $$
declare n int;
begin
  update public.progreso set mejor = 0 where alumno = '11111111-1111-1111-1111-111111111111';
  get diagnostics n = row_count;
  if n > 0 then raise warning 'FALLO: la profesora ha modificado datos de una alumna (% filas)', n;
  else raise notice 'BIEN: la profesora lee pero no escribe'; end if;
end $$;

\echo '--- 7. Ana ve su propia fila del resumen y no la de Benat ---'
select set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111"}', false);
select nombre, ejercicios, aciertos from public.resumen_alumnos;
reset role;
