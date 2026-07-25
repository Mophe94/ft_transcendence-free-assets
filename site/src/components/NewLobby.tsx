import './NewLobby.css';
import { useEffect, useState } from 'react';

import imgUL from '../assets/background/special/special_UL.png';
import imgUM from '../assets/background/special/special_UM.png';
import imgUR from '../assets/background/special/special_UR.png';
import imgML from '../assets/background/special/special_ML.png';
import imgMM from '../assets/background/special/special_MM.png';
import imgMR from '../assets/background/special/special_MR.png';
import imgDL from '../assets/background/special/special_DL.png';
import imgDM from '../assets/background/special/special_DM.png';
import imgDR from '../assets/background/special/special_DR.png';


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
    <div className="lobby-content-layout" style={lobbyStyles}>
      <div className="lobby-upperLeft" />
      <div className="lobby-upperMiddle" />
      <div className="lobby-upperRight" />
      <div className="lobby-middleLeft" />
      <div className="lobby-middleMiddle">
        <div className='heading-medium centered'>Games</div>
        <div className='table-games'>
          <table className="lobby-table">
        <colgroup>
          <col style={{ width: '10%' }} />
          <col style={{ width: '70%' }} />
          <col style={{ width: '20%' }} />
        </colgroup>
        <thead>
          <tr>
            <th>Room Id</th>
            <th>Nb players</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {listGames.map((room) => (
            <tr key={room.roomId}>
              <td>{room.roomId}</td>
              <td>{room.nb_player}/8</td>
              <td>{room.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>

      </div>
      <div className="lobby-middleRight" />

      <div className="lobby-bottomLeft" />
      <div className="lobby-bottomMiddle" />
      <div className="lobby-bottomRight" />
    </div>
  );
}
