"use strict";
/* PLÉROMA — Combate y magia en combate (incluye Feast)
   (extraído de engine.js · sección de líneas originales 1606-2134) */
/* ============================================================
   COMBATE
   ============================================================ */
function iniciarCombate(enemyId) {
  const base = GD.enemies[enemyId];
  const e = JSON.parse(JSON.stringify(base));
  e.FUE = e.stats[0]; e.AGI = e.stats[1]; e.INT = e.stats[2];
  e.AGU = e.stats[3]; e.EST = e.stats[4]; e.TAM = e.stats[5];

  // Estado de peso: se elige uno al azar de la lista del enemigo y modifica
  // stats, vida y masa (cuánto te llena al devorar/Feastear).
  const lista = (e.pesos && e.pesos.length) ? e.pesos : ["promedio"];
  const pesoId = choice(lista);
  const ps = GD.pesos[pesoId] || GD.pesos.promedio;
  if (ps.statMod) for (const k in ps.statMod) e[k] = Math.max(1, (e[k] || 0) + ps.statMod[k]);
  e.vidaMax = round(e.vidaMax * DIF_VIDA * (ps.vidaMult || 1));   // dificultad + peso
  e.masa = round(e.masa * (ps.masaMult || 1));
  e.hea = e.vidaMax;

  S.combate = { e, grapple: 0, turno: 0, causaDano: "vencido", estadoPeso: pesoId, efectos: { jugador: [], enemigo: [] } };
  S.mode = "combate";
  // Descripción de cuerpo: la bespoke del enemigo para ese peso, o la genérica de GD.pesos
  const cuerpoDesc = (e.flavor.cuerpo && e.flavor.cuerpo[pesoId]) ? e.flavor.cuerpo[pesoId] : ps.desc;
  log(flavorRand(e.flavor.encuentro) + (cuerpoDesc ? " " + flavorRand(cuerpoDesc) : ""), "combate");
  renderCombate();
}

function renderCombate() {
  S.mode = "combate";
  S.screen = renderCombate;
  const c = S.combate, e = c.e, p = S.player;
  const pesoLbl = c.estadoPeso && GD.pesos[c.estadoPeso] ? ` · ${L(GD.pesos[c.estadoPeso].label)}` : "";

  let efectosHtml = "";
  if (c.efectos) {
    const jugs = c.efectos.jugador || [];
    const enems = c.efectos.enemigo || [];
    if (jugs.length || enems.length) {
      let tags = jugs.map(ef => `[${L(GD.hechizos[ef.id].nombre)} ${ef.turnos}t]`).join(" ")
        + enems.map(ef => `[↓${L(GD.hechizos[ef.id].nombre)} ${ef.turnos}t]`).join(" ");
      efectosHtml = `<p class="hint">${t("spell.activeEffects")} ${tags}</p>`;
    }
  }

  // Sprite opcional: <id>__<peso> (arte por estado de peso) -> <id> (genérico) -> nada
  const spr = spriteImg("enemy", [e.id + "__" + c.estadoPeso, e.id], "spr-enemy");
  S.story = `${spr}<h2>${L(e.nombre)}${pesoLbl}</h2>
    ${bar(t("cb.enemyHealth"), e.hea, e.vidaMax, "enemigo")}
    ${c.grapple > 0 ? `<p class="warn">${t("cb.grabbed")}</p>` : ""}
    ${efectosHtml}`;

  const tieneMagia = (p.spells && p.spells.length > 0) || p.mana >= COSTE_FEAST;
  const acts = [];
  if (c.grapple > 0) {
    acts.push({ label: t("cb.struggle"), cls: "primary", fn: () => accion("forcejear") });
    acts.push({ label: t("cb.useItem"), fn: () => abrirItemsCombate() });
  } else {
    acts.push({ label: t("cb.attack"), cls: "primary", fn: () => accion("atacar") });
    const dispDevorar = e.hea <= e.vidaMax * 0.5 || stat("EST") >= e.AGU + 4;
    acts.push({ label: t("cb.devour"), cls: "devour", disabled: !dispDevorar, fn: () => accion("devorar") });
    acts.push({ label: t("cb.magia"), cls: "magia", disabled: !tieneMagia, fn: () => abrirMagia() });
    acts.push({ label: t("cb.useItem"), fn: () => abrirItemsCombate() });
    acts.push({ label: t("cb.flee"), fn: () => accion("huir") });
  }
  setActions(acts);
}

function danoJugador() {
  const arma = S.player.arma, e = S.combate.e;
  let dmg = xdy(arma.dano, arma.rango);
  dmg += stat(arma.stat) * (arma.escala || 0.4);
  // Arma sombra: también escala con stat secundario (INT)
  if (arma.statSecundario) dmg += stat(arma.statSecundario) * (arma.escalaSecundaria || 0);
  // Mejora de herrería: +mejoraRate por nivel (hasta 10) al daño del arma
  const nl = (S.player.mejoras && S.player.mejoras[arma.id]) || 0;
  if (nl) dmg *= 1 + (arma.mejoraRate || 0.05) * nl;
  dmg -= e.def;
  if (arma.tipoDano) {
    let mult = 1;
    if (e.resist && e.resist.includes(arma.tipoDano)) mult /= 1.5;
    if (e.debil && e.debil.includes(arma.tipoDano)) mult *= 1.5;
    dmg *= mult;
  }
  return Math.max(0, round(dmg));
}
function danoEnemigo() {
  const e = S.combate.e;
  return Math.max(0, round((xdy(e.dano, e.rango) + e.FUE * 0.3) * DIF_DANO - defensa()));
}
function actuaPrimero() {
  const e = S.combate.e;
  return stat("AGI") + stat("INT") >= effectiveEnemyAGI() + e.INT;
}

function accion(tipo) {
  const c = S.combate, e = c.e, p = S.player;
  c.turno++;

  if (tipo === "atacar") {
    const golpeP = () => {
      const d = danoJugador();
      e.hea -= d;
      log(t("log.attackHit", { arma: L(p.arma.nombre), n: d }), "bien");
      // Efectos de arma legendaria
      if (p.arma.efectoArma === "manaRegen") {
        p.mana = Math.min(maxMana(), p.mana + 1);
      }
      if (p.arma.efectoArma === "terremoto" && rand() < 0.20) {
        c.enemyStunned = true;
        log(t("log.legendStun"), "bien");
      }
    };
    if (actuaPrimero()) { golpeP(); if (e.hea > 0) turnoEnemigo(); }
    else { turnoEnemigo(); if (p.hea > 0 && c.grapple <= 0 && e.hea > 0) golpeP(); }
  }

  else if (tipo === "devorar") {
    const exito = skillTestRange(stat("AGI") + stat("FUE") + stat("EST") + 40,
      e.AGI + e.FUE + round(e.hea * 0.6), 5, 92);
    if (exito) { devorarEnemigo(); return; }
    log(t("log.devourFail", { enemy: L(e.nombre) }), "mal");
    turnoEnemigo();
  }

  else if (tipo === "feast") {
    p.mana -= COSTE_FEAST;
    const factorVida = round((e.hea / e.vidaMax) * 25);
    const exito = skillTestRange(stat("INT") * 3 + 20, e.INT + e.AGU + factorVida, 10, 90);
    if (exito) { feastEnemigo(); return; }
    log(t("log.feastFail", { enemy: L(e.nombre) }), "mal");
    turnoEnemigo();
  }

  else if (tipo === "forcejear") {
    c.grapple -= Math.max(stat("FUE"), stat("AGI"), stat("INT"));
    if (c.grapple <= 0) { c.grapple = 0; log(t("log.struggleFree"), "bien"); }
    else { log(t("log.struggleFail"), "mal"); turnoEnemigo(); }
  }

  else if (tipo === "huir") {
    if (skillTestRange(25 + stat("AGI") + stat("INT"), e.AGI + e.INT, 10, 80) && !inmovil()) {
      log(t("log.fleeOk"), "bien");
      finCombate();
      entrarZona(S.zona);
      return;
    }
    log(inmovil() ? t("log.fleeImmobile") : t("log.fleeFail"), "mal");
    turnoEnemigo();
  }

  if (S.mode === "muerte") return;   // por si comer/turnoEnemigo provocó muerte
  resolverCombate();
}

function effectiveEnemyAGI() {
  const c = S.combate;
  if (!c || !c.efectos) return c ? c.e.AGI : 0;
  let agi = c.e.AGI;
  (c.efectos.enemigo || []).forEach(ef => {
    if (ef.tipo === "debuff_agi") agi = Math.max(0, agi + ef.valor);
  });
  return agi;
}

function procesarEfectos() {
  const c = S.combate;
  if (!c || !c.efectos) return;

  const nuevosEnemigo = [];
  (c.efectos.enemigo || []).forEach(ef => {
    if (ef.tipo === "doT_fijo") {
      const dano = round(c.e.vidaMax * ef.valorPct);
      c.e.hea -= dano;
      log(t("spell.doTtick", { hechizo: L(GD.hechizos[ef.id].nombre), n: dano }), "bien");
    }
    ef.turnos--;
    if (ef.turnos > 0) nuevosEnemigo.push(ef);
    else log(t("spell.effectEnd", { hechizo: L(GD.hechizos[ef.id].nombre) }));
  });
  c.efectos.enemigo = nuevosEnemigo;

  const nuevosJugador = [];
  (c.efectos.jugador || []).forEach(ef => {
    ef.turnos--;
    if (ef.turnos > 0) nuevosJugador.push(ef);
    else log(t("spell.effectEnd", { hechizo: L(GD.hechizos[ef.id].nombre) }));
  });
  c.efectos.jugador = nuevosJugador;
}

function turnoEnemigo() {
  const c = S.combate, e = c.e, p = S.player;
  if (e.hea <= 0) return;

  // Aturdido por arma legendaria: pierde este turno
  if (c.enemyStunned) {
    c.enemyStunned = false;
    log(t("log.enemyStunned", { enemy: L(e.nombre) }));
    return;
  }

  procesarEfectos();
  if (e.hea <= 0) return;

  const eAGI = effectiveEnemyAGI();
  const escudo = (c.efectos.jugador || []).find(ef => ef.tipo === "buff_escudo");
  const dmgMult = escudo ? (1 - escudo.valorPct) : 1;

  // Ataque especial (bypasea esquive; puede ignorar defensa parcial o total)
  if (e.ataqueEspecial && !c.grapple && rand() < e.ataqueEspecial.chance) {
    const ae = e.ataqueEspecial;
    const defMult = ae.ignoraDef ? 0 : 0.5;
    const d = aplicarVulnerabilidad(Math.max(1, round((xdy(ae.dano || e.dano, ae.rango || e.rango) + e.FUE * 0.4) * DIF_DANO - defensa() * defMult) * dmgMult));
    p.hea -= d;
    c.causaDano = "vencido";
    log(t("log.specialAttack", { flavor: flavorRand(ae.flavor), n: d }), "mal");
    return;
  }

  if (c.grapple > 0 && e.puedeDevorar) {
    if (skillTestRange(e.FUE + e.EST + 30, stat("FUE") + stat("AGI"), 10, 80)) {
      log(flavorRand(e.flavor.victoria), "mal");
      morir("devorado");
      return;
    }
    const d = aplicarVulnerabilidad(round(danoEnemigo() * 0.5 * dmgMult));
    p.hea -= d; c.causaDano = "vencido";
    log(t("log.enemySwallow", { enemy: L(e.nombre), n: d }), "mal");
    return;
  }
  if (c.grapple > 0) {
    const d = aplicarVulnerabilidad(round(danoEnemigo() * 0.6 * dmgMult));
    p.hea -= d; c.causaDano = "vencido";
    log(t("log.enemySqueeze", { enemy: L(e.nombre), n: d }), "mal");
    return;
  }

  const quiereAgarrar = e.puedeDevorar && p.hea <= maxHea() * 0.45 && rand() < 0.6;
  if (quiereAgarrar) {
    if (skillTestRange(eAGI + e.FUE + 20, stat("AGI") + stat("INT"), 10, 75)) {
      c.grapple = e.FUE + e.EST;
      log(t("log.enemyGrab", { enemy: L(e.nombre) }), "mal");
    } else {
      log(t("log.enemyGrabFail", { enemy: L(e.nombre) }));
    }
    return;
  }

  if (skillTestRange(stat("AGI") + stat("INT"), eAGI + e.INT, 5, 70) && !inmovil()) {
    log(t("log.dodge", { enemy: L(e.nombre) }), "bien");
    return;
  }
  const d = aplicarVulnerabilidad(round(danoEnemigo() * dmgMult));
  p.hea -= d;
  c.causaDano = e.tipoDano === "arcano" ? "magia" : "vencido";
  log(t("log.enemyAttack", { flavor: flavorRand(e.flavor.ataque), n: d }), "mal");
}

function devorarEnemigo() {
  const c = S.combate, e = c.e, p = S.player;
  log(t("log.devourSwallow", { enemy: L(e.nombre) }), "devour");
  p.ful += e.masa;
  p.fat += e.masa * 0.12;
  log(t("log.bellySwell", { n: e.masa }), "comida");
  ganarXP(xpZona(round(e.xp * 1.3)));
  p.oro += e.oro;
  log(t("log.goldCarried", { n: e.oro }), "bien");
  tickQuest("kills", { zona: S.zona, enemyId: e.id });

  // Drops de materiales (gota) — mismo trato que una victoria normal
  if (e.gota) {
    e.gota.forEach((g) => {
      if (rand() < g.chance) {
        darItem(g.id, 1);
        const it = GD.items[g.id];
        if (it) log(t("drop.got", { item: L(it.nombre) }), "bien");
      }
    });
  }

  finCombate();
  if (comer({}, true)) return;       // empacho por devorar -> muerte
  const ename = L(e.nombre);

  // Mini-evento encadenado: continúa la secuencia en vez de volver a la zona
  if (S.miniEvento) {
    S.screen = () => {
      S.story = `<h2>${t("devour.title")}</h2><p>${t("devour.done", { enemy: ename })}</p>`;
      setActions([{ label: t("ui.continue"), cls: "primary", fn: () => avanzarMiniEvento() }]);
    };
    S.screen();
    return;
  }

  const pintar = () => {
    S.story = `<h2>${t("devour.title")}</h2><p>${t("devour.done", { enemy: ename })}</p>`;
    setActions([{ label: t("ui.continue"), cls: "primary", fn: () => entrarZona(S.zona) }]);
  };
  S.screen = pintar; pintar();
}

/* FEAST  —  convierte al enemigo en comida (item) */
function feastEnemigo() {
  const c = S.combate, e = c.e, p = S.player;
  log(t("log.feastCast", { enemy: L(e.nombre) }), "devour");
  ganarXP(xpZona(e.xp));
  p.oro += e.oro;
  if (e.oro) log(t("log.goldGain", { n: e.oro }), "bien");
  tickQuest("kills", { zona: S.zona, enemyId: e.id });

  // Drops de materiales (gota) — mismo trato que una victoria normal
  if (e.gota) {
    e.gota.forEach((g) => {
      if (rand() < g.chance) {
        darItem(g.id, 1);
        const it = GD.items[g.id];
        if (it) log(t("drop.got", { item: L(it.nombre) }), "bien");
      }
    });
  }

  // Nombre y sabor bilingües (no atados al idioma activo)
  const food = {
    id: "feast_" + e.id, tipo: "comida", conjurado: true,
    llena: round(e.masa * 1.1), engorda: round(e.masa * 0.05),
    nombre: tAll("feast.foodName", (code) => ({ enemy: L(e.nombre, code) })),
    sabor: tAll("feast.foodTaste", (code) => ({ enemy: L(e.nombre, code) })),
  };
  finCombate();
  mostrarFeast(food);
}

function mostrarFeast(food) {
  S.screen = () => mostrarFeast(food);
  const puedeGuardar = conjuredCount() < conjuredCap();
  const extra = food.engorda ? t("feast.extraFat", { n: food.engorda }) : "";
  S.story = `<h2>${t("feast.title")}</h2>
    <p>${t("feast.ready", { food: L(food.nombre), n: food.llena, extra })}</p>
    <p class="hint">${t("feast.reserve", { n: conjuredCount(), cap: conjuredCap() })}
      ${puedeGuardar ? t("feast.canStore") : t("feast.capFull")}</p>`;

  // Mini-evento encadenado: si venimos de un paso de combate, la salida sigue la cadena.
  const continuar = () => {
    if (S.miniEvento) avanzarMiniEvento();
    else entrarZona(S.zona);
  };

  setActions([
    { label: t("feast.eatNow"), cls: "primary", fn: () => {
        const murio = comer(food, false, 1);   // tiempo=1: el turno pasa antes de comer
        if (murio || S.mode === "muerte") return;
        log(t("log.feastEat"), "comida");
        continuar();
    }},
    { label: t("feast.store"), disabled: !puedeGuardar, fn: () => {
        darItemObj(food, 1);
        log(t("log.feastStore", { food: L(food.nombre) }), "bien");
        continuar();
    }},
    { label: t("feast.discard"), fn: () => { log(t("log.feastDiscard")); continuar(); } },
  ]);
}

function resolverCombate() {
  const c = S.combate;
  if (!c) return;
  if (S.player.hea <= 0) { morir(c.causaDano || "vencido"); return; }
  if (c.e.hea <= 0) { victoriaCombate(); return; }
  renderCombate();
}

function victoriaCombate() {
  const e = S.combate.e, p = S.player;
  const ename = L(e.nombre);
  const flavorDerrota = flavorRand(e.flavor.derrota);
  log(flavorDerrota, "combate");
  ganarXP(xpZona(e.xp));
  p.oro += e.oro;
  log(t("log.goldGain", { n: e.oro }), "bien");
  tickQuest("kills", { zona: S.zona, enemyId: e.id });

  // Drops de materiales (gota)
  if (e.gota) {
    e.gota.forEach((g) => {
      if (rand() < g.chance) {
        darItem(g.id, 1);
        const it = GD.items[g.id];
        if (it) log(t("drop.got", { item: L(it.nombre) }), "bien");
      }
    });
  }

  finCombate();

  // Mini-evento encadenado: continúa la secuencia en vez de volver a la zona
  if (S.miniEvento) {
    const texto = flavorDerrota;
    S.screen = () => {
      S.story = `<h2>${t("victory.title")}</h2><p>${texto}</p>`;
      setActions([{ label: t("ui.continue"), cls: "primary", fn: () => avanzarMiniEvento() }]);
    };
    S.screen();
    return;
  }

  const pintar = () => {
    S.story = `<h2>${t("victory.title")}</h2><p>${flavorDerrota}</p><p>${t("victory.couldDevour")}</p>`;
    setActions([{ label: t("ui.continue"), cls: "primary", fn: () => entrarZona(S.zona) }]);
  };
  S.screen = pintar; pintar();
}

function finCombate() { S.combate = null; S.mode = "explorar"; }

function abrirItemsCombate() {
  S.screen = abrirItemsCombate;
  const p = S.player;
  const usables = p.inv.filter((x) => {
    const it = resolveItem(x.id);
    return it && (it.tipo === "comida" || it.tipo === "bebida" || it.tipo === "pocion");
  });
  let h = `<h2>${t("cb.useItemTitle")}</h2>`;
  if (!usables.length) h += `<p>${t("cb.noConsumables")}</p>`;
  else {
    h += `<div class="invlist">`;
    usables.forEach((entry) => {
      const it = resolveItem(entry.id);
      h += `<div class="invrow"><span class="invname">${L(it.nombre)} ×${entry.cant}${entry.conjurado ? " ✦" : ""}</span>
        <span class="invinfo">${itemResumen(it)}</span>
        <button class="invuse" data-id="${entry.id}">${t("ui.use")}</button></div>`;
    });
    h += `</div>`;
  }
  S.story = h;
  setActions([{ label: t("ui.back"), cls: "primary", fn: renderCombate }]);
  document.querySelectorAll(".invuse").forEach((b) => {
    b.onclick = () => {
      const it = resolveItem(b.dataset.id);
      const murio = comer(it);
      quitarItem(b.dataset.id);
      if (murio) return;
      log(t("log.useItemCombat", { item: L(it.nombre) }), "bien");
      turnoEnemigo();
      if (S.mode === "muerte") return;
      resolverCombate();
    };
  });
}

/* ============================================================
   MAGIA EN COMBATE  —  submenú y lanzamiento
   ============================================================ */
function abrirMagia() {
  S.screen = abrirMagia;
  const p = S.player;
  let h = `<h2>${t("spell.menuTitle")}</h2>`;

  // Feast siempre disponible como opción base
  h += `<p><b>✦ ${t("feast.title")}</b> — ${t("spell.feastDesc", { n: COSTE_FEAST })}</p>`;

  const aprendidos = p.spells || [];
  if (aprendidos.length) {
    h += `<div class="spellsect"><h3>${t("spell.known")}</h3>`;
    aprendidos.forEach((id) => {
      const sp = GD.hechizos[id];
      if (!sp) return;
      const sinMana = p.mana < sp.costoMana;
      h += `<div class="spellrow">
        <span class="spellname">${L(sp.nombre)}</span>
        <span class="spellinfo">${L(sp.desc)} · ${t("spell.manaCost", { n: sp.costoMana })}</span>
        <button class="spellbuy" data-id="${id}" ${sinMana ? "disabled" : ""}>${t("spell.cast")}</button>
      </div>`;
    });
    h += `</div>`;
  } else {
    h += `<p class="hint">${t("spell.noneKnown")}</p>`;
  }
  S.story = h;
  setActions([
    { label: t("cb.feast", { n: COSTE_FEAST }), cls: "feast", disabled: p.mana < COSTE_FEAST, fn: () => accion("feast") },
    { label: t("ui.back"), cls: "primary", fn: renderCombate },
  ]);
  document.querySelectorAll(".spellbuy").forEach((b) => {
    b.onclick = () => lanzarHechizo(b.dataset.id);
  });
}

function lanzarHechizo(id) {
  const sp = GD.hechizos[id];
  const p = S.player;
  const c = S.combate;
  if (!sp || p.mana < sp.costoMana) { log(t("spell.noMana"), "mal"); renderCombate(); return; }

  p.mana -= sp.costoMana;
  log(t("spell.castLog", { hechizo: L(sp.nombre) }), "bien");

  if (sp.tipo === "heal") {
    const cura = round(maxHea() * sp.valorPct);
    p.hea = Math.min(maxHea(), p.hea + cura);
    log(t("spell.healed", { n: cura }), "bien");

  } else if (sp.tipo === "buff_escudo") {
    c.efectos.jugador.push({ tipo: "buff_escudo", valorPct: sp.valorPct, turnos: sp.turnos, id });
    log(t("spell.shieldUp", { n: sp.turnos }), "bien");

  } else if (sp.tipo === "damage_arcano") {
    const dano = round(xdy(sp.dano, sp.rango) + stat("INT") * 0.5);
    c.e.hea -= dano;
    log(t("spell.arcanoDmg", { hechizo: L(sp.nombre), n: dano }), "bien");

  } else if (sp.tipo === "debuff_agi") {
    c.efectos.enemigo.push({ tipo: "debuff_agi", valor: sp.valor, turnos: sp.turnos, id });
    log(t("spell.slowed", { n: sp.turnos }), "bien");

  } else if (sp.tipo === "drain") {
    const dano = round(xdy(sp.dano, sp.rango) + stat("INT") * 0.4);
    const cura = round(dano * 0.5);
    c.e.hea -= dano;
    p.hea = Math.min(maxHea(), p.hea + cura);
    log(t("spell.drainHit", { n: dano, cura }), "bien");

  } else if (sp.tipo === "doT_fijo") {
    c.efectos.enemigo.push({ tipo: "doT_fijo", valorPct: sp.valorPct, turnos: sp.turnos, id });
    log(t("spell.entropiaStart"), "bien");
  }

  turnoEnemigo();
  if (S.mode === "muerte") return;
  resolverCombate();
}

