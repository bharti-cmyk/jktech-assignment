import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { RoleEntity } from '../../users/roles/roles.entity';
import { PermissionEntity } from '../../users/roles/permission.entity';
import { RolePermissionEntity } from '../../users/roles/role-permission.entity';
import { UserEntity } from '../../users/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleEntity,
      PermissionEntity,
      RolePermissionEntity,
      UserEntity,
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
