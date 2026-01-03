import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface ChatMessage {
    avatarName: string;
    message: string;
    id?: string;
    timestamp?: string;
}

export type MessageCallback = (message: ChatMessage | ChatMessage[]) => void;

class ChatWebSocketService {
    private client: Client | null = null;
    private onMessageReceived: MessageCallback | null = null;
    private readonly baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/dirty-code';

    connect(onMessageReceived: MessageCallback, token: string) {
        if (this.client?.active) return;
        this.onMessageReceived = onMessageReceived;

        const socket = new SockJS(`${this.baseUrl}/ws-chat`);
        this.client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            debug: (str) => {
                console.log('STOMP: ' + str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        this.client.onConnect = (frame) => {
            console.log('Connected: ' + frame);
            
            // Subscrever para mensagens em tempo real
            this.client?.subscribe('/topic/global-messages', (message) => {
                if (message.body && this.onMessageReceived) {
                    const parsedMessage = JSON.parse(message.body);
                    this.onMessageReceived(parsedMessage);
                }
            });

            // Pedir mensagens iniciais via SubscribeMapping
            this.client?.subscribe('/app/global-messages', (message) => {
                if (message.body && this.onMessageReceived) {
                    const parsedMessages = JSON.parse(message.body);
                    this.onMessageReceived(parsedMessages);
                }
            });
        };

        this.client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };

        this.client.activate();
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
            this.onMessageReceived = null;
        }
    }

    async sendMessage(message: string, token: string) {
        try {
            const response = await fetch(`${this.baseUrl}/v1/chat/new-message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message }),
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to send message');
            }
            // O endpoint retorna void (201 Created), então não tentamos fazer .json() se não houver conteúdo
            if (response.status === 201 || response.status === 204) {
                return;
            }
            return await response.json();
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }
}

export const chatService = new ChatWebSocketService();
