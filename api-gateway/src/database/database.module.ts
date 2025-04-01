import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from '../users/users.entity';
import { RoleEntity } from '../users/roles/roles.entity';
import { PermissionEntity } from '../users/roles/permission.entity';
import { RolePermissionEntity } from '../users/roles/role-permission.entity';
import { DocumentEntity } from '../document/document.entity';
import { InitTables1741851165843 } from './migrations/InitTables1741851165843';
import { DataSource } from 'typeorm';

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
          entities: [
            UserEntity,
            RoleEntity,
            PermissionEntity,
            RolePermissionEntity,
            DocumentEntity,
          ],
          synchronize: false,
          migrations: [InitTables1741851165843],
          migrationsRun: true,
        });

        await dataSource.initialize();
        console.log(' Successfully connected to postgre database');

        return dataSource.options;
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
