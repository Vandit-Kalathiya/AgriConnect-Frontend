import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    withCredentials: true,
});

// Attach JWT from cookie as Authorization header for every gateway request
api.interceptors.request.use((config) => {
    try {
        const cookieToken = document.cookie
            .split('; ')
            .find((row) => row.startsWith('jwt_token='))
            ?.split('=')[1];
        const storageToken = localStorage.getItem('jwt_token');
        const token = cookieToken || storageToken;
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
            localStorage.removeItem('jwt_token');
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
