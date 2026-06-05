import type React from "react";
import { ChatContext, type Chat, type Message } from "./ChatContext";
import { useState } from "react";
import { useAuth } from "./AuthContext";



export const ChatProvider = ({ children }: { children :React.ReactNode}) => {
    const {user} = useAuth();
    const [messages, setMessages] = useState<Array<Message>>([]);

    const sendMessage = async (text: string) =>
    {
        if (!user){ return; }
        const time = new Date();
        const newMessage = { username: user.username, time, text};

        setMessages([...messages, newMessage]);
    }


    if (!user) { return children }

    const chat: Chat = {user: user.username, messages, sendMessage};

    return (
        <ChatContext.Provider value= { chat }>
            {children}
        </ChatContext.Provider>
    )
} 