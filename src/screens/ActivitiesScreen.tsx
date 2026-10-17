import { useEffect } from "react";
import DraftCard from "../components/DraftCard";
import type useDrafts from "../hooks/useDrafts";

interface ActivitiesScreenProps {
  drafts: ReturnType<typeof useDrafts>;
}

export default function ActivitiesScreen({ drafts }: ActivitiesScreenProps) {
  useEffect(() => {
    drafts.refresh();
  }, [drafts.refresh]);

  const pending = drafts.drafts.filter((draft) => drafts.stateOf(draft) === "draft");
  const approved = drafts.drafts.filter((draft) => drafts.stateOf(draft) === "approved");

  return (
    <section className="activities">
      <div className="activities-intro">
        <h2>Atividades da conta</h2>
        <p>
          As que você criou com o Teo ou adicionou do catálogo. Só as aprovadas aparecem no app da
          criança.
        </p>
      </div>

      {drafts.error && <p className="error">{drafts.error}</p>}

      {drafts.loading && drafts.drafts.length === 0 && <p className="muted">Carregando...</p>}

      {!drafts.loading && drafts.drafts.length === 0 && (
        <div className="activities-empty">
          <p>Nenhuma atividade ainda.</p>
          <p className="muted">Peça uma no chat, por exemplo: “cria uma atividade com nomes de animais”.</p>
        </div>
      )}

      {pending.length > 0 && <h3 className="group-title">Esperando aprovação</h3>}
      {pending.map((draft) => (
        <DraftCard
          key={draft.id}
          draft={draft}
          state="draft"
          preview={drafts.previews[draft.id]}
          busy={drafts.busyId === draft.id}
          onPreview={() => drafts.loadPreview(draft.id)}
          onApprove={() => drafts.approve(draft.id)}
          onRemove={() => drafts.remove(draft.id)}
        />
      ))}

      {approved.length > 0 && <h3 className="group-title">No app</h3>}
      {approved.map((draft) => (
        <DraftCard
          key={draft.id}
          draft={draft}
          state="approved"
          preview={drafts.previews[draft.id]}
          busy={drafts.busyId === draft.id}
          onPreview={() => drafts.loadPreview(draft.id)}
          onApprove={() => drafts.approve(draft.id)}
          onRemove={() => drafts.remove(draft.id)}
          onPublishChange={(published) => drafts.setPublished(draft.id, published)}
        />
      ))}
    </section>
  );
}
