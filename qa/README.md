# QA

Comprobaciones automáticas del sitio. Se ejecutan desde la raíz del repositorio.

```
python3 -m http.server 8140 --bind 127.0.0.1 &     # hace falta para las dos últimas
python3 qa/qa-estatico.py        # enlaces rotos, meta, JSON-LD, sitemap, ficheros referenciados
python3 qa/qa-navegador.py       # 11 páginas x 4 anchos: desbordes, errores de consola, imágenes rotas
python3 qa/qa-test-nivel.py      # el test de nivel entero: 5 perfiles, nivel esperado, certificado
```

Los tres devuelven código de salida 1 si encuentran algo. `qa-test-nivel.py` tarda
varios minutos: responde 100 preguntas cinco veces.

**El test de nivel es producción y asigna grupos a alumnos reales.** Si tocas
`test-app.js` o `test-data.js`, pasa `qa-test-nivel.py` antes de publicar.
