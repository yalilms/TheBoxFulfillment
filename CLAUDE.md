# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Sitio web estático HTML/CSS/JS para **The Box Fulfillment** — operador logístico especializado en suplementos, ubicado en Pozuelo de Alarcón (Madrid). Sin framework, sin build step, sin package.json.

## Development

Abrir directamente en el navegador o con cualquier servidor estático local:

```bash
# Opción rápida con Python
python3 -m http.server 8080
# O con Node
npx serve .
```

No hay linting, tests ni CI configurados.

## Architecture

### File structure
- `index.html` — página de inicio (raíz del sitio)
- `pages/*.html` — páginas interiores (`about-us`, `services`, `blog`, `contact-us`, `privacy-policy`)
- `pages/blog/*.html` — artículos individuales del blog
- `assets/css/main.css` — CSS base del tema (**no modificar**)
- `assets/css/custom.css` — sobrescrituras y estilos propios (**único fichero CSS a tocar**)
- `assets/js/main.js` — JS del tema bundleado/minificado: GSAP, ScrollTrigger, Swiper, SmoothScroll, DynamicAdapt (**no modificar**)
- `assets/js/custom.js` — lógica propia (**único fichero JS a tocar**)
- `assets/js/about.js` — script específico de la página About

### CSS units
Todo el tema usa `rem` como unidad de medida para píxeles (p.ej. `20rem` = ~20px). Mantener esta convención en `custom.css`.

### Page body classes
Cada página declara una clase en `<body>` que se usa como scope para estilos y comportamientos:
- `home` → inicio
- `page-services` → servicios
- `page-about` → empresa
- `page-blog` → listado de noticias
- `page-contacts` → contacto
- `page-article` → artículo de blog

### No templating
El header, footer y el modal de contacto están **duplicados en cada HTML**. Al modificar cualquiera de esos bloques hay que replicar el cambio en todos los ficheros.

### JS architecture (custom.js)
- `handleContactForm()` — valida y envía el formulario; despacha el evento `wpcf7mailsent` para que `main.js` cierre el modal y abra `#modal-thx`
- Header glass — `MutationObserver` sobre `.header__container` + scroll listener; añade `._glass` al `<header>` cuando el usuario ha bajado
- Botón "Arriba" — intercepta en fase de captura (`addEventListener(..., true)`) para evitar la animación de cortina de `main.js`
- Filtro de blog — filtra `.blog__item` por el texto de `.blog__item-category`
- Imagen panel servicios — `MutationObserver` sobre `style.width` de `.services__progressbar-fill` (que GSAP anima de 10 % a 100 %) para sincronizar la imagen de fondo del panel izquierdo

### Images
Usar formato `.webp` como fuente principal; el `.png` equivalente existe como respaldo. Las imágenes de servicios se referencian en `custom.css` con URLs relativas desde la carpeta `css/`.

### External dependency
El vídeo del footer (`<video class="footer__video">`) apunta a una URL externa en `mvplogistics.eu`.
