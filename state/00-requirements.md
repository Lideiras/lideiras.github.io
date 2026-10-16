# 00 — Requisitos

## Peticion del propietario (verbatim)
"he hecho bastantes cambios en el proyecto, repasalos a fondo y investiga posibles mejoras en cualquier aspecto, pero sobre todo en los diferentes paneles que muestran informacion, ya que es el core del proyecto. La informacion se debe mostrar de manera clara para que sea facil leer sobre mi (es un portfolio, esto es importante), aunque tambien busca mejoras en otros aspectos."

## Contexto
Repo `D:\PROYECTOS\lideiras.github.io`: portfolio personal de Daniel Noya Catoira. Sitio estatico publicado + subproyecto `the-court/` (Vite 6 + TS strict + three 0.170) que es un juego 3D que hace de portfolio.
Mapear en `state/01-scout.md`. Leer si hace falta. Leer `the-court/AGENTS.md` y `the-court/BITACORA.md` (decisiones ya tomadas: NO re-preguntarlas).

## Prioridad
1. **P0 — Paneles e informacion.** Como se lee la informacion sobre la persona en cada superficie (`the-court/src/ui/panels.ts`, `src/ui/hud.ts`, `classic/index.html`). Claridad de lectura, jerarquia, encontrabilidad, calidad y longitud de los textos. Esto es un PORTFOLIO: el objetivo es que alguien entienda quien es la persona con un vistazo.

2. **P1 — Consistencia y fuente unica.** `src/data/content.ts` es fuente unica pero se materializa en 3 sitios y 2 se copian a mano. Duplicacion de textos, pestanas que se descolocan, contenido que puede quedar obsoleto servido.

3. **P2 — Otros aspectos.** Solo si hay ganancia real y riesgo bajo: accesibilidad, rendimiento,SEO/metadatos, i18n, deuda/limpieza, flujo de deploy. No inflar alcance.

## Restricciones duras
- **No re-preguntar** lo que BITACORA.md ya decidio (mapa de sombras estatico, VOXEL_MATERIAL por identidad, mergeStaticLots, A+B*s^2, ESCALA_MIN=0.7, sin heuristica por nombre de GPU, `time` vs `animTime`).
- No tocar la fisica, el tuning de `src/game/config.ts` ni el rig, salvo que el plan justifique muy claramente el beneficio Y el riesgo.
- Codigo, comentarios y commits en **espanol**.
- Sin lint ni CI: no inventar `npm run lint`.
- La maquina de referencia es Intel HD 4600 (2012): no proponer nada que rompa el presupuesto de fotograma.
- Mantener los 6 gates de `state/gates.json` en verde (`npm test` + `npm run build` son la verificacion completa).

## Estado inicial MEDIDO (no reejecutar, no suponer)
Baseline 2026-10-16, rama `main`, arbol limpio, los 6 gates en **PASS**: `npx tsc --noEmit` limpio; `npm test` 12 ficheros / 163 tests verdes; `validate --strict` OK (10 proyectos, 6 grupos de skills, 11 hitos); `npm run build` OK; `classic/index.html` identico al generado; `index.html` raiz identico a `dist/index.html`. Bundle: `main-DJZ7aMyr.js` 706.81 kB (gzip 197.82 kB), css 23.23 kB (gzip 5.71 kB).
Bug abierto T1: marcador del techo con digitos cortados (`src/game/builders/court.ts`). Esta FUERA del encargo salvo que el plan lo incluya de forma expresa y acotada.

## Criterios de aceptacion (AC) — el portfolio debe cumplir esto al terminar
- **AC1** Quien visita CUALQUIER superficie (juego o `classic/`) puede localizar, en pocos segundos, el nombre, que hace, que sabe hacer y como contactar. Sin abrir nada mas que esa superficie.
- **AC2** La informacion mas importante de cada panel es legible a primera vista: jerarquia visual clara, sin texto truncado ni solapado, sin depender de hover.
- **AC3** La informacion completa esta disponible tambien en formato plano/accesible (teclado + lector de pantalla), sin depender de un canvas ni de hover.
- **AC4** El contenido del portfolio tiene una fuente unica real: editar `content.ts` basta para que TODAS las superficies (juego y `classic/`) muestren lo mismo, sin copias manuales que puedan quedar obsoletas.
- **AC5** Los textos no se rompen al reordenarlos: si se anade, quita o reordena un elemento de contenido, ninguna seccion muestra contenido descolocado, truncado ni vacio.
- **AC6** Los 6 gates siguen en verde tras el cambio.
- **AC7** ES/EN completos y coherentes en toda superficie con texto, sin claves sin traducir ni literales fuera de i18n.