/* ALBA NEWS — generador visual realista bajo demanda.
   Usa el Edge Function generate-illustration y nunca expone la clave de OpenAI.
   La ilustración se genera solo cuando la tarjeta entra en pantalla y queda cacheada en Storage.
*/
(function(){
  'use strict';
  const SUPABASE_URL='https://xuilkvsehlnkqtlfkblw.supabase.co';
  const SUPABASE_KEY='sb_publishable_Mdr55DRXLuqCXIYjh5hepQ_Lx3T3-Pg';
  const ENDPOINT=`${SUPABASE_URL}/functions/v1/generate-illustration`;
  const done=new Set();
  const clean=v=>String(v||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
  const fallback=(cat='Actualidad')=>`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675"><rect width="1200" height="675" fill="#07111f"/><text x="65" y="120" fill="#16c7f2" font-size="28" font-family="Arial">ALBA NEWS · ILUSTRACIÓN EDITORIAL</text><text x="65" y="370" fill="white" font-size="76" font-weight="700" font-family="Arial">${clean(cat)}</text><text x="65" y="430" fill="#98a2b3" font-size="25" font-family="Arial">Visual original de ALBA NEWS</text></svg>`)} `;
  async function generate(img){
    if(!img||done.has(img))return;
    done.add(img);
    const card=img.closest('.card,.featured');
    const title=clean(img.alt||card?.querySelector('h2,h3')?.textContent||'Actualidad');
    const category=clean(card?.querySelector('.tag')?.textContent||'Actualidad');
    const source=clean(card?.querySelector('.source-tag')?.textContent||'Fuente periodística');
    const summary=clean(card?.querySelector('p')?.textContent||'');
    img.classList.add('alba-illustration-loading');
    try{
      const r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY},body:JSON.stringify({id:img.dataset.articleId||title,title,summary,category,source})});
      if(!r.ok)throw new Error(`HTTP ${r.status}`);
      const data=await r.json();
      if(data.url){img.src=data.url;img.dataset.albaIllustration='generated';img.alt=`Ilustración editorial ALBA NEWS: ${title}`;}
    }catch(e){console.warn('ALBA ilustración:',e.message)}finally{img.classList.remove('alba-illustration-loading')}
  }
  function scan(){
    const imgs=[...document.querySelectorAll('.card-image,.featured-media img')];
    if(!imgs.length)return;
    if(!('IntersectionObserver' in window)){imgs.slice(0,4).forEach(generate);return;}
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){io.unobserve(e.target);generate(e.target)}}),{rootMargin:'350px 0px'});
    imgs.forEach(img=>{if(!img.dataset.albaIllustration)io.observe(img)});
  }
  window.ALBA_REAL_ILLUSTRATIONS={scan};
  document.addEventListener('DOMContentLoaded',()=>{scan();setInterval(scan,3000)});
})();
