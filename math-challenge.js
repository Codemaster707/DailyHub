const questionEl = document.getElementById("question");
const answerInput = document.getElementById("answer");
const messageEl = document.getElementById("message");
const livesPill = document.getElementById("lives-pill");
const scorePill = document.getElementById("score-pill");

let score = 0;
let lives = 5;
let correctAnswer = 0;
let difficulty = "easy";
let pointsPerQuestion = 10;

function startGame(mode) {
  difficulty = mode;
  if (mode === 'easy') { lives = 5; pointsPerQuestion = 10; }
  else if (mode === 'medium') { lives = 3; pointsPerQuestion = 50; }
  else { lives = 1; pointsPerQuestion = 100; }

  updateUI();
  document.getElementById("level-section").style.display = "none";
  document.getElementById("quiz-section").style.display = "block";
  generateQuestion();
}

function generateQuestion() {
  answerInput.value = "";
  messageEl.textContent = "";
  let a, b, op;

  if (difficulty === "easy") {
    a = Math.floor(Math.random() * 15) + 1;
    b = Math.floor(Math.random() * 15) + 1;
    op = Math.random() > 0.5 ? "+" : "-";
    // Ensure no negative answers in easy mode
    if (op === "-" && a < b) [a, b] = [b, a]; 
  } 
  else if (difficulty === "medium") {
    a = Math.floor(Math.random() * 12) + 2;
    b = Math.floor(Math.random() * 12) + 2;
    op = "×";
  } 
  else {
    a = Math.floor(Math.random() * 50) + 10;
    b = Math.floor(Math.random() * 20) + 5;
    const ops = ["+", "-", "×", "÷"];
    op = ops[Math.floor(Math.random() * ops.length)];
    // If division, make sure it's a clean whole number
    if (op === "÷") {
      correctAnswer = Math.floor(Math.random() * 10) + 2;
      a = correctAnswer * b;
    }
  }

  if (op === "+") correctAnswer = a + b;
  if (op === "-") correctAnswer = a - b;
  if (op === "×") correctAnswer = a * b;
  if (op === "÷" && difficulty === "hard") { /* already handled above */ }

  questionEl.textContent = `${a} ${op} ${b} = ?`;
}

function updateUI() {
  livesPill.textContent = "Lives: " + "❤️".repeat(lives);
  scorePill.textContent = `🏆 Score: ${score}`;
}

document.getElementById("submitBtn").addEventListener("click", () => {
  const userAns = Number(answerInput.value);
  if (answerInput.value === "") return;

  if (userAns === correctAnswer) {
    score += pointsPerQuestion;
    messageEl.textContent = "✅ Correct!";
    messageEl.style.color = "#00ff88";
    updateUI();
    setTimeout(generateQuestion, 1200);
  } else {
    lives--;
    messageEl.textContent = "❌ Wrong Answer!";
    messageEl.style.color = "#ff3366";
    updateUI();

    if (lives <= 0) {
      messageEl.textContent = `💀 Game Over! Answer was ${correctAnswer}`;
      setTimeout(() => location.reload(), 3000);
    }
  }
});

// Allow "Enter" key to submit
answerInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") document.getElementById("submitBtn").click();
});