// main.js — boot the site: start the hash router once the page is ready.
import { startRouter } from './router.js';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startRouter);
} else {
  startRouter();
}
