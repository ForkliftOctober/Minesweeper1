'use strict'

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1) + min)
}

function countNegs(mat, rowIdx, colIdx) {
	var count = 0
	for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
		if (i < 0 || i > mat.length - 1) continue
		for (var j = colIdx - 1; j <= colIdx + 1; j++) {
			if (j < 0 || j > mat[0].length - 1) continue
			if (i === rowIdx && j === colIdx) continue
			var currCell = mat[i][j]
			if (currCell.content === '$') count++
		}
	}
	return count
}

// Right click
function rightClickPress() {
	if (document.addEventListener) {
		document.addEventListener(
			'contextmenu',
			function (e) {
				console.log('right click') //here you draw your own menu
				e.preventDefault()
			},
			false
		)
	} else {
		document.attachEvent('oncontextmenu', function () {
			alert("You've tried to open context menu")
			window.event.returnValue = false
		})
	}
}
