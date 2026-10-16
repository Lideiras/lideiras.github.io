import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/*
 * Cubre T2 («capa de vista pura `src/data/view.ts`») y el AC4.
 *
 * La fuente única no se rompe por tener dos sitios con los mismos datos: se
 * rompe cuando el ORDEN y el FORMATO se decide en cada superficie. Hoy el juego
 * (`panels.ts`) tiene su tabla de meses y su `fmtDate`, y la clásica
 * (`build-classic.ts`) no tiene ninguna: por eso uno dice `2025-02` y el otro
 * `feb 2025`. Estos tests miran el TEXTO de los ficheros, no su comportamiento,
 * porque la forma de la vista todavía no está decidida: lo que se fija aquí es
 * la restricción (una sola tabla de meses, las dos superficies la consumen) y
 * que la vista se pueda importar sin DOM —vitest corre en `node`, sin jsdom—.
 */

const ruta = (p: string): string => fileURLToPath(new URL(p, import.meta.url));
const VISTA = ruta('../src/data/view.ts');
const PANELS = ruta('../src/ui/panels.ts');
const CLASICA = ruta('../scripts/build-classic.ts');

const leer = (p: string): string => readFileSync(p, 'utf8');

const faltaVista = 'Falta src/data/view.ts. Es lo primero que hace la T2.';

describe('T2 · la capa de vista existe y es pura', () => {
  it('existe src/data/view.ts', () => {
    expect(existsSync(VISTA), faltaVista).toBe(true);
  });

  it('la vista no toca el navegador', () => {
    expect(existsSync(VISTA), faltaVista).toBe(true);
    const codigo = leer(VISTA);
    /*
     * La vista la consume `build-classic.ts`, que corre en Node. Si `view.ts`
     * pidiera `window`, el generador de la clásica reventaría con un
     * `document is not defined` en pleno `npm run build`.
     */
    const tocados: string[] = [];
    for (const prohibido of ['document', 'window', 'localStorage', 'getLang', 'navigator']) {
      if (new RegExp(`\\b${prohibido}\\b`).test(codigo)) tocados.push(prohibido);
    }
    expect(tocados, `src/data/view.ts usa ${tocados.join(', ')}: tiene que ser pura para que la compile build-classic.ts`).toEqual([]);
  });

  it('la vista se importa en Node sin reventar', async () => {
    expect(existsSync(VISTA), faltaVista).toBe(true);
    /*
     * El especificador va en una variable a propósito: si T2 existiera, el
     * import se resolvería igual, pero mientras tanto el fallo sale como
     * "falta src/data/view.ts" y no como un error de módulo que no dice nada
     * de la tarea que falta.
     */
    const spec = '../src/data/view';
    const mod = (await import(/* @vite-ignore */ spec)) as Record<string, unknown>;
    expect(Object.keys(mod).length, 'src/data/view.ts no exporta nada: nadie podría consumirla').toBeGreaterThan(0);
  });
});

describe('T2 · el formato de las fechas tiene una sola fuente', () => {
  it('los nombres de mes viven en la vista', () => {
    expect(existsSync(VISTA), faltaVista).toBe(true);
    const vista = leer(VISTA);
    expect(/['"]ene['"]/.test(vista), 'la vista no trae la tabla de meses en español').toBe(true);
    expect(/['"]Feb['"]/.test(vista), 'la vista no trae la tabla de meses en inglés').toBe(true);
  });

  it('ni el juego ni la clásica guardan su propia tabla de meses', () => {
    /*
     * Una tabla de meses por superficie es exactamente el tipo de copia que
     * después diverge sin que nada lo note. El dato concreto que se busca es
     * «ene»: hoy está en `panels.ts` y en ninguna otra parte.
     */
    const conMeses = [PANELS, CLASICA].filter((f) => /['"]ene['"]/.test(leer(f)));
    expect(conMeses, 'estas superficies tienen su propia tabla de meses (busca «ene»): el formato debe salir de la vista').toEqual([]);
  });

  it('las dos superficies consumen la misma capa', () => {
    for (const [nombre, fichero] of [['panels.ts', PANELS], ['build-classic.ts', CLASICA]] as const) {
      expect(leer(fichero), `${nombre} no importa la capa de vista: cada superficie seguiría decidiendo su propio orden y formato`).toMatch(
        /data\/view/,
      );
    }
  });
});

describe('T2 · la vista formatea las fechas como el juego', () => {
  it('alguna función exportada convierte `2025-02` en `feb 2025`', async () => {
    expect(existsSync(VISTA), faltaVista).toBe(true);
    const spec = '../src/data/view';
    const mod = (await import(/* @vite-ignore */ spec)) as Record<string, unknown>;

    /*
     * El nombre de la función no lo fija ningún contrato, así que en vez de
     * adivinarlo se PRUEBAN las funciones exportadas con los dos órdenes de
     * argumentos y se mira cuál devuelve la fecha ya formateada. Si ninguna,
     * significa que la lógica de formato no ha salido de `panels.ts`.
     */
    const candidatas = Object.values(mod).filter((v): v is (...a: unknown[]) => unknown => typeof v === 'function');
    const formatos: string[] = [];
    for (const fn of candidatas) {
      for (const args of [['2025-02', 'es'], ['es', '2025-02']] as unknown[][]) {
        try {
          const salida = fn(...args);
          if (salida === 'feb 2025') formatos.push('2025-02→feb 2025');
        } catch {
          /* no es el formateador; se sigue probando */
        }
      }
    }
    expect(formatos, 'ninguna función exportada por la vista formatea `2025-02` como `feb 2025`').not.toEqual([]);
  });

  it('un año sin mes se deja tal cual (no se le inventa un mes)', async () => {
    expect(existsSync(VISTA), faltaVista).toBe(true);
    const spec = '../src/data/view';
    const mod = (await import(/* @vite-ignore */ spec)) as Record<string, unknown>;
    const candidatas = Object.values(mod).filter((v): v is (...a: unknown[]) => unknown => typeof v === 'function');
    /*
     * `2019` es un año pelado en `content.ts` y se imprime tal cual. Si la vista
     * lo rellenara con un mes inventado, la clásica y el juego dirían dos cosas
     * distintas sobre el mismo dato.
     */
    const salidas = new Set<string>();
    for (const fn of candidatas) {
      for (const args of [['2019', 'es'], ['es', '2019']] as unknown[][]) {
        try {
          const salida = fn(...args);
          if (typeof salida === 'string') salidas.add(salida);
        } catch {
          /* no es el formateador */
        }
      }
    }
    if (salidas.size === 0) {
      // Sin formateador no hay nada que comprobar: lo dice el otro test.
      return;
    }
    expect(salidas, 'la vista no debe inventarle un mes a un año que solo tiene año').toContain('2019');
  });
});