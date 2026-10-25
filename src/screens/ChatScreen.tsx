import { useEffect, useRef } from "react";
import Composer from "../components/Composer";
import DraftCard from "../components/DraftCard";
import Icon from "../components/Icon";
import type { IconName } from "../components/Icon";
import MessageBubble from "../components/MessageBubble";
import type useChat from "../hooks/useChat";
import type useDrafts from "../hooks/useDrafts";
import { MASCOT } from "../mascot";

interface ChatScreenProps {
  chat: ReturnType<typeof useChat>;
  drafts: ReturnType<typeof useDrafts>;
  onCreate: () => void;
}

const SUGGESTIONS: { icon: IconName; label: string; text: string }[] = [
  { icon: "bulb", label: "Direitos da pessoa autista", text: "Quais direitos a Lei Berenice Piana garante?" },
  { icon: "calendar", label: "Rotina em casa", text: "Como uma rotina visual pode ajudar em casa?" },
  { icon: "info", label: "Tirar uma dúvida", text: "Tenho uma dúvida sobre autismo, pode me ajudar?" },
];

export default function ChatScreen({ chat, drafts, onCreate }: ChatScreenProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const empty = chat.messages.length === 0 && !chat.loading;
  const last = chat.messages[chat.messages.length - 1];
  const waiting = chat.loading && (!last || last.role !== "assistant" || !last.content);
  const visible = chat.messages.filter((message) => message.role === "user" || message.content);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [chat.messages.length, chat.loading, last?.content.length]);

  if (empty && chat.opening) {
    return (
      <section className="screen">
        <div className="chat-hero">
          <p className="muted">Abrindo a conversa...</p>
        </div>
      </section>
    );
  }

  if (empty) {
    return (
      <section className="screen">
        <div className="chat-hero">
          <div className="hero-stage">
            <div className="stage-glow" />
            <div className="hero-ring" />
            <div className="hero-shadow" />
            <img className="hero-mascot" src={MASCOT.feliz} alt="Teo" />
          </div>

          <h1 className="hero-title">
            Olá, eu sou o <span className="text-gradient">Teo</span>
          </h1>
          <p className="hero-sub">
            Tire dúvidas sobre autismo, peça ideias e crie atividades para o IntegraMente.
          </p>

          <Composer disabled={chat.loading} onSend={chat.send} />

          <div className="chips">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion.label}
                type="button"
                className="chip-button"
                onClick={() => chat.send(suggestion.text)}
              >
                <Icon name={suggestion.icon} />
                {suggestion.label}
              </button>
            ))}
            <button type="button" className="chip-button" onClick={onCreate}>
              <Icon name="create" />
              Criar uma atividade
            </button>
          </div>

          {chat.error && <p className="error">{chat.error}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="screen">
      <header className="chat-header">
        <div className="chat-id">
          <img className="avatar" src={MASCOT.feliz} alt="" />
          <div>
            <strong>Teo</strong>
            <span className="online">online</span>
          </div>
        </div>
        <button type="button" className="button-soft" disabled={chat.loading} onClick={chat.restart}>
          <Icon name="newChat" />
          Nova conversa
        </button>
      </header>

      <div className="chat-list" ref={listRef}>
        <div className="chat-thread">
          {visible.map((message) => (
            <MessageBubble key={message.id} message={message}>
              {message.drafts.map((draft) => (
                <DraftCard
                  key={draft.id}
                  draft={draft}
                  state={drafts.stateOf(draft)}
                  preview={drafts.previews[draft.id]}
                  busy={drafts.busyId === draft.id}
                  onPreview={() => drafts.loadPreview(draft.id)}
                  onApprove={() => drafts.approve(draft.id)}
                  onRemove={() => drafts.remove(draft.id)}
                />
              ))}
            </MessageBubble>
          ))}

          {waiting && (
            <div className="typing" role="status">
              <img src={MASCOT.pensando} alt="" />
              <div className="typing-bubble">
                <span className="dots">
                  <i />
                  <i />
                  <i />
                </span>
                {chat.status ?? "Teo está pensando"}
              </div>
            </div>
          )}

          {chat.error && <p className="error">{chat.error}</p>}
          {drafts.error && <p className="error">{drafts.error}</p>}
        </div>
      </div>

      <div className="chat-footer">
        <Composer disabled={chat.loading} onSend={chat.send} />
      </div>
    </section>
  );
}
