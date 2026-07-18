import React, { useEffect, useState } from 'react';
import './Stats.css';
import type { User } from '../types/user';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import ShieldFrame from '../components/ShieldFrame';


export default function Stats() {
  let { username } = useParams<{ username?: string }>();
  const { user } = useAuth();
  if (!user) {
    return null;
  }
  if (!username) {
    username = user?.username;
  }

  return <ProfileBody username={username} />;
}

interface ProfileBodyProps {
  username: string;
}

export function ProfileBody({ username }: ProfileBodyProps) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_USERS_SERVICE}/profile/${username}`, {
      method: 'Get',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        return null;
      });
  }, [username]);

  if (!user || !user.stats) return null;

  const stats = {
    Stats: '',
    'Number of games played': user.stats.nb_fights,
    'Number of games won': user.stats.nb_victories,
    'Number of games lost': user.stats.nb_defeats,
    'Total Damage': user.stats.total_damage_given,
    'Discovered monsters': `${user.stats.nb_monsters_discovered} / ??`,
    'Discovered objects': `${user.stats.nb_objects_discovered} / ??`,
    Achievements: `${user.stats.nb_achievements} / ??`,
  };

  return (
    <div className="stats-content-layout">
      <div className='stats-header'>
        <div className="stats-title heading-large centered">
          Profile
        </div>
      </div>
      <div className="stats-table">
        <div className="top-left">
          <ShieldFrame
            imgSrc={user?.avatarUrl}
            imgAlt="avatar-pic"
          />
        </div>

        <div className="user-info">
          <div className="text-medium bold">Username:</div>
          <div className="text-medium">{user?.username}</div>
          <div className="text-medium bold">Email:</div>
          <div className="text-medium">{user?.email}</div>
          <div className="text-medium bold">Title:</div>
          <div className="text-medium">MonsterMaster</div>
        </div>

        <div className="content-table">
          {Object.entries(stats).map(([key, value]) => (
            <React.Fragment key={key}>
              <div className="text-medium key">{key}:</div>
              <div className="text-medium value">{value}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
