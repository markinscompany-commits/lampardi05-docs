/* Auth gate for Lampardi05 docs.
   Not crypto-strong — just a simple gate to keep casual visitors out.
   The password hash is stored; on correct input, a flag is set in localStorage. */

(function () {
  const FLAG_KEY = 'lampardi05_auth_ok';
  const EXPECTED_HASH = 'a7c8adfd7142f08492d7572b9a1cf8e204737bbc3aefd64cbf703e17d32dfd11'; // sha256('MARK647')

  async function sha256(text) {
    const buf = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  function isAuthed() {
    return localStorage.getItem(FLAG_KEY) === '1';
  }

  function setAuthed() {
    localStorage.setItem(FLAG_KEY, '1');
  }

  function clearAuth() {
    localStorage.removeItem(FLAG_KEY);
  }

  // On non-login pages: redirect to login if not authed.
  // A page opts out by setting window.__noGate = true before loading this script.
  if (!window.__noGate && !isAuthed()) {
    // All pages live flat at repo root, so replacing the last path segment works.
    const parts = location.pathname.split('/');
    parts[parts.length - 1] = 'login.html';
    window.location.replace(parts.join('/') + location.search + location.hash);
  }

  // Expose helpers for login/logout.
  window.LampardiAuth = {
    sha256,
    isAuthed,
    setAuthed,
    clearAuth,
    expected: EXPECTED_HASH,
    async tryLogin(password) {
      const h = await sha256(password);
      if (h === EXPECTED_HASH) {
        setAuthed();
        return true;
      }
      return false;
    }
  };
})();
