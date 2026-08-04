
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
    'Games played': user.stats.nb_fights,
    'PvP win': user.stats.nb_victories,
    'PvPlost': user.stats.nb_defeats,
    'Total Damage Inflicted': user.stats.total_damage_given,
    'Discovered monsters': `${user.stats.nb_monsters_discovered} / ??`,
    'Discovered objects': `${user.stats.nb_objects_discovered} / ??`,
    'Achievements': `${user.stats.nb_achievements} / ??`,
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
        <div className="user-profile-pic">
          <ImgFrame
            imgSrc={user?.avatarUrl}
            imgAlt="avatar-pic"
            color={color}
          />
        </div>
        <div className="user-info">
          <div className="info-label">Username:</div>
          <div className="info-value">{user?.username}</div>
          <div className="info-label bold">Email:</div>
          <div className="info-value">{user?.email}</div>
          <div className="info-label bold">Title:</div>
          <div className="info-value">MonsterMaster</div>
          <div className="info-label bold">Coalition:</div>
          <div className={`info-value ${color}`}>{user?.coalition_name}</div>
        </div>

        <div id="stats-title" className="heading-medium">Stats</div>
        <div className="stats-info">
          {Object.entries(stats).map(([key, value]) => (
            <React.Fragment key={key}>
              <div className="stats-label">{key}:</div>
              <div className="stats-value">{value}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
