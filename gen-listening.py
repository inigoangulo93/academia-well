#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera el audio de un listening a partir de su guion.

    python3 gen-listening.py listening/t1-p2.json --espeak     gratis, robotico
    python3 gen-listening.py --todos --simular                 cuenta lo que costaria
    python3 gen-listening.py --todos --proveedor elevenlabs    lo hace de verdad

--espeak usa un sintetizador local: no llama a nadie y no cuesta nada. Sirve
para probar el reproductor con audio real, no para estudiar.

--simular no llama a la API: dice cuantos caracteres y cuantos creditos se
gastarian y que lineas ya estan en la cache. Conviene mirarlo siempre antes.

Para generar de verdad hace falta una clave en el entorno, nunca en un fichero:

    ELEVENLABS_API_KEY=...    y voces.json relleno
    AZURE_SPEECH_KEY=... AZURE_SPEECH_REGION=westeurope

CADA LINEA SE CACHEA por (voz, modelo, texto). Si cambias una frase de un
guion y vuelves a generar, solo se paga esa frase. Sin esto, corregir una coma
en la ultima linea costaba el guion entero otra vez.

ANTES DE USARLO EN PRODUCCION, leer well-online.md:
  - El plan gratuito de ElevenLabs PROHIBE el uso comercial. Hay que estar en
    un plan de pago desde el primer minuto.
  - Nunca clonar la voz de nadie sin permiso escrito.
  - El audio se declara siempre como "de practica, no oficial de Cambridge".
"""
import json, os, sys, math, struct, wave, argparse, urllib.request
import hashlib, subprocess, time, glob, urllib.error

RAIZ = os.path.dirname(os.path.abspath(__file__))


def demo(guion, destino, tope=None):
    """Audio de relleno: un tono suave por linea, con sus pausas. Solo para
    probar el reproductor. Se guarda a 8 kHz y con un tope de duracion para que
    no engorde el repositorio: es un fichero de usar y tirar."""
    hz, amp = 8000, 5200
    marcos = []
    def silencio(seg):
        marcos.extend([0] * int(hz * seg))
    def tono(seg, f):
        for i in range(int(hz * seg)):
            env = min(1.0, i / (hz * 0.05), (int(hz * seg) - i) / (hz * 0.05))
            marcos.append(int(amp * env * math.sin(2 * math.pi * f * i / hz)))
    silencio(0.6)
    n_lineas = len(guion['lineas'])
    escala = 1.0
    if tope:
        total = sum(max(2.0, len(l['texto'].split()) / guion.get('velocidad', 150) * 60)
                    + l.get('pausa', 0.5) + 0.4 for l in guion['lineas']) + 1.2
        if total > tope: escala = tope / total
    for n, linea in enumerate(guion['lineas']):
        seg = max(2.0, len(linea['texto'].split()) / guion.get('velocidad', 150) * 60) * escala
        tono(seg, 210 + (n % 4) * 35)
        silencio((linea.get('pausa', 0.5) + 0.4) * escala)
    silencio(0.6)
    with wave.open(destino, 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(hz)
        w.writeframes(b''.join(struct.pack('<h', m) for m in marcos))
    return len(marcos) / hz


VOCES = os.path.join(RAIZ, 'listening', 'voces.json')
CACHE = os.path.join(RAIZ, 'audio', '.cache')


def carga_voces():
    with open(VOCES, encoding='utf-8') as f:
        return json.load(f)


def voz_de(cat, papel):
    """El identificador de una voz vive en un solo sitio: voces.json. Los guiones
    solo dicen que papel hace cada quien."""
    p = cat['papeles'].get(papel)
    if not p:
        sys.exit('El papel "%s" no esta en listening/voces.json' % papel)
    if p.get('voz') in (None, '', 'PENDIENTE'):
        sys.exit('El papel "%s" no tiene voz asignada todavia en listening/voces.json' % papel)
    return p['voz']


def eleven_linea(texto, voz, modelo, formato, clave, intentos=4):
    url = ('https://api.elevenlabs.io/v1/text-to-speech/%s?output_format=%s' % (voz, formato))
    cuerpo = json.dumps({'text': texto, 'model_id': modelo}).encode('utf-8')
    for n in range(intentos):
        pet = urllib.request.Request(url, data=cuerpo, headers={
            'xi-api-key': clave, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'})
        try:
            with urllib.request.urlopen(pet, timeout=180) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            # 401/402/422 son culpa nuestra (clave, creditos, texto): no se reintenta,
            # solo se gastaria tiempo. El resto puede ser la red y si se reintenta.
            if e.code in (400, 401, 402, 403, 422) or n == intentos - 1:
                sys.exit('ElevenLabs devolvio %s: %s' % (e.code, e.read()[:300].decode('utf-8', 'replace')))
            time.sleep(2 ** n)
        except Exception as e:
            # El Python de python.org en macOS no usa el llavero del sistema y
            # no trae autoridades certificadoras: la primera llamada HTTPS de
            # una maquina recien montada falla siempre asi. No es la red, no es
            # la clave, y el mensaje de urllib no lo dice por ningun lado.
            if 'CERTIFICATE_VERIFY_FAILED' in str(e):
                sys.exit('Tu Python no tiene certificados y no puede abrir HTTPS.\n'
                         'No es la clave ni la conexion, y no se ha gastado nada.\n\n'
                         'En macOS se arregla ejecutando una vez:\n'
                         '    /Applications/Python\\ 3.x/Install\\ Certificates.command\n\n'
                         'Si esa ruta no existe:\n'
                         '    python3 -m pip install --upgrade certifi\n'
                         '    export SSL_CERT_FILE=$(python3 -m certifi)\n\n'
                         'Y vuelve a lanzar el mismo comando.')
            # Un traceback de urllib no le dice nada a nadie. Si despues de los
            # reintentos sigue sin haber red, se dice en una linea.
            if n == intentos - 1:
                sys.exit('No se ha podido hablar con ElevenLabs despues de %d intentos: %s\n'
                         'Mira la conexion y vuelve a lanzar el mismo comando: lo ya generado '
                         'esta en cache y no se paga otra vez.' % (intentos, e))
            time.sleep(2 ** n)


def azure_linea(texto, voz, clave, region):
    url = 'https://%s.tts.speech.microsoft.com/cognitiveservices/v1' % region
    ssml = ('<speak version="1.0" xml:lang="en-GB"><voice name="%s">%s</voice></speak>'
            % (voz, texto)).encode('utf-8')
    pet = urllib.request.Request(url, data=ssml, headers={
        'Ocp-Apim-Subscription-Key': clave,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3'})
    with urllib.request.urlopen(pet, timeout=180) as r:
        return r.read()


def silencio_mp3(seg, destino):
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'lavfi',
                    '-i', 'anullsrc=r=44100:cl=mono', '-t', '%.3f' % seg,
                    '-c:a', 'libmp3lame', '-b:a', '64k', destino], check=True)


def monta(piezas, destino):
    """Junta trozos con ffmpeg y reencoda. Concatenar MP3 a pelo deja cabeceras
    sueltas por el medio y algunos navegadores calculan mal la duracion: con la
    barra de progreso del reproductor eso se ve enseguida."""
    lista = destino + '.txt'
    with open(lista, 'w', encoding='utf-8') as f:
        for p in piezas:
            f.write("file '%s'\n" % p.replace("'", "'\\''"))
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0',
                    '-i', lista, '-c:a', 'libmp3lame', '-b:a', '64k', '-ar', '44100',
                    '-ac', '1', destino], check=True)
    os.remove(lista)
    sal = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                          '-of', 'csv=p=0', destino], capture_output=True, text=True)
    try:
        return float(sal.stdout.strip())
    except ValueError:
        return 0.0


def genera(guion, destino, proveedor, simular=False):
    """Devuelve (segundos, caracteres_pagados, lineas_cacheadas)."""
    cat = carga_voces()
    modelo = cat.get('modelo', 'eleven_multilingual_v2')
    formato = cat.get('formato', 'mp3_44100_128')
    proveedor = proveedor or cat.get('proveedor', 'elevenlabs')
    voces = {v['id']: v for v in guion['voces']}
    os.makedirs(CACHE, exist_ok=True)

    clave = region = None
    if not simular:
        if proveedor == 'elevenlabs':
            clave = os.environ.get('ELEVENLABS_API_KEY') or sys.exit('Falta ELEVENLABS_API_KEY')
        elif proveedor == 'azure':
            clave = os.environ.get('AZURE_SPEECH_KEY') or sys.exit('Falta AZURE_SPEECH_KEY')
            region = os.environ.get('AZURE_SPEECH_REGION', 'westeurope')
        else:
            sys.exit('Proveedor desconocido: %s' % proveedor)

    piezas, pagados, cacheadas = [], 0, 0
    for i, linea in enumerate(guion['lineas']):
        v = voces[linea['voz']]
        vid = voz_de(cat, v['papel'])
        firma = hashlib.sha1(('%s|%s|%s|%s' % (proveedor, vid, modelo, linea['texto']))
                             .encode('utf-8')).hexdigest()
        trozo = os.path.join(CACHE, firma + '.mp3')

        if os.path.exists(trozo):
            cacheadas += 1
        else:
            pagados += len(linea['texto'])
            if not simular:
                if proveedor == 'elevenlabs':
                    datos = eleven_linea(linea['texto'], vid, modelo, formato, clave)
                else:
                    datos = azure_linea(linea['texto'], vid, clave, region)
                with open(trozo, 'wb') as f:
                    f.write(datos)
                print('  linea %d/%d  %s  %d car' % (i + 1, len(guion['lineas']), v['papel'],
                                                     len(linea['texto'])))
        piezas.append(trozo)

        pausa = float(linea.get('pausa', 0))
        if pausa:
            sil = os.path.join(CACHE, 'sil-%.3f.mp3' % pausa)
            if not simular and not os.path.exists(sil):
                silencio_mp3(pausa, sil)
            piezas.append(sil)

    if simular:
        return 0.0, pagados, cacheadas
    return monta(piezas, destino), pagados, cacheadas


def espeak(guion, destino):
    """Voz de verdad, local y gratis, con espeak-ng.

    Es robotica y NO vale como material final: el CAE mide entender a personas,
    con su acento y sus titubeos, no a un sintetizador. Sirve para dos cosas
    concretas: probar el reproductor y sus reglas de examen con audio real, y
    ensenar el flujo completo antes de pagar una voz. Cuando haya cuenta de
    ElevenLabs o Azure, el guion no cambia: solo el proveedor.
    """
    import subprocess, wave, struct
    voces = {v['id']: v for v in guion['voces']}
    vel = int(guion.get('velocidad', 150))
    trozos, hz = [], None

    for i, linea in enumerate(guion['lineas']):
        v = voces[linea['voz']]
        # espeak-ng distingue variantes: se aprovecha el acento del guion y se
        # separan las voces para que en una conversacion no hablen igual
        acento = v.get('acento', 'en-GB')
        base = 'en-gb' if acento.startswith('en-GB') else 'en-us'
        variante = v.get('espeak') or base
        tmp = os.path.join(RAIZ, 'audio', '_tmp%d.wav' % i)
        subprocess.run(['espeak-ng', '-v', variante, '-s', str(vel), '-w', tmp, linea['texto']],
                       check=True, capture_output=True)
        with wave.open(tmp) as w:
            hz = w.getframerate()
            trozos.append(w.readframes(w.getnframes()))
        os.remove(tmp)
        # la pausa que pide el guion, en silencio
        pausa = float(linea.get('pausa', 0))
        if pausa:
            trozos.append(b'\x00\x00' * int(hz * pausa))
        print('  linea %d/%d' % (i + 1, len(guion['lineas'])))

    crudo = destino + '.wav'
    with wave.open(crudo, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(hz)
        for t in trozos: w.writeframes(t)
    with wave.open(crudo) as w:
        seg = w.getnframes() / float(w.getframerate())

    # Un WAV de minuto y medio son tres megas y medio; comprimido, medio mega.
    #
    # MP3 y no Opus, aunque Opus pese menos: en Ogg, Chromium no lee la
    # duracion del fichero y devuelve infinito, con lo que la barra de progreso
    # se queda clavada en cero. WebM lo arregla pero Safari en iPhone es
    # historicamente irregular con WebM, y un listening que no suena en el movil
    # de un alumno no sirve de nada. MP3 lo reproduce todo, y ademas es lo que
    # devuelven ElevenLabs y Azure, asi que el formato no cambia al pagar la voz.
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', crudo,
                    '-c:a', 'libmp3lame', '-b:a', '32k', '-ar', '16000', '-ac', '1', destino],
                   check=True)
    os.remove(crudo)
    return seg


def guiones_de(args):
    if args.todos:
        return sorted(glob.glob(os.path.join(RAIZ, 'listening', 't*-p*.json')))
    if not args.guion:
        sys.exit('Dime un guion, o pon --todos.')
    return [args.guion]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('guion', nargs='?')
    ap.add_argument('--todos', action='store_true', help='los 16 guiones de una vez')
    ap.add_argument('--demo', action='store_true')
    ap.add_argument('--tope', type=float, default=35, help='segundos maximos del relleno')
    ap.add_argument('--espeak', action='store_true',
                    help='voz local con espeak-ng: gratis, robotica, provisional')
    ap.add_argument('--simular', action='store_true',
                    help='no llama a la API: dice lo que costaria')
    ap.add_argument('--proveedor', choices=['elevenlabs', 'azure'])
    a = ap.parse_args()
    os.makedirs(os.path.join(RAIZ, 'audio'), exist_ok=True)

    # Antes de gastar un solo credito: que no falte ninguna voz por elegir. Es
    # mejor parar aqui que a mitad de los dieciseis, con la mitad pagada.
    rutas = guiones_de(a)
    if not (a.demo or a.espeak):
        cat = carga_voces()
        usados = set()
        for r in rutas:
            with open(r, encoding='utf-8') as f:
                usados.update(v['papel'] for v in json.load(f)['voces'])
        faltan = sorted(p for p in usados
                        if cat['papeles'].get(p, {}).get('voz') in (None, '', 'PENDIENTE'))
        if faltan:
            sys.exit('Falta la voz de: %s\n'
                     'Estan en listening/voces.json. Solo se piden los papeles que usan '
                     'los guiones que has pedido, no los diez.' % ', '.join(faltan))

    total_pag = total_cache = 0
    for ruta in rutas:
        with open(ruta, encoding='utf-8') as f:
            guion = json.load(f)
        nombre = os.path.basename(ruta)

        if a.demo:
            destino = os.path.join(RAIZ, 'audio', guion['id'] + '-demo.wav')
            seg = demo(guion, destino, a.tope)
            print('%-14s relleno %.0f s -> %s' % (nombre, seg, destino))
            continue
        if a.espeak:
            destino = os.path.join(RAIZ, 'audio', guion['id'] + '-espeak.mp3')
            seg = espeak(guion, destino)
            print('%-14s espeak %.0f s -> %s' % (nombre, seg, destino))
            continue

        destino = os.path.join(RAIZ, 'audio', guion['id'] + '.mp3')
        if not a.simular:
            print(nombre)
        seg, pag, cac = genera(guion, destino, a.proveedor, a.simular)
        total_pag += pag; total_cache += cac
        if a.simular:
            print('%-14s %5d caracteres a pagar · %2d lineas ya en cache' % (nombre, pag, cac))
        else:
            print('%-14s %.0f s -> %s  (%d car pagados, %d lineas de cache)'
                  % (nombre, seg, destino, pag, cac))

    if a.demo or a.espeak:
        if a.espeak:
            print('PROVISIONAL: es un sintetizador, no una persona. No se publica asi.')
        return

    print('-' * 60)
    if a.simular:
        print('SIMULACION: no se ha llamado a la API y no se ha gastado nada.')
    print('%d caracteres a pagar (~%d creditos) · %d lineas servidas de cache'
          % (total_pag, total_pag, total_cache))
    if a.simular:
        print('Para hacerlo de verdad, quita --simular.')


if __name__ == '__main__':
    main()
