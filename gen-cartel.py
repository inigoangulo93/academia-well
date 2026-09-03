"""Genera cartel-resena-google.pdf (A4 para la puerta) y su HTML fuente.

El QR apunta a academiawell.com/resena, que redirige a Google. Asi el enlace
de resenas se puede cambiar editando resena.html, sin reimprimir el cartel.
Ejecutar desde la raiz del repositorio. Necesita: qrcode, pillow, playwright.
Las fuentes de la marca se incrustan desde FUENTES (woff2 de Google Fonts).
"""
import qrcode, base64, io, pathlib, os
from qrcode.constants import ERROR_CORRECT_H
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright

URL = 'https://academiawell.com/resena'
FUENTES = os.environ.get('WELL_FUENTES', '.')   # carpeta con los .woff2
SALIDA_PDF = 'cartel-resena-google.pdf'
SALIDA_HTML = 'cartel-resena-google.html'

qr = qrcode.QRCode(error_correction=ERROR_CORRECT_H, box_size=24, border=0)
qr.add_data(URL); qr.make(fit=True)
img = qr.make_image(fill_color='#21409A', back_color='white').convert('RGB')
W = img.size[0]
logo = Image.open('logo.png').convert('RGB')
lado = int(W * 0.22); logo = logo.resize((lado, lado), Image.LANCZOS)
pad = int(lado * 0.12); caja = lado + 2 * pad
placa = Image.new('RGB', (caja, caja), 'white')
ImageDraw.Draw(placa).rounded_rectangle([0, 0, caja - 1, caja - 1], radius=int(caja * .18), fill='white')
placa.paste(logo, (pad, pad))
img.paste(placa, ((W - caja) // 2, (W - caja) // 2))
buf = io.BytesIO(); img.save(buf, 'PNG')
qr64 = base64.b64encode(buf.getvalue()).decode()
print(f'QR version {qr.version} ({W}px) -> {URL}')

def fuente(nombre, remoto):
    p = pathlib.Path(FUENTES) / nombre
    return p.resolve().as_uri() if p.exists() else remoto
BREE  = fuente('4UaHrEJCrhhnVA3DgluA96rp5w.woff2',      'https://fonts.gstatic.com/s/breeserif/v18/4UaHrEJCrhhnVA3DgluA96rp5w.woff2')
BREEX = fuente('4UaHrEJCrhhnVA3DgluA96Tp56N1.woff2',    'https://fonts.gstatic.com/s/breeserif/v18/4UaHrEJCrhhnVA3DgluA96Tp56N1.woff2')
FIG   = fuente('_Xms-HUzqDCFdgfMm4S9DQ.woff2',          'https://fonts.gstatic.com/s/figtree/v9/_Xms-HUzqDCFdgfMm4S9DQ.woff2')
FIGX  = fuente('_Xms-HUzqDCFdgfMm4q9DbZs.woff2',        'https://fonts.gstatic.com/s/figtree/v9/_Xms-HUzqDCFdgfMm4q9DbZs.woff2')

html = f'''<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Cartel reseña Google · Academia Well</title>
<style>
@font-face{{font-family:"Bree Serif";src:url({BREE}) format("woff2");unicode-range:U+0000-00FF,U+2013-2014,U+2019,U+201C-201D,U+00B7}}
@font-face{{font-family:"Bree Serif";src:url({BREEX}) format("woff2");unicode-range:U+0100-02BA}}
@font-face{{font-family:Figtree;font-weight:300 900;src:url({FIG}) format("woff2");unicode-range:U+0000-00FF,U+2013-2014,U+2019,U+201C-201D,U+00B7}}
@font-face{{font-family:Figtree;font-weight:300 900;src:url({FIGX}) format("woff2");unicode-range:U+0100-02BA}}
@page{{size:A4;margin:0}}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:210mm;height:297mm}}
body{{font-family:Figtree,sans-serif;background:#FDFCF9;color:#232B42;position:relative;overflow:hidden;-webkit-print-color-adjust:exact;print-color-adjust:exact}}
.banda{{position:absolute;left:0;right:0;top:0;height:6mm;background:linear-gradient(90deg,#21409A,#C0293B)}}
.wm{{position:absolute;right:-42mm;top:88mm;width:190mm;height:auto;opacity:.06}}
.cab{{position:absolute;left:16mm;right:16mm;top:18mm;display:flex;align-items:center;justify-content:space-between}}
.logo{{display:flex;align-items:center;gap:5mm}}
.logo svg{{height:22mm;width:auto}}
.logo b{{font-family:"Bree Serif",serif;font-weight:400;color:#21409A;font-size:24pt;line-height:1.02}}
.lugar{{text-align:right;font-weight:600;font-size:8.5pt;letter-spacing:.09em;text-transform:uppercase;color:#5E6575;line-height:1.5}}
.titulo{{position:absolute;left:16mm;right:16mm;top:62mm;text-align:center}}
.titulo h1{{font-family:"Bree Serif",serif;font-weight:400;color:#21409A;font-size:54pt;line-height:1.02;letter-spacing:-.01em}}
.titulo h2{{font-family:"Bree Serif",serif;font-weight:400;color:#C0293B;font-size:26pt;margin-top:3mm}}
.titulo p{{font-size:14pt;line-height:1.5;color:#5E6575;max-width:135mm;margin:8mm auto 0}}
.estrellas{{position:absolute;left:0;right:0;top:127mm;text-align:center;color:#F2B01E;font-size:26pt;letter-spacing:.18em}}
.qr{{position:absolute;left:50%;top:141mm;transform:translateX(-50%);width:96mm;padding:6mm;background:#fff;border-radius:7mm;box-shadow:0 6mm 18mm rgba(35,43,66,.13);border:.4mm solid rgba(35,43,66,.08)}}
.qr img{{display:block;width:100%;height:auto}}
.como{{position:absolute;left:16mm;right:16mm;top:250mm;text-align:center}}
.como b{{display:block;font-family:"Bree Serif",serif;font-weight:400;color:#232B42;font-size:15pt}}
.como span{{display:block;color:#5E6575;font-size:10.5pt;margin-top:1.5mm}}
.gracias{{position:absolute;left:16mm;right:16mm;top:266mm;text-align:center;font-family:"Bree Serif",serif;color:#C0293B;font-size:22pt}}
.pie{{position:absolute;left:16mm;right:16mm;bottom:12mm;text-align:center;font-size:9pt;color:#5E6575}}
.pie b{{color:#21409A;font-weight:700}}
</style></head><body>
<div class="banda"></div>
<svg class="wm" viewBox="0 0 120 110" aria-hidden="true"><path d="M8 12 C22 98 36 98 48 54 C55 27 65 27 72 54 C84 98 98 98 112 12" fill="none" stroke="#21409A" stroke-width="13" stroke-linecap="round"/></svg>
<div class="cab">
  <div class="logo"><svg viewBox="0 0 100 140" aria-hidden="true"><defs><clipPath id="c"><rect x="2" y="2" width="96" height="136" rx="5"/></clipPath></defs><g clip-path="url(#c)"><rect x="2" y="2" width="96" height="136" fill="#C0293B"/><path d="M-10 84 C16 62 26 68 34 98 C40 121 46 121 52 86 C58 51 64 51 70 84 C76 117 84 117 92 54 C96 31 101 22 112 10 L112 -10 L-12 -10 Z" fill="#21409A"/><path d="M-10 84 C16 62 26 68 34 98 C40 121 46 121 52 86 C58 51 64 51 70 84 C76 117 84 117 92 54 C96 31 101 22 112 10" fill="none" stroke="#FFFFFF" stroke-width="13" stroke-linecap="round"/></g></svg><b>Academia<br>Well</b></div>
  <div class="lugar">Galdakao<br>Centro preparador oficial de Cambridge</div>
</div>
<div class="titulo">
  <h1>¿Qué tal en Well?</h1>
  <h2>Zer moduz Well-en?</h2>
  <p>Escanea el código y déjanos tu reseña en Google. Un minuto de tu tiempo que a nosotros nos ayuda muchísimo.</p>
</div>
<div class="estrellas">★★★★★</div>
<div class="qr"><img src="data:image/png;base64,{qr64}" alt="Código QR para dejar una reseña en Google"></div>
<div class="como"><b>Apunta con la cámara del móvil</b><span>o entra en academiawell.com/resena</span></div>
<div class="gracias">Eskerrik asko · Gracias</div>
<div class="pie"><b>Academia Well</b> · C/ Lapurdi 36, entreplanta 5 · 652 92 12 03 · @academia_well_galdakao</div>
</body></html>'''

open(SALIDA_HTML, 'w').write(html)
tmp = pathlib.Path(os.environ.get('WELL_TMP', '.')) / '_cartel_render.html'
tmp.write_text(html)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('WELL_CHROME', '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'), args=['--no-sandbox'])
    pg = b.new_page(viewport={'width': 794, 'height': 1123})
    pg.goto(tmp.resolve().as_uri()); pg.wait_for_timeout(600)
    pg.pdf(path=SALIDA_PDF, format='A4', print_background=True, prefer_css_page_size=True)
    pg.screenshot(path=os.environ.get('WELL_PREVIEW', '_cartel_preview.png'))
    b.close()
print(f'{SALIDA_PDF}: {os.path.getsize(SALIDA_PDF)//1024} KB')
