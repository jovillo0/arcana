interface ArcanaEmblemProps {
  readonly className?: string;
}

export function ArcanaEmblem({ className = "" }: ArcanaEmblemProps) {
  return (
    <svg
      aria-hidden="true"
      className={`arcana-emblem ${className}`.trim()}
      fill="none"
      viewBox="0 0 100 100"
    >
      <circle cx="50" cy="50" r="33" />
      <circle cx="50" cy="50" r="22" />
      <path d="M50 4v17M50 79v17M4 50h17M79 50h17" />
      <path d="m50 31 19 19-19 19-19-19 19-19Z" />
      <path d="M50 17v14M50 69v14M17 50h14M69 50h14" />
      <circle cx="50" cy="50" r="3" />
    </svg>
  );
}
