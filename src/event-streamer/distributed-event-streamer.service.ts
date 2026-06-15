import { Injectable } from '@nestjs/common';
import { BaseEventStreamer } from './event-stremer.abstract.service';
import { RedisService } from '../redis/redis.service';
import { Observable, ReplaySubject } from 'rxjs';
import { withSubscriberLimit } from 'src/common/utils/limited-subject';

@Injectable()
export class DistributedEventStreamer<T> implements BaseEventStreamer<T> {
  private subjectRegistry = new Map<string, ReplaySubject<T>>();

  constructor(private readonly redisService: RedisService) {
    this.eventRouter();
  }

  private eventRouter() {
    this.redisService.listen((channel: string, message: string) => {
      if (!this.subjectRegistry.has(channel)) return;

      this.subjectRegistry.get(channel)!.next(JSON.parse(message) as T);
    });
  }

  async getStream(id: string): Promise<Observable<T>> {
    let subject$: ReplaySubject<T>;
    if (this.subjectRegistry.has(id)) {
      subject$ = this.subjectRegistry.get(id)!;
    } else {
      subject$ = new (withSubscriberLimit(ReplaySubject<T>, 1))(1);
      await this.redisService.subscribe(id);
      this.subjectRegistry.set(id, subject$);
    }

    return subject$.asObservable();
  }

  async sendEvent(id: string, message: T): Promise<void> {
    await this.redisService.publish(id, JSON.stringify(message));
  }
}
