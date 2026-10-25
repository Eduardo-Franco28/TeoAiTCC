import { useState } from "react";
import { MASCOT } from "../mascot";
import type { ConversationSummary, Screen } from "../types/teo";
import groupConversations from "../utils/groupConversations";
import Icon from "./Icon";
import type { IconName } from "./Icon";

interface SidebarProps {
  expanded: boolean;
  mobile: boolean;
  mobileOpen: boolean;
  screen: Screen;
  userName: string;
  conversations: ConversationSummary[];
  activeConversationId: string | null;
  onToggleExpand: () => void;
  onCloseMobile: () => void;
  onNavigate: (screen: Screen) => void;
  onOpenConversation: (id: string) => void;
  onNewConversation: () => void;
}

const LINKS: { screen: Screen; label: string; icon: IconName }[] = [
  { screen: "create", label: "Criar atividade", icon: "create" },
  { screen: "mine", label: "Minhas atividades", icon: "grid" },
  { screen: "catalog", label: "Catálogo", icon: "bag" },
];

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "?";
}

export default function Sidebar({
  expanded,
  mobile,
  mobileOpen,
  screen,
  userName,
  conversations,
  activeConversationId,
  onToggleExpand,
  onCloseMobile,
  onNavigate,
  onOpenConversation,
  onNewConversation,
}: SidebarProps) {
  const [groupOpen, setGroupOpen] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");

  const groups = groupConversations(conversations, query);
  const historyOpen = expanded && (groupOpen || query.trim().length > 0);

  const expandIfCollapsed = () => {
    if (!expanded) onToggleExpand();
  };

  const toggleGroup = () => {
    if (!expanded) {
      onToggleExpand();
      setGroupOpen(true);
      return;
    }

    setGroupOpen(!groupOpen);
  };

  const classes = [
    "sidebar",
    !expanded && "sidebar-collapsed",
    mobile && "sidebar-mobile",
    mobileOpen && "sidebar-open",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {mobile && mobileOpen && <div className="sidebar-scrim" onClick={onCloseMobile} />}

      <aside className={classes} aria-label="Menu do Teo" aria-hidden={mobile && !mobileOpen}>
        <div className="sidebar-panel">
          <div className="sidebar-brand">
            <img className="avatar" src={MASCOT.feliz} alt="" />
            <span className="sidebar-label sidebar-title">Teo</span>
            {mobile && (
              <button type="button" className="icon-button sidebar-close" onClick={onCloseMobile} aria-label="Fechar menu">
                <Icon name="close" />
              </button>
            )}
          </div>

          <label className="sidebar-search" onClick={expandIfCollapsed}>
            <Icon name="search" />
            <span className="visually-hidden">Buscar conversas</span>
            <input
              className="sidebar-label"
              type="search"
              value={query}
              placeholder="Buscar conversas"
              tabIndex={expanded ? 0 : -1}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <nav className="sidebar-scroll">
            <div className="sidebar-heading">
              <span className="sidebar-label">MENU</span>
            </div>

            <button
              type="button"
              className={screen === "chat" ? "sidebar-item sidebar-item-active" : "sidebar-item"}
              title="Conversas"
              aria-expanded={historyOpen}
              onClick={toggleGroup}
            >
              <Icon name="chat" />
              <span className="sidebar-label grow">Conversas</span>
              <Icon name="chevronDown" className={historyOpen ? "sidebar-label chevron chevron-open" : "sidebar-label chevron"} />
            </button>

            {historyOpen && (
              <div className="history">
                <button type="button" className="history-new" onClick={onNewConversation}>
                  <Icon name="newChat" />
                  Nova conversa
                </button>

                {groups.length === 0 && (
                  <p className="history-empty">
                    {query.trim() ? "Nenhuma conversa encontrada" : "Suas conversas aparecem aqui"}
                  </p>
                )}

                {groups.map((group) => (
                  <div key={group.label} className="history-group">
                    <span className="history-label">{group.label}</span>
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        title={item.title}
                        className={
                          screen === "chat" && item.id === activeConversationId
                            ? "history-item history-item-active"
                            : "history-item"
                        }
                        aria-current={item.id === activeConversationId ? "true" : undefined}
                        onClick={() => onOpenConversation(item.id)}
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {LINKS.map((link) => (
              <button
                key={link.screen}
                type="button"
                title={link.label}
                className={screen === link.screen ? "sidebar-item sidebar-item-active" : "sidebar-item"}
                aria-current={screen === link.screen ? "page" : undefined}
                onClick={() => onNavigate(link.screen)}
              >
                <Icon name={link.icon} />
                <span className="sidebar-label">{link.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-user">
            <div className="initials" aria-hidden="true">
              {initialsOf(userName)}
            </div>
            <div className="sidebar-label user-text">
              <span>{userName}</span>
              <small>Acesso protegido por PIN</small>
            </div>
          </div>
        </div>

        {!mobile && (
          <button
            type="button"
            className="sidebar-toggle"
            onClick={onToggleExpand}
            aria-label={expanded ? "Recolher menu" : "Expandir menu"}
          >
            <Icon name="chevronRight" />
          </button>
        )}
      </aside>
    </>
  );
}
