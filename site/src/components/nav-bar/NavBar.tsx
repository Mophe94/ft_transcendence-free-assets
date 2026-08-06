import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import { AuthSection } from './Login';

import swordBeg from '../../assets/navbar/sword_beg.png';
import swordMid from '../../assets/navbar/sword_mid.png';
import swordEnd from '../../assets/navbar/sword_end.png';
import { useAuth } from '../../context/AuthContext';

const swordStyle = {
  '--sword-mid': `url(${swordMid})`,
} as React.CSSProperties;

const publicLinks = {
  Home: '/Home',
  Readme: '/readme',
  'About us': '/aboutus',
}

const privateLinks = {
  Home: '/Home',
  Play: '/play',
  'How to play': '/howto',
  Admin: '/admin',
  Readme: '/readme',
  'About us': '/aboutus',
};

function NavMenu() {
  const { user } = useAuth();
  const menuLinks = (user)? privateLinks: publicLinks;

  return (
    <div className="nav-menu" style={swordStyle}>
      <div className="nav-extreme">
        <img src={swordBeg} />
      </div>
      <div className="nav-menu-label">Menu</div>
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
        <img src={swordEnd} />
      </div>
    </div>
  );
}

export function NavBar() {
  return (
    <div className="nav-bar">
      <NavMenu />
      <AuthSection />
    </div>
  );
}
