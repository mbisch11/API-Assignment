var userCards= [];
var oppCards = [];
var deckID;

var userScore = document.querySelector('#userScore');
var oppScore = document.querySelector('#oppScore');

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
    await fetchCards();

    userScore.textContent = userCards.length;
    oppScore.textContent = oppCards.length;
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
    const warBttn = document.querySelector('#warBttn');
    warBttn.setAttribute('disabled', 'true');

    var userCard = userCards.pop();
    var oppCard = oppCards.pop();

    switch(userCard.value){
        case "JACK":
            userCard.value = 11;
            break;
        case "QUEEN":
            userCard.value = 12;
            break;
        case "KING":
            userCard.value = 13;
            break;
        case "ACE":
            userCard.value = 14;
            break;
    }
    switch(oppCard.value){
        case "JACK":
            oppCard.value = 11;
            break;
        case "QUEEN":
            oppCard.value = 12;
            break;
        case "KING":
            oppCard.value = 13;
            break;
        case "ACE":
            oppCard.value = 14;
            break;
    }

    setTimeout(() => {
        if(userCard.value > oppCard.value){
            userCards.unshift(oppCard);
            userCards.unshift(userCard);
        }else if(oppCard.value > userCard.value){
            oppCards.unshift(userCard);
            oppCards.unshift(oppCard);
        }
        document.querySelector('#oppCard').src = "";
        document.querySelector('#userCard').src = "";

        userScore.textContent = userCards.length;
        oppScore.textContent = oppCards.length;
        warBttn.removeAttribute('disabled');
    }, 3000);

    document.querySelector('#oppCard').src = oppCard.image;
    document.querySelector('#userCard').src = userCard.image;
}
