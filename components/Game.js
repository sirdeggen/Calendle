import React, { useCallback, useEffect, useState } from 'react'
import { Board } from './Board'
import { Shape } from './Shape'
import { TbRotateClockwise2, TbArrowsVertical, TbArrowsHorizontal } from 'react-icons/tb'
import { createGrid, ShapeNames, SHAPES } from '../lib/common'
import { CalendleStatistics } from '../models/CalendleStatistics';

// todo: on load, if calendle-state.date doesn't match today, reset calendle-state
// on place piece, check last updated date. if today, don't update gamesPlayed. if not today, update games played

// state:
// key: calendle-state: date, count, winner, board, placed shapes
// key: calendle-statistics: gamesPlayed, gamesWon, currentStreak, maxStreak, lastWinDate, lastupdatedDate, values: []

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

    useEffect(() => {
        const today = new Date();
        setDate(today);

        const currentState = JSON.parse(window.localStorage.getItem('calendle-state'));
        if (!currentState || !currentState.count || !currentState.board || currentState.winner === undefined) {
            setBoard(createGrid(today))
        } else {
            // set board, count, winner
            setBoard(currentState.board);
            setCount(currentState.count);
            setWinner(currentState.winner);
            setPlacedShapes(currentState.placedShapes);
            setRemainingShapes(ShapeNames.filter(x => !currentState.placedShapes.includes(x)));
        }

        // on game load - update stats
        if (!currentState || (currentState && currentState.date !== today)) {
            const stats = new CalendleStatistics();
            //JSON.parse(window.localStorage.getItem('calendle-stats'));
            
            // update streak - if last win date != yesterday, reset current streak
            if (stats.LastWinDate !== getYesterdayDateString(date)) {
                stats.resetCurrentStreak().update();
            }

            // const newStats = {
            //     gamesPlayed: stats ? stats.gamesPlayed : 0,
            //     currentStreak: currentStreak,
            //     maxStreak: stats ? stats.maxStreak : 0,
            //     gamesWon: stats ? stats.gamesWon : 0,
            //     lastWinDate: stats ? stats.lastWinDate : undefined,
            //     lastUpdatedDate: today.toDateString()
            // }

            // window.localStorage.setItem('calendle-stats', JSON.stringify(newStats));
        }

    }, [])

    useEffect(() => {
        // when shape is placed, update the current state
        const currentState = window.localStorage.getItem('calendle-state');

        if (count > 0 && (!currentState || (currentState && currentState.count !== count))) {
            const state = {
                date: date.toDateString(),
                count: count,
                winner: winner,
                board: board,
                placedShapes: placedShapes
            };
    
            window.localStorage.setItem('calendle-state', JSON.stringify(state));
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
        console.log({ placedShapes, remainingShapes, no: ShapeNames.length })
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
                    onWin(confirmed)
                    console.log({ confirmed })
                })
        }
    }

    const onWin = (confirmed) => {
        if (confirmed) {
            setWinner(confirmed)
            const stats = new CalendleStatistics().onWin(date, count+1);
            //JSON.parse(window.localStorage.getItem('calendle-stats'));
            
            // if lastWinDate = yesterday - increase currentStreak and maxStreak by 1
            // gamesPlayed, gamesWon, currentStreak, maxStreak, lastWinDate, values: []

            // const currentStreak = stats.CurrentStreak + 1;
            // let maxStreak = stats.MaxStreak;
            // if (currentStreak > maxStreak) {
            //     maxStreak = currentStreak;
            // } 

            // stats.setCurrentStreak(currentStreak)
            //     .setMaxStreak(maxStreak)
            //     .setGamesWon(stats.GamesWon + 1)
            //     .setLastWinDate(date.toDateString())
            //     .update();

            // const newStats = {
            //     gamesPlayed: stats ? stats.gamesPlayed : 1,
            //     currentStreak: currentStreak,
            //     maxStreak: maxStreak,
            //     gamesWon: stats && stats.gamesWon ? stats.gamesWon + 1 : 1,
            //     lastWinDate: date.toDateString()
            // }

            // window.localStorage.setItem('calendle-stats', JSON.stringify(newStats));
        }
    }

    const placeShape = () => {
        console.log({ winner, placedShapes })
        if (!winner && currentShape) {
            setPlacedShapes(s => {
                console.log({ s, currentShape })
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
