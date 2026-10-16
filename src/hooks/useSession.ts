import { useCallback, useEffect, useRef, useState } from "react";
import { REFRESH_INTERVAL_MS } from "../config";
import {
  clearSession,
  exchangeCode,
  loadSession,
  refreshToken,
  saveSession,
} from "../services/sessionService";
import type { AuthResponse, TeoSession } from "../types/teo";

export type SessionStatus = "loading" | "ready" | "missing" | "expired";

function toSession(response: AuthResponse): TeoSession {
  return { token: response.token, nome: response.userResponse.nome };
}

export default function useSession() {
  const [session, setSession] = useState<TeoSession | null>(null);
  const [status, setStatus] = useState<SessionStatus>("loading");
  const started = useRef<boolean>(false);

  const expire = useCallback(() => {
    clearSession();
    setSession(null);
    setStatus("expired");
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const code = new URLSearchParams(window.location.search).get("code");

    if (!code) {
      const stored = loadSession();
      setSession(stored);
      setStatus(stored ? "ready" : "missing");
      return;
    }

    window.history.replaceState(null, "", window.location.pathname);

    exchangeCode(code)
      .then((response) => {
        clearSession();
        const next = toSession(response);
        saveSession(next);
        setSession(next);
        setStatus("ready");
      })
      .catch(expire);
  }, [expire]);

  useEffect(() => {
    if (!session) return;

    const timer = setInterval(() => {
      refreshToken(session.token)
        .then((response) => {
          const next = toSession(response);
          saveSession(next);
          setSession(next);
        })
        .catch(expire);
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [session, expire]);

  return { session, status, expire };
}
