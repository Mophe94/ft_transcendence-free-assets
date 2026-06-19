import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css'

export function AuthSection() {
    const { user, loading, handleSignout } = useAuth();

    if (loading) {
        return <div>Loading...</div>
    }

    return <div className='auth-section'>
        {user ? (
            <div className='login-container'>
                <div className='username-container'>{user.username}</div>
                <img id='profile-pic' src={user.avatarUrl}></img>
                <ul className='dropdown-menu'>
                    <li><Link to={ "/profile"} className="auth-link">Profile</Link></li>
                    <li><Link to={"/preferences"} className='auth-link'>Settings</Link></li>
                    <li><button onClick={handleSignout} className='auth clean-btn'>Logout</button></li>
                </ul>
            </div> 
        ): (
            <div>
                <a href={import.meta.env.VITE_42_OAUTH_API_LINK}>Login</a>
            </div>
        ) }
    </div>
}<Link to="/ma-page"></Link>