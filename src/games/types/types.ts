import { ChessPiece } from 'src/games/chess-lib/chess-piece';
import { Game } from 'src/games/entities/game.entity';
import { PlayerColor } from 'src/games/enums/player-color.enum';
import { PromotedToChessPieces } from 'src/games/enums/prompted-to-chess-pieces.enum';

export type PlayerJwt = {
  id: Game['id'];
  color: PlayerColor;
};

export type BoardState = (ChessPiece | null)[][];

export type ChessPieceRange = number | ((boardState: BoardState) => number);

export type Move = {
  from: [number, number];
  to: [number, number];
  promoteTo?: PromotedToChessPieces;
};
