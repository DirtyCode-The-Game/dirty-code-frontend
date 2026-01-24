'use client'

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api, GameAction, GameActionType, User } from '@/services/api';
import { useRouter } from 'next/navigation';
import { chatService, ChatMessage } from '@/services/chatService';


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
    actionCounts: Record<string, number>;
    setActionCountForCategory: (category: string, count: number) => void;
    onTimeoutRedirect?: () => void;
    setOnTimeoutRedirect: (callback: () => void) => void;
    chatMessages: ChatMessage[];
    chatToken: string | null;
    cachedActions: Record<GameActionType, GameAction[]>;
    fetchActions: (type: GameActionType, silent?: boolean) => Promise<void>;
    avatarCache: Record<string, any>;
    getAvatarData: (avatarId: string, forceRefresh?: boolean) => Promise<any>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [actionCounts, setActionCounts] = useState<Record<string, number>>({});
    const [timeoutRedirectCallback, setTimeoutRedirectCallback] = useState<(() => void) | undefined>(undefined);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatToken, setChatToken] = useState<string | null>(null);
    const [cachedActions, setCachedActions] = useState<Record<GameActionType, GameAction[]>>({} as any);
    const [avatarCache, setAvatarCache] = useState<Record<string, any>>({});
    const router = useRouter();

    const getAvatarData = async (avatarId: string, forceRefresh: boolean = false) => {
        // Se já existe no cache e não for um forceRefresh, retornamos
        const cached = avatarCache[avatarId];
        
        const fetchAndCache = async () => {
            try {
                const response = await fetch(`/api/avatar/${avatarId}`);
                if (response.ok) {
                    const data = await response.json();
                    setAvatarCache(prev => ({ ...prev, [avatarId]: data }));
                    return data;
                }
            } catch (error) {
                console.error("Erro ao buscar dados do avatar:", error);
            }
            return null;
        };

        if (cached) {
            if (forceRefresh) {
                // Atualização transparente em background
                fetchAndCache();
            }
            return cached;
        }

        return await fetchAndCache();
    };

    const fetchActions = async (type: GameActionType, silent: boolean = false) => {
        if (!user?.activeAvatar) return;

        // Se já temos dados e não é um fetch silencioso, 
        // poderíamos pular o loading se quisermos navegação instantânea.
        // Mas o componente já trata isso usando o comprimento do array.
        if (!silent) setIsLoading(true);
        try {
            const data = await api.getActionsByType(type);
            setCachedActions(prev => ({
                ...prev,
                [type]: data
            }));
        } catch (error) {
            console.error(`Erro ao buscar ações do tipo ${type}:`, error);
        } finally {
            if (!silent) setIsLoading(false);
        }
    };

    const updateAllActions = async () => {
        if (!user?.activeAvatar) return;
        
        // Atualiza apenas os tipos que já foram carregados pelo menos uma vez
        const activeTypes = Object.keys(cachedActions) as GameActionType[];
        for (const type of activeTypes) {
            await fetchActions(type, true);
        }
    };

    useEffect(() => {
        if (!user) return;

        const connectChat = async () => {
            try {
                const response = await fetch('/api/auth/token');
                if (response.ok) {
                    const data = await response.json();
                    setChatToken(data.token);
                    chatService.connect((msg) => {
                        setChatMessages((prev) => {
                            if (Array.isArray(msg)) {
                                const newMessages = msg.filter(m => !prev.some(p => p.message === m.message && p.avatarName === m.avatarName));
                                return [...prev, ...newMessages];
                            }
                            if (prev.some(m => m.message === msg.message && m.avatarName === msg.avatarName)) return prev;
                            return [...prev, msg];
                        });
                    }, data.token);
                }
            } catch (error) {
                console.error("Erro ao conectar no chat", error);
            }
        };

        connectChat();

        return () => {
            chatService.disconnect();
        };
    }, [user?.activeAvatar?.id]);

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

    useEffect(() => {
        if (!user?.activeAvatar) return;

        const POLL_INTERVAL = 30000;

        const pollTimer = setInterval(async () => {
            try {
                const response = await fetch('/api/user/me');
                if (response.ok) {
                    const serverUser = await response.json();
                    setUser(serverUser);
                    localStorage.setItem('dirty_user_info', JSON.stringify(serverUser));
                }
            } catch (error) {
                console.error('Failed to sync with backend:', error);
            }
        }, POLL_INTERVAL);

        return () => clearInterval(pollTimer);
    }, [user?.activeAvatar?.id]);

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
            window.location.href = process.env.LOGIN_FULL_URL || 'http://127.0.0.1:8080/dirty-code/v1/gmail/auth-page';
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

            // Atualiza ações em background após realizar uma ação (ex: novos jobs podem ter surgido)
            updateAllActions();

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
    
    const setActionCountForCategory = (category: string, count: number) => {
        setActionCounts(prev => ({
            ...prev,
            [category]: count
        }));
    };

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
            actionCounts,
            setActionCountForCategory,
            onTimeoutRedirect: timeoutRedirectCallback,
            setOnTimeoutRedirect,
            chatMessages,
            chatToken,
            cachedActions,
            fetchActions,
            avatarCache,
            getAvatarData
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
