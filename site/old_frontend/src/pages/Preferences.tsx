import React, { useEffect, useState } from 'react'
import './Preferences.css'
import type { Settings } from '../types/user'
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ALLOWED_THEMES = ['light', 'dark', 'aqua'];
const STARTERS = [
    "./src/assets/images/starters/owlet_monster.gif",
    "./src/assets/images/starters/pink_monster.gif",]

export function Preferences() {
    const [settings, setSettings] = useState<Settings | null> (null);
    const [starter_id, setStarter] = useState<number> (0);
    const [_, setIsSaving] = useState(false);
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();

    useEffect (() => {
        if (!user?.username) { return;}
        fetch(`${import.meta.env.VITE_USERS_SERVICE}/settings/${user.username}`, {
            method: 'GET',
            credentials: 'include',
        })
        .then(res => res.json())
        .then(data => {
            setSettings(data.settings);
            if (data.settings) {
                if (data.settings.theme && ALLOWED_THEMES.includes(data.settings.theme)) {
                    setTheme(data.settings.theme);
                }
                if (data.settings.starter !== null) {
                    setStarter(data.settings.starter);
                }
            }
        })
        .catch(() => {return null;})
    }, [user?.username, setTheme])

    if (!user) {
        return (
            <div>Loading...</div>
        )
    }

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTheme(event.target.value);
    }
    const handleStarterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setStarter(Number(event.target.value));
    }

    const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        event.preventDefault();
        if (!settings) {
            return;
        }
        setIsSaving(true);

        const updatedSettingsPayload = {
            settings: {
                ...settings,
                id: settings.id,
                theme: theme,
                starter: starter_id,
            }
        };
        try {
            const response = await fetch(`${import.meta.env.VITE_USERS_SERVICE}/settings/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(updatedSettingsPayload),
            });

            if (!response.ok) {
                throw new Error("Update Failed");
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
        <div className='setting-container'>
            <form id='preferences-form' onSubmit={handleSubmit}>
                <div className='setting-grid'>
                    <div className=''>Theme:</div>
                    <div>
                        <select value={theme} onChange={handleThemeChange}>
                            {ALLOWED_THEMES.map((t) => (
                                <React.Fragment key={t} >
                                    <option value={t} >{ t }</option>
                                </React.Fragment>
                            ))}
                        </select>
                    </div>
                    
                    <div>Starter:</div>
                    <div className="starter-cell">
                        <select value={starter_id} onChange={handleStarterChange}>
                            {STARTERS.map((_, index) => (
                                <React.Fragment key={index} >
                                    <option value={ index} >{ index }</option>
                                </React.Fragment>
                            ))}
                        </select>
                        <img src={starter_img}/></div>
                    <button className='reset-button'>Reset</button>
                    <button className="save-button" type="submit">Save</button>
                </div>
            </form>
        </div>
    )
}