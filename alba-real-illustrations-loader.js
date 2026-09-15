/* Loader: injects the real-illustration engine and its badge CSS without changing app.js. */
(function(){
  const add=(tag,attrs)=>{const e=document.createElement(tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));document.head.appendChild(e);return e};
  const boot=()=>{
    if(!document.querySelector('link[data-alba-real-css]')){const l=add('link',{rel:'stylesheet',href:'alba-real-illustrations.css?v=20260915-1'});l.dataset.albaRealCss='1'}
    if(!document.querySelector('script[data-alba-real-engine]')){const s=document.createElement('script');s.src='alba-real-illustrations.js?v=20260915-1';s.dataset.albaRealEngine='1';document.body.appendChild(s)}
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
