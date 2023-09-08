
class Game {
	#currentScreen = 'start-screen'
	#isSinglePlayerMode = true
	#cellCount = 9

	constructor() {
		this.#makeStartScreen()
		this.#showStartScreen()

		this.#makeGameScreen()
	}

	#showStartScreen() {
		document.querySelector('.' + this.#currentScreen).classList.add('hidden')
		document.querySelector('.start-screen').classList.remove('hidden')
	}

	#makeStartScreen() {
		const DOM_SINGLE_PLAYER_BUTTON = document.querySelector('.start-single-player-button')
		const DOM_MULTI_PLAYER_BUTTON = document.querySelector('.start-multi-player-button')

		DOM_SINGLE_PLAYER_BUTTON.addEventListener('click', () => {
			this.#isSinglePlayerMode = true
			this.#showGameScreen()
		})

		DOM_MULTI_PLAYER_BUTTON.addEventListener('click', () => {
			this.#isSinglePlayerMode = false
			this.#showGameScreen()
		})
	}

	#showGameScreen() {
		document.querySelector('.' + this.#currentScreen).classList.add('hidden')
		document.querySelector('.game-screen').classList.remove('hidden')
	}

	#makeGameScreen() {
		const GAME_BOARD = document.querySelector('.game-board')

		for (let i = 0; i < this.#cellCount; i++) {
			const CELL = document.createElement('div')
			CELL.classList.add('game-board-cell', 'game-board-cell-' + String(i))
			GAME_BOARD.appendChild(CELL)
		}
	}

	#showEndScreen() {
		document.querySelector('.' + this.#currentScreen).classList.add('hidden')
		document.querySelector('.end-screen').classList.remove('hidden')
	}
}

const game = new Game()
