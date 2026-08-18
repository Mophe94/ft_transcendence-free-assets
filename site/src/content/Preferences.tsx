import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LeftArrowButton, RightArrowButton } from '../components/buttons/ArrowButtons';
import SaveButton from '../components/buttons/SaveButton';
import ResetButton from '../components/buttons/ResetButton';
import { useNotification } from '../context/NotifContext';
import { useParams } from 'react-router-dom';
import type { Settings } from '../types/user';


import sunTheme from '../assets/theme/sun_icon.png';
import moonTheme from '../assets/theme/moon_icon.png';
import pisciner from '../assets/starters/pisciner.gif';
import Heading from '../components/heading/Heading';
import { SKINS } from '../assets/avatars';

const THEMES = [
  ['light', sunTheme],
  ['dark', moonTheme],
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

  if (username) return;

  if (!user) {
    return <div>Loading...</div>;
  }

  const incrSkinId = () => {
    if (avatar_id < SKINS.length - 1) setSkinId(avatar_id + 1);
  };
  const decrSkinId = () => {
    if (avatar_id > 0) setSkinId(avatar_id - 1);
  };

  const incrStarterId = () => {
    if (starter_id < STARTERS.length - 1) setStarterId(starter_id + 1);
  };
  const decrStarterId = () => {
    if (starter_id > 0) setStarterId(starter_id - 1);
  };

  const incrThemeId = () => {
    if (theme_id < THEMES.length - 1) {
      const new_id = theme_id + 1;
      setThemeId(new_id);
      setTheme(THEMES[new_id][0]);
    }
  };
  const decrThemeId = () => {
    if (theme_id > 0) {
      const new_id = theme_id - 1;
      setThemeId(new_id);
      setTheme(THEMES[new_id][0]);
    }
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
      starter: STARTERS[starter_id][0],
      skin: SKINS[avatar_id][0],
      theme: THEMES[theme_id][0],
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
      showNotification('Saved Successfully', 'success');
    } catch {
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
  };

  const starter_img = STARTERS[starter_id] ? STARTERS[starter_id][1] : STARTERS[0][1];
  const avatar_img = SKINS[avatar_id] ? SKINS[avatar_id][1] : SKINS[0][1];
  const theme_img = THEMES[theme_id] ? THEMES[theme_id][1] : THEMES[0][1];

  return (
    <div className="preferences-content-layout">
      <form
        id="preferences-form"
        onSubmit={handleSubmit}
        className="
          grid justify-items-center mt-[clamp(2rem,10vw,5rem)]
          xl:grid-cols-[1fr_3fr_1fr] xl:items-center
        "
      >
        <div className="xl:col-start-2">
          <Heading text="Settings" size="l"/>
        </div>

        <div className="
          justify-items-center
          xl:col-span-3 xl:grid xl:grid-cols-3 xl:gap-20
        ">
          <div className="
            w-full grid grid-cols-[1fr_3fr_1fr] gap-12 items-center justify-items-center
            xl:gap-4
          ">
            <Heading text="Skin" size="m" className="
              row-start-1 col-span-3 my-8
              xl:text-[clamp(4rem,10vw,5rem)]
            "/>
            <LeftArrowButton onClick={decrSkinId} disabled={avatar_id === 0} />
            <img
              className="h-[clamp(2rem,20vw,200px)] xl:h-[clamp(100px,10vw,200px)]"
              src={avatar_img}
              alt="Skin selection"
            />
            <RightArrowButton onClick={incrSkinId} disabled={avatar_id === SKINS.length - 1} />
          </div>

          <div className="
            w-full grid grid-cols-[1fr_3fr_1fr] gap-12 items-center justify-items-center
            xl:gap-4
          ">
            <Heading text="Starter" size="m" className="
              row-start-1 col-span-3 my-8
              xl:text-[clamp(4rem,10vw,5rem)]
            "/>
            <LeftArrowButton onClick={decrStarterId} disabled={starter_id === 0} />
            <img
              className="h-[clamp(2rem,20vw,200px)] xl:h-[clamp(100px,10vw,200px)]"
              src={starter_img}
              alt="Starter selection"
            />
            <RightArrowButton onClick={incrStarterId} disabled={starter_id === STARTERS.length - 1} />
          </div>

          <div className="
            w-full grid grid-cols-[1fr_3fr_1fr] gap-12 items-center justify-items-center
            xl:gap-4
          ">
            <Heading text="Theme" size="m" className="
              row-start-1 col-span-3 my-8
              xl:text-[clamp(4rem,10vw,5rem)]
            "/>
            <LeftArrowButton onClick={decrThemeId} disabled={theme_id === 0} />
            <img
              className=" h-[clamp(2rem,20vw,200px)] xl:h-[clamp(100px,10vw,200px)]"
              src={theme_img}
              alt="Theme selection"
            />
            <RightArrowButton onClick={incrThemeId} disabled={theme_id === THEMES.length - 1} />
          </div>
        </div>
        <div className="
          flex w-full h-[clamp(3rem,8vw,140px)] my-12 flex-row justify-center
          xl:col-start-3 xl:row-start-1 xl:m-0 xl:h-[clamp(2rem,4vw,5rem)] xl:justify-around
        ">
          <ResetButton onClick={handleReset} />
          <SaveButton onClick={() => {}} />
        </div>
      </form>
    </div>
  );
}