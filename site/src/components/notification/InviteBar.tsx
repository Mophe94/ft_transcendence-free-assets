
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLobbySocket } from '../../context/LobbySocketContext';
import { useEffect, useState } from 'react';

interface InviteBarProps {
  username: string;
  roomId: string;
}

export default function InviteBar({ username, roomId }: InviteBarProps) {

  const { user } = useAuth();
  const navigate = useNavigate();
  const { joinRoom } = useLobbySocket()
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
    }, 2700);

    return () => clearTimeout(timer);
  }, []);

  if (!user)
    return <></>;
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-9999">
      <div
        className={`
          px-6 py-3 rounded-md border text-white font-semibold font-sans
          shadow-[0_4px_12px_rgba(0,0,0,0.15)]
          bg-[#2ecc71] border-[#27ae60]
          ${isLeaving ? 'animate-[slideOutNotif_0.3s_ease-in_forwards]' : 'animate-[slideInNotif_0.3s_ease-out_forwards]'}
        `}
      >
        {username} invites you to play in <span className='underline' onClick={() => {joinRoom(roomId, user.username, 'DinoGreen'); navigate('/home');}}>{roomId}</span>
        
      </div>

    </div>
  );
}