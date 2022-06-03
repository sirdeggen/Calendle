import React, { useCallback, useEffect, useState } from 'react'
import { Board } from './Board'
import { Shape } from './Shape'
import { TbRotateClockwise2, TbArrowsVertical, TbArrowsHorizontal } from 'react-icons/tb'
import {createGrid, ShapeNames, SHAPES} from '../lib/common'

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
        fetch('/api/date')
            .then(r => r.json())
            .then(({ date }) => {
                const d = new Date(date)
                console.log({ d })
                setDate(d)
                setBoard(createGrid(d))
            })
            .catch(console.log)
    }, [])

    const reset = () => {
        fetch('/api/date')
            .then(r => r.json())
            .then(({ date }) => {
                const d = new Date(date)
                setDate(d)
                setBoard(createGrid(d))
            })
            .catch(console.log)
        setPlacedShapes([])
        setRemainingShapes(ShapeNames)
        setWinner(false)
        setCurrentShape('')
        winner && setCount(0)
    }

    const findWinner = () => {
        if (placedShapes.length === ShapeNames.length && remainingShapes.length === 0) {
            setWinner(true)
        }
    }

    // const move = ({ key }, shape) => {
    //   console.log(key);
    //   if (!winner) {
    //     if (key === "ArrowLeft") {
    //       rotate(currentShape, "left");
    //     } else if (key === "ArrowRight") {
    //       rotate(currentShape, "right");
    //     } else if (key === "ArrowUp") {
    //       rotate(currentShape, "vflip");
    //     } else if (key === "ArrowDown") {
    //       rotate(currentShape, "hflip");
    //     }
    //   }
    // };

    const placeShape = () => {
        if (!winner && currentShape) {
            setPlacedShapes(s => [...s, currentShape])
            setCurrentShape('')
            setCount(count + 1)
            findWinner()
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

    // document.getElementById("game").addEventListener("keydown", move);

    return (
        <div id={'game'}>
            <h1>Calendle</h1>
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
