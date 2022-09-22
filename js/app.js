'use strict'

const MINE = '💥'
const MARK = '🚩'
const EMPTY = ''
const WIN = '😎'
const LOSE = '🤯'
const DEFAULT = '😃'
const LIFE = '💗'

var gBoard
var gInterval
var gIntervalSec
var gLives
var gLevel = {
    size: 4,
    mines: 2
}
var gGame


function initGame(size = gLevel.size, mines = gLevel.mines) {
    clearInterval(gInterval)
    clearInterval(gIntervalSec)
    resetStopper()
    gGame = {
        isOn: false,
        gameOver: false,
        showCount: 0,
        markedCount: 0,
        shownMines: 0,
        secsPassed: 0
    }
    gLives = 3
    if (size === 4) {
        gLives = 1
    }
    onLoad()
    gBoard = buildBoard(size)
    renderOriginalHTML()
    addMines(gBoard, mines)
    setMinesAroundCount(gBoard)
    renderBoard(gBoard)
    console.log(gBoard)
}

function onLoad() {
    var strHTML = ''
    strHTML += `<h2>Choose difficulty</h2>\n`
    strHTML += `<button class="difficulty" onclick="initGame(${gLevel.size = 4}, ${gLevel.mines = 2})">Easy (4X4)</button>`
    strHTML += `<button class="difficulty" onclick="initGame(${gLevel.size = 8}, ${gLevel.mines = 14})">Medium (8X8)</button>`
    strHTML += `<button class="difficulty" onclick="initGame(${gLevel.size = 12}, ${gLevel.mines = 32})">Expert (12X12)</button>`
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
    var elBody = document.querySelector('body')
    elBody.classList.remove('hit-mine')
    if (gGame.gameOver) return
    if (!gGame.isOn) {
        gInterval = setInterval(stopper, 1000)
        gIntervalSec = setInterval(() => { gGame.secsPassed++ }, 1000)
        if (gBoard[i][j].isMine === true) {
            gBoard[i][j].isMine = false
            shiftMine()
            setMinesAroundCount(gBoard)
        }
    }
    gGame.isOn = true
    if (gBoard[i][j].isMarked === true) return
    gBoard[i][j].isShown = true
    elCell.style.backgroundColor = 'rgb(150, 133, 182)'
    if (gBoard[i][j].isMine === true) {
        elBody.classList.add('hit-mine')
        elCell.innerText = MINE
        gLives--
        gGame.shownMines++
        if (gLives === 0) {
            for (var i = 0; i < gBoard.length; i++) {
                for (var j = 0; j < gBoard.length; j++) {
                    if (gBoard[i][j].isMine) {
                        var elMine = document.querySelector(".cell-" + i + "-" + j)
                        elMine.innerText = MINE
                        elMine.style.backgroundColor = 'rgb(150, 133, 182)'
                    }
                }
            }
        }
        reduceLives()
    } else if (gBoard[i][j].minesAroundCount === 0) {
        elCell.innerText = EMPTY
        gGame.showCount++
        expandShown(gBoard, elCell, i, j)
    }
    else {
        elCell.innerText = gBoard[i][j].minesAroundCount
        gGame.showCount++
    }
    checkGameOver(gBoard)
}

function cellMarked(elCell, i, j) {
    document.addEventListener('contextmenu', function (e) { e.preventDefault(); })
    if (gGame.gameOver) return
    if (gBoard[i][j].isMine && gBoard[i][j].isShown) return
    if (gBoard[i][j].isShown) return
    if (gBoard[i][j].isMarked) {
        elCell.innerText = EMPTY
        gBoard[i][j].isMarked = false
        gGame.markedCount--
    } else if (!gBoard[i][j].isMarked) {
        elCell.innerText = MARK
        gBoard[i][j].isMarked = true
        gGame.markedCount++
    }
    checkGameOver(gBoard)
}

function checkGameOver(board) {
    var elRestart = document.querySelector(".restart")
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isMine && board[i][j].isShown) {
                if (board.length === 4 ||
                    board.length === 8 && gLives === 0 ||
                    board.length === 12 && gLives === 0) {
                    elRestart.innerHTML = LOSE
                    clearInterval(gInterval)
                    clearInterval(gIntervalSec)
                    gGame.isOn = false
                    gGame.gameOver = true
                }
                
            }
        }
    }
    if (checkIfWin(gBoard)) {
        elRestart.innerHTML = WIN
        clearInterval(gInterval)
        clearInterval(gIntervalSec)
        gGame.isOn = false
        gGame.gameOver = true
    }
}

function checkIfWin(board) {
    if (board.length === 4 && gGame.markedCount + gGame.showCount + gGame.shownMines === 16 ||
        board.length === 8 && gGame.markedCount + gGame.showCount + gGame.shownMines === 64 ||
        board.length === 12 && gGame.markedCount + gGame.showCount + gGame.shownMines === 144)
        return true
    else {
        for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isMine && board[i][j].isMarked ||
                !board[i][j].isMine && board[i][j].isShown) continue
            else return false
        }
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
            if (board[i][j].minesAroundCount < 8 &&
                !board[i][j].isMine &&
                !board[i][j].isMarked) {
                if (!gBoard[i][j].isShown) gGame.showCount++
                board[i][j].isShown = true
                elCell = document.querySelector(".cell-" + i + "-" + j)
                elCell.innerText = board[i][j].minesAroundCount === 0 ? EMPTY : board[i][j].minesAroundCount
                elCell.style.backgroundColor = 'rgb(150, 133, 182)'
            }
            // if (elCell.innerText === EMPTY) expandShown(gBoard, elCell = document.querySelector(".cell-" + i + "-" + j), i, j)
        }
    }
}

function addMines(board, mines = gLevel.mines) {
    for (var k = 0; k < mines; k++) {
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

function reduceLives() {
    var elLives = document.querySelector('.lives')
    if (gLives === 2) {
        elLives.innerHTML = LIFE + LIFE
    } else if (gLives === 1) {
        elLives.innerHTML = LIFE
    } else if (gLives === 0) {
        checkGameOver(gBoard)
        clearInterval(gInterval)
        clearInterval(gIntervalSec)
        gGame.isOn = false
        gGame.gameOver = true
        elLives.innerHTML = 'OUT OF LIVES'
    }
}

function renderOriginalHTML() {
    var elRestart = document.querySelector(".restart")
    elRestart.innerHTML = DEFAULT
    if (gBoard.length === 4) {
        var elLives = document.querySelector('.lives')
        elLives.innerHTML = LIFE
    }
    else {
        var elLives = document.querySelector('.lives')
        elLives.innerHTML = LIFE + LIFE + LIFE
    }
}

function shiftMine() {
    var i = 0
    var j = 0
    if (gBoard[i][j].isMine) {
        j++
    }
    else gBoard[i][j].isMine = true

}