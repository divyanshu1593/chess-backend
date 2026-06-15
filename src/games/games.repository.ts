import { Injectable } from '@nestjs/common';
import { EntityManager, Equal, In, Or, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult } from 'typeorm/browser';
import { GameStatus } from 'src/games/enums/game-status.enum';
import { Game } from 'src/games/entities/game.entity';

@Injectable()
export class GamesRepository {
  constructor(
    @InjectRepository(Game)
    private readonly gamesRepository: Repository<Game>,
  ) {}

  async createGame(
    status: GameStatus,
    matchFromLobby: boolean,
  ): Promise<InsertResult> {
    return await this.gamesRepository.insert({
      status,
      matchFromLobby,
    });
  }

  async getGameById(id: Game['id']) {
    return this.gamesRepository.findOneBy({ id });
  }

  async getGameAndLockRow(manager: EntityManager) {
    const gamesRepository = manager.getRepository(Game);
    return gamesRepository.findOne({
      where: {
        status: Or(
          Equal(GameStatus.WAITING_FOR_BLACK_PLAYER),
          Equal(GameStatus.WAITING_FOR_WHITE_PLAYER),
        ),
      },
      lock: { mode: 'pessimistic_write', onLocked: 'skip_locked' },
    });
  }

  async changeGameStatusToStarted(id: Game['id'], manager?: EntityManager) {
    const gamesRepository = manager
      ? manager.getRepository(Game)
      : this.gamesRepository;

    const { affected } = await gamesRepository.update(
      {
        id,
        status: Or(
          Equal(GameStatus.WAITING_FOR_BLACK_PLAYER),
          Equal(GameStatus.WAITING_FOR_WHITE_PLAYER),
        ),
      },
      { status: GameStatus.STARTED },
    );

    return !!affected;
  }

  async isGameInProgress(id: Game['id']) {
    return await this.gamesRepository.existsBy({
      id,
      status: In([
        GameStatus.STARTED,
        GameStatus.WAITING_FOR_BLACK_PLAYER,
        GameStatus.WAITING_FOR_WHITE_PLAYER,
      ]),
    });
  }
}
