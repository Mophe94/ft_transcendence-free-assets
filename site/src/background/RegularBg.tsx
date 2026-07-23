import './RegularBg.css';

import imgUL from '../assets/background/regular_paper/regular_paper_UL.png';
import imgUM from '../assets/background/regular_paper/regular_paper_UM.png';
import imgUR from '../assets/background/regular_paper/regular_paper_UR.png';
import imgML from '../assets/background/regular_paper/regular_paper_ML.png';
import imgMM from '../assets/background/regular_paper/regular_paper_MM.png';
import imgMR from '../assets/background/regular_paper/regular_paper_MR.png';
import imgDL from '../assets/background/regular_paper/regular_paper_DL.png';
import imgDM from '../assets/background/regular_paper/regular_paper_DM.png';
import imgDR from '../assets/background/regular_paper/regular_paper_DR.png';

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

export default function RegularBG({ children }: { children: React.ReactNode }) {
  return (
    <div className='regbg-layout' style={regStyles}>
      <div className="regbg-upperLeft" />
      <div className="regbg-upperMiddle" />
      <div className="regbg-upperRight" />
      <div className="regbg-middleLeft" />
      <div className="regbg-middleMiddle">
          { children }
      </div>
      <div className="regbg-middleRight" />
      <div className="regbg-bottomLeft" />
      <div className="regbg-bottomMiddle" />
      <div className="regbg-bottomRight" />
    </div>
  );
}