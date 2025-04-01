"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionEntity = exports.Action = void 0;
const typeorm_1 = require("typeorm");
const roles_entity_1 = require("./roles.entity");
const permission_entity_1 = require("./permission.entity");
var Action;
(function (Action) {
    Action["READ"] = "READ";
    Action["WRITE"] = "WRITE";
    Action["UPDATE"] = "UPDATE";
    Action["DELETE"] = "DELETE";
    Action["MANAGE"] = "MANAGE";
})(Action || (exports.Action = Action = {}));
let RolePermissionEntity = class RolePermissionEntity {
    id;
    accessType;
    roleId;
    permissionId;
    role;
    permission;
};
exports.RolePermissionEntity = RolePermissionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RolePermissionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'access_type', enum: Action, enumName: 'Action' }),
    __metadata("design:type", String)
], RolePermissionEntity.prototype, "accessType", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'role_id' }),
    __metadata("design:type", Number)
], RolePermissionEntity.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'permission_id' }),
    __metadata("design:type", Number)
], RolePermissionEntity.prototype, "permissionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => roles_entity_1.RoleEntity, (role) => role.rolePermissions),
    (0, typeorm_1.JoinColumn)({ name: 'role_id' }),
    __metadata("design:type", roles_entity_1.RoleEntity)
], RolePermissionEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => permission_entity_1.PermissionEntity, (permission) => permission.rolePermissions),
    (0, typeorm_1.JoinColumn)({ name: 'permission_id' }),
    __metadata("design:type", permission_entity_1.PermissionEntity)
], RolePermissionEntity.prototype, "permission", void 0);
exports.RolePermissionEntity = RolePermissionEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'roles_permissions' })
], RolePermissionEntity);
//# sourceMappingURL=role-permission.entity.js.map