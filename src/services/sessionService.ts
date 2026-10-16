import { INTEGRAMENTE_API_URL, SESSION_KEY } from "../config";
import type { AuthResponse, TeoSession } from "../types/teo";
import { request } from "./http";

export function exchangeCode(code: string): Promise<AuthResponse> {
  return request<AuthResponse>(INTEGRAMENTE_API_URL, "/auth/teo/exchange", {
    method: "POST",
    body: { code },
  });
}

export function refreshToken(token: string): Promise<AuthResponse> {
  return request<AuthResponse>(INTEGRAMENTE_API_URL, "/auth/teo/refresh", {
    method: "POST",
    token,
  });
}

export function loadSession(): TeoSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as TeoSession) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: TeoSession): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    return;
  }
}

export function clearSession(): void {
  try {
    sessionStorage.clear();
  } catch {
    return;
  }
}
