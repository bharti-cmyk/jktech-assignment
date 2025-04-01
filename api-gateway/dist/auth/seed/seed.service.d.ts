import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RoleEntity } from '../../users/roles/roles.entity';
import { PermissionEntity } from '../../users/roles/permission.entity';
import { RolePermissionEntity } from '../../users/roles/role-permission.entity';
import { UserEntity } from '../../users/users.entity';
export declare class SeedService implements OnModuleInit {
    private readonly roleRepo;
    private readonly permissionRepo;
    private readonly rolePermissionRepo;
    private readonly userRepo;
    constructor(roleRepo: Repository<RoleEntity>, permissionRepo: Repository<PermissionEntity>, rolePermissionRepo: Repository<RolePermissionEntity>, userRepo: Repository<UserEntity>);
    onModuleInit(): Promise<void>;
    private seedRoles;
    private seedPermissions;
    private seedRolePermissions;
    private seedAdminUser;
}
