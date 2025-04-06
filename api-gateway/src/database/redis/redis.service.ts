import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.connect();
  }

  private connect() {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);

    console.log(`Connecting to Redis on ${host}:${port}`); // Debug log

    try {
      this.client = new Redis({
        host,
        port,
        retryStrategy: (times) => {
          return Math.min(times * 2000, 10000);
        },
      });

      this.client.on('connect', () => {
        console.log(`Connected to Redis successfully on ${host}:${port}`);
      });

      this.client.on('error', (error) => {
        console.error('Redis connection error:', error);
      });
    } catch (error) {
      console.error('Redis initialization error:', error);
      throw new Error('Redis initialization failed');
    }
  }

  getClient(): Redis {
    return this.client;
  }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      await this.client.set(key, value, 'EX', ttl);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async delete(key: string) {
    await this.client.del(key);
  }

  onModuleDestroy() {
    this.client.quit();
  }
}
