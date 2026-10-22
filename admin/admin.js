document.addEventListener('DOMContentLoaded', () => {
  const rows = document.getElementById('articleRows');
  const views = [...document.querySelectorAll('.view')];

  // Admin UI shell: live backend connection will be added after authentication is configured.
  const articles = [
    { title: 'ALBA comienza una nueva etapa de información abierta', category: 'Actualidad', status: 'Publicado' },
    { title: 'Comprender antes de compartir', category: 'Análisis', status: 'Publicado' },
    { title: 'Datos para descubrir nuevas perspectivas', category: 'Tecnología', status: 'Publicado' }
  ];

  if (rows) {
    rows.innerHTML = articles.map(a => `
      <div class="row">
        <span>${escapeHtml(a.title)}</span>
        <span>${escapeHtml(a.category)}</span>
        <span><b class="status">${escapeHtml(a.status)}</b></span>
        <span>•••</span>
      </div>
    `).join('');
  }

  function show(id) {
    views.forEach(view => view.classList.toggle('hidden', view.id !== id));
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const id = link.getAttribute('href').slice(1);
      if (!document.getElementById(id)) return;
      event.preventDefault();
      show(id === 'editor' ? 'editor' : 'dashboard');
    });
  });

  document.getElementById('publish')?.addEventListener('click', () => {
    const title = document.getElementById('title')?.value.trim();
    if (!title) {
      alert('Escribe un título antes de publicar.');
      return;
    }
    alert('El editor está preparado. La publicación requiere autenticación del administrador.');
  });

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
});
