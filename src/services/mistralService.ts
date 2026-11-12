export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const sendChatMessage = async (
  message: string | ChatMessage[],
  _t?: (key: string) => string
): Promise<string> => {
  try {
    const formattedMessages = Array.isArray(message)
      ? message
      : [{ role: 'user', content: message }];

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: formattedMessages }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.reply;
  } catch (error) {
    console.error("Le pont a cassé :", error);
    return "Erreur de connexion au serveur. N'hésitez pas à me poser une question sur le parcours, les compétences ou les projets de Muslim !";
  }
};