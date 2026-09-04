# Generar el audio de los listenings

Cuatro tests, cuatro partes cada uno: **16 guiones, 35.069 caracteres**. Con el
plan Creator de ElevenLabs (121.000 creditos al mes) cabe entero y sobra para
dos pasadas mas.

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
