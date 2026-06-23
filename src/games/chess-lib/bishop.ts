import { ChessPiece } from 'src/games/chess-lib/chess-piece';
import { ChessPieceRange } from 'src/games/types/types';

export class Bishop extends ChessPiece {
  forwardRange: ChessPieceRange = 0;
  forwardRightRange: ChessPieceRange = Infinity;
  rightRange: ChessPieceRange = 0;
  backwardRightRange: ChessPieceRange = Infinity;
  backwardRange: ChessPieceRange = 0;
  backwardLeftRange: ChessPieceRange = Infinity;
  leftRange: ChessPieceRange = 0;
  forwardLeftRange: ChessPieceRange = Infinity;
  shouldMoveInLShape: boolean = false;
}
