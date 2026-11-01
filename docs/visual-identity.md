# Identidad visual de ARCANA

La identidad visual establece un lenguaje propio antes de incorporar las
ilustraciones de los 22 Arcanos. Toma inspiración general de diagramas,
geometría simbólica, astronomía y manuscritos; no reproduce emblemas, cartas ni
ornamentación de una baraja histórica o comercial.

## Paleta y tokens

Los tokens están definidos en `src/styles/global.css` y mantienen alias para los
estilos ya existentes:

| Token | Valor | Uso |
|---|---|---|
| `--color-ink` | `#090F15` | Fondo negro azulado |
| `--color-surface` | `#111A21` | Superficie principal |
| `--color-surface-raised` | `#182129` | Superficie elevada |
| `--color-wine` | `#321A24` | Acento granate |
| `--color-wine-deep` | `#21141B` | Granate profundo |
| `--color-ivory` | `#F0E9DC` | Texto principal |
| `--color-warm-gray` | `#AAA397` | Texto secundario |
| `--color-gold` | `#B59A68` | Oro envejecido |
| `--color-gold-soft` | `#806F50` | Oro tenue |
| `--color-gold-bright` | `#DBC596` | Énfasis y foco |
| `--color-line` | `rgba(213, 190, 143, 0.22)` | Bordes |
| `--color-focus` | `#EAD6A9` | Indicador de foco |
| `--shadow-ritual` | sombra negra difusa | Elevación sutil |

El contraste y la jerarquía prevalecen sobre el ornamento. Los colores dorados
tenues se reservan para elementos decorativos y bordes; el texto funcional usa
marfil o gris cálido legible.

## Tipografía y jerarquía

La interfaz combina una serif editorial (`Cormorant Garamond` con Georgia como
alternativa de sistema) para marca, títulos rituales, numerales y nombres de
Arcanos; y una sans serif (`DM Sans`, con Segoe UI y Arial como alternativas)
para cuerpo, controles, etiquetas y explicaciones. Las alternativas evitan
depender de una descarga tipográfica externa y mantienen legibilidad si no hay
fuentes de marca instaladas.

Los textos extensos de interpretación se mantienen en sans serif y con una
altura de línea generosa. Los rótulos espaciados en mayúsculas son breves y
secundarios, no sustituyen títulos descriptivos accesibles.

## Geometría y emblema

`ArcanaEmblem` (`src/components/brand/ArcanaEmblem.tsx`) combina un centro,
círculos concéntricos, eje vertical y horizontal, y un rombo simétrico abierto
hacia cuatro direcciones. Está dibujado como SVG propio, sin detalles históricos
específicos, y se reutiliza en la marca, el reverso, la preparación, el estado de
barajado y el espacio vacío de cartas.

El resto del sistema introduce cuadrados, círculos, ejes y diagonales de manera
selectiva. Cada geometría cumple una función de orientación o marco; no se
añaden todos los motivos a todas las pantallas.

## Marco y reverso

`CardFrame` (`src/components/cards/CardFrame.tsx`) aporta a cada Arcano el
marco, numeral romano, ilustración original, nombre y marca geométrica inferior.
Las variantes de resumen y revelación comparten esa estructura. Las 22
ilustraciones SVG locales forman el conjunto del prototipo; su aprobación
artística final permanece separada de la implementación funcional.

El reverso usa un marco doble dorado, una superficie azul-negra/granate, una
geometría interior simétrica y el emblema central. Todos los dorsos son iguales:
no muestran números de posición ni detalles que permitan distinguir la carta.

## Ritual, movimiento y pantallas pequeñas

La preparación centra una marca compacta, la pregunta, las posiciones de la
tirada y la acción explícita de barajar. El barajado usa una respiración visual
sutil; la revelación utiliza un giro breve de carta y transición de opacidad,
sin partículas ni destellos permanentes.

En móvil, la disposición de tres cartas conserva tres columnas; las tiradas de
cuatro o más se presentan en una cuadrícula secuencial de dos columnas con
etiquetas legibles, en lugar de comprimir la geometría de escritorio. En tableta
y escritorio se conserva la relación espacial definida por cada tirada. Los
controles mantienen foco visible y activación por teclado; `prefers-reduced-motion`
reduce las animaciones.

Los motivos específicos de cada Arcano están documentados en
[`arcana-art-direction.md`](./arcana-art-direction.md). La revisión funcional
comprueba su carga, escala y coherencia; la selección de una técnica artística
final y la aprobación visual siguen requiriendo criterio humano.
