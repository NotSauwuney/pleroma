/* ============================================================
   PLÉROMA  —  motor base (turn-based fatfur RPG)
   Inspirado en las mecánicas de un vore-RPG de Twine/SugarCube,
   reescrito de cero, data-driven, sin dependencias.
   Textos vía i18n: t("clave") para UI, L(campo) para contenido.
   ============================================================ */
"use strict";

/* ---------- Índices de stats (claves internas, no se traducen) ---------- */
const STAT = { FUE: 0, AGI: 1, INT: 2, AGU: 3, EST: 4, TAM: 5 };
const STAT_KEYS = ["FUE", "AGI", "INT", "AGU", "EST", "TAM"];
const COSTE_FEAST = 3;   // maná que cuesta el hechizo Feast

/* Sistema de unidades para mostrar medidas (interno siempre métrico). */
GD.unidades = (function () {
  try { return localStorage.getItem("pleroma_units") || "metric"; } catch (e) { return "metric"; }
})();

/* ---------- Ajustes de cuerpo / energía / dificultad (tuneables) ---------- */
const FAT_FLOOR = 4;          // grasa mínima (esencial): el cuerpo nunca baja de acá
const EMPTY_THRESHOLD = 8;    // llenura por debajo de esto = estómago vacío
const MAX_VACIO = 20;         // acciones con estómago vacío antes del desmayo por inanición
const METAB = 1.0;            // grasa quemada por turno en ayuno
const FAT_HP_PER_KG = 0.5;    // "la masa es magia": cada kg de grasa sobre FAT_FLOOR suma vida máx (savia almacenada)
const LEAN_METAB = 0.3;       // masa magra quemada por turno en inanición profunda (fat en el piso)
const LEAN_RECOVERY = 0.15;   // masa magra recuperada por turno cuando hay comida disponible
const DIF_DANO = 1.75;        // multiplicador de daño enemigo (dificultad +75%)
const DIF_VIDA = 1.3;         // multiplicador de vida enemiga

/* ---------- Creación de personaje personalizado (tope de balance nivel 1) ---------- */
const PRESUPUESTO_CUSTOM = 64;   // total de stats repartibles (equivale a un preset de nivel 1)
const CUSTOM_MIN = 2;            // mínimo por stat
const CUSTOM_MAX = 16;           // máximo por stat

/* ---------- Cheats ----------
   Toggles persistentes en S.player.cheats (viajan en el save):
     weightless -> ninguna acción gasta stamina (ver costoMovimiento y trabajos)
     ravenous   -> nunca morís por empacho (ver comer)
     eternal    -> nunca morís por hambre ni por daño (ver resolverInanicion / resolverCombate)
   Los códigos puntuales (makemerich, makemestronger) se aplican al instante
   desde la pantalla de Cheats (engine/12_endgame.js). */
function cheatOn(k) {
  return !!(S.player && S.player.cheats && S.player.cheats[k]);
}

/* ---------- Pronombres ---------- */
// Devuelve el pronombre del jugador: "s" = sujeto, "o" = objeto, "p" = posesivo.
function pron(tipo) {
  const pr = S.player && S.player.pronombres;
  if (!pr) return tipo === "s" ? "they" : tipo === "o" ? "them" : "their";
  return pr[tipo] || "";
}

// Reemplaza {PronS} {PronO} {PronP} en un string con los pronombres del jugador.
function resolvePronTokens(text) {
  if (!S.player || !S.player.pronombres) return text;
  return text.split("{PronS}").join(pron("s"))
             .split("{PronO}").join(pron("o"))
             .split("{PronP}").join(pron("p"));
}

/* ---------- Eventos / mini-eventos / amuleto secreto ----------
   Movidos a engine/06b_events.js: son lógica de dominio (combate, items, zonas),
   no fundación. El core se queda solo con S, STAT, tunables, RNG y pronombres. */

/* ---------- Helpers de azar ---------- */
const rand = () => Math.random();
const randInt = (n) => Math.floor(Math.random() * n);
const choice = (arr) => arr[randInt(arr.length)];
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const round = Math.round;

function xdy(dados, caras) {
  let t = 0;
  for (let i = 0; i < dados; i++) t += randInt(caras) + 1;
  return t;
}
function skillTest(p, e) { return rand() * 100 <= p - e; }
function skillTestRange(p, e, min, max) { return skillTest(clamp(p - e, min, max), 0); }

// Resuelve un campo de flavor que puede ser una sola variante {es,en}
// o un ARRAY de variantes (se elige una al azar). Devuelve el texto localizado.
function flavorRand(v) { return L(Array.isArray(v) ? choice(v) : v); }

/* ============================================================
   ESTADO GLOBAL
   ============================================================ */
const S = {
  mode: "menu",       // menu | creacion | explorar | combate | tienda | muerte
  player: null,
  zona: null,
  combate: null,
  creacion: null,
  log: [],
  story: "",
  actions: [],
  screen: null,       // closure que reconstruye la vista actual (para cambio de idioma)
};

