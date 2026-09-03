# -*- coding: utf-8 -*-
"""Prueba la capa de datos (well-datos.js) sin Supabase real.

Este entorno no tiene salida hacia supabase.com, asi que se sustituye el
cliente por qa/falso-supabase.js y se sirve un well-config.js relleno. Lo que
se comprueba es el comportamiento que le prometemos al alumno:

  1. Sin servidor configurado, la practica funciona igual y no se ensena login.
  2. Al entrar, el progreso que ya tenia en el navegador sube a la cuenta.
  3. Desde otro dispositivo, ese progreso baja.
  4. Si ha practicado en los dos sitios, se quedan las dos mitades.
  5. Al cerrar sesion no se pierde nada.

El Row Level Security se prueba aparte, contra un PostgreSQL de verdad:
supabase/probar-permisos.sh
"""
import asyncio, json, os, sys, http.server, socketserver, threading, functools

R = '/home/user/academia-well-src'
PUERTO = 0            # lo elige el sistema
B = None              # se completa al levantar el servidor
CH = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

CONFIG_LLENA = "window.WELL_CONFIG={supabaseUrl:'https://falso.supabase.co',supabaseAnonKey:'clave-de-mentira'};"

fallos = []

def comprueba(cond, texto):
    print(('  ok   ' if cond else '  FALLA') + '  ' + texto)
    if not cond:
        fallos.append(texto)

class Silencioso(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a, **k): pass

def servidor():
    global B
    h = functools.partial(Silencioso, directory=R)
    socketserver.TCPServer.allow_reuse_address = True
    s = socketserver.TCPServer(('127.0.0.1', PUERTO), h)
    B = 'http://127.0.0.1:%d/' % s.server_address[1]
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s

async def prepara(b, con_servidor=True, sesion=None, almacen=None):
    """Abre una pagina con el cliente falso enchufado."""
    pg = await b.new_page(viewport={'width': 1280, 'height': 900})
    falso = open(os.path.join(R, 'qa/falso-supabase.js'), encoding='utf-8').read()

    async def enruta(ruta):
        url = ruta.request.url
        if '127.0.0.1' not in url:
            await ruta.abort(); return
        if url.endswith('well-config.js') and con_servidor:
            await ruta.fulfill(status=200, content_type='application/javascript', body=CONFIG_LLENA); return
        if 'vendor/supabase-' in url:
            await ruta.fulfill(status=200, content_type='application/javascript', body=falso); return
        await ruta.continue_()
    await pg.route('**/*', enruta)

    guion = ''
    if sesion:
        guion += 'window.__SESION=%s;' % json.dumps({'user': {'id': sesion[0], 'email': sesion[1]}})
    if almacen:
        guion += 'window.__DB=%s;' % json.dumps(almacen)
    if guion:
        await pg.add_init_script(guion)
    return pg

async def db(pg):
    return await pg.evaluate('() => window.__DB')

async def progreso(pg):
    return await pg.evaluate("() => JSON.parse(localStorage.getItem('well_practica_v'+window.WELL_PRACTICA.version)||'null')")

async def hace_ejercicio(pg, ident, mejor, total, fecha):
    """Escribe progreso directamente, como si lo hubiera hecho el alumno."""
    await pg.evaluate("""([id,mejor,total,fecha])=>{
      var k='well_practica_v'+window.WELL_PRACTICA.version;
      var P=JSON.parse(localStorage.getItem(k)||'null')||{ejercicios:{},dias:[],insignias:[],tramos:{}};
      P.ejercicios[id]={mejor:mejor,total:total,intentos:1,fecha:fecha};
      if(P.dias.indexOf(fecha)===-1)P.dias.push(fecha);
      localStorage.setItem(k,JSON.stringify(P));
    }""", [ident, mejor, total, fecha])

async def main():
    from playwright.async_api import async_playwright
    srv = servidor()
    async with async_playwright() as pw:
        b = await pw.chromium.launch(executable_path=CH, args=['--no-sandbox'])

        # --- 1. sin servidor configurado ---------------------------------
        print('\n1. Sin servidor configurado (well-config.js vacio)')
        pg = await prepara(b, con_servidor=False)
        errores = []
        pg.on('pageerror', lambda e: errores.append(str(e)))
        await pg.goto(B + 'practica.html', wait_until='domcontentloaded')
        await pg.wait_for_timeout(500)
        comprueba(not errores, 'la practica carga sin errores: %s' % (errores or 'ninguno'))
        comprueba(await pg.evaluate("() => window.WellDatos.activo() === false"),
                  'WellDatos.activo() es false')
        await pg.click('#user-btn')
        comprueba(await pg.evaluate("() => document.querySelector('#um-cuenta').hidden"),
                  'el menu de usuario no ofrece cuenta')
        # y se puede practicar igual
        await hace_ejercicio(pg, 'v1-caja', 5, 8, '2026-09-01')
        comprueba((await progreso(pg))['ejercicios']['v1-caja']['mejor'] == 5,
                  'el progreso se guarda en el navegador')
        await pg.goto(B + 'entrar.html', wait_until='domcontentloaded')
        await pg.wait_for_timeout(400)
        comprueba(not await pg.evaluate("() => document.querySelector('#sin-servidor').hidden"),
                  'entrar.html avisa de que todavia no hay cuentas')
        await pg.close()

        # --- 2. con servidor: el progreso local sube al entrar ------------
        print('\n2. Con servidor: al entrar, lo del navegador sube a la cuenta')
        pg = await prepara(b, con_servidor=True)
        errores = []
        pg.on('pageerror', lambda e: errores.append(str(e)))
        await pg.goto(B + 'practica.html', wait_until='domcontentloaded')
        await pg.wait_for_timeout(500)
        comprueba(not errores, 'carga sin errores: %s' % (errores or 'ninguno'))
        comprueba(await pg.evaluate("() => window.WellDatos.activo() === true"),
                  'WellDatos.activo() es true')
        await pg.click('#user-btn')
        comprueba(not await pg.evaluate("() => document.querySelector('#um-cuenta').hidden"),
                  'el menu ofrece guardar el progreso')
        comprueba(not await pg.evaluate("() => document.querySelector('#um-entrar').hidden")
                  and await pg.evaluate("() => document.querySelector('#um-salir').hidden"),
                  'ofrece entrar, no salir')

        # practica sin cuenta
        await hace_ejercicio(pg, 'v1-caja', 6, 8, '2026-09-01')
        await hace_ejercicio(pg, 'v2-caja', 7, 8, '2026-09-02')
        await pg.reload(wait_until='domcontentloaded')
        await pg.wait_for_timeout(400)
        comprueba(len((await db(pg))['progreso']) == 0, 'sin sesion no se sube nada al servidor')

        # abre el enlace del correo
        await pg.evaluate("() => window.__entra('alumno-1','ana@ejemplo.com')")
        await pg.wait_for_timeout(900)
        d = await db(pg)
        ids = sorted(f['ejercicio'] for f in d['progreso'])
        comprueba(ids == ['v1-caja', 'v2-caja'], 'sube los dos ejercicios: %s' % ids)
        comprueba(all(f['alumno'] == 'alumno-1' for f in d['progreso']), 'con el alumno correcto')
        comprueba(sorted(f['dia'] for f in d['dias_activos']) == ['2026-09-01', '2026-09-02'],
                  'sube los dias de la racha')
        await pg.click('#user-btn')
        comprueba(await pg.evaluate("() => document.querySelector('#um-correo').textContent") == 'ana@ejemplo.com',
                  'el menu ensena el correo')
        comprueba(not await pg.evaluate("() => document.querySelector('#um-salir').hidden"),
                  'y ofrece cerrar sesion')

        # no repite escrituras si no ha cambiado nada
        antes = len(await pg.evaluate('() => window.__LLAMADAS'))
        await pg.evaluate("() => window.WellDatos.empuja(JSON.parse(localStorage.getItem('well_practica_v'+window.WELL_PRACTICA.version)), true)")
        await pg.wait_for_timeout(300)
        comprueba(len(await pg.evaluate('() => window.__LLAMADAS')) == antes,
                  'no reenvia lo que el servidor ya tiene')
        guardado = await db(pg)
        await pg.close()

        # --- 3. otro dispositivo: se baja el progreso ---------------------
        print('\n3. Otro dispositivo: el progreso baja de la cuenta')
        pg = await prepara(b, con_servidor=True, sesion=('alumno-1', 'ana@ejemplo.com'), almacen=guardado)
        await pg.goto(B + 'practica.html', wait_until='domcontentloaded')
        await pg.wait_for_timeout(900)
        P = await progreso(pg)
        comprueba(P and sorted(P['ejercicios'].keys()) == ['v1-caja', 'v2-caja'],
                  'llegan los dos ejercicios: %s' % (sorted(P['ejercicios'].keys()) if P else None))
        comprueba(P['ejercicios']['v2-caja']['mejor'] == 7, 'con su nota')
        comprueba(sorted(P['dias']) == ['2026-09-01', '2026-09-02'], 'y los dias de la racha')
        await pg.close()

        # --- 4. fusion: ha practicado en los dos sitios -------------------
        print('\n4. Ha practicado en los dos sitios: no se pierde ninguna mitad')
        pg = await prepara(b, con_servidor=True, almacen=guardado)
        await pg.goto(B + 'practica.html', wait_until='domcontentloaded')
        await pg.wait_for_timeout(400)
        # aqui, sin cuenta todavia, hace uno nuevo y mejora otro
        await hace_ejercicio(pg, 'v1-cloze', 4, 8, '2026-09-03')
        await hace_ejercicio(pg, 'v1-caja', 8, 8, '2026-09-03')   # mejor que el 6 del servidor
        # se recarga para que la aplicacion lea de localStorage lo que acaba
        # de escribir la prueba, igual que si hubiera vuelto otro dia
        await pg.reload(wait_until='domcontentloaded')
        await pg.wait_for_timeout(400)
        await pg.evaluate("() => window.__entra('alumno-1','ana@ejemplo.com')")
        await pg.wait_for_timeout(1100)
        P = await progreso(pg)
        comprueba(sorted(P['ejercicios'].keys()) == ['v1-caja', 'v1-cloze', 'v2-caja'],
                  'se conservan los tres: %s' % sorted(P['ejercicios'].keys()))
        comprueba(P['ejercicios']['v1-caja']['mejor'] == 8, 'gana la mejor nota (8, no 6)')
        comprueba(P['ejercicios']['v2-caja']['mejor'] == 7, 'no se pierde lo que solo estaba en el servidor')
        comprueba(sorted(P['dias']) == ['2026-09-01', '2026-09-02', '2026-09-03'],
                  'la racha suma los dias de los dos sitios: %s' % sorted(P['dias']))
        d = await db(pg)
        srv_caja = [f for f in d['progreso'] if f['ejercicio'] == 'v1-caja'][0]
        comprueba(srv_caja['mejor'] == 8, 'y el servidor se queda con la mejor nota')
        comprueba(len([f for f in d['progreso'] if f['ejercicio'] == 'v1-caja']) == 1,
                  'sin duplicar la fila')
        await pg.close()

        # --- 5. simulacros y cierre de sesion -----------------------------
        print('\n5. Simulacros y cierre de sesion')
        pg = await prepara(b, con_servidor=True)
        await pg.goto(B + 'practica.html', wait_until='domcontentloaded')
        await pg.wait_for_timeout(400)
        await pg.evaluate("""()=>{
          var k='well_practica_v'+window.WELL_PRACTICA.version;
          var P=JSON.parse(localStorage.getItem(k)||'null')||{ejercicios:{},dias:[],insignias:[],tramos:{}};
          P.simulacros={'t1-use':[{fecha:'2026-09-01',ok:18,items:24,partes:[],porTiempo:false,minutos:45}]};
          P.insignias=['primera-sesion'];
          localStorage.setItem(k,JSON.stringify(P));
        }""")
        await pg.reload(wait_until='domcontentloaded')
        await pg.wait_for_timeout(400)
        await pg.evaluate("() => window.__entra('alumno-2','benat@ejemplo.com')")
        await pg.wait_for_timeout(900)
        d = await db(pg)
        comprueba(len(d['simulacros']) == 1 and d['simulacros'][0]['aciertos'] == 18,
                  'sube el intento de simulacro')
        comprueba(len(d['insignias']) == 1 and d['insignias'][0]['insignia'] == 'primera-sesion',
                  'sube la insignia')
        # subir dos veces no duplica el intento
        await pg.reload(wait_until='domcontentloaded')
        await pg.wait_for_timeout(1100)
        d = await db(pg)
        comprueba(len(d['simulacros']) == 1, 'recargar no duplica el simulacro: %d' % len(d['simulacros']))

        antes = await progreso(pg)
        await pg.evaluate("() => window.WellDatos.salir()")
        await pg.wait_for_timeout(500)
        despues = await progreso(pg)
        comprueba(despues and sorted(despues['simulacros'].keys()) == sorted(antes['simulacros'].keys()),
                  'al cerrar sesion el progreso sigue en el navegador')
        await pg.close()

        # --- 6. entrar.html ----------------------------------------------
        print('\n6. La pagina de entrada')
        pg = await prepara(b, con_servidor=True)
        errores = []
        pg.on('pageerror', lambda e: errores.append(str(e)))
        await pg.goto(B + 'entrar.html', wait_until='domcontentloaded')
        await pg.wait_for_timeout(600)
        comprueba(not errores, 'carga sin errores: %s' % (errores or 'ninguno'))
        comprueba(not await pg.evaluate("() => document.querySelector('#formulario').hidden"),
                  'ensena el formulario')
        await pg.fill('#correo', 'ana@ejemplo.com')
        await pg.click('#btn-enviar')
        await pg.wait_for_timeout(500)
        comprueba(await pg.evaluate('() => window.__CORREO_ENVIADO') == 'ana@ejemplo.com',
                  'pide el enlace magico para ese correo')
        comprueba(not await pg.evaluate("() => document.querySelector('#ok').hidden"),
                  'y avisa de que mire el correo')
        await pg.close()

        pg = await prepara(b, con_servidor=True, sesion=('alumno-1', 'ana@ejemplo.com'))
        await pg.goto(B + 'entrar.html', wait_until='domcontentloaded')
        await pg.wait_for_timeout(600)
        comprueba(not await pg.evaluate("() => document.querySelector('#dentro').hidden"),
                  'si ya ha entrado, no vuelve a pedir el correo')
        await pg.close()

        await b.close()
    srv.shutdown()

    print('\n' + '-' * 58)
    if fallos:
        print('%d FALLOS' % len(fallos))
        for f in fallos:
            print('  - ' + f)
        sys.exit(1)
    print('Todo correcto.')

asyncio.run(main())
