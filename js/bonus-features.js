'use strict'

const SAFE = '🧷'
const HINT = '💡'


var gDarkMode = false
var gSafeClicks
var gHints
var isHintOn = false
var gMegaHints
var isMegaHintOn = false
var gBestTime = {
  easy: 999,
  medium: 999,
  expert: 999
}


function lightDarkMode(elBtn) {
  if (!gDarkMode) {
    gDarkMode = true
    elBtn.innerText = '☀️'
  }
  else if (gDarkMode) {
    gDarkMode = false
    elBtn.innerHTML = '☾'
  }
  var elBody = document.querySelector("body")
  elBody.classList.toggle("dark-mode")
  var elBtns = document.querySelector("div")
  elBtns.classList.toggle("dark-mode")
  elBtn.classList.toggle("dark-mode")
  var elCell = document.querySelector("td")
  elCell.classList.toggle("dark-mode")

}

function findSafeClick(board) {
  // in case of easy level(4X4) there is only one safe click otherwise it's too easy
  if (!gGame.isOn) return
  if (gGame.gameOver) return
  if (gSafeClicks === 0) return

  reduceSafeClicks()

  // generating random places to safe click
  var noMinesCellsCoords = []

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (!board[i][j].isMine && !board[i][j].isShown) {
        noMinesCellsCoords.push({ i: i, j: j })
      }
    }
  }

  return noMinesCellsCoords.splice(getRandomIntInclusive(0, noMinesCellsCoords.length - 1, 1))[0]
}

function safeClick() {
  var safeCell = findSafeClick(gBoard)
  var elCell = document.querySelector(".cell-" + safeCell.i + "-" + safeCell.j)
  elCell.classList.add("safe-to-click")
  setTimeout(() => { elCell.classList.remove("safe-to-click") }, 2500);
  return
}

function reduceSafeClicks() {
  var elSafeClicks = document.querySelector('.safe')
  gSafeClicks--
  if (gSafeClicks === 2) {
    elSafeClicks.innerHTML = SAFE + SAFE
  } else if (gSafeClicks === 1) {
    elSafeClicks.innerHTML = SAFE
  } else if (gSafeClicks === 0) {
    elSafeClicks.innerHTML = ''
  }
}

function hints() {
  var elHint = document.querySelector(".hint")
  if (!gGame.isOn) return
  if (gGame.gameOver) return
  if (gHints === 0) return
  if (!isHintOn) {
    elHint.classList.add("clicked")
    isHintOn = true
  }
  else if (isHintOn) {
    elHint.classList.remove("clicked")
    isHintOn = false
  }
}

function hintsReveal(board, elCell, cellI, cellJ) {
  var elCell = document.querySelector(".cell-" + cellI + "-" + cellJ)
  elCell.style.backgroundColor = 'rgb(150, 133, 182)'
  if (board[cellI][cellJ].isMine) elCell.innerText = MINE
  else if (board[cellI][cellJ].minesAroundCount === 0) elCell.innerText = EMPTY
  else elCell.innerText = board[cellI][cellJ].minesAroundCount
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue

    for (var j = cellJ - 1; j <= cellJ + 1; j++) {

      if (j < 0 || j >= board.length) continue
      if (i === cellI && j === cellJ) continue

      var elCell = document.querySelector(".cell-" + i + "-" + j)
      if (board[i][j].isMine) elCell.innerText = MINE
      else if (board[i][j].minesAroundCount === 0) elCell.innerText = EMPTY
      else elCell.innerText = board[i][j].minesAroundCount
      elCell.style.backgroundColor = 'rgb(150, 133, 182)'
    }
  }

}

function closeHint(board, elCell, cellI, cellJ) {
  var elCell = document.querySelector(".cell-" + cellI + "-" + cellJ)
  if (!board[cellI][cellJ].isShown) {
    elCell.style.backgroundColor = ''
    elCell.innerText = EMPTY
  }

  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue

    for (var j = cellJ - 1; j <= cellJ + 1; j++) {

      if (j < 0 || j >= board.length) continue
      if (i === cellI && j === cellJ) continue

      if (!board[i][j].isShown) {
        var elCell = document.querySelector(".cell-" + i + "-" + j)
        elCell.innerText = EMPTY
        elCell.style.backgroundColor = ''
      }
    }
  }
}

function reduceHints() {
  var elHints = document.querySelector('.hint')
  gHints--
  if (gHints === 2) {
    elHints.innerHTML = HINT + HINT
  } else if (gHints === 1) {
    elHints.innerHTML = HINT
  } else if (gHints === 0) {
    elHints.innerHTML = ''
    elHints.classList.remove("clicked")
    isHintOn = false
  }
}

function bestTime() {
  var elBestTime = document.querySelector(".best-time")
  if (gLevel.size === 4) {
    if (gMin * 60 + gSec < gBestTime.easy) {
      gBestTime.easy = gMin * 60 + gSec
      var strHTML = "Best Time: " + gMin + ":" + gSec
      localStorage.bestTimeEasy = strHTML
      elBestTime.innerHTML = localStorage.bestTimeEasy
    }
  } else if (gLevel.size === 8) {
    if (gMin * 60 + gSec < gBestTime.medium) {
      gBestTime.medium = "Best Time: " + gMin + ":" + gSec
      localStorage.bestTimeMedium = gBestTime.medium
    }
  } else if (gLevel.size === 12) {
    if (gMin * 60 + gSec < gBestTime.expert) {
      gBestTime.expert = "Best Time: " + gMin + ":" + gSec
      localStorage.bestTimeExpert = gBestTime.medium
    }
  }
}

function sevenBoom(board) {
  var count = 0
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      count++
      if (count % 7 === 0) {
        board[i][j].isMine = true
      }
    }

  }
}

function initSevenBoom(size = +prompt('Type 4 for easy, 8 for medium and 12 for expert!')) {
  clearInterval(gInterval)
  clearInterval(gIntervalSec)
  resetStopper()
  caliberation(size)
  onLoad()
  gBoard = buildBoard(size)
  renderOriginalHTML()
  sevenBoom(gBoard)
  setMinesAroundCount(gBoard)
  renderBoard(gBoard)
  // if you want to cheat the game, look in the console for mines :)
  console.log(gBoard)
}

function megaHint() {
  var elHint = document.querySelector(".mega-hint")
  if (!gGame.isOn) return
  if (gGame.gameOver) return
  if (gMegaHints === 0) return
  if (!isMegaHintOn) {
    elHint.style.backgroundColor = 'black'
    isMegaHintOn = true
  }
  else if (isMegaHintOn) {
    elHint.style.backgroundColor = 'transparent'
    isMegaHintOn = false
  }
}

function megaHintReveal(board, elStartCell, startCellI, startCellJ, elEndCell, endCellI, endCellJ) {
  var elStartCell = document.querySelector(".cell-" + startCellI + "-" + startCellJ)
  var elEndCell = document.querySelector(".cell-" + endCellI + "-" + endCellJ)

  elStartCell.style.backgroundColor = 'rgb(150, 133, 182)'
  elEndCell.style.backgroundColor = 'rgb(150, 133, 182)'

  //start cell
  if (board[startCellI][startCellJ].isMine) elStartCell.innerText = MINE
  else if (board[startCellI][startCellJ].minesAroundCount === 0) elStartCell.innerText = EMPTY
  else elStartCell.innerText = board[startCellI][startCellJ].minesAroundCount

  // end cell
  if (board[endCellI][endCellJ].isMine) elEndCell.innerText = MINE
  else if (board[endCellI][endCellJ].minesAroundCount === 0) elEndCell.innerText = EMPTY
  else elEndCell.innerText = board[endCellI][endCellJ].minesAroundCount

  // cells in between
  for (var i = startCellI; i <= endCellI; i++) {
    for (var j = startCellJ; j <= endCellJ; j++) {
      var elCell = document.querySelector(".cell-" + i + "-" + j)
      if (board[i][j].isMine) elCell.innerText = MINE
      else if (board[i][j].minesAroundCount === 0) elCell.innerText = EMPTY
      else elCell.innerText = board[i][j].minesAroundCount
      elCell.style.backgroundColor = 'rgb(150, 133, 182)'
    }
  }
}

function closeMegaHint(board, elStartCell, startCellI, startCellJ, elEndCell, endCellI, endCellJ) {
  var elStartCell = document.querySelector(".cell-" + startCellI + "-" + startCellJ)
  var elEndCell = document.querySelector(".cell-" + endCellI + "-" + endCellJ)

  if (!board[startCellI][startCellJ].isShown) {
    elStartCell.style.backgroundColor = ''
    elStartCell.innerText = EMPTY
  }

  if (!board[endCellI][endCellJ].isShown) {
    elEndCell.style.backgroundColor = ''
    elEndCell.innerText = EMPTY
  }

  for (var i = startCellI; i <= endCellI; i++) {
    for (var j = startCellJ; j <= endCellJ; j++) {
      var elCell = document.querySelector(".cell-" + i + "-" + j)
      if (!board[i][j].isShown) {
        var elCell = document.querySelector(".cell-" + i + "-" + j)
        elCell.innerText = EMPTY
        elCell.style.backgroundColor = ''
      }
    }
  }
}