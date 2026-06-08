/* ============================================================
   MINI-EVENTOS ENCADENADOS  —  secuencias con combate y narrativa
   ------------------------------------------------------------
   zona:      id de la zona donde puede aparecer
   forzado:   false = el jugador elige si entrar; true = sin opción
   chance:    probabilidad de que este mini-evento dispare cuando
              toca un evento aleatorio en esa zona (0..1)
   pasos:     array de pasos en orden
     { tipo:"texto", texto:{es,en} }
     { tipo:"combate", enemyId, esBoss }
   drops:     items garantizados al completar (array de {id,cant})
   ============================================================ */
window.GD = window.GD || {};

GD.miniEventos = {

  ruinas_bosque: {
    id: "ruinas_bosque",
    zona: "senda",
    chance: 0.30,
    forzado: false,
    intro: "@@miniEventos.ruinas_bosque.intro",
    opcionEntrar: "@@miniEventos.ruinas_bosque.opcionEntrar",
    opcionIgnorar: "@@miniEventos.ruinas_bosque.opcionIgnorar",
    pasos: [
      {
        tipo: "texto",
        texto: "@@miniEventos.ruinas_bosque.pasos.0.texto",
      },
      { tipo: "combate", enemyId: "bandido" },
      {
        tipo: "texto",
        texto: "@@miniEventos.ruinas_bosque.pasos.2.texto",
      },
      { tipo: "combate", enemyId: "bandido" },
      {
        tipo: "texto",
        texto: "@@miniEventos.ruinas_bosque.pasos.4.texto",
      },
      { tipo: "combate", enemyId: "jefeBandidos", esBoss: true },
    ],
    drops: [],
    textoFin: "@@miniEventos.ruinas_bosque.textoFin",
  },

  ritual_pantano: {
    id: "ritual_pantano",
    zona: "claro",
    chance: 0.30,
    forzado: false,
    intro: "@@miniEventos.ritual_pantano.intro",
    opcionEntrar: "@@miniEventos.ritual_pantano.opcionEntrar",
    opcionIgnorar: "@@miniEventos.ritual_pantano.opcionIgnorar",
    pasos: [
      {
        tipo: "texto",
        texto: "@@miniEventos.ritual_pantano.pasos.0.texto",
      },
      { tipo: "combate", enemyId: "cultista" },
      { tipo: "combate", enemyId: "cultista" },
      {
        tipo: "texto",
        texto: "@@miniEventos.ritual_pantano.pasos.3.texto",
      },
      { tipo: "combate", enemyId: "sumoSacerdote", esBoss: true },
    ],
    drops: [],
    textoFin: "@@miniEventos.ritual_pantano.textoFin",
  },

  campamento_magos: {
    id: "campamento_magos",
    zona: "paso_norte",
    chance: 0.35,
    forzado: true,
    intro: "@@miniEventos.campamento_magos.intro",
    pasos: [
      {
        tipo: "texto",
        texto: "@@miniEventos.campamento_magos.pasos.0.texto",
      },
      { tipo: "combate", enemyId: "magoCampamento" },
      {
        tipo: "texto",
        texto: "@@miniEventos.campamento_magos.pasos.2.texto",
      },
      { tipo: "combate", enemyId: "magoCampamento" },
      {
        tipo: "texto",
        texto: "@@miniEventos.campamento_magos.pasos.4.texto",
      },
      { tipo: "combate", enemyId: "magoCampamento" },
      {
        tipo: "texto",
        texto: "@@miniEventos.campamento_magos.pasos.6.texto",
      },
      { tipo: "combate", enemyId: "archimago", esBoss: true },
    ],
    drops: [],
    textoFin: "@@miniEventos.campamento_magos.textoFin",
  },

};
