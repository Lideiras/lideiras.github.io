# Brief repo-scout-1

## Objetivo
Mapear el repo `D:\PROYECTOS\lideiras.github.io` (portfolio personal, sitio estatico + subproyecto Vite/Three.js `the-court/`) y producir `state/01-scout.md` (<=60 lineas) + `state/gates.json` + `state/baseline.json`.

## Entradas
- Repo completo. Rama `main`, working tree limpio (verificado por el orquestador).
- Ficheros de interes: `index.html`, `classic/index.html`, `classic/fonts/`, `the-court/src/ui/panels.ts`, `the-court/src/ui/hud.ts`, `the-court/src/data/content.ts`, `the-court/src/i18n.ts`, `the-court/src/boot.ts`, `the-court/src/styles.css`, `the-court/index.html`, `the-court/package.json`, `the-court/AGENTS.md`, `the-court/BITACORA.md`, `the-court/handoff.md`, `analisis-mejoras-the-court.md`, `notas.md`, `guia_estilo_cuberworld.md`, `the-court/PLAN-LOTE-A.md`, `the-court/tasks.json`.
- Tablas de estado existentes en `the-court/` (pueden estar obsoletas; no confies en ellas).

## Salida
1. `state/01-scout.md` — <=60 lineas. Debe incluir:
   - Que es el repo y cual es el "core" de producto (portfolio: se necesita leer sobre la persona).
   - Mapa de superficies de UI que muestran INFORMACION: lista concreta de paneles/HUD/sections classical con fichero:linea de inicio. Esto es lo MAS importante del scout.
   - De donde sale la informacion (fuente de verdad: `content.ts`, HTML literal en `classic/`, JSON, etc.) y si hay duplicacion/desincronizacion entre superficies.
   - Stack y comandos exactos de build/test/deploy (leer package.json scripts). Como se sirve (GitHub Pages, dist?).
   - Deuda/obstaculos visibles de un vistazo.
   - 3-5 archivos mas grandes o mas criticos del punto de vista de contenido.
2. `state/gates.json` — gates ejecutables con comando exacto y criterio de pass. Minimo: build, test, typecheck/lint (solo si existen en package.json), y un gate de "contenido presente" (grep de secciones clave del portfolio).
3. `state/baseline.json` — estado actual de esos gates ejecutado de verdad (no inventado): comando, exit code, y resumen de pass/fail. Si un comando falla, reportalo tal cual.

## Limites
- SOLO LECTURA. No edites ningun fichero del repo (ni codigo, ni docs, ni los .md de the-court).
- No ejecutes nada destructivo (no git checkout/reset/clean/install).
- Puedes ejecutar comandos de build/test/lint de solo-verificacion si son rapidos y no mutan el repo; si alguno muta (escribe dist/, etc.), NO lo ejecutes: dejalo declarado en gates.json como "no ejecutado en baseline" con el motivo.
- No propongas soluciones ni escribas planes: solo mapa. Las propuestas son de los planners.
- Presupuesto: max ~30 tool calls. Prioriza leer, no executes.

## Criterio de terminado
`state/01-scout.md` (<=60 lineas), `state/gates.json` y `state/baseline.json` existen, el baseline refleja ejecucion real (o declara explicitamente por que un gate no se ejecuto), y el scout nombra con fichero:linea TODAS las superficies que muestran informacion del portfolio.