"use strict";
/* PLÉROMA — Hechizos aprendidos + quests escolares
   (extraído de engine.js · sección de líneas originales 1520-1605) */
/* ============================================================
   HECHIZOS  —  hechizos aprendidos y lanzamiento
   ============================================================ */
function tieneHechizo(id) { return S.player.spells && S.player.spells.includes(id); }

function hechizosDisponibles() {
  // Devuelve los hechizos que el jugador ha aprendido
  return (S.player.spells || []).map((id) => GD.hechizos[id]).filter(Boolean);
}

/* ============================================================
   QUESTS  —  misiones escolares
   ============================================================ */
function questData(id) {
  const p = S.player;
  if (!p.quests[id]) p.quests[id] = { progress: 0, completed: false };
  return p.quests[id];
}

function questUnlocked(q) {
  if (!q.requiere) return true;
  const prev = questData(q.requiere);
  return prev.completed;
}

// Incrementa progreso de quests activas según tipo/contexto.
// opts: { zona, enemyId, arma, loc, escuela }
function tickQuest(tipo, opts) {
  opts = opts || {};
  let changed = false;
  for (const id in GD.quests) {
    const q = GD.quests[id];
    const d = questData(id);
    if (d.completed) continue;
    if (!questUnlocked(q)) continue;
    let incrementa = false;
    if (tipo === "kills" && q.tipo === "kills") incrementa = true;
    if (tipo === "kills" && q.tipo === "kills_zona" && opts.zona === q.zona) incrementa = true;
    if (tipo === "kills" && q.tipo === "kills_enemigo" && opts.enemyId === q.objetivo) incrementa = true;
    if (tipo === "rest" && q.tipo === "rest") incrementa = true;
    if (tipo === "visitar" && q.tipo === "visitar" && opts.escuela === q.escuela) incrementa = true;
    if (incrementa) {
      d.progress++;
      if (d.progress >= q.cantidad) {
        d.completed = true;
        changed = true;
        log(t("quest.complete", { hechizo: L(GD.hechizos[q.recompensa].nombre) }), "bien");
        // Activar siguiente quest encadenada si existe
        for (const nid in GD.quests) {
          const nq = GD.quests[nid];
          if (nq.requiere === id) questData(nid); // inicializa
        }
      }
    }
  }
  return changed;
}

// Pantalla de misiones de una escuela
function verMisiones(escuelaId, loc) {
  S.screen = () => verMisiones(escuelaId, loc);
  const quests = Object.values(GD.quests).filter((q) => q.escuela === escuelaId);
  let h = `<h2>${t("quest.title")}</h2>`;
  quests.forEach((q) => {
    const d = questData(q.id);
    const unlocked = questUnlocked(q);
    h += `<div class="quest-block">`;
    h += `<div class="quest-title">${L(q.nombre)}</div>`;
    if (!unlocked) {
      h += `<div class="quest-locked">${t("quest.locked")}</div>`;
    } else if (d.completed) {
      h += `<div class="quest-done">${t("quest.done")} · ${t("quest.reward")}: ${L(GD.hechizos[q.recompensa].nombre)}</div>`;
    } else {
      h += `<div class="quest-desc">${L(q.desc)}</div>`;
      const pct = clamp((d.progress / q.cantidad) * 100, 0, 100);
      h += `<div class="quest-bar-wrap">
        <div class="quest-bar"><div class="quest-bar-fill" style="width:${pct}%"></div></div>
        <span class="quest-prog">${t("quest.progress", { n: d.progress, total: q.cantidad })}</span>
      </div>`;
    }
    h += `</div>`;
  });
  S.story = h;
  setActions([{ label: t("ui.back"), cls: "primary", fn: () => abrirTienda(loc) }]);
}

