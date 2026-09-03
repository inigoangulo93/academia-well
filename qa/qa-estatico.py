# -*- coding: utf-8 -*-
"""QA estatico: enlaces, meta, JSON-LD, referencias a ficheros."""
import os, re, json, io, sys, html
R='/home/user/academia-well-src'
fallos, avisos = [], []

htmls=[]
for base,dirs,fs in os.walk(R):
    if '.git' in base: continue
    for f in fs:
        if f.endswith('.html'): htmls.append(os.path.relpath(os.path.join(base,f), R))
htmls.sort()

def lee(p): return io.open(os.path.join(R,p),encoding='utf-8').read()

print('=== %d paginas HTML ===' % len(htmls))
for p in htmls:
    d=lee(p)
    es_redir = 'http-equiv="refresh"' in d
    es_proto = 'noindex' in d
    # meta basicos
    if '<meta charset' not in d: fallos.append('%s: sin <meta charset>' % p)
    if 'name="viewport"' not in d: fallos.append('%s: sin viewport' % p)
    if '<title>' not in d: fallos.append('%s: sin <title>' % p)
    if not es_redir and not es_proto:
        if 'rel="canonical"' not in d: fallos.append('%s: sin canonical' % p)
        if 'name="description"' not in d: avisos.append('%s: sin description' % p)
    # lang
    m=re.search(r'<html[^>]*lang="([a-z]{2})"', d)
    if not m: fallos.append('%s: <html> sin lang' % p)

    # enlaces internos
    for href in re.findall(r'(?:href|src)="([^"#][^"]*)"', d):
        if href.startswith(('http','mailto:','tel:','data:','//','javascript:')): continue
        limpio=href.split('#')[0].split('?')[0]
        if not limpio: continue
        destino = os.path.normpath(os.path.join(R, limpio.lstrip('/'))) if limpio.startswith('/') \
                  else os.path.normpath(os.path.join(R, os.path.dirname(p), limpio))
        if not os.path.exists(destino):
            # las URL limpias sin .html las resuelve Pages
            if not os.path.exists(destino+'.html'):
                fallos.append('%s -> %s (no existe)' % (p, href))

    # JSON-LD
    for i,bloque in enumerate(re.findall(r'<script type="application/ld\+json">(.*?)</script>', d, re.S)):
        try: json.loads(html.unescape(bloque))
        except Exception as e: fallos.append('%s: JSON-LD #%d no parsea: %s' % (p,i+1,e))

# sitemap
sm=lee('sitemap.xml')
urls=re.findall(r'<loc>https://academiawell\.com/?([^<]*)</loc>', sm)
print('=== sitemap: %d URLs ===' % len(urls))
for u in urls:
    ruta = u if u else 'index.html'
    if ruta.endswith('/'): ruta += 'index.html'
    if not os.path.exists(os.path.join(R, ruta)) and not os.path.exists(os.path.join(R, ruta+'.html')):
        fallos.append('sitemap -> %s no existe' % u)
# redirecciones no deben estar en el sitemap
for p in htmls:
    if 'http-equiv="refresh"' in lee(p):
        base=p.replace('.html','')
        if base in urls or p in urls: fallos.append('sitemap incluye la redireccion %s' % p)

# ficheros referenciados por los datos del prototipo
datos=lee('practica-data.js')
for aud in re.findall(r'"audio":\s*"([^"]+)"', datos):
    if not os.path.exists(os.path.join(R,aud)): fallos.append('practica-data.js -> %s no existe' % aud)

print()
print('FALLOS (%d):' % len(fallos))
for f in fallos: print('  X', f)
print('AVISOS (%d):' % len(avisos))
for a in avisos: print('  -', a)
sys.exit(1 if fallos else 0)
