import type React from 'react';
import { ChatContext, type Chat, type Message } from './ChatContext';
import { useEffect, useRef, useState } from 'react';
import { ChatColor } from '../constants/Colors';
import { useAuth } from './AuthContext';
import { useNotification } from './NotifContext';

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { showNotification, showInvite } = useNotification();
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [isUnread, setIsUnread] = useState<boolean>(false);
  const [chatConnectionActive, setChatConnectionActive] = useState<boolean>(false);
  const wsRef = useRef<WebSocket | null>(null);
  const userColorsRef = useRef<Map<string, ChatColor>>(new Map());

  function getRandomColor(): ChatColor {
    const colorArray = Object.values(ChatColor);
    const randomIndex = Math.floor(Math.random() * colorArray.length);
    return colorArray[randomIndex];
  }
  useEffect(() => {
    const socket = new WebSocket(`${import.meta.env.VITE_CHAT_SERVICE}`);
    wsRef.current = socket;

    socket.onopen = () => {
      setChatConnectionActive(true);
    }
    socket.onmessage = (event) => {
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

    socket.onclose = () => {
      if (wsRef.current === socket) {
        wsRef.current = null;
      }
      setChatConnectionActive(false);
    };
    return () => {
      socket.close();
    }
  }, [user, showNotification, showInvite]);

  const sendMessage = async (content: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ event: 'message', data: { content } }));
    } else {
      console.error('Socket not connected.');
    }
  };
  const chat: Chat = { messages, sendMessage, isUnread, setIsUnread, chatConnectionActive };
  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
};
