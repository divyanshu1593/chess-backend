import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private publisher: Redis;
  private subscriber: Redis;
  private callbackRegistry: Array<(channel: string, message: string) => void> =
    [];

  constructor(private configService: ConfigService) {
    this.publisher = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: parseInt(this.configService.get<string>('REDIS_PORT') || '6379'),
    });

    this.subscriber = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: parseInt(this.configService.get<string>('REDIS_PORT') || '6379'),
    });

    this.subscriber.on('message', (channel, message) => {
      for (const callback of this.callbackRegistry) {
        callback(channel, message);
      }
    });
  }

  async onModuleDestroy() {
    await this.publisher.quit();
    await this.subscriber.quit();
  }

  async publish(channel: string, message: string) {
    await this.publisher.publish(channel, message);
  }

  async subscribe(channel: string) {
    await this.subscriber.subscribe(channel);
  }

  listen(callback: (channel: string, message: string) => void) {
    this.callbackRegistry.push(callback);
  }
}
