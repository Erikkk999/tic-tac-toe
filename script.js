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
        return {
          success: false,
          status: "INVALID_MOVE",
        };
      }
    
    const field = board[position - 1];

    if (field.getValue() !== null) {
      return {
        success: false,
        status: "FIELD_OCCUPIED",
      };
    }
    
    field.setValue(marker);

    return {
      success: true,
      status: "MOVE_IS_VALID",
    };
  }

  const getBoardState = () => board.map(field => field.getValue());
  const clearBoard = () => board.forEach(field => field.setValue(null)); 

  return { placeMarker, getBoardState, clearBoard };
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
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  };

  const resetPlayer = () => { currentPlayer = players[0]; };

  return { getCurrentPlayer, switchPlayer, resetPlayer, };
}

function gameController() {
  const board = gameBoard();
  const players = playerManager();

  let status = "IN_PROGRESS";
  let isGameActive = true;
  let moveCount = 0;

  const getGameState = (status = "NEW_GAME", moveResult = true) => {
    return {
      board: board.getBoardState(),
      currentPlayer: players.getCurrentPlayer(),
      isGameActive,
      moveCount,
      moveResult,
      status,
    };
  }

  const playMove = (position) => {
    if (!isGameActive) return getGameState("GAME_OVER", false);

    const moveResult =
      board.placeMarker(position, players.getCurrentPlayer().marker);

    if (!moveResult.success) {
      status = moveResult.status;
      return getGameState(status, false);
    }

    moveCount++;
 
    players.switchPlayer();

    return { ...getGameState(status, moveResult) };
  } 
  
  return { playMove, getGameState };
}

const { playMove, getGameState } = gameController();

console.log(getGameState());
