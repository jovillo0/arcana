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

## Revisión visual del prototipo

Las 22 ilustraciones se revisaron por etapa en la galería a escala grande y de
tirada. Los 22 SVG cargan correctamente; la paleta, los marcos y los cambios de
densidad entre etapas se mantienen coherentes. La tirada de cinco cartas también
se comprobó a 360 px: conserva las posiciones, centra la quinta carta y no
produce desbordamiento horizontal.

La revisión produjo dos ajustes concretos: El Mundo pasó de un círculo exterior
que lo hacía parecer medallón a un valle abierto donde la circularidad vive en
la poza y las rutas; El Ermitaño sustituyó la silueta encapuchada por una
abertura hexagonal iluminada en la montaña. La Muerte mantiene una fractura
central legible sin personificación macabra; su brote es un detalle de lectura
cercana, no un motivo de miniatura. Los Enamorados usa senderos y árboles, no
figuras humanas como afirmaba la nota anterior. El Sol conserva dos formas
humanas geométricas, sombras visibles y un muro atravesable, sin reproducir la
escena tradicional de niño y caballo.

## Aprobación artística final pendiente

La revisión funcional y asistida no equivale a aprobación artística humana.
Sigue pendiente decidir si la serie SVG es el acabado final o si se producirá
una técnica híbrida, y revisar personalmente contraste, impresión y los 22
motivos antes de congelar el arte. La galería conserva sus casillas de revisión
solo en sesión y no se marcaron automáticamente.
