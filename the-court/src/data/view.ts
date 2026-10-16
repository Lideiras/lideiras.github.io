import { content, type Project, type TimelineItem } from './content';
import type { Lang, L10n } from '../i18n';

/*
 * Capa de vista pura: el ORDEN, el AGRUPADO y el FORMATO de lo que se enseña.
 *
 * Existía porque hay dos superficies —el juego (`panels.ts`) y la clásica
 * (`build-classic.ts`)— que cuentan la misma persona desde el mismo
 * `content.ts`. Cada una tenía su copia de la tabla de meses y su manera de
 * formatear `2025-02`, y por eso una decía `2025-02` y la otra `feb 2025`
 * sobre el mismo dato. Dos copias de una decisión no divergen el mismo día:
 * divergen el primero que se edita una y no la otra.
 *
 * Aquí solo hay una fuente, y es pura a propósito:
 *
 *   · `build-classic.ts` la importa y corre en Node (es el paso 2 del build), así
 *     que este fichero no puede depender del navegador: ni del DOM, ni del
 *     almacenamiento, ni de `three`. Por eso el idioma entra POR PARÁMETRO y
 *     no se lee de aquí: quien lo sabe es la superficie, que ya lo tiene.
 *   · lo que entra son datos (`content.ts`), lo que sale son datos. Ni una
 *     cadena de HTML: el marcado es de cada superficie, porque una necesita
 *     pestañas accesibles y la otra una página plana.
 */

/*
 * Los nombres de mes, en los dos idiomas, aquí y en ningún otro sitio.
 *
 * En español van en minúscula y sin punto porque es como se abrevia un mes en
 * una línea de texto (`feb 2025`), y esa forma abreviada no admite mayúscula
 * inicial. En inglés, en cambio, `Feb 2025` es como lo escribe la fuente.
 */
export const MONTHS: Record<Lang, string[]> = {
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

/**
 * `2025-02` → `feb 2025`.
 *
 * Los hitos guardan el mes en ISO porque es lo que ordena bien (comparar
 * `'2025-02'` con `'2024-11'` da el orden correcto y comparar `feb` con `ene`
 * no), pero `2025-02 – Actualidad` se lee como un volcado de base de datos.
 *
 * Un valor sin mes (`2019`) se devuelve TAL CUAL: no consta en el dato y
 * inventárselo haría que las dos superficies dijeran cosas distintas sobre lo
 * mismo —y que ninguna pudiera corregir a la otra porque ambas tendrían razón.
 */
export function fmtDate(d: string, lang: Lang): string {
  const m = /^(\d{4})-(\d{2})$/.exec(d);
  if (!m) return d;
  const month = MONTHS[lang][Number(m[2]) - 1];
  return month ? `${month} ${m[1]}` : d;
}

/**
 * Los tipos de hito en el orden en que salen: trabajo, estudios, deporte.
 *
 * Es una lista de datos, no el orden en que aparecen en `content.ts`: el
 * agrupado tiene que ser el mismo aunque el dueño añada un estudio al final.
 */
export type TipoHito = TimelineItem['kind'];
export const TIPOS_HITO: readonly TipoHito[] = ['work', 'education', 'sport'];

export interface GrupoProyectos {
  year: number;
  items: Project[];
}
export interface VistaProyectos {
  /** Todos los proyectos, del año más reciente al más antiguo. */
  todos: Project[];
  porAnio: GrupoProyectos[];
}

/**
 * Proyectos ordenados y agrupados por año.
 *
 * El año manda sobre el título porque el año es lo que ordena el portfolio;
 * el título solo desempata dentro de un mismo año para que el orden sea
 * estable entre dos renders (y para que la clásica y el juego no saquen las
 * tarjetas en distinto orden sin que nada haya cambiado).
 */
export const vistaProyectos = (): VistaProyectos => {
  const todos = [...content.projects].sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
  const years = [...new Set(todos.map((p) => p.year))];
  return { todos, porAnio: years.map((year) => ({ year, items: todos.filter((p) => p.year === year) })) };
};

export interface GrupoHitos {
  kind: TipoHito;
  items: TimelineItem[];
}
export interface VistaHitos {
  /** Todos los hitos, del más reciente al más antiguo. */
  todos: TimelineItem[];
  porTipo: GrupoHitos[];
}

/**
 * Hitos ordenados de más reciente a más antiguo y agrupados por tipo.
 *
 * Se ordena por el COMIENZO y no por el fin: un trabajo empezado en 2023 que
 * sigue abierto es el primero de la lista, que es lo que espera quien lee. Los
 * grupos vacíos no se devuelven (una pestaña sin nada dentro es ruido) y el
 * orden de los grupos es fijo —trabajo, estudios, deporte— para que las dos
 * superficies enseñen los mismos bloques en el mismo orden.
 */
export const vistaHitos = (): VistaHitos => {
  const todos = [...content.timeline].sort((a, b) => (a.start < b.start ? 1 : a.start > b.start ? -1 : 0));
  return {
    todos,
    porTipo: TIPOS_HITO.map((kind) => ({ kind, items: todos.filter((x) => x.kind === kind) })).filter((g) => g.items.length > 0),
  };
};

export interface Persona {
  name: string;
  initials: string;
  jerseyNumber: string;
  role: L10n;
  location: string;
  /** Opcional por decisión del propietario: no quiere tagline. */
  tagline?: L10n;
}

/**
 * Quién es la persona, en una sola parte.
 *
 * Nombre, puesto y ubicación son los tres datos que las dos superficies repiten
 * (el título, la cabecera, la ficha de jugador). Se agrupan aquí para que una
 * tarjeta no pueda llamarse de una forma y la cabecera de otra. El correo y
 * los enlaces NO entran: eso es contacto, y se decide en la sección de
 * contacto, no en la identidad.
 */
export const persona = (): Persona => {
  const p = content.person;
  return { name: p.name, initials: p.initials, jerseyNumber: p.jerseyNumber, role: p.role, location: p.location, tagline: p.tagline };
};

/**
 * Edad a partir de una fecha de nacimiento (YYYY-MM-DD).
 *
 * Es un dato decorativo del jugador, no del reloj de la partida: se calcula
 * con la fecha actual y no con `time`, porque `time` se congela con
 * `prefers-reduced-motion` y una edad que se queda parada da igual que una
 * mentira. Se devuelve un número para que cada superficie lo formatee a su
 * gusto (`25`, `25 años`, `Age 25`…).
 */
export const edad = (nacimiento: string): number => {
  const hoy = new Date();
  const nac = new Date(nacimiento);
  let años = hoy.getFullYear() - nac.getFullYear();
  const mes = hoy.getMonth() - nac.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) años--;
  return años;
};