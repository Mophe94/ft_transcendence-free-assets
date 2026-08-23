import { useEffect, useState } from 'react';
import type { NotificationType } from '../../context/NotifContext';

interface NotificationBarProps {
  message: string;
  type: NotificationType;
}

const typeStyles: Record<NotificationType, string> = {
  success: 'bg-lush-green border-black',
  error: 'bg-pastel-red border-black',
  warning: 'bg-pastel-yellow border-black',
};

export default function NotificationBar({ message, type }: NotificationBarProps) {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
    }, 2700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-9999">
      <div
        className={`
          px-6 py-3 rounded-md border text-white font-semibold font-sans
          shadow-[0_4px_12px_rgba(0,0,0,0.15)]
          ${isLeaving ? 'animate-[slideOutNotif_0.3s_ease-in_forwards]' : 'animate-[slideInNotif_0.3s_ease-out_forwards]'}
          ${typeStyles[type] || typeStyles.success}
        `}
      >
        {message}
      </div>

    </div>
  );
}