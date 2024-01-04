'use strict'

// MINES
const MINE = '💣'
const EMPTY = ' '
const FLAG = '🚩'
const BOOM = '💥'
// FACE
const NORMAL_FACE = '😃'
const DEAD_FACE = '🤯'
const SUNGLASSES_FACE = '😎'
// EXTRA LIVES
const LIFE_ACTIVE = '🌝'
const LIFE_DEPLETED = '🌑'
// HINTS
const HINT_ACTIVE = `<img src="img/light_on.png" alt="Active Hint">`
const HINT_DEPLETED = `<img src="img/light_off.png" alt="Depleted Hint">`

// /////////////////////////////////////////////////////////////////////// //

var gLevel = {
	SIZE: 4,
	MINES: 2,
}
const gGame = {
	isOn: false,
	isClicked: false,
	shownCount: 0,
	markedCount: 0,
	secsPassed: 0,
	extraLives: 3,
	hints: 3,
	isHintOn: false,
}

var gBoard

// /////////////////////////////////////////////////////////////////////// //

function onInit() {
	gGame.markedCount = 0
	gGame.shownCount = 0
	gGame.secsPassed = 0
	gGame.extraLives = 3
	gGame.hints = 3
	gGame.isOn = true
	gGame.isClicked = false

	// gBoard = createEmptyBoard(gLevel.SIZE)
	// gBoard = createBoard(gLevel.SIZE, gLevel.MINES)
	gBoard = createEmptyBoard(gLevel.SIZE)
	renderBoard(gBoard, '.board')
	updateMinesLeft(gLevel.MINES)
	extraLivesHandler('restart')
	hintsHandler('restart')
}

// /////////////////////////////////////////////////////////////////////// //

// BOARD

// Model actual
function createBoard(size, numOfMines) {
	const board = []

	for (var i = 0; i < size; i++) {
		board[i] = []
		for (var j = 0; j < size; j++) {
			board[i][j] = Object.assign({}, getCell())
		}
	}

	const minePositions = getMinePositions(size, numOfMines)

	for (const minePos of minePositions) {
		const { i, j } = minePos
		board[i][j].isMine = true
	}

	// console.table(board)
	return board
}

function createEmptyBoard(size) {
	const board = []

	for (var i = 0; i < size; i++) {
		board[i] = []
		for (var j = 0; j < size; j++) {
			board[i][j] = Object.assign({}, getCell())
		}
	}

	return board
}

// DOM
function renderBoard(board, selector) {
	const size = gLevel.SIZE
	var strHTML = '<table><tbody>'

	for (var i = 0; i < size; i++) {
		strHTML += '<tr>'
		for (var j = 0; j < size; j++) {
			const cell = board[i][j]
			const className = `cell cell-${i}-${j}`
			var cellContent = ' '
			strHTML += `<td onclick="onLeftClick(this, ${i}, ${j}, event)"
                        oncontextmenu="return onRightClick(this, ${i}, ${j}, event)"
                        class="${className} unclicked">${cellContent}</td>`
		}
		strHTML += '</tr>'
	}
	strHTML += '</tbody></table>'
	const elContainer = document.querySelector(selector)
	elContainer.innerHTML = strHTML
}

function getCell() {
	return {
		minesAroundCount: 0,
		isShown: false,
		isMine: false,
		isMarked: false,
	}
}

// /////////////////////////////////////////////////////////////////////// //

// GAME OVER
function checkGameOver() {
	gGame.extraLives--
	console.log('Life lost')

	if (!gGame.extraLives) {
		gGame.isOn = false
		revealAll(gBoard)
		changeFace(DEAD_FACE)
		console.log('Game Over')
	}
}

function revealAll(board) {
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			var currCell = board[i][j]
			var elCell = document.querySelector(`.cell-${i}-${j}`)

			if (!currCell.isMarked && !currCell.isShown && currCell.isMine) {
				if (elCell.innerText !== BOOM) {
					elCell.innerText = MINE
				}
			}
		}
	}
}

function checkVictory() {
	if (
		gGame.markedCount === gLevel.MINES &&
		gGame.shownCount === gLevel.SIZE ** 2 - gLevel.MINES
	) {
		console.log('Victory')
		changeFace(SUNGLASSES_FACE)
		gGame.isOn = false
	}
}

// /////////////////////////////////////////////////////////////////////// //

// MINES
function getMinePositions(size, numOfMines) {
	const minePositions = []

	while (minePositions.length < numOfMines) {
		var newMine = {
			i: getRandomIntInclusive(0, size - 1),
			j: getRandomIntInclusive(0, size - 1),
		}

		// Check if the newMine position is already in minePositions
		const isDuplicate = minePositions.some(
			(position) => position.i === newMine.i && position.j === newMine.j
		)

		if (!isDuplicate) {
			minePositions.push(newMine)
		}
	}

	return minePositions
}

function getMinesNegsCount(board, rowIdx, colIdx) {
	var count = 0

	for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
		if (i < 0 || i > board.length - 1) continue
		for (var j = colIdx - 1; j <= colIdx + 1; j++) {
			if (j < 0 || j > board[0].length - 1) continue
			if (i === rowIdx && j === colIdx) continue
			var currCell = board[i][j]
			if (currCell.isMine) count++
		}
	}
	return count
}

// /////////////////////////////////////////////////////////////////////// //

// EXTRAS
function onChooseSize(str) {
	switch (str) {
		case 1:
			gLevel.SIZE = 4
			gLevel.MINES = 2
			break
		case 2:
			gLevel.SIZE = 6
			gLevel.MINES = 14
			break

		case 3:
			gLevel.SIZE = 10
			gLevel.MINES = 32
			break
	}

	onRestart()
}

function updateMinesLeft(mineCount) {
	var elMineCounter = document.querySelector(`.minesLeft span`)
	elMineCounter.innerText = mineCount
}

function onRestart() {
	changeFace(NORMAL_FACE)
	onInit()
}

function changeFace(state) {
	const elFace = document.querySelector(`.face`)
	elFace.innerText = state
}

function extraLivesHandler(str) {
	var elExtraLives = document.querySelector(`.extraLives`)
	elExtraLives.innerText = ''

	if (str === 'restart') {
		for (var i = 0; i < gGame.extraLives; i++) {
			elExtraLives.innerText += LIFE_ACTIVE
		}
	}

	if (str === 'mine') {
		if (gGame.extraLives === 2) {
			elExtraLives.innerText = LIFE_ACTIVE + LIFE_ACTIVE + LIFE_DEPLETED
		}
		if (gGame.extraLives === 1) {
			elExtraLives.innerText = LIFE_ACTIVE + LIFE_DEPLETED + LIFE_DEPLETED
		}
		if (gGame.extraLives === 0) {
			elExtraLives.innerText = LIFE_DEPLETED + LIFE_DEPLETED + LIFE_DEPLETED
		}
	}
}

// /////////////////////////////////////////////////////////////////////// //

// HINT (inactive)
function getHint() {
	if (!gGame.hints || !gGame.isOn) return
	gGame.hints--
	gGame.isHintOn = true
	hintsHandler('hint')
}

function hintsHandler(str) {
	var elHints = document.querySelector('.hints')
	elHints.innerHTML = ''

	if (str === 'restart') {
		for (var i = 0; i < gGame.hints; i++) {
			elHints.innerHTML += HINT_ACTIVE
		}
	}

	if (str === 'hint') {
		if (gGame.hints === 2) {
			elHints.innerHTML += HINT_ACTIVE
			elHints.innerHTML += HINT_ACTIVE
			elHints.innerHTML += HINT_DEPLETED
		}
		if (gGame.hints === 1) {
			elHints.innerHTML += HINT_ACTIVE
			elHints.innerHTML += HINT_DEPLETED
			elHints.innerHTML += HINT_DEPLETED
		}
		if (gGame.hints === 0) {
			elHints.innerHTML += HINT_DEPLETED
			elHints.innerHTML += HINT_DEPLETED
			elHints.innerHTML += HINT_DEPLETED
		}
	}
}
