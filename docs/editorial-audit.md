# Auditoría y corpus editorial

El corpus editorial es un conjunto de ejemplos ficticios para revisión humana y
pruebas locales. Se mantiene separado de las reglas de producción: sus
expectativas expresan criterio editorial y nunca se infieren ejecutando el
clasificador. No contiene consultas reales de usuarios.

## Incorporar un caso

Antes de añadir un ejemplo en
[`src/engine/editorial/editorialCorpus.ts`](../src/engine/editorial/editorialCorpus.ts):

1. Escribe una consulta ficticia o anonimizada; no copies datos personales de
   usuarios.
2. Asigna una expectativa editorial humana: sensibilidad y categoría, foco en
   terceros, comportamiento esperado y etiquetas.
3. Explica en `rationale` por qué corresponde esa expectativa.
4. Usa `ambiguity` cuando falte contexto; en esos casos representa la expectativa
   como `AMBIGUOUS` y explica qué información falta, sin forzar una categoría.
5. Marca el caso `reviewed`, `pending` o `disputed`. Los casos ambiguos nuevos
   quedan pendientes por defecto; revisa explícitamente las expectativas antes
   de marcarlos como revisados.
6. Añade o ajusta pruebas de regresión y ejecuta la evaluación.

El corpus no es una fuente de reglas ni debe ajustarse para maximizar una
puntuación. No añadas reglas de producción por un único desacuerdo.

## Cobertura del corpus consolidado

El corpus tiene **40 casos ficticios**. La distribución de expectativas es:

| Categoría | Casos |
|---|---:|
| MEDICAL | 4 |
| FINANCIAL | 3 |
| LEGAL | 4 |
| SAFETY | 3 |
| CRISIS | 2 |
| OTHER_SENSITIVE | 4 |
| NON_SENSITIVE | 15 |
| AMBIGUOUS | 5 |

Estados de revisión: **35 revisados**, **5 pendientes** y **ninguno disputado**.
Hay **35 casos claros** y **5 ambiguos**. Los casos pendientes y ambiguos no
entran en las métricas de acierto.

Los cinco casos ambiguos permanecen pendientes intencionalmente: el texto aislado
no permite decidir su categoría sin contexto. Sus coincidencias exactas siguen
restringidas al proveedor externo hasta una revisión contextual.

La revisión de `literal-tower-damaged-building` confirmó un peligro estructural
concreto. El clasificador ahora reconoce edificios, estructuras, puentes, paredes
y techos dañados o inestables en cualquier orden; el caso se clasifica como
SAFETY y queda revisado. Los **35 casos claros revisados** coinciden con la
clasificación actual: **35/35**, sin desacuerdos claros conocidos.

La matriz puede consultarse mediante `evaluateEditorialCorpus()` y
`getCategoryDistribution()` en
[`src/engine/editorial/evaluateEditorialCorpus.ts`](../src/engine/editorial/evaluateEditorialCorpus.ts).
El evaluador informa casos claros y ambiguos, estados de revisión, falsos
positivos y negativos, desacuerdos, categorías confundidas, precisión, recall y
exactitud. Estas medidas describen únicamente este corpus seleccionado; no son
una garantía científica de comprensión lingüística ni se muestran a usuarios.

### Registro histórico de la Fase 8

La evaluación anterior a la consolidación informó 34/34 en el banco de Fase 8.
No es directamente comparable con la cifra actual: durante esta fase se
reclasificaron casos con contexto insuficiente como ambiguos y se añadieron
casos frontera. Los resultados actuales usan solo expectativas humanas revisadas,
mantienen los casos ambiguos fuera de la métrica y no alteran las reglas del
clasificador.

## Ambigüedades y límites

Se conservan como dependientes del contexto preguntas como «¿Debería volver a
casa?», «¿Puedo confiar en alguien cercano?», «¿Me conviene firmar este
acuerdo?» y «¿Es el momento adecuado para aceptar esta propuesta?». Sin contexto,
no es responsable inferir si son consultas sensibles o normales. La etiqueta
`AMBIGUOUS` no significa que la pregunta sea segura: significa que el texto no
permite decidirlo con suficiente criterio.

La colección `TAROT_BOUNDARY_CASES` mantiene pares simbólicos y literales para
La Muerte, La Justicia, El Juicio, El Diablo, La Torre y La Fuerza. Por ejemplo,
el nombre de La Justicia en una tirada no equivale a pedir orientación sobre un
procedimiento legal. La pregunta literal sobre una muerte se mantiene ambigua
para no convertirla en una predicción ni asumir el contexto.

Un clasificador basado en reglas puede pasar por alto sinónimos, ironía,
negaciones, contexto previo y significados implícitos; también puede confundir
palabras polisémicas con un tema sensible. Casos de peligro inmediato o
consecuencias reales no siempre pueden identificarse a partir de una frase
aislada. La evaluación humana y, cuando corresponda, el contexto adicional
siguen siendo necesarios. El corpus no interviene en el sorteo, las cartas, las
posiciones, las relaciones ni `SymbolicReading`.
