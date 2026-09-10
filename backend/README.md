# Backend de ALBA

Esta carpeta define la primera capa de backend del proyecto.

## Objetivo
Separar la aplicación pública y el panel de administración de la persistencia de datos.

## Contrato inicial
El backend deberá exponer operaciones para:

- artículos: listar, crear, actualizar, publicar y archivar;
- categorías: listar y administrar;
- fuentes: registrar y consultar;
- autenticación: proteger las operaciones administrativas.

Por seguridad, las credenciales y secretos nunca deben almacenarse en el frontend ni en el repositorio.

La implementación concreta del servidor y la base de datos se conectará en la siguiente iteración.