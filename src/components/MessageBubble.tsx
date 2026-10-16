import type { ReactNode } from "react";
import teoAvatar from "../assets/teo.png";
import type { ChatMessage } from "../types/teo";
import formatText from "../utils/formatText";

interface MessageBubbleProps {
  message: ChatMessage;
  children?: ReactNode;
}

export default function MessageBubble({ message, children }: MessageBubbleProps) {
  if (message.role === "user") {
    return (
      <div className="message message-user">
        <div className="bubble bubble-user">{message.content}</div>
      </div>
    );
  }

  return (
    <div className="message message-teo">
      <img className="message-avatar" src={teoAvatar} alt="" />
      <div className="message-body">
        <div className="bubble bubble-teo">
          {formatText(message.content)}

          {message.sources.length > 0 && (
            <div className="sources">
              <span>Fontes</span>
              <ol>
                {message.sources.map((source, index) => (
                  <li key={index}>
                    {source.link ? (
                      <a href={source.link} target="_blank" rel="noreferrer">
                        {source.title}
                      </a>
                    ) : (
                      source.title
                    )}
                    {source.page ? `, p. ${source.page}` : ""}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
