const Default = 0;
const STORAGE_KEY = 'calendle-state';

// LocalStorage object to store today's game state
export class CalendleState {
    // private members
    _date
    _count
    _winner
    _board
    _placedShapes
    _darkMode

    // constructor instantiates with empty object
    constructor() {
        this.getEmptyState();
    }

    // getters
    get Date() { return this._date; }
    get Count() { return this._count; }
    get Winner() { return this._winner; }
    get Board() { return this._board; }
    get PlacedShapes() { return this._placedShapes; }
    get DarkMode() { return this._darkMode; }

    // setters
    setDate(val) { this._date = val; return this;}
    incrementCount() { this._count = this._count + 1; return this;}
    setWinner(val) { this._winner = val; return this;}
    setBoard(val) { this._board = val; return this;}
    setPlacedShapes(val) { this._placedShapes = val; return this;}
    setDarkMode(val) { this._darkMode = val; return this;}

    // initializes object with data from LocalStorage
    initialize() {
        const data = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
        this._date = data ? data._date : Default;
        this._count = data ? data._count : Default;
        this._winner = data ? data._winner : Default;
        this._board = data ? data._board : Default;
        this._placedShapes = data ? data._placedShapes : [];
        this._darkMode = data ? data._darkMode : false;

        this.update();
        return this;
    }

    // get empty object
    getEmptyState() {
        this._date = new Date().toDateString();
        this._count = 0;
        this._winner = false;
        this._board = [];
        this._placedShapes = [];
        this._darkMode = false;
        return this;
    }

    // update localStorage
    update() {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this));
        return this;
    }

    // reset to empty state
    reset() {
        this.getEmptyState().update();
        return this;
    }

    // set winner
    onWin() {
        this.setWinner(true).update();
        return this;
    }
}