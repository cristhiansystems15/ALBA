/* ALBA NEWS — al recargar siempre iniciar en Inicio */
(function(){
  const HOME_HASH = '#inicio';
  const forceHome = () => {
    try {
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
      history.replaceState(null, document.title, window.location.pathname + window.location.search + HOME_HASH);
    } catch (_) {}
    window.scrollTo(0,0);
  };

  // A reload must never restore a previous news/section position.
  if (performance.getEntriesByType && performance.getEntriesByType('navigation')[0]?.type === 'reload') {
    forceHome();
  }

  window.addEventListener('pageshow', function(event){
    if (event.persisted) forceHome();
  });

  // Opening a news modal is transient; it must not become a URL/history state.
  document.addEventListener('click', function(event){
    const trigger = event.target.closest?.('.article-open');
    if (!trigger) return;
    try {
      history.replaceState(null, document.title, window.location.pathname + window.location.search + HOME_HASH);
    } catch (_) {}
  }, true);
})();
