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
	gBoard = createBoard(gBoard)
	renderBoard(gBoard, '.board')
}

// BOARD
function createBoard() {
	var board = []
	const size = gLevel.SIZE

	for (var i = 0; i < size; i++) {
		board[i] = []
		for (var j = 0; j < size; j++) {
			board[i][j] = {
				minesAroundCount: '',
				isShown: false,
				isMine: false,
				isMarked: false,
			}
		}
	}

	board[1][1] = MINE

	// console.table(board)
	return board
}

function renderBoard(mat, selector) {
	const size = gLevel.SIZE
	var strHTML = '<table><tbody>'

	for (var i = 0; i < size; i++) {
		strHTML += '<tr>'
		for (var j = 0; j < size; j++) {
			const cell = mat[i][j]
			const className = `cell cell-${i}-${j}`
			strHTML += `<td onclick="onCellClicked(this)" class="${className}">
            <span class="hidden">
            ${renderCell(cell)}</span></td>`
			// strHTML += `<td class="${className}">${cell}</td>`
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
	console.log('button')
}

// Count negs
function setMinesNegsCount(board) {
	console.log('negCounter')
}

// Right click - put flag
function onCellMarked(elCell) {
	console.log('mark')
}

function checkGameOver() {
	console.log('gameOver')
}

function expandShown(board, elCell, i, j) {
	console.log('expand')
}

// /////////////////////////////////////////////////////////////////////// //

function onChooseSize(elBtn) {
	gLevel.SIZE = elBtn.innerText
	onInit()
}
