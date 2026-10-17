export interface TeoSession {
  token: string;
  nome: string;
}

export interface AuthResponse {
  token: string;
  userResponse: {
    id: number;
    nome: string;
    email: string;
  };
}

export interface Draft {
  id: number;
  title: string;
  subTitle: string;
  subject: string;
  draft: boolean;
  published?: boolean;
  copied?: boolean;
}

export interface CatalogItem {
  id: number;
  title: string;
  subTitle: string;
  subject: string;
  author: string;
  copies: number;
  mine: boolean;
  added: boolean;
}

export type DraftState = "draft" | "approved" | "removed";

export interface Source {
  title: string;
  link: string | null;
  page: number | null;
}

export interface ChatResponse {
  conversationId: string;
  reply: string;
  drafts: Draft[];
  sources: Source[];
}

export interface StoredMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  drafts: Draft[];
  sources: Source[];
}

export interface QuestionSlot {
  name: string;
  blank: boolean;
  label: string | null;
}

export interface QuestionContent {
  slots: QuestionSlot[];
  hint: string;
}

export interface Alternative {
  id: number;
  description: string;
  icon: string | null;
}

export interface Question {
  id: number;
  title: string;
  level: number;
  type: string;
  content: string;
  lstAlternative: Alternative[];
}

export interface Activity {
  resumeQuestionId: number | null;
  lstQuestions: Question[];
}
