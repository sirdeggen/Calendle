import React, { createContext, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css';
import './styles/borders.css';
import './styles/index.css'; // Import global styles
import { Game } from './components/Game';
import { Header } from './components/Header/Header';
import { CalendleState } from './models/CalendleState';

export const ThemeContext = createContext();

const Home = () => {
    const date = new Date();
    const [statsDialogVisible, setStatsDialogVisible] = React.useState(false);
    const [theme, setTheme] = useState('light');
    const [gameState] = useState(new CalendleState());

    gameState.initialize();

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    const handleSetTheme = (newTheme) => {
        setTheme(newTheme);
        gameState.setDarkMode(newTheme).update();
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
            <Header statsDialogVisible={statsDialogVisible} setStatsDialogVisible={setStatsDialogVisible} />
            <Game key={date.toDateString()} setStatsDialogVisible={setStatsDialogVisible}/>
        </ThemeContext.Provider>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);

const render = (Component) => {
    root.render(
        <React.StrictMode>
            <Component />
        </React.StrictMode>
    );
};

render(Home);

if (module.hot) {
    module.hot.accept('./components/Game', () => {
        const NextApp = require('./components/Game').default;
        render(NextApp);
    });
}
