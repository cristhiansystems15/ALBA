document.addEventListener('DOMContentLoaded',()=>{
  const year=document.getElementById('year');
  if(year) year.textContent=new Date().getFullYear();

  const grid=document.getElementById('newsGrid');
  const filters=document.getElementById('categoryFilters');
  const input=document.getElementById('searchInput');
  const empty=document.getElementById('emptyState');
  const searchBar=document.getElementById('searchBar');
  let activeCategory='Todas';

  const render=()=>{
    const query=(input?.value||'').trim().toLowerCase();
    const items=(window.ALBA_CONTENT?.featured||[]).filter(item=>{
      const categoryOk=activeCategory==='Todas'||item.category===activeCategory;
      const text=`${item.title} ${item.summary} ${item.category}`.toLowerCase();
      return categoryOk&&text.includes(query);
    });
    grid.innerHTML=items.map(item=>`<article class="card"><span class="tag">${item.category}</span><h3>${item.title}</h3><p>${item.summary}</p><a class="read-more" href="#">Leer más →</a></article>`).join('');
    empty.hidden=items.length>0;
  };

  if(filters){
    const categories=['Todas',...(window.ALBA_CONTENT?.categories||[])];
    filters.innerHTML=categories.map(category=>`<button class="filter ${category==='Todas'?'active':''}" data-category="${category}">${category}</button>`).join('');
    filters.addEventListener('click',e=>{const btn=e.target.closest('.filter');if(!btn)return;activeCategory=btn.dataset.category;filters.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b===btn));render();});
  }

  input?.addEventListener('input',render);
  document.getElementById('searchToggle')?.addEventListener('click',()=>{searchBar.classList.add('open');input?.focus();});
  document.getElementById('searchClose')?.addEventListener('click',()=>{searchBar.classList.remove('open');if(input)input.value='';render();});
  render();
});