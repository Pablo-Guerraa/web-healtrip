# Movimiento e interacciones de Healtrip

Auditoría del 25 de noviembre de 2026 sobre la portada en español y los recursos que carga el tema `2.1.8`. Los tiempos corresponden al CSS y al JavaScript de esa portada. [Portada](https://myhealtrip.co/) · [CSS del tema](https://myhealtrip.co/wp-content/themes/healtrip/assets/css/home.css?v=2.1.8) · [JavaScript del tema](https://myhealtrip.co/wp-content/themes/healtrip/assets/js/home.js?v=2.1.8)

## Efectos aplicados en Next.js

| Elemento | Disparador | Efecto |
| --- | --- | --- |
| Símbolo y texto del logo | Carga | Entrada de `1.1 s` con opacidad, `6 px` de desplazamiento, escala de `0.92` a `1` y desenfoque de `4 px` a nítido. El texto empieza `150 ms` después del símbolo. |
| Destello del logo | Ciclo CSS de `7 s` | Una franja cálida en diagonal cruza la silueta de cada imagen. Empieza a los `1.2 s` en el símbolo y a los `1.55 s` en el texto. Cada barrido ocupa el primer `22 %` del ciclo, unos `1.54 s`. |
| Símbolo del logo | Hover o foco visible | Giro de `−4°`, escala `1.06` y halo celeste y magenta en `600 ms`. El destello sigue la silueta durante el giro. |
| Encabezado | Desplazamiento vertical | Conserva `blur(10px)` y saturación `1.2`. En el punto inicial el fondo tiene `18 %` de opacidad. Al bajar más del `60 %` de la altura de la ventana pasa a `72 %` en `500 ms`. |
| Navegación de escritorio | Hover o foco visible | El texto cambia a dorado claro en `250 ms` y una línea dorada de `1 px` crece de izquierda a derecha en `350 ms`. |
| Botón de contacto | Hover, foco visible o pulsación | Degradado dorado con extremos en diagonal. El reflejo cruza el botón en `900 ms`, el botón sube `2 px` en `350 ms` y la pulsación lo lleva a escala `0.98`. |
| Menú móvil | Apertura y cierre | Hasta `1080 px` se usa un panel del tamaño disponible en pantalla, con degradado azul, desenfoque de `14 px` y fundido de `450 ms`. Las líneas del botón forman una X en `400 ms`. Los enlaces suben `14 px`, con incrementos de `50 ms` entre ellos. |
| WhatsApp flotante | Ciclos CSS, hover y foco visible | Insignia circular de `64 px`. El aro se expande y se disipa cada `2.8 s`. El símbolo se balancea cada `4 s`. El hover y el foco amplían el símbolo y hacen aparecer la etiqueta en `500 ms`. |
| Enlaces del pie | Hover o foco visible | El texto cambia a dorado claro. El logo del pie usa el mismo destello que el encabezado. |

`app/(public)/site.css` contiene el encabezado, los enlaces y el menú. `app/(public)/site-brand.css` contiene los efectos del logo y de contacto. La curva principal de las transiciones es `cubic-bezier(0.23, 1, 0.32, 1)`. La preferencia de movimiento reducido detiene los ciclos y conserva el foco visible. Escape cierra el menú y devuelve el foco al botón.

## Primera sección de la portada

| Elemento | Referencia aplicada |
| --- | --- |
| Composición | El video pasa detrás del encabezado translúcido. El titular centrado usa Source Serif 4, de `44.8 px` a `89.6 px`, con la primera línea en itálica dorada. La introducción, las llamadas a la acción y las cifras se ordenan debajo. |
| Fondo | El video de origen tiene `19 s` y se reproduce en bucle. El acercamiento va de `1` a `1.09` durante `26 s`, con sentido alterno. Las capas azul noche dan contraste en el centro, arriba y al pie. |
| Controles | La acción principal usa el destello dorado y una flecha que sale en diagonal. La secundaria dibuja una línea dorada. Ambas conducen temporalmente a sus secciones en WordPress. |
| Cifras | Tres columnas con fondo traslúcido y desenfoque de `8 px`. El primer valor crece de `0` a `500` en `1.8 s`, tras `500 ms`. Su valor accesible es estable. |
| Recorrido | Los cuatro medallones se conectan con una línea horizontal en escritorio y vertical hasta `860 px`. Se resalta un paso cada `2.6 s` mientras el bloque esté visible. Se puede seleccionar un paso con puntero, toque o teclado. |

El video y su imagen de respaldo se sirven desde `public/hero/`. El video conserva la secuencia original y está optimizado a `1120 × 630` en H.264, con inicio rápido. El póster está en WebP y cubre la carga, los errores de reproducción y la preferencia de movimiento reducido. [Video original](https://myhealtrip.co/wp-content/themes/healtrip/assets/hero-journey.mp4) · [Póster original](https://myhealtrip.co/wp-content/themes/healtrip/assets/hero-journey-poster.jpg)

## Referencia para construir las secciones

| Sección | Movimiento observado | Disparador y tiempos |
| --- | --- | --- |
| Entradas al hacer scroll | Los elementos aparecen al subir `18 px` y recuperar opacidad. | `IntersectionObserver` al `12 %` de visibilidad. Transición de `800 ms` con incrementos de `80 ms` entre hermanos, hasta `320 ms`. Cada elemento se revela una sola vez. |
| Países | Carrusel continuo con aumento, color e iluminación en el centro. | Comienza `1.2 s` después de alcanzar un `60 %` de visibilidad. Se desplaza a `48 px/s` y baja gradualmente a `8 px/s` con el puntero encima. |
| Escena de coordinación | Los nodos cambian de posición y se conectan al símbolo central. Las fotos y las líneas acompañan el cambio. | Escena activada al tocarla o `900 ms` después de alcanzar un `45 %` de visibilidad. Las fotos rotan cada `5 s`, las líneas usan pulsos de `2.2 s` y los nodos tienen retrasos de `70 ms`. |
| Servicios | Imagen que se descubre de derecha a izquierda con borde luminoso, acercamiento suave, texto ascendente y luz que sigue al puntero. | El servicio cambia con hover, clic o después de unos `7 s`. El barrido dura `1.1 s`. El texto entra tras `350 ms`. El avance automático se pausa con el puntero sobre la sección. |
| Chequeos | Paneles laterales se desplazan, la silueta cambia por perfil y los puntos activos pulsan. Las zonas del cuerpo tienen resaltado contextual. | La tarjeta del plan se mueve `4 px` en hover y `10 px` al seleccionarla. Los puntos activos pulsan cada `2.2 s`. El escaneo de la silueta dura `5.5 s`. Sus avisos abren con puntero, foco o toque. |
| Detalle del chequeo | La ventana se abre desde el centro y los resultados aparecen por filas. | Apertura por recorte en `800 ms`. En el cambio de plan, las filas tienen incrementos de `25 ms`. El control de cierre gira `90°` en hover. |
| Fundadora | El retrato se revela con recorte y reduce su zoom al acercar el puntero. El fondo texturizado recibe una luz móvil y un destello. | Recorte de `1.4 s` al aparecer, cambio de escala de `1.08` a `1.02` en `1.6 s` y barrido del fondo cada `11 s`. |
| Especialistas | Tarjetas que se elevan y muestran información adicional mientras se aclara el video. | En escritorio se elevan `8 px` y reproducen al pasar el puntero. En móvil se deslizan horizontalmente y el toque abre el detalle. |
| Testimonios | Carrusel con profundidad 3D y visor con barras de progreso. | Las tarjetas laterales giran `22°` y se reducen a `0.72`. El video avanza al siguiente al terminar. El visor controla el progreso con el tiempo real del video. |
| Formulario y cierre | Panel translúcido, foco dorado en los campos y botones con destello. Algunas llamadas a la acción intercambian dos flechas en diagonal al pasar el puntero. | Los campos cambian de fondo, borde y halo en `300 ms`. Las flechas de las llamadas a la acción tardan `450 ms`. |
