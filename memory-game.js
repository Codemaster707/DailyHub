const gridEl = document.getElementById("game-grid");
const scorePill = document.getElementById("score-pill");
const movesPill = document.getElementById("moves-pill");

let flippedCards = [];
let score = 0;
let moves = 0;
let pointsPerMatch = 10;
let matchedPairs = 0;
let totalPairs = 0;

const emojiPool = ['🍎','🚀','🐱','💎','🎮','⭐️','🔥','🌈','🍦','🌍','🎸','🎨','🦁','🍕','🛸','👻','🏀','👾','🍀','🦊','🍄','🐳','⚡️','🥨','🎭','🥊','🧪','🏹','🛰','🔮','🧿','🤖','🍭','🍒','🍍','🛸'];

function startGame(mode) {
    document.getElementById("level-section").style.display = "none";
    document.getElementById("quiz-section").style.display = "block";
    gridEl.className = "memory-grid"; // Reset classes

    if (mode === 'easy') { 
        totalPairs = 4; pointsPerMatch = 10; 
    } else if (mode === 'medium') { 
        totalPairs = 8; pointsPerMatch = 50; 
    } else { 
        totalPairs = 12; pointsPerMatch = 100; 
        gridEl.classList.add("grid-hard"); // Switch to 6 columns
    }

    // Pick random symbols for this specific session
    const randomEmojis = [...emojiPool].sort(() => Math.random() - 0.5).slice(0, totalPairs);
    const gameSet = [...randomEmojis, ...randomEmojis].sort(() => Math.random() - 0.5);

    createBoard(gameSet);
}

function createBoard(set) {
    gridEl.innerHTML = "";
    set.forEach(emoji => {
        const card = document.createElement("div");
        card.classList.add("memory-card");
        card.dataset.value = emoji;
        card.innerHTML = `
            <div class="card-front">?</div>
            <div class="card-back">${emoji}</div>
        `;
        card.addEventListener("click", flipCard);
        gridEl.appendChild(card);
    });
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains("flipped")) {
        this.classList.add("flipped");
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            moves++;
            movesPill.textContent = `Moves: ${moves}`;
            checkMatch();
        }
    }
}

function checkMatch() {
    const [c1, c2] = flippedCards;
    if (c1.dataset.value === c2.dataset.value) {
        score += pointsPerMatch;
        matchedPairs++;
        scorePill.textContent = `🏆 Score: ${score}`;
        setTimeout(() => {
            c1.classList.add("matched");
            c2.classList.add("matched");
            flippedCards = [];
            if (matchedPairs === totalPairs) {
                alert(`🎊 Incredible! You finished in ${moves} moves!`);
            }
        }, 500);
    } else {
        setTimeout(() => {
            c1.classList.remove("flipped");
            c2.classList.remove("flipped");
            flippedCards = [];
        }, 800);
    }
}