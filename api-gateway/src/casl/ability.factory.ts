import { Injectable } from '@nestjs/common';
import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { Action } from '../users/roles/role-permission.entity';
import { UserEntity } from '../users/users.entity';

export type Subjects = 'Document' | 'User' | 'all';
export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbility(user: UserEntity): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.roleId === 1) {
      // Admin
      can(Action.READ, 'Document');
      can(Action.WRITE, 'Document');
      can(Action.UPDATE, 'Document');
      can(Action.DELETE, 'Document');
      can(Action.MANAGE, 'Document');
      can(Action.READ, 'User');
      can(Action.WRITE, 'User');
      can(Action.UPDATE, 'User');
      can(Action.DELETE, 'User');
    } else if (user.roleId === 2) {
      // Editor
      can(Action.READ, 'Document');
      can(Action.WRITE, 'Document');
      can(Action.UPDATE, 'Document');
      can(Action.DELETE, 'Document');
    } else if (user.roleId === 3) {
      // Viewer
      can(Action.READ, 'Document');
    } else {
      cannot(Action.MANAGE, 'all');
    }

    return build({
      detectSubjectType: (item: any) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
