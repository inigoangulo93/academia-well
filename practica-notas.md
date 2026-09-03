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

La pagina de entrada es un **panel del alumno**, no una lista de ejercicios:

- **Su nivel**, leido del test de nivel. Al terminar el test, `test-app.js`
  guarda `well_nivel` en el navegador y la practica lo recoge. Si no ha hecho
  el test, le ofrece hacerlo.
- **Racha de dias seguidos** y **aciertos acumulados**.
- **Continua por aqui**: el siguiente ejercicio pendiente, a un clic.
- **El camino entero**, en dos rutas:
  - *Use of English*, 24 series (las del VOCABULARY FOLDER).
  - *Gramatica*, 8 etapas que agrupan los 31 temas del GRAMMAR FOLDER.
- **Insignias**: primer ejercicio, ejercicio perfecto, racha de 3 y de 7 dias,
  100 aciertos, etapa entera.

**Los desbloqueos.** Una etapa se abre cuando se domina el 70 % de la anterior
(`dominioParaAbrir` en `practica-data.js`). El criterio es el mismo que ya usa
el test de nivel: no se avanza hasta dominar lo de atras. Las etapas cuyo
material aun no esta volcado salen como "pronto", no como bloqueadas: se ve el
tamano real del camino sin prometer lo que todavia no existe.

Hay **dos series cargadas** (52 huecos), suficientes para ver el bloqueo, el
desbloqueo y la insignia de etapa completa funcionando de verdad.

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
