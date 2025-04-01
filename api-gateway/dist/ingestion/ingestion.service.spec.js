"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const ingestion_service_1 = require("./ingestion.service");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("../../src/users/users.entity");
const document_entity_1 = require("../../src/document/document.entity");
const rxjs_1 = require("rxjs");
const nestjs_cls_1 = require("nestjs-cls");
describe('IngestionService', () => {
    let service;
    let ingestionClient;
    let userRepository;
    let documentRepository;
    let clsService;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                ingestion_service_1.IngestionService,
                {
                    provide: 'INGESTION_SERVICE',
                    useValue: { send: jest.fn() },
                },
                {
                    provide: (0, typeorm_1.getRepositoryToken)(users_entity_1.UserEntity),
                    useValue: { findOneByOrFail: jest.fn() },
                },
                {
                    provide: (0, typeorm_1.getRepositoryToken)(document_entity_1.DocumentEntity),
                    useValue: { findOneByOrFail: jest.fn() },
                },
                {
                    provide: nestjs_cls_1.ClsService,
                    useValue: { someMethod: jest.fn() },
                },
            ],
        }).compile();
        service = module.get(ingestion_service_1.IngestionService);
        ingestionClient = module.get('INGESTION_SERVICE');
        userRepository = module.get((0, typeorm_1.getRepositoryToken)(users_entity_1.UserEntity));
        documentRepository = module.get((0, typeorm_1.getRepositoryToken)(document_entity_1.DocumentEntity));
        clsService = module.get(nestjs_cls_1.ClsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('addIngestion', () => {
        it('should send add.ingestion event', async () => {
            jest
                .spyOn(ingestionClient, 'send')
                .mockReturnValue((0, rxjs_1.of)({ ingestion: { id: 1 } }));
            const result = await service.addIngestion({ someData: 'test' }, 1);
            expect(result).toEqual({ ingestion: { id: 1 } });
            expect(ingestionClient.send).toHaveBeenCalledWith('add.ingestion', expect.any(Object));
        });
    });
    describe('findIngestionById', () => {
        it('should return ingestion details', async () => {
            const ingestionResponse = {
                ingestion: { id: 1, documentId: 2, userId: 3, status: 'pending' },
            };
            jest
                .spyOn(ingestionClient, 'send')
                .mockReturnValue((0, rxjs_1.of)(ingestionResponse));
            jest
                .spyOn(documentRepository, 'findOneByOrFail')
                .mockResolvedValue({ id: 2, originalName: 'test.doc' });
            jest.spyOn(userRepository, 'findOneByOrFail').mockResolvedValue({
                id: 3,
                firstName: 'John',
                email: 'john@example.com',
            });
            const result = await service.findIngestionById(1);
            expect(result).toEqual({
                id: 1,
                user: { id: 3, name: 'John', email: 'john@example.com' },
                document: { id: 2, name: 'test.doc' },
                status: 'pending',
            });
        });
    });
});
//# sourceMappingURL=ingestion.service.spec.js.map