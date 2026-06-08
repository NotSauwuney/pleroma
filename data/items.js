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
    nombre: "@@items.sinArmar.nombre",
    texto: "@@items.sinArmar.texto",
  },
  cuero: {
    id: "cuero", tipo: "armadura", def: 2, precio: 30,
    nombre: "@@items.cuero.nombre",
    texto: "@@items.cuero.texto",
  },
  cota: {
    id: "cota", tipo: "armadura", def: 4, precio: 70,
    nombre: "@@items.cota.nombre",
    texto: "@@items.cota.texto",
  },
  placas: {
    id: "placas", tipo: "armadura", def: 6, precio: 150,
    nombre: "@@items.placas.nombre",
    texto: "@@items.placas.texto",
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
  leviatan: {
    id: "leviatan", resultado: "leviatan", secreto: true,
    nombre: "@@recetas.leviatan.nombre",
    requiereArma: "garrote_nudoso", requiereNivel: 10,
    materiales: { zarpa_osa: 1, fragmento_coloso: 1, esencia_bosque: 1 },
  },
  sombra_veloz: {
    id: "sombra_veloz", resultado: "sombra_veloz", secreto: true,
    nombre: "@@recetas.sombra_veloz.nombre",
    requiereArma: "lanza_campo", requiereNivel: 10,
    materiales: { garra_puma: 1, escarcha_gigante: 1, nucleo_pantano: 1 },
  },
  vacio_eterno: {
    id: "vacio_eterno", resultado: "vacio_eterno", secreto: true,
    nombre: "@@recetas.vacio_eterno.nombre",
    requiereArma: "bastón_pantano", requiereNivel: 10,
    materiales: { escama_hidra: 1, cristal_escarcha: 1, nucleo_pantano: 1 },
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
