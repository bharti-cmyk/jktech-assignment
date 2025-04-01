import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  PrimaryColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { RoleEntity } from './roles.entity';
import { PermissionEntity } from './permission.entity';

export enum Action {
  READ = 'READ',
  WRITE = 'WRITE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  MANAGE = 'MANAGE',
}

export type Permissions = 'Document' | 'User' | 'Ingestion';

@Entity({ name: 'roles_permissions' })
export class RolePermissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'access_type', enum: Action, enumName: 'Action' })
  accessType: string;

  @PrimaryColumn({ name: 'role_id' })
  roleId: number;

  @PrimaryColumn({ name: 'permission_id' })
  permissionId: number;

  @ManyToOne(() => RoleEntity, (role) => role.rolePermissions)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @ManyToOne(() => PermissionEntity, (permission) => permission.rolePermissions)
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionEntity;
}
