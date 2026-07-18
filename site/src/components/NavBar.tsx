import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

import bannerBeg from '../assets/navBar/sword_beg.png';

const menuLinks = {
  'Learn More': '/project',
  'About Us': '/about_us',
  'Contact': '/contact',
};

function NavMenu() {
  return (
    <div className="nav-menu">
      <div className="nav-extreme">
        <img src="src/assets/banner-beg.png" />
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
        <img src="src/assets/banner-end.png" />
      </div>
    </div>
  );
}

export function PublicNavBar() {
  return (
    <div className="PubNavBar">
      <NavMenu />
    </div>
  );
}
