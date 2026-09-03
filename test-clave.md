# Test de nivel online — clave de respuestas y decisiones a validar

Fuente: `ONLINE PLACEMENT.docx`, el documento con el que la academia tiene
definido el test. Las 100 preguntas se han transcrito sin cambiar contenido a
`test-data.js`.

> **Importante:** no existe ninguna prueba de nivel presencial. Este test online
> es el que determina el nivel del alumno y, con él, el grupo en el que entra.
> Eso convierte la clave de abajo y los mínimos de paso en decisiones reales
> sobre personas reales: **hay que validarlos antes de darles difusión.**

**El documento original no incluye clave de respuestas.** La clave de abajo la he
derivado yo y **debe revisarla la academia** antes de darla por definitiva: basta con leer la columna "respuesta" y marcar cualquier
desacuerdo. Cambiar una respuesta es editar el campo `correcta` (índice 0–3 → a–d)
de esa pregunta en `test-data.js`.

## Estructura (idéntica al documento original)

| Bloque en pantalla | Preguntas | Origen en el documento |
|---|---|---|
| A1 · Iniciación | 1–25 | «A1» |
| A2 · Básico | 26–50 | «A2» |
| B1 · Intermedio | 51–75 | «B1» |
| B1+ · Intermedio alto | 76–90 | «B1 (2)» |
| Final · Transforma las frases | 91–100 | «For each question, complete the second sentence…» |

## Cómo se calcula el nivel (provisional — validar)

El test es **por bloques con criterio de paso**: al terminar cada bloque se cuentan
los aciertos y, si no llegan al mínimo, el test termina ahí y se muestra el
resultado. Así nadie responde 75 preguntas de más. Mínimos en `test-data.js` →
`grupos[].minimo`. Los mínimos de los bloques tipo test están algo por encima del 60 %
(64–68 %) para compensar lo que se acierta por azar con 3–4 opciones; se han
afinado simulando miles de alumnos por perfil (≈90 % de colocación correcta):

| Bloque | Preguntas | Mínimo para pasar | Si no se supera → nivel |
|---|---|---|---|
| A1 | 1–25 | 16 | A1 |
| A2 | 26–50 | 16 | A2 |
| B1 | 51–75 | 17 | B1 |
| B1+ («B1 (2)» del papel) | 76–90 | 10 | B2 |
| Final (transformaciones) | 91–100 | 6 | B2 |
| Final superado | | | B2+ («por encima de B2»: el test no distingue C1 de C2) |

Lógica: superar el bloque X significa dominar sus contenidos, así que el grupo
que corresponde es el siguiente. La puntuación se muestra sobre las preguntas
respondidas (p. ej. «14 / 25» si el test paró tras A1).

## Cómo se calcula el nivel — decisiones a validar

1. Que el 60 % sea el umbral adecuado (se puede fijar bloque a bloque).
2. Que «superar A1 pero no A2» se presente como nivel **A2** (grupo A2) y no como A1.

## Correcciones tipográficas respecto al original (sin cambiar el contenido)

- Pregunta 79: «I'd more exercise if I ___ time» → «I'd **do** more exercise…» (errata evidente del original).
- Las opciones «-----» del papel (sin palabra) se muestran como «— (nada)».
- Mayúscula inicial de la opción *a* (Word la ponía automáticamente): en minúscula salvo cuando el hueco abre la frase o es nombre propio.

## Pregunta abierta

El test no distingue entre C1 y C2: por encima de B2 devuelve «B2+». **¿Cómo se
asigna grupo a quien está en C1 o C2?** Hoy el copy dice que se habla con la
persona; si hay otro criterio, hay que reflejarlo.

## Clave — opción múltiple (1–90)

| # | Pregunta | Respuesta |
|---|---|---|
| 1 | I ___ a student of English | am |
| 2 | This is Carlos. He's ___ | Italian |
| 3 | They ___ Spanish. They're from Italy | aren't |
| 4 | ___'s your first name? | What |
| 5 | I love music but I ___ like TV | don't |
| 6 | ___ she like sport? | Does |
| 7 | She's very friendly but she ___ very quiet | 's often |
| 8 | He hasn't got ___ brothers and sisters | any |
| 9 | How many children ___ got? | have they |
| 10 | There are a lot of CDs on the ___ | shelves |
| 11 | ___ a sofa and two armchairs in the living room | There's |
| 12 | Are there ___ wardrobes in the bedroom? | any |
| 13 | The cinema is ___ the hotel | opposite |
| 14 | You ___ buy shoes in a post office | can't |
| 15 | How ___ vegetables do you eat every day? | many |
| 16 | Is there ___ butter in the fridge? | any |
| 17 | He ___ afraid of the dark when he was young | wasn't |
| 18 | We ___ born in 1985 | were |
| 19 | ___ did you last see them? | When |
| 20 | ___ they do a lot of sport when they were at school? | Did |
| 21 | Is Chinese food ___ than English food? | better |
| 22 | He stayed at the ___ hotel in town | most expensive |
| 23 | They ___ their homework now | are doing |
| 24 | What ___ doing at the moment? | is he |
| 25 | She ___ jeans to work | usually wears |
| 26 | Do you like ___ DVDs? | watching |
| 27 | They start ___ school at 8.00 in the morning | — (nada) |
| 28 | Peter's ___ name is Michael | brother's |
| 29 | My birthday is on September ___ | 22nd |
| 30 | They ___ to France when they were six | moved |
| 31 | They went for a picnic with some friends ___ Sunday | on |
| 32 | We went ___ at the weekend | shopping |
| 33 | What ___ your sister look like? | does |
| 34 | He goes to work ___ train | by |
| 35 | You ___ drive a car in the centre of town. It isn't allowed | can't |
| 36 | You ___ to walk, you can take a bus | don't have |
| 37 | I'm ___ learn to cook | going to |
| 38 | Don't stay up late or you ___ be tired tomorrow | 'll |
| 39 | Let's ___ tennis this afternoon | play |
| 40 | I've got a bad headache. I ___ take an aspirin | should |
| 41 | I woke up late ___ I missed my train | so |
| 42 | ___ you ever flown in a helicopter? | Have |
| 43 | He ___ climbed a mountain in his life | has never |
| 44 | What ___ on at the moment? | are they working |
| 45 | I ___ dinner when I heard a strange noise | was cooking |
| 46 | You ___ be late for school again | mustn't |
| 47 | How long have you ___ him? | known |
| 48 | …if they ___ lots of money, they'll be happy | have |
| 49 | What ___ happen if he doesn't get here in time? | will |
| 50 | He's French but he ___ in London at the moment | 's living |
| 51 | ___ wrote the play Hamlet? | Who |
| 52 | We should avoid ___ in August | travelling |
| 53 | You ___ wear a suit. It's a very formal party | must |
| 54 | He's studied Spanish ___ last year | since |
| 55 | What's the matter? Have you ___ a cold? | caught |
| 56 | It ___ rain tomorrow. It's going to be a very wet day | 'll |
| 57 | I ___ wear uniform to school | didn't use to |
| 58 | There aren't any cinemas in the town ___ I live | where |
| 59 | I travelled around the world for a year ___ learn about other cultures | to |
| 60 | He married the girl ___ used to sit next to him at school | who |
| 61 | Children spend ___ hours watching TV | too many |
| 62 | I don't have ___ to do the things I enjoy | enough time |
| 63 | What would they do if they ___ have any money? | didn't |
| 64 | What ___ of doing now? | are you thinking |
| 65 | We ___ to work when we heard a loud crash behind us | were walking |
| 66 | ___ Thai food? | Has she ever eaten |
| 67 | They ___ to take her address so they had to go back and get it | 'd forgotten |
| 68 | I ___ be very good at sports when I was a teenager | used to |
| 69 | She is one of ___ students in her class | the cleverest |
| 70 | That shop's not ___ it used to be | as cheap as |
| 71 | I can't work if I ___ very hungry | feel |
| 72 | He won't pass the exam ___ he studies a lot more | unless |
| 73 | He ___ swim when he was five but he can't dive yet | could |
| 74 | We don't have ___ time or money to go on holiday | enough |
| 75 | The furniture ___ by her husband, who used to be a carpenter | was made |
| 76 | He ___ to work in his company's office in Shanghai | was sent |
| 77 | My brother ___ passed his exams | 's just |
| 78 | He ___ me my book would be a great success | told |
| 79 | I'd do more exercise if I ___ time | had |
| 80 | He ___ there before so he found it very exciting | hadn't been |
| 81 | We ___ on holiday tomorrow so I hope the weather stays warm | 're going |
| 82 | I ___ to find another job. I can't work with that awful boss any more | have to |
| 83 | These shoes were ___ expensive than I wanted to pay | far more |
| 84 | Would you lend me your car if I ___ to drive it carefully? | promised |
| 85 | If I ___ you, I'd take it back to the shop | were |
| 86 | How long have you ___ the violin? | been playing |
| 87 | I ___ listening to jazz music | 've always enjoyed |
| 88 | We ___ to go to the match but we managed to watch it on TV | weren't able |
| 89 | She's the woman ___ son is a famous pop star | whose |
| 90 | We ___ arrived on time if the traffic hadn't been so bad | would've |

## Clave — transformaciones (91–100)

Respuesta abierta, máximo tres palabras. Se corrige comparando con las variantes
aceptadas, ignorando mayúsculas, espacios dobles, puntuación final y el tipo de
apóstrofo. Para añadir variantes: campo `aceptadas` en `test-data.js`.

| # | Frase con hueco | Variantes aceptadas |
|---|---|---|
| 91 | What did ___ at university, Sarah? | you study |
| 92 | My house isn't very ___ my school. | far from |
| 93 | My course isn't as ___ I expected. | easy as |
| 94 | I need someone ___ my homework. | to check |
| 95 | It's a long time since ___ a concert. | I went to · I've been to · I visited |
| 96 | If I were you, ___ learn a musical instrument. | I'd · I would |
| 97 | You won't improve unless ___ the piano every day. | you practise · you practice |
| 98 | There aren't ___ concerts this month. | many · a lot of · lots of |
| 99 | This room isn't ___ for us to play music in. | big enough · large enough |
| 100 | I like playing the guitar ___ playing the piano | more than · better than |

## Decisiones que necesita validar la academia

1. **La clave completa** (tabla de arriba).
2. **Los mínimos de paso por bloque** (tabla de arriba).
3. **Recepción de leads.** El botón «Quiero conocer mi grupo» abre WhatsApp con un
   mensaje ya escrito (nombre, nivel estimado y mensaje opcional del alumno).
4. **Textos por nivel** de la pantalla de resultado (breves y sin promesas académicas).
