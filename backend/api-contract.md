# API Contract — ALBA v0.1

## Artículos

`GET /api/articles` — lista artículos publicados.

`GET /api/articles/:id` — obtiene un artículo.

`POST /api/articles` — crea un artículo (administrador autenticado).

`PATCH /api/articles/:id` — actualiza un artículo (administrador autenticado).

`POST /api/articles/:id/publish` — publica un borrador (administrador autenticado).

`POST /api/articles/:id/archive` — archiva un artículo (administrador autenticado).

## Categorías

`GET /api/categories` — lista categorías.

`POST /api/categories` — crea una categoría (administrador autenticado).

## Fuentes

`GET /api/sources` — lista fuentes.

`POST /api/sources` — registra una fuente (administrador autenticado).

## Seguridad

Las rutas de escritura son administrativas y deberán validar autenticación y autorización en servidor. Nunca se confiará en una bandera enviada desde el navegador para conceder permisos.