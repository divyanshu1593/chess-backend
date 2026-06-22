import { ErrorMessages } from 'src/games/enums/error-messages.enum';
import { ChessError } from 'src/games/errors/chess.error';

export class WrongChessPieceError extends ChessError {
  constructor() {
    super(ErrorMessages.WRONG_CHESS_PIECE);
  }
}
