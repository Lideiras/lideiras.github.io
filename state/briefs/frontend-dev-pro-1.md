# Brief frontend-dev-pro — T2 (capa de vista pura)

## Objetivo
Ejecutar **solo T2** de `state/05-plan-final.md`: crear `the-court/src/data/view.ts`, una capa de vista pura y derivada que consuman LOS DOS renderizadores (el juego y la clásica), de modo que orden, agrupado y formato de fechas dejen de estar duplicados y las dos superficies no puedan divergir.

## Ficheros que puedes tocar (y solo estos)
- `the-court/src/data/view.ts` — **NUEVO**
- `the-court/src/ui/panels.ts`
- `the-court/scripts/build-classic.ts`
- `the-court/tests/view.test.ts` — solo si el test nuevo necesita un ajuste de forma (no para relajar nada)

## Prohibido tocar
Cualquier otro fichero. En concreto `src/i18n.ts`, `src/data/content.ts`, `src/styles.css`, `package.json` y todo lo de `src/game/` son de otras tareas.

## Contexto obligatorio
- `state/04-contract.md` invariantes congelados.
- `state/mapa-ficheros.md` escritor unico.
- **`the-court/tests/vista-pura.test.ts` es tu contrato.** Leelo primero: define exactamente que se exporta, con que nombres y que formas. Esta en ROJO ahora y debe quedar en VERDE.
- Ficheros a leer: `the-court/src/data/content.ts`, `the-court/src/ui/panels.ts` (sobre todo `MONTHS`/`fmtDate` en :142-159, `renderProjects` en :184-195, `renderExperience` en :227-238), `the-court/scripts/build-classic.ts` (:51-69).

## Regla dura que no puedes violar
`view.ts` lo importa `build-classic.ts`, que corre en **Node**. Por tanto `view.ts` **no puede** importar `window`, `document`, `localStorage` ni `three`. La fuente de idioma llega **por parametro**, no leyendo `getLang()`. Si te ves tentado a llamar a `getLang()`, el idioma se pasa como argumento.

## Que mover a la vista
1. `MONTHS` (los dos idiomas).
2. `fmtDate(d, lang)`: `2025-02` -> `feb 2025` / `Feb 2025`. Un anio sin mes se deja tal cual: no se le inventa un mes.
3. Proyectos ordenados por anio descendente, y el agrupado en pestanas (`Todo · N`, luego un grupo por anio con contador), tal como hace hoy `renderProjects`.
4. Hitos ordenados de mas reciente a mas viejo, y el agrupado por tipo (`work` / `education` / `sport`) filtrando los vacios, tal como hace hoy `renderExperience`.
5. Identidad: el nombre, puesto y ubicacion de `content.person`, en una sola parte.

## Como se verifica
Tu shell esta denegado: **no ejecutes nada y no digas que los tests pasan.** Los ejecuta el orquestador con `npm test`. Tu trabajo es que el codigo este bien y encaje con lo que el test pide.
Cierra `state/03-tarea-T2.md` con: que has movido, que has quitado de donde estaba, y cualquierdecision que tomes y el orquestador deberia mirar.

## Estilo
Codigo y comentarios en **espanol**. Comentarios que explican el **por que**, con el mismo tono y densidad de razonamiento que el resto del repo. `strict` + `noUnusedLocals`: una variable sin usar rompe el build. No anadas dependencias.