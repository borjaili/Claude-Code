/* ============================================================
   PediCalc — Drug Database (DB)
   ------------------------------------------------------------
   Cada entrada de categoria tem:
     - id          : identificador interno
     - tc          : "tab category" — agrupador para abas (flu, anti…)
     - name        : nome exibido no header do card
     - icon        : classe Font Awesome do header
     - items[]     : array de medicações/protocolos

   Tipos de item (campo "t"):
     - "A" : Ajustável (slider mg/kg + concentração editável)
     - "B" : Básico (cálculo direto por coeficiente, com teto)
     - "P" : Protocolo (renderizado pelo objeto PROTOCOLS)
     - "E" : Estático (texto fixo, sem cálculo)
============================================================ */

const DB = [

  /* ============================================================
     EMERGÊNCIAS — grupo "urg" (renderiza em mega-card)
  ============================================================ */

  /* ---------- Emergências e Reanimação ---------- */
  {
    id: 'emergencia', tc: 'urg',
    name: '🚨 Emergências e Reanimação',
    icon: 'fas fa-bolt-lightning',
    items: [
      { t: 'B', name: 'Adrenalina IM 1:1000 (Anafilaxia)', d: {
          co: 0.01, max: 0.5, unit: 'ml', via: 'IM (face anterolateral da coxa)',
          obs: '0,01 mg/kg/dose. Conc: 1mg/ml (1:1000). Repetir a cada 5–15 min se persistir reação.' } },
      { t: 'B', name: 'Adrenalina IV/IO 1:10.000 (PCR/Bradi)', d: {
          co: 0.1, max: 10, unit: 'ml', via: 'IV/IO bolus',
          obs: '0,01 mg/kg/dose (= 0,1 ml/kg). Repetir a cada 3–5 min em PCR. Diluir 1 ml de 1:1000 em 9 ml SF.' } },
      { t: 'A', name: 'Amiodarona (FV/TV sem pulso)', d: {
          id: 'amio', base_mg_kg: 5,
          dc: 50, ml: 1, ig: false, via: 'IV/IO bolus', mx: 300,
          obs: 'FV/TV refratária ao choque. 5 mg/kg em bolus. Pode repetir 1× (máx total 15 mg/kg). Conc: 50mg/ml.' } },
      { t: 'B', name: 'Atropina (Bradi/Atropinização)', d: {
          co: 0.08, max: 2, unit: 'ml', via: 'IV/IO',
          obs: '0,02 mg/kg/dose. Conc: 0,25mg/ml. Mín 0,1 mg (0,4 ml). Máx 0,5 mg (2 ml). Cuidado abaixo da dose mínima (bradicardia paradoxal).' } },
      { t: 'A', name: 'Bicarbonato de Sódio 8,4%', d: {
          id: 'bicarb', base_mg_kg: 1,
          dc: 1, ml: 1, ig: false, via: 'IV lento (diluir 1:1 em AD)', mx: 50,
          obs: '1 mEq/kg (= 1 ml/kg de NaHCO3 8,4%). Apenas em PCR prolongado, acidose metabólica grave ou hipercalemia.' } },
      { t: 'A', name: 'Cálcio Gluconato 10%', d: {
          id: 'caglu', base_mg_kg: 100,
          sl: { min: 60, max: 100, step: 10, default: 100 },
          dc: 100, ml: 1, ig: false, via: 'IV lento (5–10 min)', mx: 2000,
          obs: '60–100 mg/kg/dose. Conc: 100mg/ml. Cuidado: extravasamento causa necrose. Monitorar FC durante infusão.' } },
      { t: 'B', name: 'Glicose 25% (Hipoglicemia)', d: {
          co: 2, max: 100, unit: 'ml', via: 'IV bolus',
          obs: '2 ml/kg de SG 25% (= 0,5 g/kg de glicose). Alternativa: 5 ml/kg de SG 10%. Confirmar glicemia capilar antes.' } },
      { t: 'B', name: 'Naloxona (Reversão de Opioide)', d: {
          co: 0.025, max: 5, unit: 'ml', via: 'IV/IM/SC/IN',
          obs: '0,01 mg/kg/dose. Conc: 0,4mg/ml. Pode repetir a cada 2–3 min. Cuidado: meia-vida curta, reaparecimento dos sintomas.' } },
      { t: 'A', name: 'Sulfato de Magnésio 50% (Torsades/Status asmático)', d: {
          id: 'mgto', base_mg_kg: 25,
          sl: { min: 25, max: 50, step: 5, default: 25 },
          dc: 500, ml: 1, ig: false, via: 'IV lento (20 min)', mx: 2000,
          obs: '25–50 mg/kg/dose. Conc: 500mg/ml. Torsades, status asmático grave, eclâmpsia. Monitorar PA e reflexos.' } }
    ]
  },

  /* ---------- Convulsão / Status Epilepticus ---------- */
  {
    id: 'convulsao', tc: 'urg',
    name: '⚡ Convulsão / Status Epilepticus',
    icon: 'fas fa-brain',
    items: [
      { t: 'A', name: 'Diazepam IV', d: {
          id: 'diaz_iv', base_mg_kg: 0.3,
          sl: { min: 0.2, max: 0.3, step: 0.05, default: 0.3 },
          dc: 5, ml: 1, ig: false, via: 'IV lento', mx: 10,
          obs: '0,2–0,3 mg/kg/dose. Conc: 5mg/ml. Pode repetir a cada 5 min até 3 doses. Cuidado: depressão respiratória.' } },
      { t: 'B', name: 'Diazepam Retal', d: {
          co: 0.1, max: 2, unit: 'ml', via: 'Retal',
          obs: '0,5 mg/kg/dose. Conc: 5mg/ml. Pode usar a ampola IV via retal quando não há acesso venoso.' } },
      { t: 'B', name: 'Midazolam IM/IN', d: {
          co: 0.04, max: 2, unit: 'ml', via: 'IM ou Intranasal',
          obs: '0,2 mg/kg/dose. Conc: 5mg/ml. IN: dividir em narinas (máx 1ml por narina). Pico em 5–10 min.' } },
      { t: 'A', name: 'Midazolam IV', d: {
          id: 'midaz_iv', base_mg_kg: 0.1,
          sl: { min: 0.1, max: 0.2, step: 0.05, default: 0.1 },
          dc: 5, ml: 1, ig: false, via: 'IV lento', mx: 10,
          obs: '0,1–0,2 mg/kg/dose. Conc: 5mg/ml. Status refratário: considerar BIC 0,1–0,3 mg/kg/h.' } },
      { t: 'A', name: 'Fenobarbital IV', d: {
          id: 'fenob', base_mg_kg: 20,
          sl: { min: 15, max: 20, step: 1, default: 20 },
          dc: 100, ml: 1, ig: false, via: 'IV lento (máx 2 mg/kg/min)', mx: 1000,
          obs: '15–20 mg/kg/dose de ataque. Conc: 100mg/ml. Monitorar respiração e PA. Pode causar hipotensão.' } },
      { t: 'A', name: 'Fenitoína IV', d: {
          id: 'fenit', base_mg_kg: 20,
          sl: { min: 15, max: 20, step: 1, default: 20 },
          dc: 50, ml: 1, ig: false, via: 'IV em SF 0,9% (NÃO SG!)', mx: 1500,
          obs: '15–20 mg/kg/dose. Conc: 50mg/ml. Diluir em SF (precipita em SG). Velocidade máx 1 mg/kg/min. Monitorar PA e FC.' } }
    ]
  },

  /* ---------- Crise Asmática ---------- */
  {
    id: 'asma', tc: 'urg',
    name: '🫁 Crise Asmática Aguda',
    icon: 'fas fa-lungs',
    items: [
      { t: 'A', name: 'Salbutamol Nebulização', d: {
          id: 'salb_neb', base_mg_kg: 0.15,
          sl: { min: 0.1, max: 0.15, step: 0.01, default: 0.15 },
          dc: 5, ml: 1, ig: true, via: 'Nebulização com O2 6–8 L/min', mx: 5,
          obs: '0,1–0,15 mg/kg/dose. Mín 1,25 mg (5 gotas), Máx 5 mg (20 gotas). Conc: 5mg/ml. Diluir em 3 ml SF.' } },
      { t: 'E', name: 'Salbutamol Spray 100mcg (com Aerocâmara)', d: {
          titulo: '4 a 8 puffs com aerocâmara',
          via: 'Inalatório a cada 20 min × 3, depois 1–4h',
          obs: '<5 anos: 4 puffs. ≥5 anos: 8 puffs. SEMPRE com aerocâmara/espaçador em crianças.' } },
      { t: 'E', name: 'Ipratrópio Nebulização', d: {
          titulo: '250 mcg (<6a) ou 500 mcg (≥6a)',
          via: 'Nebulização junto com Salbutamol',
          obs: 'Associar nas primeiras 3 doses (a cada 20 min) em crise moderada/grave. Conc: 250mcg/ml.' } },
      { t: 'A', name: 'Sulfato de Magnésio IV (Crise Grave)', d: {
          id: 'mg_asma', base_mg_kg: 40,
          sl: { min: 25, max: 50, step: 5, default: 40 },
          dc: 500, ml: 1, ig: false, via: 'IV em SF 0,9% (20–30 min)', mx: 2000,
          obs: '25–50 mg/kg/dose. Indicado em crise grave/refratária. Monitorar PA, reflexos e ECG.' } },
      { t: 'A', name: 'Metilprednisolona IV', d: {
          id: 'metilpred', base_mg_kg: 1,
          sl: { min: 1, max: 2, step: 0.5, default: 1 },
          dc: 40, ml: 1, ig: false, via: 'IV bolus', mx: 60,
          obs: '1–2 mg/kg/dose. Conc: 40mg/ml. Máx 60 mg (sessão) ou 125 mg (status asmático).' } },
      { t: 'B', name: 'Adrenalina Neb 1:1000 (Crupe)', d: {
          co: 0.5, max: 5, unit: 'ml', via: 'Nebulização com O2',
          obs: '0,5 ml/kg de Adrenalina 1:1000 (máx 5 ml). Diluir em 3 ml de SF. Observar 4h após (efeito rebote).' } }
    ]
  },

  /* ---------- Cetoacidose Diabética ---------- */
  {
    id: 'dka', tc: 'urg',
    name: '🍬 Cetoacidose Diabética (DKA)',
    icon: 'fas fa-droplet',
    items: [
      { t: 'P', pid: 'dka_bolus',    name: 'Expansão Inicial — SF 0,9%' },
      { t: 'P', pid: 'dka_insulina', name: 'Insulina Regular em BIC' },
      { t: 'P', pid: 'dka_manut',    name: 'Manutenção (1,5× Holliday em 48h)' }
    ]
  },

  /* ---------- Drogas Vasoativas em BIC ---------- */
  {
    id: 'vasoativas', tc: 'urg',
    name: '💉 Drogas Vasoativas em BIC',
    icon: 'fas fa-heart-pulse',
    items: [
      { t: 'P', pid: 'vaso_adre', name: 'Adrenalina (Epinefrina) BIC' },
      { t: 'P', pid: 'vaso_nora', name: 'Noradrenalina BIC' },
      { t: 'P', pid: 'vaso_dopa', name: 'Dopamina BIC' },
      { t: 'P', pid: 'vaso_dobu', name: 'Dobutamina BIC' },
      { t: 'P', pid: 'vaso_milr', name: 'Milrinona BIC' }
    ]
  },

  /* ---------- Sedação / RSI ---------- */
  {
    id: 'rsi', tc: 'urg',
    name: '💤 Sedação e Indução RSI',
    icon: 'fas fa-bed-pulse',
    items: [
      { t: 'A', name: 'Fentanil IV (Analgesia/Indução)', d: {
          id: 'fent', base_mg_kg: 0.002,
          sl: { min: 0.001, max: 0.002, step: 0.0005, default: 0.002 },
          dc: 0.05, ml: 1, ig: false, via: 'IV bolus lento (2 min)', mx: 0.1,
          obs: '1–2 mcg/kg/dose. Conc: 50 mcg/ml. Cuidado: depressão respiratória e rigidez torácica.' } },
      { t: 'B', name: 'Etomidato IV', d: {
          co: 0.15, max: 15, unit: 'ml', via: 'IV bolus',
          obs: '0,3 mg/kg/dose. Conc: 2mg/ml. Indução rápida sem instabilidade hemodinâmica. Risco de insuficiência suprarrenal.' } },
      { t: 'A', name: 'Ketamina IV', d: {
          id: 'keta_iv', base_mg_kg: 1.5,
          sl: { min: 1, max: 2, step: 0.5, default: 1.5 },
          dc: 50, ml: 1, ig: false, via: 'IV bolus lento', mx: 100,
          obs: '1–2 mg/kg/dose IV. Conc: 50mg/ml. Cuidado em HIC e cardiopatia descompensada. Sialorreia: associar Atropina.' } },
      { t: 'A', name: 'Ketamina IM', d: {
          id: 'keta_im', base_mg_kg: 4,
          sl: { min: 4, max: 5, step: 0.5, default: 4 },
          dc: 50, ml: 1, ig: false, via: 'IM profundo', mx: 200,
          obs: '4–5 mg/kg/dose IM. Conc: 50mg/ml. Início em 3–5 min. Útil sem acesso venoso.' } },
      { t: 'A', name: 'Propofol IV', d: {
          id: 'prop', base_mg_kg: 1.5,
          sl: { min: 1, max: 2, step: 0.5, default: 1.5 },
          dc: 10, ml: 1, ig: false, via: 'IV bolus lento', mx: 200,
          obs: '1–2 mg/kg/dose. Conc: 10mg/ml. Pode causar hipotensão e bradicardia. Contraindicado em alergia a soja/ovo.' } },
      { t: 'A', name: 'Succinilcolina IV (Despolarizante)', d: {
          id: 'sux', base_mg_kg: 1.5,
          sl: { min: 1, max: 2, step: 0.5, default: 1.5 },
          dc: 100, ml: 1, ig: false, via: 'IV bolus', mx: 150,
          obs: '1–2 mg/kg/dose. Conc: 100mg/ml. Início rápido (~30s). Cuidado: hipercalemia, hipertermia maligna. Evitar em queimados &gt;24h, paralisia crônica.' } },
      { t: 'B', name: 'Rocurônio IV (Não-despolarizante)', d: {
          co: 0.1, max: 10, unit: 'ml', via: 'IV bolus',
          obs: '1 mg/kg/dose. Conc: 10mg/ml. Reversor: Sugamadex. Duração 30–60 min. Alternativa segura à Succinilcolina.' } }
    ]
  },

  /* ---------- Inhaloterapia / Aerossóis ---------- */
  {
    id: 'inhalo',
    name: 'INALATÓRIOS E NEBULIZAÇÕES (MANUTENÇÃO)',
    icon: 'fas fa-wind',
    items: [
      { t: 'E', name: 'Beclometasona Spray 50/250mcg', d: {
          titulo: '50–200 mcg 2× ao dia',
          via: 'Inalatório (com espaçador)',
          obs: 'Corticoide inalatório de manutenção. SEMPRE com aerocâmara em crianças. Lavar boca após uso.' } },
      { t: 'E', name: 'Budesonida Susp. p/ Nebulização', d: {
          titulo: '0,25 a 1 mg 2× ao dia',
          via: 'Nebulização com O2 6–8 L/min',
          obs: 'Lavar boca após uso. Indicado em laringite (Crupe) e asma de difícil controle.' } },
      { t: 'E', name: 'Fluticasona Spray 50/125/250mcg', d: {
          titulo: '50–100 mcg 2× ao dia',
          via: 'Inalatório (com espaçador)',
          obs: 'Corticoide inalatório de alta potência. Usar com aerocâmara.' } },
      { t: 'E', name: 'Formoterol + Budesonida (Combinado)', d: {
          titulo: '1 a 2 puffs 12/12h',
          via: 'Inalatório (com espaçador se <5 anos)',
          obs: 'Manutenção. LABA: NÃO usar isoladamente como resgate.' } },
      { t: 'E', name: 'Soro Fisiológico 0,9% Nasal', d: {
          titulo: '2 a 3 gotas em cada narina',
          via: 'Nasal',
          obs: 'Lavagem nasal a cada 3–4h. Útil em IVAS, rinite, congestão.' } }
    ]
  },

  /* ============================================================
     FLUIDOTERAPIA
  ============================================================ */

  /* ---------- Fluidoterapia ---------- */
  {
    id: 'hidra_choque', tc: 'flu',
    name: '🚨 Urgência e Choque',
    icon: 'fas fa-bolt',
    items: [{ t: 'P', pid: 'expansao', name: 'Expansão Volêmica (Bolus Rápido)' }]
  },
  {
    id: 'hidra_planoc', tc: 'flu',
    name: '⚠️ Desidratação Grave (Plano C)',
    icon: 'fas fa-procedures',
    items: [{ t: 'P', pid: 'desgrave', name: 'Desidratação Grave (Plano C - OMS)' }]
  },
  {
    id: 'hidra_manut', tc: 'flu',
    name: '💧 Manutenção Diária',
    icon: 'fas fa-tint',
    items: [{ t: 'P', pid: 'holliday', name: 'Soro de Manutenção Basal (Holliday-Segar)' }]
  },
  {
    id: 'hidra_tro', tc: 'flu',
    name: '🥤 Terapia Oral (TRO)',
    icon: 'fas fa-glass-water',
    items: [{ t: 'P', pid: 'tro', name: 'TRO (Plano B — Desidratação Leve/Mod)' }]
  },

  /* ---------- Antimicrobianos ---------- */
  {
    id: 'anti_oma', tc: 'anti',
    name: '👂 Otite Média Aguda (OMA) e Sinusite',
    icon: 'fas fa-deaf',
    items: [
      { t: 'A', name: 'Amoxicilina (Alta Dose)', d: {
          id: 'amox_oma', base_mg_kg: 30,
          sl: { min: 25, max: 30, step: 1, default: 30 },
          dc: 250, ml: 5, ig: false, via: 'VO 8/8h por 7-10 dias', mx: 1000,
          obs: 'Dose por TOMADA (80 a 90 mg/kg/dia div em 3×).' } },
      { t: 'A', name: 'Amox + Clavulanato Susp.', d: {
          id: 'amox_clav', base_mg_kg: 15,
          sl: { min: 15, max: 30, step: 5, default: 15 },
          dc: 250, ml: 5, ig: false, via: 'VO 8/8h', mx: 875,
          obs: 'Dose por TOMADA baseada na Amoxicilina (45 a 90 mg/kg/dia div em 3×).' } },
      { t: 'B', name: 'Azitromicina Susp.', d: {
          co: 0.25, max: 12.5, unit: 'ml', via: 'VO 1×/dia por 3-5 dias',
          obs: 'Máx: 12,5ml/dia (500mg) — concentração 200mg/5ml.' } },
      { t: 'A', name: 'Ceftriaxone Inj.', d: {
          id: 'ceftriaxone', base_mg_kg: 50,
          sl: { min: 50, max: 100, step: 10, default: 50 },
          dc: 1000, ml: 10, ig: false, via: 'IM/EV 1×/dia (ou 12/12h)', mx: 2000,
          obs: 'Dose ao DIA. Diluição IM: 1g em 3,5ml de Lidocaína 1%. Diluição EV: diluir em 20–50ml de SF 0,9% (30 min).' } },
      { t: 'A', name: 'Claritromicina Susp.', d: {
          id: 'claritro', base_mg_kg: 7.5,
          dc: 250, ml: 5, ig: false, via: 'VO 12/12h 7-10 dias', mx: 500,
          obs: 'Dose por TOMADA (15 mg/kg/dia div em 2×).' } }
    ]
  },
  {
    id: 'anti_faring', tc: 'anti',
    name: '🤧 Faringoamigdalite',
    icon: 'fas fa-head-side-cough',
    items: [
      { t: 'P', pid: 'benzetacil', name: 'Penicilina Benzatina Inj.' },
      { t: 'A', name: 'Amoxicilina Susp.', d: {
          id: 'amox_susp', base_mg_kg: 16.66,
          sl: { min: 15, max: 30, step: 1, default: 16.66 },
          dc: 250, ml: 5, ig: false, via: 'VO 8/8h', mx: 500,
          obs: 'Dose por TOMADA (50 a 90 mg/kg/dia div em 3×).' } },
      { t: 'B', name: 'Azitromicina Susp.', d: {
          co: 0.25, max: 12.5, unit: 'ml', via: 'VO 1×/dia por 3-5 dias',
          obs: 'Máx: 12,5ml/dia (500mg).' } },
      { t: 'A', name: 'Ceftriaxone Inj.', d: {
          id: 'ceftriaxone', base_mg_kg: 50,
          sl: { min: 50, max: 100, step: 10, default: 50 },
          dc: 1000, ml: 10, ig: false, via: 'IM/EV 1×/dia', mx: 2000,
          obs: 'Dose ao DIA (50 a 100 mg/kg/dia).' } },
      { t: 'A', name: 'Claritromicina Susp.', d: {
          id: 'claritro', base_mg_kg: 7.5,
          dc: 250, ml: 5, ig: false, via: 'VO 12/12h 7-10 dias', mx: 500,
          obs: 'Dose por TOMADA (15 mg/kg/dia div em 2×).' } }
    ]
  },
  {
    id: 'anti_pac', tc: 'anti',
    name: '🫁 Pneumonia (PAC)',
    icon: 'fas fa-lungs',
    items: [
      { t: 'A', name: 'Amoxicilina Susp.', d: {
          id: 'amox_susp', base_mg_kg: 16.66,
          sl: { min: 15, max: 30, step: 1, default: 16.66 },
          dc: 250, ml: 5, ig: false, via: 'VO 8/8h', mx: 500,
          obs: 'Dose por TOMADA (50 a 90 mg/kg/dia div em 3×).' } },
      { t: 'A', name: 'Amox + Clavulanato Susp.', d: {
          id: 'amox_clav', base_mg_kg: 15,
          sl: { min: 15, max: 30, step: 5, default: 15 },
          dc: 250, ml: 5, ig: false, via: 'VO 8/8h', mx: 875,
          obs: 'Dose por TOMADA (45 a 90 mg/kg/dia div em 3×).' } },
      { t: 'B', name: 'Azitromicina Susp.', d: {
          co: 0.25, max: 12.5, unit: 'ml', via: 'VO 1×/dia por 3-5 dias',
          obs: 'Máx: 12,5ml/dia.' } },
      { t: 'A', name: 'Ceftriaxone Inj.', d: {
          id: 'ceftriaxone', base_mg_kg: 50,
          sl: { min: 50, max: 100, step: 10, default: 50 },
          dc: 1000, ml: 10, ig: false, via: 'IM/EV 1×/dia', mx: 2000,
          obs: 'Dose ao DIA (50 a 100 mg/kg/dia).' } },
      { t: 'A', name: 'Claritromicina Susp.', d: {
          id: 'claritro', base_mg_kg: 7.5,
          dc: 250, ml: 5, ig: false, via: 'VO 12/12h 7-10 dias', mx: 500,
          obs: 'Dose por TOMADA (15 mg/kg/dia div em 2×).' } }
    ]
  },
  {
    id: 'anti_pele', tc: 'anti',
    name: '🦠 Pele e Partes Moles',
    icon: 'fas fa-hand-paper',
    items: [
      { t: 'A', name: 'Cefalexina Susp.', d: {
          id: 'cefalexina', base_mg_kg: 12.5,
          sl: { min: 12.5, max: 25, step: 2.5, default: 12.5 },
          dc: 250, ml: 5, ig: false, via: 'VO 6/6h', mx: 1000,
          obs: 'Dose por TOMADA (50 a 100 mg/kg/dia div em 4×).' } },
      { t: 'A', name: 'Clindamicina Sol. Oral', d: {
          id: 'clinda', base_mg_kg: 10,
          sl: { min: 3.3, max: 10, step: 1.1, default: 10 },
          dc: 75, ml: 5, ig: false, via: 'VO 8/8h', mx: 600,
          obs: 'Dose por TOMADA (10 a 30 mg/kg/dia div em 3× ou 4×).' } },
      { t: 'A', name: 'Sulfa + Trimetoprima Susp.', d: {
          id: 'sulfa', base_mg_kg: 4,
          sl: { min: 4, max: 5, step: 0.5, default: 4 },
          dc: 40, ml: 5, ig: false, via: 'VO 12/12h', mx: 160,
          obs: 'Dose por TOMADA baseada no TMP (8 a 10mg/kg/dia div 2×).' } }
    ]
  },
  {
    id: 'anti_itu', tc: 'anti',
    name: '🚽 Infecção Urinária (ITU)',
    icon: 'fas fa-toilet',
    items: [
      { t: 'A', name: 'Cefalexina Susp.', d: {
          id: 'cefalexina', base_mg_kg: 12.5,
          sl: { min: 12.5, max: 25, step: 2.5, default: 12.5 },
          dc: 250, ml: 5, ig: false, via: 'VO 6/6h', mx: 1000,
          obs: 'Dose por TOMADA (50 a 100 mg/kg/dia div em 4×).' } },
      { t: 'A', name: 'Nitrofurantoína Susp.', d: {
          id: 'nitro', base_mg_kg: 1.5,
          sl: { min: 1.25, max: 1.75, step: .25, default: 1.5 },
          dc: 25, ml: 5, ig: false, via: 'VO 6/6h', mx: 100,
          obs: 'Dose por TOMADA (5 a 7 mg/kg/dia). Ingerir com alimentos.' } },
      { t: 'A', name: 'Sulfa + Trimetoprima Susp.', d: {
          id: 'sulfa', base_mg_kg: 4,
          sl: { min: 4, max: 5, step: 0.5, default: 4 },
          dc: 40, ml: 5, ig: false, via: 'VO 12/12h', mx: 160,
          obs: 'Dose por TOMADA baseada no TMP (8 a 10mg/kg/dia div 2×).' } },
      { t: 'A', name: 'Ceftriaxone Inj.', d: {
          id: 'ceftriaxone', base_mg_kg: 50,
          sl: { min: 50, max: 100, step: 10, default: 50 },
          dc: 1000, ml: 10, ig: false, via: 'IM/EV 1×/dia', mx: 2000,
          obs: 'Dose ao DIA (50 a 100 mg/kg/dia).' } }
    ]
  },
  {
    id: 'anti_gastro', tc: 'anti',
    name: '🤢 Gastrointestinais e Parasitoses',
    icon: 'fas fa-stomach',
    items: [
      { t: 'A', name: 'Metronidazol Susp. (Benzoil)', d: {
          id: 'metro', base_mg_kg: 10,
          sl: { min: 10, max: 16.6, step: 1.1, default: 10 },
          dc: 40, ml: 1, ig: false, via: 'VO 8/8h', mx: 500,
          obs: 'Dose por TOMADA (30 a 50 mg/kg/dia div em 3×).' } },
      { t: 'A', name: 'Sulfa + Trimetoprima Susp.', d: {
          id: 'sulfa', base_mg_kg: 4,
          sl: { min: 4, max: 5, step: 0.5, default: 4 },
          dc: 40, ml: 5, ig: false, via: 'VO 12/12h', mx: 160,
          obs: 'Dose por TOMADA baseada no TMP (8 a 10mg/kg/dia div 2×).' } }
    ]
  },
  {
    id: 'anti_fungos', tc: 'anti',
    name: '🍄 Antifúngicos',
    icon: 'fas fa-disease',
    items: [{ t: 'P', pid: 'nistatina', name: 'Nistatina Susp. 100.000 UI/mL' }]
  },

  /* ---------- Analgésicos / Anti-inflamatórios ---------- */
  {
    id: 'analgesicos',
    name: 'ANALGÉSICOS, ANTI-INFLAMATÓRIOS...',
    icon: 'fas fa-capsules',
    items: [
      { t: 'A', name: 'Dipirona Gotas (500mg/mL)', d: {
          id: 'dip', base_mg_kg: 15,
          sl: { min: 15, max: 25, step: 1, default: 15 },
          dc: 500, ml: 1, ig: true, mx: 1000, via: 'VO 6/6h',
          obs: 'Dose: 15 a 25 mg/kg/dose. Máx 40 gotas/dose.' } },
      { t: 'A', name: 'Ibuprofeno Gotas', d: {
          id: 'ibu', base_mg_kg: 10,
          sl: { min: 5, max: 10, step: 1, default: 10 },
          dc: 50, ml: 1, ig: true, mx: 800, via: 'VO 6/6h ou 8/8h',
          contraIndicacaoMeses: 6,
          obs: 'Dose: 5 a 10 mg/kg/dose. 1 gota/kg p/ 200mg/ml.' } },
      { t: 'B', name: 'Dipirona Injetável', d: {
          co: 0.05, max: 2, unit: 'ml', via: 'IM ou EV',
          obs: 'Diluição EV: Diluir em 10–20ml de SF 0,9%. Infundir lento. (Peso/20).' } },
      { t: 'P', pid: 'cetoprofeno', name: 'Cetoprofeno Pó Injetável 100mg' },
      { t: 'B', name: 'Diclofenaco Inj. 25mg/mL', d: {
          co: 0.04, max: 3, unit: 'ml', via: 'IM profundo',
          obs: '1 mg/kg/dose. Máx: 75mg (3ml). Exclusivo IM profundo. Aplicar PURO.' } },
      { t: 'B', name: 'Escopolamina + Dipirona Inj.', d: {
          co: 0.05, max: 5, unit: 'ml', via: 'EV lento',
          obs: 'Máx: 1 Ampola (5ml). Diluir em 20ml de SF 0,9% e infundir muito lentamente.' } }
    ]
  },

  /* ---------- Antieméticos ---------- */
  {
    id: 'antiemeticos',
    name: 'ANTIEMÉTICOS E PRÓ-CINÉTICOS',
    icon: 'fas fa-tablets',
    items: [
      { t: 'A', name: 'Ondansetrona Inj. 2mg/mL', d: {
          id: 'ondan', base_mg_kg: 0.15,
          dc: 2, ml: 1, ig: false, via: 'EV lento', mx: 8,
          contraIndicacaoMeses: 6,
          obs: 'Máx 8mg/dose. Diluição EV: Diluir em 10–20ml de SF 0,9% (5 min).' } },
      { t: 'B', name: 'Metoclopramida Gotas 4mg/mL', d: {
          co: 0.5, max: 40, unit: 'gotas', via: 'VO 8/8h SN',
          obs: '1 gota = 0,2mg. Dose 0,1 mg/kg. Risco extrapiramidal.',
          contraIndicacaoMeses: 12 } },
      { t: 'B', name: 'Metoclopramida Inj. 10mg/2mL', d: {
          co: 0.02, max: 2, unit: 'ml', via: 'IM ou EV 8/8h SN',
          obs: '0,1 mg/kg/dose. Máx: 2ml. Diluição EV: 10–20ml de SF 0,9%.',
          contraIndicacaoMeses: 12 } },
      { t: 'B', name: 'Bromoprida Inj. 5mg/mL', d: {
          co: 0.02, max: 2, unit: 'ml', via: 'IM ou EV 8/8h ou 12/12h',
          obs: '0,1 mg/kg/dose. Máx: 2ml. Diluição EV: 10–20ml de SF 0,9%.',
          contraIndicacaoMeses: 12 } }
    ]
  },

  /* ---------- Anti-histamínicos ---------- */
  {
    id: 'antialergicos',
    name: 'ANTI-HISTAMÍNICOS E ANTIALÉRGICOS',
    icon: 'fas fa-allergies',
    items: [
      { t: 'B', name: 'Dexclorfeniramina Xarope 2mg/5mL', d: {
          co: 0.1, max: 5, unit: 'ml', via: 'VO 8/8h por 5 dias',
          obs: '0,05 mg/kg/dose. Máx: 5ml/dose.',
          contraIndicacaoMeses: 24 } },
      { t: 'B', name: 'Prometazina Inj. 50mg/2mL', d: {
          co: 0.02, max: 2, unit: 'ml', via: 'IM profundo',
          obs: '0,5 mg/kg. Máx: 2ml. Exclusivo IM. Aplicar PURO.',
          contraIndicacaoMeses: 24 } }
    ]
  },

  /* ---------- Laxantes ---------- */
  {
    id: 'laxantes',
    name: 'LAXANTES E ANTIÁCIDOS',
    icon: 'fas fa-leaf',
    items: [
      { t: 'P', pid: 'oleo_mineral', name: 'Óleo Mineral' },
      { t: 'P', pid: 'lactulose', name: 'Lactulose Xarope' },
      { t: 'P', pid: 'hidroxido_magnesio', name: 'Hidróxido de Magnésio Susp.' }
    ]
  },

  /* ---------- Corticosteroides ---------- */
  {
    id: 'corticosteroides',
    name: 'CORTICOSTEROIDES',
    icon: 'fas fa-vial',
    items: [
      { t: 'P', pid: 'hidrocortisona', name: 'Hidrocortisona Pó Injetável' },
      { t: 'A', name: 'Prednisolona Sol. Oral', d: {
          id: 'pred', base_mg_kg: 1,
          sl: { min: 0.5, max: 2, step: 0.1, default: 1 },
          dc: 3, ml: 1, ig: false, via: 'VO 1×/dia (Manhã)', mx: 60,
          obs: 'Dose ao DIA (1–2 mg/kg/dia). Terapia de 3 a 5 dias.' } }
    ]
  },

  /* ---------- Sedativos ---------- */
  {
    id: 'sedativos',
    name: 'SEDATIVOS E ANTIPSICÓTICOS',
    icon: 'fas fa-bed',
    items: [
      { t: 'B', name: 'Midazolam Inj. 5mg/mL', d: {
          co: 0.02, max: 2, unit: 'ml', via: 'EV ou IM lenta',
          obs: '0,1 mg/kg/dose. Máx: 2ml (10mg). Diluição EV: 10ml de SF 0,9%, infundir muito lentamente.' } },
      { t: 'B', name: 'Haloperidol Inj. 5mg/mL', d: {
          co: 0.01, max: 1, unit: 'ml', via: 'IM',
          obs: '0,05 mg/kg/dose. Máx: 1ml (5mg). Exclusivo IM. Aplicar puro.' } }
    ]
  },

  /* ---------- Antídotos ---------- */
  {
    id: 'antidotos',
    name: 'ANTÍDOTOS E ADSORVENTES',
    icon: 'fas fa-shield-alt',
    items: [
      { t: 'B', name: 'Flumazenil Inj. 0,1mg/mL', d: {
          co: 0.1, max: 10, unit: 'ml', via: 'EV',
          obs: '0,01 mg/kg/dose. Máx: 10ml (1mg). Bolus lento (15–30 seg).' } },
      { t: 'B', name: 'Naloxona Inj. 0,4mg/mL', d: {
          co: 0.025, max: 5, unit: 'ml', via: 'EV, IM ou SC',
          obs: '0,01 mg/kg/dose. Máx: 5ml (2mg). Puro ou em 10ml de SF 0,9%, EV lento.' } },
      { t: 'B', name: 'Carvão Ativado Pó Oral', d: {
          co: 1, max: 50, unit: 'g', via: 'VO ou SNG',
          obs: 'Diluir em água a 10–20%. Máx: 50g/dose.' } }
    ]
  },

  /* ---------- Oftalmológicos ---------- */
  {
    id: 'oftalmologicos',
    name: 'OFTALMOLÓGICOS',
    icon: 'fas fa-eye',
    items: [
      { t: 'E', name: 'Tobramicina Sol. Oftálmica 0,3%', d: {
          titulo: '1 a 2 gotas no olho afetado',
          via: 'Tópico 4/4h ou 6/6h' } }
    ]
  },

  /* ---------- Queimaduras ---------- */
  {
    id: 'queimaduras',
    name: 'QUEIMADURAS',
    icon: 'fas fa-fire-extinguisher',
    items: [
      { t: 'E', name: 'Sulfadiazina de Prata Creme 1%', d: {
          titulo: 'Camada de 3 a 5 mm',
          via: 'Tópico 1-2×/dia',
          obs: 'Limpar antes de aplicar.' } },
      { t: 'E', name: 'Sulfadiazina de Prata + Cério', d: {
          titulo: 'Camada fina sobre a lesão',
          via: 'Tópico 1×/dia',
          obs: 'Forma escara.' } }
    ]
  },

  /* ---------- Ginecológicos ---------- */
  {
    id: 'ginecologicos',
    name: 'GINECOLÓGICOS',
    icon: 'fas fa-venus',
    items: [
      { t: 'E', name: 'Metronidazol Gel Vaginal 10%', d: {
          titulo: '1 aplicador cheio (~5g)',
          via: 'Intravaginal 1×/dia (noite)',
          obs: 'Indicado prioritariamente para adolescentes pós-menarca/vida sexual ativa.',
          isWarning: true } }
    ]
  }
];
