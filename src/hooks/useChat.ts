import { useEffect, useState } from "react";
import { CONVERSATION_KEY } from "../config";
import { ApiError } from "../services/http";
import { getMessages, sendMessage } from "../services/teoService";
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session || !conversationId || messages.length > 0) return;

    getMessages(session.token, conversationId)
      .then((stored) =>
        setMessages(
          stored.map((message, index) => ({
            id: `stored-${index}`,
            role: message.role,
            content: message.content,
            drafts: [],
            sources: [],
          })),
        ),
      )
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) onExpired();
        else {
          writeConversationId(null);
          setConversationId(null);
        }
      });
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

    setMessages((current) => [...current, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const response = await sendMessage(session.token, text, conversationId);

      writeConversationId(response.conversationId);
      setConversationId(response.conversationId);

      setMessages((current) => [
        ...current,
        {
          id: `teo-${Date.now()}`,
          role: "assistant",
          content: response.reply,
          drafts: response.drafts,
          sources: response.sources,
        },
      ]);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onExpired();
        return;
      }

      setError(err instanceof ApiError ? err.message : "Não consegui falar com o Teo agora");
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    writeConversationId(null);
    setConversationId(null);
    setMessages([]);
    setError(null);
  };

  return { messages, loading, error, send, restart };
}
