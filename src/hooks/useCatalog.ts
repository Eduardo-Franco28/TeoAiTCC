import { useCallback, useState } from "react";
import { copyFromCatalog, getCatalogActivity, listCatalog } from "../services/catalogService";
import { ApiError } from "../services/http";
import type { Activity, CatalogItem, TeoSession } from "../types/teo";

export default function useCatalog(session: TeoSession | null, onExpired: () => void) {
  const [items, setItems] = useState<CatalogItem[]>([]);
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

  const search = useCallback(
    async (query: string) => {
      if (!session) return;

      setLoading(true);
      setError(null);

      try {
        setItems(await listCatalog(session.token, query));
      } catch (err) {
        handleError(err, "Não foi possível carregar o catálogo");
      } finally {
        setLoading(false);
      }
    },
    [session, handleError],
  );

  const loadPreview = async (id: number) => {
    if (!session || previews[id]) return;

    try {
      const activity = await getCatalogActivity(session.token, id);
      setPreviews((current) => ({ ...current, [id]: activity }));
    } catch (err) {
      handleError(err, "Não foi possível abrir a prévia");
    }
  };

  const add = async (id: number): Promise<boolean> => {
    if (!session) return false;

    setBusyId(id);
    setError(null);

    try {
      await copyFromCatalog(session.token, id);
      setItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, added: true, copies: item.copies + 1 } : item,
        ),
      );
      return true;
    } catch (err) {
      handleError(err, "Não foi possível adicionar a atividade");
      return false;
    } finally {
      setBusyId(null);
    }
  };

  return { items, previews, busyId, loading, error, search, loadPreview, add };
}
