import {Ship, GameBoard} from './script'

describe('Ship', ()=> {
        let ship

        beforeEach(() => {
            ship = new Ship("submarine", 3) 
        })

        test('Initialises ship with corect properties', ()=> {
            expect(ship.type).toBe('submarine')
            expect(ship.length).toBe(3)
        })

        test('registers a hit', () => {
            ship.hit()
            expect(ship.hits).toBe(1)
            expect(ship.sunk).toBe(false)
        })

        test('ship sinks after enough hits', ()=> {
            for (let i = 0; i < 3; i++) {
                ship.hit()
            }
  
            expect(ship.hits).toBe(3)
            expect(ship.sunk).toBe(true)
        })

        test('ship does not resgiter more hits than its length', () =>{
            for (let i = 0; i < 5; i++) {
                ship.hit()
            }
            expect(ship.hits).toBe(3)
            expect(ship.sunk).toBe(true)
        })
})

describe('GameBoard', () => {
    let ship, board

    beforeEach(() => {
        board = new GameBoard()
        ship = new Ship('submarine', 3)
    })

    test('places ships correcetly', () => {
        board.placeShip(ship, [[0,0], [0,1], [0,2]])
        board.placeShip(ship, [[4,0,],[4,1],[4,2]])
        expect(board.ships.length).toBe(2)
    })
})