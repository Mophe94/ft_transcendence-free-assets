import { createContext } from 'react';
import type { ChatColor } from '../constants/Colors';

export interface Message {
  time: string;
  username: string;
  content: string;
  color?: ChatColor;
}

export interface Chat {
  messages: Array<Message>;
  sendMessage: (text: string) => Promise<void>;
  isUnread: boolean;
  setIsUnread: React.Dispatch<React.SetStateAction<boolean>>
  chatConnectionActive: boolean;
}

export const ChatContext = createContext<Chat | null>(null);
