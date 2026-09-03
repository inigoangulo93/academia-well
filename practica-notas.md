# Well Online · notas de la practica

Estado: **prototipo en staging**. Vive en `practica.html` + `practica-app.js` +
`practica-data.js` y no esta enlazado desde ninguna pagina publica. Lleva
`noindex` en la cabecera.

## Que material hay

Elena ha pasado cuatro documentos: `GRAMMAR FOLDER`, `VOCABULARY FOLDER` y las
dos claves de respuestas correspondientes. Medido:

| | Ejercicios | Respuestas en la clave |
|---|---|---|
| Grammar folder | 144 (37 temas: tiempos verbales, pasivas, condicionales, estilo indirecto, inversion...) | ~866 |
| Vocabulary folder | 144 (26 unidades) | ~1226 |
| **Total** | **~288** | **~2.100 huecos** |

Y solo hay **cuatro formatos** en todo el material:

| Formato | Cuantos | Como se corrige |
|---|---|---|
| Rellenar con palabra de una caja (preposiciones, phrasal verbs) | 72 | comparacion exacta |
| Open cloze (una palabra por hueco) | 25 | comparacion exacta |
| Word formation (se da la raiz) | 24 | comparacion exacta |
| Transformaciones con palabra clave | 23 + 144 del grammar folder | comparacion con variantes aceptadas |

**Ninguno de los cuatro necesita inteligencia artificial para corregirse.** Son
respuestas cortas y cerradas. El mismo motor que ya corrige el bloque final del
test de nivel sirve para los 2.100 huecos, gratis, sin llamadas a ninguna API y
funcionando sin conexion. La IA hace falta mas adelante, para los *writings*
(que este material no incluye) y para explicar por que una respuesta esta mal.

Las claves parecen alinearse **una linea por ejercicio y en orden**, lo que hace
el volcado automatico viable. No esta confirmado ejercicio a ejercicio, y las
claves tienen erratas (`when they heared`), asi que el volcado tiene que
terminar en una revision humana.

## La pregunta que hay que responder antes de publicar nada

**¿De donde salen estas frases?** El formato (open cloze, word formation, key
word transformation) es el de los examenes de Cambridge y no es de nadie, pero
las frases concretas si pueden venir de libros publicados. Hace falta que la
academia diga si las escribio ella o las copio de manuales.

Mientras no haya respuesta, **el material de Elena no entra en este
repositorio**, que es publico. Los ejercicios que hay en `practica-data.js` los
he escrito yo imitando los formatos, solo para poder probar el reproductor.

Segun la respuesta:

- **Escritas por la academia** → se pueden usar tal cual, tambien en abierto.
- **Copiadas o de origen dudoso** → se usan solo dentro del producto de pago,
  detras de acceso, y para la parte gratuita se escriben ejercicios nuevos con
  el mismo objetivo gramatical. Esto ademas protege el negocio: lo que esta en
  abierto no se puede raspar y montar la competencia.

## Como esta organizado: el curso de Elena, tal cual

La unidad **no es una lista de ejercicios: es el test completo**. Elena da la
clase asi, y la plataforma lo replica:

| Sesion | Receta |
|---|---|
| **A** | 2 vocabulario · 2 gramatica · 1 parte de Use of English · 1 parte de Listening |
| **B** | 2 vocabulario · 2 gramatica · 1 parte de Reading · Speaking |
| ... | alternando A y B hasta agotar las 4 partes de cada destreza = **8 sesiones** |
| **W** | los dos writings |
| | → **informe del test** con el porcentaje por destreza → empieza el test 2 |

Las cinco notas del informe son **las mismas cinco que informa Cambridge**:
Reading, Use of English, Listening, Writing y Speaking. Vocabulario y gramatica
se hacen todas las sesiones y no dan nota: son entrenamiento.

### Cuanto da de si el material de Elena

Midiendo las carpetas contra su propio ciclo (16 de vocabulario y 16 de
gramatica por test):

| | Tiene | Da para |
|---|---|---|
| Vocabulario (caja de palabras) | 72 | **4,5 tests** |
| Gramatica | 144 | **9 tests** |
| Use of English partes 2, 3 y 4 | 72 | 23 tests |
| Use of English parte 1 (multiple-choice cloze) | 0 | — |
| Reading, Listening, Writing | 0 | — |

O sea: **el cuello de botella es el vocabulario, y da para un curso entero de
4-5 tests**. Lo que falta por completo es la parte 1 de Use of English, todo
Reading, todo Listening y los writings.

### Como esta en los datos

`practica-data.js` declara el examen, las destrezas, los tests con sus sesiones
y, dentro de cada sesion, los bloques por destreza. Los ejercicios viven en un
unico saco (`ejercicios`) y las sesiones los referencian por id, asi que un
ejercicio se puede reutilizar sin duplicarlo.

Un bloque sin `ejercicios` sale igualmente en la receta de la sesion, marcado
como pendiente. Se ve la clase entera aunque falte material, que es justo lo
que hay que enseñar a Elena.

**Anadir el B2 First es escribir datos, no codigo**: otra lista de destrezas y
otro reparto de partes.

### Los desbloqueos

Una sesion se abre al dominar el 70 % de la anterior (`dominioParaAbrir`), el
mismo criterio del test de nivel. Las sesiones sin material salen como
"pronto" y no bloquean a la siguiente.

### El informe

Porcentaje por destreza sobre lo hecho, con barra y el detalle en huecos.

**Este producto es 100 % online: el alumno no pisa la academia.** Por eso las
dos destrezas que no son de respuesta cerrada no se mandan a clase:

- **Writing** lo corrige la IA dentro de la plataforma.
- **Speaking** se practica y se evalua **por videollamada**.

Quien corrige cada una va en los datos (`correccion: 'ia' | 'video'`), no en el
codigo.

**No se inventa una nota de la escala de Cambridge**, y el informe lo dice: esa
conversion no es publica.

## Que hace ya el prototipo

- Cuatro ejercicios de los cuatro formatos, con correccion al momento.
- Marca cada hueco en verde o rojo y ensena la solucion buena al lado.
- Acepta variantes (`have not been to` / `haven't been to`) y al ensenar la
  solucion no repite la misma respuesta escrita de dos maneras.
- Boton para repetir **solo los fallos**, sin perder los aciertos.
- Guarda el progreso en el navegador: mejor marca por ejercicio y ultimo intento.
- Enter salta al hueco siguiente; en el ultimo, corrige.
- Eventos de seguimiento (`practica_ejercicio_abierto`, `..._corregido`,
  `practica_etapa_abierta`, `practica_insignia`).
- Aviso flotante cuando se gana una insignia o se abre una etapa.

## Que le falta para ser un producto

1. **El material de verdad**, con la pregunta de arriba resuelta.
2. **Una pantalla de revision para Elena**: ejercicio + respuesta que hemos
   volcado, para que marque los desacuerdos. Sin esto no se publica.
3. **Cuentas y progreso en servidor.** Hoy el progreso vive en el navegador: se
   pierde al cambiar de movil y no lo ve la profesora. Es el primer punto en el
   que esta web deja de poder ser HTML estatico, y conviene retrasarlo hasta
   saber si los alumnos usan la practica.
4. **Correccion de writings con IA** y sesiones 1-1. Necesita servidor, clave de
   API y una decision de coste por alumno.
5. **Cobro.**
6. **Version en euskera.** El prototipo esta solo en castellano.

## Orden que propongo

Primero lo que se puede probar sin infraestructura: material real cargado,
pantalla de revision, y la practica delante de alumnos actuales para ver si la
usan. Cuentas, pagos e IA solo despues, y solo si la usan.
