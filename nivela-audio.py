#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Iguala el volumen de las voces dentro de cada listening ya montado.

Por que existe, si gen-listening.py ya normaliza linea a linea: porque aquel
arregla el audio AL GENERARLO, y necesita la cache de lineas, que vive en la
maquina donde se genero. Esto arregla ficheros ya montados, esten donde esten.

    dynaudnorm  iguala la sonoridad A LO LARGO del fichero, que es exactamente
                el problema: una persona se oye mas baja que otra dentro del
                mismo audio. Ajustes suaves (m=8, s=12) para que no bombee.
    loudnorm    despues, deja el nivel global en -16 LUFS, que es lo razonable
                para auriculares y movil.

Medido sobre el primer lote: los ficheros con cinco o seis voces tenian un
rango de 16 a 20,5 LU cuando en voz hablada lo normal son 5-8. Con esto bajan
a 6-8. Los silencios siguen siendo silencio digital: comprobado que no se
levanta ruido de fondo.

    python3 nivela-audio.py            dice que haria
    python3 nivela-audio.py --hazlo    lo hace
"""
import glob, os, re, subprocess, sys

RAIZ = os.path.dirname(os.path.abspath(__file__))
FILTRO = 'dynaudnorm=f=200:g=15:p=0.85:m=8:s=12,loudnorm=I=-16:TP=-1.5:LRA=11'


def mide(f):
    s = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', f,
                        '-af', 'ebur128', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    r = s[s.rindex('Summary:'):]
    return (float(re.search(r'I:\s*(-?[\d.]+) LUFS', r).group(1)),
            float(re.search(r'LRA:\s*([\d.]+) LU', r).group(1)))


def main():
    hazlo = '--hazlo' in sys.argv
    ficheros = sorted(glob.glob(os.path.join(RAIZ, 'audio', 't?-lis?.mp3')))
    if not ficheros:
        sys.exit('No hay audios montados en audio/.')

    print('  fichero          antes            despues')
    peor_a = peor_d = 0
    for f in ficheros:
        ia, la = mide(f); peor_a = max(peor_a, la)
        if not hazlo:
            print('  %-14s %6.1f LUFS %5.1f LU' % (os.path.basename(f), ia, la))
            continue
        tmp = f + '.tmp.mp3'
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f, '-af', FILTRO,
                        '-c:a', 'libmp3lame', '-b:a', '64k', '-ar', '44100', '-ac', '1', tmp],
                       check=True)
        os.replace(tmp, f)
        id_, ld = mide(f); peor_d = max(peor_d, ld)
        print('  %-14s %6.1f LUFS %5.1f LU  ->  %6.1f LUFS %5.1f LU %s'
              % (os.path.basename(f), ia, la, id_, ld, '' if ld < 12 else '  OJO'))

    print()
    if hazlo:
        print('  peor rango: %.1f LU  ->  %.1f LU   (voz hablada: 5-8 LU)' % (peor_a, peor_d))
    else:
        print('  peor rango ahora: %.1f LU   (voz hablada: 5-8 LU)' % peor_a)
        print('  Para nivelarlos:  python3 nivela-audio.py --hazlo')


if __name__ == '__main__':
    main()
