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

/* ---------- Eventos aleatorios ---------- */
const EVENT_INTERVAL = 5;   // acciones entre eventos

// Incrementa el contador; devuelve true cuando toca disparar un evento.
function tickEvento() {
  const p = S.player;
  p.accionesDesdeEvento = (p.accionesDesdeEvento || 0) + 1;
  if (p.accionesDesdeEvento >= EVENT_INTERVAL) {
    p.accionesDesdeEvento = 0;
    return true;
  }
  return false;
}

// Muestra un evento aleatorio (mini-evento o flavor). Devuelve true si disparó algo.
function eventoAleatorio() {
  const z = GD.world.zonas[S.zona];
  if (!z) return false;

  // 30% de chance de intentar mini-evento si hay disponibles en esta zona
  if (GD.miniEventos && rand() < 0.30) {
    const disponibles = Object.values(GD.miniEventos).filter((me) => me.zona === S.zona);
    if (disponibles.length) {
      const me = choice(disponibles);
      iniciarMiniEvento(me.id);
      return true;
    }
  }

  if (!z.eventos || !z.eventos.length) return false;
  const ev = choice(z.eventos);
  const texto = resolvePronTokens(L(ev));
  S.screen = mostrarZona;
  S.story = `<h2>${L(z.nombre)}</h2><p class="evento">${texto}</p>`;
  setActions([{ label: t("ui.continue"), cls: "primary", fn: mostrarZona }]);
  return true;
}

/* ============================================================
   MINI-EVENTOS ENCADENADOS
   ============================================================ */
function iniciarMiniEvento(id) {
  const me = GD.miniEventos[id];
  if (!me) return;
  S.miniEvento = { id, paso: 0 };

  const mostrarIntro = () => {
    S.screen = mostrarIntro;
    S.story = `<h2>✦ ${t("event.special")}</h2><p>${L(me.intro)}</p>`;
    if (me.forzado) {
      setActions([{ label: t("ui.continue"), cls: "primary", fn: () => avanzarMiniEvento() }]);
    } else {
      setActions([
        { label: L(me.opcionEntrar), cls: "primary", fn: () => avanzarMiniEvento() },
        { label: L(me.opcionIgnorar), fn: () => { S.miniEvento = null; mostrarZona(); } },
      ]);
    }
  };
  mostrarIntro();
}

function avanzarMiniEvento() {
  const me = GD.miniEventos[S.miniEvento.id];
  const paso = me.pasos[S.miniEvento.paso];
  if (!paso) { finalizarMiniEvento(); return; }
  S.miniEvento.paso++;

  if (paso.tipo === "texto") {
    const txt = L(paso.texto);
    S.screen = () => {
      S.story = `<p>${txt}</p>`;
      setActions([{ label: t("ui.continue"), cls: "primary", fn: () => avanzarMiniEvento() }]);
    };
    S.screen();
  } else if (paso.tipo === "combate") {
    iniciarCombate(paso.enemyId);
    // victoriaCombate() detecta S.miniEvento y llama avanzarMiniEvento() al ganar
  }
}

function finalizarMiniEvento() {
  const me = GD.miniEventos[S.miniEvento.id];

  // Drops garantizados del mini-evento.
  // d.unico: no se vuelve a otorgar si ya lo tenés (o si ya forjaste el Amuleto
  // de Intimidación, para las mitades de la misión secreta de las islas).
  if (me.drops && me.drops.length) {
    me.drops.forEach((d) => {
      if (d.unico && (tieneItem(d.id) || S.player.amuletoForjado)) return;
      darItem(d.id, d.cant || 1);
      const it = GD.items[d.id];
      if (it) log(t("drop.got", { item: L(it.nombre) }), "bien");
    });
  }
  chequearAmuletoIntimidacion();

  S.miniEvento = null;
  const textoFin = me.textoFin ? L(me.textoFin) : "";
  const pintar = () => {
    S.story = `<h2>✦ ${t("event.complete")}</h2>${textoFin ? `<p>${textoFin}</p>` : ""}`;
    setActions([{ label: t("ui.continue"), cls: "primary", fn: () => entrarZona(S.zona) }]);
  };
  S.screen = pintar; pintar();
}

/* ---------- Misión secreta: el Amuleto de Intimidación ----------
   Cada isla lejana esconde media pieza (jefe de su mini-evento). Al juntar las
   dos mitades se funden solas en el Amuleto de Intimidación: las criaturas del
   Mar de las Fauces no se atreven a atacar el barco (ver barcoTurno). */
function chequearAmuletoIntimidacion() {
  const p = S.player;
  if (!p || p.amuletoForjado) return;
  if (tieneItem("amuleto_mitad_sol") && tieneItem("amuleto_mitad_raiz")) {
    quitarItem("amuleto_mitad_sol");
    quitarItem("amuleto_mitad_raiz");
    darItem("amuleto_intimidacion", 1);
    p.amuletoForjado = true;
    log(t("amuleto.forjado"), "bien");
  }
}

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

