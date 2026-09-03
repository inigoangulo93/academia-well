/* Well Online · configuracion del servidor (Supabase)
 *
 * Mientras estas dos lineas esten vacias, TODO sigue funcionando como hasta
 * ahora: el progreso se guarda solo en el navegador del alumno y no hay
 * cuentas ni login. En cuanto se rellenan, la pagina ofrece entrar con el
 * correo y sincroniza el progreso.
 *
 * Los valores se copian de Supabase: Project Settings -> API.
 *
 * La clave "anon" es PUBLICA por diseno: viaja en el navegador de todo el
 * mundo y no es un secreto. Lo que protege los datos de un alumno de otro es
 * el Row Level Security de supabase/01-esquema.sql, no esta clave.
 *
 * La que NO se pone aqui nunca, ni en ningun fichero del repositorio, es la
 * clave "service_role": esa se salta todos los permisos.
 */
window.WELL_CONFIG = {
  supabaseUrl: '',
  supabaseAnonKey: ''
};
