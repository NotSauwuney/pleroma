"use strict";
/* PLÉROMA — Matemática del cuerpo: composición, IMC, energía, estado corporal, conversión de unidades
   (extraído de engine.js · sección de líneas originales 183-294) */
/* ============================================================
   CUERPO  —  matemática del personaje
   ============================================================ */
// Especie efectiva: la custom (guardada en el propio personaje) o una del catálogo.
// Que viaje dentro del save la hace compatible con versiones futuras del juego.
function especieDe(p) { return p.especieData || GD.speciesById(p.especie); }

/* ============================================================
   RASGOS DE ESPECIE
   ------------------------------------------------------------
   Modificadores opcionales que una especie puede declarar en su
   campo `rasgos` (ver data/species.js). Son la vía "oficial" para
   que una especie altere fórmulas del motor sin tocar el código:
   toda especie que NO declare un rasgo usa el valor neutro `def`,
   así que esto es retrocompatible (incluida la especie custom).

   Rasgos soportados hoy:
     panzaMult          — multiplica la capacidad de panza (maxFul)
     costoMovMult       — multiplica el costo de stamina al moverse
     umbralPesoMult     — multiplica cuánto peso aguanta antes de inmóvil
     vulnerabilidadMult — multiplica el daño que el jugador recibe
   ============================================================ */
function rasgo(key, def) {
  const e = especieDe(S.player);
  return (e && e.rasgos && e.rasgos[key] != null) ? e.rasgos[key] : def;
}

// Aplica el rasgo `vulnerabilidadMult` a un valor de daño ya calculado.
function aplicarVulnerabilidad(d) {
  return Math.max(1, round(d * rasgo("vulnerabilidadMult", 1)));
}

// Tipo de cobertura del jugador: "pelaje" | "escamas" | "plumas".
// Para custom viaja en especieData; para especies del catálogo, en su entrada.
function coberturaDe(p) {
  const e = especieDe(p);
  return (e && e.cobertura) || "pelaje";
}

function stat(key) {
  const p = S.player;
  const sp = especieDe(p);
  const tmp = p.tempStats[key] || 0;
  // Bonus de stat de armadura (ej: bonusINT en armaduras de mago, bonusFUE en brutales)
  const armorBonus = (p.armadura && p.armadura["bonus" + key]) || 0;
  return p.base[key] + sp.stats[STAT[key]] + tmp + armorBonus;
}
function maxHea() { return 40 + stat("AGU") * 6 + S.player.nivel * 5; }
function maxFul() { return round((60 + stat("EST") * 10) * rasgo("panzaMult", 1)); }
function maxMana() { return 4 + stat("INT"); }
function maxSta() { return 80 + stat("AGU") * 4; }

/* Altura del personaje: el valor elegido por el jugador, o el default de la especie. */
function alturaCm() { return S.player.alturaCm || especieDe(S.player).altura || 175; }
function altura() { return alturaCm() / 100; }

/* Composición corporal REALISTA:
   - peso magro = masa base por altura + músculo de FUE (se "carga solo", atado a fuerza)
   - peso graso = fat (kg de grasa); es lo que cuesta energía moverse
   - peso total y cintura quedan en valores creíbles; el IMC manda las descripciones. */
function pesoMagro() { const h = altura(); return round(h * h * 17 + stat("FUE") * 1.8); }
function pesoGraso() { return S.player.fat; }
function peso() { return round(pesoMagro() + pesoGraso() + S.player.ful * 0.25); }
/* Índice de masa corporal (excluye la comida transitoria en la panza). */
function imc() { const h = altura(); return (pesoMagro() + pesoGraso()) / (h * h); }
/* Cintura aproximada (circunferencia, cm). */
function cintura() { return round(68 + S.player.fat * 0.85 + S.player.ful * 0.25); }

/* Energía (stamina) que cuesta una acción de movimiento en el overworld.
   Sube con la grasa por encima del mínimo; FUE y AGI la compensan. */
function costoMovimiento() {
  const exceso = Math.max(0, pesoGraso() - FAT_FLOOR);
  let costo = (4 + (exceso * 0.5) / (1 + (stat("FUE") + stat("AGI")) * 0.18)) * rasgo("costoMovMult", 1);
  costo = Math.min(costo, maxSta() * 0.45);   // tope: un descanso siempre alcanza para moverse
  return Math.max(3, round(costo));
}
/* Sin aliento: no queda energía para otra acción de movimiento. */
function semiInmovil() { return S.player.sta < costoMovimiento(); }

/* Estado corporal del jugador (para "Chequear estado").
   3 estados ripped si la grasa es baja y la fuerza alta; si no, 12 niveles por IMC. */
function estadoCuerpoJugador() {
  const fat = pesoGraso(), fue = stat("FUE"), b = imc();
  // Ripped: poca grasa + mucha fuerza (un cuerpo trabajado pesa por músculo, no por grasa)
  if (fat <= 14 && fue >= 14) {
    if (fue >= 26) return "ripped3";
    if (fue >= 19) return "ripped2";
    return "ripped1";
  }
  // Tiers por IMC — umbrales PERMISIVOS, perspectiva fat-fur: lo que clínicamente es
  // "obesidad mórbida" (IMC ~35) acá es apenas "gordo". Los extremos van a la fantasía WG.
  const tiers = [
    ["desnutrido", 17], ["flaco", 20], ["esbelto", 24], ["promedio", 27],
    ["blando", 31], ["rellenito", 35], ["gordo", 48], ["muyGordo", 63],
    ["obeso", 85], ["morbido", 115], ["super", 150], ["ultra", 200],
    // --- Estados puramente estéticos (sin mecánica nueva): solo más IMC ---
    ["coloso", 270], ["leviatan", 360], ["monumento", 480],
  ];
  for (const [id, th] of tiers) if (b < th) return id;
  return "singularidad";
}
function inmovil() {
  const p = S.player;
  return p.fat + p.ful * 1.2 > stat("FUE") * 16 * rasgo("umbralPesoMult", 1);
}
function defensa() {
  const p = S.player;
  const arm = p.armadura;
  if (!arm) return 0;
  const nl = (p.mejoras && p.mejoras[arm.id]) || 0;
  // Armaduras: mejoraRateDef puntos de def por nivel (default 0.5, redondeado al entero)
  const bonus = nl > 0 ? Math.floor(nl * (arm.mejoraRateDef || 0.5)) : 0;
  return arm.def + bonus;
}

/* Etiqueta corta de cuerpo = el nombre del estado actual (unificado con Chequear estado). */
function etiquetaGordura() {
  const st = GD.estadosJugador[estadoCuerpoJugador()];
  return st ? L(st.label) : "";
}

/* ---- Tracking de estadísticas históricas de peso (Tradición de la Plenitud) ----
   Llamar después de cualquier mutación relevante de p.fat / p.ful (devorar, comer, feast).
   Actualiza highestWeight/highestFat, detecta transiciones a estados "obesos" para
   timesObese (solo cuenta el cruce, no cada turno que el jugador permanece ahí), y
   dispara las quests/logros asociados. */
const ESTADOS_OBESOS = ["obeso", "morbido", "super", "ultra", "coloso", "leviatan", "monumento", "singularidad"];
function trackWeightStats(p) {
  const ls = p.lifetimeStats;
  if (!ls) return;
  const w = round(peso()), f = round(p.fat);
  if (w > ls.highestWeight) { ls.highestWeight = w; tickLogro("highestWeight", w); }
  if (f > ls.highestFat) { ls.highestFat = f; tickLogro("highestFat", f); }

  const esObeso = ESTADOS_OBESOS.includes(estadoCuerpoJugador());
  if (esObeso && !p._fueObeso) {
    ls.timesObese++;
    tickQuest("times_obese", { valor: ls.timesObese });
    tickLogro("timesObese", ls.timesObese);
  }
  p._fueObeso = esObeso;

  tickQuest("reach_weight", { valor: f });
}

/* ---- Conversión de unidades para mostrar (interno siempre métrico) ---- */
function mostrarPeso(kg) {
  if (GD.unidades === "imperial") return t("unit.lb", { n: round(kg * 2.20462) });
  return t("unit.kg", { n: round(kg) });
}
function mostrarDistancia(cm) {
  if (GD.unidades === "imperial") return t("unit.in", { n: round(cm / 2.54) });
  return t("unit.cm", { n: round(cm) });
}
// Altura: métrico en metros (1.79 m); imperial en pies/pulgadas (5'10")
function mostrarAltura(cm) {
  if (GD.unidades === "imperial") {
    const ti = cm / 2.54, ft = Math.floor(ti / 12), inch = Math.round(ti - ft * 12);
    return ft + "'" + inch + '"';
  }
  return t("unit.m", { n: (cm / 100).toFixed(2) });
}
function toggleUnidades() {
  GD.unidades = GD.unidades === "metric" ? "imperial" : "metric";
  try { localStorage.setItem("pleroma_units", GD.unidades); } catch (e) {}
  if (S.screen) S.screen();
  render();
}
function etiquetaLlenura() {
  const r = S.player.ful / maxFul();
  let k = "reventar";
  if (r < 0.05) k = "vacio";
  else if (r < 0.3) k = "apetito";
  else if (r < 0.6) k = "satisfecho";
  else if (r < 0.85) k = "lleno";
  else if (r < 1.0) k = "muyLleno";
  else if (r < 1.25) k = "atiborrado";
  return t("body.belly." + k);
}

