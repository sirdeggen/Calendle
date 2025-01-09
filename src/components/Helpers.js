const getBorderClassName = (matrix, val, x, y) => {
    const directions = ['left', 'right', 'top', 'bottom']
    const directionCoords = {
        top: [-1, 0],
        bottom: [1, 0],
        left: [0, -1],
        right: [0, 1],
    }

    let borderClassName = ''

    val &&
    directions.forEach(dir => {
        // const length = Math.max(matrix.length, matrix[0].length);
        const rows = matrix.length
        const cols = matrix[0].length
        const newCoord = [x + directionCoords[dir][0], y + directionCoords[dir][1]]
        if (newCoord[0] < 0 || newCoord[1] < 0 || newCoord[0] >= rows || newCoord[1] >= cols) {
            borderClassName += ' border' + dir
        } else {
            const neighboringVal = matrix[newCoord[0]][newCoord[1]]
            if (neighboringVal !== val) {
                borderClassName += ' border' + dir
            }
        }
    })

    return borderClassName
}

export const getCellClassName = (matrix, val, x, y, isSelected) => {
    // get border
    const borderClassName = getBorderClassName(matrix, val, x, y)

    // get highlight
    const highlightClassName = val ? 'highlight' : ''

    // get selected class name
    const selectedClassName = val && isSelected ? 'red' : ''

    // get height/width
    // let widthClassName = 'widthNoBorder'
    // if (borderClassName.includes('left') || borderClassName.includes('right')) {
    //     if (borderClassName.includes('left') && borderClassName.includes('right')) {
    //         widthClassName = 'widthTwoBorder'
    //     } else {
    //         widthClassName = 'widthOneBorder'
    //     }
    // }

    // let heightClassName = 'heightNoBorder'
    // if (borderClassName.includes('top') || borderClassName.includes('bottom')) {
    //     if (borderClassName.includes('top') && borderClassName.includes('bottom')) {
    //         heightClassName = 'heightTwoBorder'
    //     } else {
    //         heightClassName = 'heightOneBorder'
    //     }
    // }

    const styles = ['cellDimensions', borderClassName, highlightClassName, selectedClassName].join(' ')

    return styles
}
