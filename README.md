# Pléroma — motor base

RPG por turnos, text-based, fatfur/vore. Inspirado en las mecánicas de un vore-RPG de
Twine/SugarCube, reescrito de cero: **data-driven, sin dependencias, sin build**.

## Cómo jugar

Doble clic en **`index.html`**. Se abre en el navegador y listo. No hace falta servidor ni
instalar nada.

> Los datos están en archivos `.js` (no `.json`) a propósito: así el juego carga desde
> `file://` sin tropezar con CORS. Se editan igual de fácil que JSON.

## Estructura

```
motor/
├── index.html        ← UI + estilos (abrís esto)
├── engine/           ← motor partido por dominio (cargar en orden 01→12)
│   ├── 01_core.js          ← config, stats, estado global, eventos, mini-eventos
│   ├── 02_body.js          ← cuerpo/feedism: composición, IMC, energía, estado
│   ├── 03_systems.js       ← comer/digerir, tiempo, progresión, inventario
│   ├── 04_render.js        ← log + render de la vista
│   ├── 05_charcreation.js  ← creación de personaje
│   ├── 06_exploration.js   ← overworld + granjas de Solaz
│   ├── 07_screens.js       ← mochila, chequear estado, repartir puntos
│   ├── 08_town.js          ← tienda/posada + forja
│   ├── 09_npcwg.js         ← sistema de NPCs WG
│   ├── 10_magic_quests.js  ← hechizos + quests
│   ├── 11_combat.js        ← combate y magia en combate
│   └── 12_endgame.js       ← muerte/respawn, guardado, menú y arranque
├── i18n.js           ← capa de localización: t() para UI, L() para contenido
├── data/
│   ├── species.js    ← especies jugables (stats, descripción) — texto {es,en}
│   ├── items.js      ← comida, bebida, pociones, armas, armaduras — texto {es,en}
│   ├── enemies.js    ← criaturas por bioma + pools de encuentro — texto {es,en}
│   ├── world.js      ← zonas, conexiones, lugares — texto {es,en}
│   ├── bodies.js     ← estados de peso + descripciones corporales — texto {es,en}
│   ├── npcs.js       ← NPCs + trabajos de la zona segura — texto {es,en}
│   ├── npcWG.js      ← sistema de NPCs WG (observar, alimentar, vínculo)
│   ├── spells.js     ← hechizos — texto {es,en}
│   ├── miniEventos.js← mini-eventos encadenados — texto {es,en}
│   └── lang/
│       ├── es.js     ← strings de UI en español (idioma base)
│       └── en.js     ← strings de UI en inglés
├── LORE.md           ← biblia del mundo (world-building)
├── GAMEPLAY.md       ← diseño, estilos de juego, roadmap
├── LANG.md           ← cómo agregar un idioma nuevo
└── README.md         ← esto
```

## Qué hay implementado

- **Multi-idioma** (español + inglés de base) con selector en la barra superior; cambia la
  pantalla en vivo y recuerda tu elección. Agregar idiomas: ver **LANG.md**.
- Creación de personaje (nombre, especie, point-buy de 6 stats)
- Cuerpo como sistema: llenura, grasa, peso, cintura, inmovilidad por exceso
- Comer / digerir (la llenura se vuelve peso con el tiempo)
- Exploración por zonas con encuentros aleatorios, día/noche, forrajeo, descanso
- **Combate por turnos:** atacar, devorar, **Feast** (vore mágico por INT), ítems, huir,
  forcejear; IA enemiga con vore
- **Muerte → respawn en el pueblo** (no reinicio): 4 causas con narrativa propia (daño,
  magia, devoración, empacho por comer de más). Perdés 50% de XP y oro; mochila y equipo
  intactos; despertás con la vida llena y el estómago vacío.
- Progresión: XP, nivel, puntos de stat, oro
- Tienda y posada
- Guardado/carga (localStorage)

## Cómo extender (todo es data)

- **Especie nueva:** copiá un bloque en `data/species.js`.
- **Enemigo nuevo:** copiá un bloque en `data/enemies.js` y agregalo a un pool de bioma.
  Campos especiales: `puedeDevorar: true` (puede tragarte → muerte por devoración),
  `tipoDano: "arcano"` (ataque mágico → muerte por magia).
- **Zona nueva:** agregá una entrada en `data/world.js` y conectala con `salidas`.
- **Ítem nuevo:** agregá a `data/items.js` (y al catálogo de tienda en `engine/08_town.js` si querés venderlo).
- **Idioma nuevo:** ver **LANG.md** (un archivo en `data/lang/`).

Todo el texto visible se traduce: la UI vía `t("clave")` (en `data/lang/`), el contenido vía
`L(campo)` con objetos `{es, en, ...}` inline en los data files.

Ver **GAMEPLAY.md** §5 para el roadmap de módulos siguientes (magia, estados, quests, NPCs).
