# Prototipos visuales V2 — evaluación

## Dirección probada

Los tres SVG piloto evolucionan los estudios geométricos hacia escenas
atmosféricas de paisaje, materia, naturaleza y luz. La geometría permanece,
pero se integra en el horizonte, la piedra y el agua en vez de ocupar casi toda
la imagen como diagrama.

- **0 · El Loco:** terreno mineral en primer plano, horizonte de varias capas y
  cielo abierto. La semilla y el punto distante de luz permanecen alineados.
- **XIII · La Muerte:** masa pétrea estratificada, fractura vertical iluminada,
  fragmentos en sombra y brote secundario. No hay personificación ni imaginería
  macabra.
- **XXI · El Mundo:** cuenca circular con relieve, agua, vegetación asimétrica y
  rutas que confluyen en una poza central; la semilla reaparece transformada.

Las versiones geométricas previas se conservan en `v1/` y `v2-geometric/`.
`public/cards/` contiene ahora una ilustración SVG local para cada uno de los
22 Arcanos. El `CardFrame` resuelve la imagen desde `imageRef`, sin una lista
especial para los pilotos.

## Cobertura de la baraja

Los otros 19 SVG aplican la misma paleta nocturna y materialidad contenida a
composiciones derivadas de sus fichas artísticas: arquitectura de aprendizaje,
senderos que se separan y convergen, instrumentos de discernimiento, ciclos,
umbrales, agua reflejada y luz compartida. La progresión conserva baja densidad
en el comienzo, gana estructura al entrar en el mundo, atraviesa composiciones
de mayor tensión durante la transformación y vuelve a abrir el horizonte en la
reintegración.

La serie está completa como conjunto de ilustraciones vectoriales para el
prototipo funcional; no equivale a una aprobación artística final. En tamaño
reducido, la lectura depende del motivo principal y su contraste: grabados,
texturas y detalles ocultos dejan de ser legibles, como corresponde.

## Evaluación de la técnica

SVG puro permite realizar estos prototipos originales, locales, escalables y
livianos, con gradientes, recortes, capas y trazos de textura controlables. La
prueba también muestra su límite: incluso con más planos y materia, las formas
vectoriales definidas a mano conservan un acabado ilustrativo estilizado y no
alcanzan por sí mismas la variación tonal de una pintura atmosférica.

Antes de cerrar la producción artística, conviene comparar este lenguaje SVG
con una técnica híbrida que permita fondos pictóricos originales locales. La
decisión afecta al acabado, al peso de descarga y al mantenimiento de los
assets; requiere una revisión humana junto a las 22 imágenes.

## Revisión por escala

- **Lejos:** permanecen legibles semilla/horizonte, fractura/luz y cuenca/centro.
- **Media:** se distinguen relieve, rutas, agua y vegetación.
- **Cerca:** se aprecian estratos, irregularidades y pequeños grabados.

En el `CardFrame` de tirada se usa un recorte central para ampliar el arte en el
espacio disponible. Los detalles más finos desaparecen como se espera; la
composición principal y el contraste focal deben llevar la lectura.

## Criterio humano pendiente

Revisar la consistencia de contraste y legibilidad de los 22 motivos en la
tirada real, especialmente en móvil. En particular, comprobar si el umbral de
La Muerte expresa un cierre profundo sin volverse demasiado literal; si la
cuenca de El Mundo se siente como paisaje integrado y no como medallón; si el
Ermitaño comunica introspección sin parecer una estampa heredada; y si las
figuras humanas de Los Enamorados y El Sol conservan suficiente abstracción.
También queda por decidir cuánto acabado pictórico requerirá la baraja final.
