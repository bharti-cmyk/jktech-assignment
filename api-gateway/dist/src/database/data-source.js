"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const users_entity_1 = require("../users/users.entity");
const roles_entity_1 = require("../users/roles/roles.entity");
const permission_entity_1 = require("../users/roles/permission.entity");
const role_permission_entity_1 = require("../users/roles/role-permission.entity");
const InitTables1741851165843_1 = require("./migrations/InitTables1741851165843");
require("dotenv/config");
const configService = new config_1.ConfigService();
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: configService.get('DATABASE_HOST', 'localhost'),
    port: configService.get('DATABASE_PORT', 5432),
    username: configService.get('DATABASE_USER', 'postgres'),
    password: configService.get('DATABASE_PASSWORD', 'password'),
    database: configService.get('DATABASE_NAME', 'mydatabase'),
    entities: [users_entity_1.UserEntity, roles_entity_1.RoleEntity, permission_entity_1.PermissionEntity, role_permission_entity_1.RolePermissionEntity],
    migrations: [InitTables1741851165843_1.InitTables1741851165843],
    synchronize: false,
    logging: true,
});
exports.default = AppDataSource;
//# sourceMappingURL=data-source.js.map