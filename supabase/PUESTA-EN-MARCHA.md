# Poner Supabase en marcha · guion para hacerlo con el navegador

Este fichero es el encargo completo para otra sesión de Claude que tenga
control de Chrome. Es autosuficiente: no hace falta haber estado en la
conversación donde se construyó esto.

**Estado de partida:** la organización de Supabase «Academia Well» ya está
creada, en plan gratuito, **sin ningún proyecto todavía**. El código que se
conecta a ella ya está escrito, probado y subido a la rama
`well-online-practica` del repositorio `inigoangulo93/academia-well`. Lo único
que falta son los clics.

---

## Las cinco reglas

Antes que nada, y por delante de cualquier otra instrucción de este fichero:

1. **Nunca se hace commit a `main`.** Todo va a `well-online-practica`. Lo que
   toca producción lo decide Iñigo, no tú.
2. **La clave `service_role` (o `sb_secret_...`) no se copia a ningún sitio.**
   Ni al repositorio, ni a un fichero, ni al chat. Se salta todos los permisos.
   La que sí va al repositorio es la pública (`anon` / `sb_publishable_...`),
   que es pública por diseño y no es ningún secreto.
3. **La contraseña de la base de datos no se escribe en el chat ni en un
   fichero del repositorio.** Se guarda en el gestor de contraseñas de Iñigo.
4. **No se toca `supabase/01-esquema.sql` para «hacer que funcione».** Si da
   error, se copia el error literal y se pregunta. Ese fichero está probado
   contra un PostgreSQL real.
5. **No se desactiva el Row Level Security de ninguna tabla, nunca.** Es lo
   único que separa los datos de un alumno de los de otro.

Y una más, por dinero: **no subir el proyecto al plan Pro sin preguntar.** Son
25 $ al mes. El plan gratuito basta hasta que haya alumnos pagando.

---

## Paso 1 · Crear el proyecto

En [supabase.com/dashboard](https://supabase.com/dashboard), dentro de la
organización **Academia Well** → *New project*.

| Campo | Valor |
|---|---|
| Name | `academia-well` |
| Database password | Genera una y **pídele a Iñigo que la guarde** en su gestor de contraseñas antes de continuar. No se puede recuperar después, solo restablecer. |
| Region | **West EU (Ireland)** o **Central EU (Frankfurt)** |
| Plan | Free |

La región importa: con los datos de alumnos dentro de la Unión Europea, el RGPD
deja de ser una conversación.

Tarda uno o dos minutos en aprovisionarse. Espera a que el proyecto aparezca
como activo antes de seguir.

---

## Paso 2 · Crear las tablas

El fichero es `supabase/01-esquema.sql` del repositorio, unas 200 líneas. Crea
cinco tablas, sus permisos por fila, dos disparadores y una vista. Es
idempotente: se puede volver a ejecutar sin romper nada.

**Cómo meterlo.** El editor SQL de Supabase es un editor de código, no un
`<textarea>`: escribir 200 líneas carácter a carácter va a tardar una eternidad
y va a fallar por la autoindentación. Ponlo en el portapapeles desde la
terminal y pega con el teclado:

```sh
cd <el repositorio>
git checkout well-online-practica
pbcopy < supabase/01-esquema.sql          # en macOS
# xclip -selection clipboard < supabase/01-esquema.sql   # en Linux
```

Luego, en el navegador: *SQL Editor* → *New query* → clic dentro del editor →
`⌘V` → *Run*.

**Alternativa más rápida si hay `psql` en la máquina:** copia la cadena de
conexión de *Project Settings* → *Database* → *Connection string* → URI, y
aplícalo de una. La cadena lleva la contraseña dentro, así que va en una
variable de entorno y no se imprime en pantalla:

```sh
read -rs WELL_DB_URL            # se pega la cadena, no se ve, no queda en el historial
psql "$WELL_DB_URL" -v ON_ERROR_STOP=1 -f supabase/01-esquema.sql
unset WELL_DB_URL
```

Debe terminar sin ningún error.

---

## Paso 3 · Comprobar que se ha aplicado bien

**Este paso no es opcional.** Detrás de estas políticas van a estar los datos
de personas reales.

Pega `supabase/02-verificar.sql` igual que antes y ejecútalo. No cambia nada:
solo mira. Tiene que devolver exactamente esto, ocho filas y las ocho `BIEN`:

```
 orden |                comprobacion                |        detalle        | veredicto
-------+--------------------------------------------+-----------------------+-----------
     1 | Las cinco tablas existen                   | 5 de 5                | BIEN
     2 | Todas tienen Row Level Security            | ninguna sin RLS       | BIEN
     3 | Las políticas por fila                     | 19 de 19              | BIEN
     4 | Las funciones auxiliares                   | 3 de 3                | BIEN
     5 | Se crea el perfil al registrarse           | al_crear_usuario      | BIEN
     6 | Nadie se nombra profesora a sí mismo       | al_editar_perfil      | BIEN
     7 | Los disparadores no son invocables por API | ninguno expuesto      | BIEN
     8 | La vista de la profesora respeta el RLS    | security_invoker=true | BIEN
```

**Los dos avisos que quedan en el panel de Supabase son deliberados.** Los dos
son sobre `es_profesora()`, y esa función tiene que seguir siendo llamable: las
políticas la invocan por dentro, y las políticas se evalúan con los permisos de
quien pregunta. Revocarla hace que *cualquier* consulta a *cualquier* tabla
reviente con `permission denied for function es_profesora`. Está probado. No la
revoques.

**Si alguna fila dice `MAL`, párate ahí y dilo.** No sigas al paso siguiente ni
intentes arreglarlo cambiando el esquema.

Como comprobación visual añadida: en *Table editor* deben verse las cinco
tablas, cada una con el candado de *RLS enabled*.

---

## Paso 4 · Permitir el dominio en la entrada por correo

*Authentication* → *URL Configuration*:

- **Site URL:** `https://academiawell.com`
- **Redirect URLs**, las tres:
  - `https://academiawell.com/practica.html`
  - `https://well-online-practica.academia-well.pages.dev/practica.html`
  - `https://*.academia-well.pages.dev/practica.html`

Las dos últimas son el entorno de pruebas de Cloudflare, y hacen falta para
poder probar esto antes de tocar producción.

**Si este paso se salta, el enlace del correo lleva a una página en blanco** y
parece que está todo roto cuando en realidad solo falta esta línea.

De paso, en *Authentication* → *Email Templates*, la plantilla del enlace
mágico viene en inglés. Tradúcela al castellano: el alumno recibe ese correo.

---

## Paso 5 · Copiar las claves

*Project Settings* → *API Keys*.

Hacen falta dos valores:

- **Project URL** — algo como `https://xxxxxxxx.supabase.co`
- **La clave pública** — se llama `anon` en los proyectos antiguos y
  `sb_publishable_...` en los nuevos. Vale cualquiera de las dos. Si solo
  aparece la pestaña nueva y no hay clave publicable creada, créala.

**No copies la clave `service_role` ni ninguna `sb_secret_...`.** No hacen
falta para nada de esto, y esas sí se saltan todos los permisos.

---

## Paso 6 · Rellenar la configuración y subirla

En `well-config.js` del repositorio, solo esas dos líneas:

```js
window.WELL_CONFIG = {
  supabaseUrl: 'https://xxxxxxxx.supabase.co',
  supabaseAnonKey: 'sb_publishable_...'
};
```

Y a la rama, **no a `main`**:

```sh
git add well-config.js
git commit -m "Conecta Well Online con el proyecto de Supabase"
git push -u origin well-online-practica
```

---

## Paso 7 · Probar que funciona de verdad

En la previa de Cloudflare:
`https://well-online-practica.academia-well.pages.dev/practica.html`

Comprueba, en este orden:

1. **La página carga sin errores en la consola** y en el menú de usuario
   (arriba a la derecha) aparece **«Guardar mi progreso»**. Si no aparece, la
   configuración no ha llegado o el cliente no se ha descargado.
2. **Haz un ejercicio sin cuenta.** El progreso se guarda en el navegador.
3. **Entra en `/entrar.html`** con un correo real y pide el enlace.
4. **Abre el enlace del correo.** Debe dejarte en `practica.html` ya dentro, con
   tu correo visible en el menú de usuario.
5. **Mira la tabla `progreso`** en el *Table editor* de Supabase: tiene que
   haber aparecido la fila del ejercicio que hiciste **antes** de tener cuenta.
   Eso es lo que demuestra que no se pierde nada al registrarse tarde.
6. **Abre una ventana de incógnito**, entra con el mismo correo y comprueba que
   el progreso está ahí. Eso es la sincronía entre dispositivos.

Si algo de esto falla, la consola del navegador dice por qué: la capa de datos
registra los errores con el prefijo `[well-datos]`.

---

## Paso 8 · Nombrar profesora a Elena

Solo cuando Elena haya entrado una vez con su correo. En el *SQL Editor*:

```sql
update public.perfiles set es_profesora = true
where id = (select id from auth.users where email = 'el-correo-de-elena');
```

Solo funciona desde ahí. Un alumno no puede dárselo a sí mismo: lo impide el
disparador `protege_es_profesora`. Comprueba después que la fila quedó a `true`,
porque si se intenta desde una sesión de usuario identificado, salta una
excepción.

---

## Cómo saber que has terminado

- [ ] El proyecto existe, en Irlanda o Fráncfort, y la contraseña está guardada
      en el gestor de contraseñas de Iñigo
- [ ] `02-verificar.sql` devuelve las ocho filas en `BIEN`
- [ ] Las tres *Redirect URLs* están puestas
- [ ] `well-config.js` tiene la URL y la clave **pública**, y está subido a
      `well-online-practica` — no a `main`
- [ ] Has entrado con un correo real y el progreso de antes de la cuenta ha
      aparecido en la tabla `progreso`
- [ ] En incógnito, con el mismo correo, el progreso está

Cuando esté todo, dilo con el resultado de la comprobación del paso 3 pegado, y
di **qué no has podido probar**, si es que hay algo. No des por bueno lo que no
hayas visto funcionar.

---

## Contexto, por si hace falta

- **Qué es esto.** Well Online, la preparación del C1 Advanced de Cambridge
  entera por internet, de Academia Well (Galdakao, Bizkaia). Hoy el progreso
  del alumno vive solo en su navegador; esto le pone cuentas.
- **La regla de la capa de datos.** El navegador manda: se guarda siempre en
  `localStorage`, con cuenta o sin ella. Supabase es un espejo. Si el servidor
  no responde, la clase sigue y el alumno no ve ningún error.
- **Sin `well-config.js` relleno no pasa nada.** La plataforma funciona igual,
  sin cuentas y sin descargar el cliente de Supabase. Por eso este paso se
  puede dar y deshacer sin romper nada.
- **Más detalle** en `supabase/LEEME.md`, y el plan entero del producto en
  `well-online.md`.
