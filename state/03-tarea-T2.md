# T2 — Capa de vista pura `src/data/view.ts` · estado: ESCRITO (sin medir)

Contrato: `the-court/tests/vista-pura.test.ts` (8 comprobaciones). No he ejecutado
nada: mi shell está denegado. Lo que sigue es lo que escribí, no lo que verifiqué.

## Ficheros tocados (solo los de la tarea)

| Fichero | Qué ha cambiado |
|---|---|
| `src/data/view.ts` | **NUEVO** |
| `src/ui/panels.ts` | borra su tabla de meses, su `fmtDate` y sus dos ordenaciones; consume la vista |
| `scripts/build-classic.ts` | importa la vista: identidad, orden de proyectos, orden de hitos y fechas |

No he tocado `i18n.ts`, `content.ts`, `styles.css`, `package.json`, nada de
`src/game/` ni ningún test. `tests/view.test.ts` **no existe** y no lo he creado:
el contrato que hay es `vista-pura.test.ts` y fija la forma de la vista sin
fijar nombres, así que no había ninguna forma que ajustar.

## Qué se ha movido a la vista

1. `MONTHS` (los dos idiomas), exportado tal cual desde `panels.ts:142-145`.
2. `fmtDate(d, lang)`. El idioma **entra por parámetro**; la vista no lo lee de
   ningún sitio. Un año sin mes (`2019`) se devuelve tal cual.
3. `vistaProyectos()` → `{ todos, porAnio }`: orden por año descendente con el
   título de desempate, y los grupos por año en ese mismo orden. La pestaña
   «Todo · N» la sigue montando `panels.ts` (el *rótulo* es texto de interfaz y
   vive en `i18n.ts`; la vista no decide cómo se llama nada).
4. `vistaHitos()` → `{ todos, porTipo }`: de más reciente a más viejo por
   `start`, y los grupos en orden fijo trabajo · estudios · deporte, sin los
   vacíos.
5. `persona()` → nombre, iniciales, dorsal, puesto, ubicación y `tagline?`.

## Qué se ha quitado de donde estaba

- `panels.ts`: `MONTHS`, el `fmtDate` local y el `getLang()` que tenía dentro.
  Ahora hay un `fecha(d) = fmtDate(d, getLang())`: el idioma se sigue leyendo en
  la superficie (que es quien sabe), y solo se pasa. `renderProjects`,
  `renderExperience`, la ficha de jugador de «Sobre mí» y el nombre del jugador
  en la entrevista salen de `persona()`/`vista*()`.
- `build-classic.ts`: ya no imprime `x.start`/`x.end` en crudo ni recorre
  `content.projects`/`content.timeline` por su cuenta.

## Decisiones que el orquestador debería mirar

1. **La clásica emite la fecha en los dos idiomas.** Como el resto de la
   plantilla, va con `b({ es: fmtDate(d,'es'), en: fmtDate(d,'en') })`: sale
   `feb 2025` / `Feb 2025` y el CSS esconde la que no toca. Efecto colateral
   quantifiable: la clásica **ya no suelta ninguna fecha `\d{4}-\d{2}`**, que es
   el requisito de fechas de T7 (`paridad-clasica.test.ts:53-63`). T7 no debe
   rehacerlo; le queda lo demás (highlights, etiqueta de tipo por hito,
   `<details>`, `<h2>Skills</h2>`, `og:*`).
2. **El primer proyecto de la clásica ahora es el del año mayor**, porque imprime
   `vistaProyectos().todos`. También es un requisito que el plan tenía en T7
   (`paridad-clasica.test.ts:100-109`): igual que las fechas, T7 no debe rehacerlo.
3. **La vista devuelve datos, nunca HTML.** El agrupado va como
   `{ kind, items }` / `{ year, items }` y cada superficie pone su rótulo: el
   juego con `t('kind_*')` y pestañas ARIA, la clásica en HTML plano. Así la
   vista se puede probar en Node sin DOM y ninguna superficie puede imponer
   su markup a la otra.
4. **`persona()` NO trae correo ni enlaces sociales.** Eso es contacto y lo
   decide la sección de contacto; si T5 (identidad en la primera pantalla)
   quiere dorsal o iniciales en la puerta, ya están aquí. Si metiera el correo
   aquí, la cabecera de la clásica empezaría a sacarlo de la identidad.
5. **Los tipos de hito se declaran en la vista** (`TIPOS_HITO`), no se leen del
   orden de `content.ts`: si el dueño añade un estudio al final, el bloque de
   estudios sigue en su sitio.

## Lo que falta medir (lo hace el orquestador)

- `npx vitest run tests/vista-pura.test.ts`
- `npm test` entero + `npx tsc --noEmit` + `npm run build` (la clásica se
  regenera, y `paridad-clasica.test.ts` lee ese HTML: si algo de lo anterior no
  cuadra, sale ahí y no en la vista).