export const ShapeNames = ['H', 'I', 'L', 'T', 'S', 'N', 'P', 'Z', 'V', 'F']
export const DaysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']
export const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const InitialBoard = [
    [Months[0], Months[1], Months[2], Months[3], Months[4], Months[5], 'dead'],
    [Months[6], Months[7], Months[8], Months[9], Months[10], Months[11], 'dead'],
    ['1', '2', '3', '4', '5', '6', '7'],
    ['8', '9', '10', '11', '12', '13', '14'],
    ['15', '16', '17', '18', '19', '20', '21'],
    ['22', '23', '24', '25', '26', '27', '28'],
    ['29', '30', '31', DaysOfWeek[0], DaysOfWeek[1], DaysOfWeek[2], DaysOfWeek[3]],
    ['dead', 'dead', 'dead', 'dead', DaysOfWeek[4], DaysOfWeek[5], DaysOfWeek[6]],
]

export const createGrid = (date) => {
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

export const SHAPES = {
    I: {
        matrix: [['I'], ['I'], ['I'], ['I']],
    },
    L: {
        matrix: [
            ['L', 0, 0],
            ['L', 0, 0],
            ['L', 'L', 0],
        ],
    },
    T: {
        matrix: [
            ['T', 'T', 'T'],
            [0, 'T', 0],
            [0, 'T', 0],
        ],
    },
    S: {
        matrix: [
            ['S', 'S', 0],
            [0, 'S', 0],
            [0, 'S', 'S'],
        ],
    },
    N: {
        matrix: [
            ['N', 'N', 'N'],
            ['N', 0, 'N'],
            [0, 0, 0],
        ],
    },
    P: {
        matrix: [
            ['P', 'P'],
            ['P', 'P'],
            ['P', 0],
        ],
    },
    Z: {
        matrix: [
            ['Z', 0],
            ['Z', 'Z'],
            [0, 'Z'],
        ],
    },
    V: {
        matrix: [
            ['V', 0, 0],
            ['V', 0, 0],
            ['V', 'V', 'V'],
        ],
    },
    F: {
        matrix: [
            ['F', 'F'],
            ['F', 0],
            ['F', 0],
            ['F', 0],
        ],
    },
    H: {
        matrix: [
            ['H', 0],
            ['H', 'H'],
            [0, 'H'],
            [0, 'H'],
        ],
    },
}

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
    let widthClassName = 'widthNoBorder'
    if (borderClassName.includes('left') || borderClassName.includes('right')) {
        if (borderClassName.includes('left') && borderClassName.includes('right')) {
            widthClassName = 'widthTwoBorder'
        } else {
            widthClassName = 'widthOneBorder'
        }
    }

    let heightClassName = 'heightNoBorder'
    if (borderClassName.includes('top') || borderClassName.includes('bottom')) {
        if (borderClassName.includes('top') && borderClassName.includes('bottom')) {
            heightClassName = 'heightTwoBorder'
        } else {
            heightClassName = 'heightOneBorder'
        }
    }

    const styles = [borderClassName, highlightClassName, widthClassName, heightClassName, selectedClassName].join(' ')

    return styles
}
