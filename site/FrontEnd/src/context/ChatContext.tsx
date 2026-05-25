import { createContext } from "react";

export interface Message {
    time: Date;
    username: string;
    text: string;
}

export interface Chat {
    user: string;
    messages: Array<Message>;
    sendMessage: (text: string) => Promise<void>;
}

export const ChatContext = createContext<Chat | null>(null);

