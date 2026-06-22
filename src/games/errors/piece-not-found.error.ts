import { ChessPiece } from 'src/games/chess-lib/chess-piece';
import { ChessError } from 'src/games/errors/chess.error';

export class PieceNotFoundError<
  T extends new (...args: any[]) => ChessPiece,
> extends ChessError {
  boardState: string;
  isMissingPieceWhite: boolean;
  pieceType: T;

  constructor(
    boardState: string,
    isMissingPieceWhite: boolean,
    pieceType: T,
    message?: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.boardState = boardState;
    this.isMissingPieceWhite = isMissingPieceWhite;
    this.pieceType = pieceType;
  }
}
