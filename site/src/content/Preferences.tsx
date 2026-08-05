import React, { useEffect, useState } from 'react';
import './Preferences.css';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LeftArrowButton, RightArrowButton } from '../components/buttons/ArrowButtons';
import SaveButton from '../components/buttons/SaveButton';
import ResetButton from '../components/buttons/ResetButton';
import { useNotification } from '../context/NotifContext';
import { useParams } from 'react-router-dom';
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
import sunTheme from '../assets/theme/sun_icon.png';
import moonTheme from '../assets/theme/moon_icon.png';
import pisciner from '../assets/starters/pisciner.gif';


const THEMES = [
  ['light', sunTheme],
  ['dark', moonTheme],
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
  const { username } = useParams();
  const { showNotification } = useNotification();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [starter_id, setStarterId] = useState<number>(0);
  const [theme_id, setThemeId] = useState<number>(0);
  const [avatar_id, setAvatarId] = useState<number>(0);
  const [_, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { setTheme } = useTheme();

  useEffect(() => {
    if (username || !user?.username) {
      return;
    }
    fetch(`${import.meta.env.VITE_USERS_SERVICE}/settings`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("=>",data.settings);
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
  }, [user?.username, username, setTheme]);


  if (username) return ;

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
    console.log("hello", settings);
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
            Settings
          </div>
        </div>

        <div className="settings-grid">
          
          <div className="selection">
            <div className="selection-label heading-medium">Avatar</div>
            <LeftArrowButton onClick={decrAvatarId} disabled={avatar_id === 0}/>
            <img className='selection-img' src={avatar_img} />
            <RightArrowButton onClick={incrAvatarId} disabled={avatar_id === AVATARS.length - 1}/>
          </div>

          <div className="selection">
            <div className="selection-label heading-medium">Starter</div>
            <LeftArrowButton onClick={decrStarterId} disabled={starter_id === 0}/>
            <img className='selection-img' src={starter_img} />
            <RightArrowButton onClick={incrStarterId} disabled={starter_id === STARTERS.length - 1}/>
          </div>
          
          <div className="selection">
            <div className="selection-label heading-medium">Theme</div>
            <LeftArrowButton onClick={decrThemeId} disabled={theme_id === 0}/>
            <img className='selection-img' src={theme_img} />
            <RightArrowButton onClick={incrThemeId} disabled={theme_id === THEMES.length - 1}/>
          </div>
        </div>
        <div className='pref-buttons'>
          <ResetButton onClick={handleReset} />
          <SaveButton onClick={() => {}}/>
        </div>
      </form>
    </div>
  );
}
