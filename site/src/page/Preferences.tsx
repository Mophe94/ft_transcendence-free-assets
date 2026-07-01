import React, { useEffect, useState } from 'react';
import './Preferences.css';
import type { Settings } from '../types/user';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ALLOWED_THEMES = ['light', 'dark'];

const STARTERS = [
  'avatars/Avatars_01.png',
  'avatars/Avatars_02.png',
  'avatars/Avatars_03.png',
  'avatars/Avatars_04.png',
  'avatars/Avatars_05.png',
  'avatars/Avatars_06.png',
  'avatars/Avatars_07.png',
  'avatars/Avatars_08.png',
  'avatars/Avatars_09.png',
  'avatars/Avatars_10.png',
  'avatars/Avatars_11.png',
  'avatars/Avatars_12.png',
  'avatars/Avatars_13.png',
  'avatars/Avatars_14.png',
  'avatars/Avatars_15.png',
  'avatars/Avatars_16.png',
  'avatars/Avatars_17.png',
  'avatars/Avatars_18.png',
  'avatars/Avatars_19.png',
  'avatars/Avatars_20.png',
  'avatars/Avatars_21.png',
  'avatars/Avatars_22.png',
  'avatars/Avatars_23.png',
  'avatars/Avatars_24.png',
  'avatars/Avatars_25.png',
];

export default function Preferences() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [starter_id, setStarter] = useState<number>(0);
  const [_, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

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
          if (
            data.settings.theme &&
            ALLOWED_THEMES.includes(data.settings.theme)
          ) {
            setTheme(data.settings.theme);
          }
          if (data.settings.starter !== null) {
            setStarter(data.settings.starter);
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

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value);
  };

  const handleStarterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStarter(Number(event.target.value));
  };

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

      if (!response.ok) {
        throw new Error('Update Failed');
      }

      const data = await response.json();
      setSettings(data.settings);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };
  const starter_img = STARTERS[starter_id] ? STARTERS[starter_id] : STARTERS[0];
  return (
    <div className="settings-content-layout">
      <div className="settings-upperLeft" />
      <div className="settings-upperMiddle" />
      <div className="settings-upperRight" />

      <div className="settings-middleLeft" />
      <div className="settings-middleMiddle">
        <form id="preferences-form" onSubmit={handleSubmit}>
          <div className="preferences-title heading-large centered">
            Preferences
          </div>
          <div className="settings-grid">
            <div className="avatar-selection">
              <div className="heading-medium centered">Avatar:</div>
              <div className="starter-cell">
                <select value={starter_id} onChange={handleStarterChange}>
                  {STARTERS.map((_, index) => (
                    <React.Fragment key={index}>
                      <option value={index}>{index}</option>
                    </React.Fragment>
                  ))}
                </select>
                <img src={starter_img} />
              </div>
            </div>
            <div className="Starter-selection">
              <div className="heading-medium centered">Starter:</div>
            </div>
            <div className="Starter-selection">
              <div className="heading-medium centered">Theme:</div>
              <div>
                <select value={theme} onChange={handleThemeChange}>
                  {ALLOWED_THEMES.map((t) => (
                    <React.Fragment key={t}>
                      <option value={t}>{t}</option>
                    </React.Fragment>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <button className="reset-button">Reset</button>
          <button className="save-button" type="submit">
            Save
          </button>
        </form>
      </div>
      <div className="settings-middleRight" />

      <div className="settings-bottomLeft" />
      <div className="settings-bottomMiddle" />
      <div className="settings-bottomRight" />
    </div>
  );
}
