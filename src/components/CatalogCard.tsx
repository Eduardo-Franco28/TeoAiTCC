import { useState } from "react";
import type { Activity, CatalogItem } from "../types/teo";
import LettersPreview from "./LettersPreview";

interface CatalogCardProps {
  item: CatalogItem;
  preview?: Activity;
  busy: boolean;
  onPreview: () => void;
  onAdd: () => Promise<boolean>;
}

export default function CatalogCard({ item, preview, busy, onPreview, onAdd }: CatalogCardProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [confirming, setConfirming] = useState<boolean>(false);

  const togglePreview = () => {
    if (!open) onPreview();
    setOpen(!open);
  };

  const confirmAdd = async () => {
    if (await onAdd()) setConfirming(false);
  };

  return (
    <article className="draft-card">
      <header className="draft-card-header">
        <div>
          <h3>{item.title}</h3>
          <p>
            {item.subject} · por {item.mine ? "você" : item.author}
          </p>
        </div>
        <span className="chip chip-catalog">
          {item.copies} {item.copies === 1 ? "cópia" : "cópias"}
        </span>
      </header>

      <button type="button" className="link-button" onClick={togglePreview}>
        {open ? "Esconder prévia" : "Ver prévia"}
      </button>

      {open && (preview ? <LettersPreview activity={preview} /> : <p className="muted">Carregando prévia...</p>)}

      {item.mine && <p className="muted">Essa atividade é sua.</p>}

      {!item.mine && item.added && <p className="success">Já está na sua conta e no app da criança.</p>}

      {!item.mine && !item.added && !confirming && (
        <button type="button" className="button-primary button-start" onClick={() => setConfirming(true)}>
          Adicionar à conta
        </button>
      )}

      {!item.mine && !item.added && confirming && (
        <div className="publish publish-confirm">
          <p>A atividade vai aparecer no app da criança, em {item.subject}. Você pode remover depois.</p>
          <div className="draft-card-actions">
            <button type="button" className="button-primary" disabled={busy} onClick={confirmAdd}>
              {busy ? "Aguarde..." : "Adicionar"}
            </button>
            <button type="button" className="button-ghost" disabled={busy} onClick={() => setConfirming(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
