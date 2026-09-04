#!/usr/bin/env bash
#
# Todo el proceso de la voz de ElevenLabs, en un comando.
#
#   ./voz.sh          comprueba, genera la audicion de 802 caracteres y para
#   ./voz.sh --todo   genera los 16, engancha el audio, commit y push
#
# Para en cuanto algo no cuadra, y comprueba lo que puede antes de gastar un
# solo credito. La audicion va aparte a proposito: nadie ha escuchado estas
# voces todavia, y descubrir que dos suenan igual cuesta 802 caracteres si se
# mira antes y 35.069 si se mira despues.

set -euo pipefail
cd "$(dirname "$0")"

rojo=$'\033[31m'; verde=$'\033[32m'; gris=$'\033[90m'; fin=$'\033[0m'
mal () { echo; echo "${rojo}$1${fin}"; exit 1; }
paso () { echo; echo "${gris}── $1${fin}"; }

paso "1 · comprobaciones que no cuestan nada"

[ -f gen-listening.py ] || mal "No estas en el repo. Haz cd a la carpeta academia-well."

# ffmpeg monta los trozos y mete los silencios entre lineas. Sin el, la
# generacion llega a pagar la primera linea y revienta al juntarla. Se
# comprueba aqui, con lo que no cuesta nada.
command -v ffmpeg >/dev/null || mal "Falta ffmpeg, que es lo que junta los trozos de audio.

  brew install ffmpeg

Si no tienes Homebrew:
  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
command -v ffprobe >/dev/null || mal "Tienes ffmpeg pero no ffprobe. Reinstala:  brew reinstall ffmpeg"
echo "   ffmpeg: $(ffmpeg -version 2>/dev/null | head -1 | cut -d' ' -f1-3)"

rama=$(git rev-parse --abbrev-ref HEAD)
echo "   rama: $rama"
[ "$rama" = "well-online-practica" ] || mal "Esperaba la rama well-online-practica."

: "${ELEVENLABS_API_KEY:=}"
n=${#ELEVENLABS_API_KEY}
echo "   clave en el entorno: $n caracteres"
[ "$n" -gt 30 ] || mal "La clave no esta puesta, o es un marcador de posicion.
Copia la buena de elevenlabs.io y pegala:  export ELEVENLABS_API_KEY=<pegar>"

# El panel de ElevenLabs ensena en la lista el ID de la clave, no la clave. El
# valor de verdad solo se ve una vez, al crearla o al rotarla, y empieza por
# sk_. Copiar el ID es el error natural, porque es lo unico que hay a la vista.
case "$ELEVENLABS_API_KEY" in
  sk_*) ;;
  *) mal "Eso no es la clave: es el ID de la clave.

La lista de ElevenLabs ensena el ID. La clave de verdad empieza por sk_ y solo
se ve UNA VEZ, cuando se crea o se rota.

  elevenlabs.io -> Profile -> API Keys -> Rotate (o crear una nueva)
  Permisos: Text to Speech = Access, todo lo demas = No Access
  Copiala en ese momento y:  export ELEVENLABS_API_KEY=<pegar>" ;;
esac

python3 - <<'PY'
import json, sys
d = json.load(open('listening/voces.json'))
sin = [p for p, v in d['papeles'].items() if v['voz'] in (None, '', 'PENDIENTE')]
if sin: sys.exit('   Faltan voces por elegir: %s' % ', '.join(sin))
print('   voces: %d de %d' % (len(d['papeles']), len(d['papeles'])))
PY

python3 gen-listening.py --todos --simular | tail -3

if [ "${1:-}" != "--todo" ]; then
  paso "2 · la audicion: 802 caracteres, el 0,6% del mes"
  python3 gen-listening.py listening/00-prueba-voces.json --proveedor elevenlabs
  echo
  echo "${verde}Listo: audio/prueba-voces.mp3${fin}"
  command -v open >/dev/null && open audio/prueba-voces.mp3 || true
  cat <<'TXT'

   Escuchalo entero, dura poco mas de un minuto.
   Lo unico que hay que decidir son LAS DOS PRIMERAS VOCES SEGUIDAS:
   Alistair (el narrador) y Tom. Los dos son britanicos de registro
   medio y es el unico riesgo real de la seleccion.

   Si convencen:   ./voz.sh --todo
   Si no:          dilo y se cambia esa voz. La cache solo cobra sus lineas.
TXT
  exit 0
fi

paso "2 · los dieciseis guiones"
python3 gen-listening.py --todos --proveedor elevenlabs

paso "3 · enganchar el audio de verdad y jubilar el provisional"
python3 usa-voz-real.py --hazlo

paso "4 · comprobar antes de subir"
node qa/qa-contenido.js | tail -3

paso "5 · subir"
git add audio/ practica-data.js
git commit -q -m "Voz real de ElevenLabs en los dieciseis listenings

Generado con gen-listening.py sobre los guiones de listening/, con las diez
voces de listening/voces.json. Los ficheros provisionales de espeak se van, y
con ellos el aviso de voz generada por ordenador del reproductor."
git push origin well-online-practica

echo
echo "${verde}Hecho. El audio de verdad esta subido y enganchado.${fin}"
