/* Well Online · mapa del material y banco de ejercicios (PROTOTIPO)
 *
 * OJO: los ejercicios con contenido de este fichero los he escrito yo (Claude)
 * imitando los formatos del material de la academia. NO son el material de
 * Elena. Sirven para probar el reproductor sin publicar contenido de la
 * academia en un repositorio publico. Ver practica-notas.md.
 *
 * El MAPA si es real: son los temas y el numero de series que hay en
 * GRAMMAR FOLDER y VOCABULARY FOLDER. Los nombres de los temas gramaticales no
 * son de nadie, asi que se pueden nombrar sin problema.
 *
 * Tipos de ejercicio:
 *   caja          · rellenar huecos con una palabra de la caja
 *   cloze         · open cloze, una sola palabra por hueco, sobre un texto
 *   formacion     · word formation, se da la raiz en mayusculas
 *   transformacion· key word transformation, entre 2 y 5 palabras
 *
 * Una etapa sin 'ejercicios' esta pendiente de volcar: se ensena en el mapa
 * como "pronto", para que se vea el tamano real del camino.
 */
window.WELL_PRACTICA = {
  version: 2,
  dominioParaAbrir: 0.7,   // hay que dominar el 70% de una etapa para abrir la siguiente
  rutas: [
    {
      id: 'ue',
      titulo: 'Use of English',
      subtitulo: 'Las cuatro pruebas de la parte de uso del inglés de Cambridge, serie a serie.',
      nivel: 'B2 · C1',
      porTramo: 6,
      etapas: [
        {
          id: 'ue-1',
          titulo: 'Serie 1',
          resumen: 'Preposiciones, open cloze, formación de palabras y transformaciones.',
      ejercicios: [

        {
          id: 'v1-caja',
          tipo: 'caja',
          titulo: 'Adjetivos y verbos con preposición',
          instruccion: 'Completa cada frase con una palabra de la caja. Sobra una.',
          caja: ['about', 'at', 'for', 'from', 'in', 'of', 'on', 'to', 'with'],
          items: [
            { antes: "She's very good", despues: 'remembering names.', aceptadas: ['at'] },
            { antes: "I'm not accustomed", despues: 'working nights.', aceptadas: ['to'] },
            { antes: 'He apologised', despues: 'arriving so late.', aceptadas: ['for'] },
            { antes: 'Our results are quite different', despues: 'theirs.', aceptadas: ['from'] },
            { antes: "There's no point", despues: 'complaining now.', aceptadas: ['in'] },
            { antes: "I'm terrified", despues: 'flying.', aceptadas: ['of'] },
            { antes: 'She insisted', despues: 'paying for dinner.', aceptadas: ['on'] },
            { antes: "He's obsessed", despues: 'his new bike.', aceptadas: ['with'] }
          ]
        },

        {
          id: 'v1-cloze',
          tipo: 'cloze',
          titulo: 'Aprender un idioma de adulto',
          instruccion: 'Escribe <b>una sola palabra</b> en cada hueco.',
          texto: [
            'Learning a language as an adult {1} often described as a race against time. In fact, research suggests {2} opposite: adults are usually better {3} understanding grammar than children, and they make faster progress in the early stages.',
            '{4} children have is time, and a complete lack of embarrassment. Adults, {5} the other hand, worry about making mistakes, and it is that worry, rather than their memory, that slows them {6}.',
            'The good news is that this can be trained. Speak {7} little every day and the fear shrinks, even {8} your grammar stays exactly where it was for a while.'
          ],
          items: [
            { aceptadas: ['is'] },
            { aceptadas: ['the'] },
            { aceptadas: ['at'] },
            { aceptadas: ['What'] },
            { aceptadas: ['on'] },
            { aceptadas: ['down'] },
            { aceptadas: ['a'] },
            { aceptadas: ['if', 'though', 'when'] }
          ]
        },

        {
          id: 'v1-formacion',
          tipo: 'formacion',
          titulo: 'Sufijos y prefijos frecuentes',
          instruccion: 'Usa la palabra de la derecha para formar la que encaja en el hueco.',
          items: [
            { antes: 'The instructions were completely', despues: '.', raiz: 'USE', aceptadas: ['useless'] },
            { antes: 'She gave a very', despues: 'answer.', raiz: 'CONVINCE', aceptadas: ['convincing'] },
            { antes: 'His', despues: 'to the team was obvious from day one.', raiz: 'COMMIT', aceptadas: ['commitment'] },
            { antes: 'There has been a steady', despues: 'in prices.', raiz: 'GROW', aceptadas: ['growth'] },
            { antes: "It's absolutely", despues: 'that nobody noticed.', raiz: 'BELIEVE', aceptadas: ['unbelievable'] },
            { antes: 'They live in a quiet', despues: 'area.', raiz: 'RESIDENCE', aceptadas: ['residential'] },
            { antes: 'He spoke with great', despues: '.', raiz: 'CONFIDENT', aceptadas: ['confidence'] },
            { antes: 'The film was a huge', despues: '.', raiz: 'DISAPPOINT', aceptadas: ['disappointment'] }
          ]
        },

        {
          id: 'v1-transf',
          tipo: 'transformacion',
          titulo: 'Frases con palabra clave',
          instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
          items: [
            {
              frase: 'It is five years since I last visited Bilbao.', clave: 'BEEN',
              antes: 'I', despues: 'Bilbao for five years.',
              aceptadas: ["haven't been to", 'have not been to']
            },
            {
              frase: '"Don’t touch the paint," she said to me.', clave: 'NOT',
              antes: 'She told me', despues: 'the paint.',
              aceptadas: ['not to touch']
            },
            {
              frase: 'Somebody stole my bike last night.', clave: 'HAD',
              antes: 'I', despues: 'last night.',
              aceptadas: ['had my bike stolen']
            },
            {
              frase: 'The day was so cold that we stayed indoors.', clave: 'SUCH',
              antes: 'It was', despues: 'that we stayed indoors.',
              aceptadas: ['such a cold day']
            },
            {
              frase: 'I regret not studying more at school.', clave: 'WISH',
              antes: 'I', despues: 'more at school.',
              aceptadas: ['wish I had studied', "wish I'd studied"]
            },
            {
              frase: 'They will probably cancel the concert.', clave: 'LIKELY',
              antes: 'The concert', despues: 'cancelled.',
              aceptadas: ['is likely to be']
            }
          ]
        }

      ]
        },
        {
          id: 'ue-2',
          titulo: 'Serie 2',
          resumen: 'Phrasal verbs, open cloze y transformaciones.',
          ejercicios: [

            {
              id: 'v2-caja',
              tipo: 'caja',
              titulo: 'Partículas de phrasal verbs',
              instruccion: 'Completa cada frase con una palabra de la caja. Sobra una.',
              caja: ['away', 'back', 'down', 'into', 'off', 'out', 'over', 'through', 'up'],
              items: [
                { antes: 'Could you turn the music', despues: "? It's too loud.", aceptadas: ['down'] },
                { antes: 'The meeting was called', despues: 'at the last minute.', aceptadas: ['off'] },
                { antes: "She's trying to give", despues: 'smoking.', aceptadas: ['up'] },
                { antes: 'I ran', despues: 'an old friend at the station.', aceptadas: ['into'] },
                { antes: "We've run", despues: 'of milk again.', aceptadas: ['out'] },
                { antes: 'He got', despues: 'the flu in a couple of days.', aceptadas: ['over'] },
                { antes: "Don't throw those papers", despues: '; I still need them.', aceptadas: ['away'] },
                { antes: "I'll call you", despues: 'as soon as I get home.', aceptadas: ['back'] }
              ]
            },

            {
              id: 'v2-cloze',
              tipo: 'cloze',
              titulo: 'La memoria se entrena',
              instruccion: 'Escribe <b>una sola palabra</b> en cada hueco.',
              texto: [
                'Most people assume that a good memory is something you {1} born with. Trainers disagree. {2} to them, memory works like a muscle: the more you use it, the {3} it gets.',
                'The trick is not repeating a list over and {4} again, but connecting each new item {5} something you already know. {6} you do that, the information has somewhere to live.',
                'It {7} take long, and ten minutes a day is plenty, {8} it does take patience.'
              ],
              items: [
                { aceptadas: ['are'] },
                { aceptadas: ['According'] },
                { aceptadas: ['better', 'stronger'] },
                { aceptadas: ['over'] },
                { aceptadas: ['to', 'with'] },
                { aceptadas: ['If', 'Once', 'When'] },
                { aceptadas: ["doesn't", 'does not'] },
                { aceptadas: ['but'] }
              ]
            },

            {
              id: 'v2-transf',
              tipo: 'transformacion',
              titulo: 'Frases con palabra clave',
              instruccion: 'Escribe la segunda frase con el mismo significado usando la palabra clave. Entre <b>dos y cinco palabras</b>, sin cambiar la palabra clave.',
              items: [
                {
                  frase: '"I\'m sorry I didn\'t call you," he said.', clave: 'APOLOGISED',
                  antes: 'He', despues: 'me.',
                  aceptadas: ['apologised for not calling', 'apologized for not calling']
                },
                {
                  frase: 'They still have not finished the report.', clave: 'STILL',
                  antes: 'The report', despues: 'finished.',
                  aceptadas: ['has still not been', "still hasn't been", 'still has not been']
                },
                {
                  frase: 'It is not necessary to book a table.', clave: 'NEED',
                  antes: 'You', despues: 'a table.',
                  aceptadas: ["don't need to book", 'do not need to book']
                },
                {
                  frase: 'I last saw him in June.', clave: 'SINCE',
                  antes: 'I', despues: 'June.',
                  aceptadas: ["haven't seen him since", 'have not seen him since']
                },
                {
                  frase: 'Someone is repairing the roof at the moment.', clave: 'BEING',
                  antes: 'The roof', despues: 'at the moment.',
                  aceptadas: ['is being repaired']
                },
                {
                  frase: 'He did not tell me, so I did not know.', clave: 'TOLD',
                  antes: 'If he', despues: 'me, I would have known.',
                  aceptadas: ['had told']
                }
              ]
            }

          ]
        },
        { id: 'ue-3', titulo: 'Serie 3', resumen: 'Preposiciones, open cloze, formación de palabras y transformaciones.' },
        { id: 'ue-4', titulo: 'Serie 4', resumen: 'Preposiciones, open cloze, formación de palabras y transformaciones.' },
        { id: 'ue-5', titulo: 'Serie 5', resumen: 'Preposiciones, open cloze, formación de palabras y transformaciones.' },
        { id: 'ue-6', titulo: 'Serie 6', resumen: 'Preposiciones, open cloze, formación de palabras y transformaciones.' },
        { id: 'ue-7', titulo: 'Serie 7', resumen: 'Preposiciones, open cloze, formación de palabras y transformaciones.' },
        { id: 'ue-8', titulo: 'Serie 8', resumen: 'Preposiciones, open cloze, formación de palabras y transformaciones.' },
        { id: 'ue-9', titulo: 'Serie 9', resumen: 'Preposiciones, open cloze, formación de palabras y transformaciones.' },
        { id: 'ue-10', titulo: 'Serie 10', resumen: 'Preposiciones, open cloze, formación de palabras y transformaciones.' },
        { id: 'ue-11', titulo: 'Serie 11', resumen: 'Preposiciones, open cloze, formación de palabras y transformaciones.' },
        { id: 'ue-12', titulo: 'Serie 12', resumen: 'Preposiciones, open cloze, formación de palabras y transformaciones.' },
        { id: 'ue-13', titulo: 'Serie 13', resumen: 'Preposiciones, open cloze, formación de palabras y transformaciones.' },
        { id: 'ue-14', titulo: 'Serie 14', resumen: 'Preposiciones, open cloze, formación de palabras y transformaciones.' },
        { id: 'ue-15', titulo: 'Serie 15', resumen: 'Preposiciones, open cloze, formación de palabras y transformaciones.' },
        { id: 'ue-16', titulo: 'Serie 16', resumen: 'Preposiciones, open cloze, formación de palabras y transformaciones.' },
        { id: 'ue-17', titulo: 'Serie 17', resumen: 'Preposiciones, open cloze, formación de palabras y transformaciones.' },
        { id: 'ue-18', titulo: 'Serie 18', resumen: 'Preposiciones, open cloze, formación de palabras y transformaciones.' },
        { id: 'ue-19', titulo: 'Serie 19', resumen: 'Preposiciones, open cloze, formación de palabras y transformaciones.' },
        { id: 'ue-20', titulo: 'Serie 20', resumen: 'Preposiciones, open cloze, formación de palabras y transformaciones.' },
        { id: 'ue-21', titulo: 'Serie 21', resumen: 'Preposiciones, open cloze, formación de palabras y transformaciones.' },
        { id: 'ue-22', titulo: 'Serie 22', resumen: 'Preposiciones, open cloze, formación de palabras y transformaciones.' },
        { id: 'ue-23', titulo: 'Serie 23', resumen: 'Preposiciones, open cloze, formación de palabras y transformaciones.' },
        { id: 'ue-24', titulo: 'Serie 24', resumen: 'Preposiciones, open cloze, formación de palabras y transformaciones.' },
      ]
    },
    {
      id: 'gr',
      titulo: 'Gramática',
      subtitulo: 'Los 31 temas del cuaderno de gramática, agrupados por familias.',
      nivel: 'B2 · C1',
      etapas: [
        { id: 'gr-1', titulo: 'Tiempos verbales', temas: ['Present tenses', 'The future', 'Expressions with future meaning', 'Review of all tenses'] },
        { id: 'gr-2', titulo: 'Costumbres del pasado', temas: ['Used to / would', 'To be / get used to'] },
        { id: 'gr-3', titulo: 'Verbos modales', temas: ['Modals of ability', 'Modals of obligation', 'Lack of obligation', 'Prohibition', 'Advice', 'Possibility and certainty'] },
        { id: 'gr-4', titulo: 'La pasiva', temas: ['Passive voice', 'Personal and impersonal passives', 'Review of passives and causative'] },
        { id: 'gr-5', titulo: 'Condicionales', temas: ['Conditional sentences', 'Other conditional linkers', 'Omission of if / inverted conditionals'] },
        { id: 'gr-6', titulo: 'Comparar y desear', temas: ['Types of comparisons', 'Wishes', 'Unreal past', 'So / such', 'Too / enough'] },
        { id: 'gr-7', titulo: 'Frases complejas', temas: ['Relative clauses', 'Reported speech: statements', 'Reported speech: questions', 'Quantifiers', 'Both...and / neither...nor'] },
        { id: 'gr-8', titulo: 'Recta final C1', temas: ['Linkers', 'Inversion', 'Review'] },
      ]
    }
  ]
};
