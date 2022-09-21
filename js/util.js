'use strict'


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }
  

function hideElements(nameOfElement) {
    var element = document.querySelector(nameOfElement)
    element.classList.add("hidden")
}

var gMin = 0
var gSec = 0


function stopper() {
    var elTime = document.querySelector(".time")
  elTime.innerHTML = gMin + ":" + gSec
gSec++;
  if (gSec >= 59) {
    gSec = 0
    gMin++
  }
}

function resetStopper() {
    gMin = 0
    gSec = 0
    var elTime = document.querySelector('.time')
    elTime.innerText = "0:0"
}
