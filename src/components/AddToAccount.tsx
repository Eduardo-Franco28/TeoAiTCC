import { useState } from "react";
import type { CatalogItem } from "../types/teo";
import Icon from "./Icon";

interface AddToAccountProps {
  item: CatalogItem;
  busy: boolean;
  onAdd: () => Promise<boolean>;
  buttonClassName?: string;
}

export default function AddToAccount({
  item,
  busy,
  onAdd,
  buttonClassName = "button-primary button-small button-block",
}: AddToAccountProps) {
  const [confirming, setConfirming] = useState<boolean>(false);

  const confirmAdd = async () => {
    if (await onAdd()) setConfirming(false);
  };

  if (item.mine) return <p className="muted">Essa atividade é sua.</p>;

  if (item.added) {
    return (
      <div className="pill-success">
        <Icon name="check" />
        Adicionada
      </div>
    );
  }

  if (!confirming) {
    return (
      <button type="button" className={buttonClassName} onClick={() => setConfirming(true)}>
        Adicionar
      </button>
    );
  }

  return (
    <div className="confirm">
      <p>A atividade vai aparecer no app da criança, em {item.subject}. Você pode remover depois.</p>
      <div className="card-actions">
        <button type="button" className="button-primary button-small" disabled={busy} onClick={confirmAdd}>
          {busy ? "Aguarde..." : "Adicionar"}
        </button>
        <button type="button" className="button-ghost button-small" disabled={busy} onClick={() => setConfirming(false)}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
