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

  // El curso es una lista de tests; cada test, una lista de sesiones; cada
  // sesion, una receta de bloques por destreza. Los ejercicios viven en un
  // unico saco y las sesiones los referencian por id.
  var SESIONES = [], EJERCICIOS = [], BLOQUES = [];
  var DESTREZA = {};
  DATA.destrezas.forEach(function (x) { DESTREZA[x.id] = x; });

  DATA.tests.forEach(function (test) {
    test.sesiones = test.sesiones || [];
    test.sesiones.forEach(function (ses, i) {
      ses._test = test; ses._i = i;
      ses._anterior = i > 0 ? test.sesiones[i - 1] : null;
      ses.bloques = ses.bloques || [];
      ses._ejercicios = [];
      ses.bloques.forEach(function (bl) {
        bl._sesion = ses;
        bl._destreza = DESTREZA[bl.destreza] || { id: bl.destreza, nombre: bl.destreza };
        bl._ejercicios = (bl.ejercicios || []).map(function (id) {
          var ej = DATA.ejercicios[id];
          if (!ej) return null;
          ej.id = id; ej._bloque = bl; ej._sesion = ses; ej._test = test;
          if (EJERCICIOS.indexOf(ej) === -1) EJERCICIOS.push(ej);
          ses._ejercicios.push(ej);
          return ej;
        }).filter(Boolean);
        BLOQUES.push(bl);
      });
      SESIONES.push(ses);
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
    if (item.opciones) return Number(valor) === item.correcta;
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

  function fechaCorta(iso) {
    var p = String(iso || '').split('-');
    return p.length === 3 ? Number(p[2]) + '/' + Number(p[1]) + '/' + p[0] : iso;
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
    var vacio = { ejercicios: {}, dias: [], insignias: [], tramos: {} };
    try {
      var raw = JSON.parse(localStorage.getItem(CLAVE));
      if (raw && raw.ejercicios) return Object.assign(vacio, raw);
    } catch (e) {}
    return vacio;
  })();
  // El navegador manda: se guarda siempre aqui, con cuenta o sin ella. Si hay
  // sesion, well-datos.js sube los cambios despues, agrupados y en segundo
  // plano. Si el servidor falla o no esta configurado, esto no se entera.
  function guarda() {
    try { localStorage.setItem(CLAVE, JSON.stringify(P)); } catch (e) {}
    try { if (window.WellDatos) window.WellDatos.empuja(P); } catch (e) {}
  }

  function nombreAlumno() {
    try { return (localStorage.getItem('well_nombre') || '').trim(); } catch (e) { return ''; }
  }
  // "juan carlos" -> "Juan Carlos", sin tocar lo que ya venga en mayusculas
  function bonito(n) {
    return String(n || '').trim().replace(/(^|[\s'-])(\S)/g, function (_, sep, letra) {
      return sep + letra.toUpperCase();
    });
  }

  function guardaNombre(n) {
    try { localStorage.setItem('well_nombre', bonito(n)); } catch (e) {}
    subePerfil();
  }

  function subePerfil() {
    if (!window.WellDatos || !window.WellDatos.sesion()) return;
    window.WellDatos.guardaPerfil({ nombre: bonito(nombreAlumno()), nivel: nivelAlumno() });
  }

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

  // Los siete ultimos dias, de hace seis a hoy, para la tira de la racha.
  function ultimosDias() {
    var set = {}; P.dias.forEach(function (x) { set[x] = 1; });
    var salida = [];
    for (var i = 6; i >= 0; i--) {
      var f = new Date(); f.setDate(f.getDate() - i);
      var iso = f.toISOString().slice(0, 10);
      salida.push({ iso: iso, inicial: T.diasSemana[f.getDay()], hecho: !!set[iso], hoy: i === 0 });
    }
    return salida;
  }

  function totales() {
    var items = 0, ok = 0, perfectos = 0, empezados = 0, pendientes = 0;
    EJERCICIOS.forEach(function (e) {
      items += e.items.length;
      var p = P.ejercicios[e.id];
      if (!p) return;
      ok += p.mejor; empezados++;
      if (p.mejor === e.items.length) perfectos++;
    });
    SESIONES.forEach(function (e) {
      if (estado(e) !== 'abierta') return;
      (e.ejercicios || []).forEach(function (ej) {
        var p = P.ejercicios[ej.id];
        if (!p || p.mejor < ej.items.length) pendientes++;
      });
    });
    return {
      items: items, ok: ok, perfectos: perfectos, empezados: empezados, pendientes: pendientes,
      ejercicios: EJERCICIOS.length,
      etapasCompletas: SESIONES.filter(function (e) { return estado(e) === 'completa'; }).length,
      etapasConMaterial: SESIONES.filter(function (e) { return e._ejercicios.length; }).length,
      pct: items ? ok / items : 0
    };
  }

  /* ---------- estado de las sesiones ---------- */

  function dominioLista(ejs) {
    var items = ejs.reduce(function (a, e) { return a + e.items.length; }, 0);
    var ok = ejs.reduce(function (a, e) { return a + ((P.ejercicios[e.id] || {}).mejor || 0); }, 0);
    return { ok: ok, items: items, pct: items ? ok / items : 0 };
  }
  function dominio(ses) { return dominioLista(ses._ejercicios); }

  function estado(ses) {
    if (!ses._ejercicios.length) return 'pronto';
    var d0 = dominio(ses);
    if (d0.items && d0.ok === d0.items) return 'completa';
    var ant = ses._anterior;
    if (!ant || !ant._ejercicios.length) return 'abierta';
    return dominio(ant).pct >= UMBRAL ? 'abierta' : 'bloqueada';
  }

  // Nota por destreza dentro de un test: solo cuentan las que informa
  // Cambridge y solo con lo que ya tiene material.
  function notasTest(test) {
    var salida = [];
    DATA.destrezas.filter(function (x) { return x.puntua; }).forEach(function (dz) {
      var ejs = [];
      (test.sesiones || []).forEach(function (s) {
        s.bloques.forEach(function (b) {
          if (b.destreza === dz.id) ejs = ejs.concat(b._ejercicios);
        });
      });
      var hechos = ejs.filter(function (e) { return P.ejercicios[e.id]; });
      salida.push({
        destreza: dz, ejercicios: ejs.length, hechos: hechos.length,
        dominio: dominioLista(ejs), correccion: dz.correccion || null
      });
    });
    return salida;
  }

  function estadoTest(test) {
    var ses = test.sesiones || [];
    var conMaterial = ses.filter(function (s) { return s._ejercicios.length; });
    var completas = ses.filter(function (s) { return estado(s) === 'completa'; }).length;
    var d0 = dominioLista(conMaterial.reduce(function (a, s) { return a.concat(s._ejercicios); }, []));
    return {
      sesiones: ses.length, conMaterial: conMaterial.length, completas: completas,
      ok: d0.ok, items: d0.items, pct: d0.pct,
      hecho: ses.length > 0 && completas === ses.length,
      vivo: ses.some(function (s) { return estado(s) === 'abierta'; })
    };
  }

  function siguienteEjercicio() {
    for (var i = 0; i < SESIONES.length; i++) {
      var s = SESIONES[i];
      if (estado(s) !== 'abierta') continue;
      var pendiente = s._ejercicios.filter(function (ej) {
        var p = P.ejercicios[ej.id];
        return !p || p.mejor < ej.items.length;
      })[0];
      if (pendiente) return pendiente;
    }
    return null;
  }

  /* ---------- insignias ---------- */

  var INSIGNIAS = [
    { id: 'primer-paso',     icono: '🎯', meta: 1,   valor: function () { return totales().empezados; } },
    { id: 'perfecto',        icono: '✨', meta: 1,   valor: function () { return totales().perfectos; } },
    { id: 'cinco-perfectos', icono: '🌟', meta: 5,   valor: function () { return totales().perfectos; } },
    { id: 'racha3',          icono: '🔥', meta: 3,   valor: racha },
    { id: 'racha7',          icono: '🏅', meta: 7,   valor: racha },
    { id: 'racha30',         icono: '👑', meta: 30,  valor: racha },
    { id: 'cincuenta',       icono: '🧩', meta: 50,  valor: function () { return totales().ok; } },
    { id: 'cien',            icono: '💯', meta: 100, valor: function () { return totales().ok; } },
    { id: 'quinientos',      icono: '🚀', meta: 500, valor: function () { return totales().ok; } },
    { id: 'etapa',           icono: '🏆', meta: 1,   valor: function () { return totales().etapasCompletas; } },
    { id: 'cinco-etapas',    icono: '🗺️', meta: 5,   valor: function () { return totales().etapasCompletas; } }
  ];
  var porInsignia = function (id) { return INSIGNIAS.filter(function (b) { return b.id === id; })[0]; };
  var ganada = function (b) { return P.insignias.indexOf(b.id) > -1; };

  function revisaInsignias() {
    var nuevas = [];
    INSIGNIAS.forEach(function (b) {
      if (!ganada(b) && b.valor() >= b.meta) { P.insignias.push(b.id); nuevas.push(b); }
    });
    if (nuevas.length) {
      guarda();
      track('practica_insignia', { insignias: nuevas.map(function (b) { return b.id; }).join(',') });
    }
    return nuevas;
  }

  // El hito mas cercano de los que quedan: el que mas porcentaje lleva hecho.
  function proximoHito() {
    var candidatos = INSIGNIAS.filter(function (b) { return !ganada(b); });
    if (!candidatos.length) return null;
    candidatos.sort(function (a, b) {
      var ra = a.valor() / a.meta, rb = b.valor() / b.meta;
      if (rb !== ra) return rb - ra;
      return (a.meta - a.valor()) - (b.meta - b.valor());
    });
    var h = candidatos[0];
    return { insignia: h, valor: Math.min(h.valor(), h.meta), meta: h.meta, falta: Math.max(0, h.meta - h.valor()) };
  }

  /* ---------- celebracion ---------- */

  var cola = [];
  function celebra(lista) {
    cola = cola.concat(lista);
    if (cola.length && $('#premio').hidden) siguientePremio();
  }
  function siguientePremio() {
    var p = cola.shift();
    if (!p) { $('#premio').hidden = true; return; }
    $('#premio-icono').textContent = p.icono;
    $('#premio-eti').textContent = p.eti;
    $('#premio-tit').textContent = p.titulo;
    $('#premio-sub').textContent = p.texto;
    $('#premio').hidden = false;
    requestAnimationFrame(function () { $('#premio').classList.add('visible'); });
  }
  function cierraPremio() {
    $('#premio').classList.remove('visible');
    setTimeout(function () { $('#premio').hidden = true; if (cola.length) siguientePremio(); }, 260);
  }

  /* ---------- panel ---------- */

  // La chapa de usuario vive en la cabecera, asi que se pinta siempre, tambien
  // si se entra directo a un ejercicio por su enlace.
  function pintaUsuario() {
    var nombre = bonito(nombreAlumno());
    var niv = nivelAlumno();
    $('#user-inicial').textContent = nombre ? nombre.charAt(0) : '?';
    $('#user-nombre').textContent = nombre || T.tuPerfil;
    $('#um-nombre').textContent = nombre || T.tuPerfil;
    $('#um-nivel').textContent = niv ? T.nivelEs.replace('{n}', niv.nivel) : T.sinNivelMenu;
    $('#um-nombre-btn').textContent = nombre ? T.cambiarNombre : T.ponerNombre;
  }

  function pintaPanel() {
    var t = totales();
    var niv = nivelAlumno();
    var nombre = bonito(nombreAlumno());
    pintaUsuario();

    // saludo
    var hora = new Date().getHours();
    var franja = hora < 13 ? 'manana' : hora < 21 ? 'tarde' : 'noche';
    $('#saludo').textContent = nombre ? T.saludo[franja].replace('{nombre}', nombre) : T.saludoSinNombre;

    var chip = $('#nivel-alumno');
    if (niv) { chip.hidden = false; chip.textContent = niv.nivel; } else { chip.hidden = true; }
    $('#sin-test').hidden = !!niv;

    var sig = siguienteEjercicio();
    $('#situacion').textContent = sig
      ? T.vasPor.replace('{etapa}', tituloSesion(sig._sesion)).replace('{ruta}', sig._test.titulo)
      : T.alDia;

    // anillo
    var circ = 2 * Math.PI * 52;
    var aro = $('#aro');
    aro.style.strokeDasharray = circ.toFixed(1);
    aro.style.strokeDashoffset = (circ * (1 - t.pct)).toFixed(1);
    $('#aro-pct').textContent = Math.round(t.pct * 100) + '%';
    $('#aro-pie').textContent = T.dominado;
    $('#aro-detalle').textContent = T.huecosDe.replace('{ok}', t.ok).replace('{n}', t.items);

    // racha
    $('#racha-n').textContent = racha();
    $('#racha-pie').textContent = racha() === 1 ? T.diaSeguido : T.diasSeguidos;
    $('#tira').innerHTML = ultimosDias().map(function (d0) {
      return '<span class="dia' + (d0.hecho ? ' hecho' : '') + (d0.hoy ? ' hoy' : '') +
             '" title="' + esc(d0.iso) + '"><i>' + esc(d0.inicial) + '</i></span>';
    }).join('');

    $('#cf-perfectos').textContent = t.perfectos;
    $('#cf-etapas').textContent = t.etapasCompletas;
    $('#cf-pendientes').textContent = t.pendientes;

    // insignias: solo la tira y el hito; el detalle vive en su hoja
    var logradas = INSIGNIAS.filter(ganada);
    $('#ins-cuenta').textContent = logradas.length + '/' + INSIGNIAS.length;
    var tira = logradas.slice(0, 5).map(function (b) {
      return '<span class="ins-ficha lograda" title="' + esc(T.insignias[b.id].titulo) + '">' + b.icono + '</span>';
    });
    if (logradas.length > 5) tira.push('<span class="ins-ficha mas">+' + (logradas.length - 5) + '</span>');
    INSIGNIAS.filter(function (b) { return !ganada(b); }).slice(0, Math.max(0, 6 - tira.length)).forEach(function (b) {
      tira.push('<span class="ins-ficha pendiente" title="' + esc(T.insignias[b.id].titulo) + '">' + b.icono + '</span>');
    });
    $('#ins-tira').innerHTML = tira.join('');

    var h = proximoHito();
    var caja = $('#hito');
    if (h) {
      caja.hidden = false;
      caja.innerHTML =
        '<span class="hito-eti">' + esc(T.proximoHito) + '</span>' +
        '<span class="hito-fila"><span class="hito-tit">' + esc(T.insignias[h.insignia.id].titulo) + '</span>' +
        '<span class="hito-num">' + h.valor + '/' + h.meta + '</span></span>' +
        '<span class="hito-barra"><i style="width:' + Math.round(h.valor / h.meta * 100) + '%"></i></span>';
    } else { caja.hidden = true; }

    pintaInsignias();

    // continuar
    var cont = $('#continuar');
    if (sig) {
      cont.hidden = false;
      cont.innerHTML =
        '<div><p class="cont-eti">' + esc(T.continuar) + '</p>' +
        '<p class="cont-tit">' + esc(tituloSesion(sig._sesion)) + ' · ' + esc(sig.titulo) + '</p>' +
        '<p class="cont-sub">' + esc(T.tipos[sig.tipo] || sig.tipo) + ' · ' + sig.items.length + ' ' + esc(T.items) + '</p></div>' +
        '<button class="btn btn-azul" data-ej="' + esc(sig.id) + '">' + esc(T.empezar) + '</button>';
    } else { cont.hidden = true; }

    // el curso: un test detras de otro
    var cont2 = $('#rutas');
    var conMaterial = SESIONES.filter(function (s) { return s._ejercicios.length; }).length;
    cont2.innerHTML =
      '<div class="ruta-cab"><div><h2>' + esc(T.cursoTitulo.replace('{examen}', DATA.examen.nombre)) + '</h2>' +
      '<p class="ruta-sub">' + esc(T.cursoSub) + '</p></div>' +
      '<span class="nivel-chip">' + esc(DATA.examen.sigla) + '</span></div>' +
      DATA.tests.map(function (t) { return pintaTest(t, sig); }).join('') +
      '<p class="ruta-pie">' + T.sesionesCargadas.replace('{n}', conMaterial).replace('{t}', SESIONES.length) + '</p>';
  }

  /* ---------- el camino: un test, sus sesiones ---------- */

  function pintaTest(test, sig) {
    var st = estadoTest(test);
    var tieneAqui = sig && (test.sesiones || []).indexOf(sig._sesion) > -1;
    var abierto = P.tramos[test.id] !== undefined ? !!P.tramos[test.id] : (tieneAqui || st.vivo || st.conMaterial > 0);

    var marca = st.hecho ? '<span class="tramo-marca hecho">' + esc(T.completada) + '</span>'
              : st.items ? '<span class="tramo-marca viva">' + st.ok + '/' + st.items + '</span>'
              : '';

    var h = '<section class="tramo' + (st.hecho ? ' hecho' : '') + (tieneAqui ? ' aqui' : '') +
            (abierto ? ' abierto' : '') + '">';
    h += '<button type="button" class="tramo-cab" data-tramo="' + esc(test.id) + '" aria-expanded="' +
         (abierto ? 'true' : 'false') + '">' +
         '<span class="chevron" aria-hidden="true"></span>' +
         '<span class="tramo-tit">' + esc(test.titulo) + '</span>' +
         '<span class="tramo-cuenta">' + (st.sesiones ? T.sesionesN.replace('{n}', st.sesiones) : esc(T.pronto)) + '</span>' +
         marca + '</button>';
    h += '<div class="tramo-cuerpo"' + (abierto ? '' : ' hidden') + '><ol class="mapa">';
    h += (test.sesiones || []).map(function (s, i) { return tarjetaSesion(s, i, sig); }).join('');
    h += simulacrosDe(test).map(function (sm) { return filaSimulacro(sm); }).join('');
    h += metaTest(test, st);
    h += '</ol></div></section>';
    return h;
  }

  function filaSimulacro(sm) {
    var hist = (P.simulacros || {})[sm.id] || [];
    var ultimo = hist[hist.length - 1];
    var pct = ultimo && ultimo.items ? Math.round(ultimo.ok / ultimo.items * 100) : null;
    var h = '<li class="paso simulacro' + (ultimo ? ' hecho' : '') + '">';
    h += '<button type="button" class="paso-btn" data-simulacro="' + esc(sm.id) + '">';
    h += '<span class="nodo sim-nodo" aria-hidden="true">⏱</span>';
    h += '<span class="paso-cuerpo"><span class="paso-tit">' +
         esc(T.simulacroDe.replace('{destreza}', sm.destreza.nombre)) + '</span>' +
         '<span class="paso-sub">' + esc(T.simulacroSub
           .replace('{min}', sm.minutos).replace('{n}', sm.items)
           .replace('{p}', sm.partes.length)) + '</span></span>';
    h += '<span class="paso-marca ' + (pct === null ? 'gris' : pct >= 60 ? 'hecho' : 'flojo') + '">' +
         (pct === null ? esc(T.simSinHacer) : pct + '%') + '</span>';
    return h + '</button></li>';
  }

  function metaTest(test, st) {
    if (!st.sesiones) return '';
    var h = '<li class="paso meta' + (st.hecho ? ' hecho' : '') + '">';
    h += '<button type="button" class="paso-btn" data-informe="' + esc(test.id) + '">';
    h += '<span class="nodo meta-nodo" aria-hidden="true">' + (st.hecho ? '🏆' : '📊') + '</span>';
    h += '<span class="paso-cuerpo"><span class="paso-tit">' +
         esc(st.hecho ? T.informeListo : T.informeTest) + '</span>' +
         '<span class="paso-sub">' + esc(T.informeSub) + '</span></span>';
    h += '<span class="paso-marca ' + (st.hecho ? 'hecho' : 'gris') + '">' +
         st.completas + '/' + st.sesiones + '</span>';
    return h + '</button></li>';
  }

  // Un renglon de la receta: "2 vocabulario", "Use of English · Parte 2"...
  function resumenReceta(ses) {
    return ses.bloques.map(function (b) {
      // "Use of English 2" se lee solo; "2 vocabulario" necesita el numero
      if (b.parte) return b._destreza.nombre + ' ' + b.parte;
      var n = b._ejercicios.length;
      return n > 1 ? n + ' ' + b._destreza.nombre.toLowerCase() : b._destreza.nombre;
    }).join(' · ');
  }

  function pintaInsignias() {
    $('#insignias').innerHTML = INSIGNIAS.map(function (b) {
      var tiene = ganada(b), txt = T.insignias[b.id];
      var v = Math.min(b.valor(), b.meta);
      var h = '<div class="insignia' + (tiene ? ' lograda' : '') + '">' +
              '<span class="ins-icono">' + b.icono + '</span>' +
              '<span class="ins-tit">' + esc(txt.titulo) + '</span>' +
              '<span class="ins-sub">' + esc(txt.texto) + '</span>';
      if (tiene) h += '<span class="ins-check">✓</span>';
      else if (b.meta > 1) h += '<span class="ins-barra"><i style="width:' + Math.round(v / b.meta * 100) + '%"></i></span>' +
                                '<span class="ins-num">' + v + '/' + b.meta + '</span>';
      return h + '</div>';
    }).join('');
  }

  function tarjetaSesion(ses, i, sig) {
    var e = estado(ses);
    var d0 = dominio(ses);
    var aqui = sig && sig._sesion === ses;
    var cerrada = e === 'bloqueada' || e === 'pronto';

    var nodo;
    if (e === 'completa') nodo = '<span class="nodo" aria-hidden="true">✓</span>';
    else if (e === 'bloqueada') nodo = '<span class="nodo">' + candado() + '</span>';
    else nodo = '<span class="nodo">' + (ses.n || i + 1) + '</span>';

    var sub;
    if (e === 'bloqueada') {
      var ant = ses._anterior, da = dominio(ant);
      var faltan = Math.max(1, Math.ceil(UMBRAL * da.items) - da.ok);
      sub = T.paraAbrir.replace('{n}', faltan).replace('{etapa}', tituloSesion(ant));
    } else {
      sub = resumenReceta(ses);
    }

    var marca = '';
    if (e === 'completa') marca = '<span class="paso-marca hecho">' + esc(T.completada) + '</span>';
    else if (e === 'abierta') marca = '<span class="paso-marca viva">' + d0.ok + '/' + d0.items + '</span>';

    var h = '<li class="paso ' + e + (aqui ? ' aqui' : '') + '">';
    h += '<button type="button" class="paso-btn" data-sesion="' + esc(ses.id) + '"' + (cerrada ? ' disabled' : '') + '>';
    h += nodo;
    h += '<span class="paso-cuerpo"><span class="paso-tit">' + esc(tituloSesion(ses)) +
         (aqui ? '<em class="et-aqui">' + esc(T.estasAqui) + '</em>' : '') + '</span>';
    if (sub) h += '<span class="paso-sub">' + esc(sub) + '</span>';
    if (e === 'abierta' && d0.ok > 0) {
      h += '<span class="paso-barra"><i style="width:' + Math.round(d0.pct * 100) + '%"></i></span>';
    }
    h += '</span>' + marca + '</button></li>';
    return h;
  }

  function tituloSesion(ses) {
    var base = T.sesion.replace('{n}', ses.n || '');
    return ses.tipo === 'W' ? T.sesionWriting : base;
  }

  function candado() {
    return '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
           '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>';
  }

  /* ---------- pantalla de etapa ---------- */

  var etapaActual = null, testActual = null;

  function pintaSesion(ses) {
    etapaActual = ses;
    $('#et-ruta').innerHTML = '<button type="button" class="miga-atras" data-ir="panel">' +
      esc(T.tuCamino) + '</button><span aria-hidden="true">/</span> ' + esc(ses._test.titulo);
    $('#et-titulo').textContent = tituloSesion(ses);

    var chips = $('#et-temas');
    chips.hidden = false;
    chips.innerHTML = '<span class="chip-tipo">' + esc(T.tipoSesion[ses.tipo] || '') + '</span>';

    var d0 = dominio(ses);
    $('#et-dominio').textContent = d0.items
      ? T.dominio.replace('{ok}', d0.ok).replace('{n}', d0.items)
      : T.sesionSinMaterial;
    $('#et-fill').style.width = Math.round(d0.pct * 100) + '%';

    // La receta entera, tenga material o no: asi se ve la clase de verdad
    $('#et-lista').innerHTML = ses.bloques.map(function (bl) {
      var h = '<li class="bloque-ses"><div class="bs-cab">' +
              '<span class="bs-destreza">' + esc(bl._destreza.nombre) +
              (bl.parte ? ' · ' + T.parteN.replace('{n}', bl.parte) : '') + '</span>' +
              (bl.tarea ? '<span class="bs-tarea">' + esc(bl.tarea) + '</span>' : '') +
              '</div>';
      if (!bl._ejercicios.length) {
        h += '<p class="bs-pendiente">' + esc(bl._destreza.correccion ? T.bloqueCorreccion[bl._destreza.correccion] : T.bloquePendiente) + '</p>';
      } else {
        h += '<ul class="tarjetas">' + bl._ejercicios.map(function (ej) {
          var p = P.ejercicios[ej.id];
          var n = ej.items.length, marca, clase = '';
          if (p && p.mejor === n) { clase = ' perfecto'; marca = '<span class="pill ok">' + T.perfecto + '</span>'; }
          else if (p) { clase = ' empezado'; marca = '<span class="pill">' + p.mejor + '/' + n + '</span>'; }
          else { marca = '<span class="pill vacia">' + n + ' ' + T.items + '</span>'; }
          return '<li><button class="tarjeta' + clase + '" data-ej="' + esc(ej.id) + '">' +
                 '<span class="t-tipo">' + esc(T.tipos[ej.tipo] || ej.tipo) + '</span>' +
                 '<span class="t-tit">' + esc(ej.titulo) + '</span>' + marca + '</button></li>';
        }).join('') + '</ul>';
      }
      return h + '</li>';
    }).join('');
  }

  /* ---------- writing ---------- */

  // El texto se guarda en el navegador segun se escribe. La correccion con IA
  // llegara cuando haya servidor; hasta entonces, el alumno se lo descarga.
  var ESCRITO = { ej: null, guarda: null };

  function pintaWriting(ej) {
    actual = ej;
    ESCRITO.ej = ej;
    $('#wr-miga').innerHTML = '<button type="button" class="miga-atras" data-ir="panel">' +
      esc(T.tuCamino) + '</button><span aria-hidden="true">/</span> ' +
      '<button type="button" class="miga-atras" data-sesion="' + esc(ej._sesion.id) + '">' +
      esc(tituloSesion(ej._sesion)) + '</button>';
    $('#wr-titulo').textContent = ej.titulo;
    $('#wr-instruccion').innerHTML = ej.instruccion;
    $('#wr-enunciado').textContent = ej.enunciado || '';
    $('#wr-contexto').innerHTML = (ej.contexto || []).map(function (l) {
      return '<p>' + esc(l) + '</p>';
    }).join('');
    var cierre = $('#wr-cierre');
    cierre.hidden = !ej.cierre;
    cierre.textContent = ej.cierre || '';
    $('#wr-minutos').textContent = T.minutosSugeridos.replace('{n}', ej.minutos || 45);

    var caja = $('#wr-texto');
    caja.value = ((P.ejercicios[ej.id] || {}).texto) || '';
    cuentaPalabras();
    $('#wr-descargar').hidden = !caja.value.trim();
    track('writing_abierto', { ejercicio: ej.id });
  }

  function palabrasDe(t) {
    var s = String(t || '').trim();
    return s ? s.split(/\s+/).length : 0;
  }

  function cuentaPalabras() {
    var ej = ESCRITO.ej;
    if (!ej) return;
    var n = palabrasDe($('#wr-texto').value);
    var min = (ej.palabras || [220, 260])[0], max = (ej.palabras || [220, 260])[1];
    var caja = $('#wr-cuenta');
    caja.textContent = T.palabrasDe.replace('{n}', n).replace('{min}', min).replace('{max}', max);
    caja.className = 'wr-cuenta ' + (n === 0 ? '' : n < min ? 'corto' : n > max ? 'largo' : 'bien');
  }

  function guardaEscrito() {
    var ej = ESCRITO.ej;
    if (!ej) return;
    var texto = $('#wr-texto').value;
    var n = palabrasDe(texto);
    var p = P.ejercicios[ej.id] || { mejor: 0, intentos: 0, total: 1 };
    p.texto = texto;
    p.palabras = n;
    p.fecha = hoy();
    p.total = 1;
    p.mejor = n >= (ej.palabras || [220])[0] ? 1 : 0;
    P.ejercicios[ej.id] = p;
    if (P.dias.indexOf(hoy()) === -1) P.dias.push(hoy());
    guarda();
    $('#wr-descargar').hidden = !texto.trim();
    $('#wr-guardado').textContent = T.guardado;
  }

  function descargaEscrito() {
    var ej = ESCRITO.ej;
    var blob = new Blob([ej.titulo + '\n\n' + $('#wr-texto').value], { type: 'text/plain' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'well-' + ej.id + '-' + hoy() + '.txt';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
    track('writing_descargado', { ejercicio: ej.id, palabras: palabrasDe($('#wr-texto').value) });
  }

  /* ---------- speaking: grabas tu solo ---------- */

  // Todo pasa en el navegador: se graba, se escucha y, si quiere, se descarga.
  // No se sube nada a ningun sitio, que es lo unico honesto sin servidor y sin
  // haber pedido consentimiento para guardar la voz de nadie.
  var GRAB = { rec: null, trozos: [], url: null, reloj: null, ej: null };

  function pintaSpeaking(ej) {
    actual = ej;
    GRAB.ej = ej;
    paraGrabacion();
    $('#sp-miga').innerHTML = '<button type="button" class="miga-atras" data-ir="panel">' +
      esc(T.tuCamino) + '</button><span aria-hidden="true">/</span> ' +
      '<button type="button" class="miga-atras" data-sesion="' + esc(ej._sesion.id) + '">' +
      esc(tituloSesion(ej._sesion)) + '</button>';
    $('#sp-titulo').textContent = ej.titulo;
    $('#sp-instruccion').innerHTML = ej.instruccion;
    $('#sp-pregunta').textContent = ej.pregunta || '';
    $('#sp-puntos').innerHTML = (ej.puntos || []).map(function (p) {
      return '<li>' + esc(p) + '</li>';
    }).join('');
    var nota = $('#sp-nota');
    nota.hidden = !ej.nota;
    nota.textContent = ej.nota || '';
    $('#sp-segundos').textContent = T.segundos.replace('{n}', ej.segundos || 60);
    reseteaSpeaking();
    track('speaking_abierto', { ejercicio: ej.id });
  }

  function reseteaSpeaking() {
    $('#sp-estado').className = 'sp-estado';
    $('#sp-reloj').textContent = '0:00';
    $('#sp-aro').style.strokeDashoffset = 314;
    $('#sp-grabar').hidden = false;
    $('#sp-parar').hidden = true;
    $('#sp-repetir').hidden = true;
    $('#sp-audio').hidden = true;
    $('#sp-descargar').hidden = true;
    $('#sp-error').hidden = true;
  }

  function paraGrabacion() {
    clearInterval(GRAB.reloj);
    if (GRAB.rec && GRAB.rec.state === 'recording') { try { GRAB.rec.stop(); } catch (e) {} }
    if (GRAB.rec && GRAB.rec.stream) GRAB.rec.stream.getTracks().forEach(function (t) { t.stop(); });
    GRAB.rec = null;
  }

  async function empiezaGrabacion() {
    var ej = GRAB.ej;
    $('#sp-error').hidden = true;
    if (!navigator.mediaDevices || !window.MediaRecorder) { fallaMicro(T.spSinSoporte); return; }
    var stream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch (e) { fallaMicro(T.spSinPermiso); return; }

    GRAB.trozos = [];
    try { GRAB.rec = new MediaRecorder(stream); }
    catch (e) { fallaMicro(T.spSinSoporte); return; }
    GRAB.rec.stream = stream;
    GRAB.rec.ondataavailable = function (e) { if (e.data && e.data.size) GRAB.trozos.push(e.data); };
    GRAB.rec.onstop = function () {
      stream.getTracks().forEach(function (t) { t.stop(); });
      if (GRAB.url) URL.revokeObjectURL(GRAB.url);
      var blob = new Blob(GRAB.trozos, { type: GRAB.trozos[0] ? GRAB.trozos[0].type : 'audio/webm' });
      GRAB.url = URL.createObjectURL(blob);
      var a = $('#sp-audio');
      a.src = GRAB.url; a.hidden = false;
      var dl = $('#sp-descargar');
      dl.href = GRAB.url;
      dl.download = 'well-' + ej.id + '-' + hoy() + '.webm';
      dl.hidden = false;
      $('#sp-repetir').hidden = false;
      $('#sp-estado').className = 'sp-estado hecha';
      anota(ej, 1, ['grabado']);
      pintaPanel();
      var nuevas = revisaInsignias();
      if (nuevas.length) celebra(nuevas.map(function (b) {
        return { icono: b.icono, eti: T.insigniaNueva, titulo: T.insignias[b.id].titulo, texto: T.insignias[b.id].texto };
      }));
      track('speaking_grabado', { ejercicio: ej.id });
    };

    GRAB.rec.start();
    $('#sp-grabar').hidden = true;
    $('#sp-parar').hidden = false;
    $('#sp-repetir').hidden = true;
    $('#sp-audio').hidden = true;
    $('#sp-descargar').hidden = true;
    $('#sp-estado').className = 'sp-estado grabando';

    var total = ej.segundos || 60, t0 = Date.now();
    var tic = function () {
      var s = Math.min(total, Math.round((Date.now() - t0) / 1000));
      $('#sp-reloj').textContent = Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60);
      $('#sp-aro').style.strokeDashoffset = (314 * (1 - s / total)).toFixed(1);
      if (s >= total) { clearInterval(GRAB.reloj); paraGrabacion(); $('#sp-grabar').hidden = true; $('#sp-parar').hidden = true; }
    };
    tic();
    GRAB.reloj = setInterval(tic, 250);
  }

  function fallaMicro(texto) {
    var e = $('#sp-error');
    e.textContent = texto;
    e.hidden = false;
    $('#sp-estado').className = 'sp-estado';
    $('#sp-grabar').hidden = false;
    $('#sp-parar').hidden = true;
  }

  function paraYGuarda() {
    clearInterval(GRAB.reloj);
    paraGrabacion();
    $('#sp-parar').hidden = true;
    $('#sp-grabar').hidden = true;
  }

  /* ---------- simulacro ---------- */

  // Un simulacro es la destreza entera de un test, en orden de parte y de una
  // sentada: con reloj y sin ver ninguna solucion hasta el final. El modo
  // entrenamiento y este miden cosas distintas y no deben mezclarse.
  function simulacroDe(test, dzId) {
    var partes = [];
    (test.sesiones || []).forEach(function (s) {
      s.bloques.forEach(function (b) {
        if (b.destreza === dzId && b._ejercicios.length) {
          partes.push({ parte: b.parte || 0, tarea: b.tarea || '', ejercicios: b._ejercicios });
        }
      });
    });
    partes.sort(function (a, b) { return a.parte - b.parte; });
    if (!partes.length) return null;
    return {
      id: test.id + '-' + dzId,
      test: test, destreza: DESTREZA[dzId], partes: partes,
      minutos: (DATA.minutos || {})[dzId] || 45,
      items: partes.reduce(function (a, p) {
        return a + p.ejercicios.reduce(function (x, e) { return x + e.items.length; }, 0);
      }, 0)
    };
  }

  function simulacrosDe(test) {
    return DATA.destrezas.filter(function (dz) { return dz.puntua && !dz.correccion; })
      .map(function (dz) { return simulacroDe(test, dz.id); })
      .filter(Boolean);
  }

  var SIM = null, relojSim = null;

  function simulacroPorId(id) {
    var sim = null;
    DATA.tests.forEach(function (t) {
      simulacrosDe(t).forEach(function (s) { if (s.id === id) sim = s; });
    });
    return sim;
  }

  // Si se recarga la pagina en mitad de un simulacro, se recupera con el reloj
  // donde estaba. Si ya se habia acabado el tiempo, se cierra y se puntua.
  function recuperaSimulacro() {
    var g = P.simulacroEnCurso;
    if (!g) return false;
    var sim = simulacroPorId(g.id);
    if (!sim) { delete P.simulacroEnCurso; guarda(); return false; }
    SIM = { sim: sim, i: g.i || 0, respuestas: g.respuestas || {}, fin: g.fin };
    if (Date.now() >= SIM.fin) { terminaSimulacro(true); return true; }
    pintaSimulacro();
    muestra('s-simulacro');
    arrancaReloj();
    return true;
  }

  function empiezaSimulacro(id) {
    var sim = simulacroPorId(id);
    if (!sim) return;
    SIM = {
      sim: sim, i: 0,
      respuestas: {},
      fin: Date.now() + sim.minutos * 60000
    };
    guardaSim();
    pintaSimulacro();
    muestra('s-simulacro');
    history.pushState({}, '', '#sim-' + id);
    arrancaReloj();
    track('simulacro_empezado', { simulacro: id, minutos: sim.minutos });
  }

  function guardaSim() {
    if (!SIM) { delete P.simulacroEnCurso; }
    else P.simulacroEnCurso = { id: SIM.sim.id, i: SIM.i, respuestas: SIM.respuestas, fin: SIM.fin };
    guarda();
  }

  function todosLosEjercicios(sim) {
    return sim.partes.reduce(function (a, p) { return a.concat(p.ejercicios); }, []);
  }

  function pintaSimulacro() {
    var sim = SIM.sim;
    var lista = todosLosEjercicios(sim);
    var ej = lista[SIM.i];
    var parte = sim.partes.filter(function (p) { return p.ejercicios.indexOf(ej) > -1; })[0];

    $('#sim-destreza').textContent = sim.destreza.nombre;
    $('#sim-parte').textContent = T.parteDe
      .replace('{n}', parte.parte || SIM.i + 1)
      .replace('{t}', sim.partes.length);
    $('#sim-titulo').textContent = ej.titulo;
    $('#sim-instruccion').innerHTML = ej.instruccion;
    $('#sim-paso').textContent = (SIM.i + 1) + '/' + lista.length;

    var caja = $('#sim-caja');
    if (ej.tipo === 'caja' && ej.caja) {
      caja.hidden = false;
      caja.innerHTML = ej.caja.map(function (w) { return '<span>' + esc(w) + '</span>'; }).join('');
    } else { caja.hidden = true; }

    var cuerpo = $('#sim-cuerpo');
    cuerpo.innerHTML = cuerpoEjercicio(ej);
    if (ej.tipo === 'listening') preparaReproductor(ej);
    var guardado = SIM.respuestas[ej.id];
    if (guardado) {
      campos(cuerpo, ej).forEach(function (c, i) {
        var v = guardado[i];
        if (v === undefined || v === null || v === '') return;
        if (c.classList.contains('grupo-op')) {
          var b0 = c.querySelector('.op[data-op="' + v + '"]');
          if (b0) b0.classList.add('elegida');
        } else { c.value = v; }
      });
    }
    $('#sim-siguiente').textContent = SIM.i + 1 < lista.length ? T.simSiguiente : T.simTerminar;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function guardaRespuestasActuales() {
    var lista = todosLosEjercicios(SIM.sim);
    var ej = lista[SIM.i];
    SIM.respuestas[ej.id] = campos($('#sim-cuerpo'), ej).map(valorDe);
    guardaSim();
  }

  function avanzaSimulacro() {
    guardaRespuestasActuales();
    var lista = todosLosEjercicios(SIM.sim);
    if (SIM.i + 1 < lista.length) { SIM.i++; guardaSim(); pintaSimulacro(); }
    else terminaSimulacro(false);
  }

  function arrancaReloj() {
    clearInterval(relojSim);
    var pinta = function () {
      if (!SIM) { clearInterval(relojSim); return; }
      var queda = Math.max(0, SIM.fin - Date.now());
      var m = Math.floor(queda / 60000), s = Math.floor(queda % 60000 / 1000);
      $('#sim-reloj').textContent = m + ':' + (s < 10 ? '0' : '') + s;
      $('#sim-reloj').classList.toggle('poco', queda < 5 * 60000);
      if (queda <= 0) { clearInterval(relojSim); terminaSimulacro(true); }
    };
    pinta();
    relojSim = setInterval(pinta, 1000);
  }

  function terminaSimulacro(porTiempo) {
    if (!SIM) return;
    if (!porTiempo) guardaRespuestasActuales();
    clearInterval(relojSim);
    var sim = SIM.sim;

    var partes = sim.partes.map(function (p) {
      var ok = 0, items = 0;
      p.ejercicios.forEach(function (ej) {
        var r = SIM.respuestas[ej.id] || [];
        ej.items.forEach(function (it, i) { items++; if (correcto(it, r[i])) ok++; });
      });
      return { parte: p.parte, tarea: p.tarea, ok: ok, items: items };
    });
    var ok = partes.reduce(function (a, p) { return a + p.ok; }, 0);
    var items = partes.reduce(function (a, p) { return a + p.items; }, 0);

    var intento = {
      fecha: new Date().toISOString().slice(0, 10),
      ok: ok, items: items, partes: partes, porTiempo: !!porTiempo,
      minutos: sim.minutos
    };
    P.simulacros = P.simulacros || {};
    P.simulacros[sim.id] = (P.simulacros[sim.id] || []).concat([intento]);
    SIM = null;
    guardaSim();

    pintaResultadoSim(sim, intento);
    muestra('s-simresultado');
    history.pushState({}, '', '#simres-' + sim.id);
    track('simulacro_terminado', { simulacro: sim.id, aciertos: ok, sobre: items, por_tiempo: !!porTiempo });
  }

  function banda(pct) {
    if (pct >= 0.75) return { clase: 'bien', texto: T.bandaComoda };
    if (pct >= 0.6) return { clase: 'bien', texto: T.bandaJusta };
    return { clase: 'flojo', texto: T.bandaFloja };
  }

  function pintaResultadoSim(sim, intento) {
    testActual = sim.test;
    var pct = intento.items ? intento.ok / intento.items : 0;
    var bn = banda(pct);
    $('#sr-miga').innerHTML = '<button type="button" class="miga-atras" data-ir="panel">' +
      esc(T.tuCamino) + '</button><span aria-hidden="true">/</span> ' + esc(sim.test.titulo);
    $('#sr-titulo').textContent = T.simResultado.replace('{destreza}', sim.destreza.nombre);
    $('#sr-pct').textContent = Math.round(pct * 100) + '%';
    $('#sr-pct').className = 'sr-pct ' + bn.clase;
    $('#sr-banda').textContent = bn.texto;
    $('#sr-detalle').textContent = T.simDetalle
      .replace('{ok}', intento.ok).replace('{n}', intento.items) +
      (intento.porTiempo ? ' · ' + T.simPorTiempo : '');
    $('#sr-partes').innerHTML = intento.partes.map(function (p) {
      var pp = p.items ? Math.round(p.ok / p.items * 100) : 0;
      return '<div class="sr-parte"><span class="srp-tit">' + T.parteN.replace('{n}', p.parte) +
             (p.tarea ? ' · ' + esc(p.tarea) : '') + '</span>' +
             '<span class="srp-num">' + p.ok + '/' + p.items + '</span>' +
             '<span class="srp-barra"><i style="width:' + pp + '%"></i></span></div>';
    }).join('');
    $('#sr-aviso').textContent = T.informeAviso;
  }

  /* ---------- informe del test ---------- */

  function pintaInforme(test) {
    testActual = test;
    var st = estadoTest(test);
    $('#in-miga').innerHTML = '<button type="button" class="miga-atras" data-ir="panel">' +
      esc(T.tuCamino) + '</button><span aria-hidden="true">/</span> ' + esc(test.titulo);
    $('#in-titulo').textContent = T.informeDe.replace('{test}', test.titulo);
    $('#in-sub').textContent = st.hecho ? T.informeCompleto
      : T.informeParcial.replace('{n}', st.completas).replace('{t}', st.sesiones);

    $('#in-notas').innerHTML = notasTest(test).map(function (n) {
      var pct = Math.round(n.dominio.pct * 100);
      var estado, valor;
      var pie;
      var hist = (P.simulacros || {})[test.id + '-' + n.destreza.id] || [];
      var ultimo = hist[hist.length - 1];
      if (n.correccion) { estado = 'humana'; valor = T.correccion[n.correccion].valor; pie = T.correccion[n.correccion].pie; }
      else if (!n.ejercicios) { estado = 'sin'; valor = T.sinMaterial; pie = T.sinMaterialPie; }
      else if (ultimo) {
        // La nota buena es la del simulacro: en entrenamiento se repite hasta
        // clavarlo, asi que ese porcentaje no mide lo mismo.
        pct = ultimo.items ? Math.round(ultimo.ok / ultimo.items * 100) : 0;
        estado = pct >= 60 ? 'bien' : 'flojo';
        valor = pct + '%';
        n = Object.assign({}, n, { dominio: { ok: ultimo.ok, items: ultimo.items, pct: pct / 100 } });
        pie = T.enSimulacro.replace('{fecha}', fechaCorta(ultimo.fecha));
      }
      else if (!n.hechos) { estado = 'sin'; valor = T.sinHacer; pie = T.sinHacerPie; }
      else { estado = pct >= 60 ? 'bien' : 'flojo'; valor = pct + '%'; pie = T.enEntrenamiento; }
      return '<div class="nota ' + estado + '">' +
             '<span class="nota-dz">' + esc(n.destreza.nombre) + '</span>' +
             '<span class="nota-val">' + esc(valor) + '</span>' +
             (estado === 'bien' || estado === 'flojo'
               ? '<span class="nota-barra"><i style="width:' + pct + '%"></i></span>' +
                 '<span class="nota-pie">' + n.dominio.ok + ' de ' + n.dominio.items + ' ' +
                 esc(T.items) + ' · ' + esc(pie) + '</span>'
               : '<span class="nota-pie">' + esc(pie) + '</span>') +
             '</div>';
    }).join('');

    $('#in-aviso').textContent = T.informeAviso;
  }

  /* ---------- ejercicio ---------- */

  var actual = null;

  function campo(i, ancho) {
    return '<input class="hueco ' + (ancho || 'medio') + '" data-i="' + i + '" type="text" ' +
           'autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" ' +
           'aria-label="' + T.hueco + ' ' + (i + 1) + '">';
  }

  // Reading. Arriba el material que hay que leer, abajo las preguntas. El
  // material puede ser un texto corrido (parte 5), varios textos con letra
  // (partes 6 y 8) o un texto con huecos mas los parrafos sueltos que hay que
  // colocar (parte 7). Las preguntas se responden igual en los cuatro casos.
  function lecturaHTML(ej) {
    // En pantalla ancha, el material a la izquierda y las preguntas a la
    // derecha, como en el examen en papel. Con todo en una columna hay que
    // subir y bajar diez veces para contestar la parte 8.
    var h = '<div class="lectura"><div class="lectura-material">';

    if (ej.texto && ej.texto.length) {
      h += '<div class="lectura-texto">';
      if (ej.tituloTexto) h += '<h3 class="lectura-tit">' + esc(ej.tituloTexto) + '</h3>';
      ej.texto.forEach(function (par) {
        // {n} es el hueco de un parrafo entero (parte 7)
        var m = String(par).match(/^\{(\d+)\}$/);
        if (m) h += '<p class="lectura-hueco">' + T.huecoNumero.replace('{n}', m[1]) + '</p>';
        else h += '<p>' + esc(par) + '</p>';
      });
      h += '</div>';
    }

    if (ej.secciones && ej.secciones.length) {
      h += '<div class="lectura-secciones">';
      ej.secciones.forEach(function (sec) {
        h += '<div class="seccion"><span class="seccion-letra">' + esc(sec.letra) + '</span><div>';
        if (sec.titulo) h += '<h4>' + esc(sec.titulo) + '</h4>';
        (sec.texto || []).forEach(function (par) { h += '<p>' + esc(par) + '</p>'; });
        h += '</div></div>';
      });
      h += '</div>';
    }

    h += '</div><ol class="grupos preguntas">';
    ej.items.forEach(function (it, i) {
      h += '<li>';
      if (it.pregunta) h += '<p class="pregunta">' + esc(it.pregunta) + '</p>';
      h += '<div class="grupo-op' + (ej.opcionesCortas ? ' letras' : '') + '" data-i="' + i +
           '" role="radiogroup" aria-label="' + T.pregunta.replace('{n}', i + 1) + '">';
      it.opciones.forEach(function (op, k) {
        h += '<button type="button" class="op" data-op="' + k + '">' +
             '<span class="op-letra">' + 'ABCDEFGH'.charAt(k) + '</span>' +
             (ej.opcionesCortas ? '' : esc(op)) + '</button>';
      });
      h += '</div></li>';
    });
    h += '</ol></div>';
    return h;
  }

  function conMarcadores(txt) {
    return String(txt).replace(/\{(\d+)\}/g, function (_, n) {
      return '<span class="conhueco"><em class="num">' + n + '</em>' + campo(Number(n) - 1, 'corto') + '</span>';
    });
  }

  var ANCHO = { caja: 'corto', cloze: 'corto', formacion: 'medio', transformacion: 'largo' };

  // Tipos en los que se responde eligiendo, no escribiendo. Las cuatro partes
  // del Reading caben en 'lectura': lo unico que cambia entre ellas es si las
  // opciones son frases (parte 5) o letras que senalan a un trozo del texto
  // (partes 6, 7 y 8).
  var ELIGE = { opcion: 1, lectura: 1 };

  /* ---------- reproductor con reglas de examen ---------- */

  // Dos escuchas, sin rebobinar y sin barra de progreso manipulable. Si se
  // puede repetir el trozo dificil, la nota deja de medir nada.
  function reproductor(ej) {
    var n = ej.escuchas || 2;
    return '<div class="repro" data-escuchas="' + n + '">' +
      '<audio id="au" src="' + esc(ej.audio) + '" preload="metadata"></audio>' +
      '<button type="button" class="repro-play" id="au-play">' +
        '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">' +
        '<path d="M8 5v14l11-7z"/></svg><span id="au-txt"></span></button>' +
      '<div class="repro-info">' +
        '<span class="repro-cuenta" id="au-cuenta"></span>' +
        '<span class="repro-barra"><i id="au-fill"></i></span>' +
        '<span class="repro-aviso">' + esc(T.reproAviso) + '</span>' +
      '</div>' +
      (ej.demo ? '<p class="repro-demo">' + esc(T.reproDemo) + '</p>' : '') +
      '</div>';
  }

  var AUDIO = { escuchas: 0 };

  function preparaReproductor(ej) {
    var au = $('#au');
    if (!au) return;
    AUDIO.escuchas = 0;
    var total = ej.escuchas || 2;
    var pinta = function () {
      var quedan = total - AUDIO.escuchas;
      $('#au-cuenta').textContent = T.reproEscucha
        .replace('{n}', Math.min(AUDIO.escuchas + 1, total)).replace('{t}', total);
      $('#au-txt').textContent = AUDIO.escuchas === 0 ? T.reproEmpezar
        : quedan > 0 ? T.reproOtra : T.reproFin;
      $('#au-play').disabled = quedan <= 0 || !au.paused;
    };
    pinta();

    au.addEventListener('timeupdate', function () {
      if (au.duration) $('#au-fill').style.width = (au.currentTime / au.duration * 100) + '%';
    });
    // Sin rebobinar: cualquier salto hacia atras se deshace
    var tope = 0;
    au.addEventListener('timeupdate', function () { if (au.currentTime > tope) tope = au.currentTime; });
    au.addEventListener('seeking', function () {
      if (Math.abs(au.currentTime - tope) > 0.6) au.currentTime = tope;
    });
    au.addEventListener('ended', function () {
      AUDIO.escuchas++;
      tope = 0;
      $('#au-fill').style.width = '0%';
      pinta();
      track('listening_escucha', { ejercicio: ej.id, escucha: AUDIO.escuchas });
    });
    au.addEventListener('play', pinta);
    au.addEventListener('pause', pinta);
    $('#au-play').addEventListener('click', function () {
      if (AUDIO.escuchas >= total) return;
      au.play();
    });
  }


  function cuerpoEjercicio(ej) {
    var h = '';
    if (ej.tipo === 'listening') {
      // El reproductor impone las reglas del examen; las preguntas son frases
      // incompletas, que se corrigen como cualquier hueco.
      h += reproductor(ej);
      h += '<ol class="frases">';
      ej.items.forEach(function (it, i) {
        h += '<li><p class="frase">' + esc(it.antes || '') + ' ' + campo(i, 'medio') + ' ' +
             esc(it.despues || '') + '</p></li>';
      });
      h += '</ol>';
    } else if (ej.tipo === 'opcion') {
      // El texto solo enseña donde estan los huecos; se responde abajo,
      // eligiendo una de las cuatro opciones, como en el examen
      h += '<div class="texto sin-huecos">' + ej.texto.map(function (p) {
        return '<p>' + esc(p).replace(/\{(\d+)\}/g, '<span class="marca-hueco">$1</span>') + '</p>';
      }).join('') + '</div>';
      h += '<ol class="grupos">';
      ej.items.forEach(function (it, i) {
        h += '<li><div class="grupo-op" data-i="' + i + '" role="radiogroup" aria-label="' +
             T.hueco + ' ' + (i + 1) + '">';
        it.opciones.forEach(function (op, k) {
          h += '<button type="button" class="op" data-op="' + k + '">' +
               '<span class="op-letra">' + 'ABCD'.charAt(k) + '</span>' + esc(op) + '</button>';
        });
        h += '</div></li>';
      });
      h += '</ol>';
    } else if (ej.tipo === 'lectura') {
      h += lecturaHTML(ej);
    } else if (ej.tipo === 'cloze') {
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
    return h;
  }

  function pintaEjercicio(ej) {
    actual = ej;
    $('#ej-tipo').textContent = T.tipos[ej.tipo] || ej.tipo;
    $('#ej-titulo').textContent = ej.titulo;
    $('#ej-instruccion').innerHTML = ej.instruccion;
    $('#ej-etapa').innerHTML = '<button type="button" class="miga-atras" data-ir="panel">' +
      esc(T.tuCamino) + '</button><span aria-hidden="true">/</span> ' +
      '<button type="button" class="miga-atras" data-sesion="' + esc(ej._sesion.id) + '">' +
      esc(tituloSesion(ej._sesion)) + '</button>';

    var caja = $('#ej-caja');
    if (ej.tipo === 'caja' && ej.caja) {
      caja.hidden = false;
      caja.innerHTML = ej.caja.map(function (w) { return '<span>' + esc(w) + '</span>'; }).join('');
    } else { caja.hidden = true; }

    var cuerpo = $('#ej-cuerpo');
    cuerpo.innerHTML = cuerpoEjercicio(ej);
    if (ej.tipo === 'listening') preparaReproductor(ej);

    var guardado = (P.ejercicios[ej.id] || {}).respuestas;
    if (guardado) {
      campos().forEach(function (c, i) {
        var v = guardado[i];
        if (v === undefined || v === null || v === '') return;
        if (c.classList.contains('grupo-op')) {
          var b0 = c.querySelector('.op[data-op="' + v + '"]');
          if (b0) b0.classList.add('elegida');
        } else { c.value = v; }
      });
    }

    $('#ej-resultado').hidden = true;
    $('#btn-corregir').hidden = false;
    $('#btn-repetir').hidden = true;
    $('#ej-pie').classList.remove('corregido');
    cuerpo.classList.remove('corregido');
    enfoca();
    track('practica_ejercicio_abierto', { ejercicio: ej.id, tipo: ej.tipo });
  }

  // Un "campo" es un hueco de texto o un grupo de opciones: el resto del motor
  // no necesita saber cual de los dos es.
  function campos(cont, ej) {
    cont = cont || $('#ej-cuerpo');
    ej = ej || actual;
    return ej && ELIGE[ej.tipo] ? $$('.grupo-op', cont) : $$('.hueco', cont);
  }
  function valorDe(c) {
    if (!c.classList.contains('grupo-op')) return c.value;
    var sel = c.querySelector('.op.elegida');
    return sel ? sel.getAttribute('data-op') : '';
  }

  function enfoca() {
    if (actual && ELIGE[actual.tipo]) return;
    if (!window.matchMedia('(min-width:700px)').matches) return;
    var libres = $$('.hueco').filter(function (i) { return !i.value; });
    (libres[0] || $('.hueco') || {}).focus && (libres[0] || $('.hueco')).focus();
  }

  function corrige() {
    var ej = actual;
    var ok = 0, respuestas = [];

    campos().forEach(function (c, i) {
      var it = ej.items[i];
      var valor = valorDe(c);
      var bien = correcto(it, valor);
      respuestas.push(valor);
      if (bien) ok++;

      if (c.classList.contains('grupo-op')) {
        $$('.op', c).forEach(function (b0, k) {
          b0.disabled = true;
          if (k === it.correcta) b0.classList.add('buena');
          else if (String(k) === String(valor)) b0.classList.add('fallada');
        });
        return;
      }

      c.classList.remove('ok', 'mal');
      c.classList.add(bien ? 'ok' : 'mal');
      c.readOnly = true;

      var destino = c.closest('.frase') || c.parentNode;
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
        else c.insertAdjacentElement('afterend', s);
      }
    });

    var abiertasAntes = SESIONES.filter(function (e) { return estado(e) === 'abierta' || estado(e) === 'completa'; }).length;
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
    var premios = nuevas.map(function (b) {
      return { icono: b.icono, eti: T.insigniaNueva, titulo: T.insignias[b.id].titulo, texto: T.insignias[b.id].texto };
    });
    var abiertasDespues = SESIONES.filter(function (e) { return estado(e) === 'abierta' || estado(e) === 'completa'; }).length;
    if (abiertasDespues > abiertasAntes) {
      var nueva = SESIONES.filter(function (e) { return estado(e) === 'abierta'; })
        .filter(function (e) { return dominio(e).ok === 0; })[0];
      premios.unshift({ icono: '🔓', eti: T.desbloqueada, titulo: nueva ? tituloSesion(nueva) : '', texto: T.desbloqueadaSub });
    }
    if (premios.length) celebra(premios);
  }

  function repite() {
    campos().forEach(function (inp, i) {
      if (inp.classList.contains('grupo-op')) {
        var it = actual.items[i];
        var eleg = inp.querySelector('.op.elegida');
        var fallo = !eleg || Number(eleg.getAttribute('data-op')) !== it.correcta;
        $$('.op', inp).forEach(function (b0) {
          b0.disabled = false;
          b0.classList.remove('buena', 'fallada');
          if (fallo) b0.classList.remove('elegida');
        });
        return;
      }
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
    if (id !== 's-speaking') { clearInterval(GRAB.reloj); paraGrabacion(); }
    var au = $('#au');
    if (au && id !== 's-ejercicio' && id !== 's-simulacro') { try { au.pause(); } catch (e) {} }
    $$('.pantalla').forEach(function (p) { p.classList.toggle('activa', p.id === id); });
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.body.classList.toggle('dentro', id !== 's-panel');
    var destino = id === 's-ejercicio' && actual ? tituloSesion(actual._sesion) : T.tuCamino;
    $('#volver-txt').textContent = destino;
    $('#btn-volver').setAttribute('aria-label', T.volverA.replace('{destino}', destino));
    $('#t-titulo').textContent = id === 's-panel' ? 'Well Online'
      : id === 's-etapa' && etapaActual ? tituloSesion(etapaActual)
      : id === 's-informe' && testActual ? testActual.titulo
      : (id === 's-speaking' || id === 's-writing') && actual ? actual.titulo
      : actual ? actual.titulo : 'Well Online';
  }

  function abreSesion(id, empujar) {
    var s = porId(SESIONES, id);
    if (!s || estado(s) === 'pronto' || estado(s) === 'bloqueada') return;
    pintaSesion(s);
    muestra('s-etapa');
    if (empujar !== false) history.pushState({}, '', '#' + id);
    track('practica_sesion_abierta', { sesion: id });
  }

  function abreInforme(id, empujar) {
    var t = porId(DATA.tests, id);
    if (!t || !(t.sesiones || []).length) return;
    pintaInforme(t);
    muestra('s-informe');
    if (empujar !== false) history.pushState({}, '', '#informe-' + id);
    track('practica_informe_abierto', { test: id });
  }

  function abreEjercicio(id, empujar) {
    var ej = porId(EJERCICIOS, id);
    if (!ej) return;
    if (ej.tipo === 'speaking') { pintaSpeaking(ej); muestra('s-speaking'); }
    else if (ej.tipo === 'writing') { pintaWriting(ej); muestra('s-writing'); }
    else { pintaEjercicio(ej); muestra('s-ejercicio'); }
    if (empujar !== false) history.pushState({}, '', '#' + id);
  }

  function confirmaSimulacro(id) {
    var sim = simulacroPorId(id);
    if (!sim) return;
    var hist = (P.simulacros || {})[id] || [];
    var aviso = T.simConfirmar.replace('{min}', sim.minutos).replace('{n}', sim.items);
    if (hist.length) aviso += '\n\n' + T.simRepetir;
    if (window.confirm(aviso)) empiezaSimulacro(id);
  }

  function abandonaSimulacro() {
    if (!window.confirm(T.simAbandonar)) return;
    clearInterval(relojSim);
    SIM = null;
    guardaSim();
    alPanel();
    track('simulacro_abandonado', {});
  }

  function alPanel() {
    pintaPanel();
    muestra('s-panel');
    history.pushState({}, '', location.pathname);
  }

  function atras() {
    if ($('#s-ejercicio').classList.contains('activa') && actual) abreSesion(actual._sesion.id);
    else alPanel();
  }

  function siguiente() {
    var lista = actual._sesion._ejercicios;
    var i = lista.indexOf(actual);
    if (i > -1 && i + 1 < lista.length) abreEjercicio(lista[i + 1].id);
    else abreSesion(actual._sesion.id);
  }

  function pinta(hash) {
    var id = (hash || '').replace('#', '');
    if (id.indexOf('informe-') === 0) { abreInforme(id.slice(8), false); return; }
    if (id.indexOf('sim-') === 0 || id.indexOf('simres-') === 0) { pintaPanel(); muestra('s-panel'); return; }
    if (id && porId(EJERCICIOS, id)) { abreEjercicio(id, false); return; }
    if (id && porId(SESIONES, id)) { abreSesion(id, false); return; }
    pintaPanel(); muestra('s-panel');
  }

  /* ---------- eventos ---------- */

  document.addEventListener('click', function (e) {
    var ej = e.target.closest('[data-ej]');
    if (ej) { abreEjercicio(ej.getAttribute('data-ej')); return; }
    var et = e.target.closest('[data-sesion]');
    if (et) { abreSesion(et.getAttribute('data-sesion')); return; }
    var inf = e.target.closest('[data-informe]');
    if (inf) { abreInforme(inf.getAttribute('data-informe')); return; }
    var sm = e.target.closest('[data-simulacro]');
    if (sm) { confirmaSimulacro(sm.getAttribute('data-simulacro')); return; }
    if (e.target.closest('#sim-siguiente')) { avanzaSimulacro(); return; }
    if (e.target.closest('#sim-salir')) { abandonaSimulacro(); return; }
    if (e.target.closest('#sr-volver')) { alPanel(); return; }
    if (e.target.closest('#sp-grabar')) { empiezaGrabacion(); return; }
    if (e.target.closest('#sp-parar')) { paraYGuarda(); return; }
    if (e.target.closest('#sp-repetir')) { reseteaSpeaking(); return; }
    if (e.target.closest('#wr-descargar')) { descargaEscrito(); return; }
    var tr = e.target.closest('[data-tramo]');
    if (tr) {
      var id = tr.getAttribute('data-tramo');
      var abierto = tr.getAttribute('aria-expanded') === 'true';
      P.tramos[id] = !abierto;
      guarda();
      tr.setAttribute('aria-expanded', abierto ? 'false' : 'true');
      tr.parentNode.classList.toggle('abierto', !abierto);
      tr.nextElementSibling.hidden = abierto;
      return;
    }
    var op = e.target.closest('.op');
    if (op && !op.disabled) {
      $$('.op', op.parentNode).forEach(function (b0) { b0.classList.remove('elegida'); });
      op.classList.add('elegida');
      return;
    }
    if (e.target.closest('#btn-corregir')) { corrige(); return; }
    if (e.target.closest('#btn-repetir')) { repite(); return; }
    if (e.target.closest('#btn-volver')) { atras(); return; }
    if (e.target.closest('#btn-siguiente')) { siguiente(); return; }
    if (e.target.closest('[data-ir="panel"]')) { alPanel(); return; }
    if (e.target.closest('#premio-ok') || e.target.id === 'premio') { cierraPremio(); return; }
    var u = e.target.closest('#user-btn');
    if (u) { menuUsuario(!abiertoUsuario()); return; }
    if (abiertoUsuario() && !e.target.closest('.usuario')) menuUsuario(false);

    var acc = e.target.closest('.usuario-menu [data-accion]');
    if (acc) {
      var q = acc.getAttribute('data-accion');
      menuUsuario(false);
      if (q === 'nombre') {
        alPanel();
        $('#pide-nombre').hidden = false;
        $('#nombre-campo').value = nombreAlumno();
        $('#nombre-campo').focus();
      } else if (q === 'test') { location.href = '/test.html'; }
      else if (q === 'entrar') { location.href = '/entrar.html'; }
      else if (q === 'borrar') { abreBorrado(true); }
      else if (q === 'salir') {
        // Se vacia la cola antes de salir: si no, lo ultimo que hizo se
        // quedaria solo en este navegador.
        var fin = function () { location.reload(); };
        if (D) D.vaciaCola().then(function () { return D.salir(); }).then(fin, fin);
        else fin();
      }
      return;
    }
    if (e.target.closest('#ver-insignias')) { hoja(true); return; }
    if (e.target.closest('#cierra-insignias') || e.target.id === 'hoja-insignias') { hoja(false); return; }
    if (e.target.closest('#nombre-ok')) { aplicaNombre(); return; }
    if (e.target.closest('#bc-cancelar') || e.target.id === 'borrar-cuenta') { abreBorrado(false); return; }
    if (e.target.closest('#bc-confirmar')) { confirmaBorrado(); return; }
  });

  document.addEventListener('input', function (e) {
    if (e.target.id === 'bc-correo') compruebaCorreoBorrado();
  });

  function aplicaNombre() {
    var v = $('#nombre-campo').value.trim();
    if (!v) { $('#nombre-campo').focus(); return; }
    guardaNombre(v);
    $('#pide-nombre').hidden = true;
    pintaPanel();
    track('practica_nombre_guardado', {});
  }

  function abiertoUsuario() { return $('#user-btn').getAttribute('aria-expanded') === 'true'; }
  function menuUsuario(abrir) {
    $('#user-btn').setAttribute('aria-expanded', abrir ? 'true' : 'false');
    $('#user-menu').hidden = !abrir;
    $('#user-btn').closest('.usuario').setAttribute('data-abierto', abrir ? '1' : '0');
  }
  function hoja(abrir) {
    var el = $('#hoja-insignias');
    if (abrir) {
      pintaInsignias();
      el.hidden = false;
      requestAnimationFrame(function () { el.classList.add('visible'); });
      $('#cierra-insignias').focus();
      track('practica_insignias_abiertas', {});
    } else {
      el.classList.remove('visible');
      setTimeout(function () { el.hidden = true; }, 240);
    }
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.id === 'nombre-campo') { e.preventDefault(); aplicaNombre(); }
    if (e.key !== 'Escape') return;
    if (!$('#borrar-cuenta').hidden) { abreBorrado(false); return; }
    if (!$('#premio').hidden) cierraPremio();
    else if (!$('#hoja-insignias').hidden) hoja(false);
    else if (abiertoUsuario()) { menuUsuario(false); $('#user-btn').focus(); }
  });

  // la cabecera gana sombra al bajar, igual que en la web
  var cabecera = $('#cabecera');
  var alScroll = function () { cabecera.classList.toggle('scrolled', window.scrollY > 6); };
  window.addEventListener('scroll', alScroll, { passive: true });
  alScroll();

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

  document.addEventListener('input', function (e) {
    if (e.target.id !== 'wr-texto') return;
    cuentaPalabras();
    $('#wr-guardado').textContent = '';
    clearTimeout(ESCRITO.guarda);
    ESCRITO.guarda = setTimeout(guardaEscrito, 700);
  });

  window.addEventListener('popstate', function () {
    if (SIM) { history.pushState({}, '', '#sim-' + SIM.sim.id); return; }
    pinta(location.hash);
  });

  /* ---------- cuenta ---------- */

  // Sin cuenta la practica funciona entera: el progreso vive en este
  // navegador. Al entrar, lo que hubiera aqui se sube y lo que haya en la
  // cuenta se baja; se quedan las dos mitades. Nadie pierde nada por
  // registrarse tarde, ni por probar la plataforma sin registrarse.
  var D = window.WellDatos;

  function pintaCuenta() {
    var fila = $('#um-cuenta');
    if (!fila) return;
    if (!D || !D.activo()) { fila.hidden = true; return; }   // servidor sin configurar
    fila.hidden = false;
    var ses = D.sesion();
    $('#um-correo').textContent = ses ? ses.correo : '';
    $('#um-correo').hidden = !ses;
    $('#um-entrar').hidden = !!ses;
    $('#um-salir').hidden = !ses;
    $('#um-borrar').hidden = !ses;
  }

  /* ---------- borrar la cuenta ---------- */

  // Se pide escribir el correo a mano. Es irreversible, y un clic de mas es
  // barato comparado con perder todo el curso por una pulsacion despistada.
  function abreBorrado(abrir) {
    var el = $('#borrar-cuenta');
    el.hidden = !abrir;
    if (!abrir) return;
    $('#bc-correo').value = '';
    $('#bc-error').hidden = true;
    $('#bc-confirmar').disabled = true;
    $('#bc-confirmar').textContent = T.borrarCuenta || 'Borrar mi cuenta';
    $('#bc-correo').focus();
  }

  function compruebaCorreoBorrado() {
    var ses = D && D.sesion();
    var escrito = $('#bc-correo').value.trim().toLowerCase();
    $('#bc-confirmar').disabled = !ses || escrito !== String(ses.correo).toLowerCase();
  }

  function confirmaBorrado() {
    var btn = $('#bc-confirmar');
    btn.disabled = true;
    btn.textContent = T.borrando || 'Borrando…';
    $('#bc-error').hidden = true;

    D.borraCuenta().then(function () {
      // El servidor ha confirmado. Ahora si se limpia el navegador: hacerlo
      // antes dejaria al alumno sin datos aqui y con la cuenta viva alli.
      try {
        localStorage.removeItem(CLAVE);
        localStorage.removeItem(CLAVE_NIVEL);
        localStorage.removeItem('well_nombre');
      } catch (e) {}
      track('cuenta_borrada', {});
      location.href = '/index.html';
    }).catch(function (err) {
      $('#bc-error').textContent = (T.borradoFallo || 'No se ha podido borrar la cuenta: ') +
        ((err && err.message) || 'error desconocido');
      $('#bc-error').hidden = false;
      btn.textContent = T.borrarCuenta || 'Borrar mi cuenta';
      compruebaCorreoBorrado();
    });
  }

  function sincroniza() {
    if (!D || !D.sesion()) { pintaCuenta(); return; }
    pintaCuenta();
    D.baja().then(function (remoto) {
      if (remoto) {
        var F = D.funde(P, remoto);
        Object.keys(F).forEach(function (k) { P[k] = F[k]; });
        try { localStorage.setItem(CLAVE, JSON.stringify(P)); } catch (e) {}
      }
      return D.perfil();
    }).then(function (perfil) {
      // Si el alumno puso su nombre en otro dispositivo, aqui aparece solo.
      if (perfil && perfil.nombre && !nombreAlumno()) {
        try { localStorage.setItem('well_nombre', perfil.nombre); } catch (e) {}
      }
      if (perfil && perfil.nivel && !nivelAlumno()) {
        try {
          localStorage.setItem(CLAVE_NIVEL, JSON.stringify({
            nivel: perfil.nivel, puntuacion: perfil.nivel_puntos,
            sobre: perfil.nivel_sobre, fecha: perfil.nivel_fecha
          }));
        } catch (e) {}
      }
      subePerfil();
      return D.empuja(P, true);      // sube de una lo que el servidor no tenga
    }).then(function () {
      revisaInsignias();
      // Solo se repinta el panel: si esta a mitad de un ejercicio o de un
      // simulacro, repintar le borraria lo que lleva escrito.
      if ($('#s-panel').classList.contains('activa')) pintaPanel();
      else pintaUsuario();
      pintaCuenta();
    }).catch(function (e) { try { console.warn(e); } catch (_) {} });
  }

  if (D) {
    D.alListo(function () { sincroniza(); });
    D.alCambiar(function () { sincroniza(); });
    // Al cerrar la pestana se manda lo que quede en la cola.
    window.addEventListener('pagehide', function () { try { D.vaciaCola(); } catch (e) {} });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') { try { D.vaciaCola(); } catch (e) {} }
    });
  }

  revisaInsignias();
  pintaUsuario();
  pintaCuenta();
  if (!recuperaSimulacro()) pinta(location.hash);
})();
