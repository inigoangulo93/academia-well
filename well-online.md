# Well Online · el plan

Vertical de negocio nueva de Academia Well: **preparacion del C1 Advanced (CAE)
100 % online**. El alumno **no pisa la academia**: todo se hace desde la
plataforma, incluidas las dos destrezas que no son de respuesta cerrada.

Estado: **prototipo en staging**. `practica.html` + `practica-app.js` +
`practica-data.js`, con `noindex` y sin enlazar desde ninguna pagina publica.

---

## 1. El curso, tal y como lo da Elena

La unidad **no es una lista de ejercicios: es el test completo**. Se llega a el
por sesiones con receta fija que alternan dos tipos:

| Sesion | Receta |
|---|---|
| **A** | 2 vocabulario · 2 gramatica · 1 parte de Use of English · 1 parte de Listening |
| **B** | 2 vocabulario · 2 gramatica · 1 parte de Reading · Speaking |
| ... | alternando hasta agotar las 4 partes de cada destreza = **8 sesiones** |
| **W** | los dos writings |
| | → **informe del test** con el porcentaje por destreza → empieza el test 2 |

Vocabulario y gramatica se hacen en **todas** las sesiones y no dan nota: son
entrenamiento. Las cinco notas del informe son **las mismas cinco que informa
Cambridge**: Reading, Use of English, Listening, Writing y Speaking.

## 2. El examen que se replica

**Reading and Use of English** · 1h30 · 8 partes · 56 preguntas · 78 puntos.
Partes 1-4 dan la nota de *Use of English*; partes 5-8, la de *Reading*.

| Parte | Tarea | Preg. | Puntos |
|---|---|---|---|
| 1 | Multiple-choice cloze | 8 | 8 |
| 2 | Open cloze | 8 | 8 |
| 3 | Word formation | 8 | 8 |
| 4 | Key word transformation | 6 | 12 |
| 5 | Multiple choice | 6 | 12 |
| 6 | Cross-text multiple matching | 4 | 8 |
| 7 | Gapped text | 6 | 12 |
| 8 | Multiple matching | 10 | 10 |

**Listening** · ~40 min · 4 partes · 30 preguntas · 1 punto cada una
(6 · 8 · 6 · 10). **Se escucha dos veces.**

**Writing** · 2 tareas. **Speaking** · ~15 min, en pareja.

> **Elena tiene que confirmar este reparto de puntos.** Todos los porcentajes
> dependen de el y es su terreno.

## 3. El material de la academia y lo que da de si

Cuatro documentos: `GRAMMAR FOLDER`, `VOCABULARY FOLDER` y sus dos claves.
Medido: **~288 ejercicios y ~2.100 huecos**, en solo **cuatro formatos**.

Contra su propio ciclo (16 de vocabulario y 16 de gramatica por test):

| | Tiene | Da para |
|---|---|---|
| Vocabulario (caja de palabras) | 72 | **4,5 tests** |
| Gramatica | 144 | **9 tests** |
| Use of English partes 2, 3 y 4 | 72 | 23 tests |
| Use of English parte 1 (multiple-choice cloze) | 0 | — |
| Reading · Listening · Writing | 0 | — |

**El cuello de botella es el vocabulario, y da para un curso entero de 4-5
tests.** Ninguno de los cuatro formatos necesita IA para corregirse: el motor
del test de nivel vale para los 2.100 huecos, gratis y sin conexion.

Las claves parecen alinearse una linea por ejercicio y en orden, pero tienen
erratas (`when they heared`), asi que el volcado automatico **tiene que
terminar en revision humana**.

## 4. La pregunta abierta: de donde salen las frases

El formato (open cloze, word formation, key word transformation) es el de
Cambridge y no es de nadie. **Las frases concretas pueden venir de manuales
publicados.** Hace falta que la academia diga si las escribio ella o las copio.

Mientras no haya respuesta, **el material de Elena no entra en este
repositorio, que es publico**. Los ejercicios de `practica-data.js` los he
escrito yo imitando los formatos.

Segun la respuesta:

- **Escritas por la academia** → se usan tal cual, tambien en abierto.
- **Copiadas o de origen dudoso** → solo dentro del producto de pago, detras de
  acceso, y para la parte gratuita se escriben ejercicios nuevos con el mismo
  objetivo. Esto ademas protege el negocio: lo que esta en abierto no se puede
  raspar para montar la competencia.

**Los CD de listening de la academia no se pueden usar.** Son grabaciones
publicadas de una editorial; subirlas, aunque sea detras de un login, es
distribuir obra ajena. Si valen, y mucho, como **fuente de criterio**:
velocidad de habla, duracion de cada extracto, como estan construidos los
distractores.

## 5. Listening: como se produce

**Voz sintetica.** Un listening completo necesita ~13 minutos de audio unico
(los 40 del examen son porque todo se oye dos veces). Eso son ~11.000 letras de
guion: **centimos por test**. El coste no es el problema y se traslada al
precio del producto.

| Proveedor | Para que |
|---|---|
| **ElevenLabs** | Partes 1 y 3 (conversaciones). Su modo *Text to Dialogue* maneja interrupciones y solapes, que es lo que hunde a los demas |
| **Azure AI Speech** | Partes 2 y 4. 400+ voces y cobertura de acentos (en-GB, en-IE, en-AU, en-NZ, en-ZA) que nadie iguala; hacen falta cinco voces distintas en la Parte 4 |
| **Google Gemini TTS** | Comodin: control por lenguaje natural del estilo, acento y ritmo |

**Licencias, sin margen:**

- ElevenLabs **gratis prohibe el uso comercial** y exige atribucion. Hay que
  estar en plan de pago desde el minuto uno (desde 6 $/mes). Los planes de pago
  dan licencia comercial y **el audio sigue siendo tuyo aunque canceles**.
- ElevenLabs **se reserva licencia sobre el contenido para entrenar** sus
  modelos. Asumible para guiones de practica; conviene saberlo.
- **Ojo con la biblioteca de voces de la comunidad**: algunas son clonaciones
  con condiciones propias. Y **nunca clonar la voz de nadie sin permiso
  escrito**.

**Se declara siempre**: *"audio de practica generado por la academia, no
oficial de Cambridge"*.

**El reproductor impone las reglas del examen**: dos escuchas, sin rebobinar,
pausas cronometradas entre partes. Casi todas las webs de practica ponen una
barra de audio normal, con lo que el simulacro deja de medir nada. Es poco
codigo y mucha diferencia.

**Orden**: empezar por la **Parte 2** (un solo hablante) para validar el metodo
con un test de una sola parte, no un listening completo a ciegas.

## 6. Speaking: la escalera

Cambridge evalua el speaking por cinco criterios. **Cuatro se miden sin ninguna
persona delante**:

| Criterio | Automatizable |
|---|---|
| Pronunciation | ✅ Azure da precision y prosodia (acento, entonacion, ritmo) |
| Lexical Resource | ✅ nota de vocabulario + analisis del transcrito |
| Grammatical Resource | ✅ nota gramatical + analisis |
| Discourse Management | ✅ IA sobre el transcrito |
| **Interactive Communication** | ❌ **necesita a alguien enfrente** |

Azure evalua pronunciacion **no guionizada** (habla libre) y devuelve nota de
pronunciacion y de contenido. Mismo proveedor que el listening.

La escalera, de gratis a caro:

1. **Grabas tu solo** · ilimitado · cero horas de nadie. Lamina y cronometro de
   un minuto como en el examen, grabacion desde el navegador y las cuatro notas
   de arriba. Cubre entera la **Parte 2**, que es un monologo.
2. **Examinador de IA por voz** · Partes 1 y 4, que son preguntas y respuestas.
   Ilimitado, centimos el minuto.
3. **Emparejar alumnos entre si** · **la Parte 3 del CAE es entre dos
   candidatos**: la pareja no es un apano barato, es el formato real. La
   plataforma empareja por nivel, da hora, manda el enlace de video y pone en
   pantalla laminas y cronometro. Cero horas de Elena, y si alguien te espera el
   martes a las siete, apareces: **es retencion gratis**.
   Arranque: **concentrar la demanda en franjas fijas** (martes 19:00, jueves
   20:00) en vez de dejar reservar a cualquier hora, y cubrir el impar con un
   monitor.
4. **Elena en video** · lo que se paga. Quince minutos al mes y un **simulacro
   completo de 15 minutos antes de cada convocatoria**.

**La videollamada no se construye**: Meet, Jitsi o Whereby. Lo nuestro es el
emparejamiento, las laminas y el cronometro.

**Guardar voz de alumnos es dato personal**: consentimiento explicito, borrado
automatico a los X meses y permiso de los padres si hay menores. Pensarlo antes
de tener doscientos audios.

## 7. Writing

Lo corrige la **IA dentro de la plataforma**, con revision de Elena cuando toca
firmarlo. Es la pieza que mas diferencia el producto y **la unica que escala
sin las horas de Elena**, o sea, la que permite vender fuera de Galdakao.

## 8. Como se puntua, honestamente

- **Si**: porcentaje por parte, porcentaje por destreza y una **banda propia**
  ("por debajo del aprobado", "justo", "comodo"), explicando que es una
  estimacion de la academia.
- **No**: inventarse un *"tu nota Cambridge seria 187"*. La conversion de
  puntos brutos a la escala **no es publica**. Eso es mentir con numeros y se
  destapa el dia del examen.

La banda se calibra con algo que ninguna plataforma tiene: **los resultados
reales de los alumnos de Well**. Hay que **empezar a registrar desde ya** quien
se presenta y quien aprueba, aunque sea en una hoja de calculo.

## 9. Que hace diferente a este producto

Lo que **no** va a ser nunca la ventaja: el contenido (2.100 huecos se replican
en una semana con IA), la gamificacion (compites con empresas de cientos de
ingenieros) y el precio.

Lo que si:

1. **El bucle clase ↔ online.** La practica sabe que falla cada alumno y Elena
   lo ve antes de la clase. Nadie con una app pura puede hacerlo, y ninguna
   academia de Bizkaia tiene el software. *(Aplica a la academia fisica, no a
   esta vertical.)*
2. **Writing corregido por IA y firmado por una profesora.** Ni una app ni un
   ChatGPT suelto pueden decir eso.
3. **Speaking emparejado entre alumnos**, que es el formato real del examen.
4. **Una meta con fecha, no una suscripcion infinita**: "preparacion para la
   convocatoria de junio" en vez de 9,99 €/mes para siempre.
5. **Publicar las tasas de aprobado.** Ninguna app puede; ninguna academia
   local se molesta en medirlo. A dos años es el activo mas fuerte.
6. **El euskera.** Mercado pequeño, competencia cero.

**Posicionamiento**: *"El metodo de una academia de verdad, con una profesora
que corrige de verdad."*

**Riesgo**: plantearlo como "una plataforma online para cualquiera" pierde
todas las ventajas y compite de frente con gente con mucho mas dinero.

## 10. El 1-1 sin saturar a Elena

El software prepara la sesion; Elena da los quince minutos que nadie mas puede
dar.

- **Asincrono por defecto**: una nota de voz de tres minutos sobre un writing
  concreto vale casi lo mismo y no obliga a cuadrar agendas.
- **Speaking en grupos de tres**, no 1-1: ademas de costar un tercio, es mejor
  preparacion, porque el examen es en pareja.
- **Racionar y decirlo**: "una tutoria de 15 minutos al mes", no "ilimitadas".
- **Todo en un bloque**: lo que satura es el salto de contexto, no las horas.
- **La cola la ordena el sistema**: examen cerca y por debajo del umbral, o
  racha rota hace dos semanas (a punto de abandonar).
- **Lista de lo que NO se hace en tutoria**: explicar gramatica que ya esta en
  el material, corregir lo que se autocorrige, "repasar" sin objetivo.

Cuentas: 60 alumnos = ~9 h/mes (~2 h a la semana). El techo real esta sobre los
80-100 alumnos; a partir de ahi hace falta un segundo profesor, y **el sistema
es justo lo que lo hace viable**, porque hereda expediente, metodo y criterios.

**El 1-1 no es un coste, es el precio**: sin el, esto vale 15 €/mes y compite
con cosas gratis; con el, 40-60 € y no compite con nadie.

## 11. Lo que obliga a tener servidor

Todo lo de arriba cabe en HTML estatico **menos**:

- guardar audio de speaking, transcribirlo y puntuarlo,
- corregir writings con IA,
- emparejar alumnos y llevar agenda,
- cuentas y progreso que sobreviva a cambiar de movil,
- cobrar.

Es la decision de arquitectura que llevamos aplazando. **Speaking es lo primero
que la fuerza.**

---

# Notas del prototipo

## Como esta en los datos

`practica-data.js` declara el examen, las destrezas, los tests con sus sesiones
y, dentro de cada sesion, los bloques por destreza. Los ejercicios viven en un
unico saco (`ejercicios`) y las sesiones los referencian por id.

Un bloque sin `ejercicios` sale igualmente en la receta de la sesion, marcado
como pendiente: se ve la clase entera aunque falte material.

Quien corrige lo que no es de respuesta cerrada va en los datos
(`correccion: 'ia' | 'video'`), no en el codigo.

**Añadir el B2 First es escribir datos, no codigo.**

Tipos de ejercicio que entiende el motor: `caja`, `cloze`, `formacion`,
`transformacion`. Correccion por comparacion normalizada con variantes
aceptadas, sin llamar a ninguna API.

## El panel

Saluda por nombre y por la hora; el nombre y el nivel salen del test de nivel,
que los guarda en `well_nombre` y `well_nivel`. Anillo de dominio, tira de
siete dias con la racha, ejercicios perfectos, sesiones completas y lo que
queda. La insignia mas cercana con su barra. Once insignias, en su propia
ventana para que no ocupen medio panel.

## El camino

Un mapa: rail vertical con un nodo por sesion. Verde con el visto las hechas,
azul con halo la que toca, candado la bloqueada, trazo discontinuo las que
estan por volcar. Una sesion se abre al **dominar el 70 %** de la anterior
(`dominioParaAbrir`), el mismo criterio que el test de nivel, y **la bloqueada
dice exactamente que falta**. Cada test termina en un nodo de meta que abre el
informe.

## Navegacion e interfaz

La cabecera es **la misma que la web** (mismo logotipo, mismo fondo, misma
sombra al bajar), con la chapa de usuario a la derecha: menu con lo que hay
(cambiar nombre, repetir el test, volver a la web) y lo que habra, marcado como
*pronto*: **Ajustes** y **Mis informes**.

Migas clicables, la cabecera dice a donde vuelve, cada pantalla tiene su URL
con almohadilla, las sesiones son botones de verdad (teclado, `disabled` las
cerradas), foco visible y Escape cierra menus y ventanas. Los botones solo
ocupan el ancho completo en movil. Probado a 360, 390, 820 y 1440 px.

## Que hay montado y funcionando

| Pieza | Estado |
|---|---|
| Vocabulario, gramatica y Use of English partes 2, 3 y 4 | ✅ con ejercicios de muestra |
| **Use of English parte 1** (multiple-choice cloze) | ✅ tipo nuevo: texto con huecos marcados y cuatro opciones debajo |
| **Modo simulacro** | ✅ las 4 partes de una sentada, reloj, sin soluciones hasta el final, banda y desglose por parte |
| **Listening** | ✅ reproductor con reglas de examen; audio **de relleno**, falta el de verdad |
| **Speaking** | ✅ long turn con cronometro y grabacion en el navegador |
| **Writing** | ✅ enunciado, contador de palabras y guardado; **sin correccion de IA** |
| Reading | ❌ nada |

### El simulacro

Es lo que hace que el porcentaje signifique algo. Entrenamiento y simulacro
miden cosas distintas y **no se mezclan**: en entrenamiento repites hasta
clavarlo, asi que ese porcentaje no vale como nota. El informe del test da la
nota del simulacro cuando existe, con su fecha.

Detalles que lo hacen creible: si recargas en mitad del examen se recupera con
el reloj donde estaba, el boton de atras del navegador no te saca, y si se
acaba el tiempo se cierra solo y puntua lo que haya.

Los minutos van en `minutos` dentro de los datos. **Aviso**: en el examen real
Reading y Use of English son un solo papel de 90 minutos; partirlo en dos
mitades de 45 es una estimacion de la academia que Elena tiene que confirmar.

### El reproductor de listening

Dos escuchas, contador a la vista, y **ni rebobinar ni adelantar**: cualquier
salto se deshace. Casi todas las webs de practica ponen una barra de audio
normal y con eso el simulacro deja de medir nada.

`gen-listening.py` genera el audio desde un guion (`listening/*.json`):

    python3 gen-listening.py listening/t1-p2.json --demo          # relleno, sin API
    python3 gen-listening.py listening/t1-p2.json --proveedor elevenlabs

El modo `--demo` escribe tonos, no voz: sirve para probar el reproductor sin
gastar creditos. **El audio que hay ahora en el repositorio es ese relleno**, y
la propia pagina lo dice en rojo. Para generar de verdad hacen falta
`ELEVENLABS_API_KEY` o `AZURE_SPEECH_KEY`, y elegir las voces en el guion.

### El speaking

Todo pasa en el navegador: se graba, te escuchas y te lo descargas. **No se
sube nada**, que es lo unico honesto sin servidor y sin haber pedido permiso
para guardar la voz de nadie, y la pagina lo dice. El microfono se suelta
siempre, tambien al salir de la pantalla.

Pendiente de probar en un aparato de verdad: el contenedor donde se desarrolla
no tiene microfono, asi que el camino real de `getUserMedia` esta verificado
con un aparato simulado.

### El writing

Contador de palabras con los tres estados (corto, en rango 220-260, pasado),
guardado automatico en el navegador y descarga en `.txt` para mandarselo a la
profesora mientras no haya correccion automatica.

## Que le falta para ser un producto

1. **El material de verdad**, con la procedencia resuelta.
2. **Una pantalla de revision para Elena**: ejercicio + respuesta volcada, para
   que marque desacuerdos. Sin esto no se publica.
3. **Parte 1 de Use of English, Reading, Listening y Writing.**
4. **El audio de verdad del listening**, y con el la decision de proveedor y la
   cuenta de pago.
5. **Reading**, las cuatro partes: es lo unico que no tiene nada.
6. **Cuentas y progreso en servidor.** Hoy vive en el navegador.
7. **Correccion de writings con IA** y **nota de speaking**: las dos necesitan
   servidor.
8. **Emparejar alumnos para el speaking** y la agenda de videollamadas.
9. **Cobro.**
10. **Version en euskera.** El prototipo esta solo en castellano.

## Preguntas para Elena

1. ¿De donde salen las frases del material?
2. ¿Confirma el reparto de puntos del CAE?
3. ¿A partir de que porcentaje por destreza considera que un alumno va
   aprobado? Sus años de datos valen mas que cualquier formula.
4. ¿Tiene ya simulacros completos en papel?
5. ¿CAE, B2 First, o los dos?
