import type React from "react";
import { ChatContext, type Chat, type Message } from "./ChatContext";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { io, Socket } from "socket.io-client";



export const ChatProvider = ({ children }: { children :React.ReactNode}) => {
    const { user } = useAuth();
    const [isConnected, setIsConnectet] = useState<boolean>(false);
    const [ messages, setMessages ] = useState<Array<Message>>([]);

    const socketRef = useRef<Socket | null>(null);


    useEffect(() => {
        const socketInstance: Socket = io(`${import.meta.env.VITE_CHAT_SERVICE}`, {
            withCredentials: true,
            transports: ['websocket'],
        });

        socketInstance.on('connect', () => {
            console.log('Connected with id ', socketInstance.id);
            setIsConnectet(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('Connected with id ', socketInstance.id);
            setIsConnectet(false);
        });

        socketRef.current = socketInstance;

        return () => {
            socketInstance.disconnect();
            socketRef.current = null;
        }
    }, [])

    if (!user) { return children }
    const sendMessage = async (text: string) =>
    {
        if (!user){ return; }
        const time = new Date();
        const newMessage = { username: user.username, time, text};

        setMessages([...messages, newMessage]);
    }

    const chat: Chat = {user: user.username, messages, sendMessage};

    return (
        <ChatContext.Provider value= { chat }>
            {children}
        </ChatContext.Provider>
    )
} 