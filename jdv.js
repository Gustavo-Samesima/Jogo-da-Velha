let board, currentPlayer, gameActive, playAgainstComputer, difficulty;
const boardSize = 3;

function startGame(againstComputer, diff = 'easy') {
  playAgainstComputer = againstComputer;
  difficulty = diff;
  currentPlayer = "X";
  gameActive = true;
  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(""));
  updateStatus();
  renderBoard();
}

function renderBoard() {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = '';
  gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
  board.forEach((row, i) => row.forEach((cell, j) => {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    cellElement.textContent = cell;
    cellElement.onclick = () => handleMove(i, j);
    gameBoard.appendChild(cellElement);
  }));
}

function handleMove(row, col) {
  if (!gameActive || board[row][col]) return;
  board[row][col] = currentPlayer;
  renderBoard();

  if (checkWin()) return endGame(`${currentPlayer} venceu!`);
  if (board.flat().every(cell => cell)) return endGame("Empate!");

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus();

  if (playAgainstComputer && currentPlayer === "O") setTimeout(playAgainstBot, 500);
}

function playAgainstBot() {
  const move = (difficulty === 'easy') ? getRandomMove() : getBestMove();
  if (move) handleMove(move.row, move.col);
}

function getRandomMove() {
  const emptyCells = board.flatMap((row, i) => row.map((cell, j) => !cell ? { row: i, col: j } : null)).filter(Boolean);
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function getBestMove() {
  return winningMove("O") || winningMove("X") || getRandomMove();
}

function winningMove(player) {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (!board[i][j]) {
        board[i][j] = player;
        const isWin = checkWin();
        board[i][j] = "";
        if (isWin) return { row: i, col: j };
      }
    }
  }
  return null;
}

function checkWin() {
  const lines = [
    ...board, 
    ...board[0].map((_, i) => board.map(row => row[i])),
    board.map((_, i) => board[i][i]), 
    board.map((_, i) => board[i][boardSize - i - 1])
  ];
  return lines.some(line => line.every(cell => cell === currentPlayer));
}

function updateStatus() {
  document.getElementById("status").textContent = `Jogador Atual: ${currentPlayer}`;
}

function endGame(message) {
  document.getElementById("status").textContent = message;
  gameActive = false;
}

function showRules() {
  alert(`Regras do Jogo da Velha\n\nObjetivo: Alinhar símbolos na horizontal, vertical ou diagonal.\nModos:\n- Multiplayer: Dois jogadores alternam jogadas.\n- Contra o Computador: Fácil (joga aleatoriamente), Difícil (tenta bloquear ou vencer).\nPasso a Passo:\n1. Escolha o modo.\n2. Clique para jogar.\n3. O bot joga automaticamente no modo contra o computador.`);
}
