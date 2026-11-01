import type { Arcana } from "../../types/domain";
import { CardFrame } from "./CardFrame";

interface ArcanaCardProps {
  readonly arcana: Arcana;
  readonly position: number;
}

const STAGE_LABELS: Record<Arcana["journeyStage"], string> = {
  constituirse: "Constituirse",
  "entrar-en-el-mundo": "Entrar en el mundo",
  transformarse: "Transformarse",
  reintegrarse: "Reintegrarse",
};

export function ArcanaCard({ arcana, position }: ArcanaCardProps) {
  return (
    <article className="arcana-card" aria-label={`Posición ${position}: ${arcana.name}`}>
      <CardFrame
        arcana={arcana}
        className="card-frame--summary"
        description={arcana.symbolicCore}
        positionLabel={`POSICIÓN ${position}`}
        stageLabel={STAGE_LABELS[arcana.journeyStage]}
      />
    </article>
  );
}
