import { ChessPiece } from 'src/games/chess-lib/chess-piece';
import { ChessPieceRange } from 'src/games/types/types';

export class Knight extends ChessPiece {
  forwardRange: ChessPieceRange = 0;
  forwardRightRange: ChessPieceRange = 0;
  rightRange: ChessPieceRange = 0;
  backwardRightRange: ChessPieceRange = 0;
  backwardRange: ChessPieceRange = 0;
  backwardLeftRange: ChessPieceRange = 0;
  leftRange: ChessPieceRange = 0;
  forwardLeftRange: ChessPieceRange = 0;
  shouldMoveInLShape: boolean = true;
}
