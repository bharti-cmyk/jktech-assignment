import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from '../document/document.entity';
import { UserEntity } from '../users/users.entity';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisModule } from '../database/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, DocumentEntity]),
    RedisModule,
    ClientsModule.register([
      {
        name: 'INGESTION_SERVICE',
        transport: Transport.REDIS, // Change transport type if necessary
        options: {
          host: process.env.REDIS_HOST || 'localhost', // Use environment variable or default to localhost
          port: 6379, // Make sure this matches your Redis setup (or your microservice configuration)
        },
      },
    ]),
  ],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}
