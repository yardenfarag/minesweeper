'use strict'

var gMin = 0
var gSec = 0


function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function stopper() {
  var elTime = document.querySelector(".time")
  if (gSec < 10) {
    elTime.innerHTML = "Your time: " + gMin + ":0" + gSec
  } else elTime.innerHTML = "Your time: " + gMin + ":" + gSec
  gSec++
  if (gSec >= 59) {
    gSec = 0
    gMin++
  }
}

function resetStopper() {
  gMin = 0
  gSec = 0
  var elTime = document.querySelector('.time')
  elTime.innerText = "Your time: 0:00"
}

function renderOriginalHTML() {
  // caliberating HTML
  var elMegaHint = document.querySelector('.mega-hint')
  elMegaHint.style.backgroundColor = 'transparent'
  elMegaHint.classList.remove('hidden')
  var elRestart = document.querySelector(".restart")
  elRestart.innerHTML = DEFAULT
  var elLives = document.querySelector('.lives')
  if (gBoard.length === 4) {
    elLives.innerHTML = LIFE
  }
  else {
    elLives.innerHTML = LIFE + LIFE + LIFE
  }
  var elSafeClicks = document.querySelector('.safe')
  if (gBoard.length === 4) {
    elSafeClicks.innerHTML = SAFE
  }
  else {
    elSafeClicks.innerHTML = SAFE + SAFE + SAFE
  }
  var elHints = document.querySelector('.hint')
  if (gBoard.length === 4) {
    elHints.innerHTML = HINT
  }
  else {
    elHints.innerHTML = HINT + HINT + HINT
  }
}

function caliberation(size) {
  gGame = {
    isOn: false,
    gameOver: false,
    showCount: 0,
    markedCount: 0,
    shownMines: 0,
    secsPassed: 0
  }
  gMegaHint = {
    startCell: 0,
    startI: 0,
    startJ: 0,
    endCell: 0,
    endI: 0,
    endJ: 0
  }
  gMegaHints = 1
  gClicked = false
  gLives = 3
  if (size === 4) {
    gLives = 1
  }
  gSafeClicks = 3
  if (size === 4) {
    gSafeClicks = 1
  }
  gHints = 3
  if (size === 4) {
    gHints = 1
  }
}
