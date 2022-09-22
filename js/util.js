'use strict'


function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

var gMin = 0
var gSec = 0

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

var gDarkMode = false
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
