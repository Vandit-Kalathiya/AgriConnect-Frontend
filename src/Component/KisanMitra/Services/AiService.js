import { postAi } from "../../../services/aiApi";

export const fetchChatResponseFromAi = async (
  messages,
  language,
  conversationId
) => {
  const payload = {
    messages: messages.map((msg) => ({
      type: msg.type,
      text: msg.text,
    })),
    language,
    conversationId: conversationId || undefined,
  };

  const data = await postAi("/chat/respond", payload);

  if (!data?.text) {
    throw new Error("No response text from AI backend");
  }

  return {
    text: data.text,
    conversationId: data.conversationId || null,
    safetyDecision: data.safetyDecision || null,
    source: data.source || null,
    schemaVersion: data.schemaVersion || null,
  };
};
