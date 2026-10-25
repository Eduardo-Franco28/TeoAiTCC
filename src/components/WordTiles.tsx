interface WordTilesProps {
  word: string;
  emoji?: string;
}

const LETTERS = /[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ]/g;

export default function WordTiles({ word, emoji }: WordTilesProps) {
  const letters = (word.toUpperCase().split(" ")[0].match(LETTERS) ?? []).slice(0, 4);
  const shown = letters.length >= 2 ? letters : ["U", "V", "A"];

  return (
    <div className="tiles" aria-hidden="true">
      {emoji && <span className="tiles-emoji">{emoji}</span>}
      <div className="tiles-row">
        {shown.map((letter, index) => (
          <span key={index} className={index === 1 ? "tile tile-blank" : "tile"}>
            {index === 1 ? "" : letter}
          </span>
        ))}
      </div>
    </div>
  );
}
