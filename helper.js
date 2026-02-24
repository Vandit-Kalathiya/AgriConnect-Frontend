import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { API_CONFIG } from './src/config/apiConfig.js';

export const BASE_URL = API_CONFIG.MAIN_BACKEND;

// Function to get the username from the token
export const getUsernameFromToken = () => {
    try {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('jwt_token='))
            ?.split('=')[1];

        if (!token) {
            return null;
        }

        const decodedToken = jwtDecode(token);
        return decodedToken?.sub || null;
    } catch (error) {
        return null;
    }
};

// Function to get the token from the cookie
export const getTokenFromCookie = () => {
    try {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('jwt_token='))
            ?.split('=')[1];

        if (!token) {
            return null;
        }

        return token || null;
    } catch (error) {
        return null;
    }
};

// Function to fetch the current user entity from the backend
export const getCurrentUser = async () => {
    try {
        const token = getTokenFromCookie();
        if (!token) {
            throw new Error('No JWT token found');
        }

        const phoneNumber = getUsernameFromToken();
        if (!phoneNumber) {
            throw new Error('Unable to extract phone number from token');
        }

        const response = await axios.get(`${BASE_URL}/users/${phoneNumber}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        return null;
    }
};