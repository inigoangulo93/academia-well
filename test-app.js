/* Motor del test de nivel de Academia Well.
   Independiente del idioma: las cadenas llegan en window.WELL_UI y las
   preguntas en window.WELL_TEST. No muestra aciertos durante el test. */
(function () {
  'use strict';

  const DATA = window.WELL_TEST;
  const UI = window.WELL_UI;
  const CLAVE = 'well_test_v' + DATA.version;
  const TOTAL = DATA.preguntas.length;
  const REDUCIDO = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Bloques mostrados al usuario: B1a + B1b se presentan como un unico B1 */
  const GRUPOS = UI.grupos; // [{id, bloques:[...], nombre, desde, hasta}]
  const grupoDe = n => GRUPOS.find(g => n >= g.desde && n <= g.hasta);

  /* ---------- estado ---------- */
  let st = cargar();
  function cargar() {
    try {
      const raw = localStorage.getItem(CLAVE);
      if (raw) { const s = JSON.parse(raw); if (s && s.respuestas) return s; }
    } catch (e) {}
    return { actual: 1, respuestas: {}, iniciado: null, terminado: null, bloquesVistos: {} };
  }
  function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(st)); } catch (e) {} }
  function borrar() { try { localStorage.removeItem(CLAVE); } catch (e) {} st = cargar(); }
  const respondidas = () => Object.keys(st.respuestas).length;

  /* ---------- tracking ---------- */
  function track(evento, datos) {
    const payload = Object.assign({ event: evento }, datos || {});
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    if (typeof window.gtag === 'function') window.gtag('event', evento, datos || {});
    document.dispatchEvent(new CustomEvent('well:track', { detail: payload }));
  }

  /* ---------- correccion ---------- */
  function normaliza(t) {
    return String(t || '').toLowerCase()
      .replace(/[‘’ʼ`]/g, "'")
      .replace(/\s+/g, ' ').trim()
      .replace(/[.,!?;:]+$/g, '').trim();
  }
  function esCorrecta(q, valor) {
    if (valor === undefined || valor === null || valor === '') return false;
    if (q.tipo === 'opcion') return Number(valor) === q.correcta;
    const v = normaliza(valor);
    return q.aceptadas.some(a => normaliza(a) === v);
  }
  function puntuar() {
    let total = 0; const porGrupo = {};
    GRUPOS.forEach(g => porGrupo[g.id] = { ok: 0, de: g.hasta - g.desde + 1 });
    DATA.preguntas.forEach(q => {
      if (esCorrecta(q, st.respuestas[q.n])) { total++; porGrupo[grupoDe(q.n).id].ok++; }
    });
    const nivel = DATA.niveles.find(b => total >= b.min && total <= b.max) || DATA.niveles[0];
    return { total, porGrupo, nivel: nivel.id };
  }

  /* ---------- DOM ---------- */
  const $ = s => document.querySelector(s);
  const app = $('#app');
  const cab = { contador: $('#t-contador'), barra: $('#t-barra'), fill: $('#t-fill'), nivel: $('#t-nivel'), salir: $('#t-salir'), head: $('#t-head') };
  let pantallaActual = null;

  function mostrar(id, opts) {
    const nueva = $('#' + id);
    const anterior = pantallaActual;
    const dir = (opts && opts.dir) || 'adelante';
    if (anterior && anterior !== nueva) {
      anterior.classList.remove('activa');
      anterior.classList.add('saliendo');
      setTimeout(() => anterior.classList.remove('saliendo'), REDUCIDO ? 0 : 260);
    }
    nueva.classList.remove('desde-atras');
    if (dir === 'atras') nueva.classList.add('desde-atras');
    nueva.classList.add('activa');
    pantallaActual = nueva;
    window.scrollTo({ top: 0, behavior: REDUCIDO ? 'auto' : 'smooth' });
    const foco = nueva.querySelector('[data-foco]');
    if (foco) setTimeout(() => foco.focus({ preventScroll: true }), REDUCIDO ? 0 : 280);
    document.body.dataset.pantalla = id;
  }

  /* ---------- cabecera y progreso ---------- */
  function pintarProgreso(n, enTest) {
    cab.head.classList.toggle('en-test', !!enTest);
    if (!enTest) return;
    const hechas = Math.max(0, n - 1);
    cab.contador.textContent = n + ' / ' + TOTAL;
    cab.fill.style.width = (hechas / TOTAL * 100) + '%';
    cab.barra.setAttribute('aria-valuenow', hechas);
    const g = grupoDe(n);
    cab.nivel.textContent = g.nombre;
    // tira de bloques
    document.querySelectorAll('#t-bloques li').forEach(li => {
      const gb = GRUPOS.find(x => x.id === li.dataset.grupo);
      li.classList.toggle('hecho', n > gb.hasta);
      li.classList.toggle('actual', gb === g);
      li.setAttribute('aria-current', gb === g ? 'step' : 'false');
    });
  }

  /* ---------- intro ---------- */
  function pintarIntro() {
    const caja = $('#intro-reanudar');
    const inicio = $('#intro-inicio');
    if (st.terminado) {
      caja.hidden = false; inicio.hidden = true;
      const r = puntuar();
      caja.innerHTML = `<p class="rean-tit">${UI.intro.yaHecho}</p>
        <p class="rean-sub">${UI.intro.tuResultado.replace('{nivel}', `<b>${r.nivel}</b>`)}</p>
        <div class="rean-cta"><button class="btn btn-azul" id="btn-ver-resultado">${UI.intro.verResultado}</button>
        <button class="btn btn-ghost" id="btn-reiniciar">${UI.intro.repetir}</button></div>`;
      $('#btn-ver-resultado').onclick = () => irResultado(true);
    } else if (respondidas() > 0) {
      caja.hidden = false; inicio.hidden = true;
      caja.innerHTML = `<p class="rean-tit">${UI.intro.aMedias}</p>
        <p class="rean-sub">${UI.intro.vasPor.replace('{n}', `<b>${st.actual}</b>`).replace('{total}', TOTAL)}</p>
        <div class="rean-cta"><button class="btn btn-azul" id="btn-continuar" data-foco>${UI.intro.continuar}</button>
        <button class="btn btn-ghost" id="btn-reiniciar">${UI.intro.empezarDeNuevo}</button></div>`;
      $('#btn-continuar').onclick = () => irPregunta(st.actual);
    } else {
      caja.hidden = true; inicio.hidden = false;
    }
    const rei = $('#btn-reiniciar');
    if (rei) rei.onclick = () => confirmar(UI.modal.reiniciar, UI.modal.reiniciarTexto.replace('{n}', st.actual).replace('{total}', TOTAL), UI.modal.borrarSi, UI.modal.cancelar, () => { borrar(); pintarIntro(); });
    mostrar('s-intro');
    pintarProgreso(1, false);
  }

  $('#btn-empezar').addEventListener('click', () => {
    st.iniciado = st.iniciado || Date.now(); guardar();
    track('placement_test_started', { total_preguntas: TOTAL });
    irPregunta(1);
  });

  /* ---------- preguntas ---------- */
  let nActual = 1;
  const errBox = $('#q-error');

  function irPregunta(n, dir) {
    nActual = n; st.actual = n; guardar();
    pintarPregunta(n);
    pintarProgreso(n, true);
    mostrar('s-pregunta', { dir: dir || 'adelante' });
  }

  function pintarPregunta(n) {
    const q = DATA.preguntas[n - 1];
    const g = grupoDe(n);
    errBox.hidden = true;
    $('#q-bloque').textContent = g.nombre;
    $('#q-num').textContent = UI.pregunta.num.replace('{n}', n).replace('{total}', TOTAL);
    const cuerpo = $('#q-cuerpo');
    cuerpo.classList.remove('entra'); void cuerpo.offsetWidth; cuerpo.classList.add('entra');

    const hueco = '<span class="hueco" aria-label="' + UI.pregunta.hueco + '"></span>';
    if (q.tipo === 'opcion') {
      const valor = st.respuestas[n];
      cuerpo.innerHTML = `
        <p class="q-texto" id="q-texto">${escapa(q.texto).replace('____', hueco)}</p>
        <div class="opciones" role="radiogroup" aria-labelledby="q-texto">
          ${q.opciones.map((o, i) => `
            <button type="button" class="opcion${valor === i ? ' elegida' : ''}" role="radio" aria-checked="${valor === i}" data-i="${i}">
              <span class="letra">${'abcd'[i]}</span><span class="txt">${o === '—' ? `<i class="nada">${UI.pregunta.nada}</i>` : escapa(o)}</span>
            </button>`).join('')}
        </div>`;
      cuerpo.querySelectorAll('.opcion').forEach(b => b.addEventListener('click', () => elegir(n, Number(b.dataset.i))));
    } else {
      const valor = st.respuestas[n] || '';
      cuerpo.innerHTML = `
        <p class="q-instr">${UI.pregunta.transformar}</p>
        <p class="q-original">${escapa(q.original)}</p>
        <p class="q-texto q-gap" id="q-texto">${escapa(q.texto).replace('____', `<span class="campo"><input type="text" id="q-input" autocomplete="off" autocapitalize="none" spellcheck="false" maxlength="40" aria-label="${UI.pregunta.tuRespuesta}" value="${escapa(valor)}"></span>`)}</p>
        <p class="q-ayuda">${UI.pregunta.maxPalabras}</p>`;
      const inp = $('#q-input');
      inp.addEventListener('input', () => { st.respuestas[n] = inp.value; guardar(); errBox.hidden = true; });
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); siguiente(); } });
      setTimeout(() => inp.focus({ preventScroll: true }), REDUCIDO ? 0 : 300);
    }
    $('#btn-anterior').disabled = n === 1;
    $('#btn-siguiente').textContent = n === TOTAL ? UI.pregunta.terminar : UI.pregunta.siguiente;
  }

  function elegir(n, i) {
    st.respuestas[n] = i; guardar(); errBox.hidden = true;
    document.querySelectorAll('.opcion').forEach(b => {
      const es = Number(b.dataset.i) === i;
      b.classList.toggle('elegida', es); b.setAttribute('aria-checked', es);
    });
    // una decision → siguiente
    setTimeout(siguiente, REDUCIDO ? 120 : 260);
  }

  function siguiente() {
    const n = nActual, q = DATA.preguntas[n - 1];
    const v = st.respuestas[n];
    const vacia = q.tipo === 'opcion' ? (v === undefined) : !normaliza(v);
    if (vacia) {
      errBox.textContent = q.tipo === 'opcion' ? UI.pregunta.eligeUna : UI.pregunta.escribeAlgo;
      errBox.hidden = false;
      errBox.classList.remove('sacude'); void errBox.offsetWidth; errBox.classList.add('sacude');
      return;
    }
    const g = grupoDe(n);
    if (n === TOTAL) return terminar();
    if (n === g.hasta && !st.bloquesVistos[g.id]) {
      st.bloquesVistos[g.id] = true; st.actual = n + 1; guardar();
      return pintarBloque(g);
    }
    irPregunta(n + 1, 'adelante');
  }
  $('#btn-siguiente').addEventListener('click', siguiente);
  $('#btn-anterior').addEventListener('click', () => { if (nActual > 1) irPregunta(nActual - 1, 'atras'); });

  /* ---------- fin de bloque ---------- */
  function pintarBloque(g) {
    const sig = GRUPOS[GRUPOS.indexOf(g) + 1];
    const f = UI.bloques[g.id];
    $('#b-titulo').textContent = f.titulo;
    $('#b-texto').textContent = f.texto;
    $('#b-siguiente').textContent = sig ? UI.bloque.ahora.replace('{nombre}', sig.nombre) : '';
    pintarProgreso(g.hasta + 1, true);
    mostrar('s-bloque');
    $('#b-continuar').onclick = () => irPregunta(g.hasta + 1);
  }

  /* ---------- final ---------- */
  function terminar() {
    st.terminado = Date.now(); st.actual = TOTAL; guardar();
    const r = puntuar();
    track('placement_test_completed', { puntuacion: r.total });
    cab.fill.style.width = '100%'; cab.contador.textContent = TOTAL + ' / ' + TOTAL;
    mostrar('s-analisis');
    setTimeout(() => irResultado(false), REDUCIDO ? 400 : 1700);
  }

  function irResultado(desdeIntro) {
    const r = puntuar();
    const nivel = r.nivel;
    const t = UI.niveles[nivel];
    if (!desdeIntro) track('placement_test_result', { nivel: nivel, puntuacion: r.total });
    $('#r-nivel').textContent = nivel;
    $('#r-nombre').textContent = t.nombre;
    $('#r-desc').textContent = t.texto;
    $('#r-punt').textContent = UI.resultado.puntuacion.replace('{p}', r.total).replace('{total}', TOTAL);
    $('#r-tope').hidden = !t.tope;
    // escala
    const orden = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const base = nivel.replace('+', '');
    const idx = orden.indexOf(base);
    document.querySelectorAll('#r-escala li').forEach((li, i) => {
      li.classList.toggle('pasado', i < idx);
      li.classList.toggle('tuyo', i === idx);
      li.classList.toggle('confirmar', t.tope && i > idx);
    });
    $('#r-escala').style.setProperty('--pos', idx);
    // WhatsApp con nivel
    const msg = UI.whatsapp.resultado.replace('{nivel}', nivel);
    const wa = $('#r-wa'); wa.href = 'https://wa.me/' + UI.telefono + '?text=' + encodeURIComponent(msg);
    wa.onclick = () => track('placement_test_whatsapp_clicked', { nivel: nivel });
    $('#r-reserva').onclick = () => track('placement_test_booking_clicked', { nivel: nivel });
    $('#lead-nivel').value = nivel; $('#lead-punt').value = r.total;
    $('#lead-form').hidden = false; $('#lead-ok').hidden = true;
    pintarProgreso(TOTAL, true); cab.fill.style.width = '100%';
    cab.head.classList.add('resultado');
    mostrar('s-resultado');
  }

  /* ---------- lead ---------- */
  const form = $('#lead-form');
  let leadIniciado = false;
  form.addEventListener('focusin', () => { if (!leadIniciado) { leadIniciado = true; track('placement_test_lead_started', { nivel: $('#lead-nivel').value }); } });
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(form).entries());
    if (!datos.nombre.trim() || !(datos.email.trim() || datos.telefono.trim())) {
      $('#lead-error').hidden = false; return;
    }
    $('#lead-error').hidden = true;
    const btn = $('#lead-enviar'); btn.disabled = true; btn.classList.add('cargando');
    track('placement_test_lead_submitted', { nivel: datos.nivel, puntuacion: Number(datos.puntuacion), canal: UI.leadEndpoint ? 'formulario' : 'whatsapp' });
    let ok = false;
    if (UI.leadEndpoint) {
      try {
        const res = await fetch(UI.leadEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(Object.assign({ _subject: UI.lead.asunto }, datos)) });
        ok = res.ok;
      } catch (err) { ok = false; }
    }
    if (!ok) {
      // Sin backend: el lead viaja por WhatsApp con todos los datos ya escritos
      const msg = UI.whatsapp.lead.replace('{nombre}', datos.nombre.trim()).replace('{nivel}', datos.nivel)
        .replace('{email}', datos.email.trim() || '—').replace('{telefono}', datos.telefono.trim() || '—');
      window.open('https://wa.me/' + UI.telefono + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    }
    btn.disabled = false; btn.classList.remove('cargando');
    $('#lead-ok-nombre').textContent = datos.nombre.trim().split(' ')[0];
    form.hidden = true; $('#lead-ok').hidden = false;
    $('#lead-ok').focus();
  });

  /* ---------- salir / modal ---------- */
  const modal = $('#modal');
  function confirmar(titulo, texto, si, no, alConfirmar) {
    $('#m-titulo').textContent = titulo; $('#m-texto').textContent = texto;
    $('#m-si').textContent = si; $('#m-no').textContent = no;
    modal.hidden = false; requestAnimationFrame(() => modal.classList.add('abierto'));
    const cerrar = () => { modal.classList.remove('abierto'); setTimeout(() => { modal.hidden = true; }, REDUCIDO ? 0 : 220); };
    $('#m-no').onclick = cerrar;
    $('#m-si').onclick = () => { cerrar(); alConfirmar(); };
    modal.onclick = e => { if (e.target === modal) cerrar(); };
    $('#m-no').focus();
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { cerrar(); document.removeEventListener('keydown', esc); } });
  }
  cab.salir.addEventListener('click', () => {
    if (st.terminado || respondidas() === 0) { location.href = UI.urlInicio; return; }
    confirmar(UI.modal.salir, UI.modal.salirTexto, UI.modal.salirSi, UI.modal.seguir, () => { location.href = UI.urlInicio; });
  });

  function escapa(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  /* ---------- arranque ---------- */
  pintarIntro();
})();
