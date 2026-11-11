# Capa a Capa

Manual interactivo de impresión 3D FDM de Quirón 3D. Cada lección explica una idea con una analogía cotidiana, un simulador animado que se puede tocar, un reto, un caso real y la ficha del curso.

Sitio publicado: https://edukaos.github.io/capa-a-capa/

## Cómo usarlo

Abrí `index.html` en cualquier navegador. No hace falta instalar nada. En el celular se puede agregar a la pantalla de inicio como una app, y después de la primera visita funciona sin internet.

- **Narración:** cada lección se puede escuchar con la voz del navegador. Arranca sola al cambiar de lección y se pausa o reanuda desde el botón de arriba. La voz depende de cada dispositivo.
- **Avance:** los retos resueltos se guardan en el navegador de cada persona. Para seguir en otro dispositivo, desde la portada se copia un enlace con el avance y se abre allá.

## Contenido

| Módulo | Páginas |
| --- | --- |
| 1. Cómo funciona una impresora 3D | `capa-a-capa-modulo-1.html` |
| 2. La máquina por dentro | `capa-a-capa-modulo-2.html`, `capa-a-capa-modulo-2b.html` |
| 3. Filamentos y materiales | `capa-a-capa-modulo-3.html` |
| 4. El laminador | `capa-a-capa-modulo-4a.html`, `capa-a-capa-modulo-4b.html`, `capa-a-capa-modulo-4c.html` |
| 5. Calibración | `capa-a-capa-modulo-5a.html`, `capa-a-capa-modulo-5b.html` |
| 6. Errores y diagnóstico | `capa-a-capa-modulo-6a.html`, `capa-a-capa-modulo-6b.html` |
| 7. Diseño de piezas funcionales | `capa-a-capa-modulo-7a.html`, `capa-a-capa-modulo-7b.html` |
| 8. Impresoras de nueva generación | `capa-a-capa-modulo-8.html` |
| 9. Multicolor y multimaterial | En preparación |
| 10. Glosario | `capa-a-capa-glosario.html` |

## Archivos compartidos

Cada página de módulo tiene su propio contenido y simuladores, y comparte estos archivos:

| Archivo | Para qué sirve |
| --- | --- |
| `tema.css` | El diseño Material 3: colores, botones, tarjetas, riel de navegación y barra superior. Cambiar algo acá lo cambia en todos los módulos y el glosario. |
| `comun.js` | Nombres de los pasos, narración y confirmación de Reiniciar. |
| `sw.js` y `registro-sw.js` | Modo sin conexión. Al cambiar archivos, subí el número de `VERSION` en `sw.js`. |
| `manifest.webmanifest` e `img/icono-*` | Nombre e ícono al instalarlo como app. |
| `img/compartir.jpg` | Imagen que aparece al compartir el enlace. |

La portada (`index.html`) tiene su propio estilo dentro del archivo.

## Versiones

Cada versión importante queda guardada en una rama, para poder volver atrás:

| Rama | Qué tiene |
| --- | --- |
| `version-1.0-diseno-original` | El diseño anterior al rediseño. |
| `version-2.0-material3` | Rediseño Material 3 con narración y mini retos arreglados. |
| `version-2.1-app` | Lo anterior más íconos unificados, archivos compartidos, avance entre dispositivos, vista previa al compartir y modo sin conexión. |
| `version-2.2-modulo-8` | Módulo 8 nuevo, Impresoras de nueva generación, en lugar de los módulos de taller y negocio. |
| `main` | La versión publicada. |

Los módulos anteriores 8 (El taller) y 9 (Del hobby al negocio) se retiraron del manual y siguen guardados en la rama `version-2.1-app`.

## Fuentes

El contenido se basa en el curso de impresión 3D de Quirón. Los simuladores son esquemas para entender cada idea y no reproducen una máquina exacta; los valores marcados como ilustrativos están aclarados en cada ficha.

El 3DBenchy, usado como pieza de ejemplo, es de dominio público desde 2025.
