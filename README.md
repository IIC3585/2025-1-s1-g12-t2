# Trabajo 2: Web Assembly y PWAs

Se puede encontrar una versión de producción de nuestra aplicación en: https://t2-pwa.web.app/

Este repositorio contiene dos carpetas principales
- `app` que contiene el codigo principal de nuestra aplicación (hecha en React, con MUI)
- `img` que contiene el codigo utilizado para crear el modulo de procesamiento de imagenes con WASM (`pkg`)

La aplicación `app` tiene la siguiente estructura de directorios:

```
app/
├── public/
│   ├── img/
│   ├── index.html
│   ├── manifest.json
│   ├── robots.txt
│   └── splash.css
├── src/
│   ├── components/
│   ├── pkg/
│   ├── services/
│   ├── styles/
│   └── views/
│       ├── FiltersMenu.js
│       ├── GalleryPage.js
│       └── MainPage.js
├── App.css
├── App.js
├── App.test.js
├── index.css
├── index.js
├── logo.svg
├── reportWebVitals.js
├── service-worker.js
├── serviceWorkerRegistration.js
├── setupTests.js
├── theme.js
├── themeContext.js
├── .firebaserc
├── .gitignore
├── firebase.json
├── package-lock.json
├── package.json
└── README.md
```

# Enunciado

**Fecha de entrega:** lunes 21 de abril de 2025, 11:00

**Disponible desde:** jueves 4 de abril de 2025, 11:00

---

## Evaluación

### Trabajo

| Porcentaje | Descripción                                       |
| ---------- | ------------------------------------------------- |
| 10%        | Originalidad de la aplicación                     |
| 50%        | Cumplimiento de los requisitos                    |
| 40%        | Calidad, elegancia, mantenibilidad, documentación |

### Presentación

| Porcentaje | Descripción                                 |
| ---------- | ------------------------------------------- |
| 20%        | Demo                                        |
| 50%        | Explicación sobre diseño e implementación   |
| 30%        | Mostrar aspectos interesantes seleccionados |

> La presentación se evalúa solo si corresponde.

---

## Objetivo

Este trabajo tiene un objetivo doble: experimentar con **WASM** y crear una **aplicación web progresiva (PWA)**. Para ello, emplearán WASM para llevar a cabo un trabajo intensivo en cómputo y luego integrarán esto en una PWA, que aproveche las APIs de los navegadores modernos.

---

## El Desafío

Crear una aplicación que permita el procesamiento básico de imágenes, **portando utilidades existentes con WASM en una aplicación web progresiva (PWA)**, con funcionalidades que hagan que esta tenga un comportamiento más nativo.

### Requisitos

- [ ] Realizar procesamiento de imágenes con WASM
- [ ] Subir una imagen
- [ ] Seleccionar un filtro o modificación a aplicar (**mínimo dos filtros diferentes**)
- [ ] Procesar la imagen elegida con el filtro y mostrarla
- [ ] Aprovechar al menos **dos funcionalidades PWA**, como:
  - Notificaciones
  - Funcionamiento completo offline (service worker)
  - Guardado de imágenes usando IndexedDB
  - Opción de abrir como aplicación y procesar directamente
  - Uso y guardado de imágenes en carpeta nativa
  - Personalización completa: tema, colores, ícono, splash screen, etc

> **Nota:** La aplicación puede ser creativa o entretenida. La originalidad será premiada.

---

## Uso de frameworks y herramientas

Está permitido usar frameworks, librerías y otras herramientas.
Se recomienda revisar los recursos subidos al [GitHub del curso].

> **Importante:** Deben explicar cómo estas herramientas interactúan con las APIs nativas de JavaScript y cómo facilitan el desarrollo.

---

## Demo

Se debe mostrar el funcionamiento en:

- Un navegador de escritorio **dimensionado como smartphone**.
- **Idealmente**, también funcionando en un smartphone real.

Asegúrense de mostrar los **aspectos relevantes solicitados** en los requisitos.

---

## Ayuda Importante

- Revisar cuidadosamente los recursos que ha puesto Benjamín en [GitHub].
- Recomendado: [tutorial] para el trabajo con WASM.

<!-- Referencias -->

[GitHub del curso]: https://github.com/IIC3585/2025-1-s1-syllabus
[GitHub]: https://github.com/IIC3585/2025-1-s1-syllabus?tab=readme-ov-file#tarea-2-web-assembly-y-pwas
[tutorial]: https://medium.com/@krishrathor18/image-processing-with-rust-webassembly-js-and-html-613d08ea7354
