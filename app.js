const ALBA_SUPABASE_URL="https://xuilkvsehlnkqtlfkblw.supabase.co";
const ALBA_SUPABASE_KEY="sb_publishable_Mdr55DRXLuqCXIYjh5hepQ_Lx3T3-Pg";

document.addEventListener('DOMContentLoaded',()=>{
  const year=document.getElementById('year');
  if(year) year.textContent=new Date().getFullYear();

  const grid=document.getElementById('newsGrid');
  const filters=document.getElementById('categoryFilters');
  const input=document.getElementById('searchInput');
  const empty=document.getElementById('emptyState');
  const searchBar=document.getElementById('searchBar');
  let activeCategory='Todas';
  let news=[];
  let categories=[];

  const escapeHtml=(value='')=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const render=()=>{
    const query=(input?.value||'').trim().toLowerCase();
    const items=news.filter(item=>{
      const categoryOk=activeCategory==='Todas'||item.category===activeCategory;
      const text=`${item.title} ${item.summary} ${item.category}`.toLowerCase();
      return categoryOk&&text.includes(query);
    });

    grid.innerHTML=items.map(item=>`<article class="card">
      ${item.image_url?`<img class="card-image" src="${escapeHtml(item.image_url)}" alt="" loading="lazy">`:''}
      <span class="tag">${escapeHtml(item.category)}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.summary||'')}</p>
      ${item.canonical_url?`<a class="read-more" href="${escapeHtml(item.canonical_url)}" target="_blank" rel="noopener noreferrer">Leer más →</a>`:`<span class="read-more">Leer más →</span>`}
    </article>`).join('');
    empty.hidden=items.length>0;
  };

  const renderFilters=()=>{
    if(!filters)return;
    filters.innerHTML=['Todas',...categories].map(category=>`<button class="filter ${category==='Todas'?'active':''}" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join('');
    filters.addEventListener('click',e=>{
      const btn=e.target.closest('.filter');
      if(!btn)return;
      activeCategory=btn.dataset.category;
      filters.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b===btn));
      render();
    });
  };

  const loadNews=async()=>{
    try{
      const headers={apikey:ALBA_SUPABASE_KEY,Authorization:`Bearer ${ALBA_SUPABASE_KEY}`};
      const articleUrl=new URL(`${ALBA_SUPABASE_URL}/rest/v1/articles`);
      articleUrl.searchParams.set('select','id,title,summary,image_url,canonical_url,published_at,categories(name)');
      articleUrl.searchParams.set('status','eq.published');
      articleUrl.searchParams.set('order','published_at.desc.nullslast');
      articleUrl.searchParams.set('limit','100');

      const [articlesResponse,categoriesResponse]=await Promise.all([
        fetch(articleUrl,{headers}),
        fetch(`${ALBA_SUPABASE_URL}/rest/v1/categories?select=name&order=name.asc`,{headers})
      ]);

      if(!articlesResponse.ok)throw new Error(`No se pudieron cargar las noticias (${articlesResponse.status})`);
      const articleData=await articlesResponse.json();
      const categoryData=categoriesResponse.ok?await categoriesResponse.json():[];

      news=articleData.map(item=>({
        ...item,
        category:item.categories?.name||'Actualidad'
      }));
      categories=[...new Set([...categoryData.map(c=>c.name).filter(Boolean),...news.map(n=>n.category).filter(Boolean)])];

      renderFilters();
      render();
    }catch(error){
      console.error('ALBA: error cargando noticias desde Supabase',error);
      news=[];
      categories=[];
      renderFilters();
      render();
      if(empty)empty.textContent='No se pudieron cargar las noticias en este momento.';
    }
  };

  input?.addEventListener('input',render);
  document.getElementById('searchToggle')?.addEventListener('click',()=>{searchBar.classList.add('open');input?.focus();});
  document.getElementById('searchClose')?.addEventListener('click',()=>{searchBar.classList.remove('open');if(input)input.value='';render();});

  loadNews();
});
