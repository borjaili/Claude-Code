/* ============================================================
   PediCalc — Copy to clipboard + toast feedback
============================================================ */

const Clipboard = (() => {

  function ensureToast() {
    let t = document.getElementById('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      t.className = 'toast';
      document.body.appendChild(t);
    }
    return t;
  }

  function showToast(message, type = 'success') {
    const t = ensureToast();
    t.className = 'toast show ' + type;
    t.innerHTML = `<i class="fas ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>${message}`;
    clearTimeout(t._t);
    t._t = setTimeout(() => t.classList.remove('show'), 2400);
  }

  async function copy(text, msg) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback para http://localhost ou navegadores antigos
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      showToast(msg || 'Copiado!');
      return true;
    } catch (e) {
      showToast('Falha ao copiar', 'error');
      return false;
    }
  }

  /** Constrói texto a partir do conteúdo HTML interno de um acordeão. */
  function fromAccordion(accEl) {
    const nome  = accEl.querySelector('.acc-name')?.textContent.trim() || '';
    const inner = accEl.querySelector('.acc-inner');
    if (!inner) return nome;

    // Tenta extrair os principais elementos
    const doseN   = inner.querySelector('.dose-number, .basic-num, .static-big, .pc-n')?.textContent.trim();
    const doseU   = inner.querySelector('.dose-unit, .basic-unit, .pc-u')?.textContent.trim();
    const via     = inner.querySelector('.via-ribbon, .via-tag, .pc-pill')?.textContent.trim();
    const obs     = inner.querySelector('.obs-line')?.textContent.trim();
    const math    = inner.querySelector('.math-line')?.textContent.trim();

    let out = `📋 ${nome}\n`;
    if (doseN)  out += `▸ Dose: ${doseN} ${doseU || ''}\n`;
    if (via)    out += `▸ Via: ${via}\n`;
    if (obs)    out += `▸ ${obs}\n`;
    if (math)   out += `▸ ${math}\n`;
    out += `\nGerado por PediCalc · borjaili.github.io/Claude-Code/pedicalc/`;
    return out;
  }

  return { copy, showToast, fromAccordion };
})();
