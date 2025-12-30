const levelSection = document.getElementById("level-section");
const quizSection = document.getElementById("quiz-section");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const timeEl = document.getElementById("time");
const progressBar = document.getElementById("progress-bar");
const qCountEl = document.getElementById("q-count");
const resultSection = document.getElementById("result-section");
const scoreDisplay = document.getElementById("score-display");
const levelDisplay = document.getElementById("level-display");
const restartBtn = document.getElementById("restartBtn");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
let selectedLevel = "";
let difficultyName = "";
let apiDifficulty = ""; // This will be "easy", "medium", or "hard"

// Level selection
document.querySelectorAll(".level-card").forEach(card => {
  card.addEventListener("click", () => {
    selectedLevel = card.dataset.level;
    difficultyName = card.querySelector("h2").textContent.trim().split(" ")[1]; // Easy/Medium/Hard
    apiDifficulty = selectedLevel; // Direct mapping: easy -> easy, etc.

    timeLeft = selectedLevel === "easy" ? 20 : selectedLevel === "medium" ? 15 : 10;

    levelSection.style.display = "none";
    quizSection.style.display = "block";
    fetchQuestions();
  });
});

async function fetchQuestions() {
  let url = `https://opentdb.com/api.php?amount=10&type=multiple&difficulty=${apiDifficulty}`;

  // Optional: Add category for better variety / availability
  // These categories have good coverage for each difficulty
  if (selectedLevel === "easy") {
    // General Knowledge has tons of easy questions
    url += "&category=9";
  } else if (selectedLevel === "medium") {
    // Mix: Science & Nature (17), History (23), Geography (22), Entertainment: Film (11)
    const mediumCats = [17, 23, 22, 11];
    const randomCat = mediumCats[Math.floor(Math.random() * mediumCats.length)];
    url += `&category=${randomCat}`;
  } else if (selectedLevel === "hard") {
    // Categories with known hard questions: Science: Computers (18), Entertainment: Video Games (15), Science: Mathematics (19)
    const hardCats = [18, 15, 19, 17];
    const randomCat = hardCats[Math.floor(Math.random() * hardCats.length)];
    url += `&category=${randomCat}`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.response_code === 1) {
      // Not enough questions — fallback to any difficulty in mixed categories
      questionEl.textContent = "Not enough questions at this difficulty! Loading mixed ones instead...";
      await fetchFallbackQuestions();
      return;
    }

    questions = data.results.map(q => {
      const options = [...q.incorrect_answers];
      const randomIndex = Math.floor(Math.random() * 4);
      options.splice(randomIndex, 0, q.correct_answer);
      return { question: q.question, options, correct: q.correct_answer };
    });

    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
  } catch (err) {
    questionEl.textContent = "Failed to load questions. Check internet & refresh.";
  }
}

async function fetchFallbackQuestions() {
  // Fallback: any difficulty, mixed categories
  let fallbackUrl = "https://opentdb.com/api.php?amount=10&type=multiple";
  const allCats = [9, 17, 22, 23, 11, 18, 15, 19];
  const randomCat = allCats[Math.floor(Math.random() * allCats.length)];
  fallbackUrl += `&category=${randomCat}`;

  const res = await fetch(fallbackUrl);
  const data = await res.json();
  questions = data.results.map(q => {
    const options = [...q.incorrect_answers];
    const randomIndex = Math.floor(Math.random() * 4);
    options.splice(randomIndex, 0, q.correct_answer);
    return { question: q.question, options, correct: q.correct_answer };
  });

  currentQuestionIndex = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  if (currentQuestionIndex >= questions.length) return endQuiz();

  const q = questions[currentQuestionIndex];
  progressBar.style.width = `${((currentQuestionIndex + 1) / 10) * 100}%`;
  qCountEl.textContent = `Challenge ${currentQuestionIndex + 1}/10`;
  
  questionEl.innerHTML = decodeHTML(q.question);
  optionsEl.innerHTML = "";
  timeEl.textContent = timeLeft;

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = decodeHTML(opt);
    btn.onclick = () => checkAnswer(btn, opt);
    optionsEl.appendChild(btn);
  });
  
  startTimer();
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      highlightCorrect();
      setTimeout(nextQuestion, 1500);
    }
  }, 1000);
}

function checkAnswer(selectedBtn, selectedText) {
  clearInterval(timer);
  const correctText = decodeHTML(questions[currentQuestionIndex].correct);
  document.querySelectorAll(".option-btn").forEach(b => b.disabled = true);

  if (decodeHTML(selectedText) === correctText) {
    selectedBtn.classList.add("correct-glow");
    score++;
  } else {
    selectedBtn.classList.add("wrong-glow");
    highlightCorrect();
  }
  
  setTimeout(nextQuestion, 1500);
}

function highlightCorrect() {
  const correctText = decodeHTML(questions[currentQuestionIndex].correct);
  document.querySelectorAll(".option-btn").forEach(btn => {
    if (btn.innerHTML === correctText) btn.classList.add("correct-glow");
  });
}

function nextQuestion() {
  currentQuestionIndex++;
  timeLeft = selectedLevel === "easy" ? 20 : selectedLevel === "medium" ? 15 : 10;
  showQuestion();
}

function endQuiz() {
  document.getElementById("quiz-card").style.display = "none";
  resultSection.style.display = "block";

  levelDisplay.textContent = `Difficulty: ${difficultyName}`;
  levelDisplay.style.fontSize = "1.5rem";
  levelDisplay.style.marginBottom = "20px";
  levelDisplay.style.color = difficultyName === "Easy" ? "#00ff88" : difficultyName === "Medium" ? "#ff9d00" : "#ff3366";

  let message = "";
  let emoji = "";
  if (score >= 9) { message = "Absolute Legend!"; emoji = "🏆"; }
  else if (score >= 7) { message = "Brain on Fire!"; emoji = "🔥"; }
  else if (score >= 5) { message = "Solid Performance!"; emoji = "💪"; }
  else { message = "Keep Grinding!"; emoji = "📚"; }

  scoreDisplay.innerHTML = `
    ${emoji} <strong>${message}</strong><br><br>
    Final Score: <span style="font-size: 3.5rem; color:var(--blue); font-weight:900">${score}/10</span>
  `;
}

restartBtn.addEventListener("click", () => location.reload());

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}