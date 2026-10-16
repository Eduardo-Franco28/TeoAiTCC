import { useEffect, useRef } from "react";
import Composer from "../components/Composer";
import DraftCard from "../components/DraftCard";
import MessageBubble from "../components/MessageBubble";
import type useChat from "../hooks/useChat";
import type useDrafts from "../hooks/useDrafts";

interface ChatScreenProps {
  chat: ReturnType<typeof useChat>;
  drafts: ReturnType<typeof useDrafts>;
  nome: string;
}

const SUGGESTIONS = [
  "Cria uma atividade de completar a palavra com nomes de frutas",
  "Quais direitos a Lei Berenice Piana garante?",
  "Como uma rotina visual pode ajudar em casa?",
];

export default function ChatScreen({ chat, drafts, nome }: ChatScreenProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chat.messages.length, chat.loading]);

  return (
    <section className="chat">
      <div className="chat-messages">
        {chat.messages.length === 0 && (
          <div className="chat-empty">
            <h2>Oi, {nome.split(" ")[0]}! Eu sou o Teo.</h2>
            <p>
              Posso tirar dúvidas sobre autismo e criar atividades de completar a palavra para o
              IntegraMente. Toda atividade nasce como rascunho e só chega à criança depois que você
              aprovar.
            </p>
            <div className="suggestions">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="suggestion"
                  disabled={chat.loading}
                  onClick={() => chat.send(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {chat.messages.map((message) => (
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

        {chat.loading && (
          <div className="typing" role="status">
            <span />
            <span />
            <span />
            O Teo está pensando...
          </div>
        )}

        {chat.error && <p className="error">{chat.error}</p>}
        {drafts.error && <p className="error">{drafts.error}</p>}

        <div ref={endRef} />
      </div>

      <Composer disabled={chat.loading} onSend={chat.send} />
    </section>
  );
}
