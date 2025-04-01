import { InferSubjects, MongoAbility } from '@casl/ability';
import { Action, Permissions } from '../users/roles/role-permission.entity';
export type Subjects = InferSubjects<Permissions> | 'all';
export type AppAbility = MongoAbility<[Action, Subjects]>;
interface IPermissionHandler {
    handle(ability: AppAbility): boolean;
}
type PermissionHandlerCallback = (ability: AppAbility) => boolean;
export type PermissionHandler = IPermissionHandler | PermissionHandlerCallback;
export declare const CHECK_PERMISSIONS_KEY = "CHECK_PERMISSIONS";
export {};
