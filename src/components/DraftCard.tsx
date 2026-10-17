import { useState } from "react";
import type { Activity, Draft, DraftState } from "../types/teo";
import LettersPreview from "./LettersPreview";
import PublishControl from "./PublishControl";

interface DraftCardProps {
  draft: Draft;
  state: DraftState;
  preview?: Activity;
  busy: boolean;
  onPreview: () => void;
  onApprove: () => void;
  onRemove: () => void;
  onPublishChange?: (published: boolean) => void;
}

const STATE_LABEL: Record<DraftState, string> = {
  draft: "Rascunho",
  approved: "No app",
  removed: "Removida",
};

export default function DraftCard({
  draft,
  state,
  preview,
  busy,
  onPreview,
  onApprove,
  onRemove,
  onPublishChange,
}: DraftCardProps) {
  const [open, setOpen] = useState<boolean>(false);

  const togglePreview = () => {
    if (!open) onPreview();
    setOpen(!open);
  };

  return (
    <article className={`draft-card draft-card-${state}`}>
      <header className="draft-card-header">
        <div>
          <h3>{draft.title}</h3>
          <p>{draft.subject} · {draft.copied ? "Do catálogo" : draft.subTitle}</p>
        </div>
        <span className={`chip chip-${state}`}>{STATE_LABEL[state]}</span>
      </header>

      {state !== "removed" && (
        <button type="button" className="link-button" onClick={togglePreview}>
          {open ? "Esconder prévia" : "Ver prévia"}
        </button>
      )}

      {open && state !== "removed" && (
        preview ? <LettersPreview activity={preview} /> : <p className="muted">Carregando prévia...</p>
      )}

      {state === "draft" && (
        <div className="draft-card-actions">
          <button type="button" className="button-primary" disabled={busy} onClick={onApprove}>
            {busy ? "Aguarde..." : "Aprovar"}
          </button>
          <button type="button" className="button-ghost" disabled={busy} onClick={onRemove}>
            Descartar
          </button>
        </div>
      )}

      {state === "approved" && (
        <div className="draft-card-actions">
          <p className="success">Já aparece no app da criança, em {draft.subject}.</p>
          {onPublishChange && !draft.copied && (
            <PublishControl published={Boolean(draft.published)} busy={busy} onChange={onPublishChange} />
          )}
          <button type="button" className="button-ghost" disabled={busy} onClick={onRemove}>
            Remover da conta
          </button>
        </div>
      )}

      {state === "removed" && <p className="muted">Essa atividade saiu da conta.</p>}
    </article>
  );
}
