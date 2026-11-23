# SocialBalance — Sitio web oficial (prototipo funcional)

Sitio narrativo e interactivo para presentar **SocialBalance**, creado a partir de los recursos originales del videojuego en Processing y de su informe técnico final.

## Cómo abrirlo

1. Descomprime `SocialBalance-Web.zip`.
2. Abre `index.html` en Chrome, Edge o Firefox.
3. Recorre la página. No se necesita instalar nada ni tener conexión a Internet para usar la web.

Para desarrollo con VS Code también puedes utilizar **Live Server**, pero no es obligatorio.

## Estructura

- `index.html`: estructura y contenido de las secciones.
- `styles.css`: diseño, adaptabilidad y animaciones visuales.
- `script.js`: interacción, animación de sprites y demostraciones.
- `assets/`: imágenes originales del proyecto optimizadas para web en WebP.

## Qué puedes probar

- Efectos de aparición al desplazarte, barra de progreso y parallax.
- Personaje caminando con los **sprites reales**: Chico, Chica y NoBin.
- Cambio entre habitación y biblioteca.
- Demo de estadísticas con valores iniciales y efectos de acciones **basados en `HUD.pde`**.
- Cinco pestañas con los minijuegos y cartas de Memoria que se pueden revelar.
- Pestañas de los patrones de diseño State y Strategy.
- Navegación adaptada a móviles y preferencia de movimiento reducido.

**Importante:** esta web presenta el videojuego; no sustituye ni ejecuta la aplicación de Processing. Las ilustraciones de ciertos minijuegos son recreaciones HTML/CSS de sus mecánicas, no capturas del juego.

## Publicarlo con GitHub Pages

Puedes subir el contenido de esta carpeta a un repositorio propio (no necesitas subir los archivos fuente de Processing aquí). En GitHub, abre **Settings → Pages**, selecciona la rama `main` y la carpeta `/ (root)`. GitHub publicará `index.html` automáticamente.

## Para cambiar imágenes

Los nombres referenciados están en `index.html`, `styles.css` y `script.js`. Puedes reemplazar archivos WebP manteniendo los nombres o actualizar las rutas correspondientes. Los sprites de movimiento son tiras de 4 fotogramas extraídas de las hojas 4 × 4 del juego, con `image-rendering: pixelated`.

## Fuentes y alcance

- Proyecto original: https://github.com/talianasln/Social-Balance-VideoGame
- Recursos visuales originales: `SocialBalance/data`.
- Información general y evaluación de usuarios: informe técnico final del 22 de noviembre de 2026.
- Mecánicas y detalles de programación: código `.pde` incluido en el ZIP compartido.

La información sobre la gestión de tareas `ListaTareas` proviene del código actual del ZIP. El informe técnico mencionaba que no se observaba una lista enlazada independiente en la versión revisada; **el ZIP entregado contiene expresamente una clase `ListaTareas` con nodos enlazados**, por lo que la web se apoya en el código más reciente para ese detalle.

No incluye fotografías de los integrantes ni un ejecutable distribuible del juego. El botón de descarga lleva al código fuente de la rama `main` del repositorio GitHub, no a un instalador de Windows.
