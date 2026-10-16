// Repara el bloque `about` de content.ts por NUMERO de LINEA, sin reescribir
// las lineas largas de prosa (los acentos hacen fallar el replace textual).
// 1-based: se conservan 1..165, se sustituyen 166..173, se conserva 174..fin.
import { readFileSync, writeFileSync } from 'node:fs';

const ruta = new URL('../the-court/src/data/content.ts', import.meta.url);
const original = readFileSync(ruta, 'utf8');
// El repo usa CRLF: se parte por el final de linea real y se devuelve el mismo,
// o el arreglo se vera como un cambio de las 500 lineas del fichero.
const EOL = original.includes('\r\n') ? '\r\n' : '\n';
const l = original.split(EOL);

const CABEZA = '  about: {';
const COLA = '    highlights: [';
if (l[164] !== CABEZA) throw new Error(`linea 165 no es "${CABEZA}": ${JSON.stringify(l[164])}`);
if (l[166] !== '    topics: ABOUT_TOPICS,') throw new Error(`linea 167 no es topics: ${JSON.stringify(l[166])}`);
if (!l[167].includes('BORRAR')) throw new Error(`la 168 deberia ser el bloque residual: ${JSON.stringify(l[167])}`);
if (l[173] !== COLA) throw new Error(`linea 174 no es "${COLA}": ${JSON.stringify(l[173])}`);

const salida = [
  ...l.slice(0, 165),
  '    topics: ABOUT_TOPICS,',
  '    paragraphs: ABOUT_TOPICS.flatMap((t) => t.text),',
  ...l.slice(173),
];
writeFileSync(ruta, salida.join(EOL), 'utf8');
console.log(`OK (EOL=${JSON.stringify(EOL)}): ${l.length} lineas -> ${salida.length}`);