import { Module } from '@nestjs/common';
import { DistributedEventStreamer } from 'src/event-streamer/distributed-event-streamer.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [DistributedEventStreamer],
  exports: [DistributedEventStreamer, RedisModule],
})
export class EventStreamerModule {}
