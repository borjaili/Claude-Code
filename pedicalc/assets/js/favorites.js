/* ============================================================
   PediCalc — Favorites (estrela em cada medicação)
   ------------------------------------------------------------
   Persiste IDs favoritados em localStorage.
   O id de cada medicação é estável: para itens com d.id usa esse,
   para protocolos usa o pid, para outros usa o name normalizado.
============================================================ */

const Favorites = (() => {
  const KEY = 'pedicalc_favs';

  function load() {
    try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); }
    catch { return new Set(); }
  }
  function save(set) {
    localStorage.setItem(KEY, JSON.stringify([...set]));
  }

  let cache = load();

  return {
    /** Identifica unicamente uma medicação dentro do DB. */
    idFor(item) {
      if (item.t === 'A' && item.d?.id) return 'a:' + item.d.id;
      if (item.t === 'P' && item.pid)    return 'p:' + item.pid;
      return 'n:' + (item.name || '').toLowerCase().replace(/\s+/g, '_').slice(0, 60);
    },
    has(id)    { return cache.has(id); },
    list()     { return [...cache]; },
    isEmpty()  { return cache.size === 0; },
    toggle(id) {
      if (cache.has(id)) cache.delete(id); else cache.add(id);
      save(cache);
      return cache.has(id);
    },
    clear() { cache.clear(); save(cache); }
  };
})();
