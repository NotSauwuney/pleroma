import { minify } from "terser";
import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync, cpSync, rmSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const ROOT = new URL(".", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

// Orden de carga exacto (igual que index.html)
const JS_FILES = [
  "data/species.js",
  "data/items.js",
  "data/enemies.js",
  "data/world.js",
  "data/bodies.js",
  "data/npcs.js",
  "data/npcWG.js",
  "data/spells.js",
  "data/miniEventos.js",
  "data/lang/es.js",
  "data/lang/en.js",
  "i18n.js",
  "engine/01_core.js",
  "engine/02_body.js",
  "engine/03_systems.js",
  "engine/04_render.js",
  "engine/05_charcreation.js",
  "engine/06_exploration.js",
  "engine/07_screens.js",
  "engine/08_town.js",
  "engine/09_npcwg.js",
  "engine/10_magic_quests.js",
  "engine/11_combat.js",
  "engine/12_endgame.js",
];

async function build() {
  mkdirSync(join(ROOT, "dist"), { recursive: true });

  // Concatenar todos los JS
  const combined = JS_FILES
    .map((f) => readFileSync(join(ROOT, f), "utf8"))
    .join("\n");

  console.log(`Concatenado: ${(combined.length / 1024).toFixed(1)} KB`);

  // Minificar + mangle con Terser
  const result = await minify(combined, {
    compress: {
      drop_console: false,   // mantener console si lo hubiera
      passes: 2,
    },
    mangle: {
      toplevel: false,       // no mangle globals (GD, S, etc.) — el HTML los usa
      reserved: [            // nombres que el HTML referencia directamente
        "GD", "S", "comenzar", "cargar", "guardar",
        "cambiarIdioma", "cambiarUnidades",
      ],
    },
    format: {
      comments: false,
    },
  });

  const outJS = join(ROOT, "dist", "bundle.min.js");
  writeFileSync(outJS, result.code, "utf8");
  console.log(`Bundle: ${(result.code.length / 1024).toFixed(1)} KB → dist/bundle.min.js`);

  // Copiar index.html reemplazando todos los <script src="..."> por el bundle
  let html = readFileSync(join(ROOT, "index.html"), "utf8");
  html = html.replace(
    /<!-- DATA[\s\S]*?<script src="engine\/12_endgame\.js"><\/script>/,
    `<script src="bundle.min.js"></script>`
  );
  writeFileSync(join(ROOT, "dist", "index.html"), html, "utf8");
  console.log("index.html → dist/index.html");

  // Copiar assets/ (sprites opcionales) a dist/ para que viajen en el build.
  // Si no existe la carpeta, el juego sigue funcionando en modo solo-texto.
  const assetsSrc = join(ROOT, "assets");
  const assetsDist = join(ROOT, "dist", "assets");
  const hasAssets = existsSync(assetsSrc);
  if (hasAssets) {
    rmSync(assetsDist, { recursive: true, force: true });
    cpSync(assetsSrc, assetsDist, { recursive: true });
    console.log("assets/ → dist/assets/");
  }

  // Crear pleroma.zip con index.html y bundle.min.js en la raíz (requerido por itch.io)
  // + la carpeta assets/ junto a ellos (rutas relativas que el HTML referencia).
  const zipPath = join(ROOT, "pleroma.zip");
  if (existsSync(zipPath)) unlinkSync(zipPath);
  const zipItems = [
    `'${join(ROOT, "dist", "index.html")}'`,
    `'${join(ROOT, "dist", "bundle.min.js")}'`,
  ];
  if (hasAssets) zipItems.push(`'${assetsDist}'`);
  execSync(
    `powershell -Command "Compress-Archive -Path ${zipItems.join(",")} -DestinationPath '${zipPath}'"`,
    { stdio: "inherit" }
  );
  console.log("pleroma.zip  ← listo para subir a itch.io");
  console.log("\n✓ Build completo.");
}

build().catch((e) => { console.error(e); process.exit(1); });
