/* Revisa TODO el contenido del curso: practica-data.js entero.
 *
 *   node qa/qa-contenido.js
 *
 * Existe porque los errores de contenido no los ve ninguna otra prueba. El
 * navegador pinta igual de bien un ejercicio con la clave mal puesta, y el
 * alumno se queda con que ha fallado algo que tenia bien. Cada regla de aqui
 * abajo esta porque ya me equivoque en eso al menos una vez:
 *
 *   - una key word transformation cuya clave no aparecia en ninguna respuesta
 *     aceptada, o sea, sin solucion posible
 *   - una pregunta de cross-text matching sin respuesta correcta
 *   - las ocho respuestas de un multiple-choice siendo todas la A
 *   - preguntas de Reading en castellano, que miden traduccion y no lectura
 */
'use strict';
global.window = {};
require('../practica-data.js');
const D = window.WELL_PRACTICA;

const fallos = [], avisos = [];
const mal = (id, t) => fallos.push(id + ': ' + t);
const ojo = (id, t) => avisos.push(id + ': ' + t);

const palabras = t => String(t || '').trim().split(/\s+/).filter(Boolean).length;
const norm = t => String(t || '').toLowerCase().replace(/[‘’ʼ]/g, "'")
                     .replace(/\s+/g, ' ').trim();

/* ---------- reglas comunes a todos ---------- */

const IDS = Object.keys(D.ejercicios);

for (const id of IDS) {
  const e = D.ejercicios[id];

  if (!e.tipo) mal(id, 'sin tipo');
  if (!e.titulo) mal(id, 'sin titulo');
  if (!Array.isArray(e.items) || !e.items.length) { mal(id, 'sin items'); continue; }

  e.items.forEach((it, i) => {
    const n = 'item ' + (i + 1);
    // Todo item que se corrige necesita solucion. Los de writing y speaking no
    // se corrigen aqui: los mira una persona o la IA.
    const seCorrige = !['writing', 'speaking'].includes(e.tipo);
    if (!seCorrige) return;

    if (it.opciones) {
      if (!Array.isArray(it.opciones) || it.opciones.length < 2)
        mal(id, n + ': menos de dos opciones');
      if (typeof it.correcta !== 'number' || it.correcta < 0 || it.correcta >= it.opciones.length)
        mal(id, n + ': "correcta" fuera de rango (' + it.correcta + ')');
      const vistas = it.opciones.map(norm);
      if (new Set(vistas).size !== vistas.length) mal(id, n + ': opciones repetidas');
    } else {
      if (!Array.isArray(it.aceptadas) || !it.aceptadas.length)
        mal(id, n + ': sin respuestas aceptadas');
      else {
        if (it.aceptadas.some(a => !String(a).trim()))
          mal(id, n + ': una respuesta aceptada esta vacia');
        const dedup = new Set(it.aceptadas.map(norm));
        if (dedup.size !== it.aceptadas.length)
          ojo(id, n + ': respuestas aceptadas repetidas tras normalizar');
      }
    }
  });
}

/* ---------- key word transformation ---------- */
// Dos reglas del examen: la clave no se toca y la respuesta va entre dos y
// cinco palabras.
for (const id of IDS) {
  const e = D.ejercicios[id];
  if (e.tipo !== 'transformacion') continue;
  e.items.forEach((it, i) => {
    const n = 'item ' + (i + 1);
    if (!it.clave) { mal(id, n + ': sin palabra clave'); return; }
    if (it.clave !== it.clave.toUpperCase()) ojo(id, n + ': la clave deberia ir en mayusculas');
    if (!it.frase) mal(id, n + ': sin frase de partida');
    (it.aceptadas || []).forEach(a => {
      if (!norm(a).includes(norm(it.clave)))
        mal(id, n + ': la respuesta "' + a + '" no contiene la clave ' + it.clave);
      const p = palabras(a);
      if (p < 2 || p > 5)
        mal(id, n + ': "' + a + '" tiene ' + p + ' palabra(s); el examen pide entre 2 y 5');
    });
  });
}

/* ---------- caja de palabras ---------- */
// Toda solucion tiene que estar en la caja, o el alumno la busca y no la ve.
for (const id of IDS) {
  const e = D.ejercicios[id];
  if (e.tipo !== 'caja') continue;
  if (!Array.isArray(e.caja) || !e.caja.length) { mal(id, 'sin caja de palabras'); continue; }
  const caja = e.caja.map(norm);
  if (new Set(caja).size !== caja.length) ojo(id, 'la caja tiene palabras repetidas');
  e.items.forEach((it, i) => {
    (it.aceptadas || []).forEach(a => {
      if (!caja.includes(norm(a)))
        mal(id, 'item ' + (i + 1) + ': "' + a + '" no esta en la caja');
    });
  });
  const usadas = new Set(e.items.flatMap(it => (it.aceptadas || []).map(norm)));
  const sobran = caja.filter(c => !usadas.has(c));
  if (!sobran.length) ojo(id, 'no sobra ninguna palabra: se puede resolver por descarte');
  if (sobran.length > 3) ojo(id, 'sobran ' + sobran.length + ' palabras, puede despistar de mas');
  // La instruccion no puede prometer un numero que no se cumple: durante dos
  // tests dijo "Sobra una" mientras sobraban tres. El alumno cuenta.
  if (/sobra una|sobra uno/i.test(e.instruccion || '') && sobran.length !== 1)
    mal(id, 'la instruccion dice que sobra una y sobran ' + sobran.length);
}

/* ---------- word formation ---------- */
for (const id of IDS) {
  const e = D.ejercicios[id];
  if (e.tipo !== 'formacion') continue;
  e.items.forEach((it, i) => {
    const n = 'item ' + (i + 1);
    if (!it.raiz) { mal(id, n + ': sin raiz'); return; }
    // La respuesta tiene que derivar de la raiz, no ser la raiz tal cual.
    (it.aceptadas || []).forEach(a => {
      if (norm(a) === norm(it.raiz))
        mal(id, n + ': la respuesta "' + a + '" es la raiz sin transformar');
    });
  });
}

/* ---------- cloze: el texto tiene tantos huecos como items ---------- */
for (const id of IDS) {
  const e = D.ejercicios[id];
  if (e.tipo !== 'cloze' && e.tipo !== 'opcion') continue;
  if (!Array.isArray(e.texto)) { mal(id, 'sin texto'); continue; }
  const marcas = e.texto.join(' ').match(/\{(\d+)\}/g) || [];
  if (marcas.length !== e.items.length)
    mal(id, 'el texto tiene ' + marcas.length + ' huecos y hay ' + e.items.length + ' items');
  const nums = marcas.map(m => Number(m.replace(/[{}]/g, ''))).sort((a, b) => a - b);
  const esperado = e.items.map((_, i) => i + 1);
  if (nums.join(',') !== esperado.join(','))
    mal(id, 'los huecos no van numerados de 1 a ' + e.items.length + ': ' + nums.join(','));
}

/* ---------- reading ---------- */
for (const id of IDS) {
  const e = D.ejercicios[id];
  if (e.tipo !== 'lectura') continue;

  if (!e.texto && !e.secciones) mal(id, 'no hay nada que leer');

  // Enunciados y opciones en ingles: en castellano se mide traduccion.
  e.items.forEach((it, i) => {
    const cast = /[áéíóúñ¿¡]|\b(cuál|qué|quién|según|texto)\b/i;
    if (it.pregunta && cast.test(it.pregunta))
      mal(id, 'item ' + (i + 1) + ': el enunciado parece estar en castellano');
    (it.opciones || []).forEach(o => {
      if (o.length > 1 && cast.test(o))
        mal(id, 'item ' + (i + 1) + ': la opcion "' + o + '" parece estar en castellano');
    });
  });

  // Gapped text: un parrafo por hueco, sin repetir, y con un distractor que no
  // sea siempre la ultima letra.
  const conHuecos = (e.texto || []).filter(t => /^\{\d+\}$/.test(String(t))).length;
  if (conHuecos) {
    if (conHuecos !== e.items.length)
      mal(id, 'hay ' + conHuecos + ' huecos de parrafo y ' + e.items.length + ' items');
    const usados = e.items.map(it => it.correcta);
    if (new Set(usados).size !== usados.length)
      mal(id, 'un mismo parrafo se usa en dos huecos');
    const total = (e.secciones || []).length;
    if (total !== e.items.length + 1)
      mal(id, 'deberia haber exactamente un parrafo de sobra (' + total + ' para ' + e.items.length + ' huecos)');
    const sobra = [...Array(total).keys()].find(i => !usados.includes(i));
    if (sobra === total - 1) ojo(id, 'el parrafo que sobra es el ultimo: es un patron que se aprende');
  }

  // Las letras del banco, en orden alfabetico
  if (e.secciones) {
    const letras = e.secciones.map(s => s.letra);
    const orden = [...letras].sort();
    if (letras.join('') !== orden.join(''))
      mal(id, 'las secciones no van en orden alfabetico: ' + letras.join(''));
  }
}

/* ---------- reparto de respuestas en los de elegir ---------- */
for (const id of IDS) {
  const e = D.ejercicios[id];
  if (!e.items[0] || !e.items[0].opciones) continue;
  const n = e.items.length;
  if (n < 4) continue;
  const cuenta = {};
  e.items.forEach(it => { cuenta[it.correcta] = (cuenta[it.correcta] || 0) + 1; });
  const max = Math.max(...Object.values(cuenta));
  if (max === n) mal(id, 'las ' + n + ' respuestas son la misma letra');
  else if (max > n * 0.6) ojo(id, 'reparto desigual: una letra sale ' + max + ' de ' + n + ' veces');
}

/* ---------- el simulacro tiene que tener la forma del examen ---------- */
// Se replica lo que hace simulacroDe: por PAPEL, no por destreza, la primera
// aparicion de cada parte y su primer ejercicio. Si esto se desvia, el
// porcentaje deja de ser comparable con el examen real, que es justo lo que se
// le vende al alumno.
//   Reading & Use of English: un papel, 8 partes, 56 preguntas (8+8+8+6+6+4+6+10)
//   Listening:                un papel, 4 partes, 30 preguntas (6+8+6+10)
const PAPELES = (D.papeles || []).length ? D.papeles : [];
const FORMA = { ruoe: { partes: 8, preguntas: 56 }, listening: { partes: 4, preguntas: 30 } };
if (!PAPELES.length) fallos.push('datos: no hay papeles definidos, el simulacro no se puede armar');
for (const t of D.tests) {
  if (!(t.sesiones || []).length) continue;
  for (const pa of PAPELES) {
    const esperado = FORMA[pa.id];
    if (!esperado) { ojo('datos', 'el papel "' + pa.id + '" no tiene forma esperada'); continue; }
    const vistas = {}; let preguntas = 0, partes = 0, faltan = false;
    (t.sesiones || []).forEach(s => (s.bloques || []).forEach(b => {
      if (pa.destrezas.indexOf(b.destreza) < 0 || !(b.ejercicios || []).length) return;
      const n = b.parte || 0;
      if (vistas[n]) return;
      vistas[n] = true; partes++;
      // Puede apuntar a un ejercicio que aun no existe: eso ya lo denuncia la
      // comprobacion de integridad, aqui no se revienta por ello.
      var primero = D.ejercicios[b.ejercicios[0]];
      if (primero) preguntas += (primero.items || []).length; else faltan = true;
    }));
    // Un test a medio escribir todavia no tiene simulacro que medir. Se avisa,
    // para que no se olvide, pero no es un fallo hasta que este entero.
    if (faltan || partes === 0) { ojo(t.id, 'el simulacro de ' + pa.id + ' aun no esta completo'); continue; }
    if (partes !== esperado.partes)
      mal(t.id, 'el simulacro de ' + pa.id + ' tiene ' + partes + ' partes y el examen tiene ' + esperado.partes);
    else if (preguntas !== esperado.preguntas)
      mal(t.id, 'el simulacro de ' + pa.id + ' suma ' + preguntas + ' preguntas; el examen tiene ' + esperado.preguntas);
  }
  // Y los minutos del papel tienen que ser los del examen, no la suma de dos
  // medias sesiones de curso.
}
for (const pa of PAPELES) {
  const min = { ruoe: 90, listening: 40 }[pa.id];
  if (min && pa.minutos !== min)
    mal('datos', 'el papel ' + pa.id + ' dura ' + pa.minutos + ' minutos y en el examen dura ' + min);
}

/* ---------- integridad del curso ---------- */
const referenciados = new Set();
D.tests.forEach(t => (t.sesiones || []).forEach(s => (s.bloques || []).forEach(b =>
  (b.ejercicios || []).forEach(x => {
    referenciados.add(x);
    if (!D.ejercicios[x]) fallos.push('curso: la sesion ' + s.id + ' apunta a "' + x + '", que no existe');
  }))));
IDS.filter(x => !referenciados.has(x)).forEach(x => ojo('curso', 'el ejercicio "' + x + '" no lo usa ninguna sesion'));

/* ---------- resumen ---------- */
let items = 0;
IDS.forEach(id => { items += D.ejercicios[id].items.length; });
let bloques = 0, conMaterial = 0;
D.tests.forEach(t => (t.sesiones || []).forEach(s => (s.bloques || []).forEach(b => {
  bloques++; if ((b.ejercicios || []).length) conMaterial++;
})));

console.log('%d ejercicios · %d preguntas · %d de %d bloques con material',
            IDS.length, items, conMaterial, bloques);
console.log();
if (avisos.length) { console.log('AVISOS (%d):', avisos.length); avisos.forEach(a => console.log('  · ' + a)); console.log(); }
if (fallos.length) {
  console.log('FALLOS (%d):', fallos.length);
  fallos.forEach(f => console.log('  ✗ ' + f));
  process.exit(1);
}
console.log('Sin fallos.');
