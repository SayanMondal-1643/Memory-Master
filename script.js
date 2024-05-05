let cards = []
let gridContainer = document.querySelector('.grid-container')

let firstCard, secondCard
let lockBoard = false

let moves = document.getElementById('moves')
let bestMoves = document.getElementById('best-moves')
let time = document.getElementById('time')
let bestTime = document.getElementById('best-time')
let curr_moves = 0
let curr_time

let best_moves = window.localStorage.getItem('best-moves')
if(best_moves != null) {
    bestMoves.innerHTML = best_moves
    best_moves = Number.parseInt(best_moves)
}

let best_time = window.localStorage.getItem('best-time')
if(best_time != null) {
    bestTime.innerHTML = best_time
}

let matched = 0
let hours = 0, minutes = 0, seconds = 0
let timer
let gameStarted = false

fetch('./data/cards.json')
.then((req)=>{
    return req.json()
})
.then((data)=>{
    cards = [...data, ...data]
    shuffleCards()
    generateCards()
})

function shuffleCards() {
    for(let i = cards.length - 1; i >= 0; i--) {
        let randomIdx = Math.floor(Math.random() * i);
        [cards[i], cards[randomIdx]] = [cards[randomIdx],cards[i]];
    }
}

function generateCards() {
    for (let i of cards){
        let newCard = document.createElement('div')
        newCard.classList.add('card')
        newCard.dataset.name = i.name
        newCard.innerHTML = `
        <div class = 'front'>
            <img src = ${i.image}>
        </div>
        <div class = 'back'></>      
        `
        gridContainer.appendChild(newCard)
        newCard.addEventListener('click',flipCard)
    }
}

function flipCard() {
    if(lockBoard == true || this == firstCard) {
        return
    }
    if(gameStarted == false) {
        startTimer()
        gameStarted = true
    }
    this.classList.add('flipped')
    if(firstCard == null) {
        firstCard = this
    }
    else {
        secondCard = this
        lockBoard = true
        checkForMatch()
    }
}

function checkForMatch() {
    if(firstCard.dataset.name == secondCard.dataset.name) {
        disableCards()
    }
    else {
        unflipCards()
    }
    
}

function disableCards() {
    firstCard.removeEventListener('click',flipCard)
    secondCard.removeEventListener('click',flipCard)
    curr_moves++
    moves.innerHTML = `${curr_moves}`
    matched++
    if(matched === 6) {
        clearInterval(timer)
        if(best_moves == null || curr_moves < best_moves) {
            bestMoves.innerHTML = `${curr_moves}`
            window.localStorage.setItem('best-moves',curr_moves)
        }

        if(best_time == null || curr_time < best_time) {
            bestTime.innerHTML = `${curr_time}`
            window.localStorage.setItem('best-time',curr_time)
        }
        


    }
    resetBoard()
}

function unflipCards() {
    setTimeout(()=>{
        firstCard.classList.remove('flipped')
        secondCard.classList.remove('flipped')
        curr_moves++
        moves.innerHTML = `${curr_moves}`
        resetBoard()
    },1000)
}

function resetBoard() {
    firstCard = null
    secondCard = null
    lockBoard = false
}

function startTimer() {
    timer = setInterval(()=>{
        seconds++
        if(seconds === 60) {
            minutes++
            seconds = 0
        }
        if(minutes === 60) {
            hours++
            minutes = 0
        }
        if(hours === 24) {
            hours = 0
            minutes = 0
            seconds = 0
        }
        curr_time = `${String(hours).padStart(2,'0')} : ${String(minutes).padStart(2,'0')} : ${String(seconds).padStart(2,'0')}`
        time.innerHTML = curr_time
    },1000)
}

function restartGame() {
    location.reload()
}

function clearHistory() {
    window.localStorage.clear()
    location.reload()
}

