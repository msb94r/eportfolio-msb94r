export const sendChatMessage = async (message: string) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.reply;
  } catch (error) {
    console.error("Le pont a cassé :", error);
    return "Erreur de connexion au serveur local.";
  }
};