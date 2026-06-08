"use strict";
/* PLÉROMA — Sistema de NPCs WG: observar, alimentar, vínculo, progreso de peso
   (extraído de engine.js · sección de líneas originales 1320-1519) */
/* ============================================================
   WG NPC SYSTEM — observar, alimentar, vínculo, progreso de peso
   ============================================================ */

// Sprite de un NPC con fallback por capas:
//   <npcId>__<idxPeso>  (arte por estado de peso, si el NPC tiene sistema WG)
//   <npcId>             (genérico del personaje)
//   nada                (si no hay archivo)
function npcSprite(npcId, cls) {
  const names = [];
  if (GD.npcWG && GD.npcWG[npcId]) {
    const wgs = _wgState(npcId);
    names.push(npcId + "__" + wgs.pesoIdx);
  }
  names.push(npcId);
  return spriteImg("npc", names, cls || "spr-npc");
}

// Obtiene (o inicializa) el estado dinámico WG de un NPC en el save
function _wgState(npcId) {
  const p = S.player;
  if (!p.npcWG) p.npcWG = {};
  if (!p.npcWG[npcId]) {
    const wgd = GD.npcWG[npcId];
    p.npcWG[npcId] = { pesoIdx: wgd.pesoBase, wgAccum: 0, bondPts: 0, lastFed: -9999 };
  }
  return p.npcWG[npcId];
}

// Nivel de vínculo actual (0-4) según bondPts acumulados
function _bondLevel(wgs, wgd) {
  const thr = wgd.bondThresholds;
  let lv = 0;
  for (let i = 0; i < thr.length; i++) {
    if (wgs.bondPts >= thr[i]) lv = i; else break;
  }
  return lv;
}

// Turnos que faltan para poder volver a alimentar (0 = puede ya)
function _cooldownLeft(wgs, wgd, bondLv) {
  const cd = Math.max(2, wgd.cooldownBase - bondLv);
  return Math.max(0, cd - (S.player.turnos - wgs.lastFed));
}

// Pantalla "Observar": descripción corporal actual + datos de vínculo
function verNPCwg(npcId, loc) {
  S.screen = () => verNPCwg(npcId, loc);
  const npc    = GD.npcs[npcId];
  const wgd    = GD.npcWG[npcId];
  const wgs    = _wgState(npcId);
  const estado = wgd.estados[wgs.pesoIdx];
  const bond   = _bondLevel(wgs, wgd);
  const bondName = L(wgd.bondNames[bond]);
  const alTope = wgs.pesoIdx >= wgd.estados.length - 1;
  const progreso = alTope
    ? t("npcwg.atTop")
    : `${Math.floor(wgs.wgAccum * 10) / 10} / ${wgd.wgPorPaso}`;
  let h = `${npcSprite(npcId)}<h2>${L(npc.nombre)}</h2>`;
  h += `<p class="npcbody">${L(estado.desc)}</p>`;
  h += `<p class="hint">${t("npcwg.estado")}: <b>${L(estado.label)}</b></p>`;
  h += `<p class="hint">${t("npcwg.bond")}: <b>${bondName}</b> (${t("npcwg.bondPts", { n: wgs.bondPts })}) · ${t("npcwg.progress")}: ${progreso}</p>`;
  S.story = h;
  setActions([{ label: t("ui.back"), cls: "primary", fn: () => hablarNPC(npcId, loc) }]);
}

// Pantalla de selección de comida para dar al NPC
function menuAlimentarNPC(npcId, loc) {
  S.screen = () => menuAlimentarNPC(npcId, loc);
  const npc  = GD.npcs[npcId];
  const wgd  = GD.npcWG[npcId];
  const wgs  = _wgState(npcId);
  const bond = _bondLevel(wgs, wgd);
  const p    = S.player;
  const cdLeft = _cooldownLeft(wgs, wgd, bond);
  let h = `${npcSprite(npcId)}<h2>${t("npcwg.feedTitle", { nombre: L(npc.nombre) })}</h2>`;
  // Bloqueos: horario
  if (!wgd.receptivo.includes(p.momento)) {
    h += `<p class="mal">${t("npcwg.wrongTime", { nombre: L(npc.nombre) })}</p>`;
    S.story = h;
    setActions([{ label: t("ui.back"), cls: "primary", fn: () => hablarNPC(npcId, loc) }]);
    return;
  }
  // Bloqueo: cooldown
  if (cdLeft > 0) {
    h += `<p class="mal">${t("npcwg.cooldown", { n: cdLeft })}</p>`;
    S.story = h;
    setActions([{ label: t("ui.back"), cls: "primary", fn: () => hablarNPC(npcId, loc) }]);
    return;
  }
  // Lista de comidas en inventario
  const comidas = p.inv.filter((e) => {
    const it = resolveItem(e.id);
    return it && (it.tipo === "comida" || it.tipo === "bebida");
  });
  if (!comidas.length) {
    h += `<p>${t("npcwg.noFood")}</p>`;
    S.story = h;
    setActions([{ label: t("ui.back"), cls: "primary", fn: () => hablarNPC(npcId, loc) }]);
    return;
  }
  h += `<p>${t("npcwg.pickFood")}</p><div class="shoplist">`;
  comidas.forEach((e) => {
    const it     = resolveItem(e.id);
    const esFav  = wgd.favFoods.includes(e.id);
    const nombre = nombreItem(it);
    h += `<div class="shoprow">
      <span class="shopname">${nombre} ×${e.cant}${esFav ? " ⭐" : ""}</span>
      <span class="invinfo">${esFav ? t("npcwg.favFood") : ""}</span>
      <button class="feedbtn" data-id="${e.id}">${t("npcwg.give")}</button>
    </div>`;
  });
  h += `</div>`;
  S.story = h;
  setActions([{ label: t("ui.back"), cls: "primary", fn: () => hablarNPC(npcId, loc) }]);
  document.querySelectorAll(".feedbtn[data-id]").forEach((b) => {
    b.onclick = () => alimentarNPC(npcId, b.dataset.id, loc);
  });
}

// Ejecuta la alimentación: consume el ítem, actualiza wgAccum, bond y cooldown
function alimentarNPC(npcId, itemId, loc) {
  const wgd    = GD.npcWG[npcId];
  const wgs    = _wgState(npcId);
  const npc    = GD.npcs[npcId];
  const esFav  = wgd.favFoods.includes(itemId);
  const prevBond = _bondLevel(wgs, wgd);
  // Consumir ítem
  quitarItem(itemId);
  // Actualizar cooldown
  wgs.lastFed = S.player.turnos;
  // Bond pts (+2 si favorita, +1 normal)
  wgs.bondPts += esFav ? 2 : 1;
  // WG acumulación
  wgs.wgAccum += esFav ? 1.25 : 1.0;
  // Flavor de reacción
  const flavorArr = esFav ? wgd.feedFavFlavor : wgd.feedFlavor;
  log(flavorRand(flavorArr), "bien");
  if (esFav) log(t("npcwg.favEffect"), "bien");
  // Avance de estado de peso
  const prevIdx = wgs.pesoIdx;
  if (wgs.pesoIdx < wgd.estados.length - 1 && wgs.wgAccum >= wgd.wgPorPaso) {
    wgs.wgAccum -= wgd.wgPorPaso;
    wgs.pesoIdx++;
    if (wgd.avanceFlavor) log(flavorRand(wgd.avanceFlavor));
    const clave = wgs.pesoIdx >= wgd.estados.length - 1 ? "npcwg.maxGained" : "npcwg.gained";
    log(t(clave, { nombre: L(npc.nombre) }), "bien");
  }
  // Mensaje de subida de vínculo
  const newBond = _bondLevel(wgs, wgd);
  if (newBond > prevBond) {
    log(t("npcwg.bondUp", { nombre: L(npc.nombre), level: L(wgd.bondNames[newBond]) }), "bien");
  }
  // Volver a la pantalla del NPC
  hablarNPC(npcId, loc);
}

// Trabajar: gana oro a cambio de STAMINA + TIEMPO (no spameable)
function trabajar(jobId, loc) {
  const job = GD.trabajos[jobId], p = S.player;
  if (p.sta < job.costoSta) { log(t("shop.tooTired"), "mal"); abrirTienda(loc); return; }
  p.sta -= job.costoSta;
  avanzarTiempo(job.turnos);
  if (S.mode === "muerte") return;       // te desmayaste de hambre trabajando
  const pago = job.base + randInt(job.var) + Math.floor(stat(job.stat) * job.statBonus);
  p.oro += pago;
  log(flavorRand(job.desc));
  log(t("shop.earned", { n: pago }), "bien");
  abrirTienda(loc);
}

// Herrería: mejorar el filo de tus armas (hasta 10 niveles, +%/nivel según tipo)
function abrirMejora(loc) {
  S.screen = () => abrirMejora(loc);
  const p = S.player;
  const armas = p.inv.filter((x) => {
    const it = resolveItem(x.id);
    return it && it.tipo === "arma" && it.id !== "garras" && it.mejorable !== false;
  });
  let h = `<h2>${t("mejora.title")}</h2><p>${t("shop.yourGold", { n: p.oro })}</p>`;
  if (!armas.length) h += `<p>${t("mejora.none")}</p>`;
  else {
    h += `<div class="shoplist">`;
    armas.forEach((entry) => {
      const it = resolveItem(entry.id);
      const nl = p.mejoras[it.id] || 0;
      const maxed = nl >= 10;
      const costo = costoMejora(it, nl);
      const caro = p.oro < costo;
      const pct = Math.round((it.mejoraRate || 0.05) * 100);
      h += `<div class="shoprow">
        <span class="shopname">${nombreItem(it)}</span>
        <span class="invinfo">${t("mejora.level", { n: nl })} · +${pct}%/nivel</span>
        <button class="shopbuy" data-id="${it.id}" ${maxed || caro ? "disabled" : ""}>${maxed ? t("mejora.maxed") : t("mejora.cost", { n: costo })}</button>
      </div>`;
    });
    h += `</div>`;
  }
  h += `<p class="hint">${t("mejora.hint")}</p>`;
  S.story = h;
  setActions([{ label: t("ui.back"), cls: "primary", fn: () => abrirTienda(loc) }]);
  document.querySelectorAll(".shopbuy").forEach((b) => { b.onclick = () => mejorarArma(b.dataset.id, loc); });
}
function mejorarArma(id, loc) {
  const p = S.player, it = resolveItem(id), nl = p.mejoras[id] || 0;
  if (nl >= 10) return;
  const costo = costoMejora(it, nl);
  if (p.oro < costo) return;
  p.oro -= costo;
  p.mejoras[id] = nl + 1;
  log(t("mejora.done", { arma: L(it.nombre), n: nl + 1 }), "bien");
  abrirMejora(loc);
}

