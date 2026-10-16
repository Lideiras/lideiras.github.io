const fs = require('fs');
let s = fs.readFileSync('src/data/content.ts', 'utf8');
let n = 0;
s = s.replace(/(        \{ name: )([^\{].*?), level: (\d+) \},/g, (m, pre, nombre, nivel) => {
  if (nombre.includes('{ es:')) return m;
  n++;
  return pre + '{ name: { es: ' + JSON.stringify(nombre.trim()) + ', en: ' + JSON.stringify(nombre.trim()) + ' }, level: ' + nivel + ' },';
});
fs.writeFileSync('src/data/content.ts', s, 'utf8');
console.log('envueltos:', n);
