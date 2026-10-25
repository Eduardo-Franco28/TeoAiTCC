import { TEO_API_URL } from "../config";
import type {
  ChatEvent,
  ConversationSummary,
  GroupsActivityRequest,
  GroupsResponse,
  LettersRequest,
  LettersResponse,
  StoredMessage,
  Subject,
  SumActivityRequest,
} from "../types/teo";
import { ApiError, request } from "./http";

export function getMessages(token: string, conversationId: string): Promise<StoredMessage[]> {
  return request<StoredMessage[]>(TEO_API_URL, `/conversations/${conversationId}/messages`, {
    token,
  });
}

export function listConversations(token: string): Promise<ConversationSummary[]> {
  return request<ConversationSummary[]>(TEO_API_URL, "/conversations", { token });
}

export function createLetters(token: string, body: LettersRequest): Promise<LettersResponse> {
  return request<LettersResponse>(TEO_API_URL, "/activities/letters", {
    method: "POST",
    token,
    body,
  });
}

export function createSum(token: string, body: SumActivityRequest): Promise<LettersResponse> {
  return request<LettersResponse>(TEO_API_URL, "/activities/sum", {
    method: "POST",
    token,
    body,
  });
}

export function createGroups(token: string, body: GroupsActivityRequest): Promise<GroupsResponse> {
  return request<GroupsResponse>(TEO_API_URL, "/activities/groups", {
    method: "POST",
    token,
    body,
  });
}

export function listSubjects(token: string): Promise<Subject[]> {
  return request<Subject[]>(TEO_API_URL, "/subjects", { token });
}

export async function streamMessage(
  token: string,
  message: string,
  conversationId: string | null,
  onEvent: (event: ChatEvent) => void,
): Promise<void> {
  const response = await fetch(`${TEO_API_URL}/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ message, conversationId }),
  });

  if (!response.ok || !response.body) {
    const data = await response.json().catch(() => null);
    const detail = typeof data?.detail === "string" ? data.detail : null;
    throw new ApiError(response.status, detail ?? "Não consegui falar com o Teo agora");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() ?? "";

    for (const block of blocks) {
      const line = block.split("\n").find((item) => item.startsWith("data: "));
      if (line) onEvent(JSON.parse(line.slice(6)) as ChatEvent);
    }
  }
}
