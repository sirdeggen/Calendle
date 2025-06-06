import React, { useContext } from 'react';
import { Dialog } from 'primereact/dialog';
import { Stats } from './Stats';
import { ThemeContext } from '../../App';
import { Settings } from './Settings';
import '../../styles/header.css';

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';

export const Header = ({ statsDialogVisible, setStatsDialogVisible }) => {
    const [helpDialogVisible, setHelpDialogVisible] = React.useState(false);
    const [settingsDialogVisible, setSettingsDialogVisible] = React.useState(false);
    const { theme } = useContext(ThemeContext);

    return (
        <header className={`header ${theme}`}>
            <div className='left'>
                <i className="pi pi-question-circle icon" onClick={() => setHelpDialogVisible(true)}></i>
            </div>
            <div className='center'>
                Calendle
            </div>
            <div className='right'>
                <i className="pi pi-chart-bar icon" onClick={() => setStatsDialogVisible(true)}></i>
                <i className="pi pi-cog icon" onClick={() => setSettingsDialogVisible(true)}></i>
            </div>

            {/* Help Dialog */}
            <Dialog 
                header="How to Play" 
                visible={helpDialogVisible} 
                style={{ width: '50vw' }}
                onHide={() => setHelpDialogVisible(false)}
                className={`p-dialog ${theme}`}
                breakpoints={{'960px': '75vw', '640px': '100vw'}}
            >
                <div>
                    <p>Coming soon!</p>
                </div>
            </Dialog>

            {/* Stats Dialog */}
            <Dialog 
                header="Statistics" 
                visible={statsDialogVisible} 
                style={{ width: '50vw' }}
                onHide={() => setStatsDialogVisible(false)}
                className={`p-dialog ${theme}`}
                breakpoints={{'960px': '75vw', '640px': '100vw'}}
            >
                <div>
                    <Stats />
                </div>
            </Dialog>

            {/* Settings Dialog */}
            <Dialog 
                header="Settings" 
                visible={settingsDialogVisible} 
                style={{ width: '50vw' }}
                onHide={() => setSettingsDialogVisible(false)}
                className={`p-dialog ${theme}`}
                breakpoints={{'960px': '75vw', '640px': '100vw'}}
            >
                <div>
                    <Settings />
                </div>
            </Dialog>
        </header>
    );
};