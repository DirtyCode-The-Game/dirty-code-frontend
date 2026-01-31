'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Input, 
    Button, 
    Textarea, 
    Card, 
    CardBody, 
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody,
    ModalFooter 
} from "@heroui/react";

import { api, Avatar } from '@/services/api';
import { useGame } from "@/context/GameContext";

const AVATAR_OPTIONS: { src: string; alt: string }[] = [
  {
    src: "/avatars/avatar_1.webp",
    alt: "Programador jovem sorrindo com óculos e fones de ouvido em um setup de monitor triplo",
  },
  {
    src: "/avatars/avatar_2.webp",
    alt: "Hacker misterioso com capuz preto fumando em frente a telas de código verde",
  },
  {
    src: "/avatars/avatar_3.webp",
    alt: "Mulher programadora com cabelos cacheados e óculos em um ambiente de escritório técnico",
  },
  {
    src: "/avatars/avatar_4.webp",
    alt: "Pessoa hacker com estilo cyberpunk, tatuagens no pescoço e luzes neon roxas",
  },
  {
    src: "/avatars/avatar_5.webp",
    alt: "Programadora focada em seu computador em um ambiente aconchegante com um gato",
  },
  {
    src: "/avatars/avatar_6.webp",
    alt: "Homem com barba, óculos e correntes de ouro fumando um charuto em um setup de gamer",
  },
  {
    src: "/avatars/avatar_7.webp",
    alt: "Hacker com cabelo rosa e fones de ouvido neon operando em um centro de comando",
  },
  {
    src: "/avatars/avatar_8.webp",
    alt: "Hacker mascarado com capuz em um ambiente de alta tecnologia com luzes neon azul e roxa",
  },
  {
    src: "/avatars/avatar_9.webp",
    alt: "Programador idoso experiente com barba branca e óculos trabalhando em código complexo",
  },
  {
    src: "/avatars/avatar_10.webp",
    alt: "Jovem programadora com óculos de aro de tartaruga trabalhando à noite com uma caneca de café",
  },
];

interface OnboardingModalProps {
    isOpen: boolean;
    onComplete: () => void;
}

export function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
    const { user, refreshUser, syncUserWithBackend } = useGame();

    // Form states
    const [currentStep, setCurrentStep] = useState(0);
    const [name, setName] = useState('');
    const [story, setStory] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]?.src || '');
    const [isLoading, setIsLoading] = useState(false);
    const [nameError, setNameError] = useState('');
    const [isCheckingName, setIsCheckingName] = useState(false);
    const [nameAvailable, setNameAvailable] = useState(true);

    useEffect(() => {
        if (user && !user.activeAvatar) {
            if (user.name) {
                setName(user.name);
                checkNameAvailability(user.name);
            }

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
    }, [user, isOpen]);

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
        if (!name.trim() || isLoading) return;

        setIsLoading(true);
        try {
            const payload = {
                name,
                story,
                picture: selectedAvatar
            };

            const newAvatar: Avatar = await api.createAvatar(payload);
            
            if (newAvatar && newAvatar.id) {
                refreshUser({ activeAvatar: newAvatar });
                await syncUserWithBackend();
                onComplete();
            } else {
                setIsLoading(false);
                throw new Error("O servidor não retornou os dados do avatar criado.");
            }
        } catch (error: any) {
            console.error(error);
            alert("Falha ao criar personagem: " + (error.message || "Erro desconhecido"));
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
        {
            title: "Bem-vindo ao Dirty Code!",
            content: (
                <div className="space-y-8 text-center flex flex-col justify-center h-full">
                    <div className="relative w-32 h-32 mx-auto">
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse"></div>
                        <Image
                            src="/logo.webp"
                            alt="Dirty Code Logo"
                            fill
                            className="object-contain relative z-10"
                        />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                            Dirty Code
                        </h2>
                        <p className="text-primary font-mono font-bold tracking-widest text-sm italic">
                            &lt; THE GAME /&gt;
                        </p>
                    </div>
                    <p className="text-lg text-gray-400 max-w-md mx-auto leading-relaxed">
                        Prove que você é o programador mais sujo de todos.
                    </p>
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        <Card className="bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group">
                            <CardBody className="p-4 text-center space-y-2">
                                <div className="text-3xl group-hover:scale-110 transition-transform">💼</div>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 group-hover:text-primary">Trabalhe</p>
                            </CardBody>
                        </Card>
                        <Card className="bg-white/5 border border-white/10 hover:border-green-500/50 transition-colors group">
                            <CardBody className="p-4 text-center space-y-2">
                                <div className="text-3xl group-hover:scale-110 transition-transform">💻</div>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 group-hover:text-green-500">Hackeie</p>
                            </CardBody>
                        </Card>
                        <Card className="bg-white/5 border border-white/10 hover:border-orange-500/50 transition-colors group">
                            <CardBody className="p-4 text-center space-y-2">
                                <div className="text-3xl group-hover:scale-110 transition-transform">📚</div>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 group-hover:text-orange-500">Treine</p>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            )
        },
        {
            title: "Como Jogar",
            content: (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-center">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4 hover:bg-white/10 transition-all flex flex-col justify-center min-h-[200px]">
                        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-2xl">⚡</div>
                        <h3 className="font-black uppercase tracking-wider text-primary">
                            Stamina e Vida
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            A <span className="text-white font-bold">Stamina</span> é seu combustível para ações. A <span className="text-white font-bold">Vida (HP)</span> é sua saúde. Se o HP chegar a zero, você vai direto para o hospital.
                        </p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4 hover:bg-white/10 transition-all flex flex-col justify-center min-h-[200px]">
                        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-2xl">💰</div>
                        <h3 className="font-black uppercase tracking-wider text-green-500">
                            Dinheiro e XP
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Trabalhe para ganhar <span className="text-white font-bold">R$</span> e realize ações para ganhar <span className="text-white font-bold">XP</span>. Suba de nível para ganhar pontos de atributos e se tornar o dev supremo.
                        </p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4 hover:bg-white/10 transition-all flex flex-col justify-center min-h-[200px]">
                        <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-2xl">⚠️</div>
                        <h3 className="font-black uppercase tracking-wider text-red-500">
                            Riscos Reais
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Hackear e outras ações ilegais podem te levar para a <span className="text-white font-bold">Cadeia</span>. Escolha seus jobs com sabedoria, o risco é proporcional ao lucro.
                        </p>
                    </div>
                </div>
            )
        },
        {
            title: "Crie Seu Avatar",
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                    <div className="space-y-6 flex flex-col justify-center">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Identidade do Dev</label>
                            <Input
                                placeholder="Seu nome de guerra no código..."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                variant="bordered"
                                size="lg"
                                isRequired
                                isInvalid={!nameAvailable}
                                errorMessage={nameError}
                                className="font-bold"
                                classNames={{
                                    input: "selection:bg-primary/30 focus:outline-none",
                                    inputWrapper: "focus-within:ring-0 focus-within:border-primary/50"
                                }}
                                endContent={
                                    isCheckingName && (
                                        <div className="flex items-center">
                                            <span className="w-5 h-5 border-3 border-primary border-t-transparent rounded-full animate-spin"></span>
                                        </div>
                                    )
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Bio / Lore (opcional)</label>
                            <Textarea
                                placeholder="Conte como você acabou nesse submundo..."
                                value={story}
                                onChange={(e) => setStory(e.target.value.slice(0, 200))}
                                variant="bordered"
                                size="lg"
                                minRows={4}
                                description={`${story.length}/200`}
                                classNames={{
                                    input: "selection:bg-primary/30 focus:outline-none",
                                    inputWrapper: "focus-within:ring-0 focus-within:border-primary/50"
                                }}
                            />
                        </div>
                    </div>

                    <div className="space-y-4 flex flex-col justify-center">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Escolha seu Visual</label>
                        <div className="grid grid-cols-4 gap-2">
                            {AVATAR_OPTIONS.map((avatar) => (
                                <button
                                    key={avatar.src}
                                    onClick={() => setSelectedAvatar(avatar.src)}
                                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 group ${selectedAvatar === avatar.src
                                        ? 'border-primary ring-2 ring-primary/50 ring-offset-1 ring-offset-black scale-105 z-10'
                                        : 'border-white/5 opacity-40 hover:opacity-100 hover:border-white/20'
                                        }`}
                                >
                                    <Image
                                        src={avatar.src}
                                        alt={avatar.alt}
                                        fill
                                        className={`object-cover transition-transform duration-500 ${selectedAvatar === avatar.src ? 'scale-110' : 'group-hover:scale-110'}`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Tudo Pronto!",
            content: (
                <div className="text-center space-y-8 flex flex-col justify-center h-full">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full scale-150 animate-pulse"></div>
                        <div className="relative w-48 h-48 mx-auto rounded-[32px] overflow-hidden border-4 border-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)]">
                            <Image
                                src={selectedAvatar}
                                alt="Your Avatar"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-2 rounded-full font-black uppercase tracking-tighter shadow-xl">
                            LVL 1
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black uppercase tracking-tight text-white">
                            {name}
                        </h2>
                        <p className="text-gray-400 font-medium max-w-sm mx-auto">
                            Sua jornada começa agora. O código espera por ninguém.
                        </p>
                    </div>

                    <div className="max-w-md mx-auto bg-primary/10 border border-primary/20 p-6 rounded-2xl backdrop-blur-sm">
                        <p className="text-sm text-gray-300 leading-relaxed italic">
                            &quot;{story || "Nascido entre bugs e café frio, pronto para deixar sua marca no repositório da vida."}&quot;
                        </p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <Modal 
            isOpen={isOpen} 
            onOpenChange={() => {}} // Impede fechar clicando fora
            hideCloseButton
            isDismissable={false}
            backdrop="blur"
            size="5xl"
            radius="lg"
            classNames={{
                base: "dark text-foreground bg-zinc-950/90 border border-white/10 shadow-2xl focus:outline-none",
                wrapper: "z-[9999] focus:outline-none",
                backdrop: "bg-black/80 backdrop-blur-md",
            }}
            scrollBehavior="inside"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-center border-b border-white/10 py-4">
                            <div className="flex justify-center gap-2 mb-2">
                                {steps.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1.5 w-12 rounded-full transition-all duration-500 ${idx <= currentStep ? 'bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]' : 'bg-white/10'}`}
                                    />
                                ))}
                            </div>
                            <h1 className="text-2xl font-black uppercase tracking-widest text-white">{steps[currentStep].title}</h1>
                        </ModalHeader>
                        <ModalBody className="p-0 relative min-h-[620px] max-h-[620px] h-[620px] overflow-hidden bg-transparent">
                            {isLoading && (
                                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
                                    <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]" />
                                    <p className="mt-6 text-xl font-black uppercase tracking-widest text-white animate-pulse">Compilando seu destino...</p>
                                </div>
                            )}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="min-h-[620px] max-h-[620px] h-[620px] w-full flex flex-col justify-center px-8 py-8"
                                >
                                    <div className="h-full w-full flex flex-col justify-center">
                                        {steps[currentStep].content}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </ModalBody>
                        <ModalFooter className="border-t border-white/10 py-6 px-8 bg-transparent">
                            <Button
                                variant="bordered"
                                onPress={prevStep}
                                isDisabled={currentStep === 0 || isLoading}
                                size="lg"
                                className="font-bold border-white/10 hover:bg-white/5"
                            >
                                Anterior
                            </Button>
                            <div className="flex-1" />
                            {currentStep < steps.length - 1 ? (
                                <Button
                                    color="primary"
                                    onPress={nextStep}
                                    isDisabled={(currentStep === 2 && (!name.trim() || !nameAvailable || isCheckingName || name.length < 3)) || isLoading}
                                    size="lg"
                                    className="font-black uppercase tracking-tighter px-10 shadow-lg shadow-primary/20"
                                >
                                    Próximo
                                </Button>
                            ) : (
                                <Button
                                    color="primary"
                                    className="font-black uppercase tracking-tighter px-10 shadow-lg shadow-primary/20"
                                    isLoading={isLoading}
                                    onPress={handleSubmit}
                                    isDisabled={!name.trim() || !nameAvailable || isCheckingName || name.length < 3}
                                    size="lg"
                                >
                                    🎮 Começar Jogo
                                </Button>
                            )}
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
