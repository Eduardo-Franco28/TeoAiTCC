import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import AddToAccount from "../components/AddToAccount";
import CatalogCard from "../components/CatalogCard";
import Icon from "../components/Icon";
import ActivityThumb from "../components/ActivityThumb";
import type useCatalog from "../hooks/useCatalog";
import { MASCOT } from "../mascot";
import type { CatalogItem } from "../types/teo";

interface CatalogScreenProps {
  catalog: ReturnType<typeof useCatalog>;
  onAdded: () => void;
}

const ALL = "Todas";

function mostCopied(items: CatalogItem[]): CatalogItem | null {
  return items.reduce<CatalogItem | null>(
    (best, item) => (item.copies > 0 && (!best || item.copies > best.copies) ? item : best),
    null,
  );
}

export default function CatalogScreen({ catalog, onAdded }: CatalogScreenProps) {
  const [query, setQuery] = useState<string>("");
  const [searched, setSearched] = useState<string>("");
  const [subject, setSubject] = useState<string>(ALL);

  useEffect(() => {
    catalog.search("");
  }, [catalog.search]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSearched(query.trim());
    setSubject(ALL);
    catalog.search(query);
  };

  const add = async (id: number) => {
    const added = await catalog.add(id);
    if (added) onAdded();
    return added;
  };

  const subjects = [ALL, ...Array.from(new Set(catalog.items.map((item) => item.subject)))];
  const shown = catalog.items.filter((item) => subject === ALL || item.subject === subject);
  const featured = searched ? null : mostCopied(catalog.items);

  return (
    <div className="page">
      <div className="page-inner">
        <h1 className="page-title">Catálogo</h1>
        <p className="page-sub">
          Atividades que outras famílias e profissionais criaram com o Teo e decidiram compartilhar.
        </p>

        <form className="search" onSubmit={submit} role="search">
          <Icon name="search" />
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
          <button type="submit" className="button-primary button-small">
            Buscar
          </button>
        </form>

        {featured && (
          <section className="featured" aria-label="Atividade em destaque">
            <div className="featured-inner">
              <div className="featured-thumb">
                <ActivityThumb type={featured.type} />
              </div>
              <div className="featured-text">
                <span className="badge">
                  <Icon name="star" />
                  Mais copiada
                </span>
                <h2>{featured.title}</h2>
                <p className="featured-meta">
                  {featured.subject} · por {featured.mine ? "você" : featured.author} · {featured.copies}{" "}
                  {featured.copies === 1 ? "cópia" : "cópias"}
                </p>
                <div className="featured-actions">
                  <AddToAccount
                    item={featured}
                    busy={catalog.busyId === featured.id}
                    onAdd={() => add(featured.id)}
                    buttonClassName="button-white"
                  />
                </div>
              </div>
              <div className="featured-mascot" aria-hidden="true">
                <img src={MASCOT.medalha} alt="" />
              </div>
            </div>
          </section>
        )}

        {subjects.length > 2 && (
          <div className="filter-chips" role="group" aria-label="Filtrar por matéria">
            {subjects.map((item) => (
              <button
                key={item}
                type="button"
                className="filter-chip"
                aria-pressed={subject === item}
                onClick={() => setSubject(item)}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {catalog.error && <p className="error page-error">{catalog.error}</p>}

        {catalog.loading && catalog.items.length === 0 && <p className="muted page-error">Carregando...</p>}

        {!catalog.loading && catalog.items.length === 0 && (
          <div className="empty">
            <img src={MASCOT.bracos} alt="" />
            <strong>{searched ? "Nada encontrado com essa busca" : "O catálogo ainda está vazio"}</strong>
            <p>Em Minhas atividades, você pode publicar uma atividade sua aqui.</p>
          </div>
        )}

        <div className="grid">
          {shown.map((item) => (
            <CatalogCard
              key={item.id}
              item={item}
              preview={catalog.previews[item.id]}
              busy={catalog.busyId === item.id}
              onPreview={() => catalog.loadPreview(item.id)}
              onAdd={() => add(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
