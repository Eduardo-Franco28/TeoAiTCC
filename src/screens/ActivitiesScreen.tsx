import { useEffect, useState } from "react";
import DraftCard from "../components/DraftCard";
import type useDrafts from "../hooks/useDrafts";
import { MASCOT } from "../mascot";

interface ActivitiesScreenProps {
  drafts: ReturnType<typeof useDrafts>;
  onCreate: () => void;
  onCatalog: () => void;
}

type Segment = "pending" | "approved";

export default function ActivitiesScreen({ drafts, onCreate, onCatalog }: ActivitiesScreenProps) {
  const [segment, setSegment] = useState<Segment | null>(null);

  useEffect(() => {
    drafts.refresh();
  }, [drafts.refresh]);

  const pending = drafts.drafts.filter((draft) => drafts.stateOf(draft) === "draft");
  const approved = drafts.drafts.filter((draft) => drafts.stateOf(draft) === "approved");
  const current = segment ?? (pending.length > 0 ? "pending" : "approved");
  const shown = current === "pending" ? pending : approved;

  return (
    <div className="page">
      <div className="page-inner">
        <header className="page-header">
          <div>
            <h1 className="page-title">Minhas atividades</h1>
            <p className="page-sub">
              As que você criou com o Teo ou adicionou do catálogo. Só as aprovadas aparecem no app da criança.
            </p>
          </div>

          {drafts.drafts.length > 0 && (
            <div className="segmented">
              <button type="button" aria-pressed={current === "pending"} onClick={() => setSegment("pending")}>
                Esperando aprovação ({pending.length})
              </button>
              <button type="button" aria-pressed={current === "approved"} onClick={() => setSegment("approved")}>
                No app ({approved.length})
              </button>
            </div>
          )}
        </header>

        {drafts.error && <p className="error page-error">{drafts.error}</p>}

        {drafts.loading && drafts.drafts.length === 0 && <p className="muted page-error">Carregando...</p>}

        {!drafts.loading && drafts.drafts.length === 0 && (
          <div className="empty">
            <img src={MASCOT.bracos} alt="" />
            <strong>Nenhuma atividade ainda</strong>
            <p>Adicione atividades do catálogo ou crie a sua com a ajuda do Teo.</p>
            <div className="empty-actions">
              <button type="button" className="button-ghost" onClick={onCatalog}>
                Ver catálogo
              </button>
              <button type="button" className="button-primary" onClick={onCreate}>
                Criar atividade
              </button>
            </div>
          </div>
        )}

        {drafts.drafts.length > 0 && shown.length === 0 && (
          <p className="muted page-error">
            {current === "pending"
              ? "Nenhuma atividade esperando aprovação."
              : "Nenhuma atividade aprovada ainda. Aprove um rascunho para ele aparecer no app."}
          </p>
        )}

        <div className="grid">
          {shown.map((draft) => (
            <DraftCard
              key={draft.id}
              draft={draft}
              state={current === "pending" ? "draft" : "approved"}
              preview={drafts.previews[draft.id]}
              busy={drafts.busyId === draft.id}
              onPreview={() => drafts.loadPreview(draft.id)}
              onApprove={() => drafts.approve(draft.id)}
              onRemove={() => drafts.remove(draft.id)}
              onPublishChange={current === "approved" ? (published) => drafts.setPublished(draft.id, published) : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
