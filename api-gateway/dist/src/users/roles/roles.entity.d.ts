import { RolePermissionEntity } from './role-permission.entity';
import { UserEntity } from '../users.entity';
export declare class RoleEntity {
    id: number;
    name: string;
    users: UserEntity[];
    rolePermissions: RolePermissionEntity[];
}
