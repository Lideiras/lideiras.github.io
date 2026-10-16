# T3 — `about` con temas declarados · estado: ESCRITO (sin medir)

Contrato: `the-court/tests/guardas-contenido.test.ts` (11 comprobaciones, 11 en
rojo al empezar) + `the-court/tests/about-temas.test.ts` (6, ya en verde antes de
mí). **No he ejecutado nada**: mi shell está denegado. Lo que sigue es lo que
escribí, no lo que verifiqué.

## Ficheros tocados (solo los que me tocaban)

| Fichero | Qué ha cambiado |
|---|---|
| `src/ui/panels.ts` | `renderAbout` itera `TEMAS_ABOUT` y busca el tema por `id`; fuera el reparto posicional |
| `scripts/build-classic.ts` | la sección `about` se pinta por temas, con `<h3>` bilingüe |
| `scripts/validate-content.ts` | exporta `validar()`; comprueba cobertura de temas y ids duplicados |

No he tocado `content.ts`, `i18n.ts`, `styles.css`, `package.json`, nada de
`src/game/` ni ningún test. `content.about.paragraphs` sigue existiendo (lo usa
`paridad-clasica.test.ts:162`), pero ya **ninguna superficie lo dibuja**: es la
lista plana derivada, no el origen del reparto.

## 1. `renderAbout` (`src/ui/panels.ts`)

Se han ido el array `groups` con `idx: [0]…[4]`, el `Set` de índices conocidos, el
`extra` que rellenaba la última pestaña y el comentario que advertía del reparto
posicional (ya no aplica). Ahora:

```ts
for (const tema of TEMAS_ABOUT) {
  const parrafos = content.about.topics.find((x) => x.id === tema.id)?.text.filter(...) ?? [];
  if (!parrafos.length) continue;
  items.push({ label: loc(tema.label), html: parrafos.map(...).join('') });
}
```

- El **rótulo** sale de `loc(tema.label)` (idioma actual), no de `t('tab_*')`
  escrito a mano: si mañana se renombra una pestaña, el rótulo y la pestaña no
  pueden divergir porque son la misma constante.
- Un tema **sin texto no dibuja pestaña**: se conserva el comportamiento que ya
  tenía («no hay huecos»), pero ahora lo provoca la falta de contenido y no una
  posición vacía.
- Intactos: la tarjeta de jugador, la pestaña «Datos» con `about.highlights`, y
  todo lo de `tabs()`/`bindTabs()` (roles ARIA, foco, flechas ←/→ Inicio/Fin).

## 2. `build-classic.ts` — «Sobre mí» por temas

`<section id="about">` ya no hace `content.about.paragraphs.map(...)`: recorre
`TEMAS_ABOUT`, busca cada tema en `content.about.topics` por `id` y emite
`<h3>` + `<p>` por tema, en el mismo orden que las pestañas del juego.

**Importar `i18n.ts` desde Node es seguro**: he leído el módulo entero y **no
tiene nada de navegador en el nivel superior** —`localStorage` (`i18n.ts:11,22`),
`document` (`:20`) y `window` (`:26`) están solo dentro de `readSavedLang()`,
`setLang()` y `t()`/`loc()`, que este guion no llama; lo único de nivel superior
son `UI` y `TEMAS_ABOUT`, literales de datos. No he podido ejecutarlo, así que
esto es lectura, no medición: **si `npm run classic` reventara, el arreglo es no
importarlo y sacar los rótulos de `UI.tab_*` a mano** (los cinco textos están
aprobados y no cambiarían).

Como el rótulo es un dato y no el idioma activo, la clásica lo emite **en los dos
idiomas con `b()`**, igual que el resto de su plantilla.

Efecto colateral: `paridad-clasica.test.ts:153` (AC4) sigue verde porque los cinco
párrafos se imprimen igual que antes, ahora dentro de su `<h3>`. La clásica **sigue
sin imprimir `about.highlights`**: eso es de T7, no mío.

## 3. `validate-content.ts` — exporta la comprobación

`walk()` y `unique()` pasan los acumuladores como parámetros y toda la lógica vive
en `export function validar(c: Content, strict = false): { errors, warnings }`.
El CLI (`npm run validate -- --strict`) hace exactamente lo mismo que antes
(imprime `⚠`, imprime `✗`, `process.exit(1)`, o el `✓` de resumen), pero **solo
si el módulo se ejecuta como comando**: se comprueba con
`basename(process.argv[1]).startsWith('validate-content')`. Importado desde
vitest ya no imprime nada ni toca el proceso.

Dos guardas nuevas, las dos de T3:

1. **Cobertura**: por cada id de `TEMAS_ABOUT`, si no hay tema en
   `content.about.topics` con párrafo(s) con texto → error que **nombra el id**:
   `about.topics: el tema «intro» no tiene ningún párrafo`.
2. **Ids duplicados**: `unique('about.topics', …)` →
   `about.topics: ids duplicados intro`.

`parrafosDe()` lee los párrafos **por la forma**, no por el tipo, porque su
trabajo es justo el de mirar un contenido que ya no cumple `Content`.

## Los 11 rojos de `guardas-contenido.test.ts`: cuáles cierro

Los 11 fallaban por la **misma** razón: `buscarValidador()` lanzaba porque el
módulo no exportaba nada. Con el `validar()` exportado:

| Test | Estado que espero | Por qué |
|---|---|---|
| el contenido real pasa sus guardas | **verde** | `validar(content, true)` no encuentra nada (no hay `[[` en `content.ts`, ids únicos, los cinco temas con texto) |
| rechaza un tema de `about` sin texto | **verde** | lo pilla el `walk()` de siempre (`content.about.topics[0].text.es está vacío`) y además la cobertura |
| rechaza ids duplicados en los temas | **verde** | guarda (2) |
| el validador nombra el tema sin párrafo | **verde** | guarda (1), y el mensaje lleva el id |
| nivel de skill fuera de 1-10 (11) | **rojo → T10** | `walk` no mira números |
| nivel por debajo de 1 (0) | **rojo → T10** | ídem |
| grupo de skills vacío | **rojo → T10** | `walk` no sabe que una lista tiene que tener algo |
| proyecto sin título (`'   '`) | **rojo → T10** | `walk` solo busca `[[` en los strings |
| resumen > 200 caracteres | **rojo → T10** | regla de longitud, `--strict` |
| detalles > 600 caracteres | **rojo → T10** | ídem |
| párrafo > 700 sin punto final | **rojo → T10** | ídem |

O sea: **4 de 11** los cierra esta tarea (los tres de T3 + el de texto vacío, que
era collateral de `walk`); **7 se quedan para T10**, y ninguno requiere tocar lo
que he escrito: son guards que se añaden dentro de `validar()`/`walk()`.

**Aviso para T10**: `validar()` ya es el sitio donde caen, y `strict` ya se pasa
como segundo parámetro en los tres formatos que prueba el test (`(c, true)`,
`(c, {strict:true})`, `(c)`). Ojo con el primero: `strict` es `boolean`, y
`{strict:true}` llega como objeto (truthy) — funciona, pero las reglas de
longitud deben mirar `strict` sin dar por hecho nada más.

## Lo que falta medir (lo hace el orquestador)

1. `npx tsc --noEmit` — no he podido comprobarlo tras editar. Lo que sí he
   revisado a ojo: `TEMAS_ABOUT` se importa como valor en los dos sitios, el
   `import type` se fusionó con el import real (`import { TEMAS_ABOUT, type L10n }`),
   y en `panels.ts` ya no queda ni `ps` ni `groups` (leído después de editar).
2. `npx vitest run tests/guardas-contenido.test.ts` → espero 4 verdes y 7 rojos
   (tabla de arriba). Si sale verde de más, algo de mi tabla está mal y hay que
   mirarlo antes de seguir.
3. `npm run classic` (o `npm run build`) — **lo único que no puedo verificar de
   ninguna manera**: que `import { TEMAS_ABOUT } from '../src/i18n'` no rompa el
   guion en Node. Si falla, es el punto 2 de la nota del cambio 2.
4. `npm test` entero + `npm run build`, por el orden de siempre. Ojo: al
   regenerar la clásica, `paridad-clasica.test.ts` lee el HTML nuevo, así que un
   fallo de T3 en la clásica sale ahí.
5. El gate manual de T3 del plan (mover un párrafo de `about` al principio,
   build, y comprobar que los cinco títulos siguen cubriendo el mismo texto): con
   el atado por `id` tiene que salir bien por construcción, pero es lo que
   demuestra que la tarea está cerrada de verdad.
