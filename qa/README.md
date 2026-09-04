# QA

Comprobaciones automáticas del sitio. Se ejecutan desde la raíz del repositorio.

```
python3 -m http.server 8140 --bind 127.0.0.1 &     # hace falta para las dos últimas
python3 qa/qa-estatico.py        # enlaces rotos, meta, JSON-LD, sitemap, ficheros referenciados
python3 qa/qa-navegador.py       # 11 páginas x 4 anchos: desbordes, errores de consola, imágenes rotas
python3 qa/qa-test-nivel.py      # el test de nivel entero: 5 perfiles, nivel esperado, certificado
python3 qa/qa-supabase.py        # la capa de datos, con un Supabase de mentira (levanta su propio servidor)
python3 qa/qa-reading.py         # las cuatro partes del Reading: se pintan, se contestan y se corrigen
```

`qa-supabase.py` sustituye el cliente de Supabase por `qa/falso-supabase.js`,
porque este entorno no tiene salida hacia supabase.com. Comprueba lo que le
prometemos al alumno: que sin cuenta todo funciona igual, que al entrar sube lo
que ya tenía en el navegador, que baja desde otro dispositivo, que si ha
practicado en los dos sitios no se pierde ninguna mitad y que recargar no
duplica nada. Los permisos por fila se prueban aparte, contra un PostgreSQL de
verdad: `./supabase/probar-permisos.sh`.

Todos devuelven código de salida 1 si encuentran algo. `qa-test-nivel.py` tarda
varios minutos: responde 100 preguntas cinco veces.

**El test de nivel es producción y asigna grupos a alumnos reales.** Si tocas
`test-app.js` o `test-data.js`, pasa `qa-test-nivel.py` antes de publicar.
