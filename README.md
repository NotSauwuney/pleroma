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
│   ├── 04_render.js        ← log + render de la vista, sprites
│   ├── 05_charcreation.js  ← creación de personaje
│   ├── 06_exploration.js   ← overworld + granjas de Solaz
│   ├── 07_screens.js       ← mochila, chequear estado, repartir puntos
│   ├── 08_town.js          ← tienda/posada/escuelas + forja
│   ├── 09_npcwg.js         ← sistema de NPCs WG (observar, alimentar, vínculo)
│   ├── 10_magic_quests.js  ← hechizos aprendidos, quests escolares, logros
│   ├── 11_combat.js        ← combate y magia en combate
│   └── 12_endgame.js       ← muerte/respawn, guardado, menú y arranque
├── i18n.js           ← capa de localización: t() para UI, L() para contenido
├── data/
│   ├── species.js    ← especies jugables (stats) — texto en lang/
│   ├── items.js      ← comida, bebida, pociones, armas, armaduras — texto en lang/
│   ├── enemies.js    ← criaturas por bioma + pools de encuentro — texto en lang/
│   ├── world.js      ← zonas, conexiones, lugares — texto en lang/
│   ├── bodies.js     ← estados de peso + lógica corporal — texto en lang/
│   ├── npcs.js       ← NPCs + trabajos de la zona segura — texto en lang/
│   ├── npcWG.js      ← NPCs con sistema WG (observar, alimentar, vínculo) — texto en lang/
│   ├── spells.js     ← GD.hechizos + GD.quests + GD.logros — texto en lang/
│   ├── miniEventos.js← mini-eventos encadenados — texto en lang/
│   └── lang/
│       ├── es.js     ← TODO el texto del juego: UI + contenido en español (idioma base)
│       └── en.js     ← TODO el texto del juego: UI + contenido en inglés
├── assets/sprites/   ← PNGs opcionales (enemy/ · npc/ · zone/); ver README ahí
├── LORE.md           ← biblia del mundo (world-building)
├── GAMEPLAY.md       ← diseño, estilos de juego, roadmap
├── LANG.md           ← cómo agregar un idioma nuevo
├── WEAPONS.md        ← progresión de armas y caminos a legendario
├── CHANGELOG.md      ← historial de versiones
├── HANDOFF.md        ← guía de retoma de sesión
└── README.md         ← esto
```

## Qué hay implementado

- **Multi-idioma** (español + inglés de base) con selector en la barra superior; cambia la
  pantalla en vivo y recuerda tu elección. Agregar idiomas: ver **LANG.md**.
- Creación de personaje (nombre, **7 especies** + custom con stats libres, pronombres,
  altura, cobertura de cuerpo)
- Cuerpo como sistema: llenura, grasa, peso, cintura, inmovilidad por exceso (**19 estados**,
  de desnutrido y ripped a singularidad); mensajes corporales con 3 voces (liviano / gordo /
  musculoso)
- Comer / digerir (la llenura se vuelve peso con el tiempo); ayuno quema grasa hacia el mínimo
- **13 zonas** conectadas (de combate y seguras) + **travesía en barco** por el Mar de las
  Fauces hacia **dos islas endgame** (Los Arenales de Solakh · El Gran Manto), cada una con
  su asentamiento, su tienda, su trabajo, sus enemigos y su jefe
- **✦ Misión secreta:** las dos mitades del **Amuleto de Intimidación** (una por isla) se
  funden en un amuleto que deja la travesía marítima sin combates
- **37 enemigos** con sabor y estados de peso propios (30 de encuentro + 7 jefes)
- **Mini-eventos encadenados** con elecciones y jefes especiales (también en las islas)
- **Combate por turnos:** atacar, devorar (3 técnicas), **lanzar hechizo**, ítems, huir,
  forcejear; IA enemiga con vore y ataques especiales
- **Sistema de magia escolar** (4 escuelas: Luz · Flujo · Profundidades · Plenitud), hechizos
  comprables, evoluciones y legendarios desbloqueables
- **Quests escolares** encadenadas que desbloquean hechizos; **logros** por lifetimeStats
- **Crafteo en forja:** armas crafteables → foranas → **3 legendarias secretas**
  (ver **WEAPONS.md**); armaduras en dos ramas con tier 3 triple
- **Muerte → respawn** (no reinicio): 5 causas con narrativa propia; morir en el mar te
  deja en el puerto con rescate naval. Perdés 50% de XP y oro; mochila y equipo intactos.
- Progresión: XP, nivel, puntos de stat, oro; mejora de armas hasta +10 y armaduras hasta +5
- Tienda, posada, herrería, escuelas, granjas con cocina, puerto con entrenamiento;
  **NPCs con sistema WG** (alimentar, vínculo, estados de peso)
- **Guardado v2:** 5 ranuras + exportar/importar archivo
- **🎮 Cheats** en la topbar: makemerich · makemestronger · makemeweightless ·
  makemeravenous · makemeeternal

## Cómo extender (todo es data)

- **Especie nueva:** copiá un bloque en `data/species.js`.
- **Enemigo nuevo:** copiá un bloque en `data/enemies.js` y agregalo a un pool de bioma.
  Campos especiales: `puedeDevorar: true` (puede tragarte → muerte por devoración),
  `tipoDano: "arcano"` (ataque mágico → muerte por magia).
- **Zona nueva:** agregá una entrada en `data/world.js` y conectala con `salidas`.
- **Ítem nuevo:** agregá a `data/items.js` (y al catálogo de tienda en `engine/08_town.js` si querés venderlo).
- **Hechizo nuevo:** agregá en `GD.hechizos` de `data/spells.js` y sumalo al catálogo del
  local correspondiente en `engine/08_town.js`.
- **Quest nueva:** agregá en `GD.quests` de `data/spells.js`.
- **Mini-evento nuevo:** agregá en `data/miniEventos.js`.
- **Idioma nuevo:** ver **LANG.md** (un archivo en `data/lang/`).

Todo el texto visible se traduce: la UI vía `t("clave")` en `data/lang/`, el contenido vía
referencias `@@ruta` resueltas con `L()` — el texto vive en `data/lang/es.js` / `en.js`.

Ver **GAMEPLAY.md** §5 para el roadmap de módulos siguientes.
