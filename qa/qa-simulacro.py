# -*- coding: utf-8 -*-
"""Prueba el simulacro en el navegador, con la forma del examen.

Lo que importa aqui no es que el reloj corra: es que el simulacro tenga la
forma del CAE. Reading y Use of English son UN papel de hora y media y 56
preguntas, con sus ocho partes seguidas. Si esto se rompe, el porcentaje deja
de ser comparable con el examen real, que es lo que se le vende al alumno, y
no se nota mirando la pantalla.
"""
import asyncio, os, sys, http.server, socketserver, threading, functools

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CH = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
B = None
fallos = []

def comprueba(cond, texto):
    print(('  ok    ' if cond else '  FALLA ') + ' ' + texto)
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

ESPERADO = {'ruoe': (8, 56, 90), 'listening': (4, 30, 40)}

async def main():
    servidor()
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
        # el confirm() de "vas a empezar un simulacro" se acepta solo
        pg.on('dialog', lambda d: asyncio.ensure_future(d.accept()))

        await pg.goto(B + 'practica.html', wait_until='domcontentloaded')
        await pg.wait_for_timeout(700)

        print('Forma de los papeles')
        papeles = await pg.evaluate("() => window.WELL_PRACTICA.papeles.map(p => p.id)")
        comprueba(papeles == ['ruoe', 'listening'],
                  'dos papeles y no tres destrezas sueltas: %s' % papeles)

        for test in ('t1', 't2', 't3', 't4'):
            for pid, (npartes, npreg, mins) in ESPERADO.items():
                sim = await pg.evaluate("""([t, p]) => {
                  const D = window.WELL_PRACTICA;
                  const test = D.tests.filter(x => x.id === t)[0];
                  const pa = D.papeles.filter(x => x.id === p)[0];
                  const vistas = {}; const partes = [];
                  (test.sesiones || []).forEach(s => s.bloques.forEach(b => {
                    if (pa.destrezas.indexOf(b.destreza) < 0) return;
                    const n = b.parte || 0;
                    if (vistas[n]) return; vistas[n] = true;
                    partes.push({ parte: n, n: D.ejercicios[b.ejercicios[0]].items.length });
                  }));
                  partes.sort((a, b) => a.parte - b.parte);
                  return { partes: partes.map(x => x.parte),
                           preguntas: partes.reduce((a, x) => a + x.n, 0),
                           minutos: pa.minutos };
                }""", [test, pid])
                orden = list(range(1, npartes + 1))
                comprueba(sim['partes'] == orden and sim['preguntas'] == npreg and sim['minutos'] == mins,
                          '%s %-9s partes %s · %d preguntas · %d min'
                          % (test, pid, sim['partes'], sim['preguntas'], sim['minutos']))

        print('\nUn simulacro entero, de principio a fin')
        await pg.evaluate("() => localStorage.clear()")
        await pg.goto(B + 'practica.html', wait_until='domcontentloaded')
        await pg.wait_for_timeout(700)

        filas = await pg.evaluate("""() => Array.from(document.querySelectorAll('[data-simulacro]'))
                                            .map(b => b.dataset.simulacro)""")
        comprueba(filas.count('t1-ruoe') == 1 and filas.count('t1-listening') == 1,
                  'el test 1 ofrece sus dos papeles: %s' % [f for f in filas if f.startswith('t1-')])
        comprueba(not [f for f in filas if f.endswith('-use') or f.endswith('-reading')],
                  'ya no quedan simulacros sueltos de use ni de reading')

        await pg.click('[data-simulacro="t1-ruoe"]')
        await pg.wait_for_timeout(600)
        cab = await pg.evaluate("() => document.querySelector('#sim-destreza').textContent")
        comprueba(cab == 'Reading & Use of English', 'la cabecera dice el papel: "%s"' % cab)

        vistas, n = [], 0
        while True:
            n += 1
            if n > 60: break
            parte = await pg.evaluate("() => document.querySelector('#sim-parte').textContent")
            if parte not in vistas: vistas.append(parte)
            # se contesta bien lo que se pueda; lo que no, se deja
            await pg.evaluate("""() => {
              const D = window.WELL_PRACTICA;
              const t = document.querySelector('#sim-titulo').textContent;
              const ej = Object.values(D.ejercicios).filter(e => e.titulo === t)[0];
              if (!ej) return;
              document.querySelectorAll('#sim-cuerpo .grupo-op').forEach((g, i) => {
                const it = ej.items[i]; if (!it || it.correcta === undefined) return;
                const ops = g.querySelectorAll('.op'); if (ops[it.correcta]) ops[it.correcta].click();
              });
              document.querySelectorAll('#sim-cuerpo input[type=text]').forEach((c, i) => {
                const it = ej.items[i];
                if (it && it.aceptadas && it.aceptadas.length) c.value = it.aceptadas[0];
              });
            }""")
            ultimo = await pg.evaluate("() => document.querySelector('#sim-siguiente').textContent")
            await pg.click('#sim-siguiente')
            await pg.wait_for_timeout(250)
            acabado = await pg.evaluate("() => document.querySelector('#s-simresultado').classList.contains('activa')")
            if acabado: break

        comprueba(len(vistas) == 8, 'recorre las ocho partes en una sentada (vistas %d)' % len(vistas))
        titulo = await pg.evaluate("() => document.querySelector('#sr-titulo').textContent")
        pct = await pg.evaluate("() => document.querySelector('#sr-pct').textContent")
        comprueba('Reading & Use of English' in titulo, 'el resultado nombra el papel: "%s"' % titulo)
        comprueba(pct.strip() not in ('', '0%'), 'puntua las respuestas (%s)' % pct.strip())

        comprueba(not errores, 'sin errores de consola: %s' % (errores or 'ninguno'))
        await pg.evaluate("() => localStorage.clear()")
        await b.close()

    print('\n' + '-' * 58)
    if fallos:
        print('FALLOS (%d):' % len(fallos))
        for f in fallos: print('  ' + f)
        sys.exit(1)
    print('El simulacro tiene la forma del examen: un papel de 56 y otro de 30.')

asyncio.run(main())
