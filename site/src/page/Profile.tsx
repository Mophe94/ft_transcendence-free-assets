import { useEffect, useState } from 'react';
import './Profile.css'
import Stats from '../content/Stats';
import Preferences from '../content/Preferences';
import ErrorDisplay from '../content/Error';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../content/Loading';
import type { UserStats, User } from '../types/user';
import RegularBG from '../background/RegularBg';


export default function Profile() {
  const { username } = useParams();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [error, setError] = useState<{msg: string; code: number} | null>(null);
  const [loading, setLoading] = useState(true);

  const targetUsername = username || user?.username;

  useEffect(() => {
    if (!targetUsername) return;
    fetch(`${import.meta.env.VITE_USERS_SERVICE}/profile/${targetUsername}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data && data.user && data.stats) {
          setUserProfile(data.user);
          setUserStats(data.stats)

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
  }, [targetUsername]);

  if (!targetUsername) {
    return <ErrorDisplay msg="User not found" code={404} />;
  }
  if (loading) return <Loading />;

  if (error) {
    return <ErrorDisplay msg={error.msg} code={error.code} />;
  }

  return (
    <RegularBG>
      <div id='profile-layout'>
        <Stats user={ userProfile } stats={ userStats }/>
        <Preferences />
      </div>
    </RegularBG>
  );
}
