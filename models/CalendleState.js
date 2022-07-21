const Default = 0;
const STORAGE_KEY = 'calendle-state';

export class CalendleState {
    _date
    _count
    _winner
    _board
    _placedShapes

    constructor() {
        this.getEmptyState();
    }

    get Date() { return this._date; }
    get Count() { return this._count; }
    get Winner() { return this._winner; }
    get Board() { return this._board; }
    get PlacedShapes() { return this._placedShapes; }

    setDate(val) { this._date = val; return this;}
    incrementCount() { this._count = this._count + 1; return this;}
    setWinner(val) { this._winner = val; return this;}
    setBoard(val) { this._board = val; return this;}
    setPlacedShapes(val) { this._placedShapes = val; return this;}

    initialize() {
        const data = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
        this._date = data ? data._date : Default;
        this._count = data ? data._count : Default;
        this._winner = data ? data._winner : Default;
        this._board = data ? data._board : Default;
        this._placedShapes = data ? data._placedShapes : [];

        this.update();
        return this;
    }

    getEmptyState() {
        this._date = new Date().toDateString();
        this._count = 0;
        this._winner = false;
        this._board = [];
        this._placedShapes = [];
    }

    update() {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this));
    }

    reset() {
        this.getEmptyState();
        return this.update();
    }

    onWin() {
        this.setWinner(true).update();
    }

}