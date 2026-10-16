export const INTEGRAMENTE_API_URL: string =
  import.meta.env.VITE_INTEGRAMENTE_API_URL ?? "http://localhost:8080";

export const TEO_API_URL: string =
  import.meta.env.VITE_TEO_API_URL ?? "http://localhost:8000";

export const SESSION_KEY = "teo.session";

export const CONVERSATION_KEY = "teo.conversation";

export const REFRESH_INTERVAL_MS = 45 * 60 * 1000;
