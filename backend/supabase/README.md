# ALBA + Supabase

La migración `001_initial_schema.sql` crea la primera estructura PostgreSQL para ALBA.

Incluye:
- categorías;
- artículos;
- fuentes;
- relación artículos/fuentes;
- índices básicos;
- Row Level Security (RLS).

Los artículos públicos solo se pueden consultar cuando están en estado `published`. Las operaciones de administración deben pasar por el backend autenticado.

## Conexión

No se guardan credenciales en GitHub. La conexión se realizará mediante variables de entorno cuando el proyecto Supabase esté conectado.
