# Atalhos — Clone do app do iPhone

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
