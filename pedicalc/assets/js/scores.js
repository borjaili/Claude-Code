/* ============================================================
   PediCalc — Scores clínicos
   ------------------------------------------------------------
   Cada score declara:
     - id          : identificador único
     - name        : nome exibido
     - icon        : ícone FA
     - color       : cor do header
     - desc        : descrição
     - questions[] : perguntas com opções pontuadas
     - interpret(score, peso, idadeMeses, extras?) → {classe, cor, texto}
============================================================ */

const SCORES = [

  /* ---------- APGAR ---------- */
  {
    id: 'apgar',
    name: 'APGAR (1º / 5º minuto)',
    icon: 'fas fa-baby',
    color: '#db2777',
    desc: 'Avaliação do recém-nascido. Aplicado no 1º e 5º minuto após o nascimento.',
    questions: [
      { id: 'a', label: 'A — Aparência (cor)',
        options: [
          { v: 0, t: 'Cianose central / palidez' },
          { v: 1, t: 'Acrocianose' },
          { v: 2, t: 'Rosado' }
        ]},
      { id: 'p', label: 'P — Pulso (FC)',
        options: [
          { v: 0, t: 'Ausente' },
          { v: 1, t: '< 100 bpm' },
          { v: 2, t: '≥ 100 bpm' }
        ]},
      { id: 'g', label: 'G — Gesticulação (resposta a estímulo)',
        options: [
          { v: 0, t: 'Sem resposta' },
          { v: 1, t: 'Caretas' },
          { v: 2, t: 'Tosse, espirro, choro vigoroso' }
        ]},
      { id: 'a2', label: 'A — Atividade (tônus muscular)',
        options: [
          { v: 0, t: 'Flácido' },
          { v: 1, t: 'Alguma flexão' },
          { v: 2, t: 'Movimentação ativa' }
        ]},
      { id: 'r', label: 'R — Respiração',
        options: [
          { v: 0, t: 'Ausente' },
          { v: 1, t: 'Irregular / fraca' },
          { v: 2, t: 'Choro forte, regular' }
        ]}
    ],
    interpret(score) {
      let classe, cor, texto;
      if (score <= 3)      { classe = 'Grave';        cor = '#dc2626'; texto = 'Asfixia grave — reanimação imediata.'; }
      else if (score <= 6) { classe = 'Moderado';     cor = '#f59e0b'; texto = 'Asfixia moderada — suporte ventilatório.'; }
      else                 { classe = 'Boa vitalidade'; cor = '#16a34a'; texto = 'Recém-nascido com boa vitalidade.'; }
      return { classe, cor, texto };
    }
  },

  /* ---------- Glasgow Pediátrico (P-GCS) ---------- */
  {
    id: 'glasgow',
    name: 'Glasgow Pediátrico (P-GCS)',
    icon: 'fas fa-brain',
    color: '#7c3aed',
    desc: 'Escala de coma adaptada para crianças < 5 anos. Para ≥ 5 anos use Glasgow padrão.',
    questions: [
      { id: 'eye', label: 'Abertura ocular',
        options: [
          { v: 1, t: 'Sem abertura' },
          { v: 2, t: 'À dor' },
          { v: 3, t: 'À fala' },
          { v: 4, t: 'Espontânea' }
        ]},
      { id: 'verb', label: 'Resposta verbal',
        options: [
          { v: 1, t: 'Sem resposta' },
          { v: 2, t: 'Geme à dor' },
          { v: 3, t: 'Choro inadequado / irritável' },
          { v: 4, t: 'Choro consolável / interage' },
          { v: 5, t: 'Sorri, balbucia, segue objetos' }
        ]},
      { id: 'mot', label: 'Resposta motora',
        options: [
          { v: 1, t: 'Sem resposta' },
          { v: 2, t: 'Extensão à dor (descerebração)' },
          { v: 3, t: 'Flexão anormal (decorticação)' },
          { v: 4, t: 'Retirada à dor' },
          { v: 5, t: 'Localiza a dor' },
          { v: 6, t: 'Obedece comandos / movimento espontâneo' }
        ]}
    ],
    interpret(score) {
      let classe, cor, texto;
      if (score <= 8)        { classe = 'TCE Grave';     cor = '#dc2626'; texto = 'Indicação de IOT e neuroimagem urgente.'; }
      else if (score <= 12)  { classe = 'TCE Moderado';  cor = '#f59e0b'; texto = 'Observação intensiva, considerar TC.'; }
      else                   { classe = 'TCE Leve';      cor = '#16a34a'; texto = 'Observação clínica.'; }
      return { classe, cor, texto };
    }
  },

  /* ---------- Parkland (Queimadura) ---------- */
  {
    id: 'parkland',
    name: 'Parkland (Reposição em Queimadura)',
    icon: 'fas fa-fire',
    color: '#ea580c',
    desc: 'Volume de Ringer Lactato nas primeiras 24h em paciente queimado. Use SCQ (% superfície corporal queimada).',
    custom: 'parkland',
    inputs: [
      { id: 'scq', label: 'SCQ — Superfície Corporal Queimada (%)', placeholder: 'Ex: 20', step: '1', min: 0, max: 100 }
    ]
  },

  /* ---------- Centor modificado (Faringoamigdalite estrep) ---------- */
  {
    id: 'centor',
    name: 'Centor Modificado (McIsaac)',
    icon: 'fas fa-head-side-cough',
    color: '#0d9488',
    desc: 'Probabilidade de faringoamigdalite estreptocócica. Indica necessidade de cultura/teste rápido.',
    questions: [
      { id: 'febre',  label: 'Febre > 38°C',
        options: [{ v: 0, t: 'Não' }, { v: 1, t: 'Sim' }] },
      { id: 'tosse',  label: 'Ausência de tosse',
        options: [{ v: 0, t: 'Tem tosse' }, { v: 1, t: 'Sem tosse' }] },
      { id: 'linf',   label: 'Adenopatia cervical anterior dolorosa',
        options: [{ v: 0, t: 'Ausente' }, { v: 1, t: 'Presente' }] },
      { id: 'exsud',  label: 'Exsudato / hipertrofia amigdaliana',
        options: [{ v: 0, t: 'Ausente' }, { v: 1, t: 'Presente' }] },
      { id: 'idade',  label: 'Idade',
        options: [
          { v: 1, t: '3 a 14 anos' },
          { v: 0, t: '15 a 44 anos' },
          { v: -1, t: '≥ 45 anos' }
        ]}
    ],
    interpret(score) {
      let classe, cor, texto;
      if (score <= 0)      { classe = 'Risco muito baixo'; cor = '#16a34a'; texto = '≤ 2,5% de estrep. Não testar nem tratar.'; }
      else if (score === 1){ classe = 'Risco baixo';       cor = '#16a34a'; texto = '~5–10%. Não testar nem tratar.'; }
      else if (score === 2){ classe = 'Risco intermediário'; cor = '#f59e0b'; texto = '~11–17%. Considerar teste rápido.'; }
      else if (score === 3){ classe = 'Risco moderado';    cor = '#f59e0b'; texto = '~28–35%. Teste rápido; tratar se positivo.'; }
      else                 { classe = 'Risco alto';         cor = '#dc2626'; texto = '~51–53%. Testar e tratar empiricamente.'; }
      return { classe, cor, texto };
    }
  }
];
