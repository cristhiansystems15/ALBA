/* ALBA NEWS — Capa visual segura
   Sustituye fotografías externas por ilustraciones editoriales originales.
   La imagen se construye desde el titular/sección, no desde la fotografía de terceros.
*/
(function(){
  'use strict';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const findContext=img=>{
    const card=img.closest('.card,.featured,.article-view');
    const title=card?.querySelector('h2,h3')?.textContent?.trim()||document.querySelector('#articleModalTitle')?.textContent?.trim()||'';
    const tag=card?.querySelector('.tag')?.textContent?.trim()||document.querySelector('#articleModalMeta .tag')?.textContent?.trim()||'Actualidad';
    const summary=card?.querySelector('p')?.textContent?.trim()||'';
    return {title,category:tag,summary};
  };
  const decorate=img=>{
    if(!window.ALBA_ILLUSTRATIONS||img.dataset.albaVisual==='1') return;
    const ctx=findContext(img);
    img.classList.add('article-visual');
    img.dataset.title=ctx.title;img.dataset.category=ctx.category;img.dataset.summary=ctx.summary;
    img.src=window.ALBA_ILLUSTRATIONS.svg(ctx);
    img.alt=`Ilustración editorial ALBA NEWS: ${ctx.title||ctx.category}`;
    img.dataset.albaVisual='1';
    img.removeAttribute('referrerpolicy');
    img.removeAttribute('onerror');
    const holder=img.parentElement;
    if(holder&&!holder.querySelector('.alba-illustration-credit')){
      const credit=document.createElement('span');
      credit.className='alba-illustration-credit';
      credit.textContent='Ilustración editorial · ALBA NEWS';
      holder.appendChild(credit);
    }
  };
  const scan=(root=document)=>{
    root.querySelectorAll('.featured-media img,.card-image,.article-view-image img').forEach(decorate);
  };
  document.addEventListener('DOMContentLoaded',()=>{
    scan();
    const observer=new MutationObserver(()=>scan());
    observer.observe(document.body,{childList:true,subtree:true});
  });
})();