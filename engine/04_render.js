"use strict";
/* PLÉROMA — Log + render de la vista
   (extraído de engine.js · sección de líneas originales 451-539) */
/* ============================================================
   LOG  +  RENDER
   ============================================================ */
function log(msg, clase) {
  S.log.push({ msg, clase: clase || "" });
  if (S.log.length > 60) S.log.shift();
}
function clearLog() { S.log = []; }

const $ = (sel) => document.querySelector(sel);
function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}

/* ============================================================
   SPRITES  —  ilustración opcional con fallback por capas
   ------------------------------------------------------------
   spriteImg(cat, names, cls):
     cat   -> subcarpeta: "enemy" | "npc" | "zone"
     names -> uno o varios nombres base, EN ORDEN DE PREFERENCIA.
              Se intenta cargar el primero; si el archivo no existe,
              se cae al siguiente; si ninguno existe, NO se renderiza
              nada (la vista queda idéntica a como estaba sin sprites).
     cls   -> clase CSS extra para el <img>.
   Ej: spriteImg("enemy", ["lobo__gordo", "lobo"], "spr-enemy")
       -> prueba assets/sprites/enemy/lobo__gordo.png,
          luego  assets/sprites/enemy/lobo.png,
          y si faltan ambos, se quita solo (this.remove()).
   El nombre con doble guion bajo (id__variante) permite arte
   específico por estado de peso, con caída al genérico del personaje.
   ============================================================ */
const SPRITE_BASE = "assets/sprites";
const SPRITE_EXT = "png"; // PNG con transparencia (ver assets/sprites/README.md)
function spriteImg(cat, names, cls) {
  const list = (Array.isArray(names) ? names : [names]).filter(Boolean);
  if (!list.length) return "";
  const srcs = list.map((n) => `${SPRITE_BASE}/${cat}/${n}.${SPRITE_EXT}`);
  const rest = srcs.slice(1).map((s) => s.replace(/"/g, "&quot;")).join("|");
  return `<img class="sprite ${cls || ""}" alt="" loading="lazy"`
    + ` src="${srcs[0]}" data-spr-next="${rest}"`
    + ` onerror="spriteFallback(this)">`;
}
// Avanza al siguiente candidato; si no quedan, el <img> se elimina solo.
function spriteFallback(img) {
  const queue = (img.getAttribute("data-spr-next") || "").split("|").filter(Boolean);
  if (queue.length) {
    const next = queue.shift();
    img.setAttribute("data-spr-next", queue.join("|"));
    img.src = next;
  } else {
    img.remove();
  }
}
if (typeof window !== "undefined") window.spriteFallback = spriteFallback;

function render() {
  const story = $("#story");
  story.innerHTML = S.story || "";
  applySceneLayout(story);
  renderActions();
  renderSidebar();
  renderLog();
}

/* ============================================================
   applySceneLayout: detecta un sprite líder en #story y reestructura
   en paneles de escena (sin tocar cada pantalla).
   - .spr-npc  -> alt. A: panel de arte (36%) + panel de contenido.
   - .spr-enemy-> alt. D: arte centrado dominante + caption (nombre+vida).
   Si no hay sprite (img se autoeliminó por falta de archivo), la vista
   queda como texto plano, igual que antes.
   ============================================================ */
function applySceneLayout(story) {
  story.classList.remove("scene-npc", "scene-enemy");
  const lead = story.firstElementChild;
  if (!lead || lead.tagName !== "IMG") return;

  if (lead.classList.contains("spr-npc")) {
    const art = el("div", "npc-art");
    const content = el("div", "npc-content");
    story.removeChild(lead);
    art.appendChild(lead);
    while (story.firstChild) content.appendChild(story.firstChild);
    story.appendChild(art);
    story.appendChild(content);
    story.classList.add("scene-npc");
  } else if (lead.classList.contains("spr-enemy")) {
    const art = el("div", "enemy-art");
    const cap = el("div", "enemy-cap");
    story.removeChild(lead);
    art.appendChild(lead);
    while (story.firstChild) cap.appendChild(story.firstChild);
    story.appendChild(art);
    story.appendChild(cap);
    story.classList.add("scene-enemy");
  }
}

function renderLog() {
  const box = $("#log");
  box.innerHTML = "";
  for (let i = S.log.length - 1; i >= 0; i--) {
    box.appendChild(el("div", "logline " + S.log[i].clase, S.log[i].msg));
  }
}

function bar(label, val, max, cls) {
  const pct = clamp((val / max) * 100, 0, 100);
  return `<div class="bar-wrap"><div class="bar-label">${label} <span>${round(val)}/${round(max)}</span></div>
    <div class="bar"><div class="bar-fill ${cls}" style="width:${pct}%"></div></div></div>`;
}

function renderSidebar() {
  const sb = $("#sidebar");
  if (!S.player) { sb.innerHTML = ""; return; }
  const p = S.player;
  const sp = especieDe(p);
  const pr = p.pronombres;
  const pron = pr ? ` · ${pr.s}/${pr.o}/${pr.p}` : "";
  let h = `<div class="char-name">${p.nombre}</div>
    <div class="char-sub">${t("sb.speciesLevel", { species: L(sp.nombre), n: p.nivel })}${pron}</div>`;

  h += bar(t("bar.vida"), p.hea, maxHea(), "vida");
  h += bar(t("bar.llenura"), p.ful, maxFul(), "llenura");
  h += bar(t("bar.stamina"), p.sta, maxSta(), "stamina");
  if (maxMana() > 0) h += bar(t("bar.mana"), p.mana, maxMana(), "mana");
  h += bar(t("bar.xp"), p.xp, p.xpSig, "xp");

  h += `<div class="stats-grid">`;
  for (const k of STAT_KEYS) h += `<div class="stat"><b>${t("stat." + k + ".abbr")}</b> ${stat(k)}</div>`;
  h += `</div>`;

  h += `<div class="body">
    <div>${t("sb.weight")}: <b>${mostrarPeso(peso())}</b></div>
    <div class="subline">${t("sb.composition", { magro: mostrarPeso(pesoMagro()), graso: mostrarPeso(pesoGraso()) })}</div>
    <div>${t("sb.height")}: <b>${mostrarAltura(alturaCm())}</b></div>
    <div>${t("sb.waist")}: <b>${mostrarDistancia(cintura())}</b></div>
    <div>${t("sb.body")}: <b>${etiquetaGordura()}</b></div>
    <div>${t("sb.belly")}: <b>${etiquetaLlenura()}</b></div>
    ${conjuredCount() > 0 ? `<div>${t("sb.magicFood")}: <b>${conjuredCount()}/${conjuredCap()}</b></div>` : ""}
    ${semiInmovil() ? `<div class="warn">${tPeso("sb.semiImmobile")}</div>` : ""}
    ${(p.accionesVacio || 0) >= MAX_VACIO - 8 ? `<div class="warn">${t("sb.starving", { n: p.accionesVacio, max: MAX_VACIO })}</div>` : ""}
    ${inmovil() ? `<div class="warn">${tPeso("sb.immobile")}</div>` : ""}
  </div>`;

  if (defensa() > 0) h += `<div class="purse">${t("sb.defense")}: <b>${defensa()}</b></div>`;
  h += `<div class="purse">${t("sb.gold")}: <b>${p.oro}</b></div>`;
  h += `<div class="purse">${t("sb.day", { n: p.dia })} · ${p.momento === "dia" ? t("sb.dayTime") : t("sb.nightTime")}</div>`;
  if (p.puntos > 0) h += `<div class="warn">${t("sb.unspent", { n: p.puntos })}</div>`;
  sb.innerHTML = h;
}

function renderActions() {
  const box = $("#actions");
  box.innerHTML = "";
  (S.actions || []).forEach((a) => {
    const b = el("button", "act" + (a.cls ? " " + a.cls : ""), a.label);
    if (a.disabled) b.disabled = true;
    b.onclick = a.fn;
    box.appendChild(b);
  });
}
function setActions(list) { S.actions = list; render(); }

/* Navegación de retorno compartida: las pantallas auxiliares (mochila, estado,
   stats, guardado) reciben un destino y vuelven al contexto correcto.
   Centralizado acá para no repetir el if-ladder en cada pantalla. */
function volverDesde(dest) {
  if (dest === "combate") renderCombate();
  else if (dest === "barco") mostrarBarco();
  else mostrarZona();
}
