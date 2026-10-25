import { useState } from "react";
import type { Activity, CatalogItem } from "../types/teo";
import AddToAccount from "./AddToAccount";
import ActivityPreview from "./ActivityPreview";
import ActivityThumb from "./ActivityThumb";

interface CatalogCardProps {
  item: CatalogItem;
  preview?: Activity;
  busy: boolean;
  onPreview: () => void;
  onAdd: () => Promise<boolean>;
}

export default function CatalogCard({ item, preview, busy, onPreview, onAdd }: CatalogCardProps) {
  const [open, setOpen] = useState<boolean>(false);

  const togglePreview = () => {
    if (!open) onPreview();
    setOpen(!open);
  };

  return (
    <article className="card">
      <div className="card-thumb">
        <ActivityThumb type={item.type} />
        <span className="tag">{item.subject}</span>
      </div>

      <div className="card-body">
        <div>
          <h3 className="card-title">{item.title}</h3>
          <p className="card-sub">
            por {item.mine ? "você" : item.author} · {item.copies} {item.copies === 1 ? "cópia" : "cópias"}
          </p>
        </div>

        <button type="button" className="link-button" onClick={togglePreview} aria-expanded={open}>
          {open ? "Esconder prévia" : "Ver prévia"}
        </button>

        {open && (preview ? <ActivityPreview activity={preview} /> : <p className="muted">Carregando prévia...</p>)}

        <AddToAccount item={item} busy={busy} onAdd={onAdd} />
      </div>
    </article>
  );
}
