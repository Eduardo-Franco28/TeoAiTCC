import { useCallback, useState } from "react";
import { ApiError } from "../services/http";
import { listConversations } from "../services/teoService";
import type { ConversationSummary, TeoSession } from "../types/teo";

export default function useConversations(session: TeoSession | null, onExpired: () => void) {
  const [items, setItems] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const refresh = useCallback(async () => {
    if (!session) return;

    setLoading(true);

    try {
      setItems(await listConversations(session.token));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) onExpired();
    } finally {
      setLoading(false);
    }
  }, [session, onExpired]);

  return { items, loading, refresh };
}
