(()=>{
  const init=()=>{
    const toggle=document.getElementById('searchToggle');
    const bar=document.getElementById('searchBar');
    const close=document.getElementById('searchClose');
    const input=document.getElementById('searchInput');
    if(!bar)return;
    const open=()=>{bar.classList.add('open');toggle?.setAttribute('aria-expanded','true');input?.focus()};
    const hide=()=>{bar.classList.remove('open');toggle?.setAttribute('aria-expanded','false');if(input)input.value='';input?.dispatchEvent(new Event('input'))};
    toggle?.addEventListener('click',open);
    close?.addEventListener('click',hide);
    document.addEventListener('keydown',e=>{if(e.key==='Escape')hide()});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
