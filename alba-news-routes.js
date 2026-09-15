(()=>{
 const init=()=>{
  const input=document.getElementById('searchInput');
  const route=()=>{const id=new URLSearchParams(location.search).get('noticia');if(!id)return;let tries=0;const timer=setInterval(()=>{const btn=document.querySelector(`.article-open[data-id="${CSS.escape(id)}"]`);if(btn){clearInterval(timer);btn.click()}if(++tries>30)clearInterval(timer)},300)};
  document.addEventListener('click',e=>{const b=e.target.closest('.article-open[data-id]');if(!b)return;const id=b.dataset.id;if(!id)return;history.pushState({noticia:id},'',`?noticia=${encodeURIComponent(id)}`);});
  window.addEventListener('popstate',()=>{const modal=document.querySelector('.article-modal.open');if(modal&&!new URLSearchParams(location.search).get('noticia')){modal.classList.remove('open');document.body.classList.remove('modal-open')}});
  route();
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
