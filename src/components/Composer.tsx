import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import Icon from "./Icon";

interface ComposerProps {
  disabled: boolean;
  onSend: (text: string) => void;
}

const MAX_LENGTH = 2000;

const MAX_HEIGHT = 160;

export default function Composer({ disabled, onSend }: ComposerProps) {
  const [text, setText] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, MAX_HEIGHT)}px`;
  }, [text]);

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    const value = text.trim();
    if (!value || disabled) return;
    onSend(value);
    setText("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form className="composer" onSubmit={submit}>
      <label htmlFor="composer-input" className="visually-hidden">
        Mensagem para o Teo
      </label>
      <textarea
        id="composer-input"
        ref={inputRef}
        value={text}
        maxLength={MAX_LENGTH}
        rows={1}
        placeholder="Fale com o Teo…"
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button type="submit" className="send-button" disabled={disabled || !text.trim()} aria-label="Enviar">
        <Icon name="send" />
      </button>
    </form>
  );
}
