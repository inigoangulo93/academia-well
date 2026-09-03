# Academia Well · Web

Sitio estático de Academia Well (Galdakao). Sin build, sin dependencias: HTML autocontenido.

## Estructura

- `index.html` — portada
- `cursos.html` — el curso: entrada por nivel, camino Cambridge, qué es cada nivel, precios, horarios
- `calendario.html` — calendario oficial 2026-27 (imprimible desde el navegador)
- `404.html` — página de error (única, GitHub Pages solo sirve la de la raíz; detecta el idioma por la URL)
- `favicon.ico` · `favicon.svg` · `favicon-96.png` · `icon-192.png` · `icon-512.png` ·
  `apple-touch-icon.png` · `site.webmanifest` — iconos del sitio. Se generan con
  `gen-iconos.py` a partir de la W de la marca. **Deben ser ficheros con URL propia**:
  un `data:` URI no lo puede indexar Google y por eso no salía el logo en los resultados.
- `contacto.html`, `academia.html`, `jovenes-y-adultos.html`, `empresas.html`,
  `talleres-de-verano.html`, `mapa-del-sitio.html` — redirecciones de las URL de la
  web antigua que Google todavía enseña. No van en el sitemap.
- `eu/` — las mismas cuatro páginas en euskera
- `og.jpg` / `og-eu.jpg` — tarjetas de previsualización al compartir el enlace (1200×630)
- `robots.txt`, `sitemap.xml` — indexación
- `.nojekyll` — desactiva el procesado Jekyll de GitHub Pages

## Publicación

GitHub Pages desde la rama `main`, carpeta raíz.

## Iterar

Los HTML son la fuente de verdad: editar y commit publica en 1-2 minutos.

- **Festivos del calendario**: array `FESTIVOS` en `calendario.html`. Está separado en dos
  bloques: festivos oficiales del BOPV y vacaciones propias de la academia.
- **Horarios por nivel**: array `horarios` en el script de `index.html` y `cursos.html`
- **Preguntas y niveles**: bloques `<details>` en `index.html` (#faq) y `cursos.html` (#niveles)
- **Logo**: SVG inline (hex #21409A / #C0293B), favicon en base64

### Al tocar textos, tocar los dos idiomas

Cada cambio de contenido va en la página castellana y en su gemela de `eu/`. El selector
ES/EU enlaza páginas equivalentes, así que si se añade una página hay que crear su pareja.

### Al cambiar de dominio

Todas las URL absolutas (canonicas, hreflang, sitemap, Open Graph, datos
estructurados) apuntan a `https://academiawell.com/`.

## SEO

- Datos estructurados JSON-LD: `LanguageSchool` + `FAQPage` en portada, `ItemList` de cursos
  y `BreadcrumbList` en el resto
- `canonical` y `hreflang` (es / eu / x-default) en las ocho páginas

## Pendiente antes del lanzamiento

- Confirmar el horario de atención declarado en los datos estructurados (lunes a jueves,
  16.00–21.00, deducido de los turnos publicados)
- Confirmar la vuelta de vacaciones de enero en el calendario
- Sustituir las fotos de Unsplash por fotos reales, por orden de impacto:
  1. Hero de la portada (3 fotos): el aula con alumnos, la fachada del local y una clase en marcha.
  2. Tarjetas "Entrada por nivel" y "Niveles de examen": una clase real y una sesion de preparacion de examen.
  3. Seccion "Nuestro metodo" (2 fotos): profesores dando clase, material propio sobre la mesa.
  4. Mosaicos de Instagram (3 fotos por pagina): fotos reales del dia a dia (mejor si son las del propio Instagram).
  5. Hero de la pagina de curso (2 fotos superpuestas).
  No usar fotos generadas por IA de alumnos o profesores.

## Test de nivel online

`test.html` y `eu/test.html` (interfaz), `test-app.js` (motor compartido) y
`test-data.js` (las 100 preguntas del test presencial). La clave de respuestas,
los minimos de paso por bloque y las decisiones pendientes de validar estan
en `test-clave.md`. Los leads llegan por WhatsApp con el nivel ya escrito.

## Dominio

El sitio se sirve en https://academiawell.com (fichero `CNAME` en la raiz, DNS del
apex apuntando a las IP de GitHub Pages). Todas las URL absolutas del sitio
(canonicas, hreflang, sitemap, Open Graph, datos estructurados) usan ese dominio.
En Settings → Pages conviene tener marcado "Enforce HTTPS".
