'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Textarea, Card, CardBody } from "@heroui/react";
import { api } from '@/services/api';
import Image from 'next/image';
import { useGame } from "@/context/GameContext";
import { Avatar } from '@/services/api';

const AVATAR_OPTIONS = [
    '/avatars/avatar_1.png',
    '/avatars/avatar_2.png',
    '/avatars/avatar_3.png',
    '/logo.jpeg',
];

export default function OnboardingPage() {
    const router = useRouter();
    const { user, refreshUser } = useGame();

    // Form states
    const [currentStep, setCurrentStep] = useState(0);
    const [name, setName] = useState('');
    const [story, setStory] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [nameError, setNameError] = useState('');
    const [isCheckingName, setIsCheckingName] = useState(false);
    const [nameAvailable, setNameAvailable] = useState(true);

    // If user already has an avatar, redirect to game
    useEffect(() => {
        if (user?.activeAvatar) {
            console.log("Redirecting to game because user already has an avatar");
            router.replace('/game');
        }
    }, [user?.activeAvatar, router]);

    // Set initial data
    useEffect(() => {
        if (user && !user.activeAvatar) {
            if (user.name) {
                setName(user.name);
                checkNameAvailability(user.name);
            }

            // Fetch default story from histories.json
            const loadStory = async () => {
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
            };
            loadStory();
        }
    }, [user]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (name.trim() && name.length >= 3) {
                checkNameAvailability(name);
            } else {
                setNameError('');
                setNameAvailable(true);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [name]);

    const checkNameAvailability = async (nameToCheck: string) => {
        if (!nameToCheck.trim()) return;

        setIsCheckingName(true);
        setNameError('');
        try {
            const result = await api.checkNameAvailability(nameToCheck);
            setNameAvailable(result.available);

            if (!result.available) {
                // Load random satiric message
                const response = await fetch('/avatars/same_name.json');
                const data = await response.json();
                if (data.messages && data.messages.length > 0) {
                    const randomMsg = data.messages[Math.floor(Math.random() * data.messages.length)];
                    setNameError(randomMsg);
                } else {
                    setNameError('Este nome já está em uso.');
                }
            } else {
                setNameError('');
            }
        } catch (error) {
            console.error('Error checking name:', error);
        } finally {
            setIsCheckingName(false);
        }
    };

    const handleSubmit = async () => {
        if (!name.trim()) return;

        setIsLoading(true);
        try {
            const payload = {
                name,
                story,
                picture: selectedAvatar
            };

            const newAvatar: Avatar = await api.createAvatar(payload);
            refreshUser({ activeAvatar: newAvatar });

            // Pequeno delay para garantir atualização do contexto e cookies
            setTimeout(() => {
                router.replace('/game');
            }, 300);
        } catch (error) {
            console.error(error);
            alert("Falha ao criar personagem. Por favor, tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const nextStep = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const steps = [
        // Step 0: Welcome
        {
            title: "Bem-vindo ao Dirty Code!",
            content: (
                <div className="space-y-6 text-center max-w-2xl mx-auto">
                    <div className="w-32 h-32 mx-auto relative">
                        <Image
                            src="/logo.jpeg"
                            alt="Dirty Code Logo"
                            fill
                            className="object-cover rounded-2xl"
                        />
                    </div>
                    <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Dirty Code: The Game
                    </h2>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        Prepare-se para mergulhar no submundo da programação!
                        Aqui você vai trabalhar, hackear e sobreviver
                        em um universo onde cada linha de código conta.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 mt-8">
                        <Card className="bg-white/5 border border-primary/20">
                            <CardBody className="text-center p-4">
                                <div className="text-3xl mb-2">💼</div>
                                <h3 className="font-bold text-primary mb-1">Trabalhe</h3>
                                <p className="text-sm text-gray-400">Ganhe dinheiro honesto em projetos legítimos</p>
                            </CardBody>
                        </Card>
                        <Card className="bg-white/5 border border-green-500/20">
                            <CardBody className="text-center p-4">
                                <div className="text-3xl mb-2">💻</div>
                                <h3 className="font-bold text-green-400 mb-1">Hackeie</h3>
                                <p className="text-sm text-gray-400">Invada sistemas e assuma riscos</p>
                            </CardBody>
                        </Card>
                        <Card className="bg-white/5 border border-orange-500/20">
                            <CardBody className="text-center p-4">
                                <div className="text-3xl mb-2">📚</div>
                                <h3 className="font-bold text-orange-400 mb-1">Treine</h3>
                                <p className="text-sm text-gray-400">Aprimore suas habilidades constantemente</p>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            )
        },
        // Step 1: How to Play
        {
            title: "Como Jogar",
            content: (
                <div className="space-y-6 max-w-2xl mx-auto">
                    <div className="space-y-4">
                        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                            <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
                                <span className="text-2xl">⚡</span>
                                Stamina e Vida
                            </h3>
                            <p className="text-gray-300 text-sm">
                                Cada ação consome <span className="text-blue-400 font-semibold">Stamina</span>.
                                Ações de risco podem reduzir sua <span className="text-red-400 font-semibold">Vida (HP)</span>.
                                Se sua vida chegar a zero, você vai parar no hospital!
                            </p>
                        </div>

                        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                            <h3 className="font-bold text-green-400 mb-2 flex items-center gap-2">
                                <span className="text-2xl">💰</span>
                                Dinheiro e XP
                            </h3>
                            <p className="text-gray-300 text-sm">
                                Ganhe <span className="text-green-400 font-semibold">dinheiro</span> fazendo trabalhos e hackeando sistemas.
                                Acumule <span className="text-purple-400 font-semibold">experiência (XP)</span> para subir de nível
                                e desbloquear novos atributos!
                            </p>
                        </div>

                        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                            <h3 className="font-bold text-orange-400 mb-2 flex items-center gap-2">
                                <span className="text-2xl">📊</span>
                                Atributos
                            </h3>
                            <p className="text-gray-300 text-sm">
                                Seus atributos determinam seu sucesso:
                                <span className="text-primary font-semibold"> Inteligência</span>,
                                <span className="text-secondary font-semibold"> Carisma</span>,
                                <span className="text-warning font-semibold"> Força</span> e
                                <span className="text-danger font-semibold"> Furtividade</span>.
                                Distribua seus pontos com sabedoria!
                            </p>
                        </div>

                        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                            <h3 className="font-bold text-red-400 mb-2 flex items-center gap-2">
                                <span className="text-2xl">⚠️</span>
                                Riscos
                            </h3>
                            <p className="text-gray-300 text-sm">
                                Ações ilegais podem te levar para a <span className="text-orange-400 font-semibold">cadeia</span>.
                                Ações perigosas podem te mandar para o <span className="text-red-400 font-semibold">hospital</span>.
                                Escolha suas batalhas!
                            </p>
                        </div>
                    </div>
                </div>
            )
        },
        // Step 2: Avatar Creation
        {
            title: "Crie Seu Avatar",
            content: (
                <div className="space-y-6 max-w-md mx-auto">
                    <div className="text-center mb-6">
                        <p className="text-gray-400">
                            É hora de criar sua identidade no mundo do Dirty Code!
                        </p>
                    </div>

                    <Input
                        label="Nome do Personagem"
                        placeholder="Como você quer ser chamado?"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="bordered"
                        isRequired
                        isInvalid={!nameAvailable}
                        errorMessage={nameError}
                        endContent={
                            isCheckingName && (
                                <div className="flex items-center">
                                    <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                                </div>
                            )
                        }
                        classNames={{
                            inputWrapper: "bg-white/5 border-white/10 hover:border-white/20 focus-within:border-primary/50 h-12",
                            label: "text-gray-400 font-medium",
                            input: "text-white"
                        }}
                    />

                    <div>
                        <h3 className="text-lg font-bold mb-3 text-gray-200">Escolha seu Avatar</h3>
                        <div className="flex gap-4 justify-center flex-wrap">
                            {AVATAR_OPTIONS.map((src, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedAvatar(src)}
                                    className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 group ${selectedAvatar === src
                                        ? 'border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] scale-105'
                                        : 'border-white/10 opacity-60 hover:opacity-100 hover:scale-105'
                                        }`}
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

                    <Textarea
                        label="Conte um pouco sobre você..."
                        placeholder="Sua história no mundo da programação..."
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
            )
        },
        // Step 3: Ready to Start
        {
            title: "Tudo Pronto!",
            content: (
                <div className="space-y-6 text-center max-w-2xl mx-auto">
                    <div className="w-32 h-32 mx-auto relative rounded-2xl overflow-hidden border-4 border-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)]">
                        <Image
                            src={selectedAvatar}
                            alt="Your Avatar"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <h2 className="text-3xl font-bold text-primary">
                        Bem-vindo, {name}!
                    </h2>
                    <p className="text-lg text-gray-300">
                        Seu personagem está pronto para começar a jornada no mundo do Dirty Code.
                    </p>
                    {story && (
                        <div className="bg-white/5 p-6 rounded-xl border border-white/10 max-w-md mx-auto">
                            <p className="text-sm text-gray-400 italic">
                                &quot;{story}&quot;
                            </p>
                        </div>
                    )}
                    <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6 rounded-xl border border-primary/30">
                        <p className="text-gray-300">
                            🎮 Clique em <span className="font-bold text-primary">&quot;Começar Jogo&quot;</span> para entrar no jogo!
                        </p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col gap-2 min-h-screen pb-10">
            <div className="container mx-auto lg:px-8 space-y-8 py-8">
                <div className="min-h-[600px] bg-black/50 border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden backdrop-blur-sm">

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-2">
                            {steps.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`flex-1 h-2 mx-1 rounded-full transition-all duration-300 ${idx <= currentStep ? 'bg-primary' : 'bg-white/10'
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-center text-sm text-gray-400">
                            Passo {currentStep + 1} de {steps.length}
                        </p>
                    </div>

                    {/* Header */}
                    <div className="flex flex-col gap-1 mb-8 text-center">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            {steps[currentStep].title}
                        </h1>
                    </div>

                    {/* Content */}
                    <div className="mb-12">
                        {steps[currentStep].content}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mt-auto pt-8">
                        <Button
                            variant="flat"
                            onPress={prevStep}
                            isDisabled={currentStep === 0}
                            className="font-medium"
                        >
                            ← Anterior
                        </Button>

                        {currentStep < steps.length - 1 ? (
                            <Button
                                color="primary"
                                onPress={nextStep}
                                isDisabled={(currentStep === 2 && (!name.trim() || !nameAvailable || isCheckingName)) || (currentStep === 2 && name.length < 3)}
                                className="font-bold"
                            >
                                Próximo →
                            </Button>
                        ) : (
                            <Button
                                color="primary"
                                size="lg"
                                className="font-bold text-black shadow-lg shadow-primary/20"
                                isLoading={isLoading}
                                onPress={handleSubmit}
                                isDisabled={!name.trim() || !nameAvailable || isCheckingName || name.length < 3}
                            >
                                🎮 Começar Jogo
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
