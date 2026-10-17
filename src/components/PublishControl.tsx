import { useState } from "react";

interface PublishControlProps {
  published: boolean;
  busy: boolean;
  onChange: (published: boolean) => void;
}

export default function PublishControl({ published, busy, onChange }: PublishControlProps) {
  const [confirming, setConfirming] = useState<boolean>(false);

  if (published) {
    return (
      <div className="publish">
        <p className="publish-status">📚 Publicada no catálogo</p>
        <button type="button" className="button-ghost" disabled={busy} onClick={() => onChange(false)}>
          Tirar do catálogo
        </button>
      </div>
    );
  }

  if (confirming) {
    return (
      <div className="publish publish-confirm">
        <p>
          Outras famílias e profissionais vão poder ver e copiar essa atividade. Confira se ela não
          tem o nome da criança ou outro dado pessoal.
        </p>
        <div className="draft-card-actions">
          <button
            type="button"
            className="button-primary"
            disabled={busy}
            onClick={() => {
              onChange(true);
              setConfirming(false);
            }}
          >
            {busy ? "Aguarde..." : "Publicar"}
          </button>
          <button type="button" className="button-ghost" disabled={busy} onClick={() => setConfirming(false)}>
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <button type="button" className="button-ghost" disabled={busy} onClick={() => setConfirming(true)}>
      Publicar no catálogo
    </button>
  );
}
