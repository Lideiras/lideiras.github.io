import { t, tf } from '../i18n';

/*
 * COMENTARISTA DE TELEVISIÓN (lote B).
 *
 * El concurso de triples se juega en una pista que ya es un plató: hay cámara
 * de TV, cartel de EN DIRECTO y rótulo de canal. Lo que faltaba era la VOZ. Este
 * módulo es la voz: le llega lo que va pasando (un carro nuevo, la bola del
 * dinero, una canasta, la bocina…) y decide qué se cuenta y cuándo, en el idioma
 * que toque. El texto sale ya montado (`tf` rellena los huecos), así que quien lo
 * llame sólo tiene que pintarlo.
 *
 * Es el MISMO reparto que el resto del proyecto: las REGLAS viven fuera del
 * bucle, sin DOM ni tres.js, y se comprueban sin navegador; `main.ts` sólo
 * traduce lo que pasa a `Suceso` y pinta la frase en el HUD.
 *
 * Y hay una regla que no es de estilo sino de televisión: DOS COSAS NO SE DICEN
 * A LA VEZ. Un subtítulo que aparece y desaparece en medio segundo no se lee, y
 * uno que se queda mientras pasan cosas se pierde lo que importa. Por eso cada
 * frase trae su peso, y el peso decide quién pisa a quién (ver `comentar`).
 */

/** Lo que le puede pasar al concurso, en el idioma de la cabina. */
export type Suceso =
  | { tipo: 'arranque' }
  /** El jugador acaba de llegar al carro `carro` (1..`total`). */
  | { tipo: 'carro'; carro: number; total: number }
  /** Acaba de coger la «bola del dinero»: la última del carro, vale doble. */
  | { tipo: 'dinero' }
  /** Canasta. `suma` son los puntos del tiro, `dinero` si era la bola doble. */
  | { tipo: 'canasta'; suma: number; puntos: number; dinero: boolean; racha: number }
  | { tipo: 'fallo' }
  /** Se agotó el reloj: lo que ya iba por el aire todavía vale. */
  | { tipo: 'bocina' }
  /** Marcador final, con `record` si además mejora la mejor marca guardada. */
  | { tipo: 'final'; puntos: number; aciertos: number; tiros: number; record: boolean };

export interface Frase {
  /** Ya montada y traducida: lo único que hay que pintar. */
  texto: string;
  /** Cuánto se queda en pantalla, en milisegundos. */
  ms: number;
  /** Peso para ganarse el sitio. Ver `comentar`. */
  peso: number;
}

/**
 * PESOS: quién puede pisar a quién.
 *
 * `rutina` es lo que pasa diez veces por partida (canasta, fallo): si se pisa
 * entre sí, gana la última, que es justo lo que haría un comentarista de verdad
 * («¡dentro!»… «fuera»). Pero NO puede pisar una frase de más peso recién puesta,
 * porque ahí hay un dato que el jugador necesita: al carro siguiente hay que
 * correr, y a la bola del dinero, apuntar.
 *
 * La racha viva sube a `estructura` (una racha de tres ya es una noticia) y las
 * tres grandes —arranque, bocina, final— pisan todo.
 */
const RUTINA = 1;
const ESTRUCTURA = 2;
const GRANDE = 3;

/**
 * Lo que una frase aguanta en pantalla antes de dejar que otra la pise, aunque
 * la otra pese menos.
 *
 * Sin esto, una frase de peso alto se come todo lo que pasa mientras está puesta:
 * el arranque (3 s) se merendaba la primera canasta, que es la que estrena el
 * marcador. Pasado este mínimo ya se ha leído —los subtítulos de la tele también
 * ceden— así que la frase nueva entra aunque sea menor.
 */
export const CEDE_MS = 900;

/**
 * La frase de un suceso, con su peso y su duración.
 *
 * Duración: lo que se tarda en leerla en voz alta. La de la rutina es corta para
 * que la siguiente tenga sitio (con 15 balones, entre tiro y tiro no hay más de
 * tres segundos) y las grandes duran más porque son las que se quieren leer.
 */
export function fraseDe(s: Suceso): Frase {
  switch (s.tipo) {
    case 'arranque':
      return { texto: t('cmt_start'), ms: 3000, peso: GRANDE };
    case 'carro':
      return { texto: tf('cmt_rack', { n: s.carro, total: s.total }), ms: 2200, peso: ESTRUCTURA };
    case 'dinero':
      return { texto: t('cmt_money'), ms: 2200, peso: ESTRUCTURA };
    case 'canasta':
      /*
       * TRES FORMAS DE CANTAR UNA CANASTA, y por este orden: la bola del dinero
       * (lo más raro de la partida), la racha encendida (lo que da emoción) y el
       * tanto de siempre. Son excluyentes: si una canasta es de dinero Y además
       * sube la racha, manda el dinero, que se cuenta una vez por carro y no se
       * puede perder.
       */
      if (s.dinero) return { texto: tf('cmt_make_money', { puntos: s.puntos }), ms: 1900, peso: ESTRUCTURA };
      if (s.racha >= 3) return { texto: tf('cmt_make_streak', { racha: s.racha }), ms: 1700, peso: ESTRUCTURA };
      return { texto: tf('cmt_make', { suma: s.suma, puntos: s.puntos }), ms: 1400, peso: RUTINA };
    case 'fallo':
      return { texto: t('cmt_miss'), ms: 1300, peso: RUTINA };
    case 'bocina':
      return { texto: t('cmt_buzzer'), ms: 3000, peso: GRANDE };
    case 'final':
      return {
        texto: s.record
          ? tf('cmt_end_record', { puntos: s.puntos, aciertos: s.aciertos, tiros: s.tiros })
          : tf('cmt_end', { puntos: s.puntos, aciertos: s.aciertos, tiros: s.tiros }),
        ms: 5000,
        peso: GRANDE,
      };
  }
}

/**
 * Estado de la cabina: qué está dicho y hasta cuándo.
 *
 * `hasta` es cuándo se retira lo que hay puesto, `desde` cuándo entró (para el
 * mínimo de `CEDE_MS`) y `peso` lo que vale lo que está puesto ahora.
 */
export interface Comentarista {
  hasta: number;
  desde: number;
  peso: number;
}

export const nuevoComentarista = (): Comentarista => ({ hasta: -1, desde: -1, peso: 0 });

/**
 * Decide si un suceso se cuenta, y devuelve la frase (`null` si no se la gana).
 *
 * Tres reglas, en este orden:
 *
 *  1. Si lo que hay puesto YA se retiró, entra cualquier cosa.
 *  2. Si sigue puesto y la nueva PESA MENOS, sólo entra si la de ahora lleva
 *     puesta `CEDE_MS`: así nada se queda pegado tapando lo que venga después.
 *  3. En igualdad de peso entra la nueva: entre dos cosas de la misma categoría,
 *     lo que acaba de pasar es lo que interesa.
 *
 * `ahora` es un reloj monótono en milisegundos (`performance.now()` en el juego).
 * Se pasa como argumento, y no se lee aquí, para poder comprobar los plazos sin
 * esperar de verdad.
 */
export function comentar(c: Comentarista, s: Suceso, ahora: number): Frase | null {
  const f = fraseDe(s);
  const enPantalla = ahora < c.hasta;
  if (enPantalla && f.peso < c.peso && ahora - c.desde < CEDE_MS) return null;
  c.hasta = ahora + f.ms;
  c.desde = ahora;
  c.peso = f.peso;
  return f;
}
