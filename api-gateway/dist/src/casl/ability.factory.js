"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbilityFactory = void 0;
const common_1 = require("@nestjs/common");
const ability_1 = require("@casl/ability");
const role_permission_entity_1 = require("../users/roles/role-permission.entity");
let AbilityFactory = class AbilityFactory {
    defineAbility(user) {
        const { can, cannot, build } = new ability_1.AbilityBuilder(ability_1.Ability);
        if (user.roleId === 1) {
            can(role_permission_entity_1.Action.READ, 'Document');
            can(role_permission_entity_1.Action.WRITE, 'Document');
            can(role_permission_entity_1.Action.UPDATE, 'Document');
            can(role_permission_entity_1.Action.DELETE, 'Document');
            can(role_permission_entity_1.Action.READ, 'User');
            can(role_permission_entity_1.Action.WRITE, 'User');
            can(role_permission_entity_1.Action.UPDATE, 'User');
            can(role_permission_entity_1.Action.DELETE, 'User');
        }
        else if (user.roleId === 2) {
            can(role_permission_entity_1.Action.READ, 'Document');
            can(role_permission_entity_1.Action.WRITE, 'Document');
            can(role_permission_entity_1.Action.UPDATE, 'Document');
            can(role_permission_entity_1.Action.DELETE, 'Document');
        }
        else if (user.roleId === 3) {
            can(role_permission_entity_1.Action.READ, 'Document');
        }
        else {
            cannot(role_permission_entity_1.Action.MANAGE, 'all');
        }
        return build({
            detectSubjectType: (item) => item.constructor,
        });
    }
};
exports.AbilityFactory = AbilityFactory;
exports.AbilityFactory = AbilityFactory = __decorate([
    (0, common_1.Injectable)()
], AbilityFactory);
//# sourceMappingURL=ability.factory.js.map