# -*- coding: utf-8 -*-
"""Prueba el simulacro en el navegador, con la forma del examen.

Lo que importa aqui no es que el reloj corra: es que el simulacro tenga la
forma del examen que toca. En el C1, Reading y Use of English son UN papel de
hora y media y 56 preguntas con ocho partes; en el B2 son hora y cuarto, 52
preguntas y siete partes. Si esto se rompe, el porcentaje deja de ser
comparable con el examen real, que es lo que se le vende al alumno, y no se
nota mirando la pantalla.

Se recorre entero un simulacro de cada nivel con curso, no solo el de C1: al
escribir el primer test de B2 la prueba seguia pidiendo 't1-ruoe' y fallaba por
no encontrarlo, que es exactamente lo que tenia que pasar.
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

# Por nivel: papel -> (partes, preguntas, minutos).
ESPERADO = {
  'c1': {'ruoe': (8, 56, 90), 'listening': (4, 30, 40)},
  'b2': {'ruoe': (7, 52, 75), 'listening': (4, 30, 40)},
}
# Que test de cada nivel se recorre de principio a fin.
RECORRIDO = [('C1', 't1', 'c1'), ('B2', 'b2t1', 'b2')]

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
        # Ya no hay confirm() nativo: hay modal. Si volviera a haberlo, este
        # manejador lo aceptaria y la prueba pasaria sin enterarse, asi que
        # aqui se apunta el dialogo nativo como FALLO.
        nativos = []
        pg.on('dialog', lambda d: (nativos.append(d.type),
                                   asyncio.ensure_future(d.dismiss())))

        await pg.goto(B + 'practica.html', wait_until='domcontentloaded')
        await pg.wait_for_timeout(700)

        print('Forma de los papeles')
        # Los papeles viven dentro de cada nivel: B2 First y C1 Advanced no
        # tienen la misma forma, y el simulacro se arma con la del nivel que
        # se este sirviendo.
        niveles = await pg.evaluate("""() => window.WELL_PRACTICA.niveles.map(n => ({
          mcer: n.mcer, curso: !!n.curso,
          papeles: (n.papeles || []).map(p => p.id),
          forma: n.forma || null }))""")
        conCurso = [n for n in niveles if n['curso']]
        comprueba(len(conCurso) >= 1, 'hay al menos un nivel con curso: %s' % [n['mcer'] for n in conCurso])
        for n in conCurso:
            comprueba(n['papeles'] == ['ruoe', 'listening'],
                      '%s arma dos papeles y no tres destrezas sueltas: %s' % (n['mcer'], n['papeles']))
        # Un nivel PUEDE declarar su forma antes de tener curso: es donde se
        # guarda la investigacion de como es ese examen, para escribirlo
        # contra ella. Lo que no puede es tener forma y no papeles, o al reves,
        # porque entonces no se sabe cual de las dos manda.
        for n in niveles:
            comprueba(bool(n['papeles']) == bool(n['forma']),
                      '%s declara papeles y forma a la vez, o ninguna de las dos' % n['mcer'])
        # Y si declara forma, tiene que cuadrar con las partes que declara.
        for n in [x for x in niveles if x['forma']]:
            comprueba(sorted(n['forma'].keys()) == sorted(n['papeles']),
                      '%s: la forma cubre los mismos papeles que declara' % n['mcer'])

        tests = await pg.evaluate(
            "()=>window.WELL_PRACTICA.tests.map(t=>[t.id, t.nivel||'c1'])")
        for test, niv in tests:
            for pid, (npartes, npreg, mins) in ESPERADO[niv].items():
                sim = await pg.evaluate("""([t, p]) => {
                  const D = window.WELL_PRACTICA;
                  const test = D.tests.filter(x => x.id === t)[0];
                  const niv = D.niveles.filter(n => n.id === (test.nivel || 'c1'))[0];
                  const pa = niv.papeles.filter(x => x.id === p)[0];
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

        for mcer, tid, niv in RECORRIDO:
            npartes, npreg, mins = ESPERADO[niv]['ruoe']
            print('\nUn simulacro entero de %s, de principio a fin' % mcer)
            await pg.evaluate("(m) => { localStorage.clear();"
                              " localStorage.setItem('well_nivel', JSON.stringify("
                              "{nivel: m, origen: 'admin'})); }", mcer)
            await pg.goto(B + 'practica.html', wait_until='domcontentloaded')
            await pg.wait_for_timeout(700)

            filas = await pg.evaluate("""() => Array.from(document.querySelectorAll('[data-simulacro]'))
                                                .map(b => b.dataset.simulacro)""")
            comprueba(filas.count(tid + '-ruoe') == 1 and filas.count(tid + '-listening') == 1,
                      '%s: el primer test ofrece sus dos papeles: %s'
                      % (mcer, [f for f in filas if f.startswith(tid + '-')]))
            comprueba(not [f for f in filas if f.endswith('-use') or f.endswith('-reading')],
                      '%s: ya no quedan simulacros sueltos de use ni de reading' % mcer)

            await pg.click('[data-simulacro="%s-ruoe"]' % tid)
            await pg.wait_for_timeout(400)

            m = await pg.evaluate("""() => {
              const c = document.querySelector('.modal');
              if (!c) return null;
              return { tit: c.querySelector('h2').textContent,
                       datos: Array.from(c.querySelectorAll('.modal-dato b')).map(b => b.textContent),
                       rol: c.getAttribute('role'), modal: c.getAttribute('aria-modal'),
                       foco: document.activeElement === c.querySelector('[data-si]') };
            }""")
            comprueba(m is not None, '%s: sale un modal nuestro y no un confirm del navegador' % mcer)
            comprueba(m and m['datos'] == [str(npreg), str(mins)],
                      '%s: el modal canta las %d preguntas y los %d minutos: %s'
                      % (mcer, npreg, mins, (m or {}).get('datos')))
            comprueba(m and m['rol'] == 'dialog' and m['modal'] == 'true',
                      '%s: esta anunciado como dialogo para quien usa lector de pantalla' % mcer)
            comprueba(m and m['foco'], '%s: el foco entra en el modal' % mcer)

            # Escape cancela y no empieza nada.
            await pg.keyboard.press('Escape')
            await pg.wait_for_timeout(250)
            comprueba(await pg.evaluate("() => !document.querySelector('.modal')"),
                      '%s: Escape lo cierra' % mcer)
            comprueba(await pg.evaluate("() => !document.querySelector('#s-simulacro').classList.contains('activa')"),
                      '%s: y al cerrarlo con Escape NO ha empezado el simulacro' % mcer)

            await pg.click('[data-simulacro="%s-ruoe"]' % tid)
            await pg.wait_for_timeout(300)
            await pg.click('.modal [data-si]')
            await pg.wait_for_timeout(600)
            cab = await pg.evaluate("() => document.querySelector('#sim-destreza').textContent")
            comprueba(cab == 'Reading & Use of English',
                      '%s: la cabecera dice el papel: "%s"' % (mcer, cab))

            vistas, n = [], 0
            while True:
                n += 1
                if n > 60: break
                parte = await pg.evaluate("() => document.querySelector('#sim-parte').textContent")
                if parte not in vistas: vistas.append(parte)
                # se contesta bien lo que se pueda; lo que no, se deja
                await pg.evaluate("""() => {
                  const D = window.WELL_PRACTICA;
                  // Por id, no por titulo: 'Use of English · Part 1' se llama
                  // igual en los cinco tests y se contestaba el del test que
                  // primero saliera del saco, que es como saco un 10%.
                  const ej = D.ejercicios[document.querySelector('#sim-cuerpo').dataset.simEj];
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
                # Si algo nos ha sacado de la pantalla del simulacro, se dice
                # ahora. Sin esto, el click se quedaba treinta segundos
                # esperando un boton que ya no se veia y la prueba moria con un
                # timeout en vez de con un fallo que se entiende.
                if not await pg.evaluate(
                        "() => document.querySelector('#s-simulacro').classList.contains('activa')"):
                    comprueba(False, '%s: algo ha sacado de la pantalla del simulacro en el paso %d'
                                     % (mcer, n))
                    break
                await pg.click('#sim-siguiente')
                await pg.wait_for_timeout(250)
                acabado = await pg.evaluate("() => document.querySelector('#s-simresultado').classList.contains('activa')")
                if acabado: break

            comprueba(len(vistas) == npartes,
                      '%s: recorre sus %d partes en una sentada (vistas %d)' % (mcer, npartes, len(vistas)))
            titulo = await pg.evaluate("() => document.querySelector('#sr-titulo').textContent")
            pct = await pg.evaluate("() => document.querySelector('#sr-pct').textContent")
            comprueba('Reading & Use of English' in titulo,
                      '%s: el resultado nombra el papel: "%s"' % (mcer, titulo))
            comprueba(pct.strip() not in ('', '0%'), '%s: puntua las respuestas (%s)' % (mcer, pct.strip()))

        comprueba(not nativos, 'ningun dialogo nativo del navegador: %s' % (nativos or 'ninguno'))
        comprueba(not errores, 'sin errores de consola: %s' % (errores or 'ninguno'))

        # --- el panel no se abre entero ---
        print('\nEl panel al entrar')
        await pg.evaluate("() => localStorage.clear()")
        await pg.goto(B + 'practica.html', wait_until='domcontentloaded')
        await pg.wait_for_timeout(800)
        ab = await pg.evaluate("""() => Array.from(document.querySelectorAll('[data-tramo]'))
                                      .map(t => t.getAttribute('aria-expanded'))""")
        alto = await pg.evaluate("() => document.body.scrollHeight")
        comprueba(ab.count('true') <= 1,
                  'solo se abre el test donde vas, no todos (%s)' % ab)
        comprueba(alto < 2600, 'la pagina no sale interminable al entrar (%d px)' % alto)

        await pg.evaluate("() => localStorage.clear()")
        await b.close()

    print('\n' + '-' * 58)
    if fallos:
        print('FALLOS (%d):' % len(fallos))
        for f in fallos: print('  ' + f)
        sys.exit(1)
    print('Cada nivel arma su examen: C1 con 56 preguntas y B2 con 52.')

asyncio.run(main())
