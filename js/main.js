
const X_SVG_PATH = 'assets/x.svg'
const O_SVG_PATH = 'assets/o.svg'
const SCREENS = ['start-screen', 'game-screen', 'end-screen']

class Game {

	#currentScreen = 'start-screen'
	#isSinglePlayerMode = true
	#isPlayerXTurn = true
	#cellCount = 9
	#board = []
	#validationRule = {
		'x': 1,
		'o': -1,
		'draw': 0,
		'unfinished': null
	}

	constructor() {
		this.#makeStartScreen()
		this.#makeGameScreen()
		this.#makeEndScreen()
		this.#showScreen('start-screen')
	}

	#showScreen(_screenName) {
		if (SCREENS.includes(_screenName) === false)
			return

		document.querySelector('.' + this.#currentScreen).classList.add('hidden')
		document.querySelector('.' + _screenName).classList.remove('hidden')
		this.#currentScreen = _screenName
	}

	#makeStartScreen() {
		const DOM_SINGLE_PLAYER_BUTTON = document.querySelector('.start-single-player-button')
		const DOM_MULTI_PLAYER_BUTTON = document.querySelector('.start-multi-player-button')

		DOM_SINGLE_PLAYER_BUTTON.addEventListener('click', () => {
			this.#isSinglePlayerMode = true
			this.#showScreen('game-screen')
		})

		DOM_MULTI_PLAYER_BUTTON.addEventListener('click', () => {
			this.#isSinglePlayerMode = false
			this.#showScreen('game-screen')
		})
	}

	#makeGameScreen() {
		const DOM_GAME_BOARD = document.querySelector('.game-board')
		DOM_GAME_BOARD.replaceChildren()
		this.#board = []

		for (let i = 0; i < this.#cellCount; i++) {
			const DOM_CELL = document.createElement('div')
			DOM_CELL.classList.add('game-board-cell', 'game-board-cell-' + String(i))

			const DOM_IMAGE = document.createElement('img')
			DOM_IMAGE.classList.add('game-board-cell-image', 'game-board-cell-image-' + String(i))

			DOM_CELL.addEventListener('click', () => {
				if (this.#isPlayerXTurn)
					this.#play(i, 'x')
				else
					this.#play(i, 'o')

				this.#isPlayerXTurn = !this.#isPlayerXTurn
				this.#checkBoard()
			})

			DOM_CELL.appendChild(DOM_IMAGE)
			DOM_GAME_BOARD.appendChild(DOM_CELL)
			this.#board.push('')
		}
	}

	#makeEndScreen() {

		const DOM_RESTART_BUTTON = document.querySelector('.end-restart-button')
		DOM_RESTART_BUTTON.addEventListener('click', () => {
			this.#isPlayerXTurn = true
			this.#logBoard()
			this.#makeGameScreen()
			this.#showScreen('start-screen')
		})


	}

	#play(_cellIndex, _symbol) {
		if (typeof(_cellIndex) !== 'number')
			return

		if (_cellIndex < 0 || _cellIndex > 8)
			return

		if (this.#board[_cellIndex] !== '')
			return

		if (_symbol !== 'x' && _symbol !== 'o')
			return

		this.#board[_cellIndex] = _symbol
		document.querySelector('.game-board-cell-image-' + String(_cellIndex)).src = _symbol === 'x' ? X_SVG_PATH : O_SVG_PATH
	}

	#validateBoard(_board) {
		let validationSymbol = ''
		let foundFreeSpace = false

		for (let i=0; i<3; i++) {
			const verticalSymbol = _board[i]
			const horizontalSymbol = _board[i*3]

			// vertical check
			if (verticalSymbol !== '') {
				if (_board[3 + i] === verticalSymbol && _board[6 + i] === _board[i]) {
					validationSymbol = verticalSymbol
					break
				}
			}

			// horizontal check
			if (horizontalSymbol !== '') {
				if (_board[ (3 * i) + 1 ] === horizontalSymbol && _board[ (3 * i) + 2 ] === _board[i*3]) {
					validationSymbol = horizontalSymbol
					break
				}

			}

			// diagonal check
			if (_board[0] === _board[4] && _board[0] === _board[8] && _board[0] !== '') {
				validationSymbol = _board[0]
				break
			}

			if (_board[2] === _board[4] && _board[2] === _board[6] && _board[2] !== '') {
				validationSymbol = _board[0]
				break
			}

		}

		if (validationSymbol !== '')
			return this.#validationRule[validationSymbol]

		else if (_board.includes(''))
			return this.#validationRule.unfinished

		else
			return this.#validationRule.draw

	}

	#checkBoard() {
		const validationResult = this.#validateBoard(this.#board)
		let winnerText = null

		if (validationResult === this.#validationRule.x)
			winnerText = this.#isSinglePlayerMode ? 'You win!' : 'X wins!'

		else if (validationResult === this.#validationRule.o)
			winnerText = this.#isSinglePlayerMode ? 'Computer wins!' : 'O wins!'

		else if (validationResult === this.#validationRule.draw)
			winnerText = 'Draw!'

		else
			return

		document.querySelector('.end-game-result').innerText = winnerText
		this.#showScreen('end-screen')
	}

	#logBoard() {
		let boardString = ''
		for (let i=0; i<this.#cellCount; i++) {
			if (this.#board[i] === '')
				boardString += '  '
			else
				boardString += this.#board[i] + ' '

			if (i % 3 === 2)
				boardString += '\n'
		}
		console.log(boardString)
	}
}

const game = new Game()
