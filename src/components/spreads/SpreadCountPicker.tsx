interface SpreadCountPickerProps {
  readonly value: number;
  readonly onChange: (count: number) => void;
}

const OPTIONS = [1, 3, 5] as const;

export function SpreadCountPicker({ value, onChange }: SpreadCountPickerProps) {
  return (
    <fieldset className="count-picker">
      <legend>Cartas a extraer</legend>
      <div className="count-picker__options">
        {OPTIONS.map((count) => (
          <button
            aria-pressed={value === count}
            className={`count-picker__option${value === count ? " is-selected" : ""}`}
            key={count}
            onClick={() => onChange(count)}
            type="button"
          >
            <span>{count}</span>
            <small>{count === 1 ? "carta" : "cartas"}</small>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
