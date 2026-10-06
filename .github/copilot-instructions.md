# Instrucciones permanentes de ARCANA

## Propósito

ARCANA es una aplicación web de Tarot simbólico y reflexivo basada exclusivamente en los 22 Arcanos Mayores tradicionales, del 0, El Loco, al XXI, El Mundo. Conserva sus nombres y numeración tradicionales y desarrolla un sistema simbólico propio. Las ilustraciones deben ser originales.

## Arquitectura

- Base tecnológica: React, TypeScript y Vite.
- Inicialmente, aplicación local en el navegador, sin servidor ni base de datos.
- Mantén separados los datos de los arcanos, las tiradas, los estilos interpretativos, el análisis de preguntas, la selección de tirada, el sorteo, la interpretación, la interfaz y las animaciones.
- Define contratos desacoplados para el análisis de preguntas y la interpretación. Sus implementaciones locales deben poder sustituirse o complementarse con servicios de IA sin acoplarlos a la interfaz ni al resto del dominio.

## Separación de responsabilidades e independencia del azar

- El análisis de la pregunta recomienda una tirada; no selecciona cartas.
- El sorteo recibe únicamente los requisitos de la tirada (por ejemplo, cuántas cartas hacen falta). No debe recibir, consultar ni depender de la pregunta, su análisis, la interpretación o los resultados de interpretación.
- La interpretación se ejecuta solo después del sorteo y recibe las cartas ya seleccionadas junto con la pregunta, las posiciones, la tirada y el estilo.
- La interpretación, local o asistida por IA, nunca puede cambiar, volver a sortear ni reordenar las cartas seleccionadas. Mantén esta restricción explícita en los contratos y las pruebas.

## Recorrido simbólico de ARCANA

El recorrido de los 22 Arcanos es parte del sistema interpretativo:

- **0–V — Constituirse:** El Loco → El Mago → La Sacerdotisa → La Emperatriz → El Emperador → El Sumo Sacerdote. Potencial → voluntad → conocimiento → creación → estructura → transmisión.
- **VI–X — Entrar en el mundo:** Los Enamorados → El Carro → La Justicia → El Ermitaño → La Rueda de la Fortuna. Elección → dirección → consecuencia → introspección → ciclo.
- **XI–XVI — Transformarse:** La Fuerza → El Colgado → La Muerte → La Templanza → El Diablo → La Torre. Integración del instinto → suspensión → transformación → recomposición → sombra → ruptura.
- **XVII–XXI — Reintegrarse:** La Estrella → La Luna → El Sol → El Juicio → El Mundo. Esperanza → inconsciente → claridad → despertar → totalidad.

## Principios de interpretación

- Ofrece posibilidades de reflexión, no significados inevitables ni combinaciones rígidas memorizadas.
- Considera la carta, su posición y la pregunta; explora relaciones entre cartas mediante progresiones, retrocesos, contrastes, polaridades, refuerzos y transiciones entre movimientos.
- Presenta la lectura como simbólica, cultural, creativa y reflexiva; nunca como predicción cierta, diagnóstico ni hecho.

## Principios visuales

Busca una experiencia elegante, oscura, contemplativa, misteriosa y minimalista. Prioriza negro profundo, azul noche, granate, oro envejecido y marfil; inspírate en geometría sagrada, alquimia, astronomía, simbolismo iniciático, tradición esotérica occidental, imaginario rosacruz y elementos naturales. Evita la estética de casino, videojuego o adivinación comercial. No copies ilustraciones de otras barajas.

## Calidad

- Mantén cambios simples, tipados, accesibles y coherentes con la arquitectura existente; evita dependencias y complejidad innecesarias.
- Conserva las responsabilidades separadas y comunica los errores de forma explícita.
- Añade o actualiza pruebas para toda lógica importante, especialmente el análisis y selección de tiradas, el sorteo independiente, la interpretación y la inmutabilidad de las cartas sorteadas.
- Ejecuta las pruebas y verificaciones pertinentes antes de dar por terminado un cambio.
