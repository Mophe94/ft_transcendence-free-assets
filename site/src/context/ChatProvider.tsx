import type React from 'react';
import { ChatContext, type Chat, type Message } from './ChatContext';
import { useEffect, useRef, useState } from 'react';
import { Color } from '../constants/Colors';
import { useAuth } from './AuthContext';
import { useNotification } from './NotifContext';

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { showNotification, showInvite } = useNotification();
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [isUnread, setIsUnread] = useState<boolean>(false);
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
      console.log(event);
      const data = JSON.parse(event.data);
      switch (data.type) {
      case 'message': {
          const message = {
            time: new Date(data.time).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
              }),
            content: data.content,
            username: data.username,
          } as Message;
          if (!userColorsRef.current.has(message.username)) {
            userColorsRef.current.set(message.username, getRandomColor());
          }
          message.color = userColorsRef.current.get(message.username);
          setMessages((prev) => [...prev.slice(-99), message]);
          setIsUnread(true);
          break;
        }
        case 'friend_request': 
          showNotification('You got a friend request', 'success');
          break;
        case 'game_invite':
          showInvite(data.origin.from, data.origin.roomId)
          break;
      }
    };

    socket.onclose = () => wsRef.current = null;
    return () => {
      socket.close();
    }
  }, [user, showNotification, showInvite]);

  const sendMessage = async (content: string) => {
    console.log('message sent');
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ event: 'message', data: content }));
    } else {
      console.error('Socket not connected.');
    }
  };
  const chat: Chat = { messages, sendMessage, isUnread, setIsUnread };
  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
};
