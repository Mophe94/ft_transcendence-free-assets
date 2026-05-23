import './NavBar.css';
import {AuthSection} from './Login.tsx';
import {Link} from 'react-router-dom';

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
					<li>
						<Link to={url} className="nav-link">
							{name}
						</Link>
					</li>
				))}
			</ul>
		);
}
