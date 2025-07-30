const optionsContainer = document.querySelector('.options_container')
const flipBtn = document.querySelector('#flip_btn')
const gamesBoardContainer = document.querySelector('#gamesboards_container')
const startButton = document.querySelector("#start_btn") 
const turnDisplay = document.querySelector("#turn_display")
const infoDisplay = document.querySelector("#info")

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



// function that gets the validity of selected ship blocks
function getValidity(allBoardBlocks, startIndex, isHorizontal, ship) {
     let validStartIndex = isHorizontal ? startIndex <= width * width - ship.length ? startIndex :
        width * width - ship.length :
        startIndex <= width * width - width * ship.length ? startIndex :
        startIndex - ship.length * width + width

    let shipBlocks = []

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

    return {shipBlocks, valid, notTaken}

}

// function creates the gameboard for each user

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
let notDropped

// adds ships on the game boards
function addShipPiece(user, ship, startId) {
    const allBoardBlocks = document.querySelectorAll(`#${user} div`)
    let randomBoolean = Math.random() < 0.5
    let isHorizontal = user === 'player' ? angle === 0 : randomBoolean 
    let randomStartIndex = Math.floor(Math.random() * width * width)

    let startIndex = startId ? startId : randomStartIndex

    const {shipBlocks, valid, notTaken} = getValidity(allBoardBlocks, startIndex, isHorizontal, ship)


    if (valid && notTaken) {
        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.add(ship.name)
            shipBlock.classList.add('taken')
        })
    } else {

        if (user === 'computer') addShipPiece(user, ship, startId)

        if (user === 'player') notDropped = true
        
    }


}

ships.forEach(ship => addShipPiece('computer', ship))


// place player ship pieces 
const optionShips = Array.from(optionsContainer.children)

let draggedShip

optionShips.forEach(optionShip => optionShip.addEventListener('dragstart', dragStart))
const allPlayerBlocks = document.querySelectorAll("#player div")
allPlayerBlocks.forEach(allPlayerBlock => {
    allPlayerBlock.addEventListener('dragover', dragOver)
    allPlayerBlock.addEventListener('drop', dropShip)

})

function dragStart(e) {
    notDropped = false
    draggedShip = e.target
}

function dragOver(e) {
    e.preventDefault()
    const ship = ships[draggedShip.id]
    highlightArea(e.target.id, ship)
}

function dropShip(e) {
    const startId = e.target.id
    const ship = ships[draggedShip.id]
    addShipPiece('player', ship, startId)
    if (!notDropped) {
        draggedShip.remove()
    }
}


// highlight area for player 
function highlightArea(startIndex, ship) {
    const allBoardBlocks = document.querySelectorAll('#player div')
    let isHorizontal = angle === 0

    const {shipBlocks, valid, notTaken } = getValidity(allBoardBlocks, startIndex, isHorizontal, ship)

    if (valid && notTaken) {
        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.add('hover')
            setTimeout(() => shipBlock.classList.remove('hover'), 500)
        })
    }

}

function startGame() {
    if (optionsContainer.children.length != 0) {
        infoDisplay.textContent = `Please place all your ships first!`
    } else {
        const allBoardBlocks = document.querySelectorAll('#computer div')
        allBoardBlocks.forEach(block => {
            block.addEventListener('click', handleClick)
        })
    }

}


let gameOver = false
let playerTurn
let playerHits = []
let computerHits = []

function handleClick(e) {
    if (!gameOver) {
        if (e.target.classList.contains('taken')) {
            e.target.classList.add('boom')
            infoDisplay.textContent = `You hit the computer's ship`
            let classes = Array.from(e.target.classList)
            classes = classes.filter(className => className !== 'block')
            classes = classes.filter(className => className !== 'boom')
            classes = classes.filter(className => className !== 'taken')
            playerHits.push(...classes)
        }

        if (!e.target.classList.contains('taken')) {
            infoDisplay.textContent = `You Missed!`
            e.target.classList.add('empty')
        }
    }

}


startButton.addEventListener('click', startGame)

