# AI Persistence UI Guide

## Outcome
This guide explains how frontend should integrate with backend AI persistence so chatbot context continues across requests and page reloads, while keeping UX clear and reliable.

This is a **handover guide** for frontend engineers. It documents behavior and expected UI-side changes. It does not require executing backend migration here.

## Backend Persistence Behavior (Current)
- Chat context/history is persisted server-side using `conversationId`.
- Non-chat AI endpoint interactions are logged server-side for analytics/audit.
- Frontend does **not** need a dedicated read-history API to continue chat context.
- Continuity is achieved by repeatedly sending the latest `conversationId` in chat requests.

## Chat Continuity UI Contract
For every call to:
- `POST /market/api/v1/ai/chat/respond`

Frontend must:
1. Read the current `conversationId` for the active user from local storage.
2. Include that `conversationId` in request payload.
3. Read `conversationId` from response.
4. Persist the returned `conversationId` back to local storage.

### Storage Keying Rules
- Store by logged-in user to avoid cross-account leakage.
- Suggested key format:
  - `ai:chat:conversationId:<userId>`
- If user is unknown/anonymous, use a guest key:
  - `ai:chat:conversationId:guest`

### Reset Rules
Clear conversation ID when:
- User taps explicit **New Chat**
- User logs out
- User account switches

Do not clear conversation ID on simple page refresh.

## Response Fields UI Should Keep and Use
From chat response, UI should handle:
- `text`
- `conversationId`
- `safetyDecision`
- `source`
- `schemaVersion`

### Practical usage
- `text`: render assistant message
- `conversationId`: persist for next request
- `safetyDecision`: show controlled/safe UI state if needed
- `source`: optional badge/telemetry (`LLM`, `CACHE`, `FALLBACK`)
- `schemaVersion`: optional guard for future compatibility checks

## Reliability and UX Rules
- Keep current fallback UX (toasts + fallback message bubbles).
- On `429` or `5xx`:
  - Preserve user message in chat thread
  - Show retry prompt/toast
  - Do not erase current UI history
- Do not attempt client-side AI history reconstruction logic beyond normal UI rendering.
- Server owns semantic memory; frontend only forwards `conversationId`.

## Recommended Request/Response Shape
### Request
```json
{
  "messages": [
    { "type": "user", "text": "What should I sow in Kharif?" }
  ],
  "language": "en",
  "conversationId": "optional-existing-conversation-id"
}
```

### Response
```json
{
  "schemaVersion": "1.0",
  "text": "For your region, consider ...",
  "conversationId": "conv_abc123",
  "safetyDecision": "ALLOW",
  "source": "LLM"
}
```

## File-Level UI Change Instructions (Documented, Not Executed)

### 1) Chat persistence orchestration
File:
- [D:/VK18/My Projects/AgriConnect/Frontend/frontend/src/Component/KisanMitra/Services/ChatService.js](D:/VK18/My Projects/AgriConnect/Frontend/frontend/src/Component/KisanMitra/Services/ChatService.js)

Instructions:
- Ensure chat service uses backend chat API wrapper only.
- Before each chat request, attach persisted `conversationId`.
- After each response, update persisted `conversationId`.
- Keep existing fallback behavior for timeout/network/rate limit.

---

### 2) Legacy direct-provider path deprecation
File (migration reference):
- [D:/VK18/My Projects/AgriConnect/Frontend/frontend/src/Component/KisanMitra/Services/GeminiService.js](D:/VK18/My Projects/AgriConnect/Frontend/frontend/src/Component/KisanMitra/Services/GeminiService.js)

Instructions:
- Mark legacy direct Gemini invocation path as deprecated/removed in migration notes.
- Prefer backend wrapper naming (`AiService`) for active path.

---

### 3) AI base path contract
File:
- [D:/VK18/My Projects/AgriConnect/Frontend/frontend/src/config/apiConfig.js](D:/VK18/My Projects/AgriConnect/Frontend/frontend/src/config/apiConfig.js)

Instructions:
- Define and use:
  - `${API_CONFIG.MARKET_ACCESS}/api/v1/ai`
- Keep a single frontend AI base helper to avoid endpoint drift.

---

### 4) Crop advisory endpoint mapping
File (migration reference):
- [D:/VK18/My Projects/AgriConnect/Frontend/frontend/src/Component/CropAdvisoryBot/lib/geminiApi.js](D:/VK18/My Projects/AgriConnect/Frontend/frontend/src/Component/CropAdvisoryBot/lib/geminiApi.js)

Instructions:
- Map to:
  - `POST /market/api/v1/ai/crop/recommendations`
- Active naming can be `aiApi.js` in refactored codebase.

---

### 5) Market trends endpoint mapping
File (migration reference):
- [D:/VK18/My Projects/AgriConnect/Frontend/frontend/src/Component/MarketTrends/components/GeminiService.js](D:/VK18/My Projects/AgriConnect/Frontend/frontend/src/Component/MarketTrends/components/GeminiService.js)

Instructions:
- Map to:
  - `POST /market/api/v1/ai/market/crop-analysis`
  - `POST /market/api/v1/ai/market/recommendations`
- Active naming can be `AiService.js` in refactored codebase.

## Suggested UI Helper Snippets
### Local storage helpers
```js
export const getConversationStorageKey = (userId) =>
  `ai:chat:conversationId:${userId || "guest"}`;

export const readConversationId = (userId) =>
  localStorage.getItem(getConversationStorageKey(userId));

export const writeConversationId = (userId, conversationId) => {
  if (!conversationId) return;
  localStorage.setItem(getConversationStorageKey(userId), conversationId);
};

export const clearConversationId = (userId) =>
  localStorage.removeItem(getConversationStorageKey(userId));
```

### Chat call flow
```js
const conversationId = readConversationId(userId);
const response = await postAi("/chat/respond", {
  messages,
  language,
  conversationId,
});
writeConversationId(userId, response.conversationId);
```

## Validation Checklist
- [ ] Network: browser makes no direct Gemini/LLM provider calls.
- [ ] Chat continuity: refresh page and continue same context successfully.
- [ ] User isolation: different logged-in users do not share `conversationId`.
- [ ] New chat reset: context restarts when user taps **New Chat**.
- [ ] Logout/account switch reset: previous user `conversationId` is not reused.
- [ ] API contract: UI safely handles `source` (`LLM|CACHE|FALLBACK`) and `safetyDecision`.
- [ ] Error handling: `429/5xx` keeps user message and shows retry guidance.

## UX Notes
- Prefer subtle status indicators over noisy alerts.
- Keep retries user-controlled (manual retry button/action) for rate limit cases.
- Preserve visible conversation bubbles even on backend errors.
- Avoid exposing internal error payload details to end users.

