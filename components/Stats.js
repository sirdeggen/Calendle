import React from 'react';

export const Stats = () => {

    const stats = window.localStorage;
    const played = stats.length;

    return (
        <div>
            Games played: {played}
        </div>
    )
}