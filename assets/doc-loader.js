/* Loads a .md file and renders it into #content.
   Requires: marked.min.js (from CDN) to be loaded beforehand. */

(function () {
  window.Lampardi = window.Lampardi || {};

  window.Lampardi.loadMarkdown = async function (mdFile, targetId) {
    try {
      const res = await fetch(mdFile, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const text = await res.text();

      // Configure marked
      if (typeof marked !== 'undefined') {
        marked.setOptions({ gfm: true, breaks: false });
      }

      const html = typeof marked !== 'undefined' ? marked.parse(text) : ('<pre>' + text + '</pre>');
      const target = document.getElementById(targetId || 'content');
      if (target) {
        target.innerHTML = html;
        // Process status keywords in tables into badges
        enhanceStatusText(target);
      }
    } catch (e) {
      const target = document.getElementById(targetId || 'content');
      if (target) {
        target.innerHTML = '<p style="color: var(--red);">Не удалось загрузить документ: ' + e.message + '</p>';
      }
      console.error(e);
    }
  };

  function enhanceStatusText(root) {
    // Wrap status keywords in table cells with badges.
    const rules = [
      { re: /^DONE$/i, cls: 'badge-done' },
      { re: /^PARTIAL$/i, cls: 'badge-partial' },
      { re: /^NOT DONE$/i, cls: 'badge-notdone' },
      { re: /^NEEDS CHECK$/i, cls: 'badge-unknown' },
      { re: /^NEEDS DESIGN$/i, cls: 'badge-partial' },
      { re: /^ASK DEV$/i, cls: 'badge-unknown' },
      { re: /^ASK CLIENT$/i, cls: 'badge-blocked' },
      { re: /^CANCELLED$/i, cls: 'badge-cancelled' }
    ];
    root.querySelectorAll('table td').forEach(td => {
      const text = td.textContent.trim();
      rules.forEach(r => {
        if (r.re.test(text)) {
          td.innerHTML = '<span class="badge ' + r.cls + '">' + text + '</span>';
        }
      });
      // Also match "DONE + REDESIGN" or similar compounds — catch first token
      if (!td.querySelector('.badge') && /^(DONE|PARTIAL|NOT DONE|NEEDS CHECK|NEEDS DESIGN|ASK DEV|ASK CLIENT|CANCELLED)/i.test(text)) {
        const m = text.match(/^(DONE|PARTIAL|NOT DONE|NEEDS CHECK|NEEDS DESIGN|ASK DEV|ASK CLIENT|CANCELLED)\b/i);
        if (m) {
          const word = m[0];
          const rest = text.slice(word.length).trim();
          let cls = 'badge-unknown';
          if (/^DONE$/i.test(word)) cls = 'badge-done';
          else if (/^PARTIAL$/i.test(word)) cls = 'badge-partial';
          else if (/^NOT DONE$/i.test(word)) cls = 'badge-notdone';
          else if (/^NEEDS DESIGN$/i.test(word)) cls = 'badge-partial';
          else if (/^ASK CLIENT$/i.test(word)) cls = 'badge-blocked';
          td.innerHTML = '<span class="badge ' + cls + '">' + word + '</span>' + (rest ? ' ' + rest : '');
        }
      }
    });
  }
})();
