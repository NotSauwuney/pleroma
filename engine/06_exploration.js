"use strict";
/* PLÉROMA — Exploración del overworld + granjas de Solaz (hub/cocina)
   (extraído de engine.js · sección de líneas originales 737-927) */

/* ============================================================
   SISTEMA DE INMOVILIDAD  —  reflejo de supervivencia + porteador
   ------------------------------------------------------------
   Cuando el jugador está en estado inmóvil (fat+ful > FUE×16) y NO tiene
   Levitación de Plenitud, dispone de UNA sola acción de movimiento antes de
   quedar bloqueado: el "reflejo de supervivencia". Tras usarlo se activa
   _reflexUsed y el motor muestra el estado reducido (descansar / porteador).

   Brul (el porteador) es la salida sin magia: cobra oro cada PORTEADOR_CADA
   asistencias; si no hay oro, fuerza pérdida de grasa antes de moverse.

   Con levitacion_feast equipada: _reflexUsed nunca se activa y costoMovimiento
   se reduce al 25% de maxSta (ver engine/02_body.js).
   ============================================================ */
const PORTEADOR_CADA       = 5;   // cada cuántas asistencias cobra Brul
const PORTEADOR_PRECIO     = 15;  // oro por ronda de cobro
const PORTEADOR_PENALIZACION = 8; // kg de grasa perdida si no puede pagar

/* true si el jugador tiene Levitación de Plenitud. */
function hasLevitacion() {
  return S.player && S.player.spells && S.player.spells.includes("levitacion_feast");
}

/* true si el jugador está bloqueado por masa (inmóvil + reflejo agotado + sin levitación). */
function bloqueadoPorMasa() {
  return inmovil() && !!S.player._reflexUsed && !hasLevitacion();
}

/* Marca el reflejo como usado y logea el mensaje narrativo correspondiente. */
function marcarReflejo() {
  if (inmovil() && !hasLevitacion()) {
    S.player._reflexUsed = true;
    log(tPeso("log.reflejo"), "normal");
  }
}

/* Limpia el reflejo (al descansar o tras asistencia del porteador). */
function limpiarReflejo() {
  S.player._reflexUsed = false;
}
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

/* Mapa lugar-id -> acción de overworld. Reemplaza el viejo if-ladder de accionesZona:
   agregar un lugar nuevo es ahora una entrada acá, no otra rama. `cls` opcional.
   (forrajear se resuelve aparte porque su label/fn dependen de la zona.) */
const LUGARES_ACCION = {
  posada:           { label: "ex.inn",            fn: () => abrirTienda("posada") },
  tienda:           { label: "ex.shop",           fn: () => abrirTienda("tienda") },
  herreria:         { label: "ex.herreria",       fn: () => abrirTienda("herreria") },
  escuela_blanca:   { label: "ex.escuelaBl",      fn: () => abrirTienda("escuela_blanca") },
  escuela_gris:     { label: "ex.escuelaGr",      fn: () => abrirTienda("escuela_gris") },
  escuela_negra:    { label: "ex.escuelaNg",      fn: () => abrirTienda("escuela_negra") },
  escuela_plenitud: { label: "ex.escuelaPl",      fn: () => abrirTienda("escuela_plenitud") },
  descanso:         { label: "ex.rest",           fn: descansar },
  granja:           { label: "ex.granja",         fn: abrirGranja },
  puerto_bote:      { label: "ex.bote",           fn: hablarBarquero },
  entrenamiento_puerto: { label: "ex.entrenarPuerto", fn: abrirMenuEntrenamiento },
  puesto_solakh:    { label: "ex.puestoSolakh",   fn: () => abrirTienda("puesto_solakh") },
  nido_raices:      { label: "ex.nidoRaices",     fn: () => abrirTienda("nido_raices") },
  puerto_isla:      { label: "ex.puertoIsla", cls: "primary", fn: volverAlPuerto },
};

function accionesZona() {
  const z = GD.world.zonas[S.zona];
  const acts = [];
  // Sin aliento o bloqueado por masa: acciones reducidas.
  if (semiInmovil() || bloqueadoPorMasa()) {
    acts.push({ label: t("ex.catchBreath"), cls: "primary", fn: descansar });
    // Brul disponible cuando el jugador está inmóvil (sin levitación).
    if (inmovil() && !hasLevitacion()) {
      acts.push({ label: t("porteador.llamar"), fn: menuPorteador });
    }
    acts.push({ label: t("ex.checkStatus"), fn: () => verEstado("explorar") });
    acts.push({ label: t("ex.backpack"), fn: () => abrirMochila("explorar") });
    setActions(acts);
    return;
  }
  if (z.encuentro > 0) acts.push({ label: t("ex.explore"), cls: "primary", fn: explorar });
  // Si el jugador está inmóvil pero aún tiene el reflejo disponible, agrega opción de porteador.
  if (inmovil() && !hasLevitacion()) {
    acts.push({ label: t("porteador.llamar"), fn: menuPorteador });
  }
  (z.lugares || []).forEach((lug) => {
    if (lug === "forrajear") {   // label/fn dependen de si la zona es granja o monte
      acts.push({ label: t(z.forrajeoGranja ? "ex.recolectar" : "ex.forage"),
                  fn: z.forrajeoGranja ? () => forrajearGranja(z) : forrajear });
      return;
    }
    const def = LUGARES_ACCION[lug];
    if (def) acts.push({ label: t(def.label), cls: def.cls, fn: def.fn });
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
  // Si el movimiento no viene del porteador, marcar el reflejo de supervivencia.
  if (!S.player._porteadorActivo) marcarReflejo();
  S.player._porteadorActivo = false;
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
  if (!S.player._porteadorActivo) marcarReflejo();
  S.player._porteadorActivo = false;
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
  limpiarReflejo();
  tickQuest("rest", {});
  log(vacio ? tPeso("log.restEmpty") : tPeso("log.rest"), vacio ? "mal" : "bien");
  mostrarZona();
}

function forrajear() {
  S.player.sta = Math.max(0, S.player.sta - costoMovimiento());
  avanzarTiempo(1);
  if (S.mode === "muerte") return;
  if (!S.player._porteadorActivo) marcarReflejo();
  S.player._porteadorActivo = false;
  const z = GD.world.zonas[S.zona];
  const poolComida = (z && z.forrajeoComida) ? z.forrajeoComida : ["pan", "guiso", "agua", "pastel", null, null];
  const botin = choice(poolComida);
  if (botin) { darItem(botin, 1); log(t("log.forageGot", { item: L(GD.items[botin].nombre) }), "bien"); }
  else log(t("log.forageNothing"));
  if (z && z.materialForajeo && rand() < 0.05) {
    const mat = choice(z.materialForajeo);
    darItem(mat, 1);
    log(t("drop.forageRare", { item: L(GD.items[mat].nombre) }), "bien");
  }
  mostrarZona();
}

/* ============================================================
   BRUL (PORTEADOR)  —  asistente de movilidad
   ============================================================
   Brul es un NPC ambulante que ayuda a jugadores inmóviles a moverse.
   Cobra PORTEADOR_PRECIO de oro cada PORTEADOR_CADA asistencias.
   Si el jugador no tiene oro, le impone una penalización de grasa
   (pérdida de PORTEADOR_PENALIZACION kg) antes de ayudarlo.
   Siempre sugiere hablar con Vadak como alternativa permanente.
   ============================================================ */

/* Menú principal del porteador: muestra las opciones de movimiento disponibles. */
function menuPorteador() {
  S.screen = menuPorteador;
  const p = S.player;
  const z = GD.world.zonas[S.zona];
  const npc = GD.npcs.porteador;

  // Primera vez: presentación de Brul
  if (!p._porteadorKnown) {
    p._porteadorKnown = true;
    S.story = `${npcSprite("porteador")}<h2>${L(npc.nombre)}</h2>
      <p class="npcline">"${L(npc.dialogosPrimero)}"</p>
      <p>${t("porteador.intro")}</p>`;
    setActions([
      { label: t("porteador.pedirAyuda"), cls: "primary", fn: menuPorteadorMovs },
      { label: t("ui.back"), fn: mostrarZona },
    ]);
    return;
  }
  menuPorteadorMovs();
}

/* Pantalla de selección de movimiento con Brul. */
function menuPorteadorMovs() {
  S.screen = menuPorteadorMovs;
  const p = S.player;
  const z = GD.world.zonas[S.zona];
  const npc = GD.npcs.porteador;
  const yaHechos = (p.porteadorMovs || 0) % PORTEADOR_CADA;
  const quedan = yaHechos === 0 ? PORTEADOR_CADA : PORTEADOR_CADA - yaHechos;

  S.story = `${npcSprite("porteador")}<h2>${L(npc.nombre)}</h2>
    <p class="npcline">"${flavorRand(npc.saludo)}"</p>
    <p>${t("porteador.menuDesc", { quedan, cada: PORTEADOR_CADA, precio: PORTEADOR_PRECIO })}</p>
    <p>${t("shop.yourGold", { n: p.oro })}</p>`;

  const acts = [];
  if (z.encuentro > 0) {
    acts.push({ label: t("porteador.explorar"), cls: "primary",
      fn: () => porteadorMover(() => explorar()) });
  }
  z.salidas.forEach((s) => {
    acts.push({ label: t("ex.exitPrefix") + L(s.texto),
      fn: () => porteadorMover(() => viajar(s.a)) });
  });
  if (z.lugares && z.lugares.includes("forrajear")) {
    acts.push({ label: t("porteador.forrajear"),
      fn: () => porteadorMover(() => forrajear()) });
  }
  acts.push({ label: t("ui.back"), fn: mostrarZona });
  setActions(acts);
}

/* Ejecuta un movimiento con asistencia de Brul: cobra/penaliza y limpia el reflejo. */
function porteadorMover(movFn) {
  const p = S.player;
  const npc = GD.npcs.porteador;
  p.porteadorMovs = (p.porteadorMovs || 0) + 1;
  limpiarReflejo();

  const esCobro = p.porteadorMovs % PORTEADOR_CADA === 0;
  if (esCobro) {
    if (p.oro >= PORTEADOR_PRECIO) {
      p.oro -= PORTEADOR_PRECIO;
      log(`"${flavorRand(npc.dialogosCobro)}"`, "normal");
      log(t("porteador.cobrado", { n: PORTEADOR_PRECIO }), "mal");
    } else {
      // Sin oro: pérdida de grasa
      const perdida = Math.min(PORTEADOR_PENALIZACION, Math.max(0, p.fat - FAT_FLOOR));
      p.fat = Math.max(FAT_FLOOR, p.fat - perdida);
      log(`"${flavorRand(npc.dialogosSinOro)}"`, "normal");
      log(t("porteador.sinOroPenalizacion", { n: perdida }), "mal");
      log(`"${flavorRand(npc.dialogosVadak)}"`, "normal");
    }
  }

  p._porteadorActivo = true;
  movFn();
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
    { label: t("granja.workLabrar", { n: jobLabrar.costoSta }),  disabled: p.sta < jobLabrar.costoSta && !cheatOn("weightless"),  fn: () => trabajar("labrar", "granja") },
    { label: t("granja.workArrear", { n: jobArrear.costoSta }),  disabled: p.sta < jobArrear.costoSta && !cheatOn("weightless"),  fn: () => trabajar("arrear_vacas", "granja") },
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

/* ============================================================
   PUERTO DE SOLAZ — Bote del barquero + entrenamiento costero
   ============================================================ */

/* Hablar con el barquero sobre el bote. Devuelve al overworld de la zona.
   Si el jugador es nivel >= 8, el barquero acepta zarpar y ofrece dos destinos. */
function hablarBarquero() {
  S.screen = hablarBarquero;
  const npc = GD.npcs.barquero;
  const p = S.player;
  const puedeZarpar = p.nivel >= 8;

  if (puedeZarpar) {
    const linea = flavorRand(npc.dialogosBoteUnlock);
    S.story = `${npcSprite("barquero")}<h2>${L(npc.nombre)}</h2>
      <p class="npcline">"${linea}"</p>
      <p class="hint">${t("barco.zarparHint")}</p>`;
    setActions([
      { label: t("barco.destino.desierto"), cls: "primary", fn: () => iniciarViajeBarco("arenales_solakh") },
      { label: t("barco.destino.megaflora"), cls: "primary", fn: () => iniciarViajeBarco("gran_manto") },
      { label: t("shop.talkMore"),  fn: () => hablarNPCPuerto("barquero") },
      { label: t("ui.back"), fn: mostrarZona },
    ]);
  } else {
    const linea = flavorRand(npc.dialogosBote);
    S.story = `${npcSprite("barquero")}<h2>${L(npc.nombre)}</h2>
      <p class="npcline">"${linea}"</p>
      <p class="hint">${t("puerto.boteHint")}</p>`;
    setActions([
      { label: t("shop.talkMore"),  fn: () => hablarNPCPuerto("barquero") },
      { label: t("ui.back"), cls: "primary", fn: mostrarZona },
    ]);
  }
}

/* ============================================================
   VIAJE EN BARCO — 30 turnos de travesía oceánica
   ============================================================ */
const BARCO_TURNOS_TOTAL = 30;
const BARCO_ENCUENTRO_CHANCE = 0.50;
const BARCO_JEFE_CHANCE = 0.10; // dentro del 50%

function iniciarViajeBarco(destino) {
  S.barco = { turnos: 0, destino: destino };
  log(t("barco.zarpa"), "bien");
  mostrarBarco();
}

function mostrarBarco() {
  S.screen = mostrarBarco;
  const b = S.barco;
  const turnosRestantes = BARCO_TURNOS_TOTAL - b.turnos;
  S.story = `<h2>${t("barco.titulo")}</h2>
    <p>${t("barco.progreso", { n: b.turnos, total: BARCO_TURNOS_TOTAL })}</p>
    <p>${t("barco.descripcion")}</p>`;
  const acts = [];
  if (semiInmovil() || bloqueadoPorMasa()) {
    acts.push({ label: t("ex.catchBreath"), cls: "primary", fn: barcoDescansar });
    acts.push({ label: t("ex.checkStatus"), fn: () => verEstado("barco") });
    acts.push({ label: t("ex.backpack"), fn: () => abrirMochila("barco") });
    setActions(acts);
    return;
  }
  acts.push({ label: t("barco.accion.descansar"), cls: "primary", fn: barcoDescansar });
  acts.push({ label: t("barco.accion.pescar"), fn: barcoPescar });
  acts.push({ label: t("barco.accion.charlar"), fn: barcoCharlar });
  acts.push({ label: t("ex.checkStatus"), fn: () => verEstado("barco") });
  acts.push({ label: t("ex.backpack"), fn: () => abrirMochila("barco") });
  setActions(acts);
}

function barcoTurno() {
  const b = S.barco;
  b.turnos++;
  avanzarTiempo(2);
  if (S.mode === "muerte" || !S.barco) return false;
  // Comprueba llegada
  if (b.turnos >= BARCO_TURNOS_TOTAL) {
    llegarDestino();
    return false;
  }
  // Encuentro aleatorio. El Amuleto de Intimidación (misión secreta de las islas)
  // intimida a las criaturas del Mar de las Fauces: la travesía queda sin combates.
  // Los drops del enemigo interceptado caen igual (misma probabilidad que al matarlo).
  if (tieneItem("amuleto_intimidacion")) {
    if (rand() < BARCO_ENCUENTRO_CHANCE) {
      const eId = rand() < BARCO_JEFE_CHANCE ? "titan_marino" : choice(GD.enemyPools.oceano);
      const e = GD.enemies[eId];
      log(t("barco.amuletoCalma"), "bien");
      otorgarGota(e);   // el amuleto intercepta al enemigo: sus drops caen igual
    }
    return true;
  }
  if (rand() < BARCO_ENCUENTRO_CHANCE) {
    if (rand() < BARCO_JEFE_CHANCE) {
      iniciarCombate("titan_marino");
    } else {
      iniciarCombate(choice(GD.enemyPools.oceano));
    }
    return false; // el combate toma el control
  }
  return true; // turno sin combate, continuar
}

function barcoDescansar() {
  const p = S.player;
  const vacio = p.ful < EMPTY_THRESHOLD;
  p.hea = Math.min(maxHea(), p.hea + round(maxHea() * 0.4));
  p.sta = maxSta();
  p.mana = maxMana();
  limpiarReflejo();
  log(vacio ? tPeso("log.restEmpty") : t("barco.descansoLog"), vacio ? "mal" : "bien");
  if (!barcoTurno()) return;
  mostrarBarco();
}

function barcoPescar() {
  S.player.sta = Math.max(0, S.player.sta - costoMovimiento());
  marcarReflejo();
  // Resultado de la pesca
  const r = rand();
  if (r < 0.55) {
    const pescado = choice(["pez_abisal", "pez_abisal", "calamar_ahumado"]);
    darItem(pescado, 1);
    log(t("barco.pescaGot", { item: L(GD.items[pescado].nombre) }), "bien");
  } else if (r < 0.65) {
    // Drop raro de monstruo oceánico
    const drops = [{ id: "escama_abisal" }, { id: "tentaculo_salado" }];
    const d = choice(drops);
    darItem(d.id, 1);
    log(t("barco.pescaRara", { item: L(GD.items[d.id].nombre) }), "bien");
  } else {
    log(t("barco.pescaNada"));
  }
  if (!barcoTurno()) return;
  mostrarBarco();
}

function barcoCharlar() {
  marcarReflejo();
  const linea = flavorRand(GD.npcs.barquero.tripulacion);
  log(`"${linea}"`, "normal");
  if (!barcoTurno()) return;
  mostrarBarco();
}

function llegarDestino() {
  const destino = S.barco.destino;
  S.barco = null;
  log(t("barco.llegada." + destino), "bien");
  entrarZona(destino);
}

/* La muerte durante el viaje en barco la maneja morir() en engine/12_endgame.js:
   muestra la causa + el rescate naval de Solakh y revive en el puerto (no en el Vado). */

/* Puerto de isla — volver sin combate al puerto de Solaz */
function volverAlPuerto() {
  log(t("barco.regreso"), "normal");
  entrarZona("puerto");
}

function hablarNPCPuerto(npcId) {
  S.screen = () => hablarNPCPuerto(npcId);
  const npc = GD.npcs[npcId];
  S.story = `${npcSprite(npcId)}<h2>${L(npc.nombre)}</h2><p class="npcline">"${flavorRand(npc.dialogos)}"</p>`;
  setActions([
    { label: t("shop.talkMore"), fn: () => hablarNPCPuerto(npcId) },
    { label: t("ui.back"), cls: "primary", fn: mostrarZona },
  ]);
}

/* Submenú que lista las 4 opciones de entrenamiento con descripción de stats. */
function abrirMenuEntrenamiento() {
  S.screen = abrirMenuEntrenamiento;
  const p = S.player;
  S.story = `<h2>${t("puerto.menuTitle")}</h2>
    <p>${t("puerto.menuIntro")}</p>
    <ul class="train-list">
      <li>${t("puerto.menuDesc.remada")}</li>
      <li>${t("puerto.menuDesc.velas")}</li>
      <li>${t("puerto.menuDesc.sondeo")}</li>
      <li>${t("puerto.menuDesc.redes")}</li>
    </ul>`;
  const sinSta = (n) => p.sta < n && !cheatOn("weightless");
  setActions([
    { label: t("ex.entrenarRemada",  { n: 30 }), disabled: sinSta(30), fn: () => entrenarPuerto("FUE", "AGI", "remada") },
    { label: t("ex.entrenarVelas",   { n: 28 }), disabled: sinSta(28), fn: () => entrenarPuerto("AGI", "EST", "velas")  },
    { label: t("ex.entrenarSondeo",  { n: 25 }), disabled: sinSta(25), fn: () => entrenarPuerto("INT", "AGU", "sondeo") },
    { label: t("ex.entrenarRedes",   { n: 30 }), disabled: sinSta(30), fn: () => entrenarPuerto("FUE", "EST", "redes")  },
    { label: t("ui.back"), cls: "primary", fn: mostrarZona },
  ]);
}

/* Entrenamiento pasivo de stats en el puerto.
   entrenaPair: id de actividad (para logs localizados)
   statA / statB: las dos claves de stat que entrena esta actividad.
   El cap de cada stat = Math.max(2, floor(p.base[stat] / 3)).
   Solo p.base cuenta: sin armadura, sin portStats mismos.
   Da también una pequeña recompensa en oro por el trabajo. */
function entrenarPuerto(statA, statB, actividad) {
  const p = S.player;
  const COSTOS = { remada: 30, velas: 28, sondeo: 25, redes: 30 };
  const costo = COSTOS[actividad] || 30;

  if (p.sta < costo && !cheatOn("weightless")) { log(tPeso("shop.tooTired"), "mal"); mostrarZona(); return; }
  if (!p.portStats) p.portStats = {};

  if (!cheatOn("weightless")) p.sta -= costo;
  avanzarTiempo(4);
  if (S.mode === "muerte") return;

  // Pago base de oro (trabajo en el puerto)
  const pago = 4 + randInt(6);
  p.oro += pago;

  const capA = capEntrenamientoPuerto(statA);
  const capB = capEntrenamientoPuerto(statB);
  const yaA  = p.portStats[statA] || 0;
  const yaB  = p.portStats[statB] || 0;
  const subioA = yaA < capA;
  const subioB = yaB < capB;

  if (subioA) p.portStats[statA] = yaA + 1;
  if (subioB) p.portStats[statB] = yaB + 1;

  log(t("puerto.entrenar." + actividad), "bien");
  log(t("shop.earned", { n: pago }), "bien");

  if (subioA || subioB) {
    const gains = [];
    if (subioA) gains.push(t("stat." + statA + ".abbr") + " +1");
    if (subioB) gains.push(t("stat." + statB + ".abbr") + " +1");
    log(t("puerto.statGain", { stats: gains.join(", ") }), "bien");
  } else {
    log(t("puerto.capReached", { statA: t("stat." + statA + ".abbr"), statB: t("stat." + statB + ".abbr"),
      capA, capB }), "normal");
  }

  abrirMenuEntrenamiento();
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

