import './NavBar.css'
import {Link} from "react-router"

const menuLinks = {
  "Accueil": "/",
  "Play": "/play",
  "Rules": "/about",
  "Contact": "/contact"
};

function NavBar () {
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
						<a href={url} className="nav-link">
							{name}
						</a>
					</li>
				))}
			</ul>
		);
}

function AuthSection () {
	return (
		<div className='auth-section'>
			<Link to='https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-1b38091db24458e2993e02de67e10e256ae4289d7288b4bcaf59e5729e15df5b&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fauth.hml&response_type=code' className='nav-link'>Login</Link>
		</div>
	);
}

export default NavBar
