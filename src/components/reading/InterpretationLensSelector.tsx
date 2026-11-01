import { INTERPRETATION_LENSES } from "../../data/traditions/traditions";
import type { InterpretationLensId } from "../../types/domain";

interface InterpretationLensSelectorProps {
  readonly value: InterpretationLensId;
  readonly onChange: (lens: InterpretationLensId) => void;
}

export function InterpretationLensSelector({
  value,
  onChange,
}: InterpretationLensSelectorProps) {
  return (
    <fieldset className="lens-selector">
      <legend>Perspectiva de lectura</legend>
      <label htmlFor="interpretation-lens">¿Desde qué perspectiva quieres mirar las cartas?</label>
      <select
        aria-describedby="interpretation-lens-help"
        id="interpretation-lens"
        onChange={(event) => {
          const selected = INTERPRETATION_LENSES.find(
            ({ id }) => id === event.currentTarget.value,
          );
          if (!selected) {
            throw new Error("La lente interpretativa seleccionada no está disponible.");
          }
          onChange(selected.id);
        }}
        value={value}
      >
        {INTERPRETATION_LENSES.map((lens) => (
          <option key={lens.id} value={lens.id}>{lens.name}</option>
        ))}
      </select>
      <p id="interpretation-lens-help">
        {INTERPRETATION_LENSES.find(({ id }) => id === value)?.description}
      </p>
    </fieldset>
  );
}
