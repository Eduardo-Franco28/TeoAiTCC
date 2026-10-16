import type { ReactNode } from "react";

const INLINE = /(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^)\s]+\)|https?:\/\/[^\s)]+)/g;

function formatInline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(INLINE).map((part, index) => {
    const key = `${keyPrefix}-${index}`;

    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }

    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
    if (link) {
      return (
        <a key={key} href={link[2]} target="_blank" rel="noreferrer">
          {link[1]}
        </a>
      );
    }

    if (/^https?:\/\//.test(part)) {
      return (
        <a key={key} href={part} target="_blank" rel="noreferrer">
          {part}
        </a>
      );
    }

    return part;
  });
}

export default function formatText(content: string): ReactNode[] {
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];

  const flushBullets = () => {
    if (bullets.length === 0) return;
    const items = bullets;
    bullets = [];
    blocks.push(
      <ul key={`list-${blocks.length}`}>
        {items.map((item, index) => (
          <li key={index}>{formatInline(item, `li-${blocks.length}-${index}`)}</li>
        ))}
      </ul>,
    );
  };

  content.split("\n").forEach((rawLine) => {
    const line = rawLine.trim();
    const bullet = line.match(/^(?:[-*•]|\d+[.)])\s+(.*)$/);

    if (bullet) {
      bullets.push(bullet[1]);
      return;
    }

    flushBullets();

    if (line) {
      blocks.push(<p key={`p-${blocks.length}`}>{formatInline(line, `p-${blocks.length}`)}</p>);
    }
  });

  flushBullets();

  return blocks;
}
