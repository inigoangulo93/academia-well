/* Well Online · banco de ejercicios (PROTOTIPO)
 *
 * OJO: los ejercicios de este fichero los he escrito yo (Claude) imitando los
 * formatos del material de la academia. NO son el material de Elena. Sirven
 * para probar el reproductor sin publicar contenido de la academia en un
 * repositorio publico. Ver practica-notas.md.
 *
 * Tipos:
 *   caja          · rellenar huecos con una palabra de la caja
 *   cloze         · open cloze, una sola palabra por hueco, sobre un texto
 *   formacion     · word formation, se da la raiz en mayusculas
 *   transformacion· key word transformation, entre 2 y 5 palabras
 */
window.WELL_PRACTICA = {
  version: 1,
  bloques: [
    {
      id: 'vocab-1',
      titulo: 'Vocabulario · Unidad 1',
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
    }
  ]
};
