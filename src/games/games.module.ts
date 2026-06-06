import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GamesService } from './games.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  exports: [TypeOrmModule],
  providers: [GamesService],
})
export class GamesModule {}
