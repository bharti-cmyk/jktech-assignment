import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { getConfig } from './app-config/configuration';
import { DbModule } from './db/db.module';
import { IngestionEntity } from './entities/ingestion.entity';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { RedisModule } from './db/redis.db.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [getConfig], 
    }),
    EventEmitterModule.forRoot({
      delimiter: '.',
      global: true,
      wildcard: true,
    }),
    DbModule,
    RedisModule,
    TypeOrmModule.forFeature([IngestionEntity]),
  ],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}
