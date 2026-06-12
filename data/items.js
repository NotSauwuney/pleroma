/* ============================================================
   OBJETOS  —  consumibles, armas, equipo
   ------------------------------------------------------------
   tipo: "comida" | "bebida" | "pocion" | "arma" | "armadura"
   Campos numéricos (llena, engorda, cura, dano...) NO se traducen.
   Campos de texto (nombre, texto, sabor) pueden ser string o {es,en}.
   ============================================================ */
window.GD = window.GD || {};

GD.items = {
  // ---- COMIDA ----
  pan: {
    id: "pan", tipo: "comida", llena: 18, cura: 4, precio: 3,
    nombre: "@@items.pan.nombre",
    sabor: "@@items.pan.sabor",
  },
  guiso: {
    id: "guiso", tipo: "comida", llena: 34, cura: 10, precio: 8,
    nombre: "@@items.guiso.nombre",
    sabor: "@@items.guiso.sabor",
  },
  pastel: {
    id: "pastel", tipo: "comida", llena: 26, engorda: 3, precio: 12,
    nombre: "@@items.pastel.nombre",
    sabor: "@@items.pastel.sabor",
  },
  festin: {
    id: "festin", tipo: "comida", llena: 70, engorda: 4, precio: 30,
    nombre: "@@items.festin.nombre",
    sabor: "@@items.festin.sabor",
  },

  // ---- COMIDA SILVESTRE (forrajeo por zona) ----
  bayas_bosque: {
    id: "bayas_bosque", tipo: "comida", llena: 12, cura: 3, precio: 5,
    nombre: "@@items.bayas_bosque.nombre",
    sabor: "@@items.bayas_bosque.sabor",
  },
  hongo_silvestre: {
    id: "hongo_silvestre", tipo: "comida", llena: 22, cura: 5, precio: 8,
    nombre: "@@items.hongo_silvestre.nombre",
    sabor: "@@items.hongo_silvestre.sabor",
  },
  raiz_pantano: {
    id: "raiz_pantano", tipo: "comida", llena: 14, precio: 3,
    nombre: "@@items.raiz_pantano.nombre",
    sabor: "@@items.raiz_pantano.sabor",
  },
  conejo_asado: {
    id: "conejo_asado", tipo: "comida", llena: 38, cura: 12, precio: 15,
    nombre: "@@items.conejo_asado.nombre",
    sabor: "@@items.conejo_asado.sabor",
  },
  fruta_silvestre: {
    id: "fruta_silvestre", tipo: "comida", llena: 16, cura: 6, precio: 6,
    nombre: "@@items.fruta_silvestre.nombre",
    sabor: "@@items.fruta_silvestre.sabor",
  },
  nuez_pino: {
    id: "nuez_pino", tipo: "comida", llena: 20, engorda: 1, precio: 7,
    nombre: "@@items.nuez_pino.nombre",
    sabor: "@@items.nuez_pino.sabor",
  },

  // ---- BEBIDA ----
  agua: {
    id: "agua", tipo: "bebida", llena: 6, stamina: 20, precio: 2,
    nombre: "@@items.agua.nombre",
    sabor: "@@items.agua.sabor",
  },
  crema: {
    id: "crema", tipo: "bebida", llena: 40, engorda: 3, precio: 15,
    nombre: "@@items.crema.nombre",
    sabor: "@@items.crema.sabor",
  },

  // ---- POCIONES ----
  pocVida: {
    id: "pocVida", tipo: "pocion", cura: 45, precio: 20,
    nombre: "@@items.pocVida.nombre",
    sabor: "@@items.pocVida.sabor",
  },
  pocMana: {
    id: "pocMana", tipo: "pocion", mana: 8, precio: 20,
    nombre: "@@items.pocMana.nombre",
    sabor: "@@items.pocMana.sabor",
  },
  digestivo: {
    id: "digestivo", tipo: "pocion", vaciar: 50, precio: 18,
    nombre: "@@items.digestivo.nombre",
    sabor: "@@items.digestivo.sabor",
  },

  // ---- ARMAS ----
  garras: {
    id: "garras", tipo: "arma", dano: 1, rango: 4, stat: "FUE", escala: 0.4, tipoDano: null, precio: 5,
    nombre: "@@items.garras.nombre",
    texto: "@@items.garras.texto",
  },
  daga: {
    id: "daga", tipo: "arma", dano: 2, rango: 4, stat: "AGI", escala: 0.6, tipoDano: "corte", precio: 25,
    mejoraRate: 0.05,
    nombre: "@@items.daga.nombre",
    texto: "@@items.daga.texto",
  },
  maza: {
    id: "maza", tipo: "arma", dano: 2, rango: 6, stat: "FUE", escala: 0.8, tipoDano: "golpe", precio: 40,
    mejoraRate: 0.06,
    nombre: "@@items.maza.nombre",
    texto: "@@items.maza.texto",
  },
  baston: {
    id: "baston", tipo: "arma", dano: 1, rango: 6, stat: "INT", escala: 0.7, tipoDano: "arcano", precio: 50,
    mejoraRate: 0.04,
    nombre: "@@items.baston.nombre",
    texto: "@@items.baston.texto",
  },

  // ---- ARMAS DE HERRERÍA (mejores, más caras) ----
  espadon: {
    id: "espadon", tipo: "arma", dano: 3, rango: 6, stat: "FUE", escala: 0.9, tipoDano: "corte", precio: 120,
    mejoraRate: 0.06,
    nombre: "@@items.espadon.nombre",
    texto: "@@items.espadon.texto",
  },
  estoque: {
    id: "estoque", tipo: "arma", dano: 3, rango: 5, stat: "AGI", escala: 0.8, tipoDano: "corte", precio: 110,
    mejoraRate: 0.05,
    nombre: "@@items.estoque.nombre",
    texto: "@@items.estoque.texto",
  },
  cetro: {
    id: "cetro", tipo: "arma", dano: 2, rango: 8, stat: "INT", escala: 0.9, tipoDano: "arcano", precio: 140,
    mejoraRate: 0.04,
    nombre: "@@items.cetro.nombre",
    texto: "@@items.cetro.texto",
  },

  // ---- ÍTEMS DE LAS ESCUELAS DE MAGIA ----
  bendicion: {
    id: "bendicion", tipo: "pocion", cura: 30, mana: 2, stamina: 15, precio: 45,
    nombre: "@@items.bendicion.nombre",
    sabor: "@@items.bendicion.sabor",
  },
  piedraViento: {
    id: "piedraViento", tipo: "pocion", stamina: 55, mana: 1, precio: 35,
    nombre: "@@items.piedraViento.nombre",
    sabor: "@@items.piedraViento.sabor",
  },
  esenciaVacia: {
    id: "esenciaVacia", tipo: "pocion", mana: 4, llena: -20, precio: 55,
    nombre: "@@items.esenciaVacia.nombre",
    sabor: "@@items.esenciaVacia.sabor",
  },

  // ---- MATERIALES DE CRAFTEO (tipo:"material") ----
  zarpa_osa: {
    id: "zarpa_osa", tipo: "material", precio: 15,
    nombre: "@@items.zarpa_osa.nombre",
    sabor: "@@items.zarpa_osa.sabor",
  },
  colmillo_lobo: {
    id: "colmillo_lobo", tipo: "material", precio: 15,
    nombre: "@@items.colmillo_lobo.nombre",
    sabor: "@@items.colmillo_lobo.sabor",
  },
  baba_pantano: {
    id: "baba_pantano", tipo: "material", precio: 15,
    nombre: "@@items.baba_pantano.nombre",
    sabor: "@@items.baba_pantano.sabor",
  },
  escama_hidra: {
    id: "escama_hidra", tipo: "material", precio: 15,
    nombre: "@@items.escama_hidra.nombre",
    sabor: "@@items.escama_hidra.sabor",
  },
  colmillo_jabali: {
    id: "colmillo_jabali", tipo: "material", precio: 15,
    nombre: "@@items.colmillo_jabali.nombre",
    sabor: "@@items.colmillo_jabali.sabor",
  },
  cuerno_toro: {
    id: "cuerno_toro", tipo: "material", precio: 15,
    nombre: "@@items.cuerno_toro.nombre",
    sabor: "@@items.cuerno_toro.sabor",
  },
  fragmento_coloso: {
    id: "fragmento_coloso", tipo: "material", precio: 15,
    nombre: "@@items.fragmento_coloso.nombre",
    sabor: "@@items.fragmento_coloso.sabor",
  },
  garra_puma: {
    id: "garra_puma", tipo: "material", precio: 15,
    nombre: "@@items.garra_puma.nombre",
    sabor: "@@items.garra_puma.sabor",
  },
  escarcha_gigante: {
    id: "escarcha_gigante", tipo: "material", precio: 15,
    nombre: "@@items.escarcha_gigante.nombre",
    sabor: "@@items.escarcha_gigante.sabor",
  },
  escama_marina: {
    id: "escama_marina", tipo: "material", precio: 18,
    nombre: "@@items.escama_marina.nombre",
    sabor: "@@items.escama_marina.sabor",
  },
  concha_calamar: {
    id: "concha_calamar", tipo: "material", precio: 22,
    nombre: "@@items.concha_calamar.nombre",
    sabor: "@@items.concha_calamar.sabor",
  },
  // Materiales raros (solo de jefes de mini-eventos, drop garantizado)
  esencia_bosque: {
    id: "esencia_bosque", tipo: "material", precio: 45,
    nombre: "@@items.esencia_bosque.nombre",
    sabor: "@@items.esencia_bosque.sabor",
  },
  nucleo_pantano: {
    id: "nucleo_pantano", tipo: "material", precio: 45,
    nombre: "@@items.nucleo_pantano.nombre",
    sabor: "@@items.nucleo_pantano.sabor",
  },
  cristal_escarcha: {
    id: "cristal_escarcha", tipo: "material", precio: 45,
    nombre: "@@items.cristal_escarcha.nombre",
    sabor: "@@items.cristal_escarcha.sabor",
  },

  // ---- INGREDIENTES DE GRANJA (recolectables en las Granjas de Solaz) ----
  huevo: {
    id: "huevo", tipo: "material", precio: 4,
    nombre: "@@items.huevo.nombre",
    sabor: "@@items.huevo.sabor",
  },
  zanahoria: {
    id: "zanahoria", tipo: "material", precio: 4,
    nombre: "@@items.zanahoria.nombre",
    sabor: "@@items.zanahoria.sabor",
  },
  nabo: {
    id: "nabo", tipo: "material", precio: 4,
    nombre: "@@items.nabo.nombre",
    sabor: "@@items.nabo.sabor",
  },
  harina: {
    id: "harina", tipo: "material", precio: 4,
    nombre: "@@items.harina.nombre",
    sabor: "@@items.harina.sabor",
  },
  manteca: {
    id: "manteca", tipo: "material", precio: 4,
    nombre: "@@items.manteca.nombre",
    sabor: "@@items.manteca.sabor",
  },
  leche_fresca: {
    id: "leche_fresca", tipo: "material", precio: 4,
    nombre: "@@items.leche_fresca.nombre",
    sabor: "@@items.leche_fresca.sabor",
  },
  miel_granja: {
    id: "miel_granja", tipo: "material", precio: 4,
    nombre: "@@items.miel_granja.nombre",
    sabor: "@@items.miel_granja.sabor",
  },
  sal: {
    id: "sal", tipo: "material", precio: 4,
    nombre: "@@items.sal.nombre",
    sabor: "@@items.sal.sabor",
  },

  // ---- MATERIALES DE ZONAS NUEVAS ----
  // Océano
  escama_abisal: {
    id: "escama_abisal", tipo: "material", precio: 28,
    nombre: "@@items.escama_abisal.nombre",
    sabor: "@@items.escama_abisal.sabor",
  },
  tentaculo_salado: {
    id: "tentaculo_salado", tipo: "material", precio: 28,
    nombre: "@@items.tentaculo_salado.nombre",
    sabor: "@@items.tentaculo_salado.sabor",
  },
  nucleo_titan: {
    id: "nucleo_titan", tipo: "material", precio: 90,
    nombre: "@@items.nucleo_titan.nombre",
    sabor: "@@items.nucleo_titan.sabor",
  },
  // Desierto
  veneno_escorpion: {
    id: "veneno_escorpion", tipo: "material", precio: 28,
    nombre: "@@items.veneno_escorpion.nombre",
    sabor: "@@items.veneno_escorpion.sabor",
  },
  escama_calor: {
    id: "escama_calor", tipo: "material", precio: 28,
    nombre: "@@items.escama_calor.nombre",
    sabor: "@@items.escama_calor.sabor",
  },
  nucleo_arenoso: {
    id: "nucleo_arenoso", tipo: "material", precio: 90,
    nombre: "@@items.nucleo_arenoso.nombre",
    sabor: "@@items.nucleo_arenoso.sabor",
  },
  // Megaflora
  savia_antigua: {
    id: "savia_antigua", tipo: "material", precio: 28,
    nombre: "@@items.savia_antigua.nombre",
    sabor: "@@items.savia_antigua.sabor",
  },
  esporo_gigante: {
    id: "esporo_gigante", tipo: "material", precio: 28,
    nombre: "@@items.esporo_gigante.nombre",
    sabor: "@@items.esporo_gigante.sabor",
  },
  corazon_bosque: {
    id: "corazon_bosque", tipo: "material", precio: 90,
    nombre: "@@items.corazon_bosque.nombre",
    sabor: "@@items.corazon_bosque.sabor",
  },
  // ---- COMIDA DE LAS ISLAS LEJANAS ----
  // Arenales de Solakh (Puesto de la Caravanera)
  datiles_melosos: {
    id: "datiles_melosos", tipo: "comida", llena: 24, engorda: 5, precio: 14,
    nombre: "@@items.datiles_melosos.nombre",
    sabor: "@@items.datiles_melosos.sabor",
  },
  estofado_dunas: {
    id: "estofado_dunas", tipo: "comida", llena: 62, cura: 14, engorda: 6, precio: 34,
    nombre: "@@items.estofado_dunas.nombre",
    sabor: "@@items.estofado_dunas.sabor",
  },
  te_cactus: {
    id: "te_cactus", tipo: "bebida", llena: 8, stamina: 45, precio: 12,
    nombre: "@@items.te_cactus.nombre",
    sabor: "@@items.te_cactus.sabor",
  },
  // Gran Manto (Nido de Raíces)
  fruto_manto: {
    id: "fruto_manto", tipo: "comida", llena: 36, cura: 10, engorda: 4, precio: 18,
    nombre: "@@items.fruto_manto.nombre",
    sabor: "@@items.fruto_manto.sabor",
  },
  nectar_esporas: {
    id: "nectar_esporas", tipo: "bebida", llena: 10, mana: 5, precio: 28,
    nombre: "@@items.nectar_esporas.nombre",
    sabor: "@@items.nectar_esporas.sabor",
  },
  hongo_relleno: {
    id: "hongo_relleno", tipo: "comida", llena: 78, engorda: 14, precio: 40,
    nombre: "@@items.hongo_relleno.nombre",
    sabor: "@@items.hongo_relleno.sabor",
  },

  // ---- MISIÓN SECRETA: EL AMULETO DE INTIMIDACIÓN ----
  // Cada isla esconde media pieza (drop único del jefe de su mini-evento).
  // Al juntar ambas mitades se funden solas (chequearAmuletoIntimidacion en
  // engine/01_core.js). Con el amuleto encima, las criaturas del Mar de las
  // Fauces no atacan el barco (ver barcoTurno en engine/06_exploration.js).
  amuleto_mitad_sol: {
    id: "amuleto_mitad_sol", tipo: "material", precio: 0,
    nombre: "@@items.amuleto_mitad_sol.nombre",
    sabor: "@@items.amuleto_mitad_sol.sabor",
  },
  amuleto_mitad_raiz: {
    id: "amuleto_mitad_raiz", tipo: "material", precio: 0,
    nombre: "@@items.amuleto_mitad_raiz.nombre",
    sabor: "@@items.amuleto_mitad_raiz.sabor",
  },
  amuleto_intimidacion: {
    id: "amuleto_intimidacion", tipo: "material", precio: 0,
    nombre: "@@items.amuleto_intimidacion.nombre",
    sabor: "@@items.amuleto_intimidacion.sabor",
  },

  // Comida del océano (pesca)
  pez_abisal: {
    id: "pez_abisal", tipo: "comida", llena: 30, cura: 8, engorda: 2, precio: 20,
    nombre: "@@items.pez_abisal.nombre",
    sabor: "@@items.pez_abisal.sabor",
  },
  calamar_ahumado: {
    id: "calamar_ahumado", tipo: "comida", llena: 45, cura: 5, engorda: 4, precio: 25,
    nombre: "@@items.calamar_ahumado.nombre",
    sabor: "@@items.calamar_ahumado.sabor",
  },

  // ---- ARMAS CRAFTABLES (forjadas en la herrería con materiales) ----
  garrote_nudoso: {
    id: "garrote_nudoso", tipo: "arma", dano: 3, rango: 6, stat: "FUE", escala: 0.85, tipoDano: "golpe", precio: 100,
    mejoraRate: 0.07, crafteable: true,
    nombre: "@@items.garrote_nudoso.nombre",
    texto: "@@items.garrote_nudoso.texto",
  },
  bastón_pantano: {
    id: "bastón_pantano", tipo: "arma", dano: 2, rango: 9, stat: "INT", escala: 0.95, tipoDano: "arcano", precio: 100,
    mejoraRate: 0.05, crafteable: true,
    nombre: "@@items.bastón_pantano.nombre",
    texto: "@@items.bastón_pantano.texto",
  },
  lanza_campo: {
    id: "lanza_campo", tipo: "arma", dano: 3, rango: 7, stat: "AGI", escala: 0.85, tipoDano: "corte", precio: 100,
    mejoraRate: 0.06, crafteable: true,
    nombre: "@@items.lanza_campo.nombre",
    texto: "@@items.lanza_campo.texto",
  },
  maza_coloso: {
    id: "maza_coloso", tipo: "arma", dano: 4, rango: 7, stat: "FUE", escala: 0.90, tipoDano: "golpe", precio: 110,
    mejoraRate: 0.07, crafteable: true,
    nombre: "@@items.maza_coloso.nombre",
    texto: "@@items.maza_coloso.texto",
    debilEnemigo: ["golpe"],
  },
  espada_escarcha: {
    id: "espada_escarcha", tipo: "arma", dano: 3, rango: 8, stat: "AGI", escala: 0.90, tipoDano: "corte", precio: 100,
    mejoraRate: 0.06, crafteable: true,
    nombre: "@@items.espada_escarcha.nombre",
    texto: "@@items.espada_escarcha.texto",
  },

  // ---- ARMAS FORANAS (tier intermedio — requieren arma crafteable + materiales de zonas nuevas) ----
  mazo_mareas: {
    id: "mazo_mareas", tipo: "arma", dano: 5, rango: 7, stat: "FUE", escala: 0.95, tipoDano: "golpe", precio: 220,
    mejoraRate: 0.05, crafteable: true,
    nombre: "@@items.mazo_mareas.nombre",
    texto: "@@items.mazo_mareas.texto",
  },
  filo_exilio: {
    id: "filo_exilio", tipo: "arma", dano: 4, rango: 9, stat: "AGI", escala: 0.95, tipoDano: "corte", precio: 220,
    mejoraRate: 0.05, crafteable: true,
    nombre: "@@items.filo_exilio.nombre",
    texto: "@@items.filo_exilio.texto",
  },
  baculo_primordial: {
    id: "baculo_primordial", tipo: "arma", dano: 3, rango: 11, stat: "INT", escala: 1.05, tipoDano: "arcano", precio: 220,
    mejoraRate: 0.04, crafteable: true,
    nombre: "@@items.baculo_primordial.nombre",
    texto: "@@items.baculo_primordial.texto",
  },

  // ---- ARMAS LEGENDARIAS (secretas) ----
  leviatan: {
    id: "leviatan", tipo: "arma", dano: 5, rango: 7, stat: "FUE", escala: 1.0, tipoDano: "golpe", precio: 320,
    mejoraRate: 0, mejorable: false,
    legendaria: true, efectoArma: "terremoto",
    nombre: "@@items.leviatan.nombre",
    texto: "@@items.leviatan.texto",
  },
  sombra_veloz: {
    id: "sombra_veloz", tipo: "arma", dano: 4, rango: 8, stat: "AGI", escala: 1.0, tipoDano: "corte", precio: 320,
    mejoraRate: 0, mejorable: false,
    legendaria: true, efectoArma: "sombra",
    nombre: "@@items.sombra_veloz.nombre",
    texto: "@@items.sombra_veloz.texto",
    statSecundario: "INT", escalaSecundaria: 0.3,
  },
  vacio_eterno: {
    id: "vacio_eterno", tipo: "arma", dano: 3, rango: 10, stat: "INT", escala: 1.1, tipoDano: "arcano", precio: 320,
    mejoraRate: 0, mejorable: false,
    legendaria: true, efectoArma: "manaRegen",
    nombre: "@@items.vacio_eterno.nombre",
    texto: "@@items.vacio_eterno.texto",
  },

  // ---- ARMADURA ----
  sinArmar: {
    id: "sinArmar", tipo: "armadura", def: 0, precio: 0,
    mejorable: false,
    nombre: "@@items.sinArmar.nombre",
    texto: "@@items.sinArmar.texto",
  },

  // --- No-mago: progresión lineal (tier 1 y 2) ---
  cuero: {
    id: "cuero", tipo: "armadura", def: 2, precio: 30,
    mejoraRateDef: 0.5, mejoraMats: { zarpa_osa: 1 },
    nombre: "@@items.cuero.nombre",
    texto: "@@items.cuero.texto",
  },
  cota: {
    id: "cota", tipo: "armadura", def: 4, precio: 70,
    mejoraRateDef: 0.5, mejoraMats: { colmillo_lobo: 1 },
    nombre: "@@items.cota.nombre",
    texto: "@@items.cota.texto",
  },

  // --- No-mago: tier 3 (tres ramas en herrería) ---
  placas: {
    // Defensiva pura: máxima reducción de daño
    id: "placas", tipo: "armadura", def: 7, precio: 180,
    mejoraRateDef: 1, mejoraMats: { fragmento_coloso: 1 },
    nombre: "@@items.placas.nombre",
    texto: "@@items.placas.texto",
  },
  armadura_brutal: {
    // Ofensiva: menos def, pero +FUE para más daño y movilidad con grasa
    id: "armadura_brutal", tipo: "armadura", def: 5, precio: 180,
    bonusFUE: 4,
    mejoraRateDef: 0.5, mejoraMats: { colmillo_jabali: 1 },
    nombre: "@@items.armadura_brutal.nombre",
    texto: "@@items.armadura_brutal.texto",
  },
  cuero_veloz: {
    // Ágil: def moderada, +AGI para esquiva y prioridad en combate
    id: "cuero_veloz", tipo: "armadura", def: 3, precio: 160,
    bonusAGI: 5,
    mejoraRateDef: 0.5, mejoraMats: { garra_puma: 1 },
    nombre: "@@items.cuero_veloz.nombre",
    texto: "@@items.cuero_veloz.texto",
  },

  // --- Mago: progresión lineal (tier 1 y 2) ---
  tunica_mago: {
    // Protección básica con sintonía arcana
    id: "tunica_mago", tipo: "armadura", def: 1, precio: 40,
    bonusINT: 2,
    mejoraRateDef: 0.5, mejoraMats: { baba_pantano: 1 },
    nombre: "@@items.tunica_mago.nombre",
    texto: "@@items.tunica_mago.texto",
  },
  manto_mago: {
    // Manto de flujo: def y maná estable
    id: "manto_mago", tipo: "armadura", def: 2, precio: 100,
    bonusINT: 4,
    mejoraRateDef: 0.5, mejoraMats: { escama_hidra: 1 },
    nombre: "@@items.manto_mago.nombre",
    texto: "@@items.manto_mago.texto",
  },

  // --- Mago: tier 3 (tres ramas en herrería) ---
  vestidura_arcana: {
    // Tanque arcano: máxima def para un mago, INT moderada
    id: "vestidura_arcana", tipo: "armadura", def: 5, precio: 240,
    bonusINT: 3,
    mejoraRateDef: 1, mejoraMats: { fragmento_coloso: 1, escama_hidra: 1 },
    nombre: "@@items.vestidura_arcana.nombre",
    texto: "@@items.vestidura_arcana.texto",
  },
  manto_arcano: {
    // Maestro arcano: INT máxima, def baja — maximiza maná y daño de hechizos
    id: "manto_arcano", tipo: "armadura", def: 1, precio: 240,
    bonusINT: 9,
    mejoraRateDef: 0.5, mejoraMats: { baba_pantano: 1, cristal_escarcha: 1 },
    nombre: "@@items.manto_arcano.nombre",
    texto: "@@items.manto_arcano.texto",
  },
  tunica_flujo: {
    // Equilibrio: INT + AGI para un mago que también se mueve
    id: "tunica_flujo", tipo: "armadura", def: 3, precio: 240,
    bonusINT: 5, bonusAGI: 3,
    mejoraRateDef: 0.5, mejoraMats: { escama_hidra: 1, garra_puma: 1 },
    nombre: "@@items.tunica_flujo.nombre",
    texto: "@@items.tunica_flujo.texto",
  },
};

/* ============================================================
   RECETAS DE FORJA  —  crafteo en herrería
   materiales: { itemId: cantidad, ... }
   requiereArma / requiereNivel: para legendarias
   secreto: la receta no se anuncia; aparece sola cuando se cumplen condiciones
   ============================================================ */
GD.recetas = {
  garrote_nudoso: {
    id: "garrote_nudoso", resultado: "garrote_nudoso",
    nombre: "@@recetas.garrote_nudoso.nombre",
    materiales: { zarpa_osa: 2, colmillo_lobo: 1 },
  },
  bastón_pantano: {
    id: "bastón_pantano", resultado: "bastón_pantano",
    nombre: "@@recetas.bastón_pantano.nombre",
    materiales: { baba_pantano: 2, escama_hidra: 1 },
  },
  lanza_campo: {
    id: "lanza_campo", resultado: "lanza_campo",
    nombre: "@@recetas.lanza_campo.nombre",
    materiales: { colmillo_jabali: 2, cuerno_toro: 1 },
  },
  maza_coloso: {
    id: "maza_coloso", resultado: "maza_coloso",
    nombre: "@@recetas.maza_coloso.nombre",
    materiales: { fragmento_coloso: 2, zarpa_osa: 1 },
  },
  espada_escarcha: {
    id: "espada_escarcha", resultado: "espada_escarcha",
    nombre: "@@recetas.espada_escarcha.nombre",
    materiales: { escarcha_gigante: 2, garra_puma: 1 },
  },
  // ---- RECETAS DE ARMAS FORANAS (tier intermedio) ----
  mazo_mareas: {
    id: "mazo_mareas", resultado: "mazo_mareas",
    nombre: "@@recetas.mazo_mareas.nombre",
    requiereArma: "garrote_nudoso", requiereNivel: 10,
    materiales: { tentaculo_salado: 2, escama_abisal: 1 },
  },
  filo_exilio: {
    id: "filo_exilio", resultado: "filo_exilio",
    nombre: "@@recetas.filo_exilio.nombre",
    requiereArma: "lanza_campo", requiereNivel: 10,
    materiales: { veneno_escorpion: 2, escama_calor: 1 },
  },
  baculo_primordial: {
    id: "baculo_primordial", resultado: "baculo_primordial",
    nombre: "@@recetas.baculo_primordial.nombre",
    requiereArma: "bastón_pantano", requiereNivel: 10,
    materiales: { savia_antigua: 2, esporo_gigante: 1 },
  },

  // ---- RECETAS LEGENDARIAS (requieren arma forana al máximo + materiales de jefes) ----
  // ⚠ requiereNivel debe ser <= 10: la mejora de armas capea en nivel 10
  // (mejorarArma en engine/09_npcwg.js). Con 14 eran literalmente inalcanzables.
  leviatan: {
    id: "leviatan", resultado: "leviatan", secreto: true,
    nombre: "@@recetas.leviatan.nombre",
    requiereArma: "mazo_mareas", requiereNivel: 10,
    materiales: { nucleo_titan: 1, fragmento_coloso: 1, esencia_bosque: 1 },
  },
  sombra_veloz: {
    id: "sombra_veloz", resultado: "sombra_veloz", secreto: true,
    nombre: "@@recetas.sombra_veloz.nombre",
    requiereArma: "filo_exilio", requiereNivel: 10,
    materiales: { nucleo_arenoso: 1, garra_puma: 1, nucleo_pantano: 1 },
  },
  vacio_eterno: {
    id: "vacio_eterno", resultado: "vacio_eterno", secreto: true,
    nombre: "@@recetas.vacio_eterno.nombre",
    requiereArma: "baculo_primordial", requiereNivel: 10,
    materiales: { corazon_bosque: 1, cristal_escarcha: 1, nucleo_pantano: 1 },
  },

  // ---- RECETAS DE ARMADURAS TIER 3 ----
  placas: {
    id: "placas", resultado: "placas",
    nombre: "@@recetas.placas.nombre",
    materiales: { fragmento_coloso: 2, cuerno_toro: 1 },
  },
  armadura_brutal: {
    id: "armadura_brutal", resultado: "armadura_brutal",
    nombre: "@@recetas.armadura_brutal.nombre",
    materiales: { colmillo_jabali: 2, zarpa_osa: 2 },
  },
  cuero_veloz: {
    id: "cuero_veloz", resultado: "cuero_veloz",
    nombre: "@@recetas.cuero_veloz.nombre",
    materiales: { garra_puma: 2, colmillo_lobo: 1 },
  },
  vestidura_arcana: {
    id: "vestidura_arcana", resultado: "vestidura_arcana",
    nombre: "@@recetas.vestidura_arcana.nombre",
    materiales: { fragmento_coloso: 1, escama_hidra: 2, nucleo_pantano: 1 },
  },
  manto_arcano: {
    id: "manto_arcano", resultado: "manto_arcano",
    nombre: "@@recetas.manto_arcano.nombre",
    materiales: { baba_pantano: 2, cristal_escarcha: 2 },
  },
  tunica_flujo: {
    id: "tunica_flujo", resultado: "tunica_flujo",
    nombre: "@@recetas.tunica_flujo.nombre",
    materiales: { escama_hidra: 1, garra_puma: 2, escarcha_gigante: 1 },
  },
};

/* ============================================================
   RECETAS DE COCINA  —  fogón de las Granjas de Solaz
   ingredientes: { itemId: cantidad, ... }
   resultado: objeto-ítem completo (se guarda inline en el inventario,
              igual que la comida de Feast). tipo siempre "comida".
   ============================================================ */
GD.recetasCocina = {

  sopa_raices: {
    id: "sopa_raices",
    nombre: "@@recetasCocina.sopa_raices.nombre",
    ingredientes: { zanahoria: 2, nabo: 1 },
    resultado: {
      id: "cocina_sopa_raices", tipo: "comida", llena: 42, cura: 14,
      nombre: "@@recetasCocina.sopa_raices.resultado.nombre",
      sabor: "@@recetasCocina.sopa_raices.resultado.sabor",
    },
  },

  pan_campo: {
    id: "pan_campo",
    nombre: "@@recetasCocina.pan_campo.nombre",
    ingredientes: { harina: 2 },
    resultado: {
      id: "cocina_pan_campo", tipo: "comida", llena: 32, cura: 8, engorda: 1,
      nombre: "@@recetasCocina.pan_campo.resultado.nombre",
      sabor: "@@recetasCocina.pan_campo.resultado.sabor",
    },
  },

  torta_miel: {
    id: "torta_miel",
    nombre: "@@recetasCocina.torta_miel.nombre",
    ingredientes: { harina: 1, huevo: 1, miel_granja: 1 },
    resultado: {
      id: "cocina_torta_miel", tipo: "comida", llena: 48, engorda: 7,
      nombre: "@@recetasCocina.torta_miel.resultado.nombre",
      sabor: "@@recetasCocina.torta_miel.resultado.sabor",
    },
  },

  natilla: {
    id: "natilla",
    nombre: "@@recetasCocina.natilla.nombre",
    ingredientes: { huevo: 2, leche_fresca: 1 },
    resultado: {
      id: "cocina_natilla", tipo: "comida", llena: 40, cura: 10, engorda: 6,
      nombre: "@@recetasCocina.natilla.resultado.nombre",
      sabor: "@@recetasCocina.natilla.resultado.sabor",
    },
  },

  guiso_granja: {
    id: "guiso_granja",
    nombre: "@@recetasCocina.guiso_granja.nombre",
    ingredientes: { zanahoria: 1, nabo: 1, manteca: 1, sal: 1 },
    resultado: {
      id: "cocina_guiso_granja", tipo: "comida", llena: 58, cura: 16, engorda: 3,
      nombre: "@@recetasCocina.guiso_granja.resultado.nombre",
      sabor: "@@recetasCocina.guiso_granja.resultado.sabor",
    },
  },

  budin_manteca: {
    id: "budin_manteca",
    nombre: "@@recetasCocina.budin_manteca.nombre",
    ingredientes: { harina: 1, manteca: 2, huevo: 1 },
    resultado: {
      id: "cocina_budin_manteca", tipo: "comida", llena: 52, engorda: 12,
      nombre: "@@recetasCocina.budin_manteca.resultado.nombre",
      sabor: "@@recetasCocina.budin_manteca.resultado.sabor",
    },
  },

  festin_cosecha: {
    id: "festin_cosecha",
    nombre: "@@recetasCocina.festin_cosecha.nombre",
    ingredientes: { zanahoria: 1, nabo: 1, harina: 1, huevo: 1, miel_granja: 1, manteca: 1 },
    resultado: {
      id: "cocina_festin_cosecha", tipo: "comida", llena: 88, cura: 12, engorda: 10,
      nombre: "@@recetasCocina.festin_cosecha.resultado.nombre",
      sabor: "@@recetasCocina.festin_cosecha.resultado.sabor",
    },
  },

  gloria_glotona: {
    id: "gloria_glotona",
    nombre: "@@recetasCocina.gloria_glotona.nombre",
    ingredientes: { harina: 2, huevo: 2, leche_fresca: 1, manteca: 2, miel_granja: 2 },
    resultado: {
      id: "cocina_gloria_glotona", tipo: "comida", llena: 130, engorda: 22, cura: 8,
      nombre: "@@recetasCocina.gloria_glotona.resultado.nombre",
      sabor: "@@recetasCocina.gloria_glotona.resultado.sabor",
    },
  },

};
