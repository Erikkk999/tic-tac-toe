function field() {
  let value = null;

  const setValue = (marker) => { value = marker; }; 
  const getValue = () => value;

  return { setValue, getValue };
}

function gameBoard() {
  const board = [];

  for (let i = 0; i < 9; i++) { board.push(field()); }

  const placeMarker = (position, marker) => {
    if (!Number.isInteger(position)
      || position < 1
      || position > 9) {
        return { success: false, status: "INVALID_MOVE", };
    }
    
    const field = board[position - 1];

    if (field.getValue() !== null) {
      return { success: false, status: "FIELD_OCCUPIED", };
    }
    
    field.setValue(marker);

    return { success: true, status: "MOVE_IS_VALID", };
  }

  const getBoardState = () => board.map(field => field.getValue());
  const clearBoard = () => board.forEach(field => field.setValue(null)); 

  return { getBoardState, placeMarker, clearBoard };
}

function playerManager() {
  const playerOne =  prompt("Player One Name ?") || "Player One";
  const playerTwo =  prompt("Player Two Name ?") || "Player Two";

  const players = [
    { name: playerOne, marker: "X" },
    { name: playerTwo, marker: "O" },
  ];

  let currentPlayer = players[0];

  const getCurrentPlayer = () => currentPlayer;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === players[0]
      ? players[1]
      : players[0];
  };

  const resetPlayer = () => { currentPlayer = players[0]; };

  return { getCurrentPlayer, switchPlayer, resetPlayer, };
}

function gameController() {
  const board = gameBoard();
  const players = playerManager();

  let gameStatus = "NEW_GAME";
  let moveStatus = null;

  const isGameActive = () =>
    ["NEW_GAME", "IN_PROGRESS"].includes(gameStatus);

  let moveCount = 0;

  const resetGame = () => {
    board.clearBoard();
    players.resetPlayer();
    gameStatus = "NEW_GAME";
    moveStatus = null;
    moveCount = 0;
    
    return getGameState();
  };

  const getGameState = () => {
    return {
      board: board.getBoardState(),
      currentPlayer: players.getCurrentPlayer(),
      gameStatus,
      moveStatus,
      moveCount,
    };
  };

  const playMove = (position) => {
    if (!isGameActive()) {
      moveStatus = { success: false, status: "GAME_OVER" };
      return getGameState();
    }

    moveStatus =
      board.placeMarker(position, players.getCurrentPlayer().marker);

    if (!moveStatus.success) {
      return getGameState();
    }

    const boardState = board.getBoardState();
    const gameResult = checkGameOver(boardState);

    moveCount++;

    if (gameResult.winner) {
      gameStatus = "GAME_WON";
    } else if (gameResult.isDraw) {
      gameStatus = "GAME_DRAW";
    } else {
      gameStatus = "IN_PROGRESS";
      players.switchPlayer();
    }

    return { ...getGameState(), ...gameResult, };
  } 
  
  return { getGameState, playMove, resetGame };
}

function checkGameOver(board) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  const winningCombination =
    winningCombinations.find((combination) => {
      const [ firstIndex, secondIndex, thirdIndex ] = combination;
      const marker = board[firstIndex];

      return marker !== null
        && board[firstIndex] === board[secondIndex]
        && board[secondIndex] === board[thirdIndex];
    });

  const winner = winningCombination
    ? board[winningCombination[0]]
    : null;

  const isDraw = !winner && board.every(value => value !== null);

  return { winner, isDraw };
}

function displayRound(gameState) {
  if (!gameState) return;

  const {
    board,
    currentPlayer,
    gameStatus,
    moveStatus,
    moveCount,
  } = gameState;

  if (moveStatus && !moveStatus.success) {
    console.log(`ERROR: ${moveStatus.status}`);
    return;
  }

  let message;

  switch(gameStatus) {
    case "GAME_WON":
      message = "Game Over!\n"
        + `The Winner is [${currentPlayer.marker}] ${currentPlayer.name}.`;
      break;
    case "GAME_DRAW":
      message = "Game Over!\nIt's a Draw.";
      break;
    case "NEW_GAME":
      message = `Game started!\n[${currentPlayer.marker}]`
        + ` ${currentPlayer.name}'s turn.`;
      break;
    default:
      message = `Move [${moveCount}]\n[${currentPlayer.marker}]`
        + ` ${currentPlayer.name}'s turn.`;
  }

  console.log(message);

  const displayBoard =
    board.map((value, index) => value ?? `${index + 1}`);

  console.log(
    `| ${displayBoard.slice(0, 3).join(" | ")} | \n–––––––––––––\n` +
    `| ${displayBoard.slice(3, 6).join(" | ")} | \n–––––––––––––\n` +
    `| ${displayBoard.slice(6, 9).join(" | ")} |\n `);
}

const { getGameState, playMove, resetGame } = gameController();

