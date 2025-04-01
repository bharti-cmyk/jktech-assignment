import { RoleEntity } from './roles.entity';
import { PermissionEntity } from './permission.entity';
export declare enum Action {
    READ = "READ",
    WRITE = "WRITE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    MANAGE = "MANAGE"
}
export type Permissions = 'Document' | 'User' | 'Ingestion';
export declare class RolePermissionEntity {
    id: number;
    accessType: string;
    roleId: number;
    permissionId: number;
    role: RoleEntity;
    permission: PermissionEntity;
}
