import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// export const PORT = import.meta.env.VITE_PORT;

export const BASE_URL = "http://localhost:2525";

// Function to get the username from the token
export const getUsernameFromToken = () => {
    try {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('jwt_token='))
            ?.split('=')[1];

        if (!token) {
            console.log('JWT token not found in cookies');
            return null;
        }

        // Decode the token
        const decodedToken = jwtDecode(token);
        return decodedToken?.sub || null;
    } catch (error) {
        console.log('Error decoding JWT token:', error);
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
            console.error('JWT token not found in cookies');
            return null;
        }

        return token || null;
    } catch (error) {
        console.error('Error getting JWT token:', error);
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
                Authorization: `Bearer ${token}`, // Include token in Authorization header
                
            },
            withCredentials: true, // If your backend uses cookies for auth
        });
        // console.log('Current user:', response.data);
        
        return response.data; // Returns the User entity
    } catch (error) {
        console.error('Error fetching current user:', error.message || error);
        return null;
    }
};