# Apps · borjaili

Coleção de **aplicações web estáticas** (HTML + CSS + JavaScript puro, sem build, sem servidor, sem dependências). O **root** funciona como hub/landing page listando todos os apps; cada app vive em seu próprio subdiretório e pode ser acessado diretamente pelo GitHub Pages.

## Estrutura do repositório

```
/
├── index.html        # Landing page (hub com cards linkando aos apps)
├── README.md
│
├── atalhos/          # App: clone do iPhone Shortcuts
│   ├── index.html
│   ├── styles.css
│   └── app.js
│
└── pedicalc/         # App: calculadora pediátrica
    ├── index.html
    └── assets/
        ├── css/styles.css
        └── js/{db,templates,protocols,helpers,app}.js
```

## Apps disponíveis

| App | URL relativa | Descrição |
| --- | ------------ | --------- |
| **Hub (landing)** | `/`         | Lista todos os apps com cards |
| **Atalhos**       | `/atalhos/` | Clone fiel do app *Atalhos* do iPhone |
| **PediCalc**      | `/pedicalc/`| Calculadora pediátrica (doses, fluidoterapia, antimicrobianos) |

---

## Como rodar localmente

Todos os apps são estáticos. Sirva o repositório inteiro de uma vez:

```bash
python3 -m http.server 8000
# Hub:      http://localhost:8000/
# Atalhos:  http://localhost:8000/atalhos/
# PediCalc: http://localhost:8000/pedicalc/
```

## Como publicar no GitHub Pages

1. **Settings** → **Pages**
2. **Source**: `Deploy from a branch`
3. **Branch**: `main` · **Folder**: `/(root)`
4. Save

O Pages serve o `index.html` do root como página inicial e cada subdiretório fica acessível em `https://<usuario>.github.io/<repo>/<subdir>/`.

## Adicionando um novo app

1. Crie um diretório novo no root: `mkdir meu-app/`
2. Coloque um `index.html` (e CSS/JS) dentro dele
3. **Opcional**: adicione um card novo em `/index.html` linkando para o app
4. Commit + push — o Pages publica automaticamente

> Cada app é **totalmente independente**: pode ter sua própria stack de arquivos, sua própria estrutura interna, e usar caminhos relativos sem conflito com os outros apps.

---

## Detalhes dos apps

### Atalhos (`/atalhos/`)

Clone fiel do app **Atalhos (Shortcuts)** do iPhone construído como aplicação web estática.

**Funcionalidades:**
- 3 abas: Atalhos, Automação e Galeria — navegação pela tab bar inferior estilo iOS
- Grade de atalhos em cards coloridos com gradientes da paleta do iOS
- Criar novo atalho com seletor de nome, ícone e cor
- Modo Selecionar com animação "wiggle"
- Busca ao vivo, pastas (sidebar), pílulas de filtro
- Galeria com seções de destaque, essenciais e produtividade
- Toast de execução com vibração tátil quando suportada
- Persistência via `localStorage`
- Visual iOS completo: status bar, dynamic island, home indicator, blur, transições

### PediCalc (`/pedicalc/`)

Ferramenta de suporte à prescrição pediátrica com cálculo automático de doses por peso.

**Funcionalidades:**
- Cálculo por peso com aplicação automática de **teto adulto**
- Slider de mg/kg com faixa terapêutica configurável por medicação
- Concentração editável por medicação, salva como padrão (localStorage)
- Antimicrobianos por indicação: OMA, faringo, PAC, ITU, pele, GI, fungos
- Protocolos de fluidoterapia: choque, Plano C OMS, Holliday-Segar, TRO
- Contraindicações por idade
- Protocolos VIP — cadastre suas próprias medicações
- 100% offline após primeiro carregamento

**Estrutura modular:**

```
pedicalc/
├── index.html
└── assets/
    ├── css/styles.css       # 13 seções comentadas
    └── js/
        ├── db.js            # Banco de medicações (21 categorias, 55 itens)
        ├── templates.js     # renderBasic, renderAdjustable, renderStatic
        ├── protocols.js     # Holliday-Segar, Plano C, TRO, etc.
        ├── helpers.js       # ícones, cores, slider, recálculo
        └── app.js           # bootstrap, eventos, calc principal
```

> ⚠️ **Aviso clínico**: ferramenta de **suporte** à prescrição. Doses devem ser sempre validadas pelo profissional responsável.
