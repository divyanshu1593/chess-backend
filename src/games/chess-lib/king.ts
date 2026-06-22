import { ChessPiece } from 'src/games/chess-lib/chess-piece';
import { Rook } from 'src/games/chess-lib/rook';
import { BoardState, ChessPieceRange, Move } from 'src/games/types/types';

export class King extends ChessPiece {
  forwardRange: ChessPieceRange = 1;
  forwardRightRange: ChessPieceRange = 1;
  backwardRightRange: ChessPieceRange = 1;
  backwardRange: ChessPieceRange = 1;
  backwardLeftRange: ChessPieceRange = 1;
  forwardLeftRange: ChessPieceRange = 1;
  shouldMoveInLShape: boolean = false;

  rightRange: ChessPieceRange = (boardState) =>
    this.canLongCastle(boardState) ? 2 : 1;

  leftRange: ChessPieceRange = (boardState) =>
    this.canShortCastle(boardState) ? 2 : 1;

  hasMoved = false;

  override move(boardState: BoardState, move: Move): void {
    super.move(boardState, move);
    this.hasMoved = true;

    const { direction, magnitude } = this.getMagnitudeAndDirection(move);
    if (magnitude[1] > 1) {
      if (direction[1] > 0) {
        const rook = boardState[this.isWhite ? 7 : 0][7] as Rook;
        rook.moveWithoutAnyValidations(boardState, {
          from: [this.isWhite ? 7 : 0, 7],
          to: [this.isWhite ? 7 : 0, 4],
        });
        rook.hasMoved = true;
      } else {
        const rook = boardState[this.isWhite ? 7 : 0][0] as Rook;
        rook.moveWithoutAnyValidations(boardState, {
          from: [this.isWhite ? 7 : 0, 0],
          to: [this.isWhite ? 7 : 0, 2],
        });
        rook.hasMoved = true;
      }
    }
  }

  private canLongCastle(boardState: BoardState) {
    if (this.hasMoved) return false;

    const row = this.isWhite ? 7 : 0;
    const rightSidePiece = boardState[row][7];
    if (!(rightSidePiece instanceof Rook)) return false;
    if (rightSidePiece.hasMoved) return false;
    if (
      this.isPathBlocked(boardState, {
        from: [row, 3],
        to: [row, 7],
      })
    )
      return false;

    for (let column = 3; column < 6; column++) {
      if (
        this.canSquareBeAttackedByOpponent(
          boardState,
          [row, column],
          !this.isWhite,
        )
      )
        return false;
    }

    return true;
  }

  private canShortCastle(boardState: BoardState) {
    if (this.hasMoved) return false;

    const row = this.isWhite ? 7 : 0;
    const getLeftSidePiece = boardState[row][0];
    if (!(getLeftSidePiece instanceof Rook)) return false;
    if (getLeftSidePiece.hasMoved) return false;
    if (
      this.isPathBlocked(boardState, {
        from: [row, 3],
        to: [row, 0],
      })
    )
      return false;

    for (let column = 3; column > 0; column--) {
      if (
        this.canSquareBeAttackedByOpponent(
          boardState,
          [row, column],
          !this.isWhite,
        )
      )
        return false;
    }

    return true;
  }
}
