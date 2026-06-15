import {
  ConflictException,
  Injectable,
  NotFoundException,
  MessageEvent,
} from '@nestjs/common';
import { GameStatus } from './enums/game-status.enum';
import { PlayerColor } from 'src/games/enums/player-color.enum';
import { GamesRepository } from './games.repository';
import { BaseEventStreamer } from '../event-streamer/event-stremer.abstract.service';
import { Game } from './entities/game.entity';
import { DataSource, EntityManager } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ErrorMessages } from 'src/games/enums/error-messages.enum';

@Injectable()
export class GamesService {
  constructor(
    private readonly gamesRepository: GamesRepository,
    private readonly dataSource: DataSource,
    private readonly eventStreamer: BaseEventStreamer<MessageEvent>,
    private readonly jwtService: JwtService,
  ) {}

  async getObservableStream(id: Game['id']) {
    const isGameInProgress = await this.gamesRepository.isGameInProgress(id);
    if (!isGameInProgress) {
      throw new NotFoundException(ErrorMessages.IN_PROGRESS_GAME_NOT_FOUND);
    }

    return await this.eventStreamer.getStream(String(id));
  }

  async handleGamePlayRequest() {
    return await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        const game = await this.gamesRepository.getGameAndLockRow(
          transactionalEntityManager,
        );

        if (game) {
          return await this.joinExistingGameAndReturnJwt(
            game.id,
            game.status,
            transactionalEntityManager,
          );
        }

        return await this.createGameAndReturnJwt();
      },
    );
  }

  async joinExistingGameAndReturnJwt(
    id: Game['id'],
    status?: Game['status'],
    manager?: EntityManager,
  ) {
    if (!status) {
      const game = await this.gamesRepository.getGameById(id);
      if (!game) throw new NotFoundException(ErrorMessages.GAME_NOT_FOUND);
      status = game.status;
    }

    const isUpdated = await this.gamesRepository.changeGameStatusToStarted(
      id,
      manager,
    );
    if (!isUpdated) {
      throw new ConflictException(ErrorMessages.NOT_EXPECTING_PLAYER);
    }

    const currentPlayerColor =
      status == GameStatus.WAITING_FOR_BLACK_PLAYER
        ? PlayerColor.BLACK
        : PlayerColor.WHITE;

    return this.jwtService.sign({
      id,
      color: currentPlayerColor,
    });
  }

  async createGameAndReturnJwt() {
    const playerColor =
      Math.random() < 0.5 ? PlayerColor.WHITE : PlayerColor.BLACK;

    const { identifiers } = await this.gamesRepository.createGame(
      playerColor == PlayerColor.WHITE
        ? GameStatus.WAITING_FOR_BLACK_PLAYER
        : GameStatus.WAITING_FOR_WHITE_PLAYER,
      false,
    );

    const id = identifiers[0].id as Game['id'];
    return this.jwtService.sign({
      id,
      color: playerColor,
    });
  }
}
