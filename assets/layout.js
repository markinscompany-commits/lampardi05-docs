/* Lampardi05 — shared layout (sidebar nav + footer).
   Requires: auth-gate.js must run before this script. */

(function () {
  const NAV = [
    { num: '00', id: 'index', title: 'Оглавление', href: 'index.html' },
    { num: '01', id: 'readme', title: 'О проекте', href: 'readme.html' },
    { num: '02', id: 'contract', title: 'Требования ТЗ', href: 'contract.html' },
    { num: '03', id: 'audit', title: 'Аудит сайта', href: 'audit.html' },
    { num: '04', id: 'remaining', title: 'Оставшиеся работы', href: 'remaining.html' },
    { num: '05', id: 'ux-fixes', title: 'UX-правки (Notion)', href: 'ux-fixes.html' },
    { num: '06', id: 'session', title: 'Журнал сессий', href: 'session.html' },
    { num: '★',  id: 'checklist', title: 'Интерактивный чек-лист', href: 'checklist.html' }
  ];

  function buildSidebar(activeId) {
    const items = NAV.map(n => {
      const active = n.id === activeId ? ' active' : '';
      return `<a class="nav-item${active}" href="${n.href}">
        <span>${n.title}</span>
        <span class="nav-item-num">${n.num}</span>
      </a>`;
    }).join('');

    return `
      <aside class="sidebar">
        <div class="sidebar-brand">
          <div class="sidebar-brand-logo">markins</div>
          <div class="sidebar-brand-subtitle">Lampardi05 · Docs</div>
        </div>
        <nav class="sidebar-nav">
          <div class="nav-title">Документы</div>
          ${items}
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
    // Expect <div id="layout-root"></div> and <main id="main-root"></main>
    const sidebarEl = document.getElementById('layout-root');
    if (sidebarEl) sidebarEl.innerHTML = buildSidebar(active);
    const mainEl = document.getElementById('main-footer');
    if (mainEl) mainEl.innerHTML = buildFooter();
  };
})();
