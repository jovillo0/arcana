import { useState } from "react";
import { ARCANA } from "../data/arcana/arcana";
import type { Arcana, JourneyStage } from "../types/domain";
import { GALLERY_CHECKLIST, GALLERY_STAGES, getGalleryArcana } from "./arcanaGalleryModel";
import "../styles/arcana-gallery.css";

type GallerySize = "large" | "spread" | "thumbnail";
type GalleryBackground = "dark" | "neutral";

const SIZE_OPTIONS: readonly { readonly id: GallerySize; readonly label: string }[] = [
  { id: "large", label: "Grande" },
  { id: "spread", label: "Tirada" },
  { id: "thumbnail", label: "Miniatura / móvil" },
];

const STAGE_LABELS: Record<JourneyStage, string> = {
  constituirse: "Constituirse",
  "entrar-en-el-mundo": "Entrar en el mundo",
  transformarse: "Transformarse",
  reintegrarse: "Reintegrarse",
};

function Artwork({ arcana, className = "" }: { readonly arcana: Arcana; readonly className?: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`gallery-artwork ${className}`.trim()}>
      {failed ? (
        <p className="gallery-artwork__error" role="alert">
          No se pudo cargar {arcana.imageRef}
        </p>
      ) : (
        <img
          src={arcana.imageRef}
          alt={`Ilustración de ${arcana.name}`}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

function CardIdentity({ arcana }: { readonly arcana: Arcana }) {
  return (
    <div className="gallery-card__identity">
      <span>{arcana.romanNumeral}</span>
      <h3>{arcana.name}</h3>
    </div>
  );
}

export function ArcanaGalleryPage() {
  const [size, setSize] = useState<GallerySize>("spread");
  const [background, setBackground] = useState<GalleryBackground>("dark");
  const [stage, setStage] = useState<JourneyStage | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<readonly string[]>([]);
  const [checklist, setChecklist] = useState<Readonly<Record<string, ReadonlySet<number>>>>({});

  const visibleArcana = getGalleryArcana(stage);
  const selectedArcana = ARCANA.find((arcana) => arcana.id === selectedId) ?? null;
  const comparedArcana = compareIds
    .map((id) => ARCANA.find((arcana) => arcana.id === id))
    .filter((arcana): arcana is Arcana => arcana !== undefined);

  function toggleCompare(arcana: Arcana) {
    setCompareIds((current) => {
      if (current.includes(arcana.id)) return current.filter((id) => id !== arcana.id);
      if (current.length >= 4) return current;
      return [...current, arcana.id];
    });
  }

  function toggleChecklistItem(index: number) {
    if (!selectedArcana) return;
    setChecklist((current) => {
      const updated = new Set(current[selectedArcana.id] ?? []);
      if (updated.has(index)) updated.delete(index);
      else updated.add(index);
      return { ...current, [selectedArcana.id]: updated };
    });
  }

  return (
    <main className={`arcana-gallery arcana-gallery--${background}`}>
      <header className="gallery-header">
        <div>
          <p className="gallery-eyebrow">ARCANA · HERRAMIENTA INTERNA · SOLO DESARROLLO</p>
          <h1>Galería de revisión artística</h1>
          <p className="gallery-intro">
            Las ilustraciones y los datos descriptivos proceden del catálogo actual. La revisión y
            sus marcas son decisiones humanas y solo se conservan en esta sesión.
          </p>
        </div>
        <a className="gallery-home-link" href="/">Volver a la experiencia</a>
      </header>

      <section className="gallery-controls" aria-label="Controles de la galería">
        <fieldset>
          <legend>Escala de revisión</legend>
          <div className="gallery-control-options">
            {SIZE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={size === option.id}
                onClick={() => setSize(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Fondo</legend>
          <div className="gallery-control-options">
            <button type="button" aria-pressed={background === "dark"} onClick={() => setBackground("dark")}>
              Oscuro ARCANA
            </button>
            <button
              type="button"
              aria-pressed={background === "neutral"}
              onClick={() => setBackground("neutral")}
            >
              Neutro intermedio
            </button>
          </div>
        </fieldset>
        <fieldset>
          <legend>Etapa · {visibleArcana.length} cartas</legend>
          <div className="gallery-control-options gallery-control-options--stages">
            {GALLERY_STAGES.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={stage === option.id}
                onClick={() => setStage(option.id)}
              >
                <span>{option.label}</span>
                <small>{option.range}</small>
              </button>
            ))}
          </div>
        </fieldset>
      </section>

      {compareIds.length > 0 && (
        <section className="gallery-comparison" aria-labelledby="gallery-comparison-title">
          <div className="gallery-section-heading">
            <div>
              <p className="gallery-eyebrow">COMPARACIÓN · MISMA ESCALA</p>
              <h2 id="gallery-comparison-title">Cartas seleccionadas ({compareIds.length}/4)</h2>
            </div>
            <button type="button" className="gallery-text-button" onClick={() => setCompareIds([])}>
              Limpiar selección
            </button>
          </div>
          {compareIds.length < 2 ? (
            <p className="gallery-note">Selecciona al menos otra carta para compararlas juntas.</p>
          ) : (
            <div className={`gallery-comparison-grid gallery-comparison-grid--${size}`}>
              {comparedArcana.map((arcana) => (
                <article className="gallery-card gallery-card--comparison" key={arcana.id}>
                  <Artwork arcana={arcana} />
                  <CardIdentity arcana={arcana} />
                  <button
                    type="button"
                    className="gallery-text-button"
                    onClick={() => setSelectedId(arcana.id)}
                  >
                    Revisar ficha
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {selectedArcana && (
        <section className="gallery-detail" aria-labelledby="gallery-detail-title">
          <div className="gallery-section-heading">
            <div>
              <p className="gallery-eyebrow">FICHA DESCRIPTIVA · {selectedArcana.romanNumeral}</p>
              <h2 id="gallery-detail-title">{selectedArcana.name}</h2>
            </div>
            <button type="button" className="gallery-text-button" onClick={() => setSelectedId(null)}>
              Cerrar ficha
            </button>
          </div>
          <div className="gallery-detail__body">
            <article className="gallery-card gallery-card--detail">
              <Artwork arcana={selectedArcana} />
              <CardIdentity arcana={selectedArcana} />
            </article>
            <div className="gallery-detail__information">
              <dl className="gallery-facts">
                <div><dt>Número</dt><dd>{selectedArcana.number} · {selectedArcana.romanNumeral}</dd></div>
                <div><dt>Núcleo simbólico</dt><dd>{selectedArcana.symbolicCore}</dd></div>
                <div><dt>Geometría</dt><dd>{selectedArcana.geometry}</dd></div>
                <div><dt>Símbolos principales</dt><dd>{selectedArcana.symbols.join(" · ")}</dd></div>
                <div><dt>Etapa</dt><dd>{STAGE_LABELS[selectedArcana.journeyStage]}</dd></div>
              </dl>
              <fieldset className="gallery-checklist">
                <legend>Checklist humano · sesión local</legend>
                {GALLERY_CHECKLIST.map((item, index) => (
                  <label key={item}>
                    <input
                      type="checkbox"
                      checked={checklist[selectedArcana.id]?.has(index) ?? false}
                      onChange={() => toggleChecklistItem(index)}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </fieldset>
            </div>
          </div>
        </section>
      )}

      <section className={`gallery-grid gallery-grid--${size}`} aria-label="Arcanos Mayores">
        {visibleArcana.map((arcana) => {
          const isCompared = compareIds.includes(arcana.id);
          const atCompareLimit = compareIds.length >= 4 && !isCompared;
          return (
            <article className="gallery-card" key={arcana.id}>
              <button
                type="button"
                className="gallery-card__open"
                aria-label={`Abrir ficha descriptiva de ${arcana.romanNumeral} ${arcana.name}`}
                onClick={() => setSelectedId(arcana.id)}
              >
                <Artwork arcana={arcana} />
                <CardIdentity arcana={arcana} />
              </button>
              <label className="gallery-compare-toggle">
                <input
                  type="checkbox"
                  checked={isCompared}
                  disabled={atCompareLimit}
                  onChange={() => toggleCompare(arcana)}
                />
                <span>{isCompared ? "En comparación" : atCompareLimit ? "Límite: 4 cartas" : "Comparar"}</span>
              </label>
            </article>
          );
        })}
      </section>
      <p className="gallery-end-note">Fin de la selección · {visibleArcana.length} de 22 Arcanos</p>
    </main>
  );
}
