"use strict";
/* PLÉROMA — Mochila, chequear estado del cuerpo, repartir puntos
   (extraído de engine.js · sección de líneas originales 928-1071) */
/* ============================================================
   MOCHILA
   ============================================================ */
// Categoría de un ítem para agrupar la mochila: equipables | comida | materiales
function categoriaItem(it) {
  if (it.tipo === "arma" || it.tipo === "armadura") return "equipables";
  if (it.tipo === "material") return "materiales";
  return "comida"; // comida, bebida, pocion → consumibles
}
const CATEGORIAS_MOCHILA = [
  { id: "equipables", labelKey: "bag.catEquip" },
  { id: "comida",     labelKey: "bag.catFood" },
  { id: "materiales", labelKey: "bag.catMat" },
];

function abrirMochila(volverA) {
  S.screen = () => abrirMochila(volverA);
  const p = S.player;
  let h = `<h2>${t("bag.title")}</h2>`;
  if (!p.inv.length) h += `<p>${t("bag.empty")}</p>`;
  else {
    CATEGORIAS_MOCHILA.forEach((cat) => {
      const entradas = p.inv.filter((entry) => categoriaItem(resolveItem(entry.id)) === cat.id);
      if (!entradas.length) return;
      h += `<h3 class="invcat">${t(cat.labelKey)}</h3><div class="invlist">`;
      entradas.forEach((entry) => {
        const it = resolveItem(entry.id);
        h += `<div class="invrow">
          <span class="invname">${nombreItem(it)} ×${entry.cant}${entry.conjurado ? " ✦" : ""}</span>
          <span class="invinfo">${itemResumen(it)}</span>
          <button class="invuse" data-id="${entry.id}">${t("ui.use")}</button>
          <button class="invdrop" data-id="${entry.id}">${t("ui.discard")}</button></div>`;
      });
      h += `</div>`;
    });
  }
  h += `<p class="hint">${t("bag.equipLine", { arma: nombreItem(p.arma), armadura: L(p.armadura.nombre) })}</p>`;
  S.story = h;
  setActions([{ label: t("ui.back"), cls: "primary", fn: () => {
    if (volverA === "combate") renderCombate();
    else if (volverA === "barco") mostrarBarco();
    else mostrarZona();
  }}]);
  document.querySelectorAll(".invuse").forEach((b) => {
    b.onclick = () => usarItemFuera(b.dataset.id, volverA);
  });
  document.querySelectorAll(".invdrop").forEach((b) => {
    b.onclick = () => descartarItem(b.dataset.id, volverA);
  });
}

// Descarta un ítem del inventario (no se puede descartar lo equipado)
function descartarItem(id, volverA) {
  const p = S.player;
  const it = resolveItem(id);
  if ((it.tipo === "arma" && p.arma && p.arma.id === id) ||
      (it.tipo === "armadura" && p.armadura && p.armadura.id === id)) {
    log(t("bag.cantDiscardEquipped"), "mal");
    return;
  }
  log(t("bag.discarded", { item: L(it.nombre) }), "bien");
  quitarItem(id);
  abrirMochila(volverA);
}

function itemResumen(it) {
  if (it.tipo === "comida" || it.tipo === "bebida") {
    let s = [];
    if (it.llena) s.push(t("item.llena", { n: it.llena }));
    if (it.engorda) s.push(t("item.engorda", { n: it.engorda }));
    if (it.cura) s.push(t("item.cura", { n: it.cura }));
    if (it.stamina) s.push(t("item.stamina", { n: it.stamina }));
    return s.join(", ");
  }
  if (it.tipo === "pocion") {
    let s = [];
    if (it.cura) s.push(t("item.cura", { n: it.cura }));
    if (it.mana) s.push(t("item.mana", { n: it.mana }));
    if (it.stamina) s.push(t("item.stamina", { n: it.stamina }));
    if (it.vaciar) s.push(t("item.vaciar", { n: it.vaciar }));
    if (it.llena) {
      const raw = t("item.llena", { n: it.llena });
      s.push(it.llena > 0 ? raw : raw.replace(/^\+/, ""));
    }
    return s.join(", ");
  }
  if (it.tipo === "arma") return t("item.weapon", { d: it.dano, r: it.rango, stat: t("stat." + it.stat + ".abbr"), texto: L(it.texto) });
  if (it.tipo === "armadura") {
    const bonuses = ["FUE","AGI","INT","AGU","EST"].filter(k => it["bonus"+k]).map(k => `+${it["bonus"+k]} ${t("stat." + k + ".abbr")}`).join(" ");
    return t("item.armor", { n: it.def, texto: L(it.texto) }) + (bonuses ? " · " + bonuses : "");
  }
  if (it.tipo === "material") return L(it.sabor);
  return "";
}

function usarItemFuera(id, volverA) {
  const it = resolveItem(id);
  if (it.tipo === "arma") { S.player.arma = it; log(t("bag.equipWeapon", { item: L(it.nombre) }), "bien"); }
  else if (it.tipo === "armadura") { S.player.armadura = it; log(t("bag.equipArmor", { item: L(it.nombre) }), "bien"); }
  else if (it.tipo === "material") {
    // Los materiales no se "usan": antes caían al flujo de comer y se destruían
    // (podías comerte un núcleo de jefe o media pieza del amuleto por accidente).
    log(t("bag.cantUseMaterial", { item: L(it.nombre) }), "normal");
    return;
  }
  else {
    const murio = comer(it, false, 1);   // tiempo=1: el turno pasa antes de comer
    quitarItem(id);
    if (murio || S.mode === "muerte") return;
  }
  abrirMochila(volverA);
}

/* ============================================================
   CHEQUEAR ESTADO  —  descripción del cuerpo del jugador
   ============================================================ */
function verEstado(volverA) {
  S.screen = () => verEstado(volverA);
  const st = GD.estadosJugador[estadoCuerpoJugador()] || GD.estadosJugador.promedio;
  const p = S.player;
  const furFat = ["rellenito","gordo","muyGordo","obeso","morbido","super","ultra","coloso","leviatan","monumento","singularidad"];
  const cob = coberturaDe(p);
  const furKey = `estado.cover.${cob}${furFat.includes(estadoCuerpoJugador()) ? "" : ".thin"}`;
  const pelajeLine = p.pelaje ? `<p class="npcline">${t(furKey, { color: p.pelaje })}</p>` : "";
  S.story = `<h2>${t("estado.title")}</h2>
    <p class="hint">${L(st.label)} · ${mostrarPeso(peso())} · ${mostrarAltura(alturaCm())} · IMC ${imc().toFixed(1)} — ${t("sb.composition", { magro: mostrarPeso(pesoMagro()), graso: mostrarPeso(pesoGraso()) })}</p>
    ${pelajeLine}
    <p>${L(st.desc)}</p>`;
  setActions([{ label: t("ui.back"), cls: "primary", fn: () => {
    if (volverA === "combate") renderCombate();
    else if (volverA === "barco") mostrarBarco();
    else mostrarZona();
  }}]);
}

/* ============================================================
   REPARTIR PUNTOS
   ============================================================ */
function abrirStats(volverA, draft) {
  draft = draft || {};   // deltas pendientes: { FUE: 0, AGI: 1, ... }
  S.screen = () => abrirStats(volverA, draft);
  const p = S.player;

  const puntosUsados = STAT_KEYS.reduce((s, k) => s + (draft[k] || 0), 0);
  const puntosLibres = p.puntos - puntosUsados;

  const filas = STAT_KEYS.map((k) => {
    const delta = draft[k] || 0;
    const actual = stat(k);
    const deltaHtml = delta > 0 ? ` → <b>${actual + delta}</b>` : "";
    return `
    <div class="ptrow">
      <span class="ptname">${t("stat." + k + ".abbr")} — ${t("stat." + k + ".name")} (${actual}${deltaHtml})</span>
      <button class="ptminus" data-k="${k}" ${delta <= 0 ? "disabled" : ""}>−</button>
      <b class="ptval">${delta > 0 ? "+" + delta : "—"}</b>
      <button class="ptup"    data-k="${k}" ${puntosLibres <= 0 ? "disabled" : ""}>＋</button>
    </div>`;
  }).join("");

  S.story = `<h2>${t("st.title")}</h2><p>${t("st.points", { n: puntosLibres })}</p><div class="ptgrid">${filas}</div>`;

  const volver = () => {
    if (volverA === "combate") renderCombate();
    else if (volverA === "barco") mostrarBarco();
    else mostrarZona();
  };
  const hayCambios = puntosUsados > 0;

  setActions([
    { label: t("st.confirm"), cls: "primary", disabled: !hayCambios, fn: () => {
      // Commit: aplica el draft al personaje real
      STAT_KEYS.forEach((k) => {
        const d = draft[k] || 0;
        if (d > 0) {
          p.base[k] += d;
          // Entrenar fuerza recompone el cuerpo: parte de la grasa se vuelve músculo
          if (k === "FUE") p.fat = Math.max(FAT_FLOOR, p.fat - 5 * d);
        }
      });
      p.puntos -= puntosUsados;
      volver();
    }},
    { label: t("ui.back"), fn: volver },  // cancelar: descarta el draft sin tocar nada
  ]);

  document.querySelectorAll(".ptup").forEach((b) => {
    b.onclick = () => {
      const k = b.dataset.k;
      if (puntosLibres > 0) draft[k] = (draft[k] || 0) + 1;
      abrirStats(volverA, draft);
    };
  });
  document.querySelectorAll(".ptminus").forEach((b) => {
    b.onclick = () => {
      const k = b.dataset.k;
      if ((draft[k] || 0) > 0) draft[k]--;
      abrirStats(volverA, draft);
    };
  });
}

