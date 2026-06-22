import { Board } from 'src/games/chess-lib/board';
import { King } from 'src/games/chess-lib/king';
import { Pawn } from 'src/games/chess-lib/pawn';
import { ErrorMessages } from 'src/games/enums/error-messages.enum';
import { PromotedToChessPieces } from 'src/games/enums/prompted-to-chess-pieces.enum';
import { InvalidMoveError } from 'src/games/errors/invalid-move.error';
import { PieceNotFoundError } from 'src/games/errors/piece-not-found.error';
import { WrongChessPieceError } from 'src/games/errors/wrong-chess-piece.error';
import { BoardState, ChessPieceRange, Move } from 'src/games/types/types';

export abstract class ChessPiece {
  abstract forwardRange: ChessPieceRange;
  abstract forwardRightRange: ChessPieceRange;
  abstract rightRange: ChessPieceRange;
  abstract backwardRightRange: ChessPieceRange;
  abstract backwardRange: ChessPieceRange;
  abstract backwardLeftRange: ChessPieceRange;
  abstract leftRange: ChessPieceRange;
  abstract forwardLeftRange: ChessPieceRange;
  abstract shouldMoveInLShape: boolean;
  isWhite: boolean;

  constructor(isWhite: boolean) {
    this.isWhite = isWhite;
  }

  validateMove(boardState: BoardState, move: Move) {
    this.validateMoveWithoutCheckValidations(boardState, move);
    const stateCopy = this.makeCopyOfBoardState(boardState);
    this.moveWithoutAnyValidations(stateCopy, move);
    if (this.canCaptureKing(stateCopy, this.isWhite)) {
      throw new InvalidMoveError(
        Board.convertToStringRepresentation(boardState),
        move,
        ErrorMessages.KING_WILL_BE_CAPTURED,
      );
    }
  }

  move(boardState: BoardState, move: Move) {
    this.validateMove(boardState, move);
    const isOpponentWhite = this.getPieceFromCords(
      boardState,
      move.from,
    )!.isWhite;
    this.moveWithoutAnyValidations(boardState, move);
    this.updateEnPassantState(boardState, isOpponentWhite);
  }

  private updateEnPassantState(
    boardState: BoardState,
    updateForWhite: boolean,
  ) {
    for (const row of boardState) {
      for (const cell of row) {
        if (
          cell instanceof Pawn &&
          cell.isWhite === updateForWhite &&
          cell.canBeCapturedInEnPassant
        ) {
          cell.canBeCapturedInEnPassant = false;
        }
      }
    }
  }

  protected canCaptureKing(boardState: BoardState, isKingWhite: boolean) {
    let kingCords: [number, number] | null = null;

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (
          boardState[i][j] instanceof King &&
          boardState[i][j]!.isWhite === isKingWhite
        ) {
          kingCords = [i, j];
        }
      }
    }

    if (!kingCords) {
      throw new PieceNotFoundError(
        Board.convertToStringRepresentation(boardState),
        isKingWhite,
        King,
      );
    }

    return this.canSquareBeAttackedByOpponent(
      boardState,
      kingCords,
      !isKingWhite,
    );
  }

  protected canSquareBeAttackedByOpponent(
    boardState: BoardState,
    cords: [number, number],
    isOpponentWhite: boolean,
  ) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; i < 8; j++) {
        if (
          boardState[i][j] != null &&
          boardState[i][j]!.isWhite === isOpponentWhite
        ) {
          try {
            boardState[i][j]!.validateMoveWithoutCheckValidations(boardState, {
              from: [i, j],
              to: cords,
              promoteTo: PromotedToChessPieces.QUEEN,
            });

            return true;
          } catch (error) {
            if (!(error instanceof InvalidMoveError)) {
              throw error;
            }
          }
        }
      }
    }

    return false;
  }

  protected makeCopyOfBoardState(boardState: BoardState) {
    const stateCopy: BoardState = [];

    for (const row of boardState) {
      const rowCopy: BoardState[0] = [];
      for (const cell of row) {
        rowCopy.push(cell);
      }

      stateCopy.push(rowCopy);
    }

    return stateCopy;
  }

  moveWithoutAnyValidations(boardState: BoardState, move: Move) {
    const { from, to } = move;
    boardState[to[0]][to[1]] = boardState[from[0]][from[1]];
    boardState[from[0]][from[1]] = null;
  }

  private validateMoveWithoutCheckValidations(
    boardState: BoardState,
    move: Move,
  ) {
    const stringBoardState = Board.convertToStringRepresentation(boardState);

    if (boardState[move.from[0]][move.from[1]] !== this) {
      throw new WrongChessPieceError();
    }

    if (
      !this.isInsideChessBoard(move.from) ||
      !this.isInsideChessBoard(move.to)
    ) {
      throw new InvalidMoveError(
        stringBoardState,
        move,
        ErrorMessages.CORDS_OUT_OF_BOARD,
      );
    }

    if (
      this.getPieceFromCords(boardState, move.from)?.isWhite ===
      this.getPieceFromCords(boardState, move.to)?.isWhite
    ) {
      throw new InvalidMoveError(
        stringBoardState,
        move,
        ErrorMessages.CANNOT_CAPTURE_OWN_PIECE,
      );
    }

    if (this.shouldMoveInLShape) {
      if (!this.isLShapedMove(move)) {
        throw new InvalidMoveError(
          stringBoardState,
          move,
          ErrorMessages.PIECE_MUST_MOVE_IN_L_SHAPE,
        );
      }
    } else {
      if (!this.isStraightLineMove(move)) {
        throw new InvalidMoveError(
          stringBoardState,
          move,
          ErrorMessages.PIECE_MUST_MOVE_IN_STRAIGHT_LINE,
        );
      }

      if (this.isPathBlocked(boardState, move)) {
        throw new InvalidMoveError(
          stringBoardState,
          move,
          ErrorMessages.PATH_BLOCKED,
        );
      }

      if (!this.isValidRange(boardState, move)) {
        throw new InvalidMoveError(
          stringBoardState,
          move,
          ErrorMessages.MOVE_OUT_OF_RANGE,
        );
      }
    }
  }

  protected getPieceFromCords(boardState: BoardState, cords: [number, number]) {
    return boardState[cords[0]][cords[1]];
  }

  private resolveRange(boardState: BoardState, range: ChessPieceRange) {
    if (typeof range === 'number') return range;
    return range(boardState);
  }

  protected isValidRange(boardState: BoardState, move: Move) {
    const { magnitude, direction } = this.getMagnitudeAndDirection(move);
    const [i, j] = direction;

    if (
      i === 1 &&
      j === 0 &&
      magnitude[0] > this.resolveRange(boardState, this.forwardRange)
    ) {
      return false;
    }

    if (
      i === 1 &&
      j === 1 &&
      magnitude[0] > this.resolveRange(boardState, this.forwardRightRange)
    ) {
      return false;
    }

    if (
      i === 0 &&
      j === 1 &&
      magnitude[1] > this.resolveRange(boardState, this.rightRange)
    ) {
      return false;
    }

    if (
      i === -1 &&
      j === 1 &&
      magnitude[0] > this.resolveRange(boardState, this.backwardRightRange)
    ) {
      return false;
    }

    if (
      i === -1 &&
      j === 0 &&
      magnitude[0] > this.resolveRange(boardState, this.backwardRange)
    ) {
      return false;
    }

    if (
      i === -1 &&
      j === -1 &&
      magnitude[0] > this.resolveRange(boardState, this.backwardLeftRange)
    ) {
      return false;
    }

    if (
      i === 0 &&
      j === -1 &&
      magnitude[1] > this.resolveRange(boardState, this.leftRange)
    ) {
      return false;
    }

    if (
      i === 1 &&
      j === -1 &&
      magnitude[0] > this.resolveRange(boardState, this.forwardLeftRange)
    ) {
      return false;
    }

    return true;
  }

  protected isLShapedMove(move: Move) {
    const { from, to } = move;
    const [i, j] = from;
    const validMoves = [
      [i + 2, j + 1],
      [i + 2, j - 1],
      [i - 2, j + 1],
      [i - 2, j - 1],
      [i + 1, j + 2],
      [i + 1, j - 2],
      [i - 1, j + 2],
      [i - 1, j - 2],
    ];

    for (const [validI, validJ] of validMoves) {
      if (to[0] == validI && to[1] == validJ) {
        return true;
      }
    }

    return false;
  }

  protected getMagnitudeAndDirection(move: Move) {
    const { from, to } = move;
    const verticalDir = from[0] - to[0];
    const horizontalDir = to[1] - from[1];
    const unitVerticalDir =
      verticalDir === 0 ? verticalDir : verticalDir / Math.abs(verticalDir);
    const unitHorizontalDir =
      horizontalDir === 0
        ? horizontalDir
        : horizontalDir / Math.abs(horizontalDir);

    return {
      magnitude: [Math.abs(verticalDir), Math.abs(horizontalDir)],
      direction: [unitVerticalDir, unitHorizontalDir],
    };
  }

  protected isPathBlocked(boardState: BoardState, move: Move) {
    const { from, to } = move;
    const [unitVerticalDir, unitHorizontalDir] =
      this.getMagnitudeAndDirection(move).direction;

    let [i, j] = from;
    i -= unitVerticalDir;
    j -= unitHorizontalDir;

    while (i != to[0] || j != to[1]) {
      if (boardState[i][j] != null) return true;
      i -= unitVerticalDir;
      j -= unitHorizontalDir;
    }

    return false;
  }

  protected isStraightLineMove(move: Move) {
    const { from, to } = move;
    return (
      from[0] == to[0] ||
      from[1] == to[1] ||
      Math.abs(from[0] - to[0]) == Math.abs(from[1] - to[1])
    );
  }

  protected isInsideChessBoard(cords: [number, number]) {
    return !!(cords[0] >= 0 && cords[0] < 8 && cords[1] >= 0 && cords[1]);
  }
}
