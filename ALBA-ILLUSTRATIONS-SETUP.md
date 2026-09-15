# ALBA NEWS — ilustraciones editoriales realistas

El frontend usa `alba-real-illustrations.js` para solicitar ilustraciones originales bajo demanda al Edge Function `generate-illustration`.

## Producción

Configura `OPENAI_API_KEY` como secreto del proyecto Supabase. Nunca lo pongas en GitHub ni en el navegador.

El bucket público `alba-illustrations` ya está creado. Las imágenes generadas se guardan allí y se reutilizan por URL, evitando regenerarlas cada vez que se carga una noticia.

El generador utiliza el titular, resumen, categoría y fuente como contexto editorial, pero solicita una interpretación visual original y no una recreación de fotografías de terceros.
