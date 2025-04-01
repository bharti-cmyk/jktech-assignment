import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './database/redis/redis.module';
import uploadConfig from './global/upload/upload.config';
import { SeedModule } from './auth/seed/seed.module';
import { DocumentModule } from './document/document.module';
import { IngestionModule } from './ingestion/ingestion.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Ensures ConfigModule is available everywhere
      load: [uploadConfig],
    }),
    AuthModule,
    RedisModule,
    DatabaseModule,
    SeedModule,
    DocumentModule,
    IngestionModule,
  ],
})
export class AppModule {}
