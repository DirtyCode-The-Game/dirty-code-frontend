'use client'

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api, User } from '../services/api';
import { useRouter } from 'next/navigation';


interface GameContextType {
    user: User | null;
    isLoading: boolean;
    login: () => Promise<void>;
    logout: () => void;
    performAction: (action: any, count?: number) => Promise<{
        success: boolean;
        message: string;
        timesExecuted?: number;
        variations?: {
            experience?: number;
            life?: number;
            stamina?: number;
            money?: number;
        } | null;
    }>;
    refreshUser: (updates: Partial<User>) => void;
    actionCount: number;
    setActionCount: (count: number) => void;
    onTimeoutRedirect?: () => void;
    setOnTimeoutRedirect: (callback: () => void) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [actionCount, setActionCount] = useState(1);
    const [timeoutRedirectCallback, setTimeoutRedirectCallback] = useState<(() => void) | undefined>(undefined);
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



    const performAction = async (action: any, count: number = 1): Promise<{
        success: boolean;
        message: string;
        timesExecuted?: number;
        variations?: {
            experience?: number;
            life?: number;
            stamina?: number;
            money?: number;
        } | null;
    }> => {
        if (!user) {
            console.error("User not logged in.");
            return { success: false, message: "Usuário não logado" };
        }

        const oldAvatar = user.activeAvatar;

        try {
            const result = await api.performAction(action.id, count);
            const updatedAvatar = result.avatar;

            setUser(prev => {
                if (!prev) return null;
                const updatedUser = {
                    ...prev,
                    activeAvatar: updatedAvatar
                };
                localStorage.setItem('dirty_user_info', JSON.stringify(updatedUser));
                return updatedUser;
            });

            let finalMessage = result.success ? "Ação concluída com sucesso!" : "A ação falhou!";

            // Load and show message
            if (action.textFile) {
                try {
                    const response = await fetch(`/actions/descriptions/${action.textFile}`);
                    if (response.ok) {
                        const messages = await response.json();
                        const pool = result.success ? messages.success : messages.failure;
                        if (pool && pool.length > 0) {
                            finalMessage = pool[Math.floor(Math.random() * pool.length)];
                        }
                    }
                } catch (msgError) {
                    console.error("Failed to load action message", msgError);
                }
            }

            // Get variations
            const variations = result.variations || (oldAvatar ? {
                experience: updatedAvatar.experience - oldAvatar.experience,
                life: updatedAvatar.life - oldAvatar.life,
                stamina: updatedAvatar.stamina - oldAvatar.stamina,
                money: updatedAvatar.money - oldAvatar.money,
            } : null);

            // Check if user was sent to timeout (hospital or jail) and trigger redirect
            if (updatedAvatar.timeoutType && updatedAvatar.timeout) {
                if (timeoutRedirectCallback) {
                    timeoutRedirectCallback();
                }
            }

            router.refresh();
            return {
                success: result.success,
                message: finalMessage,
                timesExecuted: result.timesExecuted,
                variations
            };
        } catch (e: any) {
            console.error(e);
            return { success: false, message: e.message || "Erro ao realizar ação" };
        }
    };

    const refreshUser = (updates: Partial<User>) => {
        setUser(prev => {
            const base = prev || {} as User;
            const updated = { ...base, ...updates };
            localStorage.setItem('dirty_user_info', JSON.stringify(updated));
            return updated;
        });
        router.refresh();
    }

    const setOnTimeoutRedirect = (callback: () => void) => {
        setTimeoutRedirectCallback(() => callback);
    }

    return (
        <GameContext.Provider value={{
            user,
            isLoading,
            login,
            logout,
            performAction,
            refreshUser,
            actionCount,
            setActionCount,
            onTimeoutRedirect: timeoutRedirectCallback,
            setOnTimeoutRedirect
        }}>
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
