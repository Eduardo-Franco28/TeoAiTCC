import type { ActivityType } from "../types/teo";
import WordTiles from "./WordTiles";

interface ActivityThumbProps {
  type?: ActivityType | null;
}

function Dots({ amount }: { amount: number }) {
  return (
    <span className="dot-group">
      {Array.from({ length: amount }).map((_, index) => (
        <i key={index} />
      ))}
    </span>
  );
}

export default function ActivityThumb({ type }: ActivityThumbProps) {
  if (type === "DRAG_DOTS") {
    return (
      <div className="thumb-dots" aria-hidden="true">
        <Dots amount={3} />
        <span className="dots-op">+</span>
        <Dots amount={2} />
        <span className="dots-op">=</span>
        <span className="dots-answer">?</span>
      </div>
    );
  }

  if (type === "DRAG_SLOTS_TO_GROUP") {
    return (
      <div className="thumb-groups" aria-hidden="true">
        <span className="group-box group-box-0">🐟 🐬</span>
        <span className="group-box group-box-1">🦁 🦓</span>
      </div>
    );
  }

  return <WordTiles word="ABC" emoji="🔤" />;
}
