import { Injectable } from '@nestjs/common';
import { BaseEventStreamer } from './event-stremer.abstract.service';
import { RedisService } from '../redis/redis.service';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class DistributedEventStreamer implements BaseEventStreamer {
  constructor(private redisService: RedisService) { }

  async getStream(id: string): Promise<Observable<string>> {
    const subject$ = new ReplaySubject<string>(2);
    await this.redisService.subscribe(id, (message: string) => {
      subject$.next(message);
    });

    return subject$.asObservable();
  }

  async sendEvent(id: string, message: string): Promise<void> {
    await this.redisService.publish(id, message);
  }
}
