# Generar el audio de los listenings

Cuatro tests, cuatro partes cada uno: **16 guiones, 35.069 caracteres**. Con el
plan Creator de ElevenLabs (121.000 creditos al mes) cabe entero y sobra para
dos pasadas mas.

## El camino corto

    export ELEVENLABS_API_KEY=<pegar la clave>
    ./voz.sh            comprueba, genera la audicion de 802 caracteres y para
    ./voz.sh --todo     genera los 16, engancha el audio, commit y push

`voz.sh` hace todo lo de abajo en orden y se planta en cuanto algo no cuadra.
Lo que sigue explica que hace cada paso y por que.

## Si en macOS falla con CERTIFICATE_VERIFY_FAILED

El Python de python.org no usa el llavero del sistema y viene sin autoridades
certificadoras, asi que su primera llamada HTTPS falla siempre. No es la clave
ni la conexion. Se arregla una vez:

    /Applications/Python\ 3.x/Install\ Certificates.command

Y si esa ruta no existe:

    python3 -m pip install --upgrade certifi
    export SSL_CERT_FILE=$(python3 -m certifi)

## Antes de gastar nada

1. Rellenar `listening/voces.json`: un `voice_id` por cada uno de los diez
   papeles. Se sacan de ElevenLabs, en *Voice Library* → anadir a *My Voices* →
   copiar ID. **Son publicos y pueden estar en el repositorio.**
2. La clave de la API **no va en ningun fichero**. Va en el entorno:

       export ELEVENLABS_API_KEY=sk_...

3. Mirar lo que costaria antes de que cueste:

       python3 gen-listening.py --todos --simular

   No llama a la API. Dice cuantos caracteres se pagarian y cuantas lineas ya
   estan en la cache.

## Escucharlas antes (802 caracteres, el 0,6% de un mes)

Las diez voces se eligieron **leyendo fichas, no oyendolas**. El riesgo concreto
es que `narrador` (Alistair) y `gb-h-medio` (Tom) suenen parecidos: dos
britanicos de registro medio. Antes de gastar los 35.000:

    python3 gen-listening.py listening/00-prueba-voces.json --proveedor elevenlabs

Escribe `audio/prueba-voces.mp3`: una frase por voz, en un orden pensado para que
los pares de riesgo salgan seguidos. Se escucha en un minuto.

Si alguna no convence, se cambia su `voice_id` en `voces.json` y se vuelve a
generar: **la cache solo cobra las lineas de esa voz**, el resto ya esta pagado.

## Hacerlo

    python3 gen-listening.py --todos --proveedor elevenlabs

Escribe `audio/t1-lis1.mp3` … `audio/t4-lis4.mp3`, MP3 mono a 64 kbps.

Despues, apuntar los ficheros nuevos en `practica-data.js` (los campos `audio:`
siguen mirando a `-espeak.mp3`) y borrar los provisionales.

## Por que hay cache

Cada linea se guarda en `audio/.cache/` con una firma de (voz, modelo, texto).
Si cambias una frase de un guion y vuelves a generar, **solo se paga esa
frase**. Sin esto, corregir una coma en la ultima linea costaba el guion
entero otra vez. La cache no va al repositorio (`.gitignore`).

## Lo que sabemos de estas voces y lo que no

- **Ninguna se ha escuchado.** Vienen de los metadatos de la libreria. Por eso
  existe el paso de arriba.
- **`gb-m-escocesa` (Sophie) tiene *Live moderation* activada.** ElevenLabs avisa
  de latencia extra. Para generacion en tanda no deberia importar; el script
  espera hasta 180 s por linea y reintenta con espera creciente.
- **`gb-h-mayor` (Grandfather Joe) suena mas a 70 que a 55-60.** Aceptable en los
  papeles donde va, pero es lo primero que se cambia si chirria.
- **Se descarto `Damiaan - Academic, British English`**, que encajaba bien como
  narrador, porque su ficha dice que es un clon de voz de una persona real
  identificable. Esa regla no se salta ni cuando la voz es la buena.

## Las reglas que no se saltan

- El plan gratuito **prohibe el uso comercial**. Hay que estar en un plan de
  pago desde el primer minuto.
- **No se clona la voz de nadie** sin permiso escrito.
- El audio se declara siempre como *de practica, no oficial de Cambridge*.
- El audio de Elena y el de sus CD **no entran aqui**: son grabaciones
  publicadas de una editorial.

## Los diez papeles

Ningun guion repite papel dentro de si mismo, asi que en una conversacion nunca
hablan dos personas con la misma voz.

| papel | acento | quien es |
|---|---|---|
| `narrador` | en-GB | La voz del examen. Lectura clara y neutra, sin dramatizar. |
| `gb-h-joven` | en-GB | Hombre britanico, unos 30. |
| `gb-h-medio` | en-GB | Hombre britanico, unos 40. |
| `gb-h-mayor` | en-GB | Hombre britanico, 55-60, pausado. |
| `gb-m-joven` | en-GB | Mujer britanica, 20-30. |
| `gb-m-medio` | en-GB | Mujer britanica, unos 40. |
| `gb-m-mayor` | en-GB | Mujer britanica, 55-60. |
| `gb-m-escocesa` | en-GB | Mujer escocesa. El CAE mezcla acentos nativos a proposito. |
| `us-h` | en-US | Hombre estadounidense. |
| `us-m` | en-US | Mujer estadounidense. |
