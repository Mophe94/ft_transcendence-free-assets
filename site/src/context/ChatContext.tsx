import { createContext } from "react";
import type { Socket } from "socket.io-client";

export interface Message {
    time: Date;
    username: string;
    text: string;
}

export interface Chat {
    socket: Socket | null;
    messages: Array<Message>;
    isConnected: boolean;
    sendMessage: (text: string) => Promise<void>;
}

export const ChatContext = createContext<Chat | null>(null);

