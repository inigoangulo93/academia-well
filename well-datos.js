/* Well Online · capa de datos
 *
 * Regla: el navegador manda. El progreso se guarda SIEMPRE en localStorage,
 * de forma sincrona, con cuenta o sin ella. Supabase es un espejo: cuando hay
 * sesion se sube lo que cambia y, al entrar desde otro dispositivo, se baja y
 * se funde con lo que hubiera aqui.
 *
 * Asi nadie esta obligado a registrarse para probar la plataforma, nadie
 * pierde el progreso al crear la cuenta, y si el servidor no responde la
 * clase sigue funcionando igual.
 *
 * Sin configuracion (well-config.js vacio) este fichero no hace nada: activo()
 * devuelve false y la pagina se comporta exactamente como antes.
 */
(function () {
  'use strict';

  var CFG = window.WELL_CONFIG || {};
  var HAY_CONFIG = !!(CFG.supabaseUrl && CFG.supabaseAnonKey);
  var CLIENTE_JS = 'vendor/supabase-2.115.0.js';   // define el global window.supabase

  var cliente = null;
  var sesion = null;
  var listo = false;
  var oyentesListo = [], oyentesCambio = [];

  // Lo ultimo que se dio por enviado al servidor, para no repetir escrituras.
  // Es solo una cache en memoria: si se recarga la pagina se vuelve a subir
  // todo una vez, que es barato y ademas repara cualquier desajuste.
  var enviado = { ejercicios: {}, dias: {}, insignias: {}, simulacros: {}, perfil: '' };

  var pendiente = null, temporizador = null;

  function log(e) { try { console.warn('[well-datos]', e && e.message ? e.message : e); } catch (_) {} }

  /* ---------- arranque ---------- */

  // El cliente de Supabase pesa 210 KB. No se descarga si no hay servidor
  // configurado, que es el caso mientras la plataforma sea un prototipo.
  function cargaCliente() {
    if (window.supabase && window.supabase.createClient) return Promise.resolve(window.supabase);
    return new Promise(function (ok, mal) {
      var s = document.createElement('script');
      s.src = CLIENTE_JS;
      s.onload = function () {
        if (window.supabase && window.supabase.createClient) ok(window.supabase);
        else mal(new Error('cliente cargado pero sin createClient'));
      };
      s.onerror = function () { mal(new Error('no se pudo cargar ' + CLIENTE_JS)); };
      document.head.appendChild(s);
    });
  }

  function arranca() {
    if (!HAY_CONFIG) return marcaListo();
    cargaCliente().then(conecta).catch(function (e) { log(e); marcaListo(); });
  }

  function conecta(LIB) {
    try {
      cliente = LIB.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
    } catch (e) { log(e); return marcaListo(); }

    cliente.auth.getSession().then(function (r) {
      sesion = (r && r.data && r.data.session) || null;
      marcaListo();
    }).catch(function (e) { log(e); marcaListo(); });

    cliente.auth.onAuthStateChange(function (evento, s) {
      var antes = sesion && sesion.user ? sesion.user.id : null;
      sesion = s || null;
      var ahora = sesion && sesion.user ? sesion.user.id : null;
      if (antes === ahora) return;
      enviado = { ejercicios: {}, dias: {}, insignias: {}, simulacros: {}, perfil: '' };
      oyentesCambio.forEach(function (cb) { try { cb(API.sesion()); } catch (e) { log(e); } });
    });
  }

  function marcaListo() {
    listo = true;
    oyentesListo.forEach(function (cb) { try { cb(API.sesion()); } catch (e) { log(e); } });
    oyentesListo = [];
  }

  var uid = function () { return sesion && sesion.user ? sesion.user.id : null; };

  /* ---------- fusion ---------- */

  // Al entrar puede haber progreso en el navegador y progreso en la cuenta.
  // No se elige uno: se quedan las dos mitades buenas. Un ejercicio hecho en
  // el movil y otro en el portatil aparecen los dos.
  function funde(local, remoto) {
    var P = {
      ejercicios: {}, dias: [], insignias: [], simulacros: {},
      tramos: (local && local.tramos) || {}          // estado de la interfaz: no viaja
    };
    if (local && local.simulacroEnCurso) P.simulacroEnCurso = local.simulacroEnCurso;

    [local, remoto].forEach(function (F) {
      if (!F) return;
      Object.keys(F.ejercicios || {}).forEach(function (id) {
        var a = P.ejercicios[id], b = F.ejercicios[id];
        if (!a) { P.ejercicios[id] = Object.assign({}, b); return; }
        // Gana el mejor resultado; del resto se queda la version mas reciente.
        var nuevo = (b.fecha || '') >= (a.fecha || '') ? b : a;
        var viejo = nuevo === b ? a : b;
        P.ejercicios[id] = Object.assign({}, viejo, nuevo, {
          mejor: Math.max(a.mejor || 0, b.mejor || 0),
          intentos: Math.max(a.intentos || 0, b.intentos || 0),
          total: Math.max(a.total || 0, b.total || 0)
        });
      });
      (F.dias || []).forEach(function (d) { if (P.dias.indexOf(d) === -1) P.dias.push(d); });
      (F.insignias || []).forEach(function (i) { if (P.insignias.indexOf(i) === -1) P.insignias.push(i); });
      Object.keys(F.simulacros || {}).forEach(function (id) {
        P.simulacros[id] = (P.simulacros[id] || []).concat(F.simulacros[id] || []);
      });
    });

    P.dias.sort();
    // Dos intentos del mismo simulacro con la misma fecha y la misma nota son
    // el mismo intento subido dos veces, no dos examenes.
    Object.keys(P.simulacros).forEach(function (id) {
      var vistos = {};
      P.simulacros[id] = P.simulacros[id].filter(function (x) {
        var k = [x.fecha, x.ok, x.items, x.minutos, !!x.porTiempo].join('|');
        if (vistos[k]) return false;
        vistos[k] = 1; return true;
      }).sort(function (a, b) { return String(a.fecha).localeCompare(String(b.fecha)); });
    });
    return P;
  }

  /* ---------- bajar ---------- */

  function baja() {
    if (!cliente || !uid()) return Promise.resolve(null);
    var yo = uid();
    return Promise.all([
      cliente.from('progreso').select('*').eq('alumno', yo),
      cliente.from('dias_activos').select('dia').eq('alumno', yo),
      cliente.from('insignias').select('insignia').eq('alumno', yo),
      cliente.from('simulacros').select('*').eq('alumno', yo)
    ]).then(function (r) {
      r.forEach(function (x) { if (x.error) throw x.error; });
      var P = { ejercicios: {}, dias: [], insignias: [], simulacros: {} };
      (r[0].data || []).forEach(function (f) {
        var e = { mejor: f.mejor, total: f.total, intentos: f.intentos, fecha: f.fecha };
        if (f.respuestas) e.respuestas = f.respuestas;
        if (f.texto != null) { e.texto = f.texto; e.palabras = f.palabras; }
        P.ejercicios[f.ejercicio] = e;
      });
      (r[1].data || []).forEach(function (f) { P.dias.push(f.dia); });
      (r[2].data || []).forEach(function (f) { P.insignias.push(f.insignia); });
      (r[3].data || []).forEach(function (f) {
        (P.simulacros[f.simulacro] = P.simulacros[f.simulacro] || []).push({
          fecha: f.fecha, ok: f.aciertos, items: f.sobre,
          partes: f.partes || [], porTiempo: !!f.por_tiempo, minutos: f.minutos
        });
      });
      registraLoQueYaEsta(P);
      return P;
    }).catch(function (e) { log(e); return null; });
  }

  /* ---------- subir ---------- */

  // Solo se envia lo que ha cambiado desde la ultima vez. Se compara por
  // huella en texto: es una fila pequena y comparar asi evita mil upserts
  // identicos mientras el alumno escribe un writing.
  function filaEjercicio(yo, id, e) {
    return {
      alumno: yo, ejercicio: id,
      mejor: e.mejor || 0, total: e.total || 0, intentos: e.intentos || 0,
      respuestas: e.respuestas == null ? null : e.respuestas,
      texto: e.texto == null ? null : e.texto,
      palabras: e.palabras == null ? null : e.palabras,
      fecha: e.fecha || new Date().toISOString().slice(0, 10)
    };
  }
  function huellaEjercicio(f) {
    return JSON.stringify([f.mejor, f.total, f.intentos, f.respuestas, f.texto, f.fecha]);
  }
  function claveSimulacro(id, x) {
    return id + '|' + [x.fecha, x.ok, x.items, x.minutos, !!x.porTiempo].join('|');
  }

  // Lo que acaba de llegar del servidor ya esta en el servidor: se marca como
  // enviado para no volver a mandarlo. Sin esto, cada recarga reinsertaria
  // todos los intentos de simulacro (esa tabla guarda todos, no hace upsert)
  // y el alumno veria su historial duplicado.
  function registraLoQueYaEsta(remoto) {
    if (!remoto) return;
    Object.keys(remoto.ejercicios || {}).forEach(function (id) {
      enviado.ejercicios[id] = huellaEjercicio(filaEjercicio(null, id, remoto.ejercicios[id]));
    });
    (remoto.dias || []).forEach(function (d) { enviado.dias[d] = 1; });
    (remoto.insignias || []).forEach(function (i) { enviado.insignias[i] = 1; });
    Object.keys(remoto.simulacros || {}).forEach(function (id) {
      (remoto.simulacros[id] || []).forEach(function (x) { enviado.simulacros[claveSimulacro(id, x)] = 1; });
    });
  }

  function cambios(P) {
    var yo = uid(), lote = { progreso: [], dias: [], insignias: [], simulacros: [] };

    Object.keys(P.ejercicios || {}).forEach(function (id) {
      var fila = filaEjercicio(yo, id, P.ejercicios[id]);
      fila.actualizado = new Date().toISOString();
      var huella = huellaEjercicio(fila);
      if (enviado.ejercicios[id] !== huella) { fila._huella = huella; lote.progreso.push(fila); }
    });

    (P.dias || []).forEach(function (d) {
      if (!enviado.dias[d]) lote.dias.push({ alumno: yo, dia: d });
    });
    (P.insignias || []).forEach(function (i) {
      if (!enviado.insignias[i]) lote.insignias.push({ alumno: yo, insignia: i });
    });
    Object.keys(P.simulacros || {}).forEach(function (id) {
      (P.simulacros[id] || []).forEach(function (x) {
        var k = claveSimulacro(id, x);
        if (enviado.simulacros[k]) return;
        lote.simulacros.push({
          _clave: k, alumno: yo, simulacro: id, fecha: x.fecha,
          aciertos: x.ok || 0, sobre: x.items || 0, partes: x.partes || [],
          por_tiempo: !!x.porTiempo, minutos: x.minutos == null ? null : x.minutos
        });
      });
    });
    return lote;
  }

  function vuelca(P) {
    if (!cliente || !uid()) return Promise.resolve(false);
    var lote = cambios(P), tareas = [];

    if (lote.progreso.length) {
      var filas = lote.progreso.map(function (f) { var c = Object.assign({}, f); delete c._huella; return c; });
      tareas.push(cliente.from('progreso').upsert(filas, { onConflict: 'alumno,ejercicio' })
        .then(function (r) {
          if (r.error) throw r.error;
          lote.progreso.forEach(function (f) { enviado.ejercicios[f.ejercicio] = f._huella; });
        }));
    }
    if (lote.dias.length) {
      tareas.push(cliente.from('dias_activos').upsert(lote.dias, { onConflict: 'alumno,dia', ignoreDuplicates: true })
        .then(function (r) {
          if (r.error) throw r.error;
          lote.dias.forEach(function (f) { enviado.dias[f.dia] = 1; });
        }));
    }
    if (lote.insignias.length) {
      tareas.push(cliente.from('insignias').upsert(lote.insignias, { onConflict: 'alumno,insignia', ignoreDuplicates: true })
        .then(function (r) {
          if (r.error) throw r.error;
          lote.insignias.forEach(function (f) { enviado.insignias[f.insignia] = 1; });
        }));
    }
    if (lote.simulacros.length) {
      // La tabla de simulacros guarda todos los intentos y no tiene clave
      // unica: se insertan, no se hace upsert. La deduplicacion la hace el
      // registro de enviados de arriba y, al bajar, funde().
      var claves = lote.simulacros.map(function (f) { return f._clave; });
      var ins = lote.simulacros.map(function (f) { var c = Object.assign({}, f); delete c._clave; return c; });
      tareas.push(cliente.from('simulacros').insert(ins)
        .then(function (r) {
          if (r.error) throw r.error;
          claves.forEach(function (k) { enviado.simulacros[k] = 1; });
        }));
    }
    if (!tareas.length) return Promise.resolve(false);
    return Promise.all(tareas).then(function () { return true; })
      .catch(function (e) { log(e); return false; });
  }

  /* ---------- perfil ---------- */

  function guardaPerfil(datos) {
    if (!cliente || !uid()) return Promise.resolve(false);
    var fila = { id: uid() };
    if (datos.nombre) fila.nombre = datos.nombre;
    if (datos.nivel) {
      fila.nivel = datos.nivel.nivel;
      fila.nivel_fecha = datos.nivel.fecha || null;
      fila.nivel_puntos = datos.nivel.puntuacion == null ? null : datos.nivel.puntuacion;
      fila.nivel_sobre = datos.nivel.sobre == null ? null : datos.nivel.sobre;
    }
    var huella = JSON.stringify(fila);
    if (enviado.perfil === huella) return Promise.resolve(false);
    return cliente.from('perfiles').upsert(fila, { onConflict: 'id' }).then(function (r) {
      if (r.error) throw r.error;
      enviado.perfil = huella;
      return true;
    }).catch(function (e) { log(e); return false; });
  }

  function leePerfil() {
    if (!cliente || !uid()) return Promise.resolve(null);
    return cliente.from('perfiles').select('*').eq('id', uid()).maybeSingle()
      .then(function (r) { if (r.error) throw r.error; return r.data || null; })
      .catch(function (e) { log(e); return null; });
  }

  /* ---------- API ---------- */

  var API = {
    // Hay servidor configurado. Si es false, la pagina no debe ensenar login.
    activo: function () { return HAY_CONFIG && !!cliente; },
    listo: function () { return listo; },

    sesion: function () {
      if (!sesion || !sesion.user) return null;
      return { id: sesion.user.id, correo: sesion.user.email || '' };
    },

    alListo: function (cb) { if (listo) cb(API.sesion()); else oyentesListo.push(cb); },
    alCambiar: function (cb) { oyentesCambio.push(cb); },

    // Enlace magico: no hay contrasenas que recordar ni que perder.
    entrar: function (correo, destino) {
      if (!cliente) return Promise.reject(new Error('sin servidor'));
      return cliente.auth.signInWithOtp({
        email: String(correo || '').trim(),
        options: { emailRedirectTo: destino || (location.origin + '/practica.html') }
      }).then(function (r) { if (r.error) throw r.error; return true; });
    },

    salir: function () {
      if (!cliente) return Promise.resolve();
      return cliente.auth.signOut().catch(function (e) { log(e); });
    },

    baja: baja,
    funde: funde,
    perfil: leePerfil,
    guardaPerfil: guardaPerfil,

    // Empuja en segundo plano, agrupando: mientras el alumno teclea no se
    // manda una peticion por tecla.
    empuja: function (P, yaMismo) {
      if (!cliente || !uid()) return Promise.resolve(false);
      pendiente = P;
      if (yaMismo) {
        clearTimeout(temporizador); temporizador = null;
        var x = pendiente; pendiente = null;
        return vuelca(x);
      }
      if (temporizador) return Promise.resolve(false);
      temporizador = setTimeout(function () {
        temporizador = null;
        var y = pendiente; pendiente = null;
        if (y) vuelca(y);
      }, 1500);
      return Promise.resolve(false);
    },

    // Se llama al cerrar la pestana: lo que quede sin mandar, se manda.
    vaciaCola: function () {
      if (pendiente) { var x = pendiente; pendiente = null; clearTimeout(temporizador); temporizador = null; return vuelca(x); }
      return Promise.resolve(false);
    }
  };

  window.WellDatos = API;
  arranca();
})();
