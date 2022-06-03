import { DaysOfWeek, Months, SHAPES } from '../../lib/common'

export default function date(req, res) {
    const b = req.body.board

    const reducedBoard = b.reduce((a, b) => {
        for (const m of b) {
            a.push(m)
        }
        return a
    }, [])

    // check that the board submitted matches today's date.
    const [boardMonth, boardDate, boardDayOfWeek] = reducedBoard
        .filter(x => x[1] === -1 && x[0] !== 'dead')
        .map(y => y[0])

    const d = new Date()
    const currentDate = d.getDate().toString()
    const currentMonth = Months[d.getMonth()]
    const currentDayOfWeek = DaysOfWeek[d.getDay()]
    const correctDate = currentMonth === boardMonth && currentDate === boardDate && currentDayOfWeek === boardDayOfWeek

    // check that the board contains all required shapes, with no duplicates.
    let containsAllLetters = true
    for (const shape in SHAPES) {
        const boardContains = reducedBoard.filter(x => x[1] === shape).length
        const requiredSize = SHAPES[shape].size
        containsAllLetters = containsAllLetters && requiredSize === boardContains
    }

    // check the board is the correct size
    let boardValid = b.length === 8
    boardValid = boardValid && reducedBoard.length === 56
    boardValid =
        boardValid &&
        JSON.stringify(reducedBoard.map(x => x[0])) ===
            '["Jan","Feb","Mar","Apr","May","Jun","dead","Jul","Aug","Sep","Oct","Nov","Dec","dead",' +
                '"1","2","3","4","5","6","7","8","9","10",' +
                '"11","12","13","14","15","16","17","18","19","20",' +
                '"21","22","23","24","25","26","27","28","29","30","31",' +
                '"Sun","Mon","Tues","Wed","dead","dead","dead","dead","Thurs","Fri","Sat"]'

    const confirmed = correctDate && containsAllLetters && boardValid

    res.json({ confirmed })
}
