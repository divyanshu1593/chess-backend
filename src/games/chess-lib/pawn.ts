import { Board } from 'src/games/chess-lib/board';
import { ChessPiece } from 'src/games/chess-lib/chess-piece';
import { ErrorMessages } from 'src/games/enums/error-messages.enum';
import { InvalidMoveError } from 'src/games/errors/invalid-move.error';
import { PieceNotFoundError } from 'src/games/errors/piece-not-found.error';
import { BoardState, ChessPieceRange, Move } from 'src/games/types/types';

export class Pawn extends ChessPiece {
  forwardRange: ChessPieceRange = (boardState) => {
    if (!this.isWhite) return 0;
    return this.hasMoved(boardState) ? 1 : 2;
  };

  forwardRightRange: ChessPieceRange = (boardState) => {
    if (!this.isWhite) return 0;
    return this.canDiagonallyCapturePiece(boardState, 1, 1) ? 1 : 0;
  };

  rightRange: ChessPieceRange = 0;

  backwardRightRange: ChessPieceRange = (boardState) => {
    if (this.isWhite) return 0;
    return this.canDiagonallyCapturePiece(boardState, -1, 1) ? 1 : 0;
  };

  backwardRange: ChessPieceRange = (boardState) => {
    if (this.isWhite) return 0;
    return this.hasMoved(boardState) ? 1 : 2;
  };

  backwardLeftRange: ChessPieceRange = (boardState) => {
    if (this.isWhite) return 0;
    return this.canDiagonallyCapturePiece(boardState, -1, -1) ? 1 : 0;
  };

  leftRange: ChessPieceRange = 0;

  forwardLeftRange: ChessPieceRange = (boardState) => {
    if (!this.isWhite) return 0;
    return this.canDiagonallyCapturePiece(boardState, 1, -1) ? 1 : 0;
  };

  shouldMoveInLShape: boolean = false;
  canBeCapturedInEnPassant = false;

  private hasMoved(boardState: BoardState) {
    const row = this.getCurrentCords(boardState)[0];
    return row !== (this.isWhite ? 6 : 1);
  }

  private canDiagonallyCapturePiece(
    boardState: BoardState,
    verticalDir: -1 | 1,
    horizontalDir: -1 | 1,
  ) {
    const cords = this.getCurrentCords(boardState);
    const diagonalCords: [number, number] = [
      cords[0] + verticalDir,
      cords[1] + horizontalDir,
    ];
    if (
      this.isInsideChessBoard(diagonalCords) &&
      this.getPieceFromCords(boardState, diagonalCords)?.isWhite !==
        this.isWhite
    ) {
      return true;
    }

    const enPassantCords: [number, number] = [
      cords[0],
      cords[1] + horizontalDir,
    ];
    if (
      this.isInsideChessBoard(enPassantCords) &&
      this.getPieceFromCords(boardState, enPassantCords) instanceof Pawn &&
      this.getPieceFromCords(boardState, enPassantCords)!.isWhite !==
        this.isWhite
    ) {
      return true;
    }

    return false;
  }

  private getCurrentCords(boardState: BoardState) {
    const row = this.isWhite ? 6 : 1;
    for (let i = 0; i < 8; i++) {
      if (boardState[row][i] == this) return [row, i];
    }

    throw new PieceNotFoundError(
      Board.convertToStringRepresentation(boardState),
      this.isWhite,
      Pawn,
    );
  }

  override move(boardState: BoardState, move: Move): void {
    super.move(boardState, move);
    const { from, to } = move;
    const { direction, magnitude } = this.getMagnitudeAndDirection(move);
    if (magnitude[1] && this.getPieceFromCords(boardState, to) === null) {
      boardState[from[0]][from[1] + direction[1]] = null;
    }

    const lastRank = this.isWhite ? 0 : 7;
    if (to[0] === lastRank) {
      if (!move.promoteTo) {
        throw new InvalidMoveError(
          Board.convertToStringRepresentation(boardState),
          move,
          ErrorMessages.PROMOTION_PIECE_NOT_PROVIDED,
        );
      }
    }
  }
}
