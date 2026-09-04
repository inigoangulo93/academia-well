#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera el audio de un listening a partir de su guion.

    python3 gen-listening.py listening/t1-p2.json --demo
    python3 gen-listening.py listening/t1-p2.json --proveedor elevenlabs

--demo no llama a ninguna API: escribe un audio de relleno (tonos) para poder
probar el reproductor sin gastar creditos ni tener clave. Sirve para ver las
reglas de examen funcionando, no para estudiar.

Para generar de verdad hace falta una clave en el entorno:

    ELEVENLABS_API_KEY=...     y  "proveedor": "elevenlabs" en cada voz
    AZURE_SPEECH_KEY=... AZURE_SPEECH_REGION=westeurope   para azure

ANTES DE USARLO EN PRODUCCION, leer well-online.md:
  - El plan gratuito de ElevenLabs PROHIBE el uso comercial. Hay que estar en
    un plan de pago desde el primer minuto.
  - Nunca clonar la voz de nadie sin permiso escrito.
  - El audio se declara siempre como "de practica, no oficial de Cambridge".
"""
import json, os, sys, math, struct, wave, argparse, urllib.request

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


def elevenlabs(texto, voz, clave):
    url = 'https://api.elevenlabs.io/v1/text-to-speech/' + voz
    cuerpo = json.dumps({'text': texto, 'model_id': 'eleven_multilingual_v2'}).encode()
    pet = urllib.request.Request(url, data=cuerpo, headers={
        'xi-api-key': clave, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'})
    with urllib.request.urlopen(pet, timeout=120) as r:
        return r.read()


def azure(texto, voz, clave, region):
    url = 'https://%s.tts.speech.microsoft.com/cognitiveservices/v1' % region
    ssml = ('<speak version="1.0" xml:lang="en-GB"><voice name="%s">%s</voice></speak>'
            % (voz, texto)).encode('utf-8')
    pet = urllib.request.Request(url, data=ssml, headers={
        'Ocp-Apim-Subscription-Key': clave,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3'})
    with urllib.request.urlopen(pet, timeout=120) as r:
        return r.read()


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


def genera(guion, destino, proveedor):
    voces = {v['id']: v for v in guion['voces']}
    trozos = []
    for linea in guion['lineas']:
        v = voces[linea['voz']]
        p = proveedor or v.get('proveedor')
        if v.get('voz') in (None, '', 'PENDIENTE'):
            sys.exit('La voz de "%s" esta sin elegir. Pon su identificador en el guion.' % v['id'])
        if p == 'elevenlabs':
            clave = os.environ.get('ELEVENLABS_API_KEY')
            if not clave: sys.exit('Falta ELEVENLABS_API_KEY')
            trozos.append(elevenlabs(linea['texto'], v['voz'], clave))
        elif p == 'azure':
            clave = os.environ.get('AZURE_SPEECH_KEY')
            region = os.environ.get('AZURE_SPEECH_REGION', 'westeurope')
            if not clave: sys.exit('Falta AZURE_SPEECH_KEY')
            trozos.append(azure(linea['texto'], v['voz'], clave, region))
        else:
            sys.exit('Proveedor desconocido: %s' % p)
        print('  linea %d/%d ok' % (guion['lineas'].index(linea) + 1, len(guion['lineas'])))
    # Los MP3 se pueden concatenar tal cual; las pausas hay que meterlas en el
    # propio texto o montarlas despues con una herramienta de audio.
    with open(destino, 'wb') as f:
        for t in trozos: f.write(t)
    return destino


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('guion')
    ap.add_argument('--demo', action='store_true')
    ap.add_argument('--tope', type=float, default=35, help='segundos maximos del relleno')
    ap.add_argument('--espeak', action='store_true',
                    help='voz local con espeak-ng: gratis, robotica, provisional')
    ap.add_argument('--proveedor', choices=['elevenlabs', 'azure'])
    a = ap.parse_args()

    with open(a.guion, encoding='utf-8') as f:
        guion = json.load(f)
    os.makedirs(os.path.join(RAIZ, 'audio'), exist_ok=True)

    if a.demo:
        destino = os.path.join(RAIZ, 'audio', guion['id'] + '-demo.wav')
        seg = demo(guion, destino, a.tope)
        print('Relleno escrito en %s (%.0f s). NO es voz: sirve para probar el reproductor.' % (destino, seg))
        return
    if a.espeak:
        destino = os.path.join(RAIZ, 'audio', guion['id'] + '-espeak.mp3')
        seg = espeak(guion, destino)
        print('Voz local escrita en %s (%.0f s).' % (destino, seg))
        print('PROVISIONAL: es un sintetizador, no una persona. No se publica asi.')
        return
    destino = os.path.join(RAIZ, 'audio', guion['id'] + '.mp3')
    genera(guion, destino, a.proveedor)
    print('Audio escrito en %s' % destino)


if __name__ == '__main__':
    main()
