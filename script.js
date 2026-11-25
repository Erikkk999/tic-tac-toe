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
      || position > 9) return "INVALID_MOVE";
    
    const field = board[position - 1];

    if (field.getValue() !== null) return "FIELD_OCCUPIED";
    
    field.setValue(marker);

    return "MOVE_IS_VALID";
  }

  const getBoardState = () => board.map(field => field.getValue());
  const clearBoard = () => board.forEach(field => field.setValue(null)); 

  return { placeMarker, getBoardState, clearBoard };
}

function playerManager() {
  const playerOne = prompt("Player One Name?") || "Player One";
  const playerTwo = prompt("Player Two Name?") || "Player Two";

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
