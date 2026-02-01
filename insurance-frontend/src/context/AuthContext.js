import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authAPI } from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 > Date.now()) {
                    let userData = JSON.parse(savedUser);
                    // Repair logic for previous broken state
                    if (!userData.role || !userData.id) {
                        userData = {
                            id: decoded.user_id,
                            username: decoded.sub,
                            role: decoded.user_role,
                        };
                        localStorage.setItem('user', JSON.stringify(userData));
                    }
                    setUser(userData);
                } else {
                    // Token expired, clear storage
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } catch (error) {
                console.error('Invalid token:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            const { token } = response;

            // Decode token to get user info
            const decoded = jwtDecode(token);
            const userData = {
                id: decoded.user_id,
                username: decoded.sub,
                role: decoded.user_role,
            };

            // Save to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            return { success: true };
        } catch (error) {
            let message = 'Unable to login. Please try again.';

            if (error.response?.status === 401) {
                message = 'Invalid username or password. Please check your credentials.';
            } else if (error.response?.status === 403) {
                message = 'Your account has been locked. Please contact support.';
            } else if (error.response?.data?.message) {
                message = error.response.data.message;
            } else if (!error.response) {
                message = 'Cannot connect to server. Please check your internet connection.';
            }

            return { success: false, message };
        }
    };

    const register = async (userData) => {
        try {
            await authAPI.register(userData);
            return { success: true, message: 'Account created successfully! You can now login.' };
        } catch (error) {
            let message = 'Unable to create account. Please try again.';

            if (error.response?.status === 400) {
                message = error.response.data?.message || 'Please check your information and try again.';
            } else if (error.response?.data?.message?.includes('Email')) {
                message = 'This email is already registered. Please login instead.';
            } else if (error.response?.data?.message) {
                message = error.response.data.message;
            } else if (!error.response) {
                message = 'Cannot connect to server. Please check your internet connection.';
            }

            return { success: false, message };
        }
    };

    const logout = () => {
        authAPI.logout();
        setUser(null);
    };

    const hasRole = (role) => {
        if (!user?.role) return false;
        if (Array.isArray(user.role)) {
            return user.role.includes(role);
        }
        return user.role === role;
    };

    const hasAnyRole = (requiredRoles) => {
        if (!user?.role) return false;

        // Convert user.role to array if it's a string
        const userRoles = Array.isArray(user.role) ? user.role : [user.role];

        // Check if any of the required roles exist in user's roles
        return requiredRoles.some(role => userRoles.includes(role));
    };

    const value = {
        user,
        login,
        register,
        logout,
        hasRole,
        hasAnyRole,
        isAuthenticated: !!user,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
