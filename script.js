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
            coordinates.push([[newX, newY]])
        }

        this.ships.push( {ship, coordinates} )
        return true
    }


    canPlaceShip(length, x, y, orientation) {
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
        const key = `${x}, ${y}`
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



export{Ship, GameBoard, Player}