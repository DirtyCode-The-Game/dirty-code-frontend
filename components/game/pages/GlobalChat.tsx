'use client'

import { useState, useEffect, useRef } from "react";
import { Button, Input, ScrollShadow } from "@heroui/react";
import { chatService, ChatMessage } from "@/services/chatService";
import { useGame } from "@/context/GameContext";

export function GlobalChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [lastSentTime, setLastSentTime] = useState<number>(0);
    const [cooldown, setCooldown] = useState(0);
    const [token, setToken] = useState<string | null>(null);
    const { user } = useGame();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await fetch('/api/auth/token');
                if (response.ok) {
                    const data = await response.json();
                    setToken(data.token);
                    chatService.connect((msg) => {
                        setMessages((prev) => {
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
                console.error("Erro ao buscar token", error);
            }
        };

        fetchToken();

        return () => {
            chatService.disconnect();
        };
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || isSending || !token || cooldown > 0) return;

        setIsSending(true);
        try {
            await chatService.sendMessage(newMessage, token);
            setNewMessage("");
            setLastSentTime(Date.now());
            setCooldown(15);
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
                    {messages.map((msg, idx) => (
                        <div key={idx} className="flex items-baseline gap-2 text-sm">
                            <span className={`font-mono font-bold whitespace-nowrap ${msg.avatarName === user?.name ? 'text-primary' : 'text-gray-500'}`}>
                                {msg.avatarName}:
                            </span>
                            <span className="text-gray-300 break-words">
                                {msg.message}
                            </span>
                            {msg.timestamp && (
                                <span className="text-[10px] text-gray-700 font-mono ml-auto">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            )}
                        </div>
                    ))}
                </ScrollShadow>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
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
