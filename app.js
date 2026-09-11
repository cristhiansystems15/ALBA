const ALBA_SUPABASE_URL="https://xuilkvsehlnkqtlfkblw.supabase.co";
const ALBA_SUPABASE_KEY="sb_publishable_Mdr55DRXLuqCXIYjh5hepQ_Lx3T3-Pg";

document.addEventListener('DOMContentLoaded',()=>{
  const year=document.getElementById('year');
  if(year) year.textContent=new Date().getFullYear();

  const grid=document.getElementById('newsGrid');
  const filters=document.getElementById('categoryFilters');
  const sourceFilters=document.getElementById('sourceFilters');
  const input=document.getElementById('searchInput');
  const empty=document.getElementById('emptyState');
  const searchBar=document.getElementById('searchBar');
  let activeCategory='Todas';
  let activeSource='Todas';
  let news=[];
  let categories=[];
  let sources=[];

  const escapeHtml=(value='')=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const render=()=>{
    const query=(input?.value||'').trim().toLowerCase();
    const items=news.filter(item=>{
      const categoryOk=activeCategory==='Todas'||item.category===activeCategory;
      const sourceOk=activeSource==='Todas'||item.source===activeSource;
      const text=`${item.title} ${item.summary} ${item.category} ${item.source}`.toLowerCase();
      return categoryOk&&sourceOk&&text.includes(query);
    });

    grid.innerHTML=items.map(item=>`<article class="card">
      ${item.image_url?`<img class="card-image" src="${escapeHtml(item.image_url)}" alt="" loading="lazy">`:''}
      <div class="card-meta"><span class="tag">${escapeHtml(item.category)}</span><span class="source-tag">${escapeHtml(item.source)}</span></div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.summary||'')}</p>
      <div class="card-footer">${item.published_at?`<time datetime="${escapeHtml(item.published_at)}">${new Date(item.published_at).toLocaleString('es-HN',{dateStyle:'medium',timeStyle:'short'})}</time>`:''}${item.canonical_url?`<a class="read-more" href="${escapeHtml(item.canonical_url)}" target="_blank" rel="noopener noreferrer">Leer más →</a>`:''}</div>
    </article>`).join('');
    empty.hidden=items.length>0;
    if(!items.length && empty) empty.textContent=query||activeCategory!=='Todas'||activeSource!=='Todas'?'No encontramos noticias con esos filtros.':'No encontramos noticias disponibles.';
  };

  const bindFilter=(container,setter)=>{
    if(!container)return;
    container.onclick=e=>{
      const btn=e.target.closest('.filter');
      if(!btn)return;
      setter(btn.dataset.value);
      container.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b===btn));
      render();
    };
  };

  const renderFilters=()=>{
    if(filters){
      filters.innerHTML=['Todas',...categories].map(category=>`<button type="button" class="filter ${category==='Todas'?'active':''}" data-value="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join('');
    }
    if(sourceFilters){
      sourceFilters.innerHTML=['Todas',...sources].map(source=>`<button type="button" class="filter ${source==='Todas'?'active':''}" data-value="${escapeHtml(source)}">${escapeHtml(source)}</button>`).join('');
    }
  };

  const loadNews=async()=>{
    try{
      const headers={apikey:ALBA_SUPABASE_KEY,Authorization:`Bearer ${ALBA_SUPABASE_KEY}`};
      const articleUrl=new URL(`${ALBA_SUPABASE_URL}/rest/v1/articles`);
      articleUrl.searchParams.set('select','id,title,summary,image_url,canonical_url,published_at,categories(name),sources(name)');
      articleUrl.searchParams.set('status','eq.published');
      articleUrl.searchParams.set('order','published_at.desc.nullslast');
      articleUrl.searchParams.set('limit','100');

      const [articlesResponse,categoriesResponse,sourcesResponse]=await Promise.all([
        fetch(articleUrl,{headers}),
        fetch(`${ALBA_SUPABASE_URL}/rest/v1/categories?select=name&is_active=eq.true&order=name.asc`,{headers}),
        fetch(`${ALBA_SUPABASE_URL}/rest/v1/sources?select=name&is_active=eq.true&order=name.asc`,{headers})
      ]);

      if(!articlesResponse.ok)throw new Error(`No se pudieron cargar las noticias (${articlesResponse.status})`);
      const articleData=await articlesResponse.json();
      const categoryData=categoriesResponse.ok?await categoriesResponse.json():[];
      const sourceData=sourcesResponse.ok?await sourcesResponse.json():[];

      news=articleData.map(item=>({
        ...item,
        category:item.categories?.name||'Actualidad',
        source:item.sources?.name||'Fuente desconocida'
      }));
      categories=[...new Set([...categoryData.map(c=>c.name).filter(Boolean),...news.map(n=>n.category).filter(Boolean)])];
      sources=[...new Set([...sourceData.map(s=>s.name).filter(Boolean),...news.map(n=>n.source).filter(Boolean)])];

      renderFilters();
      render();
    }catch(error){
      console.error('ALBA: error cargando noticias desde Supabase',error);
      news=[];
      categories=[];
      sources=[];
      renderFilters();
      render();
      if(empty)empty.textContent='No se pudieron cargar las noticias en este momento.';
    }
  };

  bindFilter(filters,value=>{activeCategory=value;});
  bindFilter(sourceFilters,value=>{activeSource=value;});
  input?.addEventListener('input',render);
  document.getElementById('searchToggle')?.addEventListener('click',()=>{searchBar.classList.add('open');input?.focus();});
  document.getElementById('searchClose')?.addEventListener('click',()=>{searchBar.classList.remove('open');if(input)input.value='';render();});

  loadNews();
});
