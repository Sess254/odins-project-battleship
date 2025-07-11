const optionsContainer = document.querySelector('.options_container')
const flipBtn = document.querySelector('#flip_btn')
const gamesBoardContainer = document.querySelector('#gamesboards_container')

let angle = 0

let width = 10


// functions flips the ships options for player to place
function flip() {
    const optionShips = Array.from(optionsContainer.children)
        angle = angle === 0 ? 90 : 0
        optionShips.forEach(optionShip => {
            optionShip.style.transform =  `rotate(${angle}deg)`
        })
}

flipBtn.addEventListener('click', flip)



// function creates the gameboards

function createGameBoard(user, color) {
    const gameBoardContainer = document.createElement('div')
    gameBoardContainer.classList.add('game_board')
    gameBoardContainer.style.backgroundColor  = color
    gameBoardContainer.id = user

    gamesBoardContainer.append(gameBoardContainer)

    for (let i = 0; i < width * width; i++) {
        const block = document.createElement('div')
        block.classList.add('block')
        block.id = i
        gameBoardContainer.append(block)
    }
}


createGameBoard('player', 'turquoise')
createGameBoard('computer', 'green')


// create ships

class Ship {
    constructor(name, length) {
        this.name = name
        this.length = length

    }
}

const destroyer = new Ship('destroyer', 2)
const submarine = new Ship('submarine', 3)
const cruiser = new Ship('cruiser', 3)
const battleship = new Ship('battleship', 4)
const carrier = new Ship('carrier', 5)

const ships = [destroyer, submarine, cruiser, battleship, carrier]

// adds ships on the game boards
function addShipPiece(ship) {
    const allBoardBlocks = document.querySelectorAll('#computer div')
    let randomBoolean = Math.random() < 0.5
    let isHorizontal = randomBoolean 
    let randomStartIndex = Math.floor(Math.random() * width * width)

    let validStartIndex = isHorizontal ? randomStartIndex <= width * width - ship.length ? randomStartIndex :
        width * width - ship.length :
        randomStartIndex <= width * width - width * ship.length ? randomStartIndex :
        randomStartIndex - ship.length * width + width

    let shipBlocks = []

    console.log(validStartIndex)

    for (let i = 0; i < ship.length; i++) {
        if (isHorizontal) {
            shipBlocks.push(allBoardBlocks[Number(validStartIndex) + i])

        } else {
            shipBlocks.push(allBoardBlocks[Number(validStartIndex) + i * width])
        }
    }

    let valid

    if (isHorizontal) {
        shipBlocks.every((_shipBlock, index) =>
           valid = shipBlocks[0].id % width !== width - (shipBlocks.length - (index + 1)))
    } else {
        shipBlocks.every((_shipBlock, index) =>
            valid = shipBlocks[0].id < 90 + (width * index + 1))
    }

    const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains('taken'))

    if (valid && notTaken) {
        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.add(ship.name)
            shipBlock.classList.add('taken')
        })
    } else {
        addShipPiece(ship)
    }


}

ships.forEach(ship => addShipPiece(ship))