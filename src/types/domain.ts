export type JourneyStage =
  | "constituirse"
  | "entrar-en-el-mundo"
  | "transformarse"
  | "reintegrarse";

export type ConsultationType =
  | "orientacion-sencilla"
  | "autoconocimiento"
  | "decision-eleccion"
  | "transicion-transformacion"
  | "bloqueo"
  | "proyecto-proceso"
  | "relacion-interpersonal"
  | "comprension-profunda"
  | "consulta-abierta-compleja";

export type QuestionIntent =
  | "general"
  | "decision"
  | "transformation"
  | "blockage"
  | "selfKnowledge"
  | "project"
  | "open";

export interface Arcana {
  readonly id: string;
  readonly number: number;
  readonly romanNumeral: string;
  readonly name: string;
  readonly symbolicCore: string;
  readonly light: string;
  readonly shadow: string;
  readonly geometry: string;
  readonly symbols: readonly string[];
  readonly elements: readonly string[];
  readonly transformativePrinciple: string;
  readonly initiatoryQuestion: string;
  readonly journeyStage: JourneyStage;
  readonly imageRef: string;
}

export interface SpreadPosition {
  readonly id: number;
  readonly name: string;
  readonly description: string;
}

export type SpreadRelationType =
  | "sequence"
  | "branch"
  | "convergence"
  | "center"
  | "axis"
  | "synthesis"
  | "relation";

export interface CardRelationship {
  readonly fromPositions: readonly number[];
  readonly toPositions: readonly number[];
  readonly type: SpreadRelationType;
  readonly description: string;
}

export interface SpreadLayoutPosition {
  readonly positionId: number;
  readonly x: number;
  readonly y: number;
}

export interface Spread {
  readonly id: string;
  readonly name: string;
  readonly purpose: string;
  readonly primaryConsultationType: ConsultationType;
  readonly cardCount: number;
  readonly positions: readonly SpreadPosition[];
  readonly layout: readonly SpreadLayoutPosition[];
  readonly relationships: readonly CardRelationship[];
  readonly interpretivePath: string;
  readonly useWhen: string;
  readonly avoidWhen?: string;
}

export interface InterpretationTradition {
  readonly id: InterpretationLensPreference;
  readonly name: string;
  readonly description: string;
}

export type InterpretationLensId =
  | "hermetic-rosicrucian"
  | "marseille"
  | "rider-waite-smith"
  | "psychological-archetypal"
  | "intuitive-contemplative"
  | "synthesis";

export type InterpretationLensPreference = InterpretationLensId | "automatic";

export interface DrawnCard {
  readonly position: number;
  readonly arcanaId: string;
}

export interface Reading {
  readonly id: string;
  readonly question: string;
  readonly spreadId: string;
  readonly traditionId: string;
  readonly drawnCards: readonly DrawnCard[];
  readonly relationships: readonly CardRelationship[];
  readonly synthesis: string;
  readonly reflectionQuestion: string;
}

export interface ReadingSession {
  readonly question: string;
  readonly spread: Spread;
  readonly drawnCards: readonly DrawnCard[];
  readonly relationships: readonly CardRelationship[];
}

export type SymbolicRelationshipPattern =
  | "continuity"
  | "contrast"
  | "reinforcement"
  | "tension"
  | "transition"
  | "repetition"
  | "stage-progression"
  | "stage-return"
  | "stage-jump";

export interface CardInterpretation {
  readonly arcanaId: string;
  readonly positionId: number;
  readonly positionName: string;
  readonly positionMeaning: string;
  readonly core: string;
  readonly lightDimension: string;
  readonly shadowDimension: string;
  readonly geometry: string;
  readonly symbols: readonly string[];
  readonly transformativePrinciple: string;
  readonly initiatoryQuestion: string;
  readonly stage: JourneyStage;
  readonly observations: readonly string[];
}

export interface SymbolicCardRelationship {
  readonly fromCardId: string;
  readonly fromPositionId: number;
  readonly toCardId: string;
  readonly toPositionId: number;
  readonly type: SymbolicRelationshipPattern;
  readonly patterns: readonly SymbolicRelationshipPattern[];
  readonly spreadStructure: readonly Pick<CardRelationship, "type" | "description">[];
  readonly strength: number;
  readonly observations: readonly string[];
}

export interface SymbolicReading {
  readonly cards: readonly CardInterpretation[];
  readonly relationships: readonly SymbolicCardRelationship[];
  readonly sequenceObservations: readonly string[];
  readonly dominantStages: readonly JourneyStage[];
  readonly tensions: readonly SymbolicCardRelationship[];
  readonly reinforcements: readonly SymbolicCardRelationship[];
  readonly reflectionQuestions: readonly string[];
}

export interface NarrativeCard {
  readonly arcanaId: string;
  readonly positionId: number;
  readonly heading: string;
  readonly interpretation: string;
  readonly lightReflection: string;
  readonly shadowReflection: string;
  readonly question: string;
}

export interface NarrativeRelationship {
  readonly relationship: SymbolicCardRelationship;
  readonly text: string;
}

export interface NarrativeReading {
  readonly opening: string;
  readonly cards: readonly NarrativeCard[];
  readonly relationships: readonly NarrativeRelationship[];
  readonly movement: string;
  readonly synthesis: string;
  readonly reflectionQuestions: readonly string[];
  readonly lens: InterpretationTradition & { readonly id: InterpretationLensId };
  readonly editorialCategory: EditorialCategory;
  readonly thirdPartyFocus: boolean;
  readonly prioritizeRealWorldSupport: boolean;
  readonly safetyNotice?: string;
}

export type EditorialCategory =
  | "MEDICAL"
  | "FINANCIAL"
  | "LEGAL"
  | "SAFETY"
  | "CRISIS"
  | "OTHER_SENSITIVE"
  | "NON_SENSITIVE";

export interface EditorialValidationIssue {
  readonly rule: string;
  readonly section: string;
  readonly excerpt: string;
}

export interface QuestionAnalysis {
  readonly consultationType: QuestionIntent;
  readonly secondaryTypes: readonly QuestionIntent[];
  readonly confidence: number;
  readonly signals: readonly string[];
  readonly explanation: string;
  readonly scores: Readonly<Record<QuestionIntent, number>>;
}

export interface SpreadRecommendation {
  readonly spread: Spread;
  readonly explanation: string;
}

export interface ConsultationAnalyzer {
  analyze(question: string): QuestionAnalysis;
}

export interface SpreadSelector {
  select(analysis: QuestionAnalysis): SpreadRecommendation;
}

export interface InterpretationRequest {
  readonly question: string;
  readonly spread: Spread;
  readonly tradition: InterpretationTradition;
  readonly drawnCards: readonly DrawnCard[];
}

export interface InterpretationEngine {
  interpret(request: InterpretationRequest): Reading;
}
