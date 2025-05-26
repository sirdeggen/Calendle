import React from 'react'
import { getCellClassName } from '../utils/borderClassNames'
import { DaysOfWeek, Months } from '../lib/common'

export const Cell = ({ value, coord, onClickEmptyCell, board, date }) => {
    const currentDate = date.getDate().toString()
    const currentMonth = Months[date.getMonth()]
    const currentDayOfWeek = DaysOfWeek[date.getDay()]

    const isCurrentDateCell = value[0] === currentDate || value[0] === currentMonth || value[0] === currentDayOfWeek;
    const isValidCell = value[1] === 0 || isCurrentDateCell;

    let displayValue = isValidCell || isCurrentDateCell ? value[0] : ''

    const cellClassName = getCellClassName(
        board.map(row => row.map(x => x[1])),
        value[1],
        coord[0],
        coord[1],
        isCurrentDateCell
    )

    const onClick = () => {
        onClickEmptyCell(value, coord[0], coord[1])
    }

    return (
        <div key={value} onClick={onClick} className={cellClassName}>
            {displayValue}
        </div>
    )
}
