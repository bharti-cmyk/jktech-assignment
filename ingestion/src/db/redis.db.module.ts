import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const redis = new Redis({
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        });

        // Log success on successful connection
        redis.on('connect', () => {
          Logger.log(`Connected to Redis at ${configService.get<string>('REDIS_HOST')}:${configService.get<number>('REDIS_PORT')}`);
        });

        // Handle errors
        redis.on('error', (err) => {
          Logger.error('Redis connection error:', err);
        });

        return redis;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
