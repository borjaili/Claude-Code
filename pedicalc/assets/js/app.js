/* ============================================================
   PediCalc — Application bootstrap
   ------------------------------------------------------------
   Orquestra: carregamento de dados, renderização das abas e
   resultados, eventos de interação e persistência local.
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const pesoEl   = document.getElementById('peso');
  const idadeEl  = document.getElementById('idade');
  const unidadeEl = document.getElementById('idu');
  const resEl    = document.getElementById('res');
  const tabsEl   = document.getElementById('tabs');
  const calcBtn  = document.getElementById('calcbtn');

  // Banco de dados em memória (DB original + protocolos VIP do usuário)
  let DATA = [];
  // Idade atual em meses (computada no cálculo)
  let idadeMesesAtual = null;

  /* ---------- Carga de dados ---------- */
  function loadData() {
    // Mapeia cada item para uma função de renderização baseada no tipo.
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
        return { name: item.name, dose };
      })
    }));

    // Protocolos VIP salvos pelo usuário
    const custom = JSON.parse(localStorage.getItem('custom_drugs_v1') || '[]');
    if (custom.length) {
      DATA.unshift({
        id: 'custom', tc: 'custom',
        name: 'MEUS PROTOCOLOS VIP',
        icon: 'fas fa-star',
        items: custom.map(d => ({
          name: d.name,
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

    const baseTabs = [
      { cat: 'all',              cls: 't-all',   icon: 'fas fa-th-large',           label: 'Mostrar Tudo', active: true },
      ...(custom.length ? [{ cat: 'custom', cls: 't-vip', icon: 'fas fa-star',     label: 'VIP' }] : []),
      { cat: 'flu',              cls: 't-fluid', icon: 'fas fa-hand-holding-water', label: 'Fluidoterapia' },
      { cat: 'anti',             cls: 't-anti',  icon: 'fas fa-bacteria',           label: 'Antimicrobianos' },
      { cat: 'analgesicos',      cls: 't-std',   icon: 'fas fa-capsules',           label: 'Analgésicos' },
      { cat: 'antiemeticos',     cls: 't-std',   icon: 'fas fa-tablets',            label: 'Antieméticos' },
      { cat: 'antialergicos',    cls: 't-std',   icon: 'fas fa-allergies',          label: 'Antialérgicos' },
      { cat: 'corticosteroides', cls: 't-std',   icon: 'fas fa-vial',               label: 'Corticosteroides' },
      { cat: 'laxantes',         cls: 't-std',   icon: 'fas fa-leaf',               label: 'Laxantes' },
      { cat: 'sedativos',        cls: 't-std',   icon: 'fas fa-bed',                label: 'Sedativos' },
      { cat: 'antidotos',        cls: 't-std',   icon: 'fas fa-shield-alt',         label: 'Antídotos' },
      { cat: 'oftalmologicos',   cls: 't-std',   icon: 'fas fa-eye',                label: 'Oftalmo' },
      { cat: 'queimaduras',      cls: 't-std',   icon: 'fas fa-fire-extinguisher',  label: 'Queimaduras' },
      { cat: 'ginecologicos',    cls: 't-std',   icon: 'fas fa-venus',              label: 'Ginecológicos' }
    ];

    tabsEl.innerHTML = baseTabs.map(t => `
      <div class="tab ${t.cls}${t.active ? ' active' : ''}" data-cat="${t.cat}">
        <i class="${t.icon}"></i>${t.label}
      </div>`).join('');
  }

  /* ---------- Construção de cards ---------- */
  function buildCard(cat, isSubcard) {
    const cor = getCategoryColor(cat);
    const cls = isSubcard ? 'subcard' : 'rcard';

    const peso = parseFloat(pesoEl.value.replace(',', '.'));
    const itensHtml = cat.items.map(item => {
      const [icon, color, bg] = getDrugIcon(item.name);
      return `
        <div class="acc">
          <button class="acc-btn">
            <div class="acc-left">
              <span class="drug-badge" style="background:${bg};color:${color}">
                <i class="${icon}"></i>
              </span>
              <span class="acc-name">${item.name}</span>
            </div>
            <div class="acc-toggle"><i class="fas fa-chevron-down"></i></div>
          </button>
          <div class="acc-body">
            <div class="acc-inner">${item.dose(peso, idadeMesesAtual)}</div>
          </div>
        </div>`;
    }).join('');

    return `
      <div class="${cls}">
        <div class="ch" style="background:${cor}">
          <i class="${cat.icon}"></i><span class="ch-text">${cat.name}</span>
        </div>
        <div class="cb">${itensHtml}</div>
      </div>`;
  }

  /* ---------- Pista visual de validação ---------- */
  function flashError(el) {
    el.style.borderColor = '#e11d48';
    el.style.boxShadow   = '0 0 0 4px rgba(225,29,72,.2)';
    el.animate(
      [
        { transform: 'translateX(-4px)' },
        { transform: 'translateX(4px)' },
        { transform: 'translateX(-3px)' },
        { transform: 'translateX(3px)' },
        { transform: 'translateX(0)' }
      ],
      { duration: 300, easing: 'ease-out' }
    );
    setTimeout(() => {
      el.style.borderColor = '';
      el.style.boxShadow   = '';
    }, 3000);
  }

  /* ---------- Banner do paciente ---------- */
  function updatePatientBand(peso, idadeNum, unidade) {
    const pb     = document.getElementById('pband');
    const pbAge  = document.getElementById('pb-age');
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

  /* ---------- Cálculo principal ---------- */
  function calc() {
    const peso = parseFloat(pesoEl.value.replace(',', '.'));
    const idade = parseFloat(idadeEl.value);
    const unidade = unidadeEl.value;

    if (isNaN(peso) || peso <= 0) {
      flashError(pesoEl);
      return;
    }

    idadeMesesAtual = (!isNaN(idade) && idade >= 0)
      ? (unidade === 'anos' ? idade * 12 : idade)
      : null;

    const abaAtiva = tabsEl.querySelector('.tab.active')?.dataset.cat || 'all';

    updatePatientBand(peso, idade, unidade);

    let html = '';

    // Alerta de teto adulto se peso >= 40kg
    if (peso >= 40) {
      html += `
        <div class="dose-alert">
          <div class="da-ico"><i class="fas fa-shield-alt"></i></div>
          <div>
            <div class="da-t">Limitador de Dose — Teto Adulto Ativo</div>
            <div class="da-p">
              Paciente com <strong>${peso} kg</strong> — doses que ultrapassariam a posologia segura
              estão sendo limitadas automaticamente. Observe os indicadores
              <span class="teto-badge on" style="font-size:10px;display:inline-flex;margin:0 4px">
                <i class="fas fa-shield-alt"></i>Teto
              </span>
              nos cards.
            </div>
          </div>
        </div>`;
    }

    // Renderiza categorias, agrupando antimicrobianos em um "mega card"
    let dentroDeAnti = false;
    DATA.forEach((cat, i) => {
      const tc = cat.tc || cat.id;
      if (abaAtiva !== 'all' && tc !== abaAtiva) return;
      if (abaAtiva === 'all' && tc === 'flu') return;  // fluidoterapia só aparece via aba específica

      if (abaAtiva === 'all') {
        if (tc === 'anti' && !dentroDeAnti) {
          html += `
            <div class="mega">
              <div class="mega-h">
                <div class="mh-icon"><i class="fas fa-bacteria"></i></div>
                <div class="mh-text">
                  <h2>ANTIMICROBIANOS — POR INDICAÇÃO</h2>
                  <p>Selecione pelo diagnóstico clínico</p>
                </div>
              </div>
              <div class="mega-body"><div class="mega-grid">`;
          dentroDeAnti = true;
        } else if (tc !== 'anti' && dentroDeAnti) {
          html += `</div></div></div>`;
          dentroDeAnti = false;
        }
      }

      const delay = i * 48;
      let card = buildCard(cat, abaAtiva === 'all' && tc === 'anti');
      card = card.replace('<div class="rcard">', `<div class="rcard" style="animation-delay:${delay}ms">`);
      html += card;
    });
    if (dentroDeAnti) html += `</div></div></div>`;

    resEl.innerHTML = html;

    // Pré-calcula medicações ajustáveis
    document.querySelectorAll('.aw').forEach(recalcAdjustable);
  }

  /* ---------- Eventos ---------- */
  // Enter nos inputs
  [pesoEl, idadeEl].forEach(el => el.addEventListener('keypress', e => {
    if (e.key === 'Enter') calc();
  }));

  // Recalcular quando trocar unidade (se peso já preenchido)
  unidadeEl.addEventListener('change', () => { if (pesoEl.value) calc(); });

  calcBtn.addEventListener('click', calc);

  // Inputs dentro dos cards (slider e concentração)
  resEl.addEventListener('input', e => {
    if (e.target.matches('.dsl, .cmg, .cml')) {
      const wrapper = e.target.closest('.aw');
      if (wrapper) recalcAdjustable(wrapper);
    }
  });

  // Cliques nos cards: acordeão e botão "Salvar concentração"
  resEl.addEventListener('click', e => {
    // Acordeão
    const btn = e.target.closest('.acc-btn');
    if (btn) {
      const item = btn.closest('.acc');
      const body = item.querySelector('.acc-body');
      const isOpen = item.classList.contains('open');

      // Fechar outros do mesmo grupo
      item.closest('.cb, .mega-grid')?.querySelectorAll('.acc.open').forEach(x => {
        if (x !== item) {
          x.classList.remove('open');
          x.querySelector('.acc-body').style.maxHeight = '0';
        }
      });

      item.classList.toggle('open', !isOpen);
      body.style.maxHeight = isOpen ? '0' : (body.scrollHeight + 40) + 'px';

      // Recalcula medicação ao abrir
      if (!isOpen) {
        const wrapper = body.querySelector('.aw');
        if (wrapper) recalcAdjustable(wrapper);
      }
    }

    // Salvar concentração como padrão
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

      // Feedback visual
      const conteudoOriginal = saveBtn.innerHTML;
      saveBtn.innerHTML = '<i class="fas fa-check"></i>Salvo!';
      saveBtn.style.background = 'linear-gradient(135deg,#059669,#047857)';
      saveBtn.animate(
        [{ transform: 'scale(.95)' }, { transform: 'scale(1.05)' }, { transform: 'scale(1)' }],
        { duration: 300, easing: 'ease-out' }
      );
      setTimeout(() => {
        saveBtn.innerHTML = conteudoOriginal;
        saveBtn.style.background = '';
      }, 2400);
    }
  });

  // Troca de aba
  tabsEl.addEventListener('click', e => {
    const t = e.target.closest('.tab');
    if (!t) return;
    tabsEl.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    if (pesoEl.value) calc();
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
    setTimeout(() => document.querySelector('[data-cat="custom"]')?.click(), 100);
  });

  /* ---------- Bootstrap ---------- */
  loadData();
  renderTabs();
});
