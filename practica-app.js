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
          ej._nivel = test.nivel;
          if (EJERCICIOS.indexOf(ej) === -1) EJERCICIOS.push(ej);
          ses._ejercicios.push(ej);
          return ej;
        }).filter(Boolean);
        BLOQUES.push(bl);
      });
      ses._nivel = test.nivel;
      SESIONES.push(ses);
    });
  });
  var porId = function (lista, id) { return lista.filter(function (x) { return x.id === id; })[0]; };

  /* El saco de ejercicios es uno solo para toda la aplicacion, porque la URL
     puede pedir cualquier id y hay que saber encontrarlo. Pero el curso que se
     ve, el progreso que se cuenta y la sesion que se desbloquea son SOLO los
     del nivel activo. Sin este filtro, meter el primer test de B2 le habria
     anadido ocho sesiones y 34 ejercicios a la barra de un alumno de C1. */
  function esDeNivel(x, id) { return (x.nivel || x._nivel) === id; }
  function delNivel(lista) {
    var n = nivelActivo().nivel;
    if (!n) return lista;
    return lista.filter(function (x) { return esDeNivel(x, n.id); });
  }
  function testsActivos() { return delNivel(DATA.tests); }
  function sesionesActivas() { return delNivel(SESIONES); }
  function ejerciciosActivos() { return delNivel(EJERCICIOS); }
  function cuentaNivel(id) {
    var t = DATA.tests.filter(function (x) { return esDeNivel(x, id); }).length;
    var e = EJERCICIOS.filter(function (x) { return esDeNivel(x, id); }).length;
    return { tests: t, ejercicios: e };
  }

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
    var ejs = ejerciciosActivos(), ses = sesionesActivas();
    ejs.forEach(function (e) {
      items += e.items.length;
      var p = P.ejercicios[e.id];
      if (!p) return;
      ok += p.mejor; empezados++;
      if (p.mejor === e.items.length) perfectos++;
    });
    ses.forEach(function (e) {
      if (estado(e) !== 'abierta') return;
      (e.ejercicios || []).forEach(function (ej) {
        var p = P.ejercicios[ej.id];
        if (!p || p.mejor < ej.items.length) pendientes++;
      });
    });
    return {
      items: items, ok: ok, perfectos: perfectos, empezados: empezados, pendientes: pendientes,
      ejercicios: ejs.length,
      etapasCompletas: ses.filter(function (e) { return estado(e) === 'completa'; }).length,
      etapasConMaterial: ses.filter(function (e) { return e._ejercicios.length; }).length,
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
    var lista = sesionesActivas();
    for (var i = 0; i < lista.length; i++) {
      var s = lista[i];
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
    var misSesiones = sesionesActivas();
    var conMaterial = misSesiones.filter(function (s) { return s._ejercicios.length; }).length;
    var act = nivelActivo();
    cont2.innerHTML =
      '<div class="ruta-cab"><div><h2>' +
      esc(T.cursoTitulo.replace('{examen}', act.nivel ? act.nivel.nombre : '')) + '</h2>' +
      '<p class="ruta-sub">' + esc(T.cursoSub) + '</p></div>' +
      '<span class="nivel-chip">' + esc(act.nivel ? act.nivel.sigla : '') + '</span></div>' +
      // Si el curso que se sirve no es el del nivel del alumno, se dice aqui y
      // no en letra pequena.
      (act.sustituto ? '<p class="ruta-sustituto">' +
        esc(T.cursoOtroNivel.replace('{suyo}', act.etiqueta)
                            .replace('{este}', act.nivel.mcer)) + '</p>'
       : act.redondeado ? '<p class="ruta-sustituto">' +
        esc((act.arriba ? T.cursoRedondeado : T.cursoTope)
              .replace('{suyo}', act.etiqueta)
              .replace('{este}', act.nivel.mcer)) + '</p>' : '') +
      testsActivos().map(function (t) { return pintaTest(t, sig); }).join('') +
      '<p class="ruta-pie">' + (conMaterial === misSesiones.length
        ? T.sesionesTodas.replace('{t}', misSesiones.length)
        : T.sesionesCargadas.replace('{n}', conMaterial).replace('{t}', misSesiones.length)) + '</p>';
  }

  /* ---------- el camino: un test, sus sesiones ---------- */

  function pintaTest(test, sig) {
    var st = estadoTest(test);
    var tieneAqui = sig && (test.sesiones || []).indexOf(sig._sesion) > -1;
    // Abierto por defecto SOLO el test donde esta tu siguiente ejercicio. Antes
    // se abria tambien cualquiera "vivo", y vivo significa que le queda alguna
    // sesion por hacer, cosa que cumplen los cuatro: se abrian los cuatro y la
    // pagina salia con treinta y seis sesiones y 4.500 pixeles de largo. Lo
    // que el alumno tiene que ver al entrar es por donde iba, no el curso.
    var abierto = P.tramos[test.id] !== undefined ? !!P.tramos[test.id] : !!tieneAqui;

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
    // La primera sesion cerrada es la unica que explica la regla; las de
    // detras se entienden solas por el candado.
    var yaHuboCerrada = false;
    h += (test.sesiones || []).map(function (s, i) {
      s._primeraCerrada = false;
      if (estado(s) === 'bloqueada' && !yaHuboCerrada) { s._primeraCerrada = true; yaHuboCerrada = true; }
      return tarjetaSesion(s, i, sig);
    }).join('');
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
         esc(T.simulacroDe.replace('{papel}', sm.papel.nombre)) + '</span>' +
         '<span class="paso-sub">' + esc(T.simulacroSub
           .replace('{min}', sm.minutos).replace('{n}', sm.items)
           .replace('{p}', sm.partes.length)
           // "1 partes" queda de pagina a medio hacer
           .replace('{partes}', sm.partes.length === 1 ? T.unaParte : T.variasPartes)) +
         '</span></span>';
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
      // La regla se dice UNA vez, en la primera sesion cerrada, y en gris.
      //
      // Antes salia en todas y en rojo: siete lineas identicas diciendo lo que
      // el candado ya dice. El rojo es el color de que algo va mal, y esto no
      // va mal: es que todavia no toca. Gastarlo aqui lo deja sin fuerza para
      // cuando de verdad haya un problema.
      //
      // Y no se cuentan "aciertos que faltan". Eso suena a deuda y ademas
      // cambia solo con reintentar; lo que abre la siguiente es terminar la
      // anterior, que es lo unico que el alumno necesita saber.
      sub = ses._primeraCerrada && ses._anterior
        ? T.paraAbrir.replace('{etapa}', tituloSesion(ses._anterior)) : '';
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
  // El simulacro tiene que tener la forma del examen, no la del curso. En el
  // curso una misma parte sale varias veces, porque se practica mas de un dia;
  // en el examen sale una. Si se metieran todas, el porcentaje dejaria de ser
  // comparable con el examen real, que es justo lo que se le vende al alumno.
  // Se coge la primera aparicion de cada parte.
  function simulacroDe(test, papel) {
    var partes = [], vistas = {};
    (test.sesiones || []).forEach(function (s) {
      s.bloques.forEach(function (b) {
        if (papel.destrezas.indexOf(b.destreza) < 0 || !b._ejercicios.length) return;
        var parte = b.parte || 0;
        if (vistas[parte]) return;
        vistas[parte] = true;
        // Y solo el primer ejercicio de la parte: en el curso hay dos porque se
        // practica dos dias, pero el examen trae uno. Con uno por parte salen
        // exactamente las 30 preguntas de Use of English y las 26 de Reading.
        partes.push({ parte: parte, tarea: b.tarea || '', ejercicios: b._ejercicios.slice(0, 1) });
      });
    });
    partes.sort(function (a, b) { return a.parte - b.parte; });
    if (!partes.length) return null;
    return {
      id: test.id + '-' + papel.id,
      test: test, papel: papel, partes: partes,
      minutos: papel.minutos || 45,
      items: partes.reduce(function (a, p) {
        return a + p.ejercicios.reduce(function (x, e) { return x + e.items.length; }, 0);
      }, 0)
    };
  }

  function simulacrosDe(test) {
    return papelesActivos().map(function (pa) { return simulacroDe(test, pa); })
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

    $('#sim-destreza').textContent = sim.papel.nombre;
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
    // De que ejercicio es lo que hay en pantalla. El titulo no vale para
    // saberlo: 'Use of English · Part 1' lo llevan los cinco tests.
    //
    // Se llama 'data-sim-ej' y no 'data-ej' a proposito: el delegado de clicks
    // abre el ejercicio de cualquier '[data-ej]', y poniendoselo al contenedor
    // del simulacro, marcar una opcion te sacaba del simulacro entero.
    cuerpo.setAttribute('data-sim-ej', ej.id);
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
    $('#sr-titulo').textContent = T.simResultado.replace('{papel}', sim.papel.nombre);
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
        // Dos formas de hueco, porque son dos tareas distintas. Si el parrafo
        // ES el {n}, falta un parrafo entero: el gapped text del C1. Si el {n}
        // esta dentro de un parrafo, falta UNA FRASE: el gapped text del B2, y
        // ahi solo se marca el sitio, como en el multiple-choice cloze. Sin
        // esto el B2 pintaba "{1}" en crudo en mitad del texto.
        var m = String(par).match(/^\{(\d+)\}$/);
        if (m) h += '<p class="lectura-hueco">' + T.huecoNumero.replace('{n}', m[1]) + '</p>';
        else h += '<p>' + esc(par).replace(/\{(\d+)\}/g,
                       '<span class="marca-hueco">$1</span>') + '</p>';
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

  // Se responde eligiendo o escribiendo, y eso lo decide el propio item, no el
  // tipo de ejercicio: un listening es de huecos en la parte 2 y de elegir en
  // las partes 1, 3 y 4. Mirar el item en vez del tipo evita tener que tocar
  // esto cada vez que aparece un formato nuevo.
  function seElige(ej) {
    return !!(ej && ej.items && ej.items[0] && ej.items[0].opciones);
  }

  /* ---------- modal ----------
     Sustituye a window.confirm(). Devuelve la respuesta por callback y no por
     valor, porque a diferencia del nativo no bloquea el hilo: quien lo llama
     tiene que hacer lo suyo dentro del callback, no despues de la llamada. */

  var MODAL = null;

  function cierraModal() {
    if (!MODAL) return;
    var m = MODAL; MODAL = null;
    document.removeEventListener('keydown', m.tecla, true);
    if (m.fondo.parentNode) m.fondo.parentNode.removeChild(m.fondo);
    // Se devuelve el foco a donde estaba. Sin esto, quien navega con teclado
    // vuelve al principio de la pagina cada vez que cierra un dialogo.
    if (m.antes && document.body.contains(m.antes)) m.antes.focus();
  }

  // o = { titulo, cuerpo, nota, datos:[{n,eti}], ok, no, peligro }
  function pregunta(o, siSi) {
    cierraModal();
    var antes = document.activeElement;
    var fondo = document.createElement('div');
    fondo.className = 'modal-fondo';

    var caja = document.createElement('div');
    caja.className = 'modal';
    caja.setAttribute('role', 'dialog');
    caja.setAttribute('aria-modal', 'true');
    caja.setAttribute('aria-labelledby', 'modal-tit');

    var h = '<h2 id="modal-tit">' + esc(o.titulo) + '</h2>';
    h += '<p>' + esc(o.cuerpo) + '</p>';
    if (o.datos && o.datos.length) {
      h += '<div class="modal-datos">' + o.datos.map(function (d) {
        return '<div class="modal-dato"><b>' + esc(String(d.n)) + '</b>' +
               '<span>' + esc(d.eti) + '</span></div>';
      }).join('') + '</div>';
    }
    if (o.nota) h += '<p class="modal-nota">' + esc(o.nota) + '</p>';
    h += '<div class="modal-pie">' +
         '<button type="button" class="btn btn-ghost" data-no>' + esc(o.no) + '</button>' +
         '<button type="button" class="btn ' + (o.peligro ? 'btn-peligro' : 'btn-azul') +
         '" data-si>' + esc(o.ok) + '</button>' +
         '</div>';
    caja.innerHTML = h;
    fondo.appendChild(caja);
    document.body.appendChild(fondo);

    var bSi = caja.querySelector('[data-si]'), bNo = caja.querySelector('[data-no]');
    bSi.addEventListener('click', function () { cierraModal(); siSi(); });
    bNo.addEventListener('click', cierraModal);
    // Clic fuera = cancelar, nunca aceptar. Un clic perdido no puede empezar un
    // simulacro ni tirar el que llevas a medias.
    fondo.addEventListener('mousedown', function (ev) { if (ev.target === fondo) cierraModal(); });

    var tecla = function (ev) {
      if (ev.key === 'Escape') { ev.preventDefault(); cierraModal(); return; }
      if (ev.key !== 'Tab') return;
      // El foco no se sale del dialogo mientras esta abierto.
      var f = [bNo, bSi];
      var i = f.indexOf(document.activeElement);
      ev.preventDefault();
      f[(i + (ev.shiftKey ? f.length - 1 : 1) + f.length) % f.length].focus();
    };
    document.addEventListener('keydown', tecla, true);

    MODAL = { fondo: fondo, tecla: tecla, antes: antes };
    // Arranca el foco en la salida segura, no en el boton que hace la cosa.
    (o.peligro ? bNo : bSi).focus();
  }

  /* ---------- reproductor con reglas de examen ---------- */

  // Dos escuchas, sin rebobinar y sin barra de progreso manipulable. Si se
  // puede repetir el trozo dificil, la nota deja de medir nada.
  function reproductor(ej) {
    var n = ej.escuchas || 2;
    return '<div class="repro" data-escuchas="' + n + '" id="repro">' +
      '<audio id="au" src="' + esc(ej.audio) + '" preload="metadata"></audio>' +

      '<div class="repro-cab">' +
        '<button type="button" class="repro-play" id="au-play" aria-label="' + esc(T.reproEmpezar) + '">' +
          '<svg class="ic-play" viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">' +
          '<path d="M8 5v14l11-7z"/></svg>' +
          // mientras suena no se puede pausar, asi que en vez de un icono de
          // pausa que no haria nada, el boton late
          '<span class="ecu" aria-hidden="true"><i></i><i></i><i></i></span>' +
        '</button>' +
        '<span class="repro-txt">' +
          '<b id="au-txt"></b>' +
          '<span class="repro-cuenta" id="au-cuenta"></span>' +
        '</span>' +
      '</div>' +

      '<div class="cuenta" id="au-cuenta5" hidden>' +
        '<span class="cuenta-disco">' +
          '<svg class="cuenta-aro" viewBox="0 0 120 120" aria-hidden="true">' +
            '<circle class="fondo" cx="60" cy="60" r="54"/>' +
            '<circle class="barra" id="au-aro" cx="60" cy="60" r="54"/>' +
          '</svg>' +
          '<b class="cuenta-n" id="au-n" aria-live="assertive"></b>' +
        '</span>' +
        '<span class="cuenta-txt" id="au-listo"></span>' +
      '</div>' +

      '<div class="repro-tiempos">' +
        '<span class="repro-t" id="au-t">0:00</span>' +
        // la barra no lleva tirador a proposito: no se puede arrastrar, y una
        // barra con tirador esta invitando a intentarlo
        '<span class="repro-barra"><i id="au-fill"></i></span>' +
        '<span class="repro-t" id="au-total">--:--</span>' +
      '</div>' +

      '<p class="repro-aviso">' +
        '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
        '<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>' +
        esc(T.reproAviso) + '</p>' +
      (ej.demo ? '<p class="repro-demo">' + esc(T.reproDemo) + '</p>' : '') +
      '</div>';
  }

  // 0:07 · 2:25. Sin horas: ningun listening del examen llega a sesenta minutos.
  function reloj(seg) {
    if (!isFinite(seg) || seg < 0) return '--:--';
    var m = Math.floor(seg / 60), r = Math.floor(seg % 60);
    return m + ':' + (r < 10 ? '0' : '') + r;
  }

  var AUDIO = { escuchas: 0, tic: null };

  // Cinco segundos antes de que arranque el audio. No es decoracion: en el
  // examen el audio no empieza cuando tu decides, y darle a un boton y oir voz
  // en el mismo instante no se parece en nada a estar sentado esperando. Es
  // ademas el momento de levantar la vista a las preguntas.
  var CUENTA = 5;

  function cuentaAtras(cuando) {
    var caja = $('#au-cuenta5'), num = $('#au-n'), aro = $('#au-aro'), txt = $('#au-listo');
    if (!caja) { cuando(); return; }
    if (AUDIO.tic) clearInterval(AUDIO.tic);
    var n = CUENTA, largo = 2 * Math.PI * 54;
    caja.hidden = false;
    if (txt) txt.textContent = T.cuentaListo;
    var pinta = function () {
      num.textContent = n > 0 ? n : T.cuentaYa;
      // Se quita y se vuelve a poner para reiniciar la animacion del numero:
      // sin esto solo late el primero.
      num.classList.remove('late');
      void num.offsetWidth;
      num.classList.add('late');
      if (aro) aro.style.strokeDashoffset = largo * (1 - n / CUENTA);
    };
    pinta();
    AUDIO.tic = setInterval(function () {
      // Si se ha cambiado de pantalla, el nodo ya no esta: se para sola.
      if (!document.body.contains(caja)) { clearInterval(AUDIO.tic); AUDIO.tic = null; return; }
      n--;
      pinta();
      // Cinco segundos son cinco: 5, 4, 3, 2, 1 y suena. El "ya" se ve encima
      // del audio que ya ha arrancado, no antes; si esperase un segundo mas a
      // decirlo, la cuenta duraria seis.
      if (n <= 0) {
        clearInterval(AUDIO.tic); AUDIO.tic = null;
        cuando();
        setTimeout(function () { caja.hidden = true; }, 500);
      }
    }, 1000);
  }

  function preparaReproductor(ej) {
    var au = $('#au');
    if (!au) return;
    if (AUDIO.tic) { clearInterval(AUDIO.tic); AUDIO.tic = null; }
    AUDIO.escuchas = 0;
    var total = ej.escuchas || 2;
    var pinta = function () {
      var quedan = total - AUDIO.escuchas;
      $('#au-cuenta').textContent = T.reproEscucha
        .replace('{n}', Math.min(AUDIO.escuchas + 1, total)).replace('{t}', total);
      // Mientras suena el boton no hace nada, asi que el rotulo tiene que
      // decir que esta pasando y no invitar a pulsarlo otra vez.
      $('#au-txt').textContent = !au.paused ? T.reproSonando
        : AUDIO.escuchas === 0 ? T.reproEmpezar
        : quedan > 0 ? T.reproOtra : T.reproFin;
      $('#au-play').disabled = quedan <= 0 || !au.paused || !!AUDIO.tic;
      var caja = $('#repro');
      if (caja) {
        caja.classList.toggle('sonando', !au.paused);
        caja.classList.toggle('agotado', quedan <= 0);
      }
    };
    pinta();

    var pintaTotal = function () { $('#au-total').textContent = reloj(au.duration); };
    au.addEventListener('loadedmetadata', pintaTotal);
    pintaTotal();

    au.addEventListener('timeupdate', function () {
      $('#au-t').textContent = reloj(au.currentTime);
      // Hay formatos de los que el navegador no sabe la duracion y devuelve
      // Infinity. Sin este isFinite, la barra se queda clavada en cero y
      // parece que el audio no avanza.
      if (isFinite(au.duration) && au.duration)
        $('#au-fill').style.width = (au.currentTime / au.duration * 100) + '%';
    });
    // Sin rebobinar: cualquier salto se deshace y se vuelve a donde iba. Si se
    // puede repetir el trozo dificil, la nota deja de medir nada.
    //
    // La bandera es un seguro barato. Al asignar currentTime se dispara otro
    // 'seeking'; segun la norma, dentro ya se lee la posicion nueva, la
    // diferencia con el tope es cero y no se vuelve a corregir. Pero si algun
    // navegador no la actualiza a tiempo, sin bandera esto se convierte en un
    // bucle de saltos que no converge.
    //
    // AVISO: esto no esta comprobado en un navegador de verdad. El Chromium sin
    // pantalla de las pruebas no sabe saltar en un audio —ni adelante, ni en
    // pausa, ni antes de empezar—, asi que qa-listening.py comprueba todo lo
    // demas y esta regla se queda sin verificar. Hay que probarla a mano.
    var tope = 0, corrigiendo = false;
    au.addEventListener('timeupdate', function () {
      if (au.currentTime > tope) tope = au.currentTime;
    });
    au.addEventListener('seeking', function () {
      if (corrigiendo) { corrigiendo = false; return; }
      if (Math.abs(au.currentTime - tope) > 0.6) { corrigiendo = true; au.currentTime = tope; }
    });
    au.addEventListener('ended', function () {
      AUDIO.escuchas++;
      tope = 0; corrigiendo = false;
      $('#au-fill').style.width = '0%';
      $('#au-t').textContent = '0:00';
      pinta();
      track('listening_escucha', { ejercicio: ej.id, escucha: AUDIO.escuchas });
    });
    au.addEventListener('play', pinta);
    au.addEventListener('pause', pinta);
    $('#au-play').addEventListener('click', function () {
      if (AUDIO.escuchas >= total) return;
      // Mientras cuenta, el boton no responde: si no, dos clics seguidos
      // arrancan dos cuentas y el audio empieza dos veces.
      if (AUDIO.tic) return;
      $('#au-play').disabled = true;
      cuentaAtras(function () { au.play(); });
    });
    // Al salir de la pantalla se para la cuenta: si no, sigue viva y el audio
    // arranca solo encima de otro ejercicio.
    AUDIO.corta = function () {
      if (AUDIO.tic) { clearInterval(AUDIO.tic); AUDIO.tic = null; }
    };
  }


  // Escribe debajo de la pregunta lo que dice la letra elegida. En la parte 4
  // del listening las respuestas son ocho letras a secas: sin esto hay que
  // acordarse de que decia cada una, o subir a la lista a mirarlo.
  function pintaEco(grupo) {
    if (!actual || !(actual.listas || []).length) return;
    var i = +grupo.getAttribute('data-i');
    var eco = document.querySelector('[data-eco="' + i + '"]');
    if (!eco) return;
    var sel = grupo.querySelector('.op.elegida');
    if (!sel) { eco.hidden = true; eco.textContent = ''; return; }
    var k = +sel.getAttribute('data-op');
    var porTarea = actual.items.length / actual.listas.length;
    var lista = actual.listas[Math.floor(i / porTarea)];
    var txt = lista && lista.opciones[k];
    if (!txt) { eco.hidden = true; return; }
    eco.hidden = false;
    eco.innerHTML = '<b>' + 'ABCDEFGH'.charAt(k) + '</b> ' + esc(txt);
  }

  function cuerpoEjercicio(ej) {
    var h = '';
    if (ej.tipo === 'listening') {
      // El reproductor impone las reglas del examen. Las preguntas son frases
      // incompletas en la parte 2 y de eleccion en las partes 1, 3 y 4.
      h += reproductor(ej);
      if (ej.contexto) h += '<p class="lis-contexto">' + esc(ej.contexto) + '</p>';
      // La parte 4 tiene dos tareas sobre los mismos cinco monologos, cada una
      // con su propia lista de ocho opciones.
      //
      // Antes se pintaban las dos listas seguidas y despues las diez preguntas
      // juntas. Al contestar la pregunta 8, la lista que le tocaba estaba dos
      // pantallas mas arriba, y las dos listas se ven identicas: ocho letras.
      // Eso hacia nuestra version MAS dificil que el examen, donde tienes la
      // hoja delante y ves lista y preguntas a la vez. Ahora cada lista va
      // pegada a sus propias preguntas.
      var listas = ej.listas || [];
      var porTarea = listas.length > 1 && ej.items.length % listas.length === 0
        ? ej.items.length / listas.length : 0;

      var pintaLista = function (lista, n) {
        var t = '<div class="lis-tarea' + (porTarea ? ' t' + (n % 2 + 1) : '') + '">';
        if (lista.titulo) t += '<h4>' + esc(lista.titulo) + '</h4>';
        t += '<ol class="lis-lista">';
        lista.opciones.forEach(function (o, k) {
          t += '<li><span class="seccion-letra">' + 'ABCDEFGH'.charAt(k) + '</span><span>' + esc(o) + '</span></li>';
        });
        return t + '</ol></div>';
      };

      var pintaPreguntas = function (desde, hasta) {
        var t = '<ol class="grupos preguntas">';
        for (var i = desde; i < hasta; i++) {
          var it = ej.items[i];
          t += '<li>';
          // Agrupadas bajo su tarea, el "Tarea 1 ·" de cada enunciado sobra y
          // solo alarga la linea.
          if (it.pregunta) t += '<p class="pregunta">' +
            esc(porTarea ? it.pregunta.replace(/^\s*(Tarea|Task)\s+\S+\s*·\s*/, '') : it.pregunta) + '</p>';
          t += '<div class="grupo-op' + (ej.opcionesCortas ? ' letras' : '') + '" data-i="' + i +
               '" role="radiogroup" aria-label="' + T.pregunta.replace('{n}', i + 1) + '">';
          it.opciones.forEach(function (op, k) {
            t += '<button type="button" class="op" data-op="' + k + '">' +
                 '<span class="op-letra">' + 'ABCDEFGH'.charAt(k) + '</span>' +
                 (ej.opcionesCortas ? '' : esc(op)) + '</button>';
          });
          t += '</div>';
          // Al elegir una letra se escribe aqui lo que esa letra decia. Sin
          // esto hay que memorizar ocho frases o subir a mirarlas.
          if (ej.opcionesCortas && listas.length)
            t += '<p class="op-eco" data-eco="' + i + '" hidden></p>';
          t += '</li>';
        }
        return t + '</ol>';
      };

      if (seElige(ej)) {
        if (porTarea) {
          listas.forEach(function (lista, n) {
            h += pintaLista(lista, n) + pintaPreguntas(n * porTarea, (n + 1) * porTarea);
          });
        } else {
          listas.forEach(function (lista, n) { h += pintaLista(lista, n); });
          h += pintaPreguntas(0, ej.items.length);
        }
      } else {
        listas.forEach(function (lista, n) { h += pintaLista(lista, n); });
        h += '<ol class="frases">';
        ej.items.forEach(function (it, i) {
          h += '<li><p class="frase">' + esc(it.antes || '') + ' ' + campo(i, 'medio') + ' ' +
               esc(it.despues || '') + '</p></li>';
        });
        h += '</ol>';
      }
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
    return seElige(ej) ? $$('.grupo-op', cont) : $$('.hueco', cont);
  }
  function valorDe(c) {
    if (!c.classList.contains('grupo-op')) return c.value;
    var sel = c.querySelector('.op.elegida');
    return sel ? sel.getAttribute('data-op') : '';
  }

  function enfoca() {
    if (actual && seElige(actual)) return;
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

    var abiertasAntes = sesionesActivas().filter(function (e) { return estado(e) === 'abierta' || estado(e) === 'completa'; }).length;
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
    var abiertasDespues = sesionesActivas().filter(function (e) { return estado(e) === 'abierta' || estado(e) === 'completa'; }).length;
    if (abiertasDespues > abiertasAntes) {
      var nueva = sesionesActivas().filter(function (e) { return estado(e) === 'abierta'; })
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

  // Solo puede haber un reproductor vivo en toda la pagina. La pantalla del
  // simulacro y la del ejercicio usan la misma marca, con el mismo id="au", y
  // ninguna vaciaba su cuerpo al salir. Con las dos puestas habia dos id="au",
  // $('#au') devolvia el primero del documento --el viejo, escondido--, y el
  // reproductor que el alumno tenia delante se quedaba sin rotulo y con el
  // boton muerto. Pasaba siempre que hubieras abierto un simulacro de listening
  // antes, que es justo lo que hace cualquiera que este probando la aplicacion.
  function soloUnReproductor(salvo) {
    ['#sim-cuerpo', '#ej-cuerpo'].forEach(function (sel) {
      if (sel === salvo) return;
      var c = document.querySelector(sel);
      if (!c || !c.querySelector('#au')) return;
      var a = c.querySelector('audio');
      if (a) { try { a.pause(); } catch (e) {} }
      c.innerHTML = '';
    });
  }

  function muestra(id) {
    if (AUDIO && AUDIO.corta) AUDIO.corta();
    soloUnReproductor(id === 's-simulacro' ? '#sim-cuerpo'
                    : id === 's-ejercicio' ? '#ej-cuerpo' : null);
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
    pregunta({
      titulo: T.simConfirmarTit,
      cuerpo: T.simConfirmarCuerpo,
      datos: [{ n: sim.items, eti: T.simConfirmarPreg }, { n: sim.minutos, eti: T.simConfirmarMin }],
      nota: hist.length ? T.simRepetir : '',
      ok: T.simConfirmarOk, no: T.simConfirmarNo
    }, function () { empiezaSimulacro(id); });
  }

  function abandonaSimulacro() {
    pregunta({
      titulo: T.simAbandonarTit,
      cuerpo: T.simAbandonarCuerpo,
      ok: T.simAbandonarOk, no: T.simAbandonarNo, peligro: true
    }, function () {
      clearInterval(relojSim);
      SIM = null;
      guardaSim();
      alPanel();
      track('simulacro_abandonado', {});
    });
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

  /* ---------- admin ----------
     No es para alumnos. Se llega escribiendo #admin y no hay ningun enlace:
     poner el nivel a mano es algo que Elena necesita --un alumno al que ya
     conoce no tiene por que hacer la prueba-- y que durante el desarrollo
     hacia falta constantemente, obligando a repetir el test de nivel entero
     cada vez. */

  /* El nivel activo, y el curso que se sirve.

     No son lo mismo y separarlos importa: un alumno puede tener nivel B1 y
     hoy no existe curso de B1. En ese caso se le sirve el unico que hay y se
     le DICE, en vez de dejarle creer que ese es su curso. Mentir aqui es
     venderle un examen que no es el suyo. */

  function nivelActivo() {
    var a = nivelAlumno();
    var etiqueta = a && a.nivel ? a.nivel : '';
    var pedido = nivelPara(etiqueta);
    // 'redondeado' no es lo mismo que 'sustituto'. Sustituto: tu nivel existe
    // y todavia no tiene curso escrito. Redondeado: tu resultado no es
    // ninguno de los cuatro niveles y se te ha puesto en el mas cercano por
    // arriba. Los dos se dicen, y con palabras distintas.
    var redondeado = !!pedido && pedido.mcer !== etiqueta;
    // Hacia donde se ha redondeado. Casi siempre hacia arriba, pero un C2 cae
    // en C1 porque es lo mas alto que existe, y decirle que le hemos puesto
    // "el mas cercano por arriba" seria mentirle sobre su propio resultado.
    var arriba = redondeado && valorMcer(pedido.mcer) > valorMcer(etiqueta);
    if (pedido && pedido.curso)
      return { nivel: pedido, sustituto: false, redondeado: redondeado,
               arriba: arriba, etiqueta: etiqueta };
    var conCurso = (DATA.niveles || []).filter(function (n) { return n.curso; });
    if (!conCurso.length)
      return { nivel: null, sustituto: false, redondeado: false, etiqueta: etiqueta };
    return { nivel: conCurso[0], sustituto: !!pedido, redondeado: false, etiqueta: etiqueta };
  }

  function papelesActivos() {
    var n = nivelActivo().nivel;
    return (n && n.papeles) || [];
  }

  function nivelDe(mcer) {
    var n = null;
    (DATA.niveles || []).forEach(function (x) { if (x.mcer === mcer) n = x; });
    return n;
  }

  /* El test de nivel y la plataforma no hablan el mismo idioma.

     El test reparte A1, A2, B1, B2 y B2+; la plataforma declara A2, B1, B2 y
     C1. Dos de los cinco resultados --A1 y B2+-- no casaban con ningun nivel,
     nivelDe devolvia null, y el alumno caia en el curso por defecto SIN que se
     le dijera nada: un B2+ no podia llegar al curso de C1 haciendo la prueba,
     que es justo para lo que se hace la prueba.

     Se resuelve en la escala del MCER, no por tabla: cada etiqueta vale un
     numero, el '+' suma medio punto, y se coge el nivel declarado mas bajo que
     llegue a ese numero. Redondear HACIA ARRIBA es lo correcto aqui: el test
     se corta en B2+ y dice explicitamente que por encima de eso hay que
     hablarlo, asi que a quien lo termina entero se le sirve lo mas exigente
     que existe, no lo que acaba de demostrar que ya domina.

       A1  -> el curso mas bajo que haya      B2+ -> C1
       C2  -> el mas alto que haya            B2  -> B2 (exacto) */
  var ESCALA = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };

  function valorMcer(etiqueta) {
    var m = String(etiqueta || '').toUpperCase().match(/^([ABC][12])(\+?)$/);
    if (!m || !ESCALA[m[1]]) return null;
    return ESCALA[m[1]] + (m[2] ? 0.5 : 0);
  }

  // El nivel declarado que le toca a una etiqueta del test, exista curso o no.
  function nivelPara(etiqueta) {
    var exacto = nivelDe(etiqueta);
    if (exacto) return exacto;
    var v = valorMcer(etiqueta);
    if (v === null) return null;
    var orden = (DATA.niveles || []).slice().sort(function (a, b) {
      return valorMcer(a.mcer) - valorMcer(b.mcer);
    });
    if (!orden.length) return null;
    var arriba = orden.filter(function (n) { return valorMcer(n.mcer) >= v; })[0];
    return arriba || orden[orden.length - 1];
  }

  function pintaAdmin() {
    var actual = nivelAlumno();
    var act = nivelActivo();
    // Que nivel tiene guardado Y que curso esta viendo. No siempre coinciden:
    // el test puede devolver B2+, que no es ninguno de los cuatro, y entonces
    // el desplegable de abajo sale en blanco. Sin esta linea Elena no tendria
    // manera de saber que ese alumno esta viendo el de C1.
    $('#ad-actual').textContent = actual
      ? 'Ahora mismo: ' + actual.nivel + (actual.puntuacion !== undefined && actual.sobre
          ? ' · ' + actual.puntuacion + '/' + actual.sobre + ' en la prueba' : ' · puesto a mano') +
        (act.nivel ? ' · ve el curso de ' + act.nivel.mcer : '')
      : 'Ahora mismo no hay ningun nivel guardado.';

    var sel = $('#ad-nivel');
    sel.innerHTML = '<option value="">— sin nivel —</option>' +
      (DATA.niveles || []).map(function (n) {
        return '<option value="' + esc(n.mcer) + '">' + esc(n.mcer + ' · ' + n.nombre) +
               (n.curso ? '' : ' (sin curso)') + '</option>';
      }).join('');
    sel.value = actual ? actual.nivel : '';

    $('#ad-cursos').innerHTML = (DATA.niveles || []).map(function (n) {
      return '<li><span class="' + (n.curso ? 'ad-si' : 'ad-no') + '">' +
             (n.curso ? '✓' : '·') + '</span> <b>' + esc(n.mcer) + '</b> ' + esc(n.nombre) +
             ' — ' + (n.curso ? esc(cuentaNivel(n.id).tests + ' tests, ' +
                                     cuentaNivel(n.id).ejercicios + ' ejercicios')
                              : 'sin escribir') + '</li>';
    }).join('');

    avisaAdmin();
  }

  // Si el nivel elegido no tiene curso, se dice antes de guardar. Poner B1 a un
  // alumno no le da un curso de B1: hoy hay escritos el de B2 y el de C1.
  function avisaAdmin() {
    var v = $('#ad-nivel').value, n = v ? nivelDe(v) : null;
    var p = $('#ad-pista');
    if (!v) {
      p.className = 'ad-pista';
      // El desplegable en blanco significa dos cosas distintas. Una es que no
      // hay nivel. La otra es que el test devolvio algo que no esta en la
      // lista --B2+ o A1-- y entonces decir "sin nivel" seria falso.
      var guardado = nivelAlumno();
      var act = nivelActivo();
      p.textContent = guardado
        ? 'El alumno tiene ' + guardado.nivel + ', que no es ninguno de los cuatro. ' +
          'Se le sirve el curso de ' + (act.nivel ? act.nivel.mcer : '—') +
          '. Guardar ahora asi le deja sin nivel.'
        : 'Sin nivel, el panel no ensena ninguna recomendacion.';
      return;
    }
    if (n && !n.curso) {
      p.className = 'ad-pista aviso';
      var sust = (DATA.niveles || []).filter(function (x) { return x.curso; })[0];
      p.textContent = 'Ojo: ' + n.mcer + ' todavia no tiene curso escrito. El alumno vera el de ' +
                      (sust ? sust.mcer : '—') + ', que no es el suyo.';
    } else {
      p.className = 'ad-pista';
      p.textContent = 'Hay curso de ' + v + ': ' + cuentaNivel(n.id).tests + ' tests.';
    }
  }

  function guardaNivelAdmin() {
    var v = $('#ad-nivel').value;
    if (!v) { localStorage.removeItem(CLAVE_NIVEL); }
    else {
      // Se marca de donde viene. Un nivel puesto a mano no es un resultado de
      // la prueba y no debe contarse como tal en ningun sitio.
      localStorage.setItem(CLAVE_NIVEL, JSON.stringify({
        nivel: v, manual: true, fecha: hoy()
      }));
    }
    subePerfil();
    pintaAdmin();
    pintaPanel();
  }

  function pinta(hash) {
    var id = (hash || '').replace('#', '');
    if (id === 'admin') { pintaAdmin(); muestra('s-admin'); return; }
    if (id.indexOf('informe-') === 0) { abreInforme(id.slice(8), false); return; }
    if (id.indexOf('sim-') === 0 || id.indexOf('simres-') === 0) { pintaPanel(); muestra('s-panel'); return; }
    if (id && porId(EJERCICIOS, id)) { abreEjercicio(id, false); return; }
    if (id && porId(SESIONES, id)) { abreSesion(id, false); return; }
    pintaPanel(); muestra('s-panel');
  }

  /* ---------- eventos ---------- */

  document.addEventListener('change', function (e) {
    if (e.target && e.target.id === 'ad-nivel') avisaAdmin();
  });

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
    if (e.target.closest('#ad-guardar')) { guardaNivelAdmin(); return; }
    if (e.target.closest('#ad-borrar')) {
      pregunta({ titulo: '¿Borrar el nivel?',
                 cuerpo: 'El alumno se queda sin nivel guardado, como si no hubiera hecho la prueba.',
                 ok: 'Borrar', no: 'Cancelar', peligro: true },
               function () { $('#ad-nivel').value = ''; guardaNivelAdmin(); });
      return;
    }
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
      pintaEco(op.parentNode);
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
