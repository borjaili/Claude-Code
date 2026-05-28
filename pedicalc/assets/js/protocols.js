/* ============================================================
   PediCalc — Specialized Protocols
   ------------------------------------------------------------
   Cada função recebe (peso, idadeMeses) e devolve HTML completo
   do corpo do acordeão. Usado para itens do tipo "P" no DB.
============================================================ */

const PROTOCOLS = {

  /* ---------- Expansão volêmica (choque) ---------- */
  expansao(peso) {
    const total = peso * 20;
    const volume = Math.min(total, 1000);
    const atingiuTeto = total > 1000;
    const volReduzido = Math.min(peso * 10, 500).toFixed(0);

    return `
      <div class="pc pc-red">
        <div class="pc-row">
          <div style="display:flex;align-items:baseline;gap:8px">
            <span class="pc-n">${volume.toFixed(0)}</span><span class="pc-u">ml</span>
            ${atingiuTeto ? `<span class="teto-badge on" style="font-size:10px"><i class="fas fa-shield-alt"></i>Teto 1L</span>` : ''}
          </div>
          <span class="pc-pill pp-red">SF 0,9% ou Ringer</span>
        </div>
        <div class="pc-div"></div>
        <div class="pc-info">
          <i class="fas fa-tachometer-alt"></i>Correr rápido — Fase de ataque: <strong>10 a 20 minutos</strong>
        </div>
        <div class="ban-warn" style="margin-top:10px">
          <i class="fas fa-exclamation-circle" style="margin-right:6px"></i>
          <strong>Atenção:</strong> Cardiopatas/nefropatas/neonatos → considerar 10 ml/kg (${volReduzido} ml). Repetir até 3×.
        </div>
      </div>`;
  },

  /* ---------- Desidratação grave (Plano C) ---------- */
  desgrave(peso, idadeMeses) {
    const ehLactente = idadeMeses !== null && idadeMeses < 12;
    const idadeDesconhecida = idadeMeses === null || idadeMeses === '';

    let tempo1 = ehLactente ? 'em 1 HORA' : 'em 30 MIN';
    let tempo2 = ehLactente ? 'em 5 HORAS' : 'em 2,5 HORAS';
    if (idadeDesconhecida) { tempo1 = 'em 30 MIN'; tempo2 = 'em 2,5 HORAS'; }

    const vol1 = Math.min(peso * 30, 1000);
    const vol2 = Math.min(peso * 70, 2500);
    const badge1 = peso * 30 > 1000 ? `<span class="teto-badge on" style="font-size:10px"><i class="fas fa-shield-alt"></i>Máx 1L</span>` : '';
    const badge2 = peso * 70 > 2500 ? `<span class="teto-badge on" style="font-size:10px"><i class="fas fa-shield-alt"></i>Máx 2,5L</span>` : '';

    return `
      <div class="pc pc-amb">
        <div style="display:grid;gap:9px;margin-bottom:12px">
          <div style="background:rgba(255,255,255,.6);border-radius:10px;padding:11px 13px">
            <div style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;opacity:.6;margin-bottom:6px">1ª Fase — 30 ml/kg</div>
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
              <div style="display:flex;align-items:baseline;gap:6px">
                <span class="pc-n" style="font-size:2rem">${vol1.toFixed(0)}</span><span class="pc-u">ml</span>${badge1}
              </div>
              <span class="pc-pill pp-amb"><i class="fas fa-clock" style="margin-right:4px"></i>${tempo1}</span>
            </div>
          </div>
          <div style="background:rgba(255,255,255,.6);border-radius:10px;padding:11px 13px">
            <div style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;opacity:.6;margin-bottom:6px">2ª Fase — 70 ml/kg</div>
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
              <div style="display:flex;align-items:baseline;gap:6px">
                <span class="pc-n" style="font-size:2rem">${vol2.toFixed(0)}</span><span class="pc-u">ml</span>${badge2}
              </div>
              <span class="pc-pill pp-amb"><i class="fas fa-clock" style="margin-right:4px"></i>${tempo2}</span>
            </div>
          </div>
        </div>
        ${idadeDesconhecida ? `<div class="ban-warn">Idade não informada. Exibido para <strong>maiores de 1 ano</strong>.</div>` : ''}
        <div class="pc-info" style="padding-top:10px;border-top:1px solid rgba(0,0,0,.07)">
          <i class="fas fa-info-circle"></i>Utilizar SF 0,9% ou Ringer. Total: 100 ml/kg.
        </div>
      </div>`;
  },

  /* ---------- Manutenção basal Holliday-Segar ---------- */
  holliday(peso) {
    // Holliday-Segar: 100 ml/kg até 10kg, +50 ml/kg de 10-20kg, +20 ml/kg acima de 20kg
    const calculado = peso <= 10
      ? peso * 100
      : (peso <= 20 ? 1000 + (peso - 10) * 50 : 1500 + (peso - 20) * 20);
    const volume = Math.min(calculado, 2400);
    const atingiuTeto = calculado > 2400;
    const taxaHora = (volume / 24).toFixed(1);

    const linhas = [
      ['#60a5fa', 'SG 5%',     volume.toFixed(0) + 'ml',       ''],
      ['#94a3b8', 'NaCl 20%',  (volume * .01).toFixed(1) + 'ml', '(~3 mEq/100ml)'],
      ['#f87171', 'KCl 19,1%', (volume * .01).toFixed(1) + 'ml', '(2,5 mEq/100ml)']
    ];

    return `
      <div class="pc pc-blue">
        <div class="pc-row">
          <div style="display:flex;align-items:baseline;gap:8px">
            <span class="pc-n">${volume.toFixed(0)}</span><span class="pc-u">ml/dia</span>
            ${atingiuTeto ? `<span class="teto-badge on"><i class="fas fa-shield-alt"></i>Teto</span>` : ''}
          </div>
          <span class="pc-pill pp-blue"><i class="fas fa-stopwatch" style="margin-right:4px"></i>${taxaHora} ml/h</span>
        </div>
        <div class="pc-div"></div>
        <div style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;opacity:.5;margin-bottom:9px">
          <i class="fas fa-prescription-bottle-alt" style="margin-right:4px"></i>Composição Sugerida
        </div>
        <div class="pc-list">
          ${linhas.map(([cor, nome, vol, sub]) => `
            <div class="pc-list-row">
              <span class="pc-dot" style="background:${cor}"></span>
              <strong style="font-size:13px">${nome}</strong>
              <span style="margin-left:auto;font-weight:800;font-size:13px">${vol}</span>
              ${sub ? `<span style="margin-left:8px;font-size:10px;opacity:.45">${sub}</span>` : ''}
            </div>`).join('')}
        </div>
      </div>`;
  },

  /* ---------- TRO (Terapia de Reidratação Oral) ---------- */
  tro(peso) {
    const volume = Math.min(peso * 50, 2000);
    return `
      <div class="pc pc-green">
        <div class="pc-row">
          <div style="display:flex;align-items:baseline;gap:8px">
            <span class="pc-n" style="color:#15803d">${volume.toFixed(0)}</span>
            <span class="pc-u">ml</span>
          </div>
          <span class="pc-pill pp-green">em 4 horas</span>
        </div>
        <div class="pc-info" style="margin-top:10px">
          <i class="fas fa-info-circle"></i>SRO. Oferecer em colher, lentamente. Reavalie após 4h.
        </div>
      </div>`;
  },

  /* ---------- Penicilina Benzatina ---------- */
  benzetacil(peso) {
    if (peso < 11) {
      return `<div class="ban-warn">Não indicado para peso inferior a 11 kg.</div>`;
    }
    const dose = peso >= 27 ? '1.200.000 UI' : '600.000 UI';
    return `
      <div class="static-big">${dose}</div>
      <div class="via-tag">IM Dose Única</div>`;
  },

  /* ---------- Nistatina ---------- */
  nistatina(peso, idadeMeses) {
    let recom;
    if (idadeMeses === null)        recom = 'Lactentes: 1–2 ml | Crianças: 4–6 ml';
    else if (idadeMeses < 24)       recom = '1 a 2 ml';
    else                            recom = '4 a 6 ml';

    return `
      <div class="static-big">${recom}</div>
      <div class="via-tag">VO 6/6h</div>
      <div class="obs-line" style="margin-top:10px">
        <i class="fas fa-info-circle"></i>Manter na boca o maior tempo possível.
      </div>`;
  },

  /* ---------- Cetoprofeno ---------- */
  cetoprofeno(peso) {
    const calc = peso;
    const unit = calc >= 100 ? 'mg' : 'a ' + Math.min(peso * 2, 100) + ' mg';
    return renderBasic(peso, null, {
      calc,
      max: 100,
      unit,
      via: 'EV/IM 8/8h ou 12/12h',
      obs: 'Máx: 100mg/dose. Diluição EV: Diluir em 50–100ml de SF 0,9% (20-30 min).'
    });
  },

  /* ---------- Lactulose ---------- */
  lactulose(peso, idadeMeses) {
    let texto;
    if (idadeMeses === null)         texto = `<span style="color:#d97706;font-weight:800">Informe a idade para dose exata</span>`;
    else if (idadeMeses < 12)        texto = '5 ml/dia';
    else if (idadeMeses <= 60)       texto = '7,5 ml/dia';
    else if (idadeMeses <= 144)      texto = '12 ml/dia';
    else                              texto = '15 a 30 ml/dia';

    return `
      <div class="static-big">${texto}</div>
      <div class="via-tag">VO 1×/dia</div>
      <div class="obs-line" style="margin-top:10px">
        <i class="fas fa-info-circle"></i>&lt;1a: 5ml | 1–5a: 7,5ml | 6–12a: 12ml
      </div>`;
  },

  /* ---------- Hidrocortisona ---------- */
  hidrocortisona(peso) {
    const asma     = Math.min(peso * 5, 500);
    const alergia  = Math.min(peso * 10, 500);
    const badgeAsma     = peso * 5 > 500  ? `<span class="teto-badge on" style="font-size:10px"><i class="fas fa-shield-alt"></i>Teto</span>` : '';
    const badgeAlergia  = peso * 10 > 500 ? `<span class="teto-badge on" style="font-size:10px"><i class="fas fa-shield-alt"></i>Teto</span>` : '';

    const linha = (titulo, dose, badge) => `
      <div style="background:#fff7ed;border:1.5px solid #fed7aa;border-radius:10px;padding:10px 13px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
        <span style="font-weight:800;font-size:13px">${titulo}</span>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:1.5rem;font-weight:900">${dose} mg</span>${badge}
        </div>
      </div>`;

    return `
      <div style="display:grid;gap:8px;margin-bottom:10px">
        ${linha('Asma / Broncoespasmo', asma, badgeAsma)}
        ${linha('Alergia / Anafilaxia', alergia, badgeAlergia)}
      </div>
      <div class="via-tag">EV</div>
      <div class="obs-line" style="margin-top:10px">
        <i class="fas fa-info-circle"></i>Teto adulto 500mg. Diluição EV: 10–50ml de SF 0,9% ou SG 5%, infundir lento (10 min).
      </div>`;
  },

  /* ---------- Óleo Mineral ---------- */
  oleo_mineral(peso) {
    const calc = peso;
    const unit = calc >= 15 ? 'ml' : 'a ' + Math.min(peso * 2, 15) + ' ml';
    return renderBasic(peso, null, {
      calc, max: 15, unit,
      via: 'VO 1-2×/dia',
      obs: 'Máx: 15ml/dose.',
      contraIndicacaoMeses: 12
    });
  },

  /* ---------- Hidróxido de Magnésio ---------- */
  hidroxido_magnesio(peso) {
    const calc = peso;
    const unit = calc >= 30 ? 'ml/dia' : 'a ' + Math.min(peso * 3, 30) + ' ml/dia';
    return renderBasic(peso, null, {
      calc, max: 30, unit,
      via: 'VO 1-2×/dia',
      obs: 'Dose ao dia. Máx: 30ml/dia.'
    });
  },

  /* ---------- DKA: Expansão inicial ---------- */
  dka_bolus(peso) {
    const vol = Math.min(peso * 10, 1000);
    return `
      <div class="pc pc-amb">
        <div class="pc-row">
          <div style="display:flex;align-items:baseline;gap:8px">
            <span class="pc-n">${vol.toFixed(0)}</span><span class="pc-u">ml</span>
          </div>
          <span class="pc-pill pp-amb"><i class="fas fa-clock" style="margin-right:4px"></i>SF 0,9% em 1h</span>
        </div>
        <div class="pc-div"></div>
        <div class="pc-info">
          <i class="fas fa-info-circle"></i>10 ml/kg inicial. Reavaliar perfusão. Repetir 10 ml/kg se choque persistente — MAS evitar &gt;40 ml/kg em primeiras 4h.
        </div>
        <div class="ban-warn" style="margin-top:10px">
          <strong>⚠ Risco de edema cerebral:</strong> reidratação muito rápida é fator de risco. Considerar Ringer Lactato se Na corrigido normal/baixo.
        </div>
      </div>`;
  },

  /* ---------- DKA: Insulina em BIC ---------- */
  dka_insulina(peso) {
    const inicio = peso * 0.05;
    const padrao = peso * 0.1;
    return `
      <div class="pc pc-blue">
        <div style="display:grid;gap:9px;margin-bottom:10px">
          <div style="background:rgba(255,255,255,.55);border-radius:10px;padding:11px 13px">
            <div style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;opacity:.6;margin-bottom:6px">Velocidade Inicial — 0,05 U/kg/h</div>
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
              <div style="display:flex;align-items:baseline;gap:6px">
                <span class="pc-n" style="font-size:2rem">${inicio.toFixed(2)}</span><span class="pc-u">U/h</span>
              </div>
              <span class="pc-pill pp-blue">${inicio.toFixed(2)} mL/h</span>
            </div>
          </div>
          <div style="background:rgba(255,255,255,.55);border-radius:10px;padding:11px 13px">
            <div style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;opacity:.6;margin-bottom:6px">Velocidade Padrão — 0,1 U/kg/h</div>
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
              <div style="display:flex;align-items:baseline;gap:6px">
                <span class="pc-n" style="font-size:2rem">${padrao.toFixed(2)}</span><span class="pc-u">U/h</span>
              </div>
              <span class="pc-pill pp-blue">${padrao.toFixed(2)} mL/h</span>
            </div>
          </div>
        </div>
        <div class="pc-info" style="padding-top:10px;border-top:1px solid rgba(0,0,0,.07)">
          <i class="fas fa-flask"></i><strong>Diluição:</strong> 50 U Insulina Regular em 49,5 mL de SF 0,9% (= 1 U/mL). Cada mL/h = 1 U/h.
        </div>
        <div class="ban-warn" style="margin-top:10px">
          Iniciar SÓ após expansão inicial. Manter glicemia &gt;200 mg/dL nas primeiras 4h. Reduzir glicemia ~50–100 mg/dL/h. Quando glicemia &lt;250 mg/dL → trocar para SG 5%.
        </div>
      </div>`;
  },

  /* ---------- DKA: Manutenção ---------- */
  dka_manut(peso) {
    const manut = peso <= 10 ? peso * 100
                : (peso <= 20 ? 1000 + (peso - 10) * 50 : 1500 + (peso - 20) * 20);
    const total = Math.min(manut * 1.5, 4000);
    const taxa  = (total / 48).toFixed(0);
    return `
      <div class="pc pc-blue">
        <div class="pc-row">
          <div style="display:flex;align-items:baseline;gap:8px">
            <span class="pc-n">${total.toFixed(0)}</span><span class="pc-u">ml em 48h</span>
          </div>
          <span class="pc-pill pp-blue"><i class="fas fa-stopwatch" style="margin-right:4px"></i>${taxa} mL/h</span>
        </div>
        <div class="pc-info" style="margin-top:10px">
          <i class="fas fa-info-circle"></i>1,5× manutenção (Holliday-Segar) infundida ao longo de 48h. Quando glicemia &lt; 250 mg/dL, trocar para SG 5% + NaCl 0,45% + KCl 20–40 mEq/L.
        </div>
      </div>`;
  },

  /* ---------- Vasoativas: helper genérico ---------- */
  _vasoBIC(peso, cfg) {
    const { ampMg, ampMl, volSF, doseMin, doseMax, doseDefault, unit = 'mcg/kg/min' } = cfg;
    const totalVol = volSF + ampMl;
    const concMcgMl = (ampMg * 1000) / totalVol;
    const rate = (dose) => (dose * peso * 60 / concMcgMl).toFixed(2);

    return `
      <div class="pc pc-red">
        <div class="pc-row">
          <div>
            <div style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;opacity:.65">Diluição padrão</div>
            <div style="font-size:14px;font-weight:800;margin-top:4px">${ampMg} mg em ${totalVol} mL SF</div>
            <div style="font-size:11.5px;opacity:.7;margin-top:2px">= ${concMcgMl.toFixed(0)} mcg/mL</div>
          </div>
          <span class="pc-pill pp-red">${doseMin}–${doseMax} ${unit}</span>
        </div>
        <div class="pc-div"></div>
        <div style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;opacity:.5;margin-bottom:9px">
          <i class="fas fa-stopwatch" style="margin-right:4px"></i>Velocidade BIC (mL/h)
        </div>
        <div class="pc-list">
          <div class="pc-list-row">
            <span class="pc-dot" style="background:#16a34a"></span>
            <strong style="font-size:13px">Mínima (${doseMin} ${unit})</strong>
            <span style="margin-left:auto;font-weight:800;font-size:13px">${rate(doseMin)} mL/h</span>
          </div>
          <div class="pc-list-row">
            <span class="pc-dot" style="background:#f59e0b"></span>
            <strong style="font-size:13px">Inicial (${doseDefault} ${unit})</strong>
            <span style="margin-left:auto;font-weight:800;font-size:13px">${rate(doseDefault)} mL/h</span>
          </div>
          <div class="pc-list-row">
            <span class="pc-dot" style="background:#dc2626"></span>
            <strong style="font-size:13px">Máxima (${doseMax} ${unit})</strong>
            <span style="margin-left:auto;font-weight:800;font-size:13px">${rate(doseMax)} mL/h</span>
          </div>
        </div>
        <div class="pc-info" style="margin-top:10px">
          <i class="fas fa-info-circle"></i>Fórmula: dose × peso × 60 / conc. Titular conforme PA/perfusão. <strong>Via central preferencial</strong>.
        </div>
      </div>`;
  },

  /* Vasoativas individuais */
  vaso_adre(peso) { return PROTOCOLS._vasoBIC(peso, { ampMg: 4,  ampMl: 4,  volSF: 96,  doseMin: 0.01, doseMax: 1,   doseDefault: 0.1 }); },
  vaso_nora(peso) { return PROTOCOLS._vasoBIC(peso, { ampMg: 16, ampMl: 4,  volSF: 96,  doseMin: 0.05, doseMax: 2,   doseDefault: 0.1 }); },
  vaso_dopa(peso) { return PROTOCOLS._vasoBIC(peso, { ampMg: 250,ampMl: 50, volSF: 200, doseMin: 2,    doseMax: 20,  doseDefault: 10  }); },
  vaso_dobu(peso) { return PROTOCOLS._vasoBIC(peso, { ampMg: 250,ampMl: 20, volSF: 230, doseMin: 5,    doseMax: 20,  doseDefault: 10  }); },
  vaso_milr(peso) { return PROTOCOLS._vasoBIC(peso, { ampMg: 20, ampMl: 20, volSF: 80,  doseMin: 0.25, doseMax: 0.75,doseDefault: 0.5 }); }
};
