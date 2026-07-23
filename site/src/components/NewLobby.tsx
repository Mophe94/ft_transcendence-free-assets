import './NewLobby.css';

import imgUL from '../assets/background/regular_paper/regular_paper_UL.png';
import imgUM from '../assets/background/regular_paper/regular_paper_UM.png';
import imgUR from '../assets/background/regular_paper/regular_paper_UR.png';
import imgML from '../assets/background/regular_paper/regular_paper_ML.png';
import imgMM from '../assets/background/regular_paper/regular_paper_MM.png';
import imgMR from '../assets/background/regular_paper/regular_paper_MR.png';
import imgDL from '../assets/background/regular_paper/regular_paper_DL.png';
import imgDM from '../assets/background/regular_paper/regular_paper_DM.png';
import imgDR from '../assets/background/regular_paper/regular_paper_DR.png';

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
  const data = [
    { id: 0, name: 'Lobby One', nb_player: 6, status: "waiting for players" },
    { id: 1, name: 'Lobby Two', nb_player: 1, status: "waiting for players" },
    { id: 3, name: 'Lobby Three', nb_player: 8, status: "Ongoing"},
  ];
  return (
    <div className="lobby-content-layout" style={lobbyStyles}>
      <div className="lobby-upperLeft" />
      <div className="lobby-upperMiddle" />
      <div className="lobby-upperRight" />
      <div className="lobby-middleLeft" />
      <div className="lobby-middleMiddle">
        Hello
      </div>
      <div className="lobby-middleRight" />

      <div className="lobby-bottomLeft" />
      <div className="lobby-bottomMiddle" />
      <div className="lobby-bottomRight" />
    </div>
  );
}
