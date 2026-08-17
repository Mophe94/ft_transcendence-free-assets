import React from 'react';
import { Link } from 'react-router-dom';
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
  'How to play': '/howto',
  Admin: '/admin',
  Readme: '/readme',
  'About us': '/aboutus',
  'admin': '/admin',
};

function NavMenu() {
  const { user } = useAuth();
  const menuLinks = (user)? privateLinks: publicLinks;

  return (
    <div className="nav-vars group nav-menu
        flex items-start h-(--nav-h) flex-auto min-w-0 overflow-hidden" style={swordStyle}>
      <div className="h-full flex-none">
        <img className='h-full w-auto block' src={swordBeg} />
      </div>
      <div className="
        hidden md:flex md:items-center md:justify-center md:flex-none md:overflow-hidden md:box-border
        md:max-w-50 md:px-[0.7vw]
        md:font-rocker md:text-(length:--nav-font) md:text-[rgb(85,85,85)]
        md:[-webkit-text-stroke:1px_black] md:whitespace-nowrap
        md:bg-(image:--sword-mid) md:bg-[round_no-repeat] md:bg-size-[auto_100%] md:bg-center
        h-full
        ">Menu</div>
      {Object.entries(menuLinks).map(([name, url]) => (
        <React.Fragment key={name}>
          <div className="
            h-full flex-none flex items-center justify-center box-border
            px-[0.6vw] min-[481px]:px-[0.4rem]
            bg-(image:--sword-mid) bg-[round_no-repeat] bg-size-[auto_100%] bg-center
            md:max-w-0 md:px-0 md:overflow-hidden md:transition-[max-width,padding-inline] md:duration-450 md:ease-in-out
            md:group-hover:max-w-[320px] md:group-hover:px-[0.7vw]">
            <Link to={url} className="
              font-['Ubuntu',system-ui] text-[rgb(17,17,17)] text-(length:--nav-font) whitespace-nowrap no-underline
              md:font-rocker md:[-webkit-text-stroke:1px_black] md:opacity-0 
              md:transition-opacity md:duration-250 md:delay-100 md:text-[rgb(121,121,121)]
              md:group-hover:opacity-100">
              {name}
            </Link>
          </div>
        </React.Fragment>
      ))}
      <div className="h-full flex-none">
        <img className='h-full w-auto block' src={swordEnd} />
      </div>
    </div>
  );
}

export function NavBar() {
  return (
    <div className="nav-bar w-full flex items-center justify-between box-border
        [--nav-h:8vw] [--nav-font:2.6vw] gap-[1vw] px-[1vw]
        min-[481px]:[--nav-h:clamp(2rem,6vw,5rem)] min-[481px]:[--nav-font:clamp(0.8rem,1.4vw,1.1rem)] min-[480px]:gap-2 min-[481px]:px-2
        md:[--nav-h:clamp(3rem,7vw,8rem)] md:[--nav-font:clamp(1rem,3vw,3rem)] md:gap-[0.8vw] md:px-[0.8vw]">
      <NavMenu />
      <AuthSection />
    </div>
  );
}
