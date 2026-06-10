"use strict";
/* PLÉROMA — Exploración del overworld + granjas de Solaz (hub/cocina)
   (extraído de engine.js · sección de líneas originales 737-927) */
/* ============================================================
   EXPLORACIÓN
   ============================================================ */
function entrarZona(id) {
  S.zona = id;
  S.mode = "explorar";
  if (tickEvento() && eventoAleatorio()) return;
  mostrarZona();
}

// Dibuja la zona (descripción + acciones). Es la "pantalla" de exploración.
function mostrarZona() {
  S.screen = mostrarZona;
  const z = GD.world.zonas[S.zona];
  // Sprite de zona opcional: assets/sprites/zone/<id>.png (si falta, no se renderiza)
  const spr = spriteImg("zone", [S.zona], "spr-zone");
  S.story = `${spr}<h2>${L(z.nombre)}</h2><p>${flavorRand(z.descripcion)}</p>`;
  accionesZona();
}

function accionesZona() {
  const z = GD.world.zonas[S.zona];
  const acts = [];
  // Sin aliento: solo podés recuperar el aliento (descansar), mochila o chequear estado.
  if (semiInmovil()) {
    acts.push({ label: t("ex.catchBreath"), cls: "primary", fn: descansar });
    acts.push({ label: t("ex.checkStatus"), fn: () => verEstado("explorar") });
    acts.push({ label: t("ex.backpack"), fn: () => abrirMochila("explorar") });
    setActions(acts);
    return;
  }
  if (z.encuentro > 0) acts.push({ label: t("ex.explore"), cls: "primary", fn: explorar });
  (z.lugares || []).forEach((lug) => {
    if (lug === "posada") acts.push({ label: t("ex.inn"), fn: () => abrirTienda("posada") });
    if (lug === "tienda") acts.push({ label: t("ex.shop"), fn: () => abrirTienda("tienda") });
    if (lug === "herreria") acts.push({ label: t("ex.herreria"), fn: () => abrirTienda("herreria") });
    if (lug === "escuela_blanca")   acts.push({ label: t("ex.escuelaBl"),  fn: () => abrirTienda("escuela_blanca") });
    if (lug === "escuela_gris")     acts.push({ label: t("ex.escuelaGr"),  fn: () => abrirTienda("escuela_gris") });
    if (lug === "escuela_negra")    acts.push({ label: t("ex.escuelaNg"),  fn: () => abrirTienda("escuela_negra") });
    if (lug === "escuela_plenitud") acts.push({ label: t("ex.escuelaPl"),  fn: () => abrirTienda("escuela_plenitud") });
    if (lug === "descanso") acts.push({ label: t("ex.rest"), fn: descansar });
    if (lug === "forrajear") acts.push({ label: t(z.forrajeoGranja ? "ex.recolectar" : "ex.forage"), fn: z.forrajeoGranja ? () => forrajearGranja(z) : forrajear });
    if (lug === "granja") acts.push({ label: t("ex.granja"), fn: abrirGranja });
  });
  z.salidas.forEach((s) => acts.push({ label: t("ex.exitPrefix") + L(s.texto), fn: () => viajar(s.a) }));
  acts.push({ label: t("ex.checkStatus"), fn: () => verEstado("explorar") });
  acts.push({ label: t("ex.backpack"), fn: () => abrirMochila("explorar") });
  if (S.player.puntos > 0) acts.push({ label: t("ex.distribute"), cls: "primary", fn: () => abrirStats("explorar") });
  setActions(acts);
}

function viajar(id) {
  S.player.sta = Math.max(0, S.player.sta - costoMovimiento());
  avanzarTiempo(2);
  if (S.mode === "muerte") return;
  log(t("log.travel"));
  S.zona = id;
  S.mode = "explorar";
  if (tickEvento() && eventoAleatorio()) return;
  mostrarZona();
}

function explorar() {
  const z = GD.world.zonas[S.zona];
  S.player.sta = Math.max(0, S.player.sta - costoMovimiento());
  avanzarTiempo(1);
  if (S.mode === "muerte") return;
  if (rand() < z.encuentro) {
    const pool = GD.enemyPools[z.bioma] || [];
    if (pool.length) { iniciarCombate(choice(pool)); return; }
  }
  const r = rand();
  if (r < 0.4) {
    const oro = randInt(8) + 2;
    S.player.oro += oro;
    log(t("log.foundGold", { n: oro }), "bien");
  } else if (r < 0.6) {
    darItem("pan", 1);
    log(t("log.foundBread"), "bien");
  } else {
    log(t("log.nothing"));
  }
  if (tickEvento() && eventoAleatorio()) return;
  mostrarZona();
}

function descansar() {
  const p = S.player;
  const vacio = p.ful < EMPTY_THRESHOLD;
  avanzarTiempo(4);
  if (S.mode === "muerte") return;
  p.hea = Math.min(maxHea(), p.hea + round(maxHea() * 0.4));
  p.sta = maxSta();
  p.mana = maxMana();
  tickQuest("rest", {});
  log(vacio ? t("log.restEmpty") : t("log.rest"), vacio ? "mal" : "bien");
  mostrarZona();
}

function forrajear() {
  S.player.sta = Math.max(0, S.player.sta - costoMovimiento());
  avanzarTiempo(1);
  if (S.mode === "muerte") return;
  const botin = choice(["pan", "guiso", "agua", "pastel", null, null]);
  if (botin) { darItem(botin, 1); log(t("log.forageGot", { item: L(GD.items[botin].nombre) }), "bien"); }
  else log(t("log.forageNothing"));
  // Chance muy baja de encontrar un material de la zona
  const z = GD.world.zonas[S.zona];
  if (z && z.materialForajeo && rand() < 0.05) {
    const mat = choice(z.materialForajeo);
    darItem(mat, 1);
    log(t("drop.forageRare", { item: L(GD.items[mat].nombre) }), "bien");
  }
  mostrarZona();
}

/* ============================================================
   GRANJAS DE SOLAZ — recolección, hub, cocina
   ============================================================ */
function forrajearGranja(z) {
  S.player.sta = Math.max(0, S.player.sta - costoMovimiento());
  avanzarTiempo(1);
  if (S.mode === "muerte") return;
  const id = choice(z.forrajeoGranja);
  darItem(id, 1);
  const nombreIt = GD.items[id] ? L(GD.items[id].nombre) : id;
  log(t("log.forageGranja", { item: nombreIt }), "bien");
  // 20% de cosecha generosa: un ingrediente extra al azar
  if (rand() < 0.20) {
    const id2 = choice(z.forrajeoGranja);
    darItem(id2, 1);
    const nombre2 = GD.items[id2] ? L(GD.items[id2].nombre) : id2;
    log(t("log.forageGranjaBonus", { item: nombre2 }), "bien");
  }
  mostrarZona();
}

function abrirGranja() {
  S.mode = "tienda";
  S.screen = abrirGranja;
  const p = S.player;
  const jobLabrar  = GD.trabajos.labrar;
  const jobArrear  = GD.trabajos.arrear_vacas;
  S.story = `<h2>${t("granja.title")}</h2><p>${t("granja.desc")} ${t("shop.yourGold", { n: p.oro })}</p>`;
  setActions([
    { label: t("granja.talkFarmer"),                                    fn: () => hablarNPC("granjero", "granja") },
    { label: t("granja.talkCook"),                                      fn: () => hablarNPC("cocinera", "granja") },
    { label: t("granja.fogon"),                                         fn: abrirCocina },
    { label: t("granja.workLabrar", { n: jobLabrar.costoSta }),  disabled: p.sta < jobLabrar.costoSta,  fn: () => trabajar("labrar", "granja") },
    { label: t("granja.workArrear", { n: jobArrear.costoSta }),  disabled: p.sta < jobArrear.costoSta,  fn: () => trabajar("arrear_vacas", "granja") },
    { label: t("shop.exit"), cls: "primary", fn: () => entrarZona(S.zona) },
  ]);
}

function puedeCocinar(r) {
  return Object.entries(r.ingredientes).every(([id, cant]) => cantMaterial(id) >= cant);
}

function abrirCocina() {
  S.screen = abrirCocina;
  let h = `<h2>${t("cocina.title")}</h2><p>${t("cocina.hint")}</p>`;
  Object.values(GD.recetasCocina).forEach((r) => {
    const puede = puedeCocinar(r);
    const ingredList = Object.entries(r.ingredientes).map(([id, cant]) => {
      const it = GD.items[id];
      const tiene = cantMaterial(id);
      const ok = tiene >= cant;
      const nombre = it ? L(it.nombre) : id;
      return `<span class="${ok ? "" : "mal"}">${nombre} ×${cant} (${ok ? "✓" : tiene + "/" + cant})</span>`;
    }).join(", ");
    h += `<div class="shoprow">
      <span class="shopname">${L(r.nombre)}</span>
      <span class="invinfo">${ingredList}</span>
      <button class="cocinarbtn" data-id="${r.id}" ${puede ? "" : "disabled"}>${puede ? t("cocina.cook") : t("cocina.cantCook")}</button>
    </div>`;
  });
  S.story = h;
  setActions([{ label: t("ui.back"), cls: "primary", fn: abrirGranja }]);
  document.querySelectorAll(".cocinarbtn[data-id]:not([disabled])").forEach((b) => {
    b.onclick = () => cocinar(b.dataset.id);
  });
}

function cocinar(recetaId) {
  const r = GD.recetasCocina[recetaId];
  if (!r || !puedeCocinar(r)) { abrirCocina(); return; }
  Object.entries(r.ingredientes).forEach(([id, cant]) => {
    for (let i = 0; i < cant; i++) quitarItem(id);
  });
  darItemObj(r.resultado, 1);
  log(t("cocina.done", { nombre: L(r.nombre) }), "bien");
  abrirCocina();
}

