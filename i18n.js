/* ============================================================
   i18n  —  capa de localización
   ------------------------------------------------------------
   UN archivo por idioma (data/lang/<código>.js) contiene TODO:
     1) STRINGS DE UI       -> GD.i18n.<código>   · se leen con t("clave")
     2) CONTENIDO del mundo -> GD.content.<código> · se leen con L(ref)
        (nombres, descripciones, flavor de enemigos, ítems, zonas, NPCs...)

   Los data files (data/*.js) ya NO contienen texto: solo lógica y
   REFERENCIAS de contenido con el formato "@@ruta.del.dato". L() las
   resuelve contra GD.content del idioma activo, con respaldo en->es.
   Así, traducir el juego entero = editar UN solo archivo de idioma.
   Ver LANG.md.
   ============================================================ */
window.GD = window.GD || {};
GD.i18n = GD.i18n || {};
GD.content = GD.content || {};

/* Idioma activo. Se inicializa desde localStorage o cae a 'es'. */
GD.lang = (function () {
  try {
    var saved = localStorage.getItem("pleroma_lang");
    if (saved && GD.i18n[saved]) return saved;
  } catch (e) {}
  return GD.i18n.es ? "es" : Object.keys(GD.i18n)[0];
})();

/* Traduce una clave de UI. Rellena {huecos} con `vars`.
   Orden de respaldo: idioma activo -> en -> es -> la propia clave. */
function t(key, vars) {
  var lang = GD.lang || "es";
  var s = GD.i18n[lang] && GD.i18n[lang][key];
  if (s == null) s = GD.i18n.en && GD.i18n.en[key];
  if (s == null) s = GD.i18n.es && GD.i18n.es[key];
  if (s == null) return key;            // clave sin traducir -> visible, fácil de detectar
  if (vars) {
    for (var k in vars) {
      s = s.split("{" + k + "}").join(vars[k]);
    }
  }
  return s;
}

/* Resuelve una REFERENCIA de contenido "@@ruta" contra GD.content.
   Respaldo: idioma activo -> en -> es -> la propia referencia (visible). */
function Lc(ref, code) {
  var key = ref.slice(2);                // saca el prefijo "@@"
  var lang = code || GD.lang || "es";
  var v = GD.content[lang] && GD.content[lang][key];
  if (v == null) v = GD.content.en && GD.content.en[key];
  if (v == null) v = GD.content.es && GD.content.es[key];
  return v == null ? ref : v;            // si falta, mostramos la referencia cruda
}

/* Resuelve un campo de CONTENIDO localizable. Acepta:
     · una REFERENCIA "@@ruta"          -> la resuelve vía GD.content
     · un objeto {es,en,...} (legacy)   -> saves viejos y comida conjurada
     · cualquier otro valor             -> se devuelve tal cual */
function L(v, code) {
  if (typeof v === "string") {
    if (v.charCodeAt(0) === 64 && v.charCodeAt(1) === 64) return Lc(v, code); // "@@"
    return v;
  }
  if (v && typeof v === "object" && !Array.isArray(v)) {
    var lang = code || GD.lang || "es";
    if (v[lang] != null) return v[lang];
    if (v.en != null) return v.en;
    if (v.es != null) return v.es;
    var keys = Object.keys(v);
    return keys.length ? v[keys[0]] : "";
  }
  return v;
}

/* Genera un texto en TODOS los idiomas cargados, devolviendo un objeto
   {es:"...", en:"..."} apto para guardarse como contenido localizable.
   `makeVars(code)` arma los {huecos} para cada idioma. Lo usa Feast para
   que la comida conjurada quede bilingüe sin importar el idioma activo. */
function tAll(key, makeVars) {
  var out = {};
  var saved = GD.lang;
  langList().forEach(function (code) {
    GD.lang = code;
    out[code] = t(key, makeVars ? makeVars(code) : undefined);
  });
  GD.lang = saved;
  return out;
}

/* Lista de códigos de idioma disponibles (deriva de los archivos cargados). */
function langList() { return Object.keys(GD.i18n); }

/* Nombre legible de un idioma para el selector. */
function langName(code) {
  return (GD.i18n[code] && GD.i18n[code]._langName) || code;
}

/* Cambia el idioma activo y re-dibuja la pantalla actual. */
function setLang(code) {
  if (!GD.i18n[code]) return;
  GD.lang = code;
  try { localStorage.setItem("pleroma_lang", code); } catch (e) {}
  if (typeof S !== "undefined" && S.screen) {
    S.screen();   // re-construye la vista actual (incluye render() + re-attachment de listeners)
  } else if (typeof render === "function") {
    render();
  }
}

/* ------------------------------------------------------------
   SUBIR UN IDIOMA EN CALIENTE (sin tocar archivos del juego)
   ------------------------------------------------------------
   Recibe el TEXTO de un archivo de idioma (mismo formato que
   data/lang/en.js: define GD.i18n.<código> y, opcional, GD.content.<código>).
   Lo ejecuta de forma aislada sobre el MISMO GD global, valida que tenga
   _langName, y registra el/los idioma(s) nuevo(s) para esta sesión.
   Devuelve:  { ok:true, codes:[...] }  o  { ok:false, error:"..." }
   ------------------------------------------------------------ */
function loadLangFromText(text) {
  var before = {};
  langList().forEach(function (c) { before[c] = true; });
  try {
    var fn = new Function("GD", "window", text + "\n;return true;");
    fn(GD, (typeof window !== "undefined" ? window : {}));
  } catch (e) {
    return { ok: false, error: "El archivo tiene un error de sintaxis: " + e.message };
  }
  var nuevos = langList().filter(function (c) { return !before[c]; });
  if (!nuevos.length) {
    return { ok: false, error: "No se detectó ningún idioma nuevo. ¿El archivo define GD.i18n.<código> con un código que no exista ya?" };
  }
  for (var i = 0; i < nuevos.length; i++) {
    if (!GD.i18n[nuevos[i]] || !GD.i18n[nuevos[i]]._langName) {
      return { ok: false, error: "Al idioma '" + nuevos[i] + "' le falta la clave _langName." };
    }
  }
  return { ok: true, codes: nuevos };
}
