// Game state
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let gameMode = 'multi';
let scores = { X: 0, O: 0 };

// DOM elements
const el = {
    homepage: document.getElementById('homepage'),
    modeSelection: document.getElementById('mode-selection'),
    gameBoard: document.getElementById('game-board-section'),
    result: document.getElementById('game-result'),
    currentPlayer: document.getElementById('current-player-display'),
    player1Score: document.getElementById('player1-score'),
    player2Score: document.getElementById('player2-score'),
    resultTitle: document.getElementById('result-title'),
    resultMessage: document.getElementById('result-message')
};

// Winning combinations
const wins = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6]            // diagonals
];

// Initialize game
function initGame() {
    // Navigation
    document.getElementById('play-now-btn').addEventListener('click', () => showPage('mode-selection'));
    document.getElementById('back-to-home-btn').addEventListener('click', () => showPage('homepage'));
    document.getElementById('back-to-modes-btn').addEventListener('click', () => showPage('mode-selection'));
    
    // Mode selection
    document.getElementById('single-player-btn').addEventListener('click', () => { gameMode = 'single'; startGame(); });
    document.getElementById('two-player-btn').addEventListener('click', () => { gameMode = 'multi'; startGame(); });
    
    // Game controls
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.getElementById('reset-btn').addEventListener('click', resetGame);
    document.getElementById('play-again-btn').addEventListener('click', playAgain);
    
    // Cell events
    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', (e) => handleCellClick(parseInt(e.target.getAttribute('data-index'))));
    });
    
    updateScores();
    showPage('homepage');
}

// Page navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    if (pageId === 'game-board-section') restartGame();
}

function startGame() {
    showPage('game-board-section');
}

// Game logic
function handleCellClick(index) {
    if (!gameActive || board[index] !== '') return;
    
    makeMove(index, currentPlayer);
    const result = checkGameResult();
    
    if (result === 'win') endGame('win');
    else if (result === 'draw') endGame('draw');
    else {
        switchPlayer();
        if (gameMode === 'single' && currentPlayer === 'O' && gameActive) {
            setTimeout(makeComputerMove, 600);
        }
    }
}

function makeMove(index, player) {
    board[index] = player;
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    el.currentPlayer.textContent = `Player ${currentPlayer}'s Turn`;
}

function checkGameResult() {
    for (let [a,b,c] of wins) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            [a,b,c].forEach(i => document.querySelector(`[data-index="${i}"]`).classList.add('win'));
            return 'win';
        }
    }
    return board.includes('') ? 'continue' : 'draw';
}

function makeComputerMove() {
    if (!gameActive) return;
    
    let move = findWinningMove('O') || findWinningMove('X');
    if (move === null) move = board[4] === '' ? 4 : findRandomMove();
    
    makeMove(move, 'O');
    const result = checkGameResult();
    
    if (result === 'win') endGame('win');
    else if (result === 'draw') endGame('draw');
    else switchPlayer();
}

function findWinningMove(player) {
    for (let [a,b,c] of wins) {
        const cells = [board[a], board[b], board[c]];
        if (cells.filter(c => c === player).length === 2) {
            if (board[a] === '') return a;
            if (board[b] === '') return b;
            if (board[c] === '') return c;
        }
    }
    return null;
}

function findRandomMove() {
    const moves = board.map((cell, i) => cell === '' ? i : null).filter(i => i !== null);
    return moves.length > 0 ? moves[Math.floor(Math.random() * moves.length)] : null;
}

function endGame(result) {
    gameActive = false;
    
    if (result === 'win') {
        scores[currentPlayer]++;
        updateScores();
        el.resultTitle.textContent = '🎉 Game Over!';
        el.resultMessage.textContent = `Player ${currentPlayer} wins!`;
    } else {
        el.resultTitle.textContent = "🤝 It's a Draw!";
        el.resultMessage.textContent = 'No one wins this round.';
    }
    
    el.result.classList.remove('hidden');
}

function updateScores() {
    el.player1Score.textContent = `X: ${scores.X}`;
    el.player2Score.textContent = `O: ${scores.O}`;
}

function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'win');
    });
    
    el.currentPlayer.textContent = `Player ${currentPlayer}'s Turn`;
    el.result.classList.add('hidden');
}

function resetGame() {
    scores = { X: 0, O: 0 };
    updateScores();
    restartGame();
}

function playAgain() {
    el.result.classList.add('hidden');
    restartGame();
}

// Start game
document.addEventListener('DOMContentLoaded', initGame);