import type { ConsultationType, Spread } from "../../types/domain";

interface ManualSpreadPickerProps {
  readonly spreads: readonly Spread[];
  readonly onSelect: (spread: Spread) => void;
  readonly onCancel: () => void;
}

const CONSULTATION_LABELS: Readonly<Record<ConsultationType, string>> = {
  "orientacion-sencilla": "Orientación general",
  autoconocimiento: "Autoconocimiento",
  "decision-eleccion": "Decisión o elección",
  "transicion-transformacion": "Transición o transformación",
  bloqueo: "Bloqueo",
  "proyecto-proceso": "Proyecto o proceso",
  "relacion-interpersonal": "Relación interpersonal",
  "comprension-profunda": "Comprensión profunda",
  "consulta-abierta-compleja": "Consulta abierta o compleja",
};

export function ManualSpreadPicker({
  spreads,
  onSelect,
  onCancel,
}: ManualSpreadPickerProps) {
  return (
    <section aria-labelledby="manual-spreads-title" className="manual-spreads">
      <div className="manual-spreads__heading">
        <div>
          <p className="eyebrow">ELIGE SEGÚN LO QUE QUIERAS EXPLORAR</p>
          <h2 id="manual-spreads-title">Otras tiradas</h2>
        </div>
        <button className="text-button" onClick={onCancel} type="button">Volver</button>
      </div>
      <div className="manual-spreads__grid">
        {spreads.map((spread) => (
          <article className="manual-spread-card" key={spread.id}>
            <div className="manual-spread-card__meta">
              <span>{spread.cardCount} {spread.cardCount === 1 ? "CARTA" : "CARTAS"}</span>
              <span>{CONSULTATION_LABELS[spread.primaryConsultationType]}</span>
            </div>
            <h3>{spread.name}</h3>
            <p>{spread.purpose}</p>
            <details className="manual-spread-card__positions">
              <summary>Ver las posiciones</summary>
              <ol>
                {spread.positions.map(({ id, name }) => <li key={id}>{name}</li>)}
              </ol>
            </details>
            <button className="text-button" onClick={() => onSelect(spread)} type="button">
              Elegir esta tirada <span aria-hidden="true">→</span>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
