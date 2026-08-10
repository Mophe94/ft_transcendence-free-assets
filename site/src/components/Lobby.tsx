import { useEffect, useState } from 'react';
import SpecialBG from '../background/SpecialBg';
import QuickPairingButton from './buttons/QuickPairingButton';
import CreateRoomButton from './buttons/CreateRoomButton';
import SlotBg from '../background/SlotBg';
import JoinButton from './buttons/JoinButton';
import Heading from './heading/Heading';

interface Room {
  roomId: string;
  status: string;
  nb_player: number;
}

export function Lobby() {
  const [listGames, setListGames] = useState<Array<Room>>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_ROOM_SERVICE}/get_rooms`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.rooms) setListGames(data.rooms);
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <div className="lobby-content">
      <SpecialBG>
        <Heading text="Games" size='m'/>

        <div className="rounded-[10px] border border-solid border-[rgb(144,30,30)] bg-[rgb(214,219,187)] p-4">
          <div className="
            min-h-[30vh] max-h-[calc(60vh-2rem-clamp(2rem,6vw,5rem))]
            overflow-y-scroll scrollbar-none
            lg:grid lg:grid-cols-2 lg:gap-4
          ">
            {listGames.length ? (
              listGames.map((room) => (
                <div key={room.roomId} className="mb-4 lg:mb-0">
                  <SlotBg>
                    <div className="grid grid-cols-2">
                      <div className="overflow-hidden">
                        <div className="
                          font-medium text-[clamp(0.8rem,3vw,2rem)]
                          content-center place-content-center
                          overflow-wrap-break-word ellipsis overflow-y-hidden
                        ">
                          {room.roomId}
                        </div>
                        <div className="font-normal text-[clamp(0.6rem,2.5vw,2rem)]">
                          Players: {room.nb_player}/8
                        </div>
                      </div>

                      <div className="content-center place-content-center border-l border-solid border-gray-400">
                        <div className="
                          font-normal text-[clamp(0.6rem,2.5vw,2rem)] text-center
                          border-l-2 border-solid border-[rgb(173,173,173)]
                        ">
                          {room.status}
                        </div>
                        {room.status === 'Waiting for players' && (
                          <div className="flex border-none bg-transparent justify-center h-[min(4rem,8vw)] mt-2">
                            <JoinButton onClick={() => {}} />
                          </div>
                        )}
                      </div>
                    </div>
                  </SlotBg>
                </div>
              ))
            ) : (
              <div className="text-[min(5vw,4rem)] text-center lg:col-span-2">
                No ongoing games
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 content-around">
          <div className="w-[clamp(6rem,30vw,18rem)] justify-self-center text-center">
            <QuickPairingButton onClick={() => console.log()} />
          </div>
          <div className="w-[clamp(6rem,30vw,18rem)] justify-self-center text-center">
            <CreateRoomButton onClick={() => console.log()} />
          </div>
        </div>
      </SpecialBG>
    </div>
  );
}