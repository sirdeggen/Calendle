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
export const SHAPES = {
    I: {
        matrix: [['I'], ['I'], ['I'], ['I']],
        size: 4,
    },
    L: {
        matrix: [
            ['L', 0, 0],
            ['L', 0, 0],
            ['L', 'L', 0],
        ],
        size: 4,
    },
    T: {
        matrix: [
            ['T', 'T', 'T'],
            [0, 'T', 0],
            [0, 'T', 0],
        ],
        size: 5,
    },
    S: {
        matrix: [
            ['S', 'S', 0],
            [0, 'S', 0],
            [0, 'S', 'S'],
        ],
        size: 5,
    },
    N: {
        matrix: [
            ['N', 'N', 'N'],
            ['N', 0, 'N'],
            [0, 0, 0],
        ],
        size: 5,
    },
    P: {
        matrix: [
            ['P', 'P'],
            ['P', 'P'],
            ['P', 0],
        ],
        size: 5,
    },
    Z: {
        matrix: [
            ['Z', 0],
            ['Z', 'Z'],
            [0, 'Z'],
        ],
        size: 4,
    },
    V: {
        matrix: [
            ['V', 0, 0],
            ['V', 0, 0],
            ['V', 'V', 'V'],
        ],
        size: 5,
    },
    F: {
        matrix: [
            ['F', 'F'],
            ['F', 0],
            ['F', 0],
            ['F', 0],
        ],
        size: 5,
    },
    H: {
        matrix: [
            ['H', 0],
            ['H', 'H'],
            [0, 'H'],
            [0, 'H'],
        ],
        size: 5,
    },
}

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