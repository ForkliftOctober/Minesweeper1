'use strict'

const MINE = '💣'
const EMPTY = ' '
const FLAG = '🚩'
const BOOM = '💥'
const NORMAL_FACE = '😃'
const DEAD_FACE = '🤯'
const SUNGLASSES_FACE = '😎'

var gLevel = {
	SIZE: 4,
	MINES: 2,
}
const gGame = {
	isOn: false,
	shownCount: 0,
	markedCount: 0,
	secsPassed: 0,
}

var gBoard

// /////////////////////////////////////////////////////////////////////// //

function onInit() {
	gBoard = createBoard(gLevel.SIZE, gLevel.MINES)
	gGame.isOn = true
	renderBoard(gBoard, '.board')
	updateMinesLeft(gLevel.MINES)
}

// /////////////////////////////////////////////////////////////////////// //

// BOARD
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

function renderBoard(board, selector) {
	const size = gLevel.SIZE
	var strHTML = '<table><tbody>'

	for (var i = 0; i < size; i++) {
		strHTML += '<tr>'
		for (var j = 0; j < size; j++) {
			const cell = board[i][j]
			const className = `cell cell-${i}-${j}`
			var cellContent = ' '
			var cellContent = cell.isMine ? MINE : ' ' // FIXME: remove line later
			strHTML += `<td onclick="onLeftClick(this, ${i}, ${j}, event)"
                        oncontextmenu="return onRightClick(this, ${i}, ${j}, event)"
                        class="${className}">${cellContent}</td>`
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

// LEFT CLICK
function onLeftClick(elCell, i, j) {
	if (!gGame.isOn) return

	var currCell = gBoard[i][j]

	if (currCell.isMarked) return
	if (currCell.isMine) {
		elCell.innerText = BOOM
		checkGameOver()
	} else {
		var minesAroundCount = getMinesNegsCount(gBoard, i, j)
		elCell.innerText = minesAroundCount || EMPTY
		elCell.classList.add('clicked')
		currCell.isShown = true
		gGame.shownCount++
		if (!elCell.innerText) expandShown(gBoard, elCell, i, j)
		checkVictory()
	}
}

// RIGHT CLICK
function onRightClick(elCell, i, j) {
	if (!gGame.isOn) return

	const currCell = gBoard[i][j]
	const elMinesLeft = document.querySelector('.minesLeft span')

	if (!currCell.isShown) {
		// Only allow right-click on unopened cells
		if (!currCell.isMarked) {
			currCell.isMarked = true // Model
			gGame.markedCount++
			elMinesLeft.innerText-- // DOM
			elCell.innerText = FLAG
		} else {
			currCell.isMarked = false // Model
			gGame.markedCount--
			elMinesLeft.innerText++ // DOM
			elCell.innerText = EMPTY
		}
		console.log('mark')
	}
	checkVictory()

	return false
}

// TODO: open cells with no negs automatically
// if neg count === 0 run on all negs
// check negs
// repeat

function expandShown(board, elCell, rowIdx, colIdx) {
	console.log('expand')
}

// /////////////////////////////////////////////////////////////////////// //

// GAME OVER
function checkGameOver() {
	console.log('Game Over')
	gGame.isOn = false
	revealAll(gBoard)
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
		console.log('Victory! But at what cost')
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

	onInit()
}

function updateMinesLeft(mineCount) {
	var elMineCounter = document.querySelector(`.minesLeft span`)
	elMineCounter.innerText = mineCount
}
