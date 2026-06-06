import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private publisher: Redis;
  private subscriber: Redis;
  private callbackRegistry: Map<string, Array<(message: string) => void>> = new Map();

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
      if (!this.callbackRegistry.has(channel)) return;

      for (const callback of this.callbackRegistry.get(channel)!) {
        callback(message);
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

  async subscribe(channel: string, callback: (message: string) => void) {
    if (!this.callbackRegistry.has(channel)) {
      this.callbackRegistry.set(channel, []);
    }

    this.callbackRegistry.get(channel)!.push(callback);
    await this.subscriber.subscribe(channel);
  }
}
