# Capa a Capa

Manual interactivo de impresión 3D FDM de Quirón 3D. Cada lección explica una idea con una analogía cotidiana, un simulador animado que se puede tocar, un reto, un caso real y la ficha del curso.

Sitio publicado: https://edukaos.github.io/capa-a-capa/

## Cómo usarlo

Abrí `index.html` en cualquier navegador. No hace falta instalar nada. En el celular se puede agregar a la pantalla de inicio como una app, y después de la primera visita funciona sin internet.

- **Narración:** cada lección se puede escuchar con la voz del navegador. Arranca sola al cambiar de lección y se pausa o reanuda desde el botón de arriba. La voz depende de cada dispositivo.
- **Avance:** los retos resueltos y el mejor puntaje de cada repaso se guardan en el navegador de cada persona. Para seguir en otro dispositivo, desde la portada se copia un enlace con el avance y se abre allá.
- **Mi avance:** la página `avance.html` junta todo: porcentaje y nivel (Aprendiz, Maker, Experto), retos, repasos y módulos completos, y lo que falta en cada módulo con enlaces directos a cada lección.

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
| 9. Multicolor y multimaterial | `capa-a-capa-modulo-9.html` |
| 10. Glosario | `capa-a-capa-glosario.html` |

## Archivos compartidos

Cada página de módulo tiene su propio contenido y simuladores, y comparte estos archivos:

| Archivo | Para qué sirve |
| --- | --- |
| `tema.css` | El diseño Material 3: colores, botones, tarjetas, riel de navegación y barra superior. Cambiar algo acá lo cambia en todos los módulos y el glosario. |
| `comun.js` | Nombres de los pasos, narración, confirmación de Reiniciar, guardado del puntaje del repaso y enlaces directos a una lección (`#l3`, `#repaso`). |
| `cac3d.js` y `3d/` | Simuladores en 3D con Three.js (versión 0.160, desde jsDelivr). `cac3d.js` es la base compartida: cama, materiales, luces, cámara que se gira con el dedo o el mouse, etiquetas y gráfico chico. Cada página con 3D tiene sus escenas en `3d/<página>.js`. Se descargan recién al abrir una lección con 3D, y si el navegador no puede mostrarlo queda el simulador 2D. |
| `modulos.js` | La lista de módulos, partes, retos y preguntas de cada repaso. La usan la portada y Mi avance: al sumar un módulo, se agrega acá. |
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
| `version-2.3-modulo-9` | Módulo 9 nuevo, Multicolor y multimaterial. |
| `version-2.4-mi-avance` | Página Mi avance con puntaje total, niveles y repasos guardados. |
| `version-2.5-3d-modulo-4b` | Base 3D y lecciones 4.7 a 4.12 en 3D. |
| `version-2.6-3d-modulo-4` | Módulo 4 completo en 3D (salvo la 4.2, que es un ejercicio de clasificar). |
| `version-2.7-3d-modulo-1` | Módulo 1 en 3D (la 1.3 queda en 2D: es una cuadrícula de coordenadas). |
| `version-2.8-3d-modulo-2` | Módulo 2 en 3D (la 2.10 y la 2.11 quedan en 2D: diagrama y gráfico). |
| `version-2.9-3d-modulo-3` | Módulo 3 en 3D. |
| `main` | La versión publicada. |

Los módulos anteriores 8 (El taller) y 9 (Del hobby al negocio) se retiraron del manual y siguen guardados en la rama `version-2.1-app`.

## Fuentes

El contenido se basa en el curso de impresión 3D de Quirón. Los simuladores son esquemas para entender cada idea y no reproducen una máquina exacta; los valores marcados como ilustrativos están aclarados en cada ficha.

El 3DBenchy, usado como pieza de ejemplo, es de dominio público desde 2025.
