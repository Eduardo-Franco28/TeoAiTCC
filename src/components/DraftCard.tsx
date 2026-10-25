import { useState } from "react";
import type { Activity, Draft, DraftState } from "../types/teo";
import ActivityPreview from "./ActivityPreview";
import PublishControl from "./PublishControl";
import ActivityThumb from "./ActivityThumb";

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

function tagOf(draft: Draft, state: DraftState): { text: string; kind: string } {
  if (state === "removed") return { text: "Removida", kind: "removed" };
  if (state === "draft") return { text: "Rascunho", kind: "draft" };
  if (draft.copied) return { text: "Do catálogo", kind: "copied" };
  return { text: "No app", kind: "approved" };
}

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
  const tag = tagOf(draft, state);

  const togglePreview = () => {
    if (!open) onPreview();
    setOpen(!open);
  };

  return (
    <article className="card">
      <div className="card-thumb">
        <ActivityThumb type={draft.type} />
        <span className={`tag tag-${tag.kind}`}>{tag.text}</span>
      </div>

      <div className="card-body">
        <div>
          <h3 className="card-title">{draft.title}</h3>
          <p className="card-sub">
            {draft.subject} · {draft.copied ? "Do catálogo" : draft.subTitle}
          </p>
        </div>

        {state !== "removed" && (
          <button type="button" className="link-button" onClick={togglePreview} aria-expanded={open}>
            {open ? "Esconder prévia" : "Ver prévia"}
          </button>
        )}

        {open && state !== "removed" && (
          preview ? <ActivityPreview activity={preview} /> : <p className="muted">Carregando prévia...</p>
        )}

        {state === "draft" && (
          <div className="card-actions">
            <button type="button" className="button-primary button-small" disabled={busy} onClick={onApprove}>
              {busy ? "Aguarde..." : "Aprovar"}
            </button>
            <button type="button" className="button-ghost button-small" disabled={busy} onClick={onRemove}>
              Descartar
            </button>
          </div>
        )}

        {state === "approved" && (
          <>
            <p className="success">Já aparece no app da criança, em {draft.subject}.</p>
            {onPublishChange && !draft.copied && (
              <PublishControl published={Boolean(draft.published)} busy={busy} onChange={onPublishChange} />
            )}
            <button type="button" className="link-button link-danger" disabled={busy} onClick={onRemove}>
              Remover da conta
            </button>
          </>
        )}

        {state === "removed" && <p className="muted">Essa atividade saiu da conta.</p>}
      </div>
    </article>
  );
}
