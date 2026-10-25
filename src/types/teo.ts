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

export type ActivityType =
  | "DRAG_LETTERS"
  | "DRAG_DOTS"
  | "DRAG_SLOTS_TO_GROUP"
  | "DRAG_TO_SLOTS"
  | "DRAG_SUBTRACTION";

export interface Draft {
  id: number;
  title: string;
  subTitle: string;
  subject: string;
  draft: boolean;
  published?: boolean;
  copied?: boolean;
  type?: ActivityType | null;
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
  type?: ActivityType | null;
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
  streaming?: boolean;
}

export type ChatEvent =
  | { type: "status"; text: string }
  | { type: "delta"; text: string }
  | { type: "reset" }
  | { type: "error"; text: string }
  | ({ type: "done" } & ChatResponse);

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

export interface ConversationSummary {
  id: string;
  title: string;
  updatedAt: string;
}

export interface LettersRequest {
  theme?: string;
  words?: string[];
  count?: number;
  hidden: number | null;
}

export interface LettersResponse {
  draft: Draft;
}

export interface Subject {
  id: number;
  name: string;
}

export interface SumActivityRequest {
  count: number;
  maxTotal: number;
}

export interface GroupItem {
  name: string;
  emoji: string;
}

export interface GroupPlan {
  name: string;
  items: GroupItem[];
}

export interface GroupsActivityRequest {
  theme: string;
  subjectId: number;
  groups: number;
  items: number;
}

export interface GroupsResponse {
  draft: Draft;
  question: string;
  groups: GroupPlan[];
}

export type Screen = "chat" | "create" | "mine" | "catalog";
