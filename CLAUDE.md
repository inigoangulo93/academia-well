# Academia Well · notas para Claude

Web de Academia Well (academia de inglés en Galdakao, Bizkaia).
Sitio estático publicado en **https://academiawell.com** con GitHub Pages
(repositorio `inigoangulo93/academia-well`, rama `main`, carpeta raíz, `CNAME`).

---

## Regla número uno: sincroniza antes de tocar nada

```
git pull origin main
```

**Esta web se edita desde varias sesiones y máquinas.** Una copia local de hace
dos días no contiene ni la versión en euskera ni el test de nivel. Si trabajas
sobre una copia antigua y publicas, borras semanas de trabajo.

**Nunca reconstruyas el sitio a partir de un .zip, una exportación o una copia
descargada.** Si alguien te pasa un paquete de ficheros, compáralo primero
contra `origin/main` fichero a fichero y di qué se perdería; no lo apliques por
encima. La fuente de verdad es siempre `origin/main`.

---

## Qué tiene el sitio (no debe desaparecer nada de esto)

**Páginas, en dos idiomas.** Cada cambio de contenido se aplica a las dos
versiones: castellano en la raíz, euskera en `eu/`.

| Fichero | Qué es |
|---|---|
| `index.html` · `eu/index.html` | Portada |
| `cursos.html` · `eu/cursos.html` | El curso, camino Cambridge, horarios |
| `calendario.html` · `eu/calendario.html` | Calendario 2026-27, imprimible |
| `test.html` · `eu/test.html` | Test de nivel online (funnel principal) |
| `404.html` | Error, **única y en la raíz**: Pages solo sirve esa. Detecta el idioma por la URL |

**Test de nivel.** `test-app.js` (motor, compartido por los dos idiomas) y
`test-data.js` (las 100 preguntas transcritas del test en papel de la academia).
La clave de respuestas, los mínimos de paso por bloque y lo que falta validar
están en `test-clave.md`. **No inventes preguntas ni cambies respuestas** sin
anotarlo ahí.

**Redirecciones de la web antigua** — en la raíz (`contacto.html`,
`academia.html`, `jovenes-y-adultos.html`, `empresas.html`,
`talleres-de-verano.html`, `mapa-del-sitio.html`) y las mismas bajo `es/`, que
es donde la web antigua colgaba el castellano (`academiawell.com/es/...`).
Google todavía enseña esas URL. No van en el sitemap. El resolutor de `404.html`
ignora además el prefijo `/es` y manda a la portada cualquier ruta suelta de ese
árbol, así que ninguna URL vieja acaba en un callejón sin salida.

**Iconos** — `favicon.ico`, `favicon.svg`, `favicon-96.png`, `icon-192.png`,
`icon-512.png`, `apple-touch-icon.png`, `site.webmanifest`. Se regeneran con
`gen-iconos.py`. Deben ser **ficheros con URL propia**: un `data:` URI no lo
indexa Google y por eso durante meses no salió el logo en los resultados.

**Cartel de reseñas** — `cartel-resena-google.pdf` (A4 para la puerta) y
`gen-cartel.py`. Su QR apunta a `academiawell.com/resena`, **nunca directamente
a Google**: así el enlace se cambia editando `resena.html` sin reimprimir nada.

**Imágenes** — `logo.png`, `og.jpg`, `og-eu.jpg`, `cambridge-english.png`,
`cambridge-escudo.png`.

---

## Cómo se trabaja aquí

- **Sin build ni dependencias.** Cada HTML lleva su CSS y su JS dentro. Lo que
  hay en el repositorio es exactamente lo que se sirve. Se acepta la
  duplicación de estilos entre páginas como precio de no tener cadena de build.
- **URLs absolutas** (canónicas, hreflang, sitemap, Open Graph, datos
  estructurados) apuntan a `https://academiawell.com/`.
- **Verifica en un navegador de verdad antes de publicar.** Hay Chromium y
  Playwright disponibles. Comprueba escritorio y móvil (360, 390 y 1440 px):
  sin desbordes horizontales, sin palabras pegadas, consola limpia, y los
  bloques JSON-LD parseando.
- **CTA**: un solo botón relleno por grupo, y si hace falta uno secundario en
  contorno. Ningún botón debe partirse en dos líneas. El CTA principal del
  sitio es el test de nivel.
- **Fotos**: solo de stock verificadas o reales de la academia. Ninguna se
  repite dentro de la misma página. Nunca generar fotos falsas de alumnos o
  profesores.

## Marca

Azul `#21409A` · carmín `#C0293B` · crema `#FDFCF9` · tinta `#232B42` ·
gris `#5E6575` · verde WhatsApp `#128C4B`.
Tipografías: **Bree Serif** (títulos) y **Figtree** (texto).
La W del logo, como trazo suelto:
`M8 12 C22 98 36 98 48 54 C55 27 65 27 72 54 C84 98 98 98 112 12`
(viewBox 120×110, grosor 13, extremos redondeados).

## Honestidad en el contenido

Esto es el negocio real de una persona. Nunca inventes:

- **Reseñas.** Solo se publican las que envía la academia, tal cual las
  escribieron. Quedan 3 de 4; la cuarta está pendiente.
- **Acreditaciones de Cambridge.** El texto actual dice lo que dice por algo:
  centro preparador oficial. Ni una palabra más.
- **Datos, precios, horarios, festivos.** Si algo no está confirmado, se
  pregunta; no se rellena.
- **No hay ninguna prueba de nivel presencial.** El test online es *el* test con
  el que se asigna nivel. Nunca escribir que la academia "confirma" el nivel con
  otra prueba: lo que queda por concretar es el grupo, el horario y las plazas.
  El certificado en PDF sí debe seguir diciendo que no es una certificación
  oficial de Cambridge English.

## Pendiente de la academia

- **Validar la clave de respuestas y los mínimos de paso** (`test-clave.md`).
  Es lo más urgente: al no existir prueba presencial, este test decide en qué
  grupo entra cada alumno, y la clave todavía no la ha revisado la academia.
- La cuarta reseña real.
- Confirmar horario de apertura declarado en los datos estructurados
  (L–J 16:00–21:00) y las fechas de vuelta de enero del calendario.
- Sustituir las fotos de stock por fotos reales (orden de prioridad en el README).
- Decidir si "Empresas" y "Talleres de verano" vuelven como secciones propias;
  hoy solo existen como redirección a contacto.
