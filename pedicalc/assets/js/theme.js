/* ============================================================
   PediCalc — Theme manager
   ------------------------------------------------------------
   Suporta 3 modos: light / dark / auto (segue OS).
   Aplica via atributo data-theme em <html>.
============================================================ */

const Theme = (() => {
  const KEY = 'pedicalc_theme';
  const root = document.documentElement;

  // Aplica IMEDIATAMENTE (antes do DOMContentLoaded) para evitar flash.
  function apply(mode) {
    let resolved = mode;
    if (mode === 'auto') {
      resolved = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    root.setAttribute('data-theme', resolved);
    root.setAttribute('data-theme-mode', mode);
  }

  function get()   { return localStorage.getItem(KEY) || 'auto'; }
  function set(m)  { localStorage.setItem(KEY, m); apply(m); }
  function cycle() {
    const order = ['light', 'dark', 'auto'];
    const cur = get();
    set(order[(order.indexOf(cur) + 1) % order.length]);
    return get();
  }
  function label(mode) {
    return ({ light: 'Claro', dark: 'Escuro', auto: 'Automático' })[mode] || 'Claro';
  }
  function icon(mode) {
    return ({ light: 'fas fa-sun', dark: 'fas fa-moon', auto: 'fas fa-circle-half-stroke' })[mode] || 'fas fa-sun';
  }

  // Inicialização imediata
  apply(get());

  // Reage a mudanças do OS quando em modo auto
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (get() === 'auto') apply('auto');
  });

  return { get, set, cycle, label, icon };
})();
