import * as React from 'react'
import { getCellClassName } from './Helpers'

export const Shape = props => {
    const shapes = props.shapes
    const shapeName = props.shapeName

    const shape = shapes[shapeName]

    const setCurrentShape = () => {
        if (props.currentShape === shapeName) {
            props.setRemainingShapes(x => [shapeName, ...x])
            props.setCurrentShape('')
        } else {
            props.setCurrentShape(shapeName)
        }
    }

    const matrix = shape.matrix

    return (
        <div key={shapeName} className={'shape '}>
            {matrix.map((row, x) => {
                return (
                    <div key={'row_' + x} className={'shapeRow'}>
                        {row.map((cell, y) => {
                            const className = getCellClassName(matrix, cell, x, y, props.currentShape === shapeName)
                            return (
                                <div key={cell + '_' + x + '_' + y} className={className} onClick={setCurrentShape} />
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}
