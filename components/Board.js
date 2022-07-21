import React from 'react'

import { Cell } from './Cell'
import { ShapeNames } from '../lib/common'

export const Board = ({ date, board, currentShape, onPlaceShape, updateBoard, shapes, onRemoveShape, setCurrentShape, winner }) => {
    const onClickEmptyCell = (val, x, y) => {
        // check if space is occupied
        const existingShape = board[x][y][1]

        if (currentShape === '' && ShapeNames.includes(existingShape) && !winner) {
            onRemoveShape(existingShape)
            removeShape(existingShape)
            setCurrentShape(existingShape)
        } else if (currentShape) {
            // check if current shape can be placed
            const shapeMatrix = shapes[currentShape].matrix

            const xValues = []
            const yValues = []

            shapeMatrix.forEach((row, x) => {
                row.forEach((val, y) => {
                    if (val) {
                        xValues.push(x)
                        yValues.push(y)
                    }
                })
            })

            const shapeDimensions = [
                Math.max(...xValues) - Math.min(...xValues) + 1,
                Math.max(...yValues) - Math.min(...yValues) + 1,
            ]

            const shapeStartIndex = [Math.min(...xValues), Math.min(...yValues)]

            // get section of board with same dimensions as shape
            const boardSection = board
                .filter((_, i) => i >= x && i < x + shapeDimensions[0])
                .map(a => a.slice(y, y + shapeDimensions[1]))

            // get section of shape with values
            const shapeSection = shapeMatrix
                .filter((_, i) => i >= shapeStartIndex[0] && i < shapeStartIndex[0] + shapeDimensions[0])
                .map(a => a.slice(shapeStartIndex[1], shapeStartIndex[1] + shapeDimensions[1]))

            // check that the shape can fit in this spot on the board
            const canBePlaced = canIPlaceThisShapeHere(
                boardSection.map(rows => rows.map(x => x[1])),
                shapeSection
            )

            // place shape on board
            if (canBePlaced) {
                placeShape(x, y, shapeSection)
                onPlaceShape()
            }
        }
    }

    const canIPlaceThisShapeHere = (board, shape) => {
        let canBePlaced = true
        if (board.length === 0 || shape.length === 0) {
            return false
        }
        shape.forEach((row, x) => {
            return row.forEach((val, y) => {
                if (val) {
                    const boardRows = board.length
                    const boardCols = board[0].length

                    // check board dimensions
                    if (x >= boardRows || y >= boardCols) {
                        canBePlaced = false
                    } else if (board[x][y] !== 0) {
                        canBePlaced = false
                    }
                }
            })
        })

        return canBePlaced
    }

    const placeShape = (start_x, start_y, shape) => {
        const board_copy = [...board]

        shape.forEach((row, x) => {
            row.forEach((val, y) => {
                if (val) {
                    const new_x = x + start_x
                    const new_y = y + start_y
                    board_copy[new_x][new_y][1] = val
                }
            })
        })

        updateBoard(board_copy)
    }

    const removeShape = shapeName => {
        let board_copy = [...board]

        board_copy = board_copy.map(row => {
            return row.map(col => {
                return col[1] === shapeName ? [col[0], 0] : col
            })
        })

        updateBoard(board_copy)
    }

    const getBoard = () => {
        return board.map((row, x) => {
            return (
                <div className="row" key={'row_' + x}>
                    {row.map((val, y) => {
                        return (
                            <Cell
                                key={x + '_' + y}
                                value={val}
                                onClickEmptyCell={onClickEmptyCell}
                                coord={[x, y]}
                                board={board}
                                date={date}
                            />
                        )
                    })}
                </div>
            )
        })
    }

    return (
        <div>
            <div>{getBoard()}</div>
        </div>
    )
}
