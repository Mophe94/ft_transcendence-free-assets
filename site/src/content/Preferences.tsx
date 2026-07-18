import React, { useEffect, useState } from 'react';
import './Preferences.css';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LeftArrowButton, RightArrowButton } from '../components/buttons/ArrowButtons';
import SaveButton from '../components/buttons/SaveButton';
import ResetButton from '../components/buttons/ResetButton';
import { useNotification } from '../context/NotifContext';
import type { Settings } from '../types/user';

import dinoBlue from '../assets/avatars/DinoBlue.gif';
import dinoGreen from '../assets/avatars/DinoGreen.gif';
import dinoRed from '../assets/avatars/DinoRed.gif';
import dinoYellow from '../assets/avatars/DinoYellow.gif';
import ghost from '../assets/avatars/Ghost.gif';
import ghost02 from '../assets/avatars/Ghost02.gif';
import ghost03 from '../assets/avatars/Ghost03.gif';
import satyr01 from '../assets/avatars/Satyr01.gif';
import satyr02 from '../assets/avatars/Satyr02.gif';
import satyr03 from '../assets/avatars/Satyr03.gif';
import pisciner from '../assets/starters/pisciner.gif';



const THEMES = [
  ['light', 'theme/sun_icon.png'],
  ['dark', 'theme/moon_icon.png'],
];

const AVATARS = [
  ['DinoGreen', dinoGreen],
  ['DinoBlue', dinoBlue],
  ['DinoRed', dinoRed],
  ['DinoYellow', dinoYellow],
  ['Ghost', ghost],
  ['Ghost02', ghost02],
  ['Ghost03', ghost03],
  ['Satyr01', satyr01],
  ['Satyr02', satyr02],
  ['Satyr03', satyr03],
];

const STARTERS = [
  ['pisciner', pisciner]
];

export default function Preferences() {
  const { showNotification } = useNotification();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [starter_id, setStarterId] = useState<number>(0);
  const [theme_id, setThemeId] = useState<number>(0);
  const [avatar_id, setAvatarId] = useState<number>(0);
  const [_, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { setTheme } = useTheme();

  useEffect(() => {
    if (!user?.username) {
      return;
    }
    fetch(`${import.meta.env.VITE_USERS_SERVICE}/settings/${user.username}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setSettings(data.settings);
        if (data.settings) {
          if (data.settings.theme) {
            const tIndex = THEMES.findIndex(([k]) => k === data.settings.theme);
            if (tIndex !== -1) {
              setThemeId(tIndex);
              setTheme(data.settings.theme);
            }
          }
          if (data.settings.starter !== null) {
            setStarterId(data.settings.starter);
          }
          if (data.settings.avatar !== null) {
            const aIndex = AVATARS.findIndex(([k]) => k === data.settings.avatar);
            if (aIndex !== -1) setAvatarId(aIndex);
          }
        }
      })
      .catch(() => {
        return null;
      });
  }, [user?.username, setTheme]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const incrAvatarId = () => {
    if (avatar_id < AVATARS.length - 1) setAvatarId(avatar_id + 1); }
  const decrAvatarId = () => {
    if (avatar_id > 0) setAvatarId(avatar_id - 1);}

  const incrStarterId = () => {
    if (starter_id < STARTERS.length - 1) setStarterId(starter_id + 1); }
  const decrStarterId = () => {
    if (starter_id > 0) setStarterId(starter_id - 1); }

  const incrThemeId = () => {
    if (theme_id < THEMES.length - 1){
      const new_id = theme_id + 1;
      setThemeId(new_id);
      setTheme(THEMES[new_id][0]);
    }
  }
  const decrThemeId = () => {
    if (theme_id > 0) {
      const new_id = theme_id - 1;
      setThemeId(new_id);
      setTheme(THEMES[new_id][0]);
    }
  }

  const handleSubmit = async (
    event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    event.preventDefault();
    if (!settings) {
      return;
    }
    setIsSaving(true);

    const updatedSettingsPayload = {
      settings: {
        ...settings,
        id: settings.id,
        starter: starter_id,
        avatar: AVATARS[avatar_id][0],
        theme: THEMES[theme_id][0]
      },
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_USERS_SERVICE}/settings/update`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(updatedSettingsPayload),
        },
      );

      if (!response.ok) throw new Error('Update Failed');

      const data = await response.json();
      setSettings(data.settings);
      showNotification('Saved Successfully', 'success');
    } catch (error) {
      console.error(error);
      showNotification('Error: saving failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setAvatarId(0);
    setStarterId(0);
    setThemeId(0);
    setTheme('light');
  }

  const starter_img = STARTERS[starter_id] ? STARTERS[starter_id][1] : STARTERS[0][1];
  const avatar_img = AVATARS[avatar_id] ? AVATARS[avatar_id][1] : AVATARS[0][1];
  const theme_img = THEMES[theme_id] ? THEMES[theme_id][1] : THEMES[0][1];
  return (
    <div className="preferences-content-layout">
        <form id="preferences-form" onSubmit={handleSubmit}>
          
          <div className='pref-header'>
            <div className="preferences-title heading-large">
              Preferences
            </div>
            <div className='pref-buttons'>
              <ResetButton onClick={handleReset} />
              <SaveButton onClick={() => {}}/>
            </div>
          </div>

          <div className="settings-grid">
            
            <div className="avatar-selection">
              <div className="heading-medium centered">Avatar:</div>
              <div className='centered aligned'>
                <LeftArrowButton onClick={decrAvatarId} disabled={avatar_id === 0}/>
                <img src={avatar_img} />
                <RightArrowButton onClick={incrAvatarId} disabled={avatar_id === AVATARS.length - 1}/>
              </div>
            </div>

            <div className="avatar-selection">
              <div className="heading-medium centered">Starter:</div>
              <div className='centered aligned'>
                <LeftArrowButton onClick={decrStarterId} disabled={starter_id === 0}/>
                  <img src={starter_img} />
                <RightArrowButton onClick={incrStarterId} disabled={starter_id === STARTERS.length - 1}/>
              </div>
            </div>
            
            <div className="theme-selection">
              <div className="heading-medium centered">Theme:</div>
              <div>
                <div className='centered aligned'>
                  <LeftArrowButton onClick={decrThemeId} disabled={theme_id === 0}/>
                  <img src={theme_img} />
                  <RightArrowButton onClick={incrThemeId} disabled={theme_id === THEMES.length - 1}/>
                </div>
              </div>
            </div>
          
          </div>
          
        </form>
      </div>
  );
}
