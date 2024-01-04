'use strict'

// LEFT CLICK

function onLeftClick(elCell, i, j) {
	if (!gGame.isOn) return

	var currCell = gBoard[i][j]

	// Populate mines only after the first click
	if (!gGame.isClicked) {
		gBoard = createBoard(gLevel.SIZE, gLevel.MINES)
		gGame.isClicked = true
	}

	if (currCell.isMarked || elCell.innerText === BOOM) return
	if (currCell.isMine) {
		elCell.innerText = BOOM
		checkGameOver()
		extraLivesHandler('mine')
	} else {
		var minesAroundCount = getMinesNegsCount(gBoard, i, j)
		elCell.innerText = minesAroundCount || EMPTY
		elCell.classList.add('clicked')
		elCell.classList.remove('unclicked')
		currCell.isShown = true
		gGame.shownCount = clickedCellCounter(gBoard)
		if (!elCell.innerText) expandShown(gBoard, i, j)
		checkVictory()
	}
}

function clickedCellCounter(board) {
	var cellCount = 0

	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j]
			if (currCell.isShown) {
				cellCount++
			}
		}
	}
	return cellCount
}

function expandShown(board, rowIdx, colIdx) {
	for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
		if (i < 0 || i > board.length - 1) continue
		for (var j = colIdx - 1; j <= colIdx + 1; j++) {
			if (j < 0 || j > board[0].length - 1) continue
			if (i === rowIdx && j === colIdx) continue // Neg loop

			var currCell = board[i][j]
			if (!currCell.isShown && !currCell.isMarked) {
				var neighboringCell = document.querySelector(`.cell-${i}-${j}`)
				if (neighboringCell) onLeftClick(neighboringCell, i, j) // Avoid null/undefined
			}
		}
	}
}

// /////////////////////////////////////////////////////////////////////// //

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

	return false // Prevents context menu
}

// /////////////////////////////////////////////////////////////////////// //
