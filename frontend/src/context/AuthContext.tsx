import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { AuthContext } from './AuthContextInstance';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const parts = token.split('.');
                if (parts.length === 3) {
                    const payload = JSON.parse(atob(parts[1]));
                    setUser({ username: payload.username, role: payload.role });
                } else {
                    throw new Error("Invalid token format");
                }
            } catch (e) {
                console.error("Token decoding failed", e);
                localStorage.removeItem('token');
                setUser(null);
            }
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        try {
            const parts = token.split('.');
            if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]));
                setUser({ username: payload.username, role: payload.role });
            }
        } catch (e) {
            console.error("Failed to parse token on login", e);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('expires');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};
