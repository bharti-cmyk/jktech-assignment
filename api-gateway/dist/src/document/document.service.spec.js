"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const document_service_1 = require("./document.service");
const typeorm_1 = require("typeorm");
const document_entity_1 = require("./document.entity");
const typeorm_2 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const ability_factory_1 = require("../casl/ability.factory");
const auth_service_1 = require("../auth/auth.service");
const common_1 = require("@nestjs/common");
jest.mock('fs/promises', () => ({
    rm: jest.fn().mockResolvedValue(undefined),
}));
describe('DocumentService', () => {
    let documentService;
    let documentRepository;
    let authService;
    let abilityFactory;
    let configService;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                document_service_1.DocumentService,
                {
                    provide: (0, typeorm_2.getRepositoryToken)(document_entity_1.DocumentEntity),
                    useClass: typeorm_1.Repository,
                },
                {
                    provide: auth_service_1.AuthService,
                    useValue: { findOne: jest.fn() },
                },
                {
                    provide: ability_factory_1.AbilityFactory,
                    useValue: {
                        defineAbility: jest.fn(() => ({ can: jest.fn(() => true) })),
                    },
                },
                {
                    provide: config_1.ConfigService,
                    useValue: { get: jest.fn().mockReturnValue('/uploads') },
                },
            ],
        }).compile();
        documentService = module.get(document_service_1.DocumentService);
        documentRepository = module.get((0, typeorm_2.getRepositoryToken)(document_entity_1.DocumentEntity));
        authService = module.get(auth_service_1.AuthService);
        abilityFactory = module.get(ability_factory_1.AbilityFactory);
        configService = module.get(config_1.ConfigService);
    });
    it('should be defined', () => {
        expect(documentService).toBeDefined();
    });
    describe('getDocumentById', () => {
        it('should return a document if found', async () => {
            const mockDocument = { id: 1, name: 'file.txt' };
            jest.spyOn(documentRepository, 'findOne').mockResolvedValue(mockDocument);
            const result = await documentService.getDocumentById(1, {});
            expect(result).toEqual(mockDocument);
        });
        it('should throw NotFoundException if document does not exist', async () => {
            jest.spyOn(documentRepository, 'findOne').mockResolvedValue(null);
            await expect(documentService.getDocumentById(1, {})).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('deleteDocument', () => {
        it('should delete a document', async () => {
            const mockDocument = { id: 1, name: 'file.txt' };
            jest.spyOn(documentRepository, 'findOne').mockResolvedValue(mockDocument);
            jest.spyOn(documentRepository, 'remove').mockResolvedValue(mockDocument);
            await expect(documentService.deleteDocument(1, {})).resolves.not.toThrow();
            expect(require('fs/promises').rm).toHaveBeenCalledWith('/uploads/file.txt');
        });
        it('should throw NotFoundException if document does not exist', async () => {
            jest.spyOn(documentRepository, 'findOne').mockResolvedValue(null);
            await expect(documentService.deleteDocument(1, {})).rejects.toThrow(common_1.NotFoundException);
        });
    });
});
//# sourceMappingURL=document.service.spec.js.map