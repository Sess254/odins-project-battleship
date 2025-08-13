class Ship {
    constructor(length) {
        this.length = length
        this.hits = 0
    }

    hit() {
        if (this.hits < this.length) {
            this.hits++
        }
    }

    isSunk() {
        return this.hits >= this.length
    }

}

class GameBoard {
    constructor() {
        this.board = Array(10).fill(null).map(() => Array(10).fill(null))
        this.ships = []
        this.missedAttacks = new Set()
        this.hitAttacks = new Set()
    }

    placeShip(ship, x, y, orientation = "horizontal" ) {
        if (!this.canPlaceShip(ship.length, x, y, orientation )) {
            return false
        }

        const coordinates = []
        for (let i = 0; i < ship.length; i++) {
            const newX = orientation === 'horizontal' ? x + i : x
            const newY = orientation === 'vertical' ? y + i : y
            this.board[newY][newX] = ship
            coordinates.push([newX, newY])
        }

        this.ships.push({ship, coordinates})
        return true
    }


    canPlaceShip(length, x, y, orientation = "horizontal") {
        if (orientation === 'horizontal') {
            if (x + length > 10 || y >= 10) return false
            for (let i = 0; i < length; i++) {
                if(this.board[y][x + i] !== null) return false
            }
        } else {
            if (y + length > 10 || x >= 10) return false
            for (let i = 0; i < length; i++) {
                if(this.board[y + i][x] !== null) return false
            }
        }

        return true

    }

    receiveAttack(x, y) {
        const key = `${x},${y}`
        if (this.missedAttacks.has(key) || this.hitAttacks.has(key)) {
            return { alreadyAttacked: true }
        }

        const ship = this.board[y][x]

        if (ship) {
            ship.hit()
            this.hitAttacks.add(key)
            return { hit: true, ship, sunk: ship.isSunk() }
        } else {
            this.missedAttacks.add(key)
            return { hit: false }
        }
    }

    allShipsSunk() {
        return this.ships.every(shipData => shipData.ship.isSunk())
    }

    reset() {
        this.board = Array(10).fill(null).map(() => Array(10).fill(null))
        this.ships = []
        this.hitAttacks.clear()
        this.missedAttacks.clear()
    }
}

class Player {
    constructor(isComputer = false) {
        this.gameboard = new GameBoard()
        this.isComputer = isComputer
        this.availableMoves = []
        if (isComputer) {
            this.initializeAvailableMoves()
        }
    }

    initializeAvailableMoves() {
        this.availableMoves = []
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                this.availableMoves.push([x, y])
            }
        }
    }

    makeMove(enemyGameBoard) {
        if (!this.isComputer || this.availableMoves.length === 0) {
            return null
        }

        const randomIndex = Math.floor(Math.random() * this.availableMoves.length)
        const [x, y] = this.availableMoves.splice(randomIndex, 1)[0]

        return enemyGameBoard.receiveAttack(x, y)
    }

    reset() {
        this.gameboard.reset()
        if (this.isComputer) {
            this.initializeAvailableMoves()
        }
    }
}


const gameController = {
    player: null, // Fixed: was "Player" (capitalized)
    computer: null,
    gameStarted: false,
    currentShipIndex: 0,
    shipTypes: [5, 4, 3, 3, 2],
    shipNames: ['Carrier', 'Battleship', 'Cruiser', 'Submarine', 'Destroyer'],

    init() {
        this.player = new Player(false)
        this.computer = new Player(true)
        this.setupComputerShips() // Fixed: was "setupComputerShip" (missing 's')
        this.renderBoards()
        this.updatePlacementStatus()
    },

    setupComputerShips() {
        const ships = [5, 4, 3, 3, 2]
        ships.forEach(length => {
            let placed = false
            let attempts = 0
            while (!placed && attempts < 100) {
                const x = Math.floor(Math.random() * 10)
                const y = Math.floor(Math.random() * 10)
                const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical'
                const ship = new Ship(length)
                if (this.computer.gameboard.placeShip(ship, x, y, orientation)){
                    placed = true 
                }
                attempts++
            }
        })
    },

    placePlayerShip(x, y) {
        if (this.gameStarted || this.currentShipIndex >= this.shipTypes.length) return

        const length = this.shipTypes[this.currentShipIndex]
        const orientation = document.getElementById('orientation').value
        const ship = new Ship(length)

        if (this.player.gameboard.placeShip(ship, x, y, orientation)) {
            this.currentShipIndex++
            this.updateShipType()
            this.updatePlacementStatus()
            this.renderBoards()

            if (this.currentShipIndex >= this.shipTypes.length) {
                document.getElementById('startButton').disabled = false
                document.getElementById('placementStatus').textContent = "All ships placed! Click Start Game to Begin"
            }
        }
    },

    updateShipType() {
        const shipTypeSelect = document.getElementById('shipType')
        if (this.currentShipIndex < this.shipTypes.length) {
            const length = this.shipTypes[this.currentShipIndex]
            const name = this.shipNames[this.currentShipIndex]

            Array.from(shipTypeSelect.options).forEach((option, index) => {
                const optionLength = this.shipTypes[index]
                const optionName = this.shipNames[index]

                if (index < this.currentShipIndex) {
                    option.textContent = `✓ ${optionName} (${optionLength}) - Placed`
                    option.disabled = true
                } else if (index === this.currentShipIndex) {
                    option.textContent = `${optionName} (${optionLength}) - Current`
                    option.selected = true
                    option.disabled = false
                } else {
                    option.textContent = `${optionName} (${optionLength}) - Waiting`
                    option.disabled = true
                }
            })
        }
    },

    updatePlacementStatus() {
        if (this.currentShipIndex < this.shipTypes.length) {
            const name = this.shipNames[this.currentShipIndex]
            const length = this.shipTypes[this.currentShipIndex]
            document.getElementById('placementStatus').textContent = `Click on the grid to place your ${name} (${length} cells)`
        }
    },

    randomPlacement() {
        this.player.gameboard.reset()
        this.currentShipIndex = 0

        const ships = [5, 4, 3, 3, 2] // Fixed: was "ship"
        ships.forEach(length => {
            let placed = false
            let attempts = 0
            while (!placed && attempts < 100) {
                const x = Math.floor(Math.random() * 10)
                const y = Math.floor(Math.random() * 10)
                const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical' // Fixed: was "* 0.5"
                const ship = new Ship(length)
                if (this.player.gameboard.placeShip(ship, x, y, orientation)) {
                    placed = true
                    this.currentShipIndex++
                }
                attempts++
            }
        })

        document.getElementById('startButton').disabled = false
        document.getElementById('placementStatus').textContent = 'All ships placed! Click Start Game to begin.'
        this.renderBoards()
    },

    startGame() {
        this.gameStarted = true
        document.getElementById('shipPlacement').classList.add('hidden')
        this.updateGameStatus("Game started, click on enemy waters to attack")
    },

    attackComputer(x, y) {
        if (!this.gameStarted) {
            this.updateGameStatus('Please start the game first by placing all your ships!')
            return
        }

        const result = this.computer.gameboard.receiveAttack(x, y)
        if (result.alreadyAttacked) {
            this.updateGameStatus('You already attacked that position!')
            return
        }

        this.renderBoards()

        if (result.hit) {
            if (result.sunk) {
                this.updateGameStatus('Hit and sunk! Your turn again.')
            } else {
                this.updateGameStatus('Hit! Your turn again.')
            }
        } else {
            this.updateGameStatus('Miss! Computer\'s turn...')
            setTimeout(() => this.computerTurn(), 1000)
        }

        if(this.computer.gameboard.allShipsSunk()) {
            this.endGame('Congratulations! You won!')
        }
    },

    computerTurn() {
        const result = this.computer.makeMove(this.player.gameboard)
        if (result) {
            this.renderBoards()

            if (result.hit) {
                if (result.sunk) {
                    this.updateGameStatus('Computer hit and sunk your ship! Computer\'s turn again...')
                    setTimeout(() => this.computerTurn(), 1000)
                } else {
                    this.updateGameStatus('Computer hit your ship! Computer\'s turn again...') // Fixed: was missing "hit"
                    setTimeout(() => this.computerTurn(), 1000)
                }
            } else {
                this.updateGameStatus('Computer missed! Your turn.') // Fixed: was "his.updateGameStatus"
            }

            if (this.player.gameboard.allShipsSunk()) {
                this.endGame('Game Over! Computer won!')
            }
        }
    },

    endGame(message) { // Fixed: added missing parameter
        this.gameStarted = false
        this.updateGameStatus(message + ' Click New Game to play again.')
    },

    resetGame() {
        this.player.reset()
        this.computer.reset()
        this.gameStarted = false
        this.currentShipIndex = 0
                
        this.setupComputerShips()
        this.renderBoards()

        document.getElementById('shipPlacement').classList.remove('hidden')
        document.getElementById('startButton').disabled = true
                
        const shipTypeSelect = document.getElementById('shipType')
        Array.from(shipTypeSelect.options).forEach((option, index) => {
            const length = this.shipTypes[index]
            const name = this.shipNames[index]
            option.textContent = `${name} (${length})`
            option.disabled = false
        })
        shipTypeSelect.selectedIndex = 0

        this.updatePlacementStatus()
        this.updateGameStatus('Place your ships to start the game!')
    },

    updateGameStatus(message) {
        document.getElementById('gameStatus').textContent = message
    },

    renderBoards() {
        this.renderPlayerBoard()
        this.renderComputerBoard()
    },

    renderPlayerBoard() {
        const board = document.getElementById('playerBoard')
        board.innerHTML = ''

        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                const cell = document.createElement('div')
                cell.classList.add('cell')
                cell.dataset.x = x
                cell.dataset.y = y

                const ship = this.player.gameboard.board[y][x]
                const key = `${x},${y}`

                if (ship) { // Only add ship styling if there's a ship
                    cell.classList.add('ship')
                }

                if (this.player.gameboard.hitAttacks.has(key)) {
                    cell.classList.add(ship && ship.isSunk() ? 'sunk' : 'hit')
                    cell.textContent = ship && ship.isSunk() ? '💀' : '💥'
                } else if (this.player.gameboard.missedAttacks.has(key)) {
                    cell.classList.add('miss')
                    cell.textContent = '💧'
                }

                if (!this.gameStarted && this.currentShipIndex < this.shipTypes.length) {
                    cell.addEventListener('click', (e) => {
                        const x = parseInt(e.target.dataset.x)
                        const y = parseInt(e.target.dataset.y)
                        this.placePlayerShip(x, y)
                    })
                }

                board.appendChild(cell)
            }
        }
    },

    renderComputerBoard() {
        const board = document.getElementById('computerBoard')
        board.innerHTML = ''

        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                const cell = document.createElement('div')
                cell.classList.add('cell')
                cell.dataset.x = x
                cell.dataset.y = y 

                const ship = this.computer.gameboard.board[y][x]
                const key = `${x},${y}`

                if (this.computer.gameboard.hitAttacks.has(key)) {
                    cell.classList.add(ship && ship.isSunk() ? 'sunk' : 'hit')
                    cell.textContent = ship && ship.isSunk() ? '💀' : '💥'
                } else if (this.computer.gameboard.missedAttacks.has(key)) { // Fixed: was checking player instead of computer
                    cell.classList.add('miss')
                    cell.textContent = '💧'
                }

                cell.addEventListener('click', (e) => {
                    const x = parseInt(e.target.dataset.x)
                    const y = parseInt(e.target.dataset.y)
                    this.attackComputer(x, y)
                    console.log('clicked')
                })

                board.appendChild(cell)
            }
        }
    }
}

// document.addEventListener('DOMContentLoaded', function() {
//     // Initialize the game
//     gameController.init()
//     setupEventListeners()
    
//     console.log('Battleship game initialized successfully!')
// })

function setupEventListeners() {
    // Random Placement button
    const randomButton = document.getElementById('randomButton');
    if (randomButton) {
        randomButton.addEventListener('click', function() {
            gameController.randomPlacement();
        })
    }
    
    // Start Game button
    const startButton = document.getElementById('startButton');
    if (startButton) {
        startButton.addEventListener('click', function() {
            gameController.startGame();
        })
    }
    
    // Reset Game button
    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            gameController.resetGame();
            console.log('clicked')
        })
    }

}


export{Ship, GameBoard, Player, setupEventListeners, gameController}