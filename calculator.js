const display = document.getElementById("display");
const buttons = document.querySelectorAll("button:not(.advanced):not(.adv-toggle-btn)");
const advButtons = document.querySelectorAll(".advanced");
const advPanel = document.getElementById("advanced-panel");
const toggleBtn = document.getElementById("toggle-adv");

// Toggle Advanced Panel
toggleBtn.addEventListener("click", () => {
    advPanel.classList.toggle("show");
    toggleBtn.innerText = advPanel.classList.contains("show") ? "Standard Mode ▴" : "Scientific Mode ▾";
});

function append(value) {
    display.value += value;
}

function calculate() {
    try {
        let expression = display.value
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/−/g, "-");

        // Auto-close missing parentheses
        const openP = (expression.match(/\(/g) || []).length;
        const closeP = (expression.match(/\)/g) || []).length;
        expression += ")".repeat(Math.max(0, openP - closeP));

        let result = eval(expression);
        
        // Handle decimals to keep UI pretty
        display.value = Number.isInteger(result) ? result : parseFloat(result.toFixed(8));
    } catch {
        display.value = "Error";
    }
}

// Button Clicks
buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const value = btn.innerText;
        if (btn.classList.contains("clear")) display.value = "";
        else if (btn.classList.contains("delete")) display.value = display.value.slice(0, -1);
        else if (btn.classList.contains("equals")) calculate();
        else append(value);
    });
});

// Advanced Button Clicks
advButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        append(btn.getAttribute("data-func"));
    });
});

// Keyboard Support
document.addEventListener("keydown", e => {
    if (!isNaN(e.key) || e.key === ".") append(e.key);
    if (["+", "-", "*", "/"].includes(e.key)) {
        const map = { "*": "×", "/": "÷", "-": "−", "+": "+" };
        append(map[e.key]);
    }
    if (e.key === "Enter") { e.preventDefault(); calculate(); }
    if (e.key === "Backspace") display.value = display.value.slice(0, -1);
    if (e.key.toLowerCase() === "c") display.value = "";
});