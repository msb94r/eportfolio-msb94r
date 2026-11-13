import { generateSmartReply as generateGranularReply, type ChatHistoryItem } from './chatbotKnowledge.js';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function generateSmartReply(input: string | ChatHistoryItem[]): string {
  return generateGranularReply(input);
}

export const sendChatMessage = async (
  message: string | ChatMessage[],
  _t?: (key: string) => string
): Promise<string> => {
  const formattedMessages = Array.isArray(message)
    ? message
    : [{ role: 'user' as const, content: message }];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: formattedMessages }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data.reply) {
      return data.reply;
    }
    throw new Error('Empty reply');
  } catch {
    // Bascule transparente sur le moteur granulaire local avec historique complet
    return generateGranularReply(formattedMessages);
  }
};