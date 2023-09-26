
const SCREENS = ['start-screen', 'game-screen', 'end-screen']

class Game {

	#currentScreen = 'start-screen'
	#isSinglePlayerMode = true
	#isPlayerXTurn = true
	#cellCount = 9
	#board = []

	#symbols = {
		x: {
			name: 'x',
			value: 1,
			singlePlayerMessage: 'You win!',
			multiPlayerMessage: 'X wins!',
			svgPath: 'assets/x.svg'
		},

		o: {
			name: 'o',
			value: -1,
			singlePlayerMessage: 'You lose!',
			multiPlayerMessage: 'O wins!',
			svgPath: 'assets/o.svg'
		},

		draw: {
			name: 'draw',
			value: 0,
			singlePlayerMessage: 'Draw!',
			multiPlayerMessage: 'Draw!'
		},

		unfinished: {
			name: 'unfinished',
			value: null
		}
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
				this.#cellAction(i)
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

	#cellAction(_cellIndex) {
		if (this.#board[_cellIndex] !== '')
			return

		this.#play(_cellIndex, this.#isPlayerXTurn ? this.#symbols.x.name : this.#symbols.o.name)
		this.#isPlayerXTurn = !this.#isPlayerXTurn
		this.#checkBoard()

		if (this.#isSinglePlayerMode) {
			this.#computeMove()
			this.#isPlayerXTurn = !this.#isPlayerXTurn
			this.#checkBoard()
		}

	}

	#play(_cellIndex, _symbol) {
		if (typeof(_cellIndex) !== 'number')
			return

		if (_cellIndex < 0 || _cellIndex > 8)
			return

		if (this.#board[_cellIndex] !== '')
			return

		if (_symbol !== this.#symbols.x.name && _symbol !== this.#symbols.o.name)
			return

		this.#board[_cellIndex] = _symbol
		const svgPath = this.#symbols[_symbol].svgPath
		document.querySelector('.game-board-cell-image-' + String(_cellIndex)).src = svgPath
	}

	/*
		O or the computer is minimizing
		X or the player is maximizing
	*/
	#computeMove() {

		let bestScore = Infinity
		let bestMove

		for (let i=0, s=this.#board.length; i<s; i++) {
			if (this.#board[i] !== '')
				continue

			this.#board[i] = this.#symbols.o.name
			let score = this.#minimax(this.#board, 0, true) // -> _isMaximizing must be true as O made its move in the previous line of code
			if (score < bestScore) {
				bestScore = score
				bestMove = i
			}
			this.#board[i] = ''
		}

		this.#play(bestMove, this.#symbols.o.name)
	}

	#minimax(_board, _depth, _isMaximizing) {
		let result = this.#validateBoard(_board)
		if (result !== this.#symbols.unfinished.value)
			return result

		if (_isMaximizing) {

			let bestScore = -Infinity
			for (let i=0, s=_board.length; i<s; i++) {
				if (_board[i] !== '')
					continue

				_board[i] = this.#symbols.x.name
				let score = this.#minimax(_board, _depth + 1, false)
				_board[i] = ''

				bestScore = Math.max(bestScore, score)
			}

			return bestScore
		}

		else {

			let bestScore = Infinity
			for (let i=0, s=_board.length; i<s; i++) {
				if (_board[i] !== '')
					continue

				_board[i] = this.#symbols.o.name
				let score = this.#minimax(_board, _depth + 1, true)
				_board[i] = ''

				bestScore = Math.min(bestScore, score)
			}

			return bestScore
		}
	}

	#validateBoard(_board) {
		let validationSymbol = ''

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
				validationSymbol = _board[2]
				break
			}

		}

		if (validationSymbol !== '')
			return this.#symbols[validationSymbol].value

		else if (_board.includes(''))
			return this.#symbols.unfinished.value

		else
			return this.#symbols.draw.value

	}

	#checkBoard() {
		const validationResult = this.#validateBoard(this.#board)
		let winnerText = null
		let winnerSymbol = null

		if (validationResult === this.#symbols.x.value)
			winnerSymbol = this.#symbols.x

		else if (validationResult === this.#symbols.o.value)
			winnerSymbol = this.#symbols.o

		else if (validationResult === this.#symbols.draw.value)
			winnerSymbol = this.#symbols.draw

		else
			return

		winnerText = this.#isSinglePlayerMode ? winnerSymbol.singlePlayerMessage : winnerSymbol.multiPlayerMessage
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
