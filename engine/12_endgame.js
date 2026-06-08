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
  p.xp = Math.floor(p.xp * 0.5);                       // -50% del progreso al siguiente nivel
  if (causa !== "inanicion") p.oro = Math.floor(p.oro * 0.5);  // el desmayo por hambre no te roba oro
  mostrarMuerte(causa);
}

function mostrarMuerte(causa) {
  S.mode = "muerte";
  S.screen = () => mostrarMuerte(causa);
  const p = S.player;
  const penaltyKey = causa === "inanicion" ? "death.penaltyStarved" : "death.penalty";
  S.story = `<h2>${t("death.title")}</h2>
    <p>${t("death." + causa)}</p>
    <p class="hint">${t(penaltyKey, { xp: p.xp, oro: p.oro })}</p>`;
  setActions([{ label: t("death.wakeBtn"), cls: "primary", fn: () => revivir(causa) }]);
}

function revivir(causa) {
  const p = S.player;
  p.tempStats = {};
  p.accionesVacio = 0;
  p.hea = maxHea();
  p.mana = maxMana();
  p.sta = maxSta();
  let wakeKey = "death.wake";
  if (causa === "inanicion") {
    p.ful = 40;                              // el hospital te da de comer
    p.fat = Math.max(p.fat, FAT_FLOOR + 8);  // y te recompone algo de reservas
    wakeKey = "death.wakeStarved";
  } else {
    p.ful = 0;                               // despertás hambriento; la grasa (peso) se conserva
  }
  S.combate = null;
  S.mode = "explorar";
  S.zona = GD.world.inicio;
  const pintar = () => {
    const town = L(GD.world.zonas[GD.world.inicio].nombre);
    S.story = `<h2>${town}</h2><p>${t(wakeKey, { town })}</p>`;
    accionesZona();
  };
  S.screen = pintar; pintar();
}

/* ============================================================
   GUARDADO
   ============================================================ */
const SAVE_KEY = "pleroma_save_v1";
function guardar() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ player: S.player, zona: S.zona }));
    log(t("menu.saved"), "bien");
  } catch (e) { log(t("menu.saveFail"), "mal"); }
  render();
}
function haySave() { try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; } }
function cargar() {
  try {
    const d = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!d) return;
    S.player = d.player;
    if (S.player.arma && S.player.arma.id) S.player.arma = GD.items[S.player.arma.id] || GD.items.garras;
    if (S.player.armadura && S.player.armadura.id) S.player.armadura = GD.items[S.player.armadura.id] || GD.items.sinArmar;
    S.player.tempStats = S.player.tempStats || {};
    S.player.mejoras = S.player.mejoras || {};
    S.player.pronombres = S.player.pronombres || { s: "they", o: "them", p: "their" };
    S.player.accionesDesdeEvento = S.player.accionesDesdeEvento || 0;
    S.player.npcWG = S.player.npcWG || {};
    S.player.quests = S.player.quests || {};
    S.player.spells = S.player.spells || [];
    S.player.mejoras = S.player.mejoras || {};
    clearLog();
    log(t("menu.loaded"), "bien");
    entrarZona(d.zona || GD.world.inicio);
  } catch (e) { log(t("menu.loadFail"), "mal"); }
}

/* ============================================================
   MENÚ PRINCIPAL  +  ARRANQUE
   ============================================================ */
function menuPrincipal() {
  S.mode = "menu";
  S.screen = menuPrincipal;
  S.player = null;
  S.story = `<h1>PLÉROMA</h1>
    <p class="tag">${t("menu.tagline")}</p>
    <p>${t("menu.intro")}</p>`;
  setActions([
    { label: t("menu.new"), cls: "primary", fn: nuevaPartida },
    { label: t("menu.continue"), fn: cargar, disabled: !haySave() },
  ]);
}

function renderTopbar() {
  $("#btnGuardar").textContent = t("ui.save");
  $("#btnMenu").textContent = t("ui.menu");
  $("#btnUnidades").textContent = GD.unidades === "imperial" ? t("ui.imperial") : t("ui.metric");
  $("#lblLang").textContent = t("ui.language") + ":";
  $("#lblLog").textContent = t("ui.logHeader");
  const sel = $("#selLang");
  sel.innerHTML = langList().map((c) =>
    `<option value="${c}"${c === GD.lang ? " selected" : ""}>${langName(c)}</option>`).join("");
}

function bindTopbar() {
  $("#btnGuardar").onclick = () => { if (S.player) guardar(); };
  $("#btnMenu").onclick = menuPrincipal;
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
