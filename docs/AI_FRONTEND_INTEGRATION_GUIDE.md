# Frontend AI Integration Guide

## Goal
Migrate frontend AI features from direct provider usage to backend AI APIs exposed via API Gateway at `/market/api/v1/ai/*`, without changing existing UI flows.

## Scope
This guide covers only frontend refactor work:
- Keep existing UX, loaders, toasts, and fallback messaging.
- Replace direct model/provider calls with typed backend API calls.
- Keep feature behavior compatible with current screens.

## Current to Target Parity Map
- `getChatResponse()` -> `POST /market/api/v1/ai/chat/respond`
- `generateCropRecommendations()` -> `POST /market/api/v1/ai/crop/recommendations`
- `generateCropAnalysis()` -> `POST /market/api/v1/ai/market/crop-analysis`
- `generateRecommendations()` -> `POST /market/api/v1/ai/market/recommendations`
- `predictShelfLife()` -> `POST /market/api/v1/ai/listing/shelf-life`
- `fetchAiPrice()` -> `POST /market/api/v1/ai/listing/price-suggestion`

## Frontend Config Changes
### 1) Environment and gateway
- Continue to use `VITE_API_GATEWAY_URL`.
- Use `API_CONFIG.MARKET_ACCESS` as the gateway base for market/AI routes.

### 2) Remove provider key usage in UI
- Remove direct provider key usage from AI services/components.
- Frontend must not call provider endpoints directly.

### 3) Single AI base helper
- Use a single frontend helper base:
  - `${API_CONFIG.MARKET_ACCESS}/api/v1/ai`
- Centralize `fetch` behavior (headers, credentials, error normalization, timeout support).

## Implemented Frontend Refactor
### Shared API helper
- Added: `src/services/aiApi.js`
  - `postAi(endpoint, body, options)`
  - Uses `credentials: "include"` by default.
  - Normalizes API errors with status code and message.

### Updated files
- `src/config/apiConfig.js`
  - Added `API_CONFIG.AI_BASE`
  - Removed `GEMINI_API_KEY` export
- `src/Component/KisanMitra/Services/AiService.js`
  - Replaced direct provider call with `postAi("/chat/respond", ...)`
- `src/Component/KisanMitra/Services/ChatService.js`
  - Preserved existing cache/fallback logic
  - Retry now calls backend with reduced message set
- `src/Component/CropAdvisoryBot/lib/aiApi.js`
  - Replaced model prompt execution with `postAi("/crop/recommendations", ...)`
- `src/Component/MarketTrends/components/AiService.js`
  - Replaced both AI calls with:
    - `postAi("/market/crop-analysis", ...)`
    - `postAi("/market/recommendations", ...)`
  - Preserved local storage cache + fallback data logic
- `src/Component/ListProductForm/Step2.jsx`
  - Replaced shelf-life AI call with `postAi("/listing/shelf-life", ...)`
- `src/Component/ListProductForm/Step3.jsx`
  - Replaced price suggestion AI call with `postAi("/listing/price-suggestion", ...)`
- `src/Component/CropAdvisoryBot/components/ChatInterface.jsx`
  - Removed frontend provider-key gating UI behavior
  - Maintained existing chat flow and interaction pattern

## Request/Response Contract Examples
All examples assume the frontend sends `Content-Type: application/json` and keeps session/auth cookies through gateway.

### 1) Chat Respond
Endpoint:
`POST /market/api/v1/ai/chat/respond`

Request:
```json
{
  "messages": [
    { "type": "user", "text": "मौसम के हिसाब से कौन सी फसल बोऊं?" }
  ],
  "language": "hi",
  "conversationId": "optional-conversation-id"
}
```

Expected response:
```json
{
  "schemaVersion": "1.0",
  "text": "AI response text",
  "conversationId": "conv_123",
  "safetyDecision": "allow",
  "source": "llm"
}
```

### 2) Crop Recommendations
Endpoint:
`POST /market/api/v1/ai/crop/recommendations`

Request:
```json
{
  "district": "Nashik",
  "state": "Maharashtra",
  "language": "en"
}
```

Expected response:
```json
{
  "schemaVersion": "1.0",
  "safetyDecision": "allow",
  "source": "llm",
  "crops": [
    {
      "name": "Tomato",
      "description": "Suitable for local climate",
      "suitabilityScore": 82,
      "marketTrend": "rising",
      "marketPriceChange": 4.2,
      "estimatedROI": 21,
      "growingSeason": "Rabi",
      "waterRequirement": "medium",
      "soilType": ["Loamy"],
      "harvestTime": "3-4 months",
      "currentPrice": 24.5,
      "projectedPrice": 27.1,
      "resources": ["PM-KISAN", "Soil Health Card"]
    }
  ]
}
```

### 3) Market Crop Analysis
Endpoint:
`POST /market/api/v1/ai/market/crop-analysis`

Request:
```json
{
  "cropName": "Wheat"
}
```

Expected response:
```json
{
  "schemaVersion": "1.0",
  "safetyDecision": "allow",
  "source": "llm",
  "predictions": "Demand stable with seasonal upside",
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "marketInsights": "Policy and demand insights",
  "priceAnalysis": {
    "current": 25.5,
    "previous": 24.8,
    "change": 2.8,
    "forecast": 26.4
  }
}
```

### 4) Market Recommendations
Endpoint:
`POST /market/api/v1/ai/market/recommendations`

Request:
```json
{
  "cropType": "general"
}
```

Expected response:
```json
{
  "schemaVersion": "1.0",
  "safetyDecision": "allow",
  "source": "llm",
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3"
  ]
}
```

### 5) Listing Shelf Life
Endpoint:
`POST /market/api/v1/ai/listing/shelf-life`

Request:
```json
{
  "productName": "Tomato",
  "cropType": "Vegetables",
  "storageConditions": "Room Temperature"
}
```

Expected response:
```json
{
  "schemaVersion": "1.0",
  "safetyDecision": "allow",
  "source": "llm",
  "shelfLifeDays": 7,
  "confidence": 0.81
}
```

### 6) Listing Price Suggestion
Endpoint:
`POST /market/api/v1/ai/listing/price-suggestion`

Request:
```json
{
  "productName": "Onion",
  "qualityGrade": "A",
  "quantityKg": 400,
  "location": "Nashik"
}
```

Expected response:
```json
{
  "schemaVersion": "1.0",
  "safetyDecision": "allow",
  "source": "llm",
  "pricePerKg": 28.5,
  "recommendations": [
    "Recommendation with <highlight>key term</highlight>"
  ],
  "nearbyFarmers": [
    { "name": "Farmer A", "distance": "4 km", "price": "₹27" }
  ]
}
```

## Backward-Compatible Frontend Rules
- Keep existing local fallback logic and toast messages.
- Keep local cache behavior where already implemented (for example market analysis cache in `localStorage`).
- Do not parse free-form model text in frontend anymore.
- Consume typed backend JSON contracts only.

## Auth and Rate-Limit Handling
- Chat endpoint can be treated as public path if backend allows.
- Other AI endpoints should send normal session/auth context through gateway (`credentials: "include"`).
- For `429` responses:
  - Show friendly retry messaging.
  - Use existing fallback content where available.
  - Avoid retry storms; keep retry count low and bounded.

## Migration Sequence
### Phase 1 (high-impact)
- Chat and crop recommendation migration.
- Validate no direct provider endpoint calls remain.

### Phase 2 (feature completeness)
- Market analysis/recommendations migration.
- Listing shelf-life and price suggestion migration.

### Phase 3 (cleanup)
- Remove unused AI SDK dependency from frontend package.
- Remove obsolete provider-key exports and dead prompt code paths.
- Confirm all AI traffic goes through API Gateway only.

## QA Checklist
### Network and integration
- Verify no request goes directly to any AI provider from frontend.
- Verify all AI calls target `/market/api/v1/ai/*`.

### Contract and behavior
- Validate required response fields per endpoint:
  - `schemaVersion`
  - `safetyDecision`
  - `source`
  - feature-specific typed payload
- Ensure loaders, toasts, and existing fallback messages still work.

### Rollback mode (non-prod)
- Keep optional non-prod fallback toggle if needed for testing.
- Rollback should only switch endpoint path, not UI state/flow.

## Troubleshooting
- **401/403 on private endpoints**
  - Check gateway auth/session forwarding and cookie policy.
- **429 too many requests**
  - Backoff in UI, display graceful message, use fallback.
- **Invalid typed payload**
  - Log backend response shape, validate schema fields before usage.
- **CORS issues**
  - Confirm API Gateway origin allowlist and credentials config.
- **Timeouts**
  - Apply request timeout per feature and fail to existing fallback path.

## Final Acceptance Checklist
- [ ] No direct provider API key usage in frontend AI flows
- [ ] No direct AI provider SDK dependency used by source
- [ ] No direct AI provider endpoint calls from frontend
- [ ] All 6 AI features call `/market/api/v1/ai/*`
- [ ] Existing UX behavior preserved (loaders, toasts, fallback messaging)
- [ ] QA validation complete for contracts and rollback mode
