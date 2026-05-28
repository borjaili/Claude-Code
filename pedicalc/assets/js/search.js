/* ============================================================
   PediCalc — Busca fuzzy global
   ------------------------------------------------------------
   Normaliza acentuação, divide por palavras e exige que todos
   os termos da query apareçam (subsequência) no texto-alvo.
============================================================ */

const Search = (() => {

  function normalize(s) {
    return (s || '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
  }

  /** Texto pesquisável para um item do DB (concatena name + tags + obs). */
  function itemText(catName, item) {
    const parts = [
      catName,
      item.name,
      item.d?.via || '',
      item.d?.obs || '',
      item.d?.titulo || '',
      (item.tags || []).join(' ')
    ];
    return normalize(parts.filter(Boolean).join(' '));
  }

  /** Verdadeiro se TODOS os tokens da query aparecem no texto. */
  function matches(query, text) {
    const tokens = normalize(query).split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return true;
    return tokens.every(tok => text.includes(tok));
  }

  /** Filtra DATA mantendo apenas categorias/itens que matched. */
  function filter(query, data) {
    if (!query || !query.trim()) return data;
    const result = [];
    for (const cat of data) {
      const catText = normalize(cat.name);
      const catHits = cat.items.filter(it => matches(query, itemText(cat.name, it)));
      if (catHits.length > 0) {
        result.push({ ...cat, items: catHits });
      } else if (matches(query, catText)) {
        // Categoria casa pelo nome → mostra tudo dela
        result.push(cat);
      }
    }
    return result;
  }

  return { normalize, matches, filter, itemText };
})();
