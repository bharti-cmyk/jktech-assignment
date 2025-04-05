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
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
let RedisService = class RedisService {
    configService;
    client;
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        this.connect();
    }
    connect() {
        const host = this.configService.get('REDIS_HOST');
        const port = this.configService.get('REDIS_PORT');
        try {
            this.client = new ioredis_1.Redis({ host, port });
            this.client.on('connect', () => {
                console.log(`Connected to Redis Successfully on ${host}:${port}`);
            });
            this.client.on('error', (error) => {
                console.error('Redis connection error:', error);
                throw new Error('Failed to connect to Redis');
            });
        }
        catch (error) {
            console.error('Redis initialization error:', error);
            throw new Error('Redis initialization failed');
        }
    }
    getClient() {
        return this.client;
    }
    async set(key, value, ttl) {
        if (ttl) {
            await this.client.set(key, value, 'EX', ttl);
        }
        else {
            await this.client.set(key, value);
        }
    }
    async get(key) {
        return this.client.get(key);
    }
    async delete(key) {
        await this.client.del(key);
    }
    onModuleDestroy() {
        this.client.quit();
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map