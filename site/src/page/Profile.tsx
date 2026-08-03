import { useEffect, useState } from 'react';
import './Profile.css'
import Stats from '../content/Stats';
import Preferences from '../content/Preferences';
import ErrorDisplay from '../content/Error';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../content/Loading';
import type { User } from '../types/user';
import RegularBG from '../background/RegularBg';


export default function Profile() {
  const { username } = useParams();
  const { user } = useAuth();
  const [profileUser, setProfileUser] = useState<User | null>(null);
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
        // if (!res.ok) {
        //   throw new Error("Utilisateur introuvable");
        // }
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
        <Stats user={profileUser}/>
        <Preferences />
      </div>
    </RegularBG>
  );
}
