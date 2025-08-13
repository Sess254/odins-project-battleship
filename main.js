import { gameController, setupEventListeners } from './script.js'

document.addEventListener('DOMContentLoaded', function() {
    gameController.init()
    setupEventListeners()
})
