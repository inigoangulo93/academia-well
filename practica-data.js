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

  examen: { id: 'cae', nombre: 'C1 Advanced', sigla: 'CAE' },

  /* Minutos de cada simulacro. OJO: en el examen real, Reading y Use of
     English son UN SOLO papel de 90 minutos; este reparto es una estimacion de
     la academia para poder cronometrar cada mitad por separado.
     Elena tiene que confirmarlo. */
  minutos: { use: 45, reading: 45, listening: 40 },

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
      id: 't1',
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
      id: 't2', titulo: 'Test 2',
      sesiones: [
        { id: 't2-s1', n: 1, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t2-voc1', 't2-voc2'] },
          { destreza: 'gramatica', ejercicios: ['t2-gram1', 't2-gram2'] },
          { destreza: 'use', parte: 1, tarea: 'Multiple-choice cloze' },
          { destreza: 'listening', parte: 1, tarea: 'Tres extractos' }
        ] },
        { id: 't2-s2', n: 2, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t2-voc3', 't2-voc4'] },
          { destreza: 'gramatica', ejercicios: ['t2-gram3', 't2-gram4'] },
          { destreza: 'reading', parte: 5, tarea: 'Multiple choice' },
          { destreza: 'speaking', tarea: 'Partes 1 y 2' }
        ] },
        { id: 't2-s3', n: 3, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t2-voc5', 't2-voc6'] },
          { destreza: 'gramatica', ejercicios: ['t2-gram5', 't2-gram6'] },
          { destreza: 'use', parte: 2, tarea: 'Open cloze' },
          { destreza: 'listening', parte: 2, tarea: 'Frases incompletas' }
        ] },
        { id: 't2-s4', n: 4, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t2-voc7', 't2-voc8'] },
          { destreza: 'gramatica', ejercicios: ['t2-gram7', 't2-gram8'] },
          { destreza: 'reading', parte: 6, tarea: 'Cross-text matching' },
          { destreza: 'speaking', tarea: 'Parte 3' }
        ] },
        { id: 't2-s5', n: 5, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t2-voc9', 't2-voc10'] },
          { destreza: 'gramatica', ejercicios: ['t2-gram9', 't2-gram10'] },
          { destreza: 'use', parte: 3, tarea: 'Word formation' },
          { destreza: 'listening', parte: 3, tarea: 'Conversación larga' }
        ] },
        { id: 't2-s6', n: 6, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t2-voc11', 't2-voc12'] },
          { destreza: 'gramatica', ejercicios: ['t2-gram11', 't2-gram12'] },
          { destreza: 'reading', parte: 7, tarea: 'Gapped text' },
          { destreza: 'speaking', tarea: 'Parte 4' }
        ] },
        { id: 't2-s7', n: 7, tipo: 'A', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t2-voc13', 't2-voc14'] },
          { destreza: 'gramatica', ejercicios: ['t2-gram13', 't2-gram14'] },
          { destreza: 'use', parte: 4, tarea: 'Key word transformation' },
          { destreza: 'listening', parte: 4, tarea: 'Multiple matching' }
        ] },
        { id: 't2-s8', n: 8, tipo: 'B', bloques: [
          { destreza: 'vocabulario', ejercicios: ['t2-voc15', 't2-voc16'] },
          { destreza: 'gramatica', ejercicios: ['t2-gram15', 't2-gram16'] },
          { destreza: 'reading', parte: 8, tarea: 'Multiple matching' },
          { destreza: 'speaking', tarea: 'Repaso' }
        ] },
        { id: 't2-s9', n: 9, tipo: 'W', bloques: [
          { destreza: 'writing', parte: 1, tarea: 'Essay' },
          { destreza: 'writing', parte: 2, tarea: 'A elegir' }
        ] }
      ]
    },
    { id: 't3', titulo: 'Test 3' },
    { id: 't4', titulo: 'Test 4' }
  ],

  ejercicios: {
  /* ===================== TEST 2 · GRAMATICA =====================
     Segunda vuelta al temario de Elena, con las mismas areas y en el mismo
     orden que el Test 1 pero apretando: verbos de estado, narrativa con
     pasados mezclados, futuro perfecto, matices de los modales. Frases nuevas;
     ninguna sale de sus fotocopias. */

  't2-gram1': {
    tipo: 'transformacion', titulo: 'Presentes · segunda vuelta',
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Completa cada frase con una palabra de la caja. Sobra una.',
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
    instruccion: 'Completa cada frase con una palabra de la caja. Sobra una.',
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
    instruccion: 'Completa cada frase con una palabra de la caja. Sobra una.',
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
    instruccion: 'Completa cada expresión con una palabra de la caja. Sobra una.',
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
    instruccion: 'Completa cada hueco con <b>una sola palabra</b>.',
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
    instruccion: 'Completa cada hueco con <b>una sola palabra</b>.',
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
    instruccion: 'Forma la palabra que falta a partir de la raíz de la derecha.',
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
    instruccion: 'Forma la palabra que falta a partir de la raíz de la derecha.',
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
    instruccion: 'Completa cada frase con una palabra de la caja. Sobra una.',
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
    instruccion: 'Completa cada frase con una palabra de la caja. Sobra una.',
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
    instruccion: 'Completa cada frase con un verbo de la caja. Sobra uno.',
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
    instruccion: 'Completa cada expresión con una palabra de la caja. Sobra una.',
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
    instruccion: 'Completa cada hueco con <b>una sola palabra</b>.',
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
    instruccion: 'Completa cada hueco con <b>una sola palabra</b>.',
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
    instruccion: 'Forma la palabra que falta a partir de la raíz de la derecha.',
    items: [
      { antes: 'The figures had been badly', despues: 'by the press.', raiz: 'INTERPRET', aceptadas: ['misinterpreted'] },
      { antes: 'The two systems are simply', despues: '.', raiz: 'COMPATIBLE', aceptadas: ['incompatible'] },
      { antes: 'They had to', despues: 'the whole timetable.', raiz: 'THINK', aceptadas: ['rethink'] },
      { antes: 'Her contribution was', despues: 'by everyone at the time.', raiz: 'ESTIMATE', aceptadas: ['underestimated'] },
      { antes: 'The delay was entirely', despues: '.', raiz: 'AVOID', aceptadas: ['avoidable', 'unavoidable'] },
      { antes: 'He spoke with', despues: 'confidence for a beginner.', raiz: 'SURPRISE', aceptadas: ['surprising'] }
    ]
  },

  't2-voc16': {
    tipo: 'formacion', titulo: 'Word formation · adverbios',
    instruccion: 'Forma la palabra que falta a partir de la raíz de la derecha.',
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
    titulo: 'Listening · Parte 1',
    instruccion: 'Escucharás tres extractos. Elige la mejor respuesta (A, B o C) para cada pregunta. <b>Se escucha dos veces</b>.',
    audio: 'audio/t1-lis1-espeak.mp3', demo: true, escuchas: 2,
    contexto: 'Extracto 1: dos compañeros hablan de un informe. Extracto 2: una mujer cuenta un curso que ha empezado. Extracto 3: dos personas comentan un cambio en su estación.',
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
    titulo: 'Listening · Parte 3',
    instruccion: 'Escucharás una entrevista. Elige la mejor respuesta (A, B, C o D) para cada pregunta. <b>Se escucha dos veces</b>.',
    audio: 'audio/t1-lis3-espeak.mp3', demo: true, escuchas: 2,
    contexto: 'Una periodista entrevista al doctor Alan Merrick, que investiga el sueño.',
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
    titulo: 'Listening · Parte 4',
    instruccion: 'Escucharás a cinco personas hablando de por qué dejaron su ciudad. <b>Tarea 1</b> (preguntas 1–5): elige el motivo. <b>Tarea 2</b> (preguntas 6–10): elige lo que dice ahora. Se escucha dos veces.',
    audio: 'audio/t1-lis4-espeak.mp3', demo: true, escuchas: 2,
    opcionesCortas: true,
    contexto: 'Cinco personas cuentan por qué dejaron la ciudad en la que vivían. Cada tarea tiene su propia lista de ocho opciones.',
    listas: [
      { titulo: 'Tarea 1 · ¿Por qué se fue cada persona?', opciones: [
        'the cost of living there',
        'an obligation to family',
        'a change in how they worked',
        'a plan made long in advance',
        'a wish for a quieter life',
        'the loss of a relationship with the place',
        'pressure from friends who had left',
        'a search for a different kind of work'
      ] },
      { titulo: 'Tarea 2 · ¿Qué dice ahora, mirando atrás?', opciones: [
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
    instruccion: 'Habla durante <b>dos minutos</b>. Comenta las cinco opciones y llega a una conclusión, aunque sea provisional.',
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
    instruccion: 'Contesta a las tres preguntas seguidas, <b>dos minutos</b> en total. No hace falta tener razón: hace falta sostener lo que digas.',
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
    instruccion: 'Habla durante <b>un minuto seguido</b>, sin pausas largas. Compara, no describas.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Completa cada hueco con <b>una sola palabra</b>.',
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
    instruccion: 'Completa cada hueco con <b>una sola palabra</b>.',
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
    instruccion: 'Forma la palabra que falta a partir de la raíz de la derecha.',
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
    instruccion: 'Forma la palabra que falta a partir de la raíz de la derecha.',
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
    instruccion: 'Completa cada frase con una palabra de la caja. Sobra una.',
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
    instruccion: 'Completa cada frase con una palabra de la caja. Sobra una.',
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
    instruccion: 'Completa cada frase con una palabra de la caja. Sobra una.',
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
    instruccion: 'Completa cada expresión con una palabra de la caja. Sobra una.',
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
    instruccion: 'Completa cada frase con un verbo de la caja. Sobra uno.',
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
    instruccion: 'Completa cada frase con una palabra de la caja. Sobra una.',
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
    instruccion: 'Completa cada hueco con <b>una sola palabra</b>.',
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
    instruccion: 'Completa cada hueco con <b>una sola palabra</b>.',
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
    instruccion: 'Forma la palabra que falta a partir de la raíz de la derecha.',
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
    instruccion: 'Forma la palabra que falta a partir de la raíz de la derecha.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
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
    titulo: 'Reading · Parte 5',
    instruccion: 'Lee el texto y elige la mejor respuesta (A, B, C o D) para cada pregunta.',
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
    titulo: 'Reading · Parte 6',
    instruccion: 'Cuatro especialistas escriben sobre la enseñanza de la programación en la escuela. Elige el texto (A, B, C o D) que responde a cada pregunta.',
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
    titulo: 'Reading · Parte 7',
    instruccion: 'Faltan seis párrafos del texto. Elige para cada hueco el párrafo que encaja (A–G). Hay uno que no va en ninguno.',
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
    titulo: 'Reading · Parte 8',
    instruccion: 'Seis personas cuentan cómo cambiaron de oficio pasados los cuarenta. Elige la persona (A–F) que corresponde a cada pregunta.',
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
      "titulo": "Una cartógrafa",
      "instruccion": "Vas a oír a una cartógrafa hablando de su trabajo. Completa cada frase con <b>una palabra o expresión corta</b>. Lo oirás <b>dos veces</b>.",
      "audio": "audio/t1-lis2-espeak.mp3",
      "demo": true,
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
      "instruccion": "Escribe entre <b>220 y 260 palabras</b>. Usa tus propias palabras: no copies frases del enunciado.",
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
      "instruccion": "Escribe entre <b>220 y 260 palabras</b>. Una review no es solo describir: hay que valorar y recomendar o no.",
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
      "instruccion": "Habla durante <b>un minuto seguido</b>. No hace falta contestar a todo: elige y compara.",
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
      "instruccion": "Lee el texto y elige la mejor opción para cada hueco.",
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
    }
  }
};
