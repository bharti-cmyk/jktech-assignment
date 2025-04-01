"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const users_entity_1 = require("../users/users.entity");
const roles_entity_1 = require("../users/roles/roles.entity");
const permission_entity_1 = require("../users/roles/permission.entity");
const role_permission_entity_1 = require("../users/roles/role-permission.entity");
const document_entity_1 = require("../../src/document/document.entity");
const InitTables1741851165843_1 = require("./migrations/InitTables1741851165843");
const typeorm_2 = require("typeorm");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    const dataSource = new typeorm_2.DataSource({
                        type: 'postgres',
                        host: configService.get('DATABASE_HOST'),
                        port: configService.get('DATABASE_PORT'),
                        username: configService.get('DATABASE_USER'),
                        password: configService.get('DATABASE_PASSWORD'),
                        database: configService.get('DATABASE_NAME'),
                        entities: [
                            users_entity_1.UserEntity,
                            roles_entity_1.RoleEntity,
                            permission_entity_1.PermissionEntity,
                            role_permission_entity_1.RolePermissionEntity,
                            document_entity_1.DocumentEntity,
                        ],
                        synchronize: false,
                        migrations: [InitTables1741851165843_1.InitTables1741851165843],
                        migrationsRun: true,
                        logging: true,
                    });
                    await dataSource.initialize();
                    console.log(' Successfully connected to postgre database');
                    return dataSource.options;
                },
            }),
        ],
        exports: [typeorm_1.TypeOrmModule],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map