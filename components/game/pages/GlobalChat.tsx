'use client'

import { useState, useEffect, useRef } from "react";
import { Button, Input, ScrollShadow, Tooltip, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { chatService } from "@/services/chatService";
import { useGame } from "@/context/GameContext";
import { AvatarTooltipContent } from "../AvatarTooltipContent";
import EmojiPicker, { Theme } from 'emoji-picker-react';
import EmojiConvertor from 'emoji-js';

const emojiConvertor = new EmojiConvertor();
emojiConvertor.replace_mode = 'unified';
emojiConvertor.allow_native = true;

export function GlobalChat() {
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [lastSentTime, setLastSentTime] = useState<number>(0);
    const [cooldown, setCooldown] = useState(0);
    const [messageCount, setMessageCount] = useState(0);
    const { user, chatMessages: messages, chatToken: token } = useGame();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const onEmojiClick = (emojiData: any) => {
        setNewMessage(prev => prev + emojiData.emoji);
        setIsOpen(false);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (cooldown === 0 && messageCount >= 3) {
            // setMessageCount(0); // Removido daqui, pois agora é resetado no handleSendMessage ou no novo useEffect
        }
    }, [cooldown, messageCount]);

    useEffect(() => {
        // Se o usuário demorar mais de 30 segundos entre as mensagens, resetamos o contador de "sequência"
        if (messageCount > 0 && messageCount < 3 && cooldown === 0) {
            const idleTimeout = setTimeout(() => {
                setMessageCount(0);
            }, 30000);
            return () => clearTimeout(idleTimeout);
        }
    }, [messageCount, lastSentTime, cooldown]);

    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            // Se a última mensagem não for do usuário atual, resetamos a sequência dele
            if (lastMessage.avatarName !== user?.activeAvatar?.name) {
                setMessageCount(0);
            }
        }
    }, [messages, user?.activeAvatar?.name]);

    const handleMessageChange = (value: string) => {
        setNewMessage(value);
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || isSending || !token || cooldown > 0) return;

        setIsSending(true);
        try {
            const messageToProcess = newMessage.replace(/<3/g, '❤️');
            const messageWithEmojis = emojiConvertor.replace_emoticons(messageToProcess);
            await chatService.sendMessage(messageWithEmojis, token);
            setNewMessage("");
            setLastSentTime(Date.now());
            
            const nextCount = messageCount + 1;
            if (nextCount >= 3) {
                setCooldown(15);
                setMessageCount(0); // Resetar após atingir o limite
            } else {
                setMessageCount(nextCount);
            }
        } catch (error) {
            console.error("Erro ao enviar mensagem", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex flex-col h-[500px] md:h-[600px]">
            <div className="mb-6">
                <h1 className="text-4xl font-bold uppercase text-white mb-2">Helldit</h1>
                <p className="text-gray-400 text-lg border-l-2 border-primary pl-4">
                    O submundo da comunicação. Cuidado com o que você digita.
                </p>
            </div>

            <div className="flex-1 bg-zinc-950/50 rounded-xl border border-white/5 flex flex-col overflow-hidden">
                <ScrollShadow ref={scrollRef} className="flex-1 p-4 space-y-4">
                    {messages.length === 0 && (
                        <div className="h-full flex items-center justify-center text-gray-600 font-mono text-sm">
                            Nenhuma mensagem interceptada...
                        </div>
                    )}
                    {messages.map((msg, idx) => {
                        const showDateDivider = idx === 0 || messages[idx - 1].fullDate !== msg.fullDate;
                        
                        const formatDate = (dateStr?: string) => {
                            if (!dateStr) return "Arquivo Corrompido";
                            const [year, month, day] = dateStr.split('-');
                            const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                            const today = new Date();
                            const yesterday = new Date();
                            yesterday.setDate(today.getDate() - 1);

                            if (date.toDateString() === today.toDateString()) return "Hoje";
                            if (date.toDateString() === yesterday.toDateString()) return "Ontem";
                            
                            return date.toLocaleDateString('pt-BR');
                        };

                        return (
                            <div key={idx} className="space-y-4">
                                {showDateDivider && (
                                    <div className="flex items-center gap-4 my-2">
                                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                        <span className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.2em]">
                                            {formatDate(msg.fullDate)}
                                        </span>
                                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                    </div>
                                )}
                                <div className="flex items-baseline gap-2 text-sm">
                                    {msg.timestamp && (
                                        <span className="text-[10px] text-gray-700 font-mono">
                                            {msg.timestamp}
                                        </span>
                                    )}
                                    <Tooltip
                                        content={<AvatarTooltipContent avatarId={msg.avatarId} />}
                                        placement="right"
                                        delay={200}
                                        closeDelay={0}
                                        classNames={{
                                            content: "p-0 border-none bg-transparent shadow-none"
                                        }}
                                        shouldFlip={false}
                                    >
                                        <span
                                            className={`font-mono font-bold whitespace-nowrap cursor-pointer hover:underline ${msg.avatarName === user?.activeAvatar?.name ? 'text-primary' : 'text-gray-500'}`}
                                        >
                                            {msg.avatarName}:
                                        </span>
                                    </Tooltip>
                                    <span className="text-gray-300 break-words">
                                        {msg.message}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </ScrollShadow>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 flex gap-2 items-center">
                    <Popover isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)} placement="top-start">
                        <PopoverTrigger>
                            <Button 
                                isIconOnly 
                                variant="light" 
                                className="text-xl"
                                isDisabled={isSending || cooldown > 0}
                            >
                                😊
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 border-none">
                            <EmojiPicker 
                                theme={Theme.DARK} 
                                onEmojiClick={onEmojiClick}
                                lazyLoadEmojis={true}
                            />
                        </PopoverContent>
                    </Popover>
                    <Input
                        id="chat-input"
                        value={newMessage}
                        onChange={(e) => handleMessageChange(e.target.value)}
                        onKeyDown={(e: any) => {
                            if (e.key === ' ') {
                                e.stopPropagation();
                            }
                        }}
                        placeholder={cooldown > 0 ? `Aguarde ${cooldown}s...` : "Digite sua mensagem cifrada..."}
                        variant="bordered"
                        className="flex-1"
                        isDisabled={isSending || cooldown > 0}
                        autoComplete="off"
                    />
                    <Button 
                        color="primary" 
                        type="submit" 
                        isLoading={isSending}
                        isDisabled={cooldown > 0}
                        className="font-bold uppercase"
                    >
                        {cooldown > 0 ? `${cooldown}s` : "Enviar"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
