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

    // ---- Tradición de la Plenitud: nuevos tipos de condición ----
    // Contadores simples (suman progreso de a uno, igual que "kills"/"rest")
    if (tipo === "devorar" && q.tipo === "devorar") incrementa = true;
    if (tipo === "devorar" && q.tipo === "devorar_enemigo" && opts.enemyId === q.objetivo) incrementa = true;
    if (tipo === "grapple_survive" && q.tipo === "grapple_survive") incrementa = true;
    if (tipo === "meals" && q.tipo === "meals") incrementa = true;

    // Umbrales (se completan apenas opts.valor cruza q.umbral, sin progreso gradual:
    // forzamos progress a "uno antes de completar" y dejamos que el incrementa++ de
    // abajo cierre la quest, reusando la misma lógica de completado/encadenado).
    if (tipo === "reach_weight" && q.tipo === "reach_weight"
        && opts.valor >= q.umbral && d.progress < q.cantidad) {
      d.progress = q.cantidad - 1;
      incrementa = true;
    }
    if (tipo === "times_obese" && q.tipo === "times_obese"
        && opts.valor >= q.umbral && d.progress < q.cantidad) {
      d.progress = q.cantidad - 1;
      incrementa = true;
    }

    if (incrementa) {
      d.progress++;
      if (d.progress >= q.cantidad) {
        d.completed = true;
        changed = true;
        const recompensa = q.recompensa ? GD.hechizos[q.recompensa] : null;
        if (recompensa) {
          log(t("quest.complete", { hechizo: L(recompensa.nombre) }), "bien");
          // Los hechizos legendarios (Feast, técnicas de devorar) no pasan por la tienda:
          // la quest los otorga directamente al completarse (igual que hacen los logros).
          if (recompensa.legendario && S.player.spells && !tieneHechizo(recompensa.id)) {
            S.player.spells.push(recompensa.id);
          }
        } else {
          log(t("quest.completeNR"), "bien"); // misión narrativa sin recompensa de hechizo
        }
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

/* ============================================================
   LOGROS LEGENDARIOS  —  desbloqueos por estadística histórica
   ------------------------------------------------------------
   Análogo a tickQuest, pero reacciona a player.lifetimeStats en lugar de
   eventos puntuales. Se llama con (stat, valor) cada vez que una estadística
   histórica cambia (ver trackWeightStats, devorarEnemigo, forcejear, comer).
   Cada logro se dispara una sola vez (registrado en player.logros[id]).
   ============================================================ */
function tickLogro(stat, valor) {
  const p = S.player;
  if (!p || !p.logros) return false;
  let changed = false;
  for (const id in GD.logros) {
    const lg = GD.logros[id];
    if (p.logros[id]) continue;
    if (lg.condicion.stat !== stat) continue;
    if (valor < lg.condicion.umbral) continue;

    p.logros[id] = true;
    changed = true;
    const r = lg.recompensa || {};
    if (r.tipo === "spell") {
      if (!tieneHechizo(r.id)) p.spells.push(r.id);
      log(t("logro.unlockedSpell", {
        nombre: L(lg.nombre), desc: L(lg.desc),
        hechizo: L(GD.hechizos[r.id].nombre),
      }), "bien");
    } else {
      // titulo / item / etc. — por ahora solo se anuncia narrativamente.
      log(t("logro.unlocked", { nombre: L(lg.nombre), desc: L(lg.desc) }), "bien");
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
      const rew = q.recompensa ? GD.hechizos[q.recompensa] : null;
      const rewLabel = rew ? L(rew.nombre) : "—";
      h += `<div class="quest-done">${t("quest.done")}${rew ? ` · ${t("quest.reward")}: ${rewLabel}` : ""}</div>`;
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

