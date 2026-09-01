# Academia Well · Web

Sitio estático de Academia Well (Galdakao). Sin build, sin dependencias: HTML autocontenido.

- `index.html` — portada
- `cursos.html` — el curso: entrada por edad/nivel, camino Cambridge, precios, horarios
- `calendario.html` — calendario oficial 2026-27 (imprimible desde el navegador)
- `404.html` — página de error
- `.nojekyll` — desactiva el procesado Jekyll de GitHub Pages

## Publicación

GitHub Pages desde la rama `main`, carpeta raíz.

## Iterar

Los HTML son la fuente de verdad: editar y commit publica en 1-2 minutos.
- Festivos del calendario: array `FESTIVOS` en calendario.html
- Horarios por nivel: array `horarios` en el script de index.html y cursos.html
- Logo: SVG inline (hex #21409A / #C0293B), favicon en base64

## Pendiente antes del lanzamiento

- Confirmar festivos dudosos: 25 feb, 6 abr, 22 abr, 8 jun, y la vuelta de enero (Reyes añadido de oficio)
- Sustituir fotos de Unsplash por fotos reales del local
- Embeber el mapa real de Google Maps en la sección contacto
- Versión en euskera

## Dominio

Con el visto bueno: CNAME `nueva.academiawell.com` → `inigoangulo93.github.io`,
y añadirlo en Settings → Pages → Custom domain.
