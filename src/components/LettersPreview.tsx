import type { Activity, QuestionContent } from "../types/teo";

interface LettersPreviewProps {
  activity: Activity;
}

function parseContent(content: string): QuestionContent | null {
  try {
    return JSON.parse(content) as QuestionContent;
  } catch {
    return null;
  }
}

export default function LettersPreview({ activity }: LettersPreviewProps) {
  return (
    <div className="preview">
      {activity.lstQuestions.map((question) => {
        const content = parseContent(question.content);

        if (!content) return null;

        return (
          <div key={question.id} className="preview-question">
            <span className="preview-hint" aria-hidden="true">
              {content.hint}
            </span>

            <div className="preview-slots">
              {content.slots.map((slot) => (
                <span
                  key={slot.name}
                  className={slot.blank ? "preview-slot preview-slot-blank" : "preview-slot"}
                >
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
      })}
    </div>
  );
}
