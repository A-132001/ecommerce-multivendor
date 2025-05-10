import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserProfile, setTokens, clearTokens, isAuthenticated } from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (isAuthenticated()) {
                try {
                    const response = await getUserProfile();
                    setUser(response.data);
                } catch (error) {
                    clearTokens();
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = (userData, tokens) => {
        setUser(userData);
        setTokens(tokens.access, tokens.refresh);
    };

    const logout = () => {
        setUser(null);
        clearTokens();
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 