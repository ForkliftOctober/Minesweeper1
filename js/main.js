'use strict'

const MINE = '💣'
const EMPTY = ' '
const FLAG = '🚩'
const BOOM = '💥'

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

function onInit() {
	gBoard = createBoard(gLevel.SIZE, gLevel.MINES)
	renderBoard(gBoard, '.board')
	// mineLocationGenerator(gBoard, gLevel.MINES)
}

// BOARD
function createBoard(size, numOfMines) {
	const board = []

	for (var i = 0; i < size; i++) {
		board[i] = []
		for (var j = 0; j < size; j++) {
			board[i][j] = {
				minesAroundCount: getMinesNegsCount(gLevel.SIZE),
				isShown: false,
				isMine: false,
				isMarked: false,
			}
		}
	}

	// const minePositions = getMinePositions(size, numOfMines)

	board[0][0].isMine = true
	board[3][3].isMine = true

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
			// strHTML += `<td onclick="onCellClicked(this)" class="${className}">
			// <span class="hidden">
			// ${renderCell(cell)}</span></td>`
			strHTML += `<td onclick="onCellClicked(this)" class="${className}">${cell.minesAroundCount}</td>`
		}
		strHTML += '</tr>'
	}
	strHTML += '</tbody></table>'
	const elContainer = document.querySelector(selector)
	elContainer.innerHTML = strHTML
}

// /////////////////////////////////////////////////////////////////////// //

// TODO: find cell content
function renderCell(currCell) {
	return
}

// TODO: remove hidden
// TODO: if mine game over
// TODO: if not mine count negs
function onCellClicked(elCell, i, j) {
	var currCell = elCell.innerText
	console.log('currCell: ', currCell)
	if (currCell.isMine === MINE) {
		checkGameOver()
		console.log('game over')
	} else {
		console.log('not mine')
	}
}

// Right click - put flag
// TODO: update "mines left"
// TODO: place flag
// TODO: cell can't be clicked with left button
// TODO: remove flag with right click
function onCellMarked(elCell) {
	var elMinesLeft = document.querySelector(`.minesLeft span`)
	elMinesLeft.innerText = gLevel.MINES

	console.log('mark')
}

function checkGameOver() {
	console.log('gameOver')
}

function expandShown(board, elCell, i, j) {
	console.log('expand')
}

// /////////////////////////////////////////////////////////////////////// //
// MINES

getMinePositions(4, 2)

function getMinePositions(size, numOfMines) {
	const minePositions = []

	while (minePositions.length < numOfMines) {
		var newMine = {
			i: getRandomIntInclusive(0, size - 1),
			j: getRandomIntInclusive(0, size - 1),
		}

		if (minePositions.includes(newMine)) return
		minePositions.push(newMine)
		console.log('minePositions: ', minePositions)
	}

	return minePositions
}

// Count negs
function getMinesNegsCount(board) {
	var count = 0

	const size = board.length

	for (var i = size - 1; i <= size + 1; i++) {
		if (i < 0 || i > board.length - 1) continue
		for (var j = size - 1; j <= size + 1; j++) {
			if (j < 0 || j > board[0].length - 1) continue
			if (i === size && j === size) continue
			var currCell = board[i][j]
			if (currCell.content === '$') count++
		}
	}
	return count
}

// TODO: take all cells of board and add to array
// TODO: add mines to some by number of mines
// TODO: shuffle
// TODO: populate the matrix

// /////////////////////////////////////////////////////////////////////// //

function onChooseSize(elBtn) {
	gLevel.SIZE = elBtn.innerText
	var size = gLevel.SIZE
	var mines = gLevel.MINES
	switch (size) {
		case size === 4:
			mines = 2
			break
		case size === 6:
			mines = 14
			break
		case size === 10:
			mines = 32
			break
	}
	onInit()
	console.log(mines, 'mines')
}
