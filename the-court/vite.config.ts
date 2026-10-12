import { defineConfig, type Plugin } from 'vite';

/**
 * `/classic/` es una página estática de verdad que vive en `public/classic/`,
 * pero Vite la deja atrás: su middleware de SPA responde a cualquier ruta que
 * no sea un archivo existente, y `/classic/` (con barra final) se sirve con el
 * `index.html` del juego.
 *
 * El enlace «Versión clásica» apunta justo ahí, así que en desarrollo al pulsarlo
 * se recarga el juego y no parece que haga nada. En producción un servidor
 * estático resuelve `/classic/` a `classic/index.html` por su cuenta y sí
 * funciona, que es justo lo que hace la diferencia: en local no se parece a lo
 * que se despliega.
 *
 * Se arregla solo en desarrollo (`dev` y `preview`) reescribiendo la ruta ANTES
 * de que llegue al fallback. `configureServer` sin valor de retorno inserta el
 * middleware antes que los internos, que es justo lo que hace falta aquí.
 */
function classicIndexFallback(): Plugin {
  const rewrite = (req: { url?: string }, _res: unknown, next: () => void): void => {
    const path = req.url?.split('?')[0];
    if (path === '/classic' || path === '/classic/') req.url = '/classic/index.html';
    next();
  };
  return {
    name: 'court:classic-index-fallback',
    configureServer(server) {
      server.middlewares.use(rewrite);
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite);
    },
  };
}

export default defineConfig({
  plugins: [classicIndexFallback()],
  build: { target: 'es2022', chunkSizeWarningLimit: 900 },
  server: { host: true },
});
