# -*- coding: utf-8 -*-
import asyncio, sys
from playwright.async_api import async_playwright
CH='/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
B='http://127.0.0.1:8140/'

async def corre(pg, aciertos_por_bloque):
    """Responde el test: acierta las primeras N de cada bloque, falla el resto."""
    import re as _re
    await pg.locator('#btn-empezar').click(); await pg.wait_for_timeout(450)
    for _ in range(220):
        act = await pg.evaluate("()=>{const p=document.querySelector('.pantalla.activa');return p?p.id:''}")
        if act == 's-resultado': return None
        if act == 's-analisis':
            await pg.wait_for_timeout(700); continue
        if act == 's-bloque':
            try:
                await pg.locator('#b-continuar').click(timeout=3000)
                await pg.wait_for_timeout(450)
            except Exception:
                await pg.wait_for_timeout(400)
            continue
        if act != 's-pregunta':
            await pg.wait_for_timeout(300); continue
        m=_re.search(r'(\d+)', await pg.locator('#q-num').inner_text())
        if not m: return 'sin numero de pregunta'
        num=int(m.group(1))
        bloque = 0 if num<=25 else 1 if num<=50 else 2 if num<=75 else 3 if num<=90 else 4
        base   = [1,26,51,76,91][bloque]
        acierta = (num-base) < aciertos_por_bloque[bloque]
        ops=pg.locator('#q-cuerpo .opcion')
        cuantas=await ops.count()
        if cuantas and not await ops.first.is_visible():
            await pg.wait_for_timeout(300); continue
        if cuantas:
            correcta=await pg.evaluate("(n)=>window.WELL_TEST.preguntas[n-1].correcta", num)
            k = correcta if acierta else (correcta+1) % cuantas
            await ops.nth(k).click()
        else:
            inp=pg.locator('#q-input')
            if not await inp.count(): return 'pregunta sin opciones ni campo (n=%d)' % num
            sol=await pg.evaluate("(n)=>window.WELL_TEST.preguntas[n-1].aceptadas[0]", num)
            await inp.fill(sol if acierta else 'zzz')
            await pg.locator('#btn-siguiente').click()
        await pg.wait_for_timeout(150)
    return 'no termina'

async def main():
    fallos=[]
    async with async_playwright() as pw:
        b=await pw.chromium.launch(executable_path=CH,args=['--no-sandbox'])
        for perfil, aciertos, esperado in [
            ('flojo en A1',  [10,0,0,0,0],  'A1'),
            ('pasa A1',      [20,10,0,0,0], 'A2'),
            ('pasa A1 y A2', [22,20,10,0,0],'B1'),
            ('llega a B1+',  [24,23,22,5,0],'B2'),
            ('lo pasa todo', [25,25,25,15,10],'B2+')]:
            ctx=await b.new_context(viewport={'width':1280,'height':900})
            pg=await ctx.new_page()
            await pg.route('**/*', lambda r: asyncio.ensure_future(r.abort())
                           if '127.0.0.1' not in r.request.url else asyncio.ensure_future(r.continue_()))
            err=[]
            pg.on('pageerror', lambda e: err.append(str(e)))
            await pg.goto(B+'test.html', wait_until='domcontentloaded'); await pg.wait_for_timeout(400)
            r=await corre(pg, aciertos)
            if r: fallos.append('%s: %s' % (perfil,r)); await ctx.close(); continue
            nivel=await pg.locator('#r-nivel').inner_text()
            punt=await pg.locator('#r-punt').inner_text()
            guardado=await pg.evaluate("()=>localStorage.getItem('well_nivel')")
            print('%-14s -> nivel %-4s | %-22s | well_nivel=%s' % (perfil, nivel, punt.replace('\n',' '), guardado))
            if nivel!=esperado: fallos.append('%s: esperaba %s, dio %s' % (perfil,esperado,nivel))
            if not guardado or ('"%s"'%nivel) not in guardado:
                fallos.append('%s: no guarda well_nivel' % perfil)
            for e in err: fallos.append('%s: %s' % (perfil,e))
            await ctx.close()

        # certificado + nombre guardado
        ctx=await b.new_context(viewport={'width':1280,'height':900})
        pg=await ctx.new_page()
        await pg.route('**/*', lambda r: asyncio.ensure_future(r.abort())
                       if '127.0.0.1' not in r.request.url else asyncio.ensure_future(r.continue_()))
        await pg.goto(B+'test.html', wait_until='domcontentloaded'); await pg.wait_for_timeout(400)
        await corre(pg, [25,25,25,15,10])
        await pg.locator('#cert-nombre').fill('Ana Beitia')
        await pg.locator('#cert-nombre').dispatch_event('change')
        await pg.wait_for_timeout(200)
        nombre=await pg.evaluate("()=>localStorage.getItem('well_nombre')")
        print('nombre guardado:', nombre)
        if nombre!='Ana Beitia': fallos.append('no guarda well_nombre (dio %r)' % nombre)
        async with pg.expect_download(timeout=25000) as d:
            await pg.locator('#cert-btn').click()
        desc=await d.value
        print('certificado descargado:', desc.suggested_filename)
        if not desc.suggested_filename.endswith('.pdf'): fallos.append('el certificado no sale en PDF')
        await ctx.close()
        await b.close()
    print()
    print('FALLOS (%d):' % len(fallos))
    for f in fallos: print('  X', f)
    sys.exit(1 if fallos else 0)
asyncio.run(main())
