import SpecialBG from '../background/SpecialBg'
import { useEffect, useState } from 'react';
import type { LobbyPlayer } from '../context/LobbySocketContext';
import Heading from '../components/heading/Heading';
import { SKINS } from '../assets/avatars';

interface RoomInfo {
  roomName: string;
  players: Array<LobbyPlayer>;
  roomCapacity: number;
  endTime: number;
}

function getSkinImg(key: string): string {
  const entry = SKINS.find(([k]) => k === key);
  return entry ? entry[1] : SKINS[0][1];
}

export default function GameRoom({ roomName, players, roomCapacity = 4, endTime }: RoomInfo) {
  const [timeLeft, setTimeLeft] = useState<number>(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.round((endTime - Date.now()) / 1000);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <SpecialBG>
      <Heading size='m' text={roomName}/>
      <div>
        <div className=' bg-[#8f5407b9] rounded-4xl mb-5'>
          <div className='grid grid-cols-2 w-full'>
            <div className='text-2xl t-w justify-center font-semibold p-2.5'>Players</div>
            <div className='text-2xl t-w justify-center font-semibold p-2.5'>Skin</div>
          </div>
        </div>
        <div className='max-h-100 overflow-y-scroll no-scrollbar'>
          {players.length ? (
            players.map((player) => (
              <div className='grid grid-cols-2 w-full' key={player.username}>
                <div className='py-2.5 px-5 self-center'>{player.username}</div>
                <div className='py-2.5 px-5 self-center'>
                  <img
                    src={getSkinImg(player.avatar)}
                    alt={player.username}
                    className='w-12 h-12 object-contain [image-rendering:pixelated]'
                  />
                </div>
              </div>
            ))
          ) : (
            <div className='self-center'>No Players</div>
          )}
        </div>
        <div className='grid grid-cols-2 w-full'>
          <Heading size='sm' text={`Players: ${players.length}/${roomCapacity == 0 ? '∞' : roomCapacity}`} />
          <Heading size='sm' text={`Time Left: ${timeLeft >= 0 ? timeLeft : '∞'}`} />
        </div>
      </div>
    </SpecialBG>
  );
}