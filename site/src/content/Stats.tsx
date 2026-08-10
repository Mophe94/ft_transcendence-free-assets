import type { User, UserStats } from '../types/user';
import ImgFrame from '../components/ImgFrame';
import React from 'react';

import unitPic from '../assets/Units/Unit_05.png';
import trojanLogo from '../assets/coalitions/trojan_logo.png';
import spartanLogo from '../assets/coalitions/spartan_logo.png';
import athenianLogo from '../assets/coalitions/athenian_logo.png';
import Heading from '../components/heading/Heading';

interface StatsProps {
  user: User | null;
  stats: UserStats | null;
}

const coalitionColors: Record<string, string> = {
  trojan: 'text-[rgb(53,92,157)]',
  athenian: 'text-[rgb(26,98,0)]',
  spartan: 'text-[rgb(141,4,2)]',
};

export default function Stats({ user, stats }: StatsProps) {
  if (!user || !stats) return null;

  const getCoalition = (id: number) => {
    switch (id) {
      case 52:
        return 'The Spartans';
      case 53:
        return 'The Athenians';
      case 54:
        return 'The Trojans';
      default:
        return 'None';
    }
  };

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
  let [coalLogo, colorKey] = ['', ''];

  if (user.coalitionId === 52) {
    coalLogo = spartanLogo;
    colorKey = 'spartan';
  } else if (user.coalitionId === 53) {
    coalLogo = athenianLogo;
    colorKey = 'athenian';
  } else if (user.coalitionId === 54) {
    coalLogo = trojanLogo;
    colorKey = 'trojan';
  }

  const coalitionTextColor = coalitionColors[colorKey] || '';

  return (
    <>
      {coalLogo && (
        <img
          src={coalLogo}
          alt="coalition-logo"
          className={`
            invisible h-0
            xl:visible xl:absolute xl:top-0 xl:right-0 xl:h-[clamp(8rem,9vw,10rem)]
            ${user.coalitionId !== 0 ? 'visible' : 'invisible'}
          `}
        />
      )}

      <div className="grid justify-items-center xl:items-center">
        <div className="xl:col-span-2">
          <Heading text='Profile' size='l'/>
        </div>

        <div className="w-[clamp(0px,30vw,400px)] my-8 xl:col-span-1">
          <ImgFrame
            imgSrc={user.avatarUrl ? user.avatarUrl : unitPic}
            imgAlt="avatar-pic"
            color={colorKey}
          />
        </div>


        <div className="
          grid gap-[0.6rem] text-center
          xl:h-min xl:col-start-2 xl:justify-items-start xl:items-center xl:gap-0
        ">
          <div className="mt-4 text-[clamp(0.6rem,3.3vw,3rem)] font-medium xl:text-[2rem] xl:mt-4 xl:mb-0 xl:ml-12">
            Username:
          </div>
          <div className="text-[clamp(0.6rem,3vw,3rem)] xl:text-[1.8rem] xl:ml-[clamp(4rem,5vw,5rem)]">
            {user.username}
          </div>

          <div className="mt-4 text-[clamp(0.6rem,3.3vw,3rem)] font-medium xl:text-[2rem] xl:mt-4 xl:mb-0 xl:ml-12">
            Email:
          </div>
          <div className="text-[clamp(0.6rem,3vw,3rem)] xl:text-[1.8rem] xl:ml-[clamp(4rem,5vw,5rem)]">
            {user.email}
          </div>

          <div className="mt-4 text-[clamp(0.6rem,3.3vw,3rem)] font-medium xl:text-[2rem] xl:mt-4 xl:mb-0 xl:ml-12">
            Title:
          </div>
          <div className="text-[clamp(0.6rem,3vw,3rem)] xl:text-[1.8rem] xl:ml-[clamp(4rem,5vw,5rem)]">
            MonsterMaster
          </div>

          <div className="mt-4 text-[clamp(0.6rem,3.3vw,3rem)] font-medium xl:text-[2rem] xl:mt-4 xl:mb-0 xl:ml-12">
            Coalition:
          </div>
          <div className={`text-[clamp(0.6rem,3vw,3rem)] xl:text-[1.8rem] xl:ml-[clamp(4rem,5vw,5rem)] ${coalitionTextColor}`}>
            {coalitionName}
          </div>

          <div className="mt-4 text-[clamp(0.6rem,3.3vw,3rem)] font-medium xl:text-[2rem] xl:mt-4 xl:mb-0 xl:ml-12">
            Created:
          </div>
          <div className="text-[clamp(0.6rem,3vw,3rem)] xl:text-[1.8rem] xl:ml-[clamp(4rem,5vw,5rem)]">
            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
          </div>
        </div>

        <Heading text='Stats' size='m' className='m-8 xl:col-span-2'/>

        <div className="
          grid gap-[0.6rem] text-center
          xl:col-span-2 xl:w-full xl:grid-cols-2 xl:row-gap-8 xl:col-gap-12
        ">
          {Object.entries(statistics).map(([key, value]) => (
            <React.Fragment key={key}>
              <div className="
                mt-4 text-[clamp(0.6rem,3.3vw,3rem)] font-medium
                xl:text-[2rem] xl:m-0 xl:justify-self-end
              ">
                {key}:
              </div>
              <div className="
                text-[clamp(0.6rem,3vw,3rem)]
                xl:text-[1.8rem] xl:m-0 xl:justify-self-start
              ">
                {value}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}