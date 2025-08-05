import {Ship, GameBoard} from './script'

describe('Ship', ()=> {
        let ship

        beforeEach(() => {
            ship = new Ship(3) 
        })

        test('Initialises ship with corect properties', ()=> {
            expect(ship.length).toBe(3)
            expect(ship.hits).toBe(0)
        })

        test('registers hits properly', () => {
            ship.hit()
            ship.hit()
            expect(ship.hits).toBe(2)
        })

        test('ship does not sink when not fully hit', ()=> {
            ship.hit()
            ship.hit()
            expect(ship.isSunk()).toBe(false)
        })

        test('ship sinks when it receives enough hits', ()=> {
            for (let i = 0; i < ship.length; i++) {
                ship.hit()
            }
            expect(ship.isSunk()).toBe(true)
        })
})

describe('GameBoard', () => {
    let ship
    let gameBoard

    beforeEach(() => {
        ship = new Ship(3)
        gameBoard = new GameBoard()
    })

    test('can place ships horizonatally', () => {
        const result = gameBoard.placeShip(ship, 0, 0, 'horizontal')
        expect(result).toBe(true)
        expect(gameBoard.board[0][0]).toBe(ship)
        expect(gameBoard.board[0][1]).toBe(ship)
        expect(gameBoard.board[0][2]).toBe(ship)
    })

    test('can ships be placed vertwicaly', ()=> {
        const result = gameBoard.placeShip(ship, 0, 0, 'vertical')
        expect(result).toBe(true)
        expect(gameBoard.board[0][0]).toBe(ship)
        expect(gameBoard.board[1][0]).toBe(ship)
        expect(gameBoard.board[2][0]).toBe(ship)
    })

    test('ship cannot be placed out of bounds', () => {
        const result = gameBoard.placeShip(ship, 8, 0, 'horizontal')
        expect(result).toEqual(false)
    })

    test('Gameboard recieveAttack hits ships', ()=> {
        gameBoard.placeShip(ship, 0, 0, 'horizontal')
        const result = gameBoard.receiveAttack(0, 0)
        expect(result.hit).toBe(true)
        expect(result.ship).toBe(ship)
        expect(ship.hits).toBe(1)
    })

    test('gameboard receives missed empty cells', () => {
        const result = gameBoard.receiveAttack(5, 5)
        expect(result.hit).toBe(false)
        expect(gameBoard.missedAttacks).toEqual(new Set(['5, 5']))

    })

    test('Gameboard allSunkShips returns false with unsunk ships', ()=> {
        gameBoard.placeShip(ship, 0, 0, 'horizontal')
        const result = gameBoard.receiveAttack(0, 0)
        expect(result.hit).toBe(true)
        expect(result.ship).toBe(ship)
        expect(ship.hits).toBe(1)
    })

    test('GameBoard returns true when a ship is sunk', ()=> {
        gameBoard.placeShip(ship, 0, 0, 'horizontal')
        ship.hit()
        ship.hit()
        ship.hit()
        expect(gameBoard.allShipsSunk()).toBe(true)
    })
})