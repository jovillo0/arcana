interface DrawButtonProps {
  readonly count: number;
  readonly onDraw: () => void;
}

export function DrawButton({ count, onDraw }: DrawButtonProps) {
  return (
    <button className="draw-button" onClick={onDraw} type="button">
      Barajar y revelar {count === 1 ? "una carta" : `${count} cartas`}
      <span aria-hidden="true">↗</span>
    </button>
  );
}
