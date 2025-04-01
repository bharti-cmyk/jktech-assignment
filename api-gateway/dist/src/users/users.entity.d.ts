import { RoleEntity } from './roles/roles.entity';
export declare class UserEntity {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
    role: RoleEntity;
    passwordHash: string;
}
