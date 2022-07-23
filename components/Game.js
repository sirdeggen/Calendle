import React, { useCallback, useEffect, useState } from 'react'
import { Board } from './Board'
import { Shape } from './Shape'
import { TbRotateClockwise2, TbArrowsVertical, TbArrowsHorizontal } from 'react-icons/tb'
import { createGrid, ShapeNames, SHAPES } from '../lib/common'
import { CalendleStatistics } from '../models/CalendleStatistics';
import { CalendleState } from '../models/CalendleState'

const getYesterdayDateString = (today) => {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1)
    return yesterday.toDateString();
}

export const Game = () => {
    const [date, setDate] = useState(new Date())
    const [board, setBoard] = useState([])
    const [count, setCount] = useState(0)
    const [winner, setWinner] = useState(false)
    const [shapes, setShapes] = useState(SHAPES)
    const [currentShape, setCurrentShape] = useState('')
    const [placedShapes, setPlacedShapes] = useState([])
    const [remainingShapes, setRemainingShapes] = useState(ShapeNames)

    // create empty objects
    const [statistics] = useState(new CalendleStatistics());
    const [gameState] = useState(new CalendleState());

    useEffect(() => {
        const today = new Date();
        setDate(today);

        // initialize from LocalStorage
        statistics.initialize();
        gameState.initialize();

        // if new day or empty board - reset game board and game state
        if (gameState.Date !== today.toDateString() 
        || (gameState.Count === 0 && gameState.Board.length === 0 && gameState.PlacedShapes.length === 0)) {
            setBoard(createGrid(today))
            gameState.reset();

            // update streak - if last win date != yesterday, reset current streak
            if (statistics.LastWinDate !== getYesterdayDateString(date)) {
                statistics.resetCurrentStreak().update();
            }
        } else {
            // set board, count, winner from gameState
            setBoard(gameState.Board);
            setCount(gameState.Count);
            setWinner(gameState.Winner);
            setPlacedShapes(gameState.PlacedShapes);
            setRemainingShapes(ShapeNames.filter(x => !gameState.PlacedShapes.includes(x)));
        }
    }, [])

    useEffect(() => {
        // if first shaped placed today, increment games played
        if (count === 1 && gameState.Count === 0) {
            statistics.incrementGamesPlayed().update();
        }
        
        // when shape is placed, if the count has increased, update game state
        if (count > 0 && gameState.Count !== count) {
            gameState.incrementCount()
                .setWinner(winner)
                .setBoard(board)
                .setPlacedShapes(placedShapes)
                .update();
        }
    }, [count])

    const reset = () => {
        if (!winner) {
            setBoard(createGrid(date))
            setPlacedShapes([])
            setRemainingShapes(ShapeNames)
            setWinner(false)
            setCurrentShape('')
            winner && setCount(0)
        }
    }

    const findWinner = (placedShapes) => {
        if (placedShapes.length === ShapeNames.length && remainingShapes.length === 0) {
            fetch('/api/winCheck', {
                method: 'POST',
                body: JSON.stringify({ board }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
                .then(r => r.json())
                .then(({ confirmed }) => {
                    // on win - set state and update stats
                    setWinner(confirmed)
                    if (winner) {
                        statistics.onWin(date, count+1);
                        gameState.onWin();
                    }
                })
        }
    }

    const placeShape = () => {
        if (!winner && currentShape) {
            setPlacedShapes(s => {
                findWinner([...s, currentShape])
                return [...s, currentShape]
            })
            setCount(count + 1)
            setCurrentShape('')
        }
    }

    const onSelectShape = shapeName => {
        if (!winner) {
            // add current shape back to pile
            const remainingShapes_copy = [...remainingShapes]
            if (currentShape && !placedShapes.includes(currentShape)) {
                remainingShapes_copy.push(currentShape)
            }

            // set new shape
            setCurrentShape(shapeName)
            const i = remainingShapes_copy.findIndex(val => val === shapeName)
            remainingShapes_copy.splice(i, 1)
            setRemainingShapes(remainingShapes_copy)
        }
    }

    const removeShape = shapeName => {
        if (!winner) {
            const placedShapes_copy = [...placedShapes]
            const i = placedShapes_copy.findIndex(val => val === shapeName)
            placedShapes_copy.splice(i, 1)
            setPlacedShapes(placedShapes_copy)

            if (currentShape === shapeName) {
                const remainingShapes_copy = [...remainingShapes]
                remainingShapes_copy.push(shapeName)
                setRemainingShapes(remainingShapes_copy)
            }
        }
    }

    const rotate = (currentShape, dir) => {
        if (!winner && currentShape) {
            const shapeList = { ...shapes }
            const shape = shapeList[currentShape]
            const matrix = shape.matrix

            const x_values_rev = matrix.map((x, i) => i).reverse()
            const length = Math.max(matrix.length, matrix[0].length)

            let newMatrix = Array.from(Array(length), () => {
                return new Array(length).fill(0)
            })

            matrix.forEach((row, y) => {
                return row.forEach((val, x) => {
                    if (dir === 'vflip') {
                        const new_Y = x_values_rev[y]
                        newMatrix[new_Y][x] = val
                    } else if (dir === 'hflip') {
                        const new_Y = x_values_rev[x]
                        newMatrix[y][new_Y] = val
                    } else if (dir === 'right') {
                        const new_Y = x_values_rev[y]
                        newMatrix[x][new_Y] = val
                    } else if (dir === 'left') {
                        const new_Y = x_values_rev[x]
                        newMatrix[new_Y][y] = val
                    }
                })
            })

            shape.matrix = newMatrix

            shapeList[shape] = shape
            setShapes(shapeList)
        }
    }

    return (
        <div id={'game'}>
            {winner && (
                <div>
                    <h1 className="winner">Winner!</h1>
                </div>
            )}
            <h4>{count} moves</h4>
            <div className="boardContainer">
                <div className="board">
                    <Board
                        date={date}
                        board={board}
                        currentShape={currentShape}
                        onPlaceShape={placeShape}
                        shapes={shapes}
                        updateBoard={setBoard}
                        onRemoveShape={removeShape}
                        setCurrentShape={setCurrentShape}
                        winner={winner}
                    />
                </div>
                <div>
                    <div className="buttonContainer">
                        <div>
                            <button onClick={reset}>Reset</button>
                        </div>
                        <div>
                            <button onClick={() => rotate(currentShape, 'left')}>
                                <TbRotateClockwise2 style={{ transform: 'scaleY(-1)' }} />
                            </button>
                            <button onClick={() => rotate(currentShape, 'vflip')}>
                                <TbArrowsVertical />
                            </button>
                            <button onClick={() => rotate(currentShape, 'hflip')}>
                                <TbArrowsHorizontal />
                            </button>
                            <button onClick={() => rotate(currentShape, 'right')}>
                                <TbRotateClockwise2 />
                            </button>
                        </div>
                        <div className="selectedShape">
                            {currentShape && (
                                <Shape
                                    shapes={shapes}
                                    shapeName={currentShape}
                                    setCurrentShape={setCurrentShape}
                                    setRemainingShapes={setRemainingShapes}
                                    currentShape={currentShape}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="shapesContainer">
                {remainingShapes.map(name => {
                    return (
                        <Shape
                            key={name}
                            shapes={shapes}
                            shapeName={name}
                            setCurrentShape={onSelectShape}
                            currentShape={currentShape}
                        />
                    )
                })}
            </div>
        </div>
    )
}
