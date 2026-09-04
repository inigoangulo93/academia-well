# -*- coding: utf-8 -*-
"""La cabecera no puede temblar.

La cabecera esta en el flujo (position:sticky, no fixed) y encoge al bajar, asi
que al encoger el documento entero mengua lo mismo: 12 px. En una pagina que
sobresale de la ventana justo esos pocos pixeles, el navegador te devuelve
arriba al menguar, la cabecera se estira, el documento vuelve a crecer, y asi
sin parar. Se veia como un temblor y dejaba la pagina sin asentarse nunca:
qa-ejercicios.py reventaba al azar porque no habia manera de pulsar un boton
que no paraba de moverse.

Aqui se estrecha la ventana a proposito hasta cada uno de esos altos criticos
y se comprueba que la cabecera se queda quieta.
"""

import asyncio, os, sys, http.server, socketserver, threading, functools

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CH = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
B = None

PAGS = ['practica.html', 'index.html', 'cursos.html', 'calendario.html',
        'eu/index.html', 'eu/cursos.html', 'eu/calendario.html']

# Cuanto sobresale la pagina de la ventana, en pixeles. La franja peligrosa es
# la de alrededor del salto de altura de la cabecera.
SOBRAS = [4, 6, 8, 10, 12, 14, 16, 18, 22, 26, 40]

class Silencioso(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a, **k): pass

def servidor():
    global B
    socketserver.TCPServer.allow_reuse_address = True
    s = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Silencioso, directory=R))
    B = 'http://127.0.0.1:%d/' % s.server_address[1]
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s

# Cuarenta fotogramas seguidos de la clase y del scroll. Si algo cambia mas de
# una vez, es que se esta peleando consigo mismo.
MIRA = """() => new Promise(res => {
  const c = document.querySelector('header.main');
  const v = []; let n = 0;
  (function paso() {
    v.push((c.classList.contains('scrolled') ? 1 : 0) + ':' + Math.round(window.scrollY));
    if (++n < 40) requestAnimationFrame(paso); else res(v);
  })();
})"""

async def main():
    srv = servidor()
    from playwright.async_api import async_playwright
    fallos = []
    async with async_playwright() as pw:
        b = await pw.chromium.launch(executable_path=CH, args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width': 1280, 'height': 900})
        await pg.route('**/*', lambda r: asyncio.ensure_future(r.abort())
                       if '127.0.0.1' not in r.request.url else asyncio.ensure_future(r.continue_()))
        for p in PAGS:
            await pg.set_viewport_size({'width': 1280, 'height': 900})
            await pg.goto(B + p, wait_until='domcontentloaded')
            await pg.wait_for_timeout(600)
            alto = await pg.evaluate('()=>document.documentElement.scrollHeight')
            fila = []
            for sobra in SOBRAS:
                await pg.set_viewport_size({'width': 1280, 'height': alto - sobra})
                await pg.wait_for_timeout(250)
                await pg.evaluate('()=>window.scrollTo(0, 99999)')
                await pg.wait_for_timeout(700)
                v = await pg.evaluate(MIRA)
                cambios = sum(1 for i in range(1, len(v)) if v[i] != v[i - 1])
                fila.append('.' if cambios == 0 else 'X')
                if cambios:
                    fallos.append('%s con %d px de sobra: %d cambios en 40 fotogramas (%s)'
                                  % (p, sobra, cambios, ' '.join(v[:6])))
            print('%-22s %s' % (p, ''.join(fila)))
        await b.close()
    srv.shutdown()
    print()
    if fallos:
        print('%d FALLOS' % len(fallos))
        for f in fallos: print('  X', f)
        sys.exit(1)
    print('La cabecera se queda quieta en los %d altos criticos de %d paginas.'
          % (len(SOBRAS), len(PAGS)))

asyncio.run(main())
