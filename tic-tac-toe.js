let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let userSymbol = "X";
let cpuSymbol = "O";
let gameActive = false;
let mode = "friend";

const turnIndicator = document.getElementById("turn-indicator");
const idIndicator = document.getElementById("player-id-pill");
const cells = document.querySelectorAll(".cell");

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function startTicTacToe(selectedMode) {
    mode = selectedMode;
    document.getElementById("level-section").style.display = "none";
    document.getElementById("quiz-section").style.display = "block";
    resetGame();
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    cells.forEach(cell => { cell.textContent = ""; cell.className = "cell"; });

    if (mode !== "friend") {
        userSymbol = Math.random() > 0.5 ? "X" : "O";
        cpuSymbol = userSymbol === "X" ? "O" : "X";
        idIndicator.textContent = `You: ${userSymbol}`;
        
        if (cpuSymbol === "X") {
            turnIndicator.textContent = "CPU Thinking...";
            setTimeout(cpuPlay, 600);
        } else {
            turnIndicator.textContent = "Your Turn (X)";
        }
    } else {
        idIndicator.textContent = "Local PvP";
        turnIndicator.textContent = "Player X's Turn";
    }
}

cells.forEach(cell => {
    cell.addEventListener("click", () => {
        const idx = cell.dataset.index;
        if (board[idx] !== "" || !gameActive) return;
        if (mode !== "friend" && currentPlayer !== userSymbol) return;
        executeMove(idx);
        if (gameActive && mode !== "friend") setTimeout(cpuPlay, 600);
    });
});

function executeMove(idx) {
    board[idx] = currentPlayer;
    cells[idx].textContent = currentPlayer;
    cells[idx].classList.add(currentPlayer === "X" ? "x-mark" : "o-mark", "taken");

    if (checkWin(board, currentPlayer)) {
        alert(`${currentPlayer} Wins!`);
        gameActive = false;
        return;
    }
    if (board.every(s => s !== "")) {
        alert("Draw!");
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    turnIndicator.textContent = (mode === "friend") ? `${currentPlayer}'s Turn` : 
                                 (currentPlayer === userSymbol ? "Your Turn" : "CPU Thinking...");
}

function cpuPlay() {
    if (!gameActive) return;
    let move;
    if (mode === "easy") {
        const available = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
        move = available[Math.floor(Math.random() * available.length)];
    } else if (mode === "medium") {
        move = findBestMove(board, cpuSymbol) || findBestMove(board, userSymbol) || board.indexOf("");
    } else {
        move = minimax(board, cpuSymbol).index;
    }
    executeMove(move);
}

function findBestMove(b, symbol) {
    for (let cond of winConditions) {
        let vals = cond.map(i => b[i]);
        if (vals.filter(v => v === symbol).length === 2 && vals.includes("")) return cond[vals.indexOf("")];
    }
    return null;
}

function minimax(newBoard, player) {
    let avail = newBoard.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    if (checkWin(newBoard, userSymbol)) return {score: -10};
    if (checkWin(newBoard, cpuSymbol)) return {score: 10};
    if (avail.length === 0) return {score: 0};

    let moves = [];
    for (let i of avail) {
        newBoard[i] = player;
        let score = minimax(newBoard, player === cpuSymbol ? userSymbol : cpuSymbol).score;
        newBoard[i] = "";
        moves.push({index: i, score: score});
    }

    return moves.reduce((best, m) => (player === cpuSymbol ? m.score > best.score : m.score < best.score) ? m : best);
}

function checkWin(b, p) { return winConditions.some(c => c.every(i => b[i] === p)); }