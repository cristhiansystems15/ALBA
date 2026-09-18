document.addEventListener('DOMContentLoaded',()=>{
 const grid=document.getElementById('newsGrid');
 if(!grid)return;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const getCards=()=>[...grid.querySelectorAll('.card')];
 const addTopStories=()=>{
  const cards=getCards().slice(0,6); if(!cards.length)return;
  let sec=document.getElementById('albaTopStories');
  if(!sec){
   sec=document.createElement('section');sec.id='albaTopStories';sec.className='alba-top-stories';
   sec.innerHTML='<div class="alba-top-head"><div><span>ALBA · HOY</span><h2>Lo más importante</h2></div><p>Una selección rápida de las historias que merecen tu atención.</p></div><div class="alba-top-list"></div>';
   grid.parentElement.insertBefore(sec,grid);
  }
  const list=sec.querySelector('.alba-top-list');
  list.innerHTML='';
  cards.forEach((card,i)=>{
   const title=card.querySelector('h3')?.textContent||'';
   const btn=card.querySelector('.article-open');
   const id=btn?.dataset.id||'';
   const sourceImg=card.querySelector('img')?.src||'';
   const item=document.createElement('button');item.type='button';item.className='alba-top-item';item.dataset.id=id;
   item.innerHTML='<span class="alba-top-thumb"><img src="'+esc(sourceImg)+'" alt="" loading="lazy"></span><b>0'+(i+1)+'</b><span class="alba-top-title">'+esc(title)+'</span><em>Leer →</em>';
   item.onclick=()=>{document.querySelector('.article-open[data-id="'+CSS.escape(id)+'"]')?.click()};
   list.appendChild(item);
  });
 };
 window.addEventListener('alba:news-rendered',addTopStories);
});
