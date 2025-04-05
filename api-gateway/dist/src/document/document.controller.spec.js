"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const document_controller_1 = require("./document.controller");
const document_service_1 = require("./document.service");
const jwt_guard_1 = require("../auth/jwt.guard");
const roles_guard_1 = require("../users/roles.guard");
const ts_jest_1 = require("@golevelup/ts-jest");
describe('DocumentController', () => {
    let controller;
    let documentService;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [document_controller_1.DocumentController],
            providers: [
                {
                    provide: document_service_1.DocumentService,
                    useValue: {
                        create: jest.fn(),
                        retrieveDocument: jest.fn(),
                        updateDocument: jest.fn(),
                        listDocuments: jest.fn(),
                        deleteDocument: jest.fn(),
                        getUserFromRequest: jest.fn(),
                    },
                },
            ],
        })
            .overrideGuard(jwt_guard_1.JwtAuthGuard)
            .useValue((0, ts_jest_1.createMock)())
            .overrideGuard(roles_guard_1.RolesGuard)
            .useValue((0, ts_jest_1.createMock)())
            .compile();
        controller = module.get(document_controller_1.DocumentController);
        documentService = module.get(document_service_1.DocumentService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('uploadDocument', () => {
        it('should upload a document', async () => {
            const mockFile = { filename: 'test.pdf' };
            const mockUser = { id: 1 };
            documentService.getUserFromRequest = jest
                .fn()
                .mockResolvedValue(mockUser);
            documentService.create = jest.fn().mockResolvedValue({ id: 1 });
            const result = await controller.uploadDocument(mockFile, {
                user: mockUser,
            });
            expect(result).toEqual({
                message: 'Document uploaded successfully',
                document: { id: 1 },
            });
        });
    });
    describe('getDocument', () => {
        it('should retrieve a document', async () => {
            const mockUser = { id: 1 };
            const mockStream = Buffer.from('mock data');
            documentService.getUserFromRequest = jest
                .fn()
                .mockResolvedValue(mockUser);
            documentService.retrieveDocument = jest
                .fn()
                .mockResolvedValue(mockStream);
            const result = await controller.getDocument(1, { user: mockUser });
            expect(result).toBeDefined();
        });
    });
    describe('deleteDocument', () => {
        it('should delete a document', async () => {
            const mockUser = { id: 1 };
            documentService.getUserFromRequest = jest
                .fn()
                .mockResolvedValue(mockUser);
            documentService.deleteDocument = jest.fn().mockResolvedValue(true);
            const result = await controller.deleteDocument(1, {
                user: mockUser,
            });
            expect(result).toEqual({ message: 'Document deleted successfully' });
        });
    });
});
//# sourceMappingURL=document.controller.spec.js.map