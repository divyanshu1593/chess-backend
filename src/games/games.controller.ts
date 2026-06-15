import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GamesService } from 'src/games/games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  async handlePlayRequest() {
    return await this.gamesService.handleGamePlayRequest();
  }

  @UseGuards(JwtAuthGuard)
  async getStream() {
    //
  }
}
