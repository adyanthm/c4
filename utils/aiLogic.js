const SCORES = {
  FOUR: 100000,
  THREE: 100,
  TWO: 10,
};

export const makeAIMove = (board, difficulty) => {
  switch (difficulty) {
    case 1:
      return makeRandomMove(board);
    case 2:
      return makeSimpleMove(board);
    case 3:
      return makeMediumMove(board);
    case 4:
      return makeHardMove(board);
    case 5:
      return minimax(board, 5, -Infinity, Infinity, true)[1];
    default:
      return makeRandomMove(board);
  }
};

const makeRandomMove = (board) => {
  const validMoves = getValidMoves(board);
  return validMoves[Math.floor(Math.random() * validMoves.length)];
};

const makeSimpleMove = (board) => {
  const validMoves = getValidMoves(board);
  let bestScore = -Infinity;
  let bestMove = validMoves[0];

  for (const move of validMoves) {
    const newBoard = makeMove(board, move, 2);
    const score = evaluatePosition(newBoard, 2);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
};

const makeMediumMove = (board) => {
  // Look for winning move
  const winningMove = findWinningMove(board, 2);
  if (winningMove !== null) return winningMove;

  // Block opponent's winning move
  const blockingMove = findWinningMove(board, 1);
  if (blockingMove !== null) return blockingMove;

  return makeSimpleMove(board);
};

const makeHardMove = (board) => {
  return minimax(board, 4, -Infinity, Infinity, true)[1];
};

const minimax = (board, depth, alpha, beta, maximizingPlayer) => {
  const validMoves = getValidMoves(board);

  if (depth === 0 || validMoves.length === 0) {
    return [evaluatePosition(board, 2), null];
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    let bestMove = validMoves[0];

    for (const move of validMoves) {
      const newBoard = makeMove(board, move, 2);
      const evaluation = minimax(newBoard, depth - 1, alpha, beta, false)[0];

      if (evaluation > maxEval) {
        maxEval = evaluation;
        bestMove = move;
      }
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }

    return [maxEval, bestMove];
  } else {
    let minEval = Infinity;
    let bestMove = validMoves[0];

    for (const move of validMoves) {
      const newBoard = makeMove(board, move, 1);
      const evaluation = minimax(newBoard, depth - 1, alpha, beta, true)[0];

      if (evaluation < minEval) {
        minEval = evaluation;
        bestMove = move;
      }
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }

    return [minEval, bestMove];
  }
};

// Helper functions
const getValidMoves = (board) => {
  const moves = [];
  for (let col = 0; col < 7; col++) {
    if (board[0][col] === 0) moves.push(col);
  }
  return moves;
};

const makeMove = (board, col, player) => {
  const newBoard = board.map((row) => [...row]);
  for (let row = 5; row >= 0; row--) {
    if (newBoard[row][col] === 0) {
      newBoard[row][col] = player;
      break;
    }
  }
  return newBoard;
};

const evaluatePosition = (board, player) => {
  let score = 0;

  // Horizontal
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      score += evaluateWindow(
        [
          board[row][col],
          board[row][col + 1],
          board[row][col + 2],
          board[row][col + 3],
        ],
        player
      );
    }
  }

  // Vertical
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 7; col++) {
      score += evaluateWindow(
        [
          board[row][col],
          board[row + 1][col],
          board[row + 2][col],
          board[row + 3][col],
        ],
        player
      );
    }
  }

  // Diagonal
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      score += evaluateWindow(
        [
          board[row][col],
          board[row + 1][col + 1],
          board[row + 2][col + 2],
          board[row + 3][col + 3],
        ],
        player
      );
    }
  }

  for (let row = 3; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      score += evaluateWindow(
        [
          board[row][col],
          board[row - 1][col + 1],
          board[row - 2][col + 2],
          board[row - 3][col + 3],
        ],
        player
      );
    }
  }

  return score;
};

const evaluateWindow = (window, player) => {
  const opponent = player === 1 ? 2 : 1;
  const playerCount = window.filter((cell) => cell === player).length;
  const emptyCount = window.filter((cell) => cell === 0).length;
  const oppCount = window.filter((cell) => cell === opponent).length;

  if (playerCount === 4) return SCORES.FOUR;
  if (playerCount === 3 && emptyCount === 1) return SCORES.THREE;
  if (playerCount === 2 && emptyCount === 2) return SCORES.TWO;
  if (oppCount === 3 && emptyCount === 1) return -SCORES.THREE;

  return 0;
};

const findWinningMove = (board, player) => {
  const validMoves = getValidMoves(board);
  for (const move of validMoves) {
    const newBoard = makeMove(board, move, player);
    if (evaluatePosition(newBoard, player) >= SCORES.FOUR) {
      return move;
    }
  }
  return null;
};
