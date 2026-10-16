# 04 — Contrato tecnico (CONGELADO)

Limites que la implementacion DEBE respetar. No son preferencias: son invariantes del proyecto ya decididas por el propietario (`the-court/AGENTS.md`, `the-court/BITACORA.md`).

## Fuente de verdad
- `the-court/src/data/content.ts` es el UNICO sitio con datos del portfolio. Ninguna tarea puede introducir una segunda copia de contenido en HTML, JSON o TS.
- Los textos de interfaz van en `the-court/src/i18n.ts` con clave ES/EN. Prohibido literal de interfaz fuera de i18n (excepcion: contenido editorial de `content.ts`).
- `npm run validate -- --strict` es la puerta de calidad del contenido: ids duplicados, marcadores `[[PENDIENTE]]`, email invalido, `initials` > 3, `person.name === 'Tu Nombre'` rompen el build.

## Build y publicacion (invariante)
- Cadena: `validate --strict` -> `build-classic.ts` (genera `public/classic/index.html` desde `content.ts`) -> `tsc --noEmit` -> `vite build` (escribe `dist/`).
- `public/classic/index.html` y `dist/` estan en `.gitignore`: son artefactos, nunca se editan a mano.
- Lo publicado en la raiz (`index.html`, `classic/index.html`, `assets/`) es una COPIA del build. Hoy la copia es manual y por eso se puede desincronizar en silencio.
- No introducir pasos manuales nuevos sin convertirlos en parte automatizada del build.

## Codigo
- `tsconfig` tiene `strict`, `noUnusedLocals` y `noUnusedParameters`: una variable sin usar rompe el build.
- Sin lint, sin formateador, sin CI. No añadir dependencias sin justificacion fuerte.
- Codigo, comentarios y commits en espanol. Los comentarios explican el **por que**.

## Render (invariantes medidos, NO tocar sin evidencia)
- `shadowMap.autoUpdate = false`, hornado una vez con `bakeShadows()`. Nada que se mueva puede proyectar.
- `VOXEL_MATERIAL` se comparte por identidad: un segundo material = un draw call extra.
- `mergeStaticLots()` excluye los rigs (jugador, balon, reportero, operador).
- Maquina de referencia: **Intel HD 4600 (2012)**. Fotograma = `A + B*s^2`, `A ~= 8,9 ms`, `B ~= 22,4 ms`. `ESCALA_MIN = 0.7` es suelo.
- Prohibido reintroducir heuristica por nombre de GPU (ANGLE anida parentesis y rompe el normalizado).
- `time` = reloj decorativo (se congela con `prefers-reduced-motion`); `animTime` = reloj del personaje, nunca se congela.

## Tests
- `tests/human.test.ts` comprueba geometria ABSOLUTA (altura 1,809 m, pivote de cadera). Si el plan toca celdas del rig, esos numeros se actualizan CON justificacion, nunca se relajan para pasar.
- `tests/*.check.ts` NO los corre vitest. No decir que "pasan" sin haberlos corrido con `npx tsx`.
- Verificacion completa: `npm test` Y `npm run build`, en ese orden. Un test verde no dice que compile.

## Ambiente
- `the-court/` es un repo git anidado con su propio `.git`.
- Sin `VITE_FORM_ENDPOINT` el formulario cae a `mailto:` por diseño: eso es correcto, no es un bug.