/* ============================================================
   PediCalc — Calculadoras clínicas
   ------------------------------------------------------------
   Cada calculadora declara:
     - id          : identificador único
     - name        : nome exibido
     - icon        : ícone FA
     - color       : cor do header
     - desc        : descrição curta
     - inputs[]    : inputs locais (peso/idade vêm globais)
     - compute(peso, idadeMeses, valores) → {value, unit, formula, notes, items?}
============================================================ */

const CALCULATORS = [

  /* ---------- BSA (Mosteller) ---------- */
  {
    id: 'bsa',
    name: 'Superfície Corporal (BSA)',
    icon: 'fas fa-child',
    color: '#0ea5e9',
    desc: 'Fórmula de Mosteller — usada em quimioterapia, fluidoterapia e cálculo de doses oncológicas.',
    inputs: [
      { id: 'altura', label: 'Altura (cm)', placeholder: 'Ex: 100', step: '0.1', min: 30 }
    ],
    compute(peso, idM, v) {
      const alt = parseFloat(v.altura);
      if (!alt || alt <= 0) return null;
      const bsa = Math.sqrt((peso * alt) / 3600);
      return {
        value: bsa.toFixed(2),
        unit: 'm²',
        formula: `√(${peso}kg × ${alt}cm / 3600)`,
        notes: 'Mosteller (1987). Para BSA &gt; 2 m² considere também DuBois.'
      };
    }
  },

  /* ---------- Tamanho TOT ---------- */
  {
    id: 'tot',
    name: 'Tamanho do Tubo Orotraqueal (TOT)',
    icon: 'fas fa-lungs',
    color: '#e11d48',
    desc: 'Diâmetro interno (DI) da cânula. Use idade em anos.',
    inputs: [],
    compute(peso, idM) {
      if (idM === null) return { error: 'Informe a idade do paciente.' };
      const idA = idM / 12;
      if (idA < 1) {
        return {
          value: '3,0 — 3,5',
          unit: 'mm',
          formula: 'Lactente: 3,0 mm sem cuff | 3,5 mm com cuff',
          notes: 'Recém-nascido a termo: 3,0–3,5 mm. Prematuro: 2,5–3,0 mm.'
        };
      }
      const semCuff = (idA / 4) + 4;
      const comCuff = (idA / 4) + 3.5;
      const prof    = semCuff * 3;
      return {
        value: `${semCuff.toFixed(1)} / ${comCuff.toFixed(1)}`,
        unit: 'mm (s/cuff · c/cuff)',
        formula: '(idade/4 + 4) s/cuff · (idade/4 + 3,5) c/cuff',
        notes: `Profundidade ideal (lábio→carina): ~${prof.toFixed(1)} cm (tamanho × 3).`,
        items: [
          { label: 'TOT sem cuff', value: semCuff.toFixed(1) + ' mm' },
          { label: 'TOT com cuff', value: comCuff.toFixed(1) + ' mm' },
          { label: 'Profundidade', value: prof.toFixed(1) + ' cm' }
        ]
      };
    }
  },

  /* ---------- Sonda Nasogástrica (SNG) ---------- */
  {
    id: 'sng',
    name: 'Sonda Nasogástrica (SNG/SOG)',
    icon: 'fas fa-syringe',
    color: '#f59e0b',
    desc: 'Calibre por idade/peso e comprimento NEX (nariz → orelha → xifoide).',
    inputs: [
      { id: 'nex', label: 'Comprimento NEX (cm) — opcional', placeholder: 'Ex: 45', step: '0.1' }
    ],
    compute(peso, idM, v) {
      let calibre;
      if (peso < 3)        calibre = '5';
      else if (peso < 7)   calibre = '6 — 8';
      else if (peso < 15)  calibre = '8 — 10';
      else if (peso < 30)  calibre = '10 — 12';
      else                 calibre = '12 — 14';

      const nex = parseFloat(v.nex);
      const items = [{ label: 'Calibre sugerido', value: calibre + ' Fr' }];
      if (nex && nex > 0) {
        items.push({ label: 'Inserção (NEX)', value: nex.toFixed(1) + ' cm' });
      }

      return {
        value: calibre,
        unit: 'Fr',
        formula: 'Calibre por peso · Comprimento = nariz → orelha → xifoide (NEX)',
        notes: 'Confirme posicionamento por radiografia ou aspirado gástrico ácido.',
        items
      };
    }
  },

  /* ---------- Sonda Vesical de Demora (SVD) ---------- */
  {
    id: 'svd',
    name: 'Sonda Vesical (SVD/Foley)',
    icon: 'fas fa-toilet',
    color: '#0891b2',
    desc: 'Calibre apropriado por peso/idade.',
    inputs: [],
    compute(peso, idM) {
      let calibre;
      if (peso < 3)        calibre = '4 — 5';
      else if (peso < 15)  calibre = '6 — 8';
      else if (peso < 30)  calibre = '8 — 10';
      else                 calibre = '10 — 14';

      return {
        value: calibre,
        unit: 'Fr',
        formula: 'Por peso corporal',
        notes: 'Lubrifique generosamente. Confirme retorno de urina antes de insuflar balão.'
      };
    }
  },

  /* ---------- IMC + classificação ---------- */
  {
    id: 'imc',
    name: 'Índice de Massa Corporal (IMC)',
    icon: 'fas fa-weight-scale',
    color: '#16a34a',
    desc: 'IMC = peso / altura². Interpretação clínica adicional necessária para percentil OMS.',
    inputs: [
      { id: 'altura', label: 'Altura (cm)', placeholder: 'Ex: 100', step: '0.1', min: 30 }
    ],
    compute(peso, idM, v) {
      const alt = parseFloat(v.altura);
      if (!alt || alt <= 0) return null;
      const altM = alt / 100;
      const imc  = peso / (altM * altM);

      let categoria, cor;
      if (idM !== null && idM < 24) {
        categoria = 'Use curvas OMS específicas para &lt; 2 anos';
        cor = '#8392ad';
      } else if (imc < 14)        { categoria = 'Magreza acentuada';     cor = '#dc2626'; }
      else if (imc < 17)          { categoria = 'Magreza';                cor = '#f59e0b'; }
      else if (imc < 25)          { categoria = 'Eutrofia';               cor = '#16a34a'; }
      else if (imc < 30)          { categoria = 'Sobrepeso';              cor = '#f59e0b'; }
      else                        { categoria = 'Obesidade';              cor = '#dc2626'; }

      return {
        value: imc.toFixed(1),
        unit: 'kg/m²',
        formula: `${peso}kg / (${altM.toFixed(2)}m)²`,
        notes: `Categoria: <strong style="color:${cor}">${categoria}</strong>. Em pediatria, confirme com percentil OMS.`
      };
    }
  },

  /* ---------- Necessidade calórica diária ---------- */
  {
    id: 'kcal',
    name: 'Necessidade Calórica Diária',
    icon: 'fas fa-utensils',
    color: '#a855f7',
    desc: 'Estimativa baseada em Holliday-Segar (cal = ml de manutenção).',
    inputs: [],
    compute(peso) {
      const kcal = peso <= 10 ? peso * 100
                 : (peso <= 20 ? 1000 + (peso - 10) * 50 : 1500 + (peso - 20) * 20);
      return {
        value: kcal.toFixed(0),
        unit: 'kcal/dia',
        formula: 'Holliday-Segar: 100 (≤10kg) + 50 (10-20kg) + 20 (&gt;20kg)',
        notes: 'Estimativa basal. Ajustar conforme fase de doença, febre (+12%/°C), trauma e cirurgia.'
      };
    }
  },

  /* ---------- Idade gestacional corrigida ---------- */
  {
    id: 'igc',
    name: 'Idade Gestacional Corrigida',
    icon: 'fas fa-baby',
    color: '#db2777',
    desc: 'Para prematuros: idade cronológica menos as semanas que faltaram para 40s.',
    inputs: [
      { id: 'igNasc',  label: 'IG ao nascer (semanas)', placeholder: 'Ex: 32', step: '0.1', min: 22 }
    ],
    compute(peso, idM, v) {
      if (idM === null) return { error: 'Informe a idade pós-natal nos campos superiores.' };
      const igNasc = parseFloat(v.igNasc);
      if (!igNasc) return null;
      const semanasPosNasc = idM * 4.345;
      const semanasFalt    = 40 - igNasc;
      const igc            = semanasPosNasc - semanasFalt;
      return {
        value: igc.toFixed(1),
        unit: 'semanas',
        formula: `${semanasPosNasc.toFixed(1)} (pós-natal) − ${semanasFalt.toFixed(1)} (falta p/ termo)`,
        notes: 'Útil até ~2 anos de idade cronológica. Após, usar idade cronológica padrão.'
      };
    }
  }
];
