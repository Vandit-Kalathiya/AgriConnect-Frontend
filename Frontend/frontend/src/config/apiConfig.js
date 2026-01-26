export const API_CONFIG = {
    MAIN_BACKEND: import.meta.env.VITE_MAIN_BACKEND_URL || 'http://localhost:2525',
    CONTRACT_FARMING: import.meta.env.VITE_CONTRACT_FARMING_URL || 'http://localhost:2526',
    MARKET_ACCESS: import.meta.env.VITE_MARKET_ACCESS_URL || 'http://localhost:2527',
    GENERATE_AGREEMENT: import.meta.env.VITE_GENERATE_AGREEMENT_URL || 'http://localhost:2529',
    EUREKA_SERVER: import.meta.env.VITE_EUREKA_SERVER_URL || 'http://localhost:8761',
};

export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
export const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '3919f2231e07934b2048b0f97d3d5040';
