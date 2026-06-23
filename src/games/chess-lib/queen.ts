import { ChessPiece } from 'src/games/chess-lib/chess-piece';
import { ChessPieceRange } from 'src/games/types/types';

export class Queen extends ChessPiece {
  forwardRange: ChessPieceRange = Infinity;
  forwardRightRange: ChessPieceRange = Infinity;
  rightRange: ChessPieceRange = Infinity;
  backwardRightRange: ChessPieceRange = Infinity;
  backwardRange: ChessPieceRange = Infinity;
  backwardLeftRange: ChessPieceRange = Infinity;
  leftRange: ChessPieceRange = Infinity;
  forwardLeftRange: ChessPieceRange = Infinity;
  shouldMoveInLShape: boolean = false;
}
