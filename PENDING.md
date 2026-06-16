# PENDING — Mecánicas planificadas para implementación futura

## 1. Devorar NPCs

**Concepto:** El jugador puede "devorar" a un NPC WG, consumiéndolo como si fuera un enemigo. Esto termina permanentemente la relación con ese personaje y potencialmente el acceso a sus servicios.

**Candidatos:** Cualquier NPC con sistema WG (tabernero, granjero, cocinera, mercader, vadak). Requiere que el NPC esté en un estado de peso avanzado (pesoIdx >= umbral configurable por NPC).

**Mecánica propuesta:**
- El botón "Devorar" aparece en `hablarNPC` si el NPC está en un peso mínimo y el jugador tiene la habilidad/magia Feast o similar.
- Al confirmar, se ejecuta `devorarNPC(npcId, loc)`:
  - Animación/log de la acción.
  - El jugador gana grasa/XP proporcional al peso actual del NPC (`wgs.pesoIdx * factorGrasa`).
  - El NPC se marca como devorado: `S.player.npcWG[npcId].devorado = true`.
  - Se bloquean todas las interacciones con ese NPC (tienda, trabajo, conversación, WG).
  - Puede tener consecuencias de reputación en la localización (NPC testigo, bajada de afinidad con otros).

**Impacto en tiendas:**
- Si se devora al tabernero, la taberna cierra o pasa a otro NPC.
- Si se devora a la mercader, la tienda cierra temporalmente.
- Si se devora al granjero/cocinera, se pierde acceso a trabajos de granja.
- Vadak: caso especial — devorar a Vadak debería tener consecuencias narrativas importantes (fin de las quests de Plenitud, obtención de su magia).

**Requisitos técnicos:**
- Flag `S.player.npcWG[npcId].devorado` (bool).
- Filtrado en `hablarNPC` y `abrirTienda` para NPCs devorados.
- Log de flavor para el acto (por NPC, bilingüe).
- Posiblemente una pantalla de confirmación.

**Estado:** No implementado. Pendiente de decisión de diseño sobre consecuencias permanentes y balance.

---

## 2. Árbol de diálogos — Contenido real

**Estado actual:** La infraestructura está implementada (`data/dialogTrees.js` + motor en `engine/09_npcwg.js`). Los nodos tienen texto placeholder.

**Pendiente:**
- Escribir diálogos reales para todos los nodos de cada NPC.
- Implementar rutas de romance (nodo `romance_placeholder` en cada NPC).
- Implementar rutas de enemistad (degradación de vínculo, opciones negativas con consecuencias).
- Impacto de decisiones en tiendas: por ejemplo, `mercader_tono=negativo` podría subir precios; `tabernero_tono=positivo` podría dar descuento en comidas.

**Para descuento de mercader:** Ver nodo `descuento_placeholder` en `GD.dialogTrees.mercader`. Al implementar, llamar a una función que modifique temporalmente los precios de tienda de Vella mientras `S.player.decisions.mercader_descuento === "activo"`.

---

## 3. Impacto de afinidad en tiendas e interacciones

**Concepto:** Los niveles de vínculo (`bondPts`, `bondNames`) deberían tener efectos concretos además del cosmético y el cooldown reducido.

**Propuesta:**
- Vínculo 3+ con tabernero: precio reducido en comidas de la taberna (5-10%).
- Vínculo 3+ con mercader: acceso a ítems exclusivos o precio reducido.
- Vínculo 3+ con cocinera: recetas nuevas disponibles para comprar o aprender.
- Vínculo 3+ con granjero: acceso a trabajos adicionales con mejor pago.
- Vínculo 4 (máximo): desbloquea conversación de ruta de romance en árbol de diálogos.

**Estado:** No implementado. Depende de decisión de cuánto peso debe tener el sistema de vínculo en la economía del juego.

---

## 4. Sprites por estado de peso para NPCs

**Estado actual:** El motor ya soporta sprites por estado (`npcId__pesoIdx`). No hay sprites creados.

**Convención de nombres:** Ver `assets/sprites/README.md`.

**Prioridad sugerida:** tabernero (más interacciones), luego vadak (más estados), luego el resto.
