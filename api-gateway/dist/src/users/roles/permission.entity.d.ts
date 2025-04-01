import { RolePermissionEntity } from './role-permission.entity';
export declare class PermissionEntity {
    id: number;
    name: string;
    description: string;
    rolePermissions: RolePermissionEntity[];
}
