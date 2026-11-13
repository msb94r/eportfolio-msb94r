export interface ChatHistoryItem {
  role: string;
  content: string;
}

export function normalizeText(text?: string): string;
export function generateSmartReply(input: string | ChatHistoryItem[]): string;
