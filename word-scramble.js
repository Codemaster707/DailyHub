const scrambledWordEl = document.getElementById("scrambledWord");
const userInput = document.getElementById("userInput");
const messageEl = document.getElementById("message");
const livesPill = document.getElementById("lives-pill");
const scorePill = document.getElementById("score-pill");

let correctWord = "";
let score = 0;
let lives = 5;
let difficulty = "easy";
let pointsPerWord = 10;

// Two APIs: Vercel (clean & fast) for Easy/Medium, Heroku (wild & hard) for Hard
const VERCEL_API = "https://random-word-api.vercel.app/api/words";
const HEROKU_API = "https://random-word-api.herokuapp.com/word?number=50";

function startGame(mode) {
  difficulty = mode;
  if (mode === 'easy') { lives = 5; pointsPerWord = 10; }
  else if (mode === 'medium') { lives = 3; pointsPerWord = 50; }
  else { lives = 1; pointsPerWord = 100; }

  score = 0;
  updateUI();
  document.getElementById("level-section").style.display = "none";
  document.getElementById("quiz-section").style.display = "block";
  fetchWord();
}

async function fetchWord() {
  userInput.value = "";
  messageEl.textContent = "";
  scrambledWordEl.textContent = "WAIT...";

  try {
    let word = "";

    if (difficulty === 'hard') {
      // Use original Heroku API for Hard → often gives longer/more obscure words
      const res = await fetch(HEROKU_API);
      const data = await res.json();
      // Pick longest words first for extra hardness
      const longWords = data.filter(w => w.length >= 9).sort((a, b) => b.length - a.length);
      word = longWords.length > 0 ? longWords[0] : data[Math.floor(Math.random() * data.length)];
    } else {
      // Use Vercel API for Easy & Medium → clean, predictable lengths
      let url = `${VERCEL_API}?number=50`;
      if (difficulty === 'easy') {
        url += "&length=3,4,5";
      } else { // medium
        url += "&length=6,7,8";
      }

      const res = await fetch(url);
      const data = await res.json();
      word = data[Math.floor(Math.random() * data.length)];
    }

    correctWord = word.toLowerCase();
    scrambledWordEl.textContent = scramble(correctWord);
  } catch (err) {
    console.error("Both APIs failed, using fallback");
    const fallbacks = ["apple", "bread", "water", "house", "light", "pi", "cat", "dog", "sun", "moon", "star", "tree", "book", "pen", "cup", "fish", "bird", "cake", "milk", "road", "mountain", "river", "ocean"];
    correctWord = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    scrambledWordEl.textContent = scramble(correctWord);
  }
}

// Fisher-Yates shuffle for strong randomness
function fisherYatesShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function countCorrectPositions(original, scrambled) {
  let count = 0;
  for (let i = 0; i < original.length; i++) {
    if (original[i] === scrambled[i]) count++;
  }
  return count;
}

function scramble(word) {
  let original = word.toLowerCase();
  let arr = original.split("");

  if (difficulty === 'easy') {
    // Light scrambling — only a few swaps
    const swapCount = Math.ceil(word.length * 1.5);
    for (let i = 0; i < swapCount; i++) {
      const a = Math.floor(Math.random() * arr.length);
      const b = Math.floor(Math.random() * arr.length);
      if (a !== b) [arr[a], arr[b]] = [arr[b], arr[a]];
    }
  } else {
    // Medium & Hard: Strong full shuffle
    do {
      arr = original.split("");
      fisherYatesShuffle(arr);
      const scrambled = arr.join("");

      if (difficulty === 'hard') {
        const correctPos = countCorrectPositions(original, scrambled);
        const maxAllowed = Math.floor(original.length * 0.15); // Max 15% in correct spot
        if (correctPos > maxAllowed || scrambled === original) {
          continue; // Force re-shuffle
        }
      }
    } while (arr.join("") === original);
  }

  return arr.join("").toUpperCase();
}

function updateUI() {
  livesPill.textContent = "Lives: " + "❤️".repeat(lives);
  scorePill.textContent = `🏆 Score: ${score}`;
}

document.getElementById("checkBtn").addEventListener("click", () => {
  const answer = userInput.value.toLowerCase().trim();
  if (!answer) return;

  if (answer === correctWord) {
    score += pointsPerWord;
    messageEl.textContent = `✅ Correct! +${pointsPerWord} Points`;
    messageEl.style.color = "#00ff88";
    updateUI();
    setTimeout(fetchWord, 1500);
  } else {
    lives--;
    updateUI();
    if (lives <= 0) {
      messageEl.textContent = `💀 Game Over! Word: ${correctWord.toUpperCase()}`;
      messageEl.style.color = "#ff3366";
      setTimeout(() => location.reload(), 3000);
    } else {
      messageEl.textContent = "❌ Wrong! Try again.";
      messageEl.style.color = "#ff3366";
    }
  }
  userInput.focus();
});