import type React from 'react';
import { ChatContext, type Chat, type Message } from './ChatContext';
import { useEffect, useState } from 'react';

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(`${import.meta.env.VITE_CHAT_SERVICE}`);

    socket.onopen = () => {
      setWs(socket);
      console.log('Connected');
    };

    socket.onmessage = (event) => {
      console.log('receiving a message');
      const data = JSON.parse(event.data, (key, value) => {
        if (key === 'time') {
          const date = new Date(value);
          const time = date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // Force le format 24h
          });
          return time;
        }
        return value;
      });
      console.log(data);
      setMessages((prev) => [...prev, data]);
    };
  }, []);

  const sendMessage = async (content: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ event: 'message', data: content }));
    } else {
      console.error('Socket not connected.');
    }
  };
  const chat: Chat = { user: 'kprist', messages, sendMessage };
  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
};
