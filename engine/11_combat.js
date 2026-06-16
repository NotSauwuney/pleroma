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

/* ============================================================
   DOMINIO DE DEVORAR  —  tiers + técnicas
   ============================================================ */
function nivelDevorar() {
  const d = (S.player.lifetimeStats && S.player.lifetimeStats.enemiesDevoured) || 0;
  if (d >= 50) return 3;
  if (d >= 25) return 2;
  if (d >= 10) return 1;
  return 0;
}

function tieneTecnica(id) {
  if (id === "engullida") return true;
  if (id === "absorcion") return S.player.spells && S.player.spells.includes("absorcion");
  if (id === "perfecta")  return nivelDevorar() >= 3;
  return false;
}

// Disponibilidad de cada técnica según tier actual
function dispEngullida(e) {
  const nv = nivelDevorar();
  const umbralHp = [0.50, 0.65, 0.80, 1.01][nv]; // 1.01 = sin restricción
  const estaReq  = [4, 3, 2, 0][nv];
  return e.hea <= e.vidaMax * umbralHp || stat("EST") >= e.AGU + estaReq;
}

function dispAbsorcion(e) {
  const nv = nivelDevorar();
  const estaReq = [5, 4, 3, 2][nv]; // siempre más exigente que Engullida
  return stat("EST") >= e.AGU + estaReq;
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

  // Feast ahora es un hechizo más: hay que haberlo aprendido (quest/logro de la
  // Plenitud) para acceder al menú de magia por su causa, igual que cualquier otro.
  const tieneMagia = p.spells && p.spells.some(id => {
    const sp = GD.hechizos[id]; return sp && sp.tipo !== "tecnica_devorar";
  });
  const acts = [];
  if (c.grapple > 0) {
    acts.push({ label: t("cb.struggle"), cls: "primary", fn: () => accion("forcejear") });
    acts.push({ label: t("cb.useItem"), fn: () => abrirItemsCombate() });
  } else {
    acts.push({ label: t("cb.attack"), cls: "primary", fn: () => accion("atacar") });
    const _dispEng  = dispEngullida(e);
    const _dispAbs  = tieneTecnica("absorcion") && dispAbsorcion(e);
    const _dispPerf = tieneTecnica("perfecta");
    const dispDevorar = _dispEng || _dispAbs || _dispPerf;
    const tieneMenu   = tieneTecnica("absorcion") || tieneTecnica("perfecta");
    if (tieneMenu) {
      acts.push({ label: t("cb.devourMenu"), cls: "devour", disabled: !dispDevorar, fn: () => abrirDevorar() });
    } else {
      acts.push({ label: t("cb.devour"), cls: "devour", disabled: !dispDevorar, fn: () => accion("devorar", "engullida") });
    }
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

function accion(tipo, opts) {
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
    const tecnica = opts || "engullida";
    let checkP, checkE, minP, maxP;
    if (tecnica === "perfecta") {
      checkP = stat("AGI") + stat("FUE") + stat("EST") + 20;
      checkE = e.AGI + e.FUE + round(e.hea * 0.7);
      minP = 5; maxP = 88;
    } else if (tecnica === "absorcion") {
      checkP = stat("FUE") * 2 + stat("EST") + 30;
      checkE = e.FUE + e.EST + round(e.hea * 0.4);
      minP = 10; maxP = 85;
    } else {
      checkP = stat("AGI") + stat("FUE") + stat("EST") + 40;
      checkE = e.AGI + e.FUE + round(e.hea * 0.6);
      minP = 5; maxP = 92;
    }
    const exito = skillTestRange(checkP, checkE, minP, maxP);
    if (exito) { devorarEnemigo(tecnica); return; }
    log(t("log.devourFail", { enemy: L(e.nombre) }), "mal");
    turnoEnemigo();
  }

  else if (tipo === "forcejear") {
    c.grapple -= Math.max(stat("FUE"), stat("AGI"), stat("INT"));
    if (c.grapple <= 0) {
      c.grapple = 0;
      log(t("log.struggleFree"), "bien");
      p.lifetimeStats.grapplesSurvived++;
      tickQuest("grapple_survive", { zona: S.zona, enemyId: e.id });
      tickLogro("grapplesSurvived", p.lifetimeStats.grapplesSurvived);
    }
    else { log(t("log.struggleFail"), "mal"); turnoEnemigo(); }
  }

  else if (tipo === "huir") {
    if (skillTestRange(25 + stat("AGI") + stat("INT"), e.AGI + e.INT, 10, 80) && !inmovil()) {
      log(t("log.fleeOk"), "bien");
      finCombate();
      S.miniEvento = null;   // huir cancela el mini-evento activo
      if (S.barco) { mostrarBarco(); return; }
      entrarZona(S.zona);
      return;
    }
    log(inmovil() ? tPeso("log.fleeImmobile") : t("log.fleeFail"), "mal");
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
    if (cheatOn("eternal")) { p.hea = Math.min(maxHea(), p.hea + d); } else { p.hea -= d; }
    c.causaDano = "vencido";
    log(t("log.specialAttack", { flavor: flavorRand(ae.flavor), n: d }), "mal");
    return;
  }

  if (c.grapple > 0 && e.puedeDevorar) {
    if (skillTestRange(e.FUE + e.EST + 30, stat("FUE") + stat("AGI"), 10, 80)) {
      log(flavorRand(e.flavor.victoria), "mal");
      if (cheatOn("eternal")) { p.hea = Math.min(maxHea(), p.hea + 1); return; }
      morir("devorado");
      return;
    }
    const d = aplicarVulnerabilidad(round(danoEnemigo() * 0.5 * dmgMult));
    if (cheatOn("eternal")) { p.hea = Math.min(maxHea(), p.hea + d); } else { p.hea -= d; } c.causaDano = "vencido";
    log(t("log.enemySwallow", { enemy: L(e.nombre), n: d }), "mal");
    return;
  }
  if (c.grapple > 0) {
    const d = aplicarVulnerabilidad(round(danoEnemigo() * 0.6 * dmgMult));
    if (cheatOn("eternal")) { p.hea = Math.min(maxHea(), p.hea + d); } else { p.hea -= d; } c.causaDano = "vencido";
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
  if (cheatOn("eternal")) { p.hea = Math.min(maxHea(), p.hea + d); } else { p.hea -= d; }
  c.causaDano = e.tipoDano === "arcano" ? "magia" : "vencido";
  log(t("log.enemyAttack", { flavor: flavorRand(e.flavor.ataque), n: d }), "mal");
}

function devorarEnemigo(tecnica) {
  tecnica = tecnica || "engullida";
  const c = S.combate, e = c.e, p = S.player;
  const nv = nivelDevorar();

  // Parámetros de output según técnica y tier
  const FAT_TIER = [0.12, 0.15, 0.18, 0.22];
  const XP_TIER  = [1.30, 1.35, 1.40, 1.50];
  let fatPct, xpMult, logKey;
  if (tecnica === "absorcion") {
    fatPct = 0.08;
    xpMult = 1.8;
    logKey = "log.devourAbsorcion";
  } else if (tecnica === "perfecta") {
    fatPct = FAT_TIER[nv] * 1.5;
    xpMult = XP_TIER[nv] * 1.2;
    logKey = "log.devourPerfect";
  } else {
    fatPct = FAT_TIER[nv];
    xpMult = XP_TIER[nv];
    logKey = "log.devourSwallow";
  }

  log(t(logKey, { enemy: L(e.nombre) }), "devour");
  p.ful += e.masa;
  p.fat += e.masa * fatPct;
  log(t("log.bellySwell", { n: e.masa }), "comida");
  ganarXP(xpZona(round(e.xp * xpMult)));
  p.oro += e.oro;
  log(t("log.goldCarried", { n: e.oro }), "bien");
  tickQuest("kills", { zona: S.zona, enemyId: e.id });

  // Tradición de la Plenitud: estadísticas históricas + quests/logros asociados
  p.lifetimeStats.enemiesDevoured++;
  tickQuest("devorar", { zona: S.zona, enemyId: e.id });
  tickLogro("enemiesDevoured", p.lifetimeStats.enemiesDevoured);
  trackWeightStats(p);

  otorgarGota(e);   // drops de materiales — mismo trato que una victoria normal

  finCombate();
  if (comer({}, true)) return;       // empacho por devorar -> muerte
  const ename = L(e.nombre);

  // Devorar también es una victoria: mismo flujo de salida que el combate normal.
  const continuar = fnContinuarCombate();
  const pintar = () => {
    S.story = `<h2>${t("devour.title")}</h2><p>${tPeso("devour.done", { enemy: ename })}</p>`;
    setActions([{ label: t("ui.continue"), cls: "primary", fn: continuar }]);
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

  otorgarGota(e);   // drops de materiales — mismo trato que una victoria normal

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

  // Feast comparte el mismo flujo de salida que cualquier otra victoria.
  const continuar = fnContinuarCombate();

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
  if (S.player.hea <= 0) {
    // Truco "makemeeternal": fallback por si hea baja a 0 (no debería pasar).
    if (cheatOn("eternal")) {
      S.player.hea = 1;
      log(t("cheat.eternalDamage"), "bien");
    } else {
      morir(c.causaDano || "vencido");
      return;
    }
  }
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

  otorgarGota(e);   // drops de materiales

  finCombate();

  // Toda victoria comparte el mismo flujo de salida (mini-evento → barco → zona).
  // En mini-evento encadenado no ofrecemos la coletilla "podrías devorar".
  const continuar = fnContinuarCombate();
  const couldDevour = S.miniEvento ? "" : `<p>${t("victory.couldDevour")}</p>`;
  const pintar = () => {
    S.story = `<h2>${t("victory.title")}</h2><p>${flavorDerrota}</p>${couldDevour}`;
    setActions([{ label: t("ui.continue"), cls: "primary", fn: continuar }]);
  };
  S.screen = pintar; pintar();
}

function finCombate() { S.combate = null; S.mode = "explorar"; }

/* Otorga los drops de materiales (campo `gota`) de un enemigo, cada uno según su
   probabilidad. Mismo trato para victoria normal, devorar, Feast y el barco. */
function otorgarGota(e) {
  if (!e || !e.gota) return;
  e.gota.forEach((g) => {
    if (rand() < g.chance) {
      darItem(g.id, 1);
      const it = GD.items[g.id];
      if (it) log(t("drop.got", { item: L(it.nombre) }), "bien");
    }
  });
}

/* Continuación tras GANAR un combate (por golpe, devorar, Feast o magia):
   todas las victorias convergen en el mismo flujo de salida. Devuelve la función
   que debe ejecutar el botón "Continuar" según el contexto. */
function fnContinuarCombate() {
  if (S.miniEvento) return () => avanzarMiniEvento();
  if (S.barco) return mostrarBarco;
  return () => entrarZona(S.zona);
}

/* DEVORAR — sub-menú de técnicas */
function abrirDevorar() {
  S.screen = abrirDevorar;
  const e = S.combate.e;
  const nv = nivelDevorar();
  const tierKey = ["devour.tier0", "devour.tier1", "devour.tier2", "devour.tier3"][nv];

  const tecnicas = [{ id: "engullida", disp: dispEngullida(e) }];
  if (tieneTecnica("absorcion")) tecnicas.push({ id: "absorcion", disp: dispAbsorcion(e) });
  if (tieneTecnica("perfecta"))  tecnicas.push({ id: "perfecta",  disp: true });

  let h = `<h2>${t("devour.menuTitle")}</h2><p class="hint">${t(tierKey)}</p>`;
  h += `<div class="spellsect">`;
  tecnicas.forEach(tc => {
    const legendCls = tc.id === "perfecta" ? " spell-legendary" : "";
    const prefijo   = tc.id === "perfecta" ? "✦ " : "";
    h += `<div class="spellrow${legendCls}">
      <span class="spellname">${prefijo}${t("devour.tech." + tc.id)}</span>
      <span class="spellinfo">${t("devour.tech." + tc.id + ".desc")}</span>
      <button class="devour-tech" data-id="${tc.id}" ${tc.disp ? "" : "disabled"}>${t("ui.use")}</button>
    </div>`;
  });
  h += `</div>`;
  S.story = h;
  setActions([{ label: t("ui.back"), cls: "primary", fn: renderCombate }]);
  document.querySelectorAll(".devour-tech").forEach(b => {
    b.onclick = () => accion("devorar", b.dataset.id);
  });
}

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

  const aprendidos = p.spells || [];
  // Hechizos superados: si el jugador tiene tanto el base como su evolución,
  // ocultar el base en el menú de combate (la evolución lo reemplaza visualmente).
  const superados = new Set(aprendidos.map(id => {
    const sp = GD.hechizos[id];
    return (sp && sp.upgradeDe) ? sp.upgradeDe : null;
  }).filter(Boolean));

  const visibles = aprendidos.filter(id => {
    const sp = GD.hechizos[id];
    if (!sp) return false;
    if (sp.sinMenu) return false;         // técnicas internas (devorar, etc.)
    if (superados.has(id)) return false;  // superado por una evolución aprendida
    return true;
  });

  if (visibles.length) {
    h += `<div class="spellsect"><h3>${t("spell.known")}</h3>`;
    visibles.forEach((id) => {
      const sp = GD.hechizos[id];
      const sinMana = p.mana < sp.costoMana;
      const esEvo = !!sp.upgradeDe;
      const legendCls = sp.legendario ? " spell-legendary" : (esEvo ? " spell-evolved" : "");
      const prefix = sp.legendario ? "✦ " : (esEvo ? "◈ " : "");
      h += `<div class="spellrow${legendCls}">
        <span class="spellname">${prefix}${L(sp.nombre)}</span>
        <span class="spellinfo">${L(sp.desc)} · ${t("spell.manaCost", { n: sp.costoMana })}</span>
        <button class="spellbuy" data-id="${id}" ${sinMana ? "disabled" : ""}>${t("spell.cast")}</button>
      </div>`;
    });
    h += `</div>`;
  } else {
    h += `<p class="hint">${t("spell.noneKnown")}</p>`;
  }

  // Técnicas pasivas (sinMenu): se muestran como referencia, no se castean
  const pasivas = aprendidos.filter(id => {
    const sp = GD.hechizos[id];
    return sp && sp.sinMenu && sp.tipo !== "levitacion_feast"; // levitacion es un pasivo de overworld, no de combate
  });
  if (pasivas.length) {
    h += `<div class="spellsect"><h3>${t("spell.pasivoSection")}</h3>`;
    h += `<p class="hint">${t("spell.pasivoDesc")}</p>`;
    pasivas.forEach((id) => {
      const sp = GD.hechizos[id];
      h += `<div class="spellrow spell-legendary">
        <span class="spellname">✦ ${L(sp.nombre)}</span>
        <span class="spellinfo">${L(sp.desc)}</span>
      </div>`;
    });
    h += `</div>`;
  }
  S.story = h;
  setActions([
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

  // Feast tiene flujo propio (chequeo de habilidad + transforma al enemigo en
  // comida, termina el combate por su cuenta): no sigue el patrón genérico de
  // "gastar maná, aplicar efecto, pasar turno, resolver".
  if (sp.tipo === "feast") {
    p.mana -= sp.costoMana;
    const e = c.e;
    const factorVida = round((e.hea / e.vidaMax) * 25);
    const exito = skillTestRange(stat("INT") * 3 + 20, e.INT + e.AGU + factorVida, 10, 90);
    if (exito) { feastEnemigo(); return; }
    log(t("log.feastFail", { enemy: L(e.nombre) }), "mal");
    turnoEnemigo();
    if (S.mode === "muerte") return;
    resolverCombate();
    return;
  }

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
    const cura = round(dano * (sp.drainPct || 0.5));
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

