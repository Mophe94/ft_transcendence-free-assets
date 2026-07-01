import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import { AuthSection } from './Login';

const menuLinks = {
  Home: '/Home',
  Play: '/play',
  'How to Play': '/how_to_play',
  Infos: '/contact',
};

function NavMenu() {
  return (
    <div className="nav-menu">
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

export function PrivNavBar() {
  return (
    <div className="priv-nav-bar">
      <NavMenu />
      <AuthSection />
    </div>
  );
}
