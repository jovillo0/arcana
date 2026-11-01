# ARCANA

Aplicación web de Tarot simbólico y reflexivo basada exclusivamente en los 22 Arcanos Mayores.

## Estado

ARCANA v0.1 ofrece un recorrido completo: escribir una pregunta, elegir una perspectiva, aceptar una tirada sugerida o escoger otra, concentrarse y barajar, revelar las cartas y consultar una lectura simbólica local. El sorteo independiente asigna Arcanos sin repetición; cambiar de perspectiva actualiza la narrativa sin alterar las cartas. La lectura permite profundizar progresivamente en posiciones, relaciones, movimiento y síntesis, y volver a contemplar la misma tirada. La baraja original de 22 SVG se considera provisional y queda congelada para esta versión. No hay servicio de producción, cuentas ni historial persistente.

## Requisitos

- Node.js 22.12 o superior.
- npm.

## Desarrollo

```sh
npm install
npm run dev
```

Vite mostrará la dirección local de desarrollo en la terminal.

### Experimento narrativo Gemini (solo desarrollo local)

ARCANA usa siempre la narrativa local por defecto. La comparación experimental solo aparece
en el resumen cuando se ejecuta `npm run dev`; no forma parte de la build de producción.
Gemini únicamente redacta datos simbólicos calculados por ARCANA y su clave permanece en el
servidor local de Vite, nunca en el navegador.

1. Obtén manualmente una clave de desarrollo en [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Crea `.env.local` en la raíz del repositorio, siguiendo `.env.example`, y coloca allí la
   clave en `ARCANA_GEMINI_API_KEY`. Opcionalmente configura `ARCANA_GEMINI_MODEL`.
   `.env.local` está excluido de Git; nunca pegues la clave en el código o en chats.
3. Inicia o reinicia el servidor con `npm run dev`.
4. En una lectura no sensible, abre «Experimento local · comparar con Gemini», lee el aviso,
   marca el consentimiento y pulsa «Enviar esta lectura a Gemini». Cada envío es manual.
5. Para volver al modo local, cierra el panel y sigue usando ARCANA normalmente; Gemini no
   se activa automáticamente. Si falta la clave o falla una solicitud o validación, se conserva
   la narrativa local y el panel muestra el motivo técnico.

El modo Gemini envía a Google la pregunta consentida, el nombre y las posiciones de la tirada,
la perspectiva elegida y el `SymbolicReading` calculado localmente. Las consultas clasificadas
como sensibles o centradas en terceros, y las consultas que coincidan con casos ambiguos aún
pendientes en el corpus editorial, se mantienen en local. La clasificación no puede detectar
toda ambigüedad posible en paráfrasis nuevas; por eso el modo requiere consentimiento explícito
por lectura. La comparación es experimental y requiere conexión y una configuración Gemini válida.

### Galería de revisión artística

Con el servidor de desarrollo activo, abre `/dev/arcana-gallery` en el mismo
origen para revisar las 22 ilustraciones. Esta herramienta no está disponible
en la experiencia de producción.

## Verificación

```sh
npm test
npm run build
```

## Organización

- `src/types`: contratos y tipos de dominio.
- `src/data/arcana`, `src/data/spreads`, `src/data/traditions`: datos simbólicos, tiradas y lentes interpretativas.
- `src/engine/random`: barajado y extracción usando únicamente identificadores de cartas.
- `src/engine/questions`, `src/engine/spreads`, `src/engine/interpretation`: análisis y selección de tiradas locales, más motor simbólico local.
- `src/engine/narrative`: proveedor narrativo local y proveedor Gemini experimental con fallback y validación editorial.
- `src/engine/reading`: máquina de estados y transiciones puras para confirmación, ritual, sorteo, revelación y resumen.
- `src/components`, `src/pages`, `src/styles`: interfaz y presentación.
- `docs`: fuentes conceptuales del sistema simbólico y de tiradas, auditoría editorial e [identidad visual](./docs/visual-identity.md).

El sorteo no recibe preguntas, análisis ni significados. La interfaz resuelve los identificadores sorteados a sus datos simbólicos después de completar la extracción.
