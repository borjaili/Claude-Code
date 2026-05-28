/* ============================================================
   PediCalc — PWA registration + install prompt
============================================================ */

const PWA = (() => {
  let deferredPrompt = null;

  function init() {
    // Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
          .catch(err => console.warn('SW registration failed:', err));
      });
    }

    // Captura o evento beforeinstallprompt para acionar manualmente
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      deferredPrompt = e;
      const btn = document.getElementById('btn-install');
      if (btn) btn.hidden = false;
    });

    window.addEventListener('appinstalled', () => {
      const btn = document.getElementById('btn-install');
      if (btn) btn.hidden = true;
      deferredPrompt = null;
    });
  }

  async function promptInstall() {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    const btn = document.getElementById('btn-install');
    if (btn && outcome === 'accepted') btn.hidden = true;
    return outcome === 'accepted';
  }

  return { init, promptInstall };
})();
