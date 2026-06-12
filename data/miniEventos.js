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

  /* ============================================================
     MINI-EVENTOS DE LAS ISLAS LEJANAS — jefes + misión secreta
     Cada cadena termina en el jefe de la isla y deja media pieza
     del Amuleto de Intimidación (drop único; al juntar las dos
     mitades se funden solas — ver chequearAmuletoIntimidacion).
     ============================================================ */

  templo_solakh: {
    id: "templo_solakh",
    zona: "arenales_solakh",
    chance: 0.35,
    forzado: false,
    intro: "@@miniEventos.templo_solakh.intro",
    opcionEntrar: "@@miniEventos.templo_solakh.opcionEntrar",
    opcionIgnorar: "@@miniEventos.templo_solakh.opcionIgnorar",
    pasos: [
      {
        tipo: "texto",
        texto: "@@miniEventos.templo_solakh.pasos.0.texto",
      },
      { tipo: "combate", enemyId: "escorpion_solakh" },
      {
        tipo: "texto",
        texto: "@@miniEventos.templo_solakh.pasos.2.texto",
      },
      { tipo: "combate", enemyId: "hiena_arenosa" },
      {
        tipo: "texto",
        texto: "@@miniEventos.templo_solakh.pasos.4.texto",
      },
      { tipo: "combate", enemyId: "gusano_arena", esBoss: true },
    ],
    drops: [{ id: "amuleto_mitad_sol", unico: true }],
    textoFin: "@@miniEventos.templo_solakh.textoFin",
  },

  corazon_manto: {
    id: "corazon_manto",
    zona: "gran_manto",
    chance: 0.35,
    forzado: false,
    intro: "@@miniEventos.corazon_manto.intro",
    opcionEntrar: "@@miniEventos.corazon_manto.opcionEntrar",
    opcionIgnorar: "@@miniEventos.corazon_manto.opcionIgnorar",
    pasos: [
      {
        tipo: "texto",
        texto: "@@miniEventos.corazon_manto.pasos.0.texto",
      },
      { tipo: "combate", enemyId: "enredadera_voraz" },
      {
        tipo: "texto",
        texto: "@@miniEventos.corazon_manto.pasos.2.texto",
      },
      { tipo: "combate", enemyId: "hongo_andante" },
      {
        tipo: "texto",
        texto: "@@miniEventos.corazon_manto.pasos.4.texto",
      },
      { tipo: "combate", enemyId: "guardian_manto", esBoss: true },
    ],
    drops: [{ id: "amuleto_mitad_raiz", unico: true }],
    textoFin: "@@miniEventos.corazon_manto.textoFin",
  },

};
