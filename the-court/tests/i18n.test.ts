import { describe, expect, it } from 'vitest';
import { UI, t, tf } from '../src/i18n';

/** Los nombres de hueco que lleva una frase, ordenados. */
const huecos = (s: string): string[] => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]!).sort();

/*
 * Los textos con cifras dentro se escriben una vez por idioma, y lo que se puede
 * romper sin que salte nada es que a uno de los dos le falte un hueco: la frase
 * sale entera menos el número, o con un `{pct}` a la vista. El tipo `L10n` obliga
 * a que estén los dos idiomas, pero no dice nada de los huecos: eso lo comprueba
 * esto.
 */
describe('i18n: los huecos de las frases', () => {
  it('los dos idiomas usan los mismos huecos en cada clave', () => {
    const malos: string[] = [];
    for (const [clave, v] of Object.entries(UI)) {
      const es = huecos(v.es);
      const en = huecos(v.en);
      if (es.join(',') !== en.join(',')) malos.push(`${clave}: es{${es.join(',')}} ≠ en{${en.join(',')}}`);
    }
    expect(malos).toEqual([]);
  });

  it('las frases con cifras del entrevistador tienen los huecos que espera el código', () => {
    expect(huecos(UI.dlg_data_shots.es)).toEqual(['attempted', 'made', 'pct']);
    expect(huecos(UI.dlg_data_contest.es)).toEqual(['best']);
    /*
     * Y las del comentarista, que es donde más fácil se rompe: son frases cortas
     * de subtítulo y el que las compone es `commentary.ts`, que rellena EXACTAMENTE
     * estos huecos. Un hueco que no se llene se queda a la vista en pantalla
     * («Carro {n} de 5») y uno que sobre, en cambio, se ignora en silencio.
     */
    expect(huecos(UI.cmt_rack.es)).toEqual(['n', 'total']);
    expect(huecos(UI.cmt_make.es)).toEqual(['puntos', 'suma']);
    expect(huecos(UI.cmt_make_money.es)).toEqual(['puntos']);
    expect(huecos(UI.cmt_make_streak.es)).toEqual(['racha']);
    expect(huecos(UI.cmt_end.es)).toEqual(['aciertos', 'puntos', 'tiros']);
    expect(huecos(UI.cmt_end_record.es)).toEqual(['aciertos', 'puntos', 'tiros']);
    // Las que no llevan cifras no pueden llevar huecos: si se cuela uno, sale la
    // llave escrita en el subtítulo.
    expect(huecos(UI.cmt_start.es)).toEqual([]);
    expect(huecos(UI.cmt_money.es)).toEqual([]);
    expect(huecos(UI.cmt_miss.es)).toEqual([]);
    expect(huecos(UI.cmt_buzzer.es)).toEqual([]);
    // Y las dos variantes sin cifras no llevan ninguno: son las del recién llegado.
    expect(huecos(UI.dlg_data_shots_none.es)).toEqual([]);
    expect(huecos(UI.dlg_data_contest_none.es)).toEqual([]);
  });
});

describe('i18n: tf rellena los huecos', () => {
  it('sustituye lo que se le pasa', () => {
    expect(tf('dlg_data_shots', { made: 7, attempted: 12, pct: 58 })).toBe(
      t('dlg_data_shots').replace('{made}', '7').replace('{attempted}', '12').replace('{pct}', '58'),
    );
    expect(tf('dlg_data_contest', { best: 9 })).toContain('9');
  });

  it('deja el hueco tal cual si no hay valor (se ve, no se pierde)', () => {
    const sinPct = tf('dlg_data_shots', { made: 7, attempted: 12 });
    expect(sinPct).toContain('{pct}');
    expect(sinPct).toContain('12');
  });

  it('no toca las frases sin huecos', () => {
    expect(tf('dlg_data_shots_none', { made: 3 })).toBe(t('dlg_data_shots_none'));
  });
});
