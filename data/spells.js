/* ============================================================
   HECHIZOS Y MISIONES  —  sistema de magia escolar
   ------------------------------------------------------------
   GD.hechizos: hechizos aprendibles en las escuelas.
     escuela: a qué local pertenece
     costoMana, precio (en oro, al comprar tras desbloquear)
     tipo: "heal" | "buff_escudo" | "damage_arcano" | "debuff_agi" | "doT_fijo" | "drain"

   GD.quests: misiones que desbloquean hechizos.
     tipo: "kills" | "kills_zona" | "kills_enemigo" | "rest" | "visitar"
     recompensa: id de hechizo desbloqueado al completar
     requiere: id de quest que debe estar completa primero (opcional)
   ============================================================ */
window.GD = window.GD || {};

GD.hechizos = {
  // ---- ESCUELA DE LA LUZ (blanca) ----
  curar: {
    id: "curar", escuela: "escuela_blanca",
    nombre: "@@hechizos.curar.nombre",
    desc:   "@@hechizos.curar.desc",
    costoMana: 3, precio: 70,
    tipo: "heal", valorPct: 0.40,
  },
  escudo: {
    id: "escudo", escuela: "escuela_blanca",
    nombre: "@@hechizos.escudo.nombre",
    desc:   "@@hechizos.escudo.desc",
    costoMana: 2, precio: 60,
    tipo: "buff_escudo", valorPct: 0.40, turnos: 3,
  },

  // ---- ESCUELA DEL FLUJO (gris) ----
  rafaga: {
    id: "rafaga", escuela: "escuela_gris",
    nombre: "@@hechizos.rafaga.nombre",
    desc:   "@@hechizos.rafaga.desc",
    costoMana: 3, precio: 80,
    tipo: "damage_arcano", dano: 2, rango: 8,
  },
  ralentizar: {
    id: "ralentizar", escuela: "escuela_gris",
    nombre: "@@hechizos.ralentizar.nombre",
    desc:   "@@hechizos.ralentizar.desc",
    costoMana: 2, precio: 65,
    tipo: "debuff_agi", valor: -5, turnos: 3,
  },

  // ---- ESCUELA DE LAS PROFUNDIDADES (negra) ----
  drenaje: {
    id: "drenaje", escuela: "escuela_negra",
    nombre: "@@hechizos.drenaje.nombre",
    desc:   "@@hechizos.drenaje.desc",
    costoMana: 3, precio: 90,
    tipo: "drain", dano: 2, rango: 6,
  },
  entropia: {
    id: "entropia", escuela: "escuela_negra",
    nombre: "@@hechizos.entropia.nombre",
    desc:   "@@hechizos.entropia.desc",
    costoMana: 4, precio: 120,
    tipo: "doT_fijo", valorPct: 0.12, turnos: 5,
  },
};

GD.quests = {
  // ---- LUZ ----
  q_luz1: {
    id: "q_luz1", escuela: "escuela_blanca",
    nombre:  "@@quests.q_luz1.nombre",
    desc:    "@@quests.q_luz1.desc",
    tipo: "rest", cantidad: 8,
    recompensa: "curar",
  },
  q_luz2: {
    id: "q_luz2", escuela: "escuela_blanca",
    nombre:  "@@quests.q_luz2.nombre",
    desc:    "@@quests.q_luz2.desc",
    tipo: "kills", cantidad: 15,
    recompensa: "escudo",
    requiere: "q_luz1",
  },

  // ---- FLUJO ----
  q_gris1: {
    id: "q_gris1", escuela: "escuela_gris",
    nombre:  "@@quests.q_gris1.nombre",
    desc:    "@@quests.q_gris1.desc",
    tipo: "visitar", escuela: "escuela_gris", cantidad: 5,
    recompensa: "rafaga",
  },
  q_gris2: {
    id: "q_gris2", escuela: "escuela_gris",
    nombre:  "@@quests.q_gris2.nombre",
    desc:    "@@quests.q_gris2.desc",
    tipo: "kills", cantidad: 25,
    recompensa: "ralentizar",
    requiere: "q_gris1",
  },

  // ---- PROFUNDIDADES ----
  q_negra1: {
    id: "q_negra1", escuela: "escuela_negra",
    nombre:  "@@quests.q_negra1.nombre",
    desc:    "@@quests.q_negra1.desc",
    tipo: "kills_zona", zona: "paso_norte", cantidad: 15,
    recompensa: "drenaje",
  },
  q_negra2: {
    id: "q_negra2", escuela: "escuela_negra",
    nombre:  "@@quests.q_negra2.nombre",
    desc:    "@@quests.q_negra2.desc",
    tipo: "kills_enemigo", objetivo: "gigante", cantidad: 3,
    recompensa: "entropia",
    requiere: "q_negra1",
  },
};
