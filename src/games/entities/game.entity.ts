import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { GameStatus } from 'src/games/enums/game-status.enum';
import { INITIAL_BOARD_STATE } from '../constants/games.constants';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: INITIAL_BOARD_STATE,
  })
  boardState: string;

  @Column({ default: GameStatus.WAITING_FOR_PLAYER })
  status: GameStatus;

  @Column({ default: true })
  matchFromLobby: boolean;
}
