import type { ConversationSummary } from "../types/teo";

export interface ConversationGroup {
  label: string;
  items: ConversationSummary[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export default function groupConversations(
  items: ConversationSummary[],
  query: string,
  now: Date = new Date(),
): ConversationGroup[] {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const search = normalize(query.trim());
  const groups: ConversationGroup[] = [
    { label: "Hoje", items: [] },
    { label: "Esta semana", items: [] },
    { label: "Anteriores", items: [] },
  ];

  items
    .filter((item) => !search || normalize(item.title).includes(search))
    .forEach((item) => {
      const time = new Date(item.updatedAt).getTime();

      if (time >= today) groups[0].items.push(item);
      else if (time >= today - 6 * DAY_MS) groups[1].items.push(item);
      else groups[2].items.push(item);
    });

  return groups.filter((group) => group.items.length > 0);
}
