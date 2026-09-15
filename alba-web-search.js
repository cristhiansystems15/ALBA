(()=>{
 const ENDPOINT='https://xuilkvsehlnkqtlfkblw.supabase.co/functions/v1/web-search';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const init=()=>{
  const input=document.getElementById('searchInput'),bar=document.getElementById('searchBar'),grid=document.getElementById('newsGrid');
  if(!input||!bar||!grid)return;
  let timer=0,token=0;
  const remove=()=>document.getElementById('albaWebResults')?.remove();
  const show=(q,data)=>{
   remove(); if(!data?.results?.length)return;
   const sec=document.createElement('section');sec.id='albaWebResults';sec.className='alba-web-results';
   const r=data.results||[],a=data.research;
   sec.innerHTML=`<div class="alba-web-head"><div><span>INVESTIGACIÓN ALBA</span><h2>Encontramos información sobre “${esc(q)}”</h2><p>Resultados disponibles en la web. ALBA los presenta como información externa y mantiene la fuente visible.</p></div><strong>${r.length} resultados</strong></div>${a?`<div class="alba-research"><div class="alba-research-label">ALBA INVESTIGA</div><h3>${esc(a.what_is_happening||'Síntesis disponible')}</h3><div class="alba-research-grid"><div><b>LO CONFIRMADO</b><ul>${(a.known_so_far||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div><b>DATOS CLAVE</b><ul>${(a.key_data||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div><b>IMPACTO EN HONDURAS</b><p>${esc(a.honduras_impact||'No determinado con la información disponible.')}</p></div><div><b>QUÉ VIGILAR</b><ul>${(a.what_to_watch||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div>${(a.pending_confirmation||[]).length?`<div class="alba-pending"><b>⚠ PENDIENTE DE CONFIRMACIÓN</b><span>${(a.pending_confirmation||[]).map(esc).join(' · ')}</span></div>`:''}</div>`:''}<div class="alba-web-list">${r.map(x=>`<article class="alba-web-card"><div class="alba-web-source">${esc(x.source||'Fuente web')} · ${esc(x.pubDate||'')}</div><h3>${esc(x.title)}</h3><p>${esc(x.snippet||'')}</p><a href="${esc(x.link)}" target="_blank" rel="noopener noreferrer">Ver fuente original ↗</a></article>`).join('')}</div>`;
   grid.parentElement.insertBefore(sec,grid);
  };
  const search=async q=>{const clean=q.trim();if(clean.length<3){remove();return}const my=++token;remove();const sec=document.createElement('section');sec.id='albaWebResults';sec.className='alba-web-results loading';sec.innerHTML='<div class="alba-web-loading"><span></span><b>ALBA está investigando en Internet…</b><small>Buscando información reciente y fuentes disponibles.</small></div>';grid.parentElement.insertBefore(sec,grid);try{const r=await fetch(`${ENDPOINT}?q=${encodeURIComponent(clean)}`,{headers:{Accept:'application/json'},cache:'no-store'});const data=await r.json();if(my!==token)return;if(!data.ok)throw Error('search');show(clean,data)}catch(e){if(my!==token)return;sec.className='alba-web-results error';sec.innerHTML='<b>No pudimos completar la investigación web en este momento.</b><span>La búsqueda local de ALBA sigue disponible.</span>'}};
  input.addEventListener('input',()=>{clearTimeout(timer);const q=input.value;timer=setTimeout(()=>search(q),650)});
  document.getElementById('searchClose')?.addEventListener('click',remove);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();