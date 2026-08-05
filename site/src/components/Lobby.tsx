import './Lobby.css';
import { useEffect, useState } from 'react';
import SpecialBG from '../background/SpecialBg';
import QuickPairingButton from './buttons/QuickPairingButton';
import CreateRoomButton from './buttons/CreateRoomButton';
import SlotBg from '../background/SlotBg';
import JoinButton from './buttons/JoinButton';


interface Room {
  roomId: string,
  status: string,
  nb_player: number,
}

export function Lobby() {
  const [listGames, setListGames] = useState<Array<Room>>([]);

  useEffect(() => {
    console.log('hello');
    fetch(`${import.meta.env.VITE_ROOM_SERVICE}/get_rooms`, {
      method: 'GET',
      credentials: 'include',
    })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log("data =>", data);
      if (data?.rooms)
        setListGames(data.rooms)
      })
    .catch((e) => console.log(e))
  }, [])
  console.log(listGames);


  return (
    <div className='lobby-content'>
      <SpecialBG>
        <div className='heading-medium centered'>Games</div>
        <div className='table-games'>
          <div className='table-games-content'>
            {
            listGames.length?
              (listGames.map((room) => (
                <div key={room.roomId} className='card'>
                  <SlotBg>
                    <div  className='ticket'>
                      <div className='left-ticket'>
                        <div className='room-id'>{room.roomId}</div>
                        <div className='nb-players'>Players: {room.nb_player}/8</div>
                      </div>
                      <div className='right-ticket'>
                        <div className='room-status'>{room.status}</div>
                        {room.status == 'Waiting for players' && 
                          <div className='join-button-container'>
                            <JoinButton onClick={() => {}}/>
                          </div>}
                      </div>
                    </div>
                  </SlotBg>
                </div>
              ))):
              <div className='no-games centered'>No ongoing games</div>}
          </div>
          
          </div>
          <div className='room-button-container'>
            <div id='quick-btn-container' className='centered'>
              <QuickPairingButton onClick={()=>console.log()}/>
            </div>
            <div id='create-btn-container'className='centered'>
              <CreateRoomButton onClick={()=>console.log()}/>
            </div>
        </div>
      </SpecialBG>
    </div>
  );
}
