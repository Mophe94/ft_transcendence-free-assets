
import './Stats.css';
import type { User } from '../types/user';
import ShieldFrame from '../components/ShieldFrame';
import ImgFrame from '../components/ImgFrame';
import React from 'react';

interface StatsProps {
  user: User | null;
}

export default function Stats({ user }: StatsProps) {
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
          <ImgFrame
            imgSrc={user?.avatarUrl}
            imgAlt="avatar-pic"
            color='blue'
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
