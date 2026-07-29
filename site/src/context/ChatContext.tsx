import { createContext } from 'react';
import type { ColorType } from '../constants/Colors';

export interface Message {
  time: string;
  username: string;
  content: string;
  color?: ColorType;
}

export interface Chat {
  messages: Array<Message>;
  sendMessage: (text: string) => Promise<void>;
}

export const ChatContext = createContext<Chat | null>(null);
