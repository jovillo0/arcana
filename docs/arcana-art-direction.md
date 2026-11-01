# Dirección artística de los 22 Arcanos Mayores

Esta guía traduce el sistema simbólico propio de ARCANA a instrucciones para
futuras ilustraciones. Es documentación de producción artística, no datos de
runtime: las fichas fuente siguen siendo `src/data/arcana/arcana.ts`, y este
documento no se importa en la aplicación ni aumenta su bundle.

Las ilustraciones deberán ser originales. Las referencias a hermetismo,
alquimia, geometría, naturaleza, astronomía y manuscritos describen un campo de
inspiración general; no autorizan a reproducir composiciones, personajes,
ornamentos, diagramas o emblemas concretos de Rider-Waite-Smith, Marsella,
Thoth ni de ninguna otra baraja.

## Dirección común

### Gramática visual de ARCANA

Estas asociaciones son convenciones creativas internas de ARCANA, no reglas
históricas universales:

| Forma | Uso en este sistema visual |
|---|---|
| Punto | Origen, centro, conciencia |
| Círculo | Totalidad, ciclo, unidad |
| Círculo abierto | Posibilidad, proceso incompleto |
| Eje vertical | Relación entre niveles, ascenso, manifestación |
| Triángulo ascendente | Impulso, proyección, acción |
| Triángulo descendente | Recepción, interiorización, descenso |
| Cuadrado | Estructura, materia, estabilidad |
| Pentágono | Organización dinámica y conocimiento |
| Hexágono | Integración y equilibrio |
| Espiral | Transformación, recorrido, evolución |
| Estrella | Orientación |

La geometría se incorpora a la arquitectura, el paisaje, la luz o la relación
entre formas; no debe parecer un sello pegado sobre una escena. Cada carta
selecciona un motivo dominante y pocos apoyos. Si un símbolo no aporta al núcleo
o al principio transformador de la ficha, se omite.

### Paleta, luz y formato

- **Base compartida:** negro azulado profundo, granate oscuro, oro envejecido,
  marfil y gris cálido, según los tokens de `docs/visual-identity.md`.
- **Tonos secundarios:** cada ficha propone uno o dos matices apagados. Deben
  ocupar superficies pequeñas o medios tonos y nunca desplazar la paleta común.
- **Luz:** siempre tiene origen, dirección e intención narrativa. El oro no es
  un resplandor automático; puede aparecer como línea, reflejo o fuente precisa.
- **Formato:** retrato vertical dentro de `CardFrame`. Reservar margen interior
  para el numeral superior y el nombre inferior; mantener libre de detalle
  crítico el borde y el pequeño signo geométrico del pie.
- **Lectura reducida:** silueta, dirección y foco deben reconocerse en miniatura.
  Limitar microdetalle, texturas de fondo y elementos que dependan de leer
  inscripciones.
- **Figuras:** pueden ser humanas, abstractas, animales, vegetales o ausentes.
  No necesitan repetir una iconografía histórica para que la carta se entienda.

### Progresión de los cuatro movimientos

1. **0–V · Constituirse:** el espacio parte abierto y poco definido; el punto,
   la semilla y el eje van adquiriendo acción, crecimiento, estructura y,
   finalmente, transmisión. La densidad aumenta gradualmente.
2. **VI–X · Entrar en el mundo:** aparecen elecciones, recorridos, límites,
   consecuencias y ciclos. El horizonte y los ejes se hacen más explícitos;
   las composiciones equilibran interior y exterior.
3. **XI–XVI · Transformarse:** el espacio se comprime, suspende, atraviesa y
   recompone. La geometría se pliega, abre o quiebra con control; la sombra gana
   presencia sin convertir estas cartas en escenas de terror.
4. **XVII–XXI · Reintegrarse:** tras la ruptura vuelve el horizonte. El foco
   progresa de una estrella pequeña a una percepción doble, una luz manifiesta,
   una llamada ascendente y un círculo completo. La última carta integra formas
   previas sin ser simplemente más brillante o recargada.

### Motivos que recorren la baraja

- **Punto y luz:** punto distante en El Loco; foco dirigido en El Mago; luz
  guardada en La Sacerdotisa; lámpara transmitida en El Sumo Sacerdote; estrella
  interior del Ermitaño; orientación exterior de La Estrella; disco de El Sol;
  centro integrado de El Mundo.
- **Semilla, crecimiento y forma:** semilla en El Loco; gestación en La
  Emperatriz; árbol estructurado en El Emperador; forma agotada y brote en La
  Muerte; círculo vegetal integrado en El Mundo. No es una transformación
  literal obligatoria: es una rima formal entre imágenes.
- **Umbral y trayecto:** horizonte abierto, senderos que se encuentran, camino
  dirigido, arco de transmisión, puerta de cambio, puente, fisura y puertas
  finales. Cada umbral debe indicar una transición distinta, no repetir el
  mismo portal.
- **Círculo abierto/completo:** posibilidad, ciclos y procesos en curso; se
  completa solo en El Mundo, donde encierra sin clausurar nuevos comienzos.
- **Eje vertical:** primero acción y niveles, luego suspensión y luz interior,
  y finalmente ascenso, manifestación y totalidad. Puede reaparecer como
  plomada, sendero, columna de luz o espacio entre planos, no siempre como línea
  dibujada.
- **Materia que cambia:** agua, piedra, hoja, fuego y luz conservan continuidad
  visual, pero cambian de estado de una carta a otra.

## Fichas de dirección artística

Los núcleos, expresiones luminosa y sombría, geometrías, símbolos, elementos y
principios transformadores se han contrastado con la ficha correspondiente en
`src/data/arcana/arcana.ts`. “Detalle oculto” designa un único acento secundario
por ilustración, nunca una búsqueda de objetos escondidos que compita con la
composición.

### 0 · El Loco — Constituirse

1. **Idea visual central:** una posibilidad inicia el movimiento sin que el
   camino esté resuelto.
2. **Núcleo simbólico:** posibilidad antes de tomar forma.
3. **Composición:** retrato vertical con mucho aire en la mitad superior. Foco
   en una semilla junto al borde de un horizonte amplio; primer plano de terreno
   incompleto, plano medio de una senda que aún no decide dirección y fondo de
   cielo oscuro abierto. La mirada asciende desde la semilla hacia una estrella
   pequeña.
4. **Figura principal:** opcional; una figura mínima de espaldas puede estar a
   punto de dar un paso, sin gesto de caída ni pose heroica. El espacio pesa más
   que la persona.
5. **Geometría dominante:** círculo abierto integrado en el horizonte; la
   abertura queda hacia el lado del movimiento.
6. **Símbolos:** horizonte abierto → camino aún no fijado; espiral incompleta →
   proceso que comienza; viento → impulso invisible; semilla → potencial;
   estrella blanca → orientación posible, no garantía.
7. **Elemento natural:** viento, suelo y semilla.
8. **Luz:** una luz fría, muy tenue, detrás del horizonte; lateral y amplia, con
   intensidad baja. Señala apertura sin iluminar todo el recorrido.
9. **Paleta secundaria:** azul mineral apagado y blanco ceniza.
10. **Dimensión luminosa:** el espacio invita a avanzar y conserva libertad.
11. **Dimensión sombría:** los bordes del sendero se disuelven en niebla, haciendo
    visible la posibilidad de dispersión o evasión sin una amenaza literal.
12. **Detalle oculto:** la semilla proyecta una sombra ligeramente más larga que
    su tamaño, insinuando un crecimiento todavía invisible.
13. **Continuidad:** antes de El Mago, la estrella es un punto sin instrumento;
    después, su luz puede concentrarse en el punto de acción. En el cierre de El
    Mundo, la abertura formal retorna como un pequeño espacio de nuevo comienzo.
14. **Evitar:** precipicio dramático, perro acompañante, hatillo, sol de salida
    obligatorio, vestuario de bufón, gesto de salto y cualquier composición
    reconocible de una carta histórica.

### I · El Mago — Constituirse

1. **Idea visual central:** el potencial se concentra en una acción creadora
   concreta.
2. **Núcleo simbólico:** voluntad que transforma posibilidad en acción.
3. **Composición:** una mesa-altar vista en leve perspectiva organiza el primer
   plano; el foco es un punto activo en su centro. En el plano medio, una vara
   vertical conecta mesa y cielo; al fondo, un círculo contenido en un cuadrado.
   La mirada va del punto a la vara y regresa a la superficie de trabajo.
4. **Figura principal:** puede aparecer un artesano de pie, con manos visibles y
   postura estable; su función es disponer recursos, no exhibir poder mágico.
5. **Geometría dominante:** punto dentro del círculo, con cuadrado discreto como
   límite operativo.
6. **Símbolos:** mesa o altar → recursos disponibles; cuatro formas elementales
   abstractas → diversidad de medios; vara vertical → voluntad que enlaza
   intención y acción; círculo → posibilidad; cuadrado → trabajo situado.
7. **Elemento natural:** cuatro materiales diferenciados (piedra, agua, hoja y
   brasa) sin asignarles doctrinas históricas.
8. **Luz:** fuente interior pequeña desde el punto de trabajo; luz dirigida hacia
   arriba, de intensidad moderada. Expresa concentración y hace visibles tanto
   capacidad como responsabilidad.
9. **Paleta secundaria:** cobre mate y verde mineral oscuro.
10. **Dimensión luminosa:** los recursos están disponibles y ordenados para una
    acción limitada y consciente.
11. **Dimensión sombría:** una sombra lateral de la vara se multiplica en líneas
    cruzadas: voluntad que puede convertirse en artificio o control.
12. **Detalle oculto:** una de las cuatro formas no está en la mesa, sino en la
    mano que trabaja, recordando que el recurso también puede ser una capacidad
    propia.
13. **Continuidad:** recibe la estrella-punto de El Loco y la vuelve foco
    intencional; entrega a La Sacerdotisa una zona de silencio al otro lado del
    círculo.
14. **Evitar:** mano haciendo trucos, pentagrama ornamental, mesa con objetos
    tomados de una baraja histórica, postura de prestidigitador y chispas
    sobrenaturales sin función.

### II · La Sacerdotisa — Constituirse

1. **Idea visual central:** un conocimiento profundo puede madurar sin
   manifestarse todavía.
2. **Núcleo simbólico:** conocimiento que todavía no necesita manifestarse.
3. **Composición:** un velo translúcido separa primer plano y fondo sin ocultarlo
   del todo. Dos círculos entrelazados dominan el plano medio; un libro cerrado
   queda fuera del eje central. El fondo contiene agua oscura y una luna parcial.
   La mirada se mueve de la superficie reflejada al espacio entre círculos.
4. **Figura principal:** figura sentada o de pie en reposo, mirada baja, manos
   quietas; no custodia una doctrina, sostiene la atención.
5. **Geometría dominante:** dos círculos entrelazados; su intersección es visible
   pero no iluminada por completo.
6. **Símbolos:** velo → conocimiento aún no exteriorizado; dos columnas
   abstractas → tensión que se mantiene abierta; luna → percepción indirecta;
   agua oscura → profundidad no resuelta; libro cerrado → saber que no requiere
   exhibición.
7. **Elemento natural:** agua nocturna y luna velada.
8. **Luz:** reflejo lunar oblicuo sobre el agua, intensidad baja; su origen no se
   muestra. Sugiere observación, no revelación absoluta.
9. **Paleta secundaria:** azul petróleo y plata envejecida.
10. **Dimensión luminosa:** el silencio contiene atención, profundidad e
    intuición.
11. **Dimensión sombría:** el velo también puede volverse opaco y aislar; la
    composición no confirma que lo oculto sea una verdad secreta.
12. **Detalle oculto:** una línea de agua cruza la intersección de los círculos
    sin alterar ninguno.
13. **Continuidad:** La Sacerdotisa enfría la acción puntual del Mago; La
    Emperatriz recoge esa reserva como posibilidad de gestación.
14. **Evitar:** dos pilares identificables de iconografía histórica, corona
    lunar, texto legible, pergaminos proféticos y estética de sacerdotisa
    fantástica.

### III · La Emperatriz — Constituirse

1. **Idea visual central:** la vida crece cuando recibe materia, espacio y
   cuidado.
2. **Núcleo simbólico:** gestación y expansión de la vida.
3. **Composición:** el plano inferior muestra suelo húmedo y una corriente; el
   plano medio contiene una granada abierta y tres semillas que inician una
   espiral vegetal; un árbol joven ocupa el centro. El fondo se abre en hojas y
   luz difusa. La mirada asciende desde el fruto hacia la copa.
4. **Figura principal:** no necesaria; si aparece una figura, su gesto es cuidar
   o regar, no personificar una diosa.
5. **Geometría dominante:** triángulo ascendente contenido en un círculo,
   sugerido por ramas y corriente.
6. **Símbolos:** granada → potencial múltiple; árbol → crecimiento sostenido;
   corriente de agua → nutrición en movimiento; tres semillas → posibilidades
   que se diferencian; espiral vegetal → expansión orgánica.
7. **Elemento natural:** agua, árbol, fruto y suelo fértil.
8. **Luz:** luz exterior filtrada desde arriba a través de hojas, cálida pero
   moderada; muestra crecimiento y sus límites.
9. **Paleta secundaria:** verde salvia y rojo granate apagado.
10. **Dimensión luminosa:** brotes distintos comparten una misma fuente sin
    perder sus formas.
11. **Dimensión sombría:** algunas hojas crecen demasiado juntas y sombrean una
    semilla; el exceso aparece como falta de espacio, no como podredumbre.
12. **Detalle oculto:** una cuarta semilla aún cerrada en la granada, sin brote.
13. **Continuidad:** transforma la semilla de El Loco en crecimiento y ofrece a
    El Emperador una rama que puede adquirir estructura.
14. **Evitar:** figura maternal idealizada, exuberancia ornamental, abundancia
    como lujo, Venus histórico, guirnaldas acumuladas o paisaje pastoral de
    fantasía.

### IV · El Emperador — Constituirse

1. **Idea visual central:** una estructura da sostén y límite a lo que quiere
   construirse.
2. **Núcleo simbólico:** estructura.
3. **Composición:** cuadrado arquitectónico frontal ocupa el plano medio; sus
   cuatro pilares se anclan en piedra del primer plano. Una abertura en el fondo
   deja ver una montaña cuadrangular. La mirada recorre base, pilares y dintel,
   con un cetro sencillo como eje secundario.
4. **Figura principal:** opcional; una figura sentada en postura erguida puede
   medir el espacio, sin dominarlo ni aparecer como monarca.
5. **Geometría dominante:** cuadrado en la arquitectura y en los cortes de luz.
6. **Símbolos:** montaña cuadrangular → resistencia material; trono pétreo →
   responsabilidad de sostener; cuatro pilares → límites; cetro → autoridad
   situada; abertura → flexibilidad necesaria.
7. **Elemento natural:** montaña, roca y viento seco.
8. **Luz:** luz lateral rasante que marca bordes y un lado en sombra. Intensidad
   clara, no dramática; distingue estabilidad de rigidez.
9. **Paleta secundaria:** ocre piedra y gris pizarra.
10. **Dimensión luminosa:** la forma protege un espacio habitable y permite
    construir.
11. **Dimensión sombría:** una sombra cuadrada invade el vano, mostrando cómo el
    límite puede cerrarse sobre aquello que debía sostener.
12. **Detalle oculto:** una piedra de la base tiene una pequeña grieta reparada
    con una pieza de otro tono.
13. **Continuidad:** ordena el crecimiento de La Emperatriz; El Sumo Sacerdote
    convierte la estructura en espacio de transmisión.
14. **Evitar:** corona, águila, armadura, trono imperial reconocible, águilas
    heráldicas y arquitectura copiada de una baraja.

### V · El Sumo Sacerdote — Constituirse

1. **Idea visual central:** el conocimiento recibido se examina y se transmite,
   no se obedece de forma automática.
2. **Núcleo simbólico:** transmisión del conocimiento.
3. **Composición:** un arco de entrada enmarca una escalera que asciende hacia
   cinco lámparas distintas. En primer plano, un libro abierto y una llave; el
   plano medio deja un espacio vacío entre quien entrega y quien recibe. La
   dirección asciende, pero el arco permanece abierto hacia el exterior.
4. **Figura principal:** dos figuras opcionales, una enseñando y otra
   observando; ninguna ocupa un trono ni impone gesto de reverencia.
5. **Geometría dominante:** pentágono como organización del espacio de
   aprendizaje, insinuado por cinco puntos de luz, no trazado como sello.
6. **Símbolos:** cinco lámparas → conocimiento plural; escalera → aprendizaje
   progresivo; llave → acceso que requiere criterio; libro abierto →
   transmisión revisable; arco → tradición como paso, no encierro.
7. **Elemento natural:** llama pequeña y piedra trabajada.
8. **Luz:** cinco fuentes cálidas de intensidad desigual, orientadas hacia el
   libro y el vano; enseñan diferencias en vez de borrar sombras.
9. **Paleta secundaria:** arcilla rojiza y verde oliva oscuro.
10. **Dimensión luminosa:** el conocimiento circula y puede ofrecer sentido
    compartido.
11. **Dimensión sombría:** una lámpara está apagada y la sombra del arco puede
    cerrarse como autoridad vacía o dogma.
12. **Detalle oculto:** la llave proyecta una sombra que no coincide del todo
    con el contorno del cierre.
13. **Continuidad:** recibe la arquitectura del Emperador y abre la escala hacia
    los dos caminos de Los Enamorados.
14. **Evitar:** vestiduras papales, tiara, báculo, acólitos, llaves cruzadas,
    manuscritos religiosos identificables o signos litúrgicos históricos.

### VI · Los Enamorados — Entrar en el mundo

1. **Idea visual central:** elegir implica relacionar polaridades sin fingir que
   son idénticas.
2. **Núcleo simbólico:** elección mediante integración de polaridades.
3. **Composición:** dos senderos llegan desde lados distintos y se aproximan en
   una intersección central; dos árboles enmarcan la escena con crecimiento
   diferente. Un pequeño corazón geométrico se forma por el espacio negativo,
   no como emblema romántico. La estrella central queda más lejos, indicando
   orientación a construir.
4. **Figura principal:** dos figuras pueden aparecer en perfiles separados,
   mirando la intersección y no una a la otra; la elección pertenece a cada una.
5. **Geometría dominante:** dos triángulos aproximándose, con un intervalo
   visible entre sus vértices.
6. **Símbolos:** senderos convergentes → decisión compartida; dos árboles →
   diferencias vivas; corazón geométrico → vínculo elegido; estrella central →
   coherencia posible.
7. **Elemento natural:** árboles y suelo dividido en dos texturas.
8. **Luz:** luz difusa desde el espacio entre caminos, sin favorecer uno;
   intensidad media y neutral.
9. **Paleta secundaria:** verde bosque y rosa mineral apagado.
10. **Dimensión luminosa:** los caminos se acercan sin perder sus orígenes.
11. **Dimensión sombría:** las sombras de las figuras se superponen antes que
    ellas, sugiriendo proyección o dependencia.
12. **Detalle oculto:** una raíz cruza bajo ambos senderos y solo se revela en
    una pequeña sección del suelo.
13. **Continuidad:** recibe el arco abierto del Sumo Sacerdote como elección de
    entrar; El Carro toma la convergencia y la orienta.
14. **Evitar:** pareja idealizada, ángel, manzana, serpiente, elección entre
    persona y tentación, o composición de pareja celestial reconocible.

### VII · El Carro — Entrar en el mundo

1. **Idea visual central:** fuerzas diferentes avanzan cuando encuentran una
   dirección compartida.
2. **Núcleo simbólico:** dirección.
3. **Composición:** camino vertical hacia un horizonte acotado; vehículo ritual
   geométrico en el plano medio, movido por dos fuerzas laterales que no son
   animales de tiro. Siete estrellas forman una curva direccional, no una corona.
   La flecha circular se sugiere por el trayecto alrededor del vehículo.
4. **Figura principal:** conductor/a de pie o sentado con postura firme, atento
   al camino; no porta armas ni exhibe victoria.
5. **Geometría dominante:** flecha dentro de círculo, incorporada a la
   trayectoria y al borde del vehículo.
6. **Símbolos:** vehículo ritual → movimiento consciente; dos fuerzas opuestas →
   impulsos que deben coordinarse; siete estrellas → puntos de orientación;
   camino → avance; círculo direccional → intención sostenida.
7. **Elemento natural:** viento y polvo bajo, con horizonte abierto.
8. **Luz:** luz baja delante del camino, no desde detrás del conductor; media y
   horizontal. Hace visible la dirección, no el destino.
9. **Paleta secundaria:** azul hierro y terracota apagada.
10. **Dimensión luminosa:** las fuerzas convergen en un avance mesurado.
11. **Dimensión sombría:** las ruedas dejan dos huellas divergentes bajo el
    vehículo, señal de prisa o conflicto de impulsos.
12. **Detalle oculto:** una estrella está ligeramente fuera de la curva y obliga
    a corregir la dirección.
13. **Continuidad:** convierte la elección de Los Enamorados en recorrido; La
    Justicia examina lo que ese recorrido produce.
14. **Evitar:** carro de guerra, armadura, esfinges, caballos blanco/negro,
    victoria militar, corona de triunfo o carruaje reconocible de otra baraja.

### VIII · La Justicia — Entrar en el mundo

1. **Idea visual central:** cada acto se contempla junto a sus consecuencias y
   sus proporciones.
2. **Núcleo simbólico:** equilibrio consciente entre acto y consecuencia.
3. **Composición:** dos cuadrados superpuestos ligeramente desplazados forman
   una cámara abierta. En primer plano, una balanza deliberadamente asimétrica
   empieza a corregirse; espada vertical y espejo estrecho ocupan el plano medio.
   El fondo contiene una línea de horizonte sin estrado judicial. La mirada
   compara peso, reflejo y eje.
4. **Figura principal:** no necesaria; si aparece una figura, permanece de pie
   junto a los instrumentos, no como juez que dicta sentencia.
5. **Geometría dominante:** cuadrados superpuestos que solo encuentran
   equilibrio en un eje compartido.
6. **Símbolos:** balanza asimétrica → proporción en revisión; espada vertical →
   discernimiento; espejo → responsabilidad propia; cuadrado desplazado →
   consecuencia situada.
7. **Elemento natural:** piedra lisa y sombra.
8. **Luz:** luz cenital recortada, de intensidad media-alta, que deja una mitad
   de cada plato en penumbra. Claridad sin omnisciencia.
9. **Paleta secundaria:** gris acero y vino oscuro.
10. **Dimensión luminosa:** diferencias de peso pueden examinarse con claridad y
    responsabilidad.
11. **Dimensión sombría:** la sombra de la espada divide el espejo, recordando
    que la racionalización puede endurecer el juicio.
12. **Detalle oculto:** el fiel de la balanza no señala exactamente el centro
    geométrico del marco.
13. **Continuidad:** recibe del Carro las consecuencias de la dirección; el
    Ermitaño interioriza lo examinado.
14. **Evitar:** tribunal, toga, diosa vendada, balanza perfectamente nivelada,
    veredicto, martillo judicial o copiar la composición tradicional de Justicia.

### IX · El Ermitaño — Entrar en el mundo

1. **Idea visual central:** la experiencia necesita espacio para volverse
   discernimiento.
2. **Núcleo simbólico:** discernimiento interior.
3. **Composición:** un sendero estrecho sube por una montaña oscura y llega a
   una abertura hexagonal incompleta en la roca. Un punto cálido en su interior
   funciona como estrella interior; no hay una silueta que guíe a quien mira.
4. **Figura principal:** ninguna. La pausa, la abertura y el tramo de sendero
   iluminado ocupan el lugar del caminante.
5. **Geometría dominante:** hexágono incompleto con punto central como ventana
   de luz.
6. **Símbolos:** luz interior → atención; montaña → experiencia que requiere
   tiempo; sendero → proceso no inmediato; abertura → espacio de reflexión;
   estrella interior → discernimiento que no necesita espectáculo.
7. **Elemento natural:** montaña y aire frío.
8. **Luz:** un punto cálido ilumina solo el tramo inmediato del sendero; deja
   el horizonte sin revelar.
9. **Paleta secundaria:** pizarra azulada y ámbar ahumado.
10. **Dimensión luminosa:** la pausa crea un campo pequeño pero suficiente para
    orientarse.
11. **Dimensión sombría:** el sendero puede desaparecer antes de la abertura,
   haciendo perceptible el riesgo de aislamiento o parálisis.
12. **Detalle oculto:** uno de los lados de la abertura queda sin trazo, como si
   el camino aún pudiera continuar.
13. **Continuidad:** toma la consecuencia de La Justicia y la lleva al interior;
    La Rueda transforma esa pausa en percepción de ciclos.
14. **Evitar:** silueta encapuchada con farol, anciano arquetípico, bastón, nieve
   dramática, sabio omnisciente o pose de guía espiritual.

### X · La Rueda de la Fortuna — Entrar en el mundo

1. **Idea visual central:** los patrones retornan, pero la respuesta a cada
   ciclo puede variar.
2. **Núcleo simbólico:** cambio cíclico.
3. **Composición:** una rueda ocupa el centro sin tocar los bordes; cuatro
   sectores insinúan estaciones distintas. Una espiral doble hace que el ojo
   recorra el ciclo en sentidos alternos. En primer plano, una hoja seca; al
   fondo, una rama con brote. No hay figura que gobierne la rueda.
4. **Figura principal:** ninguna; el proceso cíclico es el sujeto.
5. **Geometría dominante:** círculo dividido cíclicamente con una interrupción
   deliberada en un segmento.
6. **Símbolos:** rueda → retorno y cambio; cuatro estaciones → variación dentro
   del ciclo; espiral doble → repetición transformada; hoja → cierre; brote →
   comienzo coexistente.
7. **Elemento natural:** estaciones, hoja y brote.
8. **Luz:** reflejos alternos recorren el perímetro; fuente exterior cambiante,
   intensidad moderada. Ningún sector permanece siempre iluminado.
9. **Paleta secundaria:** cobre oxidado y verde musgo.
10. **Dimensión luminosa:** el ciclo permite adaptación y nuevas oportunidades.
11. **Dimensión sombría:** un sector repite exactamente la misma grieta,
    expresando repetición inconsciente sin sugerir destino.
12. **Detalle oculto:** una de las divisiones de estación está desplazada y
    deja un intervalo irregular.
13. **Continuidad:** convierte el discernimiento del Ermitaño en reconocimiento
    de patrones; La Fuerza comienza a trabajar conscientemente con lo que
    retorna.
14. **Evitar:** rueda de premios, fortuna monetaria, criaturas subiendo/bajando,
    rueda zodiacal llena de signos copiados o una rueda mecánica de casino.

### XI · La Fuerza — Transformarse

1. **Idea visual central:** integrar una fuerza instintiva exige relación, no
   sometimiento.
2. **Núcleo simbólico:** poder interior gobernado sin violencia.
3. **Composición:** figura y criatura leonina comparten un plano; entre ambas,
   una doble espiral de fuego contenido dibuja un ritmo, no un lazo de dominio.
   El primer plano contiene una brasa; el fondo, oscuro y abierto, mantiene un
   lugar de respiración. La mirada circula entre manos, hocico y espiral.
4. **Figura principal:** figura estable con manos abiertas y peso equilibrado;
   no sujeta las fauces ni combate al animal. La criatura conserva agencia.
5. **Geometría dominante:** doble espiral enlazada sin cerrarse en un ocho
   rígido.
6. **Símbolos:** criatura leonina → instinto vivo; lemniscata → relación
   continua; fuego contenido → energía que no se reprime ni arrasa.
7. **Elemento natural:** fuego y aliento.
8. **Luz:** brasa interior ilumina ambas figuras desde abajo, baja-media
   intensidad; muestra proximidad y vulnerabilidad compartidas.
9. **Paleta secundaria:** óxido rojizo y verde negro.
10. **Dimensión luminosa:** el instinto puede colaborar con la conciencia.
11. **Dimensión sombría:** la sombra de la doble espiral se vuelve recta en un
    extremo, aludiendo a imposición o represión.
12. **Detalle oculto:** una de las garras de la criatura descansa abierta, no
    cerrada.
13. **Continuidad:** integra las fuerzas que retornan con La Rueda; El Colgado
    suspende el impulso antes de cambiar la perspectiva.
14. **Evitar:** domadora, animal vencido, mujer sometiendo un león, corona,
    violencia, musculatura heroica o insignias de infinito tomadas de otras
    cartas.

### XII · El Colgado — Transformarse

1. **Idea visual central:** detener la dirección habitual puede revelar otra
   perspectiva.
2. **Núcleo simbólico:** transformación mediante suspensión.
3. **Composición:** una figura se suspende en un espacio amplio, con un árbol
   invertido que crece desde una superficie de agua inmóvil. El triángulo
   descendente lo forma la relación entre cuerpo, reflejo y raíz. El fondo carece
   de horizonte estable. La mirada sigue el reflejo hacia arriba.
4. **Figura principal:** figura serena, sin gesto de dolor ni sacrificio; la
   postura debe ser extraña pero sostenible, con manos libres.
5. **Geometría dominante:** triángulo invertido construido por la suspensión,
   no dibujado detrás de la figura.
6. **Símbolos:** figura suspendida → pausa; árbol invertido → reorganización de
   perspectiva; halo descendente → atención que baja; agua inmóvil → tiempo
   retenido.
7. **Elemento natural:** árbol, agua quieta y gravedad.
8. **Luz:** reflejo vertical desde debajo de la superficie, difuso e
   inexplicable pero no sobrenaturalmente afirmado; baja intensidad, cambia el
   sentido de arriba/abajo.
9. **Paleta secundaria:** azul verdoso oscuro y plata gris.
10. **Dimensión luminosa:** la pausa abre una percepción distinta y fértil.
11. **Dimensión sombría:** el agua tiene una zona estancada que sugiere detención
    sin fruto.
12. **Detalle oculto:** una hoja mantiene su orientación normal aunque el árbol
    parezca invertido.
13. **Continuidad:** detiene la integración activa de La Fuerza; La Muerte
    atraviesa después el umbral entre suspensión y cierre.
14. **Evitar:** crucifixión, horca, sufrimiento, halo santo reconocible,
    autosacrificio moral o la postura invertida clásica de una baraja.

### XIII · La Muerte — Transformarse

1. **Idea visual central:** cerrar una forma agotada libera espacio para la
   transformación.
2. **Núcleo simbólico:** el cierre de una forma agotada puede abrir espacio para otra transformación.
3. **Composición:** un círculo oscuro cruza un umbral vertical abierto. En primer
   plano, una hoja seca; en el plano medio, crisálida abierta junto a una puerta
   negra; al fondo, un amanecer muy estrecho y un brote. La dirección atraviesa
   la puerta desde izquierda oscura hacia un campo de luz todavía pequeño.
4. **Figura principal:** no mostrar esqueleto, cadáver o personificación de la
   muerte. Puede no haber figura; el acto de cerrar/atravesar ocupa el lugar
   central.
5. **Geometría dominante:** círculo atravesando un umbral; el círculo conserva
   una abertura al pasar.
6. **Símbolos:** crisálida abierta → cambio de forma; hoja seca y brote →
   temporalidad y renovación; puerta negra → límite de una etapa; amanecer →
   posibilidad posterior, no promesa.
7. **Elemento natural:** hoja, brote y aire de amanecer.
8. **Luz:** luz exterior fina detrás del umbral, en contraluz, de intensidad
   contenida. Da dirección sin borrar la pérdida.
9. **Paleta secundaria:** gris ceniza y verde brote muy apagado.
10. **Dimensión luminosa:** un brote comparte espacio con la forma que termina;
    la renovación no niega el cierre.
11. **Dimensión sombría:** la puerta ocupa gran parte del cuadro y la hoja
    proyecta una sombra densa; expresa resistencia y temor, no horror.
12. **Detalle oculto:** una línea circular grabada en la puerta queda incompleta
    exactamente donde nace el brote.
13. **Continuidad:** recoge la suspensión del Colgado y la vuelve paso; La
    Templanza integra después lo que quedó separado por ese cierre.
14. **Evitar:** guadaña, calavera, caballo pálido, campos de cadáveres, sangre,
    cementerio, literalización del fallecimiento y cualquier escena reconocible
    de la Muerte histórica.

### XIV · La Templanza — Transformarse

1. **Idea visual central:** elementos distintos pueden recomponerse sin perder
   su capacidad propia.
2. **Núcleo simbólico:** integración dinámica.
3. **Composición:** dos recipientes de formas distintas se conectan mediante un
   eje y un flujo que pasa de agua a luz reflejada. Un puente cruza el plano
   medio; detrás, dos orillas siguen diferenciadas. La mirada cruza de un
   recipiente a otro y continúa sobre el puente.
4. **Figura principal:** no necesaria; si aparece una figura, sostiene los
   recipientes con esfuerzo visible y postura estable, sin gesto de alquimista
   omnipotente.
5. **Geometría dominante:** dos círculos unidos por un eje central que permite
   intercambio.
6. **Símbolos:** dos recipientes → diferencias conservadas; agua transformada
   en luz → cambio gradual; puente → relación entre orillas; irisaciones →
   matices surgidos de la mezcla.
7. **Elemento natural:** agua, vapor tenue y luz reflejada.
8. **Luz:** reflejada dentro del flujo entre recipientes, intensidad media-baja;
   no emana de un halo. Simboliza transformación por intercambio.
9. **Paleta secundaria:** turquesa mineral apagado y ámbar claro.
10. **Dimensión luminosa:** las corrientes se encuentran y producen un tercer
    matiz sin borrar sus orígenes.
11. **Dimensión sombría:** una corriente pierde demasiado color al diluirse,
    mostrando el riesgo de complacencia o pérdida de identidad.
12. **Detalle oculto:** una gota queda suspendida justo en el centro del eje,
    aún sin mezclarse.
13. **Continuidad:** recompone las formas que La Muerte separó; El Diablo
    explora aquello que en la mezcla todavía ata o atrae.
14. **Evitar:** ángel alado, dos copas de una carta histórica, alquimista con
    fórmulas, arcoíris decorativo o líquido luminoso tipo fantasía.

### XV · El Diablo — Transformarse

1. **Idea visual central:** deseo y apego son fuerzas reales que pueden
   reconocerse y examinarse.
2. **Núcleo simbólico:** poder del deseo y del apego.
3. **Composición:** un pentágono descendente se forma entre sombras y un círculo
   incompleto. Cadenas aparentemente cerradas descansan sobre una superficie,
   con un eslabón abierto claramente visible. Un espejo oscuro devuelve una
   imagen parcial; bajo el suelo se percibe fuego subterráneo. La mirada baja
   desde el espejo hacia el eslabón.
4. **Figura principal:** no es necesario representar un demonio. Si hay figura,
   puede ser una silueta humana que observa su reflejo con atención, sin ser
   monstruo ni víctima.
5. **Geometría dominante:** pentágono descendente dentro de un círculo
   incompleto, sugerido por la arquitectura y los reflejos.
6. **Símbolos:** cadenas abiertas que parecen cerradas → apego y posibilidad de
   elección; fuego subterráneo → deseo y materia; espejo oscuro → autoengaño y
   reconocimiento; círculo incompleto → vínculo no absoluto.
7. **Elemento natural:** fuego bajo tierra y roca caliente.
8. **Luz:** fuente roja tenue bajo una grieta del suelo, ascendente pero
   localizada; revela textura, no una criatura maligna.
9. **Paleta secundaria:** rojo óxido y violeta ahumado.
10. **Dimensión luminosa:** el reflejo deja ver que un eslabón no está cerrado;
    deseo e instinto pueden reconocerse como propios.
11. **Dimensión sombría:** la cadena proyecta una sombra más cerrada que el
    objeto, expresando compulsión o negación sin condena moral.
12. **Detalle oculto:** el eslabón abierto coincide, desde cierto ángulo, con la
    abertura del círculo.
13. **Continuidad:** la Templanza deja una gota sin mezclar; El Diablo muestra
    qué apego la retiene. La Torre interrumpe después la estructura que
    disimulaba ese vínculo.
14. **Evitar:** demonio cornudo, alas de murciélago, tridente, fuego infernal,
    cadenas físicas alrededor de personas, sexualización, maldad absoluta o
    iconografía satanista tomada de otra baraja.

### XVI · La Torre — Transformarse

1. **Idea visual central:** una estructura insostenible se abre y revela lo que
   contenía.
2. **Núcleo simbólico:** ruptura de una estructura que ya no puede sostenerse.
3. **Composición:** cuadrado arquitectónico con una ruptura lateral precisa; no
   cae, se abre. Un relámpago revela la sección interior de piedra y una luz
   retenida. Una corona abstracta rueda fuera del eje en primer plano; detrás,
   el cielo conserva espacio. La dirección va de la grieta hacia el interior
   iluminado.
4. **Figura principal:** ninguna necesaria. Si aparecen personas, deben
   mantenerse pequeñas, no caer ni sufrir; observan la estructura abierta.
5. **Geometría dominante:** cuadrado quebrado con un lado que deja de cerrar.
6. **Símbolos:** torre fracturada → estructura agotada; relámpago → revelación
   súbita; corona caída → autoridad o forma que deja de ordenar; piedra abierta
   con luz interior → contenido que se hace visible.
7. **Elemento natural:** piedra, relámpago y aire posterior a la tormenta.
8. **Luz:** destello exterior breve atraviesa la grieta y revela luz interior
   más tenue. Alto contraste localizado, sin explosión general.
9. **Paleta secundaria:** pizarra violeta y marfil mineral.
10. **Dimensión luminosa:** la fractura permite ver una cámara antes cerrada y
    libera espacio.
11. **Dimensión sombría:** bloques aún encajados amenazan con volver a cerrar la
    abertura; la resistencia está presente, no una catástrofe total.
12. **Detalle oculto:** la grieta reproduce, en pequeño, el ángulo de la semilla
    partida de El Loco.
13. **Continuidad:** el eslabón visible de El Diablo lleva a la grieta que
    expone la estructura; La Estrella recupera un horizonte tras esa apertura.
14. **Evitar:** torre colapsando sobre personas, rayos que destruyen una ciudad,
    fuego apocalíptico, cataclismo, explosión, corona medieval identificable o
    composición de caída de una baraja conocida.

### XVII · La Estrella — Reintegrarse

1. **Idea visual central:** después de la ruptura, una orientación modesta puede
   volver a ofrecer sentido.
2. **Núcleo simbólico:** orientación después de la ruptura.
3. **Composición:** horizonte amplio reaparece tras una línea de ruinas bajas.
   Una estrella octogonal queda ligeramente fuera del centro; su reflejo en agua
   clara forma una segunda estrella incompleta. Una figura estilizada puede
   estar de pie junto al agua, sin ocupar el foco. La mirada va de la estrella
   al reflejo y vuelve al horizonte.
4. **Figura principal:** figura humana de postura sencilla, erguida y
   vulnerable, como presencia auténtica y no como musa.
5. **Geometría dominante:** estrella octogonal construida por claros y oscuros,
   sin resplandor radial excesivo.
6. **Símbolos:** estrella → orientación; agua clara → atención renovada;
   horizonte → mundo posible; figura estilizada → autenticidad después de la
   pérdida.
7. **Elemento natural:** agua, cielo posterior a la tormenta y horizonte.
8. **Luz:** estrella exterior de intensidad baja-media; ilumina el reflejo más
   que el terreno. Orienta, no promete.
9. **Paleta secundaria:** azul grisáceo y verde agua apagado.
10. **Dimensión luminosa:** el reflejo conserva dirección aunque la estrella se
    vea pequeña.
11. **Dimensión sombría:** el reflejo está ligeramente deformado; la esperanza
    puede convertirse en idealización.
12. **Detalle oculto:** una pequeña grieta de la Torre continúa en una piedra
    del primer plano, ahora atravesada por agua.
13. **Continuidad:** devuelve horizonte después de La Torre; La Luna dobla luego
    esa orientación y la hace incierta.
14. **Evitar:** mujer desnuda vertiendo jarras, siete estrellas, gran estrella
    central con otras menores, paisaje idílico o esperanza presentada como
    certeza.

### XVIII · La Luna — Reintegrarse

1. **Idea visual central:** la percepción atraviesa zonas donde imaginación,
   temor y realidad se mezclan.
2. **Núcleo simbólico:** realidad percibida a través del inconsciente.
3. **Composición:** dos medias lunas enfrentadas dejan un corredor de noche.
   Sendero y agua corren en direcciones visuales distintas; dos guardianes
   abstractos marcan el umbral sin bloquearlo. Un reflejo deformado ocupa el
   primer plano; el fondo se pierde en una distancia navegable.
4. **Figura principal:** no obligatoria. Los guardianes pueden ser formaciones
   vegetales o siluetas, no animales emblemáticos.
5. **Geometría dominante:** dos medias lunas enfrentadas que no completan un
   círculo y dejan una abertura vertical.
6. **Símbolos:** luna doble → percepción ambivalente; sendero nocturno →
   incertidumbre; agua → contenido cambiante; dos guardianes → límites de paso;
   reflejo deformado → proyección posible.
7. **Elemento natural:** noche, agua y bruma.
8. **Luz:** reflejada desde ambas medias lunas, fragmentada sobre el agua, baja
   intensidad; no hay fuente frontal que revele una “verdad”.
9. **Paleta secundaria:** azul tinta y malva gris.
10. **Dimensión luminosa:** reflejos múltiples estimulan imaginación e intuición,
    sin convertirlas en evidencia.
11. **Dimensión sombría:** el sendero y su reflejo divergen, mostrando miedo o
    percepción engañosa.
12. **Detalle oculto:** entre las dos medias lunas aparece una diminuta estrella
    solo en el reflejo, no en el cielo.
13. **Continuidad:** transforma la orientación exterior de La Estrella en
    percepción ambigua; El Sol hará visible el terreno sin eliminar todos los
    límites del conocimiento.
14. **Evitar:** perros y lobos aullando, cangrejo emergiendo del agua, torres
    gemelas, rostro lunar antropomorfo o escena de pesadilla.

### XIX · El Sol — Reintegrarse

1. **Idea visual central:** la vida se manifiesta con claridad, pero la
   visibilidad no equivale a certeza ilimitada.
2. **Núcleo simbólico:** manifestación clara de la vida.
3. **Composición:** disco solar ocupa la zona alta sin llenar el marco. Dos
   figuras convergen en un espacio abierto; un muro bajo atraviesa el primer
   plano y puede cruzarse. Un girasol abstracto orienta su eje hacia la luz. La
   dirección es horizontal y compartida.
4. **Figura principal:** dos figuras de edades o formas distintas, en movimiento
   tranquilo y paralelo, no celebrando una victoria.
5. **Geometría dominante:** círculo radiante de rayos desiguales y contenidos.
6. **Símbolos:** disco solar → manifestación; dos figuras convergentes →
   reconocimiento mutuo; girasol abstracto → atención dirigida; muro bajo →
   límite atravesable.
7. **Elemento natural:** sol, planta y aire claro.
8. **Luz:** exterior, directa desde arriba-izquierda, intensa pero con sombras
   visibles. Significa claridad compartida y conserva zonas no vistas.
9. **Paleta secundaria:** amarillo ocre y verde hoja seco.
10. **Dimensión luminosa:** las formas se muestran sin esconderse y pueden
    relacionarse abiertamente.
11. **Dimensión sombría:** una figura queda casi sobreexpuesta en su contorno,
    aludiendo a ego, exceso o certeza demasiado plena.
12. **Detalle oculto:** el muro deja una sombra que forma un pequeño círculo
    incompleto.
13. **Continuidad:** hace visible lo que La Luna mantenía en reflejo; El Juicio
    convierte esa visibilidad en reconocimiento y respuesta.
14. **Evitar:** niño desnudo sobre caballo, girasoles decorativos, rostro solar
    medieval, muro de jardín copiado, felicidad publicitaria o luz que borra las
    sombras.

### XX · El Juicio — Reintegrarse

1. **Idea visual central:** una llamada permite reconocer lo vivido y responder
   de manera renovada.
2. **Núcleo simbólico:** despertar y reconocimiento de lo esencial.
3. **Composición:** una espiral ascendente cruza tres niveles arquitectónicos.
   En el inferior, rastros de experiencias pasadas; en el medio, tres círculos
   reciben una vibración; arriba, una puerta abierta. Figuras pequeñas se
   orientan hacia la apertura, sin emerger de tumbas. La mirada asciende desde
   la vibración hasta el umbral.
4. **Figura principal:** conjunto de figuras de pie o en transición; no son
   resucitados ni acusados, sino personas que reconocen una llamada.
5. **Geometría dominante:** espiral ascendente que atraviesa tres niveles, con
   espacio libre alrededor para que se lea a tamaño pequeño.
6. **Símbolos:** sonido convertido en espiral → llamada; figuras ascendentes →
   respuesta posible; tres círculos → reconocimiento en varios niveles; puerta
   abierta → renovación, no veredicto.
7. **Elemento natural:** aire vibrante y luz de umbral.
8. **Luz:** nace tras la puerta superior y desciende parcialmente por la espiral;
   intensidad media-alta, direccional, sin borrar los rastros inferiores.
9. **Paleta secundaria:** lavanda gris y oro pálido.
10. **Dimensión luminosa:** los rastros se conectan y pueden comprenderse desde
    un sentido nuevo.
11. **Dimensión sombría:** en el nivel inferior, una línea repetida no alcanza la
    espiral, recordando culpa o juicio permanente.
12. **Detalle oculto:** el sonido deja una pequeña onda horizontal que continúa
    en dirección a El Mundo.
13. **Continuidad:** recoge la claridad del Sol y eleva su reconocimiento; El
    Mundo reúne los tres niveles sin borrar sus diferencias.
14. **Evitar:** trompeta de arcángel, muertos resucitando, sepulcros, tribunal,
    cuerpos desnudos, juicio final religioso o composición de resurrección de
    una baraja.

### XXI · El Mundo — Reintegrarse

1. **Idea visual central:** los principios recorridos se integran en una
   totalidad que puede cerrarse y volver a abrirse.
2. **Núcleo simbólico:** integración.
3. **Composición:** un valle abierto ocupa el ancho de la carta. Piedra, agua,
   vegetación y rutas reúnen formas transformadas de motivos anteriores; las
   rutas confluyen en una poza donde reaparece la semilla. La circularidad se
   integra en la cuenca, no en un marco exterior.
4. **Figura principal:** ninguna. La poza central y la semilla ofrecen un foco
   sereno sin dominar el paisaje.
5. **Geometría dominante:** cuenca circular abierta y rutas convergentes que
   integran las geometrías anteriores sin formar un diagrama o medallón.
6. **Símbolos:** poza central → integración; rutas convergentes → totalidad
   compartida; vegetación asimétrica → diferencias vivas; semilla transformada
   → nuevo comienzo; horizonte abierto → ciclo que vuelve a empezar.
7. **Elemento natural:** vegetación, agua y horizonte.
8. **Luz:** luz suave y equilibrada en el valle, sin un foco espectacular;
   significa integración de diferencias.
9. **Paleta secundaria:** verde profundo y marfil cálido.
10. **Dimensión luminosa:** las formas coexistentes comparten estructura sin
    perder su singularidad.
11. **Dimensión sombría:** una zona de agua estancada puede inmovilizar el ciclo
   si la totalidad se cierra sobre sí misma.
12. **Detalle oculto:** junto a la poza, la semilla de El Loco reaparece con una
   raíz y todavía sin forma final.
13. **Continuidad:** retoma la semilla, el punto de luz, el eje, la materia y el
    umbral del recorrido. Su pequeño espacio abierto enlaza con El Loco: integrar
    no significa terminar para siempre.
14. **Evitar:** corona de laureles, figura danzante dentro de óvalo, cuatro
   criaturas tradicionales, medallón exterior, mandala ornamental exhaustivo,
   explosión de luz, trofeo final o una “carta más poderosa” por tamaño y
   espectacularidad.

## Auditoría de coherencia y producción

- **Cobertura:** 22 fichas, desde 0 El Loco hasta XXI El Mundo, en el orden y
  con los nombres tradicionales solicitados y presentes en los datos de ARCANA.
- **Derivación:** cada núcleo se transcribe de `symbolicCore`; los motivos se
  apoyan en `geometry`, `symbols`, `elements`, `light`, `shadow`,
  `transformativePrinciple` y `journeyStage`. La composición desarrolla esos
  datos, no reemplaza su significado por una definición genérica de Tarot.
- **Luz y sombra:** aparecen como tensiones coexistentes en cada carta; no se
  asignan a cartas “buenas” o “malas”. XIII, XV y XVI conservan intensidad
  simbólica sin literalizar muerte, maldad ni catástrofe.
- **Recorrido:** la apertura del Loco, la concentración del Mago, la forma y la
  transmisión, la elección y sus consecuencias, la pausa y transformación, y
  la reintegración en el Mundo describen una progresión legible. Los cambios de
  etapa se expresan mediante aire/estructura, recorrido, compresión y reapertura,
  sin separar la baraja en cuatro estilos.
- **Originalidad:** las instrucciones incluyen exclusiones contra motivos y
  composiciones icónicas de barajas históricas o comerciales. Se reutiliza solo
  el sistema propio documentado de ARCANA y formas geométricas comunes.
- **Referencias de imagen:** `imageRef` resuelve los 22 SVG originales de
   `public/cards/`. Son ilustraciones vectoriales del prototipo y siguen sujetas
   a revisión y aprobación artística final.

### Decisiones para dirección artística humana

1. Determinar si las figuras humanas serán recurrentes, abstractas o
   excepcionales; esta guía las propone solo cuando ayudan al núcleo.
2. Aprobar una técnica material común (por ejemplo, línea grabada, pigmento
   mate o collage geométrico) mediante pruebas, sin imitar un manuscrito o una
   baraja identificable.
3. Fijar cuánto detalle sobrevive al tamaño físico/digital final y cómo se
   traducen las sombras y los tonos secundarios en impresión y pantallas.
4. Revisar la representación cultural, corporal y de género de las figuras antes
   de cerrar bocetos.
5. Validar que el detalle oculto permanezca secundario y que cada carta se
   reconozca sin depender del texto o de la explicación escrita.
