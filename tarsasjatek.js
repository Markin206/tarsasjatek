const gridContainer = document.querySelector(".grid-container");
let kartyak = [];
let elsoKartya, masodikKartya;
let lockBoard = false; //Ezzel fogjok összemérni a két kártyát
let score = 0;

document.querySelector(".score").textContent = score;

fetch("./data/cards.json")
    .then((res) => res.json())
    .then((data) => {
        kartyak = [...data,...data];
        keveres();
        generalas();
    });

function keveres(){
    let currentIndex = kartyak.length,
    randomIndex,
    ideiglenesErtek;
    while(currentIndex !==0){
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        ideiglenesErtek = kartyak[currentIndex];
        kartyak[currentIndex] = kartyak[randomIndex];
        kartyak[randomIndex] = ideiglenesErtek;
    }
}

function generalas(){
    for(let kartya of kartyak){
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");// a kártyához add egy "card" osztályt
        cardElement.setAttribute("data-name", kartya.name);
        cardElement.innerHTML = `
        <div class="front">
            <img class="front-image" src=${kartya.image} />
        </div>
        <div class = "back"></div>
        `;
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener("click",flipCard)
    }
}

function flipCard() {
    if(lockBoard) return;
    if (this === elsoKartya) return;

    this.classList.add("flipped");
    if(!elsoKartya){
        elsoKartya = this;
        return;
    }
    masodikKartya = this;
    score++;
    document.querySelector(".score").textContent = score;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch(){
    let isMatch = elsoKartya.dataset.name === masodikKartya.dataset.name;
    isMatch ? disableCards() : unflipCards();
}

function disableCards(){
    elsoKartya.removeEventListener("click", flipCard);
    masodikKartya.removeEventListener("click", flipCard);

    resetBoard();
}

function unflipCards(){
    setTimeout(() => {
        elsoKartya.classList.remove("flipped");
        masodikKartya.classList.remove("flipped");
        resetBoard();
    }, 1000)
}

function resetBoard() {
    elsoKartya = null;
    masodikKartya = null;
    lockBoard = false;
}

function restart(){
    resetBoard();
    keveres();
    score = 0;
    document.querySelector(".score").textContent = score;
    gridContainer.innerHTML = "";
    generalas();
}