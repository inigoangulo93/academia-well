/* Well Online · motor de practica y panel (PROTOTIPO)
   Independiente del idioma: los textos de interfaz viven en window.WELL_UI_P,
   dentro de la pagina, igual que en el test de nivel. */
(function () {
  'use strict';

  var DATA = window.WELL_PRACTICA;
  var T = window.WELL_UI_P || {};
  var CLAVE = 'well_practica_v' + DATA.version;
  var CLAVE_NIVEL = 'well_nivel';
  var UMBRAL = DATA.dominioParaAbrir || 0.7;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var hoy = function () { return new Date().toISOString().slice(0, 10); };

  /* ---------- indice ---------- */

  var ETAPAS = [], EJERCICIOS = [];
  DATA.rutas.forEach(function (ruta) {
    ruta.etapas.forEach(function (etapa, i) {
      etapa._ruta = ruta; etapa._i = i;
      etapa._anterior = i > 0 ? ruta.etapas[i - 1] : null;
      ETAPAS.push(etapa);
      (etapa.ejercicios || []).forEach(function (ej) {
        ej._etapa = etapa; ej._ruta = ruta; EJERCICIOS.push(ej);
      });
    });
  });
  var porId = function (lista, id) { return lista.filter(function (x) { return x.id === id; })[0]; };

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

  var P = (function () {
    var vacio = { ejercicios: {}, dias: [], insignias: [] };
    try {
      var raw = JSON.parse(localStorage.getItem(CLAVE));
      if (raw && raw.ejercicios) return Object.assign(vacio, raw);
    } catch (e) {}
    return vacio;
  })();
  function guarda() { try { localStorage.setItem(CLAVE, JSON.stringify(P)); } catch (e) {} }

  function nivelAlumno() {
    try {
      var n = JSON.parse(localStorage.getItem(CLAVE_NIVEL));
      if (n && n.nivel) return n;
    } catch (e) {}
    return null;
  }

  function anota(ej, aciertos, respuestas) {
    var p = P.ejercicios[ej.id] || { mejor: 0, intentos: 0 };
    p.total = ej.items.length;
    p.intentos = (p.intentos || 0) + 1;
    if (aciertos > (p.mejor || 0)) p.mejor = aciertos;
    p.fecha = hoy();
    p.respuestas = respuestas;
    P.ejercicios[ej.id] = p;
    if (P.dias.indexOf(hoy()) === -1) P.dias.push(hoy());
    guarda();
  }

  function racha() {
    if (!P.dias.length) return 0;
    var set = {}; P.dias.forEach(function (d) { set[d] = 1; });
    var n = 0, d = new Date();
    // si hoy todavia no se ha practicado, la racha sigue viva hasta manana
    if (!set[d.toISOString().slice(0, 10)]) d.setDate(d.getDate() - 1);
    while (set[d.toISOString().slice(0, 10)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  function aciertosTotales() {
    return Object.keys(P.ejercicios).reduce(function (a, k) { return a + (P.ejercicios[k].mejor || 0); }, 0);
  }

  /* ---------- estado de las etapas ---------- */

  function dominio(etapa) {
    var ejs = etapa.ejercicios || [];
    var items = ejs.reduce(function (a, e) { return a + e.items.length; }, 0);
    var ok = ejs.reduce(function (a, e) { return a + ((P.ejercicios[e.id] || {}).mejor || 0); }, 0);
    return { ok: ok, items: items, pct: items ? ok / items : 0 };
  }

  function estado(etapa) {
    if (!etapa.ejercicios) return 'pronto';
    var d = dominio(etapa);
    if (d.items && d.ok === d.items) return 'completa';
    var ant = etapa._anterior;
    if (!ant) return 'abierta';
    if (!ant.ejercicios) return 'abierta';           // la anterior aun no existe: no bloquea
    return dominio(ant).pct >= UMBRAL ? 'abierta' : 'bloqueada';
  }

  function siguienteEjercicio() {
    for (var i = 0; i < ETAPAS.length; i++) {
      var e = ETAPAS[i];
      if (estado(e) !== 'abierta') continue;
      var pendiente = (e.ejercicios || []).filter(function (ej) {
        var p = P.ejercicios[ej.id];
        return !p || p.mejor < ej.items.length;
      })[0];
      if (pendiente) return pendiente;
    }
    return null;
  }

  /* ---------- insignias ---------- */

  var INSIGNIAS = [
    { id: 'primer-paso', icono: '🎯', cumple: function () { return Object.keys(P.ejercicios).length >= 1; } },
    { id: 'perfecto', icono: '✨', cumple: function () {
        return Object.keys(P.ejercicios).some(function (k) {
          var p = P.ejercicios[k]; return p.total && p.mejor === p.total; }); } },
    { id: 'racha3', icono: '🔥', cumple: function () { return racha() >= 3; } },
    { id: 'racha7', icono: '🏅', cumple: function () { return racha() >= 7; } },
    { id: 'cien', icono: '💯', cumple: function () { return aciertosTotales() >= 100; } },
    { id: 'etapa', icono: '🏆', cumple: function () {
        return ETAPAS.some(function (e) { return estado(e) === 'completa'; }); } }
  ];

  function revisaInsignias() {
    var nuevas = [];
    INSIGNIAS.forEach(function (b) {
      if (P.insignias.indexOf(b.id) === -1 && b.cumple()) { P.insignias.push(b.id); nuevas.push(b); }
    });
    if (nuevas.length) { guarda(); track('practica_insignia', { insignias: nuevas.map(function (b) { return b.id; }).join(',') }); }
    return nuevas;
  }

  function aviso(texto) {
    var t = $('#toast');
    t.innerHTML = texto;
    t.classList.add('visible');
    clearTimeout(aviso._t);
    aviso._t = setTimeout(function () { t.classList.remove('visible'); }, 4200);
  }

  /* ---------- panel ---------- */

  function pintaPanel() {
    var n = nivelAlumno();
    $('#st-nivel').textContent = n ? n.nivel : '—';
    $('#st-nivel-pie').textContent = n ? T.tuNivel : T.sinNivel;
    $('#sin-test').hidden = !!n;
    $('#st-racha').textContent = racha();
    $('#st-puntos').textContent = aciertosTotales();

    // continuar
    var sig = siguienteEjercicio();
    var cont = $('#continuar');
    if (sig) {
      cont.hidden = false;
      cont.innerHTML =
        '<div><p class="cont-eti">' + esc(T.continuar) + '</p>' +
        '<p class="cont-tit">' + esc(sig._etapa.titulo) + ' · ' + esc(sig.titulo) + '</p>' +
        '<p class="cont-sub">' + esc(T.tipos[sig.tipo] || sig.tipo) + ' · ' + sig.items.length + ' ' + esc(T.items) + '</p></div>' +
        '<button class="btn btn-azul" data-ej="' + esc(sig.id) + '">' + esc(T.empezar) + '</button>';
    } else { cont.hidden = true; }

    // rutas
    var cont2 = $('#rutas');
    cont2.innerHTML = '';
    DATA.rutas.forEach(function (ruta) {
      var conContenido = ruta.etapas.filter(function (e) { return e.ejercicios; }).length;
      var s = document.createElement('section');
      s.className = 'ruta';
      var h = '<div class="ruta-cab"><div><h2>' + esc(ruta.titulo) + '</h2>' +
              '<p class="ruta-sub">' + esc(ruta.subtitulo) + '</p></div>' +
              '<span class="nivel-chip">' + esc(ruta.nivel) + '</span></div>';
      h += '<ol class="etapas" data-ruta="' + esc(ruta.id) + '">';
      ruta.etapas.forEach(function (etapa, i) {
        h += tarjetaEtapa(etapa, i);
      });
      h += '</ol>';
      if (ruta.etapas.length > 6) {
        h += '<button class="ver-mas" data-ruta="' + esc(ruta.id) + '">' +
             T.verTodas.replace('{n}', ruta.etapas.length) + '</button>';
      }
      h += '<p class="ruta-pie">' + T.deLasCuales.replace('{n}', conContenido).replace('{t}', ruta.etapas.length) + '</p>';
      s.innerHTML = h;
      cont2.appendChild(s);
    });

    // insignias
    var ins = $('#insignias');
    ins.innerHTML = INSIGNIAS.map(function (b) {
      var tiene = P.insignias.indexOf(b.id) > -1;
      var t = T.insignias[b.id];
      return '<div class="insignia' + (tiene ? '' : ' pendiente') + '">' +
             '<span class="ins-icono">' + b.icono + '</span>' +
             '<span class="ins-tit">' + esc(t.titulo) + '</span>' +
             '<span class="ins-sub">' + esc(t.texto) + '</span></div>';
    }).join('');
  }

  function tarjetaEtapa(etapa, i) {
    var e = estado(etapa);
    var d = dominio(etapa);
    var oculta = i >= 6 ? ' oculta' : '';
    var pct = Math.round(d.pct * 100);
    var h = '<li class="etapa ' + e + oculta + '" data-etapa="' + esc(etapa.id) + '">';
    h += '<span class="et-num">' + (i + 1) + '</span>';
    h += '<span class="et-cuerpo"><span class="et-tit">' + esc(etapa.titulo) + '</span>';
    if (etapa.temas) h += '<span class="et-sub">' + esc(etapa.temas.slice(0, 3).join(' · ')) +
                          (etapa.temas.length > 3 ? ' · +' + (etapa.temas.length - 3) : '') + '</span>';
    else if (etapa.resumen) h += '<span class="et-sub">' + esc(etapa.resumen) + '</span>';
    if (e === 'abierta' && d.ok > 0) {
      h += '<span class="et-barra"><i style="width:' + pct + '%"></i></span>';
    }
    h += '</span>';
    if (e === 'completa') h += '<span class="et-marca ok">✓</span>';
    else if (e === 'bloqueada') h += '<span class="et-marca">' + candado() + '</span>';
    else if (e === 'pronto') h += '<span class="et-marca pronto">' + esc(T.pronto) + '</span>';
    else h += '<span class="et-marca abierta">' + d.ok + '/' + d.items + '</span>';
    h += '</li>';
    return h;
  }

  function candado() {
    return '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
           '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>';
  }

  /* ---------- pantalla de etapa ---------- */

  var etapaActual = null;

  function pintaEtapa(etapa) {
    etapaActual = etapa;
    $('#et-ruta').textContent = etapa._ruta.titulo;
    $('#et-titulo').textContent = etapa.titulo;
    var chips = $('#et-temas');
    if (etapa.temas) {
      chips.hidden = false;
      chips.innerHTML = etapa.temas.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('');
    } else { chips.hidden = true; }

    var d = dominio(etapa);
    $('#et-dominio').textContent = T.dominio.replace('{ok}', d.ok).replace('{n}', d.items);
    $('#et-fill').style.width = Math.round(d.pct * 100) + '%';

    var lista = $('#et-lista');
    lista.innerHTML = (etapa.ejercicios || []).map(function (ej) {
      var p = P.ejercicios[ej.id];
      var n = ej.items.length, marca, clase = '';
      if (p && p.mejor === n) { clase = ' perfecto'; marca = '<span class="pill ok">' + T.perfecto + '</span>'; }
      else if (p) { clase = ' empezado'; marca = '<span class="pill">' + p.mejor + '/' + n + '</span>'; }
      else { marca = '<span class="pill vacia">' + n + ' ' + T.items + '</span>'; }
      return '<li><button class="tarjeta' + clase + '" data-ej="' + esc(ej.id) + '">' +
             '<span class="t-tipo">' + esc(T.tipos[ej.tipo] || ej.tipo) + '</span>' +
             '<span class="t-tit">' + esc(ej.titulo) + '</span>' + marca + '</button></li>';
    }).join('');
  }

  /* ---------- ejercicio ---------- */

  var actual = null;

  function campo(i, ancho) {
    return '<input class="hueco ' + (ancho || 'medio') + '" data-i="' + i + '" type="text" ' +
           'autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" ' +
           'aria-label="' + T.hueco + ' ' + (i + 1) + '">';
  }

  function conMarcadores(txt) {
    return String(txt).replace(/\{(\d+)\}/g, function (_, n) {
      return '<span class="conhueco"><em class="num">' + n + '</em>' + campo(Number(n) - 1, 'corto') + '</span>';
    });
  }

  var ANCHO = { caja: 'corto', cloze: 'corto', formacion: 'medio', transformacion: 'largo' };

  function pintaEjercicio(ej) {
    actual = ej;
    $('#ej-tipo').textContent = T.tipos[ej.tipo] || ej.tipo;
    $('#ej-titulo').textContent = ej.titulo;
    $('#ej-instruccion').innerHTML = ej.instruccion;
    $('#ej-etapa').textContent = ej._ruta.titulo + ' · ' + ej._etapa.titulo;

    var caja = $('#ej-caja');
    if (ej.tipo === 'caja' && ej.caja) {
      caja.hidden = false;
      caja.innerHTML = ej.caja.map(function (w) { return '<span>' + esc(w) + '</span>'; }).join('');
    } else { caja.hidden = true; }

    var cuerpo = $('#ej-cuerpo');
    var h = '';
    if (ej.tipo === 'cloze') {
      h += '<div class="texto">' + ej.texto.map(function (p) {
        return '<p>' + conMarcadores(esc(p)) + '</p>';
      }).join('') + '</div>';
    } else {
      h += '<ol class="frases">';
      ej.items.forEach(function (it, i) {
        h += '<li>';
        if (ej.tipo === 'transformacion') {
          h += '<p class="origen">' + esc(it.frase) + '</p>';
          h += '<p class="clave"><span>' + esc(it.clave) + '</span></p>';
        }
        h += '<p class="frase">' + esc(it.antes || '') + ' ' + campo(i, ANCHO[ej.tipo]) + ' ' + esc(it.despues || '');
        if (ej.tipo === 'formacion') h += ' <span class="raiz">' + esc(it.raiz) + '</span>';
        h += '</p></li>';
      });
      h += '</ol>';
    }
    cuerpo.innerHTML = h;

    var guardado = (P.ejercicios[ej.id] || {}).respuestas;
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
    if (!window.matchMedia('(min-width:700px)').matches) return;
    var libres = $$('.hueco').filter(function (i) { return !i.value; });
    (libres[0] || $('.hueco') || {}).focus && (libres[0] || $('.hueco')).focus();
  }

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

    var abiertasAntes = ETAPAS.filter(function (e) { return estado(e) === 'abierta' || estado(e) === 'completa'; }).length;
    anota(ej, ok, respuestas);

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

    var nuevas = revisaInsignias();
    var abiertasDespues = ETAPAS.filter(function (e) { return estado(e) === 'abierta' || estado(e) === 'completa'; }).length;
    if (abiertasDespues > abiertasAntes) aviso('🔓 <b>' + esc(T.desbloqueada) + '</b>');
    else if (nuevas.length) aviso(nuevas[0].icono + ' <b>' + esc(T.insignias[nuevas[0].id].titulo) + '</b> · ' + esc(T.insignias[nuevas[0].id].texto));
  }

  function repite() {
    $$('.hueco', $('#ej-cuerpo')).forEach(function (inp, i) {
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

  /* ---------- navegacion ---------- */

  function muestra(id) {
    $$('.pantalla').forEach(function (p) { p.classList.toggle('activa', p.id === id); });
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.body.classList.toggle('dentro', id !== 's-panel');
  }

  function abreEtapa(id, empujar) {
    var e = porId(ETAPAS, id);
    if (!e || estado(e) === 'pronto' || estado(e) === 'bloqueada') return;
    pintaEtapa(e);
    muestra('s-etapa');
    if (empujar !== false) history.pushState({}, '', '#' + id);
    track('practica_etapa_abierta', { etapa: id });
  }

  function abreEjercicio(id, empujar) {
    var ej = porId(EJERCICIOS, id);
    if (!ej) return;
    pintaEjercicio(ej);
    muestra('s-ejercicio');
    if (empujar !== false) history.pushState({}, '', '#' + id);
  }

  function atras() {
    if ($('#s-ejercicio').classList.contains('activa') && actual) abreEtapa(actual._etapa.id);
    else { pintaPanel(); muestra('s-panel'); history.pushState({}, '', location.pathname); }
  }

  function siguiente() {
    var lista = actual._etapa.ejercicios;
    var i = lista.indexOf(actual);
    if (i > -1 && i + 1 < lista.length) abreEjercicio(lista[i + 1].id);
    else { pintaEtapa(actual._etapa); muestra('s-etapa'); history.pushState({}, '', '#' + actual._etapa.id); }
  }

  function pinta(hash) {
    var id = (hash || '').replace('#', '');
    if (id && porId(EJERCICIOS, id)) { abreEjercicio(id, false); return; }
    if (id && porId(ETAPAS, id)) { abreEtapa(id, false); return; }
    pintaPanel(); muestra('s-panel');
  }

  /* ---------- eventos ---------- */

  document.addEventListener('click', function (e) {
    var ej = e.target.closest('[data-ej]');
    if (ej) { abreEjercicio(ej.getAttribute('data-ej')); return; }
    var et = e.target.closest('[data-etapa]');
    if (et) { abreEtapa(et.getAttribute('data-etapa')); return; }
    var vm = e.target.closest('.ver-mas');
    if (vm) {
      var ol = $('.etapas[data-ruta="' + vm.getAttribute('data-ruta') + '"]');
      $$('.oculta', ol).forEach(function (li) { li.classList.remove('oculta'); });
      vm.remove();
      return;
    }
    if (e.target.closest('#btn-corregir')) { corrige(); return; }
    if (e.target.closest('#btn-repetir')) { repite(); return; }
    if (e.target.closest('#btn-volver')) { atras(); return; }
    if (e.target.closest('#btn-siguiente')) { siguiente(); return; }
    if (e.target.closest('#et-volver')) { pintaPanel(); muestra('s-panel'); history.pushState({}, '', location.pathname); return; }
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

  window.addEventListener('popstate', function () { pinta(location.hash); });

  revisaInsignias();
  pinta(location.hash);
})();
