import { ChessError } from 'src/games/errors/chess.error';
import { Move } from 'src/games/types/types';

export class InvalidMoveError extends ChessError {
  boardState: string;
  move: Move;

  constructor(
    boardState: string,
    move: Move,
    message?: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.boardState = boardState;
    this.move = move;
  }
}
