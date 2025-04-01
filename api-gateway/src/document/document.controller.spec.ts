import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../users/roles.guard';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../users/users.entity';
import { RoleEntity } from '../users/roles/roles.entity';
import { StreamableFile } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('DocumentController', () => {
  let documentController: DocumentController;
  let documentService: DocumentService;

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
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        {
          provide: DocumentService,
          useValue: mockDocumentService,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(RoleEntity),
          useValue: mockRoleRepository,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    documentController = module.get<DocumentController>(DocumentController);
    documentService = module.get<DocumentService>(DocumentService);
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
      } as any;

      const result = await documentController.uploadDocument(
        mockFile as any,
        mockRequest,
      );

      expect(result).toEqual({
        message: 'Document uploaded successfully',
        document: { id: 1 },
      });
      expect(mockDocumentService.create).toHaveBeenCalledWith(
        mockFile,
        mockUser,
      );
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

      expect(result).toBeInstanceOf(StreamableFile);
    });
  });

  describe('updateDocument', () => {
    it('should update an existing document', async () => {
      const mockFile = { fieldname: 'file', originalname: 'document.pdf' };
      const mockUser = { id: 1 };
      const mockDocument = { id: 1, fileName: 'document.pdf' };

      mockDocumentService.updateDocument.mockResolvedValue(mockDocument);

      const result = await documentController.updateDocument(
        1,
        mockFile as any,
        { user: mockUser },
      );

      expect(result).toEqual({ message: 'Document updated successfully' });
      expect(mockDocumentService.updateDocument).toHaveBeenCalledWith(
        1,
        mockFile,
        mockUser,
      );
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
      expect(mockDocumentService.deleteDocument).toHaveBeenCalledWith(
        1,
        mockUser,
      );
    });
  });
});
