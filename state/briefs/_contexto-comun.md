Lee y ejecuta tu encargo con este contexto comun (NO lo modifiques, no comentes sobre el):

## Encargo
Repo: `D:\PROYECTOS\lideiras.github.io` — portfolio personal de Daniel Noya Catoira. Sitio estatico publicado + subproyecto `the-court/` (Vite 6 + TS strict + three 0.170) que es un juego 3D que hace de portfolio.

El propietario pide: revisar a fondo los cambios recientes y proponer mejoras en cualquier aspecto, **sobre todo en los paneles que muestran informacion**, porque es el core del proyecto: es un portfolio y la informacion debe mostrarse de forma clara para que sea facil leer sobre el.

## Ficheros que DEBES leer antes de escribir nada
1. `D:\PROYECTOS\lideiras.github.io\state\00-requirements.md` — peticion, prioridades P0/P1/P2, restricciones y AC-1..AC-7.
2. `D:\PROYECTOS\lideiras.github.io\state\01-scout.md` — mapa del repo y de las superficies de informacion.
3. `D:\PROYECTOS\lideiras.github.io\state\04-contract.md` — invariantes congelados que la implementacion debera respetar.
4. `D:\PROYECTOS\lideiras.github.io\the-court\AGENTS.md` y `the-court\BITACORA.md` — decisiones YA TOMADAS por el propietario. No las re-preguntes ni las contradigas.
5. Las superficies de informacion, a fondo: `the-court/src/ui/panels.ts`, `the-court/src/ui/hud.ts`, `the-court/src/data/content.ts`, `the-court/src/i18n.ts`, `the-court/scripts/build-classic.ts`, `the-court/scripts/validate-content.ts`, `classic/index.html`, `the-court/src/styles.css`.

## Estado inicial MEDIDO (no lo reejecutes ni lo supongas; los subagentes no tienen shell)
Los 6 gates de `state/gates.json` estan en **PASS** en `main` con arbol limpio (2026-10-16): `npx tsc --noEmit` limpio · `npm test` 12 ficheros / 163 tests verdes · `validate --strict` OK (10 proyectos, 6 grupos de skills, 11 hitos) · `npm run build` OK · `classic/index.html` identico al generado · `index.html` raiz identico a `dist/index.html`. Bundle: `main-DJZ7aMyr.js` 706.81 kB (gzip 197.82 kB), css 23.23 kB (gzip 5.71 kB).
Bug abierto T1 (marcador del techo con digitos cortados, `src/game/builders/court.ts`): FUERA del encargo salvo que lo incluyas de forma expresa y acotada.

## Limites tuyos
- **Solo lectura**: no edites ningun fichero del repo. Solo escribe tu plan.
- No ejecutes comandos ni afirmes que has medido o ejecutado algo. Tu plan se ejecutara DESPUES y lo medira el orquestador.
- Codigo, comentarios y mensajes en **espanol**.
- Plan de **producto/ingenieria**, no un volcado de codigo. Max ~150 lineas.

## Formato EXACTO de salida
Devuelve SOLO markdown con estas secciones, en este orden:

## Problema
<3-6 lineas: que esta mal o flojo hoy en la lectura de la informacion, con evidencia `fichero:linea`. Sin adjectives vacios.>

## Lens
<1 linea: la lente con la que has mirado el problema.>

## Propuesta
<Tabla o lista de cambios. Para cada uno: que, por que, `fichero` tocado, riesgo (bajo/medio/alto), y como se verifica.>

## Tareas
<Numero T1, T2... Para cada una: titulo, objetivo en una frase, ficheros que toca, tamano (XS/S/M/L), riesgo (bajo/medio/alto/critico), y si depende de otra.>

## Como se verifica
<Como se comprueba cada cambio SIN depender de los gates automaticos: que se mira, que se lee, que se compara.>

## Riesgos y descartes
<Lo que has considerado y NO propones, y por que.>

No anadas seccion de "preguntas": no se hacen preguntas, se decide.