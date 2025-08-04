class Ship {
    constructor(type, length) {
        this.type = type
        this.length = length
        this.hits = 0
        this.sunk = false
    }

    hit() {
        if (this.hits < this.length) {
            this.hits += 1
            this.checkIfSunk()
        }
    }

    checkIfSunk() {
        if (this.hits >= this.length) {
            this.sunk = true
        }
    }

}

class GameBoard {
    constructor(size = 10) {
        this.size = size
        this.ships = []
        this.missedAttacks = []
        this.successfullHits = []

    }

    placeShip(ship, positions) {
        const isWithinBounds = positions.every(([x, y]) => 
            x >= 0 && x < this.size && y >= 0 && y < this.size
        )

        if (!isWithinBounds) {
            throw new Error('Ship placement is out of bounds');
        }

        const isOverlapping = this.ships.some(({positions: existing}) => 
            existing.some(pos => positions.some(p => p[0] === pos[0] && p[1] === pos[1]))
        )

        if (isOverlapping) {
            throw new Error('Ship placement overlaps')
            
        }
        this.ships.push( {ship, positions} )
    }
}


export{Ship, GameBoard}