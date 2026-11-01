import { INTERPRETATION_TRADITIONS } from "../../data/traditions/traditions";
import type { InterpretationLensId, InterpretationLensPreference } from "../../types/domain";

interface InterpretationLensSelectorProps {
  readonly value: InterpretationLensPreference;
  readonly resolvedLens?: InterpretationLensId;
  readonly onChange: (lens: InterpretationLensPreference) => void;
}

export function InterpretationLensSelector({
  value,
  resolvedLens,
  onChange,
}: InterpretationLensSelectorProps) {
  const selectedTradition = INTERPRETATION_TRADITIONS.find(({ id }) => id === value);
  const resolvedTradition = resolvedLens
    ? INTERPRETATION_TRADITIONS.find(({ id }) => id === resolvedLens)
    : undefined;

  return (
    <fieldset className="lens-selector">
      <legend>Perspectiva de lectura</legend>
      <label htmlFor="interpretation-lens">¿Desde qué perspectiva quieres mirar las cartas?</label>
      <select
        aria-describedby="interpretation-lens-help"
        id="interpretation-lens"
        onChange={(event) => {
          const selected = INTERPRETATION_TRADITIONS.find(
            ({ id }) => id === event.currentTarget.value,
          );
          if (!selected) {
            throw new Error("La lente interpretativa seleccionada no está disponible.");
          }
          onChange(selected.id);
        }}
        value={value}
      >
        {INTERPRETATION_TRADITIONS.map((lens) => (
          <option key={lens.id} value={lens.id}>{lens.name}</option>
        ))}
      </select>
      <p id="interpretation-lens-help">
        {value === "automatic" && resolvedTradition
          ? `Perspectiva sugerida: ${resolvedTradition.name}. ${selectedTradition?.description}`
          : selectedTradition?.description}
      </p>
    </fieldset>
  );
}
