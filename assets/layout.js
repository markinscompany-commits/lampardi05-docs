/* Lampardi05 — shared layout (sidebar nav + footer). */

(function () {
  const NAV_MAIN = [
    { num: '00', id: 'index', title: 'Оглавление', href: 'index.html' },
    { num: '01', id: 'remaining', title: 'Оставшиеся работы', href: 'remaining.html' },
    { num: '02', id: 'contract', title: 'Требования ТЗ', href: 'contract.html' },
    { num: '★',  id: 'checklist', title: 'Чек-лист', href: 'checklist.html' }
  ];

  const NAV_REF = [
    { num: '—', id: 'audit', title: 'Аудит сайта', href: 'audit.html' },
    { num: '—', id: 'ux-fixes', title: 'UX-правки (Notion)', href: 'ux-fixes.html' },
    { num: '—', id: 'readme', title: 'О проекте', href: 'readme.html' },
    { num: '—', id: 'session', title: 'Журнал сессий', href: 'session.html' }
  ];

  function renderItems(items, activeId) {
    return items.map(n => {
      const active = n.id === activeId ? ' active' : '';
      return `<a class="nav-item${active}" href="${n.href}">
        <span>${n.title}</span>
        <span class="nav-item-num">${n.num}</span>
      </a>`;
    }).join('');
  }

  function buildSidebar(activeId) {
    return `
      <aside class="sidebar">
        <div class="sidebar-brand">
          <div class="sidebar-brand-logo">markins</div>
          <div class="sidebar-brand-subtitle">Lampardi05 · Docs</div>
        </div>
        <nav class="sidebar-nav">
          <div class="nav-title">Основное</div>
          ${renderItems(NAV_MAIN, activeId)}
          <div class="nav-title" style="margin-top: 16px;">Справочные</div>
          ${renderItems(NAV_REF, activeId)}
          <div class="nav-title" style="margin-top: 16px;">Сервис</div>
          <a class="nav-item" href="#" onclick="window.LampardiAuth.clearAuth();window.location.replace('login.html');return false;">
            <span>Выйти</span>
            <span class="nav-item-num">⎋</span>
          </a>
        </nav>
      </aside>
    `;
  }

  function buildFooter() {
    const now = new Date();
    const date = now.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `
      <div class="doc-footer">
        <div>© markins · Lampardi05 project docs</div>
        <div>Обновлено: ${date}</div>
      </div>
    `;
  }

  window.Lampardi = window.Lampardi || {};
  window.Lampardi.renderLayout = function (opts) {
    const active = opts && opts.active;
    const sidebarEl = document.getElementById('layout-root');
    if (sidebarEl) sidebarEl.innerHTML = buildSidebar(active);
    const mainEl = document.getElementById('main-footer');
    if (mainEl) mainEl.innerHTML = buildFooter();
  };
})();
