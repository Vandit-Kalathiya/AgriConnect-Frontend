import { fetchChatResponseFromAi } from "./AiService";
import {
  clearConversationIdByUserId,
  clearConversationIdForActiveUser,
  getActiveAiUserId,
  persistConversationIdForActiveUser,
  readConversationIdForActiveUser,
} from "../../../services/aiConversationPersistence";

const responseCache = new Map();
let previousActiveUserId = getActiveAiUserId();

const syncUserContextIfChanged = () => {
  const currentUserId = getActiveAiUserId();
  if (currentUserId !== previousActiveUserId) {
    // Clear only the previous user's thread key to avoid cross-user leakage.
    // Do not clear current user key, otherwise resumed chats start as new threads.
    clearConversationIdByUserId(previousActiveUserId);
    previousActiveUserId = currentUserId;
  }
};

export const getChatResponse = async (messages, language) => {
  try {
    syncUserContextIfChanged();

    const lastUserMessage = messages.filter((m) => m.type === "user").pop();
    if (!lastUserMessage) {
      throw new Error("No user message found");
    }

    const isFollowUpQuestion =
      messages.length > 2 && isLikelyFollowUp(lastUserMessage.text, language);
    const conversationId = readConversationIdForActiveUser();
    const cacheKey = `${lastUserMessage.text}_${language}_${conversationId || "new"}`;

    if (!isFollowUpQuestion && responseCache.has(cacheKey)) {
      return { text: responseCache.get(cacheKey) || "" };
    }

    // Backend already manages thread context by conversationId.
    // Send only latest user message as per API contract.
    const payloadMessages = [lastUserMessage];
    const requestedConversationId = conversationId || null;

    const response = await fetchChatResponseFromAi(
      payloadMessages,
      language,
      requestedConversationId
    );

    // Keep the active thread stable when continuing an existing conversation.
    const resolvedConversationId =
      requestedConversationId || response.conversationId || null;
    if (resolvedConversationId) {
      persistConversationIdForActiveUser(resolvedConversationId);
    }

    if (!isFollowUpQuestion) {
      if (responseCache.size > 100) {
        const oldestKey = responseCache.keys().next().value;
        responseCache.delete(oldestKey);
      }
      responseCache.set(cacheKey, response.text);
    }

    return {
      ...response,
      conversationId: resolvedConversationId,
    };
  } catch (error) {
    console.error("Error getting chat response:", error);
    return {
      text: getFallbackResponse(language),
      conversationId: readConversationIdForActiveUser(),
      safetyDecision: "ALLOW",
      source: "FALLBACK",
      schemaVersion: "ui-fallback-v1",
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
};

const isLikelyFollowUp = (text, language) => {
  const lowerText = text.toLowerCase();

  const followUpIndicators = {
    en: [
      "tell me more",
      "more details",
      "more about",
      "what about",
      "how about",
      "also",
      "and",
      "explain",
      "elaborate",
      "why",
      "how does",
      "what else",
      "yes",
      "ok",
      "okay",
      "sure",
      "continue",
    ],
    hi: [
      "और बताओ",
      "और जानकारी",
      "इसके बारे में",
      "यह",
      "वह",
      "और",
      "कैसे",
      "क्यों",
      "समझाओ",
      "हाँ",
      "ठीक है",
      "अच्छा",
      "जारी रखें",
    ],
  };

  const indicators = [
    ...(followUpIndicators[language] || []),
    ...followUpIndicators.en,
  ];

  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount <= 5) {
    return indicators.some((ind) => lowerText.includes(ind));
  }

  return indicators.some(
    (ind) => lowerText.startsWith(ind) || lowerText.includes(ind)
  );
};

export const getFallbackResponse = (language) => {
  const fallbackResponses = {
    en: "I'm having trouble connecting right now, but I'm here to help with your farming questions. Please try again in a moment.",
    hi: "मुझे अभी कनेक्ट करने में परेशानी हो रही है, लेकिन मैं आपके खेती के सवालों में मदद के लिए यहां हूं। कृपया थोड़ी देर बाद फिर कोशिश करें।",
  };

  return fallbackResponses[language] || fallbackResponses.en;
};

export const getRateLimitedFallbackResponse = (language) => {
  const rateLimitResponses = {
    en: "Too many requests right now. Please wait a few seconds and try again.",
    hi: "अभी बहुत ज्यादा अनुरोध आ रहे हैं। कृपया कुछ सेकंड बाद फिर कोशिश करें।",
  };

  return rateLimitResponses[language] || rateLimitResponses.en;
};

export const resetChatConversationContext = () => {
  clearConversationIdForActiveUser();
  responseCache.clear();
};
