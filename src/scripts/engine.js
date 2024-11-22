const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },

    cardsSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },

    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },

    playerSides: {
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards")
    },

    actions: {
        button: document.getElementById("next-duel"),
    },
}

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards",
}

const pathImages = "./src/assets/icons/"

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        winOf: [1],
        loseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        winOf: [2],
        loseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        winOf: [0],
        loseOf: [1],
    },
]


async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id
}

async function createCardImage(IdCard, fieldSide) {
    console.log(`Creating card image for ID: ${IdCard} on side: ${fieldSide}`);
    const cardImage = document.createElement("img")
    cardImage.setAttribute("height", "100px")
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png")
    cardImage.setAttribute("data-id", IdCard)
    cardImage.classList.add("card")


    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard)
        })
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"))
        })
    }

    return cardImage

}

async function setCardsField(cardID) {
    await removeAllCardsImages()

    let computerCardId = await getRandomCardId()

    await showHiddenCardFieldsImages(true)

    await hiddenCardDetails()

    await drawCardsInField(cardID, computerCardId)

    let duelResults = await checkDuelResults(cardID, computerCardId)

    await updateScore()
    await drawButton(duelResults)
}

async function drawCardsInField(cardID, computerCardId){
    state.fieldCards.player.src = cardData[cardID].img
    state.fieldCards.computer.src = cardData[computerCardId].img
}

async function showHiddenCardFieldsImages(value) {
    if (value === true) {
        state.fieldCards.player.style.display = "block"
        state.fieldCards.computer.style.display = "block"
    }

    if (value === false) {
        
        state.fieldCards.player.style.display = "none"
        state.fieldCards.computer.style.display = "none"

    }
}

async function hiddenCardDetails() {
    state.cardsSprites.avatar.src = ""
    state.cardsSprites.name.innerText = ""
    state.cardsSprites.type.innerText = ""
}

async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase()
    state.actions.button.style.display = "block"
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function checkDuelResults(playerCardID, computerCardId) {
    let duelResults = "Draw"
    let playerCard = cardData[playerCardID]

    if (playerCard.winOf.includes(computerCardId)) {
        duelResults = "Win"
        state.score.playerScore++
    }

    if (playerCard.loseOf.includes(computerCardId)) {
        duelResults = "Lose"
        state.score.computerScore++
    }

    await playAudio(duelResults)
    return duelResults
}

async function removeAllCardsImages() {
    let { computerBox, player1Box } = state.playerSides
    let imageElements = computerBox.querySelectorAll("img")
    imageElements.forEach((img) => img.remove())

    imageElements = player1Box.querySelectorAll("img")
    imageElements.forEach((img) => img.remove())
}

async function drawSelectCard(index) {
    state.cardsSprites.avatar.src = cardData[index].img
    state.cardsSprites.name.innerText = cardData[index].name
    state.cardsSprites.type.innerText = `Attribute : ${cardData[index].type}`
}



async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers.length; i++) {
        const randomIdCard = await getRandomCardId()
        const cardImage = await createCardImage(randomIdCard, fieldSide)

        console.log(randomIdCard);


        document.getElementById(fieldSide).appendChild(cardImage)

    }
}

async function resetDuel() {
    state.cardsSprites.avatar.src = ""
    state.actions.button.style.display = "none"

    state.fieldCards.player.style.display = "none"
    state.fieldCards.computer.style.display = "none"

    init()
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    try {
        audio.play()
    } catch (error) {

    }
}


function init() {

    showHiddenCardFieldsImages(false)

    drawCards([0, 1, 2, 3, 4], playerSides.player1)
    drawCards([0, 1, 2, 3, 4], playerSides.computer)

    const bgm = document.getElementById("bgm")
    bgm.play()
}

init()