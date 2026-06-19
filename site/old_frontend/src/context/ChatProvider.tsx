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
        const ws = new WebSocket(`${import.meta.env.VITE_CHAT_SERVICE}`);

       ws.onopen = () => {
            console.log('Connexion WebSocket établie');
            ws.send(JSON.stringify({ event: 'message', data: {} }));
        };

        ws.onmessage = (event) => {
            const nouveauMessage = JSON.parse(event.data);
            if (nouveauMessage.event === 'game'){
                console.log(nouveauMessage);

                setGameToken(nouveauMessage.event);
                
                setTimeout(() => {
                    setGameStart(true);
                }, 5000);
            }
        };
        ws.onerror = (error) => {
            console.error('Détail de l’erreur WS:', error);
        };
    
        return () => {
            ws.close();
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