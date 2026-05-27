import './NavBar.css';
import {AuthSection} from './Login.tsx';
import {Link} from 'react-router-dom';
import React from 'react';

const menuLinks = {
  "Accueil": "/",
  "Play": "/play",
  "Rules": "/about",
  "Contact": "/contact",
  "Test": "/test"
};

export function NavBar () {
	return (
		<div className="navBar">
			<NavMenu />
			<AuthSection />
		</div>
	);
}

function NavMenu () {
		return (
			<ul className="navMenu">
				{Object.entries(menuLinks).map(([name, url]) => (
					<React.Fragment key={name}>
						<li>
							<Link to={url} className="nav-link">
								{name}
							</Link>
						</li>
					</React.Fragment>
				))}
			</ul>
		);
}
