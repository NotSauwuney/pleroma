/* ============================================================
   NPCs y TRABAJOS  —  vida de la zona segura
   ------------------------------------------------------------
   GD.npcs: personajes con los que se puede hablar en los locales.
     nombre · saludo (al entrar) · dialogos (al "Hablar", se rotan)
     Todo localizable {es,en}; saludo/dialogos pueden ser arrays.
   GD.trabajos: formas pacíficas de ganar oro. Cuestan STAMINA y TIEMPO
     (no se pueden spamear: te quedás sin aliento y hay que descansar).
     pago = base + azar(0..var) + floor(stat * statBonus)
   ============================================================ */
window.GD = window.GD || {};

GD.npcs = {
  tabernero: {
    nombre: "@@npcs.tabernero.nombre",
    saludo: [
      "@@npcs.tabernero.saludo.0",
      "@@npcs.tabernero.saludo.1",
    ],
    dialogos: [
      "@@npcs.tabernero.dialogos.0",
      "@@npcs.tabernero.dialogos.1",
      "@@npcs.tabernero.dialogos.2",
      "@@npcs.tabernero.dialogos.3",
    ],
  },

  mercader: {
    nombre: "@@npcs.mercader.nombre",
    saludo: [
      "@@npcs.mercader.saludo.0",
      "@@npcs.mercader.saludo.1",
    ],
    dialogos: [
      "@@npcs.mercader.dialogos.0",
      "@@npcs.mercader.dialogos.1",
      "@@npcs.mercader.dialogos.2",
      "@@npcs.mercader.dialogos.3",
    ],
  },

  herrero: {
    nombre: "@@npcs.herrero.nombre",
    saludo: [
      "@@npcs.herrero.saludo.0",
      "@@npcs.herrero.saludo.1",
    ],
    dialogos: [
      "@@npcs.herrero.dialogos.0",
      "@@npcs.herrero.dialogos.1",
      "@@npcs.herrero.dialogos.2",
      "@@npcs.herrero.dialogos.3",
    ],
  },

  maestraSiriel: {
    nombre: "@@npcs.maestraSiriel.nombre",
    saludo: [
      "@@npcs.maestraSiriel.saludo.0",
      "@@npcs.maestraSiriel.saludo.1",
    ],
    dialogos: [
      "@@npcs.maestraSiriel.dialogos.0",
      "@@npcs.maestraSiriel.dialogos.1",
      "@@npcs.maestraSiriel.dialogos.2",
      "@@npcs.maestraSiriel.dialogos.3",
    ],
  },

  maestroKor: {
    nombre: "@@npcs.maestroKor.nombre",
    saludo: [
      "@@npcs.maestroKor.saludo.0",
      "@@npcs.maestroKor.saludo.1",
    ],
    dialogos: [
      "@@npcs.maestroKor.dialogos.0",
      "@@npcs.maestroKor.dialogos.1",
      "@@npcs.maestroKor.dialogos.2",
      "@@npcs.maestroKor.dialogos.3",
    ],
  },

  granjero: {
    nombre: "@@npcs.granjero.nombre",
    saludo: [
      "@@npcs.granjero.saludo.0",
      "@@npcs.granjero.saludo.1",
    ],
    dialogos: [
      "@@npcs.granjero.dialogos.0",
      "@@npcs.granjero.dialogos.1",
      "@@npcs.granjero.dialogos.2",
      "@@npcs.granjero.dialogos.3",
    ],
  },

  cocinera: {
    nombre: "@@npcs.cocinera.nombre",
    saludo: [
      "@@npcs.cocinera.saludo.0",
      "@@npcs.cocinera.saludo.1",
    ],
    dialogos: [
      "@@npcs.cocinera.dialogos.0",
      "@@npcs.cocinera.dialogos.1",
      "@@npcs.cocinera.dialogos.2",
      "@@npcs.cocinera.dialogos.3",
    ],
  },

  archimagaVexara: {
    nombre: "@@npcs.archimagaVexara.nombre",
    saludo: [
      "@@npcs.archimagaVexara.saludo.0",
      "@@npcs.archimagaVexara.saludo.1",
    ],
    dialogos: [
      "@@npcs.archimagaVexara.dialogos.0",
      "@@npcs.archimagaVexara.dialogos.1",
      "@@npcs.archimagaVexara.dialogos.2",
      "@@npcs.archimagaVexara.dialogos.3",
    ],
  },

  /* ----------------------------------------------------------
     BARQUERO — Viejo marino que cuida el único bote del puerto.
     Conoce las mareas y los peligros del océano mejor que nadie.
     No navega: sabe demasiado bien lo que hay afuera.
  ---------------------------------------------------------- */
  barquero: {
    nombre: "@@npcs.barquero.nombre",
    saludo: [
      "@@npcs.barquero.saludo.0",
      "@@npcs.barquero.saludo.1",
    ],
    dialogos: [
      "@@npcs.barquero.dialogos.0",
      "@@npcs.barquero.dialogos.1",
      "@@npcs.barquero.dialogos.2",
      "@@npcs.barquero.dialogos.3",
    ],
    /* Diálogos cuando el mar está demasiado peligroso (nivel < 8) */
    dialogosBote: [
      "@@npcs.barquero.dialogosBote.0",
      "@@npcs.barquero.dialogosBote.1",
      "@@npcs.barquero.dialogosBote.2",
    ],
    /* Diálogos cuando el jugador es suficientemente fuerte (nivel >= 8) */
    dialogosBoteUnlock: [
      "@@npcs.barquero.dialogosBoteUnlock.0",
      "@@npcs.barquero.dialogosBoteUnlock.1",
    ],
    /* Conversación de la tripulación durante el viaje en barco */
    tripulacion: [
      "@@npcs.barquero.tripulacion.0",
      "@@npcs.barquero.tripulacion.1",
      "@@npcs.barquero.tripulacion.2",
      "@@npcs.barquero.tripulacion.3",
      "@@npcs.barquero.tripulacion.4",
      "@@npcs.barquero.tripulacion.5",
      "@@npcs.barquero.tripulacion.6",
      "@@npcs.barquero.tripulacion.7",
    ],
  },

  /* ----------------------------------------------------------
     NYSSA — Hiena caravanera, dueña del Puesto de la Caravanera
     en los Arenales de Solakh. Última heredera de las rutas
     comerciales que cruzaban el desierto antes de la Hambruna.
     Gorda de éxito, como manda la tradición mercante de Solakh.
  ---------------------------------------------------------- */
  caravanera: {
    nombre: "@@npcs.caravanera.nombre",
    saludo: [
      "@@npcs.caravanera.saludo.0",
      "@@npcs.caravanera.saludo.1",
    ],
    dialogos: [
      "@@npcs.caravanera.dialogos.0",
      "@@npcs.caravanera.dialogos.1",
      "@@npcs.caravanera.dialogos.2",
      "@@npcs.caravanera.dialogos.3",
    ],
  },

  /* ----------------------------------------------------------
     YARO — Pangolín recolector, guardián del Nido de Raíces
     en el Gran Manto. Vive entre las raíces del bosque-coloso
     y comercia con lo que el Manto suelta por voluntad propia.
  ---------------------------------------------------------- */
  silvano: {
    nombre: "@@npcs.silvano.nombre",
    saludo: [
      "@@npcs.silvano.saludo.0",
      "@@npcs.silvano.saludo.1",
    ],
    dialogos: [
      "@@npcs.silvano.dialogos.0",
      "@@npcs.silvano.dialogos.1",
      "@@npcs.silvano.dialogos.2",
      "@@npcs.silvano.dialogos.3",
    ],
  },

  /* ----------------------------------------------------------
     BRUL — Porteador ambulante. Corpulento y sin adornos.
     No juzga el tamaño de nadie: le pagan, empuja, listo.
     Aparece cuando el jugador alcanza el estado inmóvil y necesita
     moverse pero ya agotó su reflejo de supervivencia.
     Cobra cada N asistencias; sin oro, impone pérdida de peso.
  ---------------------------------------------------------- */
  porteador: {
    nombre: "@@npcs.porteador.nombre",
    saludo: [
      "@@npcs.porteador.saludo.0",
      "@@npcs.porteador.saludo.1",
    ],
    dialogos: [
      "@@npcs.porteador.dialogos.0",
      "@@npcs.porteador.dialogos.1",
      "@@npcs.porteador.dialogos.2",
      "@@npcs.porteador.dialogos.3",
    ],
    dialogosPrimero: "@@npcs.porteador.dialogosPrimero",
    dialogosCobro: [
      "@@npcs.porteador.dialogosCobro.0",
      "@@npcs.porteador.dialogosCobro.1",
    ],
    dialogosSinOro: [
      "@@npcs.porteador.dialogosSinOro.0",
      "@@npcs.porteador.dialogosSinOro.1",
    ],
    dialogosVadak: [
      "@@npcs.porteador.dialogosVadak.0",
      "@@npcs.porteador.dialogosVadak.1",
    ],
  },

  /* ----------------------------------------------------------
     VADAK — Salamandra gigante, antiguo devorador reformado.
     Habita la cueva al fondo del claro pantanoso.
     Maestro no académico de la Tradición de la Plenitud:
     su conocimiento es puro historial de masa ajena digerida.
  ---------------------------------------------------------- */
  vadak: {
    nombre: "@@npcs.vadak.nombre",
    saludo: [
      "@@npcs.vadak.saludo.0",
      "@@npcs.vadak.saludo.1",
    ],
    dialogos: [
      "@@npcs.vadak.dialogos.0",
      "@@npcs.vadak.dialogos.1",
      "@@npcs.vadak.dialogos.2",
      "@@npcs.vadak.dialogos.3",
    ],
  },
};

GD.trabajos = {
  servir: {
    loc: "posada", stat: "AGI", costoSta: 25, turnos: 4, base: 8, var: 8, statBonus: 0.6,
    desc: [
      "@@trabajos.servir.desc.0",
      "@@trabajos.servir.desc.1",
    ],
  },
  acomodar: {
    loc: "tienda", stat: "INT", costoSta: 20, turnos: 3, base: 7, var: 8, statBonus: 0.6,
    desc: [
      "@@trabajos.acomodar.desc.0",
      "@@trabajos.acomodar.desc.1",
    ],
  },
  fuelle: {
    loc: "herreria", stat: "FUE", costoSta: 35, turnos: 5, base: 14, var: 10, statBonus: 0.8,
    desc: [
      "@@trabajos.fuelle.desc.0",
      "@@trabajos.fuelle.desc.1",
    ],
  },
  estudiarLuz: {
    loc: "escuela_blanca", stat: "AGU", costoSta: 22, turnos: 3, base: 10, var: 6, statBonus: 0.5,
    desc: [
      "@@trabajos.estudiarLuz.desc.0",
      "@@trabajos.estudiarLuz.desc.1",
    ],
  },
  estudiarFlujo: {
    loc: "escuela_gris", stat: "INT", costoSta: 28, turnos: 3, base: 12, var: 8, statBonus: 0.6,
    desc: [
      "@@trabajos.estudiarFlujo.desc.0",
      "@@trabajos.estudiarFlujo.desc.1",
    ],
  },
  asistirVexara: {
    loc: "escuela_negra", stat: "INT", costoSta: 30, turnos: 4, base: 16, var: 10, statBonus: 0.7,
    desc: [
      "@@trabajos.asistirVexara.desc.0",
      "@@trabajos.asistirVexara.desc.1",
    ],
  },
  labrar: {
    loc: "granja", stat: "FUE", costoSta: 32, turnos: 5, base: 10, var: 8, statBonus: 0.7,
    desc: [
      "@@trabajos.labrar.desc.0",
      "@@trabajos.labrar.desc.1",
      "@@trabajos.labrar.desc.2",
    ],
  },
  arrear_vacas: {
    loc: "granja", stat: "AGI", costoSta: 20, turnos: 3, base: 8, var: 7, statBonus: 0.5,
    desc: [
      "@@trabajos.arrear_vacas.desc.0",
      "@@trabajos.arrear_vacas.desc.1",
      "@@trabajos.arrear_vacas.desc.2",
    ],
  },
  practicarPlenitud: {
    loc: "escuela_plenitud", stat: "EST", costoSta: 25, turnos: 4, base: 14, var: 8, statBonus: 0.6,
    desc: [
      "@@trabajos.practicarPlenitud.desc.0",
      "@@trabajos.practicarPlenitud.desc.1",
    ],
  },
  cargar_caravana: {
    loc: "puesto_solakh", stat: "FUE", costoSta: 30, turnos: 4, base: 16, var: 10, statBonus: 0.7,
    desc: [
      "@@trabajos.cargar_caravana.desc.0",
      "@@trabajos.cargar_caravana.desc.1",
    ],
  },
  podar_lianas: {
    loc: "nido_raices", stat: "AGI", costoSta: 26, turnos: 4, base: 15, var: 9, statBonus: 0.6,
    desc: [
      "@@trabajos.podar_lianas.desc.0",
      "@@trabajos.podar_lianas.desc.1",
    ],
  },
};
