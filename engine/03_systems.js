"use strict";
/* PLÉROMA — Comer/digerir, tiempo, progresión (XP/decay) e inventario
   (extraído de engine.js · sección de líneas originales 295-450) */
/* ============================================================
   COMER  /  DIGERIR
   ------------------------------------------------------------
   comer() devuelve true si provocó la MUERTE por empacho
   (sobrepasar la capacidad por más de 75%). Quien lo llame
   debe abortar su flujo si recibe true.
   ============================================================ */
function comer(item, silencioso, tiempo) {
  const p = S.player;

  // Si esta acción consume tiempo, el turno transcurre ANTES de comer: se digiere
  // lo que YA había en el estómago y la comida de esta acción se acredita completa
  // (no se auto-digiere en el mismo turno). Por eso un item de poca llenura como la
  // Cantimplora ya no resta fullness neta. La inanición se resuelve DESPUÉS de comer,
  // porque la comida puede salvarte del ayuno.
  if (tiempo) {
    avanzarTiempo(tiempo, true);   // true = no resolver inanición todavía
    if (S.mode === "muerte") return true;
  }

  if (item.llena) {
    p.ful += item.llena;
    // Cuenta como "comida" real (no el chequeo de empacho que pasa {} sin llena).
    if (p.lifetimeStats) {
      p.lifetimeStats.mealsConsumed++;
      tickQuest("meals", {});
      tickLogro("mealsConsumed", p.lifetimeStats.mealsConsumed);
    }
  }
  if (item.engorda) p.fat += item.engorda;
  if (item.cura) p.hea = Math.min(maxHea(), p.hea + item.cura);
  if (item.mana) p.mana = Math.min(maxMana(), p.mana + item.mana);
  if (item.stamina) p.sta = Math.min(maxSta(), p.sta + item.stamina);
  if (item.vaciar) digerir(item.vaciar);

  const max = maxFul();
  if (p.ful > max) {
    const exceso = p.ful - max;
    p.fat += exceso * 0.07;
    if (p.ful > max * 1.3) {
      const dmg = round((p.ful - max * 1.3) * 0.3);
      p.hea = Math.max(1, p.hea - dmg);
      if (!silencioso && dmg > 0) log(tPeso("log.overstuffHurt", { n: dmg }), "mal");
    }
  }
  if (!silencioso && item.sabor) log(L(item.sabor), "comida");

  trackWeightStats(p);

  // Comer rompe el ayuno: reinicia el contador de inanición
  if (p.ful >= EMPTY_THRESHOLD) p.accionesVacio = 0;

  // Muerte por sobrepasar la capacidad en +75%
  // Truco "makemeravenous": el estómago aguanta lo que le tires, jamás revienta.
  if (p.ful > max * 1.75) {
    if (cheatOn("ravenous")) {
      if (!silencioso) log(t("cheat.ravenousSave"), "bien");
    } else {
      morir("empacho");
      return true;
    }
  }

  // Si la acción consumió tiempo, recién ahora se resuelve la inanición (post-comida)
  if (tiempo) {
    resolverInanicion();
    if (S.mode === "muerte") return true;
  }
  return false;
}

function digerir(cant) {
  const p = S.player;
  const real = Math.min(cant, p.ful);
  p.ful -= real;
  p.fat += real * 0.10;
}

/* ============================================================
   TIEMPO
   ============================================================ */
function avanzarTiempo(turnos, sinInanicion) {
  const p = S.player;
  for (let i = 0; i < turnos; i++) {
    p.turnos++;
    if (p.turnos % 12 === 0) {
      p.momento = p.momento === "dia" ? "noche" : "dia";
      if (p.momento === "dia") p.dia++;
    }
    if (p.ful >= EMPTY_THRESHOLD) {
      digerir(4 + stat("EST") * 0.4);                               // hay comida -> se vuelve peso
      // Con reservas, la masa magra perdida se reconstituye gradualmente
      if (p.leanLoss > 0) p.leanLoss = Math.max(0, p.leanLoss - LEAN_RECOVERY);
    } else if (p.fat > FAT_FLOOR) {
      p.fat = Math.max(FAT_FLOOR, p.fat - METAB);                   // ayuno -> quema grasa primero
    } else {
      // Grasa en el piso: inanición profunda, el cuerpo cataboliza masa magra
      const maxLL = maxLeanLoss();
      if (maxLL > 0) p.leanLoss = Math.min(maxLL, (p.leanLoss || 0) + LEAN_METAB);
    }
    if (p.hea > maxHea()) p.hea = maxHea();   // perder grasa baja la vida máx (savia) -> no dejar la barra por encima del tope
    if (p.turnos % 3 === 0) p.mana = Math.min(maxMana(), p.mana + 1);
  }
  // Cuando la acción es comer, la inanición se difiere para resolverla tras la comida.
  if (!sinInanicion) resolverInanicion();
}

/* Contabiliza acciones con estómago vacío -> desmayo por inanición. Se separó de
   avanzarTiempo para poder resolverla DESPUÉS de comer (ver comer() con `tiempo`). */
function resolverInanicion() {
  const p = S.player;
  if (p.ful < EMPTY_THRESHOLD) {
    p.accionesVacio = (p.accionesVacio || 0) + 1;
    if (p.accionesVacio >= MAX_VACIO) {
      // Truco "makemeeternal": el hambre nunca te tumba (el contador se reinicia).
      if (cheatOn("eternal")) { p.accionesVacio = 0; log(t("cheat.eternalHunger"), "bien"); return; }
      morir("inanicion");
      return;
    }
  } else {
    p.accionesVacio = 0;
  }
}

/* ============================================================
   PROGRESIÓN
   ============================================================ */

/* Aplica decaimiento de XP por zona cuando el jugador supera su nivel de referencia.
   Cada nivel sobre el cap reduce la recompensa un 20% (exponencial).
   Piso del 15%: la zona nunca deja de dar algo, pero el incentivo de farm desaparece. */
function xpZona(base) {
  const z = GD.world.zonas[S.zona];
  if (!z || !z.nivelMax) return base;
  const sobre = Math.max(0, S.player.nivel - z.nivelMax);
  if (sobre === 0) return base;
  const mult = Math.max(0.15, Math.pow(0.80, sobre));
  return Math.max(1, round(base * mult));
}

function ganarXP(n) {
  const p = S.player;
  p.xp += n;
  log(t("log.xpGain", { n }), "bien");
  while (p.xp >= p.xpSig) {
    p.xp -= p.xpSig;
    p.nivel++;
    p.puntos += 3;
    p.xpSig = round(p.xpSig * 1.4);
    p.hea = maxHea();
    p.mana = maxMana();
    log(t("log.levelUp", { n: p.nivel, p: p.puntos }), "bien");
  }
}

/* ============================================================
   INVENTARIO
   ============================================================ */
function tieneItem(id) { return S.player.inv.find((x) => x.id === id); }
function darItem(id, cant) {
  cant = cant || 1;
  const e = tieneItem(id);
  if (e) e.cant += cant;
  else S.player.inv.push({ id, cant });
}
function quitarItem(id, cant) {
  cant = cant || 1;
  const e = tieneItem(id);
  if (!e) return;
  e.cant -= cant;
  if (e.cant <= 0) S.player.inv = S.player.inv.filter((x) => x.id !== id);
}
// Resuelve un id a su definición: del catálogo o del objeto guardado (comida conjurada)
function resolveItem(id) {
  if (GD.items[id]) return GD.items[id];
  const e = S.player && S.player.inv.find((x) => x.id === id && x.item);
  return e ? e.item : null;
}
function darItemObj(item, cant) {
  cant = cant || 1;
  const e = tieneItem(item.id);
  if (e) e.cant += cant;
  else S.player.inv.push({ id: item.id, cant, item, conjurado: !!item.conjurado });
}
function conjuredCount() {
  return S.player.inv.filter((x) => x.conjurado).reduce((s, x) => s + x.cant, 0);
}
function conjuredCap() { return Math.max(1, 2 + Math.floor(stat("INT") / 3)); }

