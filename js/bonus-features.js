'use strict'

const SAFE = '🧷'


var gDarkMode = false
var gSafeClicks


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
  
function safeClick(board) {
  // in case of easy level(4X4) there is only one safe click otherwise it's too easy
  if (!gGame.isOn) return
  if (gGame.gameOver) return
  if (gSafeClicks === 0) return

  reduceSafeClicks()

  // generating random places to safe click
  for (var safe = 0; safe <= gLevel.mines; safe++) {
    var i = getRandomIntInclusive(0, board.length - 1)
    var j = getRandomIntInclusive(0, board.length - 1)
    if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
      var elCell = document.querySelector(".cell-" + i + "-" + j)
          elCell.classList.add("safe-to-click")
          setTimeout(() => {elCell.classList.remove("safe-to-click")}, 2500);
          return
    }
  }
    

    
}

function reduceSafeClicks() {
  var elSafeClicks = document.querySelector('.safe')
  gSafeClicks--
  if (gSafeClicks === 2) {
    elSafeClicks.innerHTML = SAFE + SAFE
  } else if (gSafeClicks === 1) {
    elSafeClicks.innerHTML = SAFE
  } else if (gSafeClicks === 0) {
      elSafeClicks.innerHTML = 'OUT OF SAFE CLICKS'
  }
}