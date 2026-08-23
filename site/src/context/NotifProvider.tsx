import { useCallback, useRef, useState, type ReactNode } from "react";
import { NotificationContext, type NotificationType, type Notification, type Invite } from "./NotifContext";
import NotificationBar from "../components/notification/NotificationBar";
import InviteBar from "../components/notification/InviteBar";

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [invite, setInvite] = useState<Invite | null>(null);

  const notificationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inviteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeInvite = useCallback(() => {
    if (inviteTimeoutRef.current) clearTimeout(inviteTimeoutRef.current);
    setInvite(null);
  }, []);

  const showNotification = useCallback((message: string, type: NotificationType, duration = 3000) => {
    if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
    closeInvite();
    setNotification({ message, type });
    
    notificationTimeoutRef.current = setTimeout(() => {
      setNotification(null);
      notificationTimeoutRef.current = null;
    }, duration);
  }, [closeInvite]);

  const showInvite = useCallback((username: string, roomId: string, duration = 5000) => {
    if(inviteTimeoutRef.current) clearTimeout(inviteTimeoutRef.current);

    setInvite({username, roomId});
    inviteTimeoutRef.current = setTimeout(() => {
      setInvite(null);
      inviteTimeoutRef.current = null;
    }, duration);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, showInvite, closeInvite }}>
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