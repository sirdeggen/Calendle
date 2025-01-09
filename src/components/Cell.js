import React from 'react'
import { getCellClassName } from './Helpers'
import { DaysOfWeek, Months, ShapeNames } from '../lib/common'

export const Cell = ({ value, coord, onClickEmptyCell, board, date }) => {
    const currentDate = date.getDate().toString()
    const currentMonth = Months[date.getMonth()]
    const currentDayOfWeek = DaysOfWeek[date.getDay()]

    let displayValue = value[1] === 0 ? value[0] : ''
    let cellClassName = ''

    if (value[0] === currentDate || value[0] === currentMonth || value[0] === currentDayOfWeek) {
        cellClassName = 'cell currentDate'
        displayValue = value[0]
    } else if (ShapeNames.includes(value[1])) {
        cellClassName = getCellClassName(
            board.map(row => row.map(x => x[1])),
            value[1],
            coord[0],
            coord[1],
            false
        )
    } else if (value[1] === -1) {
        cellClassName = 'emptyCell'
    } else {
        cellClassName = 'cell'
    }

    const onClick = () => {
        onClickEmptyCell(value, coord[0], coord[1])
    }

    return (
        <div key={value} onClick={onClick} className={cellClassName}>
            {displayValue}
        </div>
    )
}
