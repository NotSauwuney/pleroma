"use strict";
/* PLÉROMA — Eventos aleatorios, mini-eventos encadenados y la misión secreta
   del Amuleto de Intimidación. Antes vivía en 01_core.js, pero es lógica de
   DOMINIO (alcanza combate, items y zonas), no fundación: se movió acá para
   que el core quede chico y muy-dependido. Se carga tras 06_exploration.js.
   Depende (en cuerpos de función) de: rand/choice (01_core), L/t (i18n),
   setActions (04_render), iniciarCombate (11_combat), darItem/tieneItem/
   quitarItem (03_systems), entrarZona/mostrarZona (06_exploration). */

/* ---------- Eventos aleatorios ---------- */
const EVENT_INTERVAL = 5;   // acciones entre eventos

// Incrementa el contador; devuelve true cuando toca disparar un evento.
function tickEvento() {
  const p = S.player;
  p.accionesDesdeEvento = (p.accionesDesdeEvento || 0) + 1;
  if (p.accionesDesdeEvento >= EVENT_INTERVAL) {
    p.accionesDesdeEvento = 0;
    return true;
  }
  return false;
}

// Muestra un evento aleatorio (mini-evento o flavor). Devuelve true si disparó algo.
function eventoAleatorio() {
  const z = GD.world.zonas[S.zona];
  if (!z) return false;

  // 30% de chance de intentar mini-evento si hay disponibles en esta zona
  if (GD.miniEventos && rand() < 0.30) {
    const disponibles = Object.values(GD.miniEventos).filter((me) => me.zona === S.zona);
    if (disponibles.length) {
      const me = choice(disponibles);
      iniciarMiniEvento(me.id);
      return true;
    }
  }

  if (!z.eventos || !z.eventos.length) return false;
  const ev = choice(z.eventos);
  const texto = resolvePronTokens(L(ev));
  S.screen = mostrarZona;
  S.story = `<h2>${L(z.nombre)}</h2><p class="evento">${texto}</p>`;
  setActions([{ label: t("ui.continue"), cls: "primary", fn: mostrarZona }]);
  return true;
}

/* ============================================================
   MINI-EVENTOS ENCADENADOS
   ============================================================ */
function iniciarMiniEvento(id) {
  const me = GD.miniEventos[id];
  if (!me) return;
  S.miniEvento = { id, paso: 0 };

  const mostrarIntro = () => {
    S.screen = mostrarIntro;
    S.story = `<h2>✦ ${t("event.special")}</h2><p>${L(me.intro)}</p>`;
    if (me.forzado) {
      setActions([{ label: t("ui.continue"), cls: "primary", fn: () => avanzarMiniEvento() }]);
    } else {
      setActions([
        { label: L(me.opcionEntrar), cls: "primary", fn: () => avanzarMiniEvento() },
        { label: L(me.opcionIgnorar), fn: () => { S.miniEvento = null; mostrarZona(); } },
      ]);
    }
  };
  mostrarIntro();
}

function avanzarMiniEvento() {
  const me = GD.miniEventos[S.miniEvento.id];
  const paso = me.pasos[S.miniEvento.paso];
  if (!paso) { finalizarMiniEvento(); return; }
  S.miniEvento.paso++;

  if (paso.tipo === "texto") {
    const txt = L(paso.texto);
    S.screen = () => {
      S.story = `<p>${txt}</p>`;
      setActions([{ label: t("ui.continue"), cls: "primary", fn: () => avanzarMiniEvento() }]);
    };
    S.screen();
  } else if (paso.tipo === "combate") {
    iniciarCombate(paso.enemyId);
    // victoriaCombate() detecta S.miniEvento y llama avanzarMiniEvento() al ganar
  }
}

function finalizarMiniEvento() {
  const me = GD.miniEventos[S.miniEvento.id];

  // Drops garantizados del mini-evento.
  // d.unico: no se vuelve a otorgar si ya lo tenés (o si ya forjaste el Amuleto
  // de Intimidación, para las mitades de la misión secreta de las islas).
  if (me.drops && me.drops.length) {
    me.drops.forEach((d) => {
      if (d.unico && (tieneItem(d.id) || S.player.amuletoForjado)) return;
      darItem(d.id, d.cant || 1);
      const it = GD.items[d.id];
      if (it) log(t("drop.got", { item: L(it.nombre) }), "bien");
    });
  }
  chequearAmuletoIntimidacion();

  S.miniEvento = null;
  const textoFin = me.textoFin ? L(me.textoFin) : "";
  const pintar = () => {
    S.story = `<h2>✦ ${t("event.complete")}</h2>${textoFin ? `<p>${textoFin}</p>` : ""}`;
    setActions([{ label: t("ui.continue"), cls: "primary", fn: () => entrarZona(S.zona) }]);
  };
  S.screen = pintar; pintar();
}

/* ---------- Misión secreta: el Amuleto de Intimidación ----------
   Cada isla lejana esconde media pieza (jefe de su mini-evento). Al juntar las
   dos mitades se funden solas en el Amuleto de Intimidación: las criaturas del
   Mar de las Fauces no se atreven a atacar el barco (ver barcoTurno). */
function chequearAmuletoIntimidacion() {
  const p = S.player;
  if (!p || p.amuletoForjado) return;
  if (tieneItem("amuleto_mitad_sol") && tieneItem("amuleto_mitad_raiz")) {
    quitarItem("amuleto_mitad_sol");
    quitarItem("amuleto_mitad_raiz");
    darItem("amuleto_intimidacion", 1);
    p.amuletoForjado = true;
    log(t("amuleto.forjado"), "bien");
  }
}
