import { useCallback, useEffect, useState } from "react";
import { CONVERSATION_KEY } from "../config";
import { ApiError } from "../services/http";
import { getMessages, streamMessage } from "../services/teoService";
import type { ChatMessage, TeoSession } from "../types/teo";

function readConversationId(): string | null {
  try {
    return sessionStorage.getItem(CONVERSATION_KEY);
  } catch {
    return null;
  }
}

function writeConversationId(id: string | null): void {
  try {
    if (id) sessionStorage.setItem(CONVERSATION_KEY, id);
    else sessionStorage.removeItem(CONVERSATION_KEY);
  } catch {
    return;
  }
}

export default function useChat(session: TeoSession | null, onExpired: () => void) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(readConversationId);
  const [loading, setLoading] = useState<boolean>(false);
  const [opening, setOpening] = useState<boolean>(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (id: string) => {
      if (!session) return;

      setOpening(true);
      setError(null);

      try {
        const stored = await getMessages(session.token, id);
        setMessages(
          stored.map((message, index) => ({
            id: `stored-${id}-${index}`,
            role: message.role,
            content: message.content,
            drafts: [],
            sources: [],
          })),
        );
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          onExpired();
          return;
        }

        writeConversationId(null);
        setConversationId(null);
        setMessages([]);
      } finally {
        setOpening(false);
      }
    },
    [session, onExpired],
  );

  useEffect(() => {
    if (conversationId) load(conversationId);
  }, [session]);

  const send = async (text: string) => {
    if (!session || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      drafts: [],
      sources: [],
    };

    const replyId = `teo-${Date.now()}`;
    const reply: ChatMessage = {
      id: replyId,
      role: "assistant",
      content: "",
      drafts: [],
      sources: [],
      streaming: true,
    };

    const update = (change: (message: ChatMessage) => ChatMessage) =>
      setMessages((current) => current.map((message) => (message.id === replyId ? change(message) : message)));

    const dropEmptyReply = () =>
      setMessages((current) => current.filter((message) => message.id !== replyId || message.content));

    setMessages((current) => [...current, userMessage, reply]);
    setLoading(true);
    setError(null);
    setStatus("Pensando…");

    try {
      await streamMessage(session.token, text, conversationId, (event) => {
        if (event.type === "status") setStatus(event.text);
        if (event.type === "delta") update((message) => ({ ...message, content: message.content + event.text }));
        if (event.type === "reset") update((message) => ({ ...message, content: "" }));

        if (event.type === "error") {
          setError(event.text);
          dropEmptyReply();
        }

        if (event.type === "done") {
          writeConversationId(event.conversationId);
          setConversationId(event.conversationId);
          update((message) => ({
            ...message,
            content: event.reply,
            drafts: event.drafts,
            sources: event.sources,
            streaming: false,
          }));
        }
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onExpired();
        return;
      }

      setError(err instanceof ApiError ? err.message : "Não consegui falar com o Teo agora");
      dropEmptyReply();
    } finally {
      update((message) => ({ ...message, streaming: false }));
      setLoading(false);
      setStatus(null);
    }
  };

  const open = (id: string) => {
    if (loading || id === conversationId) return;

    writeConversationId(id);
    setConversationId(id);
    setMessages([]);
    load(id);
  };

  const restart = () => {
    if (loading) return;

    writeConversationId(null);
    setConversationId(null);
    setMessages([]);
    setError(null);
  };

  return { messages, conversationId, loading, opening, status, error, send, open, restart };
}
