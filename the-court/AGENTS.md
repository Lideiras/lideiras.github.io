# AGENTS.md — the-court

Juego web (Three.js) que hace de portfolio. Todo el código vive en este directorio.

> Si vienes de otro sitio: la raíz del repo es `D:\PROYECTOS\lideiras.github.io` y este proyecto
> es la subcarpeta `the-court/`. El portfolio estático de la raíz (`index.html`,
> `assets/index-*.js`, `assets/documents/`) es **solo lectura**: es la versión compilada del sitio
> publicado y no se toca.

## Idioma
**Código, comentarios y mensajes de commit en español.** Los comentarios explican *por qué* y suelen
citar la medición que justifica el número; eso es lo que da valor al archivo.

## Comandos
```bash
npm run dev       # servidor de desarrollo (http://localhost:5173, host: true)
npm test          # vitest: 7 ficheros .test.ts, 98 tests
npx vitest run tests/human.test.ts   # un solo fichero (human.test.ts tarda ~9 s)
npx tsc --noEmit  # tipos (strict + noUnusedLocals + noUnusedParameters)
npm run build     # prebuild(validate --strict && classic) + tsc + vite build
npm run preview   # sirve dist/
npx tsx tests/watertight.check.ts    # comprobaciones SUELTAS (no las corre vitest)
```

**Antes de dar algo por terminado, la verificación completa es `npm test` + `npm run build`**
(en ese orden). `npm test` **no** pasa `tsc` ni `validate`: un `npm test` en verde no dice que
compile ni que `content.ts` sea válido, y `npm run build` tampoco corre los tests.

- No hay CI, ni linter, ni formateador, ni `vitest.config.ts`. No busques `npm run lint`: no existe.
- `tests/tightness.check.ts` y `tests/watertight.check.ts` **no entran en `vitest run`** (el include
  por defecto solo coge `*.test.ts`). Son guiones de una ejecución manual con `npx tsx`: ciérralos
  a mano o no digas que "pasan".
- `npm run build` **regenera `public/classic/index.html`** desde `src/data/content.ts`. Está en
  `.gitignore`: no lo edites a mano.
- `npm run validate -- --strict` falla con marcadores `[[PENDIENTE]]`, ids duplicados, email inválido,
  `initials` de más de 3 caracteres o `person.name === 'Tu Nombre'`. Sin `--strict` los marcadores
  `[[...]]` son solo *warnings*. `tsconfig` tiene `noUnusedLocals`: una variable sin usar rompe el build.

## Variables de entorno
- Copia `.env.example` → `.env` (ignorado por git). La única variable es **`VITE_FORM_ENDPOINT`**.
- **Sin `VITE_FORM_ENDPOINT` el formulario de contacto no falla: hace `window.location.href =
  mailto:`** (`src/ui/contactForm.ts`). Es el comportamiento previsto, no un bug: probarlo «en
  local» no prueba el envío por HTTP. El honeypot `name="_gotcha"` se ignora en silencio si viene relleno.

## Fuente única de los datos
`src/data/content.ts` es el **único** sitio con datos del portfolio (proyectos, skills, hitos,
contacto). Las seis secciones del juego y la versión clásica se renderizan desde ahí.

## Invariantes que se rompen fácil
1. **El mapa de sombras es estático.** `shadowMap.autoUpdate = false` y se hornea una sola vez con
   `bakeShadows()`, al final de la carga. **Nada que se mueva puede proyectar** (`noCastShadow`): el
   jugador, el balón y los dos actores del plató están fuera por eso. Si añades algo animado que
   proyecte, deja una silueta congelada en el suelo.
2. **`VOXEL_MATERIAL` se comparte por identidad.** `batch.ts` agrupa mallas comparando el material por
   referencia. Un segundo material para el mundo no se funde: es un draw call extra.
3. **`mergeStaticLots()`** funde el mundo estático al arrancar, excluyendo los rigs (jugador, balón,
   reportero, operador), que cambian de pose cada fotograma.
4. `tests/human.test.ts` comprueba **geometría absoluta** (altura 1,809 m; pivote de cadera). Si
   cambias celdas del rig esos números se mueven **por diseño**: actualízalos con justificación,
   nunca los relajes para que pase.
5. `src/game/config.ts` concentra el tuning de dificultad (distancia al aro, zona verde, medidor);
   `src/i18n.ts` las claves de texto. Tocar uno sin el otro rompe el flujo.

## Rendimiento: el modelo está medido
Máquina de referencia del propietario: **Intel HD 4600 (2012), ANGLE/D3D11**. El fotograma se ajusta
a `A + B·s²`, con **A ≈ 8,9 ms fijos** (CPU + vértices) y **B ≈ 22,4 ms por píxel**.

- La **escala de render inicial se MIDE** en la barra de carga (`elegirEscalaInicial`), no se
  adivina. **No reintroduzcas una heurística por nombre de GPU**: la anterior fallaba porque ANGLE
  anida paréntesis y la normalización `/\([^)]*\)/g` se comía el nombre del chip entero.
- `ESCALA_MIN = 0,7` es suelo: bajar más solo emborrona.
- `compileAsync` compila programas pero **no sube ni un vértice**. El `prewarm` (activo por defecto)
  dibuja las 7 vistas en la barra para subir búferes de geometría y estado de GL.
- Mide el coste **drenando la cola antes del reloj** (`readPixels` sin cronometrar y luego con). Con
  el reloj antes, mides la cola pendiente, no el fotograma.

## Interruptores de diagnóstico (URL)
`?perf=1` (latido también en producción) · `?escala=N` · `?noprewarm=1` · `?nopre=1` · `?nolambert=1` ·
`?sectores=N` · `?cell=N` · `?nobatch=1`
Sondas en `window.__court` (solo DEV): `diagnosticar()`, `sondear(momento, ms)`, `calidad()`,
`programas()`, `texturas()`, `draws()`, `reflowLabels()`.

## Movimiento reducido
`time` es el reloj **decorativo** (se congela a 0 con `prefers-reduced-motion`); `animTime` es el
reloj del **personaje** y nunca se congela, porque la zancada es respuesta al input, no decoración.
Lo que sea feedback de input va con `animTime`. Confundirlos deja el juego como una estatua o lo
hace injugable.

## Assets
- `public/models/ball.glb` es el **único** `.glb` que se carga.
- `assets-src/voxel-court.glb` (7,8 MB) está **muerto** desde que la cancha es procedural.
- `src/game/characterGlb.ts` es **código muerto**: nadie lo importa y no llega al bundle.
- `vite.config.ts` lleva un plugin propio para que `/classic/` funcione en `dev` y `preview`: el
  middleware SPA de Vite lo secuestra cuando lleva la barra final.

## Contexto que hay que leer antes de tocar nada
- **`BITACORA.md`** — cuaderno del proyecto, escrito explícitamente para que otro agente lo retome.
  La sección 0 tiene la tabla de comandos y el estado por fases; la sección 2 tiene **decisiones del
  propietario ya tomadas: NO vuelvas a preguntar por ellas**. Actualízalo al cerrar cada fase.
  Ojo: su tabla de comandos está desfasada (dice «13 tests»); manda `package.json`.
- `tasks.json` — **el encargo de trabajo en curso**, con tamaño/riesgo por tarea y `mapa_ficheros`
  (qué fichero pertenece a qué tarea, para no pisar trabajo ajeno). `handoff.md` es el estado de la
  sesión en curso. Los tres están en `.gitignore`: son andamiaje de coordinación, no código.

## Bug abierto conocido
**El marcador del techo sigue con los dígitos cortados por la parte inferior**: la carcasa tapa la
mitad baja de los números (en capturas se ve como `59/76` con un corte plano al lado). La cuña
escalonada de la carcasa no lo resolvió y hace falta un primer plano para diagnosticarlo.
Es la tarea **T1** de `tasks.json` (`src/game/builders/court.ts`), y es la primera del `orden`.

## Regla de trabajo con subagentes
Suelen ejecutar **sin permiso de shell**: no pueden correr tests ni medir nada. **No aceptes su
"los tests pasan" sin verificarlo tú** con `npm test` y `npm run build`, y no digas que algo está
medido si no lo ha medido nadie.