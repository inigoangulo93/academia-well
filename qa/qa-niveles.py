# -*- coding: utf-8 -*-
"""El curso que se sirve es el del nivel del alumno, y solo ese.

Existe porque al escribir el primer test de B2 el saco de tests paso de cuatro
a cinco y la pagina los pintaba los cinco juntos: un alumno de C1 veia el Test 1
de B2 en medio de su curso, y su barra de progreso contaba 34 ejercicios que no
le tocaban. Aqui se comprueba lo contrario: que cada nivel ve lo suyo, que el
que no tiene curso ve el sustituto y lo dice, y que el desplegable de admin
cambia de verdad lo que se pinta.
"""
import asyncio, os, sys, http.server, socketserver, threading, functools
from playwright.async_api import async_playwright

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CH = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
B = None


class _Silencioso(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a, **k): pass


def _servidor():
    global B
    socketserver.TCPServer.allow_reuse_address = True
    s = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(_Silencioso, directory=R))
    B = 'http://127.0.0.1:%d/' % s.server_address[1]
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s


async def con_nivel(ctx, mcer):
    """Abre practica.html con ese nivel ya guardado, como si viniera del test."""
    pg = await ctx.new_page()
    await pg.route('**/*', lambda r: asyncio.ensure_future(
        r.abort() if r.request.url.startswith('http') and '127.0.0.1' not in r.request.url
        else r.continue_()))
    await pg.add_init_script(
        "localStorage.setItem('well_nivel', JSON.stringify({nivel:'%s',origen:'admin'}))" % mcer
        if mcer else "localStorage.removeItem('well_nivel')")
    await pg.goto(B + 'practica.html')
    await pg.wait_for_timeout(700)
    return pg


async def tests_pintados(pg):
    return await pg.evaluate(
        "()=>[...document.querySelectorAll('#rutas .tramo')]"
        ".map(s=>(s.querySelector('.tramo-tit,h3,.tramo-cab')||{}).textContent||'')")


async def main():
    _servidor()
    fallos, ok = [], []

    def prueba(cond, txt):
        (ok if cond else fallos).append(txt)

    async with async_playwright() as pw:
        b = await pw.chromium.launch(executable_path=CH, args=['--no-sandbox'])

        # Cuantos tests tiene cada nivel, segun los datos.
        ctx = await b.new_context(viewport={'width': 1280, 'height': 900})
        pg = await con_nivel(ctx, 'C1')
        conteo = await pg.evaluate(
            "()=>{const t=window.WELL_PRACTICA.tests, r={};"
            "t.forEach(x=>r[x.nivel]=(r[x.nivel]||0)+1); return r;}")
        await ctx.close()
        prueba(conteo.get('b2', 0) >= 1, 'hay al menos un test de B2 en los datos')
        prueba(conteo.get('c1', 0) >= 1, 'hay tests de C1 en los datos')

        for mcer, esperado in [('B2', 'b2'), ('C1', 'c1')]:
            ctx = await b.new_context(viewport={'width': 1280, 'height': 900})
            pg = await con_nivel(ctx, mcer)
            n = await pg.evaluate("()=>document.querySelectorAll('#rutas .tramo').length")
            prueba(n == conteo.get(esperado),
                   '%s ve sus %d tests y no los %d de todos'
                   % (mcer, conteo.get(esperado), len(await pg.evaluate("()=>window.WELL_PRACTICA.tests"))))
            chip = (await pg.locator('.nivel-chip').inner_text()).strip()
            prueba(chip == ('FCE' if mcer == 'B2' else 'CAE'),
                   '%s: la sigla del curso es %s' % (mcer, chip))
            aviso = await pg.locator('.ruta-sustituto').count()
            prueba(aviso == 0, '%s: no sale el aviso de curso prestado' % mcer)
            # el pie cuenta solo las sesiones de su nivel
            pie = (await pg.locator('.ruta-pie').inner_text()).strip()
            suyas = await pg.evaluate(
                "(n)=>{const t=window.WELL_PRACTICA.tests.filter(x=>x.nivel===n);"
                "return t.reduce((a,x)=>a+x.sesiones.length,0)}", esperado)
            prueba(str(suyas) in pie, '%s: el pie habla de %d sesiones (%s)' % (mcer, suyas, pie))
            await ctx.close()

        # Un nivel sin curso ve el sustituto y se le dice.
        ctx = await b.new_context(viewport={'width': 1280, 'height': 900})
        pg = await con_nivel(ctx, 'A2')
        prueba(await pg.locator('.ruta-sustituto').count() == 1,
               'A2 no tiene curso: sale el aviso de que ve otro')
        texto = (await pg.locator('.ruta-sustituto').inner_text()).strip()
        prueba('A2' in texto and 'B2' in texto,
               'el aviso nombra su nivel y el que ve: "%s"' % texto)
        chip = (await pg.locator('.nivel-chip').inner_text()).strip()
        prueba(chip == 'FCE', 'A2 cae en el curso mas cercano que existe, no en el mas duro')
        await ctx.close()

        # El desplegable de admin cambia lo que se pinta. Sin add_init_script:
        # ese guion se ejecuta en CADA carga y volvia a poner el nivel de antes
        # justo despues de guardarlo, de modo que la prueba medía su propio
        # andamio y no la aplicacion.
        ctx = await b.new_context(viewport={'width': 1280, 'height': 900})
        pg = await ctx.new_page()
        await pg.route('**/*', lambda r: asyncio.ensure_future(
            r.abort() if r.request.url.startswith('http') and '127.0.0.1' not in r.request.url
            else r.continue_()))

        async def pon(nivel):
            await pg.goto(B + 'practica.html#admin')
            await pg.wait_for_timeout(500)
            await pg.select_option('#ad-nivel', nivel)
            await pg.click('#ad-guardar')
            await pg.wait_for_timeout(500)
            await pg.goto(B + 'practica.html')
            await pg.wait_for_timeout(700)
            return await pg.evaluate("()=>document.querySelectorAll('#rutas .tramo').length")

        antes = await pon('C1')
        despues = await pon('B2')
        prueba(antes == conteo.get('c1'), 'admin pone C1 y se pintan sus %d tests' % conteo.get('c1'))
        prueba(despues == conteo.get('b2') and despues != antes,
               'admin pone B2 y el curso cambia (%d -> %d)' % (antes, despues))
        await ctx.close()
        await b.close()

    for t in ok:
        print('  ok    ' + t)
    print()
    if fallos:
        print('FALLOS (%d):' % len(fallos))
        for t in fallos:
            print('  - ' + t)
        sys.exit(1)
    print('%d comprobaciones, todo correcto.' % len(ok))


asyncio.run(main())
