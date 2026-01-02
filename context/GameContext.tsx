'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, User } from '../services/api';
import { GAME_ACTIONS } from '../services/game_data';
import { useRouter } from 'next/navigation';


interface GameContextType {
    user: User | null;
    isLoading: boolean;
    login: () => Promise<void>;
    logout: () => void;
    performFakeAction: (actionName: string) => Promise<void>;
    refreshUser: (updates: Partial<User>) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);



export function GameProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Load user from local storage for optimistic UI, but trust Server sync for auth
        const storedUser = localStorage.getItem('dirty_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
            }
        }
    }, []);

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
        localStorage.removeItem('dirty_user'); // Token is httpOnly now, no need to remove from js-cookie
        router.push('/');
        setIsLoading(false);
    };

    const login = async () => {
        setIsLoading(true);
        try {
            // Redirect to Backend Login
            const target = process.env.LOGIN_FULL_URL || 'http://localhost:8080/login';
            window.location.href = target;
        } catch (error) {
            console.error("Login redirect failed", error);
            setIsLoading(false);
        }
    };



    const performFakeAction = async (actionId: string) => {
        const action = GAME_ACTIONS[actionId];
        if (!user || !action) {
            console.error("Action not found or user not logged in.");
            return;
        }

        // Check energy
        if (action.energyCost > 0 && user.energy < action.energyCost) {
            alert("Você está exausto! Recupere energias na Vida Noturna.");
            return;
        }

        // Check money (if it's a cost)
        if (action.moneyReward < 0 && user.money < Math.abs(action.moneyReward)) {
            alert("Fundos insuficientes.");
            return;
        }

        // Optimistic update (optional, skipping for simplicity/safety to match API)
        // calling API
        try {
            const result = await api.performAction(actionId);
            if (result.success && result.rewards) {
                const newStats = {
                    ...user,
                    energy: Math.min(100, Math.max(0, user.energy + (result.rewards.energy || 0))),
                    money: user.money + (result.rewards.money || 0),
                    reputation: user.reputation + (result.rewards.reputation || 0),
                };
                setUser(newStats);
                localStorage.setItem('dirty_user', JSON.stringify(newStats));

                // Simple interaction feedback can go here (Toast)
            } else {
                // Failure handling
                if (result.rewards) {
                    const newStats = {
                        ...user,
                        energy: Math.min(100, Math.max(0, user.energy + (result.rewards.energy || 0))),
                    };
                    setUser(newStats);
                    localStorage.setItem('dirty_user', JSON.stringify(newStats));
                }
                alert(result.message);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const refreshUser = (updates: Partial<User>) => {
        if (!user) return;
        const updated = { ...user, ...updates };
        setUser(updated);
        localStorage.setItem('dirty_user', JSON.stringify(updated));
    }

    return (
        <GameContext.Provider value={{ user, isLoading, login, logout, performFakeAction, refreshUser }}>
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
