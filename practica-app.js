/* Well Online · motor de practica (PROTOTIPO)
   Independiente del idioma: los textos de interfaz viven en window.WELL_UI_P,
   dentro de la pagina, igual que en el test de nivel. */
(function () {
  'use strict';

  var DATA = window.WELL_PRACTICA;
  var T = window.WELL_UI_P || {};
  var CLAVE = 'well_practica_v1';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- utilidades ---------- */

  function normaliza(t) {
    return String(t || '').toLowerCase()
      .replace(/[‘’ʼ`]/g, "'")
      .replace(/\s+/g, ' ').trim()
      .replace(/[.,!?;:]+$/g, '').trim();
  }

  function correcto(item, valor) {
    if (valor === undefined || valor === null || String(valor).trim() === '') return false;
    var v = normaliza(valor);
    return item.aceptadas.some(function (a) { return normaliza(a) === v; });
  }

  // "haven't been to" y "have not been to" son la misma solucion escrita de dos
  // maneras: se muestra una sola vez. Variantes de verdad (if / though / when)
  // se muestran todas. Como 'd puede ser "had" o "would" y 's puede ser "is" o
  // "has", se generan las dos lecturas y solo se funden si coinciden en alguna.
  function expansiones(t) {
    var base = normaliza(t)
      .replace(/n't/g, ' not').replace(/'ve/g, ' have').replace(/'ll/g, ' will')
      .replace(/'re/g, ' are').replace(/'m/g, ' am');
    var salida = [base];
    [["'d", ['had', 'would']], ["'s", ['is', 'has']]].forEach(function (par) {
      var nuevas = [];
      salida.forEach(function (s) {
        if (s.indexOf(par[0]) === -1) { nuevas.push(s); return; }
        par[1].forEach(function (v) { nuevas.push(s.split(par[0]).join(' ' + v)); });
      });
      salida = nuevas;
    });
    return salida.map(function (s) { return s.replace(/\s+/g, ' ').trim(); });
  }

  function variantesVisibles(lista) {
    var salida = [], vistas = [];
    lista.forEach(function (a) {
      var e = expansiones(a);
      var repetida = vistas.some(function (v) {
        return v.some(function (x) { return e.indexOf(x) !== -1; });
      });
      if (!repetida) { vistas.push(e); salida.push(a); }
    });
    return salida;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function track(evento, datos) {
    var d = Object.assign({ evento: evento }, datos || {});
    try { (window.dataLayer = window.dataLayer || []).push(d); } catch (e) {}
    try { if (typeof window.gtag === 'function') window.gtag('event', evento, datos || {}); } catch (e) {}
    try { window.dispatchEvent(new CustomEvent('well:track', { detail: d })); } catch (e) {}
  }

  /* ---------- progreso ---------- */

  function leeProgreso() {
    try { return JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch (e) { return {}; }
  }
  function guardaProgreso(p) {
    try { localStorage.setItem(CLAVE, JSON.stringify(p)); } catch (e) {}
  }
  var progreso = leeProgreso();

  function anota(ej, aciertos) {
    var p = progreso[ej.id] || { mejor: 0, intentos: 0 };
    p.total = ej.items.length;
    p.intentos = (p.intentos || 0) + 1;
    if (aciertos > (p.mejor || 0)) p.mejor = aciertos;
    p.fecha = new Date().toISOString().slice(0, 10);
    progreso[ej.id] = p;
    guardaProgreso(progreso);
  }

  /* ---------- indice ---------- */

  var todos = [];
  DATA.bloques.forEach(function (b) {
    b.ejercicios.forEach(function (e) { e._bloque = b; todos.push(e); });
  });

  function pintaLista() {
    var cont = $('#lista');
    cont.innerHTML = '';
    var hechos = 0, totalItems = 0, aciertosTotales = 0;

    DATA.bloques.forEach(function (b) {
      var sec = document.createElement('section');
      sec.className = 'bloque';
      var h = '<h2>' + esc(b.titulo) + '</h2>';
      if (b.resumen) h += '<p class="bloque-sub">' + esc(b.resumen) + '</p>';
      h += '<ul class="tarjetas">';
      b.ejercicios.forEach(function (e) {
        var p = progreso[e.id];
        var n = e.items.length;
        totalItems += n;
        var marca = '', clase = '';
        if (p) {
          aciertosTotales += p.mejor;
          if (p.mejor === n) { hechos++; clase = ' perfecto'; marca = '<span class="pill ok">' + T.perfecto + '</span>'; }
          else { clase = ' empezado'; marca = '<span class="pill">' + p.mejor + '/' + n + '</span>'; }
        } else {
          marca = '<span class="pill vacia">' + n + ' ' + T.items + '</span>';
        }
        h += '<li><button class="tarjeta' + clase + '" data-ej="' + esc(e.id) + '">' +
             '<span class="t-tipo">' + esc(T.tipos[e.tipo] || e.tipo) + '</span>' +
             '<span class="t-tit">' + esc(e.titulo) + '</span>' +
             marca + '</button></li>';
      });
      h += '</ul>';
      sec.innerHTML = h;
      cont.appendChild(sec);
    });

    var resumen = $('#resumen');
    if (aciertosTotales > 0) {
      resumen.hidden = false;
      resumen.innerHTML = '<b>' + aciertosTotales + '</b> ' + T.deTus + ' <b>' + totalItems + '</b> ' + T.huecosOk +
                          (hechos ? ' · ' + hechos + ' ' + T.ejerciciosPerfectos : '');
    } else {
      resumen.hidden = true;
    }
  }

  /* ---------- pintar un ejercicio ---------- */

  var actual = null;

  function campo(i, largo) {
    return '<input class="hueco' + (largo ? ' largo' : '') + '" data-i="' + i + '" type="text" ' +
           'autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" ' +
           'aria-label="' + T.hueco + ' ' + (i + 1) + '">';
  }

  function conMarcadores(txt, base) {
    return String(txt).replace(/\{(\d+)\}/g, function (_, n) {
      return '<span class="conhueco"><em class="num">' + n + '</em>' + campo(base + Number(n) - 1) + '</span>';
    });
  }

  function pintaEjercicio(ej) {
    actual = ej;
    $('#ej-tipo').textContent = T.tipos[ej.tipo] || ej.tipo;
    $('#ej-titulo').textContent = ej.titulo;
    $('#ej-instruccion').innerHTML = ej.instruccion;
    $('#ej-bloque').textContent = ej._bloque.titulo;

    var caja = $('#ej-caja');
    if (ej.tipo === 'caja' && ej.caja) {
      caja.hidden = false;
      caja.innerHTML = ej.caja.map(function (w) { return '<span>' + esc(w) + '</span>'; }).join('');
    } else { caja.hidden = true; }

    var cuerpo = $('#ej-cuerpo');
    var h = '';

    if (ej.tipo === 'cloze') {
      h += '<div class="texto">';
      h += ej.texto.map(function (p) { return '<p>' + conMarcadores(esc(p), 0) + '</p>'; }).join('');
      h += '</div>';
    } else {
      h += '<ol class="frases">';
      ej.items.forEach(function (it, i) {
        h += '<li>';
        if (ej.tipo === 'transformacion') {
          h += '<p class="origen">' + esc(it.frase) + '</p>';
          h += '<p class="clave"><span>' + esc(it.clave) + '</span></p>';
        }
        h += '<p class="frase">' + esc(it.antes || '') + ' ' + campo(i, ej.tipo === 'transformacion') + ' ' + esc(it.despues || '');
        if (ej.tipo === 'formacion') h += ' <span class="raiz">' + esc(it.raiz) + '</span>';
        h += '</p></li>';
      });
      h += '</ol>';
    }
    cuerpo.innerHTML = h;

    // rellena con el ultimo intento si lo hubiera
    var guardado = (progreso[ej.id] || {}).respuestas;
    if (guardado) $$('.hueco', cuerpo).forEach(function (inp, i) { inp.value = guardado[i] || ''; });

    $('#ej-resultado').hidden = true;
    $('#btn-corregir').hidden = false;
    $('#btn-repetir').hidden = true;
    $('#ej-pie').classList.remove('corregido');
    cuerpo.classList.remove('corregido');
    enfoca();
    track('practica_ejercicio_abierto', { ejercicio: ej.id, tipo: ej.tipo });
  }

  function enfoca() {
    var primero = $$('.hueco').filter(function (i) { return !i.value; })[0] || $('.hueco');
    if (primero && window.matchMedia('(min-width:700px)').matches) primero.focus();
  }

  /* ---------- correccion ---------- */

  function corrige() {
    var ej = actual;
    var inputs = $$('.hueco', $('#ej-cuerpo'));
    var ok = 0, respuestas = [];

    inputs.forEach(function (inp, i) {
      var it = ej.items[i];
      var bien = correcto(it, inp.value);
      respuestas.push(inp.value);
      if (bien) ok++;
      inp.classList.remove('ok', 'mal');
      inp.classList.add(bien ? 'ok' : 'mal');
      inp.readOnly = true;

      var destino = inp.closest('.frase') || inp.parentNode;
      var vieja = destino.querySelector('.sol[data-i="' + i + '"]');
      if (vieja) vieja.remove();
      if (!bien) {
        var s = document.createElement('span');
        s.className = 'sol';
        s.setAttribute('data-i', i);
        s.innerHTML = '<em>' + T.solucion + '</em> ' + esc(variantesVisibles(it.aceptadas).join(' · '));
        // en una frase suelta va al final, para no partir la lectura;
        // en un texto con muchos huecos va pegada al hueco que corresponde
        if (destino.classList.contains('frase')) destino.appendChild(s);
        else inp.insertAdjacentElement('afterend', s);
      }
    });

    anota(ej, ok);
    progreso[ej.id].respuestas = respuestas;
    guardaProgreso(progreso);

    var n = ej.items.length;
    var pct = Math.round(ok / n * 100);
    var caja = $('#ej-resultado');
    caja.className = 'resultado ' + (ok === n ? 'genial' : pct >= 60 ? 'bien' : 'flojo');
    caja.innerHTML = '<b>' + ok + '/' + n + '</b> <span>' +
      esc(ok === n ? T.msgPerfecto : pct >= 60 ? T.msgBien : T.msgFlojo) + '</span>';
    caja.hidden = false;

    $('#btn-corregir').hidden = true;
    $('#btn-repetir').hidden = false;
    $('#ej-cuerpo').classList.add('corregido');
    $('#ej-pie').classList.add('corregido');
    caja.scrollIntoView({ behavior: 'smooth', block: 'center' });
    track('practica_ejercicio_corregido', { ejercicio: ej.id, tipo: ej.tipo, aciertos: ok, sobre: n });
  }

  function repite() {
    var ej = actual;
    var inputs = $$('.hueco', $('#ej-cuerpo'));
    inputs.forEach(function (inp, i) {
      inp.readOnly = false;
      var d0 = inp.closest('.frase') || inp.parentNode;
      var s = d0.querySelector('.sol[data-i="' + i + '"]');
      if (s) s.remove();
      if (inp.classList.contains('mal')) inp.value = '';
      inp.classList.remove('ok', 'mal');
    });
    $('#ej-resultado').hidden = true;
    $('#btn-corregir').hidden = false;
    $('#btn-repetir').hidden = true;
    $('#ej-cuerpo').classList.remove('corregido');
    $('#ej-pie').classList.remove('corregido');
    enfoca();
  }

  /* ---------- navegacion entre pantallas ---------- */

  function muestra(id) {
    $$('.pantalla').forEach(function (p) { p.classList.toggle('activa', p.id === id); });
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.body.classList.toggle('en-ejercicio', id === 's-ejercicio');
  }

  function abre(id) {
    var ej = todos.filter(function (e) { return e.id === id; })[0];
    if (!ej) return;
    pintaEjercicio(ej);
    muestra('s-ejercicio');
    if (location.hash !== '#' + id) history.pushState({ ej: id }, '', '#' + id);
  }

  function vuelve() {
    pintaLista();
    muestra('s-lista');
    if (location.hash) history.pushState({}, '', location.pathname);
  }

  function siguiente() {
    var i = todos.indexOf(actual);
    if (i > -1 && i + 1 < todos.length) abre(todos[i + 1].id);
    else vuelve();
  }

  /* ---------- arranque ---------- */

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-ej]');
    if (t) { abre(t.getAttribute('data-ej')); return; }
    if (e.target.closest('#btn-corregir')) { corrige(); return; }
    if (e.target.closest('#btn-repetir')) { repite(); return; }
    if (e.target.closest('#btn-volver')) { vuelve(); return; }
    if (e.target.closest('#btn-siguiente')) { siguiente(); return; }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    var inp = e.target.closest && e.target.closest('.hueco');
    if (!inp) return;
    e.preventDefault();
    var inputs = $$('.hueco', $('#ej-cuerpo'));
    var i = inputs.indexOf(inp);
    if (i > -1 && i + 1 < inputs.length) inputs[i + 1].focus();
    else if (!$('#btn-corregir').hidden) corrige();
  });

  window.addEventListener('popstate', function () {
    var id = location.hash.replace('#', '');
    if (id) abre(id); else { pintaLista(); muestra('s-lista'); }
  });

  pintaLista();
  var inicial = location.hash.replace('#', '');
  if (inicial && todos.some(function (e) { return e.id === inicial; })) abre(inicial);
  else muestra('s-lista');
})();
