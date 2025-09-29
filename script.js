var userCards= [];
var oppCards = [];
var deckID;

var userScore = document.querySelector('#userScore');
var oppScore = document.querySelector('#oppScore');

/* 
TO FIX (TODO):
 - No game ending
 - If war starts and one player doesn't have enough cards, they lose
 - Takes 67 clicks to start a game
 - Can't start a new game if existing game is happening
 - Cards don't fit in container
 - Card values aren't always updated
 - Error message is only logged in console, not displayed
*/

window.onload = function(){
    var req = new XMLHttpRequest();
    req.open('GET', 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1', true);
    
    req.onload = function(){
        data = JSON.parse(this.response)
        if (req.status == 200){
            deckID = data.deck_id;
        } else {
            console.error(`There has been an error: Status ${req.status}`);
        }
    }
    req.send();
}

async function startGame(){
    fetchCards().then(() => {
        userScore.textContent = userCards.length;
        oppScore.textContent = oppCards.length;
        userCards.forEach((card) => {
            switch(card.value){
                case "JACK":
                    card.value = 11;
                    break;
                case "QUEEN":
                    card.value = 12;
                    break;
                case "KING":
                    card.value = 13;
                    break;
                case "ACE":
                    card.value = 14;
                    break;
            }
        })
        oppCards.forEach((card) => {
            switch(card.value){
                case "JACK":
                    card.value = 11;
                    break;
                case "QUEEN":
                    card.value = 12;
                    break;
                case "KING":
                    card.value = 13;
                    break;
                case "ACE":
                    card.value = 14;
                    break;
            }
        })
    });
    
    console.log(userCards, oppCards)
}

async function fetchCards(){
    var cardReq = new XMLHttpRequest();
    var giveUserCard = true;
    cardReq.open('GET',`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=52`, true);

    cardReq.onload = function(){
        data = JSON.parse(this.response)
        if (cardReq.status == 200){
            data.cards.forEach(card => {
                if(giveUserCard){
                    userCards.push(card);
                    giveUserCard = false;
                } else {
                    oppCards.push(card);
                    giveUserCard = true;
                }
            });
        } else {
            console.error(`There has been an error: Status ${cardReq.status}`);
        }
    }

    cardReq.send();
}

function playGame(){
    if(oppCards.length == 0 || userCards.length == 0){
        console.error("One or both decks are empty! Start a new game.");
        return;
    }
    const warBttn = document.querySelector('#warBttn');
    warBttn.setAttribute('disabled', 'true');

    var userCard = userCards.pop();
    var oppCard = oppCards.pop();

    var userWarDeck = [];
    var oppWarDeck = [];

    document.querySelector('#oppCard').src = oppCard.image;
    document.querySelector('#userCard').src = userCard.image;

    if(userCard.value == oppCard.value){
        userWarDeck = userCards.splice(userCards.length - 4, 4);
        oppWarDeck = oppCards.splice(oppCards.length - 4, 4);

        displayWar("user", userWarDeck[3]);
        displayWar("opponent", oppWarDeck[3]);
    }

    setTimeout(() => {
        if(userCard.value > oppCard.value){
            userCards.unshift(oppCard);
            userCards.unshift(userCard);
            console.log(userCard, oppCard, userCard.value > oppCard.value);
        }else if(oppCard.value > userCard.value){
            oppCards.unshift(userCard);
            oppCards.unshift(oppCard);
            console.log(userCard, oppCard, userCard.value < oppCard.value);
        }else{
            console.log(userWarDeck, oppWarDeck);
            console.log(userWarDeck[3].value > oppWarDeck[3].value)
            setTimeout(() => {
                if(userWarDeck[3].value > oppWarDeck[3].value){
                    userCards.unshift(userCard);
                    userCards.unshift(oppCard);
                    userWarDeck.forEach(card => {
                        userCards.unshift(card);
                    })
                    userWarDeck = [];
                    oppWarDeck.forEach(card => {
                        userCards.unshift(card);
                    })
                    oppWarDeck = [];
                }else if(oppWarDeck[3].value > userWarDeck[3].value){
                    oppCards.unshift(userCard);
                    oppCards.unshift(oppCard);
                    userWarDeck.forEach(card => {
                        userCards.unshift(card);
                    })
                    userWarDeck = [];
                    oppWarDeck.forEach(card => {
                        userCards.unshift(card);
                    })
                    oppWarDeck = [];
                }
                console.log(oppCards.length, userCards.length);  
                userScore.textContent = userCards.length;
                oppScore.textContent = oppCards.length;
            }, 3000);
        }

        if(userCard.value != oppCard.value){
            userScore.textContent = userCards.length;
            oppScore.textContent = oppCards.length;
            document.querySelector('#oppCard').src = "";
            document.querySelector('#userCard').src = "";
        }else{
            setTimeout(() => {
                document.querySelector('#oppCard').src = "";
                document.querySelector('#userCard').src = "";
            }, 3000);
        }
        warBttn.removeAttribute('disabled');
    }, 3000);
}

function displayWar(user, card){
    var unturnedCards = [];
    var warCard = card;
    console.log(card);

    if(user.toLowerCase() == "user"){
        unturnedCards = document.querySelectorAll('#userWarCards');
        warCard = document.querySelector('#userWarCard');

        unturnedCards.forEach(card => {
            card.src = "./cardBack.jpeg";
        })
        warCard.src = card.image;
    }
    if(user.toLowerCase() == "opponent"){
        unturnedCards = document.querySelectorAll('#oppWarCards');
        warCard = document.querySelector('#oppWarCard');

        unturnedCards.forEach(card => {
            card.src = "./cardBack.jpeg";
        })
        warCard.src = card.image;
    }


    setTimeout(() =>{
        unturnedCards.forEach(card => {
            card.src = "";
        })
        warCard.src = "";
    }, 6000);
}
