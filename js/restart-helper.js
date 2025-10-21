// Restart Helper: clears caches, storage, and unregisters SW when ?reset=1
(function () {
  try {
    const params = new URLSearchParams(location.search);
    const shouldReset = params.get('reset') === '1';
    if (!shouldReset) return;

    const tasks = [];

    // Clear caches
    if ('caches' in window) {
      tasks.push(
        caches.keys().then((names) => Promise.all(names.map((n) => caches.delete(n))))
      );
    }

    // Clear localStorage and sessionStorage
    try { localStorage.clear(); } catch (e) {}
    try { sessionStorage.clear(); } catch (e) {}

    // Unregister service workers
    if ('serviceWorker' in navigator) {
      tasks.push(
        navigator.serviceWorker.getRegistrations().then((regs) =>
          Promise.all(
            regs.map((reg) =>
              reg.unregister().then(() => {
                // Also try to delete cache from SW scope if possible
                return Promise.resolve();
              })
            )
          )
        )
      );
    }

    Promise.all(tasks)
      .then(() => {
        // Add a small marker to bypass SW on next load
        try { sessionStorage.setItem('justReset', '1'); } catch (e) {}
        // Hard reload without reset param
        const url = new URL(location.href);
        url.searchParams.delete('reset');
        location.replace(url.toString());
      })
      .catch(() => {
        const url = new URL(location.href);
        url.searchParams.delete('reset');
        location.replace(url.toString());
      });
  } catch (err) {
    // Ignore
  }
})();
