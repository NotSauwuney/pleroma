/* ============================================================
   CUERPOS  —  estados de peso (enemigos) + estados del jugador
   ------------------------------------------------------------
   Ver CLAUDE.md (en esta carpeta) para la guía de estilo y la
   autorización de libertad creativa en descripción corporal.

   GD.pesos         -> 8 estados que puede tomar un enemigo.
                       Cada uno modifica stats + trae su descripción.
   GD.estadosJugador-> 19 estados del jugador para "Chequear estado"
                       (3 ripped + 16 de grasa; los últimos 4 —coloso,
                       leviatan, monumento, singularidad— son PURAMENTE
                       estéticos y heredan el tope de inmovilidad de 'ultra').
                       La selección está en engine/02_body.js
                       (estadoCuerpoJugador); acá vive el texto.

   Modificadores de enemigo:
     statMod  -> deltas a [FUE,AGI,INT,AGU,EST,TAM] (más gordo = +AGU/-AGI, etc.)
     vidaMult -> multiplicador de vida máxima
     masaMult -> multiplicador de masa (cuánto te llena al devorar/Feastear)
   ============================================================ */
window.GD = window.GD || {};

/* ---------------- ESTADOS DE PESO DE ENEMIGO (8) ---------------- */
GD.pesos = {
  // --- Eje grasa (6) ---
  flaco: {
    id: "flaco", label: "@@pesos.flaco.label",
    statMod: { FUE: -1, AGI: 2, AGU: -1 }, vidaMult: 0.85, masaMult: 0.6,
    desc: "@@pesos.flaco.desc",
  },
  promedio: {
    id: "promedio", label: "@@pesos.promedio.label",
    statMod: {}, vidaMult: 1, masaMult: 1,
    desc: "@@pesos.promedio.desc",
  },
  rellenito: {
    id: "rellenito", label: "@@pesos.rellenito.label",
    statMod: { AGI: -1, AGU: 1 }, vidaMult: 1.15, masaMult: 1.35,
    desc: "@@pesos.rellenito.desc",
  },
  gordo: {
    id: "gordo", label: "@@pesos.gordo.label",
    statMod: { FUE: 1, AGI: -2, AGU: 2 }, vidaMult: 1.45, masaMult: 1.8,
    desc: "@@pesos.gordo.desc",
  },
  obeso: {
    id: "obeso", label: "@@pesos.obeso.label",
    statMod: { FUE: 1, AGI: -4, AGU: 3 }, vidaMult: 1.9, masaMult: 2.4,
    desc: "@@pesos.obeso.desc",
  },
  ultraObeso: {
    id: "ultraObeso", label: "@@pesos.ultraObeso.label",
    statMod: { AGI: -6, AGU: 5 }, vidaMult: 2.5, masaMult: 3.3,
    desc: "@@pesos.ultraObeso.desc",
  },
  // --- Eje músculo (2) ---
  fornido: {
    id: "fornido", label: "@@pesos.fornido.label",
    statMod: { FUE: 3, AGU: 2 }, vidaMult: 1.4, masaMult: 1.3,
    desc: "@@pesos.fornido.desc",
  },
  hipermusculoso: {
    id: "hipermusculoso", label: "@@pesos.hipermusculoso.label",
    statMod: { FUE: 6, AGU: 3, AGI: -1 }, vidaMult: 1.9, masaMult: 1.8,
    desc: "@@pesos.hipermusculoso.desc",
  },
};

/* ---------------- ESTADOS DEL JUGADOR (15) ---------------- */
/* La lógica de selección está en engine/02_body.js: estadoCuerpoJugador().
   Acá solo el texto (label + descripción en 2ª persona). */
GD.estadosJugador = {
  // --- Ripped: grasa baja + fuerza alta (3) ---
  ripped1: {
    label: "@@estadosJugador.ripped1.label",
    desc: "@@estadosJugador.ripped1.desc",
  },
  ripped2: {
    label: "@@estadosJugador.ripped2.label",
    desc: "@@estadosJugador.ripped2.desc",
  },
  ripped3: {
    label: "@@estadosJugador.ripped3.label",
    desc: "@@estadosJugador.ripped3.desc",
  },
  // --- Eje grasa: 12 niveles, de desnutrido a ultra ---
  desnutrido: {
    label: "@@estadosJugador.desnutrido.label",
    desc: "@@estadosJugador.desnutrido.desc",
  },
  flaco: {
    label: "@@estadosJugador.flaco.label",
    desc: "@@estadosJugador.flaco.desc",
  },
  esbelto: {
    label: "@@estadosJugador.esbelto.label",
    desc: "@@estadosJugador.esbelto.desc",
  },
  promedio: {
    label: "@@estadosJugador.promedio.label",
    desc: "@@estadosJugador.promedio.desc",
  },
  blando: {
    label: "@@estadosJugador.blando.label",
    desc: "@@estadosJugador.blando.desc",
  },
  rellenito: {
    label: "@@estadosJugador.rellenito.label",
    desc: "@@estadosJugador.rellenito.desc",
  },
  gordo: {
    label: "@@estadosJugador.gordo.label",
    desc: "@@estadosJugador.gordo.desc",
  },
  muyGordo: {
    label: "@@estadosJugador.muyGordo.label",
    desc: "@@estadosJugador.muyGordo.desc",
  },
  obeso: {
    label: "@@estadosJugador.obeso.label",
    desc: "@@estadosJugador.obeso.desc",
  },
  morbido: {
    label: "@@estadosJugador.morbido.label",
    desc: "@@estadosJugador.morbido.desc",
  },
  super: {
    label: "@@estadosJugador.super.label",
    desc: "@@estadosJugador.super.desc",
  },
  ultra: {
    label: "@@estadosJugador.ultra.label",
    desc: "@@estadosJugador.ultra.desc",
  },

  /* --- 4 estados PURAMENTE ESTÉTICOS, más allá de 'ultra' ---
     No traen mecánicas nuevas: heredan el tope de inmovilidad de 'ultra'
     (el límite real lo imponen costoMovimiento/semiInmovil/inmovil según
     fat+stamina+FUE, no el nombre del estado). Solo describen MÁS masa.
     Selección por IMC en engine/02_body.js: estadoCuerpoJugador(). */
  coloso: {
    label: "@@estadosJugador.coloso.label",
    desc: "@@estadosJugador.coloso.desc",
  },
  leviatan: {
    label: "@@estadosJugador.leviatan.label",
    desc: "@@estadosJugador.leviatan.desc",
  },
  monumento: {
    label: "@@estadosJugador.monumento.label",
    desc: "@@estadosJugador.monumento.desc",
  },
  singularidad: {
    label: "@@estadosJugador.singularidad.label",
    desc: "@@estadosJugador.singularidad.desc",
  },
};
