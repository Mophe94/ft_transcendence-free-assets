import './GameRoom.css'
import SpecialBG from '../background/SpecialBg'
import { useEffect, useState } from 'react';
import type { LobbyPlayer } from '../context/LobbySocketContext';
import { AVATARS } from '../content/Preferences';

interface RoomInfo {
  roomName: string;
  players: Array<LobbyPlayer>;
  roomCapacity: number;
  endTime: number;
}

function getAvatarImg(key: string): string {
  const entry = AVATARS.find(([k]) => k === key);
  return entry ? entry[1] : AVATARS[0][1];
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
      <div className='heading-medium centered'>{roomName}</div>
      <div className='table-players'>
        <div className='table-players-header'>
          <div className='table-players-col-templ'>
            <div className='table-players-head centered'>Players</div>
            <div className='table-players-head centered'>Avatar</div>
          </div>
        </div>
        <div className='table-players-content'>
          {players.length ? (
            players.map((player) => (
              <div className='table-players-col-templ' key={player.username}>
                <div className='table-data centered'>{player.username}</div>
                <div className='table-data centered'>
                  <img
                    src={getAvatarImg(player.avatar)}
                    alt={player.username}
                    className='player-avatar'
                  />
                </div>
              </div>
            ))
          ) : (
            <div className='centered'>No Players</div>
          )}
        </div>
        <div className='table-players-col-templ'>
          <div className='heading-small centered'>
            Players: {players.length}/{roomCapacity == 0 ? '∞' : roomCapacity}
          </div>
          <div className='heading-small centered'>
            Time Left: {timeLeft >= 0 ? timeLeft : '∞'}
          </div>
        </div>
      </div>
    </SpecialBG>
  );
}