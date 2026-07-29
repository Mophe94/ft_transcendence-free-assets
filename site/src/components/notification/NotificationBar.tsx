import { useEffect, useState } from 'react';
import type { NotificationType } from '../../context/NotifContext';
import './NotificationBar.css';

interface NotificationBarProps {
  message: string;
  type: NotificationType;
}

export default function NotificationBar({ message, type }: NotificationBarProps) {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
    }, 2700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`notification-bar ${type} ${isLeaving ? 'fade-out' : ''}`}>
      {message}
    </div>
  );
}