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
 * practica-notas.md.
 *
 * Un bloque sin `ejercicios` esta pendiente de volcar: se ensena en la receta
 * de la sesion para que se vea la forma real de la clase.
 */
window.WELL_PRACTICA = {
  version: 3,
  dominioParaAbrir: 0.7,

  examen: { id: 'cae', nombre: 'C1 Advanced', sigla: 'CAE' },

  /* Las cinco que puntuan son las que informa Cambridge. Vocabulario y
     gramatica son entrenamiento: se hacen todas las sesiones y no dan nota. */
  destrezas: [
    { id: 'use',         nombre: 'Use of English', puntua: true },
    { id: 'reading',     nombre: 'Reading',        puntua: true },
    { id: 'listening',   nombre: 'Listening',      puntua: true },
    { id: 'writing',     nombre: 'Writing',        puntua: true, humana: true },
    { id: 'speaking',    nombre: 'Speaking',       puntua: true, humana: true },
    { id: 'vocabulario', nombre: 'Vocabulario',    puntua: false },
    { id: 'gramatica',   nombre: 'Gramática',      puntua: false }
  ],

  tests: [
    {
      id: 't1',
      titulo: 'Test 1',
      sesiones: [
        { id: 't1-s1', n: 1, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['v1-caja', 'v2-caja'] },
          { destreza: 'gramatica' },
          { destreza: 'use', parte: 1, tarea: 'Multiple-choice cloze' },
          { destreza: 'listening', parte: 1, tarea: 'Tres extractos' }
        ]},
        { id: 't1-s2', n: 2, tipo: 'B', bloques: [
          { destreza: 'vocabulario' },
          { destreza: 'gramatica' },
          { destreza: 'reading', parte: 5, tarea: 'Multiple choice' },
          { destreza: 'speaking', tarea: 'Partes 1 y 2' }
        ]},
        { id: 't1-s3', n: 3, tipo: 'A', bloques: [
          { destreza: 'vocabulario' },
          { destreza: 'gramatica' },
          { destreza: 'use', parte: 2, tarea: 'Open cloze', ejercicios: ['v1-cloze', 'v2-cloze'] },
          { destreza: 'listening', parte: 2, tarea: 'Frases incompletas' }
        ]},
        { id: 't1-s4', n: 4, tipo: 'B', bloques: [
          { destreza: 'vocabulario' },
          { destreza: 'gramatica' },
          { destreza: 'reading', parte: 6, tarea: 'Cross-text matching' },
          { destreza: 'speaking', tarea: 'Parte 3' }
        ]},
        { id: 't1-s5', n: 5, tipo: 'A', bloques: [
          { destreza: 'vocabulario' },
          { destreza: 'gramatica' },
          { destreza: 'use', parte: 3, tarea: 'Word formation', ejercicios: ['v1-formacion'] },
          { destreza: 'listening', parte: 3, tarea: 'Conversación larga' }
        ]},
        { id: 't1-s6', n: 6, tipo: 'B', bloques: [
          { destreza: 'vocabulario' },
          { destreza: 'gramatica' },
          { destreza: 'reading', parte: 7, tarea: 'Gapped text' },
          { destreza: 'speaking', tarea: 'Parte 4' }
        ]},
        { id: 't1-s7', n: 7, tipo: 'A', bloques: [
          { destreza: 'vocabulario' },
          { destreza: 'gramatica' },
          { destreza: 'use', parte: 4, tarea: 'Key word transformation', ejercicios: ['v1-transf', 'v2-transf'] },
          { destreza: 'listening', parte: 4, tarea: 'Multiple matching' }
        ]},
        { id: 't1-s8', n: 8, tipo: 'B', bloques: [
          { destreza: 'vocabulario' },
          { destreza: 'gramatica' },
          { destreza: 'reading', parte: 8, tarea: 'Multiple matching' },
          { destreza: 'speaking', tarea: 'Repaso' }
        ]},
        { id: 't1-s9', n: 9, tipo: 'W', bloques: [
          { destreza: 'writing', parte: 1, tarea: 'Essay (obligatorio)' },
          { destreza: 'writing', parte: 2, tarea: 'A elegir' }
        ]}
      ]
    },
    { id: 't2', titulo: 'Test 2' },
    { id: 't3', titulo: 'Test 3' },
    { id: 't4', titulo: 'Test 4' }
  ],

  ejercicios: {
    "v1-caja": {
      "tipo": "caja",
      "titulo": "Adjetivos y verbos con preposición",
      "instruccion": "Completa cada frase con una palabra de la caja. Sobra una.",
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
      "instruccion": "Escribe <b>una sola palabra</b> en cada hueco.",
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
      "instruccion": "Usa la palabra de la derecha para formar la que encaja en el hueco.",
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
      "instruccion": "Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.",
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
      "instruccion": "Completa cada frase con una palabra de la caja. Sobra una.",
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
      "instruccion": "Escribe <b>una sola palabra</b> en cada hueco.",
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
      "instruccion": "Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.",
      "items": [
        {
          "frase": "\"I'm sorry I didn't call you,\" he said.",
          "clave": "APOLOGISED",
          "antes": "He",
          "despues": "me.",
          "aceptadas": [
            "apologised for not calling",
            "apologized for not calling"
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
    }
  }
};
