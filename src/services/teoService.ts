import { TEO_API_URL } from "../config";
import type { ChatResponse, StoredMessage } from "../types/teo";
import { request } from "./http";

export function sendMessage(
  token: string,
  message: string,
  conversationId: string | null,
): Promise<ChatResponse> {
  return request<ChatResponse>(TEO_API_URL, "/chat", {
    method: "POST",
    token,
    body: { message, conversationId },
  });
}

export function getMessages(token: string, conversationId: string): Promise<StoredMessage[]> {
  return request<StoredMessage[]>(TEO_API_URL, `/conversations/${conversationId}/messages`, {
    token,
  });
}
