import { useCallback, useState } from "react";
import { ApiError } from "../services/http";
import {
  approveDraft,
  getDraftActivity,
  listDrafts,
  publishDraft,
  removeDraft,
  unpublishDraft,
} from "../services/draftService";
import type { Activity, Draft, DraftState, TeoSession } from "../types/teo";

export default function useDrafts(session: TeoSession | null, onExpired: () => void) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [states, setStates] = useState<Record<number, DraftState>>({});
  const [previews, setPreviews] = useState<Record<number, Activity>>({});
  const [busyId, setBusyId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback(
    (err: unknown, fallback: string) => {
      if (err instanceof ApiError && err.status === 401) {
        onExpired();
        return;
      }

      setError(err instanceof ApiError ? err.message : fallback);
    },
    [onExpired],
  );

  const refresh = useCallback(async () => {
    if (!session) return;

    setLoading(true);
    setError(null);

    try {
      const response = await listDrafts(session.token);
      setDrafts(response);
      setStates((current) => {
        const next = { ...current };
        response.forEach((draft) => {
          next[draft.id] = draft.draft ? "draft" : "approved";
        });
        return next;
      });
    } catch (err) {
      handleError(err, "Não foi possível carregar as atividades");
    } finally {
      setLoading(false);
    }
  }, [session, handleError]);

  const loadPreview = async (id: number) => {
    if (!session || previews[id]) return;

    try {
      const activity = await getDraftActivity(session.token, id);
      setPreviews((current) => ({ ...current, [id]: activity }));
    } catch (err) {
      handleError(err, "Não foi possível abrir a prévia");
    }
  };

  const approve = async (id: number) => {
    if (!session) return;

    setBusyId(id);
    setError(null);

    try {
      await approveDraft(session.token, id);
      setStates((current) => ({ ...current, [id]: "approved" }));
      setDrafts((current) =>
        current.map((draft) => (draft.id === id ? { ...draft, draft: false } : draft)),
      );
    } catch (err) {
      handleError(err, "Não foi possível aprovar a atividade");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: number) => {
    if (!session) return;

    setBusyId(id);
    setError(null);

    try {
      await removeDraft(session.token, id);
      setStates((current) => ({ ...current, [id]: "removed" }));
      setDrafts((current) => current.filter((draft) => draft.id !== id));
    } catch (err) {
      handleError(err, "Não foi possível remover a atividade");
    } finally {
      setBusyId(null);
    }
  };

  const setPublished = async (id: number, published: boolean) => {
    if (!session) return;

    setBusyId(id);
    setError(null);

    try {
      if (published) await publishDraft(session.token, id);
      else await unpublishDraft(session.token, id);

      setDrafts((current) =>
        current.map((draft) => (draft.id === id ? { ...draft, published } : draft)),
      );
    } catch (err) {
      handleError(
        err,
        published ? "Não foi possível publicar no catálogo" : "Não foi possível tirar do catálogo",
      );
    } finally {
      setBusyId(null);
    }
  };

  const stateOf = (draft: Draft): DraftState =>
    states[draft.id] ?? (draft.draft ? "draft" : "approved");

  return {
    drafts,
    previews,
    busyId,
    loading,
    error,
    refresh,
    loadPreview,
    approve,
    remove,
    setPublished,
    stateOf,
  };
}
