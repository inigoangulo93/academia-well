// Well Online · borrar la cuenta y todo lo que hay dentro
//
// El RGPD da derecho a que te borren. Esto lo cumple de verdad: no marca la
// cuenta como inactiva, la borra.
//
// Por que hace falta un servidor para esto. Borrar una fila de auth.users
// necesita la clave "service_role", que se salta todos los permisos y por eso
// no puede viajar al navegador del alumno. Esta funcion es el unico sitio
// donde vive: Supabase la inyecta como variable de entorno y nunca entra en
// el repositorio.
//
// La regla de seguridad de este fichero, y no hay otra igual de importante:
// el id del usuario que se borra sale SIEMPRE del token verificado, nunca del
// cuerpo de la peticion. Si se leyera del cuerpo, cualquiera podria borrar la
// cuenta de cualquiera con una linea de curl.
//
// El borrado en cascada hace el resto: las cinco tablas cuelgan de
// auth.users(id) con "on delete cascade", asi que al desaparecer el usuario
// desaparecen su perfil, su progreso, sus dias, sus insignias, sus simulacros
// y los textos de sus writings. Comprobado contra PostgreSQL.

import { createClient } from 'npm:@supabase/supabase-js@2';

// Solo se aceptan peticiones del sitio y de las previas de Cloudflare. Un
// comodin '*' aqui dejaria que cualquier pagina del mundo montara un boton
// de "borra tu cuenta de Academia Well".
const ORIGENES = [
  'https://academiawell.com',
  'https://www.academiawell.com',
];
const PREVIA = /^https:\/\/[a-z0-9-]+\.academia-well\.pages\.dev$/;

function cabeceras(origen: string | null) {
  const permitido = origen && (ORIGENES.includes(origen) || PREVIA.test(origen));
  return {
    'Access-Control-Allow-Origin': permitido ? origen! : ORIGENES[0],
    'Access-Control-Allow-Headers': 'authorization, content-type, apikey',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}

Deno.serve(async (req: Request) => {
  const cors = cabeceras(req.headers.get('Origin'));

  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Solo POST' }), { status: 405, headers: cors });
  }

  try {
    const auth = req.headers.get('Authorization') ?? '';
    const token = auth.replace(/^Bearer /i, '').trim();
    if (!token) {
      return new Response(JSON.stringify({ error: 'Falta la sesion' }), { status: 401, headers: cors });
    }

    // Quien pide el borrado. El token manda; el cuerpo de la peticion no se
    // lee en ningun momento, a proposito.
    const publico = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    const { data: { user }, error: errUsuario } = await publico.auth.getUser(token);
    if (errUsuario || !user) {
      return new Response(JSON.stringify({ error: 'Sesion no valida' }), { status: 401, headers: cors });
    }

    // Y ahora, con permisos de administrador, se borra a esa persona y solo a
    // esa persona.
    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } },
    );
    const { error: errBorrado } = await admin.auth.admin.deleteUser(user.id);
    if (errBorrado) {
      console.error('fallo al borrar', user.id, errBorrado.message);
      return new Response(JSON.stringify({ error: 'No se ha podido borrar la cuenta' }),
                          { status: 500, headers: cors });
    }

    // Se deja constancia de que paso, sin decir quien: el id ya no existe y
    // guardarlo aqui seria justo lo contrario de lo que se acaba de hacer.
    console.log('cuenta borrada');
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: cors });

  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Error inesperado' }), { status: 500, headers: cors });
  }
});
