# Sistema de tiradas de ARCANA

## 1. Propósito

Este documento define el sistema base de tiradas de ARCANA. Es la referencia conceptual para convertir sus tiradas, posiciones, geometrías y relaciones en datos y lógica futuros. No implementa el selector ni define un algoritmo de análisis.

Una tirada no es solo un número de cartas: es una estructura simbólica formada por propósito, posiciones, geometría, relaciones entre posiciones y recorrido interpretativo. La unidad básica de lectura es:

**Arcano + posición + relaciones geométricas + recorrido de la tirada + contexto de la consulta.**

La geometría tiene función interpretativa únicamente cuando esta función está definida para la tirada. Izquierda, derecha, arriba, abajo, centro y las figuras geométricas no tienen significados universales dentro de ARCANA.

## 2. Principios generales

### 2.1 Independencia absoluta del azar

La pregunta puede orientar el análisis de intención, la recomendación de tirada y la interpretación posterior, pero nunca puede influir en las cartas seleccionadas.

El flujo de la experiencia es:

**Pregunta → análisis de intención → selección de tirada → explicación al usuario → confirmación → concentración → sorteo aleatorio → cartas → interpretación.**

El sorteo:

- selecciona cartas al azar, sin repetición dentro de una tirada;
- utiliza exclusivamente los 22 Arcanos Mayores;
- recibe únicamente los requisitos de la tirada que necesita para sortear (por ejemplo, la cantidad de cartas);
- no recibe ni consulta la pregunta, su clasificación, el estilo interpretativo ni el significado de las cartas.

La interpretación comienza después del sorteo y no puede modificar, reordenar ni volver a sortear las cartas obtenidas.

### 2.2 Relación con el sistema simbólico

Las tiradas utilizan los nombres y principios de los Arcanos definidos en [symbolic-system.md](./symbolic-system.md). Las posiciones orientan el aspecto de la consulta desde el que se contempla cada carta; no reemplazan ni alteran su principio simbólico.

La secuencia de una tirada puede relacionarse con los cuatro movimientos de ARCANA —Constituirse, Entrar en el mundo, Transformarse y Reintegrarse—, pero no presupone que toda consulta represente un avance lineal ni que los Arcanos indiquen acontecimientos futuros.

## 3. Taxonomía de consultas

El análisis local inicial podrá considerar estas nueve categorías:

1. **Orientación sencilla**
2. **Autoconocimiento**
3. **Decisión o elección**
4. **Transición o transformación**
5. **Bloqueo**
6. **Proyecto o proceso**
7. **Relación interpersonal**
8. **Comprensión profunda de una situación**
9. **Consulta abierta o compleja**

No son categorías mutuamente excluyentes. Una consulta puede tener una intención primaria y cero o más dimensiones secundarias. Por ejemplo: decisión + proyecto; transición + autoconocimiento; relación + bloqueo; proyecto + incertidumbre.

El futuro selector identificará la intención dominante y tendrá en cuenta las dimensiones secundarias para distinguir entre estructuras potencialmente adecuadas. Esta taxonomía describe conceptos de consulta, no reglas de palabras clave ni un algoritmo.

## 4. Catálogo de tiradas

El catálogo contiene exactamente nueve tiradas. Sus identificadores son estables y no dependen de la traducción de sus nombres visibles.

### 4.1 La Semilla

- **Identificador:** `la-semilla`
- **Propósito:** Orientación sencilla cuando la pregunta necesita identificar el núcleo de una cuestión.
- **Tipo principal de consulta:** Orientación sencilla.
- **Número de cartas:** 3.
- **Geometría:**

  ```text
          [2]
           │
      [1]──┴──[3]
  ```

- **Posiciones:**
  1. **Tierra:** realidad o condición desde la que parte la cuestión.
  2. **Semilla:** principio, posibilidad o cuestión esencial que está emergiendo.
  3. **Brote:** dirección que merece atención.
- **Relaciones internas:** La posición 1 ofrece la condición de partida; la 2 nombra el potencial esencial que surge de ella; la 3 pone ese potencial en relación con una dirección de atención. La geometría no añade significados espaciales distintos a estas definiciones.
- **Recorrido interpretativo:** condición → potencial → orientación.
- **Criterios de uso:** consultas acotadas que buscan una orientación inicial o identificar qué principio merece atención.
- **Criterios de no uso:** no presentar automáticamente la secuencia como pasado → presente → futuro. Para una exploración más amplia, considerar una tirada cuya estructura corresponda mejor a la consulta.

### 4.2 El Espejo

- **Identificador:** `el-espejo`
- **Propósito:** Autoconocimiento y comprensión de la propia posición o percepción ante una situación.
- **Tipo principal de consulta:** Autoconocimiento.
- **Número de cartas:** 5.
- **Geometría:**

  ```text
          [2]

     [1]  [3]  [4]

          [5]
  ```

- **Posiciones:**
  1. **Rostro:** lo que el consultante reconoce conscientemente.
  2. **Luz:** recurso, capacidad o aspecto constructivo disponible.
  3. **Reflejo:** núcleo de la cuestión interior.
  4. **Sombra:** aquello que puede estar siendo evitado, proyectado o todavía no reconocido.
  5. **Integración:** elemento que permite contemplar conjuntamente las posiciones anteriores.
- **Relaciones internas:** La posición 3 articula la exploración interior; las posiciones 1, 2 y 4 aportan perspectivas diferenciadas, y la 5 las contempla en conjunto. Estas relaciones se derivan de la función de las posiciones, no de una semántica universal de su colocación.
- **Recorrido interpretativo:** identidad percibida → recurso → núcleo → sombra → integración.
- **Criterios de uso:** consultas centradas en la propia percepción, posición o experiencia interior ante una situación.
- **Criterios de no uso:** no utilizar la posición de sombra como diagnóstico ni como afirmación de una verdad oculta.

### 4.3 La Encrucijada

- **Identificador:** `la-encrucijada`
- **Propósito:** Explorar decisiones entre caminos posibles.
- **Tipo principal de consulta:** Decisión o elección.
- **Número de cartas:** 6.
- **Geometría:**

  ```text
            [1]
             │
        ┌────┴────┐
       [2]       [3]
        │         │
       [4]       [5]
        └────┬────┘
            [6]
  ```

- **Posiciones:**
  1. **Centro de la decisión:** qué se está eligiendo realmente.
  2. **Camino A:** principio que caracteriza la primera posibilidad.
  3. **Camino B:** principio que caracteriza la segunda posibilidad.
  4. **Desarrollo de A:** qué exige, activa o pone en juego ese camino.
  5. **Desarrollo de B:** qué exige, activa o pone en juego ese camino.
  6. **Criterio:** principio que puede ayudar a contemplar conscientemente la decisión.
- **Relaciones internas:** Las posiciones 2 y 4 forman la rama A; 3 y 5 forman la rama B. La posición 1 es conceptualmente anterior a ambas ramas. La posición 6 relaciona y contempla las dos posibilidades.
- **Recorrido interpretativo:** centro de la decisión → comparación de caminos y sus desarrollos → criterio de contemplación.
- **Criterios de uso:** consultas con dos o más alternativas explícitas o una elección que la persona desea explorar.
- **Criterios de no uso:** no presentar A como buena y B como mala, ni a la inversa; no presentar ninguna posición como predicción de lo que ocurrirá; no convertir la posición 6 en una orden sobre qué decidir.

### 4.4 El Umbral

- **Identificador:** `el-umbral`
- **Propósito:** Explorar transiciones, cambios de etapa y procesos de transformación.
- **Tipo principal de consulta:** Transición o transformación.
- **Número de cartas:** 5.
- **Geometría:**

  ```text
            [2]
             │
       [1]──[3]──[4]
             │
            [5]
  ```

- **Posiciones:**
  1. **Lo que queda atrás:** aspecto del origen que se está dejando.
  2. **La fuerza que impulsa el tránsito:** principio que pone en marcha o sostiene el cambio.
  3. **El umbral:** núcleo de la transformación en curso.
  4. **Lo que comienza a emerger:** posibilidad que empieza a tomar forma.
  5. **Clave de integración:** principio desde el que relacionar el tránsito y sus distintas partes.
- **Relaciones internas:** La posición 3 articula el umbral; 1 y 4 relacionan lo que se deja con lo que emerge; 2 aporta el impulso y 5 permite integrar la lectura.
- **Recorrido interpretativo:** origen → impulso → transformación → emergencia → integración.
- **Criterios de uso:** consultas sobre cambios importantes, transiciones o procesos de transformación.
- **Criterios de no uso:** la posición 4 representa emergencia simbólica, no predicción futura.

### 4.5 El Nudo

- **Identificador:** `el-nudo`
- **Propósito:** Comprender bloqueos, contradicciones o situaciones repetitivas.
- **Tipo principal de consulta:** Bloqueo.
- **Número de cartas:** 5.
- **Geometría:**

  ```text
       [1]       [2]
          \     /
            [3]
          /     \
       [4]       [5]
  ```

- **Posiciones:**
  1. **Manifestación:** cómo aparece el bloqueo.
  2. **Tensión:** qué fuerza contribuye a mantenerlo.
  3. **Nudo:** contradicción o principio central de la situación.
  4. **Hilo:** recurso o comprensión que permite empezar a desenredarlo.
  5. **Apertura:** perspectiva que puede ampliar la comprensión.
- **Relaciones internas:** Las posiciones 1 y 2 convergen en la 3, que expresa el núcleo de la contradicción. Las posiciones 4 y 5 abren perspectivas para contemplar el nudo y su manifestación.
- **Recorrido interpretativo:** manifestación y tensión → núcleo → recurso y apertura.
- **Criterios de uso:** consultas sobre contradicciones, bloqueos o dinámicas que parecen repetirse.
- **Criterios de no uso:** no considerar ni presentar el bloqueo como diagnóstico psicológico.

### 4.6 El Sendero

- **Identificador:** `el-sendero`
- **Propósito:** Explorar proyectos y procesos creativos, académicos, profesionales o evolutivos.
- **Tipo principal de consulta:** Proyecto o proceso.
- **Número de cartas:** 6.
- **Geometría:**

  ```text
  [1] → [2] → [3] → [4] → [5] → [6]
  ```

- **Posiciones:**
  1. **Origen:** punto de partida del proyecto o proceso.
  2. **Motivación:** impulso que lo anima.
  3. **Recurso disponible:** capacidad o elemento con el que se cuenta.
  4. **Desafío:** aspecto que plantea una exigencia o tensión.
  5. **Movimiento necesario:** acción o cambio de enfoque que merece atención.
  6. **Horizonte:** dirección hacia la que orientar la atención.
- **Relaciones internas:** Las posiciones forman una secuencia explícita: cada etapa se contempla en relación con la anterior y prepara la siguiente.
- **Recorrido interpretativo:** origen → impulso → recursos → desafío → movimiento → orientación.
- **Criterios de uso:** consultas sobre el desarrollo de un proyecto o proceso creativo, académico, profesional o evolutivo.
- **Criterios de no uso:** el horizonte representa una dirección de atención, no un futuro predicho.

### 4.7 Los Dos Rostros

- **Identificador:** `los-dos-rostros`
- **Propósito:** Explorar simbólicamente una dinámica interpersonal.
- **Tipo principal de consulta:** Relación interpersonal.
- **Número de cartas:** 6.
- **Geometría:**

  ```text
       [1]       [2]
        │         │
       [3]───[5]──[4]
              │
             [6]
  ```

- **Posiciones:**
  1. **Posición A:** cómo aparece una parte de la dinámica dentro del contexto disponible.
  2. **Posición B:** cómo aparece la otra parte de la dinámica dentro del contexto disponible.
  3. **Necesidad o tensión de A.**
  4. **Necesidad o tensión de B.**
  5. **Campo compartido.**
  6. **Clave relacional.**
- **Relaciones internas:** Las posiciones 1 y 3 exploran una vertiente de la dinámica; 2 y 4, la otra. La posición 5 contempla el campo compartido y la 6 aporta una clave para reflexionar sobre la relación entre ellas.
- **Recorrido interpretativo:** posiciones A y B → necesidades o tensiones → campo compartido → clave relacional.
- **Criterios de uso:** consultas sobre una dinámica interpersonal, descrita desde el contexto aportado por quien consulta.
- **Criterios de no uso:** la lectura aborda dinámica, interacción, tensiones y perspectiva de la consulta. Sin información aportada, no debe afirmar qué piensa, siente, quiere o hará la otra persona, ni atribuirle estados internos desconocidos.

### 4.8 La Rosa

- **Identificador:** `la-rosa`
- **Propósito:** Comprender en profundidad una situación formada por varias dimensiones interrelacionadas.
- **Tipo principal de consulta:** Comprensión profunda de una situación.
- **Número de cartas:** 7.
- **Geometría:**

  ```text
             [2]

        [3]  [1]  [4]

          [5]   [6]

             [7]
  ```

- **Posiciones:**
  1. **Centro:** principio esencial de la situación.
  2. **Lo visible:** lo evidente o conscientemente reconocido.
  3. **Raíz:** aquello sobre lo que se sostiene la situación.
  4. **Tensión:** fuerza que introduce conflicto o movimiento.
  5. **Recurso:** elemento disponible.
  6. **Lo no integrado:** aspecto que necesita ponerse en relación con el conjunto.
  7. **Síntesis:** principio desde el que contemplar la totalidad.
- **Relaciones internas:** La posición 1 constituye el centro interpretativo. Cada posición periférica se contempla en relación con ese centro; la posición 7 ofrece una síntesis, no una secuencia temporal.
- **Recorrido interpretativo:** centro → dimensiones periféricas en relación con el centro → síntesis.
- **Criterios de uso:** consultas complejas en las que varias dimensiones están relacionadas y se necesita una lectura organizada alrededor de un núcleo.
- **Criterios de no uso:** no interpretar automáticamente las posiciones periféricas como una secuencia temporal.

### 4.9 El Círculo

- **Identificador:** `el-circulo`
- **Propósito:** Explorar consultas abiertas, ambiguas o complejas que no encajan suficientemente en otra estructura.
- **Tipo principal de consulta:** Consulta abierta o compleja.
- **Número de cartas:** 7.
- **Geometría:**

  ```text
             [2]

        [3]       [7]

             [1]

        [4]       [6]

             [5]
  ```

- **Posiciones:**
  1. **Centro:** núcleo de la cuestión.
  2. **Conciencia:** lo claramente reconocido.
  3. **Origen:** de dónde procede parte de la dinámica.
  4. **Sombra:** tensión o aspecto menos reconocido.
  5. **Materia:** cómo se concreta la cuestión.
  6. **Movimiento:** qué está cambiando.
  7. **Apertura:** nueva perspectiva desde la que contemplar el conjunto.
- **Relaciones internas:** La posición 1 organiza la lectura del núcleo; las posiciones 2 a 7 exploran dimensiones distintas de la consulta en relación con él. La disposición no impone una secuencia temporal.
- **Recorrido interpretativo:** centro → dimensiones de la cuestión → apertura desde la que contemplar el conjunto.
- **Criterios de uso:** consultas abiertas o complejas cuando el análisis no encuentra una estructura más específica que responda a la intención dominante. Es una tirada abierta y un fallback razonado.
- **Criterios de no uso:** no convertirla automáticamente en la tirada predeterminada cuando el análisis tenga dificultades. Una dificultad para clasificar no basta, por sí sola, para concluir que la consulta necesita una estructura abierta.

## 5. Selección de tirada

El futuro selector recomendará una estructura a partir de la intención de la consulta. Conceptualmente deberá considerar, al menos:

- intención primaria y dimensiones secundarias;
- complejidad y grado de apertura de la consulta;
- existencia de dos o más alternativas explícitas;
- presencia de una transición;
- presencia de una dinámica interpersonal;
- existencia de un bloqueo o repetición;
- existencia de un proyecto o proceso.

La selección no deberá basarse exclusivamente en palabras clave. Los ejemplos siguientes ilustran correspondencias entre intención y estructura; no son reglas literales:

- «¿Qué debería tener en cuenta para decidir entre estas dos opciones?» → **La Encrucijada**.
- «No entiendo por qué sigo encontrándome con el mismo problema.» → **El Nudo**.
- «¿Qué necesito comprender sobre mi posición ante esta situación?» → **El Espejo**.
- «¿Qué debería tener presente mientras desarrollo este proyecto?» → **El Sendero**.
- «Estoy atravesando un cambio importante y quiero comprender qué está ocurriendo.» → **El Umbral**.

Si varias tiradas fueran razonablemente apropiadas, el selector deberá identificar la intención dominante, escoger la mejor correspondencia, explicar brevemente el motivo y permitir que la persona vea y seleccione otra tirada. La recomendación no sustituye la elección de la persona. Esta sección describe el comportamiento conceptual; no define el algoritmo.

### Confianza en la recomendación

La confianza describe cuán claramente encaja la estructura con la consulta; no mide la validez de una interpretación.

- **Alta:** una tirada encaja claramente con la estructura de la consulta.
- **Media:** existen dos posibilidades razonables, pero una responde mejor a la intención dominante.
- **Baja:** la pregunta es demasiado abierta o ambigua para distinguir claramente una tirada.

Una confianza baja no debe fingir certeza. La interfaz futura podrá explicar la ambigüedad, proponer **El Círculo** o permitir que la persona seleccione manualmente otra tirada. No se definen valores numéricos de confianza.

## 6. Geometría y relaciones

El futuro motor podrá reconocer relaciones estructurales como sucesión, oposición, simetría, centralidad, ramificación, convergencia, adyacencia, eje vertical, eje horizontal, relación radial, inicio y cierre.

Estas propiedades describen cómo se conectan posiciones. No poseen significado universal: su lectura depende de cómo estén definidas dentro de cada tirada. La geometría nunca autoriza a inferir, sin una definición expresa, un significado para izquierda, derecha, arriba, abajo, centro o una figura geométrica.

Ejemplos de relaciones definidas en el catálogo:

- **La Encrucijada:** 2 ↔ 4 forman el desarrollo de A; 3 ↔ 5 forman el desarrollo de B; 1 precede conceptualmente a ambas ramas; 6 ofrece un criterio de contemplación, no una predicción ni una orden.
- **La Rosa:** 1 es el centro interpretativo; cada posición periférica se lee como **Arcano + posición + relación con el centro**.
- **El Sendero:** las posiciones forman un recorrido secuencial cuyo orden tiene importancia especial.

Estas relaciones organizan la lectura, pero no deben convertirse en reglas mecánicas absolutas.

## 7. Integración con el sistema simbólico

La interpretación posterior combinará:

1. núcleo del Arcano;
2. manifestaciones luminosa y sombría;
3. movimiento del Arcano dentro del recorrido de ARCANA;
4. posición en la tirada;
5. relaciones geométricas pertinentes a esa tirada;
6. secuencia o recorrido de la tirada;
7. contexto de la pregunta;
8. estilo interpretativo seleccionado.

La gramática relacional debe poder expresar secuencias conceptuales como **estructura → ruptura → integración** o **incertidumbre → discernimiento → claridad**, sin almacenar por adelantado todas las combinaciones posibles entre los 22 Arcanos. La tirada proporciona contexto y relaciones para explorar; no predetermina el significado de la carta.

## 8. Experiencia del usuario

El flujo general de uso será:

1. Formular una pregunta.
2. Analizar su intención.
3. Recomendar una tirada.
4. Presentar el nombre, la finalidad, el número de cartas, las posiciones y el motivo de la recomendación.
5. Permitir aceptar la propuesta o cambiar la tirada.
6. Mostrar la disposición vacía.
7. Invitar brevemente a concentrarse en la pregunta.
8. Permitir que la persona active el barajado.
9. Seleccionar aleatoriamente las cartas de manera independiente de la pregunta y del análisis.
10. Revelar las cartas progresivamente.
11. Interpretar las posiciones.
12. Explorar las relaciones entre cartas.
13. Presentar una síntesis.
14. Ofrecer una pregunta final de reflexión.

## 9. Transparencia interpretativa

Las tiradas son estructuras de exploración simbólica y reflexión. ARCANA no afirma predecir acontecimientos futuros con certeza ni presenta interpretaciones como hechos. No establece diagnósticos, no atribuye estados mentales desconocidos a terceros y no presenta decisiones como obligatorias. La experiencia no sustituye asesoramiento profesional en situaciones en las que exista riesgo.

El lenguaje debe ser reflexivo y no determinista: ofrece perspectivas para contemplar, no certezas ni instrucciones.
