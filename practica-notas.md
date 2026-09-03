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

## Como esta organizado

La pagina de entrada es un **panel del alumno**, no una lista de ejercicios.

**Quien es.** Saluda por su nombre y por la hora del dia ("Buenas tardes,
Juan"). El nombre sale del test de nivel: al escribirlo para el certificado o
para el WhatsApp, `test-app.js` lo guarda en `well_nombre`. Si llega sin
nombre, el panel se lo pregunta en una linea. El nivel viene por el mismo
camino, en `well_nivel`, y se ensena como chapa junto al saludo. Sin test, le
ofrece hacerlo.

**Que lleva hecho.** Un anillo con el porcentaje dominado del material
cargado, con el detalle en huecos ("16 de 52"). Debajo: ejercicios perfectos,
etapas completas y cuantos ejercicios le quedan ahora mismo en lo que tiene
abierto.

**Que ha hecho estos dias.** Una tira de siete casillas, una por dia, con los
dias practicados en carmin y el de hoy marcado. Al lado, la racha en numero.

**Que va a conseguir a continuacion.** La insignia mas cercana, con su barra y
lo que le falta ("Cinco redondos · 2/5"). Es el gancho para la siguiente
sesion.

**Por donde sigue.** Tarjeta "Continua por aqui" con el siguiente ejercicio
pendiente, a un clic, para que nadie tenga que decidir por donde va.

**El camino entero**, en dos rutas:

- *Use of English*, 24 series (las del VOCABULARY FOLDER).
- *Gramatica*, 8 etapas que agrupan los 31 temas del GRAMMAR FOLDER.

La etapa en curso lleva la marca "estas aqui". Una etapa se abre al dominar el
70 % de la anterior (`dominioParaAbrir` en `practica-data.js`), el mismo
criterio que ya usa el test de nivel: no se avanza sin dominar lo de atras. Y
la etapa bloqueada **dice exactamente lo que falta**: "Termina la Serie 1: te
faltan 5 aciertos". Un candado que no explica como abrirse no motiva a nadie.

Las etapas cuyo material aun no esta volcado salen como "pronto", no como
bloqueadas: se ve el tamano real del camino sin prometer lo que todavia no
existe.

**Once insignias**, con barra de progreso las que llevan cuenta: primer
ejercicio, uno perfecto, cinco perfectos, rachas de 3, 7 y 30 dias, 50, 100 y
500 aciertos, una etapa completa y cinco. Las pendientes se ven en gris con lo
que falta, para que se sepa a que se aspira.

**La celebracion.** Cada insignia y cada etapa desbloqueada abre una ventana
con el icono grande y un rebote. Si caen varias a la vez se encolan. Respeta
`prefers-reduced-motion`.

Hay **dos series cargadas** (52 huecos), suficientes para ver el bloqueo, el
desbloqueo, las insignias y la celebracion funcionando de verdad.

## Navegacion e interfaz

**La cabecera es la de la web**, no una propia: mismo logotipo (la ficha
carmin con la W blanca, no el trazo suelto), mismo fondo, misma sombra al
bajar, mismos tamanos. Al lado del logo, "Well Online" como marca del
producto.

**A la derecha, el usuario.** Chapa con inicial y nombre que abre un menu con
lo que hay ("Cambiar nombre", "Repetir el test de nivel", "Volver a la web") y
lo que habra, marcado como *pronto*: **Ajustes** y **Mis informes**. Estan
desactivados a proposito: se ve donde van a vivir sin fingir que existen.

Tres pantallas y una sola jerarquia: **panel → etapa → ejercicio**.

- **Migas clicables** arriba de cada pantalla ("Tu camino / Serie 1").
- **La cabecera dice a donde vuelve**: "‹ Serie 1" desde un ejercicio, "‹ Tu
  camino" desde una etapa, y el titulo del centro cambia con la pantalla.
- El **boton del navegador** hace lo mismo que las migas: cada pantalla tiene
  su URL con almohadilla, asi que se puede compartir el enlace de un ejercicio.
- **Las etapas son botones de verdad**, no divs con un click encima: se llega a
  ellas con el tabulador y las cerradas van `disabled`. Foco visible en todo.
  El menu y las ventanas se cierran con Escape.
- **Los botones miden lo que miden.** A ancho completo solo en movil. En
  escritorio, ancho natural, el secundario a la izquierda y el principal a la
  derecha.

## Composicion del panel

Lo primero es lo que hay que hacer, no lo ya conseguido:

1. Saludo, nivel y en que punto del camino esta.
2. **Continua por aqui**: la accion, en azul, arriba del todo.
3. **El camino**, dibujado como un mapa: un rail vertical con un nodo por
   etapa. Verde con el visto las hechas, azul con halo la que toca ahora,
   candado la bloqueada y nodo de trazo discontinuo las que estan por volcar.
   El rail se colorea hasta donde has llegado.

   **Se recorre por bloques.** Las 24 series de Use of English van en cuatro
   tramos de seis (`porTramo` en `practica-data.js`) y solo se abre el tramo en
   el que estas; los demas son una linea que se despliega al tocarla, y lo que
   abras o cierres se recuerda. Cada tramo termina en un **nodo de meta**: 🏁
   mientras falta alguna etapa, 🏆 y en verde cuando estan las seis al 100 %.
   Asi el camino entero cabe en una pantalla y hay un hito cerca al que llegar,
   en vez de veinticuatro filas iguales.

   Los pasos lejanos van comprimidos y sin subtitulo, porque en Use of English
   ese subtitulo es la misma frase repetida; en gramatica si lo llevan, porque
   ahi el subtitulo son los temas de verdad.
4. A la derecha, en columna fija: **anillo de dominio** con perfectos, etapas y
   lo que queda; **racha** con la tira de siete dias; e **insignias en
   pequeno**: la cuenta, seis fichas y la proxima con su barra.

Las insignias completas viven en su propia ventana ("Ver todas"). Motivan,
pero no son lo que el alumno viene a hacer, asi que no ocupan medio panel.

En movil el orden es el mismo, en una columna: saludo, seguir, cifras, camino.

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
