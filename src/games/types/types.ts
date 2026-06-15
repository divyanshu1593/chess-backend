import { Game } from 'src/games/entities/game.entity';
import { PlayerColor } from 'src/games/enums/player-color.enum';

export type PlayerJwt = {
  id: Game['id'];
  color: PlayerColor;
};
