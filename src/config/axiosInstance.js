import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    withCredentials: true,
});

// Attach JWT from cookie as Authorization header for every gateway request
api.interceptors.request.use((config) => {
    try {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('jwt_token='))
            ?.split('=')[1];
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
            // Clear any stale cookie and redirect to login
            document.cookie = 'jwt_token=; Max-Age=0; path=/';
            window.location.href = '/auth';
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
