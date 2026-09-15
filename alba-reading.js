(()=>{
 const SITE='https://cristhiansystems15.github.io/ALBA/';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const ensureMeta=(name,content,property=false)=>{let el=document.head.querySelector(`${property?'meta[property':'meta[name'}="${name}"]`);if(!el){el=document.createElement('meta');el.setAttribute(property?'property':'name',name);document.head.appendChild(el)}el.setAttribute('content',content)};
 const setSEO=()=>{
  const modal=document.getElementById('articleModal');if(!modal?.classList.contains('open'))return;
  const title=modal.querySelector('#articleModalTitle')?.textContent?.trim()||'ALBA NEWS';
  const summary=modal.querySelector('#articleModalSummary')?.textContent?.trim()||'Noticias, contexto y análisis de ALBA NEWS.';
  const source=modal.querySelector('#articleModalSource')?.textContent?.trim()||'ALBA NEWS';
  const url=location.href;
  document.title=`${title} | ALBA NEWS`;
  ensureMeta('description',summary.slice(0,155));ensureMeta('og:title',`${title} | ALBA NEWS`,true);ensureMeta('og:description',summary.slice(0,200),true);ensureMeta('og:url',url,true);ensureMeta('og:type','article',true);ensureMeta('twitter:card','summary_large_image');ensureMeta('twitter:title',`${title} | ALBA NEWS`);ensureMeta('twitter:description',summary.slice(0,200));
  let ld=document.getElementById('albaArticleLD');if(!ld){ld=document.createElement('script');ld.id='albaArticleLD';ld.type='application/ld+json';document.head.appendChild(ld)}
  ld.textContent=JSON.stringify({'@context':'https://schema.org','@type':'NewsArticle','headline':title,'description':summary,'datePublished':modal.querySelector('#articleModalDate')?.textContent||undefined,'publisher':{'@type':'Organization','name':'ALBA NEWS','url':SITE},'mainEntityOfPage':{'@type':'WebPage','@id':url},'isPartOf':{'@type':'NewsMediaOrganization','name':'ALBA NEWS','url':SITE},'sourceOrganization':{'@type':'Organization','name':source}});
 };
 const addTools=()=>{
  const modal=document.getElementById('articleModal'),content=modal?.querySelector('.article-view-content');if(!modal||!content||content.querySelector('.alba-reading-tools'))return;
  const tools=document.createElement('div');tools.className='alba-reading-tools';tools.innerHTML='<span class="alba-analysis-kicker">ALBA ANALIZA</span><button type="button" class="primary" data-alba-share>Compartir</button><button type="button" data-alba-copy>Copiar enlace</button><span class="alba-reading-status" aria-live="polite"></span>';content.insertBefore(tools,content.querySelector('section'));
  const status=tools.querySelector('.alba-reading-status');
  tools.querySelector('[data-alba-share]').onclick=async()=>{const title=modal.querySelector('#articleModalTitle')?.textContent?.trim()||'ALBA NEWS';try{if(navigator.share){await navigator.share({title:`${title} | ALBA NEWS`,text:'Lee el análisis en ALBA NEWS',url:location.href});status.textContent='Enlace compartido.'}else{await navigator.clipboard.writeText(location.href);status.textContent='Enlace copiado.'}}catch{status.textContent='No se completó el uso compartido.'}};
  tools.querySelector('[data-alba-copy]').onclick=async()=>{try{await navigator.clipboard.writeText(location.href);status.textContent='Enlace copiado al portapapeles.'}catch{status.textContent='No se pudo copiar el enlace.'}};
 };
 const observe=new MutationObserver(()=>{addTools();setSEO()});
 const init=()=>{observe.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});addTools();setSEO();window.addEventListener('popstate',()=>{setTimeout(()=>{if(!document.querySelector('.article-modal.open')){document.title='ALBA NEWS | Noticias y contexto'}else setSEO()},50)})};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();