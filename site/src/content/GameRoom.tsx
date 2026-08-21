import SpecialBG from '../background/SpecialBg'
import { useEffect, useState } from 'react';
import type { LobbyPlayer } from '../context/LobbySocketContext';
import Heading from '../components/heading/Heading';
import { SKINS } from '../assets/avatars';
import { useFriends } from '../hooks/useFriends';
import unit from '../assets/Units/Unit_05.png';
import ColoredButton from '../components/buttons/ColoredButton';
import { ButtonColor } from '../constants/Colors';

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
  const avatar = unit;

  const sendInvite = async (identifier: string, roomId: string) => {
    try {
      await fetch(`${import.meta.env.VITE_USERS_SERVICE}/friends/send_game_invite`, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ destinatory: identifier, roomId}),
      method: 'POST',
      credentials: 'include',
      })
      
    } catch (e) {
      console.log("error: ", e);
    }
  }

  const { data: currentFriends, isLoading, isError } = useFriends();
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
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error while Loading.</div>;

  return (
    <SpecialBG>
      <Heading size='m' text={roomName}/>
      <div className='grid grid-cols-2 w-full mb-4'>
        <span className='text-center text-2xl font-bold'>{`Players: ${players.length}/${roomCapacity == 0 ? '∞' : roomCapacity}`}</span>
        <span className='text-center text-2xl font-bold'>{`Time Left: ${timeLeft >= 0 ? timeLeft : '∞'}`}</span>

      </div>
      <div className='grid md:grid-cols-2 gap-2 justify-items-center'>
        <div className='bg-light-olive border rounded-t-4xl rounded-4xl w-full max-w-150'>
          <div className=' bg-muted-gold rounded-t-4xl'>
            <div className='grid grid-cols-2 w-full'>
              <div className='text-2xl t-w justify-center font-semibold p-2.5 text-center'>Players</div>
              <div className='text-2xl t-w justify-center font-semibold p-2.5 text-center'>Skin</div>
            </div>
          </div>
          <div className='min-h-50 overflow-y-scroll no-scrollbar p-2'>
            {players.length ? (
              players.map((player) => {
                return (
                <div className='grid grid-cols-2 w-full' key={player.username}>
                  <div className='flex py-2.5 px-5 self-center justify-center font-semibold'>{player.username}</div>
                  <div className='flex py-2.5 px-5 self-center justify-center'>
                    <img
                      src={getSkinImg(player.skin)}
                      alt={player.username}
                      className='w-12 h-12 object-contain [image-rendering:pixelated]'
                    />
                  </div>
                </div>)
})
            ) : (
              <div className='self-center'>No Players</div>
            )}
          </div>
        </div>
        <div className='bg-light-olive border rounded-4xl w-full max-w-150'>
          <div className=' bg-muted-gold rounded-t-4xl'>
            <div className='text-2xl t-w text-center font-semibold p-2.5'>
              Online friends
            </div>
          </div>
          <div className='flex-row min-h-50 max-h-60 md:max-h-100 overflow-y-scroll no-scrollbar p-3'>
            {currentFriends?.users.length !== 0 ? 
            
            currentFriends?.users.map((friend) => {
              if (players.some((player) => player.username === friend.username)) {
                return <div key='none'></div>;
              }
              return (
                <div key={`friend-${friend.username}`} className='flex flex-row h-15 justify-around'>
                  <img
                    src={friend.avatarUrl? friend.avatarUrl: avatar}
                    className='rounded-full aspect-square h-full w-auto object-cover'/>
                  <div
                    className='self-center mx-4 font-semibold'>{friend.username}
                  </div>
                  <div className='h-[75%] self-center'>
                    <ColoredButton
                      color={ButtonColor.Green}
                      text='Invite'
                      func={() => sendInvite(friend.id, roomName)}/>
                  </div>
                </div>
              );
            })
            :
            (<div className='text-center'>No Friends Online</div>)
            }
          </div>
        </div>
      </div>
    </SpecialBG>
  );
}