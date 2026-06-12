/* ============================================================
   NPC WG SYSTEM  —  estado corporal, vínculo y alimentación
   ------------------------------------------------------------
   GD.npcWG[npcId]: datos estáticos del sistema WG de cada NPC.
   El estado dinámico (pesoIdx, wgAccum, bondPts, lastFed) vive
   en S.player.npcWG[npcId] y se serializa con el save automático.

   Campos por NPC:
     especie, color           — identidad furry para las descripciones
     pesoBase                 — índice de estado al inicio del juego
     wgPorPaso                — wgAccum necesario para avanzar un estado
     estados[]                — array {label, desc} de menor a mayor peso
     favFoods[]               — item IDs con efecto x1.25
     receptivo[]              — ["dia"] | ["noche"] | ["dia","noche"]
     cooldownBase             — turnos entre comidas (se reduce con bond)
     bondThresholds[]         — puntos acumulados para cada nivel de vínculo
     bondNames[]              — {es,en} por nivel de vínculo (5 niveles)
     feedFlavor[]             — reacción genérica al recibir comida
     feedFavFlavor[]          — reacción a su comida favorita
     avanceFlavor[]           — texto al subir un estado de peso
   ============================================================ */
window.GD = window.GD || {};

GD.npcWG = {

  /* ----------------------------------------------------------
     BOREK — Oso pardo, tabernero de Solace Ford
     Siempre ha comido bien. Su cuerpo es el argumento más
     convincente del menú. No necesita bajar de peso; solo
     le falta seguir subiendo.
  ---------------------------------------------------------- */
  tabernero: {
    especie: "oso pardo",
    color: "pardo rojizo",
    pesoBase: 0,
    wgPorPaso: 12.0,
    estados: [
      {
        label: "@@npcWG.tabernero.estados.0.label",
        desc: "@@npcWG.tabernero.estados.0.desc",
      },
      {
        label: "@@npcWG.tabernero.estados.1.label",
        desc: "@@npcWG.tabernero.estados.1.desc",
      },
      {
        label: "@@npcWG.tabernero.estados.2.label",
        desc: "@@npcWG.tabernero.estados.2.desc",
      },
      {
        label: "@@npcWG.tabernero.estados.3.label",
        desc: "@@npcWG.tabernero.estados.3.desc",
      },
    ],
    favFoods: ["guiso", "festin", "cocina_guiso_granja", "cocina_festin_cosecha"],
    receptivo: ["dia", "noche"],
    cooldownBase: 4,
    bondThresholds: [0, 5, 15, 30, 55],
    bondNames: [
      "@@npcWG.tabernero.bondNames.0",
      "@@npcWG.tabernero.bondNames.1",
      "@@npcWG.tabernero.bondNames.2",
      "@@npcWG.tabernero.bondNames.3",
      "@@npcWG.tabernero.bondNames.4",
    ],
    feedFlavor: [
      "@@npcWG.tabernero.feedFlavor.0",
      "@@npcWG.tabernero.feedFlavor.1",
      "@@npcWG.tabernero.feedFlavor.2",
    ],
    feedFavFlavor: [
      "@@npcWG.tabernero.feedFavFlavor.0",
      "@@npcWG.tabernero.feedFavFlavor.1",
      "@@npcWG.tabernero.feedFavFlavor.2",
    ],
    avanceFlavor: [
      "@@npcWG.tabernero.avanceFlavor.0",
      "@@npcWG.tabernero.avanceFlavor.1",
    ],
  },

  /* ----------------------------------------------------------
     BOSK — Jabalí, granjero de las Granjas de Solaz
     Trabaja todo el día y come proporcional. Ha vivido cerca
     de la comida toda su vida; lo que le falta es quien se la
     alcance sin que tenga que dejar de trabajar.
  ---------------------------------------------------------- */
  granjero: {
    especie: "jabalí",
    color: "gris oscuro",
    pesoBase: 0,
    wgPorPaso: 12.0,
    estados: [
      {
        label: "@@npcWG.granjero.estados.0.label",
        desc: "@@npcWG.granjero.estados.0.desc",
      },
      {
        label: "@@npcWG.granjero.estados.1.label",
        desc: "@@npcWG.granjero.estados.1.desc",
      },
      {
        label: "@@npcWG.granjero.estados.2.label",
        desc: "@@npcWG.granjero.estados.2.desc",
      },
      {
        label: "@@npcWG.granjero.estados.3.label",
        desc: "@@npcWG.granjero.estados.3.desc",
      },
    ],
    favFoods: ["pan", "cocina_sopa_raices", "cocina_pan_campo", "cocina_guiso_granja"],
    receptivo: ["dia"],
    cooldownBase: 5,
    bondThresholds: [0, 5, 15, 30, 55],
    bondNames: [
      "@@npcWG.granjero.bondNames.0",
      "@@npcWG.granjero.bondNames.1",
      "@@npcWG.granjero.bondNames.2",
      "@@npcWG.granjero.bondNames.3",
      "@@npcWG.granjero.bondNames.4",
    ],
    feedFlavor: [
      "@@npcWG.granjero.feedFlavor.0",
      "@@npcWG.granjero.feedFlavor.1",
      "@@npcWG.granjero.feedFlavor.2",
    ],
    feedFavFlavor: [
      "@@npcWG.granjero.feedFavFlavor.0",
      "@@npcWG.granjero.feedFavFlavor.1",
    ],
    avanceFlavor: [
      "@@npcWG.granjero.avanceFlavor.0",
      "@@npcWG.granjero.avanceFlavor.1",
    ],
  },

  /* ----------------------------------------------------------
     MARTA — Rata de campo, cocinera de las Granjas de Solaz
     Prueba todo lo que hace. Ese es el estándar profesional.
     El resultado habla por sí mismo — en su silueta, en sus
     platos, en la satisfacción con que ocupa el espacio.
  ---------------------------------------------------------- */
  cocinera: {
    especie: "rata de campo",
    color: "gris parda",
    pesoBase: 0,
    wgPorPaso: 9.0,
    estados: [
      {
        label: "@@npcWG.cocinera.estados.0.label",
        desc: "@@npcWG.cocinera.estados.0.desc",
      },
      {
        label: "@@npcWG.cocinera.estados.1.label",
        desc: "@@npcWG.cocinera.estados.1.desc",
      },
      {
        label: "@@npcWG.cocinera.estados.2.label",
        desc: "@@npcWG.cocinera.estados.2.desc",
      },
      {
        label: "@@npcWG.cocinera.estados.3.label",
        desc: "@@npcWG.cocinera.estados.3.desc",
      },
    ],
    favFoods: ["pastel", "cocina_torta_miel", "cocina_natilla", "cocina_budin_manteca", "cocina_gloria_glotona"],
    receptivo: ["dia", "noche"],
    cooldownBase: 4,
    bondThresholds: [0, 5, 15, 30, 55],
    bondNames: [
      "@@npcWG.cocinera.bondNames.0",
      "@@npcWG.cocinera.bondNames.1",
      "@@npcWG.cocinera.bondNames.2",
      "@@npcWG.cocinera.bondNames.3",
      "@@npcWG.cocinera.bondNames.4",
    ],
    feedFlavor: [
      "@@npcWG.cocinera.feedFlavor.0",
      "@@npcWG.cocinera.feedFlavor.1",
      "@@npcWG.cocinera.feedFlavor.2",
    ],
    feedFavFlavor: [
      "@@npcWG.cocinera.feedFavFlavor.0",
      "@@npcWG.cocinera.feedFavFlavor.1",
    ],
    avanceFlavor: [
      "@@npcWG.cocinera.avanceFlavor.0",
      "@@npcWG.cocinera.avanceFlavor.1",
    ],
  },

  /* ----------------------------------------------------------
     VADAK — Salamandra gigante, cueva del pantano
     Antiguo depredador que devoró un mago y no volvió a ser
     lo mismo. Dejó de cazar. Su cuerpo, sin el gasto constante
     de la caza, empezó a crecer. Ya lleva años sin moverse
     mucho, pensando, y aceptando lo que le traigan.
  ---------------------------------------------------------- */
  vadak: {
    especie: "salamandra gigante",
    color: "verde grisácea con manchas oscuras",
    pesoBase: 2,
    wgPorPaso: 20.0,
    estados: [
      {
        label: "@@npcWG.vadak.estados.0.label",
        desc: "@@npcWG.vadak.estados.0.desc",
      },
      {
        label: "@@npcWG.vadak.estados.1.label",
        desc: "@@npcWG.vadak.estados.1.desc",
      },
      {
        label: "@@npcWG.vadak.estados.2.label",
        desc: "@@npcWG.vadak.estados.2.desc",
      },
      {
        label: "@@npcWG.vadak.estados.3.label",
        desc: "@@npcWG.vadak.estados.3.desc",
      },
      {
        label: "@@npcWG.vadak.estados.4.label",
        desc: "@@npcWG.vadak.estados.4.desc",
      },
      {
        label: "@@npcWG.vadak.estados.5.label",
        desc: "@@npcWG.vadak.estados.5.desc",
      },
      {
        label: "@@npcWG.vadak.estados.6.label",
        desc: "@@npcWG.vadak.estados.6.desc",
      },
      {
        label: "@@npcWG.vadak.estados.7.label",
        desc: "@@npcWG.vadak.estados.7.desc",
      },
    ],
    favFoods: ["festin", "guiso", "cocina_guiso_granja", "cocina_gloria_glotona"],
    receptivo: ["dia", "noche"],
    cooldownBase: 5,
    bondThresholds: [0, 5, 15, 35, 65],
    bondNames: [
      "@@npcWG.vadak.bondNames.0",
      "@@npcWG.vadak.bondNames.1",
      "@@npcWG.vadak.bondNames.2",
      "@@npcWG.vadak.bondNames.3",
      "@@npcWG.vadak.bondNames.4",
    ],
    feedFlavor: [
      "@@npcWG.vadak.feedFlavor.0",
      "@@npcWG.vadak.feedFlavor.1",
      "@@npcWG.vadak.feedFlavor.2",
    ],
    feedFavFlavor: [
      "@@npcWG.vadak.feedFavFlavor.0",
      "@@npcWG.vadak.feedFavFlavor.1",
    ],
    avanceFlavor: [
      "@@npcWG.vadak.avanceFlavor.0",
      "@@npcWG.vadak.avanceFlavor.1",
    ],
  },

  /* ----------------------------------------------------------
     VELLA — Zorra roja, mercader de Solace Ford
     Mantiene las apariencias como parte del negocio. Pero
     tiene sus debilidades, y alguien con el ítem correcto
     puede encontrarlas.
  ---------------------------------------------------------- */
  mercader: {
    especie: "zorra roja",
    color: "roja anaranjada con pecho crema",
    pesoBase: 0,
    wgPorPaso: 15.0,
    estados: [
      {
        label: "@@npcWG.mercader.estados.0.label",
        desc: "@@npcWG.mercader.estados.0.desc",
      },
      {
        label: "@@npcWG.mercader.estados.1.label",
        desc: "@@npcWG.mercader.estados.1.desc",
      },
      {
        label: "@@npcWG.mercader.estados.2.label",
        desc: "@@npcWG.mercader.estados.2.desc",
      },
      {
        label: "@@npcWG.mercader.estados.3.label",
        desc: "@@npcWG.mercader.estados.3.desc",
      },
    ],
    favFoods: ["crema", "pastel", "cocina_natilla", "cocina_gloria_glotona"],
    receptivo: ["dia"],
    cooldownBase: 6,
    bondThresholds: [0, 5, 15, 30, 55],
    bondNames: [
      "@@npcWG.mercader.bondNames.0",
      "@@npcWG.mercader.bondNames.1",
      "@@npcWG.mercader.bondNames.2",
      "@@npcWG.mercader.bondNames.3",
      "@@npcWG.mercader.bondNames.4",
    ],
    feedFlavor: [
      "@@npcWG.mercader.feedFlavor.0",
      "@@npcWG.mercader.feedFlavor.1",
      "@@npcWG.mercader.feedFlavor.2",
    ],
    feedFavFlavor: [
      "@@npcWG.mercader.feedFavFlavor.0",
      "@@npcWG.mercader.feedFavFlavor.1",
    ],
    avanceFlavor: [
      "@@npcWG.mercader.avanceFlavor.0",
      "@@npcWG.mercader.avanceFlavor.1",
    ],
  },

};
