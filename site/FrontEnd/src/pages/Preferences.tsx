import React, { useEffect, useState } from 'react'
import './Preferences.css'
import type { Settings } from '../types/user'
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ALLOWED_THEMES = ['light', 'dark', 'aqua'];

export function Preferences() {
    const [settings, setSettings] = useState<Settings | null> (null);
    const [isSaving, setIsSaving] = useState(false);
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();

    useEffect (() => {
        if (!user?.username) { return;}
        fetch(`${import.meta.env.VITE_API_BASE_URL}/settings/${user.username}`, {
            method: 'GET',
            credentials: 'include',
        })
        .then(res => res.json())
        .then(data => {
            setSettings(data.settings);
            if (data.settings?.theme && ALLOWED_THEMES.includes(data.settings.theme)) {
                setTheme(data.settings.theme);
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
                theme: theme
            }
        };
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/settings/update`, {
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
                    <div>{settings?.starter}</div>
                    <button>Reset</button>
                    <button type="submit">Save</button>
                </div>
            </form>
        </div>
    )
}