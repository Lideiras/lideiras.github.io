# Handoff

**Fase:** RED completo (49 tests rojos medidos) · **T1 HECHA** · T2..T13 pendientes.
Rama `main`. Gates: `tsc` limpio · `npm test` = 163 verdes + **49 rojos previstos** · `build` verde.

## Decision que hay que recordar
**El hallazgo O1 se queda desmentido por medicion, no por opinion.** Se puso un marcador en `the-court/index.html`, se reconstruyo y el marcador llego a `dist/index.html`: Vite escribe su HTML DESPUES de copiar `public/`, asi que `public/index.html` NUNCA lo pisa. No habia sombra. Lo unico real era peso muerto.

## Hecho
- **T1** `the-court/public/index.html` y `the-court/public/assets/` borrados. `dist/`: 27 ficheros / 1.825.759 B -> **18 ficheros / 1.031.195 B** (-794.564 B, -43,5%). `tsc` limpio, build verde.
- **Tests rojos**: 7 ficheros nuevos en `the-court/tests/`. Corregidos 2 defectos de TS que rompian el gate de build (`fn(...args)` con array no-tupla; `constScripts` sin `const`) y un comentario que afirmaba la premisa desmentida de O1.

## Tests rojos (49) y que task los cierra
- `vista-pura.test.ts` (8) -> **T2**
- `about-temas.test.ts` (4) -> **T3**
- `guardas-contenido.test.ts` (11) -> **T3 + T10**
- `etiquetas-contenido.test.ts` (2) -> **T4**
- `paridad-clasica.test.ts` (12) -> **T6 + T7**
- `medida-lectura.test.ts` (10) -> **T8 (5) + T9 (1) + T12 (2) + T13 (2)**
- `identidad-publicada.test.ts` (2, ya verde la de T1) -> **T11**

## Siguiente
**T2** capa de vista pura `src/data/view.ts`. Es la base de T3, T4, T6 y T7. Escribe: `view.ts` (nuevo), `panels.ts`, `build-classic.ts`, `tests/view.test.ts`.
Paralelismo real tras T1: `{T2, T5}`. Nada mas.

## Reglas que no se mueven
- La raiz (`index.html`, `classic/`, `assets/`, `documents/`) es de **solo lectura**. T11 la LEE.
- `view.ts` no puede importar `window`, `document`, `localStorage` ni `three`: `build-classic.ts` corre en Node.
- Sin dependencias nuevas. Sin lint. Codigo en espanol.
- `tests/human.test.ts` comprueba geometria absoluta: no se relaja.
- Ningun "los tests pasan" sin que lo compruebe el orquestador: `npm test` y `npm run build`, en ese orden.