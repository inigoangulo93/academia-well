# Supabase · lo que hay aquí y cómo se pone en marcha

Well Online funciona hoy **sin servidor**: el progreso de cada alumno se guarda
en su navegador. Eso vale para un prototipo, pero tiene tres límites: se pierde
al cambiar de dispositivo o al borrar el historial, Elena no puede ver cómo va
nadie, y no hay a quién cobrar una suscripción.

Estos ficheros son el servidor. Están escritos y probados, pero **no
conectados**: mientras `well-config.js` esté vacío, nada de esto se descarga
siquiera y la plataforma se comporta exactamente igual que antes.

## Ficheros

| Fichero | Qué es |
|---|---|
| `01-esquema.sql` | Las tablas, los permisos y los disparadores. Se pega entero en el editor SQL de Supabase. Es idempotente: se puede volver a ejecutar. |
| `pruebas-shim.sql` | Imita lo justo de Supabase (`auth.users`, `auth.uid()`, los roles) para poder probar el esquema en un PostgreSQL normal. |
| `pruebas-seguridad.sql` | Siete pruebas: que un alumno no puede leer ni escribir los datos de otro, que nadie se nombra profesora a sí mismo, que la profesora lee pero no escribe. |
| `probar-permisos.sh` | Levanta un PostgreSQL de usar y tirar, aplica el esquema dos veces y ejecuta las pruebas. |
| `02-verificar.sql` | Se pega en Supabase después del esquema. No cambia nada: comprueba en siete filas que las tablas, el RLS, las políticas y los disparadores están donde deben. |
| `PUESTA-EN-MARCHA.md` | El encargo completo para hacer los clics con el navegador, paso a paso. |

Y fuera de esta carpeta:

| Fichero | Qué es |
|---|---|
| `well-config.js` | Las dos líneas que hay que rellenar. Vacías = sin servidor. |
| `well-datos.js` | La capa de datos: navegador siempre, servidor si hay sesión. |
| `vendor/supabase-2.115.0.js` | El cliente oficial, vendorizado. Solo se descarga si hay servidor configurado. |
| `entrar.html` | La página de entrada con enlace por correo. |
| `qa/qa-supabase.py` | Prueba la capa de datos con un Supabase de mentira. |

## Cómo se prueba sin cuenta de Supabase

    ./supabase/probar-permisos.sh          # los permisos, contra PostgreSQL de verdad
    python3 qa/qa-supabase.py              # la capa de datos, con un cliente falso

Las dos cosas pasan hoy. Lo que **no** está probado, porque este entorno no
tiene salida hacia supabase.com, es la conexión real: el correo del enlace
mágico y la latencia. Eso se verifica el día que se rellene la configuración.

## Los quince minutos de clics

Esto es lo único que no puedo hacer yo. Si se van a dar con una sesión que
controle el navegador, el guion detallado está en **`PUESTA-EN-MARCHA.md`**;
lo de aquí abajo es el mismo camino en corto.

En orden:

1. **Crear el proyecto.** [supabase.com](https://supabase.com) → *New project*.
   Región **West EU (Ireland)** o **Frankfurt**: los datos de alumnos se quedan
   en la Unión Europea y el RGPD deja de ser una conversación.
   Guardar la contraseña de la base de datos en el gestor de contraseñas, no en
   un papel: no se puede recuperar, solo restablecer.

2. **Crear las tablas.** *SQL Editor* → *New query* → pegar entero
   `supabase/01-esquema.sql` → *Run*. Debe terminar sin errores.
   Después, pegar y ejecutar `supabase/02-verificar.sql`: devuelve ocho filas
   y las ocho tienen que decir `BIEN`. **Si alguna dice `MAL`, parar y
   avisar**: sin RLS, cualquiera con la clave pública lee la tabla entera.

3. **Copiar las claves.** *Project Settings* → *API Keys*:
   - *Project URL* → `supabaseUrl` en `well-config.js`
   - la clave pública → `supabaseAnonKey` en `well-config.js`. Se llama
     *anon public* en los proyectos antiguos y *publishable*
     (`sb_publishable_...`) en los nuevos; sirve cualquiera de las dos.

   La clave `anon` es pública por diseño: viaja en el navegador de todo el
   mundo. No es un secreto y no pasa nada porque esté en el repositorio.
   La que **no se copia nunca a ningún fichero** es `service_role`: esa se
   salta todos los permisos.

4. **Permitir el dominio.** *Authentication* → *URL Configuration*:
   - *Site URL*: `https://academiawell.com`
   - *Redirect URLs*: añadir `https://academiawell.com/practica.html`,
     `https://academia-well.pages.dev/practica.html` y
     `https://*.academia-well.pages.dev/practica.html` para poder probarlo en
     el entorno de pruebas antes de subirlo a producción.

   Si esto no se hace, el enlace del correo lleva a una página en blanco.

5. **El correo.** Supabase manda los enlaces desde su propio servidor, pero con
   un límite de unos pocos correos por hora: sirve para probarlo entre nosotros
   y **no sirve para una clase**. Cuando haya alumnos de verdad hay que
   conectar un proveedor en *Authentication* → *Emails* → *SMTP Settings*
   (Resend o Postmark; entre 0 y 15 €/mes) y remitente `hola@academiawell.com`,
   para que el correo llegue de la academia y no de Supabase.

   Merece la pena traducir la plantilla del enlace al castellano en
   *Authentication* → *Email Templates*: por defecto viene en inglés.

6. **Nombrar a Elena profesora.** Cuando Elena haya entrado una vez con su
   correo, en el *SQL Editor*:

   ```sql
   update public.perfiles set es_profesora = true
   where id = (select id from auth.users where email = 'el-correo-de-elena');
   ```

   Solo funciona desde ahí. Un alumno no puede dárselo a sí mismo: lo impide
   el disparador `protege_es_profesora`.

7. **Rellenar `well-config.js`** con lo del punto 3, subirlo a la rama de
   pruebas, comprobarlo en el sitio de pruebas y solo entonces pasarlo a
   producción. Con la configuración puesta aparece «Guardar mi progreso» en el
   menú de usuario.

## Qué pasa cuando falla

Está pensado para que un servidor caído no pare una clase:

- Sin configuración → la práctica funciona en el navegador y no se ofrece cuenta.
- Con configuración pero sin sesión → igual, y se ofrece entrar.
- Con sesión pero el servidor no responde → el progreso se sigue guardando en
  el navegador y se sube cuando vuelva. El alumno no ve ningún error.
- Al entrar desde otro dispositivo → se funden las dos mitades. Gana la mejor
  nota de cada ejercicio y la racha suma los días de los dos sitios. Nunca se
  elige una versión y se tira la otra.

## Lo que todavía no hace

- **Cobrar.** No hay suscripciones ni pasarela de pago. Es el siguiente paso.
- **Panel de la profesora.** La vista `resumen_alumnos` existe y Elena puede
  consultarla desde el propio panel de Supabase, pero no hay una página bonita
  que la enseñe.
- **Borrar la cuenta.** El RGPD lo exige. Las tablas ya borran en cascada al
  borrar el usuario, pero falta el botón.
- **Corrección del writing y puntuación del speaking.** Necesitan llamadas a la
  API de Claude y a Azure desde un servidor, no desde el navegador: la clave no
  puede viajar al alumno. Eso son funciones *edge* de Supabase, y es el trabajo
  que viene después de los pagos.
