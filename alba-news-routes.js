(()=>{
  /*
   * ALBA NEWS usa el modal como vista de noticia, no como una ruta.
   * No escribimos ?noticia=... en la URL: hacerlo provoca que GitHub Pages
   * conserve una noticia al recargar y puede hacer que el sitio parezca no iniciar.
   */
  const init=()=>{
    try{
      if(window.history?.scrollRestoration) window.history.scrollRestoration='manual';
      const cleanUrl=()=>{
        if(location.search.includes('noticia=')){
          history.replaceState(null,document.title,location.pathname+location.hash);
        }
      };
      cleanUrl();
      window.addEventListener('pageshow',()=>cleanUrl());
      document.addEventListener('click',e=>{
        const b=e.target.closest?.('.article-open[data-id]');
        if(!b)return;
        /* Opening a story must never create a persistent browser route. */
        cleanUrl();
      },true);
    }catch(err){
      console.warn('ALBA route guard:',err);
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
