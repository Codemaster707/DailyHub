// ===== ELEMENTS =====
const taskTimeInput = document.getElementById("taskTime");
const taskPeriodInput = document.getElementById("taskPeriod");
const taskTextInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const todayDate = document.getElementById("todayDate");

// ===== DATE HANDLING =====
const today = new Date();
const todayKey = today.toDateString();
todayDate.textContent = todayKey;

// ===== LOAD SAVED DATA =====
let savedData = JSON.parse(localStorage.getItem("dailyhub-data"));
let tasks = [];

if (savedData && savedData.date === todayKey) {
    tasks = savedData.tasks;
} else {
    localStorage.setItem("dailyhub-data", JSON.stringify({
        date: todayKey,
        tasks: []
    }));
}

// ===== TIME CONVERSION =====
function convertToMinutes(time, period) {
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
}

// ===== RENDER TASKS =====
function renderTasks() {
    taskList.innerHTML = "";

    tasks.sort((a, b) => a.minutes - b.minutes);

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <span>${task.time} ${task.period}</span>
            <span class="task-text">${task.text}</span>
            <button class="delete-btn">Delete</button>
        `;

        li.querySelector(".delete-btn").addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        taskList.appendChild(li);
    });

    taskCount.textContent = tasks.length;
}

// ===== SAVE TASKS =====
function saveTasks() {
    localStorage.setItem("dailyhub-data", JSON.stringify({
        date: todayKey,
        tasks: tasks
    }));
}

// ===== ADD TASK =====
addTaskBtn.addEventListener("click", () => {
    const time = taskTimeInput.value;
    const period = taskPeriodInput.value;
    const text = taskTextInput.value.trim();

    if (!time || !text) return;

    tasks.push({
        time,
        period,
        text,
        minutes: convertToMinutes(time, period)
    });

    taskTimeInput.value = "";
    taskTextInput.value = "";

    saveTasks();
    renderTasks();
});

// ===== SMART TASKS NAV REDIRECT =====
document.querySelectorAll("span, li").forEach(el => {
    if (el.textContent.trim() === "Smart Tasks" || el.textContent.trim() === "🔔 Smart Tasks") {
        el.addEventListener("click", () => {
            window.location.href = "smarttasks.html"; // your Smart Tasks page
        });
    }
});

// ===== INITIAL RENDER =====
renderTasks();
