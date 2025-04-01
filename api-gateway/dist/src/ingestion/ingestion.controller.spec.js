"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_jest_1 = require("@golevelup/ts-jest");
const testing_1 = require("@nestjs/testing");
const ingestion_controller_1 = require("./ingestion.controller");
const ingestion_service_1 = require("./ingestion.service");
const jwt_guard_1 = require("../auth/jwt.guard");
const roles_guard_1 = require("../users/roles.guard");
const core_1 = require("@nestjs/core");
describe('IngestionController', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [ingestion_controller_1.IngestionController],
            providers: [
                core_1.Reflector,
                {
                    provide: ingestion_service_1.IngestionService,
                    useValue: (0, ts_jest_1.createMock)(),
                },
            ],
        })
            .overrideGuard(jwt_guard_1.JwtAuthGuard)
            .useValue((0, ts_jest_1.createMock)())
            .overrideGuard(roles_guard_1.RolesGuard)
            .useValue((0, ts_jest_1.createMock)())
            .compile();
        controller = module.get(ingestion_controller_1.IngestionController);
        service = module.get(ingestion_service_1.IngestionService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('should call create and return ingestion data', async () => {
        const createIngestionDto = {
            documentId: 1,
        };
        const userId = 1;
        jest.spyOn(service, 'addIngestion').mockResolvedValue({
            id: 1,
            ...createIngestionDto,
        });
        const req = { user: { userId } };
        const result = await controller.create(createIngestionDto, req);
        expect(service.addIngestion).toHaveBeenCalledWith(createIngestionDto, userId);
        expect(result).toEqual({ id: 1, ...createIngestionDto });
    });
    it('should call findOne and return ingestion data', async () => {
        const ingestionId = 1;
        const ingestionData = { id: ingestionId, name: 'Test Ingestion' };
        jest
            .spyOn(service, 'findIngestionById')
            .mockResolvedValue(ingestionData);
        const result = await controller.findOne(ingestionId);
        expect(service.findIngestionById).toHaveBeenCalledWith(ingestionId);
        expect(result).toEqual(ingestionData);
    });
});
//# sourceMappingURL=ingestion.controller.spec.js.map