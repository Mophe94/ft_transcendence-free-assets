import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import genericAvatar from '../../assets/Units/Unit_05.png';
import { useTheme } from '../../context/ThemeContext';

export function AuthSection() {
  const { user, isLoading, handleSignout } = useAuth();
  const { theme } = useTheme();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="auth-section h-(--nav-h) flex-[0_0_auto]">
      {user && (
        <div
          className="
            group
            relative h-full
            flex items-center gap-2 px-2 box-border
            cursor-pointer
            min-[480px]:gap-[1vw] min-[480px]:px-[1vw]
            md:gap-[0.6vw] md:px-[0.6vw]
            hover:"
          >
          <div className="
            block
            font-ubuntu font-bold text-[#797979] text-(length:--nav-font)
            whitespace-nowrap max-w-[10ch]"
          >
            {user.username}
          </div>
          
          <img
            className='block h-full w-auto aspect-square rounded-[50%] object-cover flex-none'
            src={user.avatarUrl ? user.avatarUrl: genericAvatar}
          />
          <ul className={`
            ${theme.dropMenuColor}
            absolute top-full right-0 m-0 p-[0.4rem_0]
            w-max
            rounded-md invisible opacity-0  group-hover:visible group-hover:opacity-100 group-hover:translate-y-0
            -translate-y-1.5 transition-[opacity,transform,visibility] duration-200 ease-out z-1000
            shadow-[0_4px_10px_#00000026]
          `}>
            <li>
              <Link to={'/profile'}
                className={`
                  block p-[0.5rem_1rem]
                  font-bold font-ubuntu text-(length:--nav-font)
                  ${theme.authLinkColor}
                `}>
                Profile
              </Link>
            </li>
            <li>
              <Link to={'/friends'}
                className={`
                  block p-[0.5rem_1rem]
                  font-bold font-ubuntu text-(length:--nav-font)
                  ${theme.authLinkColor}
                `}>
                Friends
              </Link>
            </li>
            <li>
              <button onClick={handleSignout}
                className={`
                  block p-[0.5rem_1rem]
                  font-bold font-ubuntu text-(length:--nav-font) 
                  ${theme.authLinkColor}
                `}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
