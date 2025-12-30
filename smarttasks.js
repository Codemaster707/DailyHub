// ===== ELEMENTS =====
const taskTextInput = document.getElementById("taskText");
const taskTimeInput = document.getElementById("taskTime");
const taskPriorityInput = document.getElementById("taskPriority");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const completedCount = document.getElementById("completedCount");
const todayDate = document.getElementById("todayDate");

// ===== REMINDER ELEMENTS =====
const reminderPopup = document.getElementById("reminderPopup");
const reminderText = document.getElementById("reminderText");
const closeReminder = document.getElementById("closeReminder");
const reminderSound = document.getElementById("reminderSound");

// ===== AUDIO UNLOCK (CRITICAL FIX) =====
let audioUnlocked = false;

document.addEventListener("click", () => {
    if (!audioUnlocked) {
        reminderSound.play().then(() => {
            reminderSound.pause();
            reminderSound.currentTime = 0;
            audioUnlocked = true;
            console.log("🔓 Reminder sound unlocked");
        }).catch(() => {});
    }
});

// ===== DATE =====
const today = new Date();
const todayKey = today.toDateString();
todayDate.textContent = todayKey;

// ===== LOAD DATA =====
let savedData = JSON.parse(localStorage.getItem("smarttasks-data"));
let tasks = [];

if (savedData && savedData.date === todayKey) {
    tasks = savedData.tasks;
} else {
    localStorage.setItem(
        "smarttasks-data",
        JSON.stringify({ date: todayKey, tasks: [] })
    );
}

// ===== SAVE TASKS =====
function saveTasks() {
    localStorage.setItem(
        "smarttasks-data",
        JSON.stringify({ date: todayKey, tasks })
    );
}

// ===== RENDER TASKS =====
function renderTasks() {
    taskList.innerHTML = "";
    let completed = 0;

    tasks.forEach((task, index) => {
        if (task.completed) completed++;

        const card = document.createElement("div");
        card.className = "task-card";

        card.innerHTML = `
            <div class="task-text">${task.text}</div>
            <div class="task-details">
                <span class="time">${task.time}</span>
                <span class="priority ${task.priority.toLowerCase()}">${task.priority}</span>
            </div>
            <div class="task-actions">
                <button class="complete-btn" onclick="toggleComplete(${index})">
                    ${task.completed ? "✓" : "○"}
                </button>
                <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
            </div>
        `;

        taskList.appendChild(card);
    });

    taskCount.textContent = tasks.length;
    completedCount.textContent = completed;
}

// ===== TOGGLE COMPLETE =====
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// ===== DELETE TASK =====
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// ===== ADD TASK =====
addTaskBtn.addEventListener("click", () => {
    const text = taskTextInput.value.trim();
    const time = taskTimeInput.value;
    const priority = taskPriorityInput.value;

    if (!text || !time) return;

    tasks.push({
        text,
        time,
        priority,
        completed: false,
        notified: false
    });

    taskTextInput.value = "";
    taskTimeInput.value = "";
    taskPriorityInput.value = "Medium";

    saveTasks();
    renderTasks();
});

// ===== SMART REMINDER CHECK (FAST + SAFE) =====
setInterval(() => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    tasks.forEach(task => {
        if (task.completed || task.notified) return;

        const [h, m] = task.time.split(":").map(Number);
        const taskMinutes = h * 60 + m;

        if (currentMinutes >= taskMinutes) {
            reminderText.textContent =
                `🔔 Time for: ${task.text} (Priority: ${task.priority})`;

            reminderPopup.style.display = "block";

            reminderSound.currentTime = 0;
            reminderSound.play().catch(() => {});

            task.notified = true;
            saveTasks();
        }
    });
}, 10000); // check every 10 sec

// ===== DAILY RESET AT MIDNIGHT =====
setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        tasks.forEach(task => (task.notified = false));
        saveTasks();
    }
}, 60000);

// ===== CLOSE REMINDER =====
closeReminder.addEventListener("click", () => {
    reminderPopup.style.display = "none";
    reminderSound.pause();
    reminderSound.currentTime = 0;
});

// ===== INITIAL RENDER =====
renderTasks();
