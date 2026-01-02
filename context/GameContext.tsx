'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, User } from '../services/api';
import { useRouter } from 'next/navigation';


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



    const performAction = async (actionId: string) => {
        const action = {
            id: actionId,
            title: "Ação",
            risk: 50,
            moneyReward: 100,
            energyCost: 10,
            reputationReward: 5,
        }
        if (!user || !action) {
            console.error("Action not found or user not logged in.");
            return;
        }

        if (action.energyCost > 0 && user.stamina < action.energyCost) {
            alert("Você está exausto! Recupere energias na Vida Noturna.");
            return;
        }

        if (action.moneyReward < 0 && user.money < Math.abs(action.moneyReward)) {
            alert("Fundos insuficientes.");
            return;
        }

        try {
            const result = await api.performAction(actionId);
            if (result.success && result.rewards) {
                const newStats = {
                    ...user,
                    stamina: Math.min(100, Math.max(0, user.stamina + (result.rewards.stamina || 0))),
                    money: user.money + (result.rewards.money || 0),
                    karma: user.karma + (result.rewards.karma || 0),
                };
                setUser(newStats);
                localStorage.setItem('dirty_user', JSON.stringify(newStats));
            } else {
                if (result.rewards) {
                    const newStats = {
                        ...user,
                        stamina: Math.min(100, Math.max(0, user.stamina + (result.rewards.stamina || 0))),
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
