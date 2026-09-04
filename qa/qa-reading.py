# -*- coding: utf-8 -*-
"""Prueba las cuatro partes del Reading en el navegador.

No basta con que los datos estén bien escritos: hay que ver que se pintan, que
se pueden contestar y que el motor corrige lo que debe. Se responde cada
ejercicio dos veces, todo bien y todo mal, y se comprueba la nota.
"""
import asyncio, os, sys, http.server, socketserver, threading, functools

R = '/home/user/academia-well-src'
CH = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
B = None
fallos = []

def comprueba(cond, texto):
    print(('  ok   ' if cond else '  FALLA') + '  ' + texto)
    if not cond: fallos.append(texto)

class Silencioso(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a, **k): pass

def servidor():
    global B
    socketserver.TCPServer.allow_reuse_address = True
    s = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Silencioso, directory=R))
    B = 'http://127.0.0.1:%d/' % s.server_address[1]
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s

EJS = ['t1-read5', 't1-read6', 't1-read7', 't1-read8']

async def main():
    srv = servidor()
    from playwright.async_api import async_playwright
    async with async_playwright() as pw:
        b = await pw.chromium.launch(executable_path=CH, args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width': 1280, 'height': 900})
        await pg.route('**/*', lambda r: asyncio.ensure_future(r.abort())
                       if '127.0.0.1' not in r.request.url else asyncio.ensure_future(r.continue_()))
        errores = []
        pg.on('pageerror', lambda e: errores.append(str(e)))
        pg.on('console', lambda m: errores.append('consola: ' + m.text)
              if m.type == 'error' and 'net::ERR' not in m.text else None)

        for ident in EJS:
            print('\n%s' % ident)
            errores.clear()
            await pg.goto(B + 'practica.html#' + ident, wait_until='domcontentloaded')
            await pg.wait_for_timeout(600)

            datos = await pg.evaluate("id => window.WELL_PRACTICA.ejercicios[id]", ident)
            n = len(datos['items'])

            visible = await pg.evaluate("() => !document.querySelector('#s-ejercicio').classList.contains('activa') ? null : true")
            comprueba(visible is True, 'se abre la pantalla del ejercicio')

            grupos = await pg.evaluate("() => document.querySelectorAll('#ej-cuerpo .grupo-op').length")
            comprueba(grupos == n, 'pinta %d preguntas (esperadas %d)' % (grupos, n))

            # el material de lectura tiene que estar delante de las preguntas
            tiene = await pg.evaluate("""() => ({
              texto: !!document.querySelector('#ej-cuerpo .lectura-texto'),
              secciones: document.querySelectorAll('#ej-cuerpo .seccion').length,
              huecos: document.querySelectorAll('#ej-cuerpo .lectura-hueco').length
            })""")
            if datos.get('texto'):
                comprueba(tiene['texto'], 'enseña el texto que hay que leer')
            if datos.get('secciones'):
                comprueba(tiene['secciones'] == len(datos['secciones']),
                          'enseña las %d secciones (vistas %d)' % (len(datos['secciones']), tiene['secciones']))
            if ident == 't1-read7':
                comprueba(tiene['huecos'] == 6, 'marca los seis huecos de párrafo (vistos %d)' % tiene['huecos'])

            # --- todo correcto ---
            await pg.evaluate("""id => {
              const ej = window.WELL_PRACTICA.ejercicios[id];
              document.querySelectorAll('#ej-cuerpo .grupo-op').forEach((g, i) => {
                g.querySelectorAll('.op')[ej.items[i].correcta].click();
              });
            }""", ident)
            await pg.wait_for_timeout(200)
            await pg.click('#btn-corregir')
            await pg.wait_for_timeout(400)
            nota = await pg.evaluate("() => document.querySelector('#ej-nota') ? document.querySelector('#ej-nota').textContent : ''")
            buenas = await pg.evaluate("() => document.querySelectorAll('#ej-cuerpo .op.buena').length")
            falladas = await pg.evaluate("() => document.querySelectorAll('#ej-cuerpo .op.fallada').length")
            comprueba(buenas == n and falladas == 0,
                      'todo correcto: %d aciertos, %d fallos · nota "%s"' % (buenas, falladas, nota.strip()))

            # --- todo mal ---
            await pg.goto(B + 'practica.html', wait_until='domcontentloaded')
            await pg.evaluate("() => localStorage.clear()")
            await pg.goto(B + 'practica.html#' + ident, wait_until='domcontentloaded')
            await pg.wait_for_timeout(500)
            await pg.evaluate("""id => {
              const ej = window.WELL_PRACTICA.ejercicios[id];
              document.querySelectorAll('#ej-cuerpo .grupo-op').forEach((g, i) => {
                const ops = g.querySelectorAll('.op');
                const mala = (ej.items[i].correcta + 1) % ops.length;
                ops[mala].click();
              });
            }""", ident)
            await pg.wait_for_timeout(200)
            await pg.click('#btn-corregir')
            await pg.wait_for_timeout(400)
            falladas = await pg.evaluate("() => document.querySelectorAll('#ej-cuerpo .op.fallada').length")
            comprueba(falladas == n, 'todo mal: marca los %d fallos (marcados %d)' % (n, falladas))

            comprueba(not errores, 'sin errores de consola: %s' % (errores or 'ninguno'))
            await pg.evaluate("() => localStorage.clear()")

        # --- que no desborde en movil ---
        print('\nAnchos')
        for w in (360, 390, 820, 1440):
            pg2 = await b.new_page(viewport={'width': w, 'height': 900})
            await pg2.route('**/*', lambda r: asyncio.ensure_future(r.abort())
                            if '127.0.0.1' not in r.request.url else asyncio.ensure_future(r.continue_()))
            malos = []
            for ident in EJS:
                await pg2.goto(B + 'practica.html#' + ident, wait_until='domcontentloaded')
                await pg2.wait_for_timeout(350)
                sw = await pg2.evaluate('document.documentElement.scrollWidth')
                if sw > w + 1: malos.append('%s (%d>%d)' % (ident, sw, w))
            comprueba(not malos, '%4d px sin desbordes %s' % (w, malos or ''))
            await pg2.close()

        await b.close()
    srv.shutdown()
    print('\n' + '-' * 58)
    if fallos:
        print('%d FALLOS' % len(fallos))
        for f in fallos: print('  - ' + f)
        sys.exit(1)
    print('Todo correcto.')

asyncio.run(main())
