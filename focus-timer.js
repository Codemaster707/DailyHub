let totalSeconds = 0;
let interval = null;
let paused = false;
let durationSeconds = 0;

const display = document.getElementById("timerDisplay");
const tipBox = document.getElementById("focusTip");
const pauseBtn = document.getElementById("pauseBtn");
const circle = document.querySelector('.progress-ring__circle');
const radius = 80;
const circumference = 2 * Math.PI * radius;
circle.style.strokeDasharray = `${circumference}`;
circle.style.strokeDashoffset = `${circumference}`;
const alarm = document.getElementById("alarmAudio");

const tips = [
  "Put your phone in another room.",
  "Close all tabs except your task.",
  "Focus until the timer ends.",
  "Sit straight; bad posture kills focus.",
  "Note distracting thoughts and return to work.",
  "Progress over perfection.",
  "One task. One goal."
];

document.getElementById("startBtn").onclick = () => {
  let h = parseInt(document.getElementById("hours").value) || 0;
  let m = parseInt(document.getElementById("minutes").value) || 0;
  let s = parseInt(document.getElementById("seconds").value) || 0;

  // Validate inputs
  if(h < 0) h = 0;
  if(m < 0) m = 0; if(m > 59) m = 59;
  if(s < 0) s = 0; if(s > 59) s = 59;

  totalSeconds = h * 3600 + m * 60 + s;
  durationSeconds = totalSeconds;

  if (totalSeconds <= 0) return;

  clearInterval(interval);
  paused = false;
  pauseBtn.innerText = "Pause";
  resetButtonStyle(pauseBtn);
  updateDisplay();
  newTip();
  circle.style.strokeDashoffset = circumference;

  interval = setInterval(runTimer, 1000);
};

pauseBtn.onclick = () => {
  if (totalSeconds <= 0) return;
  paused = !paused;
  pauseBtn.innerText = paused ? "Resume" : "Pause";
  if (paused) { pauseBtn.style.background = "#e2e8f0"; pauseBtn.style.color = "#6366f1"; }
  else resetButtonStyle(pauseBtn);
};

document.getElementById("resetBtn").onclick = () => {
  clearInterval(interval);
  interval = null;
  totalSeconds = 0;
  durationSeconds = 0;
  display.innerText = "00:00:00";
  tipBox.innerText = "Ready for another session?";
  circle.style.strokeDashoffset = circumference;
  resetButtonStyle(pauseBtn);
};

function runTimer() {
  if (paused) return;

  if (totalSeconds <= 0) {
    clearInterval(interval);
    tipBox.innerText = "Session complete! Enjoy your break. ✨";
    display.style.color = "#6366f1";
    alarm.play();
    return;
  }

  totalSeconds--;
  updateDisplay();
  updateProgress();

  if (totalSeconds % 120 === 0) newTip();
}

function updateDisplay() {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  display.innerText = `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

function newTip() {
  tipBox.style.opacity = 0;
  setTimeout(() => {
    tipBox.innerText = tips[Math.floor(Math.random() * tips.length)];
    tipBox.style.opacity = 1;
  }, 300);
}

function updateProgress() {
  const offset = circumference - (totalSeconds / durationSeconds) * circumference;
  circle.style.strokeDashoffset = offset;
}

function resetButtonStyle(btn) {
  btn.innerText = "Pause";
  btn.style.background = "#f1f5f9";
  btn.style.color = "#1e293b";
}
// Make progress ring responsive
function resizeProgressRing() {
  const wrapper = document.querySelector('.timer-wrapper');
  const size = wrapper.offsetWidth;
  const svg = document.querySelector('.progress-ring');
  const circle = document.querySelector('.progress-ring__circle');
  
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  
  const radius = (size / 2) - 10; // 10px stroke width offset
  circle.setAttribute('r', radius);
  circle.setAttribute('cx', size / 2);
  circle.setAttribute('cy', size / 2);
  
  // Recalculate circumference
  const newCircumference = 2 * Math.PI * radius;
  circle.style.strokeDasharray = `${newCircumference}`;
  if (durationSeconds > 0) {
    const offset = newCircumference - (totalSeconds / durationSeconds) * newCircumference;
    circle.style.strokeDashoffset = offset;
  }
}

// Call on load and resize
window.addEventListener('resize', resizeProgressRing);
window.addEventListener('load', resizeProgressRing);

// Also call when starting/resetting timer
// Add resizeProgressRing(); inside start and reset functions if needed

