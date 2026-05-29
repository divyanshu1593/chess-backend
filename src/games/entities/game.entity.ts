import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { GameStatus } from 'src/games/enums/game-status.enum';

@Entity()
export class GameEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  boardState: string;

  @Column({ default: GameStatus.WAITING_FOR_PLAYER })
  status: GameStatus;

  @Column({ default: true })
  matchFromLobby: boolean;
}
