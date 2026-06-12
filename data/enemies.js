/* ============================================================
   ENEMIGOS  —  criaturas por bioma
   ------------------------------------------------------------
   stats: [FUE, AGI, INT, AGU, EST, TAM]
   vidaMax, def, dano(Xd), rango(dY)
   masa:        base de cuánto te llena/engorda al DEVORAR/Feastear
                (el estado de peso lo multiplica)
   pesos:       estados de peso posibles (ver GD.pesos en bodies.js)
   xp, oro · puedeDevorar (muerte por devoración) · tipoDano "arcano" (muerte por magia)
   resist / debil: arrays de tipoDano

   FLAVOR — líneas localizables. Cada una puede ser:
     · una variante:  {es:"...", en:"..."}
     · un ARRAY de variantes (se elige una al azar en cada uso) -> más variedad
   Campos: encuentro · ataque · derrota · victoria
   Opcional `cuerpo`: descripción de peso BESPOKE por estado, ej:
     cuerpo: { obeso:{es,en}, ultraObeso:{es,en} }
     Si existe la del estado actual, reemplaza a la genérica de GD.pesos.
   ============================================================ */
window.GD = window.GD || {};

GD.enemies = {
  conejoGordo: {
    id: "conejoGordo",
    nombre: "@@enemies.conejoGordo.nombre",
    stats: [2, 6, 2, 3, 4, 3], vidaMax: 22, def: 0, dano: 1, rango: 4,
    masa: 26, xp: 18, oro: 6, puedeDevorar: false,
    debil: ["golpe"],
    pesos: ["flaco", "promedio", "rellenito", "gordo", "obeso"],
    flavor: {
      encuentro: "@@enemies.conejoGordo.flavor.encuentro",
      cuerpo: {
        rellenito: "@@enemies.conejoGordo.flavor.cuerpo.rellenito",
        gordo: "@@enemies.conejoGordo.flavor.cuerpo.gordo",
        obeso: "@@enemies.conejoGordo.flavor.cuerpo.obeso",
      },
      ataque: [
        "@@enemies.conejoGordo.flavor.ataque.0",
        "@@enemies.conejoGordo.flavor.ataque.1",
        "@@enemies.conejoGordo.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.conejoGordo.flavor.derrota.0",
        "@@enemies.conejoGordo.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.conejoGordo.flavor.victoria.0",
        "@@enemies.conejoGordo.flavor.victoria.1",
      ],
    },
  },

  lobo: {
    id: "lobo",
    nombre: "@@enemies.lobo.nombre",
    stats: [6, 7, 4, 5, 6, 5], vidaMax: 40, def: 1, dano: 2, rango: 5,
    masa: 48, xp: 35, oro: 14, puedeDevorar: true,
    debil: ["arcano"],
    gota: [{ id: "colmillo_lobo", chance: 0.20 }],
    pesos: ["flaco", "promedio", "gordo", "fornido"],
    flavor: {
      encuentro: "@@enemies.lobo.flavor.encuentro",
      cuerpo: {
        gordo: "@@enemies.lobo.flavor.cuerpo.gordo",
        fornido: "@@enemies.lobo.flavor.cuerpo.fornido",
      },
      ataque: [
        "@@enemies.lobo.flavor.ataque.0",
        "@@enemies.lobo.flavor.ataque.1",
        "@@enemies.lobo.flavor.ataque.2",
        "@@enemies.lobo.flavor.ataque.3",
      ],
      derrota: [
        "@@enemies.lobo.flavor.derrota.0",
        "@@enemies.lobo.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.lobo.flavor.victoria.0",
        "@@enemies.lobo.flavor.victoria.1",
      ],
    },
  },

  jabali: {
    id: "jabali",
    nombre: "@@enemies.jabali.nombre",
    stats: [9, 3, 2, 8, 7, 8], vidaMax: 65, def: 3, dano: 3, rango: 6,
    masa: 80, xp: 55, oro: 22, puedeDevorar: false,
    resist: ["golpe"], debil: ["corte"],
    gota: [{ id: "colmillo_jabali", chance: 0.25 }],
    pesos: ["promedio", "gordo", "obeso", "fornido", "hipermusculoso"],
    flavor: {
      encuentro: "@@enemies.jabali.flavor.encuentro",
      cuerpo: {
        gordo: "@@enemies.jabali.flavor.cuerpo.gordo",
        obeso: "@@enemies.jabali.flavor.cuerpo.obeso",
        hipermusculoso: "@@enemies.jabali.flavor.cuerpo.hipermusculoso",
      },
      ataque: [
        "@@enemies.jabali.flavor.ataque.0",
        "@@enemies.jabali.flavor.ataque.1",
        "@@enemies.jabali.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.jabali.flavor.derrota.0",
        "@@enemies.jabali.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.jabali.flavor.victoria.0",
        "@@enemies.jabali.flavor.victoria.1",
      ],
    },
  },

  glotoncillo: {
    id: "glotoncillo",
    nombre: "@@enemies.glotoncillo.nombre",
    stats: [4, 5, 3, 4, 12, 6], vidaMax: 35, def: 1, dano: 2, rango: 4,
    masa: 60, xp: 40, oro: 18, puedeDevorar: true,
    debil: ["corte"],
    pesos: ["gordo", "obeso", "ultraObeso"],
    flavor: {
      encuentro: "@@enemies.glotoncillo.flavor.encuentro",
      // Cuerpo bespoke: el glotón es vientre puro, su gordura se describe distinto a la genérica
      cuerpo: {
        gordo: "@@enemies.glotoncillo.flavor.cuerpo.gordo",
        obeso: "@@enemies.glotoncillo.flavor.cuerpo.obeso",
        ultraObeso: "@@enemies.glotoncillo.flavor.cuerpo.ultraObeso",
      },
      ataque: [
        "@@enemies.glotoncillo.flavor.ataque.0",
        "@@enemies.glotoncillo.flavor.ataque.1",
        "@@enemies.glotoncillo.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.glotoncillo.flavor.derrota.0",
        "@@enemies.glotoncillo.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.glotoncillo.flavor.victoria.0",
        "@@enemies.glotoncillo.flavor.victoria.1",
      ],
    },
  },

  bandido: {
    id: "bandido",
    nombre: "@@enemies.bandido.nombre",
    stats: [6, 6, 6, 5, 5, 5], vidaMax: 48, def: 2, dano: 2, rango: 5,
    masa: 55, xp: 50, oro: 35, puedeDevorar: false,
    pesos: ["flaco", "promedio", "fornido"],
    flavor: {
      encuentro: "@@enemies.bandido.flavor.encuentro",
      ataque: [
        "@@enemies.bandido.flavor.ataque.0",
        "@@enemies.bandido.flavor.ataque.1",
        "@@enemies.bandido.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.bandido.flavor.derrota.0",
        "@@enemies.bandido.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.bandido.flavor.victoria.0",
        "@@enemies.bandido.flavor.victoria.1",
      ],
    },
  },

  cultista: {
    id: "cultista",
    nombre: "@@enemies.cultista.nombre",
    stats: [3, 5, 9, 4, 5, 4], vidaMax: 38, def: 1, dano: 2, rango: 6,
    tipoDano: "arcano",
    masa: 50, xp: 55, oro: 28, puedeDevorar: false,
    resist: ["arcano"], debil: ["corte"],
    pesos: ["flaco", "promedio", "obeso"],
    flavor: {
      encuentro: "@@enemies.cultista.flavor.encuentro",
      ataque: [
        "@@enemies.cultista.flavor.ataque.0",
        "@@enemies.cultista.flavor.ataque.1",
        "@@enemies.cultista.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.cultista.flavor.derrota.0",
        "@@enemies.cultista.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.cultista.flavor.victoria.0",
        "@@enemies.cultista.flavor.victoria.1",
      ],
    },
  },

  coloso: {
    id: "coloso",
    nombre: "@@enemies.coloso.nombre",
    stats: [7, 1, 1, 13, 2, 12], vidaMax: 130, def: 7, dano: 3, rango: 6,
    masa: 72, xp: 75, oro: 25, puedeDevorar: false,
    resist: ["corte", "golpe"], debil: ["arcano"],
    pesos: ["hipermusculoso"],
    flavor: {
      encuentro: "@@enemies.coloso.flavor.encuentro",
      // Cuerpo bespoke: es PIEDRA, no músculo blando; su "masa" se describe como roca viva
      cuerpo: {
        hipermusculoso: "@@enemies.coloso.flavor.cuerpo.hipermusculoso",
      },
      ataque: [
        "@@enemies.coloso.flavor.ataque.0",
        "@@enemies.coloso.flavor.ataque.1",
        "@@enemies.coloso.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.coloso.flavor.derrota.0",
        "@@enemies.coloso.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.coloso.flavor.victoria.0",
        "@@enemies.coloso.flavor.victoria.1",
      ],
    },
    gota: [{ id: "fragmento_coloso", chance: 0.30 }],
    ataqueEspecial: {
      chance: 0.30,
      flavor: [
        "@@enemies.coloso.ataqueEspecial.flavor.0",
        "@@enemies.coloso.ataqueEspecial.flavor.1",
      ],
      dano: 3, rango: 8, ignoraDef: false,
    },
  },

  /* ===================== ENEMIGOS NUEVOS ===================== */

  hidra: {
    id: "hidra",
    nombre: "@@enemies.hidra.nombre",
    stats: [7, 7, 5, 7, 8, 8], vidaMax: 85, def: 3, dano: 2, rango: 6,
    masa: 80, xp: 70, oro: 28, puedeDevorar: false,
    resist: ["corte"], debil: ["golpe"],
    pesos: ["rellenito", "gordo", "obeso"],
    gota: [{ id: "escama_hidra", chance: 0.30 }, { id: "baba_pantano", chance: 0.25 }],
    ataqueEspecial: {
      chance: 0.35,
      flavor: [
        "@@enemies.hidra.ataqueEspecial.flavor.0",
        "@@enemies.hidra.ataqueEspecial.flavor.1",
      ],
      dano: 2, rango: 5, ignoraDef: false,
    },
    flavor: {
      encuentro: [
        "@@enemies.hidra.flavor.encuentro.0",
        "@@enemies.hidra.flavor.encuentro.1",
      ],
      cuerpo: {
        rellenito: "@@enemies.hidra.flavor.cuerpo.rellenito",
        gordo: "@@enemies.hidra.flavor.cuerpo.gordo",
        obeso: "@@enemies.hidra.flavor.cuerpo.obeso",
      },
      ataque: [
        "@@enemies.hidra.flavor.ataque.0",
        "@@enemies.hidra.flavor.ataque.1",
        "@@enemies.hidra.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.hidra.flavor.derrota.0",
        "@@enemies.hidra.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.hidra.flavor.victoria.0",
        "@@enemies.hidra.flavor.victoria.1",
      ],
    },
  },

  toro: {
    id: "toro",
    nombre: "@@enemies.toro.nombre",
    stats: [13, 4, 1, 11, 9, 11], vidaMax: 100, def: 4, dano: 4, rango: 6,
    masa: 95, xp: 75, oro: 30, puedeDevorar: false,
    resist: ["golpe"], debil: ["arcano"],
    pesos: ["gordo", "obeso", "fornido", "hipermusculoso"],
    gota: [{ id: "cuerno_toro", chance: 0.30 }],
    ataqueEspecial: {
      chance: 0.35,
      flavor: [
        "@@enemies.toro.ataqueEspecial.flavor.0",
        "@@enemies.toro.ataqueEspecial.flavor.1",
      ],
      dano: 4, rango: 7, ignoraDef: false,
    },
    flavor: {
      encuentro: [
        "@@enemies.toro.flavor.encuentro.0",
        "@@enemies.toro.flavor.encuentro.1",
      ],
      cuerpo: {
        gordo: "@@enemies.toro.flavor.cuerpo.gordo",
        obeso: "@@enemies.toro.flavor.cuerpo.obeso",
        hipermusculoso: "@@enemies.toro.flavor.cuerpo.hipermusculoso",
      },
      ataque: [
        "@@enemies.toro.flavor.ataque.0",
        "@@enemies.toro.flavor.ataque.1",
        "@@enemies.toro.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.toro.flavor.derrota.0",
        "@@enemies.toro.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.toro.flavor.victoria.0",
        "@@enemies.toro.flavor.victoria.1",
      ],
    },
  },

  // ---- JEFES DE MINI-EVENTOS ----

  jefeBandidos: {
    id: "jefeBandidos",
    nombre: "@@enemies.jefeBandidos.nombre",
    stats: [9, 9, 7, 7, 7, 7], vidaMax: 90, def: 3, dano: 3, rango: 6,
    masa: 60, xp: 100, oro: 50, puedeDevorar: false,
    pesos: ["promedio", "gordo", "fornido"],
    gota: [{ id: "esencia_bosque", chance: 1.0 }],
    ataqueEspecial: {
      chance: 0.30,
      flavor: [
        "@@enemies.jefeBandidos.ataqueEspecial.flavor.0",
      ],
      dano: 3, rango: 6, ignoraDef: false,
    },
    flavor: {
      encuentro: "@@enemies.jefeBandidos.flavor.encuentro",
      ataque: [
        "@@enemies.jefeBandidos.flavor.ataque.0",
        "@@enemies.jefeBandidos.flavor.ataque.1",
        "@@enemies.jefeBandidos.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.jefeBandidos.flavor.derrota.0",
        "@@enemies.jefeBandidos.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.jefeBandidos.flavor.victoria.0",
      ],
    },
  },

  sumoSacerdote: {
    id: "sumoSacerdote",
    nombre: "@@enemies.sumoSacerdote.nombre",
    stats: [4, 6, 13, 5, 7, 5], vidaMax: 80, def: 2, dano: 3, rango: 7,
    tipoDano: "arcano", masa: 55, xp: 110, oro: 45, puedeDevorar: false,
    resist: ["arcano"], debil: ["corte"],
    pesos: ["flaco", "promedio"],
    gota: [{ id: "nucleo_pantano", chance: 1.0 }],
    ataqueEspecial: {
      chance: 0.35,
      flavor: [
        "@@enemies.sumoSacerdote.ataqueEspecial.flavor.0",
        "@@enemies.sumoSacerdote.ataqueEspecial.flavor.1",
      ],
      dano: 3, rango: 7, ignoraDef: true,
    },
    flavor: {
      encuentro: "@@enemies.sumoSacerdote.flavor.encuentro",
      ataque: [
        "@@enemies.sumoSacerdote.flavor.ataque.0",
        "@@enemies.sumoSacerdote.flavor.ataque.1",
      ],
      derrota: [
        "@@enemies.sumoSacerdote.flavor.derrota.0",
      ],
      victoria: [
        "@@enemies.sumoSacerdote.flavor.victoria.0",
      ],
    },
  },

  magoCampamento: {
    id: "magoCampamento",
    nombre: "@@enemies.magoCampamento.nombre",
    stats: [3, 5, 10, 4, 5, 4], vidaMax: 55, def: 1, dano: 3, rango: 7,
    tipoDano: "arcano", masa: 50, xp: 60, oro: 20, puedeDevorar: false,
    resist: ["arcano"], debil: ["golpe"],
    pesos: ["flaco", "promedio"],
    flavor: {
      encuentro: [
        "@@enemies.magoCampamento.flavor.encuentro.0",
        "@@enemies.magoCampamento.flavor.encuentro.1",
      ],
      ataque: [
        "@@enemies.magoCampamento.flavor.ataque.0",
        "@@enemies.magoCampamento.flavor.ataque.1",
      ],
      derrota: [
        "@@enemies.magoCampamento.flavor.derrota.0",
      ],
      victoria: [
        "@@enemies.magoCampamento.flavor.victoria.0",
      ],
    },
  },

  archimago: {
    id: "archimago",
    nombre: "@@enemies.archimago.nombre",
    stats: [5, 7, 16, 6, 8, 6], vidaMax: 115, def: 2, dano: 3, rango: 9,
    tipoDano: "arcano", masa: 60, xp: 130, oro: 60, puedeDevorar: false,
    resist: ["arcano", "corte"], debil: ["golpe"],
    pesos: ["flaco", "promedio"],
    gota: [{ id: "cristal_escarcha", chance: 1.0 }],
    ataqueEspecial: {
      chance: 0.40,
      flavor: [
        "@@enemies.archimago.ataqueEspecial.flavor.0",
        "@@enemies.archimago.ataqueEspecial.flavor.1",
      ],
      dano: 3, rango: 9, ignoraDef: true,
    },
    flavor: {
      encuentro: [
        "@@enemies.archimago.flavor.encuentro.0",
        "@@enemies.archimago.flavor.encuentro.1",
      ],
      ataque: [
        "@@enemies.archimago.flavor.ataque.0",
        "@@enemies.archimago.flavor.ataque.1",
        "@@enemies.archimago.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.archimago.flavor.derrota.0",
        "@@enemies.archimago.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.archimago.flavor.victoria.0",
      ],
    },
  },

  oso: {
    id: "oso",
    nombre: "@@enemies.oso.nombre",
    stats: [8, 3, 3, 9, 8, 9], vidaMax: 72, def: 3, dano: 3, rango: 6,
    masa: 92, xp: 60, oro: 20, puedeDevorar: true,
    debil: ["corte"],
    gota: [{ id: "zarpa_osa", chance: 0.25 }],
    pesos: ["promedio", "gordo", "obeso", "ultraObeso", "fornido"],
    flavor: {
      encuentro: "@@enemies.oso.flavor.encuentro",
      cuerpo: {
        gordo: "@@enemies.oso.flavor.cuerpo.gordo",
        obeso: "@@enemies.oso.flavor.cuerpo.obeso",
        ultraObeso: "@@enemies.oso.flavor.cuerpo.ultraObeso",
        fornido: "@@enemies.oso.flavor.cuerpo.fornido",
      },
      ataque: [
        "@@enemies.oso.flavor.ataque.0",
        "@@enemies.oso.flavor.ataque.1",
        "@@enemies.oso.flavor.ataque.2",
        "@@enemies.oso.flavor.ataque.3",
      ],
      derrota: [
        "@@enemies.oso.flavor.derrota.0",
        "@@enemies.oso.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.oso.flavor.victoria.0",
        "@@enemies.oso.flavor.victoria.1",
      ],
    },
  },

  sapo: {
    id: "sapo",
    nombre: "@@enemies.sapo.nombre",
    stats: [4, 4, 2, 5, 11, 6], vidaMax: 42, def: 1, dano: 2, rango: 5,
    masa: 70, xp: 45, oro: 16, puedeDevorar: true,
    debil: ["golpe"],
    gota: [{ id: "baba_pantano", chance: 0.20 }],
    pesos: ["rellenito", "gordo", "obeso", "ultraObeso"],
    flavor: {
      encuentro: "@@enemies.sapo.flavor.encuentro",
      cuerpo: {
        rellenito: "@@enemies.sapo.flavor.cuerpo.rellenito",
        gordo: "@@enemies.sapo.flavor.cuerpo.gordo",
        obeso: "@@enemies.sapo.flavor.cuerpo.obeso",
        ultraObeso: "@@enemies.sapo.flavor.cuerpo.ultraObeso",
      },
      ataque: [
        "@@enemies.sapo.flavor.ataque.0",
        "@@enemies.sapo.flavor.ataque.1",
        "@@enemies.sapo.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.sapo.flavor.derrota.0",
        "@@enemies.sapo.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.sapo.flavor.victoria.0",
        "@@enemies.sapo.flavor.victoria.1",
      ],
    },
  },

  carnero: {
    id: "carnero",
    nombre: "@@enemies.carnero.nombre",
    stats: [8, 6, 3, 7, 4, 7], vidaMax: 55, def: 2, dano: 3, rango: 6,
    masa: 65, xp: 52, oro: 20, puedeDevorar: false,
    resist: ["golpe"], debil: ["corte"],
    pesos: ["promedio", "gordo", "fornido", "hipermusculoso"],
    flavor: {
      encuentro: "@@enemies.carnero.flavor.encuentro",
      cuerpo: {
        gordo: "@@enemies.carnero.flavor.cuerpo.gordo",
        fornido: "@@enemies.carnero.flavor.cuerpo.fornido",
        hipermusculoso: "@@enemies.carnero.flavor.cuerpo.hipermusculoso",
      },
      ataque: [
        "@@enemies.carnero.flavor.ataque.0",
        "@@enemies.carnero.flavor.ataque.1",
        "@@enemies.carnero.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.carnero.flavor.derrota.0",
        "@@enemies.carnero.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.carnero.flavor.victoria.0",
        "@@enemies.carnero.flavor.victoria.1",
      ],
    },
  },

  puma: {
    id: "puma",
    nombre: "@@enemies.puma.nombre",
    stats: [8, 11, 4, 6, 5, 6], vidaMax: 50, def: 1, dano: 2, rango: 6,
    masa: 52, xp: 45, oro: 16, puedeDevorar: true,
    debil: ["arcano"],
    gota: [{ id: "garra_puma", chance: 0.25 }],
    pesos: ["flaco", "promedio", "gordo", "fornido"],
    flavor: {
      encuentro: [
        "@@enemies.puma.flavor.encuentro.0",
        "@@enemies.puma.flavor.encuentro.1",
      ],
      cuerpo: {
        gordo: "@@enemies.puma.flavor.cuerpo.gordo",
        fornido: "@@enemies.puma.flavor.cuerpo.fornido",
      },
      ataque: [
        "@@enemies.puma.flavor.ataque.0",
        "@@enemies.puma.flavor.ataque.1",
        "@@enemies.puma.flavor.ataque.2",
        "@@enemies.puma.flavor.ataque.3",
      ],
      derrota: [
        "@@enemies.puma.flavor.derrota.0",
        "@@enemies.puma.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.puma.flavor.victoria.0",
        "@@enemies.puma.flavor.victoria.1",
      ],
    },
  },

  /* ===================== ENEMIGOS COSTEROS (bioma: playa) ===================== */

  anguila: {
    id: "anguila",
    nombre: "@@enemies.anguila.nombre",
    stats: [5, 10, 3, 8, 8, 7], vidaMax: 72, def: 1, dano: 2, rango: 7,
    masa: 70, xp: 68, oro: 28, puedeDevorar: true,
    debil: ["golpe"],
    gota: [{ id: "escama_marina", chance: 0.25 }],
    pesos: ["flaco", "promedio", "gordo", "fornido"],
    flavor: {
      encuentro: [
        "@@enemies.anguila.flavor.encuentro.0",
        "@@enemies.anguila.flavor.encuentro.1",
      ],
      cuerpo: {
        gordo: "@@enemies.anguila.flavor.cuerpo.gordo",
        fornido: "@@enemies.anguila.flavor.cuerpo.fornido",
      },
      ataque: [
        "@@enemies.anguila.flavor.ataque.0",
        "@@enemies.anguila.flavor.ataque.1",
        "@@enemies.anguila.flavor.ataque.2",
        "@@enemies.anguila.flavor.ataque.3",
      ],
      derrota: [
        "@@enemies.anguila.flavor.derrota.0",
        "@@enemies.anguila.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.anguila.flavor.victoria.0",
        "@@enemies.anguila.flavor.victoria.1",
      ],
    },
  },

  tiburon: {
    id: "tiburon",
    nombre: "@@enemies.tiburon.nombre",
    stats: [11, 9, 2, 10, 7, 10], vidaMax: 95, def: 2, dano: 3, rango: 7,
    masa: 90, xp: 80, oro: 32, puedeDevorar: false,
    resist: ["corte"], debil: ["arcano"],
    pesos: ["promedio", "gordo", "obeso", "fornido"],
    ataqueEspecial: {
      chance: 0.30,
      flavor: [
        "@@enemies.tiburon.ataqueEspecial.flavor.0",
        "@@enemies.tiburon.ataqueEspecial.flavor.1",
      ],
      dano: 3, rango: 7, ignoraDef: false,
    },
    flavor: {
      encuentro: [
        "@@enemies.tiburon.flavor.encuentro.0",
        "@@enemies.tiburon.flavor.encuentro.1",
      ],
      cuerpo: {
        gordo: "@@enemies.tiburon.flavor.cuerpo.gordo",
        obeso: "@@enemies.tiburon.flavor.cuerpo.obeso",
        fornido: "@@enemies.tiburon.flavor.cuerpo.fornido",
      },
      ataque: [
        "@@enemies.tiburon.flavor.ataque.0",
        "@@enemies.tiburon.flavor.ataque.1",
        "@@enemies.tiburon.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.tiburon.flavor.derrota.0",
        "@@enemies.tiburon.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.tiburon.flavor.victoria.0",
        "@@enemies.tiburon.flavor.victoria.1",
      ],
    },
  },

  cangrejo: {
    id: "cangrejo",
    nombre: "@@enemies.cangrejo.nombre",
    stats: [9, 3, 1, 12, 6, 13], vidaMax: 110, def: 6, dano: 3, rango: 5,
    masa: 85, xp: 85, oro: 35, puedeDevorar: false,
    resist: ["golpe", "corte"], debil: ["arcano"],
    pesos: ["promedio", "gordo", "obeso", "hipermusculoso"],
    ataqueEspecial: {
      chance: 0.25,
      flavor: [
        "@@enemies.cangrejo.ataqueEspecial.flavor.0",
        "@@enemies.cangrejo.ataqueEspecial.flavor.1",
      ],
      dano: 4, rango: 6, ignoraDef: false,
    },
    flavor: {
      encuentro: [
        "@@enemies.cangrejo.flavor.encuentro.0",
        "@@enemies.cangrejo.flavor.encuentro.1",
      ],
      cuerpo: {
        gordo: "@@enemies.cangrejo.flavor.cuerpo.gordo",
        obeso: "@@enemies.cangrejo.flavor.cuerpo.obeso",
        hipermusculoso: "@@enemies.cangrejo.flavor.cuerpo.hipermusculoso",
      },
      ataque: [
        "@@enemies.cangrejo.flavor.ataque.0",
        "@@enemies.cangrejo.flavor.ataque.1",
        "@@enemies.cangrejo.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.cangrejo.flavor.derrota.0",
        "@@enemies.cangrejo.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.cangrejo.flavor.victoria.0",
        "@@enemies.cangrejo.flavor.victoria.1",
      ],
    },
  },

  calamar: {
    id: "calamar",
    nombre: "@@enemies.calamar.nombre",
    stats: [4, 8, 9, 7, 8, 8], vidaMax: 65, def: 1, dano: 2, rango: 8,
    tipoDano: "arcano", masa: 75, xp: 72, oro: 30, puedeDevorar: true,
    resist: ["arcano"], debil: ["corte"],
    gota: [{ id: "concha_calamar", chance: 0.30 }],
    pesos: ["promedio", "gordo", "obeso"],
    ataqueEspecial: {
      chance: 0.35,
      flavor: [
        "@@enemies.calamar.ataqueEspecial.flavor.0",
        "@@enemies.calamar.ataqueEspecial.flavor.1",
      ],
      dano: 2, rango: 7, ignoraDef: true,
    },
    flavor: {
      encuentro: [
        "@@enemies.calamar.flavor.encuentro.0",
        "@@enemies.calamar.flavor.encuentro.1",
      ],
      cuerpo: {
        gordo: "@@enemies.calamar.flavor.cuerpo.gordo",
        obeso: "@@enemies.calamar.flavor.cuerpo.obeso",
      },
      ataque: [
        "@@enemies.calamar.flavor.ataque.0",
        "@@enemies.calamar.flavor.ataque.1",
        "@@enemies.calamar.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.calamar.flavor.derrota.0",
        "@@enemies.calamar.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.calamar.flavor.victoria.0",
        "@@enemies.calamar.flavor.victoria.1",
      ],
    },
  },

  gigante: {
    id: "gigante",
    nombre: "@@enemies.gigante.nombre",
    stats: [14, 2, 2, 12, 10, 14], vidaMax: 160, def: 4, dano: 5, rango: 8,
    masa: 110, xp: 90, oro: 35, puedeDevorar: true,
    resist: ["corte"], debil: ["arcano"],
    gota: [{ id: "escarcha_gigante", chance: 0.25 }],
    ataqueEspecial: {
      chance: 0.35,
      flavor: [
        "@@enemies.gigante.ataqueEspecial.flavor.0",
        "@@enemies.gigante.ataqueEspecial.flavor.1",
      ],
      dano: 5, rango: 7, ignoraDef: false,
    },
    pesos: ["gordo", "obeso", "ultraObeso"],
    flavor: {
      encuentro: [
        "@@enemies.gigante.flavor.encuentro.0",
        "@@enemies.gigante.flavor.encuentro.1",
      ],
      ataque: [
        "@@enemies.gigante.flavor.ataque.0",
        "@@enemies.gigante.flavor.ataque.1",
        "@@enemies.gigante.flavor.ataque.2",
        "@@enemies.gigante.flavor.ataque.3",
      ],
      derrota: [
        "@@enemies.gigante.flavor.derrota.0",
        "@@enemies.gigante.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.gigante.flavor.victoria.0",
        "@@enemies.gigante.flavor.victoria.1",
      ],
      cuerpo: {
        gordo: "@@enemies.gigante.flavor.cuerpo.gordo",
        obeso: "@@enemies.gigante.flavor.cuerpo.obeso",
        ultraObeso: [
          "@@enemies.gigante.flavor.cuerpo.ultraObeso.0",
          "@@enemies.gigante.flavor.cuerpo.ultraObeso.1",
        ],
      },
    },
  },


  /* ===================== ENEMIGOS DEL OCÉANO (bioma: oceano) ===================== */
  raya_honda: {
    id: "raya_honda",
    nombre: "@@enemies.raya_honda.nombre",
    stats: [5, 8, 3, 5, 4, 6], vidaMax: 55, def: 2, dano: 2, rango: 6,
    masa: 58, xp: 50, oro: 20, puedeDevorar: false,
    debil: ["golpe"], tipoDano: "corte",
    gota: [{ id: "escama_abisal", chance: 0.25 }],
    pesos: ["flaco", "promedio", "gordo"],
    flavor: {
      encuentro: "@@enemies.raya_honda.flavor.encuentro",
      ataque: [
        "@@enemies.raya_honda.flavor.ataque.0",
        "@@enemies.raya_honda.flavor.ataque.1",
        "@@enemies.raya_honda.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.raya_honda.flavor.derrota.0",
        "@@enemies.raya_honda.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.raya_honda.flavor.victoria.0",
        "@@enemies.raya_honda.flavor.victoria.1",
      ],
    },
  },

  pulpo_abismal: {
    id: "pulpo_abismal",
    nombre: "@@enemies.pulpo_abismal.nombre",
    stats: [7, 5, 6, 6, 8, 7], vidaMax: 68, def: 1, dano: 3, rango: 6,
    masa: 80, xp: 60, oro: 24, puedeDevorar: true,
    debil: ["corte"],
    gota: [{ id: "tentaculo_salado", chance: 0.30 }],
    pesos: ["promedio", "gordo", "obeso"],
    flavor: {
      encuentro: "@@enemies.pulpo_abismal.flavor.encuentro",
      ataque: [
        "@@enemies.pulpo_abismal.flavor.ataque.0",
        "@@enemies.pulpo_abismal.flavor.ataque.1",
        "@@enemies.pulpo_abismal.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.pulpo_abismal.flavor.derrota.0",
        "@@enemies.pulpo_abismal.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.pulpo_abismal.flavor.victoria.0",
        "@@enemies.pulpo_abismal.flavor.victoria.1",
      ],
    },
  },

  medusa_voraz: {
    id: "medusa_voraz",
    nombre: "@@enemies.medusa_voraz.nombre",
    stats: [3, 9, 7, 4, 3, 5], vidaMax: 44, def: 0, dano: 2, rango: 7,
    masa: 40, xp: 48, oro: 18, puedeDevorar: false,
    tipoDano: "arcano", debil: ["golpe"],
    gota: [{ id: "tentaculo_salado", chance: 0.20 }],
    pesos: ["flaco", "promedio", "rellenito"],
    flavor: {
      encuentro: "@@enemies.medusa_voraz.flavor.encuentro",
      ataque: [
        "@@enemies.medusa_voraz.flavor.ataque.0",
        "@@enemies.medusa_voraz.flavor.ataque.1",
        "@@enemies.medusa_voraz.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.medusa_voraz.flavor.derrota.0",
        "@@enemies.medusa_voraz.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.medusa_voraz.flavor.victoria.0",
        "@@enemies.medusa_voraz.flavor.victoria.1",
      ],
    },
  },

  serpiente_marina: {
    id: "serpiente_marina",
    nombre: "@@enemies.serpiente_marina.nombre",
    stats: [6, 7, 4, 6, 5, 7], vidaMax: 60, def: 3, dano: 3, rango: 5,
    masa: 65, xp: 55, oro: 22, puedeDevorar: true,
    tipoDano: "corte", debil: ["arcano"],
    gota: [{ id: "escama_abisal", chance: 0.30 }],
    pesos: ["promedio", "gordo", "fornido"],
    flavor: {
      encuentro: "@@enemies.serpiente_marina.flavor.encuentro",
      ataque: [
        "@@enemies.serpiente_marina.flavor.ataque.0",
        "@@enemies.serpiente_marina.flavor.ataque.1",
        "@@enemies.serpiente_marina.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.serpiente_marina.flavor.derrota.0",
        "@@enemies.serpiente_marina.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.serpiente_marina.flavor.victoria.0",
        "@@enemies.serpiente_marina.flavor.victoria.1",
      ],
    },
  },

  /* --- Jefe del Océano: Titán Marino (10% del 50% de encuentro en barco) --- */
  titan_marino: {
    id: "titan_marino",
    nombre: "@@enemies.titan_marino.nombre",
    stats: [14, 5, 6, 12, 10, 14], vidaMax: 200, def: 6, dano: 5, rango: 7,
    masa: 200, xp: 300, oro: 120, puedeDevorar: true,
    tipoDano: "golpe", resist: ["corte"], debil: ["arcano"],
    gota: [{ id: "nucleo_titan", chance: 1.0 }],
    pesos: ["obeso", "ultraObeso"],
    ataqueEspecial: {
      chance: 0.30,
      flavor: [
        "@@enemies.titan_marino.ataqueEspecial.flavor.0",
        "@@enemies.titan_marino.ataqueEspecial.flavor.1",
      ],
      dano: 7, rango: 8, ignoraDef: false,
    },
    flavor: {
      encuentro: [
        "@@enemies.titan_marino.flavor.encuentro.0",
        "@@enemies.titan_marino.flavor.encuentro.1",
      ],
      ataque: [
        "@@enemies.titan_marino.flavor.ataque.0",
        "@@enemies.titan_marino.flavor.ataque.1",
        "@@enemies.titan_marino.flavor.ataque.2",
        "@@enemies.titan_marino.flavor.ataque.3",
      ],
      derrota: [
        "@@enemies.titan_marino.flavor.derrota.0",
        "@@enemies.titan_marino.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.titan_marino.flavor.victoria.0",
        "@@enemies.titan_marino.flavor.victoria.1",
      ],
    },
  },

  /* ===================== ENEMIGOS DEL DESIERTO (bioma: desierto) ===================== */
  escorpion_solakh: {
    id: "escorpion_solakh",
    nombre: "@@enemies.escorpion_solakh.nombre",
    stats: [6, 7, 3, 5, 4, 5], vidaMax: 50, def: 4, dano: 3, rango: 5,
    masa: 50, xp: 52, oro: 20, puedeDevorar: false,
    tipoDano: "corte", debil: ["golpe"],
    gota: [{ id: "veneno_escorpion", chance: 0.30 }],
    pesos: ["flaco", "promedio", "rellenito", "gordo"],
    flavor: {
      encuentro: "@@enemies.escorpion_solakh.flavor.encuentro",
      ataque: [
        "@@enemies.escorpion_solakh.flavor.ataque.0",
        "@@enemies.escorpion_solakh.flavor.ataque.1",
        "@@enemies.escorpion_solakh.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.escorpion_solakh.flavor.derrota.0",
        "@@enemies.escorpion_solakh.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.escorpion_solakh.flavor.victoria.0",
        "@@enemies.escorpion_solakh.flavor.victoria.1",
      ],
    },
  },

  hiena_arenosa: {
    id: "hiena_arenosa",
    nombre: "@@enemies.hiena_arenosa.nombre",
    stats: [7, 8, 3, 6, 7, 6], vidaMax: 62, def: 1, dano: 3, rango: 5,
    masa: 70, xp: 58, oro: 22, puedeDevorar: true,
    debil: ["arcano"],
    pesos: ["promedio", "gordo", "obeso", "fornido"],
    flavor: {
      encuentro: "@@enemies.hiena_arenosa.flavor.encuentro",
      ataque: [
        "@@enemies.hiena_arenosa.flavor.ataque.0",
        "@@enemies.hiena_arenosa.flavor.ataque.1",
        "@@enemies.hiena_arenosa.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.hiena_arenosa.flavor.derrota.0",
        "@@enemies.hiena_arenosa.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.hiena_arenosa.flavor.victoria.0",
        "@@enemies.hiena_arenosa.flavor.victoria.1",
      ],
    },
  },

  lagarto_calor: {
    id: "lagarto_calor",
    nombre: "@@enemies.lagarto_calor.nombre",
    stats: [5, 5, 2, 7, 8, 7], vidaMax: 70, def: 5, dano: 2, rango: 6,
    masa: 90, xp: 60, oro: 24, puedeDevorar: false,
    resist: ["arcano"], debil: ["corte"],
    gota: [{ id: "escama_calor", chance: 0.30 }],
    pesos: ["promedio", "gordo", "obeso", "ultraObeso"],
    flavor: {
      encuentro: "@@enemies.lagarto_calor.flavor.encuentro",
      ataque: [
        "@@enemies.lagarto_calor.flavor.ataque.0",
        "@@enemies.lagarto_calor.flavor.ataque.1",
        "@@enemies.lagarto_calor.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.lagarto_calor.flavor.derrota.0",
        "@@enemies.lagarto_calor.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.lagarto_calor.flavor.victoria.0",
        "@@enemies.lagarto_calor.flavor.victoria.1",
      ],
    },
  },

  serpiente_sol: {
    id: "serpiente_sol",
    nombre: "@@enemies.serpiente_sol.nombre",
    stats: [4, 10, 5, 4, 3, 4], vidaMax: 40, def: 1, dano: 2, rango: 5,
    masa: 38, xp: 48, oro: 18, puedeDevorar: false,
    tipoDano: "corte", debil: ["golpe"],
    gota: [{ id: "veneno_escorpion", chance: 0.20 }, { id: "escama_calor", chance: 0.15 }],
    pesos: ["flaco", "promedio", "rellenito"],
    flavor: {
      encuentro: "@@enemies.serpiente_sol.flavor.encuentro",
      ataque: [
        "@@enemies.serpiente_sol.flavor.ataque.0",
        "@@enemies.serpiente_sol.flavor.ataque.1",
        "@@enemies.serpiente_sol.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.serpiente_sol.flavor.derrota.0",
        "@@enemies.serpiente_sol.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.serpiente_sol.flavor.victoria.0",
        "@@enemies.serpiente_sol.flavor.victoria.1",
      ],
    },
  },

  /* --- Jefe del Desierto: Gusano de Arena --- */
  gusano_arena: {
    id: "gusano_arena",
    nombre: "@@enemies.gusano_arena.nombre",
    stats: [13, 3, 4, 14, 12, 15], vidaMax: 230, def: 7, dano: 5, rango: 7,
    masa: 220, xp: 350, oro: 140, puedeDevorar: false,
    tipoDano: "golpe", resist: ["corte", "golpe"], debil: ["arcano"],
    gota: [{ id: "nucleo_arenoso", chance: 1.0 }],
    pesos: ["gordo", "obeso", "ultraObeso"],
    ataqueEspecial: {
      chance: 0.30,
      flavor: [
        "@@enemies.gusano_arena.ataqueEspecial.flavor.0",
        "@@enemies.gusano_arena.ataqueEspecial.flavor.1",
      ],
      dano: 6, rango: 8, ignoraDef: true,
    },
    flavor: {
      encuentro: [
        "@@enemies.gusano_arena.flavor.encuentro.0",
        "@@enemies.gusano_arena.flavor.encuentro.1",
      ],
      ataque: [
        "@@enemies.gusano_arena.flavor.ataque.0",
        "@@enemies.gusano_arena.flavor.ataque.1",
        "@@enemies.gusano_arena.flavor.ataque.2",
        "@@enemies.gusano_arena.flavor.ataque.3",
      ],
      derrota: [
        "@@enemies.gusano_arena.flavor.derrota.0",
        "@@enemies.gusano_arena.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.gusano_arena.flavor.victoria.0",
        "@@enemies.gusano_arena.flavor.victoria.1",
      ],
    },
  },

  /* ===================== ENEMIGOS DEL GRAN MANTO (bioma: megaflora) ===================== */
  hongo_andante: {
    id: "hongo_andante",
    nombre: "@@enemies.hongo_andante.nombre",
    stats: [4, 3, 6, 7, 10, 6], vidaMax: 58, def: 2, dano: 2, rango: 7,
    masa: 55, xp: 50, oro: 20, puedeDevorar: false,
    tipoDano: "arcano", debil: ["corte"],
    gota: [{ id: "esporo_gigante", chance: 0.30 }],
    pesos: ["promedio", "gordo", "obeso"],
    flavor: {
      encuentro: "@@enemies.hongo_andante.flavor.encuentro",
      ataque: [
        "@@enemies.hongo_andante.flavor.ataque.0",
        "@@enemies.hongo_andante.flavor.ataque.1",
        "@@enemies.hongo_andante.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.hongo_andante.flavor.derrota.0",
        "@@enemies.hongo_andante.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.hongo_andante.flavor.victoria.0",
        "@@enemies.hongo_andante.flavor.victoria.1",
      ],
    },
  },

  babosa_colosal: {
    id: "babosa_colosal",
    nombre: "@@enemies.babosa_colosal.nombre",
    stats: [6, 2, 3, 10, 9, 9], vidaMax: 90, def: 3, dano: 3, rango: 5,
    masa: 120, xp: 65, oro: 26, puedeDevorar: true,
    debil: ["golpe"],
    gota: [{ id: "savia_antigua", chance: 0.25 }],
    pesos: ["gordo", "obeso", "ultraObeso"],
    flavor: {
      encuentro: "@@enemies.babosa_colosal.flavor.encuentro",
      ataque: [
        "@@enemies.babosa_colosal.flavor.ataque.0",
        "@@enemies.babosa_colosal.flavor.ataque.1",
        "@@enemies.babosa_colosal.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.babosa_colosal.flavor.derrota.0",
        "@@enemies.babosa_colosal.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.babosa_colosal.flavor.victoria.0",
        "@@enemies.babosa_colosal.flavor.victoria.1",
      ],
    },
  },

  enredadera_voraz: {
    id: "enredadera_voraz",
    nombre: "@@enemies.enredadera_voraz.nombre",
    stats: [8, 2, 5, 8, 7, 8], vidaMax: 75, def: 2, dano: 3, rango: 6,
    masa: 70, xp: 58, oro: 22, puedeDevorar: true,
    tipoDano: "golpe", debil: ["corte"],
    gota: [{ id: "savia_antigua", chance: 0.30 }, { id: "esporo_gigante", chance: 0.15 }],
    pesos: ["promedio", "gordo", "obeso"],
    flavor: {
      encuentro: "@@enemies.enredadera_voraz.flavor.encuentro",
      ataque: [
        "@@enemies.enredadera_voraz.flavor.ataque.0",
        "@@enemies.enredadera_voraz.flavor.ataque.1",
        "@@enemies.enredadera_voraz.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.enredadera_voraz.flavor.derrota.0",
        "@@enemies.enredadera_voraz.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.enredadera_voraz.flavor.victoria.0",
        "@@enemies.enredadera_voraz.flavor.victoria.1",
      ],
    },
  },

  jabali_selva: {
    id: "jabali_selva",
    nombre: "@@enemies.jabali_selva.nombre",
    stats: [10, 5, 2, 8, 8, 9], vidaMax: 80, def: 3, dano: 4, rango: 6,
    masa: 100, xp: 65, oro: 26, puedeDevorar: false,
    debil: ["arcano"],
    pesos: ["promedio", "gordo", "obeso", "fornido", "hipermusculoso"],
    flavor: {
      encuentro: "@@enemies.jabali_selva.flavor.encuentro",
      ataque: [
        "@@enemies.jabali_selva.flavor.ataque.0",
        "@@enemies.jabali_selva.flavor.ataque.1",
        "@@enemies.jabali_selva.flavor.ataque.2",
      ],
      derrota: [
        "@@enemies.jabali_selva.flavor.derrota.0",
        "@@enemies.jabali_selva.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.jabali_selva.flavor.victoria.0",
        "@@enemies.jabali_selva.flavor.victoria.1",
      ],
    },
  },

  /* --- Jefe del Gran Manto: Guardián del Manto --- */
  guardian_manto: {
    id: "guardian_manto",
    nombre: "@@enemies.guardian_manto.nombre",
    stats: [12, 4, 8, 14, 11, 14], vidaMax: 240, def: 5, dano: 5, rango: 7,
    masa: 210, xp: 360, oro: 145, puedeDevorar: false,
    tipoDano: "arcano", resist: ["golpe"], debil: ["corte"],
    gota: [{ id: "corazon_bosque", chance: 1.0 }],
    pesos: ["gordo", "obeso", "ultraObeso"],
    ataqueEspecial: {
      chance: 0.30,
      flavor: [
        "@@enemies.guardian_manto.ataqueEspecial.flavor.0",
        "@@enemies.guardian_manto.ataqueEspecial.flavor.1",
      ],
      dano: 6, rango: 7, ignoraDef: false,
    },
    flavor: {
      encuentro: [
        "@@enemies.guardian_manto.flavor.encuentro.0",
        "@@enemies.guardian_manto.flavor.encuentro.1",
      ],
      ataque: [
        "@@enemies.guardian_manto.flavor.ataque.0",
        "@@enemies.guardian_manto.flavor.ataque.1",
        "@@enemies.guardian_manto.flavor.ataque.2",
        "@@enemies.guardian_manto.flavor.ataque.3",
      ],
      derrota: [
        "@@enemies.guardian_manto.flavor.derrota.0",
        "@@enemies.guardian_manto.flavor.derrota.1",
      ],
      victoria: [
        "@@enemies.guardian_manto.flavor.victoria.0",
        "@@enemies.guardian_manto.flavor.victoria.1",
      ],
    },
  },
};

/* Pools por bioma -> qué enemigos aparecen en encuentros aleatorios */
GD.enemyPools = {
  bosque:   ["conejoGordo", "lobo", "bandido", "oso"],
  pantano:  ["glotoncillo", "cultista", "sapo", "hidra"],
  llanura:  ["jabali", "bandido", "carnero", "toro"],
  colinas:  ["jabali", "cultista", "coloso", "oso"],
  montana:  ["puma", "gigante"],
  playa:    ["anguila", "tiburon", "cangrejo", "calamar"],
  // Océano: los jefes se manejan aparte desde el motor del barco
  oceano:   ["raya_honda", "pulpo_abismal", "medusa_voraz", "serpiente_marina"],
  desierto: ["escorpion_solakh", "hiena_arenosa", "lagarto_calor", "serpiente_sol"],
  megaflora: ["hongo_andante", "babosa_colosal", "enredadera_voraz", "jabali_selva"],
};
