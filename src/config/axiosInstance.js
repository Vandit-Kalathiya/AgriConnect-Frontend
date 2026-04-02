import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    withCredentials: true,
});

let inMemoryJwtToken = null;

const readJwtFromCookie = () => {
    const cookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('jwt_token='));
    if (!cookie) return null;
    const rawValue = cookie.slice('jwt_token='.length);
    return decodeURIComponent(rawValue || '');
};

export const setAuthToken = (token) => {
    inMemoryJwtToken = token || null;
};

export const clearAuthToken = () => {
    inMemoryJwtToken = null;
};

const clearJwtCookie = () => {
    document.cookie = 'jwt_token=; Max-Age=0; path=/; SameSite=Lax';
};

const shouldInvalidateSessionFor401 = (error) => {
    const data = error?.response?.data;
    const message = (
        typeof data === 'string'
            ? data
            : data?.message || data?.error || ''
    ).toLowerCase();

    // Only invalidate auth when backend explicitly indicates token/session failure.
    return (
        message.includes('token expired') ||
        message.includes('jwt expired') ||
        message.includes('invalid token') ||
        message.includes('invalid jwt') ||
        message.includes('malformed jwt') ||
        message.includes('signature') ||
        message.includes('expired jwt') ||
        message.includes('unauthorized')
    );
};

// Attach JWT from cookie as Authorization header for every gateway request
api.interceptors.request.use((config) => {
    try {
        const token = inMemoryJwtToken || readJwtFromCookie();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    } catch {
        // ignore cookie read errors
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            // Keep cookie for generic 401s. Only clear session when backend explicitly
            // reports token/session invalidation.
            clearAuthToken();
            if (shouldInvalidateSessionFor401(error)) {
                clearJwtCookie();
                if (window.location.pathname !== '/auth') {
                    window.location.href = '/auth';
                }
            }
        }

        if (status === 503) {
            const body = error.response?.data;
            const message =
                (typeof body === 'object' && body?.message) ||
                'Service temporarily unavailable. Please try again later.';
            toast.error(message);
        }

        return Promise.reject(error);
    }
);

export default api;
