import { INTEGRAMENTE_API_URL } from "../config";
import type { Activity, CatalogItem, Draft } from "../types/teo";
import { request } from "./http";

export function listDrafts(token: string): Promise<Draft[]> {
  return request<Draft[]>(INTEGRAMENTE_API_URL, "/drafts", { token });
}

export function getDraftActivity(token: string, id: number): Promise<Activity> {
  return request<Activity>(INTEGRAMENTE_API_URL, `/drafts/${id}/activity`, { token });
}

export function approveDraft(token: string, id: number): Promise<Draft> {
  return request<Draft>(INTEGRAMENTE_API_URL, `/drafts/${id}/approve`, {
    method: "POST",
    token,
  });
}

export function publishDraft(token: string, id: number): Promise<CatalogItem> {
  return request<CatalogItem>(INTEGRAMENTE_API_URL, `/drafts/${id}/publish`, {
    method: "POST",
    token,
  });
}

export function unpublishDraft(token: string, id: number): Promise<void> {
  return request<void>(INTEGRAMENTE_API_URL, `/drafts/${id}/unpublish`, {
    method: "POST",
    token,
  });
}

export function removeDraft(token: string, id: number): Promise<void> {
  return request<void>(INTEGRAMENTE_API_URL, `/drafts/${id}/remove`, {
    method: "POST",
    token,
  });
}
