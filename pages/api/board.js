import { DaysOfWeek, InitialBoard, Months } from '../../lib/common'

export const createGrid = () => {
    const date = new Date()
    const currentDate = date.getDate().toString()
    const currentMonth = Months[date.getMonth()]
    const currentDayOfWeek = DaysOfWeek[date.getDay()]
    return InitialBoard.map(row =>
        row.map((cell, x) => {
            const isFree = cell !== currentDate && cell !== currentMonth && cell !== currentDayOfWeek && cell !== 'dead'
            return [cell, isFree ? 0 : -1]
        })
    )
}
export default function board(req, res) {
    res.json({ board: createGrid() })
}
