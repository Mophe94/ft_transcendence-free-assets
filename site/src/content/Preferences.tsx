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

const SKINS = [
  ['dinoGreen', dinoGreen],
  ['dinoBlue', dinoBlue],
  ['dinoRed', dinoRed],
  ['dinoYellow', dinoYellow],
  ['ghost', ghost],
  ['ghost02', ghost02],
  ['ghost03', ghost03],
  ['satyr01', satyr01],
  ['satyr02', satyr02],
  ['satyr03', satyr03],
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
  const [avatar_id, setSkinId] = useState<number>(0);
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
        console.log("=>",data);
        setSettings(data);
        if (data) {
          if (data.theme) {
            const tIndex = THEMES.findIndex(([k]) => k === data.theme);
            if (tIndex !== -1) {
              setThemeId(tIndex);
              setTheme(data.theme);
            }
          }
          if (data.starter !== null) {
            const tIndex = STARTERS.findIndex(([k]) => k === data.starter);
            if (tIndex !== -1) {
              setStarterId(tIndex);
            }
          }
          if (data.skin !== null) {
            const aIndex = SKINS.findIndex(([k]) => k === data.skin);
            if (aIndex !== -1) setSkinId(aIndex);
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
    if (avatar_id < SKINS.length - 1) setSkinId(avatar_id + 1); }
  const decrAvatarId = () => {
    if (avatar_id > 0) setSkinId(avatar_id - 1);}

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
    console.log(starter_id, avatar_id, theme_id)
    console.log(STARTERS[starter_id][0], SKINS[avatar_id][0], THEMES[theme_id][0])
    const updatedSettingsPayload = {
        starter: STARTERS[starter_id][0],
        skin: SKINS[avatar_id][0],
        theme: THEMES[theme_id][0]
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_USERS_SERVICE}/settings/update`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(updatedSettingsPayload),
        },
      );

      if (!response.ok) throw new Error('Update Failed');

      const data = await response.json();
      setSettings(data);
      console.log(data);
      showNotification('Saved Successfully', 'success');
    } catch (error) {
      console.error(error);
      showNotification('Error: saving failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSkinId(0);
    setStarterId(0);
    setThemeId(0);
    setTheme('light');
  }

  const starter_img = STARTERS[starter_id] ? STARTERS[starter_id][1] : STARTERS[0][1];
  const avatar_img = SKINS[avatar_id] ? SKINS[avatar_id][1] : SKINS[0][1];
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
            <RightArrowButton onClick={incrAvatarId} disabled={avatar_id === SKINS.length - 1}/>
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
