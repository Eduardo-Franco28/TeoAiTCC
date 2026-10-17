import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import CatalogCard from "../components/CatalogCard";
import type useCatalog from "../hooks/useCatalog";

interface CatalogScreenProps {
  catalog: ReturnType<typeof useCatalog>;
  onAdded: () => void;
}

export default function CatalogScreen({ catalog, onAdded }: CatalogScreenProps) {
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    catalog.search("");
  }, [catalog.search]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    catalog.search(query);
  };

  return (
    <section className="activities">
      <div className="activities-intro">
        <h2>Catálogo</h2>
        <p>Atividades que outras famílias e profissionais criaram com o Teo e decidiram compartilhar.</p>
      </div>

      <form className="search" onSubmit={submit} role="search">
        <label htmlFor="catalog-search" className="visually-hidden">
          Buscar no catálogo
        </label>
        <input
          id="catalog-search"
          type="search"
          value={query}
          placeholder="Buscar por tema ou matéria"
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="submit" className="button-primary">
          Buscar
        </button>
      </form>

      {catalog.error && <p className="error">{catalog.error}</p>}

      {catalog.loading && catalog.items.length === 0 && <p className="muted">Carregando...</p>}

      {!catalog.loading && catalog.items.length === 0 && (
        <div className="activities-empty">
          <p>{query.trim() ? "Nada encontrado com essa busca." : "O catálogo ainda está vazio."}</p>
          <p className="muted">Na aba Atividades, você pode publicar uma atividade sua aqui.</p>
        </div>
      )}

      {catalog.items.map((item) => (
        <CatalogCard
          key={item.id}
          item={item}
          preview={catalog.previews[item.id]}
          busy={catalog.busyId === item.id}
          onPreview={() => catalog.loadPreview(item.id)}
          onAdd={async () => {
            const added = await catalog.add(item.id);
            if (added) onAdded();
            return added;
          }}
        />
      ))}
    </section>
  );
}
