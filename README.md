# ALBA NEWS

**Portal de noticias, contexto y análisis.**

## Arquitectura actual

- `index.html` — página principal y estructura del portal.
- `app.js` — carga y renderizado de noticias desde Supabase.
- `utilities.js` — reloj, calendario e indicadores.
- `styles-base.css` + `styles.css` — estilos principales.
- `alba-*.css/js` — módulos activos de búsqueda, lectura, navegación, filtros y experiencia móvil.
- `assets/alba-logo.svg` — identidad visual.
- `admin/` — panel administrativo en desarrollo.
- `backend/supabase/` — esquema y Edge Functions de Supabase.
- `robots.txt` — configuración para buscadores.

## Datos

La portada consulta las noticias publicadas directamente desde Supabase. Las claves usadas en el frontend son claves públicas de Supabase; no se almacenan secretos administrativos en el repositorio.

## Limpieza

Se eliminaron archivos antiguos, duplicados y prototipos que ya no participan en la carga del portal, para reducir conflictos, solicitudes innecesarias y mantenimiento.

## Estado

**ALBA NEWS — frontend activo con Supabase.**
