export enum ErrorMessages {
  NOT_EXPECTING_PLAYER = 'Game already have both players',
  GAME_NOT_FOUND = 'Game not found',
  IN_PROGRESS_GAME_NOT_FOUND = 'No game found that is currently in progress',

  // chess error messages
  CORDS_OUT_OF_BOARD = `Move coordinates can't be out of [0, 8) range`,
  PIECE_MUST_MOVE_IN_STRAIGHT_LINE = `This piece must move in straight line`,
  PIECE_MUST_MOVE_IN_L_SHAPE = `This piece must move in "L shape"`,
  PATH_BLOCKED = `There path is blocked`,
  WRONG_CHESS_PIECE = `This chess piece is not responsible to process this move`,
  MOVE_OUT_OF_RANGE = `This move is out of range`,
  CANNOT_CAPTURE_OWN_PIECE = `Cannot capture own piece`,
  KING_WILL_BE_CAPTURED = `Cannot make this move otherwise king can be captured in next move`,
  PROMOTION_PIECE_NOT_PROVIDED = `Pawn is moving to last rank, a promotion piece must be provided`,
}
