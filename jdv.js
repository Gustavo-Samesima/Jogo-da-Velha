let boardSize = 3;
let board = [];
let currentPlayer = "X";
let gameActive = true;
let playAgainstComputer = false;

function startGame(size, againstComputer) {
  boardSize = size;
  playAgainstComputer = againstComputer;
  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(""));
  currentPlayer = "X";
  gameActive = true;
  document.getElementById("status").textContent = `Jogador Atual: ${currentPlayer}`;
  renderBoard();
}

function renderBoard() {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";
  gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 60px)`;

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.textContent = board[row][col];
      cell.addEventListener("click", () => handleMove(row, col));
      gameBoard.appendChild(cell);
    }
  }
}

function handleMove(row, col) {
  if (board[row][col] !== "" || !gameActive) return;

  board[row][col] = currentPlayer;
  renderBoard();

  if (checkWin()) {
    document.getElementById("status").textContent = `Jogador ${currentPlayer} venceu!`;
    gameActive = false;
  } else if (board.flat().every(cell => cell !== "")) {
    document.getElementById("status").textContent = "Empate!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    document.getElementById("status").textContent = `Jogador Atual: ${currentPlayer}`;

    if (playAgainstComputer && currentPlayer === "O" && gameActive) {
      playAgainstBot();
    }
  }
}

function playAgainstBot() {
  // O computador faz uma jogada aleatória em uma célula vazia
  const emptyCells = [];
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (board[row][col] === "") {
        emptyCells.push({ row, col });
      }
    }
  }

  if (emptyCells.length > 0) {
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    handleMove(randomCell.row, randomCell.col);
  }
}

function checkWin() {
  const winSequence = Array(boardSize).fill(currentPlayer).join("");

  for (let i = 0; i < boardSize; i++) {
    if (board[i].join("") === winSequence || board.map(row => row[i]).join("") === winSequence) {
      return true;
    }
  }

  const mainDiagonal = board.map((row, idx) => row[idx]).join("");
  const antiDiagonal = board.map((row, idx) => row[boardSize - 1 - idx]).join("");

  return mainDiagonal === winSequence || antiDiagonal === winSequence;
}

function showRules() {
  alert(
    `Regras do Jogo da Velha:\n\n` +
    `Modo 3x3 e 5x5:\n` +
    `- Dois jogadores se alternam para marcar "X" e "O" nas células.\n` +
    `- O primeiro jogador a alinhar uma sequência de símbolos (horizontal, vertical ou diagonal) vence.\n\n` +
    `Modo Contra o Computador:\n` +
    `- Você joga como "X" e o computador joga como "O".\n` +
    `- O computador fará jogadas aleatórias em células vazias.\n\n` +
    `Boa sorte!`
  );
}
