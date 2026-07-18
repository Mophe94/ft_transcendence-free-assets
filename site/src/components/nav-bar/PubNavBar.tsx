import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

import swordMid from '../../assets/navbar/sword_mid.png'
const swordStyle = {
  '--sword-mid': `url(${swordMid})`,
} as React.CSSProperties;

const menuLinks = {
  'Learn More': '/project',
  'About Us': '/about_us',
  Contact: '/contact',
};

function NavMenu() {
  return (
    <div className="nav-menu" style={swordStyle}>
      <div className="nav-extreme">
        <img src="navbar/sword_beg.png" />
      </div>
      {Object.entries(menuLinks).map(([name, url]) => (
        <React.Fragment key={name}>
          <div className="nav-tab">
            <Link to={url} className="nav-link">
              {name}
            </Link>
          </div>
        </React.Fragment>
      ))}
      <div className="nav-extreme">
        <img src="navbar/sword_end.png" />
      </div>
    </div>
  );
}

export function PubNavBar() {
  return (
    <div className="pub-nav-bar">
      <NavMenu />
    </div>
  );
}
