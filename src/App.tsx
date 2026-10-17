import { useState } from "react";
import teoAvatar from "./assets/teo.png";
import StatusPanel from "./components/StatusPanel";
import useCatalog from "./hooks/useCatalog";
import useChat from "./hooks/useChat";
import useDrafts from "./hooks/useDrafts";
import useSession from "./hooks/useSession";
import ActivitiesScreen from "./screens/ActivitiesScreen";
import CatalogScreen from "./screens/CatalogScreen";
import ChatScreen from "./screens/ChatScreen";

type Tab = "chat" | "activities" | "catalog";

const TABS: { id: Tab; label: string }[] = [
  { id: "chat", label: "Conversa" },
  { id: "activities", label: "Atividades" },
  { id: "catalog", label: "Catálogo" },
];

export default function App() {
  const { session, status, expire } = useSession();
  const chat = useChat(session, expire);
  const drafts = useDrafts(session, expire);
  const catalog = useCatalog(session, expire);
  const [tab, setTab] = useState<Tab>("chat");

  if (status === "loading") {
    return <StatusPanel title="Abrindo o Teo..." message="Só um instante." />;
  }

  if (status === "missing") {
    return (
      <StatusPanel
        title="Abra o Teo pelo app"
        message="No IntegraMente, vá em Perfil, toque em Teo e digite o PIN."
      />
    );
  }

  if (status === "expired" || !session) {
    return (
      <StatusPanel
        title="Sua sessão acabou"
        message="Por segurança, o acesso ao Teo vence. Volte ao app IntegraMente, toque em Teo e digite o PIN de novo."
      />
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-brand">
          <img src={teoAvatar} alt="" />
          <div>
            <strong>Teo</strong>
            <span>Assistente do IntegraMente</span>
          </div>
        </div>

        {tab === "chat" && chat.messages.length > 0 && (
          <button type="button" className="button-ghost button-small" onClick={chat.restart}>
            Nova conversa
          </button>
        )}
      </header>

      <nav className="tabs" aria-label="Seções do Teo">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={tab === item.id ? "tab tab-active" : "tab"}
            aria-current={tab === item.id ? "page" : undefined}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {tab === "chat" && <ChatScreen chat={chat} drafts={drafts} nome={session.nome} />}

      {tab === "activities" && <ActivitiesScreen drafts={drafts} />}

      {tab === "catalog" && <CatalogScreen catalog={catalog} onAdded={drafts.refresh} />}
    </div>
  );
}
