#!/bin/sh
# Levanta un PostgreSQL de usar y tirar, aplica el esquema y comprueba que los
# permisos por fila hacen lo que dicen. No toca Supabase ni la red.
#
#   sh supabase/probar-permisos.sh
#
# Lo importante que verifica:
#   - sin sesion no se ve absolutamente nada (la clave anonima es publica)
#   - un alumno no puede leer ni escribir los datos de otro
#   - un alumno no puede hacerse profesora
#   - la profesora lee a todos pero no escribe en sus datos
set -e
export PATH=/usr/lib/postgresql/16/bin:$PATH
DIR=${WELL_PGDIR:-/tmp/well-pgtest}
AQUI=$(cd "$(dirname "$0")" && pwd)

rm -rf "$DIR"; mkdir -p "$DIR"; chown -R postgres "$DIR" 2>/dev/null || true
cp "$AQUI"/*.sql "$DIR"/; chmod 644 "$DIR"/*.sql

su postgres -c "PATH=$PATH initdb -D $DIR/data -U postgres --auth=trust" >/dev/null
su postgres -c "PATH=$PATH pg_ctl -D $DIR/data -l $DIR/log -o \"-k $DIR -p 5433 -c listen_addresses=''\" start" >/dev/null
sleep 3

su postgres -c "PATH=$PATH psql -h $DIR -p 5433 -U postgres -v ON_ERROR_STOP=1 -q -f $DIR/pruebas-shim.sql" >/dev/null
su postgres -c "PATH=$PATH psql -h $DIR -p 5433 -U postgres -v ON_ERROR_STOP=1 -q -f $DIR/01-esquema.sql" >/dev/null
echo "esquema aplicado"
su postgres -c "PATH=$PATH psql -h $DIR -p 5433 -U postgres -v ON_ERROR_STOP=1 -q -f $DIR/01-esquema.sql" >/dev/null
echo "segunda pasada sin errores: el esquema es idempotente"
echo
su postgres -c "PATH=$PATH psql -h $DIR -p 5433 -U postgres -q -f $DIR/pruebas-seguridad.sql" 2>&1 \
  | grep -v '^SET$\|^RESET$\|^ set_config\|^-*$\|^(1 row)\|^$' || true
echo
su postgres -c "PATH=$PATH pg_ctl -D $DIR/data stop" >/dev/null 2>&1 || true
