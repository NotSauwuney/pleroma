"use strict";
/* PLÉROMA — Muerte/respawn, guardado, menú principal y arranque (bootstrap)
   (extraído de engine.js · sección de líneas originales 2135-2258) */
/* ============================================================
   MUERTE  ->  RESPAWN EN EL PUEBLO
   ============================================================ */
function morir(causa) {
  if (S.mode === "muerte") return;   // ya muerto: no re-aplicar penalizaciones
  const p = S.player;
  S.combate = null;
  S.miniEvento = null;   // abortar mini-evento activo al morir
  p.xp = Math.floor(p.xp * 0.5);                       // -50% del progreso al siguiente nivel
  if (causa !== "inanicion") p.oro = Math.floor(p.oro * 0.5);  // el desmayo por hambre no te roba oro
  // Si el jugador caía en viaje por el océano, el rescate naval tiene flavor especial,
  // pero la CAUSA de muerte se muestra igual (antes se salteaba directo al puerto:
  // ni pantalla de muerte ni curación — bug de "me mandó al spawn sin causa").
  const enBarco = !!S.barco;
  if (enBarco) S.barco = null;
  mostrarMuerte(causa, enBarco);
}

function mostrarMuerte(causa, enBarco) {
  S.mode = "muerte";
  S.screen = () => mostrarMuerte(causa, enBarco);
  const p = S.player;
  const penaltyKey = causa === "inanicion" ? "death.penaltyStarved" : "death.penalty";
  const rescate = enBarco ? `<p>${t("barco.rescate")}</p>` : "";
  S.story = `<h2>${t("death.title")}</h2>
    <p>${t("death." + causa)}</p>
    ${rescate}
    <p class="hint">${t(penaltyKey, { xp: p.xp, oro: p.oro })}</p>`;
  setActions([{ label: t(enBarco ? "death.wakeBtnPuerto" : "death.wakeBtn"), cls: "primary", fn: () => revivir(causa, enBarco) }]);
}

function revivir(causa, enBarco) {
  const p = S.player;
  p.tempStats = {};
  p.accionesVacio = 0;
  p.hea = maxHea();
  p.mana = maxMana();
  p.sta = maxSta();
  let wakeKey = enBarco ? "death.wakePuerto" : "death.wake";
  if (causa === "inanicion") {
    p.ful = 40;                                                     // el hospital (o la enfermería naval) te da de comer
    p.fat = Math.max(p.fat, FAT_FLOOR + 8);                        // y te recompone algo de reservas
    p.leanLoss = Math.max(0, (p.leanLoss || 0) - 3);               // el tratamiento reconstituye masa magra
    if (!enBarco) wakeKey = "death.wakeStarved";
  } else {
    p.ful = 0;                               // despertás hambriento; la grasa (peso) se conserva
  }
  S.combate = null;
  S.mode = "explorar";
  // Muerte en el mar -> los soldados de Solakh te dejan en el puerto, no en el Vado.
  S.zona = enBarco ? "puerto" : GD.world.inicio;
  const zonaId = S.zona;
  const pintar = () => {
    const town = L(GD.world.zonas[zonaId].nombre);
    S.story = `<h2>${town}</h2><p>${t(wakeKey, { town })}</p>`;
    accionesZona();
  };
  S.screen = pintar; pintar();
}

/* ============================================================
   GUARDADO  —  sistema de múltiples ranuras + exportar/importar
   ============================================================ */
const SAVE_KEY_LEGACY = "pleroma_save_v1";   // backward compat
const SAVE_KEY_PREFIX = "pleroma_save_v2_slot_";
const SAVE_SLOTS = 5;

function _slotKey(i) { return SAVE_KEY_PREFIX + i; }

function _slotMeta(i) {
  try {
    const raw = localStorage.getItem(_slotKey(i));
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (!d || !d.player) return null;
    const fecha = d.fecha ? new Date(d.fecha).toLocaleDateString() : "—";
    return { nombre: d.player.nombre || "?", nivel: d.player.nivel || 1, fecha };
  } catch (e) { return null; }
}

function _legacyMeta() {
  try {
    const raw = localStorage.getItem(SAVE_KEY_LEGACY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (!d || !d.player) return null;
    return { nombre: d.player.nombre || "?", nivel: d.player.nivel || 1, fecha: "—" };
  } catch (e) { return null; }
}

function haySave() {
  for (let i = 0; i < SAVE_SLOTS; i++) {
    try { if (localStorage.getItem(_slotKey(i))) return true; } catch (e) {}
  }
  try { if (localStorage.getItem(SAVE_KEY_LEGACY)) return true; } catch (e) {}
  return false;
}

/* Migración de saves viejos: si el jugador ya tiene el hechizo recompensa de una quest,
   marcarla como completada para que la barra quede llena visualmente. */
function _migrarQuests(p) {
  if (!p.quests) p.quests = {};
  for (const id in GD.quests) {
    const q = GD.quests[id];
    if (!q.recompensa) continue;
    if (p.spells && p.spells.includes(q.recompensa)) {
      if (!p.quests[id]) p.quests[id] = { progress: 0, completed: false };
      if (!p.quests[id].completed) {
        p.quests[id].progress = q.cantidad;
        p.quests[id].completed = true;
      }
    }
  }
}

/* Aplica un objeto de partida a S.player y arranca el juego. */
function _aplicarSave(d) {
  S.player = d.player;
  if (S.player.arma && S.player.arma.id) S.player.arma = GD.items[S.player.arma.id] || GD.items.garras;
  if (S.player.armadura && S.player.armadura.id) S.player.armadura = GD.items[S.player.armadura.id] || GD.items.sinArmar;
  S.player.tempStats = S.player.tempStats || {};
  S.player.mejoras = S.player.mejoras || {};
  S.player.pronombres = S.player.pronombres || { s: "they", o: "them", p: "their" };
  S.player.accionesDesdeEvento = S.player.accionesDesdeEvento || 0;
  S.player.npcWG = S.player.npcWG || {};
  S.player.cheats = S.player.cheats || {};
  S.player.quests = S.player.quests || {};
  S.player.spells = S.player.spells || [];
  S.player.logros = S.player.logros || {};
  S.player.lifetimeStats = Object.assign({
    enemiesDevoured: 0,
    grapplesSurvived: 0,
    highestWeight: 0,
    highestFat: 0,
    timesObese: 0,
    mealsConsumed: 0,
  }, S.player.lifetimeStats || {});
  _migrarQuests(S.player);
  clearLog();
  log(t("menu.loaded"), "bien");
  entrarZona(d.zona || GD.world.inicio);
}

/* ---- GUARDAR ---- */
function _guardarEnSlot(i) {
  try {
    const data = { player: S.player, zona: S.zona, fecha: new Date().toISOString(), version: 2 };
    localStorage.setItem(_slotKey(i), JSON.stringify(data));
    log(t("save.saved", { n: i + 1 }), "bien");
  } catch (e) { log(t("menu.saveFail"), "mal"); }
  guardarPantalla(_guardarPantallaVolverA);
}

function _confirmarSobreescribir(i) {
  S.screen = () => _confirmarSobreescribir(i);
  S.story = `<h2>${t("save.overwriteTitle")}</h2><p>${t("save.overwriteBody", { n: i + 1 })}</p>`;
  setActions([
    { label: t("save.overwriteYes"), fn: () => _guardarEnSlot(i) },
    { label: t("save.overwriteNo"), cls: "primary", fn: () => guardarPantalla(_guardarPantallaVolverA) },
  ]);
}

function _borrarSlot(i) {
  try { localStorage.removeItem(_slotKey(i)); log(t("save.deleted", { n: i + 1 }), "bien"); }
  catch (e) { log(t("menu.saveFail"), "mal"); }
  guardarPantalla(_guardarPantallaVolverA);
}

function _confirmarBorrarSlot(i) {
  S.screen = () => _confirmarBorrarSlot(i);
  S.story = `<h2>${t("save.deleteTitle")}</h2><p>${t("save.deleteBody", { n: i + 1 })}</p>`;
  setActions([
    { label: t("save.deleteYes"), fn: () => _borrarSlot(i) },
    { label: t("save.deleteNo"), cls: "primary", fn: () => guardarPantalla(_guardarPantallaVolverA) },
  ]);
}

function _exportarSave() {
  if (!S.player) return;
  const data = { player: S.player, zona: S.zona, fecha: new Date().toISOString(), version: 2 };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safe = (S.player.nombre || "partida").replace(/[^a-zA-Z0-9_-]/g, "_");
  a.href = url;
  a.download = `pleroma_${safe}_nv${S.player.nivel || 1}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  log(t("save.exported"), "bien");
}

/* Pantalla de guardado. volverA: "zona" | "combate" */
let _guardarPantallaVolverA = "zona";
function guardarPantalla(volverA) {
  _guardarPantallaVolverA = volverA || "zona";
  S.screen = () => guardarPantalla(_guardarPantallaVolverA);
  let h = `<h2>${t("save.title")}</h2><div class="savelist">`;
  for (let i = 0; i < SAVE_SLOTS; i++) {
    const meta = _slotMeta(i);
    const info = meta
      ? `<b>${meta.nombre}</b> · Nv.${meta.nivel} · <span class="hint">${meta.fecha}</span>`
      : `<span class="hint">${t("save.slotEmpty")}</span>`;
    const deletebtn = meta
      ? `<button class="act slotbtn-delete" data-slot="${i}" style="color:var(--mal,#c44);">${t("save.deleteBtn")}</button>`
      : "";
    h += `<div class="saveslot">
      <span class="slotnum">${t("save.slot", { n: i + 1 })}</span>
      <span class="slotinfo">${info}</span>
      <button class="act slotbtn-save" data-slot="${i}">${t("save.saveHere")}</button>
      ${deletebtn}
    </div>`;
  }
  h += `</div>
  <div class="saveslot saveexport" style="margin-top:14px;padding-top:14px;border-top:1px solid var(--line);">
    <span class="slotinfo" style="font-size:13px;color:var(--muted);">${t("save.exportHint")}
      <span class="infotip" title="${t("save.exportTooltip")}">ⓘ</span>
      <b style="color:var(--accent2);font-size:12px;margin-left:6px;">${t("save.recommended")}</b>
    </span>
    <button class="act primary" id="btnExportSave">${t("save.exportBtn")}</button>
  </div>`;
  S.story = h;
  setActions([{ label: t("ui.back"), cls: "primary", fn: () => {
    if (_guardarPantallaVolverA === "combate") renderCombate(); else mostrarZona();
  }}]);
  document.querySelectorAll(".slotbtn-save").forEach((b) => {
    const i = +b.dataset.slot;
    b.onclick = () => _slotMeta(i) ? _confirmarSobreescribir(i) : _guardarEnSlot(i);
  });
  document.querySelectorAll(".slotbtn-delete").forEach((b) => {
    b.onclick = () => _confirmarBorrarSlot(+b.dataset.slot);
  });
  const btnEx = document.getElementById("btnExportSave");
  if (btnEx) btnEx.onclick = _exportarSave;
}

/* ---- CARGAR ---- */
function _cargarDesdeSlot(i) {
  try {
    const raw = localStorage.getItem(_slotKey(i));
    if (!raw) { log(t("menu.loadFail"), "mal"); return; }
    _aplicarSave(JSON.parse(raw));
  } catch (e) { log(t("menu.loadFail"), "mal"); }
}

function _cargarLegacy() {
  try {
    const raw = localStorage.getItem(SAVE_KEY_LEGACY);
    if (!raw) { log(t("menu.loadFail"), "mal"); return; }
    _aplicarSave(JSON.parse(raw));
  } catch (e) { log(t("menu.loadFail"), "mal"); }
}

function _importarDesdeArchivo(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const d = JSON.parse(String(reader.result));
      if (!d || !d.player) throw new Error("invalid");
      _aplicarSave(d);
    } catch (e) { log(t("menu.loadFail"), "mal"); renderLog(); }
  };
  reader.onerror = () => { log(t("menu.loadFail"), "mal"); renderLog(); };
  reader.readAsText(file, "utf-8");
}

function cargarPantalla() {
  S.mode = "menu";
  S.screen = cargarPantalla;
  S.player = null;
  let h = `<h2>${t("load.title")}</h2><div class="savelist">`;
  for (let i = 0; i < SAVE_SLOTS; i++) {
    const meta = _slotMeta(i);
    const info = meta
      ? `<b>${meta.nombre}</b> · Nv.${meta.nivel} · <span class="hint">${meta.fecha}</span>`
      : `<span class="hint">${t("save.slotEmpty")}</span>`;
    h += `<div class="saveslot">
      <span class="slotnum">${t("save.slot", { n: i + 1 })}</span>
      <span class="slotinfo">${info}</span>
      <button class="act slotbtn-load"${meta ? "" : " disabled"} data-slot="${i}">${t("load.loadBtn")}</button>
    </div>`;
  }
  // Ranura legacy (partida guardada con sistema viejo)
  const leg = _legacyMeta();
  if (leg) {
    h += `<div class="saveslot" style="margin-top:10px;padding-top:10px;border-top:1px solid var(--line);">
      <span class="slotnum hint">${t("load.legacySlot")}</span>
      <span class="slotinfo"><b>${leg.nombre}</b> · Nv.${leg.nivel}</span>
      <button class="act" id="btnLoadLegacy">${t("load.loadBtn")}</button>
    </div>`;
  }
  h += `</div>
  <div class="saveslot" style="margin-top:14px;padding-top:14px;border-top:1px solid var(--line);">
    <span class="slotinfo hint">${t("load.importHint")}</span>
    <button class="act" id="btnImportSave">${t("load.importBtn")}</button>
    <input type="file" id="inpSaveFile" accept=".json" style="display:none">
  </div>`;
  S.story = h;
  setActions([{ label: t("ui.back"), fn: menuPrincipal }]);
  document.querySelectorAll(".slotbtn-load").forEach((b) => {
    if (!b.disabled) b.onclick = () => _cargarDesdeSlot(+b.dataset.slot);
  });
  const btnLeg = document.getElementById("btnLoadLegacy");
  if (btnLeg) btnLeg.onclick = _cargarLegacy;
  const btnImp = document.getElementById("btnImportSave");
  const inpFile = document.getElementById("inpSaveFile");
  if (btnImp && inpFile) {
    btnImp.onclick = () => inpFile.click();
    inpFile.onchange = (ev) => {
      const file = ev.target.files && ev.target.files[0];
      if (file) _importarDesdeArchivo(file);
      inpFile.value = "";
    };
  }
}

/* Mantener compatibilidad: guardar() desde topbar llama a guardarPantalla */
function guardar() { if (S.player) guardarPantalla(); }

/* ============================================================
   CHEATS  —  pantalla de trucos (botón en la topbar)
   ------------------------------------------------------------
   Códigos instantáneos:
     makemerich     -> +10.000 de oro
     makemestronger -> +1 nivel (con sus 3 puntos de stat)
   Toggles persistentes (S.player.cheats, viajan en el save):
     makemeweightless -> ninguna acción gasta stamina
     makemeravenous   -> nunca morís por empacho
     makemeeternal    -> nunca morís por hambre ni por daño
   ============================================================ */
let _cheatsAnterior = null;
function pantallaCheats() {
  if (!S.player) return;
  // Guardar la pantalla previa solo al ENTRAR (no al re-render dentro de cheats),
  // para que "Volver" no quede atrapado apuntando a la propia pantalla de cheats.
  if (S.mode !== "cheats") _cheatsAnterior = S.screen;
  S.mode = "cheats";
  S.screen = pantallaCheats;
  const p = S.player;
  p.cheats = p.cheats || {};
  const estado = (k) => p.cheats[k]
    ? `<b style="color:var(--good)">[${t("cheat.on")}]</b>`
    : `<span class="hint">[${t("cheat.off")}]</span>`;
  S.story = `<h2>${t("cheat.title")}</h2>
    <p class="hint">${t("cheat.hint")}</p>
    <p><input id="inpCheat" type="text" maxlength="32" placeholder="${t("cheat.placeholder")}"></p>
    <ul class="train-list">
      <li><b>makemerich</b> — ${t("cheat.desc.rich")}</li>
      <li><b>makemestronger</b> — ${t("cheat.desc.stronger")}</li>
      <li><b>makemeweightless</b> — ${t("cheat.desc.weightless")} ${estado("weightless")}</li>
      <li><b>makemeravenous</b> — ${t("cheat.desc.ravenous")} ${estado("ravenous")}</li>
      <li><b>makemeeternal</b> — ${t("cheat.desc.eternal")} ${estado("eternal")}</li>
    </ul>`;
  setActions([
    { label: t("cheat.apply"), cls: "primary", fn: () => {
        const inp = $("#inpCheat");
        aplicarCheat(((inp && inp.value) || "").trim().toLowerCase());
        pantallaCheats();
    }},
    { label: t("ui.back"), fn: () => {
        const volver = _cheatsAnterior;
        _cheatsAnterior = null;
        S.mode = "explorar";   // la pantalla anterior re-establece su propio modo
        if (volver) { S.screen = volver; volver(); } else { mostrarZona(); }
    }},
  ]);
}

function aplicarCheat(code) {
  const p = S.player;
  if (!code) return;
  p.cheats = p.cheats || {};
  if (code === "makemerich") {
    p.oro += 10000;
    log(t("cheat.rich"), "bien");
    return;
  }
  if (code === "makemestronger") {
    p.nivel++;
    p.puntos += 3;
    p.xpSig = round(p.xpSig * 1.4);
    p.hea = maxHea();
    p.mana = maxMana();
    log(t("cheat.stronger", { n: p.nivel }), "bien");
    return;
  }
  const toggles = { makemeweightless: "weightless", makemeravenous: "ravenous", makemeeternal: "eternal" };
  if (toggles[code]) {
    const k = toggles[code];
    p.cheats[k] = !p.cheats[k];
    log(t(p.cheats[k] ? "cheat.toggleOn" : "cheat.toggleOff", { cheat: code }), p.cheats[k] ? "bien" : "normal");
    return;
  }
  log(t("cheat.unknown"), "mal");
}

/* ============================================================
   MENÚ PRINCIPAL  +  ARRANQUE
   ============================================================ */
function confirmarMenu() {
  // Si no hay partida activa, ir directo al menú sin preguntar
  if (!S.player || S.mode === "menu") { menuPrincipal(); return; }
  const anterior = S.screen;
  S.screen = confirmarMenu;
  S.story = `<h2>${t("ui.menuConfirmTitle")}</h2><p>${t("ui.menuConfirmBody")}</p>`;
  setActions([
    { label: t("ui.menuConfirmYes"), fn: menuPrincipal },
    { label: t("ui.menuConfirmNo"), cls: "primary", fn: () => { S.screen = anterior; anterior && anterior(); } },
  ]);
}

function menuPrincipal() {
  S.mode = "menu";
  S.screen = menuPrincipal;
  S.player = null;
  S.story = `<h1>PLÉROMA</h1>
    <p class="tag">${t("menu.tagline")}</p>
    <p>${t("menu.intro")}</p>`;
  setActions([
    { label: t("menu.new"), cls: "primary", fn: nuevaPartida },
    { label: t("menu.continue"), fn: cargarPantalla },
  ]);
}

function renderTopbar() {
  $("#btnGuardar").textContent = t("ui.save");
  $("#btnMenu").textContent = t("ui.menu");
  const bCh = $("#btnCheats");
  if (bCh) bCh.textContent = t("ui.cheats");
  $("#btnUnidades").textContent = GD.unidades === "imperial" ? t("ui.imperial") : t("ui.metric");
  $("#lblLang").textContent = t("ui.language") + ":";
  const bUp = $("#btnLangUpload"); if (bUp) bUp.title = t("ui.langUpload");
  $("#lblLog").textContent = t("ui.logHeader");
  const sel = $("#selLang");
  sel.innerHTML = langList().map((c) =>
    `<option value="${c}"${c === GD.lang ? " selected" : ""}>${langName(c)}</option>`).join("");
}

function bindTopbar() {
  $("#btnGuardar").onclick = () => {
    if (S.player) {
      const va = (S.mode === "combate") ? "combate" : "zona";
      guardarPantalla(va);
    }
  };
  $("#btnMenu").onclick = confirmarMenu;
  const bCh = $("#btnCheats");
  if (bCh) bCh.onclick = () => { if (S.player) pantallaCheats(); };
  $("#btnUnidades").onclick = toggleUnidades;
  $("#selLang").onchange = (ev) => { setLang(ev.target.value); renderTopbar(); };

  // --- Subir tu propio idioma (.js) en caliente ---
  const btnUp = $("#btnLangUpload"), inp = $("#inpLangFile");
  if (btnUp && inp && typeof loadLangFromText === "function") {
    btnUp.onclick = () => inp.click();
    inp.onchange = (ev) => {
      const file = ev.target.files && ev.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const res = loadLangFromText(String(reader.result));
        if (res.ok) {
          const code = res.codes[0];
          setLang(code);
          renderTopbar();
          if (typeof log === "function") log(`Idioma cargado: ${langName(code)} (${res.codes.join(", ")}).`, "bien");
        } else {
          alert("No se pudo cargar el idioma:\n\n" + res.error);
        }
      };
      reader.onerror = () => alert("No se pudo leer el archivo.");
      reader.readAsText(file, "utf-8");
      inp.value = "";   // permite re-subir el mismo archivo
    };
  }
}

// Envolvemos render para refrescar también la topbar al cambiar idioma
const _render = render;
render = function () { _render(); renderTopbar(); };

window.addEventListener("DOMContentLoaded", () => {
  bindTopbar();
  renderTopbar();
  menuPrincipal();
});
