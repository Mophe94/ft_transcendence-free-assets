import { useRef, useState, type ReactNode } from "react";
import { NotificationContext, type NotificationType, type Notification } from "./NotifContext";
import NotificationBar from "../components/notification/NotificationBar";

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNotification = (message: string, type: NotificationType, duration = 3000) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    setNotification({ message, type });
    
    timeoutRef.current = setTimeout(() => {
      setNotification(null);
      timeoutRef.current = null;
    }, duration);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <NotificationBar message={notification.message} type={notification.type} />
      )}
    </NotificationContext.Provider>
  );
}