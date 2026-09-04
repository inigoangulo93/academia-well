/* Supabase de mentira, solo para las pruebas.
 *
 * Este entorno no tiene salida a internet hacia supabase.com, asi que las
 * pruebas sustituyen el cliente de verdad por este. Implementa lo justo que
 * usa well-datos.js: sesion, enlace magico, select/eq/maybeSingle, upsert e
 * insert, y guarda las filas en memoria con las claves primarias del esquema.
 *
 * No imita el Row Level Security: eso ya se prueba contra un PostgreSQL de
 * verdad en supabase/probar-permisos.sh. Aqui se prueba la capa de datos:
 * que se sube lo que hay que subir y que la fusion no pierde nada.
 */
(function () {
  'use strict';

  // La base de mentira sobrevive a las recargas, como la de verdad: si no,
  // no se puede probar que volver a entrar no duplica los datos.
  var VACIA = { perfiles: [], progreso: [], dias_activos: [], insignias: [], simulacros: [] };
  var DB = window.__DB;
  if (!DB) {
    try { DB = JSON.parse(localStorage.getItem('qa_db') || 'null'); } catch (e) {}
  }
  DB = window.__DB = DB || JSON.parse(JSON.stringify(VACIA));
  function persiste() {
    try { localStorage.setItem('qa_db', JSON.stringify(DB)); } catch (e) {}
  }
  persiste();

  var LLAMADAS = window.__LLAMADAS = window.__LLAMADAS || [];
  var CLAVES = {
    perfiles: ['id'], progreso: ['alumno', 'ejercicio'],
    dias_activos: ['alumno', 'dia'], insignias: ['alumno', 'insignia'], simulacros: null
  };

  var sesion = window.__SESION || null;   // la prueba la pone antes de cargar
  if (!sesion) {
    try { sesion = JSON.parse(localStorage.getItem('qa_sesion') || 'null'); } catch (e) {}
  }
  var oyentes = [];

  function copia(x) { return JSON.parse(JSON.stringify(x)); }
  function mismaFila(t, a, b) {
    return (CLAVES[t] || []).every(function (k) { return a[k] === b[k]; });
  }

  function consulta(tabla) {
    var filtros = [], unico = false;

    var api = {
      select: function () { return api; },
      eq: function (col, val) { filtros.push([col, val]); return api; },
      maybeSingle: function () { unico = true; return api; },

      upsert: function (filas, opciones) {
        filas = Array.isArray(filas) ? filas : [filas];
        LLAMADAS.push({ tabla: tabla, op: 'upsert', n: filas.length });
        filas.forEach(function (f) {
          var i = -1;
          DB[tabla].forEach(function (x, j) { if (mismaFila(tabla, x, f)) i = j; });
          if (i === -1) DB[tabla].push(copia(f));
          else if (!(opciones && opciones.ignoreDuplicates)) DB[tabla][i] = Object.assign(DB[tabla][i], copia(f));
        });
        persiste();
        return { then: function (ok) { return Promise.resolve(ok({ data: copia(filas), error: null })); } };
      },

      insert: function (filas) {
        filas = Array.isArray(filas) ? filas : [filas];
        LLAMADAS.push({ tabla: tabla, op: 'insert', n: filas.length });
        filas.forEach(function (f) { DB[tabla].push(copia(f)); });
        persiste();
        return { then: function (ok) { return Promise.resolve(ok({ data: copia(filas), error: null })); } };
      },

      then: function (ok, mal) {
        LLAMADAS.push({ tabla: tabla, op: 'select' });
        var filas = DB[tabla].filter(function (f) {
          return filtros.every(function (p) { return f[p[0]] === p[1]; });
        });
        var r = { data: unico ? (copia(filas)[0] || null) : copia(filas), error: null };
        return Promise.resolve(r).then(ok, mal);
      }
    };
    return api;
  }

  // Imita la funcion edge borrar-cuenta: borra las filas del alumno de las
  // cinco tablas, que es lo que hace el borrado en cascada de PostgreSQL.
  function invocaFuncion(nombre) {
    if (nombre !== 'borrar-cuenta') {
      return Promise.resolve({ data: null, error: new Error('funcion desconocida: ' + nombre) });
    }
    if (!sesion) return Promise.resolve({ data: null, error: new Error('sin sesion') });
    if (window.__FALLA_BORRADO) {
      return Promise.resolve({ data: { error: 'fallo simulado' }, error: null });
    }
    var yo = sesion.user.id;
    DB.perfiles = DB.perfiles.filter(function (f) { return f.id !== yo; });
    ['progreso', 'dias_activos', 'insignias', 'simulacros'].forEach(function (t) {
      DB[t] = DB[t].filter(function (f) { return f.alumno !== yo; });
    });
    persiste();
    LLAMADAS.push({ tabla: '(funcion)', op: 'borrar-cuenta' });
    return Promise.resolve({ data: { ok: true }, error: null });
  }

  window.supabase = {
    createClient: function () {
      return {
        from: consulta,
        functions: { invoke: invocaFuncion },
        auth: {
          getSession: function () { return Promise.resolve({ data: { session: sesion }, error: null }); },
          onAuthStateChange: function (cb) { oyentes.push(cb); return { data: { subscription: { unsubscribe: function () {} } } }; },
          signInWithOtp: function (o) {
            window.__CORREO_ENVIADO = o.email;
            return Promise.resolve({ data: {}, error: null });
          },
          signOut: function () {
            sesion = null;
            try { localStorage.removeItem('qa_sesion'); } catch (e) {}
            oyentes.forEach(function (cb) { cb('SIGNED_OUT', null); });
            return Promise.resolve({ error: null });
          }
        }
      };
    }
  };

  // La prueba llama a esto para simular que se abre el enlace del correo.
  window.__entra = function (id, correo) {
    sesion = { user: { id: id, email: correo } };
    try { localStorage.setItem('qa_sesion', JSON.stringify(sesion)); } catch (e) {}
    oyentes.forEach(function (cb) { cb('SIGNED_IN', sesion); });
  };
})();
