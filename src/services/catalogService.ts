import { INTEGRAMENTE_API_URL } from "../config";
import type { Activity, CatalogItem, Draft } from "../types/teo";
import { request } from "./http";

export function listCatalog(token: string, query: string): Promise<CatalogItem[]> {
  const search = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";
  return request<CatalogItem[]>(INTEGRAMENTE_API_URL, `/catalog${search}`, { token });
}

export function getCatalogActivity(token: string, id: number): Promise<Activity> {
  return request<Activity>(INTEGRAMENTE_API_URL, `/catalog/${id}/activity`, { token });
}

export function copyFromCatalog(token: string, id: number): Promise<Draft> {
  return request<Draft>(INTEGRAMENTE_API_URL, `/catalog/${id}/copy`, {
    method: "POST",
    token,
  });
}
