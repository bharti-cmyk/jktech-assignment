import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './database/redis/redis.module';
import uploadConfig from './global/upload/upload.config';
import { SeedModule } from './auth/seed/seed.module';
import { DocumentModule } from './document/document.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { CaslModule } from './casl/casl.module';
import { RolesGuard } from './users/roles.guard';
import { JwtAuthGuard } from './auth/jwt.guard';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [uploadConfig],
    }),
    AuthModule,
    RedisModule,
    DatabaseModule,
    SeedModule,
    DocumentModule,
    IngestionModule,
    CaslModule,
  ],
  providers: [],
})
export class AppModule {}
