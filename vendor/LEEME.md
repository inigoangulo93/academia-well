# vendor/

Librerías de terceros copiadas al repositorio a propósito.

## `supabase-2.115.0.js`

Cliente oficial de Supabase, versión 2.115.0, compilación UMD para navegador,
tal cual sale de `npm pack @supabase/supabase-js`. Licencia MIT.

**Por qué está aquí y no en un CDN.** Esta web no tiene paso de compilación: lo
que hay en el repositorio es exactamente lo que se sirve. Cargarlo desde un CDN
añadiría una dependencia externa que puede caerse, cambiar bajo nuestros pies o
ser bloqueada, y una petición a un tercero que hay que declarar en la política
de privacidad. Copiado aquí, la web sigue siendo un montón de ficheros estáticos.

Define la variable global `supabase` con `supabase.createClient(url, clave)`.

**Para actualizarlo:**

```
npm pack @supabase/supabase-js
tar xzf supabase-supabase-js-*.tgz
cp package/dist/umd/supabase.js vendor/supabase-<version>.js
```

Y cambiar la etiqueta `<script>` de las páginas que lo usen. No lo actualices
sin pasar `qa/` después.
