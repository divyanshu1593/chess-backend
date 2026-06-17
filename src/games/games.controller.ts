import { Controller, Post, Sse, UseFilters, UseGuards } from '@nestjs/common';
import { GameInfo } from 'src/auth/decorators/game-info.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DistributedEventStreamerFilter } from 'src/event-streamer/filters/distributed-event-streamer.filter';
import { GamesService } from 'src/games/games.service';
import { type PlayerJwt } from 'src/games/types/types';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  async handlePlayRequest() {
    return await this.gamesService.handleGamePlayRequest();
  }

  @Sse('get-stream')
  @UseFilters(DistributedEventStreamerFilter)
  @UseGuards(JwtAuthGuard)
  async getStream(@GameInfo() gameInfo: PlayerJwt) {
    return await this.gamesService.getObservableStream(gameInfo);
  }
}
