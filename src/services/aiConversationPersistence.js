import { jwtDecode } from "jwt-decode";

const GUEST_USER_ID = "guest";
const STORAGE_PREFIX = "ai:chat:conversationId";

const readTokenFromClient = () => {
  return (
    document.cookie
      .split('; ')
      .find((row) => row.startsWith('jwt_token='))
      ?.split('=')[1] || null
  );
};

export const getActiveAiUserId = () => {
  try {
    const token = readTokenFromClient();
    if (!token) return GUEST_USER_ID;

    const decoded = jwtDecode(token);
    return decoded?.sub || GUEST_USER_ID;
  } catch {
    return GUEST_USER_ID;
  }
};

export const getConversationStorageKey = (userId) =>
  `${STORAGE_PREFIX}:${userId || GUEST_USER_ID}`;

export const readConversationIdByUserId = (userId) =>
  localStorage.getItem(getConversationStorageKey(userId));

export const readConversationIdForActiveUser = () =>
  readConversationIdByUserId(getActiveAiUserId());

export const persistConversationIdForActiveUser = (conversationId) => {
  if (!conversationId) return;
  const userId = getActiveAiUserId();
  localStorage.setItem(getConversationStorageKey(userId), conversationId);
};

export const clearConversationIdByUserId = (userId) => {
  localStorage.removeItem(getConversationStorageKey(userId));
};

export const clearConversationIdForActiveUser = () => {
  clearConversationIdByUserId(getActiveAiUserId());
};
