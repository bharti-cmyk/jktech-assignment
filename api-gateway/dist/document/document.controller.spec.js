"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const document_controller_1 = require("./document.controller");
const document_service_1 = require("./document.service");
const jwt_guard_1 = require("../../src/auth/jwt.guard");
const roles_guard_1 = require("../../src/users/roles.guard");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("../users/users.entity");
const roles_entity_1 = require("../users/roles/roles.entity");
const common_1 = require("@nestjs/common");
describe('DocumentController', () => {
    let documentController;
    let documentService;
    const mockDocumentService = {
        uploadDocument: jest.fn(),
        getUserFromRequest: jest.fn(),
        create: jest.fn(),
        retrieveDocument: jest.fn(),
        updateDocument: jest.fn(),
        listDocuments: jest.fn(),
        deleteDocument: jest.fn(),
    };
    const mockUserRepository = {
        findOne: jest.fn(),
    };
    const mockRoleRepository = {
        findOne: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [document_controller_1.DocumentController],
            providers: [
                {
                    provide: document_service_1.DocumentService,
                    useValue: mockDocumentService,
                },
                {
                    provide: (0, typeorm_1.getRepositoryToken)(users_entity_1.UserEntity),
                    useValue: mockUserRepository,
                },
                {
                    provide: (0, typeorm_1.getRepositoryToken)(roles_entity_1.RoleEntity),
                    useValue: mockRoleRepository,
                },
            ],
        })
            .overrideGuard(jwt_guard_1.JwtAuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .overrideGuard(roles_guard_1.RolesGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();
        documentController = module.get(document_controller_1.DocumentController);
        documentService = module.get(document_service_1.DocumentService);
    });
    it('should be defined', () => {
        expect(documentController).toBeDefined();
    });
    describe('uploadDocument', () => {
        it('should upload a document successfully', async () => {
            const mockFile = { fieldname: 'file', originalname: 'document.pdf' };
            const mockUser = {
                id: 1,
                email: 'test@test.com',
                userId: 1,
                iat: Date.now(),
            };
            const createUserDto = { userId: mockUser.id };
            const mockDocument = { id: 1, fileName: 'document.pdf' };
            mockDocumentService.getUserFromRequest.mockResolvedValue(mockUser);
            mockDocumentService.create.mockResolvedValue(mockDocument);
            const mockRequest = {
                user: mockUser,
                cache: jest.fn(),
                credentials: null,
                destination: '',
                headers: {},
                method: 'POST',
                params: {},
                query: {},
                url: '',
                body: {},
                cookies: {},
                ip: '',
                ips: [],
                protocol: '',
                secure: false,
                subdomains: [],
                xhr: false,
                get: jest.fn(),
                accepts: jest.fn(),
                acceptsCharsets: jest.fn(),
                acceptsEncodings: jest.fn(),
                acceptsLanguages: jest.fn(),
                range: jest.fn(),
            };
            const result = await documentController.uploadDocument(mockFile, mockRequest);
            expect(result).toEqual({
                message: 'Document uploaded successfully',
                document: { id: 1 },
            });
            expect(mockDocumentService.create).toHaveBeenCalledWith(mockFile, mockUser);
        });
    });
    describe('getDocument', () => {
        it('should retrieve a document by ID', async () => {
            const mockUser = { id: 1 };
            const mockStream = Buffer.from('document content');
            mockDocumentService.retrieveDocument.mockResolvedValue(mockStream);
            const result = await documentController.getDocument(1, {
                user: mockUser,
            });
            expect(result).toBeInstanceOf(common_1.StreamableFile);
        });
    });
    describe('updateDocument', () => {
        it('should update an existing document', async () => {
            const mockFile = { fieldname: 'file', originalname: 'document.pdf' };
            const mockUser = { id: 1 };
            const mockDocument = { id: 1, fileName: 'document.pdf' };
            mockDocumentService.updateDocument.mockResolvedValue(mockDocument);
            const result = await documentController.updateDocument(1, mockFile, { user: mockUser });
            expect(result).toEqual({ message: 'Document updated successfully' });
            expect(mockDocumentService.updateDocument).toHaveBeenCalledWith(1, mockFile, mockUser);
        });
    });
    describe('listDocuments', () => {
        it('should list all documents', async () => {
            const mockUser = { id: 1 };
            const mockDocuments = [{ id: 1, fileName: 'document.pdf' }];
            mockDocumentService.listDocuments.mockResolvedValue(mockDocuments);
            const result = await documentController.listDocuments({ user: mockUser });
            expect(result).toEqual(mockDocuments);
            expect(mockDocumentService.listDocuments).toHaveBeenCalledWith(mockUser);
        });
    });
    describe('deleteDocument', () => {
        it('should delete a document by ID', async () => {
            const mockUser = { id: 1 };
            mockDocumentService.deleteDocument.mockResolvedValue(undefined);
            const result = await documentController.deleteDocument(1, {
                user: mockUser,
            });
            expect(result).toEqual({ message: 'Document deleted successfully' });
            expect(mockDocumentService.deleteDocument).toHaveBeenCalledWith(1, mockUser);
        });
    });
});
//# sourceMappingURL=document.controller.spec.js.map