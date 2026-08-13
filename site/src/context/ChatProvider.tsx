import type React from 'react';
import { ChatContext, type Chat, type Message } from './ChatContext';
import { useEffect, useRef, useState } from 'react';
import { Color } from '../constants/Colors';
import { useAuth } from './AuthContext';

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Array<Message>>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const userColorsRef = useRef<Map<string, Color>>(new Map());

  function getRandomColor(): Color {
    const colorArray = Object.values(Color);
    const randomIndex = Math.floor(Math.random() * colorArray.length);
    return colorArray[randomIndex];
  }
  useEffect(() => {
    const socket = new WebSocket(`${import.meta.env.VITE_CHAT_SERVICE}`);
    wsRef.current = socket;
    socket.onopen = () => console.log('connection');
    socket.onclose = () => {
      return;
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data, (key, value) => {
        if (key === 'time') {
          return new Date(value).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          });
        }
        return value;
      }) as Message;
      if (!userColorsRef.current.has(data.username)) {
        userColorsRef.current.set(data.username, getRandomColor());
      }
        data.color = userColorsRef.current.get(data.username);
      setMessages((prev) => [...prev.slice(-99), data]);
    };
    socket.onclose = () => wsRef.current = null;
    return () => {
      socket.close();
    }
  }, [user]);

  const sendMessage = async (content: string) => {
    console.log('message sent');
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ event: 'message', data: content }));
    } else {
      console.error('Socket not connected.');
    }
  };
  const chat: Chat = { messages, sendMessage };
  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
};
