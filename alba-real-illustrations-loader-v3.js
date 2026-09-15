/* Loader for ALBA realistic illustrations */
(function(){
  function boot(){
    if(!document.querySelector('link[href*="alba-real-illustrations.css"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='alba-real-illustrations.css?v=20260915-1';document.head.appendChild(l)}
    if(!document.querySelector('script[src*="alba-real-illustrations.js"]')){const s=document.createElement('script');s.src='alba-real-illustrations.js?v=20260915-1';document.body.appendChild(s)}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
