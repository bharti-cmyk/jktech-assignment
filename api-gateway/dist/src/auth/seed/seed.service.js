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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const roles_entity_1 = require("../../users/roles/roles.entity");
const permission_entity_1 = require("../../users/roles/permission.entity");
const role_permission_entity_1 = require("../../users/roles/role-permission.entity");
const role_permission_entity_2 = require("../../users/roles/role-permission.entity");
const users_entity_1 = require("../../users/users.entity");
const bcrypt = require("bcryptjs");
let SeedService = class SeedService {
    roleRepo;
    permissionRepo;
    rolePermissionRepo;
    userRepo;
    constructor(roleRepo, permissionRepo, rolePermissionRepo, userRepo) {
        this.roleRepo = roleRepo;
        this.permissionRepo = permissionRepo;
        this.rolePermissionRepo = rolePermissionRepo;
        this.userRepo = userRepo;
    }
    async onModuleInit() {
        await this.seedRoles();
        await this.seedPermissions();
        await this.seedRolePermissions();
        await this.seedAdminUser();
    }
    async seedRoles() {
        const roles = [
            { id: 1, name: 'admin' },
            { id: 2, name: 'editor' },
            { id: 3, name: 'viewer' },
        ];
        for (const role of roles) {
            const exists = await this.roleRepo.findOne({ where: { id: role.id } });
            if (!exists)
                await this.roleRepo.save(role);
        }
    }
    async seedPermissions() {
        const permissions = [
            { name: 'Document', description: 'Manage Documents' },
            { name: 'Ingestion', description: 'Download a document' },
            { name: 'User', description: 'Create a user' },
        ];
        for (const permission of permissions) {
            const exists = await this.permissionRepo.findOne({
                where: { name: permission.name },
            });
            if (!exists)
                await this.permissionRepo.save(permission);
        }
    }
    async seedRolePermissions() {
        const rolePermissions = [
            { accessType: role_permission_entity_2.Action.READ, roleId: 1, permissionId: 1 },
            { accessType: role_permission_entity_2.Action.WRITE, roleId: 1, permissionId: 1 },
            { accessType: role_permission_entity_2.Action.UPDATE, roleId: 1, permissionId: 1 },
            { accessType: role_permission_entity_2.Action.DELETE, roleId: 1, permissionId: 1 },
            { accessType: role_permission_entity_2.Action.READ, roleId: 1, permissionId: 2 },
            { accessType: role_permission_entity_2.Action.WRITE, roleId: 1, permissionId: 2 },
            { accessType: role_permission_entity_2.Action.READ, roleId: 1, permissionId: 3 },
            { accessType: role_permission_entity_2.Action.WRITE, roleId: 1, permissionId: 3 },
            { accessType: role_permission_entity_2.Action.UPDATE, roleId: 1, permissionId: 3 },
            { accessType: role_permission_entity_2.Action.DELETE, roleId: 1, permissionId: 3 },
            { accessType: role_permission_entity_2.Action.READ, roleId: 2, permissionId: 1 },
            { accessType: role_permission_entity_2.Action.WRITE, roleId: 2, permissionId: 1 },
            { accessType: role_permission_entity_2.Action.UPDATE, roleId: 2, permissionId: 1 },
            { accessType: role_permission_entity_2.Action.DELETE, roleId: 2, permissionId: 1 },
            { accessType: role_permission_entity_2.Action.READ, roleId: 3, permissionId: 1 },
        ];
        for (const rolePermission of rolePermissions) {
            const exists = await this.rolePermissionRepo.findOne({
                where: {
                    accessType: rolePermission.accessType,
                    roleId: rolePermission.roleId,
                    permissionId: rolePermission.permissionId,
                },
            });
            if (!exists) {
                await this.rolePermissionRepo.save({
                    accessType: rolePermission.accessType,
                    roleId: rolePermission.roleId,
                    permissionId: rolePermission.permissionId,
                });
            }
        }
    }
    async seedAdminUser() {
        const admin = await this.userRepo.findOne({
            where: { email: 'superadmin@admin.com' },
        });
        if (!admin) {
            const hashedPassword = await bcrypt.hash('Admin@123', 10);
            await this.userRepo.save({
                email: 'superadmin@admin.com',
                roleId: 1,
                firstName: 'Admin',
                lastName: 'Admin',
                passwordHash: hashedPassword,
            });
        }
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(roles_entity_1.RoleEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(permission_entity_1.PermissionEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(role_permission_entity_1.RolePermissionEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(users_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SeedService);
//# sourceMappingURL=seed.service.js.map