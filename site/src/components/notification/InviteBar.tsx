
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLobbySocket } from '../../context/LobbySocketContext';
import { useEffect, useState } from 'react';
import { useNotification } from '../../context/NotifContext';

interface InviteBarProps {
  username: string;
  roomId: string;
}

export default function InviteBar({ username, roomId }: InviteBarProps) {

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();
  const { joinRoom } = useLobbySocket()
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
    }, 2700);

    return () => clearTimeout(timer);
  }, []);

  const acceptInvite = async () => {

    const isAlreadyInGame = location.pathname.startsWith('/play');
    if (!user || isLeaving) return;
    if (isAlreadyInGame) {
      setIsLeaving(true);
      showNotification('You are already in a lobby or a game', 'error');
      return;
    }

    setIsLeaving(true);
    let userSkin = 'DinoGreen';

    try {
      const res = await fetch(`${import.meta.env.VITE_USERS_SERVICE}/settings`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (data?.skin) userSkin = data.skin;
    } catch (e) {
      console.error(e);
    }
    setTimeout(()=> {
      navigate('/loading')
      joinRoom(roomId, user.username, userSkin);
      navigate('/home');
    },300);
  };

  if (!user)
    return <></>;
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-9999">
      <div
        className={`
          px-6 py-3 rounded-md border text-white font-semibold font-sans
          shadow-[0_4px_12px_rgba(0,0,0,0.15)]
          bg-vibrant-emerald border-black
          ${isLeaving ? 'animate-[slideOutNotif_0.3s_ease-in_forwards]' : 'animate-[slideInNotif_0.3s_ease-out_forwards]'}
        `}
      >
        {username} invites you to play in <span className='underline' onClick={acceptInvite}>{roomId}</span>
        
      </div>

    </div>
  );
}