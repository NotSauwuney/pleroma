/* ============================================================
   ESPECIES  —  data del jugador y de NPCs
   ------------------------------------------------------------
   stats: [FUE, AGI, INT, AGU, EST, TAM]
     FUE = Fuerza   -> daño, capacidad de carga (anti-inmovilidad), forcejeo
     AGI = Agilidad -> iniciativa, esquiva, huir, devorar
     INT = Ingenio  -> iniciativa, magia (Feast), esquiva, finta al devorar
     AGU = Aguante  -> vida máxima, eficiencia de stamina
     EST = Estómago -> llenura máxima, digestión, capacidad de devorar
     TAM = Tamaño   -> masa base / contextura inicial
   Texto localizable: nombre y descripcion pueden ser un string simple
   o un objeto {es:"...", en:"..."}. Ver LANG.md.

   cobertura: tipo de piel que recubre el cuerpo — "pelaje" | "escamas" |
     "plumas" | "piel". Define cómo se nombra (creación) y cómo se describe la
     superficie del cuerpo en "Chequear estado". Default "pelaje".
   ============================================================ */
window.GD = window.GD || {};

GD.species = [
  {
    id: "vulpor",
    nombre: "@@species.vulpor.nombre",
    descripcion: "@@species.vulpor.descripcion",
    cobertura: "pelaje", pelaje: "rojizo", panza: "crema",
    stats: [3, 7, 6, 4, 9, 4],
    altura: 168,
  },
  {
    id: "ursaco",
    nombre: "@@species.ursaco.nombre",
    descripcion: "@@species.ursaco.descripcion",
    cobertura: "pelaje", pelaje: "pardo", panza: "ocre",
    stats: [9, 2, 3, 8, 7, 9],
    altura: 192,
  },
  {
    id: "mursa",
    nombre: "@@species.mursa.nombre",
    descripcion: "@@species.mursa.descripcion",
    cobertura: "pelaje", pelaje: "gris", panza: "blanco",
    stats: [5, 4, 5, 6, 11, 6],
    altura: 158,
  },
  {
    id: "felino",
    nombre: "@@species.felino.nombre",
    descripcion: "@@species.felino.descripcion",
    cobertura: "pelaje", pelaje: "ceniza moteada", panza: "marfil",
    stats: [6, 8, 7, 4, 5, 5],
    altura: 179,
  },
  {
    id: "saurio",
    nombre: "@@species.saurio.nombre",
    descripcion: "@@species.saurio.descripcion",
    cobertura: "escamas", pelaje: "verde oliva", panza: "amarillo",
    stats: [7, 3, 4, 6, 10, 8],
    altura: 185,
  },
  {
    id: "corvax",
    nombre: "@@species.corvax.nombre",
    descripcion: "@@species.corvax.descripcion",
    cobertura: "plumas", pelaje: "negro azabache", panza: "gris pizarra",
    stats: [2, 7, 11, 5, 5, 3],
    altura: 163,
  },
  {
    id: "leontauro",
    nombre: "@@species.leontauro.nombre",
    descripcion: "@@species.leontauro.descripcion",
    cobertura: "pelaje", pelaje: "dorado", panza: "crema",
    stats: [8, 3, 4, 7, 8, 9],
    altura: 198,
    // Rasgos: gigantes cuadrúpedos — cargan más, comen más, se cansan menos
    // moviéndose, pero su rareza los vuelve un blanco más fácil en combate.
    rasgos: {
      panzaMult: 1.5,          // panza ~50% más grande (doble estómago)
      costoMovMult: 0.85,      // moverse les cuesta menos energía (cuadrúpedos)
      umbralPesoMult: 1.3,     // aguantan ~30% más peso antes de quedar casi inmóviles
      vulnerabilidadMult: 1.35, // especie rara: los enemigos los notan y los castigan más
    },
  },
];

/* Búsqueda rápida por id */
GD.speciesById = function (id) {
  return GD.species.find(function (s) { return s.id === id; }) || GD.species[0];
};
