"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const database_module_1 = require("./database/database.module");
const redis_module_1 = require("./database/redis/redis.module");
const upload_config_1 = require("./global/upload/upload.config");
const seed_module_1 = require("./auth/seed/seed.module");
const document_module_1 = require("./document/document.module");
const ingestion_module_1 = require("./ingestion/ingestion.module");
const casl_module_1 = require("./casl/casl.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [upload_config_1.default],
            }),
            auth_module_1.AuthModule,
            redis_module_1.RedisModule,
            database_module_1.DatabaseModule,
            seed_module_1.SeedModule,
            document_module_1.DocumentModule,
            ingestion_module_1.IngestionModule,
            casl_module_1.CaslModule
        ],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map