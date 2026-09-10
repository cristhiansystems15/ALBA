document.addEventListener('DOMContentLoaded',()=>{
 const data=window.parent===window?null:null;
 const rows=document.getElementById('articleRows');
 const articles=[{title:'ALBA comienza una nueva etapa de información abierta',category:'Actualidad',status:'Publicado'},{title:'Comprender antes de compartir',category:'Análisis',status:'Publicado'},{title:'Datos para descubrir nuevas perspectivas',category:'Tecnología',status:'Publicado'}];
 rows.innerHTML=articles.map(a=>`<div class="row"><span>${a.title}</span><span>${a.category}</span><span><b class="status">${a.status}</b></span><span>•••</span></div>`).join('');
 const views=[...document.querySelectorAll('.view')];
 const show=id=>views.forEach(v=>v.classList.toggle('hidden',v.id!==id));
 document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href').slice(1);if(document.getElementById(id)){e.preventDefault();show(id==='editor'?'editor':'dashboard');}}));
 document.getElementById('publish')?.addEventListener('click',()=>{const title=document.getElementById('title').value.trim();if(!title){alert('Escribe un título antes de publicar.');return}alert('El editor está listo. La publicación real se conectará al backend en la siguiente fase.');});
});