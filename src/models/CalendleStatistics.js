const Default = 0;
const STORAGE_KEY = 'calendle-statistics';

// LocalStorage object to store all-up stats
export class CalendleStatistics {
    // private members
    _gamesPlayed
    _gamesWon
    _currentStreak
    _maxStreak
    _lastWinDate
    _lastUpdatedDate
    _winValues

    // constructor instantiates with empty object
    constructor() {
        this.getEmptyStats();
    }

    // getters
    get GamesPlayed() { return this._gamesPlayed; }
    get GamesWon() { return this._gamesWon; }
    get CurrentStreak() { return this._currentStreak; }
    get MaxStreak() { return this._maxStreak; }
    get LastWinDate() { return this._lastWinDate; }
    get LastUpdatedDate() { return this._lastUpdatedDate; }
    get WinValues() { return this._winValues; }

    // setters
    incrementGamesPlayed() { this._gamesPlayed = this._gamesPlayed + 1; return this;}
    incrementGamesWon() { this._gamesWon = this._gamesWon + 1; return this;}
    setCurrentStreak(val) { this._currentStreak = val; return this;}
    setMaxStreak(val) { this._maxStreak = val; return this;}
    setLastWinDate(val) { this._lastWinDate = val; return this;}
    addWinValue(val) { this._winValues.push(val); return this;}
    setLastUpdatedDate() {this._lastUpdatedDate = new Date().toDateString(); return this;}

    resetCurrentStreak() {this._currentStreak = Default; return this;}

    // initialize with data from LocalStorage
    initialize() {
        const data = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
        this._gamesPlayed = data ? data._gamesPlayed : Default;
        this._gamesWon = data ? data._gamesWon : Default;
        this._currentStreak = data ? data._currentStreak : Default;
        this._maxStreak = data ? data._maxStreak : Default;
        this._lastWinDate = data ? data._lastWinDate : undefined;
        this._lastUpdatedDate = data ? data._lastUpdatedDate : undefined;
        this._winValues = data ? data._winValues : [];

        this.update();
        return this;
    }

    // get empty object
    getEmptyStats() {
        this._gamesPlayed = Default;
        this._gamesWon = Default;
        this._currentStreak = Default;
        this._maxStreak = Default;
        this._lastWinDate = undefined;
        this._lastUpdatedDate = undefined;
        this._winValues = [];
        return this;
    }

    // update local storage
    update() {
        this.setLastUpdatedDate();
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this));
        return this;
    }

    // set win statistics
    onWin(date, winValue) {
        // on win, update current streak, max streak, games won, last win date, and winValues
        const currentStreak = this.CurrentStreak + 1;
        let maxStreak = this.MaxStreak;
        if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
        } 

        this.setCurrentStreak(currentStreak)
            .setMaxStreak(maxStreak)
            .incrementGamesWon()
            .setLastWinDate(date.toDateString())
            .addWinValue(winValue)
            .update();

        return this;
    }


}