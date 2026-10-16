# Aprobaciones

## CHECKPOINT 1 — plan `05-plan-final.md`
Mensaje literal: `APRUEBO`
Nota: `state_approve` no existe en esta build; este fichero es el registro auditable.

## CHECKPOINT 2 — revision de UX (T12 reescrita + T14 nueva)
Mensaje literal del propietario:
```
adelante, apruebo que empieces la implementacion
```
Alcance aprobado: `state/06-decisiones-UX.md`.
- Ruta A (menu) → panel con formulario y contacto directo, sin entrevista.
- Ruta B (E junto al reportero) → cuadro de dialogo fuera del panel, respuestas sin scroll; al terminar abre el panel.
- Maquina de escribir con `time` (decorativo) y saltar que completa la linea.

## Estado medido en el momento de esta aprobacion
`npx tsc --noEmit` LIMPIO · `npm test` 198 verdes / 22 rojos · `npm run build` verde.
Bundle: main-BrE05dZp.js 707,05 kB (gzip 197,91); css 23,31 kB (gzip 5,74).
`dist/` tras T1: 18 ficheros / 1.031.195 B (antes 27 / 1.825.759 B).

## Pendiente de decision del propietario
- La errata `débutants` en `content.ts` (versionado en HEAD, ES contradice su propia traduccion EN "fun and meaningful"; deberia ser "divertidos"). **No se ha tocado**: es texto suyo.
- T5 (identidad en la primera pantalla) sigue sin hacer: es el AC1 mas visible y depende de `boot.ts`, `hud.ts`, `index.html`.
- Bug T1 del marcador del techo: diferido, visible en las capturas (digitos cortados).
- `AGENTS.md` dice tres cosas que no son ciertas: `the-court/` NO es un repo git anidado, el CV esta en `documents/` y no en `assets/documents/`, y la tabla de comandos esta desfasada.