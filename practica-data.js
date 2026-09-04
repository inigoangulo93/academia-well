/* Well Online · el curso, tal y como lo da la academia (PROTOTIPO)
 *
 * La unidad no es "una lista de ejercicios": es **el test completo**. Se llega
 * a el por sesiones con receta fija, alternando dos tipos, tal y como Elena da
 * la clase:
 *
 *   Sesion A · 2 vocabulario · 2 gramatica · 1 parte de Use of English · 1 parte de Listening
 *   Sesion B · 2 vocabulario · 2 gramatica · 1 parte de Reading        · Speaking
 *   ... alternando hasta agotar las 4 partes de cada destreza (8 sesiones)
 *   Sesion W · los dos writings
 *   -> informe del test con el porcentaje por destreza
 *   -> empieza el test siguiente
 *
 * Las cinco notas que se informan son las mismas que informa Cambridge:
 * Reading, Use of English, Listening, Writing y Speaking.
 *
 * OJO: los ejercicios con contenido los he escrito yo (Claude) imitando los
 * formatos del material de la academia. NO son el material de Elena. Ver
 * well-online.md.
 *
 * Un bloque sin `ejercicios` esta pendiente de volcar: se ensena en la receta
 * de la sesion para que se vea la forma real de la clase.
 */
window.WELL_PRACTICA = {
  version: 3,
  dominioParaAbrir: 0.7,

  /* Los cuatro niveles de la plataforma. Solo C1 tiene curso escrito; los
     otros tres estan declarados para que la aplicacion sepa que existen y
     pueda decir la verdad cuando a un alumno le toca uno que aun no esta,
     en vez de servirle el de C1 como si fuera el suyo.

     Cada nivel es un examen distinto de Cambridge, con su propia estructura:
     el B2 First tiene 7 partes y 52 preguntas en hora y cuarto, y el C1
     Advanced 8 partes y 56 en hora y media. No son el mismo curso con las
     frases mas faciles. */
  niveles: [
    { id: 'a2', nombre: 'A2 Key', sigla: 'KET', mcer: 'A2', curso: false },
    { id: 'b1', nombre: 'B1 Preliminary', sigla: 'PET', mcer: 'B1', curso: false },

    /* B2 First. La diferencia con el C1 no es que las frases sean mas faciles:
       es otro examen. Su Reading & Use of English tiene SIETE partes y 52
       preguntas en hora y cuarto, no ocho y 56 en hora y media.

         partes 1-4, Use of English   8+8+8+6 = 30   iguales que en el C1
         partes 5-7, Reading          6+6+10  = 22

       El C1 mete ademas una parte 6 de cross-text matching, 4 preguntas, que
       en el B2 no existe: por eso el suyo suma 26 de Reading y no 22. */
    { id: 'b2', nombre: 'B2 First', sigla: 'FCE', mcer: 'B2', curso: true,
      papeles: [
        { id: 'ruoe', nombre: 'Reading & Use of English', destrezas: ['use', 'reading'], minutos: 75 },
        { id: 'listening', nombre: 'Listening', destrezas: ['listening'], minutos: 40 }
      ],
      forma: { ruoe: { partes: 7, preguntas: 52 }, listening: { partes: 4, preguntas: 30 } },
      palabras: [140, 190] },

    { id: 'c1', nombre: 'C1 Advanced', sigla: 'CAE', mcer: 'C1', curso: true,
      papeles: [
        { id: 'ruoe', nombre: 'Reading & Use of English', destrezas: ['use', 'reading'], minutos: 90 },
        { id: 'listening', nombre: 'Listening', destrezas: ['listening'], minutos: 40 }
      ],
      forma: { ruoe: { partes: 8, preguntas: 56 }, listening: { partes: 4, preguntas: 30 } },
      palabras: [220, 260] },
  ],

  /* Queda por compatibilidad: hasta que hubo un solo curso, media pagina leia
     de aqui. Lo que manda ahora es 'niveles': cada uno trae sus papeles, su
     forma y su recuento de palabras, y el curso que se sirve sale de ahi. */
  examen: { id: 'cae', nombre: 'C1 Advanced', sigla: 'CAE', mcer: 'C1' },

  /* Minutos de cada simulacro. OJO: en el examen real, Reading y Use of
     English son UN SOLO papel de 90 minutos; este reparto es una estimacion de
     la academia para poder cronometrar cada mitad por separado.
     Elena tiene que confirmarlo. */


  /* Las cinco que puntuan son las que informa Cambridge. Vocabulario y
     gramatica son entrenamiento: se hacen todas las sesiones y no dan nota.
     `correccion` dice quien corrige lo que no es de respuesta cerrada: la IA
     dentro de la plataforma, o una sesion de video. Este producto es 100 %
     online: el alumno no pisa la academia. */
  destrezas: [
    { id: 'use',         nombre: 'Use of English', puntua: true },
    { id: 'reading',     nombre: 'Reading',        puntua: true },
    { id: 'listening',   nombre: 'Listening',      puntua: true },
    { id: 'writing',     nombre: 'Writing',        puntua: true, correccion: 'ia' },
    { id: 'speaking',    nombre: 'Speaking',       puntua: true, correccion: 'video' },
    { id: 'vocabulario', nombre: 'Vocabulario',    puntua: false },
    { id: 'gramatica',   nombre: 'Gramática',      puntua: false }
  ],

  tests: [
    {
      id: 'b2t1', nivel: 'b2',
      titulo: 'Test 1',
      sesiones: [
        { id: 'b2t1-s1', n: 1, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t1-voc1', 'b2t1-voc2'] },
          { destreza: 'gramatica', ejercicios: ['b2t1-gram1', 'b2t1-gram2'] },
          { destreza: 'use', parte: 1, tarea: 'Multiple-choice cloze', ejercicios: ['b2t1-use1'] },
          { destreza: 'listening', parte: 1, tarea: 'Ocho extractos', ejercicios: ['b2t1-lis1'] }
        ] },
        { id: 'b2t1-s2', n: 2, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t1-voc3', 'b2t1-voc4'] },
          { destreza: 'gramatica', ejercicios: ['b2t1-gram3', 'b2t1-gram4'] },
          { destreza: 'reading', parte: 5, tarea: 'Multiple choice', ejercicios: ['b2t1-read5'] },
          { destreza: 'speaking', tarea: 'Parte 2', ejercicios: ['b2t1-speak1'] }
        ] },
        { id: 'b2t1-s3', n: 3, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t1-voc5', 'b2t1-voc6'] },
          { destreza: 'gramatica', ejercicios: ['b2t1-gram5', 'b2t1-gram6'] },
          { destreza: 'use', parte: 2, tarea: 'Open cloze', ejercicios: ['b2t1-use2a', 'b2t1-use2b'] },
          { destreza: 'listening', parte: 2, tarea: 'Frases incompletas', ejercicios: ['b2t1-lis2'] }
        ] },
        { id: 'b2t1-s4', n: 4, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t1-voc7', 'b2t1-voc8'] },
          { destreza: 'gramatica', ejercicios: ['b2t1-gram7', 'b2t1-gram8'] },
          { destreza: 'reading', parte: 6, tarea: 'Gapped text', ejercicios: ['b2t1-read6'] },
          { destreza: 'speaking', tarea: 'Parte 3', ejercicios: ['b2t1-speak3'] }
        ] },
        { id: 'b2t1-s5', n: 5, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t1-voc9', 'b2t1-voc10'] },
          { destreza: 'gramatica', ejercicios: ['b2t1-gram9', 'b2t1-gram10'] },
          { destreza: 'use', parte: 3, tarea: 'Word formation', ejercicios: ['b2t1-use3'] },
          { destreza: 'listening', parte: 3, tarea: 'Cinco hablantes', ejercicios: ['b2t1-lis3'] }
        ] },
        { id: 'b2t1-s6', n: 6, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t1-voc11', 'b2t1-voc12'] },
          { destreza: 'gramatica', ejercicios: ['b2t1-gram11', 'b2t1-gram12'] },
          { destreza: 'reading', parte: 7, tarea: 'Multiple matching', ejercicios: ['b2t1-read7'] },
          { destreza: 'speaking', tarea: 'Parte 4', ejercicios: ['b2t1-speak4'] }
        ] },
        { id: 'b2t1-s7', n: 7, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t1-voc13', 'b2t1-voc14'] },
          { destreza: 'gramatica', ejercicios: ['b2t1-gram13', 'b2t1-gram14'] },
          { destreza: 'use', parte: 4, tarea: 'Key word transformation', ejercicios: ['b2t1-use4a', 'b2t1-use4b'] },
          { destreza: 'listening', parte: 4, tarea: 'Entrevista', ejercicios: ['b2t1-lis4'] }
        ] },
        { id: 'b2t1-s8', n: 8, tipo: 'W', bloques: [
          { destreza: 'writing', parte: 1, tarea: 'Essay', ejercicios: ['b2t1-write1'] },
          { destreza: 'writing', parte: 2, tarea: 'A elegir', ejercicios: ['b2t1-write2'] }
        ] }
      ]
    },
    {
      id: 'b2t2', nivel: 'b2',
      titulo: 'Test 2',
      sesiones: [
        { id: 'b2t2-s1', n: 1, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t2-voc1', 'b2t2-voc2'] },
          { destreza: 'gramatica', ejercicios: ['b2t2-gram1', 'b2t2-gram2'] },
          { destreza: 'use', parte: 1, tarea: 'Multiple-choice cloze', ejercicios: ['b2t2-use1'] },
          { destreza: 'listening', parte: 1, tarea: 'Ocho extractos', ejercicios: ['b2t2-lis1'] }
        ] },
        { id: 'b2t2-s2', n: 2, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t2-voc3', 'b2t2-voc4'] },
          { destreza: 'gramatica', ejercicios: ['b2t2-gram3', 'b2t2-gram4'] },
          { destreza: 'reading', parte: 5, tarea: 'Multiple choice', ejercicios: ['b2t2-read5'] },
          { destreza: 'speaking', tarea: 'Parte 2', ejercicios: ['b2t2-speak1'] }
        ] },
        { id: 'b2t2-s3', n: 3, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t2-voc5', 'b2t2-voc6'] },
          { destreza: 'gramatica', ejercicios: ['b2t2-gram5', 'b2t2-gram6'] },
          { destreza: 'use', parte: 2, tarea: 'Open cloze', ejercicios: ['b2t2-use2a', 'b2t2-use2b'] },
          { destreza: 'listening', parte: 2, tarea: 'Frases incompletas', ejercicios: ['b2t2-lis2'] }
        ] },
        { id: 'b2t2-s4', n: 4, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t2-voc7', 'b2t2-voc8'] },
          { destreza: 'gramatica', ejercicios: ['b2t2-gram7', 'b2t2-gram8'] },
          { destreza: 'reading', parte: 6, tarea: 'Gapped text', ejercicios: ['b2t2-read6'] },
          { destreza: 'speaking', tarea: 'Parte 3', ejercicios: ['b2t2-speak3'] }
        ] },
        { id: 'b2t2-s5', n: 5, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t2-voc9', 'b2t2-voc10'] },
          { destreza: 'gramatica', ejercicios: ['b2t2-gram9', 'b2t2-gram10'] },
          { destreza: 'use', parte: 3, tarea: 'Word formation', ejercicios: ['b2t2-use3'] },
          { destreza: 'listening', parte: 3, tarea: 'Cinco hablantes', ejercicios: ['b2t2-lis3'] }
        ] },
        { id: 'b2t2-s6', n: 6, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t2-voc11', 'b2t2-voc12'] },
          { destreza: 'gramatica', ejercicios: ['b2t2-gram11', 'b2t2-gram12'] },
          { destreza: 'reading', parte: 7, tarea: 'Multiple matching', ejercicios: ['b2t2-read7'] },
          { destreza: 'speaking', tarea: 'Parte 4', ejercicios: ['b2t2-speak4'] }
        ] },
        { id: 'b2t2-s7', n: 7, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t2-voc13', 'b2t2-voc14'] },
          { destreza: 'gramatica', ejercicios: ['b2t2-gram13', 'b2t2-gram14'] },
          { destreza: 'use', parte: 4, tarea: 'Key word transformation', ejercicios: ['b2t2-use4a', 'b2t2-use4b'] },
          { destreza: 'listening', parte: 4, tarea: 'Entrevista', ejercicios: ['b2t2-lis4'] }
        ] },
        { id: 'b2t2-s8', n: 8, tipo: 'W', bloques: [
          { destreza: 'writing', parte: 1, tarea: 'Essay', ejercicios: ['b2t2-write1'] },
          { destreza: 'writing', parte: 2, tarea: 'A elegir', ejercicios: ['b2t2-write2'] }
        ] }
      ]
    },
    {
      id: 'b2t3', nivel: 'b2',
      titulo: 'Test 3',
      sesiones: [
        { id: 'b2t3-s1', n: 1, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t3-voc1', 'b2t3-voc2'] },
          { destreza: 'gramatica', ejercicios: ['b2t3-gram1', 'b2t3-gram2'] },
          { destreza: 'use', parte: 1, tarea: 'Multiple-choice cloze', ejercicios: ['b2t3-use1'] },
          { destreza: 'listening', parte: 1, tarea: 'Ocho extractos', ejercicios: ['b2t3-lis1'] }
        ] },
        { id: 'b2t3-s2', n: 2, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t3-voc3', 'b2t3-voc4'] },
          { destreza: 'gramatica', ejercicios: ['b2t3-gram3', 'b2t3-gram4'] },
          { destreza: 'reading', parte: 5, tarea: 'Multiple choice', ejercicios: ['b2t3-read5'] },
          { destreza: 'speaking', tarea: 'Parte 2', ejercicios: ['b2t3-speak1'] }
        ] },
        { id: 'b2t3-s3', n: 3, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t3-voc5', 'b2t3-voc6'] },
          { destreza: 'gramatica', ejercicios: ['b2t3-gram5', 'b2t3-gram6'] },
          { destreza: 'use', parte: 2, tarea: 'Open cloze', ejercicios: ['b2t3-use2a', 'b2t3-use2b'] },
          { destreza: 'listening', parte: 2, tarea: 'Frases incompletas', ejercicios: ['b2t3-lis2'] }
        ] },
        { id: 'b2t3-s4', n: 4, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t3-voc7', 'b2t3-voc8'] },
          { destreza: 'gramatica', ejercicios: ['b2t3-gram7', 'b2t3-gram8'] },
          { destreza: 'reading', parte: 6, tarea: 'Gapped text', ejercicios: ['b2t3-read6'] },
          { destreza: 'speaking', tarea: 'Parte 3', ejercicios: ['b2t3-speak3'] }
        ] },
        { id: 'b2t3-s5', n: 5, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t3-voc9', 'b2t3-voc10'] },
          { destreza: 'gramatica', ejercicios: ['b2t3-gram9', 'b2t3-gram10'] },
          { destreza: 'use', parte: 3, tarea: 'Word formation', ejercicios: ['b2t3-use3'] },
          { destreza: 'listening', parte: 3, tarea: 'Cinco hablantes', ejercicios: ['b2t3-lis3'] }
        ] },
        { id: 'b2t3-s6', n: 6, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t3-voc11', 'b2t3-voc12'] },
          { destreza: 'gramatica', ejercicios: ['b2t3-gram11', 'b2t3-gram12'] },
          { destreza: 'reading', parte: 7, tarea: 'Multiple matching', ejercicios: ['b2t3-read7'] },
          { destreza: 'speaking', tarea: 'Parte 4', ejercicios: ['b2t3-speak4'] }
        ] },
        { id: 'b2t3-s7', n: 7, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t3-voc13', 'b2t3-voc14'] },
          { destreza: 'gramatica', ejercicios: ['b2t3-gram13', 'b2t3-gram14'] },
          { destreza: 'use', parte: 4, tarea: 'Key word transformation', ejercicios: ['b2t3-use4a', 'b2t3-use4b'] },
          { destreza: 'listening', parte: 4, tarea: 'Entrevista', ejercicios: ['b2t3-lis4'] }
        ] },
        { id: 'b2t3-s8', n: 8, tipo: 'W', bloques: [
          { destreza: 'writing', parte: 1, tarea: 'Essay', ejercicios: ['b2t3-write1'] },
          { destreza: 'writing', parte: 2, tarea: 'A elegir', ejercicios: ['b2t3-write2'] }
        ] }
      ]
    },
    {
      id: 'b2t4', nivel: 'b2',
      titulo: 'Test 4',
      sesiones: [
        { id: 'b2t4-s1', n: 1, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t4-voc1', 'b2t4-voc2'] },
          { destreza: 'gramatica', ejercicios: ['b2t4-gram1', 'b2t4-gram2'] },
          { destreza: 'use', parte: 1, tarea: 'Multiple-choice cloze', ejercicios: ['b2t4-use1'] },
          { destreza: 'listening', parte: 1, tarea: 'Ocho extractos', ejercicios: ['b2t4-lis1'] }
        ] },
        { id: 'b2t4-s2', n: 2, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t4-voc3', 'b2t4-voc4'] },
          { destreza: 'gramatica', ejercicios: ['b2t4-gram3', 'b2t4-gram4'] },
          { destreza: 'reading', parte: 5, tarea: 'Multiple choice', ejercicios: ['b2t4-read5'] },
          { destreza: 'speaking', tarea: 'Parte 2', ejercicios: ['b2t4-speak1'] }
        ] },
        { id: 'b2t4-s3', n: 3, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t4-voc5', 'b2t4-voc6'] },
          { destreza: 'gramatica', ejercicios: ['b2t4-gram5', 'b2t4-gram6'] },
          { destreza: 'use', parte: 2, tarea: 'Open cloze', ejercicios: ['b2t4-use2a', 'b2t4-use2b'] },
          { destreza: 'listening', parte: 2, tarea: 'Frases incompletas', ejercicios: ['b2t4-lis2'] }
        ] },
        { id: 'b2t4-s4', n: 4, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t4-voc7', 'b2t4-voc8'] },
          { destreza: 'gramatica', ejercicios: ['b2t4-gram7', 'b2t4-gram8'] },
          { destreza: 'reading', parte: 6, tarea: 'Gapped text', ejercicios: ['b2t4-read6'] },
          { destreza: 'speaking', tarea: 'Parte 3', ejercicios: ['b2t4-speak3'] }
        ] },
        { id: 'b2t4-s5', n: 5, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t4-voc9', 'b2t4-voc10'] },
          { destreza: 'gramatica', ejercicios: ['b2t4-gram9', 'b2t4-gram10'] },
          { destreza: 'use', parte: 3, tarea: 'Word formation', ejercicios: ['b2t4-use3'] },
          { destreza: 'listening', parte: 3, tarea: 'Cinco hablantes', ejercicios: ['b2t4-lis3'] }
        ] },
        { id: 'b2t4-s6', n: 6, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t4-voc11', 'b2t4-voc12'] },
          { destreza: 'gramatica', ejercicios: ['b2t4-gram11', 'b2t4-gram12'] },
          { destreza: 'reading', parte: 7, tarea: 'Multiple matching', ejercicios: ['b2t4-read7'] },
          { destreza: 'speaking', tarea: 'Parte 4', ejercicios: ['b2t4-speak4'] }
        ] },
        { id: 'b2t4-s7', n: 7, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['b2t4-voc13', 'b2t4-voc14'] },
          { destreza: 'gramatica', ejercicios: ['b2t4-gram13', 'b2t4-gram14'] },
          { destreza: 'use', parte: 4, tarea: 'Key word transformation', ejercicios: ['b2t4-use4a', 'b2t4-use4b'] },
          { destreza: 'listening', parte: 4, tarea: 'Entrevista', ejercicios: ['b2t4-lis4'] }
        ] },
        { id: 'b2t4-s8', n: 8, tipo: 'W', bloques: [
          { destreza: 'writing', parte: 1, tarea: 'Essay', ejercicios: ['b2t4-write1'] },
          { destreza: 'writing', parte: 2, tarea: 'A elegir', ejercicios: ['b2t4-write2'] }
        ] }
      ]
    },
    {
      id: 't1', nivel: 'c1',
      titulo: 'Test 1',
      sesiones: [
        { id: 't1-s1', n: 1, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['v1-caja', 'v2-caja'] },
          { destreza: 'gramatica', ejercicios: ['g1-transf', 'g2-transf'] },
          { destreza: 'use', parte: 1, tarea: 'Multiple-choice cloze', ejercicios: ['v1-opcion'] },
          { destreza: 'listening', parte: 1, tarea: 'Tres extractos', ejercicios: ['t1-lis1'] }
        ]},
        { id: 't1-s2', n: 2, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['v3-caja', 'v4-caja'] },
          { destreza: 'gramatica', ejercicios: ['g3-transf', 'g4-transf'] },
          { destreza: 'reading', parte: 5, tarea: 'Multiple choice', ejercicios: ['t1-read5'] },
          { destreza: 'speaking', tarea: 'Partes 1 y 2', ejercicios: ['v1-speaking'] }
        ]},
        { id: 't1-s3', n: 3, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['v3-cloze', 'v3-formacion'] },
          { destreza: 'gramatica', ejercicios: ['g5-transf', 'g6-transf'] },
          { destreza: 'use', parte: 2, tarea: 'Open cloze', ejercicios: ['v1-cloze', 'v2-cloze'] },
          { destreza: 'listening', parte: 2, tarea: 'Frases incompletas', ejercicios: ['t1-lis2'] }
        ]},
        { id: 't1-s4', n: 4, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['v5-caja', 'v4-formacion'] },
          { destreza: 'gramatica', ejercicios: ['g7-transf', 'g8-transf'] },
          { destreza: 'reading', parte: 6, tarea: 'Cross-text matching', ejercicios: ['t1-read6'] },
          { destreza: 'speaking', tarea: 'Parte 3', ejercicios: ['t1-speak3'] }
        ]},
        { id: 't1-s5', n: 5, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['v4-cloze', 'v6-caja'] },
          { destreza: 'gramatica', ejercicios: ['g9-transf', 'g10-transf'] },
          { destreza: 'use', parte: 3, tarea: 'Word formation', ejercicios: ['v1-formacion'] },
          { destreza: 'listening', parte: 3, tarea: 'Conversación larga', ejercicios: ['t1-lis3'] }
        ]},
        { id: 't1-s6', n: 6, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['v5-cloze', 'v5-formacion'] },
          { destreza: 'gramatica', ejercicios: ['g11-transf', 'g12-transf'] },
          { destreza: 'reading', parte: 7, tarea: 'Gapped text', ejercicios: ['t1-read7'] },
          { destreza: 'speaking', tarea: 'Parte 4', ejercicios: ['t1-speak4'] }
        ]},
        { id: 't1-s7', n: 7, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['v7-caja', 'v6-formacion'] },
          { destreza: 'gramatica', ejercicios: ['g13-transf', 'g14-transf'] },
          { destreza: 'use', parte: 4, tarea: 'Key word transformation', ejercicios: ['v1-transf', 'v2-transf'] },
          { destreza: 'listening', parte: 4, tarea: 'Multiple matching', ejercicios: ['t1-lis4'] }
        ]},
        { id: 't1-s8', n: 8, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['v6-cloze', 'v8-caja'] },
          { destreza: 'gramatica', ejercicios: ['g15-transf', 'g16-transf'] },
          { destreza: 'reading', parte: 8, tarea: 'Multiple matching', ejercicios: ['t1-read8'] },
          { destreza: 'speaking', tarea: 'Repaso', ejercicios: ['t1-speak-repaso'] }
        ]},
        { id: 't1-s9', n: 9, tipo: 'W', bloques: [
          { destreza: 'writing', parte: 1, tarea: 'Essay (obligatorio)', ejercicios: ['v1-writing1'] },
          { destreza: 'writing', parte: 2, tarea: 'A elegir', ejercicios: ['v1-writing2'] }
        ]}
      ]
    },
    {
      id: 't2', nivel: 'c1', titulo: 'Test 2',
      sesiones: [
        { id: 't2-s1', n: 1, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t2-voc1', 't2-voc2'] },
          { destreza: 'gramatica', ejercicios: ['t2-gram1', 't2-gram2'] },
          { destreza: 'use', parte: 1, tarea: 'Multiple-choice cloze', ejercicios: ['t2-use1'] },
          { destreza: 'listening', parte: 1, tarea: 'Tres extractos', ejercicios: ['t2-lis1'] }
        ] },
        { id: 't2-s2', n: 2, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t2-voc3', 't2-voc4'] },
          { destreza: 'gramatica', ejercicios: ['t2-gram3', 't2-gram4'] },
          { destreza: 'reading', parte: 5, tarea: 'Multiple choice', ejercicios: ['t2-read5'] },
          { destreza: 'speaking', tarea: 'Partes 1 y 2', ejercicios: ['t2-speak1'] }
        ] },
        { id: 't2-s3', n: 3, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t2-voc5', 't2-voc6'] },
          { destreza: 'gramatica', ejercicios: ['t2-gram5', 't2-gram6'] },
          { destreza: 'use', parte: 2, tarea: 'Open cloze', ejercicios: ['t2-use2a', 't2-use2b'] },
          { destreza: 'listening', parte: 2, tarea: 'Frases incompletas', ejercicios: ['t2-lis2'] }
        ] },
        { id: 't2-s4', n: 4, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t2-voc7', 't2-voc8'] },
          { destreza: 'gramatica', ejercicios: ['t2-gram7', 't2-gram8'] },
          { destreza: 'reading', parte: 6, tarea: 'Cross-text matching', ejercicios: ['t2-read6'] },
          { destreza: 'speaking', tarea: 'Parte 3', ejercicios: ['t2-speak3'] }
        ] },
        { id: 't2-s5', n: 5, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t2-voc9', 't2-voc10'] },
          { destreza: 'gramatica', ejercicios: ['t2-gram9', 't2-gram10'] },
          { destreza: 'use', parte: 3, tarea: 'Word formation', ejercicios: ['t2-use3'] },
          { destreza: 'listening', parte: 3, tarea: 'Conversación larga', ejercicios: ['t2-lis3'] }
        ] },
        { id: 't2-s6', n: 6, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t2-voc11', 't2-voc12'] },
          { destreza: 'gramatica', ejercicios: ['t2-gram11', 't2-gram12'] },
          { destreza: 'reading', parte: 7, tarea: 'Gapped text', ejercicios: ['t2-read7'] },
          { destreza: 'speaking', tarea: 'Parte 4', ejercicios: ['t2-speak4'] }
        ] },
        { id: 't2-s7', n: 7, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t2-voc13', 't2-voc14'] },
          { destreza: 'gramatica', ejercicios: ['t2-gram13', 't2-gram14'] },
          { destreza: 'use', parte: 4, tarea: 'Key word transformation', ejercicios: ['t2-use4a', 't2-use4b'] },
          { destreza: 'listening', parte: 4, tarea: 'Multiple matching', ejercicios: ['t2-lis4'] }
        ] },
        { id: 't2-s8', n: 8, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t2-voc15', 't2-voc16'] },
          { destreza: 'gramatica', ejercicios: ['t2-gram15', 't2-gram16'] },
          { destreza: 'reading', parte: 8, tarea: 'Multiple matching', ejercicios: ['t2-read8'] },
          { destreza: 'speaking', tarea: 'Repaso', ejercicios: ['t2-speakr'] }
        ] },
        { id: 't2-s9', n: 9, tipo: 'W', bloques: [
          { destreza: 'writing', parte: 1, tarea: 'Essay', ejercicios: ['t2-write1'] },
          { destreza: 'writing', parte: 2, tarea: 'A elegir', ejercicios: ['t2-write2'] }
        ] }
      ]
    },
    {
      id: 't3', nivel: 'c1', titulo: 'Test 3',
      sesiones: [
        { id: 't3-s1', n: 1, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t3-voc1', 't3-voc2'] },
          { destreza: 'gramatica', ejercicios: ['t3-gram1', 't3-gram2'] },
          { destreza: 'use', parte: 1, tarea: 'Multiple-choice cloze', ejercicios: ['t3-use1'] },
          { destreza: 'listening', parte: 1, tarea: 'Tres extractos', ejercicios: ['t3-lis1'] }
        ] },
        { id: 't3-s2', n: 2, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t3-voc3', 't3-voc4'] },
          { destreza: 'gramatica', ejercicios: ['t3-gram3', 't3-gram4'] },
          { destreza: 'reading', parte: 5, tarea: 'Multiple choice', ejercicios: ['t3-read5'] },
          { destreza: 'speaking', tarea: 'Partes 1 y 2', ejercicios: ['t3-speak1'] }
        ] },
        { id: 't3-s3', n: 3, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t3-voc5', 't3-voc6'] },
          { destreza: 'gramatica', ejercicios: ['t3-gram5', 't3-gram6'] },
          { destreza: 'use', parte: 2, tarea: 'Open cloze', ejercicios: ['t3-use2a', 't3-use2b'] },
          { destreza: 'listening', parte: 2, tarea: 'Frases incompletas', ejercicios: ['t3-lis2'] }
        ] },
        { id: 't3-s4', n: 4, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t3-voc7', 't3-voc8'] },
          { destreza: 'gramatica', ejercicios: ['t3-gram7', 't3-gram8'] },
          { destreza: 'reading', parte: 6, tarea: 'Cross-text matching', ejercicios: ['t3-read6'] },
          { destreza: 'speaking', tarea: 'Parte 3', ejercicios: ['t3-speak3'] }
        ] },
        { id: 't3-s5', n: 5, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t3-voc9', 't3-voc10'] },
          { destreza: 'gramatica', ejercicios: ['t3-gram9', 't3-gram10'] },
          { destreza: 'use', parte: 3, tarea: 'Word formation', ejercicios: ['t3-use3'] },
          { destreza: 'listening', parte: 3, tarea: 'Conversación larga', ejercicios: ['t3-lis3'] }
        ] },
        { id: 't3-s6', n: 6, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t3-voc11', 't3-voc12'] },
          { destreza: 'gramatica', ejercicios: ['t3-gram11', 't3-gram12'] },
          { destreza: 'reading', parte: 7, tarea: 'Gapped text', ejercicios: ['t3-read7'] },
          { destreza: 'speaking', tarea: 'Parte 4', ejercicios: ['t3-speak4'] }
        ] },
        { id: 't3-s7', n: 7, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t3-voc13', 't3-voc14'] },
          { destreza: 'gramatica', ejercicios: ['t3-gram13', 't3-gram14'] },
          { destreza: 'use', parte: 4, tarea: 'Key word transformation', ejercicios: ['t3-use4a', 't3-use4b'] },
          { destreza: 'listening', parte: 4, tarea: 'Multiple matching', ejercicios: ['t3-lis4'] }
        ] },
        { id: 't3-s8', n: 8, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t3-voc15', 't3-voc16'] },
          { destreza: 'gramatica', ejercicios: ['t3-gram15', 't3-gram16'] },
          { destreza: 'reading', parte: 8, tarea: 'Multiple matching', ejercicios: ['t3-read8'] },
          { destreza: 'speaking', tarea: 'Repaso', ejercicios: ['t3-speakr'] }
        ] },
        { id: 't3-s9', n: 9, tipo: 'W', bloques: [
          { destreza: 'writing', parte: 1, tarea: 'Essay', ejercicios: ['t3-write1'] },
          { destreza: 'writing', parte: 2, tarea: 'A elegir', ejercicios: ['t3-write2'] }
        ] }
      ]
    },
    {
      id: 't4', nivel: 'c1', titulo: 'Test 4',
      sesiones: [
        { id: 't4-s1', n: 1, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t4-voc1', 't4-voc2'] },
          { destreza: 'gramatica', ejercicios: ['t4-gram1', 't4-gram2'] },
          { destreza: 'use', parte: 1, tarea: 'Multiple-choice cloze', ejercicios: ['t4-use1'] },
          { destreza: 'listening', parte: 1, tarea: 'Tres extractos', ejercicios: ['t4-lis1'] }
        ] },
        { id: 't4-s2', n: 2, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t4-voc3', 't4-voc4'] },
          { destreza: 'gramatica', ejercicios: ['t4-gram3', 't4-gram4'] },
          { destreza: 'reading', parte: 5, tarea: 'Multiple choice', ejercicios: ['t4-read5'] },
          { destreza: 'speaking', tarea: 'Partes 1 y 2', ejercicios: ['t4-speak1'] }
        ] },
        { id: 't4-s3', n: 3, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t4-voc5', 't4-voc6'] },
          { destreza: 'gramatica', ejercicios: ['t4-gram5', 't4-gram6'] },
          { destreza: 'use', parte: 2, tarea: 'Open cloze', ejercicios: ['t4-use2a', 't4-use2b'] },
          { destreza: 'listening', parte: 2, tarea: 'Frases incompletas', ejercicios: ['t4-lis2'] }
        ] },
        { id: 't4-s4', n: 4, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t4-voc7', 't4-voc8'] },
          { destreza: 'gramatica', ejercicios: ['t4-gram7', 't4-gram8'] },
          { destreza: 'reading', parte: 6, tarea: 'Cross-text matching', ejercicios: ['t4-read6'] },
          { destreza: 'speaking', tarea: 'Parte 3', ejercicios: ['t4-speak3'] }
        ] },
        { id: 't4-s5', n: 5, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t4-voc9', 't4-voc10'] },
          { destreza: 'gramatica', ejercicios: ['t4-gram9', 't4-gram10'] },
          { destreza: 'use', parte: 3, tarea: 'Word formation', ejercicios: ['t4-use3'] },
          { destreza: 'listening', parte: 3, tarea: 'Conversación larga', ejercicios: ['t4-lis3'] }
        ] },
        { id: 't4-s6', n: 6, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t4-voc11', 't4-voc12'] },
          { destreza: 'gramatica', ejercicios: ['t4-gram11', 't4-gram12'] },
          { destreza: 'reading', parte: 7, tarea: 'Gapped text', ejercicios: ['t4-read7'] },
          { destreza: 'speaking', tarea: 'Parte 4', ejercicios: ['t4-speak4'] }
        ] },
        { id: 't4-s7', n: 7, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t4-voc13', 't4-voc14'] },
          { destreza: 'gramatica', ejercicios: ['t4-gram13', 't4-gram14'] },
          { destreza: 'use', parte: 4, tarea: 'Key word transformation', ejercicios: ['t4-use4a', 't4-use4b'] },
          { destreza: 'listening', parte: 4, tarea: 'Multiple matching', ejercicios: ['t4-lis4'] }
        ] },
        { id: 't4-s8', n: 8, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t4-voc15', 't4-voc16'] },
          { destreza: 'gramatica', ejercicios: ['t4-gram15', 't4-gram16'] },
          { destreza: 'reading', parte: 8, tarea: 'Multiple matching', ejercicios: ['t4-read8'] },
          { destreza: 'speaking', tarea: 'Repaso', ejercicios: ['t4-speakr'] }
        ] },
        { id: 't4-s9', n: 9, tipo: 'W', bloques: [
          { destreza: 'writing', parte: 1, tarea: 'Essay', ejercicios: ['t4-write1'] },
          { destreza: 'writing', parte: 2, tarea: 'A elegir', ejercicios: ['t4-write2'] }
        ] }
      ]
    }
  ],

  ejercicios: {
  /* ===================== TEST 2 · USE OF ENGLISH ===================== */

  /* Parte 1 · multiple-choice cloze: ocho huecos, cuatro opciones cada uno.
     Se mide colocacion y matiz, no gramatica: las cuatro opciones encajan
     gramaticalmente y solo una se dice de verdad. */
  't2-use1': {
    tipo: 'opcion', parte: 1, titulo: 'Use of English · Part 1',
    instruccion: 'Decide which answer best fits each gap.',
    texto: [
      'Museums have spent thirty years trying to stop being quiet. Where they once {1} on silence, they now offer late openings, workshops and cafés, on the {2} that a building nobody enjoys is a building nobody funds.',
      'The strategy has largely {3} off. Visitor numbers are up almost everywhere, and the argument that culture belongs to everyone is far harder to {4} than it was. Yet something has been lost along the way, and curators are increasingly willing to {5} it out loud.',
      'What has gone is the possibility of standing in front of one object for twenty minutes without feeling that you are in somebody’s way. A gallery designed to keep people {6} is not designed for that, and no amount of good intentions can {7} the contradiction. The most thoughtful institutions have begun to set {8} one morning a week when nothing at all is programmed, which is either a small correction or an admission, depending on how generous you feel.'
    ],
    items: [
      { opciones: ['insisted', 'depended', 'relied', 'counted'], correcta: 1 },
      { opciones: ['grounds', 'basis', 'reason', 'cause'], correcta: 0 },
      { opciones: ['paid', 'set', 'brought', 'taken'], correcta: 0 },
      { opciones: ['deny', 'refuse', 'dismiss', 'decline'], correcta: 2 },
      { opciones: ['tell', 'talk', 'speak', 'say'], correcta: 3 },
      { opciones: ['moving', 'going', 'running', 'passing'], correcta: 0 },
      { opciones: ['dissolve', 'solve', 'resolve', 'settle'], correcta: 2 },
      { opciones: ['apart', 'off', 'aside', 'out'], correcta: 2 }
    ]
  },

  /* Parte 2 · open cloze: una sola palabra, sin pistas. Es la parte donde se
     ve si alguien tiene el idioma dentro o solo estudiado. */
  't2-use2a': {
    tipo: 'cloze', parte: 2, titulo: 'Use of English · Part 2',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'The bicycle is the only nineteenth-century machine still in daily use that almost nobody has tried to improve {1} of recognition. Cars, telephones and kitchens have all been reinvented several times {2}; the bicycle has been refined and left alone.',
      'This is usually explained by saying that the design was simply right first time, which is not quite true. Early bicycles were dangerous and uncomfortable, and it took thirty years {3} anyone arrived at {4} shape we now take for granted. What is true is that {5} the shape settled, there was nowhere obvious to go. Make it lighter and it costs more; add a motor and it becomes something {6}.',
      'Perhaps that is the real lesson. We assume that everything must eventually be disrupted, {7} the bicycle sits there, quietly refusing {8} change.'
    ],
    items: [
      { aceptadas: ['out'] }, { aceptadas: ['over', 'since'] }, { aceptadas: ['before'] },
      { aceptadas: ['the'] }, { aceptadas: ['once'] }, { aceptadas: ['else'] },
      { aceptadas: ['yet', 'but'] }, { aceptadas: ['to'] }
    ]
  },

  't2-use2b': {
    tipo: 'cloze', parte: 2, titulo: 'Use of English · Part 2 (extra)',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'There is a particular kind of book that exists only to be given: heavy, beautiful and entirely unread. Every household has {1} least one, usually on the lowest shelf, and nobody can remember who brought it.',
      'It would be easy to be sneering {2} this, and publishers certainly rely on it more than they admit. But the gift book does something a paperback cannot. It says that the giver spent money and thought, {3} that the object is meant to sit in the room rather {4} in a bag. Nobody expects it to be finished, and no one is disappointed {5} it is not.',
      'The mistake is to judge it {6} the standards of a book that somebody actually chose for {7}. On its own terms — as furniture with good intentions — it works perfectly {8}.'
    ],
    items: [
      { aceptadas: ['at'] }, { aceptadas: ['about'] }, { aceptadas: ['and'] },
      { aceptadas: ['than'] }, { aceptadas: ['when', 'if'] }, { aceptadas: ['by'] },
      { aceptadas: ['themselves', 'himself', 'herself'] }, { aceptadas: ['well'] }
    ]
  },

  /* Parte 3 · word formation */
  't2-use3': {
    tipo: 'formacion', parte: 3, titulo: 'Use of English · Part 3',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The scheme was abandoned after a series of', despues: 'delays.', raiz: 'AVOID', aceptadas: ['unavoidable'] },
      { antes: 'Her', despues: 'of the situation was better than mine.', raiz: 'JUDGE', aceptadas: ['judgement', 'judgment'] },
      { antes: 'The instructions were written with admirable', despues: '.', raiz: 'CLEAR', aceptadas: ['clarity'] },
      { antes: 'He was criticised for his', despues: 'to compromise.', raiz: 'WILLING', aceptadas: ['unwillingness'] },
      { antes: 'The evidence is', despues: 'either way.', raiz: 'CONCLUDE', aceptadas: ['inconclusive'] },
      { antes: 'They responded with', despues: 'speed.', raiz: 'REMARK', aceptadas: ['remarkable'] },
      { antes: 'The room was', despues: 'lit for reading.', raiz: 'ADEQUATE', aceptadas: ['inadequately'] },
      { antes: 'Nobody questioned the', despues: 'of the document.', raiz: 'AUTHENTIC', aceptadas: ['authenticity'] }
    ]
  },

  /* Parte 4 · key word transformation */
  't2-use4a': {
    tipo: 'transformacion', parte: 4, titulo: 'Use of English · Part 4',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I have not eaten here before.', clave: 'FIRST', antes: 'This is', despues: 'eaten here.', aceptadas: ['the first time I have', "the first time I've"] },
      { frase: 'She only agreed because you asked her.', clave: 'NOT', antes: 'She would', despues: 'you asked her.', aceptadas: ['not have agreed if'] },
      { frase: 'The noise made it impossible to concentrate.', clave: 'SUCH', antes: 'There was', despues: 'that I could not concentrate.', aceptadas: ['such a noise'] },
      { frase: 'Somebody should have told us earlier.', clave: 'BEEN', antes: 'We', despues: 'earlier.', aceptadas: ['should have been told'] },
      { frase: 'He did not apologise, which annoyed everyone.', clave: 'FAILURE', antes: 'His', despues: 'annoyed everyone.', aceptadas: ['failure to apologise'] },
      { frase: 'They are unlikely to arrive before nine.', clave: 'DOUBT', antes: 'I', despues: 'arrive before nine.', aceptadas: ['doubt whether they will', 'doubt if they will'] }
    ]
  },

  't2-use4b': {
    tipo: 'transformacion', parte: 4, titulo: 'Use of English · Part 4 (extra)',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'Nobody expected the meeting to last so long.', clave: 'TAKE', antes: 'Nobody expected the meeting', despues: 'long.', aceptadas: ['to take so'] },
      { frase: 'It is not worth complaining now.', clave: 'POINT', antes: 'There', despues: 'now.', aceptadas: ['is no point complaining', "'s no point complaining", 'is no point in complaining'] },
      { frase: 'She managed to finish despite the interruptions.', clave: 'SPITE', antes: 'She finished', despues: 'interruptions.', aceptadas: ['in spite of the'] },
      { frase: 'I would rather not discuss it today.', clave: 'PREFER', antes: 'I', despues: 'discuss it today.', aceptadas: ['would prefer not to', "'d prefer not to"] },
      { frase: 'He was too tired to argue.', clave: 'ENERGY', antes: 'He did not have', despues: 'argue.', aceptadas: ['the energy to', 'enough energy to'] },
      { frase: 'The price includes breakfast.', clave: 'INCLUDED', antes: 'Breakfast', despues: 'the price.', aceptadas: ['is included in'] }
    ]
  },

  /* ===================== TEST 2 · READING ===================== */

  't2-read5': {
    tipo: 'lectura', parte: 5, titulo: 'Reading · Part 5',
    instruccion: 'Read the text and choose the answer (A, B, C or D) which fits best according to the text.',
    tituloTexto: 'The last people to make it by hand',
    texto: [
      'There are eleven people left in Britain who can build a wooden wheel to carriage standard, and Deborah Amory is one of them. She learned the trade at forty-one, after a career in insurance that she describes, without bitterness, as twenty years of being adequately paid to be bored.',
      'The wheelwright’s craft is a good test of the arguments people make about traditional skills, because it resists most of them. It is not, for instance, a case of a technique that machines cannot match. A factory can produce a wheel that is rounder than anything Amory makes, faster and for a fraction of the cost. What it cannot produce is a wheel that will fit a particular eighteenth-century cart whose other three wheels have each warped in a different direction over two centuries. That is the work: not making wheels, but making this wheel, for this cart, which is why the customers are museums and why there are eleven of her.',
      'She is impatient with the romance that attaches itself to what she does. Visitors arrive expecting a workshop of contemplative silence and find her using an angle grinder. "People want it to be slow," she says. "It is slow, but not because I am being slow on purpose. It is slow because oak does not care what century it is."',
      'The economics are less grim than one might assume, and less encouraging than the enthusiasts claim. There is more work than she can do, which sounds like health until you consider why: the number of people able to do it has fallen faster than the number of carts needing repair. A shortage produced by decline is not the same as a market.',
      'What worries her is not that the skill will die but that it will be preserved in the wrong way — demonstrated at heritage centres, filmed, catalogued, and never used. She has taken on two apprentices in fifteen years and lost one to a better-paid job in furniture restoration, which she thought entirely reasonable. "I am not owed a successor," she says. "If it goes, it goes because nobody needed it enough, and that is not a tragedy. It is just arithmetic."',
      'Yet she keeps a list. On it are the names of every person who has telephoned to ask about training, going back to 1998, with a note beside each about why it came to nothing. Reading it, one gets the impression of a woman who has thought carefully about the difference between accepting an outcome and welcoming it.'
    ],
    items: [
      { pregunta: '1  How does Amory characterise her earlier career?',
        opciones: ['As comfortable but unengaging.', 'As a period she now resents.', 'As useful preparation for the craft.', 'As a financial necessity at the time.'], correcta: 0 },
      { pregunta: '2  Why does the writer say the craft "resists most of" the usual arguments?',
        opciones: ['Machines genuinely cannot produce a wheel of this quality.',
                   'The customers are unwilling to accept factory alternatives.',
                   'The work is valued for reasons other than the object produced.',
                   'The technique has changed little in two hundred years.'], correcta: 2 },
      { pregunta: '3  What point is Amory making about visitors’ expectations?',
        opciones: ['They underestimate how physically demanding the work is.',
                   'They are disappointed by the modern tools she uses.',
                   'They imagine the workshop is quieter than it really is.',
                   'They want the slowness to be a choice rather than a constraint.'], correcta: 3 },
      { pregunta: '4  What does the writer mean by "A shortage produced by decline is not the same as a market"?',
        opciones: ['Prices will not rise however scarce the skill becomes.',
                   'Museums are unreliable as long-term customers.',
                   'Having plenty of work is not evidence that the trade is healthy.',
                   'Demand for repairs is falling faster than anyone admits.'], correcta: 2 },
      { pregunta: '5  What is Amory’s attitude to the apprentice who left?',
        opciones: ['She blames the furniture trade for taking him.',
                   'She regards his decision as understandable.',
                   'She sees it as proof that training is pointless.',
                   'She was relieved, as he was not suited to it.'], correcta: 1 },
      { pregunta: '6  What does the list at the end suggest about Amory?',
        opciones: ['She intends to contact the people on it again.',
                   'She keeps records of everything as a matter of habit.',
                   'She blames those who failed to follow through.',
                   'She is more troubled by the situation than she admits.'], correcta: 3 }
    ]
  },

  't2-read6': {
    tipo: 'lectura', parte: 6, titulo: 'Reading · Part 6',
    instruccion: 'You will read four extracts in which specialists give their views on homework. For each question, choose from the extracts A–D.',
    opcionesCortas: true,
    secciones: [
      { letra: 'A', titulo: 'Ruth Vaughan, educational psychologist',
        texto: ['The research on homework is often summarised as showing that it does not work, which is not what it shows. It shows that it does very little for children under eleven and rather a lot for those over fourteen, and that the studies in between are a mess. My objection is not to homework but to the uniform quantity: every child, the same forty minutes, regardless of whether they finished the lesson understanding it. A task that is trivial for one pupil and impossible for another is not a task, it is a sorting mechanism, and we already have enough of those.'] },
      { letra: 'B', titulo: 'Idris Kalu, secondary school teacher',
        texto: ['I set less homework than I used to, and my results have not moved in either direction, which tells you something. What changed my mind was not the evidence — I had not read any — but marking two hundred pieces of work a fortnight and noticing that the ones done well were done by pupils who did not need the practice. The rest was copied, rushed, or done by a parent. I now set one task a week and I mark it properly. If somebody can show me that the old way was better, I will go back, but nobody has.'] },
      { letra: 'C', titulo: 'Petra Lindqvist, comparative education researcher',
        texto: ['Countries that assign very little homework and countries that assign a great deal both appear near the top of international rankings, which ought to end the argument and never does. The variable that matters is not quantity but whether the work is looked at afterwards. Unmarked homework is worse than none, because it teaches children that effort is invisible. I would add that the debate is conducted almost entirely by people whose own children have a desk and a quiet room, and that this shapes the conclusions more than anyone likes to say.'] },
      { letra: 'D', titulo: 'Sam Okoro, head of a primary school',
        texto: ['We stopped setting homework for the under-elevens four years ago and I have had exactly two complaints, both from parents who wanted evidence that we were working them hard. The evidence base for primary homework is thin to the point of transparency, and what replaced it — reading with an adult, for as long as the child will sit still — is the only thing that has ever shown a reliable effect. Where I part company with the abolitionists is at secondary level. By then the argument changes completely, and pretending otherwise does the case no favours.'] }
    ],
    items: [
      { pregunta: '1  Which expert shares D’s view that homework becomes more defensible with older pupils?',
        opciones: ['A', 'B', 'C', 'D'], correcta: 0 },
      { pregunta: '2  Which expert takes a different view from C on what makes homework effective?',
        opciones: ['A', 'B', 'C', 'D'], correcta: 3 },
      { pregunta: '3  Which expert changed their practice without consulting the research?',
        opciones: ['A', 'B', 'C', 'D'], correcta: 1 },
      { pregunta: '4  Which expert points out that the debate is shaped by the circumstances of those having it?',
        opciones: ['A', 'B', 'C', 'D'], correcta: 2 }
    ]
  },

  't2-read7': {
    tipo: 'lectura', parte: 7, titulo: 'Reading · Part 7',
    instruccion: 'Six paragraphs have been removed from the text. Choose from the paragraphs A–G the one which fits each gap. There is one extra paragraph which you do not need to use.',
    tituloTexto: 'The library that refused to close',
    opcionesCortas: true,
    texto: [
      'The letter arrived in March and said what everyone had expected since the autumn: the branch library on Fenner Road would close in June, along with four others, as part of what the council called a rationalisation of provision.',
      '{1}',
      'What nobody had predicted was Marion Achebe. She was sixty-eight, had used the library twice in her life, and had come to the public meeting mainly because it was raining and the hall was warm. She left it as the chair of a campaign, having put her hand up to ask a question and discovered, midway through, that she was making a speech.',
      '{2}',
      'The council’s figures, when they finally arrived, turned out to be four years old. Fenner Road had indeed been quiet in 2021, for reasons that required no explanation. Since then its borrowing had risen by a third, which the report did not mention because the report had not looked.',
      '{3}',
      'This might have been enough on its own, but Marion had learned something during those months that proved more useful than any statistic. Councils do not respond to being proved wrong; they respond to being made to answer in public, repeatedly, by name.',
      '{4}',
      'The reprieve was announced in October, without apology and without reference to the campaign, as a decision taken in the light of new information. Nobody minded. The library reopened its Saturday hours in January.',
      '{5}',
      'She is careful, when people ask, not to make it sound like a victory over anybody. The councillors were not villains, she says; they were people working from a spreadsheet nobody had checked, under a deadline nobody had questioned.',
      '{6}',
      'The letter is framed now, in the entrance, next to the returns desk. Somebody has written underneath it, in pencil, the date of the meeting in the warm hall.'
    ],
    secciones: [
      { letra: 'A', texto: ['She spent the following six weeks doing something the campaign had not planned and would not have thought of: she read the consultation document. All ninety pages of it, twice, with a pencil. By the end she had a list of eleven questions, of which the first was where the usage figures had come from.'] },
      { letra: 'B', texto: ['Similar letters had gone out in other boroughs that spring, and most of the closures went ahead. The pattern was familiar enough to have a rhythm: a consultation nobody could attend, a petition nobody read, and a decision that had been taken before the first meeting.'] },
      { letra: 'C', texto: ['So the campaign stopped writing letters and started attending. Every full council meeting, three of them, always in the same seats, always with the same question, until answering it became less trouble than not answering it.'] },
      { letra: 'D', texto: ['Marion stood down the following spring, on the grounds that a campaign which has won should stop being a campaign. She still uses the library about twice a year, which she says is exactly the point: it is not for her.'] },
      { letra: 'E', texto: ['The building itself was never much loved. Put up in 1974 in a style that has aged without ever having been fashionable, it leaked at one corner and was too hot in July. Even its defenders tended to praise what happened inside it rather than the thing itself.'] },
      { letra: 'F', texto: ['That distinction matters to her more than it might seem. She has been asked to speak at other campaigns and usually declines, because what worked at Fenner Road was not courage or anger but ninety pages and a pencil, and that is a harder thing to put on a poster.'] },
      { letra: 'G', texto: ['Once that was established, the rest followed quickly. A local reporter asked the same question at a press briefing. Two councillors who had voted for the closure said publicly that they had not been shown the recent figures, which was true and which the leadership would have preferred them not to say.'] }
    ],
    items: [
      { pregunta: '1', opciones: ['A','B','C','D','E','F','G'], correcta: 1 },
      { pregunta: '2', opciones: ['A','B','C','D','E','F','G'], correcta: 0 },
      { pregunta: '3', opciones: ['A','B','C','D','E','F','G'], correcta: 6 },
      { pregunta: '4', opciones: ['A','B','C','D','E','F','G'], correcta: 2 },
      { pregunta: '5', opciones: ['A','B','C','D','E','F','G'], correcta: 3 },
      { pregunta: '6', opciones: ['A','B','C','D','E','F','G'], correcta: 5 }
    ]
  },

  't2-read8': {
    tipo: 'lectura', parte: 8, titulo: 'Reading · Part 8',
    instruccion: 'You will read an article in which six people describe a summer job that shaped the way they work. For each question, choose from the people A–F.',
    opcionesCortas: true,
    secciones: [
      { letra: 'A', titulo: 'Alba, a hotel kitchen',
        texto: ['I was seventeen and I lasted the whole summer, which surprised everybody including me. The head chef never once told me I had done something well, and I spent years assuming he had disliked me. It was only much later, when somebody worked for me and asked why I never praised anything, that I understood I had copied him without noticing. I have had to unlearn it deliberately, item by item, and I am still not sure I have finished. You take the habits, not the lessons.'] },
      { letra: 'B', titulo: 'Nils, a call centre',
        texto: ['Six weeks, and I would not repeat it for money. What it gave me was a very precise understanding of how a person sounds when they have decided to be unpleasant before you pick up, and how little of it is about you. That has been worth more in twenty years of management than anything I studied. I do not romanticise it — it was a miserable place run on targets that nobody believed — but I have never since been thrown by somebody shouting.'] },
      { letra: 'C', titulo: 'Rosa, fruit picking',
        texto: ['My parents sent me because they thought I needed to see what hard work was, which is a slightly insulting reason and also correct. The thing that stayed with me was not the work but the arithmetic. We were paid by weight, and within three days everybody had worked out exactly which trees were worth the walk. Nobody taught us that. I have thought about it every time I have been told that people need to be incentivised, because we incentivised ourselves in an afternoon.'] },
      { letra: 'D', titulo: 'Tomás, a bookshop',
        texto: ['It was pleasant, badly paid and completely unlike any job I have had since, which is why I mention it. The owner let me order thirty pounds of stock a month on my own judgement, and about half of what I chose did not sell. He never mentioned it. Years later I asked him and he said that thirty pounds was the cheapest training he could buy. I have tried to give people that kind of room and I find it much harder than he made it look.'] },
      { letra: 'E', titulo: 'Yusuf, a removals firm',
        texto: ['Everybody assumes the lesson was about physical work and it was not; I was fit and it was fine. It was about other people’s houses. You see how a family lives at the exact moment they are most exposed, and you learn very fast that you are not there to have opinions about it. I have carried that into a career in which I am often in people’s lives at bad moments, and I would not have got it from a book.'] },
      { letra: 'F', titulo: 'Greta, a swimming pool',
        texto: ['Lifeguarding is ninety-nine per cent boredom, and the boredom is the job. What you are being paid for is to still be paying attention in the fourth hour, when nothing has happened all day and nothing probably will. I was nineteen and I found it almost unbearable. I now do work that is largely checking things that are almost always fine, and I am good at it precisely because I stopped expecting attention to feel interesting.'] }
    ],
    items: [
      { pregunta: '1  Who says they absorbed a way of behaving without being aware of it?', opciones: ['A','B','C','D','E','F'], correcta: 0 },
      { pregunta: '2  Who was given freedom to make mistakes that cost the employer money?', opciones: ['A','B','C','D','E','F'], correcta: 3 },
      { pregunta: '3  Who learned not to take other people’s hostility personally?', opciones: ['A','B','C','D','E','F'], correcta: 1 },
      { pregunta: '4  Who mentions people organising themselves without being instructed?', opciones: ['A','B','C','D','E','F'], correcta: 2 },
      { pregunta: '5  Who says the tedium of the work was the skill being tested?', opciones: ['A','B','C','D','E','F'], correcta: 5 },
      { pregunta: '6  Who describes learning restraint about what they observed?', opciones: ['A','B','C','D','E','F'], correcta: 4 },
      { pregunta: '7  Who admits that a relative was right about them?', opciones: ['A','B','C','D','E','F'], correcta: 2 },
      { pregunta: '8  Who has found it difficult to pass on the same treatment they received?', opciones: ['A','B','C','D','E','F'], correcta: 3 },
      { pregunta: '9  Who explicitly refuses to look back on the job fondly?', opciones: ['A','B','C','D','E','F'], correcta: 1 },
      { pregunta: '10  Who is still working on undoing what the job taught them?', opciones: ['A','B','C','D','E','F'], correcta: 0 }
    ]
  },

  /* ===================== TEST 2 · LISTENING ===================== */

  't2-lis1': {
    tipo: 'listening', parte: 1, titulo: 'Listening · Part 1',
    instruccion: 'You will hear three different extracts. Choose the answer (A, B or C) which fits best according to what you hear. <b>You will hear the recording twice.</b>',
    audio: 'audio/t2-lis1.mp3', escuchas: 2,
    contexto: 'Extract 1: a photography exhibition. Extract 2: a man who has given up his car. Extract 3: two colleagues and a training course.',
    items: [
      { pregunta: '1  What annoyed the woman about the exhibition?',
        opciones: ['The photographs were poorly displayed.', 'The captions shaped her response in advance.', 'There was too much to take in at once.'], correcta: 1 },
      { pregunta: '2  What does the man suggest she does?',
        opciones: ['Go when the gallery is less crowded.', 'Ignore the written material entirely.', 'Begin where the labelling stops.'], correcta: 2 },
      { pregunta: '3  Why did the man get rid of his car?',
        opciones: ['He could not justify the running costs.', 'He knew he would overuse it if he kept one.', 'He rarely needed to drive anywhere.'], correcta: 1 },
      { pregunta: '4  What benefit had he not anticipated?',
        opciones: ['No longer organising his day around parking.', 'Saving more money than he had calculated.', 'Getting considerably more exercise.'], correcta: 0 },
      { pregunta: '5  What did the man find valuable about the course?',
        opciones: ['The material was less obvious than expected.', 'The conversations he had outside the sessions.', 'The chance to work with the Leeds office formally.'], correcta: 1 },
      { pregunta: '6  What does he imply about the organisers?',
        opciones: ['They are unaware of what makes the course work.', 'They deliberately schedule long breaks.', 'They should replace the course with informal meetings.'], correcta: 0 }
    ]
  },

  't2-lis2': {
    tipo: 'listening', parte: 2, titulo: 'Listening · Part 2',
    instruccion: 'Complete the sentences with <b>a word or short phrase</b> from what you hear. <b>You will hear the recording twice.</b>',
    audio: 'audio/t2-lis2.mp3', escuchas: 2,
    items: [
      { antes: 'More than half of the clocks Otto repairs were made after', despues: '.', aceptadas: ['1970'] },
      { antes: 'Before this work, Otto spent eleven years as a', despues: '.', aceptadas: ['piano tuner', 'tuner'] },
      { antes: 'The tool he says he could not work without is a', despues: '.', aceptadas: ['notebook'] },
      { antes: 'The most common cause of trouble he sees is too much', despues: '.', aceptadas: ['oil'] },
      { antes: 'He finds it hardest to tell an owner that a clock is not worth', despues: '.', aceptadas: ['repairing'] },
      { antes: 'The best advice he received came from a watchmaker in', despues: '.', aceptadas: ['Dublin'] },
      { antes: 'His apprentice previously worked in', despues: '.', aceptadas: ['software'] },
      { antes: 'He advises beginners to start by taking apart a broken', despues: '.', aceptadas: ['alarm clock', 'clock'] }
    ]
  },

  't2-lis3': {
    tipo: 'listening', parte: 3, titulo: 'Listening · Part 3',
    instruccion: 'You will hear an interview. Choose the answer (A, B, C or D) which fits best according to what you hear. <b>You will hear the recording twice.</b>',
    audio: 'audio/t2-lis3.mp3', escuchas: 2,
    contexto: 'A journalist interviews the marine biologist Doctor Cormac Whelan about noise in the sea.',
    items: [
      { pregunta: '1  What does Dr Whelan say has changed about the sea?',
        opciones: ['It was silent and is now noisy.', 'The source of the noise, rather than its presence.', 'Storms have become considerably louder.', 'Whales have grown quieter in response.'], correcta: 1 },
      { pregunta: '2  Why is noise so serious for marine animals?',
        opciones: ['It damages their hearing permanently.', 'It travels much further than in air.', 'Sound is how they perceive their surroundings.', 'It disturbs them during the breeding season.'], correcta: 2 },
      { pregunta: '3  How did he come to study the subject?',
        opciones: ['He was asked to by a shipping company.', 'He inherited the project from a colleague.', 'Unexplained results led him to it.', 'He had been interested in it since childhood.'], correcta: 2 },
      { pregunta: '4  Why does he favour slowing ships down?',
        opciones: ['It is effective and requires nothing new.', 'It is the only measure the industry accepts.', 'It has already been shown to work at scale.', 'Other measures are too expensive to trial.'], correcta: 0 },
      { pregunta: '5  What does he identify as the obstacle?',
        opciones: ['The science is still disputed.', 'No single party is responsible for the sea.', 'Shipping companies deny the problem exists.', 'Governments cannot agree on measurement.'], correcta: 1 },
      { pregunta: '6  Why is he cautiously hopeful?',
        opciones: ['Public opinion has shifted decisively.', 'New regulations are close to being agreed.', 'The damage reverses as soon as it stops.', 'The affected species recover quickly.'], correcta: 2 }
    ]
  },

  't2-lis4': {
    tipo: 'listening', parte: 4, titulo: 'Listening · Part 4',
    instruccion: 'You will hear five short extracts in which people talk about giving up an activity they had done for years. While you listen you must complete both tasks. <b>You will hear the recording twice.</b>',
    audio: 'audio/t2-lis4.mp3', escuchas: 2,
    opcionesCortas: true,
    contexto: 'Each task has its own list of eight options.',
    listas: [
      { titulo: 'Task One · Why did each speaker give it up?', opciones: [
        'it had stopped serving the purpose it once did',
        'the group changed into something different',
        'a physical problem forced the decision',
        'success turned it into an obligation',
        'they could no longer make any progress',
        'it became too expensive to continue',
        'they ran out of time for it',
        'they fell out with somebody involved'
      ] },
      { titulo: 'Task Two · What does each speaker say about it now?', opciones: [
        'they wish somebody had prepared them for what followed',
        'they still keep a physical reminder of it',
        'they blame nobody for what happened',
        'they suspect returning would require self-deception',
        'they enjoy a small version of it without ambition',
        'they regret not having stopped sooner',
        'they have taken up something similar instead',
        'they would go back if the old conditions returned'
      ] }
    ],
    items: [
      { pregunta: 'Tarea 1 · 1  Speaker one', opciones: ['A','B','C','D','E','F','G','H'], correcta: 0 },
      { pregunta: 'Tarea 1 · 2  Speaker two', opciones: ['A','B','C','D','E','F','G','H'], correcta: 1 },
      { pregunta: 'Tarea 1 · 3  Speaker three', opciones: ['A','B','C','D','E','F','G','H'], correcta: 2 },
      { pregunta: 'Tarea 1 · 4  Speaker four', opciones: ['A','B','C','D','E','F','G','H'], correcta: 3 },
      { pregunta: 'Tarea 1 · 5  Speaker five', opciones: ['A','B','C','D','E','F','G','H'], correcta: 4 },
      { pregunta: 'Tarea 2 · 6  Speaker one', opciones: ['A','B','C','D','E','F','G','H'], correcta: 1 },
      { pregunta: 'Tarea 2 · 7  Speaker two', opciones: ['A','B','C','D','E','F','G','H'], correcta: 2 },
      { pregunta: 'Tarea 2 · 8  Speaker three', opciones: ['A','B','C','D','E','F','G','H'], correcta: 0 },
      { pregunta: 'Tarea 2 · 9  Speaker four', opciones: ['A','B','C','D','E','F','G','H'], correcta: 3 },
      { pregunta: 'Tarea 2 · 10 Speaker five', opciones: ['A','B','C','D','E','F','G','H'], correcta: 4 }
    ]
  },

  /* ===================== TEST 2 · SPEAKING ===================== */

  't2-speak1': {
    tipo: 'speaking', parte: 2, titulo: 'Long turn: cómo se llega al trabajo',
    instruccion: 'Speak for <b>one minute</b> without stopping. You do not have to cover everything: choose and compare.',
    segundos: 60,
    pregunta: 'Why might people travel to work in these ways, and what might be difficult about each?',
    puntos: ['cycling through a city centre', 'a long train journey with a laptop', 'walking twenty minutes each way'],
    nota: 'En el examen esto se hace con tres fotografías. Aquí van descritas mientras la academia no aporte las suyas.',
    items: [ { grabacion: true } ]
  },

  't2-speak3': {
    tipo: 'speaking', parte: 3, titulo: 'Parte 3: decidir en voz alta',
    instruccion: 'Speak for <b>two minutes</b>. Discuss all five options and reach a conclusion.',
    segundos: 120,
    pregunta: 'A town has money for one project. How useful is each of these, and which two would you choose?',
    puntos: ['a covered market', 'better street lighting', 'a public swimming pool', 'more trees', 'free wifi in the centre'],
    nota: 'En el examen esto se habla con otro candidato durante tres minutos: se negocia y se llega a un acuerdo. Grabándote solo se practica todo menos eso, que es un criterio entero de los cinco.',
    items: [ { grabacion: true } ]
  },

  't2-speak4': {
    tipo: 'speaking', parte: 4, titulo: 'Parte 4: opinar y justificar',
    instruccion: 'Answer the three questions one after the other, <b>two minutes</b> in total.',
    segundos: 120,
    pregunta: 'Questions about towns and change.',
    puntos: [
      'Should town centres be closed to cars? Why?',
      'Some people say small towns cannot survive without tourism. Do you agree?',
      'Is it a problem when young people leave the place they grew up in?'
    ],
    nota: 'En el examen el examinador pregunta y luego pide tu reacción a lo que ha dicho la otra persona. Aquí solo está la primera mitad.',
    items: [ { grabacion: true } ]
  },

  't2-speakr': {
    tipo: 'speaking', parte: 2, titulo: 'Repaso: un minuto sin parar',
    instruccion: 'Speak for <b>one minute</b> without long pauses. Compare — do not simply describe.',
    segundos: 60,
    pregunta: 'Why might these moments be difficult, and how might the people be feeling?',
    puntos: ['starting a job where everyone already knows each other', 'moving back to a place you left years ago', 'learning something new in front of people much younger'],
    nota: 'El objetivo no es acertar: es no callarse. Si te quedas en blanco, di por qué te has quedado en blanco y sigue; en el examen eso puntúa más que el silencio.',
    items: [ { grabacion: true } ]
  },

  /* ===================== TEST 2 · WRITING ===================== */

  't2-write1': {
    tipo: 'writing', parte: 1, titulo: 'Essay',
    instruccion: 'Write <b>220–260 words</b>. This part is compulsory: in the exam you do not get to choose it.',
    minutos: 45, palabras: [220, 260],
    enunciado: 'Your class has discussed how towns should spend limited public money. Write an essay discussing two of the three areas below and explaining which you think matters more.',
    contexto: 'Areas: public transport · libraries and cultural centres · green spaces.',
    cierre: 'Write in a formal style. Do not simply list advantages: take a position and support it.',
    items: [ { escrito: true } ]
  },

  't2-write2': {
    tipo: 'writing', parte: 2, titulo: 'A elegir: carta o informe',
    instruccion: 'Choose <b>one</b> of the two tasks and write <b>220–260 words</b>.',
    minutos: 45, palabras: [220, 260],
    enunciado: 'Choose one of the following two tasks.',
    contexto: '1 · A magazine has published an article claiming that learning a language as an adult is a waste of time. Write a letter to the editor responding to the article.\n2 · Your college is deciding whether to keep its Saturday study room open. Write a report describing how the room is used and recommending what should happen.',
    cierre: 'La carta pide un tono claro y algo de indignación medida; el informe pide encabezados y neutralidad. Elige la que menos te apetezca: es la que necesitas practicar.',
    items: [ { escrito: true } ]
  },

  /* ===================== TEST 2 · GRAMATICA =====================
     Segunda vuelta al temario de Elena, con las mismas areas y en el mismo
     orden que el Test 1 pero apretando: verbos de estado, narrativa con
     pasados mezclados, futuro perfecto, matices de los modales. Frases nuevas;
     ninguna sale de sus fotocopias. */

  't2-gram1': {
    tipo: 'transformacion', titulo: 'Presentes · segunda vuelta',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I started reading this novel a month ago and I am still on it.', clave: 'BEEN', antes: 'I', despues: 'this novel for a month.', aceptadas: ['have been reading', "'ve been reading"] },
      { frase: 'It is the first time she has ever complained.', clave: 'NEVER', antes: 'She', despues: 'before.', aceptadas: ['has never complained'] },
      { frase: 'He is being unusually polite this evening.', clave: 'NORMALLY', antes: 'He', despues: 'this polite.', aceptadas: ["isn't normally", 'is not normally'] },
      { frase: 'They have not spoken since the argument.', clave: 'LAST', antes: 'The argument was', despues: 'to each other.', aceptadas: ['the last time they spoke'] },
      { frase: 'My contract finishes at the end of March.', clave: 'RUNS', antes: 'My contract', despues: 'the end of March.', aceptadas: ['runs until', 'runs out at'] },
      { frase: 'How long have you had that cough?', clave: 'SINCE', antes: 'How long is it', despues: 'that cough?', aceptadas: ['since you got', 'since you first got'] }
    ]
  },

  't2-gram2': {
    tipo: 'transformacion', titulo: 'Pasados · narrar',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'She had been waiting an hour when the call finally came.', clave: 'FOR', antes: 'The call came after she', despues: 'an hour.', aceptadas: ['had waited for'] },
      { frase: 'I only understood the joke later.', clave: 'UNTIL', antes: 'It was not', despues: 'that I understood the joke.', aceptadas: ['until later'] },
      { frase: 'They finished the roof and only then did it start to rain.', clave: 'BEFORE', antes: 'They had finished the roof', despues: 'to rain.', aceptadas: ['before it started'] },
      { frase: 'Nobody had warned us, so we were unprepared.', clave: 'BEEN', antes: 'We were unprepared because we', despues: '.', aceptadas: ["hadn't been warned", 'had not been warned'] },
      { frase: 'He was tired because he had been driving all night.', clave: 'DRIVEN', antes: 'He was tired because he', despues: 'all night.', aceptadas: ['had driven'] },
      { frase: 'The last time I visited Girona was in 2018.', clave: 'BEEN', antes: 'I', despues: 'Girona since 2018.', aceptadas: ["haven't been to", 'have not been to'] }
    ]
  },

  't2-gram3': {
    tipo: 'transformacion', titulo: 'Futuro · segunda vuelta',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'The exhibition closes on the tenth, so hurry.', clave: 'HAVE', antes: 'By the eleventh the exhibition', despues: '.', aceptadas: ['will have closed'] },
      { frase: 'I expect they are still eating when we arrive.', clave: 'BE', antes: 'They', despues: 'when we arrive.', aceptadas: ['will still be eating'] },
      { frase: 'The results are published next Tuesday.', clave: 'DUE', antes: 'The results', despues: 'next Tuesday.', aceptadas: ['are due to be published'] },
      { frase: 'She intends to hand in her notice tomorrow.', clave: 'GOING', antes: 'She', despues: 'her notice tomorrow.', aceptadas: ['is going to hand in', "'s going to hand in"] },
      { frase: 'In August we will have been married for ten years.', clave: 'BEEN', antes: 'In August we', despues: 'for ten years.', aceptadas: ['will have been married'] },
      { frase: 'The train is on the point of leaving.', clave: 'ABOUT', antes: 'The train', despues: '.', aceptadas: ['is about to leave', "'s about to leave"] }
    ]
  },

  't2-gram4': {
    tipo: 'transformacion', titulo: 'Repaso de tiempos · mezcla',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'They are still deciding, so do not ring yet.', clave: 'MADE', antes: 'They', despues: 'their minds up yet.', aceptadas: ["haven't made", 'have not made'] },
      { frase: 'I met her in 2015 and we have been friends ever since.', clave: 'KNOWN', antes: 'I', despues: 'since 2015.', aceptadas: ['have known her', "'ve known her"] },
      { frase: 'The building was finished long before we moved here.', clave: 'ALREADY', antes: 'The building', despues: 'when we moved here.', aceptadas: ['had already been finished', 'had already been built'] },
      { frase: 'She is not usually this quiet.', clave: 'BEING', antes: 'She', despues: 'quiet today.', aceptadas: ['is being unusually', "'s being unusually"] },
      { frase: 'It has been raining without stopping since dawn.', clave: 'STOPPED', antes: 'It', despues: 'since dawn.', aceptadas: ["hasn't stopped raining", 'has not stopped raining'] },
      { frase: 'I will finish the report before you get back.', clave: 'HAVE', antes: 'By the time you get back I', despues: 'the report.', aceptadas: ['will have finished'] }
    ]
  },

  't2-gram5': {
    tipo: 'transformacion', titulo: 'Costumbres y adaptación',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I no longer find the early starts difficult.', clave: 'USED', antes: 'I', despues: 'the early starts.', aceptadas: ['am used to', "'m used to"] },
      { frase: 'We often walked to the beach when we were small.', clave: 'WOULD', antes: 'We', despues: 'to the beach when we were small.', aceptadas: ['would often walk', 'would walk'] },
      { frase: 'It took him a while to adapt to the silence.', clave: 'ACCUSTOMED', antes: 'It took him a while', despues: 'the silence.', aceptadas: ['to get accustomed to', 'to become accustomed to'] },
      { frase: 'There was a bakery on this corner years ago.', clave: 'BE', antes: 'There', despues: 'a bakery on this corner.', aceptadas: ['used to be'] },
      { frase: 'Speaking in public still makes her nervous.', clave: 'USED', antes: 'She', despues: 'in public.', aceptadas: ["isn't used to speaking", 'is not used to speaking'] },
      { frase: 'He never used to eat fish, but he does now.', clave: 'DIDN’T', antes: 'He', despues: 'fish, but he does now.', aceptadas: ["didn't use to eat", "didn't used to eat"] }
    ]
  },

  't2-gram6': {
    tipo: 'transformacion', titulo: 'Poder y tener que',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'She succeeded in persuading them in the end.', clave: 'ABLE', antes: 'She', despues: 'them in the end.', aceptadas: ['was able to persuade'] },
      { frase: 'It is compulsory to show identification at the door.', clave: 'HAVE', antes: 'You', despues: 'identification at the door.', aceptadas: ['have to show'] },
      { frase: 'Nobody forced me; I offered.', clave: 'MADE', antes: 'I', despues: 'do it; I offered.', aceptadas: ["wasn't made to", 'was not made to'] },
      { frase: 'It was necessary for them to cancel the trip.', clave: 'HAD', antes: 'They', despues: 'the trip.', aceptadas: ['had to cancel'] },
      { frase: 'I could not read music at that age.', clave: 'UNABLE', antes: 'At that age I', despues: 'music.', aceptadas: ['was unable to read'] },
      { frase: 'Learning the whole poem is a requirement.', clave: 'MUST', antes: 'You', despues: 'the whole poem.', aceptadas: ['must learn'] }
    ]
  },

  't2-gram7': {
    tipo: 'transformacion', titulo: 'No hace falta y no se puede',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'You brought a coat, and it turned out you did not need one.', clave: 'NEEDN’T', antes: 'You', despues: 'a coat.', aceptadas: ["needn't have brought"] },
      { frase: 'Photography is forbidden inside the church.', clave: 'ALLOWED', antes: 'You', despues: 'photographs inside the church.', aceptadas: ["aren't allowed to take", 'are not allowed to take'] },
      { frase: 'There was no need to pay, and we did not.', clave: 'HAVE', antes: 'We', despues: '.', aceptadas: ["didn't have to pay", 'did not have to pay'] },
      { frase: 'It is optional to attend the second session.', clave: 'NEED', antes: 'You', despues: 'the second session.', aceptadas: ["don't need to attend", 'do not need to attend'] },
      { frase: 'Feeding the animals was prohibited.', clave: 'MUSTN’T', antes: 'Visitors were told they', despues: 'the animals.', aceptadas: ["mustn't feed"] },
      { frase: 'They were not permitted to leave the building.', clave: 'ALLOWED', antes: 'They', despues: 'the building.', aceptadas: ["weren't allowed to leave", 'were not allowed to leave'] }
    ]
  },

  't2-gram8': {
    tipo: 'transformacion', titulo: 'Consejo y reproche',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'It was wrong of you not to tell her.', clave: 'HAVE', antes: 'You', despues: 'her.', aceptadas: ['should have told', 'ought to have told'] },
      { frase: 'If I were you I would apologise now.', clave: 'BETTER', antes: 'You', despues: 'now.', aceptadas: ['had better apologise', "'d better apologise"] },
      { frase: 'It would be sensible to book in advance.', clave: 'OUGHT', antes: 'You', despues: 'in advance.', aceptadas: ['ought to book'] },
      { frase: 'Leaving so late was a mistake on their part.', clave: 'SHOULD', antes: 'They', despues: 'so late.', aceptadas: ["shouldn't have left", 'should not have left'] },
      { frase: 'Why do you not simply ask him?', clave: 'ABOUT', antes: 'How', despues: 'him?', aceptadas: ['about asking'] },
      { frase: 'I regret not taking the earlier train.', clave: 'HAVE', antes: 'I', despues: 'the earlier train.', aceptadas: ['should have taken', 'ought to have taken'] }
    ]
  },

  't2-gram9': {
    tipo: 'transformacion', titulo: 'Deducir: certeza y duda',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I am certain they took the wrong turning.', clave: 'MUST', antes: 'They', despues: 'the wrong turning.', aceptadas: ['must have taken'] },
      { frase: 'There is no way she said that.', clave: 'HAVE', antes: 'She', despues: 'that.', aceptadas: ["can't have said", 'cannot have said'] },
      { frase: 'Perhaps he forgot to lock up.', clave: 'MIGHT', antes: 'He', despues: 'to lock up.', aceptadas: ['might have forgotten'] },
      { frase: 'It is possible that the letter got lost.', clave: 'MAY', antes: 'The letter', despues: 'lost.', aceptadas: ['may have got', 'may have gotten'] },
      { frase: 'I am sure that is not his signature.', clave: 'BE', antes: 'That', despues: 'his signature.', aceptadas: ["can't be", 'cannot be'] },
      { frase: 'The lights are on, so somebody is obviously in.', clave: 'MUST', antes: 'The lights are on, so somebody', despues: '.', aceptadas: ['must be in'] }
    ]
  },

  't2-gram10': {
    tipo: 'transformacion', titulo: 'Pasivas · segunda vuelta',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'They are still counting the votes.', clave: 'BEING', antes: 'The votes', despues: 'counted.', aceptadas: ['are still being'] },
      { frase: 'People think the painting is a forgery.', clave: 'THOUGHT', antes: 'The painting', despues: 'a forgery.', aceptadas: ['is thought to be'] },
      { frase: 'They say he left the country in June.', clave: 'HAVE', antes: 'He is said to', despues: 'the country in June.', aceptadas: ['have left'] },
      { frase: 'Nobody has used this entrance for years.', clave: 'BEEN', antes: 'This entrance', despues: 'for years.', aceptadas: ["hasn't been used", 'has not been used'] },
      { frase: 'They will announce the winner on Friday.', clave: 'BE', antes: 'The winner', despues: 'on Friday.', aceptadas: ['will be announced'] },
      { frase: 'Everyone expects prices to fall again.', clave: 'EXPECTED', antes: 'Prices', despues: 'again.', aceptadas: ['are expected to fall'] }
    ]
  },

  't2-gram11': {
    tipo: 'transformacion', titulo: 'Encargar y que te lo hagan',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'A dentist checks my teeth twice a year.', clave: 'HAVE', antes: 'I', despues: 'twice a year.', aceptadas: ['have my teeth checked'] },
      { frase: 'Someone broke into their flat last month.', clave: 'HAD', antes: 'They', despues: 'last month.', aceptadas: ['had their flat broken into'] },
      { frase: 'We are paying a firm to redesign the website.', clave: 'HAVING', antes: 'We', despues: 'redesigned.', aceptadas: ['are having the website', "'re having the website"] },
      { frase: 'She asked a tailor to shorten the sleeves.', clave: 'GOT', antes: 'She', despues: 'shortened.', aceptadas: ['got the sleeves'] },
      { frase: 'A photographer is taking our picture tomorrow.', clave: 'HAVING', antes: 'We', despues: 'taken tomorrow.', aceptadas: ['are having our picture', "'re having our picture"] },
      { frase: 'The council removed the tree without asking us.', clave: 'HAD', antes: 'We', despues: 'without being asked.', aceptadas: ['had the tree removed'] }
    ]
  },

  't2-gram12': {
    tipo: 'transformacion', titulo: 'Condicionales · mezcladas',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I did not save the file, so it is gone.', clave: 'HAD', antes: 'The file would still be here if I', despues: 'it.', aceptadas: ['had saved'] },
      { frase: 'She is not qualified, so they did not hire her.', clave: 'WERE', antes: 'If she', despues: ', they would have hired her.', aceptadas: ['were qualified'] },
      { frase: 'Take an umbrella in case it rains.', clave: 'SHOULD', antes: 'Take an umbrella', despues: '.', aceptadas: ['should it rain'] },
      { frase: 'You can stay as long as you are quiet.', clave: 'PROVIDED', antes: 'You can stay', despues: 'quiet.', aceptadas: ['provided you are', 'provided that you are', "provided you're"] },
      { frase: 'Without the neighbours we would never have known.', clave: 'BEEN', antes: 'If it', despues: 'the neighbours, we would never have known.', aceptadas: ["hadn't been for", 'had not been for'] },
      { frase: 'He will not improve unless he practises.', clave: 'ONLY', antes: 'He will improve', despues: 'practises.', aceptadas: ['only if he'] }
    ]
  },

  't2-gram13': {
    tipo: 'transformacion', titulo: 'Deseos y arrepentimientos',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I am sorry I did not accept the offer.', clave: 'WISH', antes: 'I', despues: 'the offer.', aceptadas: ['wish I had accepted'] },
      { frase: 'It is a shame the shop is shut.', clave: 'ONLY', antes: 'If', despues: 'open.', aceptadas: ['only the shop were', 'only the shop was'] },
      { frase: 'I would rather you did not mention it.', clave: 'PREFER', antes: 'I', despues: 'mention it.', aceptadas: ["'d prefer you not to", 'would prefer you not to'] },
      { frase: 'She regrets having sold the piano.', clave: 'WISHES', antes: 'She', despues: 'the piano.', aceptadas: ["wishes she hadn't sold", 'wishes she had not sold'] },
      { frase: 'It annoys me that he always interrupts.', clave: 'WOULD', antes: 'I wish he', despues: 'interrupting.', aceptadas: ['would stop'] },
      { frase: 'It is time for us to leave.', clave: 'WENT', antes: 'It is time', despues: '.', aceptadas: ['we went'] }
    ]
  },

  't2-gram14': {
    tipo: 'transformacion', titulo: 'Relativo y consecuencia',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'The film was so long that we left early.', clave: 'SUCH', antes: 'It was', despues: 'that we left early.', aceptadas: ['such a long film'] },
      { frase: 'The house had a garden, and we bought it for that.', clave: 'WHOSE', antes: 'We bought the house', despues: 'us.', aceptadas: ['whose garden sold it to'] },
      { frase: 'She missed the train, which meant she missed the meeting.', clave: 'RESULT', antes: 'She missed the train and', despues: 'missed the meeting.', aceptadas: ['as a result she'] },
      { frase: 'That is the man I was telling you about.', clave: 'WHOM', antes: 'That is the man', despues: 'you.', aceptadas: ['about whom I told', 'about whom I was telling'] },
      { frase: 'The soup was too hot to drink.', clave: 'ENOUGH', antes: 'The soup was not', despues: 'drink.', aceptadas: ['cool enough to'] },
      { frase: 'Nobody knows the reason for the delay.', clave: 'WHY', antes: 'Nobody knows', despues: 'delayed.', aceptadas: ['why it was'] }
    ]
  },

  't2-gram15': {
    tipo: 'transformacion', titulo: 'Estilo indirecto · segunda vuelta',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: '"You broke it on purpose," she said to him.', clave: 'ACCUSED', antes: 'She', despues: 'it on purpose.', aceptadas: ['accused him of breaking'] },
      { frase: '"I would not do that if I were you," he said.', clave: 'ADVISED', antes: 'He', despues: 'that.', aceptadas: ['advised me not to do', 'advised us not to do'] },
      { frase: '"All right, I took the money," he said.', clave: 'TAKING', antes: 'He admitted', despues: '.', aceptadas: ['to taking the money', 'taking the money'] },
      { frase: '"Do not forget to sign," she reminded me.', clave: 'REMINDED', antes: 'She', despues: '.', aceptadas: ['reminded me to sign'] },
      { frase: '"Shall we meet on Thursday?" he said.', clave: 'SUGGESTED', antes: 'He', despues: 'on Thursday.', aceptadas: ['suggested meeting', 'suggested that we meet'] },
      { frase: '"I will not sign it," she said.', clave: 'REFUSED', antes: 'She', despues: 'it.', aceptadas: ['refused to sign'] }
    ]
  },

  't2-gram16': {
    tipo: 'transformacion', titulo: 'Inversión y énfasis',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'We had hardly started when the power went off.', clave: 'HARDLY', antes: '', despues: 'started when the power went off.', aceptadas: ['hardly had we'] },
      { frase: 'I have rarely seen him so pleased.', clave: 'RARELY', antes: '', despues: 'him so pleased.', aceptadas: ['rarely have I seen'] },
      { frase: 'She did not realise what it meant until much later.', clave: 'ONLY', antes: '', despues: 'she realise what it meant.', aceptadas: ['only much later did'] },
      { frase: 'You may not smoke here under any circumstances.', clave: 'CIRCUMSTANCES', antes: 'Under no', despues: 'here.', aceptadas: ['circumstances may you smoke'] },
      { frase: 'The house is not only cold, it is also damp.', clave: 'ONLY', antes: 'Not', despues: ', it is also damp.', aceptadas: ['only is the house cold'] },
      { frase: 'It was the noise that kept me awake, not the heat.', clave: 'WHAT', antes: '', despues: 'awake was the noise, not the heat.', aceptadas: ['what kept me'] }
    ]
  },

  /* ===================== TEST 2 · VOCABULARIO =====================
     Mismos tres formatos que usa Elena y en la misma proporcion: ocho cajas de
     palabras, cuatro open cloze y cuatro de word formation. Frases nuevas. */

  't2-voc1': {
    tipo: 'caja', titulo: 'Preposiciones tras sustantivo',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['about', 'for', 'in', 'of', 'on', 'over', 'to', 'with'],
    items: [
      { antes: 'There is no need', despues: 'alarm.', aceptadas: ['for'] },
      { antes: 'She has a real talent', despues: 'languages.', aceptadas: ['for'] },
      { antes: 'They have no control', despues: 'the timetable.', aceptadas: ['over'] },
      { antes: 'His attitude', despues: 'the whole thing surprised me.', aceptadas: ['to'] },
      { antes: 'There has been a sharp rise', despues: 'complaints.', aceptadas: ['in'] },
      { antes: 'I have no intention', despues: 'apologising.', aceptadas: ['of'] }
    ]
  },

  't2-voc2': {
    tipo: 'caja', titulo: 'Phrasal verbs · dar y quitar',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['away', 'back', 'down', 'in', 'off', 'out', 'up', 'with'],
    items: [
      { antes: 'She gave', despues: 'most of her books before moving.', aceptadas: ['away'] },
      { antes: 'After an hour of arguing he finally gave', despues: '.', aceptadas: ['in'] },
      { antes: 'I had to take the shirt', despues: 'to the shop.', aceptadas: ['back'] },
      { antes: 'The company laid fifty people', despues: 'in March.', aceptadas: ['off'] },
      { antes: 'They turned', despues: 'the heating to save money.', aceptadas: ['down'] },
      { antes: 'He handed', despues: 'his notice on Friday.', aceptadas: ['in'] }
    ]
  },

  't2-voc3': {
    tipo: 'caja', titulo: 'Adjetivos y su preposición',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['about', 'at', 'from', 'in', 'of', 'on', 'to', 'with'],
    items: [
      { antes: 'He is hopeless', despues: 'directions.', aceptadas: ['at'] },
      { antes: 'She was unaware', despues: 'the change.', aceptadas: ['of'] },
      { antes: 'The result was independent', despues: 'the weather.', aceptadas: ['of'] },
      { antes: 'They are keen', despues: 'starting immediately.', aceptadas: ['on'] },
      { antes: 'This model is inferior', despues: 'the old one.', aceptadas: ['to'] },
      { antes: 'I am not familiar', despues: 'that procedure.', aceptadas: ['with'] }
    ]
  },

  't2-voc4': {
    tipo: 'caja', titulo: 'Expresiones con partes del cuerpo',
    instruccion: 'Complete each expression with a word from the box. There are more words than you need.',
    caja: ['arm', 'eye', 'foot', 'hand', 'head', 'heart', 'neck', 'shoulder'],
    items: [
      { antes: 'I did not see', despues: 'to eye with him about it.', aceptadas: ['eye'] },
      { antes: 'She learned the whole speech by', despues: '.', aceptadas: ['heart'] },
      { antes: 'Could you give me a', despues: 'with these boxes?', aceptadas: ['hand'] },
      { antes: 'He got off on the wrong', despues: 'with his new boss.', aceptadas: ['foot'] },
      { antes: 'Try to keep a cool', despues: 'when they ask.', aceptadas: ['head'] },
      { antes: 'The tickets cost an', despues: 'and a leg.', aceptadas: ['arm'] }
    ]
  },

  't2-voc5': {
    tipo: 'cloze', titulo: 'Open cloze · el silencio caro',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Quiet, it turns out, has become a luxury good. Hotels advertise it, headphones promise it, and estate agents put it in the description whether or {1} it is true. What was once simply the absence of something is now sold {2} a feature.',
      'This would be merely amusing {3} it were not so unevenly distributed. The people most exposed to noise are, almost without exception, the ones least able to pay to escape it: flats beside ring roads, houses under flight paths. Nobody planned this, which is precisely the problem. Had anyone been asked to design it {4} purpose, they would have refused. In the {5} of a decision, the market simply arranged things the way markets do, and we are left calling the result unfortunate {6} than unjust.'
    ],
    items: [
      { aceptadas: ['not'] }, { aceptadas: ['as'] }, { aceptadas: ['if'] },
      { aceptadas: ['on'] }, { aceptadas: ['absence'] }, { aceptadas: ['rather'] }
    ]
  },

  't2-voc6': {
    tipo: 'cloze', titulo: 'Open cloze · aprender un oficio',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'The apprenticeship has been declared dead so many times that its survival has stopped being news. It persists because {1} does something no classroom manages: it puts the learner next to somebody who is actually doing the work, and lets them be useless for a while without anyone minding.',
      'Critics point {2} that the system was never as good as nostalgia suggests, and they are right. Plenty of apprentices spent three years sweeping floors. But the answer to a badly run apprenticeship is a better one, {3} a lecture theatre. What the classroom cannot easily teach is judgement, and judgement is {4} up out of small decisions made in front of somebody who will say when you are wrong. That takes time, and time is the one thing {5} which there is no substitute, {6} matter how the course is designed.'
    ],
    items: [
      { aceptadas: ['it'] }, { aceptadas: ['out'] }, { aceptadas: ['not'] },
      { aceptadas: ['built', 'made'] }, { aceptadas: ['for'] }, { aceptadas: ['no'] }
    ]
  },

  't2-voc7': {
    tipo: 'formacion', titulo: 'Word formation · del verbo al nombre',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The', despues: 'of the new wing took two years.', raiz: 'CONSTRUCT', aceptadas: ['construction'] },
      { antes: 'Her', despues: 'to the project was never in doubt.', raiz: 'COMMIT', aceptadas: ['commitment'] },
      { antes: 'They demanded a full', despues: 'of the accident.', raiz: 'EXPLAIN', aceptadas: ['explanation'] },
      { antes: 'The', despues: 'between the two reports is striking.', raiz: 'RESEMBLE', aceptadas: ['resemblance'] },
      { antes: 'His', despues: 'to sign delayed everything.', raiz: 'REFUSE', aceptadas: ['refusal'] },
      { antes: 'There was widespread', despues: 'with the decision.', raiz: 'SATISFY', aceptadas: ['dissatisfaction'] }
    ]
  },

  't2-voc8': {
    tipo: 'formacion', titulo: 'Word formation · adjetivos difíciles',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The instructions were almost', despues: 'to follow.', raiz: 'POSSIBLE', aceptadas: ['impossible'] },
      { antes: 'She gave a', despues: 'account of what happened.', raiz: 'CONVINCE', aceptadas: ['convincing'] },
      { antes: 'The damage is thankfully', despues: '.', raiz: 'REPAIR', aceptadas: ['repairable'] },
      { antes: 'His behaviour was completely', despues: 'in the circumstances.', raiz: 'EXCUSE', aceptadas: ['inexcusable'] },
      { antes: 'They made a', despues: 'effort to include everybody.', raiz: 'CONSCIENCE', aceptadas: ['conscientious'] },
      { antes: 'The two accounts are', despues: 'different.', raiz: 'MARK', aceptadas: ['markedly'] }
    ]
  },

  't2-voc9': {
    tipo: 'caja', titulo: 'Verbos con preposición fija',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['at', 'for', 'from', 'in', 'of', 'on', 'to', 'with'],
    items: [
      { antes: 'Nobody objected', despues: 'the change of date.', aceptadas: ['to'] },
      { antes: 'The result depends', despues: 'how many turn up.', aceptadas: ['on'] },
      { antes: 'She was accused', despues: 'leaking the report.', aceptadas: ['of'] },
      { antes: 'They congratulated him', despues: 'the appointment.', aceptadas: ['on'] },
      { antes: 'Please refrain', despues: 'using flash photography.', aceptadas: ['from'] },
      { antes: 'We had to cope', despues: 'a great deal that winter.', aceptadas: ['with'] }
    ]
  },

  't2-voc10': {
    tipo: 'caja', titulo: 'Phrasal verbs · empezar y terminar',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['ahead', 'along', 'down', 'off', 'out', 'through', 'up', 'with'],
    items: [
      { antes: 'The festival kicks', despues: 'on the fifteenth.', aceptadas: ['off'] },
      { antes: 'Talks broke', despues: 'after four hours.', aceptadas: ['down'] },
      { antes: 'They went', despues: 'with the plan despite the warnings.', aceptadas: ['ahead'] },
      { antes: 'The batteries ran', despues: 'halfway through.', aceptadas: ['out'] },
      { antes: 'We had to see the project', despues: 'to the end.', aceptadas: ['through'] },
      { antes: 'The two of them get', despues: 'surprisingly well for rivals.', aceptadas: ['along'] }
    ]
  },

  't2-voc11': {
    tipo: 'caja', titulo: 'Colocaciones · verbo y sustantivo',
    instruccion: 'Complete each sentence with a verb from the box. There are more verbs than you need.',
    caja: ['break', 'catch', 'come', 'keep', 'lose', 'make', 'meet', 'set'],
    items: [
      { antes: 'It is hard to', despues: 'track of everyone these days.', aceptadas: ['keep'] },
      { antes: 'We will never', despues: 'the deadline at this rate.', aceptadas: ['meet'] },
      { antes: 'Try not to', despues: 'your temper with them.', aceptadas: ['lose'] },
      { antes: 'They are hoping to', despues: 'a record this summer.', aceptadas: ['break'] },
      { antes: 'It took me a week to', despues: 'up with the reading.', aceptadas: ['catch'] },
      { antes: 'The committee will', despues: 'a date in September.', aceptadas: ['set'] }
    ]
  },

  't2-voc12': {
    tipo: 'caja', titulo: 'Expresiones con el tiempo',
    instruccion: 'Complete each expression with a word from the box. There are more words than you need.',
    caja: ['clock', 'hand', 'moment', 'run', 'spur', 'time', 'while', 'word'],
    items: [
      { antes: 'We booked it on the', despues: 'of the moment.', aceptadas: ['spur'] },
      { antes: 'In the long', despues: 'it will save money.', aceptadas: ['run'] },
      { antes: 'It is worth doing, but it takes a', despues: '.', aceptadas: ['while'] },
      { antes: 'They worked round the', despues: 'to finish it.', aceptadas: ['clock'] },
      { antes: 'For the', despues: 'being, nothing has changed.', aceptadas: ['time'] },
      { antes: 'Have the papers ready at', despues: '.', aceptadas: ['hand'] }
    ]
  },

  't2-voc13': {
    tipo: 'cloze', titulo: 'Open cloze · el precio de lo gratis',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Nothing about a free service is free; the question is only who pays and {1} what. For two decades the answer was advertising, and for two decades most people decided they could live {2} that. What has changed is not the arrangement but its scale: what began as a way of guessing which advert to show has turned {3} an industry that knows a great deal more about you than your closest friends.',
      'It is tempting to blame the users for accepting it, and there is something in that. But the choice, as presented, was never much of {4} choice: agree, or do without the thing everyone else is using. Regulators have started to notice, {5} the pace is glacial and the companies have far better lawyers. Whether anything comes {6} it is, at this stage, anybody’s guess.'
    ],
    items: [
      { aceptadas: ['with', 'for'] }, { aceptadas: ['with'] }, { aceptadas: ['into'] },
      { aceptadas: ['a'] }, { aceptadas: ['but', 'though', 'yet'] }, { aceptadas: ['of'] }
    ]
  },

  't2-voc14': {
    tipo: 'cloze', titulo: 'Open cloze · volver a un sitio',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Returning to a place you knew well as a child is an experiment nobody should run twice. The street is narrower than it {1} to be, the hill is not a hill, and the shop that seemed enormous turns {2} to be the size of a kitchen. None of this is surprising, and all of it is unsettling.',
      'What catches people {3} guard is not the change but the absence of it. A town that has been carefully preserved is somehow harder to bear {4} one that has been rebuilt, because it insists that nothing has happened while you were away. You stand in front of a door that has not been repainted {5} 1994 and understand, more clearly than you would like, that the thing which moved on was you. It is worth doing {6}, but do not expect comfort from it.'
    ],
    items: [
      { aceptadas: ['used'] }, { aceptadas: ['out'] }, { aceptadas: ['off'] },
      { aceptadas: ['than'] }, { aceptadas: ['since'] }, { aceptadas: ['once'] }
    ]
  },

  't2-voc15': {
    tipo: 'formacion', titulo: 'Word formation · prefijos y matices',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The figures had been badly', despues: 'by the press.', raiz: 'INTERPRET', aceptadas: ['misinterpreted'] },
      { antes: 'The two systems are simply', despues: '.', raiz: 'COMPATIBLE', aceptadas: ['incompatible'] },
      { antes: 'They had to', despues: 'the whole timetable.', raiz: 'THINK', aceptadas: ['rethink'] },
      { antes: 'Her contribution was', despues: 'by everyone at the time.', raiz: 'ESTIMATE', aceptadas: ['underestimated'] },
      { antes: 'The delay was entirely', despues: ', had anyone read the timetable.', raiz: 'AVOID', aceptadas: ['avoidable'] },
      { antes: 'He spoke with', despues: 'confidence for a beginner.', raiz: 'SURPRISE', aceptadas: ['surprising'] }
    ]
  },

  't2-voc16': {
    tipo: 'formacion', titulo: 'Word formation · adverbios',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The building was', despues: 'damaged in the storm.', raiz: 'SEVERE', aceptadas: ['severely'] },
      { antes: 'She answered', despues: ', which surprised nobody.', raiz: 'TRUTH', aceptadas: ['truthfully'] },
      { antes: 'The two events are', despues: 'connected.', raiz: 'DOUBT', aceptadas: ['undoubtedly'] },
      { antes: 'He arrived', despues: 'late, as always.', raiz: 'SHAME', aceptadas: ['shamelessly'] },
      { antes: 'The report was', despues: 'written in a single evening.', raiz: 'APPARENT', aceptadas: ['apparently'] },
      { antes: 'They dealt with the complaint', despues: '.', raiz: 'EFFICIENT', aceptadas: ['efficiently'] }
    ]
  },

  /* ---------- Listening ----------
     Cuatro partes, como el examen. El audio de hoy es PROVISIONAL: lo genera
     espeak-ng en local, gratis, y es un sintetizador robotico. Sirve para que
     el reproductor y sus reglas funcionen de verdad, no como material final:
     el CAE mide entender a personas, con su acento y sus titubeos. Los guiones
     estan en listening/ y no cambian cuando se pague una voz de verdad. */

  't1-lis1': {
    tipo: 'listening', parte: 1,
    titulo: 'Listening · Part 1',
    instruccion: 'You will hear three different extracts. Choose the answer (A, B or C) which fits best according to what you hear. <b>You will hear the recording twice.</b>',
    audio: 'audio/t1-lis1.mp3', escuchas: 2,
    contexto: 'Extract 1: two colleagues discuss a report. Extract 2: a woman talks about a course she has started. Extract 3: two people discuss a change at their station.',
    items: [
      { pregunta: '1  What is the man’s main criticism of the report?',
        opciones: ['Its conclusions are not well supported.', 'It is too long for anyone to read.', 'It leaves out the methodology.'], correcta: 1 },
      { pregunta: '2  What does the woman realise about herself?',
        opciones: ['She has been equating length with rigour.', 'She is afraid of being contradicted.', 'She works better under pressure.'], correcta: 0 },
      { pregunta: '3  Why did the pottery class not relax the woman at first?',
        opciones: ['The teacher was too demanding.', 'She was unaccustomed to being a beginner.', 'The other students were more skilled.'], correcta: 1 },
      { pregunta: '4  How does she feel about her work now?',
        opciones: ['Proud of how far she has come.', 'Frustrated by her slow progress.', 'Untroubled by how bad it is.'], correcta: 2 },
      { pregunta: '5  What is the woman’s attitude to the closure of the ticket office?',
        opciones: ['She is angry on principle.', 'She admits she no longer uses it.', 'She thinks the machines will fail.'], correcta: 1 },
      { pregunta: '6  What do the two speakers agree about?',
        opciones: ['The promise about platform staff will not be kept.', 'Older passengers will be unable to travel.', 'The petition is unlikely to change anything.'], correcta: 0 }
    ]
  },

  't1-lis3': {
    tipo: 'listening', parte: 3,
    titulo: 'Listening · Part 3',
    instruccion: 'You will hear an interview. Choose the answer (A, B, C or D) which fits best according to what you hear. <b>You will hear the recording twice.</b>',
    audio: 'audio/t1-lis3.mp3', escuchas: 2,
    contexto: 'A journalist interviews Doctor Alan Merrick, who studies sleep.',
    items: [
      { pregunta: '1  What is Dr Merrick’s objection to the "eight hours" advice?',
        opciones: ['The figure was arrived at unscientifically.',
                   'It makes normal sleepers believe they are failing.',
                   'It applies only to younger adults.',
                   'It has been superseded by newer research.'], correcta: 1 },
      { pregunta: '2  Why did he begin studying shift workers?',
        opciones: ['He had worked night shifts himself.',
                   'Funding was easier to obtain in that area.',
                   'Existing studies used convenient rather than relevant subjects.',
                   'Hospitals approached him for advice.'], correcta: 2 },
      { pregunta: '3  What surprised him about the workers who coped best?',
        opciones: ['They slept fewer hours than the others.',
                   'They had unusually strict personal routines.',
                   'Their shift patterns were consistent, whatever they were.',
                   'They had been doing the job the longest.'], correcta: 2 },
      { pregunta: '4  Why does he think his conclusion has been slow to spread?',
        opciones: ['It requires employers to spend money.',
                   'It contradicts what most researchers believe.',
                   'It is difficult to explain to the public.',
                   'The evidence for it is still incomplete.'], correcta: 0 },
      { pregunta: '5  What is his main concern about sleep-tracking devices?',
        opciones: ['They measure sleep quality inaccurately.',
                   'They can create anxiety where there was none.',
                   'They encourage people to sleep too much.',
                   'They are too expensive for most people.'], correcta: 1 },
      { pregunta: '6  How does he sound when discussing school start times?',
        opciones: ['Hopeful that change is close.',
                   'Uncertain about the strength of the evidence.',
                   'Exasperated at the lack of action.',
                   'Defensive about his own field.'], correcta: 2 }
    ]
  },

  't1-lis4': {
    tipo: 'listening', parte: 4,
    titulo: 'Listening · Part 4',
    instruccion: 'You will hear five short extracts in which people talk about leaving the city where they lived. While you listen you must complete both tasks. <b>You will hear the recording twice.</b>',
    audio: 'audio/t1-lis4.mp3', escuchas: 2,
    opcionesCortas: true,
    contexto: 'Each task has its own list of eight options.',
    listas: [
      { titulo: 'Task One · Why did each speaker leave?', opciones: [
        'the cost of living there',
        'an obligation to family',
        'a change in how they worked',
        'a plan made long in advance',
        'a wish for a quieter life',
        'the loss of a relationship with the place',
        'pressure from friends who had left',
        'a search for a different kind of work'
      ] },
      { titulo: 'Task Two · What does each speaker say now, looking back?', opciones: [
        'they would make exactly the same choice again',
        'the change did not deliver what it promised',
        'the hard part was not the one they had prepared for',
        'they were glad the decision was taken out of their hands',
        'they regret having waited so long',
        'it was the right thing and the hardest thing at once',
        'they learned something about their own temperament',
        'other people’s reactions took them by surprise'
      ] }
    ],
    items: [
      { pregunta: 'Tarea 1 · 1  Speaker one', opciones: ['A','B','C','D','E','F','G','H'], correcta: 5 },
      { pregunta: 'Tarea 1 · 2  Speaker two', opciones: ['A','B','C','D','E','F','G','H'], correcta: 1 },
      { pregunta: 'Tarea 1 · 3  Speaker three', opciones: ['A','B','C','D','E','F','G','H'], correcta: 2 },
      { pregunta: 'Tarea 1 · 4  Speaker four', opciones: ['A','B','C','D','E','F','G','H'], correcta: 4 },
      { pregunta: 'Tarea 1 · 5  Speaker five', opciones: ['A','B','C','D','E','F','G','H'], correcta: 3 },
      { pregunta: 'Tarea 2 · 6  Speaker one', opciones: ['A','B','C','D','E','F','G','H'], correcta: 7 },
      { pregunta: 'Tarea 2 · 7  Speaker two', opciones: ['A','B','C','D','E','F','G','H'], correcta: 3 },
      { pregunta: 'Tarea 2 · 8  Speaker three', opciones: ['A','B','C','D','E','F','G','H'], correcta: 2 },
      { pregunta: 'Tarea 2 · 9  Speaker four', opciones: ['A','B','C','D','E','F','G','H'], correcta: 6 },
      { pregunta: 'Tarea 2 · 10 Speaker five', opciones: ['A','B','C','D','E','F','G','H'], correcta: 5 }
    ]
  },

  /* ---------- Speaking ----------
     La parte 3 y la 4 del examen se hacen en pareja: son una conversacion. Sin
     pareja no se puede medir Interactive Communication, que es uno de los cinco
     criterios, y eso se dice sin adornos en la nota de cada ejercicio. Lo que
     si se puede practicar solo es todo lo demas: soltura, vocabulario,
     gramatica y organizar una respuesta larga. */

  't1-speak3': {
    tipo: 'speaking', parte: 3,
    titulo: 'Parte 3: decidir en voz alta',
    instruccion: 'Speak for <b>two minutes</b>. Discuss all five options and reach a conclusion, even a provisional one.',
    segundos: 120,
    pregunta: 'A school has money for one improvement. How important is each of these, and which two would you choose?',
    puntos: [
      'smaller classes',
      'better science laboratories',
      'more time for sport',
      'training for the teachers',
      'free lunches for everyone'
    ],
    nota: 'En el examen esto se habla con otro candidato durante tres minutos: se negocia, se interrumpe y se llega a un acuerdo. Grabándote solo se practica todo menos eso, que es un criterio entero de los cinco. Cuando esté el emparejamiento, esta misma pregunta se hará en pareja.',
    items: [ { grabacion: true } ]
  },

  't1-speak4': {
    tipo: 'speaking', parte: 4,
    titulo: 'Parte 4: opinar y justificar',
    instruccion: 'Answer the three questions one after the other, <b>two minutes</b> in total. You do not have to be right — you have to support what you say.',
    segundos: 120,
    pregunta: 'Questions about education and money.',
    puntos: [
      'Should university be free for everyone? Why?',
      'Some people say we should teach practical skills instead of academic subjects. What do you think?',
      'Is it fair to judge a school by its exam results?'
    ],
    nota: 'En el examen el examinador pregunta y luego pide tu reacción a lo que ha dicho la otra persona. Aquí solo está la primera mitad.',
    items: [ { grabacion: true } ]
  },

  't1-speak-repaso': {
    tipo: 'speaking', parte: 2,
    titulo: 'Repaso: un minuto sin parar',
    instruccion: 'Speak for <b>one minute</b> without long pauses. Compare — do not simply describe.',
    segundos: 60,
    pregunta: 'Why might people be doing these things, and how might they be feeling?',
    puntos: [
      'giving a talk to a large audience',
      'working alone late at night',
      'teaching someone much older than themselves'
    ],
    nota: 'Este es el que conviene repetir antes del examen. El objetivo no es acertar: es no callarse. Si te quedas en blanco, di por qué te has quedado en blanco y sigue; en el examen eso puntúa más que el silencio.',
    items: [ { grabacion: true } ]
  },

  /* Area 3 · The future */
  'g3-transf': {
    tipo: 'transformacion', titulo: 'Futuro · palabra clave',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I have decided to sell the flat.', clave: 'GOING', antes: 'I', despues: 'the flat.',
        aceptadas: ['am going to sell', "'m going to sell"] },
      { frase: 'The meeting starts at nine, according to the agenda.', clave: 'DUE', antes: 'The meeting', despues: 'at nine.',
        aceptadas: ['is due to start', "'s due to start", 'is due to begin'] },
      { frase: 'By June they will have lived here for a decade.', clave: 'BEEN', antes: 'By June they', despues: 'here for a decade.',
        aceptadas: ['will have been living'] },
      { frase: 'Do not phone at eight; I will be in the middle of dinner.', clave: 'HAVING', antes: 'Do not phone at eight; I', despues: 'dinner.',
        aceptadas: ['will be having', "'ll be having"] },
      { frase: 'It looks like rain.', clave: 'ABOUT', antes: 'It', despues: 'rain.',
        aceptadas: ['is about to', "'s about to"] },
      { frase: 'The builders will finish the roof before Friday.', clave: 'HAVE', antes: 'The builders', despues: 'the roof by Friday.',
        aceptadas: ['will have finished'] }
    ]
  },

  /* Area 4 · Repaso de todos los tiempos */
  'g4-transf': {
    tipo: 'transformacion', titulo: 'Repaso de tiempos · palabra clave',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'She began teaching in 2010 and she still teaches.', clave: 'TAUGHT', antes: 'She', despues: 'since 2010.',
        aceptadas: ['has taught'] },
      { frase: 'I saw that film last week for the first time.', clave: 'NEVER', antes: 'Until last week I', despues: 'that film.',
        aceptadas: ['had never seen'] },
      { frase: 'The rain stopped and only then did we go out.', clave: 'UNTIL', antes: 'We did not go out', despues: 'stopped.',
        aceptadas: ['until the rain had', 'until it had'] },
      { frase: 'They are still repairing the road.', clave: 'BEING', antes: 'The road', despues: 'repaired.',
        aceptadas: ['is still being'] },
      { frase: 'It is my first visit to Porto.', clave: 'BEEN', antes: 'I', despues: 'Porto before.',
        aceptadas: ['have never been to', "'ve never been to", 'had never been to'] },
      { frase: 'He left just before I arrived.', clave: 'ALREADY', antes: 'When I arrived, he', despues: '.',
        aceptadas: ['had already left'] }
    ]
  },

  /* Area 5 · Used to / would */
  'g5-transf': {
    tipo: 'transformacion', titulo: 'Hábitos del pasado · palabra clave',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'When I was a child, we spent every August in Laredo.', clave: 'WOULD', antes: 'When I was a child, we', despues: 'every August in Laredo.',
        aceptadas: ['would spend'] },
      { frase: 'She does not play the violin any more.', clave: 'USED', antes: 'She', despues: 'the violin.',
        aceptadas: ['used to play'] },
      { frase: 'There was a cinema here years ago.', clave: 'BE', antes: 'There', despues: 'a cinema here.',
        aceptadas: ['used to be'] },
      { frase: 'I never drank coffee before, but now I do.', clave: 'DIDN’T', antes: 'I', despues: 'coffee, but now I do.',
        aceptadas: ["didn't use to drink", "didn't used to drink"] },
      { frase: 'He always left the door unlocked, which annoyed me.', clave: 'WOULD', antes: 'He', despues: 'the door unlocked, which annoyed me.',
        aceptadas: ['would always leave', 'would leave'] },
      { frase: 'My grandmother had a shop in Bermeo years ago.', clave: 'USED', antes: 'My grandmother', despues: 'a shop in Bermeo.',
        aceptadas: ['used to have', 'used to own'] }
    ]
  },

  /* Area 6 · To be / get used to */
  'g6-transf': {
    tipo: 'transformacion', titulo: 'Acostumbrarse · palabra clave',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'Getting up at five is normal for her now.', clave: 'USED', antes: 'She', despues: 'up at five.',
        aceptadas: ['is used to getting', "'s used to getting"] },
      { frase: 'At first the noise bothered me, but not any more.', clave: 'GOT', antes: 'I', despues: 'the noise.',
        aceptadas: ['got used to', 'have got used to'] },
      { frase: 'Driving on the left still feels strange to him.', clave: 'USED', antes: 'He', despues: 'on the left.',
        aceptadas: ["isn't used to driving", 'is not used to driving'] },
      { frase: 'It took her months to adapt to the new timetable.', clave: 'GETTING', antes: 'She spent months', despues: 'the new timetable.',
        aceptadas: ['getting used to'] },
      { frase: 'I find it easy to work at night now.', clave: 'USED', antes: 'I', despues: 'at night.',
        aceptadas: ['am used to working', "'m used to working"] },
      { frase: 'You will adapt to the cold eventually.', clave: 'USED', antes: 'You will', despues: 'the cold eventually.',
        aceptadas: ['get used to'] }
    ]
  },

  /* Area 7 y 8 · Modales de habilidad y obligacion */
  'g7-transf': {
    tipo: 'transformacion', titulo: 'Habilidad y obligación · palabra clave',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'She managed to finish the race despite the injury.', clave: 'ABLE', antes: 'She', despues: 'the race despite the injury.',
        aceptadas: ['was able to finish'] },
      { frase: 'It is essential that you sign both copies.', clave: 'MUST', antes: 'You', despues: 'both copies.',
        aceptadas: ['must sign'] },
      { frase: 'Wearing a helmet is compulsory on this site.', clave: 'HAVE', antes: 'You', despues: 'a helmet on this site.',
        aceptadas: ['have to wear'] },
      { frase: 'It was necessary for us to leave early.', clave: 'HAD', antes: 'We', despues: 'early.',
        aceptadas: ['had to leave'] },
      { frase: 'I could not swim until I was twelve.', clave: 'LEARNT', antes: 'It was not until I was twelve', despues: 'to swim.',
        aceptadas: ['that I learnt'] },
      { frase: 'Nobody obliged him to apologise.', clave: 'MADE', antes: 'He', despues: 'apologise.',
        aceptadas: ["wasn't made to", 'was not made to'] }
    ]
  },

  /* Area 9 · Ausencia de obligacion, que es donde se equivoca todo el mundo */
  'g8-transf': {
    tipo: 'transformacion', titulo: 'No hace falta · palabra clave',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'It is not necessary for you to come tomorrow.', clave: 'HAVE', antes: 'You', despues: 'tomorrow.',
        aceptadas: ["don't have to come", 'do not have to come'] },
      { frase: 'It was not necessary to book, though we did.', clave: 'NEED', antes: 'We', despues: ', though we did.',
        aceptadas: ["needn't have booked", 'need not have booked'] },
      { frase: 'There was no need to bring anything, and we brought nothing.', clave: 'HAVE', antes: 'We', despues: 'anything.',
        aceptadas: ["didn't have to bring", 'did not have to bring'] },
      { frase: 'Bringing your own laptop is optional.', clave: 'NEEDN’T', antes: 'You', despues: 'your own laptop.',
        aceptadas: ["needn't bring"] },
      { frase: 'Do not worry about the tickets; I have already bought them.', clave: 'NEED', antes: 'You', despues: 'about the tickets.',
        aceptadas: ["don't need to worry", 'do not need to worry'] },
      { frase: 'She took an umbrella, which turned out to be unnecessary.', clave: 'NEEDN’T', antes: 'She', despues: 'an umbrella.',
        aceptadas: ["needn't have taken"] }
    ]
  },

  /* Area 10 a 12 · Prohibicion, consejo, posibilidad y certeza */
  'g9-transf': {
    tipo: 'transformacion', titulo: 'Consejo y certeza · palabra clave',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'It was a mistake to lend him the car.', clave: 'HAVE', antes: 'You', despues: 'him the car.',
        aceptadas: ["shouldn't have lent", 'should not have lent'] },
      { frase: 'I am sure she forgot; it is the only explanation.', clave: 'MUST', antes: 'She', despues: '.',
        aceptadas: ['must have forgotten'] },
      { frase: 'It is impossible that he wrote this himself.', clave: 'HAVE', antes: 'He', despues: 'this himself.',
        aceptadas: ["can't have written", 'cannot have written'] },
      { frase: 'Smoking is not allowed anywhere in the building.', clave: 'MUSTN’T', antes: 'You', despues: 'anywhere in the building.',
        aceptadas: ["mustn't smoke"] },
      { frase: 'Perhaps she missed the train.', clave: 'MIGHT', antes: 'She', despues: 'the train.',
        aceptadas: ['might have missed'] },
      { frase: 'If I were you, I would speak to her today.', clave: 'BETTER', antes: 'You', despues: 'to her today.',
        aceptadas: ['had better speak', "'d better speak"] }
    ]
  },

  /* Area 13 a 15 · Pasiva, pasiva impersonal y causativa */
  'g10-transf': {
    tipo: 'transformacion', titulo: 'Pasivas y causativa · palabra clave',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'Someone is repairing my bike at the moment.', clave: 'BEING', antes: 'My bike', despues: 'at the moment.',
        aceptadas: ['is being repaired', "'s being repaired"] },
      { frase: 'A mechanic services my car every spring.', clave: 'HAVE', antes: 'I', despues: 'every spring.',
        aceptadas: ['have my car serviced'] },
      { frase: 'People say the building dates from the fifteenth century.', clave: 'SAID', antes: 'The building', despues: 'from the fifteenth century.',
        aceptadas: ['is said to date'] },
      { frase: 'They believe the thieves entered through the roof.', clave: 'BELIEVED', antes: 'The thieves', despues: 'through the roof.',
        aceptadas: ['are believed to have entered'] },
      { frase: 'Nobody has cleaned these windows for months.', clave: 'BEEN', antes: 'These windows', despues: 'for months.',
        aceptadas: ["haven't been cleaned", 'have not been cleaned'] },
      { frase: 'A thief stole her passport in Rome.', clave: 'HAD', antes: 'She', despues: 'in Rome.',
        aceptadas: ['had her passport stolen'] }
    ]
  },

  /* Area 16 a 18 · Condicionales, otros conectores e inversion */
  'g11-transf': {
    tipo: 'transformacion', titulo: 'Condicionales · palabra clave',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I did not know she was ill, so I did not call.', clave: 'HAD', antes: 'If I', despues: 'she was ill, I would have called.',
        aceptadas: ['had known'] },
      { frase: 'You can borrow it as long as you return it tonight.', clave: 'PROVIDED', antes: 'You can borrow it', despues: 'it tonight.',
        aceptadas: ['provided you return', 'provided that you return'] },
      { frase: 'If you should need anything, ring the bell.', clave: 'SHOULD', antes: '', despues: 'anything, ring the bell.',
        aceptadas: ['should you need'] },
      { frase: 'Without your help we would have failed.', clave: 'BEEN', antes: 'If it', despues: 'your help, we would have failed.',
        aceptadas: ["hadn't been for", 'had not been for'] },
      { frase: 'She will not pass unless she works harder.', clave: 'DOES', antes: 'She will not pass', despues: 'harder.',
        aceptadas: ['unless she does work', 'if she does not work'] },
      { frase: 'I am not tall, so I cannot reach the shelf.', clave: 'WERE', antes: 'If I', despues: ', I could reach the shelf.',
        aceptadas: ['were taller'] }
    ]
  },

  /* Area 19 a 21 · Comparaciones, wishes y unreal past */
  'g12-transf': {
    tipo: 'transformacion', titulo: 'Deseos y comparación · palabra clave',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I regret not studying music.', clave: 'WISH', antes: 'I', despues: 'music.',
        aceptadas: ['wish I had studied'] },
      { frase: 'It is a pity you cannot come.', clave: 'ONLY', antes: 'If', despues: 'come.',
        aceptadas: ['only you could'] },
      { frase: 'She would rather you did not smoke indoors.', clave: 'MIND', antes: 'She', despues: 'smoking outdoors.',
        aceptadas: ["wouldn't mind you", 'would not mind you'] },
      { frase: 'This winter is colder than last winter was.', clave: 'AS', antes: 'Last winter', despues: 'this one.',
        aceptadas: ["wasn't as cold as", 'was not as cold as'] },
      { frase: 'He talks to me as if he were my boss.', clave: 'THOUGH', antes: 'He talks to me', despues: 'my boss.',
        aceptadas: ['as though he were', 'as though he was'] },
      { frase: 'I am sorry I said that.', clave: 'HADN’T', antes: 'I wish', despues: 'that.',
        aceptadas: ["I hadn't said"] }
    ]
  },

  /* Area 22 a 24 · Relativo, so/such y estilo indirecto */
  'g13-transf': {
    tipo: 'transformacion', titulo: 'Estilo indirecto · palabra clave',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: '"I will call you on Sunday," she said.', clave: 'WOULD', antes: 'She said', despues: 'me on Sunday.',
        aceptadas: ['she would call'] },
      { frase: '"Why did you leave so early?" he asked me.', clave: 'HAD', antes: 'He asked me why I', despues: 'so early.',
        aceptadas: ['had left'] },
      { frase: '"Yes, I broke the window," admitted Marta.', clave: 'BREAKING', antes: 'Marta', despues: 'the window.',
        aceptadas: ['admitted breaking', 'admitted to breaking'] },
      { frase: '"Would you like to join us?" they said to her.', clave: 'INVITED', antes: 'They', despues: 'them.',
        aceptadas: ['invited her to join'] },
      { frase: '"Do not touch the wires," the engineer warned us.', clave: 'AGAINST', antes: 'The engineer', despues: 'the wires.',
        aceptadas: ['warned us against touching'] },
      { frase: 'Despite the traffic, they arrived on time.', clave: 'MANAGED', antes: 'Despite the traffic, they', despues: 'on time.',
        aceptadas: ['managed to arrive'] }
    ]
  },

  /* Area 25 · Cuantificadores, linkers e inversion */
  'g14-transf': {
    tipo: 'transformacion', titulo: 'Inversión y conectores · palabra clave',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I have never read a duller book.', clave: 'NEVER', antes: '', despues: 'a duller book.',
        aceptadas: ['never have I read'] },
      { frase: 'As soon as she sat down, the phone rang.', clave: 'SOONER', antes: 'No', despues: 'down than the phone rang.',
        aceptadas: ['sooner had she sat'] },
      { frase: 'The soup was too salty for me to eat.', clave: 'SUCH', antes: 'It was', despues: 'that I could not eat it.',
        aceptadas: ['such salty soup', 'such a salty soup'] },
      { frase: 'There is hardly any milk left.', clave: 'LITTLE', antes: 'There is', despues: 'left.',
        aceptadas: ['very little milk'] },
      { frase: 'Not only was he late, he was also rude.', clave: 'ONLY', antes: 'Not', despues: ', he was also rude.',
        aceptadas: ['only was he late'] },
      { frase: 'She realised the truth only then.', clave: 'DID', antes: 'Only then', despues: 'the truth.',
        aceptadas: ['did she realise'] }
    ]
  },

  /* Area 22 · Oraciones de relativo */
  'g15-transf': {
    tipo: 'transformacion', titulo: 'Oraciones de relativo · palabra clave',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'The woman lent me the book. She lives upstairs.', clave: 'WHO', antes: 'The woman', despues: 'lent me the book.',
        aceptadas: ['who lives upstairs'] },
      { frase: 'We stayed at a hotel. Its roof had a garden.', clave: 'WHOSE', antes: 'We stayed at a hotel', despues: 'a garden.',
        aceptadas: ['whose roof had'] },
      { frase: 'That is the café. I met her there.', clave: 'WHERE', antes: 'That is the café', despues: 'her.',
        aceptadas: ['where I met'] },
      { frase: 'He arrived very late, and that annoyed everyone.', clave: 'WHICH', antes: 'He arrived very late,', despues: 'everyone.',
        aceptadas: ['which annoyed'] },
      { frase: 'The reason for the delay was never explained to us.', clave: 'WHY', antes: 'Nobody explained the reason', despues: 'delayed.',
        aceptadas: ['why we were'] },
      { frase: 'I have three brothers and all of them live abroad.', clave: 'WHOM', antes: 'I have three brothers, all', despues: 'abroad.',
        aceptadas: ['of whom live'] }
    ]
  },

  /* Area 19 · Tipos de comparacion */
  'g16-transf': {
    tipo: 'transformacion', titulo: 'Comparaciones · palabra clave',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'The film was much worse than I expected.', clave: 'NEARLY', antes: 'The film was', despues: 'as I expected.',
        aceptadas: ['not nearly as good'] },
      { frase: 'The more he explained, the less I understood.', clave: 'LESS', antes: 'The more he explained,', despues: '.',
        aceptadas: ['the less I understood'] },
      { frase: 'No other restaurant here is as expensive as this one.', clave: 'MOST', antes: 'This is', despues: 'restaurant here.',
        aceptadas: ['the most expensive'] },
      { frase: 'Her second novel is not as good as her first.', clave: 'BETTER', antes: 'Her first novel', despues: 'her second.',
        aceptadas: ['is better than'] },
      { frase: 'Prices rose steadily throughout the year.', clave: 'HIGHER', antes: 'Prices got', despues: 'throughout the year.',
        aceptadas: ['higher and higher'] },
      { frase: 'This year’s results are similar to last year’s.', clave: 'MUCH', antes: 'This year’s results are', despues: 'last year’s.',
        aceptadas: ['much the same as'] }
    ]
  },

  /* Vocabulario · open cloze (parte 2 del examen: una sola palabra, sin pistas) */
  'v3-cloze': {
    tipo: 'cloze', titulo: 'Open cloze · el trabajo de pie',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Standing desks were sold, at first, on a promise that has since {1} rather quiet: that sitting was killing us and standing would fix it. The claim was never quite as solid {2} it looked. What the research actually showed was that people who sit for very long periods are less healthy than those who move, which is not the same thing {3} all.',
      'That has not stopped the desks from selling. Nor {4} it made them useless. Offices that installed them report fewer complaints about back pain, though whether this is {5} to the desks themselves or to the fact that people finally started getting up is anyone’s guess. In the {6} run, the lesson may simply be that furniture cannot do the walking for you.'
    ],
    items: [
      { aceptadas: ['gone', 'grown', 'fallen'] },
      { aceptadas: ['as'] },
      { aceptadas: ['at'] },
      { aceptadas: ['has'] },
      { aceptadas: ['due', 'down'] },
      { aceptadas: ['long'] }
    ]
  },

  'v4-cloze': {
    tipo: 'cloze', titulo: 'Open cloze · el ruido de la ciudad',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Noise is the pollutant nobody photographs. It leaves {1} trace on the landscape, and complaining about it sounds like a failure of character rather {2} a public health matter. Yet the evidence has been accumulating for decades, and it is no {3} possible to dismiss it as fussiness.',
      'Cities that have taken the problem {4} have found the solutions unglamorous: quieter road surfaces, lower speed limits, night-time restrictions on deliveries. None of these makes a mayor famous. But residents of the streets {5} question sleep better, and in the {6} of a cheap alternative, that will have to be enough.'
    ],
    items: [
      { aceptadas: ['no'] },
      { aceptadas: ['than'] },
      { aceptadas: ['longer'] },
      { aceptadas: ['seriously'] },
      { aceptadas: ['in'] },
      { aceptadas: ['absence'] }
    ]
  },

  /* Vocabulario · word formation (parte 3: se da la raiz) */
  'v3-formacion': {
    tipo: 'formacion', titulo: 'Word formation · sustantivos y adjetivos',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The new procedure has improved', despues: 'across the whole department.', raiz: 'EFFICIENT', aceptadas: ['efficiency'] },
      { antes: 'Her argument was completely', despues: 'and nobody could fault it.', raiz: 'FAULT', aceptadas: ['faultless'] },
      { antes: 'The instructions were so', despues: 'that half the class gave up.', raiz: 'CONFUSE', aceptadas: ['confusing'] },
      { antes: 'He was praised for his', despues: 'in admitting the mistake.', raiz: 'HONEST', aceptadas: ['honesty'] },
      { antes: 'The new bridge is a remarkable', despues: 'of engineering.', raiz: 'ACHIEVE', aceptadas: ['achievement'] },
      { antes: 'Their response was widely seen as', despues: '.', raiz: 'ADEQUATE', aceptadas: ['inadequate'] }
    ]
  },

  'v4-formacion': {
    tipo: 'formacion', titulo: 'Word formation · prefijos negativos',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The handwriting was almost', despues: 'after all those years.', raiz: 'LEGIBLE', aceptadas: ['illegible'] },
      { antes: 'It would be', despues: 'to travel without insurance.', raiz: 'WISE', aceptadas: ['unwise'] },
      { antes: 'She was accused of', despues: 'the figures.', raiz: 'REPRESENT', aceptadas: ['misrepresenting'] },
      { antes: 'The two accounts are entirely', despues: 'with each other.', raiz: 'CONSISTENT', aceptadas: ['inconsistent'] },
      { antes: 'His', despues: 'to help surprised everyone.', raiz: 'WILLING', aceptadas: ['unwillingness'] },
      { antes: 'The damage to the painting is', despues: '.', raiz: 'REVERSE', aceptadas: ['irreversible'] }
    ]
  },

  /* Vocabulario · cajas de palabras (phrasal verbs y preposiciones) */
  'v3-caja': {
    tipo: 'caja', titulo: 'Phrasal verbs · partículas',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['away', 'down', 'in', 'off', 'on', 'out', 'over', 'up'],
    items: [
      { antes: 'The meeting was called', despues: 'at the last minute.', aceptadas: ['off'] },
      { antes: 'We ran', despues: 'of coffee halfway through the morning.', aceptadas: ['out'] },
      { antes: 'He turned', despues: 'the job because of the hours.', aceptadas: ['down'] },
      { antes: 'She grew', despues: 'in a village near Durango.', aceptadas: ['up'] },
      { antes: 'Despite the interruptions, they carried', despues: 'working.', aceptadas: ['on'] },
      { antes: 'I need a day to think the offer', despues: '.', aceptadas: ['over'] }
    ]
  },

  'v4-caja': {
    tipo: 'caja', titulo: 'Preposiciones dependientes · adjetivos',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['about', 'at', 'for', 'from', 'in', 'of', 'on', 'to', 'with'],
    items: [
      { antes: 'She is not remotely interested', despues: 'politics.', aceptadas: ['in'] },
      { antes: 'The town is famous', despues: 'its Thursday market.', aceptadas: ['for'] },
      { antes: 'He is perfectly capable', despues: 'doing it alone.', aceptadas: ['of'] },
      { antes: 'They were very impressed', despues: 'her presentation.', aceptadas: ['with'] },
      { antes: 'This road is similar', despues: 'the one we took yesterday.', aceptadas: ['to'] },
      { antes: 'I am hopeless', despues: 'remembering birthdays.', aceptadas: ['at'] }
    ]
  },

  'v5-caja': {
    tipo: 'caja', titulo: 'Preposiciones dependientes · verbos',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['for', 'from', 'in', 'into', 'of', 'on', 'to', 'with'],
    items: [
      { antes: 'Nobody warned us', despues: 'the roadworks.', aceptadas: ['of'] },
      { antes: 'The whole plan depends', despues: 'the weather.', aceptadas: ['on'] },
      { antes: 'She apologised', despues: 'the delay.', aceptadas: ['for'] },
      { antes: 'Try not to confuse the two brothers', despues: 'each other.', aceptadas: ['with'] },
      { antes: 'They talked me', despues: 'buying a bigger car.', aceptadas: ['into'] },
      { antes: 'This bag belongs', despues: 'the woman by the window.', aceptadas: ['to'] }
    ]
  },

  'v6-caja': {
    tipo: 'caja', titulo: 'Expresiones hechas',
    instruccion: 'Complete each expression with a word from the box. There are more words than you need.',
    caja: ['blue', 'clockwork', 'cold', 'edge', 'hands', 'nutshell', 'thumb', 'weather'],
    items: [
      { antes: 'She has been feeling under the', despues: 'since Monday.', aceptadas: ['weather'] },
      { antes: 'The whole ceremony went like', despues: '.', aceptadas: ['clockwork'] },
      { antes: 'His resignation came right out of the', despues: '.', aceptadas: ['blue'] },
      { antes: 'To put it in a', despues: ', we cannot afford it.', aceptadas: ['nutshell'] },
      { antes: 'My father has always had green', despues: '.', aceptadas: ['thumb', 'hands'] },
      { antes: 'The interview left me on', despues: 'for a week.', aceptadas: ['edge'] }
    ]
  },

  'v7-caja': {
    tipo: 'caja', titulo: 'Colocaciones con verbos frecuentes',
    instruccion: 'Complete each sentence with a verb from the box. There are more verbs than you need.',
    caja: ['do', 'draw', 'give', 'make', 'pay', 'raise', 'reach', 'take'],
    items: [
      { antes: 'It took them all night to', despues: 'a decision.', aceptadas: ['reach', 'make'] },
      { antes: 'Nobody seemed to', despues: 'any attention to the warning.', aceptadas: ['pay'] },
      { antes: 'The report will', despues: 'serious doubts about the budget.', aceptadas: ['raise'] },
      { antes: 'Would you like me to', despues: 'the washing-up?', aceptadas: ['do'] },
      { antes: 'I need to', despues: 'a few notes before the meeting.', aceptadas: ['take'] },
      { antes: 'It is difficult to', despues: 'a line between the two cases.', aceptadas: ['draw'] }
    ]
  },

  'v8-caja': {
    tipo: 'caja', titulo: 'Phrasal verbs · segunda tanda',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['along', 'back', 'forward', 'in', 'off', 'through', 'together', 'up'],
    items: [
      { antes: 'The council has put', despues: 'a new plan for the square.', aceptadas: ['forward'] },
      { antes: 'They have never got', despues: 'particularly well.', aceptadas: ['along'] },
      { antes: 'We only got', despues: 'to the office at midnight.', aceptadas: ['back'] },
      { antes: 'She went', despues: 'the figures three times.', aceptadas: ['through'] },
      { antes: 'The lights went', despues: 'in the middle of the film.', aceptadas: ['off'] },
      { antes: 'It took months to put the exhibition', despues: '.', aceptadas: ['together'] }
    ]
  },

  'v5-cloze': {
    tipo: 'cloze', titulo: 'Open cloze · leer en papel',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Every few years someone announces that print is finished, and every few years it fails {1} die. The interesting question is not why paper survives but {2} it survives: readers who move between both formats report that they remember more of what they read on paper, and researchers have struggled to explain {3} away.',
      'One suggestion is that a physical book gives the reader a sense {4} where they are in the argument, something a screen flattens. Another is simply that screens invite interruption. Neither theory is settled, {5} both point in the same direction: the difference may have less to do {6} the paper than with the attention it happens to protect.'
    ],
    items: [
      { aceptadas: ['to'] },
      { aceptadas: ['why', 'how'] },
      { aceptadas: ['it', 'this'] },
      { aceptadas: ['of'] },
      { aceptadas: ['but', 'yet', 'though'] },
      { aceptadas: ['with'] }
    ]
  },

  'v6-cloze': {
    tipo: 'cloze', titulo: 'Open cloze · aprender de mayor',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'It is often said that adults cannot learn a language properly, and like most things that are often said, it is half true. Adults are worse {1} accent and better at almost everything else. They read faster, they grasp grammar sooner, and they know what they are trying to say, {2} is more than can be said for a child.',
      'What adults lack is not capacity {3} time, and the honesty to be bad at something in public. A seven-year-old will happily say a sentence wrong forty times {4} lunch. A forty-year-old will rehearse it silently and then say {5} at all. Nobody has yet found a method that removes this problem; the best teachers simply arrange matters {6} that being wrong costs nothing.'
    ],
    items: [
      { aceptadas: ['at'] },
      { aceptadas: ['which'] },
      { aceptadas: ['but'] },
      { aceptadas: ['before'] },
      { aceptadas: ['nothing'] },
      { aceptadas: ['so'] }
    ]
  },

  'v5-formacion': {
    tipo: 'formacion', titulo: 'Word formation · verbos y sustantivos',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The council refused to', despues: 'the decision despite the protests.', raiz: 'CONSIDER', aceptadas: ['reconsider'] },
      { antes: 'There has been a marked', despues: 'in air quality since 2020.', raiz: 'IMPROVE', aceptadas: ['improvement'] },
      { antes: 'Her', despues: 'of the poem was quite different from mine.', raiz: 'INTERPRET', aceptadas: ['interpretation'] },
      { antes: 'The machine needs to be', despues: 'once a year.', raiz: 'CALIBRATION', aceptadas: ['calibrated'] },
      { antes: 'He spoke with the', despues: 'of someone who had done it before.', raiz: 'CONFIDENT', aceptadas: ['confidence'] },
      { antes: 'The evidence they gathered proved', despues: '.', raiz: 'CONCLUDE', aceptadas: ['conclusive', 'inconclusive'] }
    ]
  },

  'v6-formacion': {
    tipo: 'formacion', titulo: 'Word formation · adverbios y adjetivos',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The scheme was', despues: 'expensive to run.', raiz: 'PROHIBIT', aceptadas: ['prohibitively'] },
      { antes: 'She answered', despues: ', as if the question bored her.', raiz: 'PATIENT', aceptadas: ['impatiently'] },
      { antes: 'The results were', despues: 'better than anyone had predicted.', raiz: 'CONSIDER', aceptadas: ['considerably'] },
      { antes: 'His explanation was frankly', despues: '.', raiz: 'BELIEVE', aceptadas: ['unbelievable'] },
      { antes: 'The two versions are practically', despues: '.', raiz: 'DISTINGUISH', aceptadas: ['indistinguishable'] },
      { antes: 'They were', despues: 'grateful for the help.', raiz: 'END', aceptadas: ['endlessly'] }
    ]
  },

  /* ---------- Gramatica ----------
     Escritas contra el temario de Elena (well-online-temario.md), area por
     area y en su orden. Las frases son nuevas: las suyas son una seleccion de
     paginas de internet y no pueden entrar aqui.
     Formato: key word transformation, que es el que ella usa casi siempre y el
     que mas discrimina. Entre dos y cinco palabras, la clave no se toca. */

  /* Area 1 · Present tenses */
  'g1-transf': {
    tipo: 'transformacion',
    titulo: 'Presentes · palabra clave',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I started working here in 2019 and I am still here.',
        clave: 'BEEN', antes: 'I', despues: 'here since 2019.',
        aceptadas: ['have been working', "'ve been working"] },
      { frase: 'This is the first time I have eaten octopus.',
        clave: 'NEVER', antes: 'I', despues: 'octopus before.',
        aceptadas: ['have never eaten', "'ve never eaten"] },
      { frase: 'My sister is in Lisbon at the moment, but only until June.',
        clave: 'LIVING', antes: 'My sister', despues: 'in Lisbon until June.',
        aceptadas: ['is living', "'s living"] },
      { frase: 'My flight is scheduled for six tomorrow morning.',
        clave: 'LEAVES', antes: 'According to the timetable, my flight', despues: 'tomorrow morning.',
        aceptadas: ['leaves at six'] },
      { frase: 'It is ages since we last spoke.',
        clave: 'SPOKEN', antes: 'We', despues: 'for ages.',
        aceptadas: ["haven't spoken", 'have not spoken'] },
      { frase: 'I arranged to meet Nerea on Friday and it is all settled.',
        clave: 'MEETING', antes: 'I', despues: 'on Friday.',
        aceptadas: ['am meeting Nerea', "'m meeting Nerea", 'am meeting her', "'m meeting her"] }
    ]
  },

  /* Area 2 · Past tenses */
  'g2-transf': {
    tipo: 'transformacion',
    titulo: 'Pasados · palabra clave',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'She finished the report and then went home.',
        clave: 'HAD', antes: 'She went home after she', despues: 'the report.',
        aceptadas: ['had finished'] },
      { frase: 'It was raining, and it had been doing so all morning.',
        clave: 'BEEN', antes: 'It', despues: 'all morning.',
        aceptadas: ['had been raining'] },
      { frase: 'I did not recognise him because we had last met many years before.',
        clave: 'SEEN', antes: 'I did not recognise him because I', despues: 'him for many years.',
        aceptadas: ["hadn't seen", 'had not seen'] },
      { frase: 'When I got to the station, my train had already left.',
        clave: 'BY', antes: 'My train had already left', despues: 'to the station.',
        aceptadas: ['by the time I got', 'by the time I arrived'] },
      { frase: 'They were halfway through dinner when the lights went out.',
        clave: 'HAVING', antes: 'They', despues: 'when the lights went out.',
        aceptadas: ['were having dinner'] },
      { frase: 'He smoked when he was younger, but he does not any more.',
        clave: 'USED', antes: 'He', despues: 'when he was younger.',
        aceptadas: ['used to smoke'] }
    ]
  },

  /* ---------- Reading, parte 5: multiple choice ----------
     Un texto largo y seis preguntas. Se pregunta por detalle, por actitud, por
     a que se refiere una frase y por el sentido global: si todas fueran de
     detalle, se aprobaria buscando palabras sueltas sin entender nada.
     Enunciados y opciones en ingles, como en el examen: en castellano se
     estaria midiendo traduccion. */
  't1-read5': {
    tipo: 'lectura',
    parte: 5,
    titulo: 'Reading · Part 5',
    instruccion: 'Read the text and choose the answer (A, B, C or D) which fits best according to the text.',
    tituloTexto: 'The trouble with remembering',
    texto: [
      'For most of the twentieth century, psychologists treated memory rather as a librarian treats a collection: things were filed away, occasionally mislaid, and retrieved more or less intact. That model has not survived contact with the evidence. Memory, it turns out, is less an archive than a workshop. Every time we recall something, we rebuild it — and the version we put back is subtly different from the one we took out.',
      'The consequences of this are more unsettling than they first appear. Elizabeth Loftus, whose work on eyewitness testimony reshaped the field, demonstrated that a single leading question could reliably alter what people believed they had seen. Participants shown a film of a car accident gave higher speed estimates when asked how fast the cars were going when they "smashed into" each other than when they "hit" each other. A week later, those given the word "smashed" were more likely to report broken glass. There had been no broken glass.',
      'What makes such findings difficult to accept is not the mechanism but the confidence that accompanies the error. We are not vaguely unsure about our false memories; we are certain of them, often more certain than we are of the accurate ones. Vividness, which feels like evidence, is nothing of the kind. A memory rehearsed many times acquires the texture of truth without acquiring any of its substance, and the rehearsal itself is what does the damage.',
      'This has been slow to filter into the institutions that depend on recollection. Courts still treat a witness who says "I will never forget that face" as more compelling than one who hedges, though the research points the other way: unhedged confidence, expressed long after the event, is a poor guide to accuracy. Some jurisdictions now record the witness’s confidence at the moment of first identification, before any feedback has had a chance to inflate it. It is a modest reform, and it works.',
      'Not everyone is persuaded that the picture is as bleak as the laboratory suggests. Critics point out that experiments typically concern trivial material — a film of an accident, a list of words — in which participants have little invested. Memory for events that mattered, they argue, behaves differently. The evidence here is genuinely mixed. Studies of so-called flashbulb memories, the ones people form on hearing shocking news, show that these decay much like ordinary memories while feeling, to their owners, entirely stable. Yet the same studies find that the central event is usually preserved even when the surrounding detail dissolves. People misremember where they were; they rarely misremember what happened.',
      'That distinction may be the most useful thing to come out of the field. It suggests that the right question is not whether memory can be trusted but which parts of it can. Gist survives; specifics drift. A friend recounting a holiday from a decade ago is probably reliable about the argument and unreliable about the restaurant. Treating the two as equally solid, or equally suspect, gets it wrong in both directions.',
      'None of this should be taken as an argument for abandoning our recollections, which would be both impossible and unwise. The reconstructive quality that makes memory unreliable is the same one that makes it useful: a system that stored the past exactly would be a system that could not generalise, and generalising is most of what thinking is. We remember badly for the same reason we think well. The sensible response is not despair but a certain lightness — holding our own accounts of the past a little less tightly than feels natural.'
    ],
    items: [
      { pregunta: '1  The comparison with a librarian in the first paragraph serves to',
        opciones: ['account for the way memories fade over time.',
                   'introduce a view of memory that the evidence has overturned.',
                   'argue that memory works better than is generally supposed.',
                   'describe how psychologists currently classify recollections.'],
        correcta: 1 },
      { pregunta: '2  What did the car accident study show?',
        opciones: ['Witnesses tend to overestimate speed when they see a collision.',
                   'People forget peripheral detail within about a week.',
                   'The wording of a question can insert something that never happened.',
                   'Those who saw broken glass recalled the scene more accurately.'],
        correcta: 2 },
      { pregunta: '3  What does the writer mean by "Vividness, which feels like evidence, is nothing of the kind"?',
        opciones: ['A sharp, detailed memory is no more likely to be accurate.',
                   'Vivid memories are unusually hard to put into words.',
                   'How vivid a memory feels depends on how often it is retold.',
                   'Physical evidence should always outweigh a witness account.'],
        correcta: 0 },
      { pregunta: '4  What is the writer’s attitude to the change in court procedure described in the fourth paragraph?',
        opciones: ['Sceptical — it has come too late to make any difference.',
                   'Critical — it leaves the underlying problem untouched.',
                   'Approving — it is a small measure that nonetheless works.',
                   'Detached — it is mentioned only as an example of foreign practice.'],
        correcta: 2 },
      { pregunta: '5  According to the fifth paragraph, memories of shocking events',
        opciones: ['hold up considerably better than everyday ones.',
                   'break down like any others, without seeming to.',
                   'have been shown by laboratory work to be invented.',
                   'are reliable only if they are written down at once.'],
        correcta: 1 },
      { pregunta: '6  What conclusion does the writer reach in the final paragraph?',
        opciones: ['We would be wise to distrust everything we remember.',
                   'Memory would serve us better if it stored the past exactly.',
                   'What makes memory fail is also what makes it worth having.',
                   'Important memories should be recorded before they drift.'],
        correcta: 2 }
    ]
  },

  /* ---------- Reading, parte 6: cross-text matching ----------
     Cuatro textos sobre lo mismo. Lo que se mide no es entender cada uno por
     separado, sino cruzarlos: quien coincide con quien y en que.
     Cada pregunta tiene una letra distinta a proposito. Cuando escribi la
     primera version, una de las preguntas no tenia respuesta correcta: pedia
     quien coincidia con A y resultaba que nadie. Conviene comprobarlo texto
     por texto, no de memoria. */
  't1-read6': {
    tipo: 'lectura',
    parte: 6,
    titulo: 'Reading · Part 6',
    instruccion: 'You will read four extracts in which specialists give their views on teaching programming at school. For each question, choose from the extracts A–D.',
    opcionesCortas: true,
    secciones: [
      { letra: 'A', titulo: 'Marisol Aguirre, professor of education',
        texto: ['The case for teaching children to code is usually made in economic terms: there will be jobs, and our pupils should be ready for them. I find this the weakest of the available arguments. Nobody can say with confidence what the labour market will want in fifteen years, and curricula built on such forecasts have an unhappy history. The better justification is intellectual. Writing a program forces a child to make her reasoning explicit and then watch it fail, publicly and without excuses. Very little else in school does that, and the habit of thinking in precise steps will outlast any particular language she learns.'] },
      { letra: 'B', titulo: 'Tomás Iriarte, software engineer',
        texto: ['Having spent twenty years writing code professionally, I am unconvinced that the classroom version resembles the activity in any useful way. What we actually do is mostly reading other people’s work, arguing about trade-offs and repairing things that already exist. What schools teach is the writing of small, clean programs from nothing, which is the part of the job that barely occurs. I would not object if the time came from nowhere, but it comes from somewhere — usually from subjects that are harder to justify to a minister and easier to cut. And on the economic case I am with the sceptics: we are preparing children for a market nobody can describe.'] },
      { letra: 'C', titulo: 'Nerea Basterra, secondary school head',
        texto: ['In my school we introduced programming five years ago and I would not go back. But I have stopped defending it on the grounds that it teaches transferable thinking. We looked hard for evidence that our coders had become better reasoners elsewhere — in mathematics, in argument — and there was none. What we did find was that a group of pupils who had never been good at anything academic discovered they were good at this, and that changed how they behaved in every other lesson. That is not a reason anyone puts in a policy document, and it is the reason I keep the subject.'] },
      { letra: 'D', titulo: 'Gorka Elorza, education economist',
        texto: ['Forecasting demand for particular skills is not the impossible exercise it is often said to be; the direction of travel has been clear for two decades and every projection points the same way. The mistake is not in predicting, it is in assuming that a school subject is how you meet the prediction. Most of what employers need is picked up on the job within months. What cannot be picked up within months is the underlying mathematics, and that is precisely what gets squeezed when a new subject arrives. Teach what is slow to acquire; let the fast things be acquired fast.'] }
    ],
    items: [
      { pregunta: '1  Which expert takes a different view from B on whether future skill needs can be predicted?',
        opciones: ['A', 'B', 'C', 'D'], correcta: 3 },
      { pregunta: '2  Which expert disagrees with A about programming improving reasoning in other subjects?',
        opciones: ['A', 'B', 'C', 'D'], correcta: 2 },
      { pregunta: '3  Which expert argues that what is taught in class bears little resemblance to the real work?',
        opciones: ['A', 'B', 'C', 'D'], correcta: 1 },
      { pregunta: '4  Which expert values programming for making a pupil’s reasoning fail where everyone can see it?',
        opciones: ['A', 'B', 'C', 'D'], correcta: 0 }
    ]
  },
  /* ---------- Reading, parte 7: gapped text ----------
     Un texto con seis parrafos quitados y siete para elegir: uno sobra. Lo que
     se mide es la cohesion — pronombres, conectores, referencias hacia atras —,
     no el vocabulario. Cada parrafo suelto tiene que enganchar por delante y
     por detras, y el sobrante tiene que ser plausible o el ejercicio se
     resuelve por descarte. */
  't1-read7': {
    tipo: 'lectura',
    parte: 7,
    titulo: 'Reading · Part 7',
    instruccion: 'Six paragraphs have been removed from the text. Choose from the paragraphs A–G the one which fits each gap. There is one extra paragraph which you do not need to use.',
    tituloTexto: 'The lighthouse keeper’s garden',
    texto: [
      'When Aileen Ross took the posting on Ardnamurchan in 1974, the handover notes ran to four pages and mentioned the garden only once, in a sentence she would remember for the rest of her life: "Nothing grows. Do not try."',
      '{1}',
      'The soil, when she found any, was three inches deep and sat on rock. Salt came over the wall in sheets during the winter gales, and what the salt spared the wind flattened. Her first season produced eleven potatoes, all of them the size of a thumbnail, and a row of lettuces that bolted before they were worth eating.',
      '{2}',
      'What changed things was not persistence but a conversation. A supply boat skipper mentioned, more or less in passing, that his grandmother had grown vegetables on Tiree behind a wall of gorse, and that the point of the gorse was not to block the wind but to slow it. Aileen had been building barriers. She began instead to build sieves.',
      '{3}',
      'By 1979 she was giving cabbages away. The keeper at the next station, who had been on the coast eleven years and had never planted anything, asked her to write down what she had done, and she found the request harder than she expected. Most of what she knew had no steps in it.',
      '{4}',
      'The lighthouse was automated in 1988 and the keepers were withdrawn. Aileen was fifty-one, and had spent fourteen years in a place that the notes had told her would grow nothing. She took cuttings of the escallonia, which had never been supposed to survive there either, and left everything else standing.',
      '{5}',
      'Visitors sometimes ask her whether she minded the automation, and she says she did not, which surprises them. The lighthouse was never hers. The garden was, in the sense that anything is: she had put in fourteen years and would not get them back, and something on that headland was different because of it.',
      '{6}',
      'It is still there. A walker sent her a photograph two summers ago — the wall, the gorse grown wild and enormous, and behind it a green so improbably deep that she had to be told twice where it had been taken.'
    ],
    secciones: [
      { letra: 'A', texto: ['She tried again the following year, and the year after that, with results that were marginally less humiliating each time. Her notebooks from that period are almost entirely a record of failure, written in the flat tone of somebody who has decided not to be discouraged in writing.'] },
      { letra: 'B', texto: ['She had read the sentence as a warning. It was closer to a dare, and by the end of that first week she had cleared a rectangle behind the north wall and was turning over ground that nobody appeared to have touched since the station was built in 1849.'] },
      { letra: 'C', texto: ['Nobody had told her what to expect, and she had not thought to ask. The keepers she replaced had left the station in good order in every respect that appeared on a form, and in no respect that did not.'] },
      { letra: 'D', texto: ['The distinction turned out to be everything. A solid wall throws wind over the top and drops it, accelerating, on whatever is behind. A hedge that leaks takes the force out of it gradually and lets nothing land hard. She spent that winter planting gorse she did not want in order to grow food she did.'] },
      { letra: 'E', texto: ['What she wrote in the end was four pages, which struck her as an unpleasant coincidence. She kept the first sentence deliberately close to the one she had been given, and changed only the instruction: "Almost nothing grows. Try anyway."'] },
      { letra: 'F', texto: ['She has never gone back. Two of her children have, separately, without telling her beforehand, and both came home with the same report: that the gorse had taken over completely and that the vegetable beds were long gone, but that the ground behind the wall was still the only green thing for a mile in any direction.'] },
      { letra: 'G', texto: ['Automation had been discussed for years on the coast, and most keepers had made their peace with it long before the notices arrived. The economics were not seriously disputed by anyone, including the people it put out of work.'] }
    ],
    opcionesCortas: true,
    items: [
      { pregunta: '1', opciones: ['A','B','C','D','E','F','G'], correcta: 1 },
      { pregunta: '2', opciones: ['A','B','C','D','E','F','G'], correcta: 0 },
      { pregunta: '3', opciones: ['A','B','C','D','E','F','G'], correcta: 3 },
      { pregunta: '4', opciones: ['A','B','C','D','E','F','G'], correcta: 4 },
      { pregunta: '5', opciones: ['A','B','C','D','E','F','G'], correcta: 6 },
      { pregunta: '6', opciones: ['A','B','C','D','E','F','G'], correcta: 5 }
    ]
  },

  /* ---------- Reading, parte 8: multiple matching ----------
     Diez preguntas y seis secciones: se salta de una a otra buscando. Es la
     parte que mas se parece a leer de verdad y la unica del Reading que vale
     un punto por pregunta en vez de dos. Varias secciones se repiten como
     respuesta a proposito: en el examen tambien pasa. */
  't1-read8': {
    tipo: 'lectura',
    parte: 8,
    titulo: 'Reading · Part 8',
    instruccion: 'You will read an article in which six people describe changing career after the age of forty. For each question, choose from the people A–F.',
    opcionesCortas: true,
    secciones: [
      { letra: 'A', titulo: 'Rafa, from accountancy to bread',
        texto: ['I did not leave because I hated it. That is the story people want and it was not mine — I was good at the work and I liked most of the people. What happened was that I turned forty-three and understood, in a single dull afternoon, that I could describe my next twenty years in detail, and that the description bored me. The bakery took four years to break even and my income has never recovered. I would not undo it, but I am careful now when younger colleagues ask me about it, because there is a version of this story that is basically an advertisement, and they deserve better than that.'] },
      { letra: 'B', titulo: 'Ingrid, from nursing to structural engineering',
        texto: ['Everyone assumed it was burnout and nobody believed me when I said it wasn’t. I had done nineteen years on wards and I could have done nineteen more. What I could not do was keep ignoring the fact that the part of the job I looked forward to was the equipment — how the beds were built, why the hoists failed. I did the degree part-time over five years while still on shifts, which I do not recommend to anybody. The hardest thing was not the mathematics, which I enjoyed. It was being twenty years older than everyone in the room and having to accept that this made me slower at some things, not wiser at all of them.'] },
      { letra: 'C', titulo: 'Malik, from law to teaching',
        texto: ['The money was the easy part, oddly. I had no children and a paid-off flat, so I could take the cut without much drama, and I know that is not a general condition. What caught me out was status. In the firm, people returned my calls within the hour. In my first year of teaching I could not get the photocopier fixed for a fortnight. I mention this because nobody warns you: you do not just change what you do, you change how the world responds when you ask for something, and that adjustment took me longer than learning to teach.'] },
      { letra: 'D', titulo: 'Sinéad, from journalism to carpentry',
        texto: ['I had assumed the physical work would be the shock and it turned out to be the relief. What I underestimated was the isolation. In a newsroom you are surrounded by people arguing all day; in a workshop you are alone with a machine that does not care what you think. It took two years to stop finding that unbearable, and now I would not swap it. My advice to anyone considering this is to be honest about which parts of your old job you were complaining about and which parts you were quietly living on.'] },
      { letra: 'E', titulo: 'Peter, from the army to horticulture',
        texto: ['I was told repeatedly that I had transferable skills and it was mostly nonsense. Some of it transferred — I turn up on time and I do not panic — but nobody in a garden centre needs what I actually spent twenty-two years becoming expert at. The retraining schemes assume you arrive with something to build on and I arrived with almost nothing. I got there in the end because a nursery owner in Perthshire was willing to take a fifty-year-old apprentice, which is a piece of luck and not a strategy. When people ask me how to do this I tell them the truth: find that person, because the system will not.'] },
      { letra: 'F', titulo: 'Chiara, from restaurant kitchens to software testing',
        texto: ['I went the other way from most people in these stories: out of something physical and into an office, and I am aware that this is supposed to be the sad direction. It is not. Twenty-six years of service left me with a shoulder that will not lift above my head and a marriage that had been conducted mostly by text message. I retrained at forty-seven through an online course I largely taught myself, and the thing that made it possible was that kitchens had already taught me how to work when tired and how to be told I was wrong without falling apart. Those were the transferable skills. Nobody lists them.'] }
    ],
    items: [
      { pregunta: '1  Who says that the advice usually given about changing career proved to be largely untrue in their case?',
        opciones: ['A','B','C','D','E','F'], correcta: 4 },
      { pregunta: '2  Who was surprised by how differently people treated them after the change?',
        opciones: ['A','B','C','D','E','F'], correcta: 2 },
      { pregunta: '3  Who denies that they were driven out by exhaustion?',
        opciones: ['A','B','C','D','E','F'], correcta: 1 },
      { pregunta: '4  Who mentions a lasting physical cost of their previous work?',
        opciones: ['A','B','C','D','E','F'], correcta: 5 },
      { pregunta: '5  Who is careful not to present their own experience as an example to follow?',
        opciones: ['A','B','C','D','E','F'], correcta: 0 },
      { pregunta: '6  Who found that the aspect of the change they had dreaded turned out to be welcome?',
        opciones: ['A','B','C','D','E','F'], correcta: 3 },
      { pregunta: '7  Who acknowledges that their circumstances made the financial side unusually manageable?',
        opciones: ['A','B','C','D','E','F'], correcta: 2 },
      { pregunta: '8  Who says that succeeding depended on one individual rather than on any system?',
        opciones: ['A','B','C','D','E','F'], correcta: 4 },
      { pregunta: '9  Who describes finding their age a disadvantage rather than an asset?',
        opciones: ['A','B','C','D','E','F'], correcta: 1 },
      { pregunta: '10  Who argues that what carried over from the old job was not what anyone would list?',
        opciones: ['A','B','C','D','E','F'], correcta: 5 }
    ]
  },

    "t1-lis2": {
      "tipo": "listening",
      "parte": 2,
      "titulo": "Una cartógrafa",
      "instruccion": "You will hear a woman talking about her work as a cartographer. Complete the sentences with <b>a word or short phrase</b>. <b>You will hear the recording twice.</b>",
      "audio": "audio/t1-lis2.mp3",
      "escuchas": 2,
      "items": [
        { "antes": "Ruth explains that most of her working day is spent in front of a", "despues": ".", "aceptadas": ["screen", "computer screen"] },
        { "antes": "The subject that pushed her towards this career was a module in", "despues": ".", "aceptadas": ["statistics"] },
        { "antes": "Her first employer published", "despues": "guides.", "aceptadas": ["walking"] },
        { "antes": "She says that job taught her", "despues": ".", "aceptadas": ["patience"] },
        { "antes": "According to Ruth, the hardest part of the job is deciding what to", "despues": ".", "aceptadas": ["leave out", "omit"] },
        { "antes": "Besides local councils, most of her recent commissions come from", "despues": ".", "aceptadas": ["hospitals"] },
        { "antes": "The mistake beginners make is using too many", "despues": ".", "aceptadas": ["colours", "colors"] },
        { "antes": "Her advice to newcomers is to learn to draw badly and", "despues": ".", "aceptadas": ["quickly", "fast"] }
      ]
    },
    "v1-writing1": {
      "tipo": "writing",
      "titulo": "Essay: ¿merece la pena aprender idiomas?",
      "instruccion": "Write <b>220–260 words</b>. Use your own words: do not copy phrases from the task.",
      "minutos": 45,
      "palabras": [220, 260],
      "enunciado": "Your class has watched a documentary about language learning. You have made the notes below.",
      "contexto": [
        "Reasons why fewer young people study foreign languages:",
        "· translation apps are good enough for everyday situations",
        "· English is already spoken almost everywhere",
        "· learning a language takes years of effort"
      ],
      "cierre": "Write an essay discussing two of the reasons in your notes. You should explain which reason you think is more important, giving reasons for your opinion.",
      "items": [{ "escrito": true }]
    },
    "v1-writing2": {
      "tipo": "writing",
      "titulo": "Review: una app para aprender idiomas",
      "instruccion": "Write <b>220–260 words</b>. A review is not only description: you have to judge, and recommend or not.",
      "minutos": 45,
      "palabras": [220, 260],
      "enunciado": "An international website is looking for reviews of language-learning apps.",
      "contexto": [
        "Write a review of an app you have used to learn a language.",
        "· explain what it does well and what it does badly",
        "· say what kind of learner it suits",
        "· decide whether you would recommend it"
      ],
      "items": [{ "escrito": true }]
    },
    "v1-speaking": {
      "tipo": "speaking",
      "titulo": "Long turn: aprender fuera de clase",
      "instruccion": "Speak for <b>one minute</b> without stopping. You do not have to cover everything: choose and compare.",
      "segundos": 60,
      "pregunta": "Why might people choose these ways of learning a language, and how effective is each one?",
      "puntos": [
        "watching series with subtitles at home",
        "a conversation exchange in a cafe",
        "an intensive course abroad"
      ],
      "nota": "En el examen real esto se hace con tres fotografías. Aquí van descritas mientras la academia no aporte las suyas.",
      "items": [{ "grabacion": true }]
    },
    "v1-opcion": {
      "tipo": "opcion",
      "titulo": "Por qué recordamos las caras",
      "instruccion": "Read the text and decide which answer best fits each gap.",
      "texto": [
        "Almost everyone has {1} the experience of recognising a face in the street and being completely unable to {2} the person's name. This is not a sign of a poor memory; it is simply how the brain is {3} up.",
        "A face is a rich image that connects to dozens of other memories, {4} a name is an arbitrary label with nothing behind it. Researchers have long been {5} in this asymmetry.",
        "In one well-known study, participants were given a set of photographs and, for each one, a name and a job to {6} by heart. They remembered the job far more often than the name. {7} both pieces of information were equally unfamiliar, only one of them meant anything, and meaning is precisely what a name {8}."
      ],
      "items": [
        { "opciones": ["made", "taken", "had", "done"], "correcta": 2 },
        { "opciones": ["recall", "remind", "memorise", "revise"], "correcta": 0 },
        { "opciones": ["put", "laid", "brought", "set"], "correcta": 3 },
        { "opciones": ["despite", "whereas", "instead", "besides"], "correcta": 1 },
        { "opciones": ["fascinated", "curious", "keen", "interested"], "correcta": 3 },
        { "opciones": ["know", "take", "learn", "hold"], "correcta": 2 },
        { "opciones": ["As though", "Even though", "So that", "Now that"], "correcta": 1 },
        { "opciones": ["lacks", "misses", "fails", "wants"], "correcta": 0 }
      ]
    },
    "v1-caja": {
      "tipo": "caja",
      "titulo": "Adjetivos y verbos con preposición",
      "instruccion": "Complete each sentence with a word from the box. There are more words than you need.",
      "caja": [
        "about",
        "at",
        "for",
        "from",
        "in",
        "of",
        "on",
        "to",
        "with"
      ],
      "items": [
        {
          "antes": "She's very good",
          "despues": "remembering names.",
          "aceptadas": [
            "at"
          ]
        },
        {
          "antes": "I'm not accustomed",
          "despues": "working nights.",
          "aceptadas": [
            "to"
          ]
        },
        {
          "antes": "He apologised",
          "despues": "arriving so late.",
          "aceptadas": [
            "for"
          ]
        },
        {
          "antes": "Our results are quite different",
          "despues": "theirs.",
          "aceptadas": [
            "from"
          ]
        },
        {
          "antes": "There's no point",
          "despues": "complaining now.",
          "aceptadas": [
            "in"
          ]
        },
        {
          "antes": "I'm terrified",
          "despues": "flying.",
          "aceptadas": [
            "of"
          ]
        },
        {
          "antes": "She insisted",
          "despues": "paying for dinner.",
          "aceptadas": [
            "on"
          ]
        },
        {
          "antes": "He's obsessed",
          "despues": "his new bike.",
          "aceptadas": [
            "with"
          ]
        }
      ]
    },
    "v1-cloze": {
      "tipo": "cloze",
      "titulo": "Aprender un idioma de adulto",
      "instruccion": "Write <b>one word</b> in each gap.",
      "texto": [
        "Learning a language as an adult {1} often described as a race against time. In fact, research suggests {2} opposite: adults are usually better {3} understanding grammar than children, and they make faster progress in the early stages.",
        "{4} children have is time, and a complete lack of embarrassment. Adults, {5} the other hand, worry about making mistakes, and it is that worry, rather than their memory, that slows them {6}.",
        "The good news is that this can be trained. Speak {7} little every day and the fear shrinks, even {8} your grammar stays exactly where it was for a while."
      ],
      "items": [
        {
          "aceptadas": [
            "is"
          ]
        },
        {
          "aceptadas": [
            "the"
          ]
        },
        {
          "aceptadas": [
            "at"
          ]
        },
        {
          "aceptadas": [
            "What"
          ]
        },
        {
          "aceptadas": [
            "on"
          ]
        },
        {
          "aceptadas": [
            "down"
          ]
        },
        {
          "aceptadas": [
            "a"
          ]
        },
        {
          "aceptadas": [
            "if",
            "though",
            "when"
          ]
        }
      ]
    },
    "v1-formacion": {
      "tipo": "formacion",
      "titulo": "Sufijos y prefijos frecuentes",
      "instruccion": "Use the word given in capitals to form a word that fits in the gap.",
      "items": [
        {
          "antes": "The instructions were completely",
          "despues": ".",
          "raiz": "USE",
          "aceptadas": [
            "useless"
          ]
        },
        {
          "antes": "She gave a very",
          "despues": "answer.",
          "raiz": "CONVINCE",
          "aceptadas": [
            "convincing"
          ]
        },
        {
          "antes": "His",
          "despues": "to the team was obvious from day one.",
          "raiz": "COMMIT",
          "aceptadas": [
            "commitment"
          ]
        },
        {
          "antes": "There has been a steady",
          "despues": "in prices.",
          "raiz": "GROW",
          "aceptadas": [
            "growth"
          ]
        },
        {
          "antes": "It's absolutely",
          "despues": "that nobody noticed.",
          "raiz": "BELIEVE",
          "aceptadas": [
            "unbelievable"
          ]
        },
        {
          "antes": "They live in a quiet",
          "despues": "area.",
          "raiz": "RESIDENCE",
          "aceptadas": [
            "residential"
          ]
        },
        {
          "antes": "He spoke with great",
          "despues": ".",
          "raiz": "CONFIDENT",
          "aceptadas": [
            "confidence"
          ]
        },
        {
          "antes": "The film was a huge",
          "despues": ".",
          "raiz": "DISAPPOINT",
          "aceptadas": [
            "disappointment"
          ]
        }
      ]
    },
    "v1-transf": {
      "tipo": "transformacion",
      "titulo": "Frases con palabra clave",
      "instruccion": "Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.",
      "items": [
        {
          "frase": "It is five years since I last visited Bilbao.",
          "clave": "BEEN",
          "antes": "I",
          "despues": "Bilbao for five years.",
          "aceptadas": [
            "haven't been to",
            "have not been to"
          ]
        },
        {
          "frase": "\"Don’t touch the paint,\" she said to me.",
          "clave": "NOT",
          "antes": "She told me",
          "despues": "the paint.",
          "aceptadas": [
            "not to touch"
          ]
        },
        {
          "frase": "Somebody stole my bike last night.",
          "clave": "HAD",
          "antes": "I",
          "despues": "last night.",
          "aceptadas": [
            "had my bike stolen"
          ]
        },
        {
          "frase": "The day was so cold that we stayed indoors.",
          "clave": "SUCH",
          "antes": "It was",
          "despues": "that we stayed indoors.",
          "aceptadas": [
            "such a cold day"
          ]
        },
        {
          "frase": "I regret not studying more at school.",
          "clave": "WISH",
          "antes": "I",
          "despues": "more at school.",
          "aceptadas": [
            "wish I had studied",
            "wish I'd studied"
          ]
        },
        {
          "frase": "They will probably cancel the concert.",
          "clave": "LIKELY",
          "antes": "The concert",
          "despues": "cancelled.",
          "aceptadas": [
            "is likely to be"
          ]
        }
      ]
    },
    "v2-caja": {
      "tipo": "caja",
      "titulo": "Partículas de phrasal verbs",
      "instruccion": "Complete each sentence with a word from the box. There are more words than you need.",
      "caja": [
        "away",
        "back",
        "down",
        "into",
        "off",
        "out",
        "over",
        "through",
        "up"
      ],
      "items": [
        {
          "antes": "Could you turn the music",
          "despues": "? It's too loud.",
          "aceptadas": [
            "down"
          ]
        },
        {
          "antes": "The meeting was called",
          "despues": "at the last minute.",
          "aceptadas": [
            "off"
          ]
        },
        {
          "antes": "She's trying to give",
          "despues": "smoking.",
          "aceptadas": [
            "up"
          ]
        },
        {
          "antes": "I ran",
          "despues": "an old friend at the station.",
          "aceptadas": [
            "into"
          ]
        },
        {
          "antes": "We've run",
          "despues": "of milk again.",
          "aceptadas": [
            "out"
          ]
        },
        {
          "antes": "He got",
          "despues": "the flu in a couple of days.",
          "aceptadas": [
            "over"
          ]
        },
        {
          "antes": "Don't throw those papers",
          "despues": "; I still need them.",
          "aceptadas": [
            "away"
          ]
        },
        {
          "antes": "I'll call you",
          "despues": "as soon as I get home.",
          "aceptadas": [
            "back"
          ]
        }
      ]
    },
    "v2-cloze": {
      "tipo": "cloze",
      "titulo": "La memoria se entrena",
      "instruccion": "Write <b>one word</b> in each gap.",
      "texto": [
        "Most people assume that a good memory is something you {1} born with. Trainers disagree. {2} to them, memory works like a muscle: the more you use it, the {3} it gets.",
        "The trick is not repeating a list over and {4} again, but connecting each new item {5} something you already know. {6} you do that, the information has somewhere to live.",
        "It {7} take long, and ten minutes a day is plenty, {8} it does take patience."
      ],
      "items": [
        {
          "aceptadas": [
            "are"
          ]
        },
        {
          "aceptadas": [
            "According"
          ]
        },
        {
          "aceptadas": [
            "better",
            "stronger"
          ]
        },
        {
          "aceptadas": [
            "over"
          ]
        },
        {
          "aceptadas": [
            "to",
            "with"
          ]
        },
        {
          "aceptadas": [
            "If",
            "Once",
            "When"
          ]
        },
        {
          "aceptadas": [
            "doesn't",
            "does not"
          ]
        },
        {
          "aceptadas": [
            "but"
          ]
        }
      ]
    },
    "v2-transf": {
      "tipo": "transformacion",
      "titulo": "Frases con palabra clave",
      "instruccion": "Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.",
      "items": [
        {
          "frase": "\"I'm sorry I didn't call you,\" he said.",
          "clave": "APOLOGISED",
          "antes": "He",
          "despues": "me.",
          "aceptadas": [
            "apologised for not calling"
          ]
        },
        {
          "frase": "They still have not finished the report.",
          "clave": "STILL",
          "antes": "The report",
          "despues": "finished.",
          "aceptadas": [
            "has still not been",
            "still hasn't been",
            "still has not been"
          ]
        },
        {
          "frase": "It is not necessary to book a table.",
          "clave": "NEED",
          "antes": "You",
          "despues": "a table.",
          "aceptadas": [
            "don't need to book",
            "do not need to book"
          ]
        },
        {
          "frase": "I last saw him in June.",
          "clave": "SINCE",
          "antes": "I",
          "despues": "June.",
          "aceptadas": [
            "haven't seen him since",
            "have not seen him since"
          ]
        },
        {
          "frase": "Someone is repairing the roof at the moment.",
          "clave": "BEING",
          "antes": "The roof",
          "despues": "at the moment.",
          "aceptadas": [
            "is being repaired"
          ]
        },
        {
          "frase": "He did not tell me, so I did not know.",
          "clave": "TOLD",
          "antes": "If he",
          "despues": "me, I would have known.",
          "aceptadas": [
            "had told"
          ]
        }
      ]
    },

  /* ===================== TEST 3 · GRAMATICA =====================
     Tercera vuelta al temario de Elena, en su orden. Frases nuevas. */

  't3-gram1': {
    tipo: 'transformacion', titulo: 'Presentes · tercera vuelta',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'Nobody has repaired that gate for years.', clave: 'BEEN', antes: 'That gate', despues: 'for years.', aceptadas: ["hasn't been repaired", 'has not been repaired'] },
      { frase: 'He keeps interrupting, and it is starting to irritate me.', clave: 'ALWAYS', antes: 'He', despues: ', which is starting to irritate me.', aceptadas: ['is always interrupting', "'s always interrupting"] },
      { frase: 'This is my third attempt at the exam.', clave: 'TAKEN', antes: 'I', despues: 'the exam three times.', aceptadas: ['have now taken', "'ve now taken", 'have taken'] },
      { frase: 'The results come out on the fifth of every month.', clave: 'PUBLISHED', antes: 'The results', despues: 'the fifth of every month.', aceptadas: ['are published on'] },
      { frase: 'She has been at that desk since seven this morning.', clave: 'SITTING', antes: 'She', despues: 'at that desk since seven.', aceptadas: ['has been sitting', "'s been sitting"] },
      { frase: 'I am not familiar with this software yet.', clave: 'GOT', antes: 'I', despues: 'to this software yet.', aceptadas: ["haven't got used", 'have not got used'] }
    ]
  },

  't3-gram2': {
    tipo: 'transformacion', titulo: 'Pasados · tercera vuelta',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'He arrived, and the meeting had already begun.', clave: 'STARTED', antes: 'The meeting', despues: 'he arrived.', aceptadas: ['had already started when', 'had started before'] },
      { frase: 'I was cycling home when the storm broke.', clave: 'WAY', antes: 'I was on', despues: 'when the storm broke.', aceptadas: ['my way home'] },
      { frase: 'She spent two hours looking for it before giving up.', clave: 'BEEN', antes: 'She', despues: 'for two hours when she gave up.', aceptadas: ['had been looking'] },
      { frase: 'They did not tell me about the change.', clave: 'INFORMED', antes: 'I', despues: 'the change.', aceptadas: ["wasn't informed of", 'was not informed of', "wasn't informed about"] },
      { frase: 'It was the worst holiday I had ever had.', clave: 'NEVER', antes: 'I', despues: 'a worse holiday.', aceptadas: ['had never had'] },
      { frase: 'The rain started, and shortly afterwards we left.', clave: 'SOON', antes: 'We left', despues: 'the rain started.', aceptadas: ['soon after'] }
    ]
  },

  't3-gram3': {
    tipo: 'transformacion', titulo: 'Futuro · tercera vuelta',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'The shop shuts in ten minutes, so we should hurry.', clave: 'POINT', antes: 'The shop is on', despues: ', so we should hurry.', aceptadas: ['the point of closing'] },
      { frase: 'They intend to publish the findings next spring.', clave: 'DUE', antes: 'The findings', despues: 'next spring.', aceptadas: ['are due to be published'] },
      { frase: 'I doubt the parcel will arrive before Friday.', clave: 'UNLIKELY', antes: 'The parcel', despues: 'before Friday.', aceptadas: ['is unlikely to arrive'] },
      { frase: 'By Christmas she will have worked here for a decade.', clave: 'BEEN', antes: 'By Christmas she', despues: 'here for a decade.', aceptadas: ['will have been working'] },
      { frase: 'Ring me after you have spoken to him.', clave: 'ONCE', antes: 'Ring me', despues: 'to him.', aceptadas: ['once you have spoken', "once you've spoken"] },
      { frase: 'There is no chance of them agreeing to that.', clave: 'WAY', antes: 'There is', despues: 'agree to that.', aceptadas: ['no way they will', 'no way they would'] }
    ]
  },

  't3-gram4': {
    tipo: 'transformacion', titulo: 'Repaso de tiempos · tercera vuelta',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I last spoke to her at the wedding.', clave: 'SINCE', antes: 'I have not', despues: 'the wedding.', aceptadas: ['spoken to her since'] },
      { frase: 'The kitchen is being painted at the moment.', clave: 'HAVING', antes: 'We', despues: 'at the moment.', aceptadas: ['are having the kitchen painted', "'re having the kitchen painted"] },
      { frase: 'He had already eaten when I offered him lunch.', clave: 'BY', antes: 'He had eaten', despues: 'him lunch.', aceptadas: ['by the time I offered'] },
      { frase: 'It has been three weeks since the last delivery.', clave: 'DELIVERED', antes: 'Nothing', despues: 'three weeks.', aceptadas: ['has been delivered for', 'has been delivered in'] },
      { frase: 'They will still be discussing it at midnight.', clave: 'BE', antes: 'At midnight they', despues: 'it.', aceptadas: ['will still be discussing'] },
      { frase: 'I have not seen that film, though I keep meaning to.', clave: 'YET', antes: 'I', despues: 'that film, though I keep meaning to.', aceptadas: ['have not yet seen', "haven't yet seen"] }
    ]
  },

  't3-gram5': {
    tipo: 'transformacion', titulo: 'Costumbres · tercera vuelta',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'Working from home no longer feels strange to me.', clave: 'USED', antes: 'I', despues: 'from home.', aceptadas: ['am used to working', "'m used to working"] },
      { frase: 'Every summer we drove to the same village.', clave: 'WOULD', antes: 'Every summer we', despues: 'to the same village.', aceptadas: ['would drive'] },
      { frase: 'She is gradually adapting to the new software.', clave: 'GETTING', antes: 'She is gradually', despues: 'the new software.', aceptadas: ['getting used to'] },
      { frase: 'I played the guitar as a teenager but stopped.', clave: 'USED', antes: 'I', despues: 'the guitar as a teenager.', aceptadas: ['used to play'] },
      { frase: 'The noise from the road no longer wakes them.', clave: 'ACCUSTOMED', antes: 'They have become', despues: 'from the road.', aceptadas: ['accustomed to the noise'] },
      { frase: 'There was never a bank on this street.', clave: 'BE', antes: 'There', despues: 'a bank on this street.', aceptadas: ['never used to be'] }
    ]
  },

  't3-gram6': {
    tipo: 'transformacion', titulo: 'Modales · poder y deber',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'Despite the fog, they landed safely.', clave: 'MANAGED', antes: 'Despite the fog, they', despues: 'safely.', aceptadas: ['managed to land'] },
      { frase: 'Passengers are obliged to keep their belts fastened.', clave: 'MUST', antes: 'Passengers', despues: 'their belts fastened.', aceptadas: ['must keep'] },
      { frase: 'I was not capable of finishing it alone.', clave: 'ABLE', antes: 'I', despues: 'it alone.', aceptadas: ["wasn't able to finish", 'was not able to finish'] },
      { frase: 'It is up to you whether you come.', clave: 'HAVE', antes: 'You', despues: 'if you do not want to.', aceptadas: ["don't have to come", 'do not have to come'] },
      { frase: 'Handing it in late is not permitted.', clave: 'ALLOWED', antes: 'You', despues: 'it in late.', aceptadas: ["aren't allowed to hand", 'are not allowed to hand'] },
      { frase: 'It was not necessary for you to wait.', clave: 'NEED', antes: 'You', despues: '.', aceptadas: ["needn't have waited", 'need not have waited'] }
    ]
  },

  't3-gram7': {
    tipo: 'transformacion', titulo: 'Deducciones sobre el pasado',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I am certain nobody told him.', clave: 'HAVE', antes: 'Nobody', despues: 'him.', aceptadas: ['can have told'] },
      { frase: 'The obvious explanation is that she left early.', clave: 'MUST', antes: 'She', despues: 'early.', aceptadas: ['must have left'] },
      { frase: 'Possibly they misread the instructions.', clave: 'MAY', antes: 'They', despues: 'the instructions.', aceptadas: ['may have misread'] },
      { frase: 'It is not possible that he walked here in ten minutes.', clave: 'HAVE', antes: 'He', despues: 'here in ten minutes.', aceptadas: ["can't have walked", 'cannot have walked'] },
      { frase: 'Perhaps I left my keys in the car.', clave: 'MIGHT', antes: 'I', despues: 'my keys in the car.', aceptadas: ['might have left'] },
      { frase: 'I am sure that was not deliberate.', clave: 'BEEN', antes: 'That', despues: 'deliberate.', aceptadas: ["can't have been", 'cannot have been'] }
    ]
  },

  't3-gram8': {
    tipo: 'transformacion', titulo: 'Consejo y crítica',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'It was careless of them to leave it unlocked.', clave: 'HAVE', antes: 'They', despues: 'it unlocked.', aceptadas: ["shouldn't have left", 'should not have left'] },
      { frase: 'The sensible thing would be to ask first.', clave: 'BETTER', antes: 'You', despues: 'first.', aceptadas: ['had better ask', "'d better ask"] },
      { frase: 'Why did you not say something at the time?', clave: 'OUGHT', antes: 'You', despues: 'something at the time.', aceptadas: ['ought to have said'] },
      { frase: 'I regret buying the cheaper one.', clave: 'WISH', antes: 'I', despues: 'the cheaper one.', aceptadas: ["wish I hadn't bought", 'wish I had not bought'] },
      { frase: 'Perhaps you could try turning it off and on.', clave: 'WORTH', antes: 'It might', despues: 'off and on.', aceptadas: ['be worth turning it'] },
      { frase: 'Telling her was a mistake, as it turned out.', clave: 'SHOULD', antes: 'As it turned out, I', despues: 'her.', aceptadas: ["shouldn't have told", 'should not have told'] }
    ]
  },

  't3-gram9': {
    tipo: 'transformacion', titulo: 'Voz pasiva · tercera vuelta',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'Someone will meet you at the airport.', clave: 'MET', antes: 'You', despues: 'at the airport.', aceptadas: ['will be met'] },
      { frase: 'They are still investigating the cause.', clave: 'BEING', antes: 'The cause', despues: 'investigated.', aceptadas: ['is still being'] },
      { frase: 'Nobody had warned us about the delay.', clave: 'WARNED', antes: 'We', despues: 'about the delay.', aceptadas: ["hadn't been warned", 'had not been warned'] },
      { frase: 'You cannot take photographs inside the chapel.', clave: 'TAKEN', antes: 'Photographs', despues: 'inside the chapel.', aceptadas: ["can't be taken", 'cannot be taken'] },
      { frase: 'They gave the winner a medal.', clave: 'AWARDED', antes: 'The winner', despues: 'a medal.', aceptadas: ['was awarded'] },
      { frase: 'The council is going to demolish the old cinema.', clave: 'DEMOLISHED', antes: 'The old cinema is going', despues: 'by the council.', aceptadas: ['to be demolished'] }
    ]
  },

  't3-gram10': {
    tipo: 'transformacion', titulo: 'Pasivas impersonales',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'People say the house is haunted.', clave: 'SAID', antes: 'The house', despues: 'haunted.', aceptadas: ['is said to be'] },
      { frase: 'Everyone believes he left the country.', clave: 'BELIEVED', antes: 'He', despues: 'the country.', aceptadas: ['is believed to have left'] },
      { frase: 'They report that two people are missing.', clave: 'REPORTED', antes: 'It', despues: 'two people are missing.', aceptadas: ['is reported that'] },
      { frase: 'Experts think the painting is a forgery.', clave: 'THOUGHT', antes: 'The painting', despues: 'a forgery.', aceptadas: ['is thought to be'] },
      { frase: 'People used to consider this street dangerous.', clave: 'CONSIDERED', antes: 'This street', despues: 'dangerous.', aceptadas: ['used to be considered'] },
      { frase: 'Nobody knows where the money went.', clave: 'KNOWN', antes: 'It', despues: 'where the money went.', aceptadas: ["isn't known", 'is not known'] }
    ]
  },

  't3-gram11': {
    tipo: 'transformacion', titulo: 'Causativa · que te lo hagan',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'A mechanic services my car every autumn.', clave: 'HAVE', antes: 'I', despues: 'every autumn.', aceptadas: ['have my car serviced'] },
      { frase: 'Someone stole her bike last week.', clave: 'HAD', antes: 'She', despues: 'last week.', aceptadas: ['had her bike stolen'] },
      { frase: 'We are paying someone to redecorate the hall.', clave: 'GETTING', antes: 'We are', despues: 'redecorated.', aceptadas: ['getting the hall'] },
      { frase: 'I must arrange for someone to check the boiler.', clave: 'CHECKED', antes: 'I must', despues: '.', aceptadas: ['have the boiler checked', 'get the boiler checked'] },
      { frase: 'The dentist took out two of his teeth.', clave: 'HAD', antes: 'He', despues: 'out.', aceptadas: ['had two teeth taken'] },
      { frase: 'They are going to install a new lift for us.', clave: 'HAVING', antes: 'We are', despues: 'installed.', aceptadas: ['having a new lift'] }
    ]
  },

  't3-gram12': {
    tipo: 'transformacion', titulo: 'Condicionales · los tres tipos y las mezclas',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I did not book early, so the flight cost a fortune.', clave: 'HAD', antes: 'If I', despues: ', the flight would have been cheaper.', aceptadas: ['had booked early'] },
      { frase: 'She is not here, so she cannot sign it.', clave: 'WERE', antes: 'If she', despues: ', she could sign it.', aceptadas: ['were here'] },
      { frase: 'He missed the train because he overslept.', clave: 'NOT', antes: 'If he had', despues: ', he would not have missed the train.', aceptadas: ['not overslept'] },
      { frase: 'I am tired today because I worked late last night.', clave: 'WOULD', antes: 'If I had not worked late last night, I', despues: 'so tired today.', aceptadas: ["wouldn't be", 'would not be'] },
      { frase: 'Take an umbrella; it might rain.', clave: 'CASE', antes: 'Take an umbrella', despues: 'rains.', aceptadas: ['in case it'] },
      { frase: 'Without your help I would have failed.', clave: 'HELPED', antes: 'If you', despues: ', I would have failed.', aceptadas: ["hadn't helped me", 'had not helped me'] }
    ]
  },

  't3-gram13': {
    tipo: 'transformacion', titulo: 'Condicionales sin <i>if</i>',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'If I had known about the strike, I would have driven.', clave: 'HAD', antes: 'I would have driven', despues: 'about the strike.', aceptadas: ['had I known'] },
      { frase: 'You can borrow it if you return it by Friday.', clave: 'LONG', antes: 'You can borrow it', despues: 'you return it by Friday.', aceptadas: ['as long as'] },
      { frase: 'We will go ahead if the weather is fine.', clave: 'PROVIDED', antes: 'We will go ahead', despues: 'fine.', aceptadas: ['provided the weather is'] },
      { frase: 'If you do not pay now, the offer expires.', clave: 'UNLESS', antes: 'The offer expires', despues: 'now.', aceptadas: ['unless you pay'] },
      { frase: 'If the council approved it, work would start in May.', clave: 'WERE', antes: 'Work would start in May,', despues: 'to approve it.', aceptadas: ['were the council'] },
      { frase: 'If it had not been for Ana, we would have got lost.', clave: 'NOT', antes: 'Had it', despues: 'for Ana, we would have got lost.', aceptadas: ['not been'] }
    ]
  },

  't3-gram14': {
    tipo: 'transformacion', titulo: 'Deseos y lamentos',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I regret not studying languages at school.', clave: 'WISH', antes: 'I', despues: 'languages at school.', aceptadas: ['wish I had studied'] },
      { frase: 'It is a pity you cannot come.', clave: 'ONLY', antes: 'If', despues: 'come.', aceptadas: ['only you could'] },
      { frase: 'I would rather you did not mention it.', clave: 'PREFER', antes: 'I', despues: 'mention it.', aceptadas: ['would prefer you not to', "'d prefer you not to"] },
      { frase: 'She is annoyed that the shop closed so early.', clave: 'WISHES', antes: 'She', despues: 'closed so early.', aceptadas: ["wishes the shop hadn't", 'wishes the shop had not'] },
      { frase: 'It is time for us to leave.', clave: 'WENT', antes: 'It is time', despues: '.', aceptadas: ['we went'] },
      { frase: 'I would rather be at home now.', clave: 'WERE', antes: 'I wish', despues: 'at home now.', aceptadas: ['I were'] }
    ]
  },

  't3-gram15': {
    tipo: 'transformacion', titulo: 'Relativo, comparación y <i>so / such</i>',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'The film was so long that we left early.', clave: 'SUCH', antes: 'It was', despues: 'that we left early.', aceptadas: ['such a long film'] },
      { frase: 'The queue was very long, so we gave up.', clave: 'SO', antes: 'The queue was', despues: 'we gave up.', aceptadas: ['so long that'] },
      { frase: 'We stayed in a flat and its owner lives in Lisbon.', clave: 'WHOSE', antes: 'We stayed in a flat', despues: 'lives in Lisbon.', aceptadas: ['whose owner'] },
      { frase: 'This is the most confusing form I have ever filled in.', clave: 'MORE', antes: 'I have never filled in', despues: 'form.', aceptadas: ['a more confusing'] },
      { frase: 'The house was much smaller than I remembered.', clave: 'NEARLY', antes: 'The house was', despues: 'as I remembered.', aceptadas: ['not nearly as big'] },
      { frase: 'The manager, who I had never met, apologised.', clave: 'WHOM', antes: 'The manager,', despues: 'met, apologised.', aceptadas: ['whom I had never'] }
    ]
  },

  't3-gram16': {
    tipo: 'transformacion', titulo: 'Estilo indirecto e inversión enfática',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: '"You broke the window," said the caretaker.', clave: 'ACCUSED', antes: 'The caretaker', despues: 'the window.', aceptadas: ['accused me of breaking'] },
      { frase: '"I will pay for the damage," she said.', clave: 'OFFERED', antes: 'She', despues: 'for the damage.', aceptadas: ['offered to pay'] },
      { frase: '"Do not touch the wires," the engineer told us.', clave: 'WARNED', antes: 'The engineer', despues: 'the wires.', aceptadas: ['warned us not to touch'] },
      { frase: 'I have never heard such nonsense.', clave: 'HAVE', antes: 'Never', despues: 'such nonsense.', aceptadas: ['have I heard'] },
      { frase: 'She only realised her mistake when she got home.', clave: 'UNTIL', antes: 'Not', despues: 'home did she realise her mistake.', aceptadas: ['until she got'] },
      { frase: 'They had barely started when the lights failed.', clave: 'SOONER', antes: 'No', despues: 'started than the lights failed.', aceptadas: ['sooner had they'] }
    ]
  },


  /* ===================== TEST 3 · VOCABULARIO ===================== */

  't3-voc1': {
    tipo: 'caja', titulo: 'Preposiciones tras sustantivo · tercera vuelta',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['against', 'between', 'for', 'from', 'in', 'of', 'on', 'to'],
    items: [
      { antes: 'There is a growing demand', despues: 'shorter contracts.', aceptadas: ['for'] },
      { antes: 'She has an excellent grasp', despues: 'the material.', aceptadas: ['of'] },
      { antes: 'The link', despues: 'the two cases is not obvious.', aceptadas: ['between'] },
      { antes: 'They have no objection', despues: 'the proposal.', aceptadas: ['to'] },
      { antes: 'He has a strong prejudice', despues: 'anything modern.', aceptadas: ['against'] },
      { antes: 'The recipe suggests a substitute', despues: 'butter.', aceptadas: ['for'] }
    ]
  },

  't3-voc2': {
    tipo: 'caja', titulo: 'Phrasal verbs · seguir y abandonar',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['back', 'down', 'into', 'off', 'on', 'out', 'through', 'up'],
    items: [
      { antes: 'She refused to back', despues: 'despite the pressure.', aceptadas: ['down'] },
      { antes: 'They put the meeting', despues: 'until Thursday.', aceptadas: ['off'] },
      { antes: 'He carried', despues: 'working as though nothing had happened.', aceptadas: ['on'] },
      { antes: 'The deal fell', despues: 'at the last minute.', aceptadas: ['through'] },
      { antes: 'Two of them dropped', despues: 'of the course in October.', aceptadas: ['out'] },
      { antes: 'Do not give', despues: 'so easily.', aceptadas: ['up'] }
    ]
  },

  't3-voc3': {
    tipo: 'caja', titulo: 'Adjetivos y su preposición · tercera vuelta',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['about', 'at', 'for', 'from', 'in', 'of', 'to', 'with'],
    items: [
      { antes: 'The town is renowned', despues: 'its cheese.', aceptadas: ['for'] },
      { antes: 'She is completely oblivious', despues: 'the effect it has.', aceptadas: ['to'] },
      { antes: 'He was adamant', despues: 'not going.', aceptadas: ['about'] },
      { antes: 'This material is resistant', despues: 'heat.', aceptadas: ['to'] },
      { antes: 'The results are consistent', despues: 'our earlier findings.', aceptadas: ['with'] },
      { antes: 'I am no good', despues: 'remembering names.', aceptadas: ['at'] }
    ]
  },

  't3-voc4': {
    tipo: 'caja', titulo: 'Expresiones hechas · apuros y oficio',
    instruccion: 'Complete each expression with a word from the box. There are more words than you need.',
    caja: ['deep', 'ends', 'hand', 'ropes', 'shoestring', 'strings', 'track', 'water'],
    items: [
      { antes: 'They ran the whole festival on a', despues: '.', aceptadas: ['shoestring'] },
      { antes: 'It took me a month to learn the', despues: '.', aceptadas: ['ropes'] },
      { antes: 'She had to pull a few', despues: 'to get him an interview.', aceptadas: ['strings'] },
      { antes: 'By the third month they were in', despues: 'water.', aceptadas: ['deep'] },
      { antes: 'It is hard to keep', despues: 'of who owes what.', aceptadas: ['track'] },
      { antes: 'They are struggling to make', despues: 'meet.', aceptadas: ['ends'] }
    ]
  },

  't3-voc5': {
    tipo: 'cloze', titulo: 'Open cloze · perderse',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Getting lost has quietly become difficult. A generation ago it required no effort {1} all: you set off, misread a sign and spent an hour discovering a village nobody had recommended. Now the phone in your pocket will not permit it, and something has gone {2} with the inconvenience.',
      'This is not an argument {3} maps, which are among the finest things anyone has made. It is an argument about attention. A route you have been told, turn {4} turn, is a route you will not remember, because remembering it was never asked of you. The old way was slower and occasionally humiliating, but it left a picture in your head that no amount {5} zooming can reproduce. Whether that matters is a fair question, and one worth asking before the last of us who can read a paper map {6} out.'
    ],
    items: [
      { aceptadas: ['at'] }, { aceptadas: ['along'] }, { aceptadas: ['against'] },
      { aceptadas: ['by'] }, { aceptadas: ['of'] }, { aceptadas: ['dies'] }
    ]
  },

  't3-voc6': {
    tipo: 'cloze', titulo: 'Open cloze · ser malo en algo',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'There is a particular kind of courage in being visibly bad at something after the age of thirty. Children are incompetent at almost everything and do not appear to mind, whereas adults have learned that incompetence is embarrassing and so restrict {1} to what they already do well. The result is a life that gets steadily narrower {2} it gets more comfortable.',
      'The obvious reply is that time is short and one should play to your strengths, and there is something {3} that. But the argument proves too much. Taken seriously it would have you abandon every activity at the exact {4} where it stops being flattering, which is usually the moment before it starts being interesting. Nobody ever learned an instrument, a language {5} a trade without a long stretch of sounding foolish in front of somebody. That stretch is not the price of the skill. It {6}, in some important sense, the skill arriving.'
    ],
    items: [
      { aceptadas: ['themselves'] }, { aceptadas: ['as'] }, { aceptadas: ['in'] },
      { aceptadas: ['point'] }, { aceptadas: ['or'] }, { aceptadas: ['is'] }
    ]
  },

  't3-voc7': {
    tipo: 'formacion', titulo: 'Word formation · nombres abstractos',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'Her', despues: 'to detail is remarkable.', raiz: 'ATTEND', aceptadas: ['attention'] },
      { antes: 'The', despues: 'of the evidence was never questioned.', raiz: 'RELEVANT', aceptadas: ['relevance'] },
      { antes: 'They showed a complete', despues: 'of the rules.', raiz: 'IGNORE', aceptadas: ['ignorance'] },
      { antes: 'His', despues: 'to accept help made everything harder.', raiz: 'RELUCTANT', aceptadas: ['reluctance'] },
      { antes: 'There is a real', despues: 'that the bridge will close.', raiz: 'LIKELY', aceptadas: ['likelihood'] },
      { antes: 'The', despues: 'between the two versions is striking.', raiz: 'SIMILAR', aceptadas: ['similarity'] }
    ]
  },

  't3-voc8': {
    tipo: 'formacion', titulo: 'Word formation · verbos derivados',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The new rules will', despues: 'the process considerably.', raiz: 'SIMPLE', aceptadas: ['simplify'] },
      { antes: 'They had to', despues: 'the walls after the fire.', raiz: 'STRONG', aceptadas: ['strengthen'] },
      { antes: 'The council refused to', despues: 'the decision.', raiz: 'JUST', aceptadas: ['justify'] },
      { antes: 'We need to', despues: 'a few points before signing.', raiz: 'CLEAR', aceptadas: ['clarify'] },
      { antes: 'The scheme was designed to', despues: 'small businesses.', raiz: 'POWER', aceptadas: ['empower'] },
      { antes: 'The medicine did little to', despues: 'the pain.', raiz: 'LESS', aceptadas: ['lessen'] }
    ]
  },

  't3-voc9': {
    tipo: 'caja', titulo: 'Verbos con preposición fija · tercera vuelta',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['about', 'for', 'from', 'in', 'into', 'of', 'on', 'with'],
    items: [
      { antes: 'The book consists', despues: 'twelve short essays.', aceptadas: ['of'] },
      { antes: 'His parents deterred him', despues: 'applying.', aceptadas: ['from'] },
      { antes: 'She insisted', despues: 'paying her share.', aceptadas: ['on'] },
      { antes: 'Nobody had bargained', despues: 'the weather.', aceptadas: ['for'] },
      { antes: 'The talks resulted', despues: 'a compromise nobody liked.', aceptadas: ['in'] },
      { antes: 'He was charged', despues: 'careless driving.', aceptadas: ['with'] }
    ]
  },

  't3-voc10': {
    tipo: 'caja', titulo: 'Phrasal verbs · aguantar y descubrir',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['across', 'away', 'on', 'out', 'over', 'through', 'up', 'with'],
    items: [
      { antes: 'He made the whole story', despues: '.', aceptadas: ['up'] },
      { antes: 'I came', despues: 'these letters while clearing the attic.', aceptadas: ['across'] },
      { antes: 'I cannot put up', despues: 'the noise any longer.', aceptadas: ['with'] },
      { antes: 'They got', despues: 'the worst of the winter somehow.', aceptadas: ['through'] },
      { antes: 'She talked me', despues: 'of resigning.', aceptadas: ['out'] },
      { antes: 'The meeting dragged', despues: 'for three hours.', aceptadas: ['on'] }
    ]
  },

  't3-voc11': {
    tipo: 'caja', titulo: 'Colocaciones · verbo y sustantivo · tercera vuelta',
    instruccion: 'Complete each sentence with a verb from the box. There are more verbs than you need.',
    caja: ['draw', 'give', 'hold', 'pay', 'raise', 'run', 'take', 'throw'],
    items: [
      { antes: 'They refused to', despues: 'attention to the mistake.', aceptadas: ['draw'] },
      { antes: 'Nobody was prepared to', despues: 'responsibility for it.', aceptadas: ['take'] },
      { antes: 'The talk will', despues: 'a number of difficult questions.', aceptadas: ['raise'] },
      { antes: 'Try to', despues: 'your nerve until the end.', aceptadas: ['hold'] },
      { antes: 'We had to', despues: 'the risk of losing the deposit.', aceptadas: ['run'] },
      { antes: 'The company finally agreed to', despues: 'compensation.', aceptadas: ['pay'] }
    ]
  },

  't3-voc12': {
    tipo: 'caja', titulo: 'Expresiones con colores y elementos',
    instruccion: 'Complete each expression with a word from the box. There are more words than you need.',
    caja: ['blue', 'cold', 'fire', 'green', 'ice', 'red', 'thin', 'water'],
    items: [
      { antes: 'The letter arrived completely out of the', despues: '.', aceptadas: ['blue'] },
      { antes: 'He got', despues: 'feet the night before the wedding.', aceptadas: ['cold'] },
      { antes: 'The proposal was given the', despues: 'light in June.', aceptadas: ['green'] },
      { antes: 'She is very good at breaking the', despues: 'with strangers.', aceptadas: ['ice'] },
      { antes: 'They spent the afternoon cutting through', despues: 'tape.', aceptadas: ['red'] },
      { antes: 'His excuse was wearing rather', despues: 'by then.', aceptadas: ['thin'] }
    ]
  },

  't3-voc13': {
    tipo: 'cloze', titulo: 'Open cloze · dar consejos',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Advice is the one gift people give freely and receive badly. Ask ten friends what you should do and you will get eleven answers, none of {1} you will act on, and all of which you will remember when the thing goes wrong. This is not ingratitude. It is that advice arrives stripped of the {2} thing that would make it useful: the situation it came from.',
      'What people actually want, and rarely say, is permission. They have already decided; what they lack is somebody to agree out loud so that the decision stops being theirs {3}. Anyone who has ever asked whether to hand in their notice knows the feeling. The useful friend, {4} rare, is the one who notices this and asks a question instead of delivering a verdict. It costs more effort and earns less credit, {5} it is the only version that survives contact with the morning. In the {6} run, being listened to changes more minds than being told.'
    ],
    items: [
      { aceptadas: ['which'] }, { aceptadas: ['one'] }, { aceptadas: ['alone'] },
      { aceptadas: ['though'] }, { aceptadas: ['but'] }, { aceptadas: ['long'] }
    ]
  },

  't3-voc14': {
    tipo: 'cloze', titulo: 'Open cloze · pueblo o ciudad',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Small towns are praised by people who have just left them and defended by people who have never lived in one. The truth sits somewhere less quotable. What a small town gives you is not peace, {1} is often in short supply, but consequence: you will meet again everybody you were ever rude to, and this turns out to be a more effective form of civility {2} any amount of legislation.',
      'The cost is the same coin turned {3}. Being known is hard to distinguish from being watched, and the town that will notice you are ill is the town that noticed who you left the party with. Cities solve this by not caring, and charge {4} the privilege in rent and in loneliness. Neither arrangement is better in the abstract; each suits a different decade of a life, which is {5} so many people move twice and end up, {6} their own surprise, back where they started.'
    ],
    items: [
      { aceptadas: ['which'] }, { aceptadas: ['than'] }, { aceptadas: ['over'] },
      { aceptadas: ['for'] }, { aceptadas: ['why'] }, { aceptadas: ['to'] }
    ]
  },

  't3-voc15': {
    tipo: 'formacion', titulo: 'Word formation · personas y procesos',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The', despues: 'of the scheme has been widely criticised.', raiz: 'ADMINISTER', aceptadas: ['administration'] },
      { antes: 'She trained as an', despues: 'before switching to law.', raiz: 'ACCOUNT', aceptadas: ['accountant'] },
      { antes: 'The', despues: 'of the results took a fortnight.', raiz: 'ANALYSE', aceptadas: ['analysis'] },
      { antes: 'They appointed a new', despues: 'in March.', raiz: 'SUPERVISE', aceptadas: ['supervisor'] },
      { antes: 'The', despues: 'of the smaller firm was announced yesterday.', raiz: 'ACQUIRE', aceptadas: ['acquisition'] },
      { antes: 'He works as a', despues: 'for a small publisher.', raiz: 'TRANSLATE', aceptadas: ['translator'] }
    ]
  },

  't3-voc16': {
    tipo: 'formacion', titulo: 'Word formation · adjetivos en negativo',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The instructions were hopelessly', despues: '.', raiz: 'ADEQUATE', aceptadas: ['inadequate'] },
      { antes: 'Her reasoning was entirely', despues: '.', raiz: 'LOGIC', aceptadas: ['illogical'] },
      { antes: 'The damage was, unfortunately,', despues: '.', raiz: 'REVERSE', aceptadas: ['irreversible'] },
      { antes: 'The two witnesses gave', despues: 'accounts.', raiz: 'CONTRADICT', aceptadas: ['contradictory'] },
      { antes: 'His handwriting is almost', despues: '.', raiz: 'LEGIBLE', aceptadas: ['illegible'] },
      { antes: 'The whole affair was highly', despues: '.', raiz: 'REGRET', aceptadas: ['regrettable'] }
    ]
  },


  /* ===================== TEST 3 · USE OF ENGLISH ===================== */

  't3-use1': {
    tipo: 'opcion', parte: 1, titulo: 'Use of English · Part 1',
    instruccion: 'Decide which answer best fits each gap.',
    texto: [
      'Repair has become fashionable again, which is a strange fate for something that was, within living memory, simply what you {1} when a thing broke. Councils now run repair cafés; manufacturers, under pressure, have begun, grudgingly, to {2} spare parts available again.',
      'The enthusiasm is easy to {3} at. It arrives thirty years late and it is, for now, a hobby rather than an economy: it takes a Saturday morning to mend a kettle that costs eleven pounds. But the objection misses the {4}. What the repair café restores is not the kettle. It is the assumption that the inside of an object is knowable, and that assumption has been quietly eroded by a generation of things sealed with glue.',
      'Manufacturers understand this better than they {5} on. A device you can open is a device you can judge, and a device you can judge is one you might {6} to replace. The right to repair, now written into law in several countries, is therefore not a nostalgic gesture but a real transfer of power, {7} small. Whether it survives the next round of lobbying is another matter, and one on which it would be unwise to {8} money.'
    ],
    items: [
      { opciones: ['did', 'made', 'took', 'held'], correcta: 0 },
      { opciones: ['put', 'set', 'make', 'turn'], correcta: 2 },
      { opciones: ['ridicule', 'dismiss', 'laugh', 'scorn'], correcta: 2 },
      { opciones: ['matter', 'point', 'issue', 'case'], correcta: 1 },
      { opciones: ['give', 'let', 'put', 'take'], correcta: 1 },
      { opciones: ['deny', 'reject', 'resist', 'refuse'], correcta: 3 },
      { opciones: ['whatever', 'whenever', 'however', 'wherever'], correcta: 2 },
      { opciones: ['spend', 'waste', 'count', 'stake'], correcta: 3 }
    ]
  },

  't3-use2a': {
    tipo: 'cloze', parte: 2, titulo: 'Use of English · Part 2',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Nobody is taught to cook any {1}; they are taught to follow recipes, which is a different skill and a much less useful one. A recipe tells you what to do with two hundred grams of something you happen to have bought. It is no help {2} all when the packet turns out to hold one hundred and fifty.',
      'The cook who improvises is not being creative, {3} the television programmes suggest. They are applying a small number of rules learned by repetition: fat carries flavour, salt goes in by stages, and {4} anything browns it tastes of more than it did. None of this is secret and none of it is hard, but it is almost never written {5}, because it does not photograph well and cannot be sold as a book.',
      'The consequence is a generation that can produce an excellent dinner {6} long as somebody else has planned it, and is defeated by a fridge. This is not laziness. It is what happens {7} a craft is taught as a series of outcomes rather {8} a set of habits.'
    ],
    items: [
      { aceptadas: ['more', 'longer'] }, { aceptadas: ['at'] }, { aceptadas: ['whatever'] },
      { aceptadas: ['once'] }, { aceptadas: ['down'] }, { aceptadas: ['as'] },
      { aceptadas: ['when', 'if'] }, { aceptadas: ['than'] }
    ]
  },

  't3-use2b': {
    tipo: 'cloze', parte: 2, titulo: 'Use of English · Part 2',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'A bookshelf is not a library; it is an argument you are having with yourself in public. Most of the books on it will never be opened {1}, and their owner knows this perfectly well.',
      'The usual explanation is vanity, and there is some truth {2} it. But vanity does not account {3} the paperbacks nobody would be impressed by, the ones with cracked spines that have moved house four times. Those are kept for a different reason: they are evidence. To throw {4} the book is to concede that the person who read it at nineteen has gone, {5} is a larger admission than most of us want to make on a Sunday afternoon.',
      'This is why advice about decluttering so often fails. It treats the shelf as storage, {6} it is closer to a diary. The sensible response is neither to keep everything {7} to stage a purge, but to notice what the shelf is for and be honest about it. A book you will never read {8} still be doing its job.'
    ],
    items: [
      { aceptadas: ['again'] }, { aceptadas: ['in'] }, { aceptadas: ['for'] },
      { aceptadas: ['away', 'out'] }, { aceptadas: ['which'] }, { aceptadas: ['whereas', 'when'] },
      { aceptadas: ['nor'] }, { aceptadas: ['may', 'might', 'can'] }
    ]
  },

  't3-use3': {
    tipo: 'formacion', parte: 3, titulo: 'Use of English · Part 3',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The committee published its', despues: 'in June.', raiz: 'RECOMMEND', aceptadas: ['recommendation', 'recommendations'] },
      { antes: 'She spoke with unusual', despues: 'for someone so young.', raiz: 'ASSURE', aceptadas: ['assurance'] },
      { antes: 'The plan was criticised for its', despues: '.', raiz: 'VAGUE', aceptadas: ['vagueness'] },
      { antes: 'They dealt with the complaint', despues: 'and without fuss.', raiz: 'PROMPT', aceptadas: ['promptly'] },
      { antes: 'The', despues: 'of the two reports took a week.', raiz: 'COMPARE', aceptadas: ['comparison'] },
      { antes: 'His account was wholly', despues: 'with hers.', raiz: 'CONSIST', aceptadas: ['inconsistent'] },
      { antes: 'The building has been', despues: 'altered since 1900.', raiz: 'EXTEND', aceptadas: ['extensively'] },
      { antes: 'There was general', despues: 'about what had been agreed.', raiz: 'CONFUSE', aceptadas: ['confusion'] }
    ]
  },

  't3-use4a': {
    tipo: 'transformacion', parte: 4, titulo: 'Use of English · Part 4',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I regret telling him.', clave: 'WISH', antes: 'I', despues: 'him.', aceptadas: ["wish I hadn't told", 'wish I had not told'] },
      { frase: 'Nobody expected the result.', clave: 'CAME', antes: 'The result', despues: 'to everybody.', aceptadas: ['came as a surprise'] },
      { frase: 'They cancelled the concert because of the rain.', clave: 'CALLED', antes: 'The concert', despues: 'because of the rain.', aceptadas: ['was called off'] },
      { frase: 'It does not matter what he says.', clave: 'NO', antes: 'It makes', despues: 'what he says.', aceptadas: ['no difference'] },
      { frase: 'She is the best cook I know.', clave: 'AS', antes: 'I do not know anyone who cooks', despues: 'she does.', aceptadas: ['as well as'] },
      { frase: 'You need not have brought anything.', clave: 'NECESSARY', antes: 'It', despues: 'anything.', aceptadas: ["wasn't necessary to bring", 'was not necessary to bring'] }
    ]
  },

  't3-use4b': {
    tipo: 'transformacion', parte: 4, titulo: 'Use of English · Part 4',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'They say he is living abroad.', clave: 'SAID', antes: 'He', despues: 'abroad.', aceptadas: ['is said to be living'] },
      { frase: 'The last time I saw her was in 2019.', clave: 'SEEN', antes: 'I', despues: 'since 2019.', aceptadas: ["haven't seen her", 'have not seen her'] },
      { frase: 'I only understood later what she meant.', clave: 'UNTIL', antes: 'It was not', despues: 'I understood what she meant.', aceptadas: ['until later that'] },
      { frase: 'He is too young to drive.', clave: 'ENOUGH', antes: 'He', despues: 'to drive.', aceptadas: ["isn't old enough", 'is not old enough'] },
      { frase: 'Whose idea was it to come here?', clave: 'CAME', antes: 'Who', despues: 'of coming here?', aceptadas: ['came up with the idea'] },
      { frase: 'The rain prevented us from finishing.', clave: 'STOPPED', antes: 'The rain', despues: 'finishing.', aceptadas: ['stopped us from'] }
    ]
  },


  /* ===================== TEST 3 · READING ===================== */

  't3-read5': {
    tipo: 'lectura', parte: 5, titulo: 'Reading · Part 5',
    instruccion: 'Read the text and choose the answer (A, B, C or D) which fits best according to the text.',
    tituloTexto: 'The woman who keeps what you left behind',
    texto: [
      'The lost property office at Atxuri is not, as most people assume, in the station building. It is two floors below it, in a room that was once a coal store, and Nazaret Beitia has run it for nineteen years. On the morning I visit she is holding a viola and looking at it the way a vet looks at an animal somebody has left tied to a railing.',
      '“Eleven thousand items last year,” she says, “and about a third go home.” She offers the figure without apology. It sounds low until you spend an hour watching what actually arrives: umbrellas by the crate, single gloves, phone chargers in numbers that suggest a national shortage. Nobody comes back for a charger. The job, she explains, is not really about objects at all, and the people who last in it are the ones who work that out early.',
      'What she means becomes clearer when a woman appears at the counter to ask about a plastic folder. Beitia does not ask what was in it. She asks when, and which platform, and whether the woman had changed trains, and only at the end, almost as an afterthought, what the folder looked like. The folder is not there. The woman stands for a moment and then says, unprompted, that it held the paperwork for her mother’s flat. Beitia writes this down, gives her a reference number, and says she will ring on Friday whether or not anything has turned up. This last part is not policy.',
      'The pattern she has noticed over nineteen years is one she says nobody believes at first. Expensive items are claimed less often than worthless ones. A laptop will sit for months; a child’s drawing in a supermarket bag is usually collected within the day, by somebody who has taken time off work to come. Her explanation is unromantic. Anything with a serial number is somebody’s insurance problem, and a form is easier than a tram across the city.',
      'She has had one apprentice, a young man from the ticket office who lasted six weeks. He was, she says, careful and quick and entirely unsuited to it, and she does not hold this against him. “He wanted to solve them,” she says. “Every one. And you cannot. Two out of three of these go into a container and that is the whole of it. If that is unbearable, you are not weak, you are simply in the wrong job.” She had told him as much in his first week and he had not believed her.',
      'The law allows her to dispose of anything unclaimed after three months. On a shelf behind her desk sit perhaps forty items that have been there considerably longer: a wedding ring, a set of house keys with a wooden fob, a child’s cardigan, a folder of photographs. She does not draw attention to the shelf, and when I ask about it she says only that the container comes on Thursdays and that some weeks she is busy. The viola, she thinks, will go home. Instruments almost always do.'
    ],
    items: [
      { pregunta: '1  What impression does the writer give of Beitia in the first paragraph?',
        opciones: ['She treats the object in front of her as a responsibility.',
                   'She resents having been put below ground.',
                   'She is bored by the routine of the work.',
                   'She has stopped noticing unusual items.'], correcta: 0 },
      { pregunta: '2  What does Beitia suggest about the people who stay in the job?',
        opciones: ['They keep the rate of return as high as they can.',
                   'They avoid becoming attached to what arrives.',
                   'They grasp early that the work is not about property.',
                   'They have a good memory for what has passed through.'], correcta: 2 },
      { pregunta: '3  Why does the writer add that ringing on Friday “is not policy”?',
        opciones: ['To criticise the rules the office works under.',
                   'To suggest that Beitia expects the folder to appear.',
                   'To explain why so few items are returned.',
                   'To show that Beitia does more than she is required to.'], correcta: 3 },
      { pregunta: '4  How does Beitia account for the pattern described in the fourth paragraph?',
        opciones: ['People are more sentimental than they will admit.',
                   'Valuable items are stolen before they reach her.',
                   'Replacing something valuable is less trouble than collecting it.',
                   'Owners of expensive things are slower to notice a loss.'], correcta: 2 },
      { pregunta: '5  What is Beitia’s attitude towards the apprentice?',
        opciones: ['She thinks he gave up sooner than he needed to.',
                   'She regards his reaction as a poor fit rather than a failing.',
                   'She holds herself responsible for not warning him.',
                   'She believes more time would have settled him.'], correcta: 1 },
      { pregunta: '6  What does the shelf behind the desk suggest about Beitia?',
        opciones: ['She is careless about the rules on disposal.',
                   'She expects the items on it to be collected eventually.',
                   'She keeps them as a record of her years there.',
                   'She is less detached than her account of the job implies.'], correcta: 3 }
    ]
  },

  't3-read6': {
    tipo: 'lectura', parte: 6, titulo: 'Reading · Part 6',
    instruccion: 'You will read four extracts in which specialists give their views on teaching handwriting. For each question, choose from the extracts A–D.',
    opcionesCortas: true,
    secciones: [
      { letra: 'A', titulo: 'Marta Osorio, developmental neuroscientist',
        texto: ['The evidence for teaching handwriting is genuinely strong, and it is strong in exactly one place: the first years of school, where forming a letter by hand helps a child recognise it later. That effect is well replicated and I would defend it against any budget cut. What I will not defend is the extension of the claim to eleven-year-olds, or the suggestion that the discipline of handwriting builds some general quality of mind. There is no evidence for that whatsoever, and the people who repeat it are, I notice, never the people who have to teach it.'] },
      { letra: 'B', titulo: 'Colin Traeger, secondary school teacher',
        texto: ['I have read enough of the research to know that it does not help me on a Tuesday. My pupils will sit three hours of written examination with a pen, in silence, in a hall, and if they cannot produce legible prose at speed for that long they will be marked down for reasons that have nothing to do with what they know. Until that changes, the argument about brains and letters is a luxury. Tell me what the boards will accept and I will teach it; that decision, and not the science, is what actually settles the question.'] },
      { letra: 'C', titulo: 'Ana Ferreiro, occupational therapist',
        texto: ['My caseload is children for whom writing by hand is painful, slow or both, and the cost of the current arrangement falls almost entirely on them. I would keep handwriting in the early years — the evidence there is solid and I have no wish to argue with it — but I would teach typing alongside it from seven, not as a surrender but as a second route. What I see instead is children spending the years when they might be writing well fighting the mechanics of the pen, and arriving at secondary school convinced they have nothing to say.'] },
      { letra: 'D', titulo: 'Yusuf Demir, historian of education',
        texto: ['Every generation has announced that a writing technology was decisive, and every generation has been wrong in an interesting way: the slate, the steel nib, the biro, each was going to ruin or rescue the schoolroom. I would add a warning that my colleagues will dislike. We are asking the research to settle something it cannot settle, because the disagreement is not about children at all. It is about what we intend to examine and how, and that is a decision somebody has to take rather than discover.'] }
    ],
    items: [
      { pregunta: '1  Which expert is most concerned about the pupils for whom writing by hand is physically difficult?',
        opciones: ['A', 'B', 'C', 'D'], correcta: 2 },
      { pregunta: '2  Which expert shares C’s view that the case for handwriting is strongest with the youngest pupils?',
        opciones: ['A', 'B', 'C', 'D'], correcta: 0 },
      { pregunta: '3  Which expert takes a different view from A about how far research can settle the question?',
        opciones: ['A', 'B', 'C', 'D'], correcta: 3 },
      { pregunta: '4  Which expert argues that the demands of the examination decide the matter whatever the research says?',
        opciones: ['A', 'B', 'C', 'D'], correcta: 1 }
    ]
  },

  't3-read7': {
    tipo: 'lectura', parte: 7, titulo: 'Reading · Part 7',
    instruccion: 'Six paragraphs have been removed from the text. Choose from the paragraphs A–G the one which fits each gap. There is one extra paragraph which you do not need to use.',
    tituloTexto: 'The man who counted the benches',
    opcionesCortas: true,
    texto: [
      'The first bench Ander Otxoa recorded was outside a chemist on Calle Ronda, and he recorded it because he had needed it. He was fifty-three, three weeks out of hospital and newly aware that the distance he could walk was no longer measured in streets but in places to sit down.',
      '{1}',
      'That was in 2016. By the following spring the notebook had become a spreadsheet, and the spreadsheet had grown a column he had not planned: condition. A bench with a broken slat was not a bench. A bench with an armrest fixed across the middle was, for anyone who needed to lie down for two minutes, also not a bench, although he was some time working that out.',
      '{2}',
      'The council, when he finally wrote to them, answered with the politeness reserved for people who are not going to get anything. Benches, the letter explained, fell to three separate departments depending on whether they stood in a park, on a pavement or at a bus stop, and no single list of them existed.',
      '{3}',
      'What changed matters was not the argument but the map. Printed a metre across and pinned up at a neighbourhood meeting, it showed the city in a way no report had managed: dense clusters of dots in the centre and along the river, and then, in the two districts furthest north, a long emptiness broken by four dots in a kilometre and a half.',
      '{4}',
      'Otxoa is careful about the credit. He points out that the campaign was run by other people, that he is no good at meetings, and that his own contribution amounted to six years of walking slowly and writing things down.',
      '{5}',
      'The count now stands at one thousand one hundred and six, every one of which he has visited at least twice. Forty-one benches have been installed since 2019, thirty-four of them in the north.',
      '{6}',
      'He has been asked more than once whether he would do it again, knowing what it cost him in shoe leather and Sunday afternoons. He says the question is the wrong way round. The walking was not the price of the map. Until his legs failed him he had lived in the city for thirty years and had never once looked at it.'
    ],
    secciones: [
      { letra: 'A', texto: ['The distinction mattered more than he had expected. Of those first four hundred entries, sixty-one turned out to be unusable by the very people most likely to need them, and he began to suspect that nobody counting benches from an office would ever have noticed.'] },
      { letra: 'B', texto: ['He is unwilling to claim that the second figure follows from the first, and says so before anyone can ask. What he will say is that the arguments now take place over a document everybody accepts, which was not the case in 2016.'] },
      { letra: 'C', texto: ['Nobody at the meeting needed the finding explained to them. Several people who had lived in those districts all their lives said afterwards that they had known it without knowing it, which is the usual condition of a fact nobody has ever drawn.'] },
      { letra: 'D', texto: ['Benches have never been fashionable in urban design, being cheap, unphotogenic and impossible to attribute to a named architect. They appear in budgets under street furniture, alongside bollards and litter bins, and are usually the first line to be cut.'] },
      { letra: 'E', texto: ['He wrote it down in a pocket notebook — the street, the material, whether it had a back — and he did so for no reason he could have defended at the time. It simply seemed worth knowing, and knowing things was one of the few activities still fully available to him.'] },
      { letra: 'F', texto: ['This is true, and it is also, his neighbours point out, not the whole story. The reason the councillors could not wave the map away was that every dot on it had been stood beside, photographed and dated by one person with nothing to gain.'] },
      { letra: 'G', texto: ['This was meant as a refusal and he took it as an invitation. If nobody held a list, then the one he had spent two winters compiling was not a hobby. It was the only list there was.'] }
    ],
    items: [
      { pregunta: '1', opciones: ['A','B','C','D','E','F','G'], correcta: 4 },
      { pregunta: '2', opciones: ['A','B','C','D','E','F','G'], correcta: 0 },
      { pregunta: '3', opciones: ['A','B','C','D','E','F','G'], correcta: 6 },
      { pregunta: '4', opciones: ['A','B','C','D','E','F','G'], correcta: 2 },
      { pregunta: '5', opciones: ['A','B','C','D','E','F','G'], correcta: 5 },
      { pregunta: '6', opciones: ['A','B','C','D','E','F','G'], correcta: 1 }
    ]
  },

  't3-read8': {
    tipo: 'lectura', parte: 8, titulo: 'Reading · Part 8',
    instruccion: 'You will read an article in which six people describe learning a language as an adult. For each question, choose from the people A–F.',
    opcionesCortas: true,
    secciones: [
      { letra: 'A', titulo: 'Bego, Portuguese at forty-five',
        texto: ['I had three hundred words and a grammar book and I was going nowhere, and it took a colleague to tell me why: I was collecting the language rather than spending it. Every evening of study was another shelf of vocabulary I never took down. What broke it was being put on a weekly call where I had to speak badly in front of people who had known me as competent for a decade. That was the whole of the difficulty, and it had nothing to do with Portuguese. I still find it uncomfortable and I still do it.'] },
      { letra: 'B', titulo: 'Tomás, Japanese for eight years',
        texto: ['I read novels. I cannot order a coffee. People assume this means Japanese is impossible, and it is not — the fault is entirely in how I went about it, which was eight years of reading alone in a flat because reading alone in a flat is what I enjoy. Nobody made me do it that way. I could have joined something in the first year and I did not. I am not giving up over it; I have started going to a conversation group, badly, and I expect it to take another two years to catch up with my own reading.'] },
      { letra: 'C', titulo: 'Ivet, Basque at thirty',
        texto: ['It was spoken over my head all through my childhood and never to me, and starting it at thirty was not like starting a foreign language. It was more like being handed back something that had been mislaid on my behalf. There is a grief in that which surprised me and which I have never found a good way of describing. What does not help, though everyone means well, is my aunts switching to Spanish the moment I hesitate. They think they are sparing me. They are taking away the only three seconds in which I might have got there.'] },
      { letra: 'D', titulo: 'Ruy, English from television',
        texto: ['I arrived at twenty with an accent people complimented and a grammar that was, I now understand, held together with sticky tape. Because I was understood, nobody corrected me, and being understood felt like proof that I was fine. It is not the same thing and I lost about fifteen years to the confusion. At thirty-eight I went back and did the tenses properly, in a classroom, with exercises, which was humiliating and worked. There is a ceiling on fluency without accuracy and you do not see it until your head is against it.'] },
      { letra: 'E', titulo: 'Nadia, German for a family',
        texto: ['For two years I studied German in order to speak German, and I made almost no progress. Then my partner’s father was ill and there were arrangements to make and forms to read, and within four months I was doing things in German I had not been able to do in two years, because the German had stopped being the point. His mother corrected every second sentence I produced, in front of everybody, and I resented her for about a year. She was right every single time, and I would not be where I am without it.'] },
      { letra: 'F', titulo: 'Peio, French at seventy',
        texto: ['Everybody wants to talk to me about memory, as though seventy-two were the obstacle. My memory is fine; what I have lost is nerve. At twenty you will say something wrong to a stranger and think nothing of it, and at my age you have spent fifty years arranging a life in which you are never the least capable person in the room, and then you walk into a class and there you are. That is the work. I measure it in months rather than weeks, and I have more months than most people assume.'] }
    ],
    items: [
      { pregunta: '1  Who realised they had been accumulating the language rather than using it?', opciones: ['A','B','C','D','E','F'], correcta: 0 },
      { pregunta: '2  Who says their obstacle is confidence rather than the capacity to learn?', opciones: ['A','B','C','D','E','F'], correcta: 5 },
      { pregunta: '3  Who was helped by corrections that were unwelcome at the time?', opciones: ['A','B','C','D','E','F'], correcta: 4 },
      { pregunta: '4  Who took a long time to see that being understood was not the same as being correct?', opciones: ['A','B','C','D','E','F'], correcta: 3 },
      { pregunta: '5  Who describes a sense of loss bound up with the language itself?', opciones: ['A','B','C','D','E','F'], correcta: 2 },
      { pregunta: '6  Who is carrying on despite a large gap between two of their skills?', opciones: ['A','B','C','D','E','F'], correcta: 1 },
      { pregunta: '7  Who mentions people making things easier in a way that does not help?', opciones: ['A','B','C','D','E','F'], correcta: 2 },
      { pregunta: '8  Who had to accept appearing less capable than they are?', opciones: ['A','B','C','D','E','F'], correcta: 0 },
      { pregunta: '9  Who found that progress came once the language stopped being the aim?', opciones: ['A','B','C','D','E','F'], correcta: 4 },
      { pregunta: '10  Who blames their own method rather than the difficulty of the language?', opciones: ['A','B','C','D','E','F'], correcta: 1 }
    ]
  },


  /* ===================== TEST 3 · LISTENING =====================
     Audio provisional de espeak-ng. Se sustituye por voz real antes de cobrar. */

  't3-lis1': {
    tipo: 'listening', parte: 1, titulo: 'Listening · Part 1',
    instruccion: 'You will hear three different extracts. Choose the answer (A, B or C) which fits best according to what you hear. <b>You will hear the recording twice.</b>',
    audio: 'audio/t3-lis1.mp3', escuchas: 2,
    contexto: 'Extract 1: a woman who has finished a cookery course. Extract 2: a woman who has moved from a city to a small town. Extract 3: two colleagues and an office move.',
    items: [
      { pregunta: '1  What does the woman say she could not do before the course?',
        opciones: ['Cook without written instructions in front of her.', 'Follow a recipe accurately.', 'Cook for more than a few people.'], correcta: 0 },
      { pregunta: '2  What does she say about who should sign up?',
        opciones: ['Only people who genuinely cannot cook will gain from it.', 'Confident cooks will find the sessions too easy.', 'Its value depends on being willing to feel uncomfortable.'], correcta: 2 },
      { pregunta: '3  What does the woman say has been the most significant change?',
        opciones: ['Paying half the rent she used to.', 'The effect on the way she treats people.', 'Having a slower daily routine.'], correcta: 1 },
      { pregunta: '4  What does she say she misses?',
        opciones: ['The concerts she used to go to.', 'The friends she left behind.', 'Being unrecognised when she is in a bad mood.'], correcta: 2 },
      { pregunta: '5  Why does the woman say people are complaining about the desks?',
        opciones: ['The desks are the worst part of the plan.', 'It is the only complaint the process allows.', 'Nobody has read the rest of the plan.'], correcta: 1 },
      { pregunta: '6  What is her view of the consultation?',
        opciones: ['It is genuine but aimed at the wrong questions.', 'It is a pretence intended to cause delay.', 'It will be abandoned before December.'], correcta: 0 }
    ]
  },

  't3-lis2': {
    tipo: 'listening', parte: 2, titulo: 'Listening · Part 2',
    instruccion: 'Complete the sentences with <b>a word or short phrase</b> from what you hear. <b>You will hear the recording twice.</b>',
    audio: 'audio/t3-lis2.mp3', escuchas: 2,
    items: [
      { antes: 'Gemma says that restoring neon is mostly a job about', despues: '.', aceptadas: ['glass'] },
      { antes: 'Before neon she spent nine years working in', despues: '.', aceptadas: ['stained glass'] },
      { antes: 'The commonest reason a sign fails is the', despues: '.', aceptadas: ['transformer'] },
      { antes: 'The colour she finds hardest to match is', despues: '.', aceptadas: ['blue'] },
      { antes: 'On the Bilbao sign, the stage that took longest was finding a', despues: '.', aceptadas: ['photograph', 'photo'] },
      { antes: 'The one thing she refuses to do for clients is fake', despues: '.', aceptadas: ['ageing', 'aging'] },
      { antes: 'Her apprentice came to her from', despues: '.', aceptadas: ['dentistry'] },
      { antes: 'She tells beginners to start by buying a box of broken', despues: '.', aceptadas: ['tube', 'glass tube'] }
    ]
  },

  't3-lis3': {
    tipo: 'listening', parte: 3, titulo: 'Listening · Part 3',
    instruccion: 'You will hear an interview. Choose the answer (A, B, C or D) which fits best according to what you hear. <b>You will hear the recording twice.</b>',
    audio: 'audio/t3-lis3.mp3', escuchas: 2,
    contexto: 'A journalist interviews Ruth Callaghan, who runs an archive of amateur film.',
    items: [
      { pregunta: '1  What does Ruth say gives amateur film its value?',
        opciones: ['The skill of the people who shot it.', 'What appears behind the intended subject.', 'The affection with which it was made.', 'The rarity of surviving copies.'], correcta: 1 },
      { pregunta: '2  How does she contrast amateur film with newsreels?',
        opciones: ['Newsreels record the exceptional day rather than the ordinary years.', 'Newsreels were shot on more durable stock.', 'Newsreels concentrated on cities and ignored towns.', 'Newsreels were edited to please advertisers.'], correcta: 0 },
      { pregunta: '3  What does she say about the four fifths she cannot use?',
        opciones: ['They are usually damaged beyond repair.', 'They duplicate material she already holds.', 'They lack the information that would make them useful.', 'They were shot too badly to be watched.'], correcta: 2 },
      { pregunta: '4  What does she admit about identification by the public?',
        opciones: ['It has produced more errors than it has corrected.', 'It works only in places with an active local history group.', 'It is slower than doing the work in-house.', 'Her own team’s guesses were often the worse ones.'], correcta: 3 },
      { pregunta: '5  What is her objection to the emphasis on digitisation?',
        opciones: ['The equipment becomes obsolete too quickly.', 'A scanned reel nobody has catalogued is still closed.', 'It is far more expensive than funders realise.', 'It encourages the disposal of the originals.'], correcta: 1 },
      { pregunta: '6  Why does the archive keep the original film?',
        opciones: ['The law requires it for donated material.', 'Researchers still ask to handle the reels.', 'Every scanning standard so far has been superseded.', 'Cold storage has turned out to be cheap.'], correcta: 2 }
    ]
  },

  't3-lis4': {
    tipo: 'listening', parte: 4, titulo: 'Listening · Part 4',
    instruccion: 'You will hear five short extracts in which people talk about changing to a completely different kind of work. While you listen you must complete both tasks. <b>You will hear the recording twice.</b>',
    audio: 'audio/t3-lis4.mp3', escuchas: 2,
    opcionesCortas: true,
    contexto: 'Each task has its own list of eight options.',
    listas: [
      { titulo: 'Task One · Why did each speaker change?', opciones: [
        'the only promotion on offer led somewhere they did not want',
        'a health problem took the decision out of their hands',
        'the work they had trained for had ceased to exist',
        'an interest held for years was finally acted on',
        'their own reputation had become a trap',
        'they were asked to leave after a disagreement',
        'the pay had fallen below what they could accept',
        'a colleague talked them into trying something else'
      ] },
      { titulo: 'Task Two · What does each speaker say about it now?', opciones: [
        'they recommend making the change as undramatic as possible',
        'they are still shedding a habit from the old job',
        'they miss the authority more than the work itself',
        'they would go back if the conditions improved',
        'they accept a far smaller income in exchange',
        'they wish somebody had warned them about the cost',
        'they no longer resent the way it came about',
        'they were surprised how quickly they adapted'
      ] }
    ],
    items: [
      { pregunta: 'Tarea 1 · 1  Speaker one', opciones: ['A','B','C','D','E','F','G','H'], correcta: 0 },
      { pregunta: 'Tarea 1 · 2  Speaker two', opciones: ['A','B','C','D','E','F','G','H'], correcta: 3 },
      { pregunta: 'Tarea 1 · 3  Speaker three', opciones: ['A','B','C','D','E','F','G','H'], correcta: 1 },
      { pregunta: 'Tarea 1 · 4  Speaker four', opciones: ['A','B','C','D','E','F','G','H'], correcta: 4 },
      { pregunta: 'Tarea 1 · 5  Speaker five', opciones: ['A','B','C','D','E','F','G','H'], correcta: 2 },
      { pregunta: 'Tarea 2 · 6  Speaker one', opciones: ['A','B','C','D','E','F','G','H'], correcta: 2 },
      { pregunta: 'Tarea 2 · 7  Speaker two', opciones: ['A','B','C','D','E','F','G','H'], correcta: 0 },
      { pregunta: 'Tarea 2 · 8  Speaker three', opciones: ['A','B','C','D','E','F','G','H'], correcta: 6 },
      { pregunta: 'Tarea 2 · 9  Speaker four', opciones: ['A','B','C','D','E','F','G','H'], correcta: 4 },
      { pregunta: 'Tarea 2 · 10  Speaker five', opciones: ['A','B','C','D','E','F','G','H'], correcta: 1 }
    ]
  },


  /* ============== TEST 3 · SPEAKING Y WRITING ============== */

  't3-speak1': {
    tipo: 'speaking', parte: 2, titulo: 'Long turn: dónde se estudia',
    instruccion: 'Speak for <b>one minute</b> without stopping. You do not have to cover everything: choose and compare.',
    segundos: 60,
    pregunta: 'Why might people choose to study in these places, and what might be difficult about each?',
    puntos: ['a busy café in the middle of the afternoon', 'a silent university library', 'a kitchen table at home with the family around'],
    nota: 'En el examen esto se hace con tres fotografías. Aquí van descritas mientras la academia no aporte las suyas.',
    items: [ { grabacion: true } ]
  },

  't3-speak3': {
    tipo: 'speaking', parte: 3, titulo: 'Parte 3: decidir en voz alta',
    instruccion: 'Speak for <b>two minutes</b>. Discuss all five options and reach a conclusion.',
    segundos: 120,
    pregunta: 'A company wants its staff to keep learning. How useful is each of these, and which two would you choose?',
    puntos: ['paying for evening courses', 'an hour of protected study time each week', 'sending people to conferences', 'pairing new staff with experienced ones', 'a budget for books and subscriptions'],
    nota: 'En el examen esto se habla con otro candidato durante tres minutos: se negocia y se llega a un acuerdo. Grabándote solo se practica todo menos eso, que es un criterio entero de los cinco.',
    items: [ { grabacion: true } ]
  },

  't3-speak4': {
    tipo: 'speaking', parte: 4, titulo: 'Parte 4: opinar y justificar',
    instruccion: 'Answer the three questions one after the other, <b>two minutes</b> in total.',
    segundos: 120,
    pregunta: 'Questions about work and learning.',
    puntos: [
      'Should employers pay for training that a worker could take elsewhere? Why?',
      'Some people say experience teaches more than any course. Do you agree?',
      'Is it harder to change career now than it was for your parents?'
    ],
    nota: 'En el examen el examinador pregunta y luego pide tu reacción a lo que ha dicho la otra persona. Aquí solo está la primera mitad.',
    items: [ { grabacion: true } ]
  },

  't3-speakr': {
    tipo: 'speaking', parte: 2, titulo: 'Repaso: un minuto sin parar',
    instruccion: 'Speak for <b>one minute</b> without long pauses. Compare — do not simply describe.',
    segundos: 60,
    pregunta: 'Why might these situations be uncomfortable, and how might the people be dealing with them?',
    puntos: ['being corrected in front of other people', 'asking a question everybody else seems to know the answer to', 'explaining your work to somebody who does it better'],
    nota: 'El objetivo no es acertar: es no callarse. Si te quedas en blanco, di por qué te has quedado en blanco y sigue; en el examen eso puntúa más que el silencio.',
    items: [ { grabacion: true } ]
  },

  't3-write1': {
    tipo: 'writing', parte: 1, titulo: 'Essay',
    instruccion: 'Write <b>220–260 words</b>. This part is compulsory: in the exam you do not get to choose it.',
    minutos: 45, palabras: [220, 260],
    enunciado: 'Your class has discussed how adults can best keep learning after they finish formal education. Write an essay discussing two of the three approaches below and explaining which you think works better.',
    contexto: 'Approaches: formal courses with a qualification · learning on the job from colleagues · teaching yourself with books and the internet.',
    cierre: 'Write in a formal style. Do not simply list advantages: take a position and support it.',
    items: [ { escrito: true } ]
  },

  't3-write2': {
    tipo: 'writing', parte: 2, titulo: 'A elegir: propuesta o reseña',
    instruccion: 'Choose <b>one</b> of the two tasks and write <b>220–260 words</b>.',
    minutos: 45, palabras: [220, 260],
    enunciado: 'Choose one of the following two tasks.',
    contexto: '1 · Your workplace has money for one improvement to how new staff are trained. Write a proposal describing the present situation, recommending a change and explaining what it would achieve.\n2 · A website collects reviews of places to study. Write a review of a library, café or study space you know, describing it and saying who it would and would not suit.',
    cierre: 'La propuesta mira hacia delante y va dirigida a quien decide: encabezados, recomendación clara. La reseña es para un lector cualquiera y admite opinión y humor. Elige la que menos te apetezca: es la que necesitas practicar.',
    items: [ { escrito: true } ]
  },


  /* ===================== TEST 4 · GRAMATICA =====================
     Cuarta y ultima vuelta al temario de Elena, en su orden. Frases nuevas. */

  't4-gram1': {
    tipo: 'transformacion', titulo: 'Presentes · cuarta vuelta',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'It is ages since I last went to the cinema.', clave: 'BEEN', antes: 'I', despues: 'to the cinema for ages.', aceptadas: ["haven't been", 'have not been'] },
      { frase: 'She is in the habit of checking everything twice.', clave: 'ALWAYS', antes: 'She', despues: 'everything twice.', aceptadas: ['is always checking', 'always checks'] },
      { frase: 'The report is due on my desk by Friday.', clave: 'EXPECTED', antes: 'The report', despues: 'on my desk by Friday.', aceptadas: ['is expected'] },
      { frase: 'How long have you had this cough?', clave: 'BEEN', antes: 'How long', despues: 'from this cough?', aceptadas: ['have you been suffering'] },
      { frase: 'They are decorating our flat this week.', clave: 'BEING', antes: 'Our flat', despues: 'this week.', aceptadas: ['is being decorated'] },
      { frase: 'I still find the new keyboard strange.', clave: 'USED', antes: 'I', despues: 'the new keyboard.', aceptadas: ["haven't got used to", 'have not got used to'] }
    ]
  },

  't4-gram2': {
    tipo: 'transformacion', titulo: 'Pasados · cuarta vuelta',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'It was my first visit to Rome.', clave: 'NEVER', antes: 'I', despues: 'Rome before.', aceptadas: ['had never visited', 'had never been to'] },
      { frase: 'She was walking home when it happened.', clave: 'WAY', antes: 'It happened while she was', despues: 'home.', aceptadas: ['on her way'] },
      { frase: 'They finished the roof before the rain came.', clave: 'BY', antes: 'The roof was finished', despues: 'came.', aceptadas: ['by the time the rain'] },
      { frase: 'He had not eaten since breakfast.', clave: 'ANYTHING', antes: 'He had not', despues: 'since breakfast.', aceptadas: ['eaten anything'] },
      { frase: 'I did not know she had left.', clave: 'AWARE', antes: 'I', despues: 'she had left.', aceptadas: ["wasn't aware that", 'was not aware that'] },
      { frase: 'He talked for two hours before anyone asked a question.', clave: 'BEEN', antes: 'He', despues: 'for two hours when the first question came.', aceptadas: ['had been talking'] }
    ]
  },

  't4-gram3': {
    tipo: 'transformacion', titulo: 'Futuro · cuarta vuelta',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'The train leaves at six tomorrow.', clave: 'DUE', antes: 'The train', despues: 'at six tomorrow.', aceptadas: ['is due to leave'] },
      { frase: 'I am sure they will refuse.', clave: 'BOUND', antes: 'They', despues: '.', aceptadas: ['are bound to refuse'] },
      { frase: 'They will finish the bridge by June.', clave: 'HAVE', antes: 'The bridge', despues: 'by June.', aceptadas: ['will have been finished'] },
      { frase: 'We are about to leave.', clave: 'POINT', antes: 'We are on', despues: 'leaving.', aceptadas: ['the point of'] },
      { frase: 'Do not ring before you have read it.', clave: 'UNTIL', antes: 'Wait', despues: 'read it before you ring.', aceptadas: ['until you have'] },
      { frase: 'There is very little chance of rain.', clave: 'LIKELY', antes: 'It', despues: 'rain.', aceptadas: ["isn't likely to", 'is not likely to'] }
    ]
  },

  't4-gram4': {
    tipo: 'transformacion', titulo: 'Repaso de tiempos · cuarta vuelta',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I have not been to the dentist for two years.', clave: 'LAST', antes: 'The', despues: 'to the dentist was two years ago.', aceptadas: ['last time I went'] },
      { frase: 'A builder is repairing the roof next week.', clave: 'BEING', antes: 'The roof', despues: 'next week.', aceptadas: ['is being repaired'] },
      { frase: 'It started raining an hour ago and has not stopped.', clave: 'RAINING', antes: 'It', despues: 'for an hour.', aceptadas: ['has been raining'] },
      { frase: 'She left before I arrived.', clave: 'ALREADY', antes: 'She', despues: 'when I arrived.', aceptadas: ['had already left'] },
      { frase: 'They will not have finished waiting by ten.', clave: 'STILL', antes: 'At ten they', despues: '.', aceptadas: ['will still be waiting'] },
      { frase: 'This is the first time I have driven a van.', clave: 'NEVER', antes: 'I', despues: 'a van before.', aceptadas: ['have never driven', "'ve never driven"] }
    ]
  },

  't4-gram5': {
    tipo: 'transformacion', titulo: 'Costumbres · cuarta vuelta',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I found the noise strange at first but not any more.', clave: 'GOT', antes: 'I have', despues: 'the noise.', aceptadas: ['got used to'] },
      { frase: 'We often went there as children.', clave: 'WOULD', antes: 'As children we', despues: 'there.', aceptadas: ['would often go'] },
      { frase: 'She no longer smokes.', clave: 'USED', antes: 'She', despues: ', but she does not now.', aceptadas: ['used to smoke'] },
      { frase: 'Getting up at five feels normal to him now.', clave: 'ACCUSTOMED', antes: 'He has become', despues: 'at five.', aceptadas: ['accustomed to getting up'] },
      { frase: 'There was no bakery here before.', clave: 'BE', antes: 'There', despues: 'a bakery here.', aceptadas: ["didn't use to be", 'did not use to be'] },
      { frase: 'She is slowly adapting to the shifts.', clave: 'GETTING', antes: 'She is slowly', despues: 'the shifts.', aceptadas: ['getting used to'] }
    ]
  },

  't4-gram6': {
    tipo: 'transformacion', titulo: 'Obligación y prohibición',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'It is compulsory to wear a helmet here.', clave: 'MUST', antes: 'Helmets', despues: 'here.', aceptadas: ['must be worn'] },
      { frase: 'Photography is forbidden in this room.', clave: 'ALLOWED', antes: 'You', despues: 'photographs in this room.', aceptadas: ["aren't allowed to take", 'are not allowed to take'] },
      { frase: 'It was not necessary for us to book.', clave: 'HAVE', antes: 'We', despues: 'book.', aceptadas: ["didn't have to", 'did not have to'] },
      { frase: 'They obliged him to resign.', clave: 'MADE', antes: 'He', despues: 'resign.', aceptadas: ['was made to'] },
      { frase: 'Under no circumstances may you open it.', clave: 'OPEN', antes: 'You must', despues: 'under any circumstances.', aceptadas: ['not open it'] },
      { frase: 'It is up to you whether you stay.', clave: 'NEED', antes: 'You', despues: 'if you do not want to.', aceptadas: ["don't need to stay", 'do not need to stay'] }
    ]
  },

  't4-gram7': {
    tipo: 'transformacion', titulo: 'Deducciones · cuarta vuelta',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I am certain she has forgotten.', clave: 'MUST', antes: 'She', despues: '.', aceptadas: ['must have forgotten'] },
      { frase: 'It is impossible that they knew.', clave: 'HAVE', antes: 'They', despues: '.', aceptadas: ["can't have known", 'cannot have known'] },
      { frase: 'Perhaps the letter went to the wrong address.', clave: 'MIGHT', antes: 'The letter', despues: 'to the wrong address.', aceptadas: ['might have gone'] },
      { frase: 'I am sure that is not his handwriting.', clave: 'BE', antes: 'That', despues: 'his handwriting.', aceptadas: ["can't be", 'cannot be'] },
      { frase: 'Possibly nobody told them.', clave: 'MAY', antes: 'Nobody', despues: 'them.', aceptadas: ['may have told'] },
      { frase: 'The obvious conclusion is that he was lying.', clave: 'BEEN', antes: 'He must', despues: '.', aceptadas: ['have been lying'] }
    ]
  },

  't4-gram8': {
    tipo: 'transformacion', titulo: 'Consejo y reproche · cuarta vuelta',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'Signing it was a mistake.', clave: 'HAVE', antes: 'I', despues: 'it.', aceptadas: ["shouldn't have signed", 'should not have signed'] },
      { frase: 'Why did you not ask?', clave: 'OUGHT', antes: 'You', despues: '.', aceptadas: ['ought to have asked'] },
      { frase: 'The wise course would be to wait.', clave: 'BETTER', antes: 'You', despues: '.', aceptadas: ['had better wait', "'d better wait"] },
      { frase: 'I am sorry I did not listen to her.', clave: 'WISH', antes: 'I', despues: 'to her.', aceptadas: ['wish I had listened'] },
      { frase: 'It is not worth complaining now.', clave: 'POINT', antes: 'There is', despues: 'now.', aceptadas: ['no point complaining', 'no point in complaining'] },
      { frase: 'Perhaps you should try restarting it.', clave: 'WORTH', antes: 'It might', despues: 'it.', aceptadas: ['be worth restarting'] }
    ]
  },

  't4-gram9': {
    tipo: 'transformacion', titulo: 'Voz pasiva · cuarta vuelta',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'Someone has taken my umbrella.', clave: 'BEEN', antes: 'My umbrella', despues: '.', aceptadas: ['has been taken'] },
      { frase: 'They will announce the result on Monday.', clave: 'ANNOUNCED', antes: 'The result', despues: 'on Monday.', aceptadas: ['will be announced'] },
      { frase: 'Nobody is using this room.', clave: 'BEING', antes: 'This room', despues: '.', aceptadas: ["isn't being used", 'is not being used'] },
      { frase: 'They offered her the post.', clave: 'OFFERED', antes: 'She', despues: 'the post.', aceptadas: ['was offered'] },
      { frase: 'You must not leave bags here.', clave: 'LEFT', antes: 'Bags', despues: 'here.', aceptadas: ["mustn't be left", 'must not be left'] },
      { frase: 'They are going to close the road.', clave: 'BE', antes: 'The road is going', despues: 'closed.', aceptadas: ['to be'] }
    ]
  },

  't4-gram10': {
    tipo: 'transformacion', titulo: 'Pasivas impersonales · cuarta vuelta',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'People believe the coin is Roman.', clave: 'BELIEVED', antes: 'The coin', despues: 'Roman.', aceptadas: ['is believed to be'] },
      { frase: 'They say she refused the offer.', clave: 'HAVE', antes: 'She is said', despues: 'the offer.', aceptadas: ['to have refused'] },
      { frase: 'Everyone assumes the file was destroyed.', clave: 'ASSUMED', antes: 'It', despues: 'the file was destroyed.', aceptadas: ['is assumed that'] },
      { frase: 'People expected the talks to fail.', clave: 'EXPECTED', antes: 'The talks', despues: 'to fail.', aceptadas: ['were expected'] },
      { frase: 'Nobody has proved the claim.', clave: 'BEEN', antes: 'The claim', despues: 'proved.', aceptadas: ["hasn't been", 'has not been'] },
      { frase: 'They reported that two lorries were missing.', clave: 'REPORTED', antes: 'Two lorries', despues: 'missing.', aceptadas: ['were reported to be'] }
    ]
  },

  't4-gram11': {
    tipo: 'transformacion', titulo: 'Causativa · cuarta vuelta',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'A photographer is taking our picture tomorrow.', clave: 'HAVING', antes: 'We are', despues: 'tomorrow.', aceptadas: ['having our picture taken'] },
      { frase: 'Someone broke into their house last month.', clave: 'BROKEN', antes: 'They had their house', despues: 'last month.', aceptadas: ['broken into'] },
      { frase: 'I need somebody to look at my knee.', clave: 'LOOKED', antes: 'I need to have my knee', despues: '.', aceptadas: ['looked at'] },
      { frase: 'The garage is servicing the van on Tuesday.', clave: 'HAVING', antes: 'We are', despues: 'on Tuesday.', aceptadas: ['having the van serviced'] },
      { frase: 'A tailor shortened his trousers.', clave: 'GOT', antes: 'He', despues: 'shortened.', aceptadas: ['got his trousers'] },
      { frase: 'Somebody stole my wallet at the station.', clave: 'HAD', antes: 'I', despues: 'at the station.', aceptadas: ['had my wallet stolen'] }
    ]
  },

  't4-gram12': {
    tipo: 'transformacion', titulo: 'Condicionales · cuarta vuelta',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'She did not revise, so she failed.', clave: 'HAD', antes: 'If she', despues: ', she would have passed.', aceptadas: ['had revised'] },
      { frase: 'I am not tall enough to reach it.', clave: 'WERE', antes: 'If I', despues: ', I could reach it.', aceptadas: ['were taller'] },
      { frase: 'He drank too much coffee, so he cannot sleep now.', clave: 'NOT', antes: 'If he had', despues: 'so much coffee, he could sleep now.', aceptadas: ['not drunk'] },
      { frase: 'Take a coat; it may turn cold.', clave: 'CASE', antes: 'Take a coat', despues: 'cold.', aceptadas: ['in case it turns'] },
      { frase: 'She helped me, so I finished on time.', clave: 'HELPED', antes: 'If she', despues: ', I would not have finished on time.', aceptadas: ["hadn't helped me", 'had not helped me'] },
      { frase: 'They will only refund you with the receipt.', clave: 'UNLESS', antes: 'They will not refund you', despues: 'the receipt.', aceptadas: ['unless you have'] }
    ]
  },

  't4-gram13': {
    tipo: 'transformacion', titulo: 'Condicionales sin <i>if</i> · cuarta vuelta',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'If you need anything, ring the desk.', clave: 'SHOULD', antes: 'Ring the desk', despues: 'need anything.', aceptadas: ['should you'] },
      { frase: 'If they had asked, we would have said yes.', clave: 'ASKED', antes: 'Had', despues: ', we would have said yes.', aceptadas: ['they asked'] },
      { frase: 'You can stay if you do not smoke inside.', clave: 'PROVIDED', antes: 'You can stay', despues: 'inside.', aceptadas: ["provided you don't smoke", 'provided you do not smoke'] },
      { frase: 'If it were not for the traffic, we would be there.', clave: 'NOT', antes: 'Were it', despues: 'the traffic, we would be there.', aceptadas: ['not for'] },
      { frase: 'They will lend it to you if you bring it back on Monday.', clave: 'LONG', antes: 'They will lend it to you', despues: 'you bring it back on Monday.', aceptadas: ['as long as'] },
      { frase: 'If the price rose, we would look elsewhere.', clave: 'WERE', antes: 'We would look elsewhere,', despues: 'to rise.', aceptadas: ['were the price'] }
    ]
  },

  't4-gram14': {
    tipo: 'transformacion', titulo: 'Deseos y lamentos · cuarta vuelta',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I am sorry I sold the piano.', clave: 'WISH', antes: 'I', despues: 'the piano.', aceptadas: ["wish I hadn't sold", 'wish I had not sold'] },
      { frase: 'It is a shame we cannot stay longer.', clave: 'ONLY', antes: 'If', despues: 'stay longer.', aceptadas: ['only we could'] },
      { frase: 'I would rather you told nobody.', clave: 'PREFER', antes: 'I', despues: 'nobody.', aceptadas: ['would prefer you to tell', "'d prefer you to tell"] },
      { frase: 'She is annoyed that the train was late.', clave: 'BEEN', antes: 'She wishes the train', despues: 'late.', aceptadas: ["hadn't been", 'had not been'] },
      { frase: 'We ought to leave now.', clave: 'TIME', antes: 'It is', despues: 'left.', aceptadas: ['time we'] },
      { frase: 'I would rather be somewhere else.', clave: 'WERE', antes: 'I wish', despues: 'somewhere else.', aceptadas: ['I were'] }
    ]
  },

  't4-gram15': {
    tipo: 'transformacion', titulo: 'Relativo, comparación y <i>so / such</i> · cuarta vuelta',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'The queue was so slow that we left.', clave: 'SUCH', antes: 'It was', despues: 'that we left.', aceptadas: ['such a slow queue'] },
      { frase: 'The room was very cold, so nobody stayed.', clave: 'SO', antes: 'The room was', despues: 'nobody stayed.', aceptadas: ['so cold that'] },
      { frase: 'I bought a coat and its lining is torn.', clave: 'WHOSE', antes: 'I bought a coat', despues: 'is torn.', aceptadas: ['whose lining'] },
      { frase: 'This is the dullest talk I have ever heard.', clave: 'DULLER', antes: 'I have never heard', despues: 'talk.', aceptadas: ['a duller'] },
      { frase: 'The bill was far less than I had feared.', clave: 'NEARLY', antes: 'The bill was', despues: 'as I had feared.', aceptadas: ['not nearly as high'] },
      { frase: 'The neighbour, who I had never spoken to, complained.', clave: 'WHOM', antes: 'The neighbour,', despues: 'spoken, complained.', aceptadas: ['to whom I had never'] }
    ]
  },

  't4-gram16': {
    tipo: 'transformacion', titulo: 'Estilo indirecto e inversión · cuarta vuelta',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: '"I did not take it," he said.', clave: 'DENIED', antes: 'He', despues: 'it.', aceptadas: ['denied taking'] },
      { frase: '"You should see a doctor," she told me.', clave: 'ADVISED', antes: 'She', despues: 'a doctor.', aceptadas: ['advised me to see'] },
      { frase: '"I am sorry I was late," he said.', clave: 'APOLOGISED', antes: 'He', despues: 'late.', aceptadas: ['apologised for being'] },
      { frase: 'I had never seen anything like it.', clave: 'HAD', antes: 'Never', despues: 'anything like it.', aceptadas: ['had I seen'] },
      { frase: 'She realised her error only on the train.', clave: 'UNTIL', antes: 'Not', despues: 'the train did she realise her error.', aceptadas: ['until she was on'] },
      { frase: 'They had scarcely arrived when the storm broke.', clave: 'SOONER', antes: 'No', despues: 'arrived than the storm broke.', aceptadas: ['sooner had they'] }
    ]
  },


  /* ===================== TEST 4 · VOCABULARIO ===================== */

  't4-voc1': {
    tipo: 'caja', titulo: 'Preposiciones tras sustantivo · cuarta vuelta',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['at', 'between', 'for', 'in', 'of', 'on', 'to', 'with'],
    items: [
      { antes: 'There is no substitute', despues: 'experience.', aceptadas: ['for'] },
      { antes: 'She has a good eye', despues: 'detail.', aceptadas: ['for'] },
      { antes: 'Their reaction', despues: 'the news surprised me.', aceptadas: ['to'] },
      { antes: 'He has an obsession', despues: 'punctuality.', aceptadas: ['with'] },
      { antes: 'There has been a sharp fall', despues: 'applications.', aceptadas: ['in'] },
      { antes: 'The difference', despues: 'the two is very slight.', aceptadas: ['between'] }
    ]
  },

  't4-voc2': {
    tipo: 'caja', titulo: 'Phrasal verbs · con la gente',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['along', 'down', 'in', 'into', 'off', 'on', 'out', 'up'],
    items: [
      { antes: 'They fell', despues: 'over money and have not spoken since.', aceptadas: ['out'] },
      { antes: 'She let me', despues: 'badly last week.', aceptadas: ['down'] },
      { antes: 'He has taken', despues: 'far too much work this term.', aceptadas: ['on'] },
      { antes: 'I ran', despues: 'an old colleague at the airport.', aceptadas: ['into'] },
      { antes: 'They put me', despues: 'for two nights without being asked.', aceptadas: ['up'] },
      { antes: 'We get', despues: 'much better than we used to.', aceptadas: ['along'] }
    ]
  },

  't4-voc3': {
    tipo: 'caja', titulo: 'Adjetivos y su preposición · cuarta vuelta',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['about', 'at', 'for', 'from', 'of', 'on', 'to', 'with'],
    items: [
      { antes: 'She is notorious', despues: 'arriving late.', aceptadas: ['for'] },
      { antes: 'The result is entirely dependent', despues: 'the weather.', aceptadas: ['on'] },
      { antes: 'He is quite indifferent', despues: 'what people think.', aceptadas: ['to'] },
      { antes: 'The centre is short', despues: 'volunteers again.', aceptadas: ['of'] },
      { antes: 'I am hopeless', despues: 'chess and always have been.', aceptadas: ['at'] },
      { antes: 'The town is quite distinct', despues: 'its neighbours.', aceptadas: ['from'] }
    ]
  },

  't4-voc4': {
    tipo: 'caja', titulo: 'Expresiones hechas · avanzar y atascarse',
    instruccion: 'Complete each expression with a word from the box. There are more words than you need.',
    caja: ['board', 'bridge', 'door', 'ground', 'home', 'line', 'road', 'wall'],
    items: [
      { antes: 'It is time to go back to the drawing', despues: '.', aceptadas: ['board'] },
      { antes: 'We will cross that', despues: 'when we come to it.', aceptadas: ['bridge'] },
      { antes: 'The two of them found common', despues: 'in the end.', aceptadas: ['ground'] },
      { antes: 'Trying to explain it was like talking to a brick', despues: '.', aceptadas: ['wall'] },
      { antes: 'The photograph drove the point', despues: 'in a way the figures had not.', aceptadas: ['home'] },
      { antes: 'Somewhere along the', despues: 'we lost the thread of it.', aceptadas: ['line'] }
    ]
  },

  't4-voc5': {
    tipo: 'cloze', titulo: 'Open cloze · el mismo camino',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Most people have a route they take without ever deciding to. It is rarely the shortest and almost never the one they would recommend to a visitor; it is simply the one their feet have settled {1}. Ask them why and you will get an answer invented on the spot, which they will then believe.',
      'What the route is doing is saving attention. A street you know is a street you do not have to look at, and not looking at things is {2} the brain spends most of its effort trying to arrange. This is efficient and it has a price: the route becomes invisible, and after a few years you could not describe the middle of it {3} your life depended on it. {4} is why people notice that a shop has closed about three weeks after it closes.',
      'The remedy is absurdly simple and almost nobody applies it. Turn left {5} you would normally turn right. You will arrive four minutes late and see a city you have lived in for a decade. The reason we do not do it is not laziness. It is that the route is a small daily promise that today will contain nothing we have not already dealt {6}.'
    ],
    items: [
      { aceptadas: ['on'] }, { aceptadas: ['what'] }, { aceptadas: ['if'] },
      { aceptadas: ['that', 'this'] }, { aceptadas: ['where'] }, { aceptadas: ['with'] }
    ]
  },

  't4-voc6': {
    tipo: 'cloze', titulo: 'Open cloze · quien sabe cómo funciona todo',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Every organisation has somebody who knows how it actually works, and it is almost never the person at the top of the chart. It is far more {1} to be whoever has been there longest in a job nobody has thought to reorganise: the person on the front desk, the one who orders the paper.',
      'They know because information reaches them by accident. Nobody briefs the front desk, {2} everybody walks past it, and over eleven years that adds {3} to a map no consultant could produce in six weeks. Ask them who to speak to about a broken lift and you will have a name in four seconds; ask a director the same question and you will be given a department.',
      'Sensible managers understand this and treat it as a resource. The rest treat it as an untidiness, and every few years somebody arrives with a plan {4} moves the front desk into a shared service in another city. The saving is real and appears in the accounts. The loss is also real and appears {5} in the accounts at all, which is exactly why the plan keeps being approved. Institutions can only count what somebody has thought {6} counting.'
    ],
    items: [
      { aceptadas: ['likely'] }, { aceptadas: ['but', 'yet'] }, { aceptadas: ['up'] },
      { aceptadas: ['which', 'that'] }, { aceptadas: ['nowhere'] }, { aceptadas: ['of'] }
    ]
  },

  't4-voc7': {
    tipo: 'formacion', titulo: 'Word formation · nombres · cuarta vuelta',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The', despues: 'of the two towers took a year.', raiz: 'DEMOLISH', aceptadas: ['demolition'] },
      { antes: 'Her', despues: 'was accepted without argument.', raiz: 'RESIGN', aceptadas: ['resignation'] },
      { antes: 'There is no', despues: 'for what he did.', raiz: 'JUSTIFY', aceptadas: ['justification'] },
      { antes: 'The', despues: 'of the drug is still under review.', raiz: 'SAFE', aceptadas: ['safety'] },
      { antes: 'They apologised for the', despues: 'and refunded the fare.', raiz: 'INCONVENIENT', aceptadas: ['inconvenience'] },
      { antes: 'His', despues: 'to the field is widely recognised.', raiz: 'CONTRIBUTE', aceptadas: ['contribution'] }
    ]
  },

  't4-voc8': {
    tipo: 'formacion', titulo: 'Word formation · adjetivos · cuarta vuelta',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The evidence turned out to be largely', despues: '.', raiz: 'RELY', aceptadas: ['unreliable'] },
      { antes: 'Her account of the evening was entirely', despues: '.', raiz: 'BELIEVE', aceptadas: ['believable'] },
      { antes: 'The instructions were needlessly', despues: '.', raiz: 'COMPLICATE', aceptadas: ['complicated'] },
      { antes: 'The soup was, I am afraid, completely', despues: '.', raiz: 'TASTE', aceptadas: ['tasteless'] },
      { antes: 'His handwriting is barely', despues: '.', raiz: 'READ', aceptadas: ['readable'] },
      { antes: 'The offer they made was frankly', despues: '.', raiz: 'INSULT', aceptadas: ['insulting'] }
    ]
  },

  't4-voc9': {
    tipo: 'caja', titulo: 'Verbos con preposición fija · cuarta vuelta',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['about', 'for', 'from', 'in', 'of', 'on', 'to', 'with'],
    items: [
      { antes: 'Nobody warned us', despues: 'the road works.', aceptadas: ['about'] },
      { antes: 'She apologised', despues: 'the delay before anyone complained.', aceptadas: ['for'] },
      { antes: 'The whole street benefited', despues: 'the change.', aceptadas: ['from'] },
      { antes: 'He confided', despues: 'his sister and nobody else.', aceptadas: ['in'] },
      { antes: 'I do not approve', despues: 'the method, whatever the result.', aceptadas: ['of'] },
      { antes: 'The two accounts do not correspond', despues: 'each other at all.', aceptadas: ['to'] }
    ]
  },

  't4-voc10': {
    tipo: 'caja', titulo: 'Phrasal verbs · problemas y salidas',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['away', 'back', 'down', 'off', 'out', 'round', 'through', 'up'],
    items: [
      { antes: 'The talks broke', despues: 'again on Friday afternoon.', aceptadas: ['down'] },
      { antes: 'They came', despues: 'to our position in the end.', aceptadas: ['round'] },
      { antes: 'We will have to put the meeting', despues: 'until March.', aceptadas: ['off'] },
      { antes: 'I cannot work', despues: 'what she actually wants.', aceptadas: ['out'] },
      { antes: 'The colour has faded', despues: 'over the years.', aceptadas: ['away'] },
      { antes: 'She sailed', despues: 'the interview without appearing to try.', aceptadas: ['through'] }
    ]
  },

  't4-voc11': {
    tipo: 'caja', titulo: 'Colocaciones · verbo y sustantivo · cuarta vuelta',
    instruccion: 'Complete each sentence with a verb from the box. There are more verbs than you need.',
    caja: ['bear', 'cast', 'draw', 'make', 'place', 'put', 'strike', 'take'],
    items: [
      { antes: 'It is hard to', despues: 'a balance between the two.', aceptadas: ['strike'] },
      { antes: 'Please', despues: 'in mind that the office shuts at four.', aceptadas: ['bear'] },
      { antes: 'Nobody was willing to', despues: 'the blame for it.', aceptadas: ['take'] },
      { antes: 'The new report', despues: 'doubt on the earlier figures.', aceptadas: ['cast'] },
      { antes: 'Before we finish I would like to', despues: 'a suggestion.', aceptadas: ['make'] },
      { antes: 'She was asked to', despues: 'an order by the end of the week.', aceptadas: ['place'] }
    ]
  },

  't4-voc12': {
    tipo: 'caja', titulo: 'Expresiones con distancia y medida',
    instruccion: 'Complete each expression with a word from the box. There are more words than you need.',
    caja: ['bottom', 'half', 'inch', 'mile', 'number', 'odds', 'stone', 'yard'],
    items: [
      { antes: 'He would not give an', despues: 'in the negotiation.', aceptadas: ['inch'] },
      { antes: 'You could see the mistake a', despues: 'off.', aceptadas: ['mile'] },
      { antes: 'She got to the', despues: 'of it eventually.', aceptadas: ['bottom'] },
      { antes: 'The', despues: 'were against them from the start.', aceptadas: ['odds'] },
      { antes: 'If you think that was bad, you do not know the', despues: 'of it.', aceptadas: ['half'] },
      { antes: 'Nobody knows the exact', despues: 'of people affected.', aceptadas: ['number'] }
    ]
  },

  't4-voc13': {
    tipo: 'cloze', titulo: 'Open cloze · las instrucciones',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Nobody reads the instructions, and the industry response has been to make them shorter, which has not helped {1} the smallest degree. The problem was never length. It is that instructions are written by somebody who already understands the object, and that person has lost the ability to imagine not understanding it.',
      'The classic failure is the step that says “connect the unit”. To the writer this is one action. To the reader it is four questions, {2} of which the page answers. Every trade has its own version of this, and every trade is convinced the version is the reader’s fault. The evidence says otherwise: give the same page to six people who have never seen the object and you will get six different first moves, which is not a coincidence {3} a measurement.',
      'The only reliable method is embarrassing and cheap. Sit somebody down with the object and the page and say nothing at all, {4} matter what they do. Twenty minutes of that will teach you more {5} a year of redrafting, and most organisations will not do it, because watching a stranger fail to use your product is unpleasant and cannot be delegated. So the instructions get shorter, the calls to the helpline stay {6} they were, and everybody agrees that people simply do not read.'
    ],
    items: [
      { aceptadas: ['in'] }, { aceptadas: ['none'] }, { aceptadas: ['but'] },
      { aceptadas: ['no'] }, { aceptadas: ['than'] }, { aceptadas: ['as', 'where'] }
    ]
  },

  't4-voc14': {
    tipo: 'cloze', titulo: 'Open cloze · cambiar de opinión',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Changing your mind in public is one of the few genuinely difficult things, and the difficulty has almost nothing to {1} with the facts. By the time an argument has been had twice, the position has stopped being a belief and become a piece of furniture: other people know where it stands, and so do you.',
      'This is why better evidence often makes matters worse. Somebody arrives with the decisive study, and instead {2} conceding you notice that they are enjoying themselves. The concession they are asking {3} is not an intellectual one. It is social, it is expensive, and they have not offered to pay any part of it.',
      'The people who are good at this appear to share a single habit: they say it early and briefly, before the position has hardened, and they do {4} apologise at length. “I had that wrong” is a complete sentence. What follows it should be the new position rather {5} a long account of how the old one came about, which is only a way of defending it while appearing to give it {6}.'
    ],
    items: [
      { aceptadas: ['do'] }, { aceptadas: ['of'] }, { aceptadas: ['for'] },
      { aceptadas: ['not'] }, { aceptadas: ['than'] }, { aceptadas: ['up'] }
    ]
  },

  't4-voc15': {
    tipo: 'formacion', titulo: 'Word formation · prefijos · cuarta vuelta',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The figures in the leaflet were deliberately', despues: '.', raiz: 'LEAD', aceptadas: ['misleading'] },
      { antes: 'The two accounts are simply', despues: '.', raiz: 'RECONCILE', aceptadas: ['irreconcilable'] },
      { antes: 'They had to', despues: 'the entire schedule at two days’ notice.', raiz: 'ARRANGE', aceptadas: ['rearrange'] },
      { antes: 'Her role in it has been consistently', despues: '.', raiz: 'VALUE', aceptadas: ['undervalued'] },
      { antes: 'Given the forecast, the delay was entirely', despues: '.', raiz: 'FORESEE', aceptadas: ['foreseeable'] },
      { antes: 'His conduct at the meeting was wholly', despues: '.', raiz: 'PROFESSION', aceptadas: ['unprofessional'] }
    ]
  },

  't4-voc16': {
    tipo: 'formacion', titulo: 'Word formation · adverbios · cuarta vuelta',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The scheme has been', despues: 'successful, given the budget.', raiz: 'SURPRISE', aceptadas: ['surprisingly'] },
      { antes: 'She answered', despues: 'and left the room.', raiz: 'CURT', aceptadas: ['curtly'] },
      { antes: 'The two accounts differ', despues: 'on one point.', raiz: 'MARK', aceptadas: ['markedly'] },
      { antes: 'He behaved', despues: 'throughout, which nobody expected.', raiz: 'IMPECCABLE', aceptadas: ['impeccably'] },
      { antes: 'The results are', despues: 'better than last year’s.', raiz: 'CONSIDER', aceptadas: ['considerably'] },
      { antes: 'They dealt with the complaint', despues: 'and quickly.', raiz: 'SENSE', aceptadas: ['sensibly'] }
    ]
  },


  /* ===================== TEST 4 · USE OF ENGLISH ===================== */

  't4-use1': {
    tipo: 'opcion', parte: 1, titulo: 'Use of English · Part 1',
    instruccion: 'Decide which answer best fits each gap.',
    texto: [
      'For most of the twentieth century the ambition was to get rid of rivers. A stream running through a town was a nuisance and a health risk, and the sensible thing was to {1} it in a pipe and build over the top. Hundreds of European towns did exactly that, and for sixty years nobody gave it a second {2}.',
      'The reversal, when it came, was not driven by nostalgia. A pipe built for the rainfall of 1930 cannot {3} with the rainfall of today, and the cheapest way to increase its capacity is often to take the lid off altogether. Councils that would never have {4} the money for a beauty project found it at once for a drainage one.',
      'What nobody predicted was the effect on the streets themselves. A town that has spent a decade arguing about parking will {5} its mind about a road within eighteen months once there is water beside it. Property prices rise, which is the part that {6} up in the reports; the part that is harder to {7} is that people simply walk more. Whether any of it justifies the cost is still argued over, although the argument is now about {8} much to spend rather than whether to spend anything at all.'
    ],
    items: [
      { opciones: ['sink', 'drown', 'hide', 'bury'], correcta: 3 },
      { opciones: ['thought', 'idea', 'mind', 'notice'], correcta: 0 },
      { opciones: ['manage', 'cope', 'handle', 'meet'], correcta: 1 },
      { opciones: ['spared', 'found', 'granted', 'lent'], correcta: 1 },
      { opciones: ['turn', 'shift', 'alter', 'change'], correcta: 3 },
      { opciones: ['ends', 'turns', 'comes', 'finishes'], correcta: 0 },
      { opciones: ['count', 'measure', 'weigh', 'value'], correcta: 1 },
      { opciones: ['what', 'so', 'how', 'too'], correcta: 2 }
    ]
  },

  't4-use2a': {
    tipo: 'cloze', parte: 2, titulo: 'Use of English · Part 2',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'There is a drawer in most houses that contains nothing anybody has looked at in four years. It is not a drawer for things you need; it is a drawer for things you cannot {1} yourself to throw away, which is a different category and a much larger one.',
      'The usual advice is to be ruthless, and the usual advice fails, because it misunderstands what the drawer is {2}. Almost nothing in it is kept for its use. The guarantee for an appliance sold nine years ago is not insurance; it is a receipt for a decision, and throwing it out means admitting {3} the decision was taken by somebody you no longer quite are.',
      'A better method is to accept the drawer and give it a limit. One drawer, not four; and {4} it will not close, something leaves. This works {5} the usual advice does not, because it never asks you to decide what matters, only what matters {6}. Choosing between two things is a task a human being can perform. Deciding whether a thing matters in the abstract is a task {7} which nobody is equipped, and it is the reason the drawer is still there. You may find, after a year of this, that it empties itself with very {8} help from you.'
    ],
    items: [
      { aceptadas: ['bring'] }, { aceptadas: ['for'] }, { aceptadas: ['that'] },
      { aceptadas: ['when', 'once'] }, { aceptadas: ['where'] }, { aceptadas: ['most'] },
      { aceptadas: ['for'] }, { aceptadas: ['little'] }
    ]
  },

  't4-use2b': {
    tipo: 'cloze', parte: 2, titulo: 'Use of English · Part 2',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Arriving early is treated as a virtue and is usually nothing {1} the sort. The habitually early are not more considerate than everybody else; they are people who find waiting less unpleasant {2} the possibility of being late, and have arranged their lives accordingly.',
      'This is worth saying because the early tend to be insufferable about it. They will tell you, {3} being asked, how long the journey took, and they will treat somebody else’s different arrangement {4} a moral failing rather than a different tolerance for the same discomfort. The late, {5} their part, are no better: they present their lateness as evidence of a full and interesting life, which it very rarely is.',
      'What both are doing is converting a temperament into a virtue, which is the commonest move in the whole of human self-description and the hardest {6} spot in oneself. The useful question is not whether you are early or late. It is what you are prepared to give {7} in order to stay that way, and how much of somebody else’s morning you are spending {8} it.'
    ],
    items: [
      { aceptadas: ['of'] }, { aceptadas: ['than'] }, { aceptadas: ['without'] },
      { aceptadas: ['as'] }, { aceptadas: ['for'] }, { aceptadas: ['to'] },
      { aceptadas: ['up'] }, { aceptadas: ['on'] }
    ]
  },

  't4-use3': {
    tipo: 'formacion', parte: 3, titulo: 'Use of English · Part 3',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The report was written with admirable', despues: '.', raiz: 'BRIEF', aceptadas: ['brevity'] },
      { antes: 'His', despues: 'was never in doubt, whatever else was.', raiz: 'HONEST', aceptadas: ['honesty'] },
      { antes: 'The system is', despues: 'complicated for what it does.', raiz: 'NEED', aceptadas: ['needlessly'] },
      { antes: 'The two sets of figures are not', despues: '.', raiz: 'COMPARE', aceptadas: ['comparable'] },
      { antes: 'They handled the whole matter with complete', despues: '.', raiz: 'DISCREET', aceptadas: ['discretion'] },
      { antes: 'The results were', despues: 'disappointing after so much work.', raiz: 'BITTER', aceptadas: ['bitterly'] },
      { antes: 'She has an', despues: 'memory for names.', raiz: 'EXCEPTION', aceptadas: ['exceptional'] },
      { antes: 'The scheme proved', despues: 'from the very first week.', raiz: 'WORK', aceptadas: ['unworkable'] }
    ]
  },

  't4-use4a': {
    tipo: 'transformacion', parte: 4, titulo: 'Use of English · Part 4',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I have never been so bored.', clave: 'MORE', antes: 'I have never', despues: 'in my life.', aceptadas: ['been more bored'] },
      { frase: 'Nobody had warned me about the cost.', clave: 'BEEN', antes: 'I', despues: 'about the cost.', aceptadas: ["hadn't been warned", 'had not been warned'] },
      { frase: 'She did not mind waiting.', clave: 'OBJECT', antes: 'She', despues: 'waiting.', aceptadas: ["didn't object to", 'did not object to'] },
      { frase: 'It was raining, so we stayed in.', clave: 'ACCOUNT', antes: 'We stayed in', despues: 'the rain.', aceptadas: ['on account of'] },
      { frase: 'He only calmed down after an hour.', clave: 'TOOK', antes: 'It', despues: 'him to calm down.', aceptadas: ['took an hour for'] },
      { frase: 'They cannot possibly have finished.', clave: 'WAY', antes: 'There is', despues: 'have finished.', aceptadas: ['no way they can', 'no way they could'] }
    ]
  },

  't4-use4b': {
    tipo: 'transformacion', parte: 4, titulo: 'Use of English · Part 4',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'She was too tired to argue.', clave: 'ENERGY', antes: 'She did not', despues: 'argue.', aceptadas: ['have the energy to'] },
      { frase: 'The decision is not mine to make.', clave: 'UP', antes: 'It is not', despues: 'me.', aceptadas: ['up to'] },
      { frase: 'They have not repaired the lift yet.', clave: 'BEEN', antes: 'The lift', despues: 'yet.', aceptadas: ["hasn't been repaired", 'has not been repaired'] },
      { frase: 'Everybody thinks he wrote it himself.', clave: 'HAVE', antes: 'He is thought', despues: 'it himself.', aceptadas: ['to have written'] },
      { frase: 'I would prefer not to discuss it.', clave: 'RATHER', antes: 'I', despues: 'it.', aceptadas: ['would rather not discuss', "'d rather not discuss"] },
      { frase: 'He did not say a word for an hour.', clave: 'SILENT', antes: 'He', despues: 'for an hour.', aceptadas: ['remained silent', 'stayed silent'] }
    ]
  },


  /* ===================== TEST 4 · READING ===================== */

  't4-read5': {
    tipo: 'lectura', parte: 5, titulo: 'Reading · Part 5',
    instruccion: 'Read the text and choose the answer (A, B, C or D) which fits best according to the text.',
    tituloTexto: 'The woman who writes the questions',
    texto: [
      'Pilar Anzola works in a room with no windows, which she is careful to say is not a metaphor: the building is old and the room used to be a store. On the table in front of her are eleven newspaper articles, four of which she has already rejected, and a printed sheet of numbers that matters more to her than any of them. She has written examination questions for nineteen years and has never met a single person who has answered one.',
      'The job is not, she insists, writing questions. “Anybody can write a question. The question is the easy half.” What she is actually doing is predicting the ways in which a competent person might arrive at the wrong answer, and then making sure that each of those ways is represented by one of the options. A wrong answer that nobody chooses is not a wrong answer. It is a blank, and it makes the item easier than anyone intended.',
      'This is where the sheet of numbers comes in. Every item is tried out on real candidates before it is ever used, and the results are more brutal than most people expect. An item that everybody answers correctly tells you nothing and is thrown away; so is one that everybody gets wrong. The kind that worries her is the third: the item the weakest candidates answer correctly and the strongest ones do not. “That is not a hard question,” she says. “That is a broken one, and it will look perfectly reasonable to you and me for as long as we care to stare at it.”',
      'She has one private rule, which she describes as the only thing she is dogmatic about. Nothing she believes may appear anywhere in an item: not the topic, not the tone, and above all not the correct answer to a question of opinion. “A candidate who agrees with me should not gain a mark for it. If they can, I have written a bad item, and I have also done something rather worse than that.”',
      'She offers an example, and it is not one that flatters her. An item she had been pleased with, about a woman returning to the town she grew up in, went to pretesting and failed in a way she had not foreseen. Candidates who had themselves emigrated read the passage quite differently from those who had not, and answered a question about the woman’s motives accordingly. Both readings were defensible. “The text was fine and the question was fine. Together they measured where the candidate had lived. It went in the bin, and it took me three days to stop arguing with the numbers.”',
      'Asked what she makes of candidates who work through past papers, she is more generous than expected and then rather less so. Past papers, she says, teach the shape of the thing, which is worth knowing, and a candidate who has never seen the format will waste ten minutes finding out. But she has a warning she says nobody wants to hear. “If you can do the old papers and not the new ones, you have learned my habits. That is a genuine achievement and it is not English, and in the end the paper is not the thing you are being examined on.”'
    ],
    items: [
      { pregunta: '1  Why does Anzola point out that the windowless room “is not a metaphor”?',
        opciones: ['To make light of how ordinary the setting is.',
                   'To complain about the conditions she works in.',
                   'To explain why the work takes so long.',
                   'To suggest the secrecy has been exaggerated.'], correcta: 0 },
      { pregunta: '2  What does Anzola say the real work of writing an item consists of?',
        opciones: ['Finding a text that has not been used before.',
                   'Making the wording as clear as it can possibly be.',
                   'Anticipating the routes by which people reach a wrong answer.',
                   'Keeping the difficulty consistent from paper to paper.'], correcta: 2 },
      { pregunta: '3  Why is an option that nobody chooses a problem?',
        opciones: ['It suggests the text was too difficult for the level.',
                   'It makes the item easier than it was meant to be.',
                   'It shows the candidates were not concentrating.',
                   'It has usually been taken from an older item.'], correcta: 1 },
      { pregunta: '4  Which kind of item does Anzola find most troubling?',
        opciones: ['One that almost every candidate answers correctly.',
                   'One that almost no candidate answers correctly.',
                   'One that gives different results each time it is used.',
                   'One that the strongest candidates get wrong.'], correcta: 3 },
      { pregunta: '5  Why was the item about the returning woman withdrawn?',
        opciones: ['The passage was harder than it had appeared.',
                   'The question turned out to have two correct answers.',
                   'It measured the candidate’s own experience rather than their English.',
                   'Candidates found the subject matter upsetting.'], correcta: 2 },
      { pregunta: '6  What is her warning about past papers?',
        opciones: ['They are a poor guide to the format now in use.',
                   'Doing well on them may reflect familiarity with her rather than with English.',
                   'They take up time that would be better spent reading.',
                   'They give candidates a misleading sense of the timing.'], correcta: 1 }
    ]
  },

  't4-read6': {
    tipo: 'lectura', parte: 6, titulo: 'Reading · Part 6',
    instruccion: 'You will read four extracts in which specialists give their views on the four-day week. For each question, choose from the extracts A–D.',
    opcionesCortas: true,
    secciones: [
      { letra: 'A', titulo: 'Nerea Salas, labour economist',
        texto: ['The trial results are better than I expected and they cannot bear the weight being put on them. Every published trial is of a firm that volunteered, which means a firm whose managers already believed it would work, in a sector where output is easy to shift about. That is not a sample; it is a group of enthusiasts, and I say so as somebody who would like the finding to hold. Run it in more places, including the awkward ones, and I will change my position. Legislate on what we have now and we will spend a decade arguing about numbers that were never designed to answer the question.'] },
      { letra: 'B', titulo: 'Gareth Mbeki, operations director',
        texto: ['I read the studies and they moved me not at all; what moved me was running the thing for fourteen months. The output argument turned out to be the easy one — we lost nothing measurable and I no longer expect anybody to believe that until they try it. The genuinely hard problem is coverage. Somebody has to answer the phone on Friday, and every hour I have spent on this has been spent on the rota rather than on productivity. Nobody writing about the four-day week seems to have built one.'] },
      { letra: 'C', titulo: 'Hélène Ruiz, sociologist of work',
        texto: ['My worry is who this is for. Shortening the week is straightforward where the work is a set of tasks in a diary and close to impossible where the work is a person in a room: a ward, a classroom, a shop floor. If it spreads through the professions and stops at the door of everybody else, we will have handed a further advantage to those who had one already. I would also say, and I know it is unwelcome, that the firms we keep citing put themselves forward, and a study of volunteers tells you about volunteers.'] },
      { letra: 'D', titulo: 'Tomas Lindqvist, historian of labour',
        texto: ['The Saturday half-holiday was going to ruin British industry; so was the eight-hour day; so was the abolition of the six-day week. In each case the objection was coverage, in each case it was serious, and in each case it was solved by people who had been told it could not be. What I resist is the demand for proof beforehand. These changes have never been introduced because a study licensed them. They were introduced, and the studies came afterwards to explain why nothing had collapsed.'] }
    ],
    items: [
      { pregunta: '1  Which expert argues that the change is far harder in some kinds of work than in others?',
        opciones: ['A', 'B', 'C', 'D'], correcta: 2 },
      { pregunta: '2  Which expert shares C’s doubts about the firms the research is based on?',
        opciones: ['A', 'B', 'C', 'D'], correcta: 0 },
      { pregunta: '3  Which expert takes a different view from A on whether evidence should come first?',
        opciones: ['A', 'B', 'C', 'D'], correcta: 3 },
      { pregunta: '4  Which expert was convinced by doing it rather than by any argument?',
        opciones: ['A', 'B', 'C', 'D'], correcta: 1 }
    ]
  },

  't4-read7': {
    tipo: 'lectura', parte: 7, titulo: 'Reading · Part 7',
    instruccion: 'Six paragraphs have been removed from the text. Choose from the paragraphs A–G the one which fits each gap. There is one extra paragraph which you do not need to use.',
    tituloTexto: 'Sixty-one years of rain',
    opcionesCortas: true,
    texto: [
      'The first entry in the ledger is dated the second of January 1963 and reads, in pencil: “Hard frost. 0.0 mm. Pipes.” It was written by Aurelio Beitia, a schoolmaster, who had been given a rain gauge by his brother-in-law and did not particularly want it.',
      '{1}',
      'By 1970 the ledger had become three ledgers, and the entries had acquired a discipline they had lacked at the start: the same time each morning, the same wording, the gauge read before anything else happened in the house.',
      '{2}',
      'His daughter Idoia took it over in 1991 without any discussion, in the way such things are taken over.',
      '{3}',
      'What none of them understood at the time was what they had. A national weather service maintains a station for as long as the funding lasts, and the average life of one in this region is eleven years. Six decades in one garden, at one height, with one instrument, is a different kind of object altogether.',
      '{4}',
      'The telephone call, when it eventually came, was from a university and was not about rain.',
      '{5}',
      'The record is now held in two places and copied in a third.',
      '{6}',
      'Idoia still reads the gauge at eight. She has been asked whether the daily habit is a burden after thirty-four years, and gives an answer that would have irritated her father, who thought that sort of question sentimental. She says that on the day she stops, sixty-one years become a closed thing that somebody studies, and that until then it is a sentence which has not finished.'
    ],
    secciones: [
      { letra: 'A', texto: ['She was twenty-six, she had no particular interest in the weather, and her father had had a stroke. The first entries in her hand are noticeably careful, as though the ledger were watching her.'] },
      { letra: 'B', texto: ['They wanted the frost dates. Somebody studying when fruit trees come into flower had run out of local records at 1988, and here was a series that began before their own department existed. The rain, it turned out, was the least interesting column in the book.'] },
      { letra: 'C', texto: ['He kept it up for the first year out of politeness and for the second out of habit, which is the order in which most long things begin. The entries from that period are irregular and occasionally missing, and he later apologised for them in a marginal note nobody had asked him for.'] },
      { letra: 'D', texto: ['Rain gauges are simple to the point of insult: a funnel of a known diameter, a container, and a cylinder marked in millimetres. The design has not meaningfully changed since the nineteenth century, and the expensive electronic ones are still checked against a version of it.'] },
      { letra: 'E', texto: ['Idoia was firm about one condition and the university agreed to it without much argument: the original ledgers stay in the house. She points out, reasonably enough, that they have survived sixty-one years there, and that nothing in an archive has yet been tested for as long.'] },
      { letra: 'F', texto: ['This mattered far more than anybody could have known. A measurement taken at a different hour is a different measurement, and the value of the whole record rests on the fact that for sixty-one years it has been taken at eight in the morning, whatever else was going on.'] },
      { letra: 'G', texto: ['The comparison is not entirely fair to the professionals, whose instruments are better and whose figures are checked. But a good instrument moved four times tells you about four gardens. A modest one that has never moved tells you about time.'] }
    ],
    items: [
      { pregunta: '1', opciones: ['A','B','C','D','E','F','G'], correcta: 2 },
      { pregunta: '2', opciones: ['A','B','C','D','E','F','G'], correcta: 5 },
      { pregunta: '3', opciones: ['A','B','C','D','E','F','G'], correcta: 0 },
      { pregunta: '4', opciones: ['A','B','C','D','E','F','G'], correcta: 6 },
      { pregunta: '5', opciones: ['A','B','C','D','E','F','G'], correcta: 1 },
      { pregunta: '6', opciones: ['A','B','C','D','E','F','G'], correcta: 4 }
    ]
  },

  't4-read8': {
    tipo: 'lectura', parte: 8, titulo: 'Reading · Part 8',
    instruccion: 'You will read an article in which six people describe a teacher who made a lasting impression. For each question, choose from the people A–F.',
    opcionesCortas: true,
    secciones: [
      { letra: 'A', titulo: 'Marta',
        texto: ['In three years she praised nothing, and I mean nothing: no essay, no answer, no piece of work. Once, in the second year, she read something of mine and nodded, and I can still tell you where I was standing. I spent a long time thinking she was cold. It was only when I began teaching myself that I saw what she had built, which was a currency worth having by making sure there was almost none of it in circulation. I do not know that I could do it. I know exactly what it was for.'] },
      { letra: 'B', titulo: 'Iker',
        texto: ['He was, and I say this without pleasure, not much good at the subject. He got things wrong at the board and we knew it by the fifth form. What he was extraordinary at was making us work: the deadlines were real, the standard did not move, and he never once accepted an excuse he had not been given in advance. I learned almost no chemistry from him and I learned how to sit down and do a thing, which has been worth more. He was also, by every account I have since heard, difficult to work with. Both are true.'] },
      { letra: 'C', titulo: 'Nadine',
        texto: ['She stopped me in front of thirty people and said that what I had just said was wrong and that I had not thought about it. I was fifteen and I went home furious. Thirty years later I would say it was the single most useful thing anybody did for me at that school, because it turned out that being wrong in public is survivable, and until that afternoon I had arranged my entire life around not finding out. Everyone talks about being encouraged. I was corrected, and I needed it more.'] },
      { letra: 'D', titulo: 'Sam',
        texto: ['What he actually did had nothing to do with history. He noticed, over about a fortnight, that I was not eating, and he did not say anything to me about it at all. He said it to somebody who could act, and something quietly happened, and I only pieced together years afterwards who had started it. He taught me perfectly competently as well. It is not the part I would mention.'] },
      { letra: 'E', titulo: 'Ola',
        texto: ['I was the favourite and I have come to think it did me no good. Being singled out at fourteen is enormously pleasant and it quietly closes things: I chose his subject, then his university course, then something near enough to his career, and at no point did I notice I was choosing. It took until my late twenties to work out that I had been living inside somebody else’s good opinion. He did nothing wrong. That is what makes it hard to explain.'] },
      { letra: 'F', titulo: 'Ruy',
        texto: ['At the time I thought he was a bore and I was not alone; the class had a name for him. What he was doing, which none of us could see, was refusing to make it easy, and I did not understand that until my first term at university, when it turned out I could do something everybody around me was struggling with. I wrote to him that Christmas. I never heard back, and I have no idea whether it reached him, which is the part I still think about.'] }
    ],
    items: [
      { pregunta: '1  Who came to see that the teacher’s manner had been a deliberate method?', opciones: ['A','B','C','D','E','F'], correcta: 0 },
      { pregunta: '2  Who believes the attention they were given narrowed their choices?', opciones: ['A','B','C','D','E','F'], correcta: 4 },
      { pregunta: '3  Who is grateful for having been corrected in front of others?', opciones: ['A','B','C','D','E','F'], correcta: 2 },
      { pregunta: '4  Who separates the quality of the teaching from the character of the teacher?', opciones: ['A','B','C','D','E','F'], correcta: 1 },
      { pregunta: '5  Who describes the teacher noticing something outside the subject entirely?', opciones: ['A','B','C','D','E','F'], correcta: 3 },
      { pregunta: '6  Who made contact later and received no reply?', opciones: ['A','B','C','D','E','F'], correcta: 5 },
      { pregunta: '7  Who remembers one small sign of approval in detail?', opciones: ['A','B','C','D','E','F'], correcta: 0 },
      { pregunta: '8  Who says they were taught how to work rather than the subject itself?', opciones: ['A','B','C','D','E','F'], correcta: 1 },
      { pregunta: '9  Who understood the teacher’s value only after leaving school?', opciones: ['A','B','C','D','E','F'], correcta: 5 },
      { pregunta: '10  Who describes an advantage that turned out to be a disadvantage?', opciones: ['A','B','C','D','E','F'], correcta: 4 }
    ]
  },


  /* ===================== TEST 4 · LISTENING =====================
     Audio provisional de espeak-ng. Se sustituye por voz real antes de cobrar. */

  't4-lis1': {
    tipo: 'listening', parte: 1, titulo: 'Listening · Part 1',
    instruccion: 'You will hear three different extracts. Choose the answer (A, B or C) which fits best according to what you hear. <b>You will hear the recording twice.</b>',
    audio: 'audio/t4-lis1.mp3', escuchas: 2,
    contexto: 'Extract 1: a book group that has stopped reading. Extract 2: a woman who has given up her allotment. Extract 3: two colleagues and a new reporting system.',
    items: [
      { pregunta: '1  What does the woman say about the group’s real purpose?',
        opciones: ['It was social, although nobody would admit it.', 'It was to read books nobody would tackle alone.', 'It was to keep up a habit from their student days.'], correcta: 0 },
      { pregunta: '2  What does she say about reading books again?',
        opciones: ['The group should be wound up instead.', 'They should choose much shorter books.', 'It should happen only if somebody genuinely wants it.'], correcta: 2 },
      { pregunta: '3  Why did the woman really give up the allotment?',
        opciones: ['Her health had made the work impossible.', 'Most of the nine years had not been rewarding.', 'The rent had risen beyond what she would pay.'], correcta: 1 },
      { pregunta: '4  What does she say she misses?',
        opciones: ['The company of the man on the next plot.', 'The vegetables she used to grow.', 'The exercise the work gave her.'], correcta: 0 },
      { pregunta: '5  What does the woman predict will happen with the new system?',
        opciones: ['It will be withdrawn before the end of the year.', 'People will quietly work around it.', 'The duplication will be fixed within six weeks.'], correcta: 1 },
      { pregunta: '6  How does she explain the system’s faults?',
        opciones: ['Nobody established what the report was for.', 'The developers were given too little time.', 'Staff were never consulted about it.'], correcta: 0 }
    ]
  },

  't4-lis2': {
    tipo: 'listening', parte: 2, titulo: 'Listening · Part 2',
    instruccion: 'Complete the sentences with <b>a word or short phrase</b> from what you hear. <b>You will hear the recording twice.</b>',
    audio: 'audio/t4-lis2.mp3', escuchas: 2,
    items: [
      { antes: 'Finn says that building a dry stone wall is almost entirely about', despues: '.', aceptadas: ['sorting'] },
      { antes: 'Before this work he spent fourteen years in', despues: '.', aceptadas: ['forestry'] },
      { antes: 'Beginners most often choose stones that are too', despues: '.', aceptadas: ['big', 'large'] },
      { antes: 'With no mortar, the only thing holding the wall together is its own', despues: '.', aceptadas: ['weight'] },
      { antes: 'The tool he says he could not work without is the', despues: '.', aceptadas: ['line', 'string line'] },
      { antes: 'The hardest part of any wall to build is the', despues: '.', aceptadas: ['end'] },
      { antes: 'A properly built wall will stand untouched for about', despues: 'years.', aceptadas: ['150', 'a hundred and fifty'] },
      { antes: 'He tells beginners to start by taking down a', despues: 'wall.', aceptadas: ['fallen'] }
    ]
  },

  't4-lis3': {
    tipo: 'listening', parte: 3, titulo: 'Listening · Part 3',
    instruccion: 'You will hear an interview. Choose the answer (A, B, C or D) which fits best according to what you hear. <b>You will hear the recording twice.</b>',
    audio: 'audio/t4-lis3.mp3', escuchas: 2,
    contexto: 'A journalist interviews Imelda Rourke, who advises cities on street trees.',
    items: [
      { pregunta: '1  What effect of street trees does Rourke say she can actually measure?',
        opciones: ['The value they add to nearby property.', 'The difference they make to summer temperature.', 'The amount of rainwater they absorb.', 'The improvement in air quality.'], correcta: 1 },
      { pregunta: '2  Why do most young street trees die?',
        opciones: ['Nobody is responsible for watering them.', 'They are damaged by passers-by.', 'Disease spreads quickly along a street.', 'The wrong species are chosen for the site.'], correcta: 0 },
      { pregunta: '3  What is her criticism of the figures cities publish?',
        opciones: ['They are deliberately inflated.', 'They combine parks and streets together.', 'They count plantings and never survivals.', 'They are collected too infrequently to be useful.'], correcta: 2 },
      { pregunta: '4  Why does she argue for planting a variety of species?',
        opciones: ['Mixed streets are considered more attractive now.', 'Different species suit different soils.', 'It spreads the cost over several years.', 'A single species was once lost to disease.'], correcta: 3 },
      { pregunta: '5  What is her objection to pledges to plant millions of trees?',
        opciones: ['The nurseries cannot supply the numbers.', 'The expense falls in years nobody celebrates.', 'The sites chosen are usually unsuitable.', 'They divert money from existing parks.'], correcta: 1 },
      { pregunta: '6  What would she do with the money instead?',
        opciones: ['Employ people to water the young trees.', 'Move the trees to wider streets.', 'Plant fewer trees with far more soil each.', 'Replace the failures as soon as they occur.'], correcta: 2 }
    ]
  },

  't4-lis4': {
    tipo: 'listening', parte: 4, titulo: 'Listening · Part 4',
    instruccion: 'You will hear five short extracts in which people talk about a decision they took very quickly. While you listen you must complete both tasks. <b>You will hear the recording twice.</b>',
    audio: 'audio/t4-lis4.mp3', escuchas: 2,
    opcionesCortas: true,
    contexto: 'Each task has its own list of eight options.',
    listas: [
      { titulo: 'Task One · Why did each speaker decide so quickly?', opciones: [
        'they had in fact been deciding for years',
        'the opportunity would have gone by that evening',
        'somebody in the room talked them into it',
        'refusing would have meant admitting something to themselves',
        'they acted on feeling and knew it at the time',
        'somebody else had already committed them',
        'there was no information worth waiting for',
        'they simply wanted to stop thinking about it'
      ] },
      { titulo: 'Task Two · What does each speaker say about it now?', opciones: [
        'they regret how they broke the news rather than the choice',
        'they would do exactly the same again',
        'they think the speed was the least important part',
        'they blame the setting rather than the speed',
        'they value having consulted nobody',
        'they now check every decision with someone',
        'they have avoided large decisions since',
        'they were surprised how little actually changed'
      ] }
    ],
    items: [
      { pregunta: 'Tarea 1 · 1  Speaker one', opciones: ['A','B','C','D','E','F','G','H'], correcta: 1 },
      { pregunta: 'Tarea 1 · 2  Speaker two', opciones: ['A','B','C','D','E','F','G','H'], correcta: 0 },
      { pregunta: 'Tarea 1 · 3  Speaker three', opciones: ['A','B','C','D','E','F','G','H'], correcta: 3 },
      { pregunta: 'Tarea 1 · 4  Speaker four', opciones: ['A','B','C','D','E','F','G','H'], correcta: 4 },
      { pregunta: 'Tarea 1 · 5  Speaker five', opciones: ['A','B','C','D','E','F','G','H'], correcta: 2 },
      { pregunta: 'Tarea 2 · 6  Speaker one', opciones: ['A','B','C','D','E','F','G','H'], correcta: 4 },
      { pregunta: 'Tarea 2 · 7  Speaker two', opciones: ['A','B','C','D','E','F','G','H'], correcta: 2 },
      { pregunta: 'Tarea 2 · 8  Speaker three', opciones: ['A','B','C','D','E','F','G','H'], correcta: 0 },
      { pregunta: 'Tarea 2 · 9  Speaker four', opciones: ['A','B','C','D','E','F','G','H'], correcta: 1 },
      { pregunta: 'Tarea 2 · 10  Speaker five', opciones: ['A','B','C','D','E','F','G','H'], correcta: 3 }
    ]
  },


  /* ============== TEST 4 · SPEAKING Y WRITING ============== */

  't4-speak1': {
    tipo: 'speaking', parte: 2, titulo: 'Long turn: cómo se aprende un oficio',
    instruccion: 'Speak for <b>one minute</b> without stopping. You do not have to cover everything: choose and compare.',
    segundos: 60,
    pregunta: 'Why might people learn a trade in these ways, and what might be difficult about each?',
    puntos: ['watching somebody experienced and copying them', 'a course with an examination at the end', 'being left alone with the work and no help'],
    nota: 'En el examen esto se hace con tres fotografías. Aquí van descritas mientras la academia no aporte las suyas.',
    items: [ { grabacion: true } ]
  },

  't4-speak3': {
    tipo: 'speaking', parte: 3, titulo: 'Parte 3: decidir en voz alta',
    instruccion: 'Speak for <b>two minutes</b>. Discuss all five options and reach a conclusion.',
    segundos: 120,
    pregunta: 'A neighbourhood has money for one change to its streets. How useful is each of these, and which two would you choose?',
    puntos: ['planting trees along the main avenue', 'widening the pavements', 'a covered area for the weekly market', 'slowing the traffic to twenty', 'more benches and lighting'],
    nota: 'En el examen esto se habla con otro candidato durante tres minutos: se negocia y se llega a un acuerdo. Grabándote solo se practica todo menos eso, que es un criterio entero de los cinco.',
    items: [ { grabacion: true } ]
  },

  't4-speak4': {
    tipo: 'speaking', parte: 4, titulo: 'Parte 4: opinar y justificar',
    instruccion: 'Answer the three questions one after the other, <b>two minutes</b> in total.',
    segundos: 120,
    pregunta: 'Questions about decisions and advice.',
    puntos: [
      'Are decisions taken quickly usually worse than decisions taken slowly? Why?',
      'Some people say you should never ask more than one person for advice. Do you agree?',
      'Is it harder to admit a mistake at work or at home?'
    ],
    nota: 'En el examen el examinador pregunta y luego pide tu reacción a lo que ha dicho la otra persona. Aquí solo está la primera mitad.',
    items: [ { grabacion: true } ]
  },

  't4-speakr': {
    tipo: 'speaking', parte: 2, titulo: 'Repaso: un minuto sin parar',
    instruccion: 'Speak for <b>one minute</b> without long pauses. Compare — do not simply describe.',
    segundos: 60,
    pregunta: 'Why might these be hard to do well, and what might go wrong in each?',
    puntos: ['explaining something you know to somebody who does not', 'saying no to a favour you have been asked for', 'giving somebody bad news you are not responsible for'],
    nota: 'El objetivo no es acertar: es no callarse. Si te quedas en blanco, di por qué te has quedado en blanco y sigue; en el examen eso puntúa más que el silencio.',
    items: [ { grabacion: true } ]
  },

  't4-write1': {
    tipo: 'writing', parte: 1, titulo: 'Essay',
    instruccion: 'Write <b>220–260 words</b>. This part is compulsory: in the exam you do not get to choose it.',
    minutos: 45, palabras: [220, 260],
    enunciado: 'Your class has discussed how a town should decide what to spend money on. Write an essay discussing two of the three methods below and explaining which you think leads to better decisions.',
    contexto: 'Methods: a vote open to every resident · a committee of elected councillors · a panel of independent specialists.',
    cierre: 'Write in a formal style. Do not simply list advantages: take a position and support it.',
    items: [ { escrito: true } ]
  },

  't4-write2': {
    tipo: 'writing', parte: 2, titulo: 'A elegir: correo formal o informe',
    instruccion: 'Choose <b>one</b> of the two tasks and write <b>220–260 words</b>.',
    minutos: 45, palabras: [220, 260],
    enunciado: 'Choose one of the following two tasks.',
    contexto: '1 · You took a course that was advertised very differently from what it turned out to be. Write a formal email to the organisation explaining what happened and saying what you expect them to do.\n2 · Your town council is deciding whether to keep its Saturday bus service. Write a report describing who uses it, what would happen if it stopped, and what you recommend.',
    cierre: 'El correo formal necesita hechos, fechas y una petición concreta: la indignación sin datos no consigue nada. El informe necesita encabezados y neutralidad. Elige la que menos te apetezca: es la que necesitas practicar.',
    items: [ { escrito: true } ]
  },

  /* =====================================================================
     TEST 1 de B2 First. Mismo motor y mismo estilo que los cuatro de C1,
     pero con la forma del examen que toca: Reading & Use of English de
     siete partes y 52 preguntas (el C1 tiene ocho y 56, por la parte 6
     de cruce de textos, que en B2 no existe) y Listening de 8, 10, 5 y 7.
     Ninguna frase sale del material de Elena: son originales.
     ===================================================================== */

  'b2t1-gram1': {
    tipo: 'transformacion', titulo: 'Presentes',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I started this job two years ago and I am still here.', clave: 'FOR', antes: 'I', despues: 'two years.', aceptadas: ['have worked here for', 'have been here for'] },
      { frase: 'She is a very slow eater.', clave: 'TAKES', antes: 'She', despues: 'to eat.', aceptadas: ['takes a long time'] },
      { frase: 'The last time I saw Ana was in May.', clave: 'SEEN', antes: 'I', despues: 'since May.', aceptadas: ["haven't seen Ana", 'have not seen Ana'] },
      { frase: 'They are painting the kitchen this week.', clave: 'BEING', antes: 'The kitchen', despues: 'this week.', aceptadas: ['is being painted'] },
      { frase: 'He leaves his shoes in the hall every single day.', clave: 'ALWAYS', antes: 'He', despues: 'his shoes in the hall.', aceptadas: ['is always leaving'] },
      { frase: 'It is my first time in Ireland.', clave: 'NEVER', antes: 'I', despues: 'to Ireland before.', aceptadas: ['have never been', "'ve never been"] }
    ]
  },

  'b2t1-gram2': {
    tipo: 'transformacion', titulo: 'Pasados',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'She left before I arrived.', clave: 'WHEN', antes: 'She had already left', despues: 'arrived.', aceptadas: ['when I'] },
      { frase: 'It was raining when we came out.', clave: 'STILL', antes: 'When we came out, it', despues: '.', aceptadas: ['was still raining'] },
      { frase: 'I have not been to the cinema for a year.', clave: 'LAST', antes: 'The', despues: 'to the cinema was a year ago.', aceptadas: ['last time I went'] },
      { frase: 'They finished the work in three days.', clave: 'TOOK', antes: 'The work', despues: 'to finish.', aceptadas: ['took them three days'] },
      { frase: 'Nobody told me about the change.', clave: 'TOLD', antes: 'I', despues: 'about the change.', aceptadas: ["wasn't told", 'was not told'] },
      { frase: 'I was tired because I had not slept well.', clave: 'HAD', antes: 'I was tired because I', despues: 'well.', aceptadas: ["hadn't slept", 'had not slept'] }
    ]
  },

  'b2t1-gram3': {
    tipo: 'transformacion', titulo: 'Futuro',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'We have arranged to see the film at eight.', clave: 'SEEING', antes: 'We', despues: 'the film at eight.', aceptadas: ['are seeing'] },
      { frase: 'I am sure they will win.', clave: 'BOUND', antes: 'They', despues: 'win.', aceptadas: ['are bound to'] },
      { frase: 'Look at those clouds. It will rain soon.', clave: 'GOING', antes: 'Look at those clouds. It', despues: 'rain.', aceptadas: ['is going to'] },
      { frase: 'I will finish the report before Friday.', clave: 'HAVE', antes: 'By Friday I', despues: 'the report.', aceptadas: ['will have finished'] },
      { frase: 'Do not phone before six.', clave: 'UNTIL', antes: 'Wait', despues: 'phone.', aceptadas: ['until six to'] },
      { frase: 'The train leaves at half past nine.', clave: 'LEAVING', antes: 'The train', despues: 'at half past nine.', aceptadas: ['is leaving'] }
    ]
  },

  'b2t1-gram4': {
    tipo: 'transformacion', titulo: 'Repaso de tiempos',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I have never eaten such good bread.', clave: 'BEST', antes: 'This is', despues: 'I have ever eaten.', aceptadas: ['the best bread'] },
      { frase: 'It started snowing two hours ago and it has not stopped.', clave: 'BEEN', antes: 'It', despues: 'for two hours.', aceptadas: ['has been snowing'] },
      { frase: 'She went to bed and then the phone rang.', clave: 'AFTER', antes: 'The phone rang', despues: 'to bed.', aceptadas: ['after she had gone', 'after she went'] },
      { frase: 'They are going to build a school here.', clave: 'BUILT', antes: 'A school', despues: 'here.', aceptadas: ['is going to be built'] },
      { frase: 'I did not know he was ill.', clave: 'KNOW', antes: 'I', despues: 'he was ill.', aceptadas: ["didn't know that", 'did not know that'] },
      { frase: 'We moved here five years ago.', clave: 'LIVED', antes: 'We', despues: 'for five years.', aceptadas: ['have lived here'] }
    ]
  },

  'b2t1-gram5': {
    tipo: 'transformacion', titulo: 'Costumbres del pasado',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I played the piano when I was a child, but I stopped.', clave: 'USED', antes: 'I', despues: 'the piano as a child.', aceptadas: ['used to play'] },
      { frase: 'Every summer we went to the same beach.', clave: 'WOULD', antes: 'Every summer we', despues: 'to the same beach.', aceptadas: ['would go'] },
      { frase: 'There was no supermarket here before.', clave: 'BE', antes: 'There', despues: 'a supermarket here.', aceptadas: ["didn't use to be", 'did not use to be'] },
      { frase: 'She smoked for years and then gave up.', clave: 'USED', antes: 'She', despues: ', but she gave up.', aceptadas: ['used to smoke'] },
      { frase: 'My father drove me to school every morning.', clave: 'WOULD', antes: 'Every morning my father', despues: 'to school.', aceptadas: ['would drive me'] },
      { frase: 'As a child I hated coffee.', clave: 'USED', antes: 'I', despues: 'coffee as a child.', aceptadas: ['used to hate'] }
    ]
  },

  'b2t1-gram6': {
    tipo: 'transformacion', titulo: 'Acostumbrarse',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'Getting up early is normal for me now.', clave: 'USED', antes: 'I', despues: 'up early.', aceptadas: ['am used to getting', "'m used to getting"] },
      { frase: 'Driving on the left still feels strange to her.', clave: 'USED', antes: 'She is not', despues: 'on the left.', aceptadas: ['used to driving'] },
      { frase: 'Slowly, he is learning to like the new office.', clave: 'GETTING', antes: 'He is slowly', despues: 'the new office.', aceptadas: ['getting used to'] },
      { frase: 'I found the noise hard at first, but not now.', clave: 'USED', antes: 'I have', despues: 'the noise.', aceptadas: ['got used to'] },
      { frase: 'She had never lived alone before, and it was difficult.', clave: 'USED', antes: 'She', despues: 'living alone.', aceptadas: ["wasn't used to", 'was not used to'] },
      { frase: 'Working nights feels normal to them now.', clave: 'ARE', antes: 'They', despues: 'nights.', aceptadas: ['are used to working'] }
    ]
  },

  'b2t1-gram7': {
    tipo: 'transformacion', titulo: 'Poder y tener que',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'It is not necessary to book a table.', clave: 'HAVE', antes: 'You', despues: 'a table.', aceptadas: ["don't have to book", 'do not have to book'] },
      { frase: 'It is obligatory to show your passport.', clave: 'MUST', antes: 'You', despues: 'your passport.', aceptadas: ['must show'] },
      { frase: 'I was not able to open the door.', clave: 'MANAGE', antes: 'I', despues: 'the door.', aceptadas: ["didn't manage to open", 'did not manage to open'] },
      { frase: 'Swimming here is forbidden.', clave: 'ALLOWED', antes: 'You', despues: 'here.', aceptadas: ["aren't allowed to swim", 'are not allowed to swim'] },
      { frase: 'She succeeded in finishing the race.', clave: 'ABLE', antes: 'She', despues: 'the race.', aceptadas: ['was able to finish'] },
      { frase: 'It was necessary for us to leave early.', clave: 'HAD', antes: 'We', despues: 'early.', aceptadas: ['had to leave'] }
    ]
  },

  'b2t1-gram8': {
    tipo: 'transformacion', titulo: 'Consejo y deducción',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I think you ought to see a doctor.', clave: 'SHOULD', antes: 'I think you', despues: 'a doctor.', aceptadas: ['should see'] },
      { frase: 'It was a mistake to leave so late.', clave: 'HAVE', antes: 'We', despues: 'so late.', aceptadas: ["shouldn't have left", 'should not have left'] },
      { frase: 'I am sure she is at home.', clave: 'MUST', antes: 'She', despues: 'at home.', aceptadas: ['must be'] },
      { frase: 'It is impossible that he is the manager.', clave: 'BE', antes: 'He', despues: 'the manager.', aceptadas: ["can't be", 'cannot be'] },
      { frase: 'Perhaps they forgot the address.', clave: 'MIGHT', antes: 'They', despues: 'the address.', aceptadas: ['might have forgotten'] },
      { frase: 'The best thing would be to ask first.', clave: 'BETTER', antes: 'You', despues: 'first.', aceptadas: ['had better ask', "'d better ask"] }
    ]
  },

  'b2t1-gram9': {
    tipo: 'transformacion', titulo: 'Voz pasiva',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'Someone stole my bicycle last night.', clave: 'WAS', antes: 'My bicycle', despues: 'last night.', aceptadas: ['was stolen'] },
      { frase: 'They will send the tickets tomorrow.', clave: 'SENT', antes: 'The tickets', despues: 'tomorrow.', aceptadas: ['will be sent'] },
      { frase: 'Nobody has cleaned this room.', clave: 'BEEN', antes: 'This room', despues: 'cleaned.', aceptadas: ["hasn't been", 'has not been'] },
      { frase: 'They gave Ana a prize.', clave: 'GIVEN', antes: 'Ana', despues: 'a prize.', aceptadas: ['was given'] },
      { frase: 'You cannot use mobile phones in the exam.', clave: 'USED', antes: 'Mobile phones', despues: 'in the exam.', aceptadas: ["can't be used", 'cannot be used'] },
      { frase: 'Somebody is repairing the lift right now.', clave: 'BEING', antes: 'The lift', despues: 'right now.', aceptadas: ['is being repaired'] }
    ]
  },

  'b2t1-gram10': {
    tipo: 'transformacion', titulo: 'Que te lo hagan',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'A hairdresser cuts my hair every month.', clave: 'HAVE', antes: 'I', despues: 'every month.', aceptadas: ['have my hair cut'] },
      { frase: 'A mechanic is repairing our car at the moment.', clave: 'HAVING', antes: 'We are', despues: 'at the moment.', aceptadas: ['having our car repaired'] },
      { frase: 'Someone painted their house last summer.', clave: 'HAD', antes: 'They', despues: 'last summer.', aceptadas: ['had their house painted'] },
      { frase: 'I need someone to check my eyes.', clave: 'CHECKED', antes: 'I need to', despues: '.', aceptadas: ['have my eyes checked', 'get my eyes checked'] },
      { frase: 'A photographer is going to take our picture.', clave: 'HAVE', antes: 'We are going to', despues: 'taken.', aceptadas: ['have our picture'] },
      { frase: 'Someone delivers the bread to us every morning.', clave: 'HAVE', antes: 'We', despues: 'every morning.', aceptadas: ['have the bread delivered'] }
    ]
  },

  'b2t1-gram11': {
    tipo: 'transformacion', titulo: 'Condicionales',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'Take an umbrella or you will get wet.', clave: 'UNLESS', antes: 'You will get wet', despues: 'an umbrella.', aceptadas: ['unless you take'] },
      { frase: 'I do not have a car, so I cannot drive you.', clave: 'HAD', antes: 'If I', despues: ', I could drive you.', aceptadas: ['had a car'] },
      { frase: 'She did not study, so she failed.', clave: 'HAD', antes: 'If she', despues: ', she would have passed.', aceptadas: ['had studied'] },
      { frase: 'You can borrow it if you give it back tomorrow.', clave: 'LONG', antes: 'You can borrow it', despues: 'you give it back tomorrow.', aceptadas: ['as long as'] },
      { frase: 'He was late because he missed the bus.', clave: 'NOT', antes: 'If he had', despues: 'the bus, he would not have been late.', aceptadas: ['not missed'] },
      { frase: 'Phone me when you arrive.', clave: 'SOON', antes: 'Phone me', despues: 'you arrive.', aceptadas: ['as soon as'] }
    ]
  },

  'b2t1-gram12': {
    tipo: 'transformacion', titulo: 'Deseos y lamentos',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I am sorry I did not go to the party.', clave: 'WISH', antes: 'I', despues: 'to the party.', aceptadas: ['wish I had gone'] },
      { frase: 'It is a pity I cannot swim.', clave: 'WISH', antes: 'I', despues: 'swim.', aceptadas: ['wish I could'] },
      { frase: 'I would like you to stop shouting.', clave: 'WOULD', antes: 'I', despues: 'shouting.', aceptadas: ['would rather you stopped'] },
      { frase: 'She regrets buying the cheaper phone.', clave: 'WISHES', antes: 'She', despues: 'the cheaper phone.', aceptadas: ["wishes she hadn't bought"] },
      { frase: 'It is a shame the shop is closed.', clave: 'ONLY', antes: 'If', despues: 'open.', aceptadas: ['only the shop were', 'only the shop was'] },
      { frase: 'I do not have enough money to buy it.', clave: 'WISH', antes: 'I', despues: 'enough money to buy it.', aceptadas: ['wish I had'] }
    ]
  },

  'b2t1-gram13': {
    tipo: 'transformacion', titulo: 'Estilo indirecto',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: '"I will call you tomorrow," she said.', clave: 'WOULD', antes: 'She said that she', despues: 'the next day.', aceptadas: ['would call me'] },
      { frase: '"Do not touch the paint," he told us.', clave: 'NOT', antes: 'He told us', despues: 'the paint.', aceptadas: ['not to touch'] },
      { frase: '"Where do you live?" she asked me.', clave: 'LIVED', antes: 'She asked me where', despues: '.', aceptadas: ['I lived'] },
      { frase: '"I am sorry I broke it," he said.', clave: 'APOLOGISED', antes: 'He', despues: 'it.', aceptadas: ['apologised for breaking'] },
      { frase: '"You should rest," the doctor said to me.', clave: 'ADVISED', antes: 'The doctor', despues: '.', aceptadas: ['advised me to rest'] },
      { frase: '"I will help you," said Ana.', clave: 'OFFERED', antes: 'Ana', despues: 'me.', aceptadas: ['offered to help'] }
    ]
  },

  'b2t1-gram14': {
    tipo: 'transformacion', titulo: 'Comparar y relativas',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'The film was so long that we left.', clave: 'SUCH', antes: 'It was', despues: 'that we left.', aceptadas: ['such a long film'] },
      { frase: 'My old flat was smaller than this one.', clave: 'BIGGER', antes: 'This flat', despues: 'my old one.', aceptadas: ['is bigger than'] },
      { frase: 'I have never read a better book.', clave: 'BEST', antes: 'It is', despues: 'I have ever read.', aceptadas: ['the best book'] },
      { frase: 'The coffee was too hot for me to drink.', clave: 'ENOUGH', antes: 'The coffee was not', despues: 'drink.', aceptadas: ['cool enough to'] },
      { frase: 'I met a woman and her son plays in the team.', clave: 'WHOSE', antes: 'I met a woman', despues: 'in the team.', aceptadas: ['whose son plays'] },
      { frase: 'The queue was very long, so we gave up.', clave: 'SO', antes: 'The queue was', despues: 'we gave up.', aceptadas: ['so long that'] }
    ]
  },

  'b2t1-voc1': {
    tipo: 'caja', titulo: 'Preposiciones tras sustantivo',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['about', 'between', 'for', 'in', 'of', 'on', 'to', 'with'],
    items: [
      { antes: 'She has a real talent', despues: 'languages.', aceptadas: ['for'] },
      { antes: 'The difference', despues: 'the two photos is very small.', aceptadas: ['between'] },
      { antes: 'He has no interest', despues: 'football at all.', aceptadas: ['in'] },
      { antes: 'They found a simple solution', despues: 'the problem.', aceptadas: ['to'] },
      { antes: 'She has a very good relationship', despues: 'her sister.', aceptadas: ['with'] },
      { antes: 'I had no idea', despues: 'the cost until the bill came.', aceptadas: ['of'] }
    ]
  },

  'b2t1-voc2': {
    tipo: 'caja', titulo: 'Phrasal verbs · planes y citas',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['back', 'down', 'off', 'on', 'out', 'over', 'through', 'up'],
    items: [
      { antes: 'They called', despues: 'the match because of the snow.', aceptadas: ['off'] },
      { antes: 'I will pick you', despues: 'at eight.', aceptadas: ['up'] },
      { antes: 'She turned', despues: 'the invitation very politely.', aceptadas: ['down'] },
      { antes: 'He got', despues: 'the flu in less than a week.', aceptadas: ['over'] },
      { antes: 'We ran', despues: 'of milk this morning.', aceptadas: ['out'] },
      { antes: 'They put the trip', despues: 'until June.', aceptadas: ['off'] }
    ]
  },

  'b2t1-voc3': {
    tipo: 'caja', titulo: 'Adjetivos y su preposición',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['about', 'at', 'for', 'from', 'in', 'of', 'to', 'with'],
    items: [
      { antes: 'She is very good', despues: 'maths.', aceptadas: ['at'] },
      { antes: 'I am really worried', despues: 'the exam on Monday.', aceptadas: ['about'] },
      { antes: 'He has always been afraid', despues: 'flying.', aceptadas: ['of'] },
      { antes: 'This town is famous', despues: 'its market.', aceptadas: ['for'] },
      { antes: 'Are you interested', despues: 'joining us on Saturday?', aceptadas: ['in'] },
      { antes: 'She was extremely kind', despues: 'me while I was ill.', aceptadas: ['to'] }
    ]
  },

  'b2t1-voc4': {
    tipo: 'caja', titulo: 'Verbos con preposición fija',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['about', 'for', 'from', 'in', 'of', 'on', 'to', 'with'],
    items: [
      { antes: 'It all depends', despues: 'the weather.', aceptadas: ['on'] },
      { antes: 'She apologised', despues: 'being late.', aceptadas: ['for'] },
      { antes: 'They accused him', despues: 'lying about the money.', aceptadas: ['of'] },
      { antes: 'I agree', despues: 'you completely.', aceptadas: ['with'] },
      { antes: 'He finally succeeded', despues: 'passing at the third attempt.', aceptadas: ['in'] },
      { antes: 'The doctor stopped him', despues: 'playing for a month.', aceptadas: ['from'] }
    ]
  },

  'b2t1-voc5': {
    tipo: 'caja', titulo: 'Phrasal verbs · gente y relaciones',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['along', 'away', 'down', 'out', 'over', 'through', 'up', 'with'],
    items: [
      { antes: 'I get', despues: 'well with my neighbours.', aceptadas: ['along'] },
      { antes: 'They split', despues: 'after two years together.', aceptadas: ['up'] },
      { antes: 'Please do not let me', despues: 'again.', aceptadas: ['down'] },
      { antes: 'The brothers fell', despues: 'over money.', aceptadas: ['out'] },
      { antes: 'She got', despues: 'the shock surprisingly quickly.', aceptadas: ['over'] },
      { antes: 'Do not throw those photos', despues: '.', aceptadas: ['away'] }
    ]
  },

  'b2t1-voc6': {
    tipo: 'caja', titulo: 'Colocaciones · make, do, take, have',
    instruccion: 'Complete each sentence with a verb from the box. There are more verbs than you need.',
    caja: ['do', 'get', 'give', 'have', 'make', 'pay', 'set', 'take'],
    items: [
      { antes: 'Could you', despues: 'me a favour?', aceptadas: ['do'] },
      { antes: 'Try to', despues: 'attention in class.', aceptadas: ['pay'] },
      { antes: 'He did not', despues: 'any mistakes in the test.', aceptadas: ['make'] },
      { antes: 'They will', despues: 'us a lift to the station.', aceptadas: ['give'] },
      { antes: 'I want to', despues: 'a photo of the square.', aceptadas: ['take'] },
      { antes: 'Did you', despues: 'a good time at the party?', aceptadas: ['have'] }
    ]
  },

  'b2t1-voc7': {
    tipo: 'caja', titulo: 'Expresiones cotidianas',
    instruccion: 'Complete each expression with a word from the box. There are more words than you need.',
    caja: ['end', 'hand', 'mind', 'point', 'sense', 'time', 'touch', 'way'],
    items: [
      { antes: 'It does not make', despues: 'to me at all.', aceptadas: ['sense'] },
      { antes: 'We lost', despues: 'after she moved to Cardiff.', aceptadas: ['touch'] },
      { antes: 'There is no', despues: 'in arguing about it now.', aceptadas: ['point'] },
      { antes: 'Do you', despues: 'if I open the window?', aceptadas: ['mind'] },
      { antes: 'They finished the job in no', despues: 'at all.', aceptadas: ['time'] },
      { antes: 'She gave me a', despues: 'with the boxes.', aceptadas: ['hand'] }
    ]
  },

  'b2t1-voc8': {
    tipo: 'cloze', titulo: 'Open cloze · aprender a cocinar',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Learning to cook is one of those skills everybody says they will pick {1} later, and almost nobody does. The problem is not difficulty. Most weekday meals ask for three ingredients and twenty minutes, which is less time {2} it takes to wait for a delivery. The problem is that nobody ever taught us, and starting at thirty feels ridiculous.',
      'It is worth getting {3} that feeling. The first six things you cook will not be very good, and then they will be, and after {4} you will never again pay eleven euros for rice. What helps is cooking the same dish once a week until your hands know it, {5} of trying something new every night. Nobody learns an instrument by playing a different piece each time, and food is no {6}.'
    ],
    items: [
      { aceptadas: ['up'] }, { aceptadas: ['than'] }, { aceptadas: ['over', 'past'] },
      { aceptadas: ['that'] }, { aceptadas: ['instead'] }, { aceptadas: ['different'] }
    ]
  },

  'b2t1-voc9': {
    tipo: 'cloze', titulo: 'Open cloze · mudarse de casa',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Nobody enjoys moving house. You spend a fortnight putting your life {1} boxes, discover that you own four kettles, and then spend another fortnight looking {2} the one thing you actually need. Somewhere in the middle you promise yourself that next time you will own less, and you never {3}.',
      'What surprises people is how long a new flat takes to feel like home. The first week it is a place you are staying {4}; by the second month it is where you live. Nothing in particular happens in between. You simply stop noticing that the light switch is on the wrong side, and one evening you come back {5} work and find that you called it home {6} thinking about it.'
    ],
    items: [
      { aceptadas: ['into', 'in'] }, { aceptadas: ['for'] }, { aceptadas: ['do'] },
      { aceptadas: ['in', 'at'] }, { aceptadas: ['from'] }, { aceptadas: ['without'] }
    ]
  },

  'b2t1-voc10': {
    tipo: 'cloze', titulo: 'Open cloze · hacer ejercicio',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Everybody knows they should exercise more, which is exactly {1} makes the advice so easy to ignore. Being told something you already believe changes nothing. What changes something is much smaller: a pair of trainers by the door, a friend who is waiting at seven, a route you can run {2} thinking.',
      'The people who keep it {3} are rarely the ones with the most willpower. They are the ones who made the decision only once, months ago, and now do not have to make it again. Motivation gets the credit, {4} habit does the work. The first three weeks really are the worst, so anyone {5} tells you it becomes enjoyable straight away has either forgotten or is selling {6} something.'
    ],
    items: [
      { aceptadas: ['what'] }, { aceptadas: ['without'] }, { aceptadas: ['up'] },
      { aceptadas: ['but'] }, { aceptadas: ['who'] }, { aceptadas: ['you'] }
    ]
  },

  'b2t1-voc11': {
    tipo: 'formacion', titulo: 'Word formation · nombres abstractos',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'His', despues: 'in the team was never in doubt.', raiz: 'BELIEVE', aceptadas: ['belief'] },
      { antes: 'There is a real', despues: 'between the two versions.', raiz: 'DIFFER', aceptadas: ['difference'] },
      { antes: 'The', despues: 'of the new road took two years.', raiz: 'CONSTRUCT', aceptadas: ['construction'] },
      { antes: 'She showed great', despues: 'in a very difficult year.', raiz: 'PATIENT', aceptadas: ['patience'] },
      { antes: 'We need your', despues: 'before Friday.', raiz: 'DECIDE', aceptadas: ['decision'] },
      { antes: 'The', despues: 'of the hotel was excellent.', raiz: 'LOCATE', aceptadas: ['location'] }
    ]
  },

  'b2t1-voc12': {
    tipo: 'formacion', titulo: 'Word formation · adjetivos',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The film was surprisingly', despues: '.', raiz: 'SUCCESS', aceptadas: ['successful'] },
      { antes: 'It was a very', despues: 'afternoon by the river.', raiz: 'PEACE', aceptadas: ['peaceful'] },
      { antes: 'The weather was', despues: 'all week.', raiz: 'SUN', aceptadas: ['sunny'] },
      { antes: 'Their new flat is much more', despues: 'than the old one.', raiz: 'COMFORT', aceptadas: ['comfortable'] },
      { antes: 'The journey seemed', despues: 'and nobody spoke.', raiz: 'END', aceptadas: ['endless'] },
      { antes: 'That was a very', despues: 'thing to say.', raiz: 'CHILD', aceptadas: ['childish'] }
    ]
  },

  'b2t1-voc13': {
    tipo: 'formacion', titulo: 'Word formation · adjetivos en negativo',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The film was long and', despues: '.', raiz: 'INTEREST', aceptadas: ['uninteresting'] },
      { antes: 'It is', despues: 'to finish all of this today.', raiz: 'POSSIBLE', aceptadas: ['impossible'] },
      { antes: 'The two accounts of the evening are', despues: '.', raiz: 'CONSISTENT', aceptadas: ['inconsistent'] },
      { antes: 'She was clearly', despues: 'with the service.', raiz: 'SATISFY', aceptadas: ['dissatisfied'] },
      { antes: 'He was very', despues: 'about the whole thing.', raiz: 'HONEST', aceptadas: ['dishonest'] },
      { antes: 'They were', despues: 'to help us at first.', raiz: 'WILLING', aceptadas: ['unwilling'] }
    ]
  },

  'b2t1-voc14': {
    tipo: 'formacion', titulo: 'Word formation · personas y oficios',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'She works as a', despues: 'in a local school.', raiz: 'TEACH', aceptadas: ['teacher'] },
      { antes: 'The', despues: 'played for almost two hours.', raiz: 'MUSIC', aceptadas: ['musician'] },
      { antes: 'He is a', despues: 'at the hospital in Cruces.', raiz: 'SCIENCE', aceptadas: ['scientist'] },
      { antes: 'Three hundred', despues: 'came to the concert.', raiz: 'VISIT', aceptadas: ['visitors'] },
      { antes: 'She is a well-known', despues: 'in Bilbao.', raiz: 'PHOTOGRAPH', aceptadas: ['photographer'] },
      { antes: 'The', despues: 'of the company will speak at noon.', raiz: 'DIRECT', aceptadas: ['director'] }
    ]
  },

  'b2t1-use1': {
    tipo: 'opcion', parte: 1, titulo: 'Use of English · Part 1',
    instruccion: 'Decide which answer best fits each gap.',
    texto: [
      'Cycling to work has become normal in cities that once thought it {1} impossible. Twenty years ago the argument was always about the weather. Today the same cities are building cycle lanes as fast as they can, and the queue to {2} a bike at the station gets longer every month.',
      'What changed was not the climate but the {3}. A cyclist on a painted line beside four lanes of traffic feels brave; a cyclist behind a low kerb feels ordinary. Once enough people {4} that the difference is small in metres and enormous in the head, the rest followed. Numbers rose, drivers got used to it, and cycling stopped being a statement about anything.',
      'There are still problems, and they are not the ones people usually {5} about. Bike theft does far more damage to cycling than rain ever {6}, and very few councils {7} it seriously. The direction, though, is clear. In another twenty years the strange thing will not be that people cycle to the office, but that anyone ever thought it {8} an argument.'
    ],
    items: [
      { opciones: ['were', 'had', 'was', 'would'], correcta: 2 },
      { opciones: ['borrow', 'hire', 'lend', 'let'], correcta: 1 },
      { opciones: ['drawing', 'model', 'design', 'style'], correcta: 2 },
      { opciones: ['reminded', 'warned', 'informed', 'realised'], correcta: 3 },
      { opciones: ['blame', 'complain', 'accuse', 'criticise'], correcta: 1 },
      { opciones: ['did', 'made', 'had', 'was'], correcta: 0 },
      { opciones: ['hold', 'make', 'take', 'give'], correcta: 2 },
      { opciones: ['deserved', 'needed', 'earned', 'won'], correcta: 1 }
    ]
  },

  'b2t1-use2a': {
    tipo: 'cloze', parte: 2, titulo: 'Use of English · Part 2',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Adults who start a language often say they are too old, which is not true, {1} it is easy to understand. Children are not better learners; they simply have more hours and no dignity to lose. A seven-year-old will happily say something wrong forty times {2} day. An adult says it once, hears himself, and stops.',
      'This is why the first months matter so {3}. Almost nothing is being learned except the habit of speaking badly in front of other people, and that habit is worth more {4} any amount of grammar. The student who is willing to sound foolish will pass the student who is not, {5} matter how many rules the second one knows.',
      'Teachers know this and say it constantly. It is ignored because it sounds {6} an excuse for not studying, which it is not. Learn the grammar by all means, but do not wait {7} you feel ready before you speak, {8} that day never arrives.'
    ],
    items: [
      { aceptadas: ['though', 'but', 'although'] }, { aceptadas: ['a'] }, { aceptadas: ['much'] },
      { aceptadas: ['than'] }, { aceptadas: ['no'] }, { aceptadas: ['like'] },
      { aceptadas: ['until'] }, { aceptadas: ['because', 'as', 'since'] }
    ]
  },

  'b2t1-use2b': {
    tipo: 'cloze', parte: 2, titulo: 'Use of English · Part 2 (extra)',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Working from home was, for years, something you had to ask {1}, usually with a good reason and a slightly guilty voice. Then, over a few weeks in 2020, it became what everybody did, and the question turned round completely. It is now the office that has to explain {2}.',
      'The honest answer is that the two arrangements suit different {3} of work. Nobody has ever done their best thinking in an open-plan room, and nobody has {4} learned a job properly from a screen either. The new employee who never meets the team spends a year working {5} things a colleague could have explained in a corridor in four seconds.',
      'So the argument is not really about productivity, {6} both sides claim that it is. It is about who gets the quiet and who gets the corridor. Companies that {7} up their mind too quickly, in either direction, will spend the next ten years changing it {8}.'
    ],
    items: [
      { aceptadas: ['for'] }, { aceptadas: ['itself'] }, { aceptadas: ['kinds', 'sorts', 'types'] },
      { aceptadas: ['ever'] }, { aceptadas: ['out'] }, { aceptadas: ['although', 'though'] },
      { aceptadas: ['make'] }, { aceptadas: ['back'] }
    ]
  },

  'b2t1-use3': {
    tipo: 'formacion', parte: 3, titulo: 'Use of English · Part 3',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'It was an extremely', despues: 'decision to take.', raiz: 'DIFFICULTY', aceptadas: ['difficult'] },
      { antes: 'The town has grown very', despues: 'over the last ten years.', raiz: 'RAPID', aceptadas: ['rapidly'] },
      { antes: 'There has been a big', despues: 'in the number of visitors.', raiz: 'REDUCE', aceptadas: ['reduction'] },
      { antes: 'He gave a very', despues: 'explanation.', raiz: 'CONVINCE', aceptadas: ['convincing'] },
      { antes: 'Her', despues: 'of the city was extremely useful.', raiz: 'KNOW', aceptadas: ['knowledge'] },
      { antes: 'The staff were friendly and very', despues: '.', raiz: 'HELP', aceptadas: ['helpful'] },
      { antes: 'The hotel offers a wide', despues: 'of activities.', raiz: 'CHOOSE', aceptadas: ['choice'] },
      { antes: 'His behaviour that evening was completely', despues: '.', raiz: 'ACCEPT', aceptadas: ['unacceptable'] }
    ]
  },

  'b2t1-use4a': {
    tipo: 'transformacion', parte: 4, titulo: 'Use of English · Part 4',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I have never eaten such good paella.', clave: 'BEST', antes: 'This is', despues: 'I have ever eaten.', aceptadas: ['the best paella'] },
      { frase: 'It is not necessary to book a table.', clave: 'NEED', antes: 'You', despues: 'a table.', aceptadas: ["don't need to book", 'do not need to book'] },
      { frase: 'Somebody stole my bike last week.', clave: 'HAD', antes: 'I', despues: 'last week.', aceptadas: ['had my bike stolen'] },
      { frase: '"Where do you live?" she asked me.', clave: 'WHERE', antes: 'She asked me', despues: '.', aceptadas: ['where I lived'] },
      { frase: 'I am sorry I did not phone you.', clave: 'WISH', antes: 'I', despues: 'you.', aceptadas: ['wish I had phoned'] },
      { frase: 'It was too cold to sit outside.', clave: 'ENOUGH', antes: 'It', despues: 'to sit outside.', aceptadas: ["wasn't warm enough", 'was not warm enough'] }
    ]
  },

  'b2t1-use4b': {
    tipo: 'transformacion', parte: 4, titulo: 'Use of English · Part 4 (extra)',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'The film was so boring that we left.', clave: 'SUCH', antes: 'It', despues: 'that we left.', aceptadas: ['was such a boring film'] },
      { frase: 'You should have told me earlier.', clave: 'OUGHT', antes: 'You', despues: 'me earlier.', aceptadas: ['ought to have told'] },
      { frase: 'They will finish the road next month.', clave: 'FINISHED', antes: 'The road', despues: 'next month.', aceptadas: ['will be finished'] },
      { frase: 'She is not old enough to vote.', clave: 'TOO', antes: 'She', despues: 'to vote.', aceptadas: ['is too young'] },
      { frase: 'I did not go out because it was raining.', clave: 'IF', antes: 'I would have gone out', despues: 'raining.', aceptadas: ["if it hadn't been", 'if it had not been'] },
      { frase: 'Nobody has cleaned this room for weeks.', clave: 'BEEN', antes: 'This room', despues: 'for weeks.', aceptadas: ["hasn't been cleaned", 'has not been cleaned'] }
    ]
  },

  'b2t1-read5': {
    tipo: 'lectura', parte: 5, titulo: 'Reading · Part 5',
    instruccion: 'Read the text and choose the best answer (A, B, C or D) for each question.',
    tituloTexto: 'Learning to swim at forty',
    texto: [
      'The pool in Basauri opens at half past six, and by twenty to seven there are nine adults standing in a line at the shallow end, none of them under thirty-five. They are not here to get fit. Every one of them is here because they cannot swim, and most have spent thirty years quietly arranging their holidays around that fact.',
      'Their teacher is Amaia Loizaga, who has taught adult beginners for eleven years and children for none. "I tried children once," she says. "I was terrible at it. A child who is frightened of water is frightened of the water. An adult who is frightened of water is frightened of the water, and of the eight people watching, and of what the whole thing seems to say about them. That second part is my job."',
      'It takes her, on average, four sessions before anybody will put their face in. Colleagues at other pools have told her this is slow, and she agrees that it is, and she has not changed it. In her first year she followed the standard programme, which moves faster, and lost more than half the class before week six. The ones who stayed, she noticed later, were the ones who had almost been able to swim when they arrived.',
      'What she does instead looks, from the side of the pool, like very little. There is a great deal of standing in chest-deep water and talking. One man, a builder in his fifties, spent most of a Tuesday explaining how his father had taught him to swim by throwing him off a jetty at Plentzia in 1974. She listened, asked two questions, and then asked him to hold the rail and lower his chin to the surface. He did it. He had refused exactly the same request the week before.',
      'Loizaga is impatient with the suggestion that any of this is therapy. "It is technique," she says. "The body will not float while it is braced, and it will not stop bracing while somebody is telling it to relax. So you do not tell it. You give it something else to do." Her whole method, she claims, is a series of small tasks that happen to require the thing she actually wants.',
      'Not everybody finishes. Two of the nine will stop coming before Christmas, and she says she can usually tell which two by the third week, although she has been wrong often enough to keep it to herself. The rest will swim a length by March, badly, and the badly matters far less than people expect. "Nobody in this class is going to race," she says. "They want to be able to say yes when their grandchildren ask them to come in. That is the whole of it, and it is not a small thing."'
    ],
    items: [
      { pregunta: '1  What do we learn about the group in the first paragraph?',
        opciones: ['They are attending mainly in order to get fitter.',
                   'They have organised parts of their lives around not being able to swim.',
                   'They have all tried and failed to learn before.',
                   'They are unusually young for a beginners’ class.'], correcta: 1 },
      { pregunta: '2  Why does Loizaga believe she is not suited to teaching children?',
        opciones: ['Children learn far more quickly than she can manage.',
                   'She finds it harder to keep children interested.',
                   'Children do not bring the extra difficulty she is good at.',
                   'She was never properly trained to work with them.'], correcta: 2 },
      { pregunta: '3  What does the writer suggest about Loizaga’s first year?',
        opciones: ['The programme she used only suited certain learners.',
                   'She was criticised by colleagues for teaching too slowly.',
                   'She had not yet decided what she wanted to teach.',
                   'Her classes were larger than she could handle.'], correcta: 0 },
      { pregunta: '4  Why does the writer include the builder’s story?',
        opciones: ['To explain why so many adults never learn as children.',
                   'To show that listening achieved what an instruction had not.',
                   'To criticise the way swimming used to be taught.',
                   'To suggest that men are more reluctant than women.'], correcta: 1 },
      { pregunta: '5  In the fifth paragraph, Loizaga argues that',
        opciones: ['fear of water is really a physical problem.',
                   'her pupils need to understand the theory first.',
                   'telling somebody to relax will not make them relax.',
                   'her approach owes a great deal to therapy.'], correcta: 2 },
      { pregunta: '6  What is Loizaga’s attitude in the final paragraph?',
        opciones: ['She is disappointed by how little most pupils achieve.',
                   'She regrets not being able to predict who will leave.',
                   'She thinks the class ought to be more ambitious.',
                   'She treats a modest aim as entirely worth having.'], correcta: 3 }
    ]
  },

  'b2t1-read6': {
    tipo: 'lectura', parte: 6, titulo: 'Reading · Part 6',
    instruccion: 'Six sentences have been removed from the text. Choose from the sentences A–G the one which fits each gap. There is one extra sentence which you do not need to use.',
    tituloTexto: 'The village that bought its own shop',
    texto: [
      'When the last shop in Kirkby Malham closed in 2016, the village lost a good deal more than a place to buy milk. It lost the notice board, the parcel drop and the only reason most people over seventy left the house on a Tuesday. {1} Nobody in the village disagreed with him, and nobody did anything at all for eight months.',
      'What eventually happened was not a campaign. A retired teacher called Bridget Hall put a single sheet of paper through every door asking one question: how much would you personally put in? {2} Ninety-one replies came back within a fortnight, and the total surprised everybody, including her.',
      'The shop reopened fourteen months later as a community business, owned by two hundred and six shareholders, none of whom expects a penny back. It is run almost entirely by volunteers on two-hour shifts. {3} In practice this means that buying a loaf takes twice as long as it used to, and nobody regards that as a problem.',
      'Hall is careful about the way the story gets told. She points out that the village is not poor, that a third of the houses have no children in them, and that both facts made the money much easier to raise. {4} She has said the same thing to every journalist who has visited, and it is usually the part they leave out.',
      'The shop has now been trading for eight years and has made a small loss in three of them. {5} The committee treats those years as the price of an arrangement that has kept the post office counter, the notice board and the Tuesday morning going, rather than as a failure to be put right.',
      'Other villages ring up for advice, and Hall gives them the same answer every time. {6} What she will not do is pretend that the shop saved the village, because she is not certain that it did, and because she thinks that sort of claim is exactly what makes the next village give up when its own attempt turns out to be merely quite successful.'
    ],
    secciones: [
      { letra: 'A', texto: ['Start with the question about money, she tells them, and ask it before you hold a single meeting.'] },
      { letra: 'B', texto: ['The owner, who had run it for twenty-two years, said simply that the sums no longer worked.'] },
      { letra: 'C', texto: ['On each occasion the shortfall was covered by a raffle and by people quietly rounding up their bills.'] },
      { letra: 'D', texto: ['She deliberately did not ask anybody whether they thought the idea was a good one.'] },
      { letra: 'E', texto: ['The building itself was bought at auction by a developer who has still not applied for planning permission.'] },
      { letra: 'F', texto: ['A place with the same idea and half the income would have failed, she says, and would then have been blamed for it.'] },
      { letra: 'G', texto: ['The rota is kept on paper, pinned up behind the till, because an attempt to move it online lasted three weeks.'] }
    ],
    opcionesCortas: true,
    items: [
      { pregunta: '1', opciones: ['A','B','C','D','E','F','G'], correcta: 1 },
      { pregunta: '2', opciones: ['A','B','C','D','E','F','G'], correcta: 3 },
      { pregunta: '3', opciones: ['A','B','C','D','E','F','G'], correcta: 6 },
      { pregunta: '4', opciones: ['A','B','C','D','E','F','G'], correcta: 5 },
      { pregunta: '5', opciones: ['A','B','C','D','E','F','G'], correcta: 2 },
      { pregunta: '6', opciones: ['A','B','C','D','E','F','G'], correcta: 0 }
    ]
  },

  'b2t1-read7': {
    tipo: 'lectura', parte: 7, titulo: 'Reading · Part 7',
    instruccion: 'You are going to read an article in which four people describe the year they spent living in another country. For each question, choose from the people A–D. The people may be chosen more than once.',
    opcionesCortas: true,
    secciones: [
      { letra: 'A', titulo: 'Nerea, a year in Dublin',
        texto: ['I went at nineteen because I had failed two subjects and could not face repeating the year at home. My English was a good deal worse than I had told the family, and the first month was mostly nodding. What saved me was the children, who corrected me without the slightest embarrassment and found my mistakes genuinely funny. I would recommend the year, but not for the reason people expect. I did not come home fluent; I came home able to be wrong in front of other people, and that has been worth more than the grammar. The hard part was money. I was paid very little and most of it went on the bus, and I would tell anyone who is going to work that out properly before they book anything.'] },
      { letra: 'B', titulo: 'Tomás, a year in Berlin',
        texto: ['The company paid for the flat and the flight, so I arrived in an unusually comfortable position and I am aware of it. What I had not planned for was that everybody at work spoke English to me, very kindly, and that after eight months my German was still terrible. In the end I had to change something on purpose: I joined a football team where nobody would switch languages for me, and it was awful for about six weeks and then it was fine. I stayed a second year, which had never been the plan. If I were doing it again I would look for that football team in the first month rather than the ninth.'] },
      { letra: 'C', titulo: 'Rachel, a year in Seville',
        texto: ['I had a romantic idea of the year and I got a version of it, though not the one that was in my head. The teaching was twelve hours a week, which sounds easy and is not, because the rest of the time is yours and there is a very great deal of it. I was lonelier than I had expected in the first term and I did not tell anybody at home, which made it considerably worse. What changed things was joining a choir, of all things, since I cannot sing. I came back with a language, a group of friends I still see, and a mildly annoying habit of comparing everywhere to Andalusia.'] },
      { letra: 'D', titulo: 'Marek, a year in Bilbao',
        texto: ['I chose the city more or less at random, because a friend of a friend had been and liked it. The course itself was fine and I have forgotten most of it. What I remember is the flat: five of us, no two from the same country, all speaking bad Spanish to each other, which is the fastest way to learn it that I know. My parents worried about the cost and they were right to, because I ran out of money in April and had to take a job in a bar, and that half a year of shifts taught me more Spanish than the university managed in nine months. I would do it again in exactly the same way, including the mistake.'] }
    ],
    items: [
      { pregunta: '1  Who says that the reason they went was not a positive one?',
        opciones: ['A','B','C','D'], correcta: 0 },
      { pregunta: '2  Who acknowledges arriving in a financially easier position than most people would?',
        opciones: ['A','B','C','D'], correcta: 1 },
      { pregunta: '3  Who admits keeping their feelings from people back home?',
        opciones: ['A','B','C','D'], correcta: 2 },
      { pregunta: '4  Who says an unplanned job taught them more than their studies did?',
        opciones: ['A','B','C','D'], correcta: 3 },
      { pregunta: '5  Who explains that a deliberate change was needed before the language improved?',
        opciones: ['A','B','C','D'], correcta: 1 },
      { pregunta: '6  Who says the main benefit of the year was not the one people assume?',
        opciones: ['A','B','C','D'], correcta: 0 },
      { pregunta: '7  Who mentions having a great deal of free time to fill?',
        opciones: ['A','B','C','D'], correcta: 2 },
      { pregunta: '8  Who says they would repeat the year without changing anything?',
        opciones: ['A','B','C','D'], correcta: 3 },
      { pregunta: '9  Who advises anyone going to check the costs carefully beforehand?',
        opciones: ['A','B','C','D'], correcta: 0 },
      { pregunta: '10  Who mentions living with people of several different nationalities?',
        opciones: ['A','B','C','D'], correcta: 3 }
    ]
  },

  'b2t1-lis1': {
    tipo: 'listening', parte: 1, titulo: 'Listening · Part 1',
    instruccion: 'You will hear people talking in eight different situations. Choose the answer (A, B or C) which fits best according to what you hear. <b>You will hear the recording twice.</b>',
    audio: 'audio/b2t1-lis1-espeak.mp3', escuchas: 2, demo: true,
    contexto: 'Eight short extracts, one question each.',
    items: [
      { pregunta: '1  What does the woman say about the cookery course?',
        opciones: ['The recipes were better than she had expected.', 'The other students mattered more to her than the skill.', 'She had trouble with the practical side of it.'], correcta: 1 },
      { pregunta: '2  What is the man’s attitude to the delay?',
        opciones: ['He blames the railway company.', 'He is more annoyed than he is admitting.', 'It makes almost no difference to his plans.'], correcta: 2 },
      { pregunta: '3  Why is Dani leaving the message?',
        opciones: ['To tell them the match will start later.', 'To cancel the match completely.', 'To ask somebody to book the pitch.'], correcta: 0 },
      { pregunta: '4  What does the woman say is unusual about the library?',
        opciones: ['It lends objects as well as books.', 'It has more members than it can deal with.', 'Books are no longer its main business.'], correcta: 0 },
      { pregunta: '5  What do the two colleagues agree about the new manager?',
        opciones: ['She is better organised than the last one.', 'She takes too long over decisions.', 'She consults people before deciding.'], correcta: 2 },
      { pregunta: '6  What had the man not been prepared for?',
        opciones: ['How difficult the last part of the race would be.', 'How he would feel once it was over.', 'How little training he actually needed.'], correcta: 1 },
      { pregunta: '7  What is the main drawback of the woman’s flat?',
        opciones: ['The rent is about to go up.', 'The landlord is slow to repair things.', 'It is noisy on certain nights.'], correcta: 2 },
      { pregunta: '8  What did the woman dislike about the film?',
        opciones: ['It went on for too long.', 'It left too much unexplained.', 'It answered every question for her.'], correcta: 2 }
    ]
  },

  'b2t1-lis2': {
    tipo: 'listening', parte: 2, titulo: 'Listening · Part 2',
    instruccion: 'Complete the sentences with <b>a word or short phrase</b> from what you hear. <b>You will hear the recording twice.</b>',
    audio: 'audio/b2t1-lis2-espeak.mp3', escuchas: 2, demo: true,
    contexto: 'Ruth Ellery talks about the travelling cinema she runs.',
    items: [
      { antes: 'Before starting the business, Ruth spent eleven years working as a', despues: 'in Leeds.', aceptadas: ['projectionist'] },
      { antes: 'The van she uses had previously been used to deliver', despues: '.', aceptadas: ['bread'] },
      { antes: 'The seats in the van came from a theatre in', despues: '.', aceptadas: ['Halifax'] },
      { antes: 'The very first screening had to be held in a', despues: '.', aceptadas: ['church'] },
      { antes: 'Ruth says the hardest part of every visit is the', despues: '.', aceptadas: ['parking'] },
      { antes: 'The one piece of equipment she would keep is the', despues: '.', aceptadas: ['sound system', 'sound'] },
      { antes: 'The busiest month of the year for the company is', despues: '.', aceptadas: ['February'] },
      { antes: 'Ruth never shows a film that lasts longer than', despues: '.', aceptadas: ['two hours'] },
      { antes: 'The film audiences asked for most often last year was a', despues: '.', aceptadas: ['western'] },
      { antes: 'Ruth says her main worry about the future is the cost of', despues: '.', aceptadas: ['fuel'] }
    ]
  },

  'b2t1-lis3': {
    tipo: 'listening', parte: 3, titulo: 'Listening · Part 3',
    instruccion: 'You will hear five short extracts in which people talk about a job they had while they were students. Choose from the list A–H what each speaker says. Use each letter once. There are three extra letters. <b>You will hear the recording twice.</b>',
    audio: 'audio/b2t1-lis3-espeak.mp3', escuchas: 2, demo: true,
    opcionesCortas: true,
    listas: [
      { titulo: 'What does each speaker say about the job?', opciones: [
        'The hours fitted around my studies.',
        'I learned how to handle difficult customers.',
        'I was paid less than I had been promised.',
        'It convinced me not to work in that industry.',
        'Somebody I met there is still a friend.',
        'I was given far more responsibility than expected.',
        'It was physically harder than I had imagined.',
        'I stayed much longer than I had meant to.'
      ] }
    ],
    items: [
      { pregunta: '1  Speaker 1', opciones: ['A','B','C','D','E','F','G','H'], correcta: 6 },
      { pregunta: '2  Speaker 2', opciones: ['A','B','C','D','E','F','G','H'], correcta: 5 },
      { pregunta: '3  Speaker 3', opciones: ['A','B','C','D','E','F','G','H'], correcta: 3 },
      { pregunta: '4  Speaker 4', opciones: ['A','B','C','D','E','F','G','H'], correcta: 0 },
      { pregunta: '5  Speaker 5', opciones: ['A','B','C','D','E','F','G','H'], correcta: 4 }
    ]
  },

  'b2t1-lis4': {
    tipo: 'listening', parte: 4, titulo: 'Listening · Part 4',
    instruccion: 'You will hear an interview. Choose the answer (A, B, C or D) which fits best according to what you hear. <b>You will hear the recording twice.</b>',
    audio: 'audio/b2t1-lis4-espeak.mp3', escuchas: 2, demo: true,
    contexto: 'A journalist interviews the biologist Ander Goikoetxea, who studies urban foxes.',
    items: [
      { pregunta: '1  Why did Ander begin studying foxes?',
        opciones: ['He had been interested in them since childhood.', 'It was the only work available at the time.', 'A colleague persuaded him to change subject.', 'He wanted to avoid working abroad.'], correcta: 1 },
      { pregunta: '2  What does he say about foxes moving into cities?',
        opciones: ['It began far earlier than people assume.', 'It was caused by changes in farming.', 'It is still going on today.', 'It has been exaggerated by newspapers.'], correcta: 0 },
      { pregunta: '3  What distinction does he draw?',
        opciones: ['Between wild animals and tame ones.', 'Between town foxes and country foxes.', 'Between putting up with people and trusting them.', 'Between young animals and older ones.'], correcta: 2 },
      { pregunta: '4  What does he say about feeding foxes?',
        opciones: ['It is cruel to the individual animal.', 'It causes the very problems people complain about.', 'It is less harmful than most experts claim.', 'It ought to be against the law.'], correcta: 1 },
      { pregunta: '5  What has surprised him most in fifteen years?',
        opciones: ['How quickly the population has grown.', 'How far the animals travel each night.', 'How little food they actually need.', 'How much their territories overlap.'], correcta: 3 },
      { pregunta: '6  What is his attitude to talking to residents?',
        opciones: ['He regrets the research time it costs him.', 'He now sees it as central to the work.', 'He finds it useful only for keeping funders happy.', 'He thinks colleagues should do more of it.'], correcta: 1 },
      { pregunta: '7  What is his conclusion about urban foxes?',
        opciones: ['The public ought to be more enthusiastic about them.', 'Population control would work if it were better organised.', 'The only real question is how we live alongside them.', 'Scientists should be readier to give their opinion.'], correcta: 2 }
    ]
  },

  'b2t1-speak1': {
    tipo: 'speaking', parte: 2, titulo: 'Long turn: dos lugares para estudiar',
    instruccion: 'Habla durante <b>un minuto seguido</b>. Compara las dos situaciones: no las describas una detrás de otra.',
    segundos: 60,
    pregunta: 'Compare these two situations and say why the people might have chosen to study there.',
    puntos: ['a busy café in the middle of the afternoon', 'a silent library on a Sunday morning'],
    nota: 'En el examen esto se hace con dos fotografías y hay una segunda pregunta corta al final. Aquí van descritas mientras la academia no aporte las suyas.',
    items: [ { grabacion: true } ]
  },

  'b2t1-speak3': {
    tipo: 'speaking', parte: 3, titulo: 'Parte 3: decidir en voz alta',
    instruccion: 'Habla durante <b>dos minutos</b>. Comenta las cinco ideas y termina eligiendo una.',
    segundos: 120,
    pregunta: 'A school wants to help students who are nervous about speaking English. How helpful would each of these be, and which one would help most?',
    puntos: ['a weekly conversation club', 'watching films without subtitles', 'exchanging messages with a student abroad', 'recording yourself and listening back', 'a term studying in another country'],
    nota: 'En el examen esto se habla con otro candidato: se negocia y se llega a un acuerdo. Grabándote solo se practica todo menos eso, que es un criterio entero.',
    items: [ { grabacion: true } ]
  },

  'b2t1-speak4': {
    tipo: 'speaking', parte: 4, titulo: 'Parte 4: opinar y justificar',
    instruccion: 'Contesta a las tres preguntas seguidas, <b>dos minutos</b> en total.',
    segundos: 120,
    pregunta: 'Questions about languages and learning.',
    puntos: [
      'Is it better to start learning a language as a child or as an adult? Why?',
      'Some people say you cannot learn a language without living in the country. Do you agree?',
      'Should schools spend more time on speaking and less on grammar?'
    ],
    nota: 'En el examen el examinador pregunta y luego te pide que reacciones a lo que ha dicho la otra persona. Aquí solo está la primera mitad.',
    items: [ { grabacion: true } ]
  },

  'b2t1-write1': {
    tipo: 'writing', parte: 1, titulo: 'Essay',
    instruccion: 'Escribe entre <b>140 y 190 palabras</b>. Es obligatorio: en el examen esta tarea no se elige.',
    minutos: 40, palabras: [140, 190],
    enunciado: 'In your English class you have been talking about how young people spend their free time. Now your teacher has asked you to write an essay. Do you agree that schools should organise more activities outside lesson time?',
    contexto: 'Notes. Write about: 1 · health · 2 · making friends · 3 ... (your own idea).',
    cierre: 'Write in a fairly formal style. Use both of the given notes and add one idea of your own.',
    items: [ { escrito: true } ]
  },

  'b2t1-write2': {
    tipo: 'writing', parte: 2, titulo: 'A elegir: correo, reseña o artículo',
    instruccion: 'Elige <b>una</b> de las tres y escribe entre <b>140 y 190 palabras</b>.',
    minutos: 40, palabras: [140, 190],
    enunciado: 'Choose one of the following three tasks.',
    contexto: '1 · An English friend is coming to stay with you for a week in July and has asked what to bring and what you could do together. Write an email replying to their questions.\n2 · A website is collecting reviews of places to eat near your school or workplace. Write a review of one, saying what it is like and who would enjoy it.\n3 · An English-language magazine has asked readers for articles under the title "The best thing I have learned outside school". Write your article.',
    cierre: 'El correo es informal y contesta a lo que te han preguntado. La reseña opina y recomienda. El artículo busca que el lector siga leyendo: empieza por algo concreto, no por una definición.',
    items: [ { escrito: true } ]
  },

  /* ---------------------- TEST 2 de B2 First ---------------------- */

  'b2t2-gram1': {
    tipo: 'transformacion', titulo: 'Presentes',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'We moved to this flat in 2019 and we are still here.', clave: 'LIVED', antes: 'We', despues: 'in this flat since 2019.', aceptadas: ['have lived'] },
      { frase: 'How long is it since you started learning Basque?', clave: 'BEEN', antes: 'How long', despues: 'Basque?', aceptadas: ['have you been learning'] },
      { frase: 'Ana is not at her desk at the moment.', clave: 'AWAY', antes: 'Ana', despues: 'from her desk at the moment.', aceptadas: ['is away'] },
      { frase: 'They are repairing the lift this week.', clave: 'BEING', antes: 'The lift', despues: 'this week.', aceptadas: ['is being repaired'] },
      { frase: 'My brother constantly borrows my things without asking.', clave: 'ALWAYS', antes: 'My brother', despues: 'my things without asking.', aceptadas: ['is always borrowing'] },
      { frase: 'She has had that car for five years.', clave: 'BOUGHT', antes: 'She', despues: 'five years ago.', aceptadas: ['bought that car', 'bought the car'] }
    ]
  },

  'b2t2-gram2': {
    tipo: 'transformacion', titulo: 'Pasados',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'The concert finished and then we went for a meal.', clave: 'AFTER', antes: 'We went for a meal', despues: 'finished.', aceptadas: ['after the concert'] },
      { frase: 'It started to rain while we were walking home.', clave: 'WHEN', antes: 'We', despues: 'it started to rain.', aceptadas: ['were walking home when'] },
      { frase: 'I did not recognise her because I had not seen her for years.', clave: 'HAD', antes: 'I did not recognise her because I', despues: 'her for years.', aceptadas: ["hadn't seen", 'had not seen'] },
      { frase: 'Nobody had told him about the meeting.', clave: 'BEEN', antes: 'He', despues: 'about the meeting.', aceptadas: ["hadn't been told", 'had not been told'] },
      { frase: 'I was in the middle of cooking when he called.', clave: 'COOKING', antes: 'I', despues: 'when he called.', aceptadas: ['was cooking'] },
      { frase: 'The last time I went to the theatre was in 2019.', clave: 'SINCE', antes: 'I have not been to the theatre', despues: '.', aceptadas: ['since 2019'] }
    ]
  },

  'b2t2-gram3': {
    tipo: 'transformacion', titulo: 'Futuro',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I have arranged to meet Jon at six.', clave: 'MEETING', antes: 'I', despues: 'Jon at six.', aceptadas: ['am meeting', "'m meeting"] },
      { frase: 'The exam will be over by five o’clock.', clave: 'FINISHED', antes: 'The exam', despues: 'by five o’clock.', aceptadas: ['will have finished'] },
      { frase: 'The plane takes off at ten past seven.', clave: 'TAKING', antes: 'The plane', despues: 'at ten past seven.', aceptadas: ['is taking off'] },
      { frase: 'I will phone you as soon as I arrive.', clave: 'MOMENT', antes: 'I will phone you', despues: 'arrive.', aceptadas: ['the moment I'] },
      { frase: 'She intends to look for a new job.', clave: 'GOING', antes: 'She', despues: 'for a new job.', aceptadas: ['is going to look'] },
      { frase: 'The builders will still be working at six.', clave: 'BE', antes: 'At six the builders', despues: 'working.', aceptadas: ['will still be'] }
    ]
  },

  'b2t2-gram4': {
    tipo: 'transformacion', titulo: 'Repaso de tiempos',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'It is three years since I last went skiing.', clave: 'BEEN', antes: 'I', despues: 'skiing for three years.', aceptadas: ["haven't been", 'have not been'] },
      { frase: 'She started the course in September and she is still doing it.', clave: 'DOING', antes: 'She', despues: 'the course since September.', aceptadas: ['has been doing'] },
      { frase: 'They will finish the bridge next year.', clave: 'BE', antes: 'The bridge', despues: 'next year.', aceptadas: ['will be finished'] },
      { frase: 'This is my first visit to Scotland.', clave: 'TIME', antes: 'It is the first', despues: 'to Scotland.', aceptadas: ['time I have been'] },
      { frase: 'We were still eating when they arrived.', clave: 'FINISHED', antes: 'We', despues: 'eating when they arrived.', aceptadas: ["hadn't finished", 'had not finished'] },
      { frase: 'How long ago did you buy that bike?', clave: 'HAD', antes: 'How long', despues: 'that bike?', aceptadas: ['have you had'] }
    ]
  },

  'b2t2-gram5': {
    tipo: 'transformacion', titulo: 'Costumbres del pasado',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'When I was a child I played the piano every day.', clave: 'USED', antes: 'I', despues: 'the piano every day when I was a child.', aceptadas: ['used to play'] },
      { frase: 'My grandmother often told us stories at bedtime.', clave: 'WOULD', antes: 'My grandmother', despues: 'us stories at bedtime.', aceptadas: ['would often tell'] },
      { frase: 'There was a cinema here in the past, but not now.', clave: 'BE', antes: 'There', despues: 'a cinema here.', aceptadas: ['used to be'] },
      { frase: 'She did not like coffee when she was younger.', clave: 'USE', antes: 'She', despues: 'coffee when she was younger.', aceptadas: ["didn't use to like", 'did not use to like'] },
      { frase: 'We never went abroad when I was small.', clave: 'NEVER', antes: 'We', despues: 'abroad when I was small.', aceptadas: ['never used to go'] },
      { frase: 'He does not smoke now, but he did before.', clave: 'LONGER', antes: 'He', despues: 'smokes.', aceptadas: ['no longer'] }
    ]
  },

  'b2t2-gram6': {
    tipo: 'transformacion', titulo: 'Acostumbrarse',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'Driving on the left was strange for me at first.', clave: 'USED', antes: 'At first I', despues: 'driving on the left.', aceptadas: ["wasn't used to", 'was not used to'] },
      { frase: 'She is finding the early starts easier now.', clave: 'GETTING', antes: 'She', despues: 'the early starts.', aceptadas: ['is getting used to'] },
      { frase: 'Living alone does not bother me any more.', clave: 'USED', antes: 'I', despues: 'living alone.', aceptadas: ['am used to', "'m used to"] },
      { frase: 'It took him a while to accept the new system.', clave: 'GET', antes: 'It took him a while', despues: 'the new system.', aceptadas: ['to get used to'] },
      { frase: 'She did not find the cold weather difficult after a month.', clave: 'GOT', antes: 'After a month she', despues: 'the cold weather.', aceptadas: ['had got used to', 'got used to'] },
      { frase: 'Long journeys are normal for her.', clave: 'USED', antes: 'She', despues: 'long journeys.', aceptadas: ['is used to'] }
    ]
  },

  'b2t2-gram7': {
    tipo: 'transformacion', titulo: 'Poder y tener que',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'You are not allowed to park here.', clave: 'MUST', antes: 'You', despues: 'here.', aceptadas: ["mustn't park", 'must not park'] },
      { frase: 'I managed to finish it before lunch.', clave: 'ABLE', antes: 'I', despues: 'finish it before lunch.', aceptadas: ['was able to'] },
      { frase: 'It is obligatory to wear a helmet.', clave: 'HAVE', antes: 'You', despues: 'a helmet.', aceptadas: ['have to wear'] },
      { frase: 'She could not come because of her exams.', clave: 'UNABLE', antes: 'She', despues: 'come because of her exams.', aceptadas: ['was unable to'] },
      { frase: 'It was not necessary for us to queue.', clave: 'HAVE', antes: 'We', despues: 'queue.', aceptadas: ["didn't have to", 'did not have to'] },
      { frase: 'He knows how to swim very well.', clave: 'CAN', antes: 'He', despues: 'very well.', aceptadas: ['can swim'] }
    ]
  },

  'b2t2-gram8': {
    tipo: 'transformacion', titulo: 'Consejo y deducción',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'It was a mistake to tell him.', clave: 'SHOULD', antes: 'You', despues: 'him.', aceptadas: ["shouldn't have told", 'should not have told'] },
      { frase: 'I am sure she has already left.', clave: 'MUST', antes: 'She', despues: 'already.', aceptadas: ['must have left'] },
      { frase: 'It is impossible that he saw us.', clave: 'CANNOT', antes: 'He', despues: 'us.', aceptadas: ['cannot have seen'] },
      { frase: 'Perhaps they missed the train.', clave: 'MIGHT', antes: 'They', despues: 'the train.', aceptadas: ['might have missed'] },
      { frase: 'If I were you I would ring the doctor.', clave: 'OUGHT', antes: 'You', despues: 'the doctor.', aceptadas: ['ought to ring'] },
      { frase: 'I advise you to book early.', clave: 'BETTER', antes: 'You', despues: 'early.', aceptadas: ["'d better book", 'had better book'] }
    ]
  },

  'b2t2-gram9': {
    tipo: 'transformacion', titulo: 'Voz pasiva',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'Somebody is cleaning the windows.', clave: 'BEING', antes: 'The windows', despues: '.', aceptadas: ['are being cleaned'] },
      { frase: 'They have cancelled all the flights.', clave: 'BEEN', antes: 'All the flights', despues: 'cancelled.', aceptadas: ['have been'] },
      { frase: 'People say he is very generous.', clave: 'SAID', antes: 'He', despues: 'very generous.', aceptadas: ['is said to be'] },
      { frase: 'They will announce the results on Friday.', clave: 'ANNOUNCED', antes: 'The results', despues: 'on Friday.', aceptadas: ['will be announced'] },
      { frase: 'They gave her a prize.', clave: 'GIVEN', antes: 'She', despues: 'a prize.', aceptadas: ['was given'] },
      { frase: 'Someone should tell the neighbours.', clave: 'BE', antes: 'The neighbours', despues: '.', aceptadas: ['should be told'] }
    ]
  },

  'b2t2-gram10': {
    tipo: 'transformacion', titulo: 'Que te lo hagan',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'A mechanic services my car every year.', clave: 'HAVE', antes: 'I', despues: 'every year.', aceptadas: ['have my car serviced'] },
      { frase: 'Somebody broke into their house last night.', clave: 'HAD', antes: 'They', despues: 'into last night.', aceptadas: ['had their house broken'] },
      { frase: 'A hairdresser is going to cut her hair tomorrow.', clave: 'HAVING', antes: 'She is', despues: 'tomorrow.', aceptadas: ['having her hair cut'] },
      { frase: 'I am going to ask someone to paint the door.', clave: 'GET', antes: 'I am going to', despues: '.', aceptadas: ['get the door painted'] },
      { frase: 'Someone repaired her laptop last week.', clave: 'GOT', antes: 'She', despues: 'last week.', aceptadas: ['got her laptop repaired'] },
      { frase: 'We are going to ask a builder to build an extension.', clave: 'HAVE', antes: 'We are going to', despues: 'built.', aceptadas: ['have an extension'] }
    ]
  },

  'b2t2-gram11': {
    tipo: 'transformacion', titulo: 'Condicionales',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I did not know, so I did not tell you.', clave: 'HAD', antes: 'If I', despues: ', I would have told you.', aceptadas: ['had known'] },
      { frase: 'Take a coat or you will be cold.', clave: 'UNLESS', antes: 'You will be cold', despues: 'a coat.', aceptadas: ['unless you take'] },
      { frase: 'I do not have a car, so I cannot give you a lift.', clave: 'HAD', antes: 'If I', despues: ', I could give you a lift.', aceptadas: ['had a car'] },
      { frase: 'She only passed because you helped her.', clave: 'NOT', antes: 'If you', despues: 'her, she would not have passed.', aceptadas: ['had not helped'] },
      { frase: 'Phone me in case there is a problem.', clave: 'IF', antes: 'Phone me', despues: 'a problem.', aceptadas: ['if there is'] },
      { frase: 'You can borrow it as long as you give it back.', clave: 'PROVIDED', antes: 'You can borrow it', despues: 'give it back.', aceptadas: ['provided you'] }
    ]
  },

  'b2t2-gram12': {
    tipo: 'transformacion', titulo: 'Deseos y lamentos',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I am sorry I did not study harder.', clave: 'WISH', antes: 'I', despues: 'harder.', aceptadas: ['wish I had studied'] },
      { frase: 'I would like to be taller.', clave: 'WERE', antes: 'I wish I', despues: '.', aceptadas: ['were taller'] },
      { frase: 'It is a pity you cannot come.', clave: 'ONLY', antes: 'If', despues: 'come.', aceptadas: ['only you could'] },
      { frase: 'I regret buying this phone.', clave: 'WISH', antes: 'I', despues: 'this phone.', aceptadas: ["wish I hadn't bought", 'wish I had not bought'] },
      { frase: 'We really should go home now.', clave: 'WENT', antes: 'It is time', despues: 'home.', aceptadas: ['we went'] },
      { frase: 'I regret not telling her the truth.', clave: 'HAD', antes: 'I wish I', despues: 'her the truth.', aceptadas: ['had told'] }
    ]
  },

  'b2t2-gram13': {
    tipo: 'transformacion', titulo: 'Estilo indirecto',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: '"I will call you tomorrow," she said.', clave: 'WOULD', antes: 'She said', despues: 'the next day.', aceptadas: ['she would call me'] },
      { frase: '"Do not touch that," he told me.', clave: 'NOT', antes: 'He told me', despues: 'that.', aceptadas: ['not to touch'] },
      { frase: '"Where have you been?" she asked me.', clave: 'WHERE', antes: 'She asked me', despues: '.', aceptadas: ['where I had been'] },
      { frase: '"I did not take the money," said Tom.', clave: 'DENIED', antes: 'Tom', despues: 'the money.', aceptadas: ['denied taking'] },
      { frase: '"Would you like to come to dinner?" they asked us.', clave: 'INVITED', antes: 'They', despues: 'to dinner.', aceptadas: ['invited us'] },
      { frase: '"Yes, I broke the window," said Leo.', clave: 'ADMITTED', antes: 'Leo', despues: 'the window.', aceptadas: ['admitted breaking'] }
    ]
  },

  'b2t2-gram14': {
    tipo: 'transformacion', titulo: 'Comparar y relativas',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'This is the most difficult exam I have ever taken.', clave: 'MORE', antes: 'I have never taken', despues: 'this one.', aceptadas: ['a more difficult exam than'] },
      { frase: 'The flat is not as big as I remembered.', clave: 'BIGGER', antes: 'I remembered the flat', despues: 'it is.', aceptadas: ['being bigger than'] },
      { frase: 'She is a woman. Her son works with me.', clave: 'WHOSE', antes: 'She is the woman', despues: 'with me.', aceptadas: ['whose son works'] },
      { frase: 'That is the village. I was born there.', clave: 'WHERE', antes: 'That is the village', despues: 'born.', aceptadas: ['where I was'] },
      { frase: 'My brother lives in Girona and he is a vet.', clave: 'WHO', antes: 'My brother,', despues: 'Girona, is a vet.', aceptadas: ['who lives in'] },
      { frase: 'Nobody in the team runs faster than Julen.', clave: 'FASTEST', antes: 'Julen', despues: 'in the team.', aceptadas: ['is the fastest runner'] }
    ]
  },

  'b2t2-voc1': {
    tipo: 'caja', titulo: 'Preposiciones tras sustantivo · segunda vuelta',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['about', 'between', 'for', 'in', 'of', 'on', 'to', 'with'],
    items: [
      { antes: 'There has been a big increase', despues: 'the number of tourists.', aceptadas: ['in'] },
      { antes: 'She had no answer', despues: 'that question.', aceptadas: ['to'] },
      { antes: 'The reason', despues: 'the delay was never explained.', aceptadas: ['for'] },
      { antes: 'They finally reached an agreement', despues: 'the two families.', aceptadas: ['between'] },
      { antes: 'I have no intention', despues: 'moving house.', aceptadas: ['of'] },
      { antes: 'There is something wrong', despues: 'the printer.', aceptadas: ['with'] }
    ]
  },

  'b2t2-voc2': {
    tipo: 'caja', titulo: 'Phrasal verbs · dinero y trabajo',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['back', 'down', 'in', 'off', 'on', 'out', 'over', 'up'],
    items: [
      { antes: 'Prices have gone', despues: 'again this month.', aceptadas: ['up'] },
      { antes: 'I need to pay her', despues: 'before Friday.', aceptadas: ['back'] },
      { antes: 'The factory laid', despues: 'forty workers in March.', aceptadas: ['off'] },
      { antes: 'She has taken', despues: 'a new job in Vitoria.', aceptadas: ['on'] },
      { antes: 'They turned the heating', despues: 'to save money.', aceptadas: ['down'] },
      { antes: 'He filled', despues: 'the application form at the desk.', aceptadas: ['in'] }
    ]
  },

  'b2t2-voc3': {
    tipo: 'caja', titulo: 'Adjetivos y su preposición · segunda vuelta',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['about', 'at', 'for', 'from', 'in', 'of', 'on', 'with'],
    items: [
      { antes: 'She is very keen', despues: 'photography.', aceptadas: ['on'] },
      { antes: 'I am not very good', despues: 'remembering names.', aceptadas: ['at'] },
      { antes: 'This town is completely different', despues: 'the one I grew up in.', aceptadas: ['from'] },
      { antes: 'He is very proud', despues: 'his daughter.', aceptadas: ['of'] },
      { antes: 'They were extremely pleased', despues: 'the result.', aceptadas: ['with'] },
      { antes: 'I am sorry', despues: 'the noise last night.', aceptadas: ['about'] }
    ]
  },

  'b2t2-voc4': {
    tipo: 'caja', titulo: 'Verbos con preposición fija · segunda vuelta',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['about', 'for', 'from', 'in', 'of', 'on', 'to', 'with'],
    items: [
      { antes: 'I have been waiting', despues: 'the bus for twenty minutes.', aceptadas: ['for'] },
      { antes: 'She never complains', despues: 'anything.', aceptadas: ['about'] },
      { antes: 'This coat belongs', despues: 'my sister.', aceptadas: ['to'] },
      { antes: 'He suffers', despues: 'terrible headaches in summer.', aceptadas: ['from'] },
      { antes: 'They believe', despues: 'giving everybody a chance.', aceptadas: ['in'] },
      { antes: 'Please concentrate', despues: 'your own work.', aceptadas: ['on'] }
    ]
  },

  'b2t2-voc5': {
    tipo: 'caja', titulo: 'Phrasal verbs · casa y rutina',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['away', 'back', 'off', 'on', 'out', 'over', 'round', 'up'],
    items: [
      { antes: 'I get', despues: 'at half past six every day.', aceptadas: ['up'] },
      { antes: 'Do not forget to turn the lights', despues: 'when you leave.', aceptadas: ['off'] },
      { antes: 'Some friends came', despues: 'for dinner on Saturday.', aceptadas: ['round'] },
      { antes: 'We are eating', despues: 'tonight.', aceptadas: ['out'] },
      { antes: 'Put your coat', despues: ', it is freezing.', aceptadas: ['on'] },
      { antes: 'She went', despues: 'to Sevilla for the weekend.', aceptadas: ['away'] }
    ]
  },

  'b2t2-voc6': {
    tipo: 'caja', titulo: 'Colocaciones · verbo y sustantivo',
    instruccion: 'Complete each sentence with a verb from the box. There are more verbs than you need.',
    caja: ['break', 'catch', 'keep', 'lose', 'save', 'spend', 'tell', 'win'],
    items: [
      { antes: 'Try not to', despues: 'your temper with him.', aceptadas: ['lose'] },
      { antes: 'Can you', despues: 'a secret?', aceptadas: ['keep'] },
      { antes: 'It is not always easy to', despues: 'the truth.', aceptadas: ['tell'] },
      { antes: 'They hope to', despues: 'the match on Sunday.', aceptadas: ['win'] },
      { antes: 'Hurry up or we will not', despues: 'the train.', aceptadas: ['catch'] },
      { antes: 'Doing it online will', despues: 'us a lot of time.', aceptadas: ['save'] }
    ]
  },

  'b2t2-voc7': {
    tipo: 'caja', titulo: 'Expresiones cotidianas · segunda vuelta',
    instruccion: 'Complete each expression with a word from the box. There are more words than you need.',
    caja: ['ages', 'chance', 'go', 'idea', 'luck', 'mind', 'trouble', 'turn'],
    items: [
      { antes: 'I have not seen her for', despues: '.', aceptadas: ['ages'] },
      { antes: 'Have a', despues: 'at the first question.', aceptadas: ['go'] },
      { antes: 'It is my', despues: 'to pay.', aceptadas: ['turn'] },
      { antes: 'By any', despues: ', are you free on Thursday?', aceptadas: ['chance'] },
      { antes: 'Good', despues: 'with the exam tomorrow.', aceptadas: ['luck'] },
      { antes: 'I have no', despues: 'what he means.', aceptadas: ['idea'] }
    ]
  },

  'b2t2-voc8': {
    tipo: 'cloze', titulo: 'Open cloze · papel o pantalla',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'There is a particular argument that comes {1} every few years, and it is the one about paper books against screens. Both sides have been saying exactly the same things for twenty years and neither of them has moved {2} inch.',
      'What gets lost is that they are not really the same activity. A screen is very good at getting a book to you at eleven at night, and terrible at telling you {3} much of it is left. Paper does the opposite. Neither of these is a moral position; they are different tools, and most people who read a lot end {4} using both without thinking about it.',
      'The thing worth defending is not the paper. It is the hour. Whatever you read {5}, the difficulty is finding the time and leaving the phone in another room, and no format has ever solved that {6} you.'
    ],
    items: [
      { aceptadas: ['round', 'around', 'up', 'back'] }, { aceptadas: ['an'] }, { aceptadas: ['how'] },
      { aceptadas: ['up'] }, { aceptadas: ['on'] }, { aceptadas: ['for'] }
    ]
  },

  'b2t2-voc9': {
    tipo: 'cloze', titulo: 'Open cloze · aprender a conducir',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Nobody enjoys learning to drive, and the people who say they did are remembering the licence rather {1} the lessons. For the first month you are being asked to do six things at once, badly, in public, beside somebody with a second set of pedals who has seen it all {2}.',
      'What makes it hard is not the machine. It is that everything has to become automatic before you can pay attention to anything {3}, and the only way through that is repetition, which is dull. There is no clever method, and the instructors who promise {4} shortcut are selling confidence rather than skill.',
      'Then one afternoon you notice that you have driven right across the city and cannot remember any {5} of it, and that is the moment at which you have learned. It arrives without warning, and it arrives {6} everybody, eventually.'
    ],
    items: [
      { aceptadas: ['than'] }, { aceptadas: ['before'] }, { aceptadas: ['else'] },
      { aceptadas: ['a'] }, { aceptadas: ['part'] }, { aceptadas: ['for', 'to'] }
    ]
  },

  'b2t2-voc10': {
    tipo: 'cloze', titulo: 'Open cloze · listas de tareas',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Everybody has a system for remembering what they have to do, and almost {1} of them work for longer than a fortnight. The list gets long, the long list gets frightening, the frightening list gets ignored, and then you buy a new app and start the whole thing {2} again.',
      'The problem is not the app. It is that we write down what we would {3} to be true rather than what we are actually going to do on Tuesday. A list with nineteen things on it is not a plan; it is a description {4} how you feel about your life. Three things is a plan, and three things is also, on most days, {5} much as anybody gets done.',
      'Nobody wants to hear this, because a short list means choosing, and choosing means admitting out loud that the other sixteen were never going to happen {6}.'
    ],
    items: [
      { aceptadas: ['none'] }, { aceptadas: ['over', 'all'] }, { aceptadas: ['like'] },
      { aceptadas: ['of'] }, { aceptadas: ['as'] }, { aceptadas: ['anyway'] }
    ]
  },

  'b2t2-voc11': {
    tipo: 'formacion', titulo: 'Word formation · nombres abstractos',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'His', despues: 'to the team has never been in doubt.', raiz: 'COMMIT', aceptadas: ['commitment'] },
      { antes: 'There was a great deal of', despues: 'about the new rules.', raiz: 'CONFUSE', aceptadas: ['confusion'] },
      { antes: 'The', despues: 'between the two schools has grown.', raiz: 'COMPETE', aceptadas: ['competition'] },
      { antes: 'She spoke about her old teacher with real', despues: '.', raiz: 'WARM', aceptadas: ['warmth'] },
      { antes: 'The', despues: 'of the letter was clear to everybody.', raiz: 'IMPORTANT', aceptadas: ['importance'] },
      { antes: 'We are still waiting for an', despues: 'of what happened.', raiz: 'EXPLAIN', aceptadas: ['explanation'] }
    ]
  },

  'b2t2-voc12': {
    tipo: 'formacion', titulo: 'Word formation · adjetivos',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The ending of the film was rather', despues: '.', raiz: 'DISAPPOINT', aceptadas: ['disappointing'] },
      { antes: 'It is a very', despues: 'building from the outside.', raiz: 'ATTRACT', aceptadas: ['attractive'] },
      { antes: 'She is extremely', despues: 'about her work.', raiz: 'ENTHUSIASM', aceptadas: ['enthusiastic'] },
      { antes: 'The water in that stream is not', despues: '.', raiz: 'DRINK', aceptadas: ['drinkable'] },
      { antes: 'That was a very', despues: 'thing to do.', raiz: 'DANGER', aceptadas: ['dangerous'] },
      { antes: 'He was', despues: 'to everybody at the party.', raiz: 'FRIEND', aceptadas: ['friendly'] }
    ]
  },

  'b2t2-voc13': {
    tipo: 'formacion', titulo: 'Word formation · adjetivos en negativo',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The new rules seem completely', despues: '.', raiz: 'FAIR', aceptadas: ['unfair'] },
      { antes: 'His handwriting is almost', despues: '.', raiz: 'LEGIBLE', aceptadas: ['illegible'] },
      { antes: 'They were getting very', despues: 'about the delay.', raiz: 'PATIENT', aceptadas: ['impatient'] },
      { antes: 'He is hopelessly', despues: 'and loses things constantly.', raiz: 'ORGANISE', aceptadas: ['disorganised', 'disorganized'] },
      { antes: 'The two accounts of the evening are', despues: 'with each other.', raiz: 'COMPATIBLE', aceptadas: ['incompatible'] },
      { antes: 'She was', despues: 'to find the address he had given her.', raiz: 'ABLE', aceptadas: ['unable'] }
    ]
  },

  'b2t2-voc14': {
    tipo: 'formacion', titulo: 'Word formation · personas y oficios',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'She works as a', despues: 'in a bank in Getxo.', raiz: 'MANAGE', aceptadas: ['manager'] },
      { antes: 'He trained as an', despues: 'in Bilbao.', raiz: 'ELECTRIC', aceptadas: ['electrician'] },
      { antes: 'The', despues: 'of the play is only twenty-five.', raiz: 'WRITE', aceptadas: ['writer'] },
      { antes: 'She is a well-known', despues: 'in this part of Spain.', raiz: 'POLITICS', aceptadas: ['politician'] },
      { antes: 'The', despues: 'said the roof would cost four thousand euros.', raiz: 'BUILD', aceptadas: ['builder'] },
      { antes: 'My sister is a', despues: 'at the university.', raiz: 'RESEARCH', aceptadas: ['researcher'] }
    ]
  },

  'b2t2-use1': {
    tipo: 'opcion', parte: 1, titulo: 'Use of English · Part 1',
    instruccion: 'Decide which answer best fits each gap.',
    texto: [
      'Buying second-hand clothes used to be something people did quietly and did not {1} up in conversation. Now the queue outside the charity shop on a Saturday morning is longer than the one outside the chain store opposite, and the shop has started to {2} its prices accordingly.',
      'Two things changed at the same time, and it is worth {3} them apart. One is money: clothes got expensive and wages did not {4} pace. The other is that a generation decided a new jumper made in a hurry was faintly embarrassing, which is a much larger shift and a much less reliable one.',
      'The shops themselves have mixed feelings. Volunteers who spent years {5} through donated bags for anything wearable now find people arriving at nine to look for particular labels. Nobody in the sector is going to {6} the money down, and it pays for what the charity actually {7}. But the people the shops were originally for are finding less on the rails, and nobody has worked {8} what to do about that.'
    ],
    items: [
      { opciones: ['take', 'put', 'bring', 'call'], correcta: 2 },
      { opciones: ['rise', 'lift', 'grow', 'raise'], correcta: 3 },
      { opciones: ['telling', 'keeping', 'holding', 'setting'], correcta: 0 },
      { opciones: ['make', 'take', 'keep', 'hold'], correcta: 2 },
      { opciones: ['picking', 'sorting', 'choosing', 'arranging'], correcta: 1 },
      { opciones: ['refuse', 'put', 'send', 'turn'], correcta: 3 },
      { opciones: ['makes', 'gives', 'does', 'runs'], correcta: 2 },
      { opciones: ['off', 'over', 'out', 'up'], correcta: 2 }
    ]
  },

  'b2t2-use2a': {
    tipo: 'cloze', parte: 2, titulo: 'Use of English · Part 2',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Sleep is the one piece of health advice that nobody argues {1}, and that almost nobody follows. Everybody agrees that eight hours would be better; almost everybody treats the last hour of the day as the only one that belongs to them, and spends it looking at a screen.',
      'The advice itself is not complicated, which is {2} it is so irritating. The same time every night, no coffee after four, a room that is cold and dark. Nothing there is beyond {3} of us. What makes it hard is that going to bed feels {4} giving up: the day was disappointing, and sleeping ends any chance of rescuing it.',
      'Nobody in the sleep clinics puts it in those words, but they know it, {5} is why the good ones ask what you are staying up for rather {6} lecturing you about screens. The answer is usually nothing at all, and hearing yourself say {7} out loud does more than any amount of advice {8} ever done.'
    ],
    items: [
      { aceptadas: ['with'] }, { aceptadas: ['why'] }, { aceptadas: ['most', 'any'] },
      { aceptadas: ['like'] }, { aceptadas: ['which'] }, { aceptadas: ['than'] },
      { aceptadas: ['it', 'that'] }, { aceptadas: ['has'] }
    ]
  },

  'b2t2-use2b': {
    tipo: 'cloze', parte: 2, titulo: 'Use of English · Part 2 (extra)',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Friendships made at sixteen have an unfair advantage {1} all the ones that come afterwards. They were formed before anybody had decided who they were going to be, which makes them the only friendships in {2} you are not being measured against a version of yourself you invented later.',
      'That is also {3} makes them hard to keep. The people who knew you at sixteen remember the whole of it, and there are stretches nobody wants remembered. It is easier to build a friendship at thirty-five, {4} the edit is already done and both sides have quietly agreed to it.',
      'Most of us end {5} with a few of each and pretend not to notice the difference. The old ones are the people you would ring at four in the morning; the new ones are the people you actually see. Neither kind is worth {6} much on its own, and hardly anybody manages to have both {7} the same person. If you do, do not say so out loud: it is the {8} of luck other people find hard to forgive.'
    ],
    items: [
      { aceptadas: ['over'] }, { aceptadas: ['which'] }, { aceptadas: ['what'] },
      { aceptadas: ['because', 'since', 'as', 'when'] }, { aceptadas: ['up'] },
      { aceptadas: ['that', 'very', 'all', 'too'] }, { aceptadas: ['in'] },
      { aceptadas: ['kind', 'sort', 'type'] }
    ]
  },

  'b2t2-use3': {
    tipo: 'formacion', parte: 3, titulo: 'Use of English · Part 3',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The staff were extremely', despues: 'when we complained.', raiz: 'APOLOGY', aceptadas: ['apologetic'] },
      { antes: 'Her', despues: 'to detail is remarkable.', raiz: 'ATTEND', aceptadas: ['attention'] },
      { antes: 'The town has changed', despues: 'since I was last here.', raiz: 'CONSIDER', aceptadas: ['considerably'] },
      { antes: 'It was an entirely', despues: 'mistake.', raiz: 'UNDERSTAND', aceptadas: ['understandable'] },
      { antes: 'The', despues: 'of the old theatre took eighteen months.', raiz: 'RESTORE', aceptadas: ['restoration'] },
      { antes: 'She has a very', despues: 'way of explaining things.', raiz: 'PRACTICE', aceptadas: ['practical'] },
      { antes: 'The results were', despues: 'better than last year.', raiz: 'SIGNIFY', aceptadas: ['significantly'] },
      { antes: 'The company has denied any', despues: 'for the delay.', raiz: 'RESPONSIBLE', aceptadas: ['responsibility'] }
    ]
  },

  'b2t2-use4a': {
    tipo: 'transformacion', parte: 4, titulo: 'Use of English · Part 4',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'They cancelled the concert because of the storm.', clave: 'OFF', antes: 'The concert', despues: 'because of the storm.', aceptadas: ['was called off'] },
      { frase: 'It does not matter what she decides.', clave: 'DIFFERENCE', antes: 'It makes', despues: 'what she decides.', aceptadas: ['no difference'] },
      { frase: 'I did not expect the bill to be so high.', clave: 'SURPRISE', antes: 'The bill', despues: 'to me.', aceptadas: ['came as a surprise'] },
      { frase: 'She swims better than anyone else in the club.', clave: 'AS', antes: 'Nobody else in the club swims', despues: 'she does.', aceptadas: ['as well as'] },
      { frase: 'Remember to lock the door.', clave: 'FORGET', antes: 'Do not', despues: 'the door.', aceptadas: ['forget to lock'] },
      { frase: 'The last time it rained was three weeks ago.', clave: 'RAINED', antes: 'It', despues: 'for three weeks.', aceptadas: ["hasn't rained", 'has not rained'] }
    ]
  },

  'b2t2-use4b': {
    tipo: 'transformacion', parte: 4, titulo: 'Use of English · Part 4 (extra)',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'The meeting was so long that half of them left.', clave: 'SUCH', antes: 'It', despues: 'that half of them left.', aceptadas: ['was such a long meeting'] },
      { frase: 'You were wrong not to tell her.', clave: 'SHOULD', antes: 'You', despues: 'her.', aceptadas: ['should have told'] },
      { frase: 'Someone is going to repaint the office next month.', clave: 'REPAINTED', antes: 'The office', despues: 'next month.', aceptadas: ['is going to be repainted'] },
      { frase: 'He is not tall enough to reach the top shelf.', clave: 'TOO', antes: 'He', despues: 'to reach the top shelf.', aceptadas: ['is too short'] },
      { frase: 'I could not go because I had no money.', clave: 'BEEN', antes: 'If I', despues: 'so short of money, I could have gone.', aceptadas: ["hadn't been", 'had not been'] },
      { frase: '"Do not tell anyone," she said to me.', clave: 'WARNED', antes: 'She', despues: 'anyone.', aceptadas: ['warned me not to tell'] }
    ]
  },

  'b2t2-read5': {
    tipo: 'lectura', parte: 5, titulo: 'Reading · Part 5',
    instruccion: 'Read the text and choose the best answer (A, B, C or D) for each question.',
    tituloTexto: 'The man who works while the town sleeps',
    texto: [
      'The bakery on Kale Nagusia opens to customers at seven. Josu Etxebarria has been there since half past eleven the night before, and by the time the first person pushes the door he has done what most people would call a full day. He does not describe it that way. "It is one shift," he says. "It just happens to be at the wrong end of the clock."',
      'He is fifty-four and has done this for thirty-one years, which he mentions only when asked and then immediately qualifies. His father did it for forty-two and his grandfather before that, and Josu is careful to say that neither of them chose it either. The bakery came with the family the way a surname does, and the question of whether he wanted it was never put to him in a form he could have answered.',
      'This does not make him unhappy, and he becomes visibly irritated when visitors assume that it should. The irritation is not about the work but about the assumption behind the question. "People want to hear that I am trapped," he says, "because then the story is about escape, and everybody likes that story. But I am good at this, the town eats it, and my knees have lasted. Where exactly am I supposed to be escaping to?"',
      'What has changed, he says, is not the baking but the hours around it. Thirty years ago the town had four night workers he saw regularly: himself, a nurse, a man at the paper mill and a taxi driver. The mill closed, the taxi driver retired and the hospital moved to Galdakao. He now sees nobody at all between midnight and five, except occasionally somebody walking home. He raises this without any trace of self-pity, as a fact about the town rather than about himself.',
      'His daughter works in Bilbao and will not be taking the bakery. He says this cheerfully and then adds something he has clearly thought about: that he would rather it closed than be run badly by somebody who felt they had to. He has had two offers to sell and turned down both, not because the price was wrong but because neither buyer asked him a single question about the flour.',
      'Towards five the ovens come up and the smell reaches the street, which is the part he will admit to enjoying. "That is the only bit that is not work," he says, and then corrects himself, because he does not like the sound of it: it is also, he points out, the moment at which he can tell whether the night has gone right, and if it has not there is still an hour to put it right.'
    ],
    items: [
      { pregunta: '1  What does Josu suggest by calling his night "one shift"?',
        opciones: ['He works fewer hours than people assume.',
                   'He does not think his hours deserve special attention.',
                   'He would rather be working in the daytime.',
                   'The work is easier than it appears from outside.'], correcta: 1 },
      { pregunta: '2  Why does he mention his father and grandfather?',
        opciones: ['To show how carefully the skill was passed down.',
                   'To explain why he feels responsible for the business.',
                   'To make clear that the choice was never really offered to any of them.',
                   'To suggest that the trade is disappearing.'], correcta: 2 },
      { pregunta: '3  What irritates him about the way visitors react?',
        opciones: ['They expect him to want a different life.',
                   'They doubt that he is good at the job.',
                   'They ask him about his health.',
                   'They assume the town does not value him.'], correcta: 0 },
      { pregunta: '4  What point is he making in the fourth paragraph?',
        opciones: ['Working at night has become more dangerous.',
                   'He misses the company he used to have at night.',
                   'What has changed is the town rather than the work.',
                   'Fewer people now buy what he produces.'], correcta: 2 },
      { pregunta: '5  Why did he turn down the two offers to buy the bakery?',
        opciones: ['The money he was offered was too little.',
                   'Neither buyer showed any interest in the bread itself.',
                   'He had promised the business to his daughter.',
                   'He is not ready to stop working yet.'], correcta: 1 },
      { pregunta: '6  Why does he correct himself at the end?',
        opciones: ['He realises the smell is not really the best part.',
                   'He is embarrassed to be enjoying his work.',
                   'He remembers how much is still left to do.',
                   'He does not want a practical moment to sound sentimental.'], correcta: 3 }
    ]
  },

  'b2t2-read6': {
    tipo: 'lectura', parte: 6, titulo: 'Reading · Part 6',
    instruccion: 'Six sentences have been removed from the text. Choose from the sentences A–G the one which fits each gap. There is one extra sentence which you do not need to use.',
    tituloTexto: 'The school that stopped setting homework',
    texto: [
      'When the head teacher of a secondary school in Denbighshire announced in 2018 that homework would stop for pupils under fourteen, she expected a fight with parents and she got one. {1} What she had not expected was that the loudest objections of all would come from the pupils.',
      'Her reasoning had been practical rather than ideological. The school had measured how long the work actually took and found a range of ten minutes to three hours for exactly the same task. {2} The homework was not measuring effort or ability; it was measuring the kitchen table.',
      'Two years of results are now available and they are far less dramatic than either side predicted. Attainment at fourteen is very slightly up, well within the range you would expect from noise. {3} The gap between the pupils on free school meals and the rest, however, has narrowed by an amount the school describes carefully as "probably real".',
      'The pupils’ objection turned out to be about fairness of a completely different kind. {4} Several of them told the school they had been using homework as evidence at home that they were working, and that without it the arguments about screen time had got worse rather than better.',
      'Other schools ring up, and the head is careful with them. She points out that her school is small, that the staff had two terms to prepare, and that she had a governing body willing to be shouted at for a year. {5} She has stopped using the word "abolished" in these conversations, because it is the word that starts the argument she cannot win.',
      'Whether any of it lasts is another matter. {6} The head has three years left before she retires and says, without much apparent worry, that she expects the policy to be reversed within five years of her leaving, and that the measuring will have been worth doing anyway.'
    ],
    secciones: [
      { letra: 'A', texto: ['On its own, that figure would prove nothing at all.'] },
      { letra: 'B', texto: ['Two of the four schools that copied the policy have already quietly reinstated it.'] },
      { letra: 'C', texto: ['Forty-one families wrote to the governors within a fortnight, and eleven of them threatened to move their children.'] },
      { letra: 'D', texto: ['Without all three of those things, she says, she would never have attempted it.'] },
      { letra: 'E', texto: ['The county council has since asked all its secondary schools to publish how much homework they set.'] },
      { letra: 'F', texto: ['They had not been defending the work; they had been defending what the work protected them from.'] },
      { letra: 'G', texto: ['The difference matched almost exactly whether a child had a quiet room and an adult at home who could help.'] }
    ],
    opcionesCortas: true,
    items: [
      { pregunta: '1', opciones: ['A','B','C','D','E','F','G'], correcta: 2 },
      { pregunta: '2', opciones: ['A','B','C','D','E','F','G'], correcta: 6 },
      { pregunta: '3', opciones: ['A','B','C','D','E','F','G'], correcta: 0 },
      { pregunta: '4', opciones: ['A','B','C','D','E','F','G'], correcta: 5 },
      { pregunta: '5', opciones: ['A','B','C','D','E','F','G'], correcta: 3 },
      { pregunta: '6', opciones: ['A','B','C','D','E','F','G'], correcta: 1 }
    ]
  },

  'b2t2-read7': {
    tipo: 'lectura', parte: 7, titulo: 'Reading · Part 7',
    instruccion: 'You are going to read an article in which four people describe taking up a musical instrument as adults. For each question, choose from the people A–D. The people may be chosen more than once.',
    opcionesCortas: true,
    secciones: [
      { letra: 'A', titulo: 'Idoia, piano at thirty-eight',
        texto: ['I had lessons as a child, gave up at twelve, and then spent twenty-six years telling people I used to play. Starting again at thirty-eight was in some ways worse than starting from nothing, because my hands remembered things my ears had outgrown and I kept playing the same four pieces badly. What finally fixed it was a teacher who made me learn something I actively disliked. I practise about twenty minutes a day, I am never going to be good, and I stopped minding about that at roughly the two-year mark.'] },
      { letra: 'B', titulo: 'Rubén, drums at forty-five',
        texto: ['My wife bought me a practice pad for my forty-fifth birthday, which was either very kind or a hint, and I have never asked which. The thing nobody tells you is how physical it is. I thought I was fit, and after ten minutes my forearms were finished. I play in a garage on Sundays with three men I did not know two years ago, and honestly the band is most of the point. If it broke up I am not at all sure I would carry on.'] },
      { letra: 'C', titulo: 'Hannah, violin at fifty-two',
        texto: ['Everybody warned me about the violin and everybody was right: for eight months it was genuinely unpleasant to listen to, and that included me. I was doing it in a flat with neighbours on both sides, which meant a mute and a great deal of apologising. What I had not expected was how much it changed my listening. I go to concerts now and hear the second violins, which sounds like a small thing and is not. I am fifty-six, I have played in public exactly once, badly, and I would do it again tomorrow.'] },
      { letra: 'D', titulo: 'Jokin, guitar at twenty-nine',
        texto: ['I learned from the internet, which everybody tells you is impossible and which is perfectly possible if you accept that it will take twice as long. It took about three years to get to the point where I could play at a party. The part I got wrong was rhythm: I spent two years on chords and none at all on timing, and then had to go back and repair it, which was humiliating and necessary. If I were starting again I would pay for six lessons at the beginning and then carry on by myself.'] }
    ],
    items: [
      { pregunta: '1  Who says the people they play with are most of the reason they continue?',
        opciones: ['A','B','C','D'], correcta: 1 },
      { pregunta: '2  Who found that earlier experience made starting harder?',
        opciones: ['A','B','C','D'], correcta: 0 },
      { pregunta: '3  Who mentions physical demands they had not expected?',
        opciones: ['A','B','C','D'], correcta: 1 },
      { pregunta: '4  Who says learning has changed the way they listen to music?',
        opciones: ['A','B','C','D'], correcta: 2 },
      { pregunta: '5  Who had to go back and repair a gap in their learning?',
        opciones: ['A','B','C','D'], correcta: 3 },
      { pregunta: '6  Who mentions being considerate towards the people living nearby?',
        opciones: ['A','B','C','D'], correcta: 2 },
      { pregunta: '7  Who has accepted that they will never be very good?',
        opciones: ['A','B','C','D'], correcta: 0 },
      { pregunta: '8  Who recommends mixing lessons with teaching yourself?',
        opciones: ['A','B','C','D'], correcta: 3 },
      { pregunta: '9  Who admits that the early stage was unpleasant for them as well?',
        opciones: ['A','B','C','D'], correcta: 2 },
      { pregunta: '10  Who says a teacher pushed them out of a comfortable habit?',
        opciones: ['A','B','C','D'], correcta: 0 }
    ]
  },

  'b2t2-lis1': {
    tipo: 'listening', parte: 1, titulo: 'Listening · Part 1',
    instruccion: 'You will hear people talking in eight different situations. Choose the answer (A, B or C) which fits best according to what you hear. <b>You will hear the recording twice.</b>',
    audio: 'audio/b2t2-lis1-espeak.mp3', escuchas: 2, demo: true,
    contexto: 'Eight short extracts, one question each.',
    items: [
      { pregunta: '1  What is the woman’s main complaint about the holiday?',
        opciones: ['The hotel was worse than the photographs suggested.', 'The beach was further away than advertised.', 'The photographs had been taken to hide something.'], correcta: 2 },
      { pregunta: '2  What do the two friends agree about the restaurant?',
        opciones: ['The wait was worth it in the end.', 'They will not be going back.', 'The food was far too expensive.'], correcta: 0 },
      { pregunta: '3  Why is the man leaving the message?',
        opciones: ['To cancel the delivery altogether.', 'To say where the parcel should be left.', 'To complain about an earlier delivery.'], correcta: 1 },
      { pregunta: '4  What does the woman say about the club’s rule?',
        opciones: ['She introduced it herself.', 'She now thinks it is why members stay.', 'It applies only while they are running.'], correcta: 1 },
      { pregunta: '5  What does the woman advise her colleague to do?',
        opciones: ['Ask for more time straight away.', 'Hand it in on Friday as planned.', 'Get somebody else to help him.'], correcta: 0 },
      { pregunta: '6  What had nobody warned the man about?',
        opciones: ['How early the shops shut.', 'How poor the buses would be.', 'How hard he would find the silence.'], correcta: 2 },
      { pregunta: '7  What is the woman’s point about the recipe card?',
        opciones: ['Her grandmother kept the method to herself.', 'The amounts were never measured in the first place.', 'The handwriting cannot be read.'], correcta: 1 },
      { pregunta: '8  What does the man think about the podcast?',
        opciones: ['The ending makes up for the rest.', 'It should have been far shorter.', 'He will finish it another day.'], correcta: 1 }
    ]
  },

  'b2t2-lis2': {
    tipo: 'listening', parte: 2, titulo: 'Listening · Part 2',
    instruccion: 'Complete the sentences with <b>a word or short phrase</b> from what you hear. <b>You will hear the recording twice.</b>',
    audio: 'audio/b2t2-lis2-espeak.mp3', escuchas: 2, demo: true,
    contexto: 'Sile Donovan talks about the small ferry she runs to an island.',
    items: [
      { antes: 'Before this job Sile spent fourteen years working as a', despues: '.', aceptadas: ['fisheries officer', 'fisheries'] },
      { antes: 'The boat she uses was built in', despues: '.', aceptadas: ['Denmark'] },
      { antes: 'For its first fifteen years the boat was used on a', despues: '.', aceptadas: ['lake'] },
      { antes: 'When the tide is right, the crossing takes', despues: '.', aceptadas: ['twenty-five minutes', '25 minutes', 'twenty five minutes'] },
      { antes: 'The busiest day of the week is', despues: '.', aceptadas: ['Thursday'] },
      { antes: 'Apart from passengers, what she carries most of is the', despues: '.', aceptadas: ['post', 'mail'] },
      { antes: 'Sile cancels the sailing when the wind reaches', despues: '.', aceptadas: ['force seven', 'seven', 'force 7'] },
      { antes: 'She says the hardest part of the job is the', despues: '.', aceptadas: ['timetable'] },
      { antes: 'In winter the population of the island is', despues: '.', aceptadas: ['ninety', '90'] },
      { antes: 'Her biggest worry at the moment is the cost of a new', despues: '.', aceptadas: ['engine'] }
    ]
  },

  'b2t2-lis3': {
    tipo: 'listening', parte: 3, titulo: 'Listening · Part 3',
    instruccion: 'You will hear five short extracts in which people talk about moving to a different town. Choose from the list A–H what each speaker says. Use each letter once. There are three extra letters. <b>You will hear the recording twice.</b>',
    audio: 'audio/b2t2-lis3-espeak.mp3', escuchas: 2, demo: true,
    opcionesCortas: true,
    listas: [
      { titulo: 'What does each speaker say about the move?', opciones: [
        'I found it hard to make friends at first.',
        'Living there cost less than I had expected.',
        'I moved for somebody else rather than for myself.',
        'I regretted it within the first year.',
        'The job was not what the advertisement described.',
        'I did not expect to miss the weather I grew up with.',
        'Joining something local changed everything.',
        'I still have not properly unpacked.'
      ] }
    ],
    items: [
      { pregunta: '1  Speaker 1', opciones: ['A','B','C','D','E','F','G','H'], correcta: 2 },
      { pregunta: '2  Speaker 2', opciones: ['A','B','C','D','E','F','G','H'], correcta: 4 },
      { pregunta: '3  Speaker 3', opciones: ['A','B','C','D','E','F','G','H'], correcta: 6 },
      { pregunta: '4  Speaker 4', opciones: ['A','B','C','D','E','F','G','H'], correcta: 5 },
      { pregunta: '5  Speaker 5', opciones: ['A','B','C','D','E','F','G','H'], correcta: 1 }
    ]
  },

  'b2t2-lis4': {
    tipo: 'listening', parte: 4, titulo: 'Listening · Part 4',
    instruccion: 'You will hear an interview. Choose the answer (A, B, C or D) which fits best according to what you hear. <b>You will hear the recording twice.</b>',
    audio: 'audio/b2t2-lis4-espeak.mp3', escuchas: 2, demo: true,
    contexto: 'A journalist interviews Marta Zabaleta, who designs playgrounds.',
    items: [
      { pregunta: '1  How did Marta come to design playgrounds?',
        opciones: ['She had wanted to do it since she was young.', 'It grew out of one small part of another job.', 'A colleague put her name forward for it.', 'She could not find any work in housing.'], correcta: 1 },
      { pregunta: '2  What is her view of the safety regulations?',
        opciones: ['They were taken further than was useful.', 'They should never have been brought in.', 'They are not enforced strictly enough.', 'They have made playgrounds too costly.'], correcta: 0 },
      { pregunta: '3  What did she discover by watching children?',
        opciones: ['They prefer older equipment.', 'They spend most of their time between the structures.', 'They play in larger groups than expected.', 'They avoid anything that frightens them.'], correcta: 1 },
      { pregunta: '4  What is her main criticism of new playgrounds?',
        opciones: ['They copy one another too closely.', 'They are built from the wrong materials.', 'They are designed to satisfy the people paying for them.', 'They are too small for the number of children.'], correcta: 2 },
      { pregunta: '5  What does she say about asking children for their opinion?',
        opciones: ['They should be asked what to build.', 'Their answers are rarely of any use.', 'They simply repeat what adults tell them.', 'They are better at finding faults than at designing.'], correcta: 3 },
      { pregunta: '6  What has changed the way she designs in recent years?',
        opciones: ['New safety standards.', 'Better materials.', 'The lack of money for upkeep.', 'Pressure from parents.'], correcta: 2 },
      { pregunta: '7  What is her conclusion about what makes a good playground?',
        opciones: ['A nearby one beats a better one further away.', 'Councils should build fewer and better ones.', 'Quality matters more than people admit.', 'Most of them are not worth building at all.'], correcta: 0 }
    ]
  },

  'b2t2-speak1': {
    tipo: 'speaking', parte: 2, titulo: 'Long turn: dos maneras de ir al trabajo',
    instruccion: 'Habla durante <b>un minuto seguido</b>. Compara las dos situaciones: no las describas una detrás de otra.',
    segundos: 60,
    pregunta: 'Compare these two situations and say how the people might be feeling.',
    puntos: ['a crowded train at eight in the morning', 'cycling to work in the rain'],
    nota: 'En el examen esto se hace con dos fotografías y hay una segunda pregunta corta al final. Aquí van descritas mientras la academia no aporte las suyas.',
    items: [ { grabacion: true } ]
  },

  'b2t2-speak3': {
    tipo: 'speaking', parte: 3, titulo: 'Parte 3: decidir en voz alta',
    instruccion: 'Habla durante <b>dos minutos</b>. Comenta las cinco ideas y termina eligiendo una.',
    segundos: 120,
    pregunta: 'A town wants more people to use its library. How useful would each of these be, and which one would work best?',
    puntos: ['opening on Sunday mornings', 'lending tools and games as well as books', 'a café inside the building', 'free classes for older people', 'delivering books to people who cannot get there'],
    nota: 'En el examen esto se habla con otro candidato: se negocia y se llega a un acuerdo. Grabándote solo se practica todo menos eso, que es un criterio entero.',
    items: [ { grabacion: true } ]
  },

  'b2t2-speak4': {
    tipo: 'speaking', parte: 4, titulo: 'Parte 4: opinar y justificar',
    instruccion: 'Contesta a las tres preguntas seguidas, <b>dos minutos</b> en total.',
    segundos: 120,
    pregunta: 'Questions about towns and the people who live in them.',
    puntos: [
      'Is it better to grow up in a small town or in a city? Why?',
      'Some people say young people leave small towns and never come back. Is that a problem?',
      'Should councils spend money on libraries and parks, or on other things first?'
    ],
    nota: 'En el examen el examinador pregunta y luego te pide que reacciones a lo que ha dicho la otra persona. Aquí solo está la primera mitad.',
    items: [ { grabacion: true } ]
  },

  'b2t2-write1': {
    tipo: 'writing', parte: 1, titulo: 'Essay',
    instruccion: 'Escribe entre <b>140 y 190 palabras</b>. Es obligatorio: en el examen esta tarea no se elige.',
    minutos: 40, palabras: [140, 190],
    enunciado: 'In your English class you have been talking about tourism. Now your teacher has asked you to write an essay. Do you agree that visitors should pay more to enter the most popular places in a city?',
    contexto: 'Notes. Write about: 1 · crowds · 2 · the people who live there · 3 ... (your own idea).',
    cierre: 'Write in a fairly formal style. Use both of the given notes and add one idea of your own.',
    items: [ { escrito: true } ]
  },

  'b2t2-write2': {
    tipo: 'writing', parte: 2, titulo: 'A elegir: correo, informe o artículo',
    instruccion: 'Elige <b>una</b> de las tres y escribe entre <b>140 y 190 palabras</b>.',
    minutos: 40, palabras: [140, 190],
    enunciado: 'Choose one of the following three tasks.',
    contexto: '1 · You bought something online that arrived damaged and the shop has not replied to two messages. Write a formal email explaining what happened and saying what you want them to do.\n2 · Your school or workplace is deciding what to do with a small unused room. Write a report describing the room, giving two possible uses and recommending one.\n3 · An English-language magazine has asked readers for articles under the title "A place in my town that visitors never find". Write your article.',
    cierre: 'El correo formal necesita fechas, hechos y una petición concreta. El informe lleva encabezados y termina recomendando. El artículo tiene que enganchar en la primera línea: empieza por algo concreto, no por una definición.',
    items: [ { escrito: true } ]
  },

  /* ---------------------- TEST 3 de B2 First ---------------------- */

  'b2t3-gram1': {
    tipo: 'transformacion', titulo: 'Presentes',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'Iker is on holiday until the fourteenth.', clave: 'BACK', antes: 'Iker', despues: 'until the fourteenth.', aceptadas: ["won't be back", 'will not be back'] },
      { frase: 'It is ages since we last spoke.', clave: 'SPOKEN', antes: 'We', despues: 'for ages.', aceptadas: ["haven't spoken", 'have not spoken'] },
      { frase: 'They are building a new roundabout at the moment.', clave: 'BUILT', antes: 'A new roundabout', despues: 'at the moment.', aceptadas: ['is being built'] },
      { frase: 'She began teaching here in 2016.', clave: 'TEACHING', antes: 'She', despues: 'here since 2016.', aceptadas: ['has been teaching'] },
      { frase: 'My flatmate leaves the kitchen in a mess every single day.', clave: 'FOREVER', antes: 'My flatmate', despues: 'the kitchen in a mess.', aceptadas: ['is forever leaving'] },
      { frase: 'I do not know that song.', clave: 'HEARD', antes: 'I', despues: 'that song before.', aceptadas: ["haven't heard", 'have not heard', 'have never heard'] }
    ]
  },

  'b2t3-gram2': {
    tipo: 'transformacion', titulo: 'Pasados',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'We had dinner and then the film started.', clave: 'BEFORE', antes: 'We had dinner', despues: 'started.', aceptadas: ['before the film'] },
      { frase: 'She was in the shower when the phone rang.', clave: 'HAVING', antes: 'She', despues: 'when the phone rang.', aceptadas: ['was having a shower'] },
      { frase: 'The room was empty because everybody had gone home.', clave: 'LEFT', antes: 'The room was empty because everybody', despues: '.', aceptadas: ['had left'] },
      { frase: 'They did not invite me to the wedding.', clave: 'INVITED', antes: 'I', despues: 'to the wedding.', aceptadas: ["wasn't invited", 'was not invited'] },
      { frase: 'It was the first time she had eaten oysters.', clave: 'NEVER', antes: 'She', despues: 'oysters before.', aceptadas: ['had never eaten'] },
      { frase: 'I last visited my cousins in 2018.', clave: 'SINCE', antes: 'I have not visited my cousins', despues: '.', aceptadas: ['since 2018'] }
    ]
  },

  'b2t3-gram3': {
    tipo: 'transformacion', titulo: 'Futuro',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'The match starts at a quarter to nine.', clave: 'KICKS', antes: 'The match', despues: 'at a quarter to nine.', aceptadas: ['kicks off'] },
      { frase: 'They have decided to sell the house.', clave: 'SELLING', antes: 'They', despues: 'the house.', aceptadas: ['are selling'] },
      { frase: 'The work will be over before the end of May.', clave: 'HAVE', antes: 'By the end of May they', despues: 'the work.', aceptadas: ['will have finished'] },
      { frase: 'I am certain she will say yes.', clave: 'CERTAIN', antes: 'She', despues: 'yes.', aceptadas: ['is certain to say'] },
      { frase: 'That bag looks heavy. I will carry it for you.', clave: 'GIVE', antes: 'That bag looks heavy.', despues: 'a hand.', aceptadas: ["I'll give you", 'I will give you'] },
      { frase: 'Do not ring before eleven.', clave: 'AFTER', antes: 'Ring me', despues: 'only.', aceptadas: ['after eleven'] }
    ]
  },

  'b2t3-gram4': {
    tipo: 'transformacion', titulo: 'Repaso de tiempos',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'It is five years since he moved to Girona.', clave: 'LIVING', antes: 'He', despues: 'in Girona for five years.', aceptadas: ['has been living'] },
      { frase: 'The shop closed down two months ago.', clave: 'BEEN', antes: 'The shop', despues: 'for two months.', aceptadas: ['has been closed'] },
      { frase: 'This is my second time in Portugal.', clave: 'TIME', antes: 'It is the second', despues: 'to Portugal.', aceptadas: ['time I have been'] },
      { frase: 'The concert had not started when we got there.', clave: 'BEGUN', antes: 'When we got there the concert', despues: '.', aceptadas: ['had not begun', "hadn't begun"] },
      { frase: 'When did you get that jacket?', clave: 'HAVE', antes: 'How long', despues: 'that jacket?', aceptadas: ['have you had'] },
      { frase: 'They are going to open the new line in September.', clave: 'OPENED', antes: 'The new line', despues: 'in September.', aceptadas: ['will be opened', 'is going to be opened'] }
    ]
  },

  'b2t3-gram5': {
    tipo: 'transformacion', titulo: 'Costumbres del pasado',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'We walked to school every morning when we were small.', clave: 'USED', antes: 'We', despues: 'to school every morning when we were small.', aceptadas: ['used to walk'] },
      { frase: 'My father sometimes sang to us in the car.', clave: 'WOULD', antes: 'My father', despues: 'to us in the car.', aceptadas: ['would sometimes sing'] },
      { frase: 'There is no market here now, although there was one before.', clave: 'BE', antes: 'There', despues: 'a market here.', aceptadas: ['used to be'] },
      { frase: 'He was not interested in politics when he was younger.', clave: 'USE', antes: 'He', despues: 'interested in politics when he was younger.', aceptadas: ["didn't use to be", 'did not use to be'] },
      { frase: 'I never ate vegetables as a child.', clave: 'NEVER', antes: 'I', despues: 'vegetables as a child.', aceptadas: ['never used to eat'] },
      { frase: 'She does not swim any more, but she did before.', clave: 'LONGER', antes: 'She', despues: 'swims.', aceptadas: ['no longer'] }
    ]
  },

  'b2t3-gram6': {
    tipo: 'transformacion', titulo: 'Acostumbrarse',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'The heat was very hard for me during the first summer.', clave: 'USED', antes: 'During the first summer I', despues: 'the heat.', aceptadas: ["wasn't used to", 'was not used to'] },
      { frase: 'She is finding the new keyboard easier every day.', clave: 'GETTING', antes: 'She', despues: 'the new keyboard.', aceptadas: ['is getting used to'] },
      { frase: 'Working at weekends does not bother him now.', clave: 'USED', antes: 'He', despues: 'working at weekends.', aceptadas: ['is used to'] },
      { frase: 'It took me months to accept the silence.', clave: 'GET', antes: 'It took me months', despues: 'the silence.', aceptadas: ['to get used to'] },
      { frase: 'After a year the early mornings felt normal to her.', clave: 'GOT', antes: 'After a year she', despues: 'the early mornings.', aceptadas: ['had got used to', 'got used to'] },
      { frase: 'Speaking English all day is normal for me now.', clave: 'USED', antes: 'I', despues: 'English all day.', aceptadas: ['am used to speaking', "'m used to speaking"] }
    ]
  },

  'b2t3-gram7': {
    tipo: 'transformacion', titulo: 'Poder y tener que',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'Photography is forbidden inside the church.', clave: 'ALLOWED', antes: 'You', despues: 'photographs inside the church.', aceptadas: ['are not allowed to take', "aren't allowed to take"] },
      { frase: 'In the end I got the door open.', clave: 'MANAGED', antes: 'In the end I', despues: 'the door.', aceptadas: ['managed to open'] },
      { frase: 'It is compulsory for all staff to sign in.', clave: 'MUST', antes: 'All staff', despues: 'in.', aceptadas: ['must sign'] },
      { frase: 'She was not able to reach him all morning.', clave: 'COULD', antes: 'She', despues: 'him all morning.', aceptadas: ["couldn't reach", 'could not reach'] },
      { frase: 'There was no need for you to wait.', clave: 'HAVE', antes: 'You', despues: 'wait.', aceptadas: ["didn't have to", 'did not have to'] },
      { frase: 'He is not able to drive because of his eyes.', clave: 'UNABLE', antes: 'He', despues: 'because of his eyes.', aceptadas: ['is unable to drive'] }
    ]
  },

  'b2t3-gram8': {
    tipo: 'transformacion', titulo: 'Consejo y deducción',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'It was wrong of you to leave without saying anything.', clave: 'HAVE', antes: 'You should not', despues: 'without saying anything.', aceptadas: ['have left'] },
      { frase: 'I am sure they took the wrong turning.', clave: 'MUST', antes: 'They', despues: 'the wrong turning.', aceptadas: ['must have taken'] },
      { frase: 'It is impossible that she wrote this.', clave: 'CANNOT', antes: 'She', despues: 'this.', aceptadas: ['cannot have written'] },
      { frase: 'Maybe he forgot the meeting.', clave: 'MAY', antes: 'He', despues: 'the meeting.', aceptadas: ['may have forgotten'] },
      { frase: 'In your place I would say nothing.', clave: 'WERE', antes: 'If I', despues: ', I would say nothing.', aceptadas: ['were you'] },
      { frase: 'My advice is to leave earlier next time.', clave: 'OUGHT', antes: 'You', despues: 'earlier next time.', aceptadas: ['ought to leave'] }
    ]
  },

  'b2t3-gram9': {
    tipo: 'transformacion', titulo: 'Voz pasiva',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'They are questioning two men at the station.', clave: 'BEING', antes: 'Two men', despues: 'at the station.', aceptadas: ['are being questioned'] },
      { frase: 'Somebody has moved my bike.', clave: 'BEEN', antes: 'My bike', despues: 'moved.', aceptadas: ['has been'] },
      { frase: 'People believe the painting is a copy.', clave: 'BELIEVED', antes: 'The painting', despues: 'a copy.', aceptadas: ['is believed to be'] },
      { frase: 'They are going to demolish the old station.', clave: 'DEMOLISHED', antes: 'The old station', despues: '.', aceptadas: ['is going to be demolished'] },
      { frase: 'The head teacher gave Nerea the prize.', clave: 'GIVEN', antes: 'Nerea', despues: 'the prize by the head teacher.', aceptadas: ['was given'] },
      { frase: 'Somebody has to sign this form.', clave: 'BE', antes: 'This form', despues: '.', aceptadas: ['has to be signed'] }
    ]
  },

  'b2t3-gram10': {
    tipo: 'transformacion', titulo: 'Que te lo hagan',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'A company cleans our windows twice a year.', clave: 'HAVE', antes: 'We', despues: 'twice a year.', aceptadas: ['have our windows cleaned'] },
      { frase: 'Somebody stole her passport in Rome.', clave: 'HAD', antes: 'She', despues: 'in Rome.', aceptadas: ['had her passport stolen'] },
      { frase: 'A photographer is going to take their picture on Friday.', clave: 'HAVING', antes: 'They are', despues: 'on Friday.', aceptadas: ['having their picture taken'] },
      { frase: 'I am going to ask somebody to fix the fence.', clave: 'GET', antes: 'I am going to', despues: '.', aceptadas: ['get the fence fixed'] },
      { frase: 'Somebody delivered the sofa yesterday.', clave: 'GOT', antes: 'They', despues: 'yesterday.', aceptadas: ['got the sofa delivered'] },
      { frase: 'We are going to ask a plumber to put in a new shower.', clave: 'HAVE', antes: 'We are going to', despues: 'put in.', aceptadas: ['have a new shower'] }
    ]
  },

  'b2t3-gram11': {
    tipo: 'transformacion', titulo: 'Condicionales',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'She was not there, so she did not see it.', clave: 'HAD', antes: 'If she', despues: 'there, she would have seen it.', aceptadas: ['had been'] },
      { frase: 'Book now or there will be nothing left.', clave: 'UNLESS', antes: 'There will be nothing left', despues: 'now.', aceptadas: ['unless you book'] },
      { frase: 'I cannot help you because I do not have the file.', clave: 'HAD', antes: 'If I', despues: ', I could help you.', aceptadas: ['had the file'] },
      { frase: 'He passed only because he worked all summer.', clave: 'NOT', antes: 'If he', despues: 'all summer, he would not have passed.', aceptadas: ['had not worked'] },
      { frase: 'Take an umbrella in case it rains.', clave: 'IF', antes: 'Take an umbrella', despues: '.', aceptadas: ['if it rains'] },
      { frase: 'You may use the car as long as you fill it up.', clave: 'PROVIDED', antes: 'You may use the car', despues: 'fill it up.', aceptadas: ['provided you'] }
    ]
  },

  'b2t3-gram12': {
    tipo: 'transformacion', titulo: 'Deseos y lamentos',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I am sorry I sold the flat.', clave: 'WISH', antes: 'I', despues: 'the flat.', aceptadas: ["wish I hadn't sold", 'wish I had not sold'] },
      { frase: 'It is a shame I do not live nearer the sea.', clave: 'LIVED', antes: 'I wish', despues: 'nearer the sea.', aceptadas: ['I lived'] },
      { frase: 'It is a pity they are not coming.', clave: 'ONLY', antes: 'If', despues: 'coming.', aceptadas: ['only they were'] },
      { frase: 'I regret not taking the other job.', clave: 'TAKEN', antes: 'I wish I', despues: 'the other job.', aceptadas: ['had taken'] },
      { frase: 'We really ought to leave now.', clave: 'WENT', antes: 'It is time', despues: '.', aceptadas: ['we went'] },
      { frase: 'I would prefer you not to smoke in here.', clave: 'RATHER', antes: 'I', despues: 'smoke in here.', aceptadas: ["would rather you didn't", 'would rather you did not'] }
    ]
  },

  'b2t3-gram13': {
    tipo: 'transformacion', titulo: 'Estilo indirecto',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: '"I am moving to Lisbon," he said.', clave: 'WAS', antes: 'He said', despues: 'to Lisbon.', aceptadas: ['he was moving'] },
      { frase: '"Please wait outside," the nurse said.', clave: 'TO', antes: 'The nurse asked us', despues: 'outside.', aceptadas: ['to wait'] },
      { frase: '"When did you get here?" she asked me.', clave: 'HAD', antes: 'She asked me when', despues: 'there.', aceptadas: ['I had got', 'I had arrived'] },
      { frase: '"You took my umbrella," she said to him.', clave: 'ACCUSED', antes: 'She', despues: 'her umbrella.', aceptadas: ['accused him of taking'] },
      { frase: '"I will pay you back on Friday," he said.', clave: 'PROMISED', antes: 'He', despues: 'back on Friday.', aceptadas: ['promised to pay me'] },
      { frase: '"Shall we get a taxi?" said Ane.', clave: 'SUGGESTED', antes: 'Ane', despues: 'a taxi.', aceptadas: ['suggested getting'] }
    ]
  },

  'b2t3-gram14': {
    tipo: 'transformacion', titulo: 'Comparar y relativas',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'This is the coldest winter I can remember.', clave: 'COLDER', antes: 'I cannot remember', despues: 'this one.', aceptadas: ['a colder winter than'] },
      { frase: 'The journey was shorter than I expected.', clave: 'LONGER', antes: 'I expected the journey', despues: 'it was.', aceptadas: ['to be longer than'] },
      { frase: 'That is the man. His dog bit the postman.', clave: 'WHOSE', antes: 'That is the man', despues: 'the postman.', aceptadas: ['whose dog bit'] },
      { frase: 'This is the café. We first met here.', clave: 'WHERE', antes: 'This is the café', despues: 'met.', aceptadas: ['where we first'] },
      { frase: 'My aunt teaches in Pamplona and she is retiring in June.', clave: 'WHO', antes: 'My aunt,', despues: 'in Pamplona, is retiring in June.', aceptadas: ['who teaches'] },
      { frase: 'No other player in the squad is as quick as Aitor.', clave: 'QUICKEST', antes: 'Aitor', despues: 'in the squad.', aceptadas: ['is the quickest player'] }
    ]
  },

  'b2t3-voc1': {
    tipo: 'caja', titulo: 'Preposiciones tras sustantivo · tercera vuelta',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['about', 'between', 'for', 'in', 'of', 'on', 'to', 'with'],
    items: [
      { antes: 'She has a great deal of experience', despues: 'this kind of work.', aceptadas: ['in', 'of'] },
      { antes: 'There has been a fall', despues: 'the price of tickets.', aceptadas: ['in'] },
      { antes: 'He made no reference', despues: 'the accident.', aceptadas: ['to'] },
      { antes: 'The connection', despues: 'the two events is not clear.', aceptadas: ['between'] },
      { antes: 'They have a very good reputation', despues: 'fish.', aceptadas: ['for'] },
      { antes: 'I had an argument', despues: 'my landlord about the deposit.', aceptadas: ['with'] }
    ]
  },

  'b2t3-voc2': {
    tipo: 'caja', titulo: 'Phrasal verbs · empezar y dejar',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['away', 'back', 'down', 'in', 'off', 'on', 'out', 'up'],
    items: [
      { antes: 'She took', despues: 'painting after she retired.', aceptadas: ['up'] },
      { antes: 'He gave', despues: 'smoking three years ago.', aceptadas: ['up'] },
      { antes: 'The engine cut', despues: 'halfway up the hill.', aceptadas: ['out'] },
      { antes: 'They set', despues: 'at six to avoid the traffic.', aceptadas: ['off'] },
      { antes: 'Please carry', despues: 'with what you were doing.', aceptadas: ['on'] },
      { antes: 'The car broke', despues: 'just outside Durango.', aceptadas: ['down'] }
    ]
  },

  'b2t3-voc3': {
    tipo: 'caja', titulo: 'Adjetivos y su preposición · tercera vuelta',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['about', 'at', 'for', 'from', 'in', 'of', 'to', 'with'],
    items: [
      { antes: 'He is terrible', despues: 'getting up early.', aceptadas: ['at'] },
      { antes: 'She was very disappointed', despues: 'her result.', aceptadas: ['with'] },
      { antes: 'This part of the coast is famous', despues: 'its storms.', aceptadas: ['for'] },
      { antes: 'She is very fond', despues: 'her grandchildren.', aceptadas: ['of'] },
      { antes: 'The town is similar', despues: 'the one where I grew up.', aceptadas: ['to'] },
      { antes: 'They were fed up', despues: 'waiting.', aceptadas: ['with'] }
    ]
  },

  'b2t3-voc4': {
    tipo: 'caja', titulo: 'Verbos con preposición fija · tercera vuelta',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['about', 'for', 'from', 'in', 'of', 'on', 'to', 'with'],
    items: [
      { antes: 'The result depends entirely', despues: 'the weather on Sunday.', aceptadas: ['on'] },
      { antes: 'Nobody warned us', despues: 'the roadworks.', aceptadas: ['about'] },
      { antes: 'She reminds me', despues: 'my sister.', aceptadas: ['of'] },
      { antes: 'They were arguing', despues: 'money again.', aceptadas: ['about'] },
      { antes: 'He apologised', despues: 'the mistake.', aceptadas: ['for'] },
      { antes: 'This box is made', despues: 'recycled paper.', aceptadas: ['from', 'of'] }
    ]
  },

  'b2t3-voc5': {
    tipo: 'caja', titulo: 'Phrasal verbs · información y problemas',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['across', 'down', 'into', 'off', 'out', 'over', 'through', 'up'],
    items: [
      { antes: 'Can you look the word', despues: 'in the dictionary?', aceptadas: ['up'] },
      { antes: 'We came', despues: 'these photos while we were tidying.', aceptadas: ['across'] },
      { antes: 'It took the police a week to find', despues: 'who had done it.', aceptadas: ['out'] },
      { antes: 'Let us go', despues: 'the figures once more.', aceptadas: ['over', 'through'] },
      { antes: 'The talks broke', despues: 'after three days.', aceptadas: ['down'] },
      { antes: 'I ran', despues: 'an old teacher of mine at the station.', aceptadas: ['into'] }
    ]
  },

  'b2t3-voc6': {
    tipo: 'caja', titulo: 'Colocaciones · verbo y sustantivo · tercera vuelta',
    instruccion: 'Complete each sentence with a verb from the box. There are more verbs than you need.',
    caja: ['draw', 'give', 'hold', 'make', 'pay', 'reach', 'run', 'take'],
    items: [
      { antes: 'The committee will', despues: 'a decision on Thursday.', aceptadas: ['reach'] },
      { antes: 'She refused to', despues: 'up hope.', aceptadas: ['give'] },
      { antes: 'Nobody wanted to', despues: 'the blame.', aceptadas: ['take'] },
      { antes: 'Try to', despues: 'a good impression on Monday.', aceptadas: ['make'] },
      { antes: 'We had to', despues: 'the risk.', aceptadas: ['run', 'take'] },
      { antes: 'Please', despues: 'the line for a moment.', aceptadas: ['hold'] }
    ]
  },

  'b2t3-voc7': {
    tipo: 'caja', titulo: 'Expresiones cotidianas · tercera vuelta',
    instruccion: 'Complete each expression with a word from the box. There are more words than you need.',
    caja: ['difference', 'fault', 'hurry', 'point', 'purpose', 'sense', 'trouble', 'worth'],
    items: [
      { antes: 'He did it on', despues: ', I am sure of it.', aceptadas: ['purpose'] },
      { antes: 'It was not my', despues: 'that the train was late.', aceptadas: ['fault'] },
      { antes: 'There is no', despues: 'in complaining now.', aceptadas: ['point'] },
      { antes: 'Is it', despues: 'going all that way for one day?', aceptadas: ['worth'] },
      { antes: 'They left in a', despues: 'and forgot the tickets.', aceptadas: ['hurry'] },
      { antes: 'It makes no', despues: 'to me either way.', aceptadas: ['difference'] }
    ]
  },

  'b2t3-voc8': {
    tipo: 'cloze', titulo: 'Open cloze · los grupos de mensajes',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Every family now has a group chat, and almost nobody remembers agreeing {1} it. Somebody set it up for a birthday in 2019 and it never closed, and it has since become the place where three generations discover, at eleven at night, that they disagree about politics.',
      'The trouble is that it collapses several kinds of conversation {2} one. A message you would once have sent to your sister now goes to your sister, your uncle and a cousin you last saw at a funeral. Nobody is quite sure {3} they are talking to, so everybody performs slightly, and the ones who say least are often the ones reading {4} of all.',
      'The people who leave these groups are treated as though they have done something rude, {5} in fact they have only done what everybody privately considers. It is much easier to stay, say nothing for weeks, and send a photograph of a cake {6} in a while.'
    ],
    items: [
      { aceptadas: ['to'] }, { aceptadas: ['into'] }, { aceptadas: ['who', 'whom'] },
      { aceptadas: ['most'] }, { aceptadas: ['when', 'while', 'whereas', 'although'] },
      { aceptadas: ['once', 'every'] }
    ]
  },

  'b2t3-voc9': {
    tipo: 'cloze', titulo: 'Open cloze · trabajar de camarero',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Almost everybody should wait tables for six months, and almost nobody who has done it would say so out {1} without sounding smug. But it teaches two things that are difficult to learn any other way.',
      'The first is that being polite is a skill and {2} a personality. On a Friday night, at table nine, with the kitchen forty minutes behind, you are pleasant because it is your job, and the discovery that you can do this while feeling nothing at {3} is more useful than it sounds. The second is how many people are rude to somebody carrying plates and would never be rude to the same person in an office.',
      'It also ruins eating out for a while. You notice the trainee, you notice the table that has been waiting too long, and you cannot stop yourself stacking your own plates, {4} every waiter will tell you does not actually help. That passes. What does {5} pass is the reflex of looking somebody in the eye when they put food in {6} of you.'
    ],
    items: [
      { aceptadas: ['loud'] }, { aceptadas: ['not'] }, { aceptadas: ['all'] },
      { aceptadas: ['which'] }, { aceptadas: ['not'] }, { aceptadas: ['front'] }
    ]
  },

  'b2t3-voc10': {
    tipo: 'cloze', titulo: 'Open cloze · las fotos del móvil',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'There are more photographs of last Tuesday than there are of the whole of the nineteenth century, and almost none of them will ever be looked {1} again. This is not a tragedy. It is simply what happens when something stops being expensive.',
      'What has been lost is the edit. A roll of film held twenty-four pictures and cost money to develop, {2} meant somebody chose. Choosing is what turned a pile of images into a record. Now there is no pile and no record: there is a search box, and it works perfectly {3} long as you can remember roughly when something happened, which is exactly the thing people cannot do.',
      'The odd result is that families with fewer photographs often know their own history better {4} families with thousands. Forty pictures in a shoebox get shown at Christmas and explained by somebody who was there. Forty thousand on a phone get shown to {5} at all, and when the person who took them is gone, {6} is left is a folder nobody can date.'
    ],
    items: [
      { aceptadas: ['at'] }, { aceptadas: ['which'] }, { aceptadas: ['as'] },
      { aceptadas: ['than'] }, { aceptadas: ['nobody', 'no-one', 'noone'] }, { aceptadas: ['what'] }
    ]
  },

  'b2t3-voc11': {
    tipo: 'formacion', titulo: 'Word formation · nombres abstractos',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'His', despues: 'of the situation was completely wrong.', raiz: 'JUDGE', aceptadas: ['judgement', 'judgment'] },
      { antes: 'There is very little', despues: 'that it will happen again.', raiz: 'LIKELY', aceptadas: ['likelihood'] },
      { antes: 'The', despues: 'of the machine takes about an hour.', raiz: 'INSTALL', aceptadas: ['installation'] },
      { antes: 'She showed remarkable', despues: 'for a girl of nine.', raiz: 'MATURE', aceptadas: ['maturity'] },
      { antes: 'The', despues: 'of the two systems has not gone smoothly.', raiz: 'COMBINE', aceptadas: ['combination'] },
      { antes: 'We were struck by the', despues: 'of the welcome.', raiz: 'GENEROUS', aceptadas: ['generosity'] }
    ]
  },

  'b2t3-voc12': {
    tipo: 'formacion', titulo: 'Word formation · adjetivos',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The results were rather', despues: 'at first.', raiz: 'SURPRISE', aceptadas: ['surprising'] },
      { antes: 'It is a very', despues: 'walk from here.', raiz: 'PLEASE', aceptadas: ['pleasant'] },
      { antes: 'The old bridge is no longer', despues: '.', raiz: 'USE', aceptadas: ['usable', 'useful'] },
      { antes: 'She was extremely', despues: 'about the whole thing.', raiz: 'REASON', aceptadas: ['reasonable'] },
      { antes: 'That was a truly', despues: 'performance.', raiz: 'MEMORY', aceptadas: ['memorable'] },
      { antes: 'The town is not very', despues: 'in winter.', raiz: 'LIFE', aceptadas: ['lively'] }
    ]
  },

  'b2t3-voc13': {
    tipo: 'formacion', titulo: 'Word formation · adjetivos en negativo',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The instructions were completely', despues: '.', raiz: 'CLEAR', aceptadas: ['unclear'] },
      { antes: 'His answer was entirely', despues: 'to the question.', raiz: 'RELEVANT', aceptadas: ['irrelevant'] },
      { antes: 'She was', despues: 'with the way it had been handled.', raiz: 'PLEASE', aceptadas: ['displeased'] },
      { antes: 'It is', despues: 'to park there on a Saturday.', raiz: 'POSSIBLE', aceptadas: ['impossible'] },
      { antes: 'The room felt cold and', despues: '.', raiz: 'WELCOME', aceptadas: ['unwelcoming'] },
      { antes: 'His behaviour was', despues: 'of a man in his position.', raiz: 'WORTHY', aceptadas: ['unworthy'] }
    ]
  },

  'b2t3-voc14': {
    tipo: 'formacion', titulo: 'Word formation · personas y oficios',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'She has worked as a', despues: 'for twenty years.', raiz: 'LIBRARY', aceptadas: ['librarian'] },
      { antes: 'She works as an', despues: 'for a company in Bilbao.', raiz: 'INTERPRET', aceptadas: ['interpreter'] },
      { antes: 'He is a', despues: 'at the local paper.', raiz: 'PHOTOGRAPH', aceptadas: ['photographer'] },
      { antes: 'Two hundred', despues: 'signed the letter.', raiz: 'RESIDE', aceptadas: ['residents'] },
      { antes: 'My cousin is a', despues: 'in the merchant navy.', raiz: 'ENGINE', aceptadas: ['engineer'] },
      { antes: 'The', despues: 'of the museum gave a short talk.', raiz: 'FOUND', aceptadas: ['founder'] }
    ]
  },

  'b2t3-use1': {
    tipo: 'opcion', parte: 1, titulo: 'Use of English · Part 1',
    instruccion: 'Decide which answer best fits each gap.',
    texto: [
      'Nobody planned for the town square to become the place where teenagers spend their evenings, and for about a year the council tried to {1} it. Benches were removed, a fence went up, and the fountain was switched off at seven. None of it made the slightest {2}.',
      'What changed things was a new clerk who asked a question nobody had {3} to ask: where else, exactly, were they supposed to go? The honest answer was nowhere. The youth club had closed in 2011, the two cafés shut at eight and the bus home cost more than most of them {4} in an evening. The square was not a choice. It was what was left.',
      'The council put the benches {5}, turned the fountain back on and installed a light and a bin. Complaints fell by two thirds within a year, which nobody has been able to {6} for entirely, although the bin is thought to have done more work than anybody expected. It is not a triumph and the clerk is careful not to {7} it as one. But it cost eleven hundred euros, which is less than the fence, and it {8} on the assumption that the people in the square were residents rather than a problem.'
    ],
    items: [
      { opciones: ['prevent', 'stop', 'avoid', 'refuse'], correcta: 1 },
      { opciones: ['effect', 'change', 'difference', 'result'], correcta: 2 },
      { opciones: ['thought', 'wanted', 'managed', 'hoped'], correcta: 0 },
      { opciones: ['won', 'gained', 'earned', 'paid'], correcta: 2 },
      { opciones: ['again', 'over', 'round', 'back'], correcta: 3 },
      { opciones: ['count', 'explain', 'account', 'answer'], correcta: 2 },
      { opciones: ['describe', 'name', 'call', 'say'], correcta: 0 },
      { opciones: ['rested', 'stood', 'built', 'lay'], correcta: 0 }
    ]
  },

  'b2t3-use2a': {
    tipo: 'cloze', parte: 2, titulo: 'Use of English · Part 2',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Nobody is ever taught how to complain, and it shows. The two usual approaches are to say nothing at all and then be furious about it for a fortnight, {1} to arrive angry and lose the argument in the first sentence. Neither of them works, and both are exhausting.',
      'The people who are good at it have almost nothing {2} common except that they are dull about it. They say what happened, in order, {3} dates. They say what they want, once, {4} clearly. They do not describe how they feel, because the person at the other end of the telephone did not cause it and cannot be made {5} care. It is a technique rather {6} a talent, which is the good news, and most of it can be learned in an afternoon.',
      'The other half of it is knowing when to stop. Most complaints are worth about twenty minutes; {7} that, you are working for nothing, and the company is relying on precisely that. Write it down, send it, and then let it {8}. The people who cannot are rarely the ones who were most wronged.'
    ],
    items: [
      { aceptadas: ['or'] }, { aceptadas: ['in'] }, { aceptadas: ['with'] },
      { aceptadas: ['very', 'quite', 'perfectly'] }, { aceptadas: ['to'] },
      { aceptadas: ['than'] }, { aceptadas: ['after', 'beyond'] },
      { aceptadas: ['go', 'drop', 'rest'] }
    ]
  },

  'b2t3-use2b': {
    tipo: 'cloze', parte: 2, titulo: 'Use of English · Part 2 (extra)',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Learning the names of trees is the sort of thing people put {1} until they are fifty, and then wish they had done at nine. There is no obvious reward. Nothing works any better afterwards, nobody pays you more, and the only visible change is that a walk takes twice {2} long.',
      'What actually happens is that a green blur turns {3} about nine separate things. It is the same street it always was, and it is not the same street at all, which is very difficult to explain to anybody who has not done it. The effect is not limited {4} trees: people who learn birdsong describe exactly the same experience, and {5} do people who learn the names of clouds.',
      'The barrier is that the first fortnight is boring. You have to look at leaves and be wrong repeatedly, and there is nothing on earth {6} dull as a beginner’s field guide. But there comes a point, usually in the third week, {7} the names stop being a list and turn into a way of seeing, and after that you could not go back to the blur even {8} you wanted to.'
    ],
    items: [
      { aceptadas: ['off'] }, { aceptadas: ['as'] }, { aceptadas: ['into'] },
      { aceptadas: ['to'] }, { aceptadas: ['so'] }, { aceptadas: ['as'] },
      { aceptadas: ['when', 'where'] }, { aceptadas: ['if'] }
    ]
  },

  'b2t3-use3': {
    tipo: 'formacion', parte: 3, titulo: 'Use of English · Part 3',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The', despues: 'of the new timetable has been postponed.', raiz: 'INTRODUCE', aceptadas: ['introduction'] },
      { antes: 'He answered every question', despues: 'and at length.', raiz: 'PATIENT', aceptadas: ['patiently'] },
      { antes: 'The report is long but not especially', despues: '.', raiz: 'INFORM', aceptadas: ['informative'] },
      { antes: 'There has been a marked', despues: 'in air quality.', raiz: 'IMPROVE', aceptadas: ['improvement'] },
      { antes: 'The two versions are almost', despues: '.', raiz: 'IDENTITY', aceptadas: ['identical'] },
      { antes: 'She spoke with great', despues: 'about the changes.', raiz: 'ANXIOUS', aceptadas: ['anxiety'] },
      { antes: 'The scheme has been', despues: 'expensive to run.', raiz: 'SURPRISE', aceptadas: ['surprisingly'] },
      { antes: 'His', despues: 'to answer made everybody suspicious.', raiz: 'REFUSE', aceptadas: ['refusal'] }
    ]
  },

  'b2t3-use4a': {
    tipo: 'transformacion', parte: 4, titulo: 'Use of English · Part 4',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'The weather stopped us from going.', clave: 'PREVENTED', antes: 'The weather', despues: 'going.', aceptadas: ['prevented us from'] },
      { frase: 'I have never met a kinder person.', clave: 'KINDEST', antes: 'She is', despues: 'I have ever met.', aceptadas: ['the kindest person'] },
      { frase: 'Nobody knows where he went.', clave: 'IDEA', antes: 'Nobody', despues: 'he went.', aceptadas: ['has any idea where'] },
      { frase: 'It is not worth ringing them now.', clave: 'POINT', antes: 'There', despues: 'ringing them now.', aceptadas: ['is no point in', "'s no point in"] },
      { frase: 'She is a much better cook than I am.', clave: 'NEARLY', antes: 'I cannot cook', despues: 'she can.', aceptadas: ['nearly as well as'] },
      { frase: 'They only told us yesterday.', clave: 'UNTIL', antes: 'We', despues: 'yesterday.', aceptadas: ["weren't told until", 'were not told until'] }
    ]
  },

  'b2t3-use4b': {
    tipo: 'transformacion', parte: 4, titulo: 'Use of English · Part 4 (extra)',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'It was raining so hard that the match was stopped.', clave: 'SUCH', antes: 'There was', despues: 'that the match was stopped.', aceptadas: ['such heavy rain'] },
      { frase: 'I am sorry that I did not listen to you.', clave: 'WISH', antes: 'I', despues: 'to you.', aceptadas: ['wish I had listened'] },
      { frase: 'Somebody must clean this before Monday.', clave: 'BE', antes: 'This', despues: 'before Monday.', aceptadas: ['must be cleaned'] },
      { frase: 'She is not experienced enough for the job.', clave: 'TOO', antes: 'She', despues: 'for the job.', aceptadas: ['is too inexperienced'] },
      { frase: 'He did not tell me, so I did not go.', clave: 'HAD', antes: 'If he', despues: 'me, I would have gone.', aceptadas: ['had told'] },
      { frase: '"You should see a doctor," she said to me.', clave: 'ADVISED', antes: 'She', despues: 'a doctor.', aceptadas: ['advised me to see'] }
    ]
  },

  'b2t3-read5': {
    tipo: 'lectura', parte: 5, titulo: 'Reading · Part 5',
    instruccion: 'Read the text and choose the best answer (A, B, C or D) for each question.',
    tituloTexto: 'The teacher whose pupils are grown men',
    texto: [
      'The class meets on Tuesdays at half past six in a room above a bank in Portsmouth, and there are eleven names on the register. The youngest is twenty-four; the oldest, whose name is Bill, is seventy-one. All of them are learning to read.',
      'Their teacher, Fiona Bray, has done this for nine years and spent the eleven years before it teaching seven-year-olds. She says the two jobs have almost nothing in common, and that the first thing she had to unlearn was encouragement. "With children you praise everything, constantly, because they have no reason yet to think they are stupid. Say the same things to a man of fifty and he hears you being kind to him, which is not what he came for."',
      'What most of them came for is specific and small. One wants to read a bedtime story to his granddaughter without inventing it from the pictures. Another has been offered promotion twice and turned it down twice, and never told his employer why. Bill will not say, and Bray has learned not to ask; she notes only that he has not missed a Tuesday in four years.',
      'The commonest misunderstanding, she says, is that her pupils cannot read at all. Almost all of them can read something. They have systems: they recognise the shape of the words they need, they know which forms to avoid, they arrange their lives so that a partner or a child deals with anything written. The systems work, and that is the problem. A system that works is a reason not to climb the stairs to a room above a bank on a Tuesday, and most people take forty years to run out of one.',
      'Progress is slow and she refuses to dress it up. Adults learn to read more slowly than children, for reasons nobody has fully explained, and the distance between arriving and reading a newspaper is measured in years. She tells new pupils this in the first ten minutes, which she knows costs her some of them. "They have been promised things before," she says. "If I add to that list I am simply another person who let them down, and there are enough of those already."',
      'The money for the class comes from a charity and is agreed one year at a time. Bray spends about a fortnight each spring on the application and describes the process, carefully, as reasonable. What she will say is that in nine years of forms nobody has ever asked her how many of her pupils came back the following term, which is the only figure she herself looks at.'
    ],
    items: [
      { pregunta: '1  What did Bray have to change when she began teaching adults?',
        opciones: ['The way she gave praise.', 'The materials she used in class.', 'The length of her lessons.', 'Her expectations of how fast people learn.'], correcta: 0 },
      { pregunta: '2  What is suggested about Bill?',
        opciones: ['He is the weakest reader in the group.', 'He has been coming longer than anybody else.', 'His reasons are private but his commitment is not in doubt.', 'He is likely to stop attending soon.'], correcta: 2 },
      { pregunta: '3  Why does Bray call her pupils’ systems "the problem"?',
        opciones: ['They make people believe they are reading properly.', 'They work well enough to remove the reason to ask for help.', 'They depend on other people who may not always be available.', 'They are very hard to unlearn later on.'], correcta: 1 },
      { pregunta: '4  Why does she warn new pupils about how slow progress will be?',
        opciones: ['To keep her classes small.', 'Because the charity requires her to.', 'To avoid becoming another broken promise.', 'Because she did the same with children.'], correcta: 2 },
      { pregunta: '5  What does the writer imply about the funding process?',
        opciones: ['It is unfair to small charities.', 'It measures the wrong things.', 'It takes up most of her year.', 'It is about to be withdrawn.'], correcta: 1 },
      { pregunta: '6  What is Bray’s attitude to her work as a whole?',
        opciones: ['She is frustrated by how little she achieves.', 'She is uncomfortable when people praise it.', 'She thinks the state ought to be running it.', 'She is honest about it rather than hopeful.'], correcta: 3 }
    ]
  },

  'b2t3-read6': {
    tipo: 'lectura', parte: 6, titulo: 'Reading · Part 6',
    instruccion: 'Six sentences have been removed from the text. Choose from the sentences A–G the one which fits each gap. There is one extra sentence which you do not need to use.',
    tituloTexto: 'The river that came back to the surface',
    texto: [
      'For eighty years the Cranbeck ran under Leigh Street in a brick culvert, and almost nobody in the town knew that it was there. {1} It appeared on no map that ordinary people ever saw, and the only sign of it was a manhole cover outside the chemist that steamed on cold mornings.',
      'The plan to bring it back to the surface was not, to begin with, about the river at all. The council needed to replace the culvert, which was failing, and replacing it cost considerably more than removing it. {2} Nobody involved would have described the original decision as environmental.',
      'Objections came, as they always do, from the people nearest. Fourteen shops lost eleven parking spaces between them and said so loudly and for eighteen months. {3} Two of the fourteen have since told the local paper that they had been wrong, which is a higher proportion than the council expected.',
      'What surprised the engineers was not the flooding, which behaved more or less as the models had said it would. {4} Within two summers there were kingfishers, which nobody had promised and which now appear in the town’s publicity more often than the swimming pool.',
      'Other towns come to visit, and the borough engineer who ran the scheme is guarded with them. He points out that the Cranbeck is small, that the culvert had to be replaced in any case, and that the money would never have been found for a river on its own. {5} He has stopped giving talks with the word "restoration" in the title.',
      'The stream is now the thing the town puts on its signs. {6} That is not what anybody set out to do, and the engineer, who retires next year, says he has given up trying to correct the story.'
    ],
    secciones: [
      { letra: 'A', texto: ['It was how quickly the wildlife arrived.'] },
      { letra: 'B', texto: ['It had been buried in 1938 because it flooded, it smelled, and it was in the way of a road.'] },
      { letra: 'C', texto: ['A drain that everybody had forgotten has become the reason people stop on their way past.'] },
      { letra: 'D', texto: ['Trade on Leigh Street is now about nine per cent higher than it was before the work.'] },
      { letra: 'E', texto: ['Three further culverts in the borough are due to be replaced before 2031.'] },
      { letra: 'F', texto: ['Opening the stream up was, in the first instance, simply the cheaper of two engineering options.'] },
      { letra: 'G', texto: ['Without that failing brickwork, he says, none of it would ever have happened.'] }
    ],
    opcionesCortas: true,
    items: [
      { pregunta: '1', opciones: ['A','B','C','D','E','F','G'], correcta: 1 },
      { pregunta: '2', opciones: ['A','B','C','D','E','F','G'], correcta: 5 },
      { pregunta: '3', opciones: ['A','B','C','D','E','F','G'], correcta: 3 },
      { pregunta: '4', opciones: ['A','B','C','D','E','F','G'], correcta: 0 },
      { pregunta: '5', opciones: ['A','B','C','D','E','F','G'], correcta: 6 },
      { pregunta: '6', opciones: ['A','B','C','D','E','F','G'], correcta: 2 }
    ]
  },

  'b2t3-read7': {
    tipo: 'lectura', parte: 7, titulo: 'Reading · Part 7',
    instruccion: 'You are going to read an article in which four people describe running a small business from home. For each question, choose from the people A–D. The people may be chosen more than once.',
    opcionesCortas: true,
    secciones: [
      { letra: 'A', titulo: 'Naiara, jam and preserves',
        texto: ['I started because I had a glut of plums and a freezer that was already full, and four years later it pays about a third of what my old job did, for roughly the same hours. I want to be straightforward about that, because a great deal of what is written about this is not. What I had not expected is how little of it is cooking. It is labels, and regulations, and driving to markets in the rain. The cooking is perhaps a fifth of the week. If you would not enjoy the other four fifths, do not begin.'] },
      { letra: 'B', titulo: 'Tom, bookkeeping',
        texto: ['The work itself I could do in my sleep; I did it in an office for nineteen years. The difference is that at home nobody tells you to stop. Within a month I was answering emails at eleven at night and calling it flexibility. What fixed it was a door. I moved the desk out of the kitchen and into the spare room, and now that room is shut at six. I am well aware that this sounds like a very small thing, and it changed everything.'] },
      { letra: 'C', titulo: 'Priya, vintage sewing machines',
        texto: ['Machines get sent to me from all over the country, mostly by people who inherited one and cannot bear to throw it out. Half of them are worth less than the postage, and I say so, and then I repair them anyway if the owner wants me to. That is not sound business advice. But I am fifty-eight and I am not trying to build anything; I am trying to have interesting weeks. My accountant has stopped mentioning it.'] },
      { letra: 'D', titulo: 'Gorka, guitar lessons',
        texto: ['Everybody assumes teaching online is worse, and for the first year I agreed with them. Then I worked out that the problem was not the screen at all: it was that I was teaching the way I had taught in a room. Once I started recording things for them to watch beforehand and using the hour only for the parts that genuinely need me, it became better than the room ever was. I have thirty-one students in six countries and I have never met any of them.'] }
    ],
    items: [
      { pregunta: '1  Who is open about earning considerably less than before?',
        opciones: ['A','B','C','D'], correcta: 0 },
      { pregunta: '2  Who had to create a physical boundary in order to stop working?',
        opciones: ['A','B','C','D'], correcta: 1 },
      { pregunta: '3  Who accepts that the way they work makes little commercial sense?',
        opciones: ['A','B','C','D'], correcta: 2 },
      { pregunta: '4  Who changed their own method rather than blaming the format?',
        opciones: ['A','B','C','D'], correcta: 3 },
      { pregunta: '5  Who says the craft itself takes up a small part of the week?',
        opciones: ['A','B','C','D'], correcta: 0 },
      { pregunta: '6  Who is aware that what helped them sounds trivial?',
        opciones: ['A','B','C','D'], correcta: 1 },
      { pregunta: '7  Who says they are not trying to make the business grow?',
        opciones: ['A','B','C','D'], correcta: 2 },
      { pregunta: '8  Who now believes their way of working beats the traditional one?',
        opciones: ['A','B','C','D'], correcta: 3 },
      { pregunta: '9  Who warns others about the parts of the job they may not enjoy?',
        opciones: ['A','B','C','D'], correcta: 0 },
      { pregunta: '10  Who mentions customers whose belongings are worth very little?',
        opciones: ['A','B','C','D'], correcta: 2 }
    ]
  },

  'b2t3-lis1': {
    tipo: 'listening', parte: 1, titulo: 'Listening · Part 1',
    instruccion: 'You will hear people talking in eight different situations. Choose the answer (A, B or C) which fits best according to what you hear. <b>You will hear the recording twice.</b>',
    audio: 'audio/b2t3-lis1-espeak.mp3', escuchas: 2, demo: true,
    contexto: 'Eight short extracts, one question each.',
    items: [
      { pregunta: '1  What did the man value most about the course?',
        opciones: ['The chance to say what he thought on the form.', 'The content, which was better than a book.', 'Finding out that the others were improvising too.'], correcta: 2 },
      { pregunta: '2  How does the woman feel about the flat?',
        opciones: ['Annoyed that everything else about it is right.', 'Keen to keep looking at other places.', 'Convinced the rent is still too high.'], correcta: 0 },
      { pregunta: '3  Why is Laura leaving the message?',
        opciones: ['To correct what the calendar says.', 'To cancel the meeting.', 'To arrange a different time.'], correcta: 0 },
      { pregunta: '4  What does the man say about the eight-week rule?',
        opciones: ['It ought to be applied more gently.', 'Being flexible with it made things worse.', 'It is the reason the waiting list is so long.'], correcta: 1 },
      { pregunta: '5  What does the man say about the new system?',
        opciones: ['It is faster than the old one.', 'Nobody has explained the change to him.', 'The reason for it was dull and practical.'], correcta: 2 },
      { pregunta: '6  What had the woman got wrong about learning to swim?',
        opciones: ['How difficult she would find the water.', 'How long it would take her.', 'Which part would be hardest.'], correcta: 2 },
      { pregunta: '7  Why does the man keep the photograph?',
        opciones: ['It is better than he first thought.', 'It is the only record of that summer.', 'He can name everybody in it.'], correcta: 1 },
      { pregunta: '8  What does the man mean about the book?',
        opciones: ['He would not recommend it to anybody.', 'He gave up before the end.', 'It has stayed with him more than books he enjoyed.'], correcta: 2 }
    ]
  },

  'b2t3-lis2': {
    tipo: 'listening', parte: 2, titulo: 'Listening · Part 2',
    instruccion: 'Complete the sentences with <b>a word or short phrase</b> from what you hear. <b>You will hear the recording twice.</b>',
    audio: 'audio/b2t3-lis2-espeak.mp3', escuchas: 2, demo: true,
    contexto: 'Will Amory talks about his work looking after public clocks.',
    items: [
      { antes: 'For nine years before this, Will worked as a', despues: '.', aceptadas: ['piano tuner', 'tuner'] },
      { antes: 'The oldest clock he looks after was made in', despues: '.', aceptadas: ['1889'] },
      { antes: 'He says that by far the commonest cause of trouble is', despues: '.', aceptadas: ['damp', 'water'] },
      { antes: 'The part of the job he finds hardest is the', despues: '.', aceptadas: ['ladder'] },
      { antes: 'The tool he would not work without is a', despues: '.', aceptadas: ['mirror'] },
      { antes: 'Most of his clocks lose about', despues: 'a week.', aceptadas: ['ten seconds', '10 seconds'] },
      { antes: 'He resets them by hand once a', despues: '.', aceptadas: ['month'] },
      { antes: 'The one clock that was saved from replacement was saved by the', despues: '.', aceptadas: ['stationmaster'] },
      { antes: 'His apprentice used to work in', despues: '.', aceptadas: ['furniture restoration', 'furniture'] },
      { antes: 'What worries him most about the future is the supply of', despues: '.', aceptadas: ['spare parts', 'parts'] }
    ]
  },

  'b2t3-lis3': {
    tipo: 'listening', parte: 3, titulo: 'Listening · Part 3',
    instruccion: 'You will hear five short extracts in which people talk about a journey that went wrong. Choose from the list A–H what each speaker says. Use each letter once. There are three extra letters. <b>You will hear the recording twice.</b>',
    audio: 'audio/b2t3-lis3-espeak.mp3', escuchas: 2, demo: true,
    opcionesCortas: true,
    listas: [
      { titulo: 'What does each speaker say about the journey?', opciones: [
        'I met people I am still in touch with.',
        'The unplanned part turned out to be the best part.',
        'It cost far more than I had budgeted for.',
        'I had been warned and I ignored the warning.',
        'The mistake was entirely my own.',
        'I would happily do the same journey again.',
        'I lost time that nobody can give back to me.',
        'The company refused to take any responsibility.'
      ] }
    ],
    items: [
      { pregunta: '1  Speaker 1', opciones: ['A','B','C','D','E','F','G','H'], correcta: 1 },
      { pregunta: '2  Speaker 2', opciones: ['A','B','C','D','E','F','G','H'], correcta: 6 },
      { pregunta: '3  Speaker 3', opciones: ['A','B','C','D','E','F','G','H'], correcta: 4 },
      { pregunta: '4  Speaker 4', opciones: ['A','B','C','D','E','F','G','H'], correcta: 0 },
      { pregunta: '5  Speaker 5', opciones: ['A','B','C','D','E','F','G','H'], correcta: 3 }
    ]
  },

  'b2t3-lis4': {
    tipo: 'listening', parte: 4, titulo: 'Listening · Part 4',
    instruccion: 'You will hear an interview. Choose the answer (A, B, C or D) which fits best according to what you hear. <b>You will hear the recording twice.</b>',
    audio: 'audio/b2t3-lis4-espeak.mp3', escuchas: 2, demo: true,
    contexto: 'A journalist interviews Elin Vaughan, who draws maps by hand.',
    items: [
      { pregunta: '1  Why does Elin say a satellite photograph is not a map?',
        opciones: ['It is not accurate enough for walkers.', 'It shows everything and decides nothing.', 'It is difficult for most people to read.', 'It goes out of date very quickly.'], correcta: 1 },
      { pregunta: '2  How did she start doing this work?',
        opciones: ['A walking group commissioned her.', 'She trained as a cartographer.', 'She made one for her own teaching.', 'She took over from a colleague.'], correcta: 2 },
      { pregunta: '3  What changed her view of people who frame her maps?',
        opciones: ['The money she made from selling prints.', 'Advice from another mapmaker.', 'Realising that nobody navigates any more.', 'A letter explaining why somebody had hung one up.'], correcta: 3 },
      { pregunta: '4  What does she say is the hardest part of the work?',
        opciones: ['Getting the scale right.', 'Deciding what to leave out.', 'Walking every route herself.', 'Keeping the maps up to date.'], correcta: 1 },
      { pregunta: '5  How has technology changed what she does?',
        opciones: ['It has taken over the drawing.', 'It has made her maps more decorative.', 'It has made checking much quicker.', 'It has forced her prices down.'], correcta: 2 },
      { pregunta: '6  What is her point about phones and maps?',
        opciones: ['People navigate worse than they used to.', 'They give a different kind of information.', 'Phones should not be used for walking.', 'Paper maps are more reliable in bad weather.'], correcta: 1 },
      { pregunta: '7  What does she say people leave out when they tell this kind of story?',
        opciones: ['How long it takes before it earns anything.', 'How much walking is involved.', 'How much the technology has helped.', 'How often mistakes get into a map.'], correcta: 0 }
    ]
  },

  'b2t3-speak1': {
    tipo: 'speaking', parte: 2, titulo: 'Long turn: dos maneras de comer',
    instruccion: 'Habla durante <b>un minuto seguido</b>. Compara las dos situaciones: no las describas una detrás de otra.',
    segundos: 60,
    pregunta: 'Compare these two situations and say what the people might enjoy about each.',
    puntos: ['a family eating together on a Sunday', 'somebody eating alone at their desk at work'],
    nota: 'En el examen esto se hace con dos fotografías y hay una segunda pregunta corta al final. Aquí van descritas mientras la academia no aporte las suyas.',
    items: [ { grabacion: true } ]
  },

  'b2t3-speak3': {
    tipo: 'speaking', parte: 3, titulo: 'Parte 3: decidir en voz alta',
    instruccion: 'Habla durante <b>dos minutos</b>. Comenta las cinco ideas y termina eligiendo una.',
    segundos: 120,
    pregunta: 'A company wants its staff to be less tired at the end of the day. How much would each of these help, and which would help most?',
    puntos: ['finishing at three on Fridays', 'no meetings before ten in the morning', 'working from home two days a week', 'a proper hour for lunch away from the desk', 'no emails after six'],
    nota: 'En el examen esto se habla con otro candidato: se negocia y se llega a un acuerdo. Grabándote solo se practica todo menos eso, que es un criterio entero.',
    items: [ { grabacion: true } ]
  },

  'b2t3-speak4': {
    tipo: 'speaking', parte: 4, titulo: 'Parte 4: opinar y justificar',
    instruccion: 'Contesta a las tres preguntas seguidas, <b>dos minutos</b> en total.',
    segundos: 120,
    pregunta: 'Questions about work and free time.',
    puntos: [
      'Do people work too much in your country? Why do you think that is?',
      'Some people say we should be able to switch off our phones after work. Would that be possible?',
      'Is it better to have a job you love and less money, or the other way round?'
    ],
    nota: 'En el examen el examinador pregunta y luego te pide que reacciones a lo que ha dicho la otra persona. Aquí solo está la primera mitad.',
    items: [ { grabacion: true } ]
  },

  'b2t3-write1': {
    tipo: 'writing', parte: 1, titulo: 'Essay',
    instruccion: 'Escribe entre <b>140 y 190 palabras</b>. Es obligatorio: en el examen esta tarea no se elige.',
    minutos: 40, palabras: [140, 190],
    enunciado: 'In your English class you have been talking about transport. Now your teacher has asked you to write an essay. Do you agree that city centres should be closed to private cars?',
    contexto: 'Notes. Write about: 1 · air and noise · 2 · people who live outside the city · 3 ... (your own idea).',
    cierre: 'Write in a fairly formal style. Use both of the given notes and add one idea of your own.',
    items: [ { escrito: true } ]
  },

  'b2t3-write2': {
    tipo: 'writing', parte: 2, titulo: 'A elegir: reseña, correo o artículo',
    instruccion: 'Elige <b>una</b> de las tres y escribe entre <b>140 y 190 palabras</b>.',
    minutos: 40, palabras: [140, 190],
    enunciado: 'Choose one of the following three tasks.',
    contexto: '1 · A website collects reviews of courses and classes. Write a review of a course you have taken, saying what it was like and who it would suit.\n2 · You stayed in a flat you booked online and several things were not as described. Write a formal email to the owner explaining the problems and saying what you expect.\n3 · An English-language magazine has asked readers for articles under the title "Something I was wrong about". Write your article.',
    cierre: 'La reseña opina y recomienda a alguien concreto. El correo formal necesita hechos, fechas y una petición clara. El artículo va en primera persona y engancha en la primera línea.',
    items: [ { escrito: true } ]
  },

  /* ---------------------- TEST 4 de B2 First ---------------------- */

  'b2t4-gram1': {
    tipo: 'transformacion', titulo: 'Presentes',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'The library opened in March and it is still open.', clave: 'OPEN', antes: 'The library', despues: 'since March.', aceptadas: ['has been open'] },
      { frase: 'How long is it since they got married?', clave: 'BEEN', antes: 'How long', despues: 'married?', aceptadas: ['have they been'] },
      { frase: 'Somebody is fixing the roof today.', clave: 'BEING', antes: 'The roof', despues: 'today.', aceptadas: ['is being fixed'] },
      { frase: 'I do not know this street.', clave: 'BEEN', antes: 'I', despues: 'down this street before.', aceptadas: ["haven't been", 'have not been', 'have never been'] },
      { frase: 'She interrupts me every single time I speak.', clave: 'ALWAYS', antes: 'She', despues: 'me.', aceptadas: ['is always interrupting'] },
      { frase: 'They have had that dog for two years.', clave: 'GOT', antes: 'They', despues: 'two years ago.', aceptadas: ['got that dog', 'got the dog'] }
    ]
  },

  'b2t4-gram2': {
    tipo: 'transformacion', titulo: 'Pasados',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I locked the door and then went to bed.', clave: 'AFTER', antes: 'I went to bed', despues: 'the door.', aceptadas: ['after locking', 'after I locked'] },
      { frase: 'The lights went out while I was cooking.', clave: 'WHEN', antes: 'I', despues: 'the lights went out.', aceptadas: ['was cooking when'] },
      { frase: 'She was hungry because she had not eaten since breakfast.', clave: 'NOTHING', antes: 'She was hungry because she', despues: 'since breakfast.', aceptadas: ['had eaten nothing'] },
      { frase: 'They did not pay me for the extra hours.', clave: 'PAID', antes: 'I', despues: 'for the extra hours.', aceptadas: ["wasn't paid", 'was not paid'] },
      { frase: 'It was her first visit to a hospital.', clave: 'NEVER', antes: 'She', despues: 'in a hospital before.', aceptadas: ['had never been'] },
      { frase: 'The last time we saw them was at the wedding.', clave: 'SINCE', antes: 'We have not seen them', despues: '.', aceptadas: ['since the wedding'] }
    ]
  },

  'b2t4-gram3': {
    tipo: 'transformacion', titulo: 'Futuro',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'The ferry leaves at ten past six.', clave: 'SAILS', antes: 'The ferry', despues: 'at ten past six.', aceptadas: ['sails at'] },
      { frase: 'We have arranged to have dinner with them on Friday.', clave: 'HAVING', antes: 'We', despues: 'with them on Friday.', aceptadas: ['are having dinner'] },
      { frase: 'The building work will be over before Christmas.', clave: 'HAVE', antes: 'By Christmas they', despues: 'the building work.', aceptadas: ['will have finished'] },
      { frase: 'It is obvious that they are going to lose.', clave: 'BOUND', antes: 'They', despues: '.', aceptadas: ['are bound to lose'] },
      { frase: 'That box looks heavy. I will carry it.', clave: 'CARRY', antes: 'That box looks heavy.', despues: 'it for you.', aceptadas: ["I'll carry", 'I will carry'] },
      { frase: 'Do not decide before you have seen it.', clave: 'UNTIL', antes: 'Do not decide', despues: 'it.', aceptadas: ['until you have seen'] }
    ]
  },

  'b2t4-gram4': {
    tipo: 'transformacion', titulo: 'Repaso de tiempos',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'It is four years since she started at the hospital.', clave: 'WORKING', antes: 'She', despues: 'at the hospital for four years.', aceptadas: ['has been working'] },
      { frase: 'The café shut down last winter.', clave: 'BEEN', antes: 'The café', despues: 'since last winter.', aceptadas: ['has been closed', 'has been shut'] },
      { frase: 'This is my third time in Rome.', clave: 'TIME', antes: 'It is the third', despues: 'to Rome.', aceptadas: ['time I have been'] },
      { frase: 'The train had already gone when I got to the platform.', clave: 'LEFT', antes: 'The train', despues: 'I got to the platform.', aceptadas: ['had left before', 'had already left when'] },
      { frase: 'When did she buy that coat?', clave: 'HAD', antes: 'How long', despues: 'that coat?', aceptadas: ['has she had'] },
      { frase: 'They are going to repair the road in April.', clave: 'REPAIRED', antes: 'The road', despues: 'in April.', aceptadas: ['is going to be repaired', 'will be repaired'] }
    ]
  },

  'b2t4-gram5': {
    tipo: 'transformacion', titulo: 'Costumbres del pasado',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'We spent every August at my aunt’s house when we were young.', clave: 'USED', antes: 'We', despues: 'every August at my aunt’s house.', aceptadas: ['used to spend'] },
      { frase: 'My mother sometimes read to us before we slept.', clave: 'WOULD', antes: 'My mother', despues: 'to us before we slept.', aceptadas: ['would sometimes read'] },
      { frase: 'There is no baker in the village now, although there was one before.', clave: 'BE', antes: 'There', despues: 'a baker in the village.', aceptadas: ['used to be'] },
      { frase: 'He did not enjoy reading when he was at school.', clave: 'USE', antes: 'He', despues: 'reading when he was at school.', aceptadas: ["didn't use to enjoy", 'did not use to enjoy'] },
      { frase: 'I never travelled by plane before I was twenty.', clave: 'NEVER', antes: 'I', despues: 'by plane before I was twenty.', aceptadas: ['never used to travel'] },
      { frase: 'They do not live here any more, but they did before.', clave: 'LONGER', antes: 'They', despues: 'here.', aceptadas: ['no longer live'] }
    ]
  },

  'b2t4-gram6': {
    tipo: 'transformacion', titulo: 'Acostumbrarse',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'The traffic noise bothered me a great deal at first.', clave: 'USED', antes: 'At first I', despues: 'the traffic noise.', aceptadas: ["wasn't used to", 'was not used to'] },
      { frase: 'The new software is becoming easier for him every week.', clave: 'GETTING', antes: 'He', despues: 'the new software.', aceptadas: ['is getting used to'] },
      { frase: 'Getting up at five does not bother her now.', clave: 'USED', antes: 'She', despues: 'getting up at five.', aceptadas: ['is used to'] },
      { frase: 'It took us a year to accept the change.', clave: 'GET', antes: 'It took us a year', despues: 'the change.', aceptadas: ['to get used to'] },
      { frase: 'After six months the accent no longer troubled him.', clave: 'GOT', antes: 'After six months he', despues: 'the accent.', aceptadas: ['had got used to', 'got used to'] },
      { frase: 'Cold showers are perfectly normal for them.', clave: 'USED', antes: 'They', despues: 'cold showers.', aceptadas: ['are used to'] }
    ]
  },

  'b2t4-gram7': {
    tipo: 'transformacion', titulo: 'Poder y tener que',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'Eating is forbidden in the reading room.', clave: 'ALLOWED', antes: 'You', despues: 'in the reading room.', aceptadas: ['are not allowed to eat', "aren't allowed to eat"] },
      { frase: 'In the end we found somewhere to park.', clave: 'MANAGED', antes: 'In the end we', despues: 'somewhere to park.', aceptadas: ['managed to find'] },
      { frase: 'It is compulsory to show your ticket at the barrier.', clave: 'MUST', antes: 'You', despues: 'your ticket at the barrier.', aceptadas: ['must show'] },
      { frase: 'He was not able to finish the race.', clave: 'COULD', antes: 'He', despues: 'the race.', aceptadas: ["couldn't finish", 'could not finish'] },
      { frase: 'It was not necessary for her to come in on Saturday.', clave: 'HAVE', antes: 'She', despues: 'come in on Saturday.', aceptadas: ["didn't have to", 'did not have to'] },
      { frase: 'She is capable of running a marathon.', clave: 'ABLE', antes: 'She', despues: 'a marathon.', aceptadas: ['is able to run'] }
    ]
  },

  'b2t4-gram8': {
    tipo: 'transformacion', titulo: 'Consejo y deducción',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'It was a mistake to lend him the money.', clave: 'SHOULD', antes: 'You', despues: 'him the money.', aceptadas: ["shouldn't have lent", 'should not have lent'] },
      { frase: 'I am certain they have gone already.', clave: 'MUST', antes: 'They', despues: 'already.', aceptadas: ['must have gone'] },
      { frase: 'There is no chance that she said that.', clave: 'CANNOT', antes: 'She', despues: 'that.', aceptadas: ['cannot have said'] },
      { frase: 'Perhaps he left it on the train.', clave: 'MIGHT', antes: 'He', despues: 'it on the train.', aceptadas: ['might have left'] },
      { frase: 'In your position I would say nothing at all.', clave: 'WERE', antes: 'If I', despues: ', I would say nothing at all.', aceptadas: ['were in your position', 'were you'] },
      { frase: 'My advice is to check it once more.', clave: 'BETTER', antes: 'You', despues: 'it once more.', aceptadas: ["'d better check", 'had better check'] }
    ]
  },

  'b2t4-gram9': {
    tipo: 'transformacion', titulo: 'Voz pasiva',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'They are repainting the bridge this summer.', clave: 'BEING', antes: 'The bridge', despues: 'this summer.', aceptadas: ['is being repainted'] },
      { frase: 'Somebody has taken my umbrella.', clave: 'BEEN', antes: 'My umbrella', despues: 'taken.', aceptadas: ['has been'] },
      { frase: 'People think the fire started in the kitchen.', clave: 'THOUGHT', antes: 'The fire', despues: 'started in the kitchen.', aceptadas: ['is thought to have'] },
      { frase: 'They will publish the list on Monday.', clave: 'PUBLISHED', antes: 'The list', despues: 'on Monday.', aceptadas: ['will be published'] },
      { frase: 'The company offered Ane a contract.', clave: 'OFFERED', antes: 'Ane', despues: 'a contract by the company.', aceptadas: ['was offered'] },
      { frase: 'Somebody ought to check these figures.', clave: 'BE', antes: 'These figures', despues: '.', aceptadas: ['ought to be checked'] }
    ]
  },

  'b2t4-gram10': {
    tipo: 'transformacion', titulo: 'Que te lo hagan',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'A garage checks our brakes every autumn.', clave: 'HAVE', antes: 'We', despues: 'every autumn.', aceptadas: ['have our brakes checked'] },
      { frase: 'Somebody took his bike from the garden.', clave: 'HAD', antes: 'He', despues: 'from the garden.', aceptadas: ['had his bike taken'] },
      { frase: 'A dentist is going to take out her tooth on Monday.', clave: 'HAVING', antes: 'She is', despues: 'out on Monday.', aceptadas: ['having her tooth taken'] },
      { frase: 'I am going to ask somebody to clean the carpets.', clave: 'GET', antes: 'I am going to', despues: '.', aceptadas: ['get the carpets cleaned'] },
      { frase: 'Somebody translated the letter for them.', clave: 'GOT', antes: 'They', despues: 'for them.', aceptadas: ['got the letter translated'] },
      { frase: 'We are going to ask an electrician to put in new lights.', clave: 'HAVE', antes: 'We are going to', despues: 'put in.', aceptadas: ['have new lights'] }
    ]
  },

  'b2t4-gram11': {
    tipo: 'transformacion', titulo: 'Condicionales',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'He did not ask, so nobody helped him.', clave: 'HAD', antes: 'If he', despues: ', somebody would have helped him.', aceptadas: ['had asked'] },
      { frase: 'Leave now or you will miss it.', clave: 'UNLESS', antes: 'You will miss it', despues: 'now.', aceptadas: ['unless you leave'] },
      { frase: 'I cannot come because I am working on Saturday.', clave: 'WORKING', antes: 'If I', despues: 'on Saturday, I could come.', aceptadas: ["weren't working", 'was not working', 'were not working'] },
      { frase: 'She was late only because the bus broke down.', clave: 'NOT', antes: 'If the bus', despues: 'down, she would not have been late.', aceptadas: ['had not broken'] },
      { frase: 'Take some cash in case the card does not work.', clave: 'IF', antes: 'Take some cash', despues: 'work.', aceptadas: ['if the card does not', "if the card doesn't"] },
      { frase: 'You can stay as long as you help with the cooking.', clave: 'PROVIDED', antes: 'You can stay', despues: 'help with the cooking.', aceptadas: ['provided you'] }
    ]
  },

  'b2t4-gram12': {
    tipo: 'transformacion', titulo: 'Deseos y lamentos',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'I am sorry I said anything.', clave: 'WISH', antes: 'I', despues: 'anything.', aceptadas: ["wish I hadn't said", 'wish I had not said'] },
      { frase: 'It is a shame that I cannot drive.', clave: 'COULD', antes: 'I wish', despues: '.', aceptadas: ['I could drive'] },
      { frase: 'It is a pity the shop is closed.', clave: 'ONLY', antes: 'If', despues: 'open.', aceptadas: ['only the shop were', 'only the shop was'] },
      { frase: 'I regret not going to the meeting.', clave: 'GONE', antes: 'I wish I', despues: 'to the meeting.', aceptadas: ['had gone'] },
      { frase: 'We really ought to be leaving.', clave: 'WENT', antes: 'It is time', despues: '.', aceptadas: ['we went'] },
      { frase: 'I would prefer you not to tell her yet.', clave: 'RATHER', antes: 'I', despues: 'tell her yet.', aceptadas: ["would rather you didn't", 'would rather you did not'] }
    ]
  },

  'b2t4-gram13': {
    tipo: 'transformacion', titulo: 'Estilo indirecto',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: '"I am looking for a flat," she said.', clave: 'WAS', antes: 'She said', despues: 'for a flat.', aceptadas: ['she was looking'] },
      { frase: '"Please sit down," he said to them.', clave: 'TO', antes: 'He asked them', despues: 'down.', aceptadas: ['to sit'] },
      { frase: '"Why did you leave so early?" she asked him.', clave: 'HAD', antes: 'She asked him why', despues: 'so early.', aceptadas: ['he had left'] },
      { frase: '"It was not me," he said.', clave: 'DENIED', antes: 'He', despues: 'it.', aceptadas: ['denied doing'] },
      { frase: '"I will be there at eight," she said.', clave: 'PROMISED', antes: 'She', despues: 'at eight.', aceptadas: ['promised to be there'] },
      { frase: '"Why not go by train?" said Unai.', clave: 'SUGGESTED', antes: 'Unai', despues: 'by train.', aceptadas: ['suggested going'] }
    ]
  },

  'b2t4-gram14': {
    tipo: 'transformacion', titulo: 'Comparar y relativas',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'This is the longest book I have ever read.', clave: 'LONGER', antes: 'I have never read', despues: 'this one.', aceptadas: ['a longer book than'] },
      { frase: 'The exam was easier than I had expected.', clave: 'HARDER', antes: 'I had expected the exam', despues: 'it was.', aceptadas: ['to be harder than'] },
      { frase: 'She is the woman. Her brother sold us the car.', clave: 'WHOSE', antes: 'She is the woman', despues: 'us the car.', aceptadas: ['whose brother sold'] },
      { frase: 'That is the hotel. We stayed there in June.', clave: 'WHERE', antes: 'That is the hotel', despues: 'in June.', aceptadas: ['where we stayed'] },
      { frase: 'My neighbour works nights and he sleeps all afternoon.', clave: 'WHO', antes: 'My neighbour,', despues: 'nights, sleeps all afternoon.', aceptadas: ['who works'] },
      { frase: 'No other bakery in town is as good as this one.', clave: 'BEST', antes: 'This is', despues: 'in town.', aceptadas: ['the best bakery'] }
    ]
  },

  'b2t4-voc1': {
    tipo: 'caja', titulo: 'Preposiciones tras sustantivo · cuarta vuelta',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['about', 'between', 'for', 'from', 'in', 'of', 'on', 'to'],
    items: [
      { antes: 'There is a real need', despues: 'more nurses.', aceptadas: ['for'] },
      { antes: 'He has a strange attitude', despues: 'money.', aceptadas: ['to'] },
      { antes: 'The choice', despues: 'the two candidates was not easy.', aceptadas: ['between'] },
      { antes: 'She has a great deal of knowledge', despues: 'the area.', aceptadas: ['of', 'about'] },
      { antes: 'There was a sharp rise', despues: 'the number of complaints.', aceptadas: ['in'] },
      { antes: 'I got no reply', despues: 'either of my letters.', aceptadas: ['to'] }
    ]
  },

  'b2t4-voc2': {
    tipo: 'caja', titulo: 'Phrasal verbs · discutir y arreglar',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['away', 'back', 'down', 'in', 'off', 'on', 'out', 'up'],
    items: [
      { antes: 'They finally made', despues: 'after a fortnight.', aceptadas: ['up'] },
      { antes: 'He refused to back', despues: 'even when he was clearly wrong.', aceptadas: ['down'] },
      { antes: 'Let us sort this', despues: 'before we go home.', aceptadas: ['out'] },
      { antes: 'She walked', despues: 'in the middle of the argument.', aceptadas: ['away', 'out'] },
      { antes: 'The two of them fell', despues: 'over a parking space.', aceptadas: ['out'] },
      { antes: 'I had to give', despues: 'and let him drive.', aceptadas: ['in'] }
    ]
  },

  'b2t4-voc3': {
    tipo: 'caja', titulo: 'Adjetivos y su preposición · cuarta vuelta',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['about', 'at', 'for', 'from', 'in', 'of', 'on', 'to'],
    items: [
      { antes: 'He is hopeless', despues: 'directions.', aceptadas: ['at'] },
      { antes: 'She is very interested', despues: 'archaeology.', aceptadas: ['in'] },
      { antes: 'This one is identical', despues: 'the one we saw yesterday.', aceptadas: ['to'] },
      { antes: 'They were extremely rude', despues: 'the waiter.', aceptadas: ['to'] },
      { antes: 'They were worried', despues: 'the cost of the repair.', aceptadas: ['about'] },
      { antes: 'The whole village was proud', despues: 'her.', aceptadas: ['of'] }
    ]
  },

  'b2t4-voc4': {
    tipo: 'caja', titulo: 'Verbos con preposición fija · cuarta vuelta',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['about', 'for', 'from', 'in', 'of', 'on', 'to', 'with'],
    items: [
      { antes: 'Everything depends', despues: 'what she decides.', aceptadas: ['on'] },
      { antes: 'They accused him', despues: 'copying.', aceptadas: ['of'] },
      { antes: 'She insisted', despues: 'seeing the manager.', aceptadas: ['on'] },
      { antes: 'Nobody had told me', despues: 'the change of room.', aceptadas: ['about'] },
      { antes: 'The illness prevented him', despues: 'travelling.', aceptadas: ['from'] },
      { antes: 'I have never agreed', despues: 'him about that.', aceptadas: ['with'] }
    ]
  },

  'b2t4-voc5': {
    tipo: 'caja', titulo: 'Phrasal verbs · tiempo y planes',
    instruccion: 'Complete each sentence with a word from the box. There are more words than you need.',
    caja: ['back', 'down', 'forward', 'in', 'off', 'on', 'through', 'up'],
    items: [
      { antes: 'They put the wedding', despues: 'until September.', aceptadas: ['off'] },
      { antes: 'I am really looking', despues: 'to the summer.', aceptadas: ['forward'] },
      { antes: 'She turned', despues: 'twenty minutes late as usual.', aceptadas: ['up'] },
      { antes: 'The deal fell', despues: 'at the last minute.', aceptadas: ['through'] },
      { antes: 'We got', despues: 'from Lisbon on Sunday night.', aceptadas: ['back'] },
      { antes: 'Please go', despues: 'with what you were saying.', aceptadas: ['on'] }
    ]
  },

  'b2t4-voc6': {
    tipo: 'caja', titulo: 'Colocaciones · verbo y sustantivo · cuarta vuelta',
    instruccion: 'Complete each sentence with a verb from the box. There are more verbs than you need.',
    caja: ['break', 'catch', 'do', 'follow', 'keep', 'make', 'set', 'take'],
    items: [
      { antes: 'You should not', despues: 'a promise you have made.', aceptadas: ['break'] },
      { antes: 'You can rely on her to', despues: 'her word.', aceptadas: ['keep'] },
      { antes: 'Try to', despues: 'the instructions exactly.', aceptadas: ['follow'] },
      { antes: 'They plan to', despues: 'up a new company in June.', aceptadas: ['set'] },
      { antes: 'It is time to', despues: 'a decision about the flat.', aceptadas: ['make'] },
      { antes: 'He always refuses to', despues: 'the washing-up.', aceptadas: ['do'] }
    ]
  },

  'b2t4-voc7': {
    tipo: 'caja', titulo: 'Expresiones cotidianas · cuarta vuelta',
    instruccion: 'Complete each expression with a word from the box. There are more words than you need.',
    caja: ['clue', 'course', 'doubt', 'joke', 'mind', 'moment', 'shame', 'while'],
    items: [
      { antes: 'It is a real', despues: 'that you cannot come.', aceptadas: ['shame'] },
      { antes: 'I have no', despues: 'where I left it.', aceptadas: ['clue'] },
      { antes: 'She changed her', despues: 'at the last minute.', aceptadas: ['mind'] },
      { antes: 'Without a', despues: ', that is the best one.', aceptadas: ['doubt'] },
      { antes: 'Can you wait a', despues: '?', aceptadas: ['moment'] },
      { antes: 'It took us quite a', despues: 'to find the place.', aceptadas: ['while'] }
    ]
  },

  'b2t4-voc8': {
    tipo: 'cloze', titulo: 'Open cloze · las mudanzas de trabajo',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'The first week in a new job is the only week in which you are allowed to know nothing, and hardly anybody takes advantage {1} it. Instead people spend it pretending, which costs them the one fortnight in their whole employment when a stupid question is free.',
      'Part of the reason is that nobody explains the important things, because the important things are not written {2}. Where the good coffee is. Which of the two people with the same first name actually decides. Whether the Friday meeting matters or is simply {3} everybody has always gone. You can read the handbook twice and learn none of that.',
      'The people who settle fastest are not the cleverest. They are the ones who ask somebody to lunch in the first fortnight, {4} feels excruciating and works. By the third month you will have stopped noticing that the job was ever strange, and by the sixth you will be the person a new arrival is too embarrassed to ask, {5} is how the whole thing keeps going round {6} anybody deciding it should.'
    ],
    items: [
      { aceptadas: ['of'] }, { aceptadas: ['down'] }, { aceptadas: ['where', 'somewhere'] },
      { aceptadas: ['which'] }, { aceptadas: ['which'] }, { aceptadas: ['without'] }
    ]
  },

  'b2t4-voc9': {
    tipo: 'cloze', titulo: 'Open cloze · las plantas de casa',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Almost everybody kills their first houseplant, and almost everybody blames themselves for {1}. In fact the plant was probably doomed in the shop: it had been grown in a greenhouse in the Netherlands, flown two thousand kilometres and left {2} a draught by a door for eleven days before you ever saw it.',
      'The second one usually survives, and not because you have learned anything about plants. You have learned something about your flat: which window gets the afternoon, which corner is colder {3} it looks, and where the radiator dries the air out. That is local knowledge and nobody can give it {4} you.',
      'The advice in books is mostly about water, and it is mostly wrong for the same reason all general advice is wrong. More houseplants die of kindness {5} of neglect, and the single most useful thing anybody ever told me was to put my finger in the soil before doing anything {6} all.'
    ],
    items: [
      { aceptadas: ['it'] }, { aceptadas: ['in'] }, { aceptadas: ['than'] },
      { aceptadas: ['to'] }, { aceptadas: ['than'] }, { aceptadas: ['at'] }
    ]
  },

  'b2t4-voc10': {
    tipo: 'cloze', titulo: 'Open cloze · la libreta de vocabulario',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'The most useless thing a language student can own is a notebook full of words they have never said out {1}. Everybody has one. Mine ran to ninety pages, arranged by topic, colour-coded, and worth almost nothing, because a word you have written down is not a word you have got.',
      'What actually sticks is a word you needed. You wanted to buy a plug adaptor, you could {2} name it, you had to describe it with your hands for ninety seconds, and now you will remember that word for the rest of your life whether you like it {3} not. Nothing in a notebook is learned that way.',
      'This is not an argument against writing things {4}, which helps, but against believing that the writing is the learning. The list is a shopping list. It is {5} use at all until somebody goes to the shop, and the shop, unfortunately, is a conversation in {6} you are going to be slow and wrong in front of a stranger.'
    ],
    items: [
      { aceptadas: ['loud'] }, { aceptadas: ['not'] }, { aceptadas: ['or'] },
      { aceptadas: ['down'] }, { aceptadas: ['no'] }, { aceptadas: ['which'] }
    ]
  },

  'b2t4-voc11': {
    tipo: 'formacion', titulo: 'Word formation · nombres abstractos',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'His', despues: 'to help was obvious from the start.', raiz: 'WILLING', aceptadas: ['willingness'] },
      { antes: 'There is growing', despues: 'about the state of the building.', raiz: 'CONCERNED', aceptadas: ['concern'] },
      { antes: 'The', despues: 'of the new library is planned for May.', raiz: 'OPEN', aceptadas: ['opening'] },
      { antes: 'She spoke with great', despues: 'about her time there.', raiz: 'AFFECTIONATE', aceptadas: ['affection'] },
      { antes: 'The', despues: 'of the results took longer than expected.', raiz: 'ANALYSE', aceptadas: ['analysis'] },
      { antes: 'We were impressed by the', despues: 'of the service.', raiz: 'EFFICIENT', aceptadas: ['efficiency'] }
    ]
  },

  'b2t4-voc12': {
    tipo: 'formacion', titulo: 'Word formation · adjetivos',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The whole trip was extremely', despues: '.', raiz: 'ENJOY', aceptadas: ['enjoyable'] },
      { antes: 'He gave a rather', despues: 'account of the evening.', raiz: 'CONFUSE', aceptadas: ['confusing', 'confused'] },
      { antes: 'The instructions were admirably', despues: '.', raiz: 'HELP', aceptadas: ['helpful'] },
      { antes: 'It is a', despues: 'building from every angle.', raiz: 'BEAUTY', aceptadas: ['beautiful'] },
      { antes: 'The town was almost', despues: 'in February.', raiz: 'DESERT', aceptadas: ['deserted'] },
      { antes: 'She was very', despues: 'about the changes.', raiz: 'DOUBT', aceptadas: ['doubtful'] }
    ]
  },

  'b2t4-voc13': {
    tipo: 'formacion', titulo: 'Word formation · adjetivos en negativo',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The whole plan seems completely', despues: '.', raiz: 'REALISTIC', aceptadas: ['unrealistic'] },
      { antes: 'His answer was almost', despues: 'over the phone.', raiz: 'AUDIBLE', aceptadas: ['inaudible'] },
      { antes: 'She was clearly', despues: 'with the arrangements.', raiz: 'SATISFY', aceptadas: ['dissatisfied'] },
      { antes: 'The two statements are', despues: '.', raiz: 'CONSISTENT', aceptadas: ['inconsistent'] },
      { antes: 'It would be', despues: 'to leave before the end.', raiz: 'POLITE', aceptadas: ['impolite'] },
      { antes: 'The old lift is now', despues: '.', raiz: 'SAFE', aceptadas: ['unsafe'] }
    ]
  },

  'b2t4-voc14': {
    tipo: 'formacion', titulo: 'Word formation · personas y oficios',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'She has been a', despues: 'at the town hall for years.', raiz: 'RECEIVE', aceptadas: ['receptionist'] },
      { antes: 'The', despues: 'of the orchestra is Portuguese.', raiz: 'CONDUCT', aceptadas: ['conductor'] },
      { antes: 'He works as a', despues: 'for a Spanish paper.', raiz: 'REPORT', aceptadas: ['reporter'] },
      { antes: 'Six hundred', despues: 'visited the exhibition on Sunday.', raiz: 'VISIT', aceptadas: ['visitors'] },
      { antes: 'My brother is a', despues: 'in a school in Barakaldo.', raiz: 'TEACH', aceptadas: ['teacher'] },
      { antes: 'The', despues: 'of the company still comes in on Fridays.', raiz: 'OWN', aceptadas: ['owner'] }
    ]
  },

  'b2t4-use1': {
    tipo: 'opcion', parte: 1, titulo: 'Use of English · Part 1',
    instruccion: 'Decide which answer best fits each gap.',
    texto: [
      'The night bus is the only form of public transport that people feel they have to {1} for. Nobody makes excuses about a tram. But the last bus home has a reputation, most of it earned in about four minutes of a four-hour shift, and the drivers gave {2} trying to correct it years ago.',
      'What the reputation misses is who is actually on board. At half past two on a Saturday the bus is mostly {3} up of people going to work: cleaners, bakers, two nurses and a man who opens a fish market at four. They are not out enjoying themselves. They are commuting, at the only hour the timetable {4} open to them, and they happen to be sharing the journey with a small number of people who have had a very long evening.',
      'Cutting these routes is always presented as a saving, and it always {5} out to be a transfer. Take the bus away and the cleaner takes a taxi she cannot {6}, or she leaves the job. This is not an argument that wins council meetings, because the people who need the route are asleep while the meeting is {7} and at work when the consultation closes. It would be far easier to defend the night bus if the people it {8} had time to turn up and say so.'
    ],
    items: [
      { opciones: ['excuse', 'apologise', 'regret', 'explain'], correcta: 1 },
      { opciones: ['off', 'in', 'up', 'over'], correcta: 2 },
      { opciones: ['made', 'built', 'put', 'set'], correcta: 0 },
      { opciones: ['gives', 'offers', 'leaves', 'lets'], correcta: 2 },
      { opciones: ['comes', 'works', 'turns', 'ends'], correcta: 2 },
      { opciones: ['pay', 'spend', 'afford', 'cost'], correcta: 2 },
      { opciones: ['made', 'held', 'done', 'taken'], correcta: 1 },
      { opciones: ['helps', 'works', 'carries', 'serves'], correcta: 3 }
    ]
  },

  'b2t4-use2a': {
    tipo: 'cloze', parte: 2, titulo: 'Use of English · Part 2',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'There is no good moment to learn to cook, to swim or to drive, which is {1} so many people arrive at forty having done none of the three. Each of them is easiest at nine, unpleasant at nineteen and faintly humiliating at thirty-nine, and the humiliation is the whole {2} the barrier.',
      'It is worth being precise about what the embarrassment actually is. It is not that the task is hard; it is that you will be visibly bad at something in {3} of other adults, and adults have almost no practice at that. Children are bad at things all day long and think nothing {4} it. Somewhere between twelve and twenty we lose the habit, and by thirty we have arranged our lives {5} that we are never seen struggling.',
      'The way through is not confidence, {6} nobody has any at the start. It is choosing a room where being bad is normal. An adult beginners’ class works precisely because everybody in it is equally hopeless, {7} the six weeks of feeling foolish get shared out. Nobody there is watching you as closely {8} you think, because they are all much too busy being watched themselves.'
    ],
    items: [
      { aceptadas: ['why'] }, { aceptadas: ['of'] }, { aceptadas: ['front'] },
      { aceptadas: ['of'] }, { aceptadas: ['so'] },
      { aceptadas: ['because', 'since', 'as'] }, { aceptadas: ['and'] },
      { aceptadas: ['as'] }
    ]
  },

  'b2t4-use2b': {
    tipo: 'cloze', parte: 2, titulo: 'Use of English · Part 2 (extra)',
    instruccion: 'Write <b>one word</b> in each gap.',
    texto: [
      'Nobody has ever been persuaded {1} anything by being told that they are wrong, and yet it remains the method almost everybody uses. The evidence {2} this has been consistent for fifty years and has had no effect at all on how arguments are conducted at family dinners.',
      'What does occasionally work is much slower and a great deal less satisfying. You ask what somebody actually believes, in their own words, and then you ask {3} they came to think it, and you listen to the answer without preparing your reply. Almost nobody can manage that for more {4} ninety seconds, because it feels like losing. It is not losing; it is the only part of the conversation {5} has ever changed a mind.',
      'The other thing that helps is time. People do change their views, quite often, but almost never in the room {6} they are being challenged. They change them a fortnight later, in private, they never mention it, and they certainly never give you the credit. If you need the credit, you are not really trying to persuade anybody: you are trying to win, {7} is a different activity {8} a much worse success rate.'
    ],
    items: [
      { aceptadas: ['of'] }, { aceptadas: ['on'] }, { aceptadas: ['how', 'why'] },
      { aceptadas: ['than'] }, { aceptadas: ['that', 'which'] }, { aceptadas: ['where'] },
      { aceptadas: ['which'] }, { aceptadas: ['with'] }
    ]
  },

  'b2t4-use3': {
    tipo: 'formacion', parte: 3, titulo: 'Use of English · Part 3',
    instruccion: 'Use the word given in capitals to form a word that fits in the gap.',
    items: [
      { antes: 'The', despues: 'of the scheme has been widely praised.', raiz: 'SUCCEED', aceptadas: ['success'] },
      { antes: 'He explained the rules very', despues: '.', raiz: 'CLEAR', aceptadas: ['clearly'] },
      { antes: 'There has been a marked', despues: 'in the number of accidents.', raiz: 'REDUCE', aceptadas: ['reduction'] },
      { antes: 'The report was long and not particularly', despues: '.', raiz: 'USE', aceptadas: ['useful'] },
      { antes: 'Her', despues: 'of Italian is better than she admits.', raiz: 'KNOW', aceptadas: ['knowledge'] },
      { antes: 'The two designs are almost', despues: '.', raiz: 'IDENTITY', aceptadas: ['identical'] },
      { antes: 'They dealt with the complaint extremely', despues: '.', raiz: 'EFFICIENT', aceptadas: ['efficiently'] },
      { antes: 'His', despues: 'to sign the contract surprised nobody.', raiz: 'REFUSE', aceptadas: ['refusal'] }
    ]
  },

  'b2t4-use4a': {
    tipo: 'transformacion', parte: 4, titulo: 'Use of English · Part 4',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'The fog stopped the plane from landing.', clave: 'PREVENTED', antes: 'The fog', despues: 'landing.', aceptadas: ['prevented the plane from'] },
      { frase: 'I have never stayed in a nicer hotel.', clave: 'NICEST', antes: 'It is', despues: 'I have ever stayed in.', aceptadas: ['the nicest hotel'] },
      { frase: 'It is pointless arguing with him.', clave: 'POINT', antes: 'There', despues: 'arguing with him.', aceptadas: ['is no point in', "'s no point in"] },
      { frase: 'Nobody knows why she resigned.', clave: 'IDEA', antes: 'Nobody', despues: 'she resigned.', aceptadas: ['has any idea why'] },
      { frase: 'He plays much better than I do.', clave: 'NEARLY', antes: 'I cannot play', despues: 'he can.', aceptadas: ['nearly as well as'] },
      { frase: 'They only told us this morning.', clave: 'UNTIL', antes: 'We', despues: 'this morning.', aceptadas: ["weren't told until", 'were not told until'] }
    ]
  },

  'b2t4-use4b': {
    tipo: 'transformacion', parte: 4, titulo: 'Use of English · Part 4 (extra)',
    instruccion: 'Complete the second sentence so that it has a similar meaning to the first, using the word given. Use <b>between two and five words</b>, including the word given.',
    items: [
      { frase: 'The queue was so long that we gave up.', clave: 'SUCH', antes: 'It', despues: 'that we gave up.', aceptadas: ['was such a long queue'] },
      { frase: 'I am sorry I did not take your advice.', clave: 'WISH', antes: 'I', despues: 'your advice.', aceptadas: ['wish I had taken'] },
      { frase: 'Somebody has to send these letters today.', clave: 'BE', antes: 'These letters', despues: 'today.', aceptadas: ['have to be sent'] },
      { frase: 'She is not experienced enough to lead the team.', clave: 'TOO', antes: 'She', despues: 'to lead the team.', aceptadas: ['is too inexperienced'] },
      { frase: 'He did not warn me, so I was late.', clave: 'HAD', antes: 'If he', despues: 'me, I would not have been late.', aceptadas: ['had warned'] },
      { frase: '"You ought to take a break," she said to him.', clave: 'ADVISED', antes: 'She', despues: 'a break.', aceptadas: ['advised him to take'] }
    ]
  },

  'b2t4-read5': {
    tipo: 'lectura', parte: 5, titulo: 'Reading · Part 5',
    instruccion: 'Read the text and choose the best answer (A, B, C or D) for each question.',
    tituloTexto: 'The woman who answers the phone at three in the morning',
    texto: [
      'The office is one room above a launderette in Cardiff, and there are four telephones in it, of which two ever ring. Megan Prosser has been taking calls on the night shift for eleven years. She works from ten until six, alone for most of it, and the busiest hour of her week is between two and three on a Sunday morning.',
      'She is careful, in the first five minutes of our conversation, to correct two things. She is not a counsellor, and she says so to every caller within the first minute. And the line is not, as the local paper described it last year, a crisis line. "Most of the people who ring me are not in crisis," she says. "They are awake, and it is three o’clock, and there is nobody else. That is a different thing, and treating it as an emergency makes it worse."',
      'The training took four months and most of it, she says, was about not helping. New volunteers arrive wanting to solve things, and the instinct is almost impossible to remove. "Somebody tells you their marriage has ended and every part of you wants to say something useful. There is nothing useful. What there is, is another person awake at the same time as you, and that turns out to be the entire service."',
      'She keeps no notes and learns no names, which is policy and which she describes as the hardest part. People ring back — she can hear it in a voice — and she is not permitted to say so, because the moment a caller becomes a regular the line stops being what it is. She accepts the reasoning completely and says it still costs her something every time.',
      'The charity that runs the line has been asked repeatedly to measure what it does, and has never found a way that satisfies anybody. Calls answered is a number, but it is not the number. Prosser suggests, with a slight shrug, that the only honest measure would be how many people put the phone down and went to sleep, which nobody can know. The funders have accepted this for eleven years, which she says is more generous than she would have expected.',
      'She has three years left before she stops. She talks about it without any obvious reluctance and then says one thing that seems to cost her more: that the line will need somebody to do Sunday nights, and that Sunday nights are the reason most volunteers leave. She has never persuaded anybody to take one on, and she has stopped trying, and she thinks the honest description of the problem is better recruitment than any amount of encouragement.'
    ],
    items: [
      { pregunta: '1  Why does Prosser object to the phrase "crisis line"?',
        opciones: ['It puts people off ringing at all.',
                   'It misdescribes most of the calls she takes.',
                   'It suggests she has training she does not have.',
                   'It was invented by the local newspaper.'], correcta: 1 },
      { pregunta: '2  What does she say the training was mainly about?',
        opciones: ['Recognising when a caller is at risk.',
                   'Learning what the charity will and will not allow.',
                   'Resisting the urge to offer solutions.',
                   'Keeping calls to a reasonable length.'], correcta: 2 },
      { pregunta: '3  What does she say the service actually consists of?',
        opciones: ['Giving people practical advice at a difficult hour.',
                   'Being awake at the same time as somebody else.',
                   'Directing callers to organisations that can help.',
                   'Listening until a caller has calmed down.'], correcta: 1 },
      { pregunta: '4  How does she feel about the rule on keeping no records?',
        opciones: ['She agrees with it and still finds it difficult.',
                   'She thinks it should be changed for regular callers.',
                   'She often ignores it in practice.',
                   'She believes it protects the volunteers more than the callers.'], correcta: 0 },
      { pregunta: '5  What is the difficulty with measuring the service?',
        opciones: ['The charity does not collect enough information.',
                   'The funders keep changing what they ask for.',
                   'The thing that matters cannot be counted.',
                   'Volunteers disagree about what success would mean.'], correcta: 2 },
      { pregunta: '6  What does she suggest about finding her replacement?',
        opciones: ['Volunteers should be paid for night shifts.',
                   'The shift should be shared between two people.',
                   'She intends to keep working until somebody is found.',
                   'Being honest about the shift would work better than encouraging people.'], correcta: 3 }
    ]
  },

  'b2t4-read6': {
    tipo: 'lectura', parte: 6, titulo: 'Reading · Part 6',
    instruccion: 'Six sentences have been removed from the text. Choose from the sentences A–G the one which fits each gap. There is one extra sentence which you do not need to use.',
    tituloTexto: 'The football club that its supporters bought',
    texto: [
      'In 2009 a fourth-division club in the north of England had eleven days to find two hundred thousand pounds or stop existing. {1} What happened instead has been written about a great deal, usually badly, and the club itself has spent fifteen years trying to correct the story.',
      'The version that gets told is that the fans rose up and saved their club. The version the club prefers is duller and more useful. Four supporters with accountancy backgrounds spent nine days in a solicitor’s office. {2} The singing outside the ground made no difference at all to the outcome, although it made the photographs.',
      'The ownership model that came out of it is not complicated. Anybody can buy one share, one share is the maximum, and every shareholder has one vote regardless of anything. {3} It is deliberately arranged so that no rich person can ever rescue them again.',
      'This has costs, and the club is unusually willing to list them. They have been promoted once and relegated twice since 2009. {4} A manager they liked left for a club that could pay him nearly four times as much, and there was nothing anybody could do and nobody pretended otherwise.',
      'What they have instead is a ground they own, no debt, and a season ticket that has risen by less than inflation for fifteen years. {5} The average age of the crowd has fallen every year since 2012, which in this division is close to unheard of.',
      'Other clubs send delegations, and the chairman — who is elected, and who drives a delivery van — is blunt with them. {6} He says the question is not whether supporter ownership works, because it plainly does, but whether a club is prepared to accept the ceiling that comes with it, and that most of the people who ask him are not.'
    ],
    secciones: [
      { letra: 'A', texto: ['Nobody in the boardroom expected the money to be found, and privately most of the supporters did not either.'] },
      { letra: 'B', texto: ['They will almost certainly never play in the top two divisions again, and everybody involved knows this.'] },
      { letra: 'C', texto: ['Attendances are now more than double what they were in the last season under the old owner.'] },
      { letra: 'D', texto: ['That means the man with four thousand pounds and the student with twenty have exactly the same say.'] },
      { letra: 'E', texto: ['The stadium was sold to a property company in 2007 and leased back on terms nobody had read carefully.'] },
      { letra: 'F', texto: ['What actually saved it was a rescue structure that most of the people cheering outside did not understand.'] },
      { letra: 'G', texto: ['He tells them that the model would have failed at a club with a larger wage bill and a smaller town.'] }
    ],
    opcionesCortas: true,
    items: [
      { pregunta: '1', opciones: ['A','B','C','D','E','F','G'], correcta: 0 },
      { pregunta: '2', opciones: ['A','B','C','D','E','F','G'], correcta: 5 },
      { pregunta: '3', opciones: ['A','B','C','D','E','F','G'], correcta: 3 },
      { pregunta: '4', opciones: ['A','B','C','D','E','F','G'], correcta: 1 },
      { pregunta: '5', opciones: ['A','B','C','D','E','F','G'], correcta: 2 },
      { pregunta: '6', opciones: ['A','B','C','D','E','F','G'], correcta: 6 }
    ]
  },

  'b2t4-read7': {
    tipo: 'lectura', parte: 7, titulo: 'Reading · Part 7',
    instruccion: 'You are going to read an article in which four people describe a hobby they have kept for a long time. For each question, choose from the people A–D. The people may be chosen more than once.',
    opcionesCortas: true,
    secciones: [
      { letra: 'A', titulo: 'Eneko, sea swimming',
        texto: ['Twenty-two years, every week, in water that is eleven degrees in February. People want it to be about willpower and it is the opposite: the whole point is that once you are in, there is nothing to decide. I go with the same four people and two of them I have never seen outside a beach car park, which sounds sad and is not. I do not talk about the health benefits, partly because I am not sure about them and partly because that is not why anybody goes.'] },
      { letra: 'B', titulo: 'Ruth, keeping bees',
        texto: ['I have had hives for nineteen years and I lose colonies most winters, and it still upsets me every time. The mistake beginners make is thinking it is like gardening. It is not: you are looking after something that makes its own decisions and will simply leave if it does not like the arrangement. I sell a little honey to neighbours at a price that does not cover the equipment, which my husband finds very funny.'] },
      { letra: 'C', titulo: 'Piotr, model railways',
        texto: ['I started at eleven and I am fifty-eight, and there was a gap of about fourteen years in the middle when I had small children and no room. What I did not expect was how easy it was to come back. The layout was in my mother’s loft, most of it still worked, and the part of my brain that knew how to do it had apparently been waiting. I show people photographs now and they are politer about it than they used to be, which I put down to the internet.'] },
      { letra: 'D', titulo: 'Aoife, choral singing',
        texto: ['I am not a good singer and that took me about five years to say out loud without shame. In a choir of sixty it does not matter, and that is exactly what nobody understands until they have done it: you are not a soloist who happens to be in a group, you are one part of a single thing. We rehearse on Tuesdays whether anybody feels like it or not, and I would say the whether-you-feel-like-it-or-not is where all of it comes from.'] }
    ],
    items: [
      { pregunta: '1  Who says that having no choice is part of the appeal?',
        opciones: ['A','B','C','D'], correcta: 0 },
      { pregunta: '2  Who mentions a long break before returning to the hobby?',
        opciones: ['A','B','C','D'], correcta: 2 },
      { pregunta: '3  Who admits that losses still affect them after many years?',
        opciones: ['A','B','C','D'], correcta: 1 },
      { pregunta: '4  Who took a long time to admit something about their own ability?',
        opciones: ['A','B','C','D'], correcta: 3 },
      { pregunta: '5  Who says the money side makes no sense?',
        opciones: ['A','B','C','D'], correcta: 1 },
      { pregunta: '6  Who values the regular routine above how they feel on the day?',
        opciones: ['A','B','C','D'], correcta: 3 },
      { pregunta: '7  Who mentions friendships that exist only within the activity?',
        opciones: ['A','B','C','D'], correcta: 0 },
      { pregunta: '8  Who was surprised at how much they had remembered?',
        opciones: ['A','B','C','D'], correcta: 2 },
      { pregunta: '9  Who corrects a common comparison people make?',
        opciones: ['A','B','C','D'], correcta: 1 },
      { pregunta: '10  Who has noticed that other people now react differently?',
        opciones: ['A','B','C','D'], correcta: 2 }
    ]
  },

  'b2t4-lis1': {
    tipo: 'listening', parte: 1, titulo: 'Listening · Part 1',
    instruccion: 'You will hear people talking in eight different situations. Choose the answer (A, B or C) which fits best according to what you hear. <b>You will hear the recording twice.</b>',
    audio: 'audio/b2t4-lis1-espeak.mp3', escuchas: 2, demo: true,
    contexto: 'Eight short extracts, one question each.',
    items: [
      { pregunta: '1  How does the woman feel about her own reaction?',
        opciones: ['She has become the kind of person she did not want to be.', 'She regrets not filming any of it herself.', 'She blames the venue rather than the audience.'], correcta: 0 },
      { pregunta: '2  What does the man say about the job advertisement?',
        opciones: ['She should get the other two skills first.', 'Employers list more than they expect to find.', 'The job is probably already taken.'], correcta: 1 },
      { pregunta: '3  Why is the man leaving the message?',
        opciones: ['To ask his friend to bring some food.', 'To warn that Saturday may be cancelled.', 'To stop his friend buying anything.'], correcta: 2 },
      { pregunta: '4  What surprised the woman about the garden project?',
        opciones: ['How much food it produced.', 'Who turned out to want it.', 'How little it cost to run.'], correcta: 1 },
      { pregunta: '5  Why does the woman want to mention the bill?',
        opciones: ['She thinks the restaurant does it deliberately.', 'The amount is larger than her friend realises.', 'Letting it go would bother her for days.'], correcta: 2 },
      { pregunta: '6  What does the man say about the book?',
        opciones: ['He would not recommend it to anybody.', 'It asked more of him than a book should.', 'It improved steadily from the first page.'], correcta: 1 },
      { pregunta: '7  What does the woman admit about her studying?',
        opciones: ['She chose the comfortable half of the language.', 'She has not put in enough hours.', 'Her teacher was too hard on her.'], correcta: 0 },
      { pregunta: '8  What does the woman think about the walk?',
        opciones: ['The whole day was spoilt from the start.', 'She would do the same route again.', 'The end of it is what stayed with her.'], correcta: 2 }
    ]
  },

  'b2t4-lis2': {
    tipo: 'listening', parte: 2, titulo: 'Listening · Part 2',
    instruccion: 'Complete the sentences with <b>a word or short phrase</b> from what you hear. <b>You will hear the recording twice.</b>',
    audio: 'audio/b2t4-lis2-espeak.mp3', escuchas: 2, demo: true,
    contexto: 'Cara Nolan talks about her work training guide dogs.',
    items: [
      { antes: 'Before this work, Cara spent six years in a', despues: '.', aceptadas: ['veterinary practice', 'vets', 'vet practice'] },
      { antes: 'The dogs stay with a volunteer family until they are', despues: 'old.', aceptadas: ['fourteen months', '14 months'] },
      { antes: 'The quality she is really looking for in a dog is', despues: '.', aceptadas: ['confidence'] },
      { antes: 'Roughly', despues: 'of the dogs do not finish the programme.', aceptadas: ['half', 'a half'] },
      { antes: 'The hardest thing to teach a dog is how to', despues: 'an instruction.', aceptadas: ['refuse', 'disobey'] },
      { antes: 'From the day they arrive, the full training takes', despues: '.', aceptadas: ['eighteen months', '18 months'] },
      { antes: 'The commonest reason a dog does not make it is', despues: '.', aceptadas: ['noise'] },
      { antes: 'Cara says the hardest part of her job is the', despues: '.', aceptadas: ['handover'] },
      { antes: 'What worries her most is the length of the', despues: '.', aceptadas: ['waiting list'] },
      { antes: 'The real shortage, she says, is of volunteer', despues: '.', aceptadas: ['families'] }
    ]
  },

  'b2t4-lis3': {
    tipo: 'listening', parte: 3, titulo: 'Listening · Part 3',
    instruccion: 'You will hear five short extracts in which people talk about a piece of advice they were given. Choose from the list A–H what each speaker says. Use each letter once. There are three extra letters. <b>You will hear the recording twice.</b>',
    audio: 'audio/b2t4-lis3-espeak.mp3', escuchas: 2, demo: true,
    opcionesCortas: true,
    listas: [
      { titulo: 'What does each speaker say about the advice?', opciones: [
        'It came from somebody I hardly knew.',
        'I have passed it on to my own family.',
        'It went against what everybody else was saying.',
        'It was given to me at a very bad moment.',
        'I ignored it and paid for it later.',
        'I followed it and it turned out to be wrong.',
        'It only made sense to me many years afterwards.',
        'It was entirely about money.'
      ] }
    ],
    items: [
      { pregunta: '1  Speaker 1', opciones: ['A','B','C','D','E','F','G','H'], correcta: 2 },
      { pregunta: '2  Speaker 2', opciones: ['A','B','C','D','E','F','G','H'], correcta: 4 },
      { pregunta: '3  Speaker 3', opciones: ['A','B','C','D','E','F','G','H'], correcta: 0 },
      { pregunta: '4  Speaker 4', opciones: ['A','B','C','D','E','F','G','H'], correcta: 6 },
      { pregunta: '5  Speaker 5', opciones: ['A','B','C','D','E','F','G','H'], correcta: 1 }
    ]
  },

  'b2t4-lis4': {
    tipo: 'listening', parte: 4, titulo: 'Listening · Part 4',
    instruccion: 'You will hear an interview. Choose the answer (A, B, C or D) which fits best according to what you hear. <b>You will hear the recording twice.</b>',
    audio: 'audio/b2t4-lis4-espeak.mp3', escuchas: 2, demo: true,
    contexto: 'A journalist interviews Daniel Okoro, who interprets in criminal courts.',
    items: [
      { pregunta: '1  What had Daniel assumed before he applied?',
        opciones: ['That the work would not interest him.', 'That speaking two languages was enough on its own.', 'That there were no vacancies in his area.', 'That the training would be very short.'], correcta: 1 },
      { pregunta: '2  What does he say people get wrong about the job?',
        opciones: ['They think it is about words rather than rules.', 'They think it is badly paid.', 'They think anybody can be trained to do it.', 'They think it happens mostly in writing.'], correcta: 0 },
      { pregunta: '3  Why does he find speaking in the first person so hard?',
        opciones: ['The sentences are often very long.', 'It slows the proceedings down.', 'Every instinct is to put distance between himself and the words.', 'Judges frequently object to it.'], correcta: 2 },
      { pregunta: '4  What is the commonest reason an interpreter is removed from a case?',
        opciones: ['Arriving late.', 'Mistranslating a technical term.', 'Discussing the case afterwards.', 'Trying to help somebody understand.'], correcta: 3 },
      { pregunta: '5  What is his view of working by video link?',
        opciones: ['He would prefer to go back to the old way.', 'It saves money at no real cost.', 'He accepts it, but thinks something is lost.', 'It has made the work far more tiring.'], correcta: 2 },
      { pregunta: '6  What does he say is behind the shortage of interpreters?',
        opciones: ['The training is too long.', 'The pay has not changed in ten years.', 'Too few people speak the languages needed.', 'The recruitment campaigns are badly designed.'], correcta: 1 },
      { pregunta: '7  What does he want people to understand about the work?',
        opciones: ['That it should be far better recognised.', 'That mistakes are more common than anybody admits.', 'That done well, it goes unnoticed.', 'That it is more stressful than most legal work.'], correcta: 2 }
    ]
  },

  'b2t4-speak1': {
    tipo: 'speaking', parte: 2, titulo: 'Long turn: dos maneras de estudiar juntos',
    instruccion: 'Habla durante <b>un minuto seguido</b>. Compara las dos situaciones: no las describas una detrás de otra.',
    segundos: 60,
    pregunta: 'Compare these two situations and say what might be difficult about each.',
    puntos: ['four students working together round one table', 'somebody studying alone in their bedroom at night'],
    nota: 'En el examen esto se hace con dos fotografías y hay una segunda pregunta corta al final. Aquí van descritas mientras la academia no aporte las suyas.',
    items: [ { grabacion: true } ]
  },

  'b2t4-speak3': {
    tipo: 'speaking', parte: 3, titulo: 'Parte 3: decidir en voz alta',
    instruccion: 'Habla durante <b>dos minutos</b>. Comenta las cinco ideas y termina eligiendo una.',
    segundos: 120,
    pregunta: 'A town wants to make it easier for older people to keep living in their own homes. How much would each of these help, and which would help most?',
    puntos: ['more benches and public toilets in the centre', 'a shopping delivery service', 'free bus travel', 'somebody to visit once a week', 'classes on using a phone and the internet'],
    nota: 'En el examen esto se habla con otro candidato: se negocia y se llega a un acuerdo. Grabándote solo se practica todo menos eso, que es un criterio entero.',
    items: [ { grabacion: true } ]
  },

  'b2t4-speak4': {
    tipo: 'speaking', parte: 4, titulo: 'Parte 4: opinar y justificar',
    instruccion: 'Contesta a las tres preguntas seguidas, <b>dos minutos</b> en total.',
    segundos: 120,
    pregunta: 'Questions about growing older and about help.',
    puntos: [
      'Do young and old people spend enough time together where you live?',
      'Some people say it is hard to ask for help. Why do you think that is?',
      'Should families or the state look after older people? Why?'
    ],
    nota: 'En el examen el examinador pregunta y luego te pide que reacciones a lo que ha dicho la otra persona. Aquí solo está la primera mitad.',
    items: [ { grabacion: true } ]
  },

  'b2t4-write1': {
    tipo: 'writing', parte: 1, titulo: 'Essay',
    instruccion: 'Escribe entre <b>140 y 190 palabras</b>. Es obligatorio: en el examen esta tarea no se elige.',
    minutos: 40, palabras: [140, 190],
    enunciado: 'In your English class you have been talking about volunteering. Now your teacher has asked you to write an essay. Do you agree that every student should do some voluntary work before leaving school?',
    contexto: 'Notes. Write about: 1 · what students would learn · 2 · time and studies · 3 ... (your own idea).',
    cierre: 'Write in a fairly formal style. Use both of the given notes and add one idea of your own.',
    items: [ { escrito: true } ]
  },

  'b2t4-write2': {
    tipo: 'writing', parte: 2, titulo: 'A elegir: artículo, correo o informe',
    instruccion: 'Elige <b>una</b> de las tres y escribe entre <b>140 y 190 palabras</b>.',
    minutos: 40, palabras: [140, 190],
    enunciado: 'Choose one of the following three tasks.',
    contexto: '1 · An English-language magazine has asked readers for articles under the title "The best advice I have ever been given". Write your article.\n2 · A friend from England is thinking of spending a year working in your town and has asked what it is really like. Write an email answering their questions honestly.\n3 · Your school or company asked students to try a new timetable for a month. Write a report saying what worked, what did not, and what you recommend.',
    cierre: 'El artículo va en primera persona y necesita una historia concreta, no una lista. El correo informal contesta a lo que te han preguntado. El informe lleva encabezados y termina con una recomendación clara.',
    items: [ { escrito: true } ]
  },

  }
};
