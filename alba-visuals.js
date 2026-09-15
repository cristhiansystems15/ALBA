/* ALBA NEWS — Capa visual editorial segura
   Prioridad: ilustración original generada por Gemini y almacenada en Supabase.
   Fallback: ilustración vectorial original local. Nunca usa fotografías externas.
*/
(function(){
  'use strict';
  const SUPABASE_URL='https://xuilkvsehlnkqtlfkblw.supabase.co';
  const SUPABASE_KEY='sb_publishable_Mdr55DRXLuqCXIYjh5hepQ_Lx3T3-Pg';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean=v=>String(v??'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
  const norm=v=>clean(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  let articlesById=new Map(),articlesByTitle=new Map(),ready=false;

  async function loadIllustrations(){
    try{
      const r=await fetch(`${SUPABASE_URL}/rest/v1/articles?select=id,title,metadata&status=eq.published&limit=500`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,Accept:'application/json'},cache:'no-store'});
      if(!r.ok)return;
      const rows=await r.json();
      rows.forEach(a=>{articlesById.set(String(a.id),a);articlesByTitle.set(norm(a.title),a)});
      ready=true; scan();
    }catch(e){console.warn('ALBA visual metadata:',e)}
  }

  function findContext(img){
    const holder=img.closest('.card,.featured,.article-view');
    const id=holder?.querySelector('[data-id]')?.dataset.id||img.closest('[data-id]')?.dataset.id||'';
    const title=holder?.querySelector('h2,h3')?.textContent?.trim()||document.querySelector('#articleModalTitle')?.textContent?.trim()||'';
    const tag=holder?.querySelector('.tag')?.textContent?.trim()||document.querySelector('#articleModalMeta .tag')?.textContent?.trim()||'Actualidad';
    const summary=holder?.querySelector('p')?.textContent?.trim()||'';
    const article=articlesById.get(String(id))||articlesByTitle.get(norm(title));
    const metadata=article?.metadata&&typeof article.metadata==='object'?article.metadata:{};
    return {id,title:article?.title||title,category:tag,summary,illustration:clean(metadata.alba_illustration_url||'')};
  }

  function decorate(img){
    if(img.dataset.albaVisual==='1'||!window.ALBA_ILLUSTRATIONS)return;
    const ctx=findContext(img);
    img.classList.add('article-visual');
    img.dataset.title=ctx.title;img.dataset.category=ctx.category;img.dataset.summary=ctx.summary;
    if(ctx.illustration){
      img.src=ctx.illustration;
      img.dataset.albaProvider='Gemini';
    }else{
      img.src=window.ALBA_ILLUSTRATIONS.svg(ctx);
      img.dataset.albaProvider='ALBA-local';
    }
    img.alt=`Ilustración editorial ALBA NEWS: ${ctx.title||ctx.category}`;
    img.dataset.albaVisual='1';
    img.removeAttribute('referrerpolicy');
    img.removeAttribute('onerror');
    const holder=img.parentElement;
    if(holder&&!holder.querySelector('.alba-illustration-credit')){
      const credit=document.createElement('span');
      credit.className='alba-illustration-credit';
      credit.textContent=ctx.illustration?'Ilustración editorial · ALBA NEWS · Gemini':'Ilustración editorial · ALBA NEWS';
      holder.appendChild(credit);
    }
  }

  function scan(root=document){
    if(!ready)return;
    root.querySelectorAll('.featured-media img,.card-image,.article-view-image img').forEach(decorate);
  }

  document.addEventListener('DOMContentLoaded',()=>{
    const observer=new MutationObserver(()=>scan());
    observer.observe(document.body,{childList:true,subtree:true});
    loadIllustrations();
  });
})();