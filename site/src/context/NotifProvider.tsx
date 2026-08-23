import { useRef, useState, type ReactNode } from "react";
import { NotificationContext, type NotificationType, type Notification, type Invite } from "./NotifContext";
import NotificationBar from "../components/notification/NotificationBar";
import InviteBar from "../components/notification/InviteBar";

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [invite, setInvite] = useState<Invite | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNotification = (message: string, type: NotificationType, duration = 3000) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    setNotification({ message, type });
    
    timeoutRef.current = setTimeout(() => {
      setNotification(null);
      timeoutRef.current = null;
    }, duration);
  };

  const showInvite = (username: string, roomId: string, duration = 5000) => {
    if(timeoutRef.current) clearTimeout(timeoutRef.current);

    setInvite({username, roomId});
    timeoutRef.current = setTimeout(() => {
      setInvite(null);
      timeoutRef.current = null;
    }, duration);
  }

  return (
    <NotificationContext.Provider value={{ showNotification, showInvite }}>
      {children}
      {notification && (
        <NotificationBar message={notification.message} type={notification.type} />
      )}
      {invite && (
        <InviteBar username={invite.username} roomId={invite.roomId}/>
      )}
    </NotificationContext.Provider>
  );
}