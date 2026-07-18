import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

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
          <img id="profile-pic" src={user.avatarUrl} />
          <ul className="dropdown-menu">
            <li>
              <Link to={'/settings'} className="auth-link">
                Settings
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
        <div>
          <a href={import.meta.env.VITE_42_OAUTH_API_LINK}>Login</a>
        </div>
      )}
    </div>
  );
}
