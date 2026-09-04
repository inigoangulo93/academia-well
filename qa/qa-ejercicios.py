# -*- coding: utf-8 -*-
"""Abre TODOS los ejercicios del curso en el navegador y los contesta.

qa-contenido.js comprueba que los datos son coherentes. Esto comprueba lo otro:
que el motor los pinta, que acepta la respuesta buena y que rechaza la mala.
Un ejercicio puede tener los datos perfectos y no pintarse, o pintarse y no
corregir. Aqui se responde cada uno dos veces, todo bien y todo mal.
"""

# Esta prueba tarda un cuarto de hora. Cuando reventaba, el traceback de
# Playwright decia que no habia podido pulsar un boton y nada mas: ni en que
# ejercicio, ni en cual de las dos pasadas. Se apunta aqui el ultimo que se
# estaba corrigiendo y se dice al final.
RASTRO = {'ejercicio': ''}

import asyncio, sys, http.server, socketserver, threading, functools

R = '/home/user/academia-well-src'
CH = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
B = None
fallos = []

def comprueba(cond, texto):
    if not cond:
        fallos.append(texto)
        print('  FALLA  ' + texto)

class Silencioso(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a, **k): pass

def servidor():
    global B
    socketserver.TCPServer.allow_reuse_address = True
    s = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Silencioso, directory=R))
    B = 'http://127.0.0.1:%d/' % s.server_address[1]
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s

# El writing y el speaking no se corrigen solos: los mira una persona o la IA.
SIN_CORRECCION = ('writing', 'speaking')

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

        await pg.goto(B + 'practica.html', wait_until='domcontentloaded')
        await pg.wait_for_timeout(500)
        lista = await pg.evaluate("""() => Object.keys(window.WELL_PRACTICA.ejercicios)
            .map(id => ({id, tipo: window.WELL_PRACTICA.ejercicios[id].tipo,
                         n: (window.WELL_PRACTICA.ejercicios[id].items||[]).length}))""")

        async def corrige(ident=''):
            RASTRO['ejercicio'] = ident
            # la celebracion de insignia tapa el boton
            await pg.evaluate("()=>{const p=document.querySelector('#premio');"
                              "if(p&&!p.hidden){p.hidden=true;p.classList.remove('visible');}}")
            await pg.click('#btn-corregir')
            await pg.wait_for_timeout(300)

        print('%d ejercicios\n' % len(lista))
        for e in lista:
            ident, tipo, n = e['id'], e['tipo'], e['n']
            if tipo in SIN_CORRECCION:
                await pg.evaluate("()=>localStorage.clear()")
                await pg.goto(B + 'practica.html#' + ident, wait_until='domcontentloaded')
                await pg.wait_for_timeout(350)
                comprueba(await pg.evaluate("()=>document.querySelector('#s-panel').classList.contains('activa')") is False,
                          '%s (%s): no se abre' % (ident, tipo))
                continue

            errores.clear()
            await pg.evaluate("()=>localStorage.clear()")
            await pg.goto(B + 'practica.html#' + ident, wait_until='domcontentloaded')
            await pg.wait_for_timeout(400)

            elige = await pg.evaluate("()=>document.querySelectorAll('#ej-cuerpo .grupo-op').length")
            escribe = await pg.evaluate("()=>document.querySelectorAll('#ej-cuerpo .hueco').length")
            comprueba(elige + escribe == n,
                      '%s: pinta %d campos y tiene %d items' % (ident, elige + escribe, n))
            if elige + escribe != n:
                continue

            # --- todo bien ---
            await pg.evaluate("""id => {
              const ej = window.WELL_PRACTICA.ejercicios[id];
              const grupos = document.querySelectorAll('#ej-cuerpo .grupo-op');
              if (grupos.length) {
                grupos.forEach((g,i) => g.querySelectorAll('.op')[ej.items[i].correcta].click());
              } else {
                document.querySelectorAll('#ej-cuerpo .hueco').forEach((h,i) => {
                  h.value = ej.items[i].aceptadas[0];
                  h.dispatchEvent(new Event('input', {bubbles:true}));
                });
              }
            }""", ident)
            await corrige(ident)
            bien = await pg.evaluate("()=>document.querySelectorAll('#ej-cuerpo .hueco.ok, #ej-cuerpo .op.buena').length")
            comprueba(bien == n, '%s: acepta %d de %d respuestas buenas' % (ident, bien, n))

            # --- todo mal ---
            await pg.evaluate("()=>localStorage.clear()")
            await pg.goto(B + 'practica.html#' + ident, wait_until='domcontentloaded')
            await pg.wait_for_timeout(400)
            await pg.evaluate("""id => {
              const ej = window.WELL_PRACTICA.ejercicios[id];
              const grupos = document.querySelectorAll('#ej-cuerpo .grupo-op');
              if (grupos.length) {
                grupos.forEach((g,i) => {
                  const ops = g.querySelectorAll('.op');
                  ops[(ej.items[i].correcta + 1) % ops.length].click();
                });
              } else {
                document.querySelectorAll('#ej-cuerpo .hueco').forEach(h => {
                  h.value = 'zzqq';
                  h.dispatchEvent(new Event('input', {bubbles:true}));
                });
              }
            }""", ident)
            await corrige(ident + ' (todo mal)')
            malo = await pg.evaluate("()=>document.querySelectorAll('#ej-cuerpo .hueco.mal, #ej-cuerpo .op.fallada').length")
            comprueba(malo == n, '%s: marca %d de %d fallos' % (ident, malo, n))
            comprueba(not errores, '%s: errores de consola %s' % (ident, errores))

        await pg.evaluate("()=>localStorage.clear()")
        await b.close()
    srv.shutdown()

    print()
    if fallos:
        print('%d FALLOS' % len(fallos))
        sys.exit(1)
    print('Los %d ejercicios se pintan, aceptan lo bueno y rechazan lo malo.' % len(lista))

try:
    asyncio.run(main())
except Exception:
    print('\nSe rompio corrigiendo: %s' % (RASTRO['ejercicio'] or 'ninguno todavia'))
    raise
