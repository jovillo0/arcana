import type {
  InterpretationLensId,
  QuestionAnalysis,
  QuestionIntent,
} from "../../types/domain";

const LENS_BY_INTENT: Readonly<Record<QuestionIntent, InterpretationLensId>> = {
  general: "synthesis",
  decision: "marseille",
  transformation: "hermetic-rosicrucian",
  blockage: "rider-waite-smith",
  selfKnowledge: "psychological-archetypal",
  project: "intuitive-contemplative",
  open: "synthesis",
};

const MINIMUM_CONFIDENCE = 0.55;

export function selectAutomaticLens(analysis: QuestionAnalysis): InterpretationLensId {
  if (analysis.consultationType === "open" || analysis.confidence < MINIMUM_CONFIDENCE) {
    return "synthesis";
  }

  return LENS_BY_INTENT[analysis.consultationType];
}