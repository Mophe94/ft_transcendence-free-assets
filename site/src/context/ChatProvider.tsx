import type React from 'react';
import { ChatContext, type Chat, type Message } from './ChatContext';
import { useEffect, useState } from 'react';
import { Color } from '../constants/Colors';

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [userColors, setUserColors] = useState<Map<string, Color>>(new Map());

  function getRandomColor(): Color {
    const colorArray = Object.values(Color);
    const randomIndex = Math.floor(Math.random() * colorArray.length);
    return colorArray[randomIndex];
  }

  useEffect(() => {
    const socket = new WebSocket(`${import.meta.env.VITE_CHAT_SERVICE}`);

    socket.onopen = () => {
      setWs(socket);
    };
    socket.onclose = () => {
      return;
    }

    socket.onmessage = (event) => {
      console.log('receiving a message');
      const data = JSON.parse(event.data, (key, value) => {
        if (key === 'time') {
          const date = new Date(value);
          const time = date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          });
          return time;
        }
        return value;
      }) as Message;
      console.log(data);
      if (data.username && userColors.get(data.username)) {
        data.color = userColors.get(data.username);
      }
      else 
      {
        setUserColors((prev) => (prev.set(data.username, getRandomColor())))
        userColors.set(data.username, getRandomColor());
        data.color = userColors.get(data.username);
      }
      console.log(data)
      setMessages((prev) => {
        const lastMessages = prev.slice(-99);
        return [...lastMessages, data]});
    };
  }, [userColors]);

  const sendMessage = async (content: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ event: 'message', data: content }));
    } else {
      console.error('Socket not connected.');
    }
  };
  const chat: Chat = { messages, sendMessage };
  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
};
