const Default = 0;

export class CalendleStatistics {
    _gamesPlayed
    _gamesWon
    _currentStreak
    _maxStreak
    _lastWinDate
    _lastUpdatedDate
    _winValues

    constructor() {
        this.getCurrentStats();
    }

    get GamesPlayed() { return this._gamesPlayed; }
    get GamesWon() { return this._gamesWon; }
    get CurrentStreak() { return this._currentStreak; }
    get MaxStreak() { return this._maxStreak; }
    get LastWinDate() { return this._lastWinDate; }
    get LastUpdatedDate() { return this._lastUpdatedDate; }
    get WinValues() { return this._winValues; }

    setGamesPlayed(val) { this._gamesPlayed = val; return this;}
    setGamesWon(val) { this._gamesWon = val; return this;}
    setCurrentStreak(val) { this._currentStreak = val; return this;}
    setMaxStreak(val) { this._maxStreak = val; return this;}
    setLastWinDate(val) { this._lastWinDate = val; return this;}
    setLastUpdatedDate(val) { this._lastUpdatedDate = val; return this;}
    setWinValues(val) { this._winValues = val; return this;}

    resetCurrentStreak() {this._currentStreak = Default; return this;}

    getCurrentStats() {
        const stats = JSON.parse(window.localStorage.getItem('calendle-stats'));
        this._gamesPlayed = stats ? stats.gamesPlayed : Default;
        this._gamesWon = stats ? stats.gamesWon : Default;
        this._currentStreak = stats ? stats.currentStreak : Default;
        this._maxStreak = stats ? stats.maxStreak : Default;
        this._lastWinDate = stats ? stats.lastWinDate : undefined;
        this._lastUpdatedDate = stats ? stats.lastUpdatedDate : undefined;
        this._winValues = stats ? stats.winValues : [];
    }

    update() {
        const newStats = {
            gamesPlayed: this._gamesPlayed,
            gamesWon: this._gamesWon,
            currentStreak: this._currentStreak,
            maxStreak: this._maxStreak,
            lastWinDate: this._lastWinDate,
            lastUpdatedDate: this._lastUpdatedDate,
            winValues: this._winValues
        }

        window.localStorage.setItem('calendle-statistics', JSON.stringify(newStats));
    }

    onWin(date, winValue) {
        // on win, update current streak, max streak, games won, last win date, and winValues
        const currentStreak = this.CurrentStreak + 1;
        let maxStreak = this.MaxStreak;
        if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
        } 

        this.setCurrentStreak(currentStreak)
            .setMaxStreak(maxStreak)
            .setGamesWon(this.GamesWon + 1)
            .setLastWinDate(date.toDateString())
            .setWinValues(this.WinValues.push(winValue))
            .update();
    }


}