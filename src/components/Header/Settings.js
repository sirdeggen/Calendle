import React, { useContext } from 'react';
import { ThemeContext } from '../../index';
import { InputSwitch } from 'primereact/inputswitch';
import '../../styles/settings.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';

export const Settings = () => {
    const { theme, setTheme } = useContext(ThemeContext);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="settings-container">
            <div className="settings-item">
                <label htmlFor="theme-switch" className="theme-label">Dark Mode</label>
                <InputSwitch id="theme-switch" checked={theme === 'dark'} onChange={toggleTheme} />
            </div>
            {/* Add more settings items here */}
        </div>
    );
};