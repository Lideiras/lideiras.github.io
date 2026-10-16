# Triage — hallazgos

Formato: ACCION + razon. Ningun hallazgo critico/alto de seguridad se rechaza por ser incomodo.

## Del arbitraje de planes (SESGO_DE_POSICION reportado por el juez)

| # | Hallazgo | Accion | Razon |
|---|---|---|---|
| H1 | Automatizar la escritura en la raiz (`index.html`, `classic/`, `assets/`) | **RECHAZAR** (la escritura) / **ACEPTAR** (la deteccion) | `the-court/AGENTS.md` declara la raiz «solo lectura: es la version compilada del sitio publicado y no se toca». Es una invariante del propietario, no una preferencia mia. La mitad de solo lectura (T11: comparar y fallar) si entra: detecta igual sin escribir nada. |
| H2 | «No hay arnes que compruebe el HTML generado sin anadir uno» | **RECHAZAR** | Premisa falsa: `vitest` corre hoy 12 ficheros y `node:fs` lee `public/classic/index.html` sin dependencia nueva. Sobre este supuesto se descartaba la red de seguridad de AC4. |
| H3 | «4 parrafos vacios `<p></p>`» | **CORREGIR** | Son 6. El criterio `-> 0` no cambia, pero el dato erroneous no se propaga. |

## Hallazgos propios del orquestador (verificados con evidencia)

| # | Hallazgo | Evidencia | Accion | Razon |
|---|---|---|---|---|
| O1 | ~~`the-court/public/index.html` es una copia vieja de build que Vite copia a `dist/`; puede pisar el `dist/index.html` recien construido y dejar el sitio publicado en blanco~~ | **MEDIDO Y DESMENTIDO.** Se metio un marcador en `the-court/index.html`, se reconstruyo y el marcador LLEGO a `dist/index.html`, que quedo mas largo (3403 B) que `public/index.html` (3312 B). Vite escribe su `index.html` DESPUES de copiar `public/`: **no hay sombra**. | **REBAJAR de critico a bajo** y ejecutar T1 como limpieza, no como desbloqueo | **Me equivoque** al presentarlo como el hallazgo mas grave. El indicio (`public/index.html` con hash y sin `/src/boot.ts`) era real pero no demostraba el efecto. El unico efecto medido es **peso muerto**: `public/assets/assets/` -> `dist/assets/assets/` duplicaba el bundle entero. T1 ejecutada: `dist/` de 27 ficheros / 1.825.759 B a **18 ficheros / 1.031.195 B** (-794.564 B, -43,5%). Sin cambios de comportamiento. |
| O2 | La puerta no nombra a la persona | `the-court/index.html:28` `<h1>MY PORTFOLIO</h1>`; el nombre solo en `panels.ts:264` | **ACEPTAR como T5** | Primer pixel del portfolio. AC1. |
| O3 | `<h2>Skills</h2>` es literal duro, no bilingue | `build-classic.ts:59` | **ACEPTAR dentro de T7** | Unica cabecera de seccion que no cambia a ES. AC7. Lo encontro el orquestador; ninguno de los dos planners lo nombro. |
| O4 | El enlace a texto plano esta muerto | `the-court/index.html:17` usa `.skip`; cero coincidencias de `.skip` en `styles.css` | **ACEPTAR como T9** | Enlace invisible e intabulable del que depende AC3. |
| O5 | El cuadro de entrevista es demasiado pequeno | `styles.css:596-605`: `min(460px,100%)` x `min(100%,40dvh)` frente a `920px` x `72dvh` (`:430-431`) | **ACEPTAR como T12** | Peticion expresa del propietario. El comentario de `:598-603` («esquina de television») es una decision ANTIGUA que el propietario acaba de revertir: en un portfolio, leer la conversacion gana a no tapar al plato. |
| O6 | Densidad: navegacion a `.72rem` en pixel | `styles.css:919`, `.label` a `.7rem` (`:630`) | **ACEPTAR como T8** | La barra de pestanas decide que panel se ve. |
| O7 | El ritmo vertical de la prosa es corto | `styles.css:891` `.prose + .prose` a `.9rem` para texto a `1rem/1.6` | **ACEPTAR como T13** | «Demasiado agrupado». Se ataca con aire, **quitando menos informacion**: en un portfolio, estirar es mejor que recortar. |

## Diferido

| # | Hallazgo | Accion | Razon |
|---|---|---|---|
| D1 | Bug T1 del marcador del techo con digitos cortados | **DIFERIR** | Fuera del encargo segun requisitos. Es geometria de un rotulo 3D y no toca ninguna superficie de informacion. Necesita un primer plano para diagnosticarse: es trabajo aparte. |
| D2 | Bundles viejos en `assets/` (`index-CMLMa7AP.js`, `main-BOQCOXR3.js`) y `characterGlb.ts` / `voxel-court.glb` muertos | **DIFERIR** | Peso de repositorio, no de lectura. `assets/` es la raiz, de solo lectura. |
| D3 | Automatizar el deploy (copia `dist/` -> raiz) | **DIFERIR** | Roza la invariante de H1 y exige decidir el flujo de deploy completo. No es de este encargo. |
| D4 | Enlace al CV desde la clasica | **DIFERIR** | El PDF esta en `documents/CV_eng.pdf` en la raiz, no en `assets/documents/` como dice `AGENTS.md`. Desde `/classic/` no hay ruta que funcione en produccion y en `dev`/`preview` a la vez. Tarea aparte con decision de ruta. |
| D5 | Corregir `AGENTS.md` (`assets/documents/` -> `documents/`, «13 tests» -> 12/163) | **DIFERIR** | Es doc del propietario y el cambio es suyo. Se le informa en el resumen. |