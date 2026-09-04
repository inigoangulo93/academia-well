# -*- coding: utf-8 -*-
"""Comprueba el listening: que suena y que impone las reglas del examen.

Las reglas no son un detalle. Si se puede rebobinar al trozo dificil o
escuchar tres veces, la nota deja de medir nada y el porcentaje que le damos
al alumno es mentira.
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
        await pg.wait_for_timeout(400)
        lista = await pg.evaluate("""() => Object.entries(window.WELL_PRACTICA.ejercicios)
            .filter(([k,e]) => e.tipo === 'listening')
            .map(([k,e]) => ({id:k, audio:e.audio, escuchas:e.escuchas, n:e.items.length}))""")

        for e in lista:
            print('\n%s' % e['id'])
            errores.clear()
            await pg.evaluate("()=>localStorage.clear()")
            await pg.goto(B + 'practica.html#' + e['id'], wait_until='domcontentloaded')
            await pg.wait_for_timeout(600)

            comprueba(os.path.exists(os.path.join(R, e['audio'])),
                      'el fichero de audio existe: %s' % e['audio'])

            info = await pg.evaluate("""async () => {
              const a = document.querySelector('#au');
              if (!a) return null;
              await new Promise(ok => {
                if (a.readyState >= 1) ok();
                else { a.addEventListener('loadedmetadata', ok, {once:true});
                       a.addEventListener('error', ok, {once:true}); setTimeout(ok, 5000); }
              });
              return { dur: a.duration, err: !!a.error, controles: a.hasAttribute('controls') };
            }""")
            comprueba(info and not info['err'], 'el navegador lo carga sin error')
            # Sin duracion finita la barra de progreso se queda clavada en cero
            comprueba(info and info['dur'] not in (None,) and info['dur'] == info['dur']
                      and info['dur'] != float('inf') and info['dur'] > 30,
                      'el navegador sabe la duracion: %s s' % (info and round(info['dur'], 1)))
            comprueba(info and not info['controles'],
                      'sin controles nativos: no se puede arrastrar la barra')

            # --- reglas del examen ---
            # El antirrebobinado NO se puede comprobar aqui: este Chromium sin
            # pantalla no sabe saltar en un audio en ningun caso. Se verifica
            # abajo, una vez, y se dice en voz alta en vez de dar un falso
            # verde. Lo que si se comprueba es que reproducir avanza.
            avance = await pg.evaluate("""async () => {
              const a = document.querySelector('#au');
              await a.play().catch(()=>{});
              await new Promise(r => setTimeout(r, 2000));
              const t = a.currentTime;
              a.pause();
              return t;
            }""")
            comprueba(avance > 1, 'el audio avanza al reproducir (%.1f s)' % avance)

            comprueba((e['escuchas'] or 2) == 2, 'se escucha dos veces, como en el examen')
            comprueba(not errores, 'sin errores de consola: %s' % (errores or 'ninguno'))

        # --- la cuenta atras, y que solo haya un reproductor ---
        print('\nCuenta atras y reproductor unico')
        await pg.evaluate("()=>localStorage.clear()")
        await pg.goto(B + 'practica.html#t1-lis1', wait_until='domcontentloaded')
        await pg.wait_for_timeout(700)
        await pg.click('#au-play')
        await pg.wait_for_timeout(300)
        c = await pg.evaluate("""() => {
          const k = document.querySelector('#au-cuenta5');
          return { visible: k && !k.hidden, n: (document.querySelector('#au-n')||{}).textContent,
                   sonando: !document.querySelector('#au').paused,
                   bloqueado: document.querySelector('#au-play').disabled };
        }""")
        comprueba(c['visible'], 'al dar a Escuchar sale la cuenta atras')
        comprueba(c['n'] == '5', 'empieza en 5 (vi "%s")' % c['n'])
        comprueba(not c['sonando'], 'el audio NO suena todavia')
        comprueba(c['bloqueado'], 'y el boton no admite un segundo clic')
        # Cinco segundos: ni cuatro ni seis. A los 4,4 s todavia no puede sonar.
        await pg.wait_for_timeout(4100)
        pronto = await pg.evaluate("() => document.querySelector('#au').currentTime")
        comprueba(pronto == 0, 'a los 4,4 s sigue sin sonar (%.1f s)' % pronto)
        await pg.wait_for_timeout(1800)
        fin = await pg.evaluate("""() => ({
          oculta: document.querySelector('#au-cuenta5').hidden,
          t: document.querySelector('#au').currentTime })""")
        comprueba(fin['t'] > 0.3, 'a los 6,2 s ya suena (%.1f s)' % fin['t'])
        comprueba(fin['oculta'], 'y la cuenta se ha quitado de en medio')

        # El fallo que se colo hasta produccion: al volver de un simulacro
        # quedaban dos id="au" en el DOM, $('#au') cogia el viejo escondido, y
        # el reproductor de delante se quedaba sin rotulo y con el boton muerto.
        # El nivel se pone a mano: sin nivel guardado el curso que se sirve es
        # el de B2, y entonces 't1-listening' (que es de C1) no esta en pantalla.
        await pg.evaluate("()=>{localStorage.clear();"
                          "localStorage.setItem('well_nivel',"
                          "JSON.stringify({nivel:'C1',origen:'admin'}));}")
        await pg.goto(B + 'practica.html', wait_until='domcontentloaded')
        await pg.wait_for_timeout(700)
        await pg.click('[data-simulacro="t1-listening"]')
        await pg.wait_for_timeout(300)
        await pg.click('.modal [data-si]')
        await pg.wait_for_timeout(700)
        await pg.click('#sim-salir')
        await pg.wait_for_timeout(300)
        await pg.click('.modal [data-si]')
        await pg.wait_for_timeout(700)
        await pg.goto(B + 'practica.html#t1-lis1', wait_until='domcontentloaded')
        await pg.wait_for_timeout(800)
        u = await pg.evaluate("""() => ({
          cuantos: document.querySelectorAll('#au').length,
          txt: (document.querySelector('#au-txt')||{}).textContent })""")
        comprueba(u['cuantos'] == 1,
                  'despues de un simulacro solo queda un reproductor (hay %d)' % u['cuantos'])
        comprueba(bool(u['txt']),
                  'y el de delante tiene su rotulo, no se queda mudo ("%s")' % u['txt'])
        await pg.evaluate("()=>localStorage.clear()")

        # ¿Sabe saltar este navegador? Si no, lo del rebobinado no se puede
        # medir aqui y hay que decirlo, no callarlo.
        await pg.goto(B + '404.html', wait_until='domcontentloaded')
        # Apuntaba al audio provisional. Cuando llego la voz de verdad y los
        # -espeak se borraron, el fichero dejo de existir, loadedmetadata no
        # llegaba nunca y la promesa se quedaba colgada hasta que Playwright la
        # recogia: un traceback despues de 121 comprobaciones en verde. Ahora
        # va al audio real y no espera indefinidamente.
        salta = await pg.evaluate("""async () => {
          const a = new Audio('audio/t1-lis1.mp3');
          const listo = new Promise(ok => a.addEventListener('loadedmetadata', ok, {once:true}));
          const tarde = new Promise(ok => setTimeout(ok, 8000));
          await Promise.race([listo, tarde]);
          if (!isFinite(a.duration)) return -1;
          a.currentTime = 50;
          await new Promise(r => setTimeout(r, 500));
          return a.currentTime;
        }""")
        await pg.evaluate("()=>localStorage.clear()")
        await b.close()
    srv.shutdown()

    print()
    if salta > 40:
        print('Este navegador si sabe saltar: la regla de no rebobinar SE PUEDE')
        print('comprobar aqui y habria que anadirla a esta prueba.')
    else:
        print('SIN COMPROBAR: la regla de no rebobinar.')
        print('  Este Chromium sin pantalla no sabe saltar en un audio (se le pidio')
        print('  ir al segundo 50 y se quedo en %.2f), asi que no se puede medir.' % salta)
        print('  Hay que probarlo a mano: escucha medio minuto, arrastra hacia atras')
        print('  y comprueba que vuelve a donde ibas.')
    print()
    if fallos:
        print('%d FALLOS' % len(fallos)); sys.exit(1)
    print('Los %d listenings suenan, cargan y no ensenan controles nativos.' % len(lista))

asyncio.run(main())
