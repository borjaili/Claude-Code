/* ============================================================
   PediCalc — Helpers utilitários
   ------------------------------------------------------------
   - Modal open/close
   - Mapeamento de ícones por nome do medicamento
   - Cores por categoria
   - Atualização do slider (gradiente proporcional)
   - Recálculo de doses "ajustáveis" (data-aw)
============================================================ */

/* ---------- Modal ---------- */
function openModal(id) {
  document.getElementById(id).classList.add('on');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('on');
}

// Fechar modal ao clicar fora do conteúdo
document.addEventListener('click', e => {
  if (e.target.classList.contains('mover')) {
    closeModal(e.target.id);
  }
});

// Botões com data-open-modal / data-close-modal
document.addEventListener('click', e => {
  const openBtn = e.target.closest('[data-open-modal]');
  if (openBtn) openModal(openBtn.dataset.openModal);
  const closeBtn = e.target.closest('[data-close-modal]');
  if (closeBtn) closeModal(closeBtn.dataset.closeModal);
});

/* ---------- Ícones por forma farmacêutica ---------- */
const DRUG_ICONS = {
  inj:   ['fas fa-syringe',                  '#e11d48', '#fff1f2'],
  gotas: ['fas fa-eye-dropper',              '#0284c7', '#f0f9ff'],
  susp:  ['fas fa-prescription-bottle-alt',  '#d97706', '#fffbeb'],
  pills: ['fas fa-pills',                    '#7c3aed', '#faf5ff'],
  eye:   ['fas fa-eye',                      '#0d9488', '#f0fdfa'],
  cream: ['fas fa-hand-holding-medical',     '#ea580c', '#fff7ed'],
  venus: ['fas fa-venus',                    '#db2777', '#fdf2f8'],
  flask: ['fas fa-flask',                    '#4f46e5', '#eef2ff'],
  drop:  ['fas fa-droplet',                  '#0891b2', '#ecfeff'],
  rx:    ['fas fa-prescription',             '#8a94ad', '#f5f7ff'],
  fluid: ['fas fa-tint',                     '#1d53f0', '#eff6ff']
};

function getDrugIcon(nome) {
  const n = nome.toLowerCase();
  if (n.includes('inj') || n.includes('ampola'))                                    return DRUG_ICONS.inj;
  if (n.includes('gota'))                                                            return DRUG_ICONS.gotas;
  if (n.includes('susp') || n.includes('xarope') || n.includes('sol. oral') || n.includes('alta dose')) return DRUG_ICONS.susp;
  if (n.includes('cáps') || n.includes('comp'))                                      return DRUG_ICONS.pills;
  if (n.includes('oftál') || n.includes('colí'))                                     return DRUG_ICONS.eye;
  if (n.includes('creme') || n.includes('prata'))                                    return DRUG_ICONS.cream;
  if (n.includes('vaginal') || n.includes('gel'))                                    return DRUG_ICONS.venus;
  if (n.includes('pó'))                                                              return DRUG_ICONS.flask;
  if (n.includes('expansão') || n.includes('desidrat') || n.includes('tro') || n.includes('holliday')) return DRUG_ICONS.fluid;
  return DRUG_ICONS.rx;
}

/* ---------- Cores por categoria ---------- */
const CATEGORY_COLORS = {
  hidra_choque:'#dc2626', hidra_planoc:'#d97706', hidra_manut:'#1d53f0', hidra_tro:'#059669',
  anti_oma:'#1d53f0',     anti_faring:'#0d9488',  anti_pac:'#0284c7',    anti_pele:'#ea580c',
  anti_itu:'#d97706',     anti_gastro:'#16a34a',  anti_fungos:'#7c3aed',
  analgesicos:'#dc2626',  antiemeticos:'#0891b2', antialergicos:'#7c3aed',
  laxantes:'#16a34a',     corticosteroides:'#b45309', sedativos:'#3730a3',
  antidotos:'#be123c',    oftalmologicos:'#0d9488',   queimaduras:'#ea580c',
  ginecologicos:'#db2777', custom:'#7c3aed'
};

function getCategoryColor(cat) {
  return CATEGORY_COLORS[cat.tc || cat.id] || CATEGORY_COLORS[cat.id] || '#1d53f0';
}

/* ---------- Slider: atualiza preenchimento proporcional ---------- */
function updateSliderFill(el) {
  const min  = parseFloat(el.min);
  const max  = parseFloat(el.max);
  const val  = parseFloat(el.value);
  const pct  = ((val - min) / (max - min) * 100).toFixed(1);
  el.style.background = `linear-gradient(to right, #1d53f0 ${pct}%, #dce8ff ${pct}%)`;
}

/* ---------- Recalcula uma medicação "ajustável" ---------- */
function recalcAdjustable(wrapper) {
  const peso     = parseFloat(wrapper.dataset.peso);
  const tetoMg   = parseFloat(wrapper.dataset.max) || Infinity;
  const ehGotas  = wrapper.dataset.g === 'true';

  const mgKg     = parseFloat(wrapper.querySelector('.dsl').value);
  const concMg   = parseFloat(wrapper.querySelector('.cmg').value) || 1;
  const concMl   = parseFloat(wrapper.querySelector('.cml').value) || 1;

  // Atualiza visual do slider/etiqueta
  const sliderLabel = wrapper.querySelector('.sdsp');
  if (sliderLabel) sliderLabel.textContent = mgKg;
  const range = wrapper.querySelector('input[type=range]');
  if (range) updateSliderFill(range);

  // Aplica teto
  let doseMg = peso * mgKg;
  const atingiuTeto = doseMg > tetoMg;
  if (atingiuTeto) doseMg = tetoMg;

  // Calcula volume final
  const volume = (doseMg * concMl) / concMg;
  const valorFinal = ehGotas
    ? Math.round(volume * 20).toString()
    : volume.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

  wrapper.querySelector('.rv').textContent = valorFinal;

  const badge = wrapper.querySelector('.teto-badge');
  if (badge) badge.classList.toggle('on', atingiuTeto);

  wrapper.querySelector('.mdsp').textContent =
    `Cálculo: (${peso}kg × ${mgKg} mg/kg) = ${doseMg.toFixed(1)} mg`;
}
