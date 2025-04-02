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
exports.IngestionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const check_permission_decorator_1 = require("../global/decorators/check-permission.decorator");
const jwt_guard_1 = require("../auth/jwt.guard");
const roles_guard_1 = require("../users/roles.guard");
const role_permission_entity_1 = require("../users/roles/role-permission.entity");
const create_ingestion_dto_1 = require("./dto/create-ingestion.dto");
const ingestion_service_1 = require("./ingestion.service");
let IngestionController = class IngestionController {
    ingestionService;
    constructor(ingestionService) {
        this.ingestionService = ingestionService;
    }
    create(createIngestionDto, req) {
        if (!req.user) {
            throw new Error('User not authenticated');
        }
        const { userId } = req.user;
        return this.ingestionService.addIngestion(createIngestionDto, userId);
    }
    findOne(id) {
        return this.ingestionService.findIngestionById(id);
    }
};
exports.IngestionController = IngestionController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, check_permission_decorator_1.CheckPermissions)((ability) => ability.can(role_permission_entity_1.Action.WRITE, 'Ingestion')),
    (0, swagger_1.ApiOperation)({ summary: 'Create an ingestion record' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Ingestion record created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiBody)({
        schema: {
            example: {
                documentId: 123
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ingestion_dto_1.CreateIngestionDto, Object]),
    __metadata("design:returntype", void 0)
], IngestionController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get an ingestion record by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ingestion record retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Ingestion record not found' }),
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, check_permission_decorator_1.CheckPermissions)((ability) => ability.can(role_permission_entity_1.Action.READ, 'Ingestion')),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], IngestionController.prototype, "findOne", null);
exports.IngestionController = IngestionController = __decorate([
    (0, swagger_1.ApiTags)('Ingestion'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('ingestion'),
    __metadata("design:paramtypes", [ingestion_service_1.IngestionService])
], IngestionController);
//# sourceMappingURL=ingestion.controller.js.map