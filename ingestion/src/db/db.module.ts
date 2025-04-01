import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestionEntity } from '../entities/ingestion.entity';
import { DataSource } from 'typeorm';
import { IngestionTable1741877098124 } from './migrations/1741877098124-IngestionTable'
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dataSource = new DataSource({
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USER'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          entities: [IngestionEntity],
          synchronize: false,
          migrations: [IngestionTable1741877098124],
          migrationsRun: true,
          logging: true,
        });

        await dataSource.initialize();
        Logger.log(' Successfully connected to postgre database');

        return dataSource.options;
      },
    }),
  ],
})
export class DbModule {}
