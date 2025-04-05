import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../../users/roles/roles.entity';
import { PermissionEntity } from '../../users/roles/permission.entity';
import { RolePermissionEntity } from '../../users/roles/role-permission.entity';
import { Action } from '../../users/roles/role-permission.entity';
import { UserEntity } from '../../users/users.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepo: Repository<PermissionEntity>,
    @InjectRepository(RolePermissionEntity)
    private readonly rolePermissionRepo: Repository<RolePermissionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async onModuleInit() {
    await this.seedRoles();
    await this.seedPermissions();
    await this.seedRolePermissions();
    await this.seedAdminUser();
  }

  private async seedRoles() {
    const roles = [
      { id: 1, name: 'admin' },
      { id: 2, name: 'editor' },
      { id: 3, name: 'viewer' },
    ];

    for (const role of roles) {
      const exists = await this.roleRepo.findOne({ where: { id: role.id } });
      if (!exists) await this.roleRepo.save(role);
    }
  }

  private async seedPermissions() {
    const permissions = [
      { name: 'Document', description: 'Manage Documents' },
      { name: 'Ingestion', description: 'Download a document' },
      { name: 'User', description: 'Create a user' },
    ];

    for (const permission of permissions) {
      const exists = await this.permissionRepo.findOne({
        where: { name: permission.name },
      });
      if (!exists) await this.permissionRepo.save(permission);
    }
  }

  private async seedRolePermissions() {
    const rolePermissions = [
      { accessType: Action.READ, roleId: 1, permissionId: 1 },
      { accessType: Action.WRITE, roleId: 1, permissionId: 1 },
      { accessType: Action.UPDATE, roleId: 1, permissionId: 1 },
      { accessType: Action.DELETE, roleId: 1, permissionId: 1 },

      { accessType: Action.READ, roleId: 1, permissionId: 2 },
      { accessType: Action.WRITE, roleId: 1, permissionId: 2 },

      { accessType: Action.READ, roleId: 1, permissionId: 3 },
      { accessType: Action.WRITE, roleId: 1, permissionId: 3 },
      { accessType: Action.UPDATE, roleId: 1, permissionId: 3 },
      { accessType: Action.DELETE, roleId: 1, permissionId: 3 },

      { accessType: Action.READ, roleId: 2, permissionId: 1 },
      { accessType: Action.WRITE, roleId: 2, permissionId: 1 },
      { accessType: Action.UPDATE, roleId: 2, permissionId: 1 },
      { accessType: Action.DELETE, roleId: 2, permissionId: 1 },

      { accessType: Action.READ, roleId: 3, permissionId: 1 },
    ];

    for (const rolePermission of rolePermissions) {
      const exists = await this.rolePermissionRepo.findOne({
        where: {
          accessType: rolePermission.accessType,
          roleId: rolePermission.roleId,
          permissionId: rolePermission.permissionId,
        },
      });

      if (!exists) {
        await this.rolePermissionRepo.save({
          accessType: rolePermission.accessType,
          roleId: rolePermission.roleId,
          permissionId: rolePermission.permissionId,
        });
      }
    }
  }

  private async seedAdminUser() {
    const admin = await this.userRepo.findOne({
      where: { email: 'superadmin@admin.com' },
    });

    if (!admin) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await this.userRepo.save({
        email: 'superadmin@admin.com',
        roleId: 1,
        firstName: 'Admin',
        lastName: 'Admin',
        passwordHash: hashedPassword,
      });
    }
  }
}
