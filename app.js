'use strict';

// ============================================================
// Icon library (SVG paths) - mimics SF Symbols style
// ============================================================
const ICONS = {
    sun: '<path fill="currentColor" d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0-5v3m0 14v3M2 12h3m14 0h3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>',
    moon: '<path fill="currentColor" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    music: '<path fill="currentColor" d="M9 17V5l12-2v12M9 17a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>',
    car: '<path fill="currentColor" d="M5 13h14l-1.5-5h-11L5 13zm-2 0v6h2v-2h14v2h2v-6l-2-7H5l-2 7zm4 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm10 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>',
    home: '<path fill="currentColor" d="M12 3 2 12h3v8h5v-6h4v6h5v-8h3L12 3z"/>',
    timer: '<path fill="currentColor" d="M9 2h6v2H9V2zm3 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm1 9h-2V9h2v6z"/>',
    bolt: '<path fill="currentColor" d="M11 21L20 10h-7l2-9L4 14h7l-1 7z"/>',
    heart: '<path fill="currentColor" d="M12 21s-7-4.5-9.5-9C.5 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4 4.5 8-2.5 4.5-9.5 9-9.5 9z"/>',
    camera: '<path fill="currentColor" d="M9 3l-2 3H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3l-2-3H9zm3 14a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>',
    phone: '<path fill="currentColor" d="M20 15.5c-1.2 0-2.5-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.7-6.5-6.5l2.2-2.2c.3-.3.4-.7.2-1-.4-1.1-.6-2.4-.6-3.6 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z"/>',
    message: '<path fill="currentColor" d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>',
    mail: '<path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>',
    calendar: '<path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>',
    book: '<path fill="currentColor" d="M19 2H6a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h13V2zm-2 18H6a1 1 0 0 1 0-2h11v2zm0-4H6a3 3 0 0 0-1 .18V5a1 1 0 0 1 1-1h11v12z"/>',
    map: '<path fill="currentColor" d="M20.5 3 20 3.1 15 5 9 3 3.4 4.9c-.2.1-.4.3-.4.6V20c0 .3.2.5.5.5L9 19l6 2 5.6-1.9c.2-.1.4-.3.4-.6V3.5c0-.3-.2-.5-.5-.5zM10 5.5l4 1.4v12.1l-4-1.4V5.5z"/>',
    cloud: '<path fill="currentColor" d="M19.4 10A7 7 0 0 0 5 12a5 5 0 0 0 0 10h14a5 5 0 0 0 .4-12z"/>',
    cart: '<path fill="currentColor" d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7.2 14h9.5l3.6-7H6L5.2 5H2v2h2l3.6 7.6L6.3 17c-.2.4-.3.9 0 1.3.3.4.7.7 1.2.7h12v-2H7.5l1.1-2H17.2c.8 0 1.4-.4 1.7-1.1L22.3 9 21 8H7.2z"/>',
    play: '<path fill="currentColor" d="M8 5v14l11-7z"/>',
    star: '<path fill="currentColor" d="M12 2 15 9l8 .7-6 5.3 2 8L12 19l-7 4 2-8L1 9.7 9 9z"/>',
    bell: '<path fill="currentColor" d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V11a6 6 0 0 0-5-5.9V4a1 1 0 0 0-2 0v1.1A6 6 0 0 0 6 11v5l-2 2v1h16v-1l-2-2z"/>',
    photo: '<path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.9 13.98l2.1 2.53 3.1-3.99L18 18H6z"/>',
    wifi: '<path fill="currentColor" d="M12 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM2 9l2 2a11 11 0 0 1 16 0l2-2C16.93 3 7.08 3 2 9zm4 4 2 2a5 5 0 0 1 8 0l2-2c-3.32-3.32-8.7-3.32-12 0z"/>',
    lock: '<path fill="currentColor" d="M18 8h-1V6a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zM9 6a3 3 0 0 1 6 0v2H9V6z"/>',
    gift: '<path fill="currentColor" d="M20 6h-2.2c.1-.3.2-.6.2-1a3 3 0 0 0-5.5-1.7L12 4l-.5-.7A3 3 0 0 0 6 5c0 .4.1.7.2 1H4a2 2 0 0 0-2 2v3h9V8h2v3h9V8a2 2 0 0 0-2-2zM4 20a2 2 0 0 0 2 2h5v-9H4v7zm9 2h5a2 2 0 0 0 2-2v-7h-7v9z"/>',
    coffee: '<path fill="currentColor" d="M18 8h1a3 3 0 1 1 0 6h-1m0-6H4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V8zM6 1v3M10 1v3M14 1v3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
};

// ============================================================
// Color gradients (matches iOS Shortcuts color palette)
// ============================================================
const COLORS = {
    red:     'linear-gradient(135deg, #ff5b5b 0%, #ff2d55 100%)',
    orange:  'linear-gradient(135deg, #ff9f43 0%, #ff7b00 100%)',
    yellow:  'linear-gradient(135deg, #ffd60a 0%, #ffb700 100%)',
    green:   'linear-gradient(135deg, #34c759 0%, #248a3d 100%)',
    teal:    'linear-gradient(135deg, #5ac8fa 0%, #00a4d6 100%)',
    blue:    'linear-gradient(135deg, #0a84ff 0%, #0052cc 100%)',
    indigo:  'linear-gradient(135deg, #5e5ce6 0%, #3634a3 100%)',
    purple:  'linear-gradient(135deg, #bf5af2 0%, #8a3dc9 100%)',
    pink:    'linear-gradient(135deg, #ff375f 0%, #d70040 100%)',
    gray:    'linear-gradient(135deg, #8e8e93 0%, #545458 100%)',
    brown:   'linear-gradient(135deg, #a2845e 0%, #6b4f2a 100%)',
    mint:    'linear-gradient(135deg, #66d4cf 0%, #2eaba5 100%)',
};

const COLOR_LIST = Object.keys(COLORS);
const ICON_LIST = Object.keys(ICONS);

// ============================================================
// Default shortcuts
// ============================================================
const DEFAULT_FOLDERS = [
    { id: 'all', name: 'Todos os Atalhos', icon: 'home', color: 'blue', system: true },
    { id: 'starter', name: 'Atalhos Iniciais', icon: 'bolt', color: 'orange' },
    { id: 'morning', name: 'Manhã', icon: 'sun', color: 'yellow' },
    { id: 'night', name: 'Boa Noite', icon: 'moon', color: 'indigo' },
];

const DEFAULT_SHORTCUTS = [
    { id: 's1', name: 'Bom Dia', icon: 'sun', color: 'orange', folder: 'morning' },
    { id: 's2', name: 'Boa Noite', icon: 'moon', color: 'indigo', folder: 'night' },
    { id: 's3', name: 'Tocar Música', icon: 'music', color: 'pink', folder: 'starter' },
    { id: 's4', name: 'Voltar Pra Casa', icon: 'home', color: 'green', folder: 'starter' },
    { id: 's5', name: 'Tempo Atual', icon: 'cloud', color: 'teal', folder: 'starter' },
    { id: 's6', name: 'Cronômetro 25min', icon: 'timer', color: 'red', folder: 'starter' },
    { id: 's7', name: 'Foto Rápida', icon: 'camera', color: 'gray', folder: 'starter' },
    { id: 's8', name: 'Lista de Compras', icon: 'cart', color: 'purple', folder: 'starter' },
];

const GALLERY_ITEMS = {
    featured: [
        { name: 'Rotina Matinal', icon: 'sun', color: 'orange', subtitle: 'Comece bem o dia' },
        { name: 'Modo Descanso', icon: 'moon', color: 'indigo', subtitle: 'Hora de dormir' },
        { name: 'Levar Para Casa', icon: 'car', color: 'blue', subtitle: 'Rota mais rápida' },
        { name: 'Playlist Favorita', icon: 'music', color: 'pink', subtitle: 'Suas músicas' },
    ],
    essentials: [
        { name: 'Cronômetro', icon: 'timer', color: 'red', subtitle: 'Foco e produtividade' },
        { name: 'Despertador', icon: 'bell', color: 'yellow', subtitle: 'Acordar no horário' },
        { name: 'Mapa', icon: 'map', color: 'green', subtitle: 'Encontre lugares' },
        { name: 'Wi-Fi', icon: 'wifi', color: 'teal', subtitle: 'Conexão rápida' },
    ],
    productivity: [
        { name: 'Calendário', icon: 'calendar', color: 'red', subtitle: 'Veja seus eventos' },
        { name: 'Notas Rápidas', icon: 'book', color: 'orange', subtitle: 'Anote ideias' },
        { name: 'Email', icon: 'mail', color: 'blue', subtitle: 'Verificar caixa' },
        { name: 'Pomodoro', icon: 'timer', color: 'purple', subtitle: 'Foco em ciclos' },
    ],
};

// ============================================================
// State management
// ============================================================
const STORAGE_KEY = 'shortcuts_app_state_v1';

let state = {
    shortcuts: [],
    folders: [],
    currentFolder: 'all',
    selectMode: false,
    currentTab: 'shortcuts',
    newIcon: 'bolt',
    newColor: 'blue',
};

function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            state.shortcuts = Array.isArray(parsed.shortcuts) ? parsed.shortcuts : DEFAULT_SHORTCUTS.slice();
            state.folders = Array.isArray(parsed.folders) && parsed.folders.length ? parsed.folders : DEFAULT_FOLDERS.slice();
        } else {
            state.shortcuts = DEFAULT_SHORTCUTS.slice();
            state.folders = DEFAULT_FOLDERS.slice();
        }
    } catch (_e) {
        state.shortcuts = DEFAULT_SHORTCUTS.slice();
        state.folders = DEFAULT_FOLDERS.slice();
    }
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            shortcuts: state.shortcuts,
            folders: state.folders,
        }));
    } catch (_e) {
        // Storage might be unavailable; the app still works in-memory
    }
}

// ============================================================
// Utility
// ============================================================
function $(sel, root) { return (root || document).querySelector(sel); }
function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

function makeIconSVG(name, size) {
    const path = ICONS[name] || ICONS.bolt;
    const s = size || 32;
    return `<svg class="card-icon" viewBox="0 0 24 24" width="${s}" height="${s}">${path}</svg>`;
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function uid() {
    return 'sc_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ============================================================
// Rendering
// ============================================================
function renderShortcuts() {
    const grid = $('#shortcuts-grid');
    if (!grid) return;

    const query = ($('#search-input').value || '').trim().toLowerCase();
    let items = state.shortcuts.slice();

    if (state.currentFolder !== 'all') {
        items = items.filter(s => s.folder === state.currentFolder);
    }
    if (query) {
        items = items.filter(s => s.name.toLowerCase().includes(query));
    }

    if (items.length === 0) {
        grid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:rgba(235,235,245,0.5);">
                <div style="font-size:17px;font-weight:600;color:rgba(235,235,245,0.7);margin-bottom:6px;">Nenhum Atalho</div>
                <div style="font-size:14px;">Toque em + para criar um novo atalho.</div>
            </div>`;
        return;
    }

    grid.innerHTML = items.map(s => {
        const gradient = COLORS[s.color] || COLORS.blue;
        const selectableCls = state.selectMode ? ' selectable' : '';
        return `
            <div class="shortcut-card${selectableCls}" data-id="${s.id}" style="background:${gradient};">
                <button class="delete-btn" data-delete="${s.id}" aria-label="Apagar">×</button>
                ${makeIconSVG(s.icon, 32)}
                <div class="card-name">${escapeHtml(s.name)}</div>
            </div>`;
    }).join('');

    $$('.shortcut-card', grid).forEach(card => {
        card.addEventListener('click', onShortcutClick);
    });
    $$('[data-delete]', grid).forEach(btn => {
        btn.addEventListener('click', onDeleteClick);
    });
}

function renderFolderPills() {
    const container = $('.folder-pill-container');
    if (!container) return;

    container.innerHTML = state.folders.map(f => {
        const isActive = state.currentFolder === f.id ? ' active' : '';
        return `
            <div class="folder-pill${isActive}" data-folder="${f.id}">
                <svg viewBox="0 0 24 24" width="14" height="14">${ICONS[f.icon] || ICONS.home}</svg>
                <span>${escapeHtml(f.name)}</span>
            </div>`;
    }).join('');

    $$('.folder-pill', container).forEach(pill => {
        pill.addEventListener('click', () => {
            state.currentFolder = pill.dataset.folder;
            renderFolderPills();
            renderShortcuts();
        });
    });
}

function renderFoldersPanel() {
    const list = $('#folders-list');
    if (!list) return;

    list.innerHTML = state.folders.map(f => {
        const count = f.id === 'all'
            ? state.shortcuts.length
            : state.shortcuts.filter(s => s.folder === f.id).length;
        const gradient = COLORS[f.color] || COLORS.blue;
        const isActive = state.currentFolder === f.id ? ' active' : '';
        return `
            <div class="folder-item${isActive}" data-folder="${f.id}">
                <div class="folder-icon" style="background:${gradient};">
                    <svg viewBox="0 0 24 24" width="16" height="16">${ICONS[f.icon] || ICONS.home}</svg>
                </div>
                <div class="folder-name">${escapeHtml(f.name)}</div>
                <div class="folder-count">${count}</div>
            </div>`;
    }).join('');

    $$('.folder-item', list).forEach(item => {
        item.addEventListener('click', () => {
            state.currentFolder = item.dataset.folder;
            closeFolders();
            renderFolderPills();
            renderShortcuts();
        });
    });
}

function renderGallery() {
    ['featured', 'essentials', 'productivity'].forEach(section => {
        const el = $('#gallery-' + section);
        if (!el) return;
        el.innerHTML = GALLERY_ITEMS[section].map(item => {
            const gradient = COLORS[item.color] || COLORS.blue;
            return `
                <div class="gallery-card" data-name="${escapeHtml(item.name)}" data-icon="${item.icon}" data-color="${item.color}" style="background:${gradient};">
                    ${makeIconSVG(item.icon, 30)}
                    <div>
                        <div class="card-name">${escapeHtml(item.name)}</div>
                        <div class="card-subtitle">${escapeHtml(item.subtitle)}</div>
                    </div>
                </div>`;
        }).join('');

        $$('.gallery-card', el).forEach(card => {
            card.addEventListener('click', () => addFromGallery(card));
        });
    });
}

function renderIconPicker() {
    const picker = $('#icon-picker');
    if (!picker) return;
    picker.innerHTML = ICON_LIST.map(name => {
        const isSel = name === state.newIcon ? ' selected' : '';
        return `<div class="icon-option${isSel}" data-icon="${name}">
            <svg viewBox="0 0 24 24">${ICONS[name]}</svg>
        </div>`;
    }).join('');
    $$('.icon-option', picker).forEach(o => {
        o.addEventListener('click', () => {
            state.newIcon = o.dataset.icon;
            renderIconPicker();
        });
    });
}

function renderColorPicker() {
    const picker = $('#color-picker');
    if (!picker) return;
    picker.innerHTML = COLOR_LIST.map(name => {
        const isSel = name === state.newColor ? ' selected' : '';
        return `<div class="color-option${isSel}" data-color="${name}" style="background:${COLORS[name]};"></div>`;
    }).join('');
    $$('.color-option', picker).forEach(o => {
        o.addEventListener('click', () => {
            state.newColor = o.dataset.color;
            renderColorPicker();
        });
    });
}

// ============================================================
// Interactions
// ============================================================
function onShortcutClick(e) {
    if (e.target.closest('[data-delete]')) return;
    const card = e.currentTarget;
    if (state.selectMode) return;
    const id = card.dataset.id;
    const sc = state.shortcuts.find(s => s.id === id);
    if (!sc) return;
    runShortcut(sc, card);
}

function onDeleteClick(e) {
    e.stopPropagation();
    const id = e.currentTarget.dataset.delete;
    const card = e.currentTarget.closest('.shortcut-card');
    if (card) card.classList.add('deleting');
    setTimeout(() => {
        state.shortcuts = state.shortcuts.filter(s => s.id !== id);
        saveState();
        renderShortcuts();
        renderFoldersPanel();
    }, 280);
}

function runShortcut(sc, card) {
    if (card) {
        card.style.transform = 'scale(0.92)';
        setTimeout(() => { card.style.transform = ''; }, 180);
    }
    showToast(`Executando "${sc.name}"...`, sc.icon);
    if (navigator.vibrate) {
        try { navigator.vibrate(15); } catch (_e) { /* ignore */ }
    }
}

function showToast(msg, iconName) {
    const t = $('#toast');
    const icon = iconName ? `<svg class="toast-icon" viewBox="0 0 24 24">${ICONS[iconName] || ICONS.bolt}</svg>` : '';
    t.innerHTML = `${icon}<span>${escapeHtml(msg)}</span>`;
    t.classList.add('show');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => t.classList.remove('show'), 1800);
}

function openFolders() {
    $('#folders-panel').classList.add('open');
    $('#overlay').classList.add('show');
    renderFoldersPanel();
}

function closeFolders() {
    $('#folders-panel').classList.remove('open');
    $('#overlay').classList.remove('show');
}

function toggleSelectMode() {
    state.selectMode = !state.selectMode;
    $('#select-btn').textContent = state.selectMode ? 'Concluído' : 'Selecionar';
    renderShortcuts();
}

function openAddModal() {
    state.newIcon = 'bolt';
    state.newColor = 'blue';
    $('#new-name').value = '';
    renderIconPicker();
    renderColorPicker();
    $('#add-modal').classList.add('open');
    setTimeout(() => $('#new-name').focus(), 250);
}

function closeAddModal() {
    $('#add-modal').classList.remove('open');
}

function saveNewShortcut() {
    const name = ($('#new-name').value || '').trim();
    if (!name) {
        $('#new-name').focus();
        showToast('Digite um nome para o atalho');
        return;
    }
    const folder = state.currentFolder === 'all' ? 'starter' : state.currentFolder;
    state.shortcuts.unshift({
        id: uid(),
        name: name,
        icon: state.newIcon,
        color: state.newColor,
        folder: folder,
    });
    saveState();
    closeAddModal();
    renderShortcuts();
    renderFoldersPanel();
    showToast(`"${name}" adicionado`, state.newIcon);
}

function addFromGallery(card) {
    const name = card.dataset.name;
    if (state.shortcuts.some(s => s.name === name)) {
        showToast(`"${name}" já existe`);
        return;
    }
    state.shortcuts.unshift({
        id: uid(),
        name: name,
        icon: card.dataset.icon,
        color: card.dataset.color,
        folder: 'starter',
    });
    saveState();
    showToast(`"${name}" adicionado aos Atalhos`, card.dataset.icon);
    renderShortcuts();
    renderFoldersPanel();
}

function switchTab(tabName) {
    state.currentTab = tabName;
    $$('.tab-content').forEach(t => t.classList.remove('active'));
    $$('.tab-item').forEach(t => t.classList.remove('active'));
    const content = $('#tab-' + tabName);
    const btn = document.querySelector(`.tab-item[data-tab="${tabName}"]`);
    if (content) content.classList.add('active');
    if (btn) btn.classList.add('active');
}

// ============================================================
// Status bar clock
// ============================================================
function updateClock() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const timeStr = `${h}:${m.toString().padStart(2, '0')}`;
    const el = $('#status-time');
    if (el) el.textContent = timeStr;
}

// ============================================================
// Init
// ============================================================
function init() {
    loadState();
    renderFolderPills();
    renderShortcuts();
    renderGallery();
    renderFoldersPanel();
    updateClock();
    setInterval(updateClock, 30000);

    $('#search-input').addEventListener('input', renderShortcuts);

    $('#folders-btn').addEventListener('click', openFolders);
    $('#close-folders').addEventListener('click', closeFolders);
    $('#overlay').addEventListener('click', closeFolders);

    $('#select-btn').addEventListener('click', toggleSelectMode);
    $('#add-btn').addEventListener('click', openAddModal);
    $('#cancel-add').addEventListener('click', closeAddModal);
    $('#save-add').addEventListener('click', saveNewShortcut);

    $('#new-name').addEventListener('keydown', e => {
        if (e.key === 'Enter') saveNewShortcut();
    });

    $$('.tab-item').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Close modal when clicking outside the content
    $('#add-modal').addEventListener('click', e => {
        if (e.target.id === 'add-modal') closeAddModal();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
