import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpecialBG from '../background/SpecialBg';
import QuickPairingButton from './buttons/QuickPairingButton';
import CreateRoomButton from './buttons/CreateRoomButton';
import SlotBg from '../background/SlotBg';
import JoinButton from './buttons/JoinButton';
import { useLobbySocket } from '../context/LobbySocketContext';
import { useAuth } from '../context/AuthContext';
import { AVATARS } from '../content/Preferences';

interface Room {
  roomId: string;
  status: string;
  nb_player: number;
}

export function Lobby() {
  const [listGames, setListGames] = useState<Array<Room>>([]);
  const [avatar, setAvatar] = useState<string>(AVATARS[0][0]); // fallback en attendant le fetch
  const { roomId, createRoom, quickPairing, joinRoom, joinError } = useLobbySocket();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = () => {
      fetch(`${import.meta.env.VITE_ROOM_SERVICE}/get_rooms`, {
        method: 'GET',
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.rooms) setListGames(data.rooms);
        })
        .catch((e) => console.log(e));
    };

    fetchRooms();
    const interval = setInterval(fetchRooms, 3000);
    return () => clearInterval(interval);
  }, []);

  // NEW: même pattern que Preferences.tsx — /auth/me (useAuth) ne
  // contient pas les settings à jour, il faut les récupérer séparément.
  useEffect(() => {
    if (!user?.username) return;
    fetch(`${import.meta.env.VITE_USERS_SERVICE}/settings`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings?.avatar) setAvatar(data.settings.avatar);
      })
      .catch((e) => console.log(e));
  }, [user?.username]);

  useEffect(() => {
    if (roomId) navigate('/play');
  }, [roomId, navigate]);

  const username = user?.username ?? 'Anonymous';

  return (
    <div className="lobby-content">
      <SpecialBG>
        <div className='heading-medium centered'>Games</div>
        <div className='table-games'>
          <div className='table-games-content'>
            {listGames.length ? (
              listGames.map((room) => (
                <div key={room.roomId} className='card'>
                  <SlotBg>
                    <div className='ticket'>
                      <div className='left-ticket'>
                        <div className='room-id'>{room.roomId}</div>
                        <div className='nb-players'>Players: {room.nb_player}/8</div>
                      </div>
                      <div className='right-ticket'>
                        <div className='room-status'>{room.status}</div>
                        {room.status == 'Waiting for players' &&
                          <div className='join-button-container'>
                            <JoinButton onClick={() => joinRoom(room.roomId, username, avatar)} />
                          </div>}
                      </div>
                    </div>
                  </SlotBg>
                </div>
              ))
            ) : (
              <div className='no-games centered'>No ongoing games</div>
            )}
          </div>
        </div>
        {joinError && (
          <div className='join-error centered'>
            {joinError === 'full' ? 'Cette room vient de se remplir.' : "Cette room n'existe plus."}
          </div>
        )}
        <div className='room-button-container'>
          <div id='quick-btn-container' className='centered'>
            <QuickPairingButton onClick={() => quickPairing(username, avatar)} />
          </div>
          <div id='create-btn-container' className='centered'>
            <CreateRoomButton onClick={() => createRoom(username, avatar)} />
          </div>
        </div>
      </SpecialBG>
    </div>
  );
}