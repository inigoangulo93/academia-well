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
          { destreza: 'listening', parte: 1, tarea: 'Tres extractos' }
        ]},
        { id: 't1-s2', n: 2, tipo: 'B', bloques: [
          { destreza: 'vocabulario' },
          { destreza: 'gramatica' },
          { destreza: 'reading', parte: 5, tarea: 'Multiple choice', ejercicios: ['t1-read5'] },
          { destreza: 'speaking', tarea: 'Partes 1 y 2', ejercicios: ['v1-speaking'] }
        ]},
        { id: 't1-s3', n: 3, tipo: 'A', bloques: [
          { destreza: 'vocabulario' },
          { destreza: 'gramatica' },
          { destreza: 'use', parte: 2, tarea: 'Open cloze', ejercicios: ['v1-cloze', 'v2-cloze'] },
          { destreza: 'listening', parte: 2, tarea: 'Frases incompletas', ejercicios: ['t1-lis2'] }
        ]},
        { id: 't1-s4', n: 4, tipo: 'B', bloques: [
          { destreza: 'vocabulario' },
          { destreza: 'gramatica' },
          { destreza: 'reading', parte: 6, tarea: 'Cross-text matching', ejercicios: ['t1-read6'] },
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
          { destreza: 'reading', parte: 7, tarea: 'Gapped text', ejercicios: ['t1-read7'] },
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
          { destreza: 'reading', parte: 8, tarea: 'Multiple matching', ejercicios: ['t1-read8'] },
          { destreza: 'speaking', tarea: 'Repaso' }
        ]},
        { id: 't1-s9', n: 9, tipo: 'W', bloques: [
          { destreza: 'writing', parte: 1, tarea: 'Essay (obligatorio)', ejercicios: ['v1-writing1'] },
          { destreza: 'writing', parte: 2, tarea: 'A elegir', ejercicios: ['v1-writing2'] }
        ]}
      ]
    },
    { id: 't2', titulo: 'Test 2' },
    { id: 't3', titulo: 'Test 3' },
    { id: 't4', titulo: 'Test 4' }
  ],

  ejercicios: {
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
      "audio": "audio/t1-lis2-demo.wav",
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
