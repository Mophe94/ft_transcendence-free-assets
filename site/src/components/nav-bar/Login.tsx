import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

import genericAvatar from '../../assets/Units/Unit_05.png';

export function AuthSection() {
  const { user, isLoading, handleSignout } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;

  }

  return (
    <div className="auth-section">
      {user ? (
        <div className="login-container">
          <div className="username-container">{user.username}</div>
          
          <img id="profile-pic" src={user.avatarUrl ? user.avatarUrl: genericAvatar} />
          <ul id="dropdown-menu">
            <li>
              <Link to={'/profile'} className="auth-link">
                Profile
              </Link>
            </li>
            <li>
              <button onClick={handleSignout} className="auth-link clean-btn">
                Logout
              </button>
            </li>
          </ul>
        </div>
      ) : (
        <div className='login-container'>
          <a className="login-link" href={import.meta.env.VITE_42_OAUTH_API_LINK}>Login</a>
        </div>
      )}
    </div>
  );
}
