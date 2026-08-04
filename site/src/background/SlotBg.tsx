import './SlotBg.css';

import imgUL from '../assets/background/slot/green/slotGreenUL.png';
import imgUM from '../assets/background/slot/green/slotGreenUM.png';
import imgUR from '../assets/background/slot/green/slotGreenUR.png';
import imgML from '../assets/background/slot/green/slotGreenML.png';
import imgMM from '../assets/background/slot/green/slotGreenMM.png';
import imgMR from '../assets/background/slot/green/slotGreenMR.png';
import imgDL from '../assets/background/slot/green/slotGreenDL.png';
import imgDM from '../assets/background/slot/green/slotGreenDM.png';
import imgDR from '../assets/background/slot/green/slotGreenDR.png';

const regStyles = {
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

export default function SlotBg({ children }: { children: React.ReactNode }) {
  return (
    <div className='slot-layout' style={regStyles}>
      <div className="slot-upperLeft" />
      <div className="slot-upperMiddle" />
      <div className="slot-upperRight" />
      <div className="slot-middleLeft" />
      <div className="slot-middleMiddle">
          { children }
      </div>
      <div className="slot-middleRight" />
      <div className="slot-bottomLeft" />
      <div className="slot-bottomMiddle" />
      <div className="slot-bottomRight" />
    </div>
  );
}