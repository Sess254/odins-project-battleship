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