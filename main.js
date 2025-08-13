<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Battleship Game</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            color: white;
            min-height: 100vh;
        }

        h1 {
            text-align: center;
            color: #00d4ff;
            text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
            margin-bottom: 30px;
        }

        .game-container {
            display: flex;
            gap: 40px;
            justify-content: center;
            align-items: flex-start;
            flex-wrap: wrap;
        }

        .player-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .player-title {
            font-size: 1.5em;
            margin-bottom: 15px;
            color: #00d4ff;
        }

        .gameboard {
            display: grid;
            grid-template-columns: repeat(10, 40px);
            grid-template-rows: repeat(10, 40px);
            gap: 2px;
            margin: 20px 0;
            border: 2px solid #00d4ff;
            border-radius: 10px;
            padding: 10px;
            background: rgba(0, 0, 0, 0.3);
        }

        .cell {
            width: 40px;
            height: 40px;
            border: 1px solid #444;
            background: #1a1a2e;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            transition: all 0.3s ease;
            border-radius: 4px;
        }

        .cell:hover {
            background: rgba(0, 212, 255, 0.3);
            transform: scale(1.1);
        }

        .cell.ship {
            background: #4a90e2;
            box-shadow: inset 0 0 10px rgba(74, 144, 226, 0.5);
        }

        .cell.hit {
            background: #e74c3c;
            color: white;
            box-shadow: 0 0 15px rgba(231, 76, 60, 0.7);
        }

        .cell.miss {
            background: #34495e;
            color: #ecf0f1;
        }

        .cell.sunk {
            background: #8b0000;
            color: white;
            box-shadow: 0 0 15px rgba(139, 0, 0, 0.7);
        }

        .controls {
            display: flex;
            flex-direction: column;
            gap: 15px;
            align-items: center;
            margin-top: 20px;
        }

        button {
            background: linear-gradient(45deg, #00d4ff, #0099cc);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 212, 255, 0.4);
        }

        button:disabled {
            background: #666;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .game-status {
            text-align: center;
            font-size: 1.2em;
            margin: 20px 0;
            padding: 15px;
            background: rgba(0, 212, 255, 0.1);
            border-radius: 10px;
            border: 1px solid rgba(0, 212, 255, 0.3);
        }

        .ship-placement {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 20px;
            padding: 15px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
        }

        .ship-controls {
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
            justify-content: center;
        }

        select {
            background: #2c3e50;
            color: white;
            border: 1px solid #00d4ff;
            border-radius: 5px;
            padding: 8px;
        }

        .test-results {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            padding: 20px;
            margin-top: 30px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .test-pass {
            color: #27ae60;
        }

        .test-fail {
            color: #e74c3c;
        }

        .hidden {
            display: none;
        }

        @media (max-width: 768px) {
            .game-container {
                flex-direction: column;
                align-items: center;
            }
            
            .gameboard {
                grid-template-columns: repeat(10, 35px);
                grid-template-rows: repeat(10, 35px);
            }
            
            .cell {
                width: 35px;
                height: 35px;
            }
        }
    </style>
</head>
<body>
    <h1>⚓ Battleship Game ⚓</h1>
    
    <div class="game-status" id="gameStatus">
        Place your ships to start the game!
    </div>

    <div class="game-container">
        <div class="player-section">
            <h2 class="player-title">Your Fleet</h2>
            <div class="ship-placement" id="shipPlacement">
                <div class="ship-controls">
                    <select id="shipType">
                        <option value="5">Carrier (5)</option>
                        <option value="4">Battleship (4)</option>
                        <option value="3">Cruiser (3)</option>
                        <option value="3">Submarine (3)</option>
                        <option value="2">Destroyer (2)</option>
                    </select>
                    <select id="orientation">
                        <option value="horizontal">Horizontal</option>
                        <option value="vertical">Vertical</option>
                    </select>
                    <button onclick="gameController.randomPlacement()">Random Placement</button>
                    <button onclick="gameController.startGame()" id="startButton" disabled>Start Game</button>
                </div>
                <div id="placementStatus">Click on the grid to place your Carrier (5 cells)</div>
            </div>
            <div class="gameboard" id="playerBoard"></div>
        </div>

        <div class="player-section">
            <h2 class="player-title">Enemy Waters</h2>
            <div class="controls">
                <button onclick="gameController.resetGame()">New Game</button>
            </div>
            <div class="gameboard" id="computerBoard"></div>
        </div>
    </div>

    <div class="test-results">
        <h3>Test Results</h3>
        <div id="testOutput"></div>
        <button onclick="runTests()">Run Tests</button>
    </div>

//     <script>
//         // Ship Class
//         class Ship {
//             constructor(length) {
//                 this.length = length;
//                 this.hits = 0;
//             }

//             hit() {
//                 if (this.hits < this.length) {
//                     this.hits++;
//                 }
//             }

//             isSunk() {
//                 return this.hits >= this.length;
//             }
//         }

//         // Gameboard Class
//         class Gameboard {
//             constructor() {
//                 this.board = Array(10).fill(null).map(() => Array(10).fill(null));
//                 this.ships = [];
//                 this.missedAttacks = new Set();
//                 this.hitAttacks = new Set();
//             }

//             placeShip(ship, x, y, orientation = 'horizontal') {
//                 if (!this.canPlaceShip(ship.length, x, y, orientation)) {
//                     return false;
//                 }

//                 const coordinates = [];
//                 for (let i = 0; i < ship.length; i++) {
//                     const newX = orientation === 'horizontal' ? x + i : x;
//                     const newY = orientation === 'vertical' ? y + i : y;
//                     this.board[newY][newX] = ship;
//                     coordinates.push([newX, newY]);
//                 }

//                 this.ships.push({ ship, coordinates });
//                 return true;
//             }

//             canPlaceShip(length, x, y, orientation = 'horizontal') {
//                 if (orientation === 'horizontal') {
//                     if (x + length > 10 || y >= 10) return false;
//                     for (let i = 0; i < length; i++) {
//                         if (this.board[y][x + i] !== null) return false;
//                     }
//                 } else {
//                     if (y + length > 10 || x >= 10) return false;
//                     for (let i = 0; i < length; i++) {
//                         if (this.board[y + i][x] !== null) return false;
//                     }
//                 }
//                 return true;
//             }

//             receiveAttack(x, y) {
//                 const key = `${x},${y}`;
//                 if (this.missedAttacks.has(key) || this.hitAttacks.has(key)) {
//                     return { alreadyAttacked: true };
//                 }

//                 const ship = this.board[y][x];
//                 if (ship) {
//                     ship.hit();
//                     this.hitAttacks.add(key);
//                     return { hit: true, ship, sunk: ship.isSunk() };
//                 } else {
//                     this.missedAttacks.add(key);
//                     return { hit: false };
//                 }
//             }

//             allShipsSunk() {
//                 return this.ships.every(shipData => shipData.ship.isSunk());
//             }

//             reset() {
//                 this.board = Array(10).fill(null).map(() => Array(10).fill(null));
//                 this.ships = [];
//                 this.missedAttacks.clear();
//                 this.hitAttacks.clear();
//             }
//         }

//         // Player Class
//         class Player {
//             constructor(isComputer = false) {
//                 this.gameboard = new Gameboard();
//                 this.isComputer = isComputer;
//                 this.availableMoves = [];
//                 if (isComputer) {
//                     this.initializeAvailableMoves();
//                 }
//             }

//             initializeAvailableMoves() {
//                 this.availableMoves = [];
//                 for (let x = 0; x < 10; x++) {
//                     for (let y = 0; y < 10; y++) {
//                         this.availableMoves.push([x, y]);
//                     }
//                 }
//             }

//             makeMove(enemyGameboard) {
//                 if (!this.isComputer || this.availableMoves.length === 0) {
//                     return null;
//                 }

//                 const randomIndex = Math.floor(Math.random() * this.availableMoves.length);
//                 const [x, y] = this.availableMoves.splice(randomIndex, 1)[0];
                
//                 return enemyGameboard.receiveAttack(x, y);
//             }

//             reset() {
//                 this.gameboard.reset();
//                 if (this.isComputer) {
//                     this.initializeAvailableMoves();
//                 }
//             }
//         }

//         // Game Controller Module
//         const gameController = {
//             player: null,
//             computer: null,
//             gameStarted: false,
//             currentShipIndex: 0,
//             shipTypes: [5, 4, 3, 3, 2],
//             shipNames: ['Carrier', 'Battleship', 'Cruiser', 'Submarine', 'Destroyer'],
            
//             init() {
//                 this.player = new Player(false);
//                 this.computer = new Player(true);
//                 this.setupComputerShips();
//                 this.renderBoards();
//                 this.updatePlacementStatus();
//             },

//             setupComputerShips() {
//                 const ships = [5, 4, 3, 3, 2];
//                 ships.forEach(length => {
//                     let placed = false;
//                     let attempts = 0;
//                     while (!placed && attempts < 100) {
//                         const x = Math.floor(Math.random() * 10);
//                         const y = Math.floor(Math.random() * 10);
//                         const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
//                         const ship = new Ship(length);
//                         if (this.computer.gameboard.placeShip(ship, x, y, orientation)) {
//                             placed = true;
//                         }
//                         attempts++;
//                     }
//                 });
//             },

//             placePlayerShip(x, y) {
//                 if (this.gameStarted || this.currentShipIndex >= this.shipTypes.length) return;

//                 const length = this.shipTypes[this.currentShipIndex];
//                 const orientation = document.getElementById('orientation').value;
//                 const ship = new Ship(length);

//                 if (this.player.gameboard.placeShip(ship, x, y, orientation)) {
//                     this.currentShipIndex++;
//                     this.updateShipType();
//                     this.updatePlacementStatus();
//                     this.renderBoards();
                    
//                     if (this.currentShipIndex >= this.shipTypes.length) {
//                         document.getElementById('startButton').disabled = false;
//                         document.getElementById('placementStatus').textContent = 'All ships placed! Click Start Game to begin.';
//                     }
//                 }
//             },

//             updateShipType() {
//                 const shipTypeSelect = document.getElementById('shipType');
//                 if (this.currentShipIndex < this.shipTypes.length) {
//                     const length = this.shipTypes[this.currentShipIndex];
//                     const name = this.shipNames[this.currentShipIndex];
                    
//                     // Update all options to reflect placement progress
//                     Array.from(shipTypeSelect.options).forEach((option, index) => {
//                         const optionLength = this.shipTypes[index];
//                         const optionName = this.shipNames[index];
                        
//                         if (index < this.currentShipIndex) {
//                             option.textContent = `✓ ${optionName} (${optionLength}) - Placed`;
//                             option.disabled = true;
//                         } else if (index === this.currentShipIndex) {
//                             option.textContent = `${optionName} (${optionLength}) - Current`;
//                             option.selected = true;
//                             option.disabled = false;
//                         } else {
//                             option.textContent = `${optionName} (${optionLength}) - Waiting`;
//                             option.disabled = true;
//                         }
//                     });
//                 }
//             },

//             updatePlacementStatus() {
//                 if (this.currentShipIndex < this.shipTypes.length) {
//                     const name = this.shipNames[this.currentShipIndex];
//                     const length = this.shipTypes[this.currentShipIndex];
//                     document.getElementById('placementStatus').textContent = 
//                         `Click on the grid to place your ${name} (${length} cells)`;
//                 }
//             },

//             randomPlacement() {
//                 this.player.gameboard.reset();
//                 this.currentShipIndex = 0;

//                 const ships = [5, 4, 3, 3, 2];
//                 ships.forEach(length => {
//                     let placed = false;
//                     let attempts = 0;
//                     while (!placed && attempts < 100) {
//                         const x = Math.floor(Math.random() * 10);
//                         const y = Math.floor(Math.random() * 10);
//                         const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
//                         const ship = new Ship(length);
//                         if (this.player.gameboard.placeShip(ship, x, y, orientation)) {
//                             placed = true;
//                             this.currentShipIndex++;
//                         }
//                         attempts++;
//                     }
//                 });

//                 document.getElementById('startButton').disabled = false;
//                 document.getElementById('placementStatus').textContent = 'All ships placed! Click Start Game to begin.';
//                 this.renderBoards();
//             },

//             startGame() {
//                 this.gameStarted = true;
//                 document.getElementById('shipPlacement').classList.add('hidden');
//                 this.updateGameStatus('Game started! Click on enemy waters to attack.');
//             },

//             attackComputer(x, y) {
//                 if (!this.gameStarted) {
//                     this.updateGameStatus('Please start the game first by placing all your ships!');
//                     return;
//                 }

//                 const result = this.computer.gameboard.receiveAttack(x, y);
//                 if (result.alreadyAttacked) {
//                     this.updateGameStatus('You already attacked that position!');
//                     return;
//                 }

//                 this.renderBoards();

//                 if (result.hit) {
//                     if (result.sunk) {
//                         this.updateGameStatus('Hit and sunk! Your turn again.');
//                     } else {
//                         this.updateGameStatus('Hit! Your turn again.');
//                     }
//                 } else {
//                     this.updateGameStatus('Miss! Computer\'s turn...');
//                     setTimeout(() => this.computerTurn(), 1000);
//                 }

//                 if (this.computer.gameboard.allShipsSunk()) {
//                     this.endGame('Congratulations! You won!');
//                 }
//             },

//             computerTurn() {
//                 const result = this.computer.makeMove(this.player.gameboard);
//                 if (result) {
//                     this.renderBoards();
                    
//                     if (result.hit) {
//                         if (result.sunk) {
//                             this.updateGameStatus('Computer hit and sunk your ship! Computer\'s turn again...');
//                             setTimeout(() => this.computerTurn(), 1000);
//                         } else {
//                             this.updateGameStatus('Computer hit your ship! Computer\'s turn again...');
//                             setTimeout(() => this.computerTurn(), 1000);
//                         }
//                     } else {
//                         this.updateGameStatus('Computer missed! Your turn.');
//                     }

//                     if (this.player.gameboard.allShipsSunk()) {
//                         this.endGame('Game Over! Computer won!');
//                     }
//                 }
//             },

//             endGame(message) {
//                 this.gameStarted = false;
//                 this.updateGameStatus(message + ' Click New Game to play again.');
//             },

//             resetGame() {
//                 this.player.reset();
//                 this.computer.reset();
//                 this.gameStarted = false;
//                 this.currentShipIndex = 0;
                
//                 this.setupComputerShips();
//                 this.renderBoards();
                
//                 document.getElementById('shipPlacement').classList.remove('hidden');
//                 document.getElementById('startButton').disabled = true;
                
//                 // Reset ship type select to initial state
//                 const shipTypeSelect = document.getElementById('shipType');
//                 Array.from(shipTypeSelect.options).forEach((option, index) => {
//                     const length = this.shipTypes[index];
//                     const name = this.shipNames[index];
//                     option.textContent = `${name} (${length})`;
//                     option.disabled = false;
//                 });
//                 shipTypeSelect.selectedIndex = 0;
                
//                 this.updatePlacementStatus();
//                 this.updateGameStatus('Place your ships to start the game!');
//             },

//             updateGameStatus(message) {
//                 document.getElementById('gameStatus').textContent = message;
//             },

//             renderBoards() {
//                 this.renderPlayerBoard();
//                 this.renderComputerBoard();
//             },

//             renderPlayerBoard() {
//                 const board = document.getElementById('playerBoard');
//                 board.innerHTML = '';

//                 for (let y = 0; y < 10; y++) {
//                     for (let x = 0; x < 10; x++) {
//                         const cell = document.createElement('div');
//                         cell.className = 'cell';
//                         cell.dataset.x = x;
//                         cell.dataset.y = y;

//                         const ship = this.player.gameboard.board[y][x];
//                         const key = `${x},${y}`;

//                         if (ship) {
//                             cell.classList.add('ship');
//                             if (this.player.gameboard.hitAttacks.has(key)) {
//                                 cell.classList.add(ship.isSunk() ? 'sunk' : 'hit');
//                                 cell.textContent = ship.isSunk() ? '💀' : '💥';
//                             }
//                         } else if (this.player.gameboard.missedAttacks.has(key)) {
//                             cell.classList.add('miss');
//                             cell.textContent = '💧';
//                         }

//                         if (!this.gameStarted && this.currentShipIndex < this.shipTypes.length) {
//                             cell.addEventListener('click', (e) => {
//                                 const x = parseInt(e.target.dataset.x);
//                                 const y = parseInt(e.target.dataset.y);
//                                 this.placePlayerShip(x, y);
//                             });
//                         }

//                         board.appendChild(cell);
//                     }
//                 }
//             },

//             renderComputerBoard() {
//                 const board = document.getElementById('computerBoard');
//                 board.innerHTML = '';

//                 for (let y = 0; y < 10; y++) {
//                     for (let x = 0; x < 10; x++) {
//                         const cell = document.createElement('div');
//                         cell.className = 'cell';
//                         cell.dataset.x = x;
//                         cell.dataset.y = y;

//                         const ship = this.computer.gameboard.board[y][x];
//                         const key = `${x},${y}`;

//                         if (this.computer.gameboard.hitAttacks.has(key)) {
//                             cell.classList.add(ship && ship.isSunk() ? 'sunk' : 'hit');
//                             cell.textContent = ship && ship.isSunk() ? '💀' : '💥';
//                         } else if (this.computer.gameboard.missedAttacks.has(key)) {
//                             cell.classList.add('miss');
//                             cell.textContent = '💧';
//                         }

//                         // Always add click listener, but check game state in the handler
//                         cell.addEventListener('click', (e) => {
//                             const x = parseInt(e.target.dataset.x);
//                             const y = parseInt(e.target.dataset.y);
//                             this.attackComputer(x, y);
//                         });

//                         board.appendChild(cell);
//                     }
//                 }
//             }
//         };

//         // Test Suite
//         function runTests() {
//             const output = document.getElementById('testOutput');
//             output.innerHTML = '';
//             let passCount = 0;
//             let totalTests = 0;

//             function test(description, testFn) {
//                 totalTests++;
//                 try {
//                     testFn();
//                     output.innerHTML += `<div class="test-pass">✓ ${description}</div>`;
//                     passCount++;
//                 } catch (error) {
//                     output.innerHTML += `<div class="test-fail">✗ ${description}: ${error.message}</div>`;
//                 }
//             }

//             function assert(condition, message) {
//                 if (!condition) {
//                     throw new Error(message);
//                 }
//             }

//             // Ship Tests
//             test('Ship creation with correct length', () => {
//                 const ship = new Ship(4);
//                 assert(ship.length === 4, 'Ship length should be 4');
//                 assert(ship.hits === 0, 'Initial hits should be 0');
//             });

//             test('Ship hit function increases hits', () => {
//                 const ship = new Ship(3);
//                 ship.hit();
//                 assert(ship.hits === 1, 'Hits should be 1 after one hit');
//                 ship.hit();
//                 assert(ship.hits === 2, 'Hits should be 2 after two hits');
//             });

//             test('Ship isSunk returns false when not fully hit', () => {
//                 const ship = new Ship(3);
//                 ship.hit();
//                 assert(!ship.isSunk(), 'Ship should not be sunk with 1 hit out of 3');
//             });

//             test('Ship isSunk returns true when fully hit', () => {
//                 const ship = new Ship(2);
//                 ship.hit();
//                 ship.hit();
//                 assert(ship.isSunk(), 'Ship should be sunk when hits equal length');
//             });

//             // Gameboard Tests
//             test('Gameboard can place ship horizontally', () => {
//                 const gameboard = new Gameboard();
//                 const ship = new Ship(3);
//                 const result = gameboard.placeShip(ship, 0, 0, 'horizontal');
//                 assert(result === true, 'Should be able to place ship');
//                 assert(gameboard.board[0][0] === ship, 'Ship should be at position [0][0]');
//                 assert(gameboard.board[0][1] === ship, 'Ship should be at position [0][1]');
//                 assert(gameboard.board[0][2] === ship, 'Ship should be at position [0][2]');
//             });

//             test('Gameboard can place ship vertically', () => {
//                 const gameboard = new Gameboard();
//                 const ship = new Ship(3);
//                 const result = gameboard.placeShip(ship, 0, 0, 'vertical');
//                 assert(result === true, 'Should be able to place ship');
//                 assert(gameboard.board[0][0] === ship, 'Ship should be at position [0][0]');
//                 assert(gameboard.board[1][0] === ship, 'Ship should be at position [1][0]');
//                 assert(gameboard.board[2][0] === ship, 'Ship should be at position [2][0]');
//             });

//             test('Gameboard prevents ship placement out of bounds', () => {
//                 const gameboard = new Gameboard();
//                 const ship = new Ship(3);
//                 const result = gameboard.placeShip(ship, 8, 0, 'horizontal');
//                 assert(result === false, 'Should not be able to place ship out of bounds');
//             });

//             test('Gameboard receiveAttack hits ship', () => {
//                 const gameboard = new Gameboard();
//                 const ship = new Ship(2);
//                 gameboard.placeShip(ship, 0, 0, 'horizontal');
//                 const result = gameboard.receiveAttack(0, 0);
//                 assert(result.hit === true, 'Attack should hit');
//                 assert(result.ship === ship, 'Should return the hit ship');
//                 assert(ship.hits === 1, 'Ship should have 1 hit');
//             });

//             test('Gameboard receiveAttack misses empty cell', () => {
//                 const gameboard = new Gameboard();
//                 const result = gameboard.receiveAttack(5, 5);
//                 assert(result.hit === false, 'Attack should miss');
//                 assert(gameboard.missedAttacks.has('5,5'), 'Should record missed attack');
//             });

//             test('Gameboard allShipsSunk returns false with unsunk ships', () => {
//                 const gameboard = new Gameboard();
//                 const ship = new Ship(2);
//                 gameboard.placeShip(ship, 0, 0, 'horizontal');
//                 ship.hit();
//                 assert(!gameboard.allShipsSunk(), 'Should return false when ships are not all sunk');
//             });

//             test('Gameboard allShipsSunk returns true when all ships sunk', () => {
//                 const gameboard = new Gameboard();
//                 const ship = new Ship(1);
//                 gameboard.placeShip(ship, 0, 0, 'horizontal');
//                 ship.hit();
//                 assert(gameboard.allShipsSunk(), 'Should return true when all ships are sunk');
//             });

//             // Player Tests
//             test('Player has gameboard', () => {
//                 const player = new Player();
//                 assert(player.gameboard instanceof Gameboard, 'Player should have a gameboard');
//             });

//             test('Computer player can make random moves', () => {
//                 const computer = new Player(true);
//                 const enemyBoard = new Gameboard();
//                 const result = computer.makeMove(enemyBoard);
//                 assert(result !== null, 'Computer should make a move');
//                 assert(typeof result.hit === 'boolean', 'Result should have hit property');
//             });

//             output.innerHTML += `<hr><div><strong>Tests: ${passCount}/${totalTests} passed</strong></div>`;
//         }

//         // Initialize game when page loads
//         window.addEventListener('DOMContentLoaded', () => {
//             gameController.init();
//             runTests();
//         });
//     </script>
// </body>
// </html>