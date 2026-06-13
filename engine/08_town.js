"use strict";
/* PLÉROMA — Tienda/posada + forja (crafteo)
   (extraído de engine.js · sección de líneas originales 1072-1319) */
/* ============================================================
   TIENDA / POSADA
   ============================================================ */
const CATALOGOS = {
  tienda:        ["daga", "maza", "baston", "cuero", "cota", "tunica_mago", "manto_mago", "pocVida", "pocMana", "digestivo"],
  posada:        ["pan", "guiso", "pastel", "festin", "agua", "crema"],
  herreria:      ["espadon", "estoque", "cetro"],
  escuela_blanca:    ["bendicion", "pocVida", "pocMana"],
  escuela_gris:      ["piedraViento", "pocVida", "digestivo"],
  escuela_negra:     ["esenciaVacia", "pocMana"],
  escuela_plenitud:  ["festin", "pocMana", "digestivo"],
  // Asentamientos de las islas lejanas
  puesto_solakh: ["te_cactus", "datiles_melosos", "estofado_dunas", "pocVida", "digestivo"],
  nido_raices:   ["nectar_esporas", "fruto_manto", "hongo_relleno", "pocMana", "pocVida"],
};
// Config de cada local: NPC, trabajo, si tiene fragua
const LUGARES = {
  posada:        { npc: "tabernero",      job: "servir",           upgrade: false, nameKey: "shop.innName",       descKey: "shop.innDesc" },
  tienda:        { npc: "mercader",       job: "acomodar",         upgrade: false, nameKey: "shop.storeName",     descKey: "shop.storeDesc" },
  herreria:      { npc: "herrero",        job: "fuelle",           upgrade: true,  forja: true, nameKey: "shop.herreriaName", descKey: "shop.herreriaDesc" },
  escuela_blanca:   { npc: "maestraSiriel",   job: "estudiarLuz",   upgrade: false, nameKey: "shop.blancaName",    descKey: "shop.blancaDesc" },
  escuela_gris:     { npc: "maestroKor",      job: "estudiarFlujo", upgrade: false, nameKey: "shop.grisName",      descKey: "shop.grisDesc" },
  escuela_negra:    { npc: "archimagaVexara", job: "asistirVexara", upgrade: false, nameKey: "shop.negraName",     descKey: "shop.negraDesc" },
  escuela_plenitud: { npc: "vadak",           job: "practicarPlenitud", upgrade: false, nameKey: "shop.plenitudName", descKey: "shop.plenitudDesc" },
  // Asentamientos de las islas lejanas
  puesto_solakh: { npc: "caravanera", job: "cargar_caravana", upgrade: false, nameKey: "shop.solakhName", descKey: "shop.solakhDesc" },
  nido_raices:   { npc: "silvano",    job: "podar_lianas",    upgrade: false, nameKey: "shop.nidoName",   descKey: "shop.nidoDesc" },
};

// Nombre de un ítem para mostrar (las armas muestran su nivel de mejora +N)
function nombreItem(it) {
  if (it && it.tipo === "arma") {
    const nl = (S.player.mejoras && S.player.mejoras[it.id]) || 0;
    return L(it.nombre) + (nl > 0 ? " +" + nl : "");
  }
  return L(it.nombre);
}
// Coste de la próxima mejora de un arma según su nivel actual
function costoMejora(it, nl) { return round((20 + it.precio * 0.3) * (nl + 1)); }

let _lastShopVisit = null;

function abrirTienda(tipo) {
  if (tipo === "granja") { abrirGranja(); return; }
  S.mode = "tienda";
  S.screen = () => abrirTienda(tipo);
  const isEscuela = tipo.startsWith("escuela_");
  // tick "visitar" una vez por visita (no por cada re-render del mismo local)
  if (isEscuela && _lastShopVisit !== tipo) {
    _lastShopVisit = tipo;
    tickQuest("visitar", { escuela: tipo });
  }
  const lug = LUGARES[tipo] || LUGARES.tienda;
  const cat = CATALOGOS[tipo];
  const p = S.player;
  const npc = GD.npcs[lug.npc];
  let h = `${npcSprite(lug.npc)}<h2>${t(lug.nameKey)}</h2>
    <p>${t(lug.descKey)} ${t("shop.yourGold", { n: p.oro })}</p>
    <p class="npcline">${flavorRand(npc.saludo)}</p>
    <div class="shoplist">`;
  cat.forEach((id) => {
    const it = GD.items[id];
    const caro = it.precio > p.oro;
    h += `<div class="shoprow">
      <span class="shopname">${L(it.nombre)}</span>
      <span class="invinfo">${itemResumen(it)}</span>
      <button class="shopbuy" data-id="${id}" ${caro ? "disabled" : ""}>${t("shop.buy", { n: it.precio })}</button>
    </div>`;
  });
  h += `</div>`;

  // Sección de hechizos (solo escuelas)
  if (isEscuela) {
    // Los hechizos legendarios (Feast) no se compran en la tienda: se desbloquean
    // narrativamente vía quests de la Plenitud o logros (ver tickLogro).
    // Hechizos base de esta escuela (sin evoluciones, sin legendarios, sin sinMenu)
    const hechizosBase = Object.values(GD.hechizos).filter(
      (sp) => sp.escuela === tipo && !sp.legendario && !sp.sinMenu && !sp.upgradeDe
    );
    // Evoluciones disponibles en esta escuela
    const hechizosEvo = Object.values(GD.hechizos).filter(
      (sp) => sp.escuela === tipo && !sp.legendario && sp.upgradeDe
    );

    if (hechizosBase.length) {
      h += `<div class="spellsect"><h3>${t("spell.shopSection")}</h3>`;
      hechizosBase.forEach((sp) => {
        if (tieneHechizo(sp.id)) {
          h += `<div class="spellrow">
            <span class="spellname">${L(sp.nombre)}</span>
            <span class="spellinfo">${L(sp.desc)}</span>
            <button class="spellbuy" disabled>${t("spell.alreadyLearned")}</button>
          </div>`;
        } else {
          // Buscar la quest que recompensa este hechizo
          const questId = Object.keys(GD.quests).find((k) => GD.quests[k].recompensa === sp.id && GD.quests[k].escuela === tipo);
          const qd = questId ? questData(questId) : null;
          const unlocked = qd && qd.completed;
          const caro = sp.precio > p.oro;
          if (unlocked) {
            h += `<div class="spellrow">
              <span class="spellname">${L(sp.nombre)}</span>
              <span class="spellinfo">${L(sp.desc)} · ${t("spell.manaCost", { n: sp.costoMana })}</span>
              <button class="spellbuy" data-spell="${sp.id}" ${caro ? "disabled" : ""}>${t("spell.buy", { n: sp.precio })}</button>
            </div>`;
          } else {
            h += `<div class="spellrow">
              <span class="spellname">${L(sp.nombre)}</span>
              <span class="spellinfo">${L(sp.desc)}</span>
              <button class="spellbuy" disabled>${t("spell.missionRequired")}</button>
            </div>`;
          }
        }
      });
      h += `</div>`;
    }

    // Sección de evoluciones: aparece si el jugador ya tiene el hechizo base
    const evosDisponibles = hechizosEvo.filter((sp) => tieneHechizo(sp.upgradeDe));
    if (evosDisponibles.length) {
      h += `<div class="spellsect"><h3>${t("spell.evolSection")}</h3>`;
      evosDisponibles.forEach((sp) => {
        if (tieneHechizo(sp.id)) {
          h += `<div class="spellrow spell-evolved">
            <span class="spellname">◈ ${L(sp.nombre)}</span>
            <span class="spellinfo">${L(sp.desc)}</span>
            <button class="spellbuy" disabled>${t("spell.alreadyLearned")}</button>
          </div>`;
        } else {
          const caro = sp.precio > p.oro;
          const base = GD.hechizos[sp.upgradeDe];
          h += `<div class="spellrow spell-evolved">
            <span class="spellname">◈ ${L(sp.nombre)}</span>
            <span class="spellinfo">${L(sp.desc)} · ${t("spell.manaCost", { n: sp.costoMana })} · ${t("spell.upgradeOf", { base: L(base.nombre) })}</span>
            <button class="spellbuy" data-spell="${sp.id}" ${caro ? "disabled" : ""}>${t("spell.buy", { n: sp.precio })}</button>
          </div>`;
        }
      });
      h += `</div>`;
    }
  }

  S.story = h;
  const job = GD.trabajos[lug.job];
  const acts = [{ label: t("shop.talk"), fn: () => hablarNPC(lug.npc, tipo) }];
  if (isEscuela) acts.push({ label: t("shop.missions"), fn: () => verMisiones(tipo, tipo) });
  if (job) acts.push({ label: t("shop.work", { n: job.costoSta }), disabled: p.sta < job.costoSta && !cheatOn("weightless"), fn: () => trabajar(lug.job, tipo) });
  acts.push({ label: t("shop.sell"), fn: () => abrirVender(tipo) });
  if (lug.upgrade) acts.push({ label: t("shop.upgrade"), fn: () => abrirMejora(tipo) });
  if (lug.forja) acts.push({ label: t("shop.forja"), fn: () => abrirForja(tipo) });
  acts.push({ label: t("shop.exit"), cls: "primary", fn: () => { _lastShopVisit = null; entrarZona(S.zona); } });
  setActions(acts);
  document.querySelectorAll(".shopbuy[data-id]").forEach((b) => { b.onclick = () => comprar(b.dataset.id, tipo); });
  document.querySelectorAll(".spellbuy[data-spell]").forEach((b) => { b.onclick = () => comprarHechizo(b.dataset.spell, tipo); });
}

function comprarHechizo(id, tipo) {
  const sp = GD.hechizos[id], p = S.player;
  if (p.oro < sp.precio || tieneHechizo(id)) return;
  p.oro -= sp.precio;
  if (!p.spells) p.spells = [];
  p.spells.push(id);
  log(t("spell.bought", { hechizo: L(sp.nombre) }), "bien");
  abrirTienda(tipo);
}
/* ============================================================
   FORJA  —  crafteo de armas con materiales
   ============================================================ */
function cantMaterial(id) {
  const p = S.player;
  const entry = p.inv.find((x) => x.id === id);
  return entry ? entry.cant : 0;
}

function puedeForjar(receta) {
  const p = S.player;
  for (const [mat, cant] of Object.entries(receta.materiales)) {
    if (cantMaterial(mat) < cant) return false;
  }
  if (receta.requiereArma) {
    const nl = (p.mejoras && p.mejoras[receta.requiereArma]) || 0;
    if (nl < (receta.requiereNivel || 0)) return false;
    if (!p.inv.some((x) => x.id === receta.requiereArma)) return false;
  }
  return true;
}

function abrirForja(loc) {
  S.screen = () => abrirForja(loc);
  const p = S.player;
  let h = `<h2>${t("forja.title")}</h2><p class="hint">${t("forja.hint")}</p>`;

  const recetasVisibles = Object.values(GD.recetas).filter((r) => {
    if (!r.secreto) return true;
    // Legendaria: mostrar solo si la condición base se cumple
    return r.requiereArma && p.inv.some((x) => x.id === r.requiereArma)
      && ((p.mejoras && p.mejoras[r.requiereArma]) || 0) >= (r.requiereNivel || 0);
  });

  if (!recetasVisibles.length) {
    h += `<p>${t("forja.noRecipes")}</p>`;
  } else {
    h += `<div class="shoplist">`;
    recetasVisibles.forEach((r) => {
      const puede = puedeForjar(r);
      const matsHtml = Object.entries(r.materiales).map(([mat, cant]) => {
        const tiene = cantMaterial(mat);
        const color = tiene >= cant ? "var(--good)" : "var(--bad)";
        const it = GD.items[mat];
        return `<span style="color:${color}">${L(it.nombre)} ${tiene}/${cant}</span>`;
      }).join(" · ");
      const armaReq = r.requiereArma ? `<span style="color:var(--muted)"> · ${t("forja.reqWeapon", { arma: L(GD.items[r.requiereArma].nombre), n: r.requiereNivel || 0 })}</span>` : "";
      h += `<div class="shoprow">
        <div style="flex:1">
          <div class="shopname">${L(r.nombre)}${r.secreto ? " ✦" : ""}</div>
          <div class="invinfo">${matsHtml}${armaReq}</div>
        </div>
        <button class="shopbuy" data-recipe="${r.id}" ${puede ? "" : "disabled"}>${t("forja.forge")}</button>
      </div>`;
    });
    h += `</div>`;
  }
  S.story = h;
  setActions([{ label: t("ui.back"), cls: "primary", fn: () => abrirTienda(loc) }]);
  document.querySelectorAll(".shopbuy[data-recipe]").forEach((b) => {
    b.onclick = () => craftearArma(b.dataset.recipe, loc);
  });
}

function craftearArma(recetaId, loc) {
  const r = GD.recetas[recetaId], p = S.player;
  if (!r || !puedeForjar(r)) return;

  // Consumir materiales
  for (const [mat, cant] of Object.entries(r.materiales)) {
    for (let i = 0; i < cant; i++) quitarItem(mat);
  }

  // Consumir arma base en legendarias
  if (r.requiereArma) {
    quitarItem(r.requiereArma);
    // También limpia el nivel de mejora
    if (p.mejoras) delete p.mejoras[r.requiereArma];
  }

  const resultado = GD.items[r.resultado];
  darItem(r.resultado, 1);
  // Inicializar nivel de mejora en 0 para armas crafteadas
  if (!p.mejoras) p.mejoras = {};
  p.mejoras[r.resultado] = p.mejoras[r.resultado] || 0;

  if (resultado.legendaria) {
    // Pantalla especial de descubrimiento legendario
    S.screen = () => {
      S.story = `<h2>✦ ${t("forja.legendTitle")}</h2>
        <p>${t("forja.legendDesc", { arma: L(resultado.nombre) })}</p>
        <p class="hint">${L(resultado.texto)}</p>`;
      setActions([{ label: t("ui.continue"), cls: "primary", fn: () => abrirTienda(loc) }]);
    };
    S.screen();
  } else {
    log(t("forja.done", { arma: L(resultado.nombre) }), "bien");
    abrirForja(loc);
  }
}

function comprar(id, tipo) {
  const it = GD.items[id], p = S.player;
  if (p.oro < it.precio) return;
  p.oro -= it.precio;
  darItem(id, 1);
  log(t("shop.bought", { item: L(it.nombre) }), "bien");
  abrirTienda(tipo);
}

// Precio de venta: la mitad del precio base de compra del ítem
function precioVenta(it) { return Math.floor((it.precio || 0) / 2); }

// Pantalla para vender ítems del inventario al NPC de la tienda actual
function abrirVender(tipo) {
  S.mode = "tienda";
  S.screen = () => abrirVender(tipo);
  const lug = LUGARES[tipo] || LUGARES.tienda;
  const p = S.player;
  let h = `${npcSprite(lug.npc)}<h2>${t(lug.nameKey)}</h2>
    <p>${t("shop.sellHint")} ${t("shop.yourGold", { n: p.oro })}</p>
    <div class="shoplist">`;
  const vendibles = p.inv.filter((entry) => {
    const it = resolveItem(entry.id);
    if (!it) return false;
    if (it.tipo === "arma" && p.arma && p.arma.id === entry.id) return false;
    if (it.tipo === "armadura" && p.armadura && p.armadura.id === entry.id) return false;
    return precioVenta(it) > 0;
  });
  if (!vendibles.length) h += `<p>${t("shop.nothingToSell")}</p>`;
  else {
    vendibles.forEach((entry) => {
      const it = resolveItem(entry.id);
      const precio = precioVenta(it);
      h += `<div class="shoprow">
        <span class="shopname">${nombreItem(it)} ×${entry.cant}</span>
        <span class="invinfo">${itemResumen(it)}</span>
        <button class="shopsell" data-id="${entry.id}">${t("shop.sellFor", { n: precio })}</button>
      </div>`;
    });
  }
  h += `</div>`;
  S.story = h;
  setActions([{ label: t("shop.exit"), cls: "primary", fn: () => abrirTienda(tipo) }]);
  document.querySelectorAll(".shopsell[data-id]").forEach((b) => { b.onclick = () => venderItem(b.dataset.id, tipo); });
}

function venderItem(id, tipo) {
  const it = resolveItem(id), p = S.player;
  if (!it) return;
  const precio = precioVenta(it);
  if (precio <= 0) return;
  p.oro += precio;
  quitarItem(id);
  log(t("shop.sold", { item: L(it.nombre), n: precio }), "bien");
  abrirVender(tipo);
}

// Hablar con un NPC (gratis, sin tiempo): rota líneas de diálogo
function hablarNPC(npcId, loc) {
  // Vadak tiene un camino especial cuando el jugador está inmóvil y no tiene levitación.
  if (npcId === "vadak" && inmovil() && !hasLevitacion()) {
    hablarVadakInmovil(loc);
    return;
  }
  // Vadak: si la quest q_plenitud3 está activa y el jugador ya es mega-obeso, disparar ahora.
  // Cubre el caso en que el cruce ocurrió antes de que la quest se desbloqueara (_fueMegaObeso ya true).
  if (npcId === "vadak") {
    const qd = S.player.quests && S.player.quests["q_plenitud3"];
    if ((!qd || !qd.completed) && ESTADOS_OBESOS.includes(estadoCuerpoJugador())) {
      tickQuest("times_obese", { valor: 1 });
    }
  }
  S.screen = () => hablarNPC(npcId, loc);
  const npc = GD.npcs[npcId];
  S.story = `${npcSprite(npcId)}<h2>${L(npc.nombre)}</h2><p class="npcline">"${flavorRand(npc.dialogos)}"</p>`;
  const acts = [
    { label: t("shop.talkMore"), fn: () => hablarNPC(npcId, loc) },
  ];
  if (GD.npcWG && GD.npcWG[npcId]) {
    acts.push({ label: t("npcwg.observe"), fn: () => verNPCwg(npcId, loc) });
    acts.push({ label: t("npcwg.feed"),    fn: () => menuAlimentarNPC(npcId, loc) });
  }
  acts.push({ label: t("ui.back"), cls: "primary", fn: () => abrirTienda(loc) });
  setActions(acts);
}

/* ----------------------------------------------------------
   Vadak reconoce al jugador inmóvil y ofrece Levitación de Plenitud.
   Disponible aunque el jugador no haya completado ninguna quest de la Plenitud.
   La compra es directa: 80 de oro, sin requisito de misión.
   ---------------------------------------------------------- */
function hablarVadakInmovil(loc) {
  S.screen = () => hablarVadakInmovil(loc);
  const npc = GD.npcs.vadak;
  const p = S.player;
  const sp = GD.hechizos.levitacion_feast;
  const yaComprado = tieneHechizo("levitacion_feast");
  const puedePagar = p.oro >= sp.precio;

  let cuerpo;
  if (yaComprado) {
    cuerpo = `<p class="npcline">"${t("vadak.inmovil.tieneHechizo")}"</p>`;
  } else {
    cuerpo = `<p class="npcline">"${t("vadak.inmovil.oferta")}"</p>
      <p>${t("vadak.inmovil.desc", { n: sp.precio })}</p>`;
  }

  S.story = `${npcSprite("vadak")}<h2>${L(npc.nombre)}</h2>${cuerpo}`;

  const acts = [];
  if (!yaComprado) {
    if (puedePagar) {
      acts.push({ label: t("vadak.inmovil.comprar", { n: sp.precio }), cls: "primary",
        fn: () => comprarLevitacionVadak(loc) });
    } else {
      acts.push({ label: t("vadak.inmovil.sinOro", { n: sp.precio }), disabled: true, fn: () => {} });
    }
  }
  acts.push({ label: t("ui.back"), cls: "primary", fn: () => abrirTienda(loc) });
  setActions(acts);
}

function comprarLevitacionVadak(loc) {
  const p = S.player;
  const sp = GD.hechizos.levitacion_feast;
  if (p.oro < sp.precio || tieneHechizo("levitacion_feast")) return;
  p.oro -= sp.precio;
  if (!p.spells) p.spells = [];
  p.spells.push("levitacion_feast");
  log(t("vadak.inmovil.comprado", { hechizo: L(sp.nombre) }), "bien");
  hablarVadakInmovil(loc);
}

