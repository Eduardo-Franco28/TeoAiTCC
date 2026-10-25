import type { Activity, GroupPlan, Question, QuestionContent } from "../types/teo";

interface ActivityPreviewProps {
  activity: Activity;
  plan?: GroupPlan[] | null;
}

interface DotsContent {
  teste1: number;
  teste2: number;
}

function parse<T>(content: string): T | null {
  try {
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

function DotGroup({ amount }: { amount: number }) {
  return (
    <span className="dot-group" aria-label={`${amount} bolinhas`}>
      {Array.from({ length: amount }).map((_, index) => (
        <i key={index} />
      ))}
    </span>
  );
}

function LettersQuestion({ question }: { question: Question }) {
  const content = parse<QuestionContent>(question.content);
  if (!content?.slots) return null;

  return (
    <div className="preview-question">
      <span className="preview-hint" aria-hidden="true">
        {content.hint}
      </span>

      <div className="preview-slots">
        {content.slots.map((slot) => (
          <span key={slot.name} className={slot.blank ? "preview-slot preview-slot-blank" : "preview-slot"}>
            {slot.blank ? "" : slot.label}
          </span>
        ))}
      </div>

      <div className="preview-pieces">
        <span className="preview-pieces-label">Peças:</span>
        {question.lstAlternative.map((piece) => (
          <span key={piece.id} className="preview-piece">
            {piece.icon ?? piece.description}
          </span>
        ))}
      </div>
    </div>
  );
}

function DotsQuestion({ question }: { question: Question }) {
  const content = parse<DotsContent>(question.content);
  if (!content) return null;

  const total = content.teste1 + content.teste2;

  return (
    <div className="preview-question preview-dots">
      <div className="dots-sum">
        <DotGroup amount={content.teste1} />
        <span className="dots-op">+</span>
        <DotGroup amount={content.teste2} />
        <span className="dots-op">=</span>
        <span className="dots-answer">?</span>
      </div>

      <div className="preview-pieces">
        <span className="preview-pieces-label">
          {content.teste1} + {content.teste2} · Opções:
        </span>
        {question.lstAlternative.map((option) => (
          <span
            key={option.id}
            className={Number(option.description) === total ? "preview-piece preview-piece-right" : "preview-piece"}
          >
            {option.description}
          </span>
        ))}
      </div>
    </div>
  );
}

function GroupsQuestion({ question, plan }: { question: Question; plan?: GroupPlan[] | null }) {
  const content = parse<QuestionContent>(question.content);
  if (!content?.slots) return null;

  const itemsOf = (label: string | null) =>
    plan?.find((group) => group.name.toUpperCase() === (label ?? "").toUpperCase())?.items ?? null;

  return (
    <div className="preview-question preview-groups">
      <strong className="preview-question-title">{question.title}</strong>

      <div className="groups-row">
        {content.slots.map((slot, index) => {
          const items = itemsOf(slot.label);

          return (
            <div key={slot.name} className={`group-box group-box-${index}`}>
              <span className="group-label">{slot.label}</span>
              {items && (
                <div className="group-items">
                  {items.map((item) => (
                    <span key={item.name} className="group-item">
                      <span aria-hidden="true">{item.emoji}</span>
                      {item.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!plan && (
        <div className="preview-pieces">
          <span className="preview-pieces-label">Itens:</span>
          {question.lstAlternative.map((item) => (
            <span key={item.id} className="group-item">
              <span aria-hidden="true">{item.icon}</span>
              {item.description}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ActivityPreview({ activity, plan }: ActivityPreviewProps) {
  return (
    <div className="preview">
      {activity.lstQuestions.map((question) => {
        if (question.type === "DRAG_LETTERS") return <LettersQuestion key={question.id} question={question} />;
        if (question.type === "DRAG_DOTS") return <DotsQuestion key={question.id} question={question} />;
        if (question.type === "DRAG_SLOTS_TO_GROUP")
          return <GroupsQuestion key={question.id} question={question} plan={plan} />;

        return (
          <p key={question.id} className="preview-question">
            {question.title}
          </p>
        );
      })}
    </div>
  );
}
