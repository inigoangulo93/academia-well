#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Engancha el audio de verdad y jubila el provisional.

Mientras solo habia voz de espeak, cada listening apuntaba a
'audio/tX-lisY-espeak.mp3' y llevaba demo:true, que es lo que hace salir el
aviso de "voz provisional generada por ordenador" en el reproductor.

Este script hace el cambio cuando los dieciseis ficheros de verdad existen, y
solo entonces. Si falta uno, no toca nada: dejar la aplicacion apuntando a un
fichero que no esta seria peor que el robot.

    python3 usa-voz-real.py            dice que haria
    python3 usa-voz-real.py --hazlo    lo hace
"""
import glob, io, json, os, re, sys, subprocess

RAIZ = os.path.dirname(os.path.abspath(__file__))
DATOS = os.path.join(RAIZ, 'practica-data.js')
# Antes eran los dieciseis de C1 escritos a mano. Con el primer test de B2 esa
# lista se quedo corta y habria dicho "ya estaba hecho" con cuatro listenings en
# voz de robot. Ahora sale de los guiones que hay en listening/.
IDS = sorted(json.load(io.open(g, encoding='utf-8'))['id']
             for g in glob.glob(os.path.join(RAIZ, 'listening', '*-p[1-4].json')))


def main():
    hazlo = '--hazlo' in sys.argv

    s = io.open(DATOS, encoding='utf-8').read()
    antes = s

    # Solo interesan los que HOY siguen en espeak. Exigir los veinte a la vez
    # obligaria a repagar los dieciseis de C1 cada vez que se anade un test.
    pendientes = [i for i in IDS if ('audio/%s-espeak.mp3' % i) in s]
    if not pendientes:
        print('Ya estaba hecho: los %d listenings apuntan al audio de verdad.' % len(IDS))
        return

    faltan = [i for i in pendientes
              if not os.path.exists(os.path.join(RAIZ, 'audio', i + '.mp3'))]
    if faltan:
        sys.exit('Todavia no estan estos audios: %s\n'
                 'Genera primero:  python3 gen-listening.py --todos --proveedor elevenlabs'
                 % ', '.join(faltan))

    n = 0
    for i in pendientes:
        # El fichero esta escrito en dos estilos, con comillas simples y con
        # dobles. Ya nos mordio una vez: aqui se contemplan los dos y se cuenta.
        for c in ("'", '"'):
            viejo = '%saudio/%s-espeak.mp3%s' % (c, i, c)
            nuevo = '%saudio/%s.mp3%s' % (c, i, c)
            if viejo in s:
                s = s.replace(viejo, nuevo); n += 1
    if n != len(pendientes):
        sys.exit('Esperaba cambiar %d rutas y he encontrado %d. No toco nada.'
                 % (len(pendientes), n))

    # Fuera el aviso de voz provisional, en sus dos estilos.
    d = len(re.findall(r'demo: true, ', s)) + len(re.findall(r'"demo": true,\s*', s))
    s = s.replace('demo: true, ', '')
    s = re.sub(r'\s*"demo": true,', '', s)

    if not hazlo:
        print('Cambiaria %d rutas y quitaria %d avisos de voz provisional.' % (n, d))
        print('Para hacerlo:  python3 usa-voz-real.py --hazlo')
        return

    io.open(DATOS, 'w', encoding='utf-8').write(s)

    # Que el fichero siga siendo JavaScript valido y que las rutas existan.
    comp = subprocess.run(['node', '-e', '''
      var fs=require('fs');global.window={};eval(fs.readFileSync('%s','utf8'));
      var E=window.WELL_PRACTICA.ejercicios, mal=[];
      Object.keys(E).forEach(function(k){ var e=E[k]; if(e.tipo!=='listening') return;
        if(!e.audio || /espeak/.test(e.audio)) mal.push(k+' sigue en espeak');
        if(e.demo) mal.push(k+' sigue marcado como demo');
        if(!fs.existsSync(e.audio)) mal.push(k+' apunta a '+e.audio+', que no existe');
      });
      if(mal.length){ console.error(mal.join('\\n')); process.exit(1); }
      console.log('los 16 listenings apuntan a audio real');
    ''' % DATOS], cwd=RAIZ, capture_output=True, text=True)
    if comp.returncode:
        io.open(DATOS, 'w', encoding='utf-8').write(antes)
        sys.exit('Algo no cuadra, lo dejo como estaba:\n' + (comp.stderr or comp.stdout))
    print(comp.stdout.strip())

    borrados = 0
    for i in IDS:
        f = os.path.join(RAIZ, 'audio', i + '-espeak.mp3')
        if os.path.exists(f): os.remove(f); borrados += 1
    print('%d rutas cambiadas, %d avisos quitados, %d audios provisionales borrados'
          % (n, d, borrados))


if __name__ == '__main__':
    main()
