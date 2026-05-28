# Apps Web Estáticos (GitHub Pages)

Coleção de aplicações web estáticas (HTML + CSS + JavaScript puro, sem build, sem dependências de servidor) prontas para rodar via GitHub Pages.

## Apps incluídos

| App | Caminho | Descrição |
| --- | ------- | --------- |
| **Atalhos (Shortcuts)** | `/` (raiz) | Clone fiel do app *Atalhos* do iPhone |
| **PediCalc**            | `/pedicalc/` | Calculadora pediátrica avançada (doses, fluidoterapia, antimicrobianos) |

---

## 1) Atalhos — Clone do app do iPhone

Clone fiel do app **Atalhos (Shortcuts)** do iPhone construído como aplicação web estática (HTML + CSS + JavaScript puro, sem dependências).

## Funcionalidades

- **3 abas**: Atalhos, Automação e Galeria — navegação pela tab bar inferior estilo iOS
- **Grade de atalhos** em cards coloridos com gradientes idênticos à paleta do iOS (vermelho, laranja, amarelo, verde, teal, azul, índigo, roxo, rosa, cinza, marrom, hortelã)
- **Criar novo atalho** (botão +) com seletor de nome, ícone e cor
- **Modo Selecionar** com botão X em cada card para apagar (com animação "wiggle" como no iOS)
- **Busca** ao vivo por nome de atalho
- **Pastas** (sidebar deslizante) com contagem de atalhos por pasta
- **Pílulas de filtro** de pasta acima da grade
- **Galeria** com seções de atalhos em destaque, essenciais e produtividade — toque para adicionar
- **Toast de execução** ao tocar em um atalho com vibração tátil quando suportada
- **Persistência** via `localStorage` — seus atalhos voltam após recarregar
- **Visual iOS** completo: status bar (relógio em tempo real, dynamic island, bateria), home indicator, blur, transições, animações

## Como rodar

Por ser um app totalmente estático, basta abrir o `index.html` no navegador. Para servir localmente:

```bash
python3 -m http.server 8000
# Acesse: http://localhost:8000
```

Para a melhor experiência, abra em **modo responsivo do navegador** (iPhone 15 Pro) ou diretamente em um celular.

## Estrutura

- `index.html` — estrutura do app, status bar, tabs e modais
- `styles.css` — visual fiel ao iOS (cores, tipografia, blur, animações)
- `app.js` — estado, renderização, interações e persistência

---

## 2) PediCalc — Calculadora Pediátrica

Ferramenta de suporte à prescrição pediátrica com cálculo automático de doses por peso, teto adulto de segurança, concentrações editáveis, protocolos de fluidoterapia (Holliday-Segar, Plano C OMS, expansão volêmica, TRO) e antimicrobianos organizados por indicação clínica.

### Funcionalidades

- **Cálculo por peso** com aplicação automática de **teto adulto** (sinalização visual quando ativo)
- **Slider de mg/kg** com faixa terapêutica configurável por medicação
- **Concentração editável** por medicação, com opção de salvar como padrão (localStorage)
- **Antimicrobianos por indicação**: OMA, faringoamigdalite, PAC, ITU, pele, gastroenterológicas, fungos
- **Protocolos de fluidoterapia**: choque, desidratação grave (Plano C), manutenção (Holliday-Segar), TRO
- **Contraindicações por idade** (banners de aviso para faixas etárias específicas)
- **Protocolos VIP** — cadastre suas próprias medicações com cálculo automático
- **Sticky tabs** com agrupamento por categoria clínica
- **100% offline** após primeiro carregamento

### Estrutura (refatorada em módulos)

```
pedicalc/
├── index.html               # Estrutura HTML semântica
└── assets/
    ├── css/
    │   └── styles.css       # Estilo organizado em 13 seções comentadas
    └── js/
        ├── db.js            # Banco de dados de medicações e protocolos
        ├── templates.js     # Templates de renderização (Basic, Adjustable, Static)
        ├── protocols.js     # Protocolos especializados (fluidoterapia, etc.)
        ├── helpers.js       # Utilitários: ícones, cores, slider, recálculo
        └── app.js           # Bootstrap, eventos, cálculo principal
```

### Como rodar

```bash
python3 -m http.server 8000
# Acesse: http://localhost:8000/pedicalc/
```

> ⚠️ **Aviso clínico**: ferramenta de **suporte** à prescrição. As doses devem ser sempre validadas pelo profissional responsável.
