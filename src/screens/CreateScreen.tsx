import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import ActivityPreview from "../components/ActivityPreview";
import ActivityThumb from "../components/ActivityThumb";
import GroupsFields from "../components/GroupsFields";
import Icon from "../components/Icon";
import LettersFields from "../components/LettersFields";
import SumFields from "../components/SumFields";
import WordTiles from "../components/WordTiles";
import type useCreator from "../hooks/useCreator";
import type { CreatorKind } from "../hooks/useCreator";
import type useDrafts from "../hooks/useDrafts";
import { MASCOT } from "../mascot";

interface CreateScreenProps {
  creator: ReturnType<typeof useCreator>;
  drafts: ReturnType<typeof useDrafts>;
  onGoMine: () => void;
  onToast: (text: string) => void;
}

interface ActivityKind {
  id: CreatorKind | "map" | "body";
  name: string;
  intro: string;
  thumb: ReactNode;
  howTo: string;
}

const TYPES: ActivityKind[] = [
  {
    id: "letters",
    name: "Complete a palavra",
    intro: "Uma imagem aparece com a palavra incompleta e a criança arrasta as letras que faltam. Trabalha leitura e escrita.",
    thumb: <WordTiles word="UVA" emoji="🍇" />,
    howTo: "Olhe o emoji e arraste as letras que faltam em cada palavra.",
  },
  {
    id: "sum",
    name: "Soma com bolinhas",
    intro: "A criança conta duas quantidades de bolinhas e escolhe o resultado da soma. Trabalha contagem e adição.",
    thumb: <ActivityThumb type="DRAG_DOTS" />,
    howTo: "Conte as bolinhas e escolha o resultado certo. A resposta certa aparece destacada.",
  },
  {
    id: "groups",
    name: "Agrupar",
    intro: "A criança arrasta cada item para o grupo certo. Trabalha classificação e vocabulário.",
    thumb: <ActivityThumb type="DRAG_SLOTS_TO_GROUP" />,
    howTo: "Arraste cada item para o grupo certo.",
  },
  {
    id: "map",
    name: "Monte o mapa",
    intro: "A criança arrasta cada região até o lugar certo para montar o mapa.",
    thumb: <span aria-hidden="true">🗺️</span>,
    howTo: "",
  },
  {
    id: "body",
    name: "Complete o corpo",
    intro: "A criança arrasta as partes do corpo para completar a figura.",
    thumb: <span aria-hidden="true">🧍</span>,
    howTo: "",
  },
];

const AVAILABLE: CreatorKind[] = ["letters", "sum", "groups"];

function isAvailable(id: ActivityKind["id"]): id is CreatorKind {
  return AVAILABLE.includes(id as CreatorKind);
}

function Summary({ creator }: { creator: ReturnType<typeof useCreator> }) {
  if (creator.kind === "sum") {
    return (
      <p>
        Vou criar uma atividade <mark>Soma com bolinhas</mark> com{" "}
        <mark>
          {creator.sumCount} {creator.sumCount === 1 ? "conta" : "contas"}
        </mark>{" "}
        diferentes, com resultado <mark>até {creator.maxTotal}</mark>. Cada conta tem 4 opções de resposta e só uma
        está certa.
      </p>
    );
  }

  if (creator.kind === "groups") {
    const subject = creator.subjects.find((item) => item.id === creator.subjectId)?.name;

    return (
      <p>
        Vou criar uma atividade <mark>Agrupar</mark> sobre{" "}
        <mark>{creator.groupsTheme.trim() || "o tema que você escolher"}</mark>, com{" "}
        <mark>{creator.groupCount} grupos</mark> de <mark>{creator.itemCount} itens</mark>, na matéria{" "}
        <mark>{subject ?? "que você escolher"}</mark>. Eu escolho um emoji para cada item.
      </p>
    );
  }

  const hiddenText =
    creator.hidden === null
      ? "as letras que eu achar melhor"
      : `${creator.hidden} ${creator.hidden === 1 ? "letra" : "letras"}`;

  if (creator.mode === "theme") {
    return (
      <p>
        Vou criar uma atividade <mark>Complete a palavra</mark> com{" "}
        <mark>
          {creator.count} {creator.count === 1 ? "palavra" : "palavras"}
        </mark>{" "}
        sobre <mark>{creator.theme.trim() || "o tema que você escolher"}</mark>, escondendo <mark>{hiddenText}</mark> em
        cada uma. Eu também escolho um emoji para cada palavra.
      </p>
    );
  }

  return (
    <p>
      Vou criar uma atividade <mark>Complete a palavra</mark> com{" "}
      <mark>{creator.words.length ? creator.words.join(", ") : "as palavras que você digitar"}</mark>, escondendo{" "}
      <mark>{hiddenText}</mark> em cada uma. Eu também escolho um emoji para cada palavra.
    </p>
  );
}

export default function CreateScreen({ creator, drafts, onGoMine, onToast }: CreateScreenProps) {
  const [picked, setPicked] = useState<boolean>(
    creator.status === "loading" || (creator.draft !== null && drafts.stateOf(creator.draft) === "draft"),
  );
  const resultRef = useRef<HTMLElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const current = TYPES.find((type) => type.id === creator.kind) ?? TYPES[0];
  const draft = creator.draft;
  const draftState = draft ? drafts.stateOf(draft) : null;
  const loading = creator.status === "loading";
  const done = creator.status === "done" && draft !== null;

  useEffect(() => {
    if (!picked && creator.status === "done") creator.reset();
  }, []);

  useEffect(() => {
    if (draft) drafts.loadPreview(draft.id);
  }, [draft?.id]);

  useEffect(() => {
    if (creator.status !== "idle") resultRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [creator.status, drafts.previews]);

  const speech = (() => {
    if (!picked) {
      return { pose: MASCOT.acenando, title: "Oi! Qual tipo de atividade vamos criar hoje?", text: "Escolha um tipo e eu te ajudo com o resto." };
    }
    if (loading) {
      return { pose: MASCOT.pensando, title: "Estou montando sua atividade…", text: "Isso leva alguns segundos." };
    }
    if (done && draftState === "approved") {
      return { pose: MASCOT.feliz, title: "Pronto! Ela já está no app da criança.", text: "Você encontra ela em Minhas atividades." };
    }
    if (done && draftState === "removed") {
      return { pose: MASCOT.acenando, title: "Descartei essa. Quer tentar de novo?", text: "Mude os detalhes e gere outra quando quiser." };
    }
    if (done) {
      return { pose: MASCOT.feliz, title: "Ficou assim! Confira a prévia.", text: "Ela é um rascunho: só vai para o app da criança se você aprovar." };
    }
    return { pose: MASCOT.joinha, title: "Boa escolha! Agora personalize os detalhes.", text: current.intro };
  })();

  const regenerate = async () => {
    if (draft && draftState === "draft" && !(await drafts.remove(draft.id))) return;
    creator.generate();
  };

  const approve = async () => {
    if (draft && (await drafts.approve(draft.id))) onToast("Atividade aprovada! Já está no app da criança.");
  };

  const discard = async () => {
    if (draft) await drafts.remove(draft.id);
  };

  const changeStep = (next: boolean) => {
    setPicked(next);
    pageRef.current?.scrollTo({ top: 0 });
  };

  const choose = (kind: CreatorKind) => {
    creator.choose(kind);
    changeStep(true);
  };

  return (
    <div className="page" ref={pageRef}>
      <div className="page-inner">
        {picked && (
          <button type="button" className="back-button" onClick={() => changeStep(false)}>
            <Icon name="back" />
            Tipos de atividade
          </button>
        )}

        <h1 className="page-title">{picked ? current.name : "Criar atividade"}</h1>

        <div className="speech-row">
          <img src={speech.pose} alt="" />
          <div className="speech" aria-live="polite">
            <strong>{speech.title}</strong>
            <span>{speech.text}</span>
          </div>
        </div>

        {!picked && (
          <>
            <h2 className="step-title">Escolha o tipo</h2>
            <div className="type-grid">
              {TYPES.map((type) => {
                const available = isAvailable(type.id);

                return (
                  <article key={type.id} className={available ? "type-card" : "type-card type-card-soon"}>
                    <div className="type-thumb">{type.thumb}</div>
                    <div className="type-info">
                      <strong>{type.name}</strong>
                      <span>{type.intro}</span>
                      <button
                        type="button"
                        className={
                          available
                            ? "button-primary button-small button-block"
                            : "button-ghost button-small button-block"
                        }
                        disabled={!available}
                        onClick={() => isAvailable(type.id) && choose(type.id)}
                      >
                        {available ? "Criar esta atividade" : "Em breve"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {picked && (
          <div className="create-grid">
            <section className="panel">
              <h2 className="step-title">1. Personalize</h2>
              {creator.kind === "letters" && <LettersFields creator={creator} />}
              {creator.kind === "sum" && <SumFields creator={creator} />}
              {creator.kind === "groups" && <GroupsFields creator={creator} />}
            </section>

            <section className="create-result" ref={resultRef}>
              <h2 className="step-title">2. Gere com o Teo</h2>

              <div className="summary">
                <span className="eyebrow">RESUMO</span>
                <Summary creator={creator} />
              </div>
              <p className="note">
                A atividade nasce como rascunho e só vai para o app da criança depois que você aprovar.
              </p>

              {creator.error && <p className="error">{creator.error}</p>}
              {drafts.error && done && <p className="error">{drafts.error}</p>}

              {!done && (
                <button
                  type="button"
                  className="button-primary button-lg"
                  disabled={!creator.ready || loading}
                  onClick={creator.generate}
                >
                  <Icon name="sparkle" />
                  Gerar com o Teo
                </button>
              )}

              {loading && (
                <div className="loading-line" role="status">
                  <span className="dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  Montando sua atividade
                </div>
              )}

              {done && draftState !== "removed" && (
                <div className="preview-card">
                  <span className="eyebrow">PRÉVIA</span>
                  <h3>{draft.title}</h3>
                  <p className="preview-card-sub">{current.howTo}</p>
                  {drafts.previews[draft.id] ? (
                    <ActivityPreview activity={drafts.previews[draft.id]} plan={creator.plan} />
                  ) : (
                    <p className="preview-card-sub">Carregando prévia...</p>
                  )}
                </div>
              )}

              {done && draftState === "draft" && (
                <>
                  <div className="actions-2">
                    <button
                      type="button"
                      className="button-dark"
                      disabled={drafts.busyId === draft.id}
                      onClick={regenerate}
                    >
                      Gerar de novo
                    </button>
                    <button
                      type="button"
                      className="button-primary"
                      disabled={drafts.busyId === draft.id}
                      onClick={approve}
                    >
                      {drafts.busyId === draft.id ? "Aguarde..." : "Aprovar"}
                    </button>
                  </div>
                  <button
                    type="button"
                    className="link-button link-danger"
                    disabled={drafts.busyId === draft.id}
                    onClick={discard}
                  >
                    Descartar
                  </button>
                </>
              )}

              {done && draftState === "approved" && (
                <div className="actions-2">
                  <button type="button" className="button-dark" onClick={creator.reset}>
                    Criar outra
                  </button>
                  <button type="button" className="button-success" onClick={onGoMine}>
                    Ver em Minhas atividades
                  </button>
                </div>
              )}

              {done && draftState === "removed" && (
                <button type="button" className="button-primary button-lg" onClick={creator.generate}>
                  <Icon name="sparkle" />
                  Gerar de novo
                </button>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
