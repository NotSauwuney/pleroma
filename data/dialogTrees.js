/* ============================================================
   DIALOG TREES  —  árbol de diálogos por NPC
   ------------------------------------------------------------
   GD.dialogTrees[npcId]: definición del árbol de diálogos.

   Estructura de un nodo:
     {
       text: "clave @@ o string directo",   // texto que dice el NPC
       options: [                            // opciones del jugador
         {
           text: "clave de la opción",       // texto que elige el jugador
           next: "nodeId",                   // nodo al que ir (o "exit" para volver)
           cond: {                           // TODOS opcionales
             bond:     n,                   // nivel de vínculo >= n (0-4)
             peso:     n,                   // pesoIdx >= n
             flag:     "key",               // S.player.flags[key] === true
             decision: "key=value",         // S.player.decisions[key] === "value"
           },
           effect: {                         // TODOS opcionales; se aplican al elegir
             bondBonus:   n,                // suma n pts de vínculo
             setFlag:     "key",            // S.player.flags[key] = true
             setDecision: "key=value",      // S.player.decisions[key] = "value"
           },
           tone: "positive|negative|neutral",  // para tintes de afinidad futuros
         }
       ]
     }

   Nodo especial next: "exit" → cierra el árbol y vuelve a hablarNPC.

   El motor vive en engine/09_npcwg.js (startDialogTree / renderDialogNode).
   Los textos de los nodos van en data/lang/{es,en}.js bajo la clave
   "dialogTree.<npcId>.<nodeId>.*".

   ESTADO ACTUAL: infraestructura completa, contenido placeholder.
   Los nodos reales de diálogo, condiciones de romance/enemistad e impacto
   en tiendas se añaden en iteraciones futuras (ver PENDING.md).
   ============================================================ */
window.GD = window.GD || {};

GD.dialogTrees = {

  /* ----------------------------------------------------------
     BOREK — Tabernero
  ---------------------------------------------------------- */
  tabernero: {
    root: "inicio",
    nodes: {
      inicio: {
        text: "@@dialogTree.tabernero.inicio.text",
        options: [
          {
            text: "@@dialogTree.tabernero.inicio.opt.positivo",
            next: "respuesta_positiva",
            tone: "positive",
            effect: { bondBonus: 1, setDecision: "tabernero_tono=positivo" },
          },
          {
            text: "@@dialogTree.tabernero.inicio.opt.neutral",
            next: "respuesta_neutral",
            tone: "neutral",
          },
          {
            text: "@@dialogTree.tabernero.inicio.opt.negativo",
            next: "respuesta_negativa",
            tone: "negative",
            effect: { setDecision: "tabernero_tono=negativo" },
          },
          {
            text: "@@dialogTree.tabernero.inicio.opt.personal",
            next: "personal",
            tone: "positive",
            cond: { bond: 2 },
          },
          {
            text: "@@dialogTree.tabernero.inicio.opt.romance",
            next: "romance_placeholder",
            tone: "positive",
            cond: { bond: 4, decision: "tabernero_tono=positivo", relationship: "neutral" },
          },
          {
            text: "@@dialogTree.tabernero.inicio.opt.enamorado_visita",
            next: "enamorado_interacciones",
            tone: "positive",
            cond: { relationship: "enamorado" },
          },
          {
            text: "@@dialogTree.tabernero.inicio.opt.provocar",
            next: "enemistad_inicio",
            tone: "negative",
            cond: { decision: "tabernero_tono=negativo", relationship: "neutral" },
          },
          {
            text: "@@dialogTree.tabernero.inicio.opt.reconciliar",
            next: "reconciliar_placeholder",
            tone: "positive",
            cond: { relationship: "enemistado" },
          },
        ],
      },
      respuesta_positiva: {
        text: "@@dialogTree.tabernero.respuesta_positiva.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      respuesta_neutral: {
        text: "@@dialogTree.tabernero.respuesta_neutral.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      respuesta_negativa: {
        text: "@@dialogTree.tabernero.respuesta_negativa.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      personal: {
        text: "@@dialogTree.tabernero.personal.text",
        options: [
          {
            text: "@@dialogTree.tabernero.personal.opt.preguntar",
            next: "personal_profundo",
            tone: "positive",
            cond: { bond: 3 },
          },
          { text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" },
        ],
      },
      personal_profundo: {
        text: "@@dialogTree.tabernero.personal_profundo.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      romance_placeholder: {
        text: "@@dialogTree.tabernero.romance_placeholder.text",
        options: [
          {
            text: "@@dialogTree.tabernero.romance_placeholder.opt.declarar",
            next: "romance_confirmar",
            tone: "positive",
            effect: { setRelationship: "enamorado" },
          },
          {
            text: "@@dialogTree.tabernero.romance_placeholder.opt.esquivar",
            next: "exit",
            tone: "neutral",
          },
        ],
      },
      romance_confirmar: {
        text: "@@dialogTree.tabernero.romance_confirmar.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      enamorado_interacciones: {
        text: "@@dialogTree.tabernero.enamorado_interacciones.text",
        options: [
          {
            text: "@@dialogTree.tabernero.enamorado_interacciones.opt.cita",
            next: "cita_placeholder",
            tone: "positive",
          },
          { text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" },
        ],
      },
      cita_placeholder: {
        text: "@@dialogTree.common.cita_placeholder_text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      enemistad_inicio: {
        text: "@@dialogTree.tabernero.enemistad_inicio.text",
        options: [
          {
            text: "@@dialogTree.tabernero.enemistad_inicio.opt.escalar",
            next: "enemistad_confirmar",
            tone: "negative",
            effect: { setRelationship: "enemistado" },
          },
          {
            text: "@@dialogTree.tabernero.enemistad_inicio.opt.retroceder",
            next: "exit",
            tone: "neutral",
          },
        ],
      },
      enemistad_confirmar: {
        text: "@@dialogTree.tabernero.enemistad_confirmar.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      reconciliar_placeholder: {
        text: "@@dialogTree.common.reconciliar_placeholder_text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
    },
  },

  /* ----------------------------------------------------------
     BOSK — Granjero
  ---------------------------------------------------------- */
  granjero: {
    root: "inicio",
    nodes: {
      inicio: {
        text: "@@dialogTree.granjero.inicio.text",
        options: [
          {
            text: "@@dialogTree.granjero.inicio.opt.positivo",
            next: "respuesta_positiva",
            tone: "positive",
            effect: { bondBonus: 1, setDecision: "granjero_tono=positivo" },
          },
          {
            text: "@@dialogTree.granjero.inicio.opt.neutral",
            next: "respuesta_neutral",
            tone: "neutral",
          },
          {
            text: "@@dialogTree.granjero.inicio.opt.negativo",
            next: "respuesta_negativa",
            tone: "negative",
            effect: { setDecision: "granjero_tono=negativo" },
          },
          {
            text: "@@dialogTree.granjero.inicio.opt.campo",
            next: "sobre_campo",
            tone: "neutral",
            cond: { bond: 1 },
          },
          {
            text: "@@dialogTree.granjero.inicio.opt.romance",
            next: "romance_placeholder",
            tone: "positive",
            cond: { bond: 4, decision: "granjero_tono=positivo", relationship: "neutral" },
          },
          {
            text: "@@dialogTree.granjero.inicio.opt.enamorado_visita",
            next: "enamorado_interacciones",
            tone: "positive",
            cond: { relationship: "enamorado" },
          },
          {
            text: "@@dialogTree.granjero.inicio.opt.provocar",
            next: "enemistad_inicio",
            tone: "negative",
            cond: { decision: "granjero_tono=negativo", relationship: "neutral" },
          },
          {
            text: "@@dialogTree.granjero.inicio.opt.reconciliar",
            next: "reconciliar_placeholder",
            tone: "positive",
            cond: { relationship: "enemistado" },
          },
        ],
      },
      respuesta_positiva: {
        text: "@@dialogTree.granjero.respuesta_positiva.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      respuesta_neutral: {
        text: "@@dialogTree.granjero.respuesta_neutral.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      respuesta_negativa: {
        text: "@@dialogTree.granjero.respuesta_negativa.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      sobre_campo: {
        text: "@@dialogTree.granjero.sobre_campo.text",
        options: [
          {
            text: "@@dialogTree.granjero.sobre_campo.opt.ayudar",
            next: "ofrecer_ayuda",
            tone: "positive",
            effect: { bondBonus: 1, setDecision: "granjero_ayuda=si" },
          },
          { text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" },
        ],
      },
      ofrecer_ayuda: {
        text: "@@dialogTree.granjero.ofrecer_ayuda.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      romance_placeholder: {
        text: "@@dialogTree.granjero.romance_placeholder.text",
        options: [
          {
            text: "@@dialogTree.granjero.romance_placeholder.opt.declarar",
            next: "romance_confirmar",
            tone: "positive",
            effect: { setRelationship: "enamorado" },
          },
          {
            text: "@@dialogTree.granjero.romance_placeholder.opt.esquivar",
            next: "exit",
            tone: "neutral",
          },
        ],
      },
      romance_confirmar: {
        text: "@@dialogTree.granjero.romance_confirmar.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      enamorado_interacciones: {
        text: "@@dialogTree.granjero.enamorado_interacciones.text",
        options: [
          {
            text: "@@dialogTree.granjero.enamorado_interacciones.opt.cita",
            next: "cita_placeholder",
            tone: "positive",
          },
          { text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" },
        ],
      },
      cita_placeholder: {
        text: "@@dialogTree.common.cita_placeholder_text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      enemistad_inicio: {
        text: "@@dialogTree.granjero.enemistad_inicio.text",
        options: [
          {
            text: "@@dialogTree.granjero.enemistad_inicio.opt.escalar",
            next: "enemistad_confirmar",
            tone: "negative",
            effect: { setRelationship: "enemistado" },
          },
          {
            text: "@@dialogTree.granjero.enemistad_inicio.opt.retroceder",
            next: "exit",
            tone: "neutral",
          },
        ],
      },
      enemistad_confirmar: {
        text: "@@dialogTree.granjero.enemistad_confirmar.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      reconciliar_placeholder: {
        text: "@@dialogTree.common.reconciliar_placeholder_text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
    },
  },

  /* ----------------------------------------------------------
     MARTA — Cocinera
  ---------------------------------------------------------- */
  cocinera: {
    root: "inicio",
    nodes: {
      inicio: {
        text: "@@dialogTree.cocinera.inicio.text",
        options: [
          {
            text: "@@dialogTree.cocinera.inicio.opt.positivo",
            next: "respuesta_positiva",
            tone: "positive",
            effect: { bondBonus: 1, setDecision: "cocinera_tono=positivo" },
          },
          {
            text: "@@dialogTree.cocinera.inicio.opt.neutral",
            next: "respuesta_neutral",
            tone: "neutral",
          },
          {
            text: "@@dialogTree.cocinera.inicio.opt.negativo",
            next: "respuesta_negativa",
            tone: "negative",
            effect: { setDecision: "cocinera_tono=negativo" },
          },
          {
            text: "@@dialogTree.cocinera.inicio.opt.receta",
            next: "sobre_receta",
            tone: "positive",
            cond: { bond: 2 },
          },
          {
            text: "@@dialogTree.cocinera.inicio.opt.romance",
            next: "romance_placeholder",
            tone: "positive",
            cond: { bond: 4, decision: "cocinera_tono=positivo", relationship: "neutral" },
          },
          {
            text: "@@dialogTree.cocinera.inicio.opt.enamorado_visita",
            next: "enamorado_interacciones",
            tone: "positive",
            cond: { relationship: "enamorado" },
          },
          {
            text: "@@dialogTree.cocinera.inicio.opt.provocar",
            next: "enemistad_inicio",
            tone: "negative",
            cond: { decision: "cocinera_tono=negativo", relationship: "neutral" },
          },
          {
            text: "@@dialogTree.cocinera.inicio.opt.reconciliar",
            next: "reconciliar_placeholder",
            tone: "positive",
            cond: { relationship: "enemistado" },
          },
        ],
      },
      respuesta_positiva: {
        text: "@@dialogTree.cocinera.respuesta_positiva.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      respuesta_neutral: {
        text: "@@dialogTree.cocinera.respuesta_neutral.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      respuesta_negativa: {
        text: "@@dialogTree.cocinera.respuesta_negativa.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      sobre_receta: {
        text: "@@dialogTree.cocinera.sobre_receta.text",
        options: [
          {
            text: "@@dialogTree.cocinera.sobre_receta.opt.aprender",
            next: "receta_profunda",
            tone: "positive",
            cond: { bond: 3 },
            effect: { bondBonus: 1 },
          },
          { text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" },
        ],
      },
      receta_profunda: {
        text: "@@dialogTree.cocinera.receta_profunda.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      romance_placeholder: {
        text: "@@dialogTree.cocinera.romance_placeholder.text",
        options: [
          {
            text: "@@dialogTree.cocinera.romance_placeholder.opt.declarar",
            next: "romance_confirmar",
            tone: "positive",
            effect: { setRelationship: "enamorado" },
          },
          {
            text: "@@dialogTree.cocinera.romance_placeholder.opt.esquivar",
            next: "exit",
            tone: "neutral",
          },
        ],
      },
      romance_confirmar: {
        text: "@@dialogTree.cocinera.romance_confirmar.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      enamorado_interacciones: {
        text: "@@dialogTree.cocinera.enamorado_interacciones.text",
        options: [
          {
            text: "@@dialogTree.cocinera.enamorado_interacciones.opt.cita",
            next: "cita_placeholder",
            tone: "positive",
          },
          { text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" },
        ],
      },
      cita_placeholder: {
        text: "@@dialogTree.common.cita_placeholder_text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      enemistad_inicio: {
        text: "@@dialogTree.cocinera.enemistad_inicio.text",
        options: [
          {
            text: "@@dialogTree.cocinera.enemistad_inicio.opt.escalar",
            next: "enemistad_confirmar",
            tone: "negative",
            effect: { setRelationship: "enemistado" },
          },
          {
            text: "@@dialogTree.cocinera.enemistad_inicio.opt.retroceder",
            next: "exit",
            tone: "neutral",
          },
        ],
      },
      enemistad_confirmar: {
        text: "@@dialogTree.cocinera.enemistad_confirmar.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      reconciliar_placeholder: {
        text: "@@dialogTree.common.reconciliar_placeholder_text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
    },
  },

  /* ----------------------------------------------------------
     VELLA — Mercader
  ---------------------------------------------------------- */
  mercader: {
    root: "inicio",
    nodes: {
      inicio: {
        text: "@@dialogTree.mercader.inicio.text",
        options: [
          {
            text: "@@dialogTree.mercader.inicio.opt.positivo",
            next: "respuesta_positiva",
            tone: "positive",
            effect: { bondBonus: 1, setDecision: "mercader_tono=positivo" },
          },
          {
            text: "@@dialogTree.mercader.inicio.opt.neutral",
            next: "respuesta_neutral",
            tone: "neutral",
          },
          {
            text: "@@dialogTree.mercader.inicio.opt.negativo",
            next: "respuesta_negativa",
            tone: "negative",
            effect: { setDecision: "mercader_tono=negativo" },
          },
          {
            text: "@@dialogTree.mercader.inicio.opt.catalogo",
            next: "catalogo",
            tone: "neutral",
            cond: { bond: 1 },
          },
          {
            text: "@@dialogTree.mercader.inicio.opt.sobre_ruta",
            next: "sobre_ruta",
            tone: "neutral",
            cond: { bond: 1 },
          },
          {
            text: "@@dialogTree.mercader.inicio.opt.negocio",
            next: "sobre_negocio",
            tone: "neutral",
            cond: { bond: 2 },
          },
          {
            text: "@@dialogTree.mercader.inicio.opt.pregunta_personal",
            next: "pregunta_personal",
            tone: "positive",
            cond: { bond: 2 },
          },
          {
            text: "@@dialogTree.mercader.inicio.opt.vella_cambios",
            next: "vella_cambios",
            tone: "positive",
            cond: { bond: 2, peso: 1 },
          },
          {
            text: "@@dialogTree.mercader.inicio.opt.sobre_planes",
            next: "sobre_planes",
            tone: "positive",
            cond: { bond: 3 },
          },
          {
            text: "@@dialogTree.mercader.inicio.opt.romance",
            next: "romance_placeholder",
            tone: "positive",
            cond: { bond: 4, decision: "mercader_tono=positivo", relationship: "neutral" },
          },
          {
            text: "@@dialogTree.mercader.inicio.opt.enamorado_visita",
            next: "enamorado_interacciones",
            tone: "positive",
            cond: { relationship: "enamorado" },
          },
          {
            text: "@@dialogTree.mercader.inicio.opt.provocar",
            next: "enemistad_inicio",
            tone: "negative",
            cond: { decision: "mercader_tono=negativo", relationship: "neutral" },
          },
          {
            text: "@@dialogTree.mercader.inicio.opt.reconciliar",
            next: "reconciliar_vella",
            tone: "positive",
            cond: { relationship: "enemistado" },
          },
        ],
      },
      respuesta_positiva: {
        text: "@@dialogTree.mercader.respuesta_positiva.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      respuesta_neutral: {
        text: "@@dialogTree.mercader.respuesta_neutral.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      respuesta_negativa: {
        text: "@@dialogTree.mercader.respuesta_negativa.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      catalogo: {
        text: "@@dialogTree.mercader.catalogo.text",
        options: [
          {
            text: "@@dialogTree.mercader.catalogo.opt.reciente",
            next: "catalogo_reciente",
            tone: "positive",
            cond: { bond: 2 },
            effect: { bondBonus: 1 },
          },
          { text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" },
        ],
      },
      catalogo_reciente: {
        text: "@@dialogTree.mercader.catalogo_reciente.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      sobre_ruta: {
        text: "@@dialogTree.mercader.sobre_ruta.text",
        options: [
          {
            text: "@@dialogTree.mercader.sobre_ruta.opt.peligros",
            next: "ruta_peligros",
            tone: "positive",
            cond: { bond: 2 },
          },
          { text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" },
        ],
      },
      ruta_peligros: {
        text: "@@dialogTree.mercader.ruta_peligros.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      sobre_negocio: {
        text: "@@dialogTree.mercader.sobre_negocio.text",
        options: [
          {
            text: "@@dialogTree.mercader.sobre_negocio.opt.descuento",
            next: "descuento_placeholder",
            tone: "positive",
            cond: { bond: 3, decision: "mercader_tono=positivo" },
          },
          { text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" },
        ],
      },
      descuento_placeholder: {
        text: "@@dialogTree.mercader.descuento_placeholder.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      pregunta_personal: {
        text: "@@dialogTree.mercader.pregunta_personal.text",
        options: [
          {
            text: "@@dialogTree.mercader.pregunta_personal.opt.origen",
            next: "memoria_personal",
            tone: "positive",
            cond: { bond: 3 },
            effect: { bondBonus: 1 },
          },
          { text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" },
        ],
      },
      memoria_personal: {
        text: "@@dialogTree.mercader.memoria_personal.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      sobre_planes: {
        text: "@@dialogTree.mercader.sobre_planes.text",
        options: [
          {
            text: "@@dialogTree.mercader.sobre_planes.opt.ampliar",
            next: "sobre_planes_respuesta",
            tone: "positive",
            effect: { bondBonus: 1 },
            cond: { decision: "mercader_tono=positivo" },
          },
          { text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" },
        ],
      },
      sobre_planes_respuesta: {
        text: "@@dialogTree.mercader.sobre_planes_respuesta.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      vella_cambios: {
        text: "@@dialogTree.mercader.vella_cambios.text",
        options: [
          {
            text: "@@dialogTree.mercader.vella_cambios.opt.sutil",
            next: "vella_cambios_profundo",
            tone: "positive",
          },
          {
            text: "@@dialogTree.mercader.vella_cambios.opt.directa",
            next: "vella_cambios_avanzado",
            tone: "positive",
            cond: { peso: 3 },
          },
          { text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" },
        ],
      },
      vella_cambios_profundo: {
        text: "@@dialogTree.mercader.vella_cambios_profundo.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      vella_cambios_avanzado: {
        text: "@@dialogTree.mercader.vella_cambios_avanzado.text",
        options: [
          {
            text: "@@dialogTree.mercader.vella_cambios_avanzado.opt.honesta",
            next: "vella_cambios_avanzado_resp",
            tone: "positive",
            effect: { bondBonus: 1 },
          },
          {
            text: "@@dialogTree.mercader.vella_cambios_avanzado.opt.desviar",
            next: "exit",
            tone: "neutral",
          },
        ],
      },
      vella_cambios_avanzado_resp: {
        text: "@@dialogTree.mercader.vella_cambios_avanzado_resp.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      romance_placeholder: {
        text: "@@dialogTree.mercader.romance_placeholder.text",
        options: [
          {
            text: "@@dialogTree.mercader.romance_placeholder.opt.declarar",
            next: "romance_confirmar",
            tone: "positive",
            effect: { setRelationship: "enamorado" },
          },
          {
            text: "@@dialogTree.mercader.romance_placeholder.opt.esquivar",
            next: "exit",
            tone: "neutral",
          },
        ],
      },
      romance_confirmar: {
        text: "@@dialogTree.mercader.romance_confirmar.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      enamorado_interacciones: {
        text: "@@dialogTree.mercader.enamorado_interacciones.text",
        options: [
          {
            text: "@@dialogTree.mercader.enamorado_interacciones.opt.cita",
            next: "cita_placeholder",
            tone: "positive",
          },
          { text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" },
        ],
      },
      cita_placeholder: {
        text: "@@dialogTree.common.cita_placeholder_text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      enemistad_inicio: {
        text: "@@dialogTree.mercader.enemistad_inicio.text",
        options: [
          {
            text: "@@dialogTree.mercader.enemistad_inicio.opt.escalar",
            next: "enemistad_confirmar",
            tone: "negative",
            effect: { setRelationship: "enemistado" },
          },
          {
            text: "@@dialogTree.mercader.enemistad_inicio.opt.retroceder",
            next: "exit",
            tone: "neutral",
          },
        ],
      },
      enemistad_confirmar: {
        text: "@@dialogTree.mercader.enemistad_confirmar.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      reconciliar_vella: {
        text: "@@dialogTree.mercader.reconciliar_vella.text",
        options: [
          {
            text: "@@dialogTree.mercader.reconciliar_vella.opt.aceptar",
            next: "reconciliar_vella_resultado",
            tone: "positive",
            effect: { setRelationship: "neutral" },
          },
          {
            text: "@@dialogTree.mercader.reconciliar_vella.opt.salir",
            next: "exit",
            tone: "neutral",
          },
        ],
      },
      reconciliar_vella_resultado: {
        text: "@@dialogTree.mercader.reconciliar_vella_resultado.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
    },
  },

  /* ----------------------------------------------------------
     VADAK — Salamandra gigante
  ---------------------------------------------------------- */
  vadak: {
    root: "inicio",
    nodes: {
      inicio: {
        text: "@@dialogTree.vadak.inicio.text",
        options: [
          {
            text: "@@dialogTree.vadak.inicio.opt.positivo",
            next: "respuesta_positiva",
            tone: "positive",
            effect: { bondBonus: 1, setDecision: "vadak_tono=positivo" },
          },
          {
            text: "@@dialogTree.vadak.inicio.opt.neutral",
            next: "respuesta_neutral",
            tone: "neutral",
          },
          {
            text: "@@dialogTree.vadak.inicio.opt.plenitud",
            next: "sobre_plenitud",
            tone: "neutral",
            cond: { bond: 1 },
          },
          {
            text: "@@dialogTree.vadak.inicio.opt.profundo",
            next: "filosofia",
            tone: "positive",
            cond: { bond: 3 },
          },
          {
            text: "@@dialogTree.vadak.inicio.opt.vinculo",
            next: "reconocimiento_inicio",
            tone: "positive",
            cond: { bond: 3, decision: "vadak_filosofia=acuerdo", relationship: "neutral" },
          },
          {
            text: "@@dialogTree.vadak.inicio.opt.alianza",
            next: "alianza_interacciones",
            tone: "positive",
            cond: { relationship: "enamorado" },
          },
          {
            text: "@@dialogTree.vadak.inicio.opt.distancia",
            next: "reconciliar_placeholder",
            tone: "positive",
            cond: { relationship: "enemistado" },
          },
        ],
      },
      respuesta_positiva: {
        text: "@@dialogTree.vadak.respuesta_positiva.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      respuesta_neutral: {
        text: "@@dialogTree.vadak.respuesta_neutral.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      sobre_plenitud: {
        text: "@@dialogTree.vadak.sobre_plenitud.text",
        options: [
          {
            text: "@@dialogTree.vadak.sobre_plenitud.opt.preguntar",
            next: "plenitud_profunda",
            tone: "positive",
            cond: { bond: 2 },
            effect: { bondBonus: 1 },
          },
          { text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" },
        ],
      },
      plenitud_profunda: {
        text: "@@dialogTree.vadak.plenitud_profunda.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      filosofia: {
        text: "@@dialogTree.vadak.filosofia.text",
        options: [
          {
            text: "@@dialogTree.vadak.filosofia.opt.aceptar",
            next: "filosofia_acuerdo",
            tone: "positive",
            effect: { bondBonus: 2, setDecision: "vadak_filosofia=acuerdo" },
          },
          {
            text: "@@dialogTree.vadak.filosofia.opt.rechazar",
            next: "filosofia_rechazo",
            tone: "negative",
            effect: { setDecision: "vadak_filosofia=rechazo" },
          },
        ],
      },
      filosofia_acuerdo: {
        text: "@@dialogTree.vadak.filosofia_acuerdo.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      filosofia_rechazo: {
        text: "@@dialogTree.vadak.filosofia_rechazo.text",
        options: [
          {
            text: "@@dialogTree.vadak.filosofia_rechazo.opt.insistir",
            next: "distancia_inicio",
            tone: "negative",
            cond: { relationship: "neutral" },
          },
          { text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" },
        ],
      },
      reconocimiento_inicio: {
        text: "@@dialogTree.vadak.reconocimiento_inicio.text",
        options: [
          {
            text: "@@dialogTree.vadak.reconocimiento_inicio.opt.aceptar",
            next: "reconocimiento_confirmar",
            tone: "positive",
            effect: { setRelationship: "enamorado" },
          },
          {
            text: "@@dialogTree.vadak.reconocimiento_inicio.opt.declinar",
            next: "exit",
            tone: "neutral",
          },
        ],
      },
      reconocimiento_confirmar: {
        text: "@@dialogTree.vadak.reconocimiento_confirmar.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      alianza_interacciones: {
        text: "@@dialogTree.vadak.alianza_interacciones.text",
        options: [
          {
            text: "@@dialogTree.vadak.alianza_interacciones.opt.contemplar",
            next: "cita_placeholder",
            tone: "positive",
          },
          { text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" },
        ],
      },
      cita_placeholder: {
        text: "@@dialogTree.common.cita_placeholder_text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      distancia_inicio: {
        text: "@@dialogTree.vadak.distancia_inicio.text",
        options: [
          {
            text: "@@dialogTree.vadak.distancia_inicio.opt.confirmar",
            next: "distancia_confirmar",
            tone: "negative",
            effect: { setRelationship: "enemistado" },
          },
          {
            text: "@@dialogTree.vadak.distancia_inicio.opt.retroceder",
            next: "exit",
            tone: "neutral",
          },
        ],
      },
      distancia_confirmar: {
        text: "@@dialogTree.vadak.distancia_confirmar.text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
      reconciliar_placeholder: {
        text: "@@dialogTree.common.reconciliar_placeholder_text",
        options: [{ text: "@@dialogTree.common.despedirse", next: "exit", tone: "neutral" }],
      },
    },
  },

};
