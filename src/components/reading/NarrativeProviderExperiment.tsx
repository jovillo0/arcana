import { useEffect, useState } from "react";
import {
  generateNarrativeWithFallback,
  GeminiNarrativeProvider,
  type NarrativeGenerationResult,
  type NarrativeProviderInput,
} from "../../engine/narrative/narrativeProviders";
import { getExternalNarrativeRestriction } from "../../engine/editorial/classifySensitiveQuestion";
import { NarrativeReadingView } from "./NarrativeReadingView";

interface GeminiStatus {
  readonly configured: boolean;
  readonly model: string;
}

interface NarrativeProviderExperimentProps {
  readonly input: NarrativeProviderInput;
  readonly localNarrative: NarrativeGenerationResult["narrative"];
}

export function NarrativeProviderExperiment({
  input,
  localNarrative,
}: NarrativeProviderExperimentProps) {
  const [status, setStatus] = useState<GeminiStatus | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<NarrativeGenerationResult | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const restriction = getExternalNarrativeRestriction(input.reading.question);

  useEffect(() => {
    let active = true;
    void new GeminiNarrativeProvider().getStatus()
      .then((nextStatus) => {
        if (active) {
          setStatus(nextStatus);
          setStatusError(null);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setStatusError(error instanceof Error ? error.message : "Proxy local no disponible.");
        }
      });
    return () => {
      active = false;
    };
  }, []);

  async function compareWithGemini() {
    setPending(true);
    setResult(null);
    setRequestError(null);
    try {
      setResult(await generateNarrativeWithFallback({ ...input, externalConsent: consent }, "gemini", {
        model: status?.model,
      }));
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "No se pudo crear la narrativa local.");
    } finally {
      setPending(false);
    }
  }

  return (
    <details className="narrative-provider-experiment">
      <summary>Experimento local · comparar con Gemini</summary>
      <div className="narrative-provider-experiment__content">
        <p>
          La narrativa local no envía tu consulta a ningún modelo externo. Si eliges continuar,
          Gemini recibirá esta pregunta, la perspectiva, la tirada, sus posiciones y los datos
          simbólicos necesarios para redactar otra versión. Es una prueba experimental; puedes
          quedarte con la lectura local.
        </p>
        {status ? (
          <p className="narrative-provider-experiment__status" role="status">
            Proxy local {status.configured ? "configurado" : "sin clave"} · modelo {status.model}
          </p>
        ) : (
          <p className="narrative-provider-experiment__status" role="status">
            {statusError ?? "Comprobando configuración local…"}
          </p>
        )}
        {restriction ? (
          <p className="narrative-provider-experiment__warning" role="note">
            {restriction === "pending-review"
              ? "Esta consulta está pendiente de revisión editorial y se mantiene en ARCANA."
              : "Esta consulta se mantiene en ARCANA y no se enviará a Gemini."}
          </p>
        ) : (
          <>
            <label className="narrative-provider-experiment__consent">
              <input
                checked={consent}
                onChange={(event) => setConsent(event.currentTarget.checked)}
                type="checkbox"
              />
              <span>Entiendo qué datos se enviarán y autorizo esta comparación para esta lectura.</span>
            </label>
            <button
              className="text-button"
              disabled={!consent || pending}
              onClick={() => void compareWithGemini()}
              type="button"
            >
              {pending ? "Generando comparación…" : "Enviar esta lectura a Gemini"}
            </button>
          </>
        )}

        {result?.fallbackReason && (
          <p className="narrative-provider-experiment__warning" role="status">
            Gemini no se utilizó ({result.fallbackReason}). Se conserva la narrativa local.
            {result.fallbackDetail && <> Detalle: {result.fallbackDetail}</>}
          </p>
        )}
        {requestError && <p className="error-message" role="alert">{requestError}</p>}
        {result?.provider === "gemini" && (
          <>
            <p className="narrative-provider-experiment__status" role="status">
              Gemini · {result.model ?? status?.model ?? "modelo local configurado"} · salida validada
            </p>
            <div className="narrative-provider-experiment__comparison">
              <section aria-label="Narrativa local">
                <h3>Narrativa local</h3>
                <NarrativeReadingView narrative={localNarrative} />
              </section>
              <section aria-label="Narrativa Gemini">
                <h3>Narrativa Gemini</h3>
                <NarrativeReadingView narrative={result.narrative} />
              </section>
            </div>
          </>
        )}
      </div>
    </details>
  );
}
