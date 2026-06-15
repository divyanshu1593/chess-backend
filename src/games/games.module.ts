import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GamesService } from './games.service';
import { GamesRepository } from './games.repository';
import { BaseEventStreamer } from '../event-streamer/event-stremer.abstract.service';
import { DistributedEventStreamer } from '../event-streamer/distributed-event-streamer.service';
import { EventStreamerModule } from 'src/event-streamer/event-streamer.module';
import { GamesController } from './games.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), EventStreamerModule],
  exports: [TypeOrmModule],
  providers: [
    GamesService,
    GamesRepository,
    {
      provide: BaseEventStreamer,
      useClass: DistributedEventStreamer,
    },
  ],
  controllers: [GamesController],
})
export class GamesModule {}
