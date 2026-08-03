import './ProfileToolTip.css'
import { useEffect, useState } from 'react'
import type { User } from '../types/user';
import Stats from '../content/Stats';

interface ToolTipPreps {
    player: string;
}

export default function ProfileToolTip( { player } : ToolTipPreps) {

  const [IsHovered, setIsHovered] = useState<boolean>(false);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [error, setError] = useState<{msg: string; code: number} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_USERS_SERVICE}/profile/${player}`, {
      method: 'GET',
      credentials: 'include',
    })
        .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data && data.user) {
          setProfileUser(data.user);
        } else {
          setError({ msg: "User not found", code: 404 });
        }
      })
      .catch(() => {
        setError({ msg: "User not found", code: 404 });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [player])
  return (
    <>
    <div className='player_container'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
        {player}
        {IsHovered && (<div className='player_data'><Stats {...{ user: profileUser}}/></div>)}
        </div>
    </>
  )
}