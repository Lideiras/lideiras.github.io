# 01 — Scout (consolidado)

Repo: portfolio personal de **Daniel Noya Catoira**. Sitio estatico publicado en GitHub Pages + subproyecto `the-court/` (Vite 6 + TS strict + three 0.170).
Producto: **que se pueda leer y entender quien es la persona**. El juego 3D es elVehiculo, el contenido es el producto.

## Superficies que muestran INFORMACION (core)
Juego, DOM (`the-court/src/ui/panels.ts`): `:184` Proyectos · `:198` Skills · `:227` Experiencia · `:249` Sobre mi (5 pestañas) · `:278` Record · `:371` Entrevista · `:480` Contacto · PanelManager `:507`.
Juego, HUD (`the-court/src/ui/hud.ts`): menu `:245`, rumbo `:266`, record `:410`, racha `:437`, medidor `:534`, aviso `:555`, subtitulo `:581`, concurso triples `:503`, REC `:474`, `aria-live` `:143`, tactiles `:596`.
Juego, 3D: marcador del techo `game/main.ts:894` (bug T1 abierto), rotulos `sign_*` `main.ts:1188`, placa Skills `builders/props.ts:358`, cartel ON AIR `builders/tv.ts:69`.
Clasica: `classic/index.html` 5 secciones (`:39` about, `:41` projects, `:43` skills, `:45` experience, `:47` contact).
Entrada: `index.html` raiz = copia compilada de `the-court/dist`.

## Fuente de verdad y riesgo de desincronizacion
`the-court/src/data/content.ts` es la fuente unica, pero se materializa en 3 sitios.
- `the-court/public/classic/index.html`: GENERADO por `npm run classic` (gitignored).
- `classic/index.html` raiz: **COPIADO A MANO y versionado**. Verificado HOY identico al generado (`fc /b` sin diferencias), pero el build no lo actualiza: en cuanto `content.ts` cambie y no se copie, se desincroniza en silencio.
- `index.html` raiz: copia manual de `the-court/dist/`. Verificado identico hoy.
Textos duplicados a mano: `i18n.ts:52-57` (`section_*`) vs `i18n.ts:62-67` (`sign_*`) vs cabeceras literales en `scripts/build-classic.ts`.
`content.about.paragraphs` se reparte **posicionalmente** a 5 pestanas (`panels.ts:251-260`): anadir/quitar parrafos descoloca temas en silencio.
`assets/` conserva bundles viejos (`index-CMLMa7AP.js`, `index-BSaLLwQn.css`, `main-*.js`) no referenciados = peso muerto.

## Stack / comandos
`npm run dev` · `npm test` (vitest) · `npx tsc --noEmit` · `npm run build` (= validate --strict && classic && tsc && vite build) · `npm run preview`.
Sin lint, sin CI, sin formateador. `tests/*.check.ts` NO entran en vitest.
Deploy: manual (copiar `dist/` a raiz y `public/classic/` a `classic/`).

## Ficheros criticos
`src/data/content.ts` (494 L) · `src/ui/panels.ts` (580 L) · `src/ui/hud.ts` (648 L) · `src/i18n.ts` (328 L) · `classic/index.html` · `scripts/build-classic.ts` · `scripts/validate-content.ts`.

## Deuda visible
Bug T1: marcador del techo con digitos cortados (`builders/court.ts`). Codigo muerto: `src/game/characterGlb.ts`, `assets-src/voxel-court.glb` (7,8 MB). Repo git anidado en `the-court/`. Publicacion manual sin CI.