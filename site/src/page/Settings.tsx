import React from 'react';
import './Settings.css'
import Stats from '../content/Stats';
import Preferences from '../content/Preferences';

import imgUL from '../assets/background/regular_paper/regular_paper_UL.png';
import imgUM from '../assets/background/regular_paper/regular_paper_UM.png';
import imgUR from '../assets/background/regular_paper/regular_paper_UR.png';
import imgML from '../assets/background/regular_paper/regular_paper_ML.png';
import imgMM from '../assets/background/regular_paper/regular_paper_MM.png';
import imgMR from '../assets/background/regular_paper/regular_paper_MR.png';
import imgDL from '../assets/background/regular_paper/regular_paper_DL.png';
import imgDM from '../assets/background/regular_paper/regular_paper_DM.png';
import imgDR from '../assets/background/regular_paper/regular_paper_DR.png';

const prefStyles = {
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

export default function Settings() {
  return (
    <div className="settings-content-layout" style={prefStyles}>
      <div className="settings-upperLeft" />
      <div className="settings-upperMiddle" />
      <div className="settings-upperRight" />
      <div className="settings-middleLeft" />
      <div className="settings-middleMiddle">
        <Stats />
        <Preferences />
      </div>
      <div className="settings-middleRight" />

      <div className="settings-bottomLeft" />
      <div className="settings-bottomMiddle" />
      <div className="settings-bottomRight" />
    </div>
  );
}
