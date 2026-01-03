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
        // ... (Action definition omitted for brevity, keeping existing hardcoded action for now as it wasn't requested to change)
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

        // Helper to get current stats
        const currentStamina = user.activeAvatar?.stamina ?? 0;
        const currentMoney = user.activeAvatar?.money ?? 0;
        // Karma/Reputation logic needs review, assuming it might be 'karma' or 'streetIntelligence' on avatar. 
        // For now, defaulting to 0 as 'karma' is removed from basic User interface.
        const currentKarma = 0;

        if (action.energyCost > 0 && currentStamina < action.energyCost) {
            alert("Você está exausto! Recupere energias na Vida Noturna.");
            return;
        }

        if (action.moneyReward < 0 && currentMoney < Math.abs(action.moneyReward)) {
            alert("Fundos insuficientes.");
            return;
        }

        try {
            const result = await api.performAction(actionId);
            if (result.success && result.rewards && result.rewards.activeAvatar) {
                // Calculate new values
                const rewardAvatar = result.rewards.activeAvatar as any; // Cast for ease since we returned any in API

                const newStamina = Math.min(100, Math.max(0, currentStamina + (rewardAvatar.stamina || 0)));
                const newMoney = currentMoney + (rewardAvatar.money || 0);

                // Note: api.performAction returns generic rewards. We need to map them. 
                // Currently mock api returns { stamina, money, karma }.

                let newUser = { ...user };

                if (newUser.activeAvatar) {
                    newUser.activeAvatar = {
                        ...newUser.activeAvatar,
                        stamina: newStamina,
                        money: newMoney,
                        // Update other stats if rewards exist
                    };
                }

                setUser(newUser);
                localStorage.setItem('dirty_user', JSON.stringify(newUser));
            } else {
                // Handle failure (e.g. only energy cost)
                const rewardAvatar = result.rewards?.activeAvatar as any || {};
                const newStamina = Math.min(100, Math.max(0, currentStamina + (rewardAvatar.stamina || 0)));

                let newUser = { ...user };
                if (newUser.activeAvatar) {
                    newUser.activeAvatar = {
                        ...newUser.activeAvatar,
                        stamina: newStamina
                    };
                }

                setUser(newUser);
                localStorage.setItem('dirty_user', JSON.stringify(newUser));
                alert(result.message);
            }
        } catch (e) {
            console.error(e);
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
