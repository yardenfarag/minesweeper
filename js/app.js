'use strict'

const SIZE = 4
const MINE_COUNT = 2
const MINE = '💥'
const MARK = '🚩'
const EMPTY = ''
const WIN = '😁'
const LOSE = '😭'

var gBoard
var gGameOn = false
var gInterval
var gStopper = 0
// var gLevel = {
//     size: 4,
//     mines: 2
// }
// var gGame = {
//     isOn: false,
//     showCount: 0,
//     markedCount: 0,
//     secsPassed: 0
// }


function initGame(size = 4, mines = 2) {
    resetStopper()
    onLoad()
    gBoard = buildBoard(size)
    renderBoard(gBoard)
    document.addEventListener("click", () => {addMines(gBoard, mines); setMinesAroundCount(gBoard);}, {once: true})
    // addMines(gBoard, mines)
    // setMinesAroundCount(gBoard)
}

function onLoad() {
    var strHTML = ''
    strHTML += `<h2>Choose difficulty</h2>\n`
    strHTML += `<button class="difficulty" onclick="initGame(4, 2)">Easy (4X4)</button>`
    strHTML += `<button class="difficulty" onclick="initGame(8, 14)">Medium (8X8)</button>`
    strHTML += `<button class="difficulty" onclick="initGame(12, 32)">Expert (12X12)</button>`
    var elLevels = document.querySelector(".level")
    elLevels.innerHTML = strHTML
}

function buildBoard(boardSize) {
    var mat = []
    for (var i = 0; i < boardSize; i++) {
        mat[i] = []
        for (var j = 0; j < boardSize; j++) {
            mat[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }
    }
    return mat
}

function setMinesAroundCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var minesCount = setMinesNegsCount(i, j, board)
            board[i][j].minesAroundCount = minesCount
        }
    }
}

function renderBoard(board) {
    var strHTML = ''
    strHTML += `<table border="1" cellpadding="5">\n<tbody class="board">\n`
    for (var i = 0; i < board.length; i++) {
        strHTML += '\n<tr>\n'
        for (var j = 0; j < board.length; j++) {
            strHTML += `\t<td class="cell-${i}-${j}" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this, ${i}, ${j})">${EMPTY}</td>\n`
        }
        strHTML += '\n</tr>\n'
    }
    strHTML += `</tbody>\n</table>`
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function cellClicked(elCell, i, j) {
    if (!gGameOn) {
        gInterval = setInterval(stopper, 1000)
    }
    gGameOn = true
    if (gBoard[i][j].isMarked === true) return
    gBoard[i][j].isShown = true
    elCell.style.backgroundColor = 'rgb(150, 133, 182)'
    if (gBoard[i][j].isMine === true) {
        elCell.innerText = MINE
    } else if (gBoard[i][j].minesAroundCount === 0) {
        elCell.innerText = gBoard[i][j].minesAroundCount
        expandShown(gBoard, elCell, i, j)
    }
    else {
        elCell.innerText = gBoard[i][j].minesAroundCount
    }
    checkGameOver(gBoard)
}

function cellMarked(elCell, i, j) {
    document.addEventListener('contextmenu', function (e) { e.preventDefault(); })
    if (gBoard[i][j].isMarked) {
        elCell.innerText = EMPTY
        gBoard[i][j].isMarked = false
    } else if (!gBoard[i][j].isMarked) {
        elCell.innerText = MARK
        gBoard[i][j].isMarked = true
    }
}

function checkGameOver(board) {
    var elRestart = document.querySelector(".restart")
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isMine && board[i][j].isShown) {
                elRestart.innerHTML = LOSE
                clearInterval(gInterval)
                gGameOn = false
            }
        }
    }
    if (checkIfWin(gBoard)) {
        elRestart.innerHTML = WIN
        clearInterval(gInterval)
        gGameOn = false
    }
}

function checkIfWin(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isMine && board[i][j].isMarked ||
                !board[i][j].isMine && board[i][j].isShown) continue
            else return false
        }
    }
    return true
}

function expandShown(board, elCell, cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board.length) continue
            if (i === cellI && j === cellJ) continue
            if (board[i][j].minesAroundCount < 3 && !board[i][j].isMine) {
                board[i][j].isShown = true
                elCell = document.querySelector(".cell-" + i + "-" + j)
                elCell.innerText = board[i][j].minesAroundCount
                elCell.style.backgroundColor = 'rgb(150, 133, 182)'
            }
        }
    }
}

function addMines(board, mineCount) {
    for (var k = 0; k < mineCount; k++) {
        const i = getRandomIntInclusive(0, board.length - 1)
        const j = getRandomIntInclusive(0, board.length - 1)
        var randomCell = board[i][j]
        if (randomCell.isMine) continue
        else randomCell.isMine = true
    }

}

function setMinesNegsCount(cellI, cellJ, board) {
    var minesCount = 0

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board.length) continue
            if (i === cellI && j === cellJ) continue
            if (board[i][j].isMine) minesCount++
        }
    }
    return minesCount
}
