const GATEWAY = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080';

export const API_CONFIG = {
    MAIN_BACKEND:       `${GATEWAY}`,
    CONTRACT_FARMING:   `${GATEWAY}/contract-farming`,
    MARKET_ACCESS:      `${GATEWAY}/market`,
    GENERATE_AGREEMENT: `${GATEWAY}/agreement`,
    AI_BASE:            `${GATEWAY}/market/api/v1/ai`,

    // Alias for MAIN_BACKEND — used by OrderItem.jsx and OrderList.jsx (/users/unique/{id})
    IDENTITY_SERVICE:   `${GATEWAY}`,
};

export const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '3919f2231e07934b2048b0f97d3d5040';
