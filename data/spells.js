/* ============================================================
   HECHIZOS Y MISIONES  —  sistema de magia escolar
   ------------------------------------------------------------
   GD.hechizos: hechizos aprendibles en las escuelas.
     escuela: a qué local pertenece
     costoMana, precio (en oro, al comprar tras desbloquear)
     tipo: "heal" | "buff_escudo" | "damage_arcano" | "debuff_agi" | "doT_fijo" | "drain" | "feast"

   GD.quests: misiones que desbloquean hechizos.
     tipo: "kills" | "kills_zona" | "kills_enemigo" | "rest" | "visitar"
         | "devorar" | "devorar_enemigo" | "grapple_survive" | "meals"
         | "reach_weight" | "times_obese"
     - Los tipos contador (devorar, grapple_survive, meals, devorar_enemigo) suman
       progreso de a uno, igual que "kills"/"kills_zona"/"kills_enemigo".
     - Los tipos de umbral (reach_weight, times_obese) llevan un campo `umbral`
       (valor numérico) y se completan apenas `opts.valor >= q.umbral`, sin
       requerir progreso incremental — pensados para Tradición de la Plenitud
       ("alcanzar tal peso", "haber sido obeso N veces").
     recompensa: id de hechizo desbloqueado al completar
     requiere: id de quest que debe estar completa primero (opcional)

   GD.logros: desbloqueos legendarios narrativos, ligados a player.lifetimeStats.
     condicion: { stat: <clave de lifetimeStats>, umbral: <número> }
     recompensa: { tipo: "spell" | "item" | "titulo", id: <string> }
     Se evalúan vía tickLogro(stat, valor) — ver engine/10_magic_quests.js.
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

  // ---- LEGENDARIO — Tradición de la Plenitud ----
  // Antes vivía hardcodeado en combate (COSTE_FEAST + tipo:"feast" en accion()).
  // Ahora es una entrada formal del sistema de hechizos: el chequeo de habilidad
  // y el costo de maná pasan a resolverse vía lanzarHechizo() como cualquier otro.
  // costoMana debe coincidir con COSTE_FEAST (engine/01_core.js): data/ se carga
  // antes que engine/, así que no podemos referenciar la const directamente acá;
  // si cambia COSTE_FEAST, actualizar también este valor.
  feast: {
    id: "feast", escuela: "escuela_negra",
    nombre: "@@hechizos.feast.nombre",
    desc:   "@@hechizos.feast.desc",
    costoMana: 3, precio: null, // legendario: no se compra, se desbloquea narrativamente
    tipo: "feast", legendario: true,
  },

  // ---- Técnicas de Devorar  —  Tradición de la Plenitud ----
  // Tipo "tecnica_devorar": no se lanza desde el menú de magia (filtrado en abrirMagia).
  // Se desbloquean vía quest y logro; el motor las registra en p.spells como los legendarios.
  absorcion: {
    id: "absorcion", escuela: "escuela_plenitud",
    nombre: "@@hechizos.absorcion.nombre",
    desc:   "@@hechizos.absorcion.desc",
    costoMana: 0, precio: null,
    tipo: "tecnica_devorar", legendario: true, sinMenu: true,
  },

  // ---- EVOLUCIONES de hechizos clásicos (un tier) ----
  // Se desbloquean en la tienda de su escuela una vez que el jugador ya aprendió el hechizo base.
  // Campo upgradeDe: id del hechizo base requerido.
  // costoEvolucion: oro adicional al precio (se suma al precio del base para la evolución).
  // El hechizo base NO se reemplaza en p.spells: ambos conviven, pero abrirMagia solo
  // muestra el evolucionado si el jugador tiene los dos (oculta el base superado).

  curar_mayor: {
    id: "curar_mayor", escuela: "escuela_blanca",
    nombre: "@@hechizos.curar_mayor.nombre",
    desc:   "@@hechizos.curar_mayor.desc",
    costoMana: 4, precio: 110,
    tipo: "heal", valorPct: 0.70,
    upgradeDe: "curar",
  },
  escudo_mayor: {
    id: "escudo_mayor", escuela: "escuela_blanca",
    nombre: "@@hechizos.escudo_mayor.nombre",
    desc:   "@@hechizos.escudo_mayor.desc",
    costoMana: 3, precio: 100,
    tipo: "buff_escudo", valorPct: 0.60, turnos: 5,
    upgradeDe: "escudo",
  },

  rafaga_mayor: {
    id: "rafaga_mayor", escuela: "escuela_gris",
    nombre: "@@hechizos.rafaga_mayor.nombre",
    desc:   "@@hechizos.rafaga_mayor.desc",
    costoMana: 5, precio: 130,
    tipo: "damage_arcano", dano: 4, rango: 8,
    upgradeDe: "rafaga",
  },
  ralentizar_mayor: {
    id: "ralentizar_mayor", escuela: "escuela_gris",
    nombre: "@@hechizos.ralentizar_mayor.nombre",
    desc:   "@@hechizos.ralentizar_mayor.desc",
    costoMana: 3, precio: 110,
    tipo: "debuff_agi", valor: -10, turnos: 5,
    upgradeDe: "ralentizar",
  },

  drenaje_mayor: {
    id: "drenaje_mayor", escuela: "escuela_negra",
    nombre: "@@hechizos.drenaje_mayor.nombre",
    desc:   "@@hechizos.drenaje_mayor.desc",
    costoMana: 5, precio: 150,
    tipo: "drain", dano: 4, rango: 6, drainPct: 0.70,
    upgradeDe: "drenaje",
  },
  entropia_mayor: {
    id: "entropia_mayor", escuela: "escuela_negra",
    nombre: "@@hechizos.entropia_mayor.nombre",
    desc:   "@@hechizos.entropia_mayor.desc",
    costoMana: 6, precio: 180,
    tipo: "doT_fijo", valorPct: 0.18, turnos: 7,
    upgradeDe: "entropia",
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

  // ---- TRADICIÓN DE LA PLENITUD (placeholder — infraestructura lista, contenido a definir) ----
  // Estas entradas existen para validar los nuevos tipos de condición end-to-end
  // (devorar, grapple_survive, meals, reach_weight, times_obese). El diseño narrativo
  // final (escuela/NPC/zona, redacción, valores de cantidad/umbral) queda abierto;
  // por ahora apuntan a "feast" como recompensa simbólica del cierre de Acto III.
  // q_absorcion: primer escalón — desbloqueá la técnica Absorción (20 devours)
  q_absorcion: {
    id: "q_absorcion", escuela: "escuela_plenitud",
    nombre:  "@@quests.q_absorcion.nombre",
    desc:    "@@quests.q_absorcion.desc",
    tipo: "devorar", cantidad: 20,
    recompensa: "absorcion",
  },
  q_plenitud2: {
    id: "q_plenitud2", escuela: "escuela_plenitud",
    nombre:  "@@quests.q_plenitud2.nombre",
    desc:    "@@quests.q_plenitud2.desc",
    tipo: "grapple_survive", cantidad: 5,
    recompensa: null, // escalón narrativo — Feast se otorga al completar q_plenitud3
    requiere: "q_absorcion",
  },
  q_plenitud3: {
    id: "q_plenitud3", escuela: "escuela_plenitud",
    nombre:  "@@quests.q_plenitud3.nombre",
    desc:    "@@quests.q_plenitud3.desc",
    tipo: "times_obese", umbral: 3, cantidad: 1,
    recompensa: "feast",
    requiere: "q_plenitud2",
  },
};

/* ============================================================
   LOGROS LEGENDARIOS  —  desbloqueos narrativos por comportamiento sostenido
   ------------------------------------------------------------
   No dependen de comprar/subir nivel: se evalúan automáticamente cada vez que
   cambia la estadística histórica relevante, vía tickLogro(stat, valor) en
   engine/10_magic_quests.js. Cada uno se dispara una sola vez (queda registrado
   en player.logros[id] = true).

   condicion: { stat: <clave de player.lifetimeStats>, umbral: <número> }
   recompensa: { tipo: "spell" | "titulo", id: <string> }
   ============================================================ */
GD.logros = {
  // Devorar 50 enemigos demuestra, en los hechos, la comprensión que Feast exige.
  // (Vía alternativa de acceso a Feast además de la progresión q_plenitud — un
  // jugador que vive el kink del devorar puede "ganárselo" sin pasar por las quests.)
  tradicionPlenitud: {
    id: "tradicionPlenitud",
    nombre: "@@logro.tradicionPlenitud.nombre",
    desc:   "@@logro.tradicionPlenitud.desc",
    condicion: { stat: "enemiesDevoured", umbral: 50 },
    recompensa: { tipo: "spell", id: "feast" },
  },
  // Puramente narrativo: un título/reconocimiento por haber alcanzado masa extrema.
  // No otorga hechizo — referencia para futuros desbloqueos cosméticos/de título.
  cuerpoVasto: {
    id: "cuerpoVasto",
    nombre: "@@logro.cuerpoVasto.nombre",
    desc:   "@@logro.cuerpoVasto.desc",
    condicion: { stat: "highestFat", umbral: 400 },
    recompensa: { tipo: "titulo", id: "cuerpoVasto" },
  },
};
