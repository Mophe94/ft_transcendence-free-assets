import { createContext, useContext } from "react";

export type NotificationType = 'success' | 'warning' | 'error';

export interface Notification {
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType, duration?: number) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification has to be used within a NotificationProvider');
  }
  return context;
}