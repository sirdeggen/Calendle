import React from 'react';
import { CalendleState } from '../models/CalendleState';
import { CalendleStatistics } from '../models/CalendleStatistics';

export const Stats = () => {
    const stats = new CalendleStatistics().initialize();
    const currentGame = new CalendleState().initialize();
    const winPercent = Math.round((stats.GamesWon*1.0/stats.GamesPlayed*1.0) * 100) || 0;

    return (
        <div>
            <p><b>This is a beta feature</b></p>
            <p>Games played: {stats.GamesPlayed}</p>
            <p>Games won: {stats.GamesWon}</p>
            <p>Win %: {winPercent}</p>
            <p>Current Streak: {stats.CurrentStreak}</p>
            <p>Max Streak: {stats.MaxStreak}</p>
            <p>Winning values: {stats.WinValues.join(', ')}</p>
            <br />
            <p><b>Current game</b></p>
            <p>Count: {currentGame.Count}</p>
            <p>Has won: {currentGame.Winner.toString()}</p>
        </div>
    )
}