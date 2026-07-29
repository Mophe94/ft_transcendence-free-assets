
import './Stats.css';
import type { User } from '../types/user';
import ImgFrame from '../components/ImgFrame';
import React from 'react';

import trojanLogo from '../assets/coalitions/trojan_logo.png'
import spartanLogo from '../assets/coalitions/spartan_logo.png'
import athenianLogo from '../assets/coalitions/athenian_logo.png'


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

  let [coalLogo, color] = ['', ''];

  if (user?.coalition_id == 52) {
    coalLogo = spartanLogo;
    color = 'spartan';
  } else if (user?.coalition_id == 53) { 
    coalLogo = athenianLogo;
    color = 'athenian';
  } else if (user?.coalition_id == 54) {
    coalLogo = trojanLogo;
    color = 'trojan';
  }

  return (
    <>
      <img src={coalLogo} className={`coalLogo ${user.coalition_id ? 'visible': 'invisible'}`} />
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
              color={color}
            />
          </div>

          <div className="user-info">
            <div className="text-medium bold">Username:</div>
            <div className="text-medium">{user?.username}</div>
            <div className="text-medium bold">Email:</div>
            <div className="text-medium">{user?.email}</div>
            <div className="text-medium bold">Title:</div>
            <div className="text-medium">MonsterMaster</div>
            <div className="text-medium bold">Coalition:</div>
            <div className={`text-medium ${color}`}>{user?.coalition_name}</div>
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
    </>
  );
}
