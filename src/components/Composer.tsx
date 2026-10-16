import { useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";

interface ComposerProps {
  disabled: boolean;
  onSend: (text: string) => void;
}

const MAX_LENGTH = 2000;

export default function Composer({ disabled, onSend }: ComposerProps) {
  const [text, setText] = useState<string>("");

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
        value={text}
        maxLength={MAX_LENGTH}
        rows={1}
        placeholder="Pergunte algo ou peça uma atividade..."
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button type="submit" className="button-send" disabled={disabled || !text.trim()} aria-label="Enviar">
        ➤
      </button>
    </form>
  );
}
