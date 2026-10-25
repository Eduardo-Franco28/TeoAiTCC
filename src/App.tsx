import { useCallback, useEffect, useState } from "react";
import Icon from "./components/Icon";
import Sidebar from "./components/Sidebar";
import Splash from "./components/Splash";
import StatusPanel from "./components/StatusPanel";
import Toast from "./components/Toast";
import useCatalog from "./hooks/useCatalog";
import useChat from "./hooks/useChat";
import useConversations from "./hooks/useConversations";
import useCreator from "./hooks/useCreator";
import useDrafts from "./hooks/useDrafts";
import useMediaQuery from "./hooks/useMediaQuery";
import useSession from "./hooks/useSession";
import { MASCOT } from "./mascot";
import ActivitiesScreen from "./screens/ActivitiesScreen";
import CatalogScreen from "./screens/CatalogScreen";
import ChatScreen from "./screens/ChatScreen";
import CreateScreen from "./screens/CreateScreen";
import type { Screen } from "./types/teo";

const SPLASH_MS = 2500;

const TOAST_MS = 2600;

export default function App() {
  const { session, status, expire } = useSession();
  const chat = useChat(session, expire);
  const drafts = useDrafts(session, expire);
  const catalog = useCatalog(session, expire);
  const conversations = useConversations(session, expire);
  const creator = useCreator(session, expire);
  const mobile = useMediaQuery("(max-width: 767px)");
  const [screen, setScreen] = useState<Screen>("chat");
  const [expanded, setExpanded] = useState<boolean>(true);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [splash, setSplash] = useState<boolean>(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), SPLASH_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!chat.loading) conversations.refresh();
  }, [chat.conversationId, chat.loading, conversations.refresh]);

  const navigate = useCallback((next: Screen) => {
    setScreen(next);
    setMenuOpen(false);
  }, []);

  const openConversation = (id: string) => {
    chat.open(id);
    navigate("chat");
  };

  const newConversation = () => {
    chat.restart();
    navigate("chat");
  };

  const added = () => {
    drafts.refresh();
    setToast("Atividade adicionada ao app da criança");
  };

  if (status === "loading" || status === "missing" || status === "expired" || !session) {
    return (
      <>
        {status === "loading" && !splash && (
          <StatusPanel title="Abrindo o Teo..." message="Só um instante." pose="voando" />
        )}
        {status === "missing" && (
          <StatusPanel
            title="Abra o Teo pelo app"
            message="No IntegraMente, vá em Perfil, toque em Teo e digite o PIN."
          />
        )}
        {(status === "expired" || (status === "ready" && !session)) && (
          <StatusPanel
            title="Sua sessão acabou"
            message="Por segurança, o acesso ao Teo vence. Volte ao app IntegraMente, toque em Teo e digite o PIN de novo."
            pose="bracos"
          />
        )}
        {splash && <Splash />}
      </>
    );
  }

  const hero = screen === "chat" && chat.messages.length === 0 && !chat.loading;

  return (
    <div className="app">
      <Sidebar
        expanded={mobile || expanded}
        mobile={mobile}
        mobileOpen={mobile && menuOpen}
        screen={screen}
        userName={session.nome}
        conversations={conversations.items}
        activeConversationId={chat.conversationId}
        onToggleExpand={() => setExpanded(!expanded)}
        onCloseMobile={() => setMenuOpen(false)}
        onNavigate={navigate}
        onOpenConversation={openConversation}
        onNewConversation={newConversation}
      />

      <main className={hero ? "main main-hero" : "main"}>
        <div className="main-glow" aria-hidden="true" />

        {mobile && (
          <header className="mobile-bar">
            <button type="button" className="icon-button" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
              <Icon name="menu" />
            </button>
            <img className="avatar" src={MASCOT.feliz} alt="" />
            <strong>Teo</strong>
          </header>
        )}

        {screen === "chat" && <ChatScreen chat={chat} drafts={drafts} onCreate={() => navigate("create")} />}

        {screen === "create" && (
          <CreateScreen creator={creator} drafts={drafts} onGoMine={() => navigate("mine")} onToast={setToast} />
        )}

        {screen === "mine" && (
          <ActivitiesScreen drafts={drafts} onCreate={() => navigate("create")} onCatalog={() => navigate("catalog")} />
        )}

        {screen === "catalog" && <CatalogScreen catalog={catalog} onAdded={added} />}
      </main>

      <Toast text={toast} />
      {splash && <Splash />}
    </div>
  );
}
