import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpecialBG from '../background/SpecialBg';
import QuickPairingButton from './buttons/QuickPairingButton';
import CreateRoomButton from './buttons/CreateRoomButton';
import SlotBg from '../background/SlotBg';
import JoinButton from './buttons/JoinButton';
import { useLobbySocket } from '../context/LobbySocketContext';
import { useAuth } from '../context/AuthContext';
import Heading from './heading/Heading';
import { SKINS } from '../assets/avatars';


interface Room {
  roomId: string;
  status: string;
  nb_player: number;
}

export function Lobby() {
  const [listGames, setListGames] = useState<Array<Room>>([]);
  const [avatar, setSkin] = useState<string>(SKINS[0][0]);
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

  useEffect(() => {
    if (!user?.username) return;
    fetch(`${import.meta.env.VITE_USERS_SERVICE}/settings`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings?.avatar) setSkin(data.settings.avatar);
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
        <Heading size='m' text='Games'/>
        <div className='table-games rounded-xl border border-[#901e1e] p-4 bg-[#d6dbbb]'>
          <div className='
            table-games-content
            min-h-[30vh] max-h-[calc(60vh-2rem-clamp(2rem,6vw,5rem))]
            overflow-y-scroll no-scrollbar
            lg:grid lg:grid-cols-2 lg:gap-4'>
            {listGames.length ? (
              listGames.map((room) => (
                <div key={room.roomId} className='card mb-4'>
                  <SlotBg>
                    <div className='ticket grid grid-cols-2'>
                      <div className='left-ticket overflow-hidden'>
                        <div className='room-id font-semibold t-[clamp(0.8rem,3vw,2rem)] content-center wrap-break-word text-ellipsis overflow-y-hidden'>{room.roomId}</div>
                        <div className='nb-players t-[clamp(0.6rem,2.5vw,2rem)]'>Players: {room.nb_player}/8</div>
                      </div>
                      <div className='right-ticket content-center border-l border-gray-500'>
                        <div className='room-status t-[clamp(0.6rem,2.5vw,2rem)] text-center border-l-2 border-[#adadad]'>{room.status}</div>
                        {room.status == 'Waiting for players' &&
                          <div className='join-button-container flex justify-center h-[min(4rem,8vw)] mt-2'>
                            <JoinButton onClick={() => joinRoom(room.roomId, username, avatar)} />
                          </div>}
                      </div>
                    </div>
                  </SlotBg>
                </div>
              ))
            ) : (
              <div className='no-games lg:col-span-2 text-center'>No ongoing games</div>
            )}
          </div>
        </div>
        {joinError && (
          <div className='join-error self-center'>
            {joinError === 'full' ? 'Room just got full.' : "Room doesn't exist any;ore"}
          </div>
        )}
        <div className='room-button-container mt-5 grid grid-cols-2 justify-items-center'>
          <div id='quick-btn-container' className='w-[clamp(6rem,30vw,18rem)]'>
            <QuickPairingButton onClick={() => quickPairing(username, avatar)} />
          </div>
          <div id='create-btn-container' className='w-[clamp(6rem,30vw,18rem)] self-center'>
            <CreateRoomButton onClick={() => createRoom(username, avatar)} />
          </div>
        </div>
      </SpecialBG>
    </div>
  );
}