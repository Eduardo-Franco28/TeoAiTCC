import { useCallback, useState } from "react";
import { ApiError } from "../services/http";
import { createGroups, createLetters, createSum, listSubjects } from "../services/teoService";
import type { Draft, GroupPlan, LettersRequest, Subject, TeoSession } from "../types/teo";

export type CreatorKind = "letters" | "sum" | "groups";

export type CreateMode = "theme" | "words";

export type CreateStatus = "idle" | "loading" | "done";

export const MAX_WORDS = 10;

export const MAX_SUMS = 10;

export const TOTAL_OPTIONS = [10, 20, 30];

export const GROUP_OPTIONS = [2, 3];

const DEFAULT_GROUPS_SUBJECT = /ci[eê]ncias da natureza/i;

const WORD_PATTERN = /^[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ]+$/;

const MIN_LETTERS = 2;

const MAX_LETTERS = 8;

export function normalizeWord(text: string): string {
  return text.replace(/\s+/g, "").toUpperCase();
}

export function wordProblem(word: string): string | null {
  if (!WORD_PATTERN.test(word)) return "só letras";
  if (word.length < MIN_LETTERS) return "muito curta";
  if (word.length > MAX_LETTERS) return "muito longa";
  return null;
}

export default function useCreator(session: TeoSession | null, onExpired: () => void) {
  const [kind, setKind] = useState<CreatorKind>("letters");
  const [mode, setMode] = useState<CreateMode>("theme");
  const [theme, setTheme] = useState<string>("");
  const [words, setWords] = useState<string[]>([]);
  const [count, setCount] = useState<number>(5);
  const [hidden, setHidden] = useState<number | null>(null);
  const [sumCount, setSumCount] = useState<number>(5);
  const [maxTotal, setMaxTotal] = useState<number>(10);
  const [groupsTheme, setGroupsTheme] = useState<string>("");
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [groupCount, setGroupCount] = useState<number>(2);
  const [itemCount, setItemCount] = useState<number>(2);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [plan, setPlan] = useState<GroupPlan[] | null>(null);
  const [status, setStatus] = useState<CreateStatus>("idle");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState<string | null>(null);


  const ready =
    kind === "sum"
      ? true
      : kind === "groups"
        ? groupsTheme.trim().length > 0 && subjectId !== null
        : mode === "theme"
          ? theme.trim().length > 0
          : words.length > 0 && words.length <= MAX_WORDS && words.every((word) => !wordProblem(word));

  const handleError = (err: unknown) => {
    if (err instanceof ApiError && err.status === 401) {
      onExpired();
      return;
    }

    setError(err instanceof ApiError ? err.message : "O Teo não conseguiu criar a atividade agora");
    setDraft(null);
    setPlan(null);
    setStatus("idle");
  };

  const addWords = (text: string) => {
    const typed = text.split(/[,;\s]+/).map(normalizeWord).filter(Boolean);
    setWords((current) => [...current, ...typed.filter((word) => !current.includes(word))].slice(0, MAX_WORDS));
  };

  const removeWord = (word: string) => {
    setWords((current) => current.filter((item) => item !== word));
  };

  const changeCount = (delta: number) => {
    setCount((current) => Math.max(1, Math.min(MAX_WORDS, current + delta)));
  };

  const changeSumCount = (delta: number) => {
    setSumCount((current) => Math.max(1, Math.min(MAX_SUMS, current + delta)));
  };

  const loadSubjects = useCallback(async () => {
    if (!session) return;

    try {
      const response = await listSubjects(session.token);
      setSubjects(response);
      setSubjectId((current) => {
        if (current !== null) return current;
        const preferred = response.find((subject) => DEFAULT_GROUPS_SUBJECT.test(subject.name));
        return (preferred ?? response[0])?.id ?? null;
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) onExpired();
    }
  }, [session, onExpired]);

  const reset = () => {
    setDraft(null);
    setPlan(null);
    setStatus("idle");
    setError(null);
  };

  const choose = (next: CreatorKind) => {
    setKind(next);
    reset();
  };

  const generate = async () => {
    if (!session || !ready || status === "loading") return;

    setStatus("loading");
    setError(null);

    try {
      if (kind === "sum") {
        const response = await createSum(session.token, { count: sumCount, maxTotal });
        setPlan(null);
        setDraft(response.draft);
      } else if (kind === "groups" && subjectId !== null) {
        const response = await createGroups(session.token, {
          theme: groupsTheme.trim(),
          subjectId,
          groups: groupCount,
          items: itemCount,
        });
        setPlan(response.groups);
        setDraft(response.draft);
      } else {
        const body: LettersRequest =
          mode === "theme"
            ? { theme: theme.trim(), count, hidden }
            : { theme: theme.trim() || undefined, words, hidden };
        const response = await createLetters(session.token, body);
        setPlan(null);
        setDraft(response.draft);
      }

      setStatus("done");
    } catch (err) {
      handleError(err);
    }
  };

  return {
    kind,
    choose,
    mode,
    setMode,
    theme,
    setTheme,
    words,
    addWords,
    removeWord,
    count,
    changeCount,
    hidden,
    setHidden,
    sumCount,
    changeSumCount,
    maxTotal,
    setMaxTotal,
    groupsTheme,
    setGroupsTheme,
    subjectId,
    setSubjectId,
    groupCount,
    setGroupCount,
    itemCount,
    setItemCount,
    subjects,
    loadSubjects,
    plan,
    status,
    draft,
    error,
    ready,
    generate,
    reset,
  };
}
