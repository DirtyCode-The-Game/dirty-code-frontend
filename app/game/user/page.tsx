'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Progress, Textarea } from "@heroui/react";
import { api } from '@/services/api';
import Image from 'next/image';
import { useGame } from "@/context/GameContext";
import { User, Avatar } from '@/services/api';
const PlusIcon = ({ size = 24, strokeWidth = 2, ...props }: any) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
    </svg>
);

const AVATAR_OPTIONS = [
    '/avatars/avatar_1.png',
    '/avatars/avatar_2.png',
    '/avatars/avatar_3.png',
    '/logo.jpeg',
];

type StatKey = 'intelligence' | 'charisma' | 'strength' | 'stealth';

interface Stats {
    intelligence: number;
    charisma: number;
    strength: number;
    stealth: number;
}

export default function AvatarEdit() {
    const router = useRouter();
    const { user, refreshUser } = useGame();

    // UI State
    const [name, setName] = useState('');
    const [story, setStory] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
    const [stats, setStats] = useState<Stats>({
        intelligence: 0,
        charisma: 0,
        strength: 0,
        stealth: 0
    });
    const [availablePoints, setAvailablePoints] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load data from context
    useEffect(() => {
        const fetchInitialData = async () => {
            if (user && user.activeAvatar && !isInitialized) {
                const avatar = user.activeAvatar;
                setName(avatar.name || user.name || '');
                setStory(avatar.story || '');
                setSelectedAvatar(avatar.picture || AVATAR_OPTIONS[0]);

                setStats({
                    intelligence: avatar.intelligence || 0,
                    charisma: avatar.charisma || 0,
                    strength: avatar.strength || 0,
                    stealth: avatar.stealth || 0
                });

                setAvailablePoints(avatar.availablePoints || 0);
                setIsInitialized(true);
            } else if (user && !user.activeAvatar && !isInitialized) {
                // New user defaults
                if (user.name) setName(user.name);

                // Fetch default story from histories.json
                try {
                    const response = await fetch('/avatars/histories.json');
                    const data = await response.json();
                    if (data.stories && data.stories.length > 0) {
                        const randomStory = data.stories[Math.floor(Math.random() * data.stories.length)];
                        setStory(randomStory);
                    }
                } catch (error) {
                    console.error('Error loading default stories:', error);
                }

                setIsInitialized(true);
            }
        };

        fetchInitialData();
    }, [user, isInitialized]);

    const handleStatIncrease = (stat: StatKey) => {
        if (availablePoints > 0) {
            setStats(prev => ({
                ...prev,
                [stat]: prev[stat] + 1
            }));
            setAvailablePoints(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        if (!name.trim()) return;

        setIsLoading(true);
        try {
            const payload: any = {
                name,
                story,
                picture: selectedAvatar
            };

            let newAvatar: Avatar;

            if (user?.activeAvatar) {
                payload.intelligence = stats.intelligence;
                payload.charisma = stats.charisma;
                payload.strength = stats.strength;
                payload.stealth = stats.stealth;

                newAvatar = await api.updateAvatar(payload);
            } else {
                newAvatar = await api.createAvatar(payload);
            }

            refreshUser({ activeAvatar: newAvatar });

            router.push('/game');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to save profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2 min-h-screen pb-10">
            <div className="container mx-auto lg:px-8 space-y-8">
                <div className="min-h-96 bg-black/50 border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden backdrop-blur-sm">

                    {/* Header */}
                    <div className="flex flex-col gap-1 mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            Perfil
                        </h1>
                        <p className="text-gray-400 text-sm">
                            {user?.activeAvatar ? "Customize seu personagem e distribua seus pontos." : "Crie seu personagem para começar."}
                        </p>
                    </div>

                    {/* Name & Story Input */}
                    <div className="max-w-md space-y-4">
                        <Input
                            label="Nome do Personagem"
                            placeholder="Como você quer ser chamado?"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            variant="bordered"
                            isDisabled={!!user?.activeAvatar}
                            classNames={{
                                inputWrapper: "bg-white/5 border-white/10 hover:border-white/20 focus-within:border-primary/50 h-12",
                                label: "text-gray-400 font-medium",
                                input: "text-white"
                            }}
                        />
                        <Textarea
                            label="Conte um pouco sobre você..."
                            placeholder="Conte um pouco sobre sua trajetória..."
                            value={story}
                            onChange={(e) => setStory(e.target.value.slice(0, 200))}
                            variant="bordered"
                            minRows={4}
                            description={`${story.length}/200 caracteres`}
                            classNames={{
                                inputWrapper: "bg-white/5 border-white/10 hover:border-white/20 focus-within:border-primary/50",
                                label: "text-gray-400 font-medium",
                                input: "text-white resize-none",
                                description: "text-gray-500 text-right"
                            }}
                        />
                    </div>

                    {/* Avatar Selection */}
                    <div className="mt-8">
                        <h2 className="text-xl font-bold mb-4 text-gray-200">Avatar</h2>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {AVATAR_OPTIONS.map((src, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedAvatar(src)}
                                    disabled={!!user?.activeAvatar}
                                    className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 group ${selectedAvatar === src
                                        ? 'border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] scale-105'
                                        : 'border-white/10 opacity-60 hover:opacity-100 hover:scale-105'
                                        } ${user?.activeAvatar ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    <Image
                                        src={src}
                                        alt={`Avatar ${idx + 1}`}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {selectedAvatar === src && (
                                        <div className="absolute inset-0 bg-primary/20" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="mt-10">
                        <div className="flex justify-between items-end mb-6">
                            <h2 className="text-xl font-bold text-gray-200">Atributos</h2>
                            <div className={`px-4 py-2 bg-primary/20 border border-primary/50 rounded-lg ${availablePoints > 0 ? "animate-pulse" : "opacity-50"}`}>
                                <span className="text-sm font-bold text-primary">
                                    Pontos Disponíveis: {availablePoints}
                                </span>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                { key: 'intelligence' as StatKey, label: 'Inteligência', color: "primary" },
                                { key: 'charisma' as StatKey, label: 'Carisma', color: "secondary" },
                                { key: 'strength' as StatKey, label: 'Força', color: "warning" },
                                { key: 'stealth' as StatKey, label: 'Furtividade', color: "danger" }
                            ].map((stat) => (
                                <div key={stat.key} className="bg-white/5 p-5 rounded-2xl border border-white/5 relative group hover:border-white/10 transition-colors">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm uppercase tracking-wider font-semibold text-gray-400 group-hover:text-gray-200 transition-colors">
                                            {stat.label}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-xl text-white font-bold">
                                                {stats[stat.key]}
                                            </span>

                                            {availablePoints > 0 && (
                                                <button
                                                    onClick={() => handleStatIncrease(stat.key)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/20 text-primary hover:bg-primary hover:text-black transition-all active:scale-95"
                                                    title="Aumentar atributo"
                                                >
                                                    <PlusIcon size={16} strokeWidth={3} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <Progress
                                        value={stats[stat.key]} // Assume max is 100 or relative? For visualization just value.
                                        color={stat.color as any}
                                        size="sm"
                                        maxValue={100} // Assuming 100 is max visualization cap
                                        classNames={{
                                            track: "bg-black/40",
                                            indicator: "transition-all duration-500 ease-out"
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-12 flex justify-end">
                        <Button
                            color="primary"
                            size="lg"
                            className="font-bold text-black shadow-lg shadow-primary/20 w-full sm:w-auto min-w-[200px]"
                            isLoading={isLoading}
                            onPress={handleSubmit}
                            isDisabled={!name}
                        >
                            {user?.activeAvatar ? "Salvar Alterações" : "Criar Personagem"}
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
}