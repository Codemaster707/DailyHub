const wordDisplay = document.getElementById("wordDisplay");
const keyboard = document.getElementById("keyboard");
const livesPill = document.getElementById("lives-pill");
const scorePill = document.getElementById("score-pill");
const hintEl = document.getElementById("hintText");

let secretWord = "";
let currentHint = "";
let guessedLetters = [];
let score = 0;
let lives = 6;
let maxLives = 6;
let pointsPerWord = 10;
let difficulty = "easy";
let gameActive = false;

const parts = ["head", "body", "arm-l", "arm-r", "leg-l", "leg-r"];

async function startGame(mode) {
    difficulty = mode;
    gameActive = true;
    if (mode === 'easy') { lives = 6; pointsPerWord = 10; }
    else if (mode === 'medium') { lives = 4; pointsPerWord = 50; }
    else { lives = 2; pointsPerWord = 100; }
    
    maxLives = lives;
    document.getElementById("level-section").style.display = "none";
    document.getElementById("quiz-section").style.display = "block";
    updateUI();
    setupNewRound();
}

async function setupNewRound() {
    gameActive = false;
    guessedLetters = [];
    resetHangman();
    wordDisplay.textContent = "LOADING...";
    hintEl.textContent = "Selecting word...";

    // Length ranges tuned for difficulty
    let minL = 4, maxL = 6;
    if (difficulty === 'easy') { minL = 4; maxL = 6; }
    else if (difficulty === 'medium') { minL = 6; maxL = 9; }
    else { minL = 9; maxL = 13; }

    // Build pattern: e.g., ????? for length 5–6
    const patternLength = Math.floor(Math.random() * (maxL - minL + 1)) + minL;
    const pattern = "?".repeat(patternLength);

    try {
        // Use rel_frq for real frequency data + definitions
        const response = await fetch(`https://api.datamuse.com/words?sp=${pattern}&md=dfr&max=500`);
        const data = await response.json();

        // Filter valid words with definition and frequency tag
        let candidates = data.filter(item => 
            item.word.length >= minL &&
            item.word.length <= maxL &&
            /^[a-z]+$/.test(item.word) &&
            item.defs && item.defs.length > 0 &&
            item.tags && item.tags.some(t => t.startsWith("f:"))
        );

        if (candidates.length === 0) throw new Error("No candidates");

        // Extract numeric frequency (higher = more common)
        candidates.forEach(item => {
            const freqTag = item.tags.find(t => t.startsWith("f:"));
            item.freq = freqTag ? parseFloat(freqTag.split(":")[1]) : 0;
        });

        // Difficulty-based selection
        let selectedPool;
        if (difficulty === "easy") {
            // Top 20% most common words
            candidates.sort((a, b) => b.freq - a.freq);
            selectedPool = candidates.slice(0, Math.max(10, Math.floor(candidates.length * 0.2)));
        } else if (difficulty === "medium") {
            // Middle frequency range (avoid very common and very rare)
            candidates.sort((a, b) => b.freq - a.freq);
            const start = Math.floor(candidates.length * 0.25);
            const end = Math.floor(candidates.length * 0.75);
            selectedPool = candidates.slice(start, end);
        } else { // hard
            // Bottom 30% — rarest words
            candidates.sort((a, b) => a.freq - b.freq);
            selectedPool = candidates.slice(0, Math.max(15, Math.floor(candidates.length * 0.3)));
        }

        const choice = selectedPool[Math.floor(Math.random() * selectedPool.length)];
        secretWord = choice.word.toLowerCase();
        currentHint = choice.defs[0].split('\t')[1] || "No hint available";

        gameActive = true;
        renderWord();
        renderKeyboard();
        hintEl.innerHTML = `<span style="color:var(--blue)">Hint:</span> ${currentHint}`;

    } catch (error) {
        console.error("API Error or no words:", error);
        // Fallback words matching difficulty
        const fallbacks = {
            easy: { word: "friend", hint: "A person you know and like" },
            medium: { word: "journey", hint: "A trip or travel from one place to another" },
            hard: { word: "quixotic", hint: "Unrealistically optimistic or impractical" }
        };
        const fb = fallbacks[difficulty];
        secretWord = fb.word;
        currentHint = fb.hint;

        gameActive = true;
        renderWord();
        renderKeyboard();
        hintEl.innerHTML = `<span style="color:var(--blue)">Hint:</span> ${currentHint}`;
    }
}

function renderWord() {
    wordDisplay.textContent = secretWord.split("").map(letter => 
        guessedLetters.includes(letter) ? letter.toUpperCase() : "_"
    ).join(" ");
}

function renderKeyboard() {
    keyboard.innerHTML = "";
    "abcdefghijklmnopqrstuvwxyz".split("").forEach(char => {
        const btn = document.createElement("button");
        btn.textContent = char.toUpperCase();
        btn.classList.add("key");
        btn.id = `key-${char}`;
        btn.onclick = () => handleGuess(char, btn);
        keyboard.appendChild(btn);
    });
}

function handleGuess(char, btn) {
    if (!gameActive || guessedLetters.includes(char)) return;
    btn.disabled = true;
    guessedLetters.push(char);

    if (secretWord.includes(char)) {
        btn.classList.add("correct");
        renderWord();
        if (!wordDisplay.textContent.includes("_")) {
            score += pointsPerWord;
            updateUI();
            gameActive = false;
            setTimeout(() => { 
                alert("🎉 Correct! Moving to next word...");
                setupNewRound(); 
            }, 600);
        }
    } else {
        lives--;
        btn.classList.add("wrong");
        drawHangman();
        updateUI();
        if (lives <= 0) {
            gameActive = false;
            setTimeout(() => { 
                alert(`💀 Game Over! The word was: ${secretWord.toUpperCase()}`);
                location.reload();
            }, 600);
        }
    }
}

function drawHangman() {
    const mistakes = maxLives - lives;
    if (difficulty === 'hard') {
        if (mistakes === 1) ["head", "body", "arm-l"].forEach(id => document.getElementById(id).style.display = "block");
        if (mistakes === 2) ["arm-r", "leg-l", "leg-r"].forEach(id => document.getElementById(id).style.display = "block");
    } else if (difficulty === 'medium') {
        const groups = [["head"], ["body"], ["arm-l", "arm-r"], ["leg-l", "leg-r"]];
        if (mistakes > 0 && mistakes <= 4) {
            groups[mistakes - 1].forEach(id => document.getElementById(id).style.display = "block");
        }
    } else { // easy
        const partId = parts[mistakes - 1];
        if (partId) document.getElementById(partId).style.display = "block";
    }
}

function resetHangman() {
    parts.forEach(id => document.getElementById(id).style.display = "none");
}

function updateUI() {
    livesPill.textContent = `Lives: ${lives}`;
    scorePill.textContent = `🏆 Score: ${score}`;
}

document.addEventListener("keydown", (e) => {
    if (!gameActive) return;
    const key = e.key.toLowerCase();
    if (key >= "a" && key <= "z") {
        const button = document.getElementById(`key-${key}`);
        if (button && !button.disabled) handleGuess(key, button);
    }
});