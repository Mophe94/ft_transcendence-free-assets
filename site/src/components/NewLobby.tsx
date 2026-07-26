import './NewLobby.css';
import { useEffect, useState } from 'react';
import SpecialBG from '../background/SpecialBg';

import imgUL from '../assets/background/special/special_UL.png';
import imgUM from '../assets/background/special/special_UM.png';
import imgUR from '../assets/background/special/special_UR.png';
import imgML from '../assets/background/special/special_ML.png';
import imgMM from '../assets/background/special/special_MM.png';
import imgMR from '../assets/background/special/special_MR.png';
import imgDL from '../assets/background/special/special_DL.png';
import imgDM from '../assets/background/special/special_DM.png';
import imgDR from '../assets/background/special/special_DR.png';

import join_button from '../assets/buttons/join_button_regular.png';



interface Room {
  roomId: string,
  status: string,
  nb_player: number,
}

const lobbyStyles = {
  '--img-ul': `url(${imgUL})`,
  '--img-um': `url(${imgUM})`,
  '--img-ur': `url(${imgUR})`,
  '--img-ml': `url(${imgML})`,
  '--img-mm': `url(${imgMM})`,
  '--img-mr': `url(${imgMR})`,
  '--img-dl': `url(${imgDL})`,
  '--img-dm': `url(${imgDM})`,
  '--img-dr': `url(${imgDR})`,
} as React.CSSProperties;

export function NewLobby() {
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
    <SpecialBG>
      <div className='heading-medium centered'>Games</div>
      <div className='table-games'>
        <div className='table-games-header'>
          <div className='table-col-templ'>
            <div className='table-head centered'>Room Id</div>
            <div className='table-head centered'>Players</div>
            <div className='table-head centered'>Status</div>
            <div className='table-head centered'>Join?</div>
          </div>
        </div>
        <div className='table-games-content'>
          {
          listGames.length?
            (listGames.map((room) => (
                <div className='table-col-templ' key={room.roomId}>
                  <div className='table-data centered'>{room.roomId}</div>
                  <div className='table-data centered'>{room.nb_player}/8</div>
                  <div className='table-data centered'>{room.status}</div>
                  <button className='clean-btn join-button centered'>
                    <img src={join_button} className='centered'/>
                  </button>
                </div>
            ))):
            <div className='centered'>No ongoing games</div>}
        </div>
      </div>
    </SpecialBG>
  );
}
