class Ship {
    constructor(name, length) {
        this.name = name
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


export{Ship}