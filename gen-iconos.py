from playwright.sync_api import sync_playwright
from PIL import Image
import pathlib, os
# ejecutar desde la raiz del repositorio
SCR = '.'

W_PATH = "M4 20 C18 106 32 106 44 62 C51 35 61 35 68 62 C80 106 94 106 108 20"
RELLENO = W_PATH + " L120 20 L120 124 L0 124 L0 20 Z"

def svg(redondeo):
    clip = f'<clipPath id="c"><rect width="120" height="120" rx="{redondeo}"/></clipPath>'
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
<title>Academia Well</title>
<defs>{clip}</defs>
<g clip-path="url(#c)">
<rect width="120" height="120" fill="#21409A"/>
<path d="{RELLENO}" fill="#C0293B"/>
<path d="{W_PATH}" fill="none" stroke="#FFFFFF" stroke-width="15" stroke-linecap="round"/>
</g>
</svg>'''

open('favicon.svg','w').write(svg(22) + '\n')
open(f'{SCR}/icono-cuadrado.svg','w').write(svg(0) + '\n')

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args=['--no-sandbox'])
    pg = b.new_page(viewport={'width': 600, 'height': 600})
    pg.set_viewport_size({'width': 512, 'height': 512})
    for nombre, redondeo in (('redondo', 22), ('cuadrado', 0)):
        envoltorio = '<!DOCTYPE html><meta charset="utf-8"><style>html,body{margin:0;padding:0}svg{width:512px;height:512px;display:block}</style>' + svg(redondeo)
        open(f'{SCR}/render-{nombre}.html', 'w').write(envoltorio)
        pg.goto(pathlib.Path(f'{SCR}/render-{nombre}.html').as_uri()); pg.wait_for_timeout(250)
        pg.screenshot(path=f'{SCR}/base-{nombre}.png', omit_background=True, clip={'x':0,'y':0,'width':512,'height':512})
    b.close()

redondo = Image.open(f'{SCR}/base-redondo.png').convert('RGBA')
cuadrado = Image.open(f'{SCR}/base-cuadrado.png').convert('RGBA')
def guardar(im, lado, destino, fondo=None):
    ch = im.resize((lado, lado), Image.LANCZOS)
    if fondo:
        base = Image.new('RGB', (lado, lado), fondo); base.paste(ch, (0,0), ch); ch = base
    ch.save(destino); print(f'  {destino} {lado}x{lado} {os.path.getsize(destino)//1024 or 1} KB')

guardar(redondo, 96,  'favicon-96.png')
guardar(redondo, 192, 'icon-192.png')
guardar(redondo, 512, 'icon-512.png')
guardar(cuadrado, 180, 'apple-touch-icon.png', fondo='#21409A')   # iOS aplica su propia mascara
redondo.resize((48,48), Image.LANCZOS).save('favicon.ico', format='ICO', sizes=[(16,16),(32,32),(48,48)])
print('  favicon.ico', os.path.getsize('favicon.ico'), 'bytes')

manifest = '''{
  "name": "Academia Well",
  "short_name": "Well",
  "description": "Academia de inglés en Galdakao. Centro preparador oficial de Cambridge.",
  "start_url": "/",
  "display": "browser",
  "background_color": "#FDFCF9",
  "theme_color": "#21409A",
  "lang": "es",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/favicon.svg", "sizes": "any", "type": "image/svg+xml" }
  ]
}
'''
open('site.webmanifest','w').write(manifest)
print('  site.webmanifest')
