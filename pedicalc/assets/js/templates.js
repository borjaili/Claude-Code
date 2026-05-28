/* ============================================================
   PediCalc — Render Templates
   ------------------------------------------------------------
   Renderiza o HTML interno de cada acordeão de medicação.

     renderBasic(peso, idadeMeses, cfg)
         → Tipo "B": cálculo direto (peso × coef) com teto opcional.

     renderAdjustable(peso, idadeMeses, cfg)
         → Tipo "A": slider de mg/kg + concentração editável + obs.

     renderStatic(cfg)
         → Tipo "E": texto fixo (sem cálculo numérico).
============================================================ */

/* ---------- Tipo B: Básico ---------- */
function renderBasic(peso, idadeMeses, cfg) {
  const { calc, max, unit, via, obs, contraIndicacaoMeses: ci, max_label: ml } = cfg;

  const aviso = (ci && idadeMeses !== null && idadeMeses < ci)
    ? `<div class="ban-err"><i class="fas fa-ban"></i>Contraindicado nesta faixa etária.</div>`
    : '';

  let valor = calc;
  const atingiuTeto = max && calc > max;
  if (atingiuTeto) valor = max;

  const valorFmt = typeof valor === 'number'
    ? valor.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    : valor;

  const badge = atingiuTeto
    ? `<span class="teto-badge on"><i class="fas fa-shield-alt"></i>${ml || 'Teto Máximo'}</span>`
    : '';

  return `
    <div style="display:flex;align-items:baseline;flex-wrap:wrap;gap:10px;margin-bottom:10px">
      <span class="basic-num">${valorFmt}<span class="basic-unit">${unit}</span></span>${badge}
    </div>
    <div class="via-tag">${via}</div>
    <div class="obs-line" style="margin-top:10px"><i class="fas fa-info-circle"></i>${obs}</div>
    ${aviso}`;
}

/* ---------- Tipo A: Ajustável ---------- */
function renderAdjustable(peso, idadeMeses, cfg) {
  const {
    id,
    base_mg_kg: baseMgKg,
    max_mg: maxMg,
    def_conc_mg: defConcMg,
    def_conc_ml: defConcMl,
    is_gotas: isGotas,
    via, obs,
    slider,
    contraIndicacaoMeses: ci
  } = cfg;

  // Concentrações salvas pelo usuário (localStorage)
  const salvas = JSON.parse(localStorage.getItem('cp') || '{}');
  const concMg = salvas[id]?.mg || defConcMg;
  const concMl = salvas[id]?.ml || defConcMl;
  const doseMgKg = slider ? slider.default : baseMgKg;

  const aviso = (ci && idadeMeses !== null && idadeMeses < ci)
    ? `<div class="ban-err"><i class="fas fa-ban"></i>Contraindicado nesta faixa etária.</div>`
    : '';

  const blocoSlider = slider
    ? `<div class="sl-wrap">
        <div class="sl-top">
          <span class="sl-lbl"><i class="fas fa-sliders-h" style="margin-right:4px"></i>Ajuste de Dose</span>
          <span class="sl-val"><span class="sdsp">${doseMgKg}</span> mg/kg</span>
        </div>
        <input type="range" class="dsl" min="${slider.min}" max="${slider.max}" step="${slider.step}" value="${doseMgKg}">
      </div>`
    : `<div class="fixed-dose">
        <span class="fd-l"><i class="fas fa-thumbtack" style="margin-right:4px"></i>Dose Fixa</span>
        <span class="fd-v">${doseMgKg} mg/kg</span>
        <input type="hidden" class="dsl" value="${doseMgKg}">
      </div>`;

  return `
    <div class="aw" data-id="${id}" data-peso="${peso}" data-max="${maxMg || ''}" data-g="${isGotas}">
      <div class="dose-hero">
        <span class="dose-number rv">…</span>
        <span class="dose-unit">${isGotas ? 'gotas' : 'ml'}</span>
        <span class="teto-badge"><i class="fas fa-shield-alt"></i>Teto Máximo</span>
      </div>
      <div class="via-ribbon"><i class="fas fa-route" style="margin-right:4px"></i>${via}</div>
      ${blocoSlider}
      <div class="conc-panel">
        <div class="conc-row">
          <i class="fas fa-vial" style="color:#d97706;font-size:15px"></i>
          <span class="conc-tag">Conc.:</span>
          <input type="number" class="ci cmg" value="${concMg}">
          <span class="csep" style="font-size:16px;color:#fcd34d">mg /</span>
          <input type="number" class="ci cml" value="${concMl}">
          <span style="font-size:12.5px;font-weight:800;color:#92400e">ml</span>
        </div>
        <button class="btn-sv"><i class="fas fa-bookmark"></i>Padrão</button>
      </div>
      <div class="obs-line"><i class="fas fa-info-circle"></i>${obs}</div>
      <div class="math-line mdsp"></div>
      ${aviso}
    </div>`;
}

/* ---------- Tipo E: Estático ---------- */
function renderStatic(cfg) {
  const obs = cfg.obs
    ? (cfg.isWarning
        ? `<div class="ban-err" style="margin-top:10px"><i class="fas fa-exclamation-triangle"></i>${cfg.obs}</div>`
        : `<div class="obs-line" style="margin-top:10px"><i class="fas fa-info-circle"></i>${cfg.obs}</div>`)
    : '';

  return `
    <div class="static-big">${cfg.titulo}</div>
    <div class="via-tag">${cfg.via}</div>
    ${obs}`;
}
