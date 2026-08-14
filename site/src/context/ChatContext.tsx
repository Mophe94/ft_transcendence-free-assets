import { createContext } from 'react';
import type { Color } from '../constants/Colors';

export interface Message {
  time: string;
  username: string;
  content: string;
  color?: Color;
}

export interface Chat {
  messages: Array<Message>;
  sendMessage: (text: string) => Promise<void>;
}

export const ChatContext = createContext<Chat | null>(null);
