# Generador de llm.tx para proyectos

Analiza todo el código, la documentación y los archivos de este proyecto para entender:

1. El propósito principal de la aplicación y su propuesta de valor.
2. Las secciones o páginas públicas más relevantes (URLs si es una web).
3. El tipo de información que debería priorizarse para que un LLM la use correctamente.
4. El contenido que debería excluirse (áreas privadas, datos sensibles o irrelevantes).

Con esa información, genera un archivo `llms.txt` en formato Markdown con la siguiente estructura:

# Guía para LLMs

## Prioridad alta

- Lista de URLs o secciones clave que el LLM debería leer primero.

## No usar para respuestas

- Lista de URLs o secciones que el LLM debe ignorar.

## Notas

- Breve descripción de la aplicación/servicio y su contexto, redactada de forma clara y concisa.

Asegúrate de:

- Usar frases simples y directas.
- No incluir datos sensibles o privados.
- Reflejar el tono y temática del proyecto.
