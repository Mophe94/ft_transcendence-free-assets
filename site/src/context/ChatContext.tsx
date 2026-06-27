import { createContext } from 'react';

export interface Message {
  time: string;
  username: string;
  content: string;
}

export interface Chat {
  user: string;
  messages: Array<Message>;
  sendMessage: (text: string) => Promise<void>;
}

export const ChatContext = createContext<Chat | null>(null);
