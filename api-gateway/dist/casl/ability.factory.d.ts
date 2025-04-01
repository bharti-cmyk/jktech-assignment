import { Ability } from '@casl/ability';
import { Action } from '../users/roles/role-permission.entity';
import { UserEntity } from '../users/users.entity';
export type Subjects = 'Document' | 'User' | 'all';
export type AppAbility = Ability<[Action, Subjects]>;
export declare class AbilityFactory {
    defineAbility(user: UserEntity): AppAbility;
}
