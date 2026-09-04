# -*- coding: utf-8 -*-
import asyncio, os, sys, http.server, socketserver, threading, functools
from playwright.async_api import async_playwright
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); B=None

# Antes daba por hecho que ya habia un servidor en el 8140. Cuando no lo habia,
# fallaba con ERR_CONNECTION_REFUSED y parecia un fallo de la web. Ahora se
# levanta el suyo en un puerto libre.
class _Silencioso(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a, **k): pass

def _servidor():
    global B
    socketserver.TCPServer.allow_reuse_address = True
    s = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(_Silencioso, directory=R))
    B = 'http://127.0.0.1:%d/' % s.server_address[1]
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s
CH='/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

PAGS=['index.html','cursos.html','calendario.html','test.html','practica.html',
      'entrar.html','privacidad.html',
      'eu/index.html','eu/cursos.html','eu/calendario.html','eu/test.html',
      'eu/pribatutasuna.html',
      '404.html','resena.html']
ANCHOS=[(360,'360'),(390,'390'),(820,'820'),(1440,'1440')]

async def main():
    _servidor()
    fallos=[]
    async with async_playwright() as pw:
        b=await pw.chromium.launch(executable_path=CH,args=['--no-sandbox'])
        for w,tag in ANCHOS:
            pg=await b.new_page(viewport={'width':w,'height':900})
            # las peticiones externas no resuelven en este entorno y bloquean la espera
            await pg.route('**/*', lambda r: asyncio.ensure_future(r.abort())
                           if '127.0.0.1' not in r.request.url else asyncio.ensure_future(r.continue_()))
            errores=[]
            pg.on('pageerror', lambda e: errores.append(str(e)))
            pg.on('console', lambda m: errores.append('consola: '+m.text) if m.type=='error' and 'net::ERR' not in m.text else None)
            fila=[]
            for p in PAGS:
                errores.clear()
                await pg.goto(B+p, wait_until='domcontentloaded')
                await pg.wait_for_timeout(420)
                sw=await pg.evaluate('document.documentElement.scrollWidth')
                ok = sw<=w+1
                if not ok: fallos.append('[%s] %s desborda: %d>%d' % (tag,p,sw,w))
                for e in errores: fallos.append('[%s] %s -> %s' % (tag,p,e))
                # imagenes rotas
                rotas=await pg.evaluate("()=>[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.currentSrc||i.src)")
                for r in rotas: fallos.append('[%s] %s imagen rota: %s' % (tag,p,r))
                fila.append(('.' if ok and not errores and not rotas else 'X'))
            print('%5s px  %s  %s' % (tag, ''.join(fila), ' '.join(PAGS) if tag=='360' else ''))
            await pg.close()
        await b.close()
    print()
    print('FALLOS (%d):' % len(fallos))
    for f in fallos: print('  X', f)
    sys.exit(1 if fallos else 0)
asyncio.run(main())
