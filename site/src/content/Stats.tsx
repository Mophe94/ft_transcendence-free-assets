
import './Stats.css';
import type { User, UserStats } from '../types/user';
import ImgFrame from '../components/ImgFrame';
import React from 'react';

import unitPic from '../assets/Units/Unit_05.png';
import trojanLogo from '../assets/coalitions/trojan_logo.png';
import spartanLogo from '../assets/coalitions/spartan_logo.png';
import athenianLogo from '../assets/coalitions/athenian_logo.png';


interface StatsProps {
  user: User | null;
  stats: UserStats | null;
}

export default function Stats({ user, stats }: StatsProps) {

  if (!user || !stats) return null;

  const getCoalition = (id: number) => {
    switch(id) {
      case 52: return 'The Spartans';
      case 53: return 'The Athenians';
      case 54: return 'The Trojans';
      default: return 'None'
    }
  }
  const statistics = {
    'Games played': stats.gamesPlayed,
    'PvP win': stats.gamesWon,
    'PvPlost': stats.gamesLost,
    'Total Damage Inflicted': stats.totalDamageDealt,
    'Total Damage Receievd': stats.totalDamageReceived,
    'Discovered monsters': `${stats.nbMonstersDiscovered} / ??`,
    'Discovered objects': `${stats.nbObjectsDiscovered} / ??`,
    'Achievements': `${stats.nbAchievements} / ??`,
  };

  const coalitionName = getCoalition(user.coalitionId);
  let [coalLogo, color] = ['', ''];

  if (user.coalitionId == 52) {
    coalLogo = spartanLogo;
    color = 'spartan';
  } else if (user.coalitionId == 53) { 
    coalLogo = athenianLogo;
    color = 'athenian';
  } else if (user.coalitionId == 54) {
    coalLogo = trojanLogo;
    color = 'trojan';
  }

  return (
    <>
      {coalLogo && <img src={coalLogo} className={`coalLogo ${user.coalitionId !== 0 ? 'visible': 'invisible'}`} />}
      <div className="stats-content-layout">
        <div className='stats-header'>
          <div className="stats-title heading-large centered">
            Profile
          </div>
        </div>
        <div className="user-profile-pic">
          <ImgFrame
            imgSrc={user.avatarUrl ? user.avatarUrl: unitPic }
            imgAlt="avatar-pic"
            color={color}
          />
        </div>
        <div className="user-info">
          <div className="info-label">Username:</div>
          <div className="info-value">{user.username}</div>
          <div className="info-label bold">Email:</div>
          <div className="info-value">{user.email}</div>
          <div className="info-label bold">Title:</div>
          <div className="info-value">MonsterMaster</div>
          <div className="info-label bold">Coalition:</div>
          <div className={`info-value ${color}`}>{coalitionName}</div>
          <div className="info-label">Created:</div>
          <div className="info-value">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</div>
        </div>

        <div id="stats-title" className="heading-medium">Stats</div>
        <div className="stats-info">
          {Object.entries(statistics).map(([key, value]) => (
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
