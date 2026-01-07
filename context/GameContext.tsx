'use client'

import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {api, User} from '../services/api';
import {useRouter} from 'next/navigation';


interface GameContextType {
    user: User | null;
    isLoading: boolean;
    login: () => Promise<void>;
    logout: () => void;
    performAction: (actionName: string) => Promise<void>;
    refreshUser: (updates: Partial<User>) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Self-healing: Fetch user from BFF if not present
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/user/me');
                if (res.ok) {
                    const userData = await res.json();
                    setUser(userData);
                }
            } catch (error) {
                console.error("Failed to fetch user context", error);
            }
        };

        if (!user) {
            fetchUser();
        }
    }, [user]);

    const logout = async () => {
        setIsLoading(true);
        try {
            // Call server to delete HTTP-only cookie
            await fetch('/api/logout', { method: 'POST' });
        } catch (e) {
            console.error("Logout failed", e);
        }

        // Clear client state
        setUser(null);
        localStorage.removeItem('dirty_user_info');
        router.push('/');
        setIsLoading(false);
    };

    const login = async () => {
        setIsLoading(true);
        try {
            // Redirect to Backend Login
            window.location.href = process.env.LOGIN_FULL_URL || 'http://localhost:8080/dirty-code/v1/gmail/auth-page';
        } catch (error) {
            console.error("Login redirect failed", error);
            setIsLoading(false);
        }
    };



    const performAction = async (actionId: string) => {
        if (!user) {
            console.error("User not logged in.");
            return;
        }

        try {
            const result = await api.performAction(actionId);
            if (result.success && result.rewards && result.rewards.activeAvatar) {
                const updatedAvatar = result.rewards.activeAvatar;

                let newUser = { ...user };
                if (newUser.activeAvatar) {
                    newUser.activeAvatar = updatedAvatar;
                }

                setUser(newUser as User);
                localStorage.setItem('dirty_user_info', JSON.stringify(newUser));
                if (result.message) {
                    // Opcional: mostrar mensagem de sucesso
                }
            } else {
                alert(result.message || "Erro ao realizar ação");
            }
        } catch (e) {
            console.error(e);
            alert("Erro de conexão ao realizar ação");
        }
    };

    const refreshUser = (updates: Partial<User>) => {
        const base = user || {} as User;
        const updated = { ...base, ...updates };
        setUser(updated);
        localStorage.setItem('dirty_user_info', JSON.stringify(updated));
    }

    return (
        <GameContext.Provider value={{ user, isLoading, login, logout, performAction, refreshUser }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}
