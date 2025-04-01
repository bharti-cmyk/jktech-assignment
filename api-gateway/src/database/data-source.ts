import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../users/users.entity';
import { RoleEntity } from '../users/roles/roles.entity';
import { PermissionEntity } from '../users/roles/permission.entity';
import { RolePermissionEntity } from '../users/roles/role-permission.entity';
import { InitTables1741851165843 } from './migrations/InitTables1741851165843';
import 'dotenv/config';

// Manually instantiate ConfigService
const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST', 'localhost'),
  port: configService.get<number>('DATABASE_PORT', 5432),
  username: configService.get<string>('DATABASE_USER', 'postgres'),
  password: configService.get<string>('DATABASE_PASSWORD', 'password'),
  database: configService.get<string>('DATABASE_NAME', 'mydatabase'),
  entities: [UserEntity, RoleEntity, PermissionEntity, RolePermissionEntity],
  migrations: [InitTables1741851165843],
  synchronize: false, // Always false when using migrations
  logging: true,
});

export default AppDataSource;
