"use strict";
/* PLÉROMA — Creación de personaje (especie, identidad, stats)
   (extraído de engine.js · sección de líneas originales 540-736) */
/* ============================================================
   CREACIÓN DE PERSONAJE
   ============================================================ */
function nuevaPartida() {
  S.creacion = {
    paso: 0, nombre: "", especie: GD.species[0].id,
    base: { FUE: 4, AGI: 4, INT: 4, AGU: 4, EST: 4, TAM: 4 }, puntos: 6,
    // Estado del creador personalizado (arranca en un reparto balanceado = presupuesto exacto)
    customNombre: "",
    customBase: { FUE: 11, AGI: 11, INT: 11, AGU: 11, EST: 10, TAM: 10 },
    // Identidad (paso compartido por todas las especies)
    pron: { s: "they", o: "them", p: "their" },
    alturaCm: null,   // se inicializa con el default de la especie al llegar al paso de identidad
    pelaje: "",
    cobertura: "pelaje",   // solo editable para especie custom; las del catálogo la traen fija
  };
  S.mode = "creacion";
  renderCreacion();
}

function renderCreacion() {
  S.screen = renderCreacion;
  const c = S.creacion;
  if (c.paso === 0) {
    const town = L(GD.world.zonas[GD.world.inicio].nombre);
    S.story = `<h2>${town}</h2>
      <p>${t("cr.intro")}</p>
      <p>${t("cr.askName")}</p>
      <p><input id="inpNombre" type="text" maxlength="20" placeholder="${t("cr.namePlaceholder")}" value="${c.nombre}"></p>`;
    setActions([{ label: t("cr.next"), cls: "primary", fn: () => {
      const v = $("#inpNombre");
      c.nombre = (v && v.value || "").trim() || t("cr.defaultName");
      c.paso = 1; renderCreacion();
    }}]);
  } else if (c.paso === 1) {
    let opts = GD.species.map((s) => {
      const sel = s.id === c.especie ? " sel" : "";
      const st = STAT_KEYS.map((k, i) => `${t("stat." + k + ".abbr")} ${s.stats[i] >= 0 ? "+" : ""}${s.stats[i]}`).join("  ");
      return `<div class="spcard${sel}" data-id="${s.id}">
        <b>${L(s.nombre)}</b><div class="spdesc">${L(s.descripcion)}</div>
        <div class="spstats">${st}</div></div>`;
    }).join("");
    const selC = c.especie === "custom" ? " sel" : "";
    opts += `<div class="spcard custom${selC}" data-id="custom">
      <b>${t("cr.customCard")}</b><div class="spdesc">${t("cr.customCardDesc")}</div>
      <div class="spstats">★ ${PRESUPUESTO_CUSTOM} pts</div></div>`;
    S.story = `<h2>${t("cr.chooseSpecies")}</h2><p>${t("cr.speciesIntro")}</p><div class="spgrid">${opts}</div>`;
    setActions([
      { label: t("cr.prev"), fn: () => { c.paso = 0; renderCreacion(); } },
      { label: t("cr.next"), cls: "primary", fn: () => { c.paso = 2; renderCreacion(); } },
    ]);
    document.querySelectorAll(".spcard").forEach((card) => {
      card.onclick = () => { c.especie = card.dataset.id; renderCreacion(); };
    });
  } else if (c.paso === 2) {
    if (c.especie === "custom") { renderCreacionCustom(); return; }
    const filas = STAT_KEYS.map((k) => `
      <div class="ptrow">
        <span class="ptname">${t("stat." + k + ".abbr")} — ${t("stat." + k + ".name")}<span class="ptdesc">${t("stat." + k + ".desc")}</span></span>
        <button class="ptbtn" data-k="${k}" data-d="-1">−</button>
        <b class="ptval">${c.base[k]}</b>
        <button class="ptbtn" data-k="${k}" data-d="1">＋</button>
      </div>`).join("");
    S.story = `<h2>${t("cr.distribute")}</h2>
      <p>${t("cr.pointsFree", { n: c.puntos })}</p>
      <div class="ptgrid">${filas}</div>
      <p class="hint">${t("cr.hint")}</p>`;
    setActions([
      { label: t("cr.prev"), fn: () => { c.paso = 1; renderCreacion(); } },
      { label: t("cr.next"), cls: "primary", fn: () => { c.paso = 3; renderCreacion(); } },
    ]);
    document.querySelectorAll(".ptbtn").forEach((b) => {
      b.onclick = () => {
        const k = b.dataset.k, d = +b.dataset.d;
        if (d > 0 && c.puntos > 0 && c.base[k] < 12) { c.base[k]++; c.puntos--; }
        if (d < 0 && c.base[k] > 4) { c.base[k]--; c.puntos++; }
        renderCreacion();
      };
    });
  } else if (c.paso === 3) {
    renderCreacionIdentidad();
  }
}

// Lee el nombre custom hacia el estado (se pierde al re-dibujar si no)
function snapshotCustom() {
  const n = $("#inpCustomName"); if (n) S.creacion.customNombre = n.value;
}

function renderCreacionCustom() {
  const c = S.creacion;
  const total = STAT_KEYS.reduce((s, k) => s + c.customBase[k], 0);
  const filas = STAT_KEYS.map((k) => `
    <div class="ptrow">
      <span class="ptname">${t("stat." + k + ".abbr")} — ${t("stat." + k + ".name")}<span class="ptdesc">${t("stat." + k + ".desc")}</span></span>
      <button class="ptbtn" data-k="${k}" data-d="-1">−</button>
      <b class="ptval">${c.customBase[k]}</b>
      <button class="ptbtn" data-k="${k}" data-d="1">＋</button>
    </div>`).join("");
  S.story = `<h2>${t("cr.customTitle")}</h2>
    <p><label>${t("cr.customName")}</label><br>
      <input id="inpCustomName" type="text" maxlength="24" value="${c.customNombre || ""}" placeholder="${t("cr.customNamePlaceholder")}"></p>
    <p><b>${t("cr.budget", { used: total, total: PRESUPUESTO_CUSTOM })}</b></p>
    <div class="ptgrid">${filas}</div>
    <p class="hint">${t("cr.budgetHint", { total: PRESUPUESTO_CUSTOM, min: CUSTOM_MIN, max: CUSTOM_MAX })}</p>`;
  setActions([
    { label: t("cr.prev"), fn: () => { snapshotCustom(); c.paso = 1; renderCreacion(); } },
    { label: t("cr.next"), cls: "primary", fn: () => { snapshotCustom(); c.paso = 3; renderCreacion(); } },
  ]);
  document.querySelectorAll(".ptbtn").forEach((b) => {
    b.onclick = () => {
      snapshotCustom();
      const k = b.dataset.k, d = +b.dataset.d;
      const usado = STAT_KEYS.reduce((s, kk) => s + c.customBase[kk], 0);
      if (d > 0 && usado < PRESUPUESTO_CUSTOM && c.customBase[k] < CUSTOM_MAX) c.customBase[k]++;
      if (d < 0 && c.customBase[k] > CUSTOM_MIN) c.customBase[k]--;
      renderCreacion();
    };
  });
}

/* PASO 3 — Identidad (todas las especies): pronombres libres, altura, pelaje */
function snapshotIdentidad() {
  const c = S.creacion;
  const s = $("#inpPronS"), o = $("#inpPronO"), pp = $("#inpPronP"), pl = $("#inpPelaje");
  if (s) c.pron.s = s.value; if (o) c.pron.o = o.value; if (pp) c.pron.p = pp.value;
  if (pl) c.pelaje = pl.value;
}
function alturaDefaultCreacion() {
  return S.creacion.especie === "custom" ? 175 : (GD.speciesById(S.creacion.especie).altura || 175);
}
// Cobertura activa en creación: la elegida (custom) o la fija de la especie del catálogo.
function coberturaCreacion() {
  const c = S.creacion;
  if (c.especie === "custom") return c.cobertura || "pelaje";
  return GD.speciesById(c.especie).cobertura || "pelaje";
}
// Selector de cobertura (solo custom): 3 botones pelaje / escamas / plumas.
function coberturaPickerHtml(cur) {
  const btns = ["pelaje", "escamas", "plumas"].map((tp) => {
    const sel = tp === cur ? "border-color:var(--accent2);background:#2e251c;" : "";
    return `<button class="hbtn cobbtn" data-cob="${tp}" style="width:auto;padding:0 12px;${sel}">${t("cover." + tp)}</button>`;
  }).join(" ");
  return `<p><label>${t("cr.coverPick")}</label><br>${btns}</p>`;
}
function renderCreacionIdentidad() {
  const c = S.creacion;
  const def = alturaDefaultCreacion();
  if (c.alturaCm == null) c.alturaCm = def;          // default de la especie
  const minH = def - 15, maxH = def + 15;
  const cob = coberturaCreacion();
  S.story = `<h2>${t("cr.identityTitle")}</h2>
    <p><label>${t("cr.pronouns")}</label><br>
      <input id="inpPronS" class="pron" type="text" maxlength="12" value="${c.pron.s}">&nbsp;/&nbsp;
      <input id="inpPronO" class="pron" type="text" maxlength="12" value="${c.pron.o}">&nbsp;/&nbsp;
      <input id="inpPronP" class="pron" type="text" maxlength="12" value="${c.pron.p}"></p>
    <div class="ptrow"><span class="ptname">${t("cr.heightLabel")}</span>
      <button class="hbtn" data-d="-1">−</button>
      <b class="ptval" style="min-width:5em">${mostrarAltura(c.alturaCm)}</b>
      <button class="hbtn" data-d="1">＋</button></div>
    ${c.especie === "custom" ? coberturaPickerHtml(cob) : ""}
    <p><label>${t("cr.coverLabel", { cover: t("cover." + cob) })}</label><br>
      <input id="inpPelaje" type="text" maxlength="24" value="${c.pelaje || ""}" placeholder="${t("cr.coverPh." + cob)}"></p>`;
  setActions([
    { label: t("cr.prev"), fn: () => { snapshotIdentidad(); c.paso = 2; renderCreacion(); } },
    { label: t("cr.start"), cls: "primary", fn: () => { snapshotIdentidad(); comenzar(); } },
  ]);
  document.querySelectorAll(".hbtn:not(.cobbtn)").forEach((b) => {
    b.onclick = () => {
      snapshotIdentidad();
      c.alturaCm = clamp(c.alturaCm + (+b.dataset.d), minH, maxH);
      renderCreacion();
    };
  });
  document.querySelectorAll(".cobbtn").forEach((b) => {
    b.onclick = () => { snapshotIdentidad(); c.cobertura = b.dataset.cob; renderCreacion(); };
  });
}

function comenzar() {
  const c = S.creacion;
  const esCustom = c.especie === "custom";
  const limpiarPron = (v, def) => (v || "").trim() || def;
  S.player = {
    nombre: c.nombre, especie: esCustom ? "custom" : c.especie,
    base: esCustom ? { ...c.customBase } : { ...c.base }, tempStats: {},
    nivel: 1, xp: 0, xpSig: 100, oro: 25, puntos: 0,
    fat: 6, ful: 10, hea: 0, mana: 0, sta: 0, accionesVacio: 0,
    inv: [], arma: GD.items.garras, armadura: GD.items.sinArmar, mejoras: {},
    dia: 1, momento: "dia", turnos: 0,
    // Identidad elegida (aplica a cualquier especie)
    pronombres: { s: limpiarPron(c.pron.s, "they"), o: limpiarPron(c.pron.o, "them"), p: limpiarPron(c.pron.p, "their") },
    alturaCm: c.alturaCm || alturaDefaultCreacion(),
    pelaje: (c.pelaje || "").trim(),
  };
  if (esCustom) {
    // La especie custom guarda su nombre + stats dentro del save (compatible a futuro).
    S.player.especieData = {
      id: "custom",
      nombre: (c.customNombre || "").trim() || t("cr.customDefaultName"),
      stats: [0, 0, 0, 0, 0, 0],
      altura: 175,
      cobertura: c.cobertura || "pelaje",
    };
  }
  S.player.quests = {};
  S.player.spells = [];
  S.player.mejoras = {};
  S.player.npcWG = {};
  S.player.logros = {};
  S.player.lifetimeStats = {
    enemiesDevoured: 0,
    grapplesSurvived: 0,
    highestWeight: 0,
    highestFat: 0,
    timesObese: 0,
    mealsConsumed: 0,
  };
  S.player.hea = maxHea();
  S.player.mana = maxMana();
  S.player.sta = maxSta();
  darItem("pan", 3); darItem("agua", 2); darItem("pocVida", 1);
  clearLog();
  log(t("log.startAdv", { town: L(GD.world.zonas[GD.world.inicio].nombre) }), "bien");
  entrarZona(GD.world.inicio);
}

