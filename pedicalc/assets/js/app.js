/* ============================================================
   PediCalc — Application bootstrap (v3)
   ------------------------------------------------------------
   Orquestra: tema, dados, busca, favoritos, calculadoras, scores,
   renderização, eventos de interação e persistência local.
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Refs ---------- */
  const pesoEl    = document.getElementById('peso');
  const idadeEl   = document.getElementById('idade');
  const unidadeEl = document.getElementById('idu');
  const resEl     = document.getElementById('res');
  const tabsEl    = document.getElementById('tabs');
  const calcBtn   = document.getElementById('calcbtn');
  const searchEl  = document.getElementById('search');
  const clearSearchEl = document.getElementById('clear-search');
  const themeBtn  = document.getElementById('btn-theme');
  const printBtn  = document.getElementById('btn-print');
  const installBtn = document.getElementById('btn-install');

  /* ---------- State ---------- */
  let DATA = [];
  let idadeMesesAtual = null;
  let currentQuery = '';
  let currentTab = 'all';

  /* ---------- PWA ---------- */
  PWA.init();
  installBtn.addEventListener('click', () => PWA.promptInstall());

  /* ---------- Theme button (sincroniza ícone) ---------- */
  function refreshThemeBtn() {
    const mode = Theme.get();
    themeBtn.innerHTML = `<i class="${Theme.icon(mode)}"></i>`;
    themeBtn.title = `Tema: ${Theme.label(mode)} (clique para alternar)`;
    document.querySelectorAll('[data-theme]').forEach(b => {
      b.classList.toggle('on', b.dataset.theme === mode);
    });
  }
  themeBtn.addEventListener('click', () => { Theme.cycle(); refreshThemeBtn(); });
  refreshThemeBtn();

  /* ---------- Carga de dados ---------- */
  function loadData() {
    DATA = DB.map(cat => ({
      ...cat,
      items: cat.items.map(item => {
        let dose;
        if (item.t === 'A') {
          dose = (p, idM) => renderAdjustable(p, idM, {
            ...item.d,
            def_conc_mg: item.d.dc,
            def_conc_ml: item.d.ml,
            is_gotas:    item.d.ig,
            max_mg:      item.d.mx,
            slider:      item.d.sl || null
          });
        } else if (item.t === 'B') {
          dose = (p, idM) => {
            let calc = p * item.d.co;
            if (item.d.ceil) calc = Math.ceil(calc);
            return renderBasic(p, idM, { ...item.d, calc });
          };
        } else if (item.t === 'P') {
          dose = PROTOCOLS[item.pid];
        } else if (item.t === 'E') {
          dose = () => renderStatic(item.d);
        }
        // Conserva o item original para id de favorito + tipo
        return { name: item.name, t: item.t, raw: item, dose };
      })
    }));

    // Protocolos VIP do usuário (prepend)
    const custom = JSON.parse(localStorage.getItem('custom_drugs_v1') || '[]');
    if (custom.length) {
      DATA.unshift({
        id: 'custom', tc: 'custom',
        name: 'MEUS PROTOCOLOS VIP',
        icon: 'fas fa-star',
        items: custom.map(d => ({
          name: d.name, t: 'A',
          raw: { t: 'A', d: { id: d.id }, name: d.name },
          dose: (p, idM) => renderAdjustable(p, idM, {
            id: d.id,
            base_mg_kg: d.doseMgKg,
            def_conc_mg: d.concMg,
            def_conc_ml: d.concMl,
            is_gotas: d.unit === 'gotas',
            via: d.via,
            obs: d.obs,
            max_mg: d.maxMg,
            slider: null
          })
        }))
      });
    }
  }

  /* ---------- Renderização das abas ---------- */
  function renderTabs() {
    const custom = JSON.parse(localStorage.getItem('custom_drugs_v1') || '[]');
    const hasFavs = !Favorites.isEmpty();

    const baseTabs = [
      { cat: 'all',              cls: 't-all',   icon: 'fas fa-th-large',           label: 'Mostrar Tudo' },
      ...(hasFavs ? [{ cat: 'favs', cls: 't-vip', icon: 'fas fa-star', label: 'Favoritos' }] : []),
      ...(custom.length ? [{ cat: 'custom', cls: 't-vip', icon: 'fas fa-bookmark', label: 'VIP' }] : []),
      { cat: 'urg',              cls: 't-anti',  icon: 'fas fa-bolt-lightning',     label: 'Emergências' },
      { cat: 'anti',             cls: 't-anti',  icon: 'fas fa-bacteria',           label: 'Antimicrobianos' },
      { cat: 'flu',              cls: 't-fluid', icon: 'fas fa-hand-holding-water', label: 'Fluidoterapia' },
      { cat: 'calc',             cls: 't-fluid', icon: 'fas fa-calculator',         label: 'Calculadoras' },
      { cat: 'score',            cls: 't-anti',  icon: 'fas fa-chart-line',         label: 'Scores' },
      { cat: 'analgesicos',      cls: 't-std',   icon: 'fas fa-capsules',           label: 'Analgésicos' },
      { cat: 'antiemeticos',     cls: 't-std',   icon: 'fas fa-tablets',            label: 'Antieméticos' },
      { cat: 'antialergicos',    cls: 't-std',   icon: 'fas fa-allergies',          label: 'Antialérgicos' },
      { cat: 'corticosteroides', cls: 't-std',   icon: 'fas fa-vial',               label: 'Corticosteroides' },
      { cat: 'laxantes',         cls: 't-std',   icon: 'fas fa-leaf',               label: 'Laxantes' },
      { cat: 'sedativos',        cls: 't-std',   icon: 'fas fa-bed',                label: 'Sedativos' },
      { cat: 'antidotos',        cls: 't-std',   icon: 'fas fa-shield-alt',         label: 'Antídotos' },
      { cat: 'inhalo',           cls: 't-std',   icon: 'fas fa-wind',               label: 'Inhaloterapia' },
      { cat: 'oftalmologicos',   cls: 't-std',   icon: 'fas fa-eye',                label: 'Oftalmo' },
      { cat: 'queimaduras',      cls: 't-std',   icon: 'fas fa-fire-extinguisher',  label: 'Queimaduras' },
      { cat: 'ginecologicos',    cls: 't-std',   icon: 'fas fa-venus',              label: 'Ginecológicos' }
    ];

    tabsEl.innerHTML = baseTabs.map(t => `
      <div class="tab ${t.cls}${t.cat === currentTab ? ' active' : ''}" data-cat="${t.cat}">
        <i class="${t.icon}"></i>${t.label}
      </div>`).join('');
  }

  /* ---------- Card de medicação (acordeão) ---------- */
  function buildAccordion(item) {
    const peso = parseFloat(pesoEl.value.replace(',', '.'));
    const favId = Favorites.idFor(item.raw);
    const isFav = Favorites.has(favId);
    const [icon, color, bg] = getDrugIcon(item.name);
    const safeId = favId.replace(/[^a-z0-9_:]/gi, '_');

    return `
      <div class="acc" data-fav-id="${favId}">
        <div class="acc-row" style="display:flex;align-items:center;gap:4px">
          <button class="btn-fav ${isFav ? 'on' : ''}" data-fav="${favId}" title="Favoritar">
            <i class="${isFav ? 'fas' : 'far'} fa-star"></i>
          </button>
          <button class="acc-btn" style="flex:1">
            <div class="acc-left">
              <span class="drug-badge" style="background:${bg};color:${color}">
                <i class="${icon}"></i>
              </span>
              <span class="acc-name">${item.name}</span>
            </div>
            <div class="acc-toggle"><i class="fas fa-chevron-down"></i></div>
          </button>
        </div>
        <div class="acc-body">
          <div class="acc-inner">
            ${item.dose(peso, idadeMesesAtual)}
            <div style="display:flex;justify-content:flex-end;margin-top:10px">
              <button class="btn-copy" data-copy="acc" title="Copiar prescrição">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>
        </div>
      </div>`;
  }

  function buildCard(cat, isSubcard) {
    const cor = getCategoryColor(cat);
    const cls = isSubcard ? 'subcard' : 'rcard';
    const itensHtml = cat.items.map(buildAccordion).join('');

    return `
      <div class="${cls}">
        <div class="ch" style="background:${cor}">
          <i class="${cat.icon}"></i><span class="ch-text">${cat.name}</span>
        </div>
        <div class="cb">${itensHtml}</div>
      </div>`;
  }

  /* ---------- Calculadora card ---------- */
  function buildCalcCard(calc) {
    const peso = parseFloat(pesoEl.value.replace(',', '.')) || 0;
    const inputs = (calc.inputs || []).map(f => `
      <div class="calc-field">
        <label for="calc-${calc.id}-${f.id}">${f.label}</label>
        <input
          id="calc-${calc.id}-${f.id}"
          type="number"
          data-calc="${calc.id}"
          data-field="${f.id}"
          placeholder="${f.placeholder || ''}"
          step="${f.step || '0.01'}"
          ${f.min ? `min="${f.min}"` : ''}
          ${f.max ? `max="${f.max}"` : ''}
          inputmode="decimal">
      </div>`).join('');

    return `
      <div class="calc-card" data-calc-id="${calc.id}">
        <div class="ch" style="background:${calc.color}">
          <i class="${calc.icon}"></i><span class="ch-text">${calc.name}</span>
        </div>
        <div class="calc-body">
          ${calc.desc ? `<div class="calc-desc">${calc.desc}</div>` : ''}
          ${inputs ? `<div class="calc-inputs">${inputs}</div>` : ''}
          <div class="calc-result" data-calc-result="${calc.id}">
            ${renderCalcResult(calc, peso, {})}
          </div>
        </div>
      </div>`;
  }

  function renderCalcResult(calc, peso, values) {
    if (!peso || peso <= 0) {
      return `<div class="calc-empty"><i class="fas fa-info-circle"></i> Informe o peso para calcular.</div>`;
    }
    const out = calc.compute(peso, idadeMesesAtual, values);
    if (!out) {
      return `<div class="calc-empty"><i class="fas fa-keyboard"></i> Preencha os campos acima.</div>`;
    }
    if (out.error) {
      return `<div class="calc-empty"><i class="fas fa-triangle-exclamation"></i> ${out.error}</div>`;
    }
    const items = (out.items || []).map(it => `
      <div class="calc-result-item"><span>${it.label}</span><strong>${it.value}</strong></div>`).join('');
    return `
      <div>
        <div style="display:flex;align-items:baseline;gap:6px">
          <span class="calc-result-num">${out.value}</span>
          <span class="calc-result-unit">${out.unit || ''}</span>
        </div>
        ${out.formula ? `<div class="calc-result-formula">${out.formula}</div>` : ''}
        ${out.notes ? `<div class="calc-result-notes">${out.notes}</div>` : ''}
        ${items ? `<div class="calc-result-items">${items}</div>` : ''}
      </div>`;
  }

  function recalcCalc(calcId) {
    const card = document.querySelector(`[data-calc-id="${calcId}"]`);
    if (!card) return;
    const calc = CALCULATORS.find(c => c.id === calcId);
    if (!calc) return;
    const peso = parseFloat(pesoEl.value.replace(',', '.')) || 0;
    const values = {};
    card.querySelectorAll('[data-calc][data-field]').forEach(inp => {
      values[inp.dataset.field] = inp.value;
    });
    card.querySelector(`[data-calc-result="${calcId}"]`).innerHTML = renderCalcResult(calc, peso, values);
  }

  /* ---------- Score card ---------- */
  function buildScoreCard(score) {
    if (score.custom === 'parkland') return buildParklandCard(score);

    const questions = score.questions.map(q => `
      <div class="score-field">
        <label for="score-${score.id}-${q.id}">${q.label}</label>
        <select id="score-${score.id}-${q.id}" data-score="${score.id}" data-field="${q.id}">
          <option value="" selected disabled>Selecione…</option>
          ${q.options.map(o => `<option value="${o.v}">${o.t}</option>`).join('')}
        </select>
      </div>`).join('');

    return `
      <div class="score-card" data-score-id="${score.id}">
        <div class="ch" style="background:${score.color}">
          <i class="${score.icon}"></i><span class="ch-text">${score.name}</span>
        </div>
        <div class="score-body">
          ${score.desc ? `<div class="score-desc">${score.desc}</div>` : ''}
          <div class="score-questions">${questions}</div>
          <div class="score-result" data-score-result="${score.id}">
            <div class="score-empty"><i class="fas fa-keyboard"></i> Selecione todas as opções para ver o resultado.</div>
          </div>
        </div>
      </div>`;
  }

  function buildParklandCard(score) {
    return `
      <div class="score-card" data-score-id="${score.id}">
        <div class="ch" style="background:${score.color}">
          <i class="${score.icon}"></i><span class="ch-text">${score.name}</span>
        </div>
        <div class="score-body">
          <div class="score-desc">${score.desc}</div>
          <div class="calc-inputs">
            <div class="calc-field">
              <label for="parkland-scq">${score.inputs[0].label}</label>
              <input id="parkland-scq" type="number" data-parkland-scq min="0" max="100" placeholder="${score.inputs[0].placeholder}">
            </div>
          </div>
          <div class="score-result" data-score-result="${score.id}">
            ${renderParklandResult()}
          </div>
        </div>
      </div>`;
  }

  function renderParklandResult() {
    const peso = parseFloat(pesoEl.value.replace(',', '.')) || 0;
    const scq = parseFloat(document.getElementById('parkland-scq')?.value) || 0;
    if (!peso || peso <= 0) {
      return `<div class="score-empty"><i class="fas fa-info-circle"></i> Informe o peso.</div>`;
    }
    if (!scq || scq <= 0) {
      return `<div class="score-empty"><i class="fas fa-keyboard"></i> Informe a SCQ (% superfície queimada).</div>`;
    }
    const total = 4 * peso * scq;
    const f1 = total / 2;
    const f2 = total / 2;
    return `
      <div class="score-total">
        <div>
          <div style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-3)">Volume total em 24h</div>
          <span class="score-total-num">${total.toFixed(0)}</span>
          <span class="calc-result-unit">mL de RL</span>
        </div>
        <span class="score-total-pill" style="background:linear-gradient(135deg,#ea580c,#c2410c)">Parkland</span>
      </div>
      <div class="calc-result-items">
        <div class="calc-result-item"><span>1ª metade — primeiras 8h</span><strong>${f1.toFixed(0)} mL (${(f1/8).toFixed(0)} mL/h)</strong></div>
        <div class="calc-result-item"><span>2ª metade — próximas 16h</span><strong>${f2.toFixed(0)} mL (${(f2/16).toFixed(0)} mL/h)</strong></div>
      </div>
      <div class="score-interp" style="margin-top:10px">
        Fórmula: 4 mL × ${peso} kg × ${scq}% = ${total.toFixed(0)} mL. Use Ringer Lactato.
        Iniciar a contagem das 8h a partir do <strong>momento da queimadura</strong>, não da admissão.
      </div>`;
  }

  function renderScoreResult(score, values) {
    if (score.questions.some(q => !values[q.id])) {
      return `<div class="score-empty"><i class="fas fa-keyboard"></i> Selecione todas as opções para ver o resultado.</div>`;
    }
    const total = score.questions.reduce((s, q) => s + parseInt(values[q.id], 10), 0);
    const r = score.interpret(total);
    return `
      <div class="score-total">
        <div>
          <div style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-3)">Pontuação total</div>
          <span class="score-total-num">${total}</span>
        </div>
        <span class="score-total-pill" style="background:linear-gradient(135deg,${r.cor},${r.cor})">${r.classe}</span>
      </div>
      <div class="score-interp">${r.texto}</div>`;
  }

  function recalcScore(scoreId) {
    if (scoreId === 'parkland') {
      const el = document.querySelector(`[data-score-result="${scoreId}"]`);
      if (el) el.innerHTML = renderParklandResult();
      return;
    }
    const card = document.querySelector(`[data-score-id="${scoreId}"]`);
    if (!card) return;
    const score = SCORES.find(s => s.id === scoreId);
    if (!score) return;
    const values = {};
    card.querySelectorAll('[data-score][data-field]').forEach(inp => {
      if (inp.value !== '') values[inp.dataset.field] = inp.value;
    });
    card.querySelector(`[data-score-result="${scoreId}"]`).innerHTML = renderScoreResult(score, values);
  }

  /* ---------- Validação visual ---------- */
  function flashError(el) {
    el.style.borderColor = '#e11d48';
    el.style.boxShadow   = '0 0 0 4px rgba(225,29,72,.2)';
    el.animate(
      [{ transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' },
       { transform: 'translateX(-3px)' }, { transform: 'translateX(3px)' }, { transform: 'translateX(0)' }],
      { duration: 300, easing: 'ease-out' }
    );
    setTimeout(() => { el.style.borderColor = ''; el.style.boxShadow = ''; }, 3000);
  }

  /* ---------- Banner do paciente ---------- */
  function updatePatientBand(peso, idadeNum, unidade) {
    const pb    = document.getElementById('pband');
    const pbAge = document.getElementById('pb-age');
    document.getElementById('pb-v1').textContent = peso;

    if (idadeMesesAtual !== null) {
      pbAge.style.display = 'flex';
      document.getElementById('pb-v2').textContent = unidade === 'anos' ? idadeNum : idadeMesesAtual;
      document.getElementById('pb-v3').textContent = unidade === 'anos' ? 'anos' : 'meses';
    } else {
      pbAge.style.display = 'none';
    }
    pb.classList.add('show');
  }

  /* ---------- Renderização principal ---------- */
  function render() {
    const peso = parseFloat(pesoEl.value.replace(',', '.'));
    const pesoOk = !isNaN(peso) && peso > 0;

    // Abas que NÃO exigem peso (scores e calculadoras se viram sozinhos)
    const livre = (currentTab === 'calc' || currentTab === 'score');

    if (!pesoOk && !livre) {
      resEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-ring">🩺</div>
          <h2>Pronto para calcular</h2>
          <p>Insira o <strong>peso do paciente</strong> acima e clique em
          <strong>Calcular Doses</strong> para visualizar todos os protocolos.</p>
        </div>`;
      return;
    }

    let html = '';

    // Alerta de teto adulto
    if (peso >= 40) {
      html += `
        <div class="dose-alert">
          <div class="da-ico"><i class="fas fa-shield-alt"></i></div>
          <div>
            <div class="da-t">Limitador de Dose — Teto Adulto Ativo</div>
            <div class="da-p">
              Paciente com <strong>${peso} kg</strong> — doses que ultrapassariam a posologia segura
              estão sendo limitadas automaticamente.
            </div>
          </div>
        </div>`;
    }

    /* ---- Aba Calculadoras ---- */
    if (currentTab === 'calc') {
      html += CALCULATORS.map(buildCalcCard).join('');
      resEl.innerHTML = html || `<div class="empty-state"><p>Sem calculadoras disponíveis.</p></div>`;
      return;
    }

    /* ---- Aba Scores ---- */
    if (currentTab === 'score') {
      html += SCORES.map(buildScoreCard).join('');
      resEl.innerHTML = html || `<div class="empty-state"><p>Sem scores disponíveis.</p></div>`;
      return;
    }

    /* ---- Aba Favoritos ---- */
    if (currentTab === 'favs') {
      const favList = new Set(Favorites.list());
      const filteredData = DATA.map(cat => ({
        ...cat,
        items: cat.items.filter(it => favList.has(Favorites.idFor(it.raw)))
      })).filter(cat => cat.items.length > 0);

      if (filteredData.length === 0) {
        html += `<div class="empty-state">
          <div class="empty-ring">⭐</div>
          <h2>Nenhum favorito</h2>
          <p>Toque na <strong>estrela</strong> ao lado de qualquer medicação para adicioná-la aqui.</p>
        </div>`;
      } else {
        filteredData.forEach((cat, i) => {
          let card = buildCard(cat, false);
          card = card.replace('<div class="rcard">', `<div class="rcard" style="animation-delay:${i * 48}ms">`);
          html += card;
        });
      }
      resEl.innerHTML = html;
      finalizeRender();
      return;
    }

    /* ---- Aba específica (categoria com tc ou id) ---- */
    // Aplicar busca antes do filtro de aba
    const searched = currentQuery ? Search.filter(currentQuery, DATA) : DATA;

    let dentroDeMega = false;
    let megaTitle = '';
    let megaIcon  = '';
    searched.forEach((cat, i) => {
      const tc = cat.tc || cat.id;
      if (currentTab !== 'all' && tc !== currentTab) return;
      if (currentTab === 'all' && tc === 'flu') return;

      // Agrupamento "mega" para urg e anti
      const ehMega = (currentTab === 'all' && (tc === 'urg' || tc === 'anti'))
                  || (currentTab === 'urg' && tc === 'urg')
                  || (currentTab === 'anti' && tc === 'anti');

      if (ehMega) {
        const novoMega = tc;
        if (!dentroDeMega) {
          megaTitle = tc === 'urg' ? 'EMERGÊNCIAS E REANIMAÇÃO' : 'ANTIMICROBIANOS — POR INDICAÇÃO';
          megaIcon  = tc === 'urg' ? 'fas fa-bolt-lightning'      : 'fas fa-bacteria';
          html += `
            <div class="mega">
              <div class="mega-h">
                <div class="mh-icon"><i class="${megaIcon}"></i></div>
                <div class="mh-text">
                  <h2>${megaTitle}</h2>
                  <p>${tc === 'urg' ? 'Por categoria de emergência' : 'Selecione pelo diagnóstico clínico'}</p>
                </div>
              </div>
              <div class="mega-body"><div class="mega-grid">`;
          dentroDeMega = novoMega;
        } else if (dentroDeMega !== novoMega) {
          // Fecha mega atual e abre um novo
          html += `</div></div></div>`;
          megaTitle = tc === 'urg' ? 'EMERGÊNCIAS E REANIMAÇÃO' : 'ANTIMICROBIANOS — POR INDICAÇÃO';
          megaIcon  = tc === 'urg' ? 'fas fa-bolt-lightning'      : 'fas fa-bacteria';
          html += `
            <div class="mega">
              <div class="mega-h">
                <div class="mh-icon"><i class="${megaIcon}"></i></div>
                <div class="mh-text">
                  <h2>${megaTitle}</h2>
                  <p>${tc === 'urg' ? 'Por categoria de emergência' : 'Selecione pelo diagnóstico clínico'}</p>
                </div>
              </div>
              <div class="mega-body"><div class="mega-grid">`;
          dentroDeMega = novoMega;
        }
      } else if (dentroDeMega) {
        html += `</div></div></div>`;
        dentroDeMega = false;
      }

      let card = buildCard(cat, !!ehMega);
      card = card.replace('<div class="rcard">', `<div class="rcard" style="animation-delay:${i * 48}ms">`);
      html += card;
    });
    if (dentroDeMega) html += `</div></div></div>`;

    if (html.trim() === '' || (currentQuery && !html.includes('rcard') && !html.includes('subcard'))) {
      html = `<div class="empty-state">
        <div class="empty-ring">🔍</div>
        <h2>Nada encontrado</h2>
        <p>Tente outro termo ou limpe o filtro.</p>
      </div>`;
    }

    resEl.innerHTML = html;
    finalizeRender();
  }

  function finalizeRender() {
    document.querySelectorAll('.aw').forEach(recalcAdjustable);
  }

  /* ---------- Cálculo principal (botão "Calcular") ---------- */
  function calc() {
    const peso = parseFloat(pesoEl.value.replace(',', '.'));
    const idade = parseFloat(idadeEl.value);
    const unidade = unidadeEl.value;

    if (isNaN(peso) || peso <= 0) { flashError(pesoEl); return; }

    idadeMesesAtual = (!isNaN(idade) && idade >= 0)
      ? (unidade === 'anos' ? idade * 12 : idade)
      : null;

    updatePatientBand(peso, idade, unidade);
    render();
  }

  /* ============================================================
     EVENTOS
  ============================================================ */

  // Enter nos inputs
  [pesoEl, idadeEl].forEach(el => el.addEventListener('keypress', e => {
    if (e.key === 'Enter') calc();
  }));
  unidadeEl.addEventListener('change', () => { if (pesoEl.value) calc(); });
  calcBtn.addEventListener('click', calc);

  // Busca
  let searchTimer;
  searchEl.addEventListener('input', e => {
    currentQuery = e.target.value;
    searchEl.parentElement.classList.toggle('has-text', !!currentQuery);
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { if (pesoEl.value) render(); }, 150);
  });
  clearSearchEl.addEventListener('click', () => {
    searchEl.value = '';
    currentQuery = '';
    searchEl.parentElement.classList.remove('has-text');
    if (pesoEl.value) render();
    searchEl.focus();
  });
  // Atalho "/" para focar busca
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      searchEl.focus();
    }
  });

  // Print
  printBtn.addEventListener('click', () => {
    document.getElementById('print-date').textContent = new Date().toLocaleString('pt-BR');
    window.print();
  });

  // Inputs dentro dos cards
  resEl.addEventListener('input', e => {
    // Adjustable drug input
    if (e.target.matches('.dsl, .cmg, .cml')) {
      const wrapper = e.target.closest('.aw');
      if (wrapper) recalcAdjustable(wrapper);
      return;
    }
    // Calculator input
    if (e.target.matches('[data-calc][data-field]')) {
      recalcCalc(e.target.dataset.calc);
      return;
    }
    // Parkland special
    if (e.target.matches('[data-parkland-scq]')) {
      recalcScore('parkland');
      return;
    }
    // Score select (mas <select> dispara 'change', não 'input')
  });
  resEl.addEventListener('change', e => {
    if (e.target.matches('[data-score][data-field]')) {
      recalcScore(e.target.dataset.score);
    }
  });

  // Cliques nos cards
  resEl.addEventListener('click', e => {
    // Favorite star
    const favBtn = e.target.closest('.btn-fav');
    if (favBtn) {
      const id = favBtn.dataset.fav;
      const nowFav = Favorites.toggle(id);
      favBtn.classList.toggle('on', nowFav);
      favBtn.querySelector('i').className = nowFav ? 'fas fa-star' : 'far fa-star';
      Clipboard.showToast(nowFav ? '⭐ Adicionado aos favoritos' : 'Removido dos favoritos');
      // Atualiza contador no settings e badge na aba
      updateSettingsCounters();
      renderTabs();
      e.stopPropagation();
      return;
    }

    // Copy button
    const copyBtn = e.target.closest('.btn-copy');
    if (copyBtn) {
      const accEl = copyBtn.closest('.acc');
      if (accEl) Clipboard.copy(Clipboard.fromAccordion(accEl), 'Prescrição copiada!');
      e.stopPropagation();
      return;
    }

    // Acordeão
    const btn = e.target.closest('.acc-btn');
    if (btn) {
      const item = btn.closest('.acc');
      const body = item.querySelector('.acc-body');
      const isOpen = item.classList.contains('open');

      item.closest('.cb, .mega-grid')?.querySelectorAll('.acc.open').forEach(x => {
        if (x !== item) {
          x.classList.remove('open');
          x.querySelector('.acc-body').style.maxHeight = '0';
        }
      });

      item.classList.toggle('open', !isOpen);
      body.style.maxHeight = isOpen ? '0' : (body.scrollHeight + 60) + 'px';

      if (!isOpen) {
        const wrapper = body.querySelector('.aw');
        if (wrapper) recalcAdjustable(wrapper);
      }
      return;
    }

    // Salvar concentração padrão
    const saveBtn = e.target.closest('.btn-sv');
    if (saveBtn) {
      const wrapper = saveBtn.closest('.aw');
      const id      = wrapper.dataset.id;
      const padrao  = JSON.parse(localStorage.getItem('cp') || '{}');
      padrao[id] = {
        mg: parseFloat(wrapper.querySelector('.cmg').value),
        ml: parseFloat(wrapper.querySelector('.cml').value)
      };
      localStorage.setItem('cp', JSON.stringify(padrao));

      const conteudo = saveBtn.innerHTML;
      saveBtn.innerHTML = '<i class="fas fa-check"></i>Salvo!';
      saveBtn.style.background = 'linear-gradient(135deg,#059669,#047857)';
      setTimeout(() => { saveBtn.innerHTML = conteudo; saveBtn.style.background = ''; }, 2000);
      Clipboard.showToast('Concentração padronizada salva');
    }
  });

  // Troca de aba
  tabsEl.addEventListener('click', e => {
    const t = e.target.closest('.tab');
    if (!t) return;
    currentTab = t.dataset.cat;
    tabsEl.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    render();
  });

  /* ---------- Form de novo protocolo VIP ---------- */
  document.getElementById('fmed').addEventListener('submit', function (e) {
    e.preventDefault();
    const drugs = JSON.parse(localStorage.getItem('custom_drugs_v1') || '[]');
    drugs.push({
      id: 'custom_' + Date.now(),
      name:     document.getElementById('cn').value,
      doseMgKg: parseFloat(document.getElementById('cd').value),
      maxMg:    parseFloat(document.getElementById('cm').value) || null,
      concMg:   parseFloat(document.getElementById('ccmg').value),
      concMl:   parseFloat(document.getElementById('ccml').value),
      via:      document.getElementById('cvia').value,
      unit:     document.getElementById('cunit').value,
      obs:      document.getElementById('cobs').value
    });
    localStorage.setItem('custom_drugs_v1', JSON.stringify(drugs));

    closeModal('mmodal');
    this.reset();
    loadData();
    renderTabs();
    updateSettingsCounters();
    setTimeout(() => document.querySelector('[data-cat="custom"]')?.click(), 100);
    Clipboard.showToast('Protocolo VIP salvo');
  });

  /* ---------- Settings modal ---------- */
  function updateSettingsCounters() {
    document.getElementById('fav-count').textContent = Favorites.list().length;
    document.getElementById('vip-count').textContent =
      JSON.parse(localStorage.getItem('custom_drugs_v1') || '[]').length;
  }

  document.getElementById('theme-seg').addEventListener('click', e => {
    const b = e.target.closest('[data-theme]');
    if (!b) return;
    Theme.set(b.dataset.theme);
    refreshThemeBtn();
  });

  document.getElementById('clear-favs').addEventListener('click', () => {
    if (confirm('Limpar todos os favoritos?')) {
      Favorites.clear();
      updateSettingsCounters();
      renderTabs();
      if (pesoEl.value) render();
      Clipboard.showToast('Favoritos limpos');
    }
  });

  document.getElementById('clear-conc').addEventListener('click', () => {
    if (confirm('Restaurar concentrações padrão?')) {
      localStorage.removeItem('cp');
      if (pesoEl.value) render();
      Clipboard.showToast('Concentrações restauradas');
    }
  });

  document.getElementById('clear-vip').addEventListener('click', () => {
    if (confirm('Apagar todos os protocolos VIP?')) {
      localStorage.removeItem('custom_drugs_v1');
      loadData();
      renderTabs();
      updateSettingsCounters();
      if (pesoEl.value) render();
      Clipboard.showToast('Protocolos VIP apagados');
    }
  });

  document.getElementById('reload-app').addEventListener('click', async () => {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
    location.reload();
  });

  /* ---------- Bootstrap ---------- */
  loadData();
  renderTabs();
  updateSettingsCounters();
});
