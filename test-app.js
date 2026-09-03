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

  /* Bloques mostrados al usuario (B1a + B1b se presentan como un unico B1),
     con el minimo de aciertos para pasar al siguiente. */
  const GRUPOS = DATA.grupos.map(g => Object.assign({}, g, { nombre: UI.nombresGrupo[g.id] }));
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
  function aciertosGrupo(g) {
    let ok = 0;
    for (let n = g.desde; n <= g.hasta; n++) if (esCorrecta(DATA.preguntas[n - 1], st.respuestas[n])) ok++;
    return ok;
  }
  const pasaGrupo = g => aciertosGrupo(g) >= g.minimo;
  /* Nivel por bloques: el test se detiene en el primer bloque no superado.
     Devuelve total de aciertos, preguntas respondidas y el grupo donde paro. */
  function puntuar() {
    let total = 0, respondidas = 0, nivel = GRUPOS[0].nivelSiNoPasa, paradoEn = GRUPOS[0].id;
    for (const g of GRUPOS) {
      const ok = aciertosGrupo(g);
      total += ok; respondidas = g.hasta; paradoEn = g.id;
      if (ok < g.minimo) { nivel = g.nivelSiNoPasa; break; }
      nivel = g.nivelSiPasa || GRUPOS[GRUPOS.indexOf(g) + 1].nivelSiNoPasa;
    }
    return { total, respondidas, nivel, paradoEn, completo: paradoEn === GRUPOS[GRUPOS.length - 1].id };
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
    if (n === g.hasta) {
      // fin de bloque: si no se supera, el test termina aqui
      if (!pasaGrupo(g) || n === TOTAL) return terminar();
      if (!st.bloquesVistos[g.id]) {
        st.bloquesVistos[g.id] = true; st.actual = n + 1; guardar();
        return pintarBloque(g);
      }
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
    st.terminado = Date.now(); guardar();
    const r = puntuar();
    track('placement_test_completed', { puntuacion: r.total, respondidas: r.respondidas, parado_en: r.paradoEn });
    cab.fill.style.width = '100%'; cab.contador.textContent = UI.resultado.completado;
    mostrar('s-analisis');
    setTimeout(() => irResultado(false), REDUCIDO ? 400 : 1700);
  }

  function irResultado(desdeIntro) {
    const r = puntuar();
    const nivel = r.nivel;
    const t = UI.niveles[nivel];
    // El nivel queda anotado aparte para que otras paginas (la practica de
    // Well Online) puedan saludar al alumno con su nivel sin repetir el test.
    try {
      localStorage.setItem('well_nivel', JSON.stringify({
        nivel: nivel, puntuacion: r.total, sobre: r.respondidas,
        fecha: new Date().toISOString().slice(0, 10)
      }));
    } catch (e) {}
    if (!desdeIntro) track('placement_test_result', { nivel: nivel, puntuacion: r.total });
    $('#r-nivel').textContent = nivel;
    $('#r-nombre').textContent = t.nombre;
    $('#r-desc').textContent = t.texto;
    $('#r-punt').textContent = UI.resultado.puntuacion.replace('{p}', r.total).replace('{n}', r.respondidas);
    $('#r-tope').hidden = !t.tope;
    $('#r-parada').hidden = r.completo;
    // escala
    const orden = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const base = nivel.replace('+', '');
    const idx = orden.indexOf(base);
    document.querySelectorAll('#r-escala li').forEach((li, i) => {
      li.classList.toggle('pasado', i < idx);
      li.classList.toggle('tuyo', i === idx);
      li.classList.toggle('confirmar', t.tope && i > idx);
    });
    $('#lead-nivel').value = nivel; $('#lead-punt').value = r.total;
    $('#lead-form').hidden = false; $('#lead-ok').hidden = true;
    pintarProgreso(Math.min(TOTAL, r.respondidas + 1), true);
    document.querySelectorAll('#t-bloques li').forEach(li => {
      const gb = GRUPOS.find(x => x.id === li.dataset.grupo);
      li.classList.toggle('hecho', gb.hasta <= r.respondidas); li.classList.remove('actual'); li.setAttribute('aria-current', 'false');
    });
    cab.fill.style.width = '100%'; cab.contador.textContent = UI.resultado.completado;
    cab.nivel.textContent = UI.resultado.cabecera.replace('{nivel}', nivel);
    cab.head.classList.add('resultado');
    mostrar('s-resultado');
  }

  /* ---------- lead: un solo boton, WhatsApp con nombre, nivel y mensaje ---------- */
  const form = $('#lead-form');
  let leadIniciado = false;
  const urlLead = (nombre, nivel, mensaje) => {
    const msg = UI.whatsapp.lead.replace('{nombre}', nombre).replace('{nivel}', nivel).replace('{mensaje}', mensaje ? '\n\n' + mensaje : '');
    return 'https://wa.me/' + UI.telefono + '?text=' + encodeURIComponent(msg);
  };
  form.addEventListener('focusin', () => { if (!leadIniciado) { leadIniciado = true; track('placement_test_lead_started', { nivel: $('#lead-nivel').value }); } });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = $('#lead-nombre').value.trim(), mensaje = $('#lead-msg').value.trim(), nivel = $('#lead-nivel').value;
    if (!nombre) { $('#lead-error').hidden = false; $('#lead-nombre').focus(); return; }
    $('#lead-error').hidden = true;
    const url = urlLead(nombre, nivel, mensaje);
    track('placement_test_lead_submitted', { nivel: nivel, puntuacion: Number($('#lead-punt').value), con_mensaje: !!mensaje });
    $('#lead-ok-wa').href = url;
    window.open(url, '_blank', 'noopener');
    form.hidden = true; $('#lead-ok').hidden = false; $('#lead-ok').focus();
  });
  $('#lead-ok-wa').addEventListener('click', () => track('placement_test_whatsapp_clicked', { nivel: $('#lead-nivel').value }));

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

  /* ---------- telefono ---------- */
  const tel = $('#r-tel');
  if (tel) tel.addEventListener('click', () => track('placement_test_call_clicked', { nivel: $('#lead-nivel').value }));

  /* ---------- certificado PDF (canvas → JPEG → PDF, sin dependencias) ---------- */
  const certBtn = $('#cert-btn'), certNombre = $('#cert-nombre');
  $('#lead-nombre').addEventListener('input', e => { if (!certNombre.value) certNombre.value = e.target.value; });
  // El nombre queda anotado para que la practica de Well Online pueda saludar
  // por el nombre sin volver a pedirlo.
  const recuerdaNombre = n => {
    n = String(n || '').trim();
    if (n.length > 1) { try { localStorage.setItem('well_nombre', n); } catch (e) {} }
  };
  $('#lead-nombre').addEventListener('change', e => recuerdaNombre(e.target.value));
  certNombre.addEventListener('change', e => recuerdaNombre(e.target.value));
  certNombre.addEventListener('input', () => { $('#cert-err').hidden = true; $('#cert-ok').hidden = true; });
  certNombre.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); certBtn.click(); } });
  certBtn.addEventListener('click', async () => {
    const nombre = certNombre.value.trim();
    if (!nombre) { $('#cert-err').hidden = false; certNombre.focus(); return; }
    certBtn.disabled = true;
    try {
      const r = puntuar();
      const blob = await generarCertificado(nombre, r.nivel, r.total, r.respondidas);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = UI.cert.archivo.replace('{nivel}', r.nivel.replace('+', 'plus'));
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      $('#cert-ok').hidden = false;
      track('placement_test_certificate_downloaded', { nivel: r.nivel, puntuacion: r.total });
    } finally { certBtn.disabled = false; }
  });

  function rrect(x, px, py, w, h, r) {
    x.beginPath(); x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r);
    x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath();
  }
  function ajustaFuente(x, texto, plantilla, px, maxW) {
    let s = px;
    while (s > 28) { x.font = plantilla.replace('{px}', s); if (x.measureText(texto).width <= maxW) break; s -= 4; }
  }

  async function generarCertificado(nombre, nivel, punt, sobre) {
    try { await Promise.all([document.fonts.load('400 80px "Bree Serif"'), document.fonts.load('600 30px Figtree'), document.fonts.load('700 30px Figtree'), document.fonts.load('400 30px Figtree')]); } catch (e) {}
    const W = 1980, H = 1400;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d');
    const AZUL = '#21409A', CARMIN = '#C0293B', TINTA = '#232B42', GRIS = '#5E6575';
    x.fillStyle = '#F2F1ED'; x.fillRect(0, 0, W, H);
    x.save(); x.shadowColor = 'rgba(35,43,66,.16)'; x.shadowBlur = 44; x.shadowOffsetY = 18;
    rrect(x, 70, 70, W - 140, H - 140, 28); x.fillStyle = '#FFFFFF'; x.fill(); x.restore();
    x.save(); rrect(x, 70, 70, W - 140, H - 140, 28); x.clip();
    const g = x.createLinearGradient(70, 0, W - 70, 0); g.addColorStop(0, AZUL); g.addColorStop(1, CARMIN);
    x.fillStyle = g; x.fillRect(70, 70, W - 140, 16);
    x.save(); x.translate(1160, 300); x.scale(9.5, 9.5);
    x.strokeStyle = 'rgba(33,64,154,.055)'; x.lineWidth = 13; x.lineCap = 'round';
    x.stroke(new Path2D('M8 12 C22 98 36 98 48 54 C55 27 65 27 72 54 C84 98 98 98 112 12'));
    x.restore(); x.restore();
    // logo
    x.save(); x.translate(150, 135); x.scale(1.05, 1.05);
    rrect(x, 2, 2, 96, 136, 5); x.clip(); x.fillStyle = CARMIN; x.fillRect(2, 2, 96, 136);
    x.fillStyle = AZUL; x.fill(new Path2D('M-10 84 C16 62 26 68 34 98 C40 121 46 121 52 86 C58 51 64 51 70 84 C76 117 84 117 92 54 C96 31 101 22 112 10 L112 -10 L-12 -10 Z'));
    x.strokeStyle = '#fff'; x.lineWidth = 13; x.lineCap = 'round';
    x.stroke(new Path2D('M-10 84 C16 62 26 68 34 98 C40 121 46 121 52 86 C58 51 64 51 70 84 C76 117 84 117 92 54 C96 31 101 22 112 10'));
    x.restore();
    x.textBaseline = 'alphabetic'; x.textAlign = 'left';
    x.fillStyle = AZUL; x.font = '400 52px "Bree Serif"'; x.fillText('Academia', 280, 205); x.fillText('Well', 280, 262);
    x.textAlign = 'right'; x.fillStyle = GRIS; x.font = '600 23px Figtree'; x.fillText(UI.cert.lugar.toUpperCase(), W - 150, 215);
    // titulo y nombre
    x.textAlign = 'center';
    x.fillStyle = AZUL; x.font = '400 84px "Bree Serif"'; x.fillText(UI.cert.titulo, W / 2, 470);
    x.fillStyle = GRIS; x.font = '400 28px Figtree'; x.fillText(UI.cert.sub, W / 2, 520);
    x.font = '400 30px Figtree'; x.fillText(UI.cert.acredita, W / 2, 630);
    x.fillStyle = TINTA; ajustaFuente(x, nombre, '400 {px}px "Bree Serif"', 76, W - 400); x.fillText(nombre, W / 2, 725);
    x.fillStyle = GRIS; x.font = '400 30px Figtree'; x.fillText(UI.cert.completado, W / 2, 800);
    // nivel
    x.fillStyle = AZUL; x.font = '400 250px "Bree Serif"'; x.fillText(nivel, W / 2, 1010);
    x.fillStyle = CARMIN; x.font = '400 54px "Bree Serif"'; x.fillText(UI.niveles[nivel].nombre, W / 2, 1085);
    // escala
    const orden = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], idx = orden.indexOf(nivel.replace('+', ''));
    const x0 = W / 2 - 375, paso = 150, y = 1165;
    for (let i = 0; i < 5; i++) {
      const cx = x0 + i * paso;
      x.strokeStyle = i < idx ? AZUL : '#DDE2F0'; x.lineWidth = 5; x.beginPath(); x.moveTo(cx + 16, y); x.lineTo(cx + paso - 16, y); x.stroke();
    }
    x.font = '700 24px Figtree';
    for (let i = 0; i < 6; i++) {
      const cx = x0 + i * paso;
      x.beginPath(); x.arc(cx, y, i === idx ? 16 : 12, 0, Math.PI * 2);
      if (i === idx) { x.fillStyle = CARMIN; x.fill(); x.lineWidth = 8; x.strokeStyle = '#FBE9EB'; x.stroke(); }
      else if (i < idx) { x.fillStyle = AZUL; x.fill(); }
      else { x.fillStyle = '#fff'; x.fill(); x.lineWidth = 3; x.strokeStyle = '#B9C1DB'; x.stroke(); }
      x.fillStyle = i === idx ? CARMIN : (i < idx ? AZUL : '#8C93A8'); x.fillText(orden[i], cx, y + 50);
    }
    // datos y firma
    const fecha = new Date().toLocaleDateString(UI.cert.locale, { day: 'numeric', month: 'long', year: 'numeric' });
    x.textAlign = 'left'; x.fillStyle = TINTA; x.font = '600 26px Figtree'; x.fillText(UI.cert.puntuacion.replace('{p}', punt).replace('{n}', sobre), 150, 1272);
    x.fillStyle = GRIS; x.font = '400 26px Figtree'; x.fillText(UI.cert.fecha.replace('{f}', fecha), 150, 1310);
    x.textAlign = 'right'; x.strokeStyle = '#B9C1DB'; x.lineWidth = 2; x.beginPath(); x.moveTo(W - 600, 1265); x.lineTo(W - 150, 1265); x.stroke();
    x.fillStyle = TINTA; x.font = '600 24px Figtree'; x.fillText(UI.cert.firma, W - 150, 1305);
    x.textAlign = 'center'; x.fillStyle = GRIS; x.font = '400 20px Figtree'; x.fillText(UI.cert.nota, W / 2, H - 38);
    const jpeg = await new Promise(res => c.toBlob(res, 'image/jpeg', 0.9));
    return pdfDeImagen(new Uint8Array(await jpeg.arrayBuffer()), W, H);
  }

  function pdfDeImagen(jpeg, wPx, hPx) {
    const W = 841.89, H = 595.28, enc = s => new TextEncoder().encode(s);
    const partes = [], offsets = []; let len = 0;
    const push = b => { partes.push(b); len += b.length; };
    const obj = (n, cuerpo) => { offsets[n] = len; push(enc(n + ' 0 obj\n')); (Array.isArray(cuerpo) ? cuerpo : [cuerpo]).forEach(b => push(typeof b === 'string' ? enc(b) : b)); push(enc('\nendobj\n')); };
    push(enc('%PDF-1.4\n')); push(new Uint8Array([0x25, 0xE2, 0xE3, 0xCF, 0xD3, 0x0A]));
    obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
    obj(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
    obj(3, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + W + ' ' + H + '] /Resources << /XObject << /Im1 5 0 R >> >> /Contents 4 0 R >>');
    const cont = 'q ' + W + ' 0 0 ' + H + ' 0 0 cm /Im1 Do Q';
    obj(4, '<< /Length ' + cont.length + ' >>\nstream\n' + cont + '\nendstream');
    obj(5, ['<< /Type /XObject /Subtype /Image /Width ' + wPx + ' /Height ' + hPx + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + jpeg.length + ' >>\nstream\n', jpeg, '\nendstream']);
    obj(6, '<< /Title (Academia Well - Test de nivel) /Producer (Academia Well) >>');
    const xref = len;
    let t = 'xref\n0 7\n0000000000 65535 f \n';
    for (let i = 1; i <= 6; i++) t += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
    t += 'trailer\n<< /Size 7 /Root 1 0 R /Info 6 0 R >>\nstartxref\n' + xref + '\n%%EOF\n';
    push(enc(t));
    return new Blob(partes, { type: 'application/pdf' });
  }

  /* ---------- arranque ---------- */
  pintarIntro();
})();
