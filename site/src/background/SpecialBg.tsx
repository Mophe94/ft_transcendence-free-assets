import './SpecialBg.css';

import imgUL from '../assets/background/special/special_UL.png';
import imgUM from '../assets/background/special/special_UM.png';
import imgUR from '../assets/background/special/special_UR.png';
import imgML from '../assets/background/special/special_ML.png';
import imgMM from '../assets/background/special/special_MM.png';
import imgMR from '../assets/background/special/special_MR.png';
import imgDL from '../assets/background/special/special_DL.png';
import imgDM from '../assets/background/special/special_DM.png';
import imgDR from '../assets/background/special/special_DR.png';

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

export default function SpecialBG({ children }: { children: React.ReactNode }) {
  return (
    <div className='specialbg-layout' style={regStyles}>
      <div className="specialbg-upperLeft" />
      <div className="specialbg-upperMiddle" />
      <div className="specialbg-upperRight" />
      <div className="specialbg-middleLeft" />
      <div className="specialbg-middleMiddle">
          { children }
      </div>
      <div className="specialbg-middleRight" />
      <div className="specialbg-bottomLeft" />
      <div className="specialbg-bottomMiddle" />
      <div className="specialbg-bottomRight" />
    </div>
  );
}