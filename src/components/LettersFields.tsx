import { useState } from "react";
import type { KeyboardEvent } from "react";
import type useCreator from "../hooks/useCreator";
import { MAX_WORDS, wordProblem } from "../hooks/useCreator";
import Icon from "./Icon";
import type { IconName } from "./Icon";
import Stepper from "./Stepper";

interface LettersFieldsProps {
  creator: ReturnType<typeof useCreator>;
}

const MODES: { mode: "theme" | "words"; icon: IconName; title: string; text: string }[] = [
  { mode: "theme", icon: "sparkle", title: "O Teo escolhe", text: "Você diz o tema e eu penso nas palavras" },
  { mode: "words", icon: "newChat", title: "Eu escolho", text: "Você digita as palavras que quer usar" },
];

const HIDDEN_OPTIONS: { value: number | null; label: string }[] = [
  { value: null, label: "Teo decide" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
];

const SCREEN_HINT = "Cada palavra vira uma tela da atividade, e a criança completa uma de cada vez.";

export default function LettersFields({ creator }: LettersFieldsProps) {
  const [draftWord, setDraftWord] = useState<string>("");
  const hasProblem = creator.words.some((word) => wordProblem(word));

  const commit = () => {
    if (!draftWord.trim()) return;
    creator.addWords(draftWord);
    setDraftWord("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit();
    }

    if (event.key === "Backspace" && !draftWord && creator.words.length > 0) {
      creator.removeWord(creator.words[creator.words.length - 1]);
    }
  };

  return (
    <div className="fields">
      <div className="field">
        <span id="letters-mode-label">Como você quer escolher as palavras?</span>
        <div className="choice-grid" role="group" aria-labelledby="letters-mode-label">
          {MODES.map((item) => (
            <button
              key={item.mode}
              type="button"
              className={creator.mode === item.mode ? "choice-card choice-card-on" : "choice-card"}
              aria-pressed={creator.mode === item.mode}
              onClick={() => creator.setMode(item.mode)}
            >
              <Icon name={item.icon} />
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </button>
          ))}
        </div>
      </div>

      {creator.mode === "theme" ? (
        <>
          <label className="field">
            <span>Qual é o tema?</span>
            <input
              className="input"
              value={creator.theme}
              maxLength={120}
              placeholder="Ex.: animais da fazenda"
              onChange={(event) => creator.setTheme(event.target.value)}
            />
          </label>

          <Stepper
            id="count-label"
            label="Quantas palavras?"
            hint={SCREEN_HINT}
            value={creator.count}
            min={1}
            max={MAX_WORDS}
            onChange={creator.changeCount}
          />
        </>
      ) : (
        <>
          <div className="field">
            <label htmlFor="word-input">Digite uma palavra e aperte Enter</label>
            <small className="field-hint">{SCREEN_HINT}</small>
            <div className="word-input">
              {creator.words.map((word) => {
                const problem = wordProblem(word);

                return (
                  <span key={word} className={problem ? "word-chip word-chip-bad" : "word-chip"}>
                    {word} · {problem ?? `${word.length} letras`}
                    <button type="button" aria-label={`Remover ${word}`} onClick={() => creator.removeWord(word)}>
                      <Icon name="close" />
                    </button>
                  </span>
                );
              })}
              {creator.words.length < MAX_WORDS && (
                <input
                  id="word-input"
                  value={draftWord}
                  placeholder={creator.words.length ? "mais uma…" : "Ex.: gato"}
                  onChange={(event) => setDraftWord(event.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={commit}
                />
              )}
            </div>
            <small className={hasProblem ? "field-warn" : undefined}>
              {hasProblem
                ? "Tire as palavras em vermelho para poder gerar a atividade."
                : `${creator.words.length} de ${MAX_WORDS} · palavras de 2 a 8 letras`}
            </small>
          </div>

          <label className="field">
            <span>
              Nome da atividade <em className="field-optional">(opcional)</em>
            </span>
            <input
              className="input"
              value={creator.theme}
              maxLength={60}
              placeholder="Ex.: Bichos de casa"
              onChange={(event) => creator.setTheme(event.target.value)}
            />
          </label>
        </>
      )}

      <div className="field">
        <span id="hidden-label">Quantas letras ficam vazias em cada palavra?</span>
        <div className="options options-4" role="group" aria-labelledby="hidden-label">
          {HIDDEN_OPTIONS.map((option) => (
            <button
              key={option.label}
              type="button"
              className={creator.hidden === option.value ? "option option-on" : "option"}
              aria-pressed={creator.hidden === option.value}
              onClick={() => creator.setHidden(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
