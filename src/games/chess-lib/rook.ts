import { ChessPiece } from 'src/games/chess-lib/chess-piece';
import { BoardState, ChessPieceRange, Move } from 'src/games/types/types';

export class Rook extends ChessPiece {
  forwardRange: ChessPieceRange = Infinity;
  forwardRightRange: ChessPieceRange = 0;
  rightRange: ChessPieceRange = Infinity;
  backwardRightRange: ChessPieceRange = 0;
  backwardRange: ChessPieceRange = Infinity;
  backwardLeftRange: ChessPieceRange = 0;
  leftRange: ChessPieceRange = Infinity;
  forwardLeftRange: ChessPieceRange = 0;
  shouldMoveInLShape: boolean = false;

  hasMoved = false;

  override move(boardState: BoardState, move: Move): void {
    super.move(boardState, move);
    this.hasMoved = true;
  }
}
