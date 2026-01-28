import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { username: email, password });
            const { id, token, email: userEmail, roles } = response.data;
            const userData = { id, email: userEmail, role: roles[0] };
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return userData;
        } catch (error) {
            const errorData = error.response?.data;
            let errorMessage = 'Login failed';

            if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else if (errorData?.message) {
                errorMessage = errorData.message;
            } else if (typeof errorData === 'object') {
                errorMessage = Object.values(errorData).join(', ');
            }

            throw errorMessage;
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data.message;
        } catch (error) {
            const errorData = error.response?.data;
            let errorMessage = 'Registration failed';

            if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else if (errorData?.message) {
                errorMessage = errorData.message;
            } else if (typeof errorData === 'object') {
                // Handle validation error maps
                errorMessage = Object.values(errorData).join(', ');
            }

            throw errorMessage;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
